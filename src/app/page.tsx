"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import FeatureGrid from "@/components/FeatureGrid";
import Showcase from "@/components/Showcase";
import HowItWorks from "@/components/HowItWorks";
import PromptLibrary from "@/components/PromptLibrary";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import CreatorConsole from "@/components/CreatorConsole";
import LoadingScreen from "@/components/LoadingScreen";
import { usePixora } from "@/context/PixoraContext";

export default function Home() {
  const { isLoaded } = usePixora();

  return (
    <div className="relative bg-brand-bg min-h-screen">
      {/* Premium Ambient Database Loading Screen */}
      <LoadingScreen isLoaded={isLoaded} />

      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <FeatureGrid />
        <Showcase />
        <HowItWorks />
        <PromptLibrary />
        <Testimonials />
      </main>
      <Footer />
      <CreatorConsole />
    </div>
  );
}
