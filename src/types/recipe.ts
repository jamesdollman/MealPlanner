export type Ingredient = {
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
};

export type Recipe = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  ingredients: Ingredient[];
  instructions: string[];
  prep_time_min: number | null;
  cook_time_min: number | null;
  servings: number;
  tags: string[];
  source: string;
  is_favourite: boolean;
  calories_kcal: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  created_at: string;
  updated_at: string;
};

export type RecipeInsert = Omit<Recipe, "id" | "user_id" | "created_at" | "updated_at">;
export type RecipeUpdate = Partial<RecipeInsert>;

export const RECIPE_SOURCES = ["manual", "ai_generated", "imported"] as const;
export type RecipeSource = (typeof RECIPE_SOURCES)[number];