"use client";

import { useState } from "react";
import { Sparkles, Paintbrush } from "lucide-react";
import { motion } from "framer-motion";

interface Preset {
  id: string;
  name: string;
  description: string;
  filterClass: string;
  overlayClass: string;
  prompt: string;
}

export default function Showcase() {
  const [currentIdx, setCurrentIdx] = useState(0);

  const presets: Preset[] = [
    {
      id: "raw",
      name: "Standard Flat",
      description: "Default camera profile. Flat colors, neutral highlights, low saturation.",
      filterClass: "saturate-70 brightness-95 contrast-90 blur-[0.2px]",
      overlayClass: "bg-transparent",
      prompt: "Raw street photography, night, neon signs, low contrast flat profile --ar 16:9"
    },
    {
      id: "teal-orange",
      name: "Teal & Orange",
      description: "Warm skin tones and glowing highlights set against rich, cool blue shadows.",
      filterClass: "contrast-115 saturate-140 brightness-105",
      overlayClass: "bg-gradient-to-tr from-[#00ffff]/10 to-[#ff6600]/10 mix-blend-overlay",
      prompt: "Cinematic night street, Tokyo, rainy pavement reflections, teal and orange color grading, Kodak Portra look --ar 16:9"
    },
    {
      id: "leica-noir",
      name: "Leica Noir B&W",
      description: "Striking high-contrast monochrome with deep pitch blacks and sharp highlights.",
      filterClass: "grayscale-100 contrast-140 brightness-90",
      overlayClass: "bg-black/5 mix-blend-color-burn",
      prompt: "Monochrome street photography, stark lighting contrast, Leica M11 style black and white, dramatic shadows --ar 16:9"
    },
    {
      id: "moody-gold",
      name: "Moody Gold",
      description: "Enchanting golden sunset hues with slightly washed shadows for an editorial film look.",
      filterClass: "sepia-[0.25] saturate-110 contrast-105 brightness-95",
      overlayClass: "bg-orange-500/10 mix-blend-color-burn",
      prompt: "Warm golden hour glow, city alleyway at sunset, dust motes, cinematic soft sepia tint, editorial film --ar 16:9"
    },
    {
      id: "cyberpunk",
      name: "Cyberpunk Pink",
      description: "Futuristic synthetic violet hues, highly saturated magenta highlights, and dark navy shadows.",
      filterClass: "saturate-150 contrast-120 hue-rotate-[135deg] brightness-105",
      overlayClass: "bg-fuchsia-500/10 mix-blend-screen",
      prompt: "Cyberpunk street scene, electric pink and neon magenta highlights, high tech low life aesthetic, high saturation --ar 16:9"
    }
  ];

  const handleNextPreset = () => {
    setCurrentIdx((prev) => (prev + 1) % presets.length);
  };

  return (
    <section id="presets" className="py-24 bg-[#070709] relative z-10 select-none border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Info Card */}
          <div className="lg:col-span-4 flex flex-col space-y-8 text-left">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-xs font-semibold text-brand-accent mb-4">
                <Paintbrush size={12} /> Interactive Lab
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight text-white leading-tight">
                Press me to color grade.
              </h2>
              <p className="text-brand-muted text-sm md:text-base mt-4 leading-relaxed">
                Click the preset buttons or hit the main CTA to dynamically inject precise grading variables onto our base photography asset. Watch the mood shift instantly.
              </p>
            </div>

            {/* Filter pills selection list */}
            <div className="flex flex-col space-y-2">
              {presets.map((preset, idx) => {
                const isActive = idx === currentIdx;
                return (
                  <button
                    key={preset.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`relative w-full text-left px-5 py-3.5 rounded-xl border text-sm font-semibold tracking-wide transition-all duration-300 flex items-center justify-between ${
                      isActive
                        ? "border-brand-accent/30 text-brand-accent bg-brand-accent/5"
                        : "border-white/5 text-white/60 hover:text-white hover:border-white/10"
                    }`}
                  >
                    <span>{preset.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activePresetPill"
                        className="w-1.5 h-1.5 rounded-full bg-brand-accent"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Cycler Button */}
            <button
              onClick={handleNextPreset}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-brand-accent text-brand-bg font-bold tracking-wide shadow-accent hover:shadow-accent-strong transition-all duration-300 transform hover:scale-[1.02]"
            >
              <Sparkles size={16} />
              Cycle Next Look
            </button>
          </div>

          {/* Right: Giant Image panel with smooth filter crossfade */}
          <div className="lg:col-span-8 flex flex-col space-y-4">
            <div className="relative rounded-3xl overflow-hidden glass p-3 border border-white/10 shadow-2xl">
              {/* Image Frame */}
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-[#0A0A0C]">
                {/* Showcase Image */}
                <img
                  src="./images/showcase_base.png"
                  alt="Preset base street"
                  className={`w-full h-full object-cover transition-all duration-1000 ease-expo-out ${presets[currentIdx].filterClass}`}
                />
                
                {/* Blend Overlay layer */}
                <div
                  className={`absolute inset-0 transition-all duration-1000 ease-expo-out pointer-events-none ${presets[currentIdx].overlayClass}`}
                />

                {/* Status Indicator */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                  <span className="text-[10px] font-mono tracking-wider text-white">
                    PROMPT ACTIVE: {presets[currentIdx].name.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Prompt Copy Area */}
            <div className="rounded-2xl bg-brand-card border border-white/5 p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-mono text-brand-accent tracking-wider block mb-1">
                  CORRESPONDING AI PROMPT
                </span>
                <p className="text-sm text-white/80 font-mono truncate max-w-xl">
                  {presets[currentIdx].prompt}
                </p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(presets[currentIdx].prompt);
                }}
                className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                Copy Prompt Formula
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
