export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type MealPlan = {
  id: string;
  user_id: string;
  recipe_id: string | null;
  meal_date: string;
  meal_type: MealType;
  notes: string | null;
  created_at: string;
};

export type MealPlanInsert = Omit<MealPlan, "id" | "user_id" | "created_at">;
export type MealPlanUpdate = Partial<Omit<MealPlanInsert, "user_id">>;

export type MealPlanWithRecipe = MealPlan & {
  recipe: {
    id: string;
    title: string;
    description: string | null;
    prep_time_min: number | null;
    cook_time_min: number | null;
    servings: number;
  } | null;
};

export const MEAL_TYPES: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
};