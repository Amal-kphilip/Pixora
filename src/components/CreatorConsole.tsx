"use client";

import { useState, useEffect } from "react";
import { Sliders, X, Plus, Sparkles, Layers, FileText, Upload, LogIn, LogOut, Loader2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePixora } from "@/context/PixoraContext";
import { useLenis } from "@studio-freight/react-lenis";
import { supabase } from "@/utils/supabaseClient";
import { Session } from "@supabase/supabase-js";

// Client-side image compression using HTML5 Canvas to prevent hitting localStorage 5MB limit
const compressImage = (file: File, maxW = 800, maxH = 800): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxW) {
            height = Math.round((height * maxW) / width);
            width = maxW;
          }
        } else {
          if (height > maxH) {
            width = Math.round((width * maxH) / height);
            height = maxH;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Output compressed JPEG at 0.75 quality (highly optimized file size)
        const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export default function CreatorConsole() {
  const lenis = useLenis();
  const { categories, prompts, addPrompt, addCategory, deletePrompt, deleteCategory } = usePixora();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<"prompt" | "category">("prompt");
  
  // Auth States
  const [session, setSession] = useState<Session | null>(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Keyboard shortcut listener (Ctrl + Alt + C) and Query param check
  useEffect(() => {
    const handleToggle = () => {
      setIsVisible(true);
      setIsOpen(true);
    };

    window.addEventListener("toggle-creator-console", handleToggle);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "c") {
        setIsVisible(true);
        setIsOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    if (window.location.search.includes("creator=true")) {
      setIsVisible(true);
    }

    // Subscribe to Auth state changes
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      window.removeEventListener("toggle-creator-console", handleToggle);
      window.removeEventListener("keydown", handleKeyDown);
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isVisible) {
      setIsOpen(false);
    }
  }, [isVisible]);

  // Stop Lenis background scrolling when Creator Console is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      lenis?.stop();
    } else {
      document.body.style.overflow = "";
      lenis?.start();
    }
    return () => {
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [isOpen, lenis]);

  // Prompt Form States
  const [promptTitle, setPromptTitle] = useState("");
  const [promptCategory, setPromptCategory] = useState("");
  const [promptTool, setPromptTool] = useState<"Midjourney" | "Lightroom" | "Photoshop">("Midjourney");
  const [promptComplexity, setPromptComplexity] = useState<"Basic" | "Advanced" | "Pro">("Advanced");
  const [promptText, setPromptText] = useState("");
  const [promptImage, setPromptImage] = useState("");

  // Category Form States
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [catImage, setCatImage] = useState("");
  const [catBeforeImage, setCatBeforeImage] = useState("");
  const [catAfterImage, setCatAfterImage] = useState("");
  const [catBefore, setCatBefore] = useState("saturate(0.5) contrast(0.9)");
  const [catAfter, setCatAfter] = useState("saturate(1.4) contrast(1.15)");

  // File Upload Helper to Supabase Storage Bucket
  const uploadBase64ToStorage = async (base64Str: string, folder: string): Promise<string> => {
    const response = await fetch(base64Str);
    const blob = await response.blob();
    
    const fileExt = blob.type.split("/")[1] || "jpeg";
    const fileName = `${folder}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error } = await supabase.storage
      .from("pixora-media")
      .upload(filePath, blob, {
        contentType: blob.type,
        cacheControl: "3600",
        upsert: true
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from("pixora-media")
      .getPublicUrl(filePath);

    return publicUrl;
  };

  // Local file changes
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setImageState: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file);
        setImageState(compressedBase64);
      } catch (err) {
        console.error("Image compression failed:", err);
        alert("Failed to compress and load image file.");
      }
    }
  };

  // Auth Login Submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: authPassword
      });
      if (error) throw error;
      setAuthPassword("");
    } catch (err) {
      console.error("Login failed:", err);
      alert("Invalid admin credentials: " + (err as Error).message);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    if (confirm("Are you sure you want to log out of the admin panel?")) {
      await supabase.auth.signOut();
    }
  };

  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptTitle || !promptText || !promptCategory) {
      alert("Please fill in the title, text, and select a category.");
      return;
    }

    setIsSubmitting(true);
    const defaultImg = "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=500&q=80";
    
    try {
      let finalImageUrl = promptImage || defaultImg;
      if (promptImage.startsWith("data:image")) {
        finalImageUrl = await uploadBase64ToStorage(promptImage, "prompts");
      }

      await addPrompt({
        title: promptTitle,
        category: promptCategory,
        tool: promptTool,
        complexity: promptComplexity,
        promptText: promptText,
        image: finalImageUrl
      });

      setPromptTitle("");
      setPromptText("");
      setPromptImage("");
      alert("Prompt added successfully to live database!");
    } catch (err) {
      console.error("Error saving prompt:", err);
      alert("Failed to save prompt: " + (err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName || !catDesc) {
      alert("Please fill in the category name and description.");
      return;
    }

    setIsSubmitting(true);
    const defaultImg = "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?auto=format&fit=crop&w=500&q=80";

    try {
      let finalCoverUrl = catImage;
      let finalBeforeUrl = catBeforeImage;
      let finalAfterUrl = catAfterImage;

      if (catImage.startsWith("data:image")) {
        finalCoverUrl = await uploadBase64ToStorage(catImage, "covers");
      }
      if (catBeforeImage.startsWith("data:image")) {
        finalBeforeUrl = await uploadBase64ToStorage(catBeforeImage, "before");
      }
      if (catAfterImage.startsWith("data:image")) {
        finalAfterUrl = await uploadBase64ToStorage(catAfterImage, "after");
      }

      const catId = catName.toLowerCase().trim().replace(/\s+/g, "-");

      await addCategory({
        id: catId,
        name: catName,
        description: catDesc,
        image: finalCoverUrl || finalAfterUrl || finalBeforeUrl || defaultImg,
        beforeImage: finalBeforeUrl || undefined,
        afterImage: finalAfterUrl || undefined,
        beforeFilter: catBefore,
        afterFilter: catAfter
      });

      setCatName("");
      setCatDesc("");
      setCatImage("");
      setCatBeforeImage("");
      setCatAfterImage("");
      alert("Category added successfully to live database!");
    } catch (err) {
      console.error("Error saving category:", err);
      alert("Failed to save category: " + (err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-[99] flex items-center gap-2 px-5 py-3 rounded-full bg-brand-accent text-brand-bg font-bold text-xs tracking-wider shadow-accent hover:shadow-accent-strong transition-all duration-300 transform hover:scale-[1.03]"
        data-cursor="pointer"
      >
        <Sliders size={14} />
        Creator Studio
      </button>

      {/* Slide-over Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
            />

            {/* Panel container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#0F0F13] border-l border-white/5 p-6 z-[101] flex flex-col justify-between shadow-2xl select-text"
            >
              {/* Authenticated Mode */}
              {session ? (
                <div className="flex flex-col flex-1 min-h-0">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/5 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
                        <Sparkles size={16} />
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-white tracking-wide">
                          Creator Console
                        </h3>
                        <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider mt-0.5">
                          Admin Active 🟢
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleLogout}
                        className="p-1.5 rounded-lg border border-white/5 bg-white/5 text-white/60 hover:text-red-400 transition-colors"
                        title="Sign Out Admin"
                      >
                        <LogOut size={14} />
                      </button>
                      <button
                        onClick={() => setIsOpen(false)}
                        className="p-1.5 rounded-lg border border-white/5 bg-white/5 text-white/60 hover:text-white transition-colors"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-2 my-5 flex-shrink-0">
                    <button
                      onClick={() => setActiveTab("prompt")}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                        activeTab === "prompt"
                          ? "bg-brand-accent text-brand-bg"
                          : "bg-white/5 border border-white/10 text-white/60 hover:text-white"
                      }`}
                    >
                      <FileText size={13} />
                      Add Prompt
                    </button>
                    <button
                      onClick={() => setActiveTab("category")}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                        activeTab === "category"
                          ? "bg-brand-accent text-brand-bg"
                          : "bg-white/5 border border-white/10 text-white/60 hover:text-white"
                      }`}
                    >
                      <Layers size={13} />
                      Add Category
                    </button>
                  </div>

                  {/* Form fields wrapper (Scrollable) */}
                  <div 
                    data-lenis-prevent
                    className="flex-1 overflow-y-auto pr-1 min-h-0 pb-12 space-y-8"
                  >
                    {activeTab === "prompt" ? (
                      /* Prompt tab */
                      <div className="space-y-8">
                        <form onSubmit={handlePromptSubmit} className="space-y-4">
                          {/* Title */}
                          <div className="flex flex-col space-y-1">
                            <label className="text-[10px] font-mono text-white/50">PROMPT TITLE</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Vintage Sunset Kodak"
                              value={promptTitle}
                              onChange={(e) => setPromptTitle(e.target.value)}
                              className="px-4 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-brand-accent/40 text-xs text-white focus:outline-none placeholder-white/20"
                            />
                          </div>

                          {/* Category select */}
                          <div className="flex flex-col space-y-1">
                            <label className="text-[10px] font-mono text-white/50">CATEGORY</label>
                            <select
                              required
                              value={promptCategory}
                              onChange={(e) => setPromptCategory(e.target.value)}
                              className="px-4 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-brand-accent/40 text-xs text-white focus:outline-none"
                            >
                              <option value="" className="bg-[#0F0F13]">Select Category</option>
                              {categories.map((c) => (
                                <option key={c.id} value={c.name} className="bg-[#0F0F13]">
                                  {c.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Tool & Complexity Row */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col space-y-1">
                              <label className="text-[10px] font-mono text-white/50">ENGINE / TOOL</label>
                              <select
                                value={promptTool}
                                onChange={(e) => setPromptTool(e.target.value as "Midjourney" | "Lightroom" | "Photoshop")}
                                className="px-4 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-brand-accent/40 text-xs text-white focus:outline-none"
                              >
                                <option value="Midjourney" className="bg-[#0F0F13]">Midjourney</option>
                                <option value="Lightroom" className="bg-[#0F0F13]">Lightroom</option>
                                <option value="Photoshop" className="bg-[#0F0F13]">Photoshop</option>
                              </select>
                            </div>
                            <div className="flex flex-col space-y-1">
                              <label className="text-[10px] font-mono text-white/50">COMPLEXITY</label>
                              <select
                                value={promptComplexity}
                                onChange={(e) => setPromptComplexity(e.target.value as "Basic" | "Advanced" | "Pro")}
                                className="px-4 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-brand-accent/40 text-xs text-white focus:outline-none"
                              >
                                <option value="Basic" className="bg-[#0F0F13]">Basic</option>
                                <option value="Advanced" className="bg-[#0F0F13]">Advanced</option>
                                <option value="Pro" className="bg-[#0F0F13]">Pro</option>
                              </select>
                            </div>
                          </div>

                          {/* Prompt image (File or URL) */}
                          <div className="flex flex-col space-y-2">
                            <label className="text-[10px] font-mono text-white/50">PROMPT IMAGE</label>
                            <div className="flex items-center gap-3">
                              <input
                                type="file"
                                accept="image/*"
                                id="prompt-img-file"
                                className="hidden"
                                onChange={(e) => handleFileChange(e, setPromptImage)}
                              />
                              <label
                                htmlFor="prompt-img-file"
                                className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold cursor-pointer transition-all duration-300 flex-shrink-0"
                              >
                                <Upload size={13} />
                                Choose File
                              </label>
                              <input
                                type="url"
                                placeholder="Or paste direct image URL"
                                value={promptImage.startsWith("data:") ? "" : promptImage}
                                onChange={(e) => setPromptImage(e.target.value)}
                                className="flex-1 px-4 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-brand-accent/40 text-xs text-white focus:outline-none placeholder-white/20"
                              />
                            </div>
                            {promptImage && (
                              <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/10 mt-1 group">
                                <img src={promptImage} className="w-full h-full object-cover" alt="preview" />
                                <button
                                  type="button"
                                  onClick={() => setPromptImage("")}
                                  className="absolute top-1 right-1 p-0.5 rounded bg-black/70 text-white/60 hover:text-white transition-colors"
                                >
                                  <X size={10} />
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Prompt Text */}
                          <div className="flex flex-col space-y-1">
                            <label className="text-[10px] font-mono text-white/50">AI PROMPT FORMULA</label>
                            <textarea
                              required
                              rows={4}
                              placeholder="e.g. Editorial fashion photography, kodak warm grading..."
                              value={promptText}
                              onChange={(e) => setPromptText(e.target.value)}
                              className="px-4 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-brand-accent/40 text-xs text-white focus:outline-none resize-none placeholder-white/20"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-accent text-brand-bg font-bold text-xs tracking-wider shadow-accent hover:shadow-accent-strong transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                                Uploading & Saving...
                              </>
                            ) : (
                              <>
                                <Plus size={14} /> Add Prompt to Database
                              </>
                            )}
                          </button>
                        </form>

                        {/* Manage Prompts List Section */}
                        <div className="pt-6 border-t border-white/5 space-y-3">
                          <span className="text-[9px] font-mono text-white/30 uppercase tracking-wider block font-bold">
                            Manage Prompts ({prompts.length})
                          </span>
                          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                            {prompts.length === 0 ? (
                              <p className="text-[10px] text-white/35 italic text-center py-4">No prompts in cloud database.</p>
                            ) : (
                              prompts.map((p) => (
                                <div 
                                  key={p.id}
                                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5"
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <img src={p.image} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" alt="preview" />
                                    <div className="min-w-0">
                                      <p className="text-xs font-semibold text-white truncate">{p.title}</p>
                                      <p className="text-[9px] font-mono text-white/30 uppercase truncate">{p.category} • {p.tool} • 📋 {p.copyCount || 0} • ❤️ {p.favoriteCount || 0}</p>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to delete the prompt "${p.title}"?`)) {
                                        deletePrompt(p.id);
                                      }
                                    }}
                                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Category tab */
                      <div className="space-y-8">
                        <form onSubmit={handleCategorySubmit} className="space-y-4">
                          {/* Name */}
                          <div className="flex flex-col space-y-1">
                            <label className="text-[10px] font-mono text-white/50">CATEGORY NAME</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Street Noir"
                              value={catName}
                              onChange={(e) => setCatName(e.target.value)}
                              className="px-4 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-brand-accent/40 text-xs text-white focus:outline-none placeholder-white/20"
                            />
                          </div>

                          {/* Category Cover Image */}
                          <div className="flex flex-col space-y-2">
                            <label className="text-[10px] font-mono text-white/50">COVER IMAGE (OPTIONAL)</label>
                            <div className="flex items-center gap-3">
                              <input
                                type="file"
                                accept="image/*"
                                id="cat-cover-file"
                                className="hidden"
                                onChange={(e) => handleFileChange(e, setCatImage)}
                              />
                              <label
                                htmlFor="cat-cover-file"
                                className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold cursor-pointer transition-all duration-300 flex-shrink-0"
                              >
                                <Upload size={13} />
                                Choose File
                              </label>
                              <input
                                type="url"
                                placeholder="Or paste direct cover URL"
                                value={catImage.startsWith("data:") ? "" : catImage}
                                onChange={(e) => setCatImage(e.target.value)}
                                className="flex-1 px-4 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-brand-accent/40 text-xs text-white focus:outline-none placeholder-white/20"
                              />
                            </div>
                            {catImage && (
                              <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/10 mt-1">
                                <img src={catImage} className="w-full h-full object-cover" alt="preview" />
                                <button
                                  type="button"
                                  onClick={() => setCatImage("")}
                                  className="absolute top-1 right-1 p-0.5 rounded bg-black/70 text-white/60 hover:text-white transition-colors"
                                >
                                  <X size={10} />
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Before / After Images (File or URL) */}
                          <div className="flex flex-col space-y-3">
                            <span className="text-[10px] font-mono text-white/50 tracking-wider">BEFORE / AFTER IMAGE PRESETS</span>
                            
                            <div className="grid grid-cols-1 gap-4">
                              {/* Before Image */}
                              <div className="flex flex-col space-y-2 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                                <label className="text-[9px] font-mono text-white/40">BEFORE IMAGE</label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    id="cat-before-file"
                                    className="hidden"
                                    onChange={(e) => handleFileChange(e, setCatBeforeImage)}
                                  />
                                  <label
                                    htmlFor="cat-before-file"
                                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold cursor-pointer transition-all duration-300 flex-shrink-0"
                                  >
                                    <Upload size={11} />
                                    File
                                  </label>
                                  <input
                                    type="url"
                                    placeholder="Or image URL"
                                    value={catBeforeImage.startsWith("data:") ? "" : catBeforeImage}
                                    onChange={(e) => setCatBeforeImage(e.target.value)}
                                    className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/5 focus:border-brand-accent/40 text-xs text-white focus:outline-none placeholder-white/20"
                                  />
                                </div>
                                {catBeforeImage && (
                                  <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10 mt-1">
                                    <img src={catBeforeImage} className="w-full h-full object-cover" alt="preview" />
                                    <button
                                      type="button"
                                      onClick={() => setCatBeforeImage("")}
                                      className="absolute top-0.5 right-0.5 p-0.5 rounded bg-black/70 text-white/60 hover:text-white transition-colors"
                                    >
                                      <X size={8} />
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* After Image */}
                              <div className="flex flex-col space-y-2 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                                <label className="text-[9px] font-mono text-white/40">AFTER IMAGE</label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    id="cat-after-file"
                                    className="hidden"
                                    onChange={(e) => handleFileChange(e, setCatAfterImage)}
                                  />
                                  <label
                                    htmlFor="cat-after-file"
                                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold cursor-pointer transition-all duration-300 flex-shrink-0"
                                  >
                                    <Upload size={11} />
                                    File
                                  </label>
                                  <input
                                    type="url"
                                    placeholder="Or image URL"
                                    value={catAfterImage.startsWith("data:") ? "" : catAfterImage}
                                    onChange={(e) => setCatAfterImage(e.target.value)}
                                    className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/5 focus:border-brand-accent/40 text-xs text-white focus:outline-none placeholder-white/20"
                                  />
                                </div>
                                {catAfterImage && (
                                  <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10 mt-1">
                                    <img src={catAfterImage} className="w-full h-full object-cover" alt="preview" />
                                    <button
                                      type="button"
                                      onClick={() => setCatAfterImage("")}
                                      className="absolute top-0.5 right-0.5 p-0.5 rounded bg-black/70 text-white/60 hover:text-white transition-colors"
                                    >
                                      <X size={8} />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Before / After Filters */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col space-y-1">
                              <label className="text-[10px] font-mono text-white/50">BEFORE FILTER (CSS)</label>
                              <input
                                type="text"
                                value={catBefore}
                                onChange={(e) => setCatBefore(e.target.value)}
                                className="px-4 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-brand-accent/40 text-xs text-white focus:outline-none font-mono"
                              />
                            </div>
                            <div className="flex flex-col space-y-1">
                              <label className="text-[10px] font-mono text-white/50">AFTER FILTER (CSS)</label>
                              <input
                                type="text"
                                value={catAfter}
                                onChange={(e) => setCatAfter(e.target.value)}
                                className="px-4 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-brand-accent/40 text-xs text-white focus:outline-none font-mono"
                              />
                            </div>
                          </div>

                          {/* Description */}
                          <div className="flex flex-col space-y-1">
                            <label className="text-[10px] font-mono text-white/50">DESCRIPTION</label>
                            <textarea
                              required
                              rows={4}
                              placeholder="Describe the aesthetic grading properties..."
                              value={catDesc}
                              onChange={(e) => setCatDesc(e.target.value)}
                              className="px-4 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-brand-accent/40 text-xs text-white focus:outline-none resize-none placeholder-white/20"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-accent text-brand-bg font-bold text-xs tracking-wider shadow-accent hover:shadow-accent-strong transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                                Uploading & Saving...
                              </>
                            ) : (
                              <>
                                <Plus size={14} /> Add Category to Database
                              </>
                            )}
                          </button>
                        </form>

                        {/* Manage Categories List Section */}
                        <div className="pt-6 border-t border-white/5 space-y-3">
                          <span className="text-[9px] font-mono text-white/30 uppercase tracking-wider block font-bold">
                            Manage Categories ({categories.length})
                          </span>
                          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                            {categories.length === 0 ? (
                              <p className="text-[10px] text-white/35 italic text-center py-4">No categories in cloud database.</p>
                            ) : (
                              categories.map((c) => (
                                <div 
                                  key={c.id}
                                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5"
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <img src={c.image} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" alt="preview" />
                                    <div className="min-w-0">
                                      <p className="text-xs font-semibold text-white truncate">{c.name}</p>
                                      <p className="text-[9px] font-mono text-white/30 uppercase truncate">{c.description}</p>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (confirm(`WARNING: Deleting the category "${c.name}" will also delete all prompts belonging to it. Proceed?`)) {
                                        deleteCategory(c.id);
                                      }
                                    }}
                                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Unauthenticated Login Screen */
                <div className="flex flex-col flex-1 justify-center py-8">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent mx-auto mb-4 shadow-accent">
                      <Sparkles size={22} className="animate-pulse" />
                    </div>
                    <h3 className="text-lg font-display font-bold text-white leading-tight">
                      Admin Portal Locked
                    </h3>
                    <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider mt-1.5">
                      Log in to access CMS controls
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] font-mono text-white/50">EMAIL ADDRESS</label>
                      <input
                        type="email"
                        required
                        placeholder="admin@pixora.com"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        className="px-4 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-brand-accent/40 text-xs text-white focus:outline-none placeholder-white/20"
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] font-mono text-white/50">PASSWORD</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        className="px-4 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-brand-accent/40 text-xs text-white focus:outline-none placeholder-white/20"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isAuthLoading}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-accent text-brand-bg font-bold text-xs tracking-wider shadow-accent hover:shadow-accent-strong transition-all duration-300 disabled:opacity-50"
                    >
                      {isAuthLoading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                          Logging in...
                        </>
                      ) : (
                        <>
                          <LogIn size={13} />
                          Log In Admin
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
