import { create } from "zustand";

export type PageOptions = "home" | "recipes" | "pantry" | "ai-generation" | "calendar" | "grocery";

const PAGE_TO_PATH: Record<PageOptions, string> = {
  home: "/",
  recipes: "/recipes",
  pantry: "/pantry",
  "ai-generation": "/ai-generation",
  calendar: "/calendar",
  grocery: "/grocery",
};

const PATH_TO_PAGE: Record<string, PageOptions> = {
  "/": "home",
  "/recipes": "recipes",
  "/pantry": "pantry",
  "/ai-generation": "ai-generation",
  "/calendar": "calendar",
  "/grocery": "grocery",
};

const getPageFromPath = (path: string): PageOptions => PATH_TO_PAGE[path] ?? "home";

const getCurrentPath = () => (typeof window !== "undefined" ? window.location.pathname : "/");

type Pages = {
  page: PageOptions;
  updatePage: (newPage: PageOptions) => void;
  updatePageFromPath: () => void;
  resetPage: () => void;
};

export const usePageSelector = create<Pages>((set) => ({
  page: getPageFromPath(getCurrentPath()),
  updatePage: (newPage) => {
    if (typeof window !== "undefined") {
      const targetPath = PAGE_TO_PATH[newPage];
      if (window.location.pathname !== targetPath) {
        window.history.pushState({}, "", targetPath);
      }
    }

    set(() => ({ page: newPage }));
  },
  updatePageFromPath: () => {
    set(() => ({ page: getPageFromPath(getCurrentPath()) }));
  },
  resetPage: () => {
    if (typeof window !== "undefined" && window.location.pathname !== "/") {
      window.history.pushState({}, "", "/");
    }
    set(() => ({ page: "home" }));
  },
}));
