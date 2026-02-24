import { create } from "zustand";
import type { Recipe, RecipeInsert, RecipeUpdate } from "../types";
import * as recipesApi from "../api/recipes";

type RecipesState = {
  recipes: Recipe[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedTag: string | null;
  showFavouritesOnly: boolean;

  // Actions
  fetchRecipes: (userId: string) => Promise<void>;
  addRecipe: (userId: string, recipe: RecipeInsert) => Promise<void>;
  updateRecipe: (id: string, updates: RecipeUpdate) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
  toggleFavourite: (id: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSelectedTag: (tag: string | null) => void;
  setShowFavouritesOnly: (show: boolean) => void;
  clearError: () => void;
};

export const useRecipesStore = create<RecipesState>((set) => ({
  recipes: [],
  isLoading: false,
  error: null,
  searchQuery: "",
  selectedTag: null,
  showFavouritesOnly: false,

  fetchRecipes: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const recipes = await recipesApi.getRecipes(userId);
      set({ recipes, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch recipes",
        isLoading: false,
      });
    }
  },

  addRecipe: async (userId: string, recipe: RecipeInsert) => {
    set({ isLoading: true, error: null });
    try {
      const newRecipe = await recipesApi.createRecipe(userId, recipe);
      set((state) => ({
        recipes: [newRecipe, ...state.recipes],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to add recipe",
        isLoading: false,
      });
    }
  },

  updateRecipe: async (id: string, updates: RecipeUpdate) => {
    set({ error: null });
    try {
      const updatedRecipe = await recipesApi.updateRecipe(id, updates);
      set((state) => ({
        recipes: state.recipes.map((recipe) =>
          recipe.id === id ? updatedRecipe : recipe
        ),
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to update recipe",
      });
    }
  },

  deleteRecipe: async (id: string) => {
    set({ error: null });
    try {
      await recipesApi.deleteRecipe(id);
      set((state) => ({
        recipes: state.recipes.filter((recipe) => recipe.id !== id),
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to delete recipe",
      });
    }
  },

  toggleFavourite: async (id: string) => {
    set({ error: null });
    try {
      const updatedRecipe = await recipesApi.toggleFavourite(id);
      set((state) => ({
        recipes: state.recipes.map((recipe) =>
          recipe.id === id ? updatedRecipe : recipe
        ),
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to toggle favourite",
      });
    }
  },

  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setSelectedTag: (tag: string | null) => set({ selectedTag: tag }),
  setShowFavouritesOnly: (show: boolean) => set({ showFavouritesOnly: show }),
  clearError: () => set({ error: null }),
}));