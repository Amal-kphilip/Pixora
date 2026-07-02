"use client";

import { useState, useEffect } from "react";
import { Check, Copy, Tag, Search, Heart, X, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePixora } from "@/context/PixoraContext";
import { useLenis } from "@studio-freight/react-lenis";
import Image from "next/image";

export default function PromptLibrary() {
  const lenis = useLenis();
  const { prompts, categories, incrementCopyCount, updateFavoriteCount, showToast } = usePixora();
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeToolFilter, setActiveToolFilter] = useState("All");
  const [activeComplexityFilter, setActiveComplexityFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Favorites state persisted in localStorage
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isFavTrayOpen, setIsFavTrayOpen] = useState(false);

  useEffect(() => {
    const savedFavs = localStorage.getItem("pixora-favorites");
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (err) {
        console.error("Failed to parse favorites:", err);
      }
    }
  }, []);

  // Sync scroll lock when Favorites Tray is open
  useEffect(() => {
    if (isFavTrayOpen) {
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
  }, [isFavTrayOpen, lenis]);

  // Dynamically generate category filter lists based on database contents
  const categoriesList = ["All", ...categories.map(c => c.name)];
  const toolsList = ["All", "Midjourney", "Lightroom", "Photoshop"];
  const complexitiesList = ["All", "Basic", "Advanced", "Pro"];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    incrementCopyCount(id); // Increment copy analytics in Supabase
    showToast("AI formula copied to clipboard!");
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const toggleFavorite = (id: string) => {
    const isFaved = favorites.includes(id);
    let nextFavs;
    if (isFaved) {
      nextFavs = favorites.filter(favId => favId !== id);
      showToast("Removed from Saved collection");
    } else {
      nextFavs = [...favorites, id];
      showToast("Added to Saved collection");
    }
    setFavorites(nextFavs);
    localStorage.setItem("pixora-favorites", JSON.stringify(nextFavs));
    updateFavoriteCount(id, !isFaved); // Update database analytics in Supabase
  };

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

  // Filter computation logic (Search Query + Category + Tool + Complexity)
  const filteredLibrary = prompts.filter((card) => {
    const matchesCategory = activeFilter === "All" || card.category.toLowerCase() === activeFilter.toLowerCase();
    const matchesTool = activeToolFilter === "All" || card.tool.toLowerCase() === activeToolFilter.toLowerCase();
    const matchesComplexity = activeComplexityFilter === "All" || card.complexity.toLowerCase() === activeComplexityFilter.toLowerCase();
    
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      card.title.toLowerCase().includes(query) ||
      card.promptText.toLowerCase().includes(query) ||
      card.category.toLowerCase().includes(query) ||
      card.tool.toLowerCase().includes(query) ||
      card.complexity.toLowerCase().includes(query);

    return matchesCategory && matchesTool && matchesComplexity && matchesSearch;
  });

  // Get current bookmarked prompt items
  const bookmarkedItems = prompts.filter(p => favorites.includes(p.id));

  return (
    <section id="library" className="py-24 bg-[#070709] relative z-10 select-none border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
          <h2 className="text-sm font-semibold tracking-wider uppercase text-brand-accent">
            Prompt Database
          </h2>
          <p className="text-3xl md:text-5xl font-display font-black tracking-tight text-white">
            Explore the variables.
          </p>
          <p className="text-brand-muted max-w-md text-sm md:text-base leading-relaxed">
            Search prompt formulas, filter by tool or category, and drop them directly into your creative pipeline.
          </p>
        </div>

        {/* CMS Search & Filters Panel */}
        <div className="glass p-6 md:p-8 rounded-3xl mb-12 border border-white/5 space-y-6 max-w-4xl mx-auto shadow-2xl">
          {/* Instant Search Bar */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-white/30 pointer-events-none">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search by keyword, tool, category, or formula parameters (e.g. cinematic)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-black/40 border border-white/5 focus:border-brand-accent/40 text-sm text-white focus:outline-none placeholder-white/20 transition-all duration-300 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/35 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filters Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-white/35 uppercase tracking-wider block font-bold">Category</label>
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/5 focus:border-brand-accent/40 text-xs text-white/80 focus:outline-none"
              >
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#0F0F13]">{cat}</option>
                ))}
              </select>
            </div>

            {/* Engine Tool Filter */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-white/35 uppercase tracking-wider block font-bold">Engine / Tool</label>
              <select
                value={activeToolFilter}
                onChange={(e) => setActiveToolFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/5 focus:border-brand-accent/40 text-xs text-white/80 focus:outline-none"
              >
                {toolsList.map((tool) => (
                  <option key={tool} value={tool} className="bg-[#0F0F13]">
                    {tool === "All" ? "All Tools" : tool}
                  </option>
                ))}
              </select>
            </div>

            {/* Complexity Filter */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-white/35 uppercase tracking-wider block font-bold">Difficulty</label>
              <select
                value={activeComplexityFilter}
                onChange={(e) => setActiveComplexityFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/5 focus:border-brand-accent/40 text-xs text-white/80 focus:outline-none"
              >
                {complexitiesList.map((comp) => (
                  <option key={comp} value={comp} className="bg-[#0F0F13]">
                    {comp === "All" ? "All Complexities" : comp}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Grid display */}
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
                className="col-span-full py-20 text-center text-white/30 italic text-xs space-y-2"
              >
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                  <Search size={16} className="text-white/40" />
                </div>
                <p>No prompt matches your filter criteria.</p>
                <p className="text-[10px] font-mono text-white/20">Try clearing your search query or adjusting your filters.</p>
              </motion.div>
            ) : (
              filteredLibrary.map((card) => {
                const isCopied = copiedId === card.id;
                const isFaved = favorites.includes(card.id);

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    key={card.id}
                    className="group rounded-3xl overflow-hidden glass p-4 flex flex-col justify-between min-h-[390px] border border-white/5 hover:border-brand-accent/20 transition-all duration-300 shadow-xl"
                  >
                    {/* Visual Card image */}
                    <div className="relative w-full h-[180px] rounded-2xl overflow-hidden mb-5 bg-[#0E0E12]">
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-expo-out"
                      />
                      
                      {/* Tags overlay */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold tracking-wider text-brand-accent border border-brand-accent/20 flex items-center gap-1">
                          <Tag size={10} />
                          {card.category.toUpperCase()}
                        </span>
                        <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold tracking-wider text-white border border-white/10">
                          {card.complexity.toUpperCase()}
                        </span>
                      </div>

                      {/* Favorite Button Toggle */}
                      <button
                        onClick={() => toggleFavorite(card.id)}
                        className={`absolute top-3 right-3 z-20 p-2 rounded-xl backdrop-blur-md border transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                          isFaved 
                            ? "bg-brand-accent/20 border-brand-accent/30 text-brand-accent shadow-accent" 
                            : "bg-black/40 border-white/10 text-white/50 hover:text-white"
                        }`}
                        title={isFaved ? "Remove from Favorites" : "Add to Favorites"}
                      >
                        <Heart size={13} className={isFaved ? "fill-brand-accent" : ""} />
                      </button>

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

      {/* Floating Favorites Tray Button (Bottom-Right) */}
      {favorites.length > 0 && (
        <button
          onClick={() => setIsFavTrayOpen(true)}
          className="fixed bottom-6 right-6 z-[99] flex items-center gap-2 px-5 py-3.5 rounded-full bg-brand-accent text-brand-bg font-black text-xs tracking-wider shadow-accent hover:shadow-accent-strong transition-all duration-300 transform hover:scale-[1.03]"
          data-cursor="pointer"
        >
          <Heart size={14} className="fill-brand-bg" />
          Saved ({favorites.length})
        </button>
      )}

      {/* Slide-out Favorites Drawer Panel */}
      <AnimatePresence>
        {isFavTrayOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFavTrayOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#0F0F13] border-l border-white/5 p-6 z-[101] flex flex-col justify-between shadow-2xl select-text"
            >
              <div className="flex flex-col flex-1 min-h-0">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/5 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
                      <Heart size={15} className="fill-brand-accent" />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-wide">
                        Saved Formulas
                      </h3>
                      <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider mt-0.5">
                        Your Favorites Collection
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsFavTrayOpen(false)}
                    className="p-1.5 rounded-lg border border-white/5 bg-white/5 text-white/60 hover:text-white transition-colors"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* List items */}
                <div 
                  data-lenis-prevent
                  className="flex-1 overflow-y-auto pr-1 min-h-0 py-6 space-y-4"
                >
                  {bookmarkedItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 text-white/35 italic space-y-2">
                      <Heart size={24} className="text-white/20 mb-2" />
                      <p className="text-xs">No favorites saved yet.</p>
                      <p className="text-[9px] font-mono text-white/20">Click the heart icon on any prompt card to save it here!</p>
                    </div>
                  ) : (
                    bookmarkedItems.map((item) => {
                      const isItemCopied = copiedId === item.id;
                      return (
                        <div 
                          key={item.id}
                          className="flex flex-col p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-[#0E0E12]">
                                <Image 
                                  src={item.image} 
                                  alt="preview"
                                  fill
                                  sizes="40px"
                                  className="object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <h5 className="text-xs font-bold text-white truncate">{item.title}</h5>
                                <p className="text-[9px] font-mono text-white/30 uppercase truncate">{item.category} • {item.tool}</p>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => toggleFavorite(item.id)}
                              className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors flex-shrink-0"
                              title="Remove from favorites"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>

                          {/* Mini formula */}
                          <div className="bg-black/50 border border-white/5 rounded-lg p-2.5 text-[10px] font-mono text-white/60 select-text max-h-[60px] overflow-y-auto no-scrollbar">
                            {item.promptText}
                          </div>

                          <button
                            onClick={() => handleCopy(item.id, item.promptText)}
                            className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-bold tracking-wide transition-all duration-300 ${
                              isItemCopied
                                ? "bg-green-500/10 border border-green-500/20 text-green-400"
                                : "bg-white/5 border border-white/10 text-white hover:bg-brand-accent hover:text-brand-bg hover:border-brand-accent"
                            }`}
                          >
                            {isItemCopied ? (
                              <>
                                <Check size={11} className="animate-pulse" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy size={11} />
                                Copy Formula
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
