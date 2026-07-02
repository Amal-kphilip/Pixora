"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function LoadingScreen({ isLoaded }: { isLoaded: boolean }) {
  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
          }}
          className="fixed inset-0 bg-[#070709] z-[9999] flex flex-col items-center justify-center select-none"
        >
          {/* Premium Ambient Background Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-accent/8 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="relative flex flex-col items-center space-y-6">
            {/* Pulsing Brand Logo Badge */}
            <motion.div
              animate={{
                scale: [1, 1.04, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-16 h-16 rounded-2xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent shadow-accent"
            >
              <Sparkles size={26} className="animate-pulse" />
            </motion.div>

            {/* Brand Header */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-display font-bold text-white tracking-[0.2em] uppercase">
                PIXORA
              </h1>
              <p className="text-[9px] font-mono text-white/30 uppercase tracking-[0.25em]">
                Syncing with Cloud Database...
              </p>
            </div>

            {/* Sweep Loading Progress Bar */}
            <div className="w-28 h-[2px] bg-white/5 rounded-full overflow-hidden relative">
              <motion.div
                initial={{ left: "-100%" }}
                animate={{ left: "100%" }}
                transition={{
                  repeat: Infinity,
                  duration: 1.6,
                  ease: "easeInOut"
                }}
                className="absolute top-0 bottom-0 w-16 bg-gradient-to-r from-transparent via-brand-accent to-transparent"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
