export interface PromptItem {
  id: string;
  title: string;
  category: string;
  tool: "Midjourney" | "Lightroom" | "Photoshop";
  promptText: string;
  image: string;
  complexity: "Basic" | "Advanced" | "Pro";
  copyCount?: number;
  favoriteCount?: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  description: string;
  image: string;
  beforeImage?: string;
  afterImage?: string;
  beforeFilter: string; // Stored as standard CSS filter string
  afterFilter: string;  // Stored as standard CSS filter string
  prompts: { title: string; text: string }[];
}

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    id: "cinematic",
    name: "Cinematic Color Grading",
    description: "Hollywood film looks with rich teals and warm gold accents. Best for street and narrative portraits.",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80",
    beforeFilter: "saturate(0.5) brightness(0.9) contrast(0.9) sepia(0.2)",
    afterFilter: "saturate(1.5) contrast(1.15) hue-rotate(5deg) brightness(1.05)",
    prompts: [
      {
        title: "Tokyo Cyber Neon Vibe",
        text: "Cinematic film still, Tokyo street, night, heavy rain, pavement reflections, glowing neon signs, teal and orange color grading, volumetric light --ar 16:9 --v 6.0"
      },
      {
        title: "Golden Hour Film Portra",
        text: "Cinematic portrait, warm golden key light, cinematic shadows, soft haze, kodak portra 400 film look --ar 4:5 --v 6.0"
      }
    ]
  },
  {
    id: "portrait",
    name: "Portrait Retouching",
    description: "Editorial keylights, skin tone mapping, and volumetric light prompts for commercial headshots.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    beforeFilter: "grayscale(1) saturate(0.5) contrast(0.8) brightness(0.85)",
    afterFilter: "saturate(1.25) contrast(1.05) brightness(1.05) sepia(0.05)",
    prompts: [
      {
        title: "Studio Rembrandt Keylight",
        text: "Professional studio headshot, male model, dramatic side lighting, Rembrandt light, dark grey textured backdrop, Hasselblad medium format --ar 4:5 --style raw"
      },
      {
        title: "Soft Volumetric Beauty Dish",
        text: "Beauty editorial photo, female model close-up, soft beauty dish lighting, clean skin texture details, high-fashion styling --ar 1:1"
      }
    ]
  },
  {
    id: "moody",
    name: "Moody Film Looks",
    description: "Mist, rain reflection, foggy environments, and deep shadow profiles for dark, atmospheric edits.",
    image: "https://images.unsplash.com/photo-1501183007986-d0d080b147f9?auto=format&fit=crop&w=600&q=80",
    beforeFilter: "brightness(0.7) contrast(0.7) saturate(0.6)",
    afterFilter: "contrast(1.3) brightness(1.1) saturate(1.6) hue-rotate(-10deg)",
    prompts: [
      {
        title: "Rainy Neon Alleyway",
        text: "Dark atmospheric cinematic still, moody narrow alleyway, wet reflections, low mist, yellow lanterns glowing, vintage wash --ar 16:9 --v 6.0"
      },
      {
        title: "Foggy Mountain Forest Road",
        text: "Cinematic shot, car headlights breaking through dense fog, moody dark green trees, twilight ambient --style raw"
      }
    ]
  },
  {
    id: "product",
    name: "Product Photography",
    description: "Studio background generation, crisp key highlights, and advertising prompts for e-commerce.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    beforeFilter: "contrast(0.85) brightness(0.9) saturate(0.7) blur(0.5px)",
    afterFilter: "contrast(1.15) brightness(1.0) saturate(1.3)",
    prompts: [
      {
        title: "Luxury Watch Commercial Studio",
        text: "Luxury wristwatch on a dark polished marble pedestal, dramatic water splash macro photography, black minimalist studio background, high speed sync lighting --v 6.0"
      },
      {
        title: "Cosmetic Bottle Sunrise Reflection",
        text: "Organic skin care bottle, standing on sand, sunrise background, clean volumetric sunlight, pastel pink sky reflections --ar 4:5"
      }
    ]
  },
  {
    id: "bw",
    name: "Black & White",
    description: "High-contrast monochrome, rich film grain emulation, and deep shadows inspired by Leica noir film.",
    image: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=600&q=80",
    beforeFilter: "saturate(0.8) contrast(0.9)",
    afterFilter: "grayscale(1) contrast(1.4) brightness(1.05)",
    prompts: [
      {
        title: "High Contrast Leica Monochrome",
        text: "Street photography, raw shot, stark high contrast black and white, deep shadows, bright highlighted silhouettes, Leica M6 monochrome look --ar 16:9"
      },
      {
        title: "Silver Halide Classic Portrait",
        text: "Black and white editorial studio portrait, retro look, soft grain texture, vintage analog tint --ar 4:5 --style raw"
      }
    ]
  },
  {
    id: "vintage",
    name: "Vintage Film Emulation",
    description: "Halation, dust scratches, warm hues, and soft light rolls resembling 90s Polaroid and Kodak stocks.",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80",
    beforeFilter: "saturate(0.5) contrast(0.8) brightness(0.95)",
    afterFilter: "sepia(0.35) saturate(1.1) contrast(0.95) hue-rotate(-5deg) brightness(1.02)",
    prompts: [
      {
        title: "90s Polaroid Instant Grain",
        text: "Vintage Polaroid style photo, flash lighting, slightly out of focus, warm vintage tints, light leak streaks, analog film border --style raw"
      },
      {
        title: "Kodak Portra Warm Halation",
        text: "Sunset beach fashion editorial, kodak portra 800 colors, warm sepia undertones, soft highlights compression, retro summer vibes --ar 16:9 --v 6.0"
      }
    ]
  }
];

