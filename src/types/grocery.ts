export type GroceryItem = {
  name: string;
  quantity: number;
  unit: string;
  category: string;
  checked: boolean;
  recipe_titles?: string[];
};

export type GroceryList = {
  id: string;
  user_id: string;
  week_start_date: string;
  items: GroceryItem[];
  created_at: string;
  updated_at: string;
};

export type GroceryListInsert = Omit<GroceryList, "id" | "user_id" | "created_at" | "updated_at">;
export type GroceryListUpdate = Partial<GroceryListInsert>;