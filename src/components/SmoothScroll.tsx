"use client";

import { ReactLenis } from "@studio-freight/react-lenis";
import { motion, useScroll, useSpring } from "framer-motion";
import { ReactNode } from "react";

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
