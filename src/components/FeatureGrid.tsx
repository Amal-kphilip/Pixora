"use client";

import React, { useState, useEffect } from "react";
import { ArrowUpRight, Lock, X, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis } from "@studio-freight/react-lenis";
import { usePixora } from "@/context/PixoraContext";
import Image from "next/image";
import { CategoryItem } from "@/data/defaultData";

export default function FeatureGrid() {
  const lenis = useLenis();
  const { categories } = usePixora();
  
  // Modal States
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);
  const [unlockedCategories, setUnlockedCategories] = useState<Record<string, boolean>>({});
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Disable background scrolling when modal is open
  useEffect(() => {
    if (selectedCategory) {
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
  }, [selectedCategory, lenis]);

  // Load follow status on mount to avoid asking every time
  useEffect(() => {
    const isFollowed = localStorage.getItem("pixora_instagram_followed") === "true";
    if (isFollowed) {
      const unlocked: Record<string, boolean> = {};
      categories.forEach((c) => {
        unlocked[c.id] = true;
      });
      setUnlockedCategories(unlocked);
    }
  }, [categories]);

  const handleCardClick = (cat: CategoryItem) => {
    setSelectedCategory(cat);
  };

  const handleUnlockClick = () => {
    if (!selectedCategory) return;
    window.open("https://www.instagram.com/amalkp29/", "_blank");
    setIsVerifying(true);
    setTimeout(() => {
      // Save follow status
      localStorage.setItem("pixora_instagram_followed", "true");
      
      // Unlock all categories!
      const unlocked: Record<string, boolean> = {};
      categories.forEach((c) => {
        unlocked[c.id] = true;
      });
      setUnlockedCategories(unlocked);
      setIsVerifying(false);
    }, 1500);
  };

  const handleCopyPrompt = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Highlights parameter flags like --ar, --v, --style dynamically in the prompt text
  const highlightPrompt = (text: string) => {
    return text.split(" ").map((word, i) => {
      if (word.startsWith("--")) {
        return (
          <span key={i} className="text-brand-accent font-bold font-mono">
            {word}{" "}
          </span>
        );
      }
      return <span key={i} className="text-white/80">{word} </span>;
    });
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const
      }
    }
  };

  return (
    <section id="categories" className="py-24 bg-brand-bg relative z-10 select-none">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-4 md:space-y-0">
          <div>
            <h2 className="text-sm font-semibold tracking-wider uppercase text-brand-accent mb-3">
              Prompts Categories
            </h2>
            <p className="text-3xl md:text-5xl font-display font-black tracking-tight text-white leading-tight">
              Every look, one prompt away.
            </p>
          </div>
          <p className="text-brand-muted max-w-sm text-sm md:text-base leading-relaxed">
            Copy prompt structures specifically engineered to instruct AI systems. Click any card to unlock the detailed formula.
          </p>
        </div>

        {/* Feature Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {categories.map((cat) => {
            const isToggled = false;
            return (
              <motion.div
                key={cat.id}
                variants={cardVariants}
                onClick={() => handleCardClick(cat)}
                className="group relative rounded-3xl overflow-hidden glass p-4 flex flex-col justify-between min-h-[420px] transition-all duration-300 hover:border-brand-accent/20 cursor-pointer"
              >
                {/* Before/After Image Wrap */}
                <div className="relative w-full h-[220px] rounded-2xl overflow-hidden mb-6 bg-[#0E0E12]">
                  {/* Base Original (Before) Image */}
                  <Image
                    src={cat.beforeImage || cat.image}
                    alt={`${cat.name} Before`}
                    style={{ filter: cat.beforeFilter }}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className={`object-cover transition-all duration-700 ease-expo-out ${
                      isToggled
                        ? "opacity-0 scale-95"
                        : "group-hover:opacity-0 group-hover:scale-95"
                    }`}
                  />
                  {/* Graded (After) Image overlay */}
                  <Image
                    src={cat.afterImage || cat.image}
                    alt={`${cat.name} After`}
                    style={{ filter: cat.afterFilter }}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className={`object-cover transition-all duration-700 ease-expo-out ${
                      isToggled
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-105 group-hover:opacity-100 group-hover:scale-100"
                    }`}
                  />

                  {/* Before / After Badges */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <span className="relative h-6 w-14 overflow-hidden">
                      {/* BEFORE badge, hidden on group-hover */}
                      <span className="absolute inset-0 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold tracking-wider text-white transition-all duration-300 opacity-100 group-hover:opacity-0 group-hover:scale-90 flex items-center justify-center">
                        BEFORE
                      </span>
                      {/* AFTER badge, absolute, visible on group-hover */}
                      <span className="absolute inset-0 bg-brand-accent text-brand-bg px-2.5 py-1 rounded-lg text-[10px] font-mono font-black tracking-wider transition-all duration-300 opacity-0 scale-110 group-hover:opacity-100 group-hover:scale-100 flex items-center justify-center">
                        AFTER
                      </span>
                    </span>
                    <span className="bg-brand-accent/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold tracking-wider text-brand-bg group-hover:bg-white group-hover:text-black transition-colors duration-300">
                      HOVER TO GRADE
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between px-1">
                  <div>
                    <h3 className="text-xl font-display font-bold text-white group-hover:text-brand-accent transition-colors duration-300 flex items-center justify-between">
                      {cat.name}
                      <ArrowUpRight
                        size={18}
                        className="text-white/30 group-hover:text-brand-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                      />
                    </h3>
                    <p className="text-brand-muted text-sm mt-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
                    <span className="font-mono">PROMPTS: {cat.prompts.length}</span>
                    <span className="text-brand-accent group-hover:underline flex items-center gap-1">
                      <Lock size={10} /> View formulas
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Prompts Locker Modal */}
      <AnimatePresence>
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4"
          >
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative max-w-xl w-full max-h-[85vh] flex flex-col glass rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl overflow-hidden"
            >
              {/* Top Close Bar - Always visible, inline, and never overlapping */}
              <div className="flex justify-end mb-2 flex-shrink-0 z-20">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="p-2 rounded-xl border border-white/5 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close modal"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Locked Screen */}
              {!unlockedCategories[selectedCategory.id] ? (
                <div className="flex flex-col items-center text-center py-6 overflow-y-auto no-scrollbar">
                  <div className="w-16 h-16 rounded-2xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent mb-6 shadow-accent">
                    <Lock size={28} />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-2">
                    Unlock Prompt Formulas
                  </h3>
                  <p className="text-brand-muted text-sm max-w-sm mb-8 leading-relaxed">
                    Follow @amalkp29 on Instagram to unlock the detailed prompt variables for <span className="text-white font-semibold">{selectedCategory.name}</span>.
                  </p>

                  <button
                    onClick={handleUnlockClick}
                    disabled={isVerifying}
                    className="group flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-brand-accent text-brand-bg font-bold tracking-wide shadow-accent hover:shadow-accent-strong transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {isVerifying ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-brand-bg border-t-transparent animate-spin mr-1" />
                        Verifying follow...
                      </>
                    ) : (
                      <>
                        <svg className="w-[18px] h-[18px] stroke-current fill-none mr-1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                        </svg>
                        Follow @amalkp29 on Instagram
                      </>
                    )}
                  </button>

                  <p className="text-[10px] font-mono text-white/30 mt-4">
                    UNLOCK DETECTS PROFILE VISITATION AND FOLLOW ACTION.
                  </p>
                </div>
              ) : (
                /* Unlocked Prompts List Screen - Now highly styled & premium */
                <div className="flex flex-col h-full overflow-hidden">
                  {/* Modal Header */}
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5 flex-shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent shadow-accent">
                      <svg className="w-[18px] h-[18px] stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
                      </svg>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-brand-accent uppercase tracking-wider block font-bold">
                        Aesthetics Unlocked 🔓
                      </span>
                      <h3 className="text-lg font-display font-bold text-white">
                        {selectedCategory.name} Prompts
                      </h3>
                    </div>
                  </div>

                  {/* Prompts list (Scrollable area) */}
                  <div 
                    data-lenis-prevent
                    className="flex-1 flex flex-col space-y-6 overflow-y-auto pr-1 min-h-0 pb-4"
                  >
                    {selectedCategory.prompts.length === 0 ? (
                      <p className="text-xs text-white/50 italic text-center py-8">
                        No prompts added in this category yet. Use the Creator Studio to add prompts.
                      </p>
                    ) : (
                      selectedCategory.prompts.map((prompt, idx) => {
                        const isCopied = copiedIndex === idx;
                        return (
                          <div
                            key={idx}
                            className="relative p-5 rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/5 hover:border-brand-accent/20 transition-all duration-300 flex flex-col space-y-4 shadow-lg group/item"
                          >
                            {/* Card header with green dot indicator */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                                <span className="text-xs font-bold text-white/90 font-display">
                                  {prompt.title}
                                </span>
                              </div>
                              <span className="text-[9px] font-mono font-semibold text-white/35 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                FORMULA #{idx + 1}
                              </span>
                            </div>

                            {/* Dynamic syntax-colored prompt text container */}
                            <div className="relative bg-black/60 rounded-xl p-4 border border-white/10 text-xs font-mono leading-relaxed select-text break-words shadow-inner">
                              {highlightPrompt(prompt.text)}
                            </div>

                            {/* Action footer */}
                            <div className="flex justify-between items-center pt-2">
                              <span className="text-[9px] font-mono text-white/30">COPY & USE IN YOUR GENERATOR</span>
                              <button
                                onClick={() => handleCopyPrompt(prompt.text, idx)}
                                className={`flex items-center gap-1.5 px-4.5 py-2 rounded-xl text-[10px] font-bold tracking-wide transition-all duration-300 transform active:scale-95 ${
                                  isCopied
                                    ? "bg-green-500/10 border border-green-500/20 text-green-400"
                                    : "bg-white/5 border border-white/10 text-white hover:bg-brand-accent hover:text-brand-bg hover:border-brand-accent hover:shadow-accent"
                                }`}
                              >
                                {isCopied ? (
                                  <>
                                    <Check size={12} className="animate-pulse" />
                                    Prompt Copied!
                                  </>
                                ) : (
                                  <>
                                    <Copy size={12} />
                                    Copy Formula
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Modal Footer */}
                  <p className="text-[10px] font-mono text-white/30 text-center mt-6 pt-4 border-t border-white/5 flex-shrink-0">
                    PROMPTS OPTIMIZED FOR MIDJOURNEY V6 AND LIGHTROOM AI.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
