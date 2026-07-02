"use client";

import { useRef, useState, useEffect } from "react";
import { ArrowRight, Play, Eye } from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Scroll parallax configurations for collage cards (desktop only)
  const yCard1 = useTransform(scrollY, [0, 1000], [0, -160]);
  const yCard2 = useTransform(scrollY, [0, 1000], [0, -60]);
  const yCard3 = useTransform(scrollY, [0, 1000], [0, -110]);

  // Mouse move parallax values (using springs for buttery fluid lag)
  const mouseX = useSpring(0, { stiffness: 60, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 60, damping: 20 });

  // Declare motion transforms at the top level to avoid conditional hook calls
  const xCard2 = useTransform(mouseX, (x) => x * 1.5);
  const xCard3 = useTransform(mouseX, (x) => x * 2);

  const [isMobile, setIsMobile] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50); // percentage for before/after slider
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile || !containerRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (clientX - left - width / 2) / 30; // Max horizontal movement range
    const y = (clientY - top - height / 2) / 30;  // Max vertical movement range
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Drag slider logic for Before/After preview
  const sliderRef = useRef<HTMLDivElement>(null);
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (touchX / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleSliderMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const moveX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (moveX / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const headline = "AI Prompts for Photos That Actually Look Graded";
  const words = headline.split(" ");

  // Stagger variants for word reveal
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const wordVariants = {
    hidden: { y: "80%", opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const, // Expo-out curve
      },
    },
  };

  const handleHeroCTAClick = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    const el = document.querySelector(target);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen pt-32 pb-24 overflow-hidden flex flex-col justify-center bg-brand-bg select-none"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-brand-accent/20 to-transparent blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-1/2 right-[10%] w-[350px] h-[350px] bg-gradient-radial from-brand-accent/10 to-transparent blur-[90px] rounded-full pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center z-10 w-full">
        {/* Left Side: Headline & CTAs */}
        <div className="lg:col-span-6 flex flex-col space-y-8 text-left">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap text-5xl md:text-6xl xl:text-7xl font-display font-extrabold tracking-tight text-white leading-[1.05]"
          >
            {words.map((word, idx) => {
              // Highlight "Actually Look Graded"
              const isAccent = idx >= words.length - 3;
              return (
                <div key={idx} className="overflow-hidden mr-3 py-1">
                  <motion.span
                    variants={wordVariants}
                    custom={idx}
                    className={`inline-block origin-bottom ${
                      isAccent ? "text-brand-accent" : "text-white"
                    }`}
                  >
                    {word}
                  </motion.span>
                </div>
              );
            })}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
            className="text-base md:text-lg text-brand-muted max-w-lg font-sans leading-relaxed"
          >
            Professional, production-tested prompt formulas for Midjourney, 
            Lightroom AI, and Photoshop. Skip hours of manual color correction 
            and output stunning cinematic grades in seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4"
          >
            <a
              href="#library"
              onClick={(e) => handleHeroCTAClick(e, "#library")}
              className="group flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-brand-accent text-brand-bg font-bold tracking-wide shadow-accent hover:shadow-accent-strong transition-all duration-300 transform hover:scale-[1.03]"
            >
              Get Prompts
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            
            <a
              href="#presets"
              onClick={(e) => handleHeroCTAClick(e, "#presets")}
              className="group flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white font-semibold hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              <Play size={16} fill="white" className="group-hover:scale-110 transition-transform" />
              Watch presets
            </a>
          </motion.div>
        </div>

        {/* Right Side: Collage Visual */}
        <div className="lg:col-span-6 w-full relative flex items-center justify-center min-h-[450px] md:min-h-[580px] lg:min-h-[620px]">
          {isMobile ? (
            /* Mobile View: Single interactive Before/After Card */
            <div className="w-full max-w-sm rounded-3xl overflow-hidden glass border border-white/10 shadow-2xl p-4 flex flex-col space-y-4">
              <div className="flex items-center justify-between text-xs text-white/50 px-1">
                <span className="flex items-center gap-1"><Eye size={14} /> Slide to Grade</span>
                <span className="text-brand-accent font-semibold">Teal & Orange</span>
              </div>
              <div
                ref={sliderRef}
                onTouchMove={handleTouchMove}
                className="relative h-[300px] w-full rounded-2xl overflow-hidden cursor-ew-resize select-none"
              >
                {/* Graded Image */}
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
                  alt="Graded model portrait"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Original (Before) Image overlay */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
                    alt="Original model portrait"
                    className="absolute inset-0 w-[80vw] h-[300px] object-cover max-w-none filter grayscale saturate-50 contrast-75 brightness-90"
                    style={{ width: sliderRef.current?.getBoundingClientRect().width }}
                  />
                </div>

                {/* Slider bar */}
                <div
                  className="absolute top-0 bottom-0 w-[2px] bg-brand-accent cursor-ew-resize"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-brand-accent border-4 border-brand-bg flex items-center justify-center shadow-lg" />
                </div>
              </div>
              <div className="text-center py-1">
                <p className="text-sm font-semibold text-white">Before & After comparison</p>
                <p className="text-xs text-white/50 mt-0.5">Prompt: &quot;Cinematic portrait, warm key light, teal & orange tint&quot;</p>
              </div>
            </div>
          ) : (
            /* Desktop View: Floating Collaging Parallax Layout */
            <div className="w-full h-full relative">
              {/* Card 1: Mountain landscape (deep background speed) */}
              <motion.div
                style={{
                  y: yCard1,
                  x: mouseX,
                }}
                className="absolute top-[10%] left-0 w-[220px] h-[280px] rounded-3xl overflow-hidden glass shadow-xl border border-white/10 p-3 hover:border-brand-accent/30 transition-colors duration-300"
              >
                <Image
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80"
                  alt="Cinematic Landscape"
                  fill
                  sizes="220px"
                  className="object-cover rounded-2xl filter saturate-[1.4] contrast-[1.1]"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5 text-[10px] font-mono text-white/80">
                  LOOK: MOODY GREEN
                </div>
              </motion.div>

              {/* Card 2: Interactive Before/After slider (central focus card) */}
              <motion.div
                style={{
                  y: yCard2,
                  x: xCard2,
                }}
                className="absolute top-[20%] left-[20%] w-[330px] h-[400px] rounded-3xl overflow-hidden glass p-3 shadow-2xl border border-white/10 hover:border-brand-accent/40 z-20 cursor-ew-resize"
                onMouseMove={handleSliderMove}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
              >
                <div className="relative w-full h-[330px] rounded-2xl overflow-hidden" ref={sliderRef}>
                  {/* Graded Image */}
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
                    alt="Graded model portrait"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  
                  {/* Original (Before) Image overlay */}
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${sliderPosition}%` }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
                      alt="Original model portrait"
                      className="absolute inset-0 w-[306px] h-[330px] object-cover max-w-none filter grayscale saturate-50 contrast-75 brightness-90"
                    />
                  </div>

                  {/* Slider bar */}
                  <div
                    className="absolute top-0 bottom-0 w-[2px] bg-brand-accent pointer-events-none"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-brand-accent border-4 border-brand-bg flex items-center justify-center shadow-lg" />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 px-1 text-xs text-white/60">
                  <span className="font-semibold text-white">DRAG SLIDER</span>
                  <span>MIDJOURNEY V6</span>
                </div>
              </motion.div>

              {/* Card 3: Neon street scene (foremost card speed) */}
              <motion.div
                style={{
                  y: yCard3,
                  x: xCard3,
                }}
                className="absolute top-[40%] right-[-5%] w-[200px] h-[250px] rounded-3xl overflow-hidden glass shadow-2xl border border-white/10 p-3 hover:border-brand-accent/30 transition-colors duration-300 z-30"
              >
                <Image
                  src="https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=500&q=80"
                  alt="Neon Street Look"
                  fill
                  sizes="200px"
                  className="object-cover rounded-2xl filter saturate-[1.8] hue-rotate-15 contrast-[1.25]"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5 text-[10px] font-mono text-white/80">
                  LOOK: CYBER TEAL
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
