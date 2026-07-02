"use client";



export default function Marquee() {
  const keywords = [
    "Cinematic",
    "Moody",
    "Golden Hour",
    "Film Look",
    "Teal & Orange",
    "Pastel",
    "High Contrast",
    "Vintage",
    "Editorial",
    "Matte",
  ];

  // Triplicate keywords to ensure seamless infinite scroll
  const repeatedKeywords = [...keywords, ...keywords, ...keywords];

  return (
    <div className="relative w-full py-10 bg-[#070709] border-y border-white/5 overflow-hidden z-10 select-none transform -rotate-2 scale-[1.02]">
      {/* Ambient gradient edges for marquee fade */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-brand-bg to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-brand-bg to-transparent z-10 pointer-events-none" />

      <div className="flex w-full overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-12 md:gap-16">
          {repeatedKeywords.map((word, idx) => {
            // Give every third word the brand accent color, others are outlined
            const isAccent = idx % 3 === 0;
            return (
              <span
                key={idx}
                className={`text-4xl md:text-6xl font-display font-black uppercase tracking-wider transition-colors duration-300 ${
                  isAccent
                    ? "text-brand-accent drop-shadow-[0_0_15px_rgba(255,106,43,0.15)]"
                    : "text-outline text-white"
                }`}
              >
                {word}
                <span className="ml-12 md:ml-16 text-white/10 font-sans font-light">·</span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
