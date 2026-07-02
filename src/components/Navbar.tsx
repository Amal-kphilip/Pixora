"use client";

import { useState, useEffect } from "react";
import { Menu, X, ArrowRight, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOled, setIsOled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Initialize OLED mode from localStorage
    const savedTheme = localStorage.getItem("pixora-theme");
    if (savedTheme === "oled") {
      setIsOled(true);
      document.documentElement.classList.add("oled");
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleOledMode = () => {
    const nextOled = !isOled;
    setIsOled(nextOled);
    if (nextOled) {
      document.documentElement.classList.add("oled");
      localStorage.setItem("pixora-theme", "oled");
    } else {
      document.documentElement.classList.remove("oled");
      localStorage.setItem("pixora-theme", "dark");
    }
  };

  const navLinks = [
    { name: "Prompts", href: "#library" },
    { name: "Categories", href: "#categories" },
    { name: "How It Works", href: "#how-it-works" },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as const,
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
        when: "beforeChildren",
        staggerChildren: 0.08,
      },
    },
  };

  const linkVariants = {
    closed: { opacity: 0, y: 20 },
    open: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "glass-navbar py-4"
            : "bg-transparent py-6 border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
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

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-sm font-medium text-white/70 hover:text-brand-accent transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop CTA & Theme Toggle */}
          <div className="hidden md:flex items-center gap-4">
            {/* OLED Mode Toggle */}
            <button
              onClick={toggleOledMode}
              className={`p-2 rounded-full border transition-all duration-300 transform active:scale-95 ${
                isOled
                  ? "bg-brand-accent/15 border-brand-accent/30 text-brand-accent shadow-accent"
                  : "bg-white/5 border-white/10 text-white/50 hover:text-white"
              }`}
              title="Toggle OLED Black Mode"
            >
              <Moon size={14} className={isOled ? "fill-brand-accent" : ""} />
            </button>

            <a
              href="#library"
              onClick={(e) => handleLinkClick(e, "#library")}
              className="group relative px-6 py-2 rounded-full bg-brand-accent text-brand-bg text-sm font-semibold tracking-wide overflow-hidden shadow-accent hover:shadow-accent-strong transition-all duration-300 transform hover:scale-[1.03]"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                Browse Library
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            {/* OLED Mode Toggle for Mobile */}
            <button
              onClick={toggleOledMode}
              className={`p-2 rounded-full border transition-all duration-300 ${
                isOled
                  ? "bg-brand-accent/15 border-brand-accent/30 text-brand-accent shadow-accent"
                  : "bg-white/5 border-white/10 text-white/50"
              }`}
              title="Toggle OLED Black Mode"
            >
              <Moon size={14} className={isOled ? "fill-brand-accent" : ""} />
            </button>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white hover:text-brand-accent transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-40 bg-brand-bg/95 backdrop-blur-2xl flex flex-col justify-between p-8 pt-28"
          >
            <div className="flex flex-col space-y-8 mt-12">
              {navLinks.map((link) => (
                <motion.div variants={linkVariants} key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="text-4xl font-display font-semibold text-white hover:text-brand-accent transition-colors"
                  >
                    {link.name}
                  </a>
                </motion.div>
              ))}
            </div>

            <motion.div variants={linkVariants} className="w-full pb-8">
              <a
                href="#library"
                onClick={(e) => handleLinkClick(e, "#library")}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-brand-accent text-brand-bg font-semibold tracking-wide shadow-accent"
              >
                Browse Library
                <ArrowRight size={18} />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