export const DEFAULT_PROMPTS: PromptItem[] = [
  {
    id: "pr-1",
    title: "Golden Hour Cinematic Portrait",
    category: "Cinematic Color Grading",
    tool: "Midjourney",
    promptText: "Close-up portrait of a model, warm key light, cinematic lighting, 35mm lens, golden hour haze, Kodak Portra 400 grading --ar 16:9 --v 6.0",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80",
    complexity: "Advanced"
  },
  {
    id: "pr-2",
    title: "Stark Leica Monochrome",
    category: "Black & White",
    tool: "Midjourney",
    promptText: "High contrast black and white street photography, moody night lighting, rainy pavement reflections, Leica M11 style monochrome --ar 16:9 --style raw",
    image: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=500&q=80",
    complexity: "Pro"
  },
  {
    id: "pr-3",
    title: "Aesthetic Matte Film",
    category: "Vintage Film Emulation",
    tool: "Lightroom",
    promptText: "Vintage matte color grading preset: Lift shadows, mute highlights, warm desaturated color profile, grain injection size 25, roughness 30 --style vintage",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=500&q=80",
    complexity: "Basic"
  },
  {
    id: "pr-4",
    title: "Cyberpunk Tokyo Neon",
    category: "Cinematic Color Grading",
    tool: "Midjourney",
    promptText: "Tokyo street alleyway, rainy night, cyberpunk neon lights, electric magenta and cyan tint, highly saturated, cinematic reflections --ar 16:9 --v 6.0",
    image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=500&q=80",
    complexity: "Advanced"
  },
  {
    id: "pr-5",
    title: "Minimalist E-Commerce Product",
    category: "Product Photography",
    tool: "Photoshop",
    promptText: "Clean product shoot backdrop, soft overhead studio softbox light, minimalist white concrete pedestal, high detail key lights --v 6.0",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80",
    complexity: "Basic"
  },
  {
    id: "pr-6",
    title: "Classic Editorial Headshot",
    category: "Portrait Retouching",
    tool: "Midjourney",
    promptText: "Studio editorial portrait, neutral gray backdrop, volumetric side lighting, Rembrandt light style, sharp eyes detail, Hasselblad medium format --ar 4:5",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80",
    complexity: "Pro"
  },
  {
    id: "pr-7",
    title: "Kerala Monsoon Rainscape",
    category: "Moody Film Looks",
    tool: "Midjourney",
    promptText: "Lush green Munnar tea gardens, Kerala, heavy monsoon rain downpour, dense fog covering the hills, winding wet roads, cinematic color grading --ar 16:9 --v 6.0",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=500&q=80",
    complexity: "Advanced"
  },
  {
    id: "pr-8",
    title: "Misty Mountain Trekking",
    category: "Moody Film Looks",
    tool: "Midjourney",
    promptText: "A lone hiker with a technical backpack trekking up a steep foggy mountain ridge in Western Ghats, Kerala, dense fog, dew drops on wild grass, walking poles, moody twilight, cinematic style --ar 16:9 --style raw",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=500&q=80",
    complexity: "Pro"
  },
  {
    id: "pr-9",
    title: "Monsoon Mist Lightroom Presets",
    category: "Vintage Film Emulation",
    tool: "Lightroom",
    promptText: "Kerala monsoon color grading preset: Saturate forest greens, shift blues to dark cyan, lift shadows with heavy mist grain, soft highlights compression --style moody",
    image: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=500&q=80",
    complexity: "Basic"
  }
];
