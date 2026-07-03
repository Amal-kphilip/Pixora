"use client";

import { useState } from "react";
import { Sparkles, Copy, RefreshCw } from "lucide-react";
import { usePixora } from "@/context/PixoraContext";

export default function PromptBuilder() {
  const { showToast } = usePixora();
  
  // Option lists
  const cameraLenses = [
    { name: "Hasselblad 80mm f/2.8 (Medium Format)", value: "shot on Hasselblad 500C, 80mm lens, f/2.8" },
    { name: "Leica 35mm f/1.4 (Sharp Street Look)", value: "shot on Leica M11, Summilux 35mm, f/1.4, sharp focus" },
    { name: "Anamorphic 50mm (Cinematic Flare)", value: "cinematic film shot, anamorphic 50mm lens, blue flare highlight" },
    { name: "Nikon Nikkor 50mm f/1.2 (Vintage Softness)", value: "vintage portrait, Nikkor 50mm f/1.2, shallow depth of field" },
    { name: "GoPro Wide Angle (Extreme Action)", value: "action dynamic shot, extreme wide angle lens, 14mm, fisheye view" },
  ];

  const filmStocks = [
    { name: "Kodak Portra 400 (Warm Skin Tones)", value: "Kodak Portra 400 film simulation, warm color palette, soft highlights" },
    { name: "Fujifilm Superia 400 (Rich Green & Blue)", value: "Fujifilm Superia X-TRA 400 profile, saturated cool shadows, high dynamic range" },
    { name: "Polaroid 600 (Vintage Instant Look)", value: "Polaroid 600 vintage instant photo, washed colors, retro borders, faded contrast" },
    { name: "Kodak Tri-X 400 (High Contrast B&W)", value: "monochrome, Kodak Tri-X 400 black and white film look, high grain, deep shadows" },
    { name: "Cinestill 800T (Night Halation Tones)", value: "Cinestill 800T night film look, red halation highlights, cool tungsten grading" },
    { name: "Monsoon Deep Greens Saturation", value: "Kerala monsoon deep greens saturation profile, highly reflective wet leaf surfaces, rich tones" },
    { name: "Misty Fog Faded Desaturation", value: "faded misty fog desaturated color wash, low contrast shadows, soft highlight roll-off" },
  ];

  const lightingAtmospheres = [
    { name: "Volumetric Golden Hour (Soft Glow)", value: "volumetric golden hour sunbeams, dust motes floating, soft backlight" },
    { name: "High-Contrast Film Noir (Moody Shadows)", value: "moody film noir lighting, harsh shadows, double key rim light, low-key setup" },
    { name: "Studio Softbox (Clean Editorial)", value: "professional studio fashion lighting, 3-point softbox glow, clean diffuse shadows" },
    { name: "Cyberpunk Neon (Rain Reflected Tones)", value: "vibrant neon illumination, rainy wet pavement reflections, magenta and cyan highlights" },
    { name: "Dappled Sunlight (Natural Shadows)", value: "dappled sunlight filtering through tree leaves, organic leaf shadows, bright ambient light" },
    { name: "Dense Monsoon Downpour (Misty Overlay)", value: "heavy monsoon rain downpour, overcast sky, water droplets on lens, soft volumetric mist" },
    { name: "Misty Fog Twilight (Atmospheric Glow)", value: "dense foggy mist twilight ambiance, soft natural mountain light filtering through thick fog, organic shadows" },
  ];

  const subjects = [
    { name: "Editorial Fashion Portrait", value: "editorial fashion model posing" },
    { name: "Raw Urban Street Candid", value: "candid urban street scene, pedestrians walking" },
    { name: "Minimalist Cinematic Interior", value: "minimalist architectural interior, sun-drenched room" },
    { name: "Cyberpunk Alleyway Scene", value: "futuristic cyberpunk alleyway, steam rising" },
    { name: "Moody Wilderness Landscape", value: "misty forest mountains landscape, low fog" },
    { name: "Kerala Monsoon Tea Plantation", value: "lush Kerala monsoon scene, Munnar tea plantation terraces, winding wet road" },
    { name: "Misty Mountain Trekker", value: "lone hiker with a technical backpack trekking up a steep foggy mountain ridge with walking poles" },
    { name: "Foggy Silent Pine Forest", value: "dense fog and silent misty pine forest road, atmospheric dark mood" },
  ];

  const aspectRatios = [
    { name: "16:9 (Cinematic Widescreen)", value: "--ar 16:9" },
    { name: "4:5 (Instagram Portrait)", value: "--ar 4:5" },
    { name: "1:1 (Classic Square)", value: "--ar 1:1" },
    { name: "2.39:1 (Panavision Scope)", value: "--ar 2.39:1" },
  ];

  // Selection states
  const [selectedSubject, setSelectedSubject] = useState(subjects[0].value);
  const [selectedLens, setSelectedLens] = useState(cameraLenses[0].value);
  const [selectedFilm, setSelectedFilm] = useState(filmStocks[0].value);
  const [selectedLight, setSelectedLight] = useState(lightingAtmospheres[0].value);
  const [selectedRatio, setSelectedRatio] = useState(aspectRatios[0].value);

  // Generate prompt
  const generatedPrompt = `${selectedSubject}, ${selectedLens}, ${selectedFilm}, ${selectedLight} ${selectedRatio} --style raw --v 6.0`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    showToast("Playground prompt copied!");
  };

  const handleRandomize = () => {
    const randomItem = (arr: { name: string; value: string }[]) => arr[Math.floor(Math.random() * arr.length)].value;
    setSelectedSubject(randomItem(subjects));
    setSelectedLens(randomItem(cameraLenses));
    setSelectedFilm(randomItem(filmStocks));
    setSelectedLight(randomItem(lightingAtmospheres));
    setSelectedRatio(randomItem(aspectRatios));
  };

  return (
    <section className="py-20 bg-brand-bg relative z-10 border-t border-white/5 select-none">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title */}
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-xs font-semibold text-brand-accent shadow-accent">
            <Sparkles size={12} className="animate-spin-slow" /> Interactive Lab
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight text-white leading-tight">
            Prompt Builder Playground.
          </h2>
          <p className="text-brand-muted max-w-md text-sm md:text-base leading-relaxed">
            Construct custom camera profiles, light rigs, and color layers dynamically to view your final photographic prompt formulas.
          </p>
        </div>

        {/* Playground Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
          {/* Controls Panel */}
          <div className="lg:col-span-5 glass p-6 rounded-3xl border border-white/5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Subject */}
              <div className="flex flex-col space-y-1">
                <label className="text-[9px] font-mono text-white/35 uppercase tracking-wider block font-bold">Subject Focus</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-brand-accent/40 text-xs text-white/80 focus:outline-none"
                >
                  {subjects.map((item) => (
                    <option key={item.name} value={item.value} className="bg-[#0F0F13]">{item.name}</option>
                  ))}
                </select>
              </div>

              {/* Lens */}
              <div className="flex flex-col space-y-1">
                <label className="text-[9px] font-mono text-white/35 uppercase tracking-wider block font-bold">Camera Lens & Aperture</label>
                <select
                  value={selectedLens}
                  onChange={(e) => setSelectedLens(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-brand-accent/40 text-xs text-white/80 focus:outline-none"
                >
                  {cameraLenses.map((item) => (
                    <option key={item.name} value={item.value} className="bg-[#0F0F13]">{item.name}</option>
                  ))}
                </select>
              </div>

              {/* Film Stock */}
              <div className="flex flex-col space-y-1">
                <label className="text-[9px] font-mono text-white/35 uppercase tracking-wider block font-bold">Color Profile / Film Stock</label>
                <select
                  value={selectedFilm}
                  onChange={(e) => setSelectedFilm(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-brand-accent/40 text-xs text-white/80 focus:outline-none"
                >
                  {filmStocks.map((item) => (
                    <option key={item.name} value={item.value} className="bg-[#0F0F13]">{item.name}</option>
                  ))}
                </select>
              </div>

              {/* Lighting */}
              <div className="flex flex-col space-y-1">
                <label className="text-[9px] font-mono text-white/35 uppercase tracking-wider block font-bold">Lighting Rig / Mood</label>
                <select
                  value={selectedLight}
                  onChange={(e) => setSelectedLight(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-brand-accent/40 text-xs text-white/80 focus:outline-none"
                >
                  {lightingAtmospheres.map((item) => (
                    <option key={item.name} value={item.value} className="bg-[#0F0F13]">{item.name}</option>
                  ))}
                </select>
              </div>

              {/* Ratio */}
              <div className="flex flex-col space-y-1">
                <label className="text-[9px] font-mono text-white/35 uppercase tracking-wider block font-bold">Aspect Ratio</label>
                <select
                  value={selectedRatio}
                  onChange={(e) => setSelectedRatio(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-brand-accent/40 text-xs text-white/80 focus:outline-none"
                >
                  {aspectRatios.map((item) => (
                    <option key={item.name} value={item.value} className="bg-[#0F0F13]">{item.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Randomize button */}
            <button
              onClick={handleRandomize}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-all duration-300"
            >
              <RefreshCw size={13} />
              Randomize Setup
            </button>
          </div>

          {/* Prompt Preview Terminal */}
          <div className="lg:col-span-7 rounded-3xl border border-white/5 bg-[#030305] p-6 md:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            {/* Visual scanline details */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] opacity-40 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-accent/5 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="space-y-4 relative z-10 flex-1 flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/5 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">
                  Prompt terminal output
                </span>
              </div>

              {/* Text Preview */}
              <div className="flex-1 font-mono text-xs text-white/80 leading-relaxed py-6 select-text overflow-y-auto no-scrollbar max-h-[220px]">
                <span className="text-brand-accent">&gt; </span>
                {generatedPrompt}
              </div>
            </div>

            {/* Copy CTA */}
            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-brand-accent text-brand-bg font-black text-xs tracking-wider shadow-accent hover:shadow-accent-strong transition-all duration-300 transform active:scale-95 relative z-10"
            >
              <Copy size={14} />
              Copy Generated Prompt
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
