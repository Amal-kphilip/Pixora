"use client";

import { motion } from "framer-motion";
import { Copy, Download, Image as ImageIcon } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Pick Your Aesthetic",
      description: "Browse our curated archive of vintage, cinematic, and editorial grading profiles. Choose a prompt built specifically for your destination editor.",
      icon: <ImageIcon className="text-brand-accent" size={24} />
    },
    {
      num: "02",
      title: "Paste & Inject",
      description: "Paste the mathematical styling prompts into Midjourney or use Lightroom/Photoshop AI to automatically construct the lighting environments.",
      icon: <Copy className="text-brand-accent" size={24} />
    },
    {
      num: "03",
      title: "Export Graded Asset",
      description: "Generate or click edit to receive your final, high-fidelity graded photo. Ready for publication, print, or commercial projects.",
      icon: <Download className="text-brand-accent" size={24} />
    }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const
      }
    }
  };

  const lineVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1] as const,
        delay: 0.4
      }
    }
  };

  const verticalLineVariants = {
    hidden: { scaleY: 0 },
    visible: {
      scaleY: 1,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1] as const
      }
    }
  };

  return (
    <section id="how-it-works" className="py-24 bg-brand-bg relative z-10 select-none">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-sm font-semibold tracking-wider uppercase text-brand-accent mb-3">
            Workflow Integration
          </h2>
          <p className="text-3xl md:text-5xl font-display font-black tracking-tight text-white leading-tight">
            How it works
          </p>
          <p className="text-brand-muted text-sm md:text-base mt-4">
            A frictionless three-step pipeline to transform plain digital raw files into filmic masterpieces.
          </p>
        </div>

        {/* Steps Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative flex flex-col lg:grid lg:grid-cols-3 gap-12 lg:gap-16 items-start"
        >
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-[45px] left-[15%] right-[15%] h-[1px] bg-white/10 origin-left z-0">
            <motion.div
              variants={lineVariants}
              className="w-full h-full bg-gradient-to-r from-brand-accent/20 via-brand-accent to-brand-accent/20"
            />
          </div>

          {steps.map((step, idx) => {
            return (
              <motion.div
                key={step.num}
                variants={itemVariants}
                className="relative flex flex-row lg:flex-col items-start lg:items-start text-left lg:text-left group z-10 w-full"
              >
                {/* Left Column for Icon and Connecting Line (Mobile) */}
                <div className="flex flex-col items-center flex-shrink-0 mr-6 lg:mr-0 relative">
                  {/* Step Circle */}
                  <div className="w-[72px] h-[72px] lg:w-[90px] lg:h-[90px] rounded-3xl glass flex items-center justify-center relative mb-6 group-hover:border-brand-accent/30 transition-colors duration-300">
                    <div className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-lg bg-brand-accent flex items-center justify-center text-[10px] font-bold text-brand-bg font-mono">
                      {step.num}
                    </div>
                    {step.icon}
                  </div>

                  {/* Mobile connecting vertical line (Runs down from icon column) */}
                  {idx < 2 && (
                    <div className="lg:hidden absolute top-[72px] bottom-[-48px] left-1/2 -translate-x-1/2 w-[1px] bg-white/10 origin-top">
                      <motion.div
                        variants={verticalLineVariants}
                        className="w-full h-full bg-brand-accent"
                      />
                    </div>
                  )}
                </div>

                {/* Right Column for Content */}
                <div className="flex-1 pt-2 lg:pt-0">
                  <h3 className="text-xl font-display font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-brand-muted text-sm leading-relaxed max-w-sm lg:max-w-none">
                    {step.description}
                  </p>

                  {/* Custom software badges for Step 2 */}
                  {idx === 1 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-wrap items-center justify-start gap-2 mt-5"
                    >
                      {/* Photoshop */}
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#001E36] border border-[#005C9E] text-xs font-bold text-[#00A8FF]">
                        <span className="text-[10px] font-mono leading-none">Ps</span>
                        <span className="text-[9px] font-medium text-white/70">Photoshop</span>
                      </div>
                      {/* Lightroom */}
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#001D21] border border-[#005761] text-xs font-bold text-[#00D8F6]">
                        <span className="text-[10px] font-mono leading-none">Lr</span>
                        <span className="text-[9px] font-medium text-white/70">Lightroom</span>
                      </div>
                      {/* Midjourney */}
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-white/80">
                        <span className="text-[10px] font-mono leading-none">Mj</span>
                        <span className="text-[9px] font-medium text-white/60">Midjourney</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
