import { create } from "zustand";

type PageOptions = "home" | "recipes" | "pantry" | "ai-generation" | "calendar" | "grocery";

type Pages = {
  page: PageOptions;
  updatePage: (newPage: PageOptions) => void;
};

export const usePageSelector = create<Pages>((set) => ({
  page: "home",
  updatePage: (newPage) => set(() => ({ page: newPage })),
}));