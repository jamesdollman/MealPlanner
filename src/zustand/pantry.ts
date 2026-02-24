import { create } from "zustand";
import type { PantryItem, PantryItemInsert, PantryItemUpdate } from "../types";
import * as pantryApi from "../api/pantry";

type PantryState = {
  items: PantryItem[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string | null;

  // Actions
  fetchItems: (userId: string) => Promise<void>;
  addItem: (userId: string, item: PantryItemInsert) => Promise<void>;
  updateItem: (id: string, updates: PantryItemUpdate) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  clearError: () => void;
};

export const usePantryStore = create<PantryState>((set) => ({
  items: [],
  isLoading: false,
  error: null,
  searchQuery: "",
  selectedCategory: null,

  fetchItems: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const items = await pantryApi.getPantryItems(userId);
      set({ items, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch pantry items",
        isLoading: false,
      });
    }
  },

  addItem: async (userId: string, item: PantryItemInsert) => {
    set({ isLoading: true, error: null });
    try {
      const newItem = await pantryApi.createPantryItem(userId, item);
      set((state) => ({
        items: [...state.items, newItem].sort((a, b) => a.name.localeCompare(b.name)),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to add item",
        isLoading: false,
      });
    }
  },

  updateItem: async (id: string, updates: PantryItemUpdate) => {
    set({ error: null });
    try {
      const updatedItem = await pantryApi.updatePantryItem(id, updates);
      set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? updatedItem : item
        ),
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to update item",
      });
    }
  },

  deleteItem: async (id: string) => {
    set({ error: null });
    try {
      await pantryApi.deletePantryItem(id);
      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to delete item",
      });
    }
  },

  setSearchQuery: (query: string) => set({ searchQuery: query }),

  setSelectedCategory: (category: string | null) => set({ selectedCategory: category }),

  clearError: () => set({ error: null }),
}));