import { create } from "zustand";

type PageOptions = "recipes" | "home";

type Pages = {
  page: PageOptions;
  updatePage: (newPage: PageOptions) => void;
};

export const usePageSelector = create<Pages>((set) => ({
  page: "home",
  updatePage: (newPage) => set(() => ({ page: newPage })),
}));
