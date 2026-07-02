"use client";

import { ReactLenis } from "@studio-freight/react-lenis";
import { motion, useScroll, useSpring } from "framer-motion";
import { ReactNode, useState, useEffect } from "react";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [isMobile, setIsMobile] = useState(true); // Default true for server rendering
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Standard server rendering placeholder to prevent hydration mismatch
  if (!mounted) {
    return (
      <>
        <div className="fixed top-0 left-0 right-0 h-[3px] bg-brand-accent origin-left z-[10000]" />
        {children}
      </>
    );
  }

  // Bypass Lenis entirely on mobile to utilize native browser GPU accelerated touch-inertia scrolling
  if (isMobile) {
    return (
      <>
        <motion.div
          className="fixed top-0 left-0 right-0 h-[3px] bg-brand-accent origin-left z-[10000]"
          style={{ scaleX }}
        />
        {children}
      </>
    );
  }

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2 }}>
      {/* Top Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-brand-accent origin-left z-[10000]"
        style={{ scaleX }}
      />
      {children}
    </ReactLenis>
  );
}
