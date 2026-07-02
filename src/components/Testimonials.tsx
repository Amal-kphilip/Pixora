"use client";

import { useRef } from "react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  avatar: string;
  bgImage: string;
}

export default function Testimonials() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Sarah Jenkins",
      role: "Editorial Photographer",
      quote: "Pixora prompts completely revolutionized my pre-production. I can match specific film stock grading profiles in seconds instead of grading from scratch.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      bgImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 2,
      name: "Marcus Chen",
      role: "Commercial Product Stylist",
      quote: "The product rendering setups match professional studio configurations. My clients are blown away by the lighting accuracy of the AI-generated backdrops.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      bgImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 3,
      name: "Elena Rostova",
      role: "Cinematic Street Photographer",
      quote: "Getting neon halations and wet road reflections right in Midjourney used to be a guessing game. These formulas provide consistent, rich grading variables.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
      bgImage: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 4,
      name: "David Kovic",
      role: "Creative Director",
      quote: "Our design agency integrated Pixora prompts into our core ideation pipeline. We've cut down moodboard assembly times by over seventy percent.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      bgImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
    }
  ];

  const handleScroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const scrollAmount = 380; // Approximate card width + gap
    const container = carouselRef.current;
    const targetScroll = container.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount);
    
    container.scrollTo({
      left: targetScroll,
      behavior: "smooth"
    });
  };

  return (
    <section className="py-24 bg-brand-bg relative z-10 select-none overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-4 md:space-y-0">
          <div>
            <h2 className="text-sm font-semibold tracking-wider uppercase text-brand-accent mb-3">
              CREATORS PULSE
            </h2>
            <p className="text-4xl md:text-5xl font-display font-black tracking-tight text-white leading-tight">
              Endorsed by professionals.
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleScroll("left")}
              className="p-3.5 rounded-full border border-white/5 bg-white/5 text-white hover:text-brand-accent hover:border-brand-accent/20 transition-all duration-300"
              aria-label="Scroll left"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={() => handleScroll("right")}
              className="p-3.5 rounded-full border border-white/5 bg-white/5 text-white hover:text-brand-accent hover:border-brand-accent/20 transition-all duration-300"
              aria-label="Scroll right"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-8 snap-x snap-mandatory cursor-grab active:cursor-grabbing"
        >
          {testimonials.map((test) => {
            return (
              <div
                key={test.id}
                className="flex-shrink-0 w-[310px] md:w-[360px] h-[440px] rounded-3xl overflow-hidden relative group snap-start border border-white/5 p-6 flex flex-col justify-between"
              >
                {/* Background image overlay */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={test.bgImage}
                    alt={`${test.name} Background`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-[0.25] saturate-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/50 to-transparent" />
                </div>

                {/* Quote Icon */}
                <div className="relative z-10 self-start p-3.5 rounded-2xl bg-white/5 border border-white/10 text-brand-accent">
                  <Quote size={20} fill="#FF6A2B" className="opacity-80" />
                </div>

                {/* Text Block */}
                <div className="relative z-10 flex flex-col space-y-6">
                  <p className="text-sm md:text-base text-white/80 italic font-medium leading-relaxed">
                    &quot;{test.quote}&quot;
                  </p>

                  <div className="flex items-center gap-3.5 pt-4 border-t border-white/5">
                    <img
                      src={test.avatar}
                      alt={test.name}
                      className="w-11 h-11 rounded-full object-cover border border-white/10"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-wide">
                        {test.name}
                      </h4>
                      <p className="text-[10px] font-mono text-brand-accent uppercase tracking-wider mt-0.5">
                        {test.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
