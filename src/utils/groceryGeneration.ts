import type { GroceryItem, PantryItem, Recipe } from "../types/index.ts";

export type CalendarPlan = Record<string, Record<string, string | null>>;

export const readCalendarPlanFromStorage = (storageKey: string): CalendarPlan => {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return {};

  try {
    return JSON.parse(raw) as CalendarPlan;
  } catch {
    return {};
  }
};

type AggregatedIngredient = {
  name: string;
  unit: string;
  quantity: number;
  recipe_titles: string[];
};

export const generateGroceryListFromPlan = (
  plans: CalendarPlan,
  recipes: Recipe[],
  pantryItems: PantryItem[],
): GroceryItem[] => {
  const recipeIds = new Set<string>();

  Object.values(plans).forEach((day) => {
    Object.values(day).forEach((recipeId) => {
      if (recipeId) recipeIds.add(recipeId);
    });
  });

  const aggregated = new Map<string, AggregatedIngredient>();

  recipes
    .filter((recipe) => recipeIds.has(recipe.id))
    .forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        const key = `${ingredient.name.toLowerCase()}-${ingredient.unit}`;
        const existing = aggregated.get(key);

        if (existing) {
          existing.quantity += ingredient.quantity;
          existing.recipe_titles.push(recipe.title);
          return;
        }

        aggregated.set(key, {
          name: ingredient.name,
          unit: ingredient.unit,
          quantity: ingredient.quantity,
          recipe_titles: [recipe.title],
        });
      });
    });

  const generatedItems: GroceryItem[] = [];

  Array.from(aggregated.values()).forEach((ingredient) => {
      const pantryMatch = pantryItems.find((item) => item.name.toLowerCase() === ingredient.name.toLowerCase());
      const neededQuantity = Math.max(ingredient.quantity - (pantryMatch?.quantity ?? 0), 0);

      if (neededQuantity <= 0) return;

      generatedItems.push({
        name: ingredient.name,
        quantity: neededQuantity,
        unit: ingredient.unit,
        category: pantryMatch?.category ?? "other",
        checked: false,
        recipe_titles: ingredient.recipe_titles,
      });
    });

  return generatedItems.sort((a, b) => a.category.localeCompare(b.category));
};
