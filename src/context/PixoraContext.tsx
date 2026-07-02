"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CategoryItem, PromptItem, DEFAULT_CATEGORIES, DEFAULT_PROMPTS } from "@/data/defaultData";
import { supabase } from "@/utils/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface PixoraContextType {
  categories: CategoryItem[];
  prompts: PromptItem[];
  isLoaded: boolean;
  addPrompt: (prompt: Omit<PromptItem, "id">) => Promise<void>;
  addCategory: (category: Omit<CategoryItem, "prompts">) => Promise<void>;
  deletePrompt: (id: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  incrementCopyCount: (id: string) => Promise<void>;
  updateFavoriteCount: (id: string, isAdded: boolean) => Promise<void>;
  showToast: (message: string) => void;
  resetData: () => Promise<void>;
  refreshDatabase: () => Promise<void>;
}

const PixoraContext = createContext<PixoraContextType | undefined>(undefined);

export function PixoraProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastTimer, setToastTimer] = useState<NodeJS.Timeout | null>(null);

  const showToast = (message: string) => {
    if (toastTimer) clearTimeout(toastTimer);
    setToastMessage(message);
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 2500);
    setToastTimer(timer);
  };

  // Load data from Supabase, fallback to defaults if database is not configured/empty
  const loadData = async () => {
    try {
      // 1. Fetch Categories from Supabase
      const { data: catData, error: catError } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: true });

      // 2. Fetch Prompts from Supabase
      const { data: promptData, error: promptError } = await supabase
        .from("prompts")
        .select("*")
        .order("created_at", { ascending: false });

      if (catError || promptError) {
        console.error("Supabase load error, falling back to defaults:", catError, promptError);
        setCategories(DEFAULT_CATEGORIES);
        setPrompts(DEFAULT_PROMPTS);
      } else {
        // If database runs successfully but has no categories, display defaults
        if (!catData || catData.length === 0) {
          setCategories(DEFAULT_CATEGORIES);
          setPrompts(DEFAULT_PROMPTS);
        } else {
          // Map database snake_case fields to CategoryItem interface
          const mappedCats: CategoryItem[] = catData.map((c) => ({
            id: c.id,
            name: c.name,
            description: c.description,
            image: c.image,
            beforeImage: c.before_image || undefined,
            afterImage: c.after_image || undefined,
            beforeFilter: c.before_filter,
            afterFilter: c.after_filter,
            prompts: [] // Filled dynamically below
          }));

          // Map database prompts to PromptItem interface
          const mappedPrompts: PromptItem[] = (promptData || []).map((p) => ({
            id: p.id,
            title: p.title,
            category: p.category,
            tool: p.tool as "Midjourney" | "Lightroom" | "Photoshop",
            promptText: p.prompt_text,
            image: p.image,
            complexity: p.complexity as "Basic" | "Advanced" | "Pro",
            copyCount: p.copy_count || 0,
            favoriteCount: p.favorite_count || 0
          }));

          // Nest prompt lists into their parent category items (needed for FeatureGrid modals)
          mappedCats.forEach((cat) => {
            cat.prompts = mappedPrompts
              .filter((p) => p.category.toLowerCase() === cat.name.toLowerCase())
              .map((p) => ({ title: p.title, text: p.promptText }));
          });

          setCategories(mappedCats);
          setPrompts(mappedPrompts);
        }
      }
    } catch (err) {
      console.error("Failed to load Supabase database, using fallback defaults:", err);
      setCategories(DEFAULT_CATEGORIES);
      setPrompts(DEFAULT_PROMPTS);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addPrompt = async (newPrompt: Omit<PromptItem, "id">) => {
    try {
      const { error } = await supabase
        .from("prompts")
        .insert([{
          title: newPrompt.title,
          category: newPrompt.category,
          tool: newPrompt.tool,
          prompt_text: newPrompt.promptText,
          image: newPrompt.image,
          complexity: newPrompt.complexity
        }]);

      if (error) throw error;
      showToast("Prompt added successfully!");
      await loadData();
    } catch (err) {
      console.error("Failed to insert prompt to Supabase:", err);
      alert("Failed to insert prompt to live database: " + (err as Error).message);
    }
  };

  const addCategory = async (newCat: Omit<CategoryItem, "prompts">) => {
    try {
      const { error } = await supabase
        .from("categories")
        .insert([{
          id: newCat.id.toLowerCase().trim().replace(/\s+/g, "-"),
          name: newCat.name,
          description: newCat.description,
          image: newCat.image,
          before_image: newCat.beforeImage || null,
          after_image: newCat.afterImage || null,
          before_filter: newCat.beforeFilter,
          after_filter: newCat.afterFilter
        }]);

      if (error) throw error;
      showToast("Category added successfully!");
      await loadData();
    } catch (err) {
      console.error("Failed to insert category to Supabase:", err);
      alert("Failed to insert category to live database: " + (err as Error).message);
    }
  };

  const deletePrompt = async (id: string) => {
    try {
      const { error } = await supabase
        .from("prompts")
        .delete()
        .eq("id", id);

      if (error) throw error;
      showToast("Prompt deleted!");
      await loadData();
    } catch (err) {
      console.error("Failed to delete prompt from Supabase:", err);
      alert("Failed to delete prompt: " + (err as Error).message);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const targetCat = categories.find((c) => c.id === id);
      if (targetCat) {
        await supabase
          .from("prompts")
          .delete()
          .eq("category", targetCat.name);
      }

      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

      if (error) throw error;
      showToast("Category deleted!");
      await loadData();
    } catch (err) {
      console.error("Failed to delete category from Supabase:", err);
      alert("Failed to delete category: " + (err as Error).message);
    }
  };

  const incrementCopyCount = async (id: string) => {
    try {
      const target = prompts.find(p => p.id === id);
      if (target) {
        const nextCount = (target.copyCount || 0) + 1;
        
        // Optimistically update local state so UI updates instantly
        setPrompts(prev => prev.map(p => p.id === id ? { ...p, copyCount: nextCount } : p));

        // Save to Supabase
        await supabase
          .from("prompts")
          .update({ copy_count: nextCount })
          .eq("id", id);
      }
    } catch (err) {
      console.error("Failed to increment copy count:", err);
    }
  };

  const updateFavoriteCount = async (id: string, isAdded: boolean) => {
    try {
      const target = prompts.find(p => p.id === id);
      if (target) {
        const currentCount = target.favoriteCount || 0;
        const nextCount = isAdded ? currentCount + 1 : Math.max(0, currentCount - 1);

        // Optimistically update local state so UI updates instantly
        setPrompts(prev => prev.map(p => p.id === id ? { ...p, favoriteCount: nextCount } : p));

        // Save to Supabase
        await supabase
          .from("prompts")
          .update({ favorite_count: nextCount })
          .eq("id", id);
      }
    } catch (err) {
      console.error("Failed to update favorite count:", err);
    }
  };

  const resetData = async () => {
    try {
      if (confirm("WARNING: This will completely delete all custom records from your Supabase cloud database and reset it to stock default templates. Continue?")) {
        // Clear prompts
        const { error: pDelErr } = await supabase.from("prompts").delete().neq("title", "");
        // Clear categories
        const { error: cDelErr } = await supabase.from("categories").delete().neq("name", "");

        if (pDelErr || cDelErr) throw new Error("Failed to delete existing database tables.");

        // Reseed categories
        for (const cat of DEFAULT_CATEGORIES) {
          await supabase.from("categories").insert([{
            id: cat.id,
            name: cat.name,
            description: cat.description,
            image: cat.image,
            before_image: cat.beforeImage || null,
            after_image: cat.afterImage || null,
            before_filter: cat.beforeFilter,
            after_filter: cat.afterFilter
          }]);
        }

        // Reseed prompts
        for (const prompt of DEFAULT_PROMPTS) {
          await supabase.from("prompts").insert([{
            title: prompt.title,
            category: prompt.category,
            tool: prompt.tool,
            prompt_text: prompt.promptText,
            image: prompt.image,
            complexity: prompt.complexity
          }]);
        }

        showToast("Database successfully re-seeded!");
        await loadData();
      }
    } catch (err) {
      console.error("Database reset error:", err);
      alert("Error resetting database: " + (err as Error).message);
    }
  };

  return (
    <PixoraContext.Provider
      value={{
        categories: isLoaded ? categories : [],
        prompts: isLoaded ? prompts : [],
        isLoaded,
        addPrompt,
        addCategory,
        deletePrompt,
        deleteCategory,
        incrementCopyCount,
        updateFavoriteCount,
        showToast,
        resetData,
        refreshDatabase: loadData
      }}
    >
      {children}

      {/* Global Slide-up Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 40, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 15, x: "-50%" }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="fixed bottom-8 left-1/2 z-[100000] flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#0F0F13]/95 border border-brand-accent/30 text-white shadow-accent backdrop-blur-md max-w-sm w-[90%] text-xs font-mono select-none"
          >
            <Sparkles size={14} className="text-brand-accent flex-shrink-0 animate-pulse" />
            <span className="flex-1 truncate">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </PixoraContext.Provider>
  );
}

export default PixoraContext;

export function usePixora() {
  const context = useContext(PixoraContext);
  if (context === undefined) {
    throw new Error("usePixora must be used within a PixoraProvider");
  }
  return context;
}
