export type PantryItem = {
  id: string;
  user_id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  expiry_date: string | null;
  created_at: string;
  updated_at: string;
};

export type PantryItemInsert = Omit<PantryItem, "id" | "user_id" | "created_at" | "updated_at">;
export type PantryItemUpdate = Partial<PantryItemInsert>;

export const PANTRY_CATEGORIES = [
  "produce",
  "dairy",
  "meat",
  "seafood",
  "grains",
  "canned",
  "frozen",
  "condiments",
  "spices",
  "beverages",
  "snacks",
  "baking",
  "other",
] as const;

export type PantryCategory = (typeof PANTRY_CATEGORIES)[number];

export const PANTRY_UNITS = [
  "item",
  "items",
  "g",
  "kg",
  "oz",
  "lb",
  "ml",
  "l",
  "cup",
  "cups",
  "tbsp",
  "tsp",
  "piece",
  "pieces",
  "slice",
  "slices",
  "can",
  "cans",
  "bottle",
  "bottles",
  "package",
  "packages",
  "box",
  "boxes",
] as const;

export type PantryUnit = (typeof PANTRY_UNITS)[number];