import type { Metadata, Viewport } from "next";
import { Syne, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import { PixoraProvider } from "@/context/PixoraContext";

const displayFont = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["700", "800"],
});

const sansFont = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "PIXORA",
  description: "Curated, production-tested prompt formulas for Midjourney, Lightroom AI, and Photoshop. Generate gorgeous film looks, moody tones, and studio lighting in seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${sansFont.variable}`}>
      <body className="antialiased font-sans">
        <PixoraProvider>
          <CustomCursor />
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </PixoraProvider>
      </body>
    </html>
  );
}

