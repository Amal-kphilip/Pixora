"use client";

import { useState } from "react";
import { Check, Copy, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePixora } from "@/context/PixoraContext";

export default function PromptLibrary() {
  const { prompts, categories } = usePixora();
  const [activeFilter, setActiveFilter] = useState("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Dynamically generate filter categories based on actual database contents
  const filters = ["All", ...categories.map(c => c.name)];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
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

  const filteredLibrary = activeFilter === "All"
    ? prompts
    : prompts.filter(card => card.category.toLowerCase() === activeFilter.toLowerCase());

  return (
    <section id="library" className="py-24 bg-[#070709] relative z-10 select-none border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
          <h2 className="text-sm font-semibold tracking-wider uppercase text-brand-accent">
            Prompt Database
          </h2>
          <p className="text-4xl md:text-5xl font-display font-black tracking-tight text-white">
            Explore the variables.
          </p>
          <p className="text-brand-muted max-w-md text-sm md:text-base leading-relaxed">
            Filter by camera tool, copy the core syntax structure, and drop them directly into your editor of choice.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-16 max-w-3xl mx-auto">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`relative px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 transform active:scale-95 ${
                activeFilter === filter
                  ? "bg-brand-accent text-brand-bg shadow-accent"
                  : "bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20"
              }`}
              data-cursor="pointer"
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Grid layout */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredLibrary.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full py-16 text-center text-white/40 italic text-sm"
              >
                No prompts added in this filter group. Open Creator Studio at the bottom left to add some!
              </motion.div>
            ) : (
              filteredLibrary.map((card) => {
                const isCopied = copiedId === card.id;
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    key={card.id}
                    className="group rounded-3xl overflow-hidden glass p-4 flex flex-col justify-between min-h-[380px] border border-white/5 hover:border-brand-accent/20 transition-all duration-300 shadow-xl"
                  >
                    {/* Visual Card image */}
                    <div className="relative w-full h-[180px] rounded-2xl overflow-hidden mb-5 bg-[#0E0E12]">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-expo-out"
                      />
                      {/* Tags overlay */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold tracking-wider text-brand-accent border border-brand-accent/20 flex items-center gap-1">
                          <Tag size={10} />
                          {card.category.toUpperCase()}
                        </span>
                        <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold tracking-wider text-white border border-white/10">
                          {card.complexity.toUpperCase()}
                        </span>
                      </div>

                      {/* Tool tag */}
                      <span className="absolute bottom-3 left-3 bg-brand-bg/80 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-bold text-white tracking-wide border border-white/5">
                        {card.tool}
                      </span>
                    </div>

                    {/* Metadata text */}
                    <div className="flex-1 flex flex-col justify-between px-1">
                      <div className="space-y-3">
                        <h4 className="text-md font-bold text-white group-hover:text-brand-accent transition-colors duration-300">
                          {card.title}
                        </h4>
                        
                        {/* Prompt formula box */}
                        <div className="bg-black/40 border border-white/5 rounded-xl p-3 text-[11px] font-mono leading-relaxed select-text text-white/70 max-h-[80px] overflow-y-auto no-scrollbar shadow-inner">
                          {highlightPrompt(card.promptText)}
                        </div>
                      </div>

                      {/* Copy Action button */}
                      <button
                        onClick={() => handleCopy(card.id, card.promptText)}
                        className={`w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 transform active:scale-95 ${
                          isCopied
                            ? "bg-green-500/10 border border-green-500/20 text-green-400"
                            : "bg-white/5 border border-white/10 text-white hover:bg-brand-accent hover:text-brand-bg hover:border-brand-accent hover:shadow-accent"
                        }`}
                        data-cursor="pointer"
                      >
                        {isCopied ? (
                          <>
                            <Check size={14} className="animate-pulse" />
                            Copied to Clipboard
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            Copy AI Formula
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
