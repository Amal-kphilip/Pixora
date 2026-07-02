"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  DEFAULT_CATEGORIES,
  DEFAULT_PROMPTS,
  PromptItem,
  CategoryItem
} from "@/data/defaultData";

interface PixoraContextType {
  categories: CategoryItem[];
  prompts: PromptItem[];
  addPrompt: (prompt: Omit<PromptItem, "id">) => void;
  addCategory: (category: Omit<CategoryItem, "prompts">) => void;
  resetData: () => void;
}

const PixoraContext = createContext<PixoraContextType | undefined>(undefined);

export function PixoraProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize and load from localStorage after mounting
  useEffect(() => {
    const savedCategories = localStorage.getItem("pixora_custom_categories");
    const savedPrompts = localStorage.getItem("pixora_custom_prompts");

    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      setCategories(DEFAULT_CATEGORIES);
      localStorage.setItem("pixora_custom_categories", JSON.stringify(DEFAULT_CATEGORIES));
    }

    if (savedPrompts) {
      setPrompts(JSON.parse(savedPrompts));
    } else {
      setPrompts(DEFAULT_PROMPTS);
      localStorage.setItem("pixora_custom_prompts", JSON.stringify(DEFAULT_PROMPTS));
    }

    setIsLoaded(true);
  }, []);

  const addPrompt = (newPrompt: Omit<PromptItem, "id">) => {
    const promptWithId: PromptItem = {
      ...newPrompt,
      id: `pr-custom-${Date.now()}`
    };

    const updatedPrompts = [promptWithId, ...prompts];
    setPrompts(updatedPrompts);
    localStorage.setItem("pixora_custom_prompts", JSON.stringify(updatedPrompts));

    // Also append this prompt inside the corresponding category's prompts array if category exists!
    const targetCatId = newPrompt.category.toLowerCase();
    const updatedCategories = categories.map((cat) => {
      if (cat.id === targetCatId) {
        return {
          ...cat,
          prompts: [...cat.prompts, { title: newPrompt.title, text: newPrompt.promptText }]
        };
      }
      return cat;
    });
    setCategories(updatedCategories);
    localStorage.setItem("pixora_custom_categories", JSON.stringify(updatedCategories));
  };

  const addCategory = (newCat: Omit<CategoryItem, "prompts">) => {
    const categoryWithPrompts: CategoryItem = {
      ...newCat,
      id: newCat.id.toLowerCase().trim().replace(/\s+/g, "-"),
      prompts: [] // Starts with empty prompts
    };

    const updatedCategories = [...categories, categoryWithPrompts];
    setCategories(updatedCategories);
    localStorage.setItem("pixora_custom_categories", JSON.stringify(updatedCategories));
  };

  const resetData = () => {
    localStorage.removeItem("pixora_custom_categories");
    localStorage.removeItem("pixora_custom_prompts");
    localStorage.removeItem("pixora_instagram_followed");
    setCategories(DEFAULT_CATEGORIES);
    setPrompts(DEFAULT_PROMPTS);
    window.location.reload();
  };

  // Render children normally but avoid hydrations issues by using empty arrays during SSR
  return (
    <PixoraContext.Provider
      value={{
        categories: isLoaded ? categories : [],
        prompts: isLoaded ? prompts : [],
        addPrompt,
        addCategory,
        resetData
      }}
    >
      {children}
    </PixoraContext.Provider>
  );
}

export function usePixora() {
  const context = useContext(PixoraContext);
  if (context === undefined) {
    throw new Error("usePixora must be used within a PixoraProvider");
  }
  return context;
}
