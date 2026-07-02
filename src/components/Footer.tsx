"use client";

import { useState } from "react";
import { ArrowUp, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Footer() {
  const [modalTitle, setModalTitle] = useState<string | null>(null);
  const [modalContent, setModalContent] = useState<string>("");

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetElement = document.querySelector(href);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handlePlaceholderClick = (e: React.MouseEvent, name: string) => {
    e.preventDefault();
    setModalTitle(name);
    
    // Premium, context-aware information for each footer resource
    if (name === "Photographer Guide") {
      setModalContent("Learn how to engineer prompts to achieve perfect volumetric lighting, photographic grain, film stocks, and exact focal lengths using raw camera formulas.");
    } else if (name === "Prompting Syntax") {
      setModalContent("A complete syntax reference index for parameter flags such as aspect ratios (--ar), stylization ratios (--stylize), randomness (--weird), and custom rendering configurations.");
    } else if (name === "Midjourney Specs") {
      setModalContent("Optimized parameter specifications for Midjourney v6, including photo-realistic render tags, raw engine ratios, and contrast rules.");
    } else if (name === "Lightroom presets") {
      setModalContent("Raw XMP profile specifications for Lightroom AI, outlining custom color-grading wheels, tone curves, and luminance controls.");
    } else if (name === "About Us") {
      setModalContent("Pixora is a premium prompt laboratory founded by visual artists to accelerate color grading pipelines and asset setups for modern photographic algorithms.");
    } else if (name === "Careers") {
      setModalContent("We are always seeking creative prompt engineers and directors. Send your portfolio to our team at careers@pixora.com.");
    } else if (name === "Partnerships") {
      setModalContent("Partner with Pixora to integrate custom preset styles and lighting models directly into your studio's asset manager pipelines.");
    } else if (name === "Press Room") {
      setModalContent("Access press kits, branding elements, high-resolution showcase assets, and official media releases.");
    } else if (name === "Privacy Policy") {
      setModalContent("We value your privacy. No personal search queries or bookmarked favorites data are uploaded to our servers; everything is kept securely on your local device.");
    } else if (name === "Terms of Service") {
      setModalContent("By using Pixora, you agree to use our prompt formulas for both commercial and personal creative grading purposes. Redissemination of the raw codebase structure is prohibited.");
    } else if (name === "Refund Policy") {
      setModalContent("Since Pixora is a public open-source database, all prompt formulas and CDN assets are provided free of charge with lifetime updates.");
    } else if (name === "Licensing rules") {
      setModalContent("Prompt formulas are licensed under the MIT creative commons license. Commercial outputs generated using the prompts are entirely yours.");
    }
  };

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Product: [
      { name: "Prompts Library", href: "#library", action: false },
      { name: "Categories", href: "#categories", action: false },
      { name: "Showcase presets", href: "#presets", action: false }
    ],
    Resources: [
      { name: "Photographer Guide", href: "#", action: true },
      { name: "Prompting Syntax", href: "#", action: true },
      { name: "Midjourney Specs", href: "#", action: true },
      { name: "Lightroom presets", href: "#", action: true }
    ],
    Company: [
      { name: "About Us", href: "#", action: true },
      { name: "Careers", href: "#", action: true },
      { name: "Partnerships", href: "#", action: true },
      { name: "Press Room", href: "#", action: true }
    ],
    Legal: [
      { name: "Privacy Policy", href: "#", action: true },
      { name: "Terms of Service", href: "#", action: true },
      { name: "Refund Policy", href: "#", action: true },
      { name: "Licensing rules", href: "#", action: true }
    ]
  };

  return (
    <footer className="bg-[#070709] border-t border-white/5 pt-20 pb-10 relative z-10 select-none overflow-hidden">
      {/* Background glow at footer */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-brand-accent/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 md:gap-8 pb-16 border-b border-white/5">
          {/* Brand Info */}
          <div className="col-span-2 flex flex-col space-y-6">
            <a
              href="/"
              className="flex items-center space-x-2 text-xl font-bold tracking-tight text-white font-display"
            >
              <span 
                onDoubleClick={() => window.dispatchEvent(new CustomEvent("toggle-creator-console"))}
                className="w-8 h-8 rounded-lg bg-brand-accent flex items-center justify-center text-brand-bg font-black select-none"
              >
                P
              </span>
              <span className="tracking-widest text-lg font-bold">PIXORA<span className="text-brand-accent">.</span></span>
            </a>
            <p className="text-brand-muted text-xs leading-relaxed max-w-sm">
              Engineered prompt variables for modern photographic algorithms. Accelerating color grading pipelines for creative directors, studios, and freelance professionals globally.
            </p>
            {/* Socials */}
            <div className="flex items-center space-x-3">
              {[
                { 
                  icon: (
                    <svg className="w-[15px] h-[15px] fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  ), 
                  href: "#" 
                },
                { 
                  icon: (
                    <svg className="w-[15px] h-[15px] stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                  ), 
                  href: "https://www.instagram.com/amalkp29/" 
                },
                { 
                  icon: (
                    <svg className="w-[15px] h-[15px] stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  ), 
                  href: "mailto:amalkaduppilphilip@gmail.com" 
                },
                { 
                  icon: (
                    <svg className="w-[15px] h-[15px] stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                      <path d="M9 18c-4.51 2-5-2-7-2"/>
                    </svg>
                  ), 
                  href: "https://github.com/Amal-kphilip/Pixora" 
                }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:border-brand-accent/30 text-white/60 hover:text-brand-accent flex items-center justify-center transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="col-span-1 flex flex-col space-y-4">
              <h4 className="text-xs font-mono font-bold text-white tracking-widest uppercase">
                {title}
              </h4>
              <ul className="flex flex-col space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    {link.action ? (
                      <button
                        onClick={(e) => handlePlaceholderClick(e, link.name)}
                        className="text-xs text-brand-muted hover:text-brand-accent transition-colors duration-200 text-left focus:outline-none"
                      >
                        {link.name}
                      </button>
                    ) : (
                      <a
                        href={link.href}
                        onClick={(e) => handleLinkClick(e, link.href)}
                        className="text-xs text-brand-muted hover:text-brand-accent transition-colors duration-200"
                      >
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row: copyright + back to top */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4">
          <p className="text-[10px] font-mono text-white/30 tracking-wider">
            &copy; {currentYear} PIXORA PROMPTS INC. ALL RIGHTS RESERVED.
          </p>
          
          <button
            onClick={handleScrollToTop}
            className="group flex items-center gap-2 text-xs font-semibold text-white/70 hover:text-brand-accent transition-colors"
          >
            <span>Back to top</span>
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 group-hover:border-brand-accent/30 flex items-center justify-center text-white/60 group-hover:text-brand-accent transition-all duration-300 transform group-hover:-translate-y-0.5">
              <ArrowUp size={14} />
            </div>
          </button>
        </div>

      </div>

      {/* Massive wordmark */}
      <div className="w-full mt-16 text-center select-none pointer-events-none opacity-[0.02] translate-y-8 overflow-hidden">
        <h1 className="text-[14vw] font-display font-black leading-none tracking-tight text-white whitespace-nowrap">
          PIXORA
        </h1>
      </div>

      {/* Informational Modal */}
      <AnimatePresence>
        {modalTitle && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalTitle(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[99999] pointer-events-auto"
            />
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, x: "-50%", y: "-50%" }}
              animate={{ scale: 1, opacity: 1, x: "-50%", y: "-50%" }}
              exit={{ scale: 0.95, opacity: 0, x: "-50%", y: "-50%" }}
              className="fixed top-1/2 left-1/2 w-[90%] max-w-md p-6 rounded-3xl bg-[#0F0F13] border border-white/10 z-[100000] shadow-2xl flex flex-col space-y-6"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <h3 className="text-xs font-display font-black text-brand-accent tracking-wide uppercase">
                  {modalTitle}
                </h3>
                <button
                  onClick={() => setModalTitle(null)}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
              <p className="text-xs text-white/70 leading-relaxed font-mono">
                {modalContent}
              </p>
              <button
                onClick={() => setModalTitle(null)}
                className="w-full py-3.5 rounded-xl bg-brand-accent text-brand-bg font-black text-xs tracking-wider shadow-accent hover:shadow-accent-strong transition-all duration-300"
              >
                Close Window
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </footer>
  );
}
