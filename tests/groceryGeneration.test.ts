import test from "node:test";
import assert from "node:assert/strict";
import type { PantryItem, Recipe } from "../src/types/index.ts";
import { generateGroceryListFromPlan } from "../src/utils/groceryGeneration.ts";

const recipe = (overrides: Partial<Recipe>): Recipe => ({
  id: "recipe-1",
  user_id: "user-1",
  title: "Recipe One",
  description: null,
  ingredients: [],
  instructions: [],
  prep_time_min: null,
  cook_time_min: null,
  servings: 2,
  tags: [],
  source: "manual",
  is_favourite: false,
  calories_kcal: null,
  protein_g: null,
  carbs_g: null,
  fat_g: null,
  created_at: "",
  updated_at: "",
  ...overrides,
});

const pantry = (overrides: Partial<PantryItem>): PantryItem => ({
  id: "pantry-1",
  user_id: "user-1",
  name: "",
  quantity: 0,
  unit: "item",
  category: "other",
  expiry_date: null,
  created_at: "",
  updated_at: "",
  ...overrides,
});

test("generateGroceryListFromPlan aggregates ingredients and subtracts pantry quantities", () => {
  const plans = {
    "2026-01-01": { breakfast: "recipe-1", lunch: null },
    "2026-01-02": { breakfast: "recipe-2" },
  };

  const recipes: Recipe[] = [
    recipe({ id: "recipe-1", title: "Omelette", ingredients: [{ name: "Egg", quantity: 3, unit: "item" }] }),
    recipe({ id: "recipe-2", title: "Cake", ingredients: [{ name: "Egg", quantity: 4, unit: "item" }] }),
  ];

  const pantryItems = [pantry({ name: "Egg", quantity: 2, category: "dairy" })];
  const list = generateGroceryListFromPlan(plans, recipes, pantryItems);

  assert.equal(list.length, 1);
  assert.equal(list[0].name, "Egg");
  assert.equal(list[0].quantity, 5);
  assert.deepEqual(list[0].recipe_titles, ["Omelette", "Cake"]);
});
