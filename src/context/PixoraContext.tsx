"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  DEFAULT_CATEGORIES,
  DEFAULT_PROMPTS,
  PromptItem,
  CategoryItem
} from "@/data/defaultData";
import { supabase } from "@/utils/supabaseClient";

interface PixoraContextType {
  categories: CategoryItem[];
  prompts: PromptItem[];
  addPrompt: (prompt: Omit<PromptItem, "id">) => Promise<void>;
  addCategory: (category: Omit<CategoryItem, "prompts">) => Promise<void>;
  deletePrompt: (id: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  resetData: () => Promise<void>;
  refreshDatabase: () => Promise<void>;
}

const PixoraContext = createContext<PixoraContextType | undefined>(undefined);

export function PixoraProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from Supabase, fallback to defaults if database is not configured/empty
  const loadData = async () => {
    try {
      // 1. Fetch Categories from Supabase
      const { data: catData, error: catError } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: true });

      // 2. Fetch Prompts from Supabase
      const { data: promptData, error: promptError } = await supabase
        .from("prompts")
        .select("*")
        .order("created_at", { ascending: false });

      if (catError || promptError) {
        console.error("Supabase load error, falling back to defaults:", catError, promptError);
        setCategories(DEFAULT_CATEGORIES);
        setPrompts(DEFAULT_PROMPTS);
      } else {
        // If database runs successfully but has no categories, display defaults
        if (!catData || catData.length === 0) {
          setCategories(DEFAULT_CATEGORIES);
          setPrompts(DEFAULT_PROMPTS);
        } else {
          // Map database snake_case fields to CategoryItem interface
          const mappedCats: CategoryItem[] = catData.map((c) => ({
            id: c.id,
            name: c.name,
            description: c.description,
            image: c.image,
            beforeImage: c.before_image || undefined,
            afterImage: c.after_image || undefined,
            beforeFilter: c.before_filter,
            afterFilter: c.after_filter,
            prompts: [] // Filled dynamically below
          }));

          // Map database prompts to PromptItem interface
          const mappedPrompts: PromptItem[] = (promptData || []).map((p) => ({
            id: p.id,
            title: p.title,
            category: p.category,
            tool: p.tool as "Midjourney" | "Lightroom" | "Photoshop",
            promptText: p.prompt_text,
            image: p.image,
            complexity: p.complexity as "Basic" | "Advanced" | "Pro"
          }));

          // Nest prompt lists into their parent category items (needed for FeatureGrid modals)
          mappedCats.forEach((cat) => {
            cat.prompts = mappedPrompts
              .filter((p) => p.category.toLowerCase() === cat.name.toLowerCase())
              .map((p) => ({ title: p.title, text: p.promptText }));
          });

          setCategories(mappedCats);
          setPrompts(mappedPrompts);
        }
      }
    } catch (err) {
      console.error("Failed to load Supabase database, using fallback defaults:", err);
      setCategories(DEFAULT_CATEGORIES);
      setPrompts(DEFAULT_PROMPTS);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addPrompt = async (newPrompt: Omit<PromptItem, "id">) => {
    try {
      const { error } = await supabase
        .from("prompts")
        .insert([{
          title: newPrompt.title,
          category: newPrompt.category,
          tool: newPrompt.tool,
          prompt_text: newPrompt.promptText,
          image: newPrompt.image,
          complexity: newPrompt.complexity
        }]);

      if (error) throw error;
      await loadData();
    } catch (err) {
      console.error("Failed to insert prompt to Supabase:", err);
      alert("Failed to insert prompt to live database: " + (err as Error).message);
    }
  };

  const addCategory = async (newCat: Omit<CategoryItem, "prompts">) => {
    try {
      const { error } = await supabase
        .from("categories")
        .insert([{
          id: newCat.id.toLowerCase().trim().replace(/\s+/g, "-"),
          name: newCat.name,
          description: newCat.description,
          image: newCat.image,
          before_image: newCat.beforeImage || null,
          after_image: newCat.afterImage || null,
          before_filter: newCat.beforeFilter,
          after_filter: newCat.afterFilter
        }]);

      if (error) throw error;
      await loadData();
    } catch (err) {
      console.error("Failed to insert category to Supabase:", err);
      alert("Failed to insert category to live database: " + (err as Error).message);
    }
  };
  const deletePrompt = async (id: string) => {
    try {
      const { error } = await supabase
        .from("prompts")
        .delete()
        .eq("id", id);

      if (error) throw error;
      await loadData();
    } catch (err) {
      console.error("Failed to delete prompt from Supabase:", err);
      alert("Failed to delete prompt: " + (err as Error).message);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const targetCat = categories.find((c) => c.id === id);
      if (targetCat) {
        await supabase
          .from("prompts")
          .delete()
          .eq("category", targetCat.name);
      }

      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

      if (error) throw error;
      await loadData();
    } catch (err) {
      console.error("Failed to delete category from Supabase:", err);
      alert("Failed to delete category: " + (err as Error).message);
    }
  };
  const resetData = async () => {
    try {
      // Clear follower local state
      localStorage.removeItem("pixora_instagram_followed");

      // Verify if admin session is active
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("Authentication Required: Please log in to the Creator Console to perform a database reset.");
        return;
      }

      if (confirm("WARNING: This will wipe your live cloud tables and re-seed with default Pixora prompts. Proceed?")) {
        // Delete all live prompts and categories
        await supabase.from("prompts").delete().neq("title", "");
        await supabase.from("categories").delete().neq("name", "");

        // Reseed default categories
        for (const cat of DEFAULT_CATEGORIES) {
          await supabase.from("categories").insert([{
            id: cat.id,
            name: cat.name,
            description: cat.description,
            image: cat.image,
            before_image: cat.beforeImage || null,
            after_image: cat.afterImage || null,
            before_filter: cat.beforeFilter,
            after_filter: cat.afterFilter
          }]);
        }

        // Reseed default prompts
        for (const prompt of DEFAULT_PROMPTS) {
          await supabase.from("prompts").insert([{
            title: prompt.title,
            category: prompt.category,
            tool: prompt.tool,
            prompt_text: prompt.promptText,
            image: prompt.image,
            complexity: prompt.complexity
          }]);
        }

        alert("Cloud database successfully re-seeded!");
        await loadData();
      }
    } catch (err) {
      console.error("Database reset error:", err);
      alert("Error resetting database: " + (err as Error).message);
    }
  };

  return (
    <PixoraContext.Provider
      value={{
        categories: isLoaded ? categories : [],
        prompts: isLoaded ? prompts : [],
        addPrompt,
        addCategory,
        deletePrompt,
        deleteCategory,
        resetData,
        refreshDatabase: loadData
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
