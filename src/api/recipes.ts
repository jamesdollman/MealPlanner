import { supabase } from "./supabase";
import type { Recipe, RecipeInsert, RecipeUpdate, Ingredient } from "../types";

export async function getRecipes(userId: string): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getRecipe(id: string): Promise<Recipe | null> {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createRecipe(
  userId: string,
  recipe: RecipeInsert
): Promise<Recipe> {
  const { data, error } = await supabase
    .from("recipes")
    .insert({ ...recipe, user_id: userId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateRecipe(
  id: string,
  updates: RecipeUpdate
): Promise<Recipe> {
  const { data, error } = await supabase
    .from("recipes")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteRecipe(id: string): Promise<void> {
  const { error } = await supabase.from("recipes").delete().eq("id", id);

  if (error) throw error;
}

export async function toggleFavourite(id: string): Promise<Recipe> {
  const { data: recipe, error: fetchError } = await supabase
    .from("recipes")
    .select("is_favourite")
    .eq("id", id)
    .single();

  if (fetchError) throw fetchError;

  const { data, error } = await supabase
    .from("recipes")
    .update({ is_favourite: !recipe.is_favourite, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getFavouriteRecipes(userId: string): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("user_id", userId)
    .eq("is_favourite", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function searchRecipes(
  userId: string,
  query: string
): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("user_id", userId)
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getRecipesByTag(
  userId: string,
  tag: string
): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("user_id", userId)
    .contains("tags", [tag])
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getRecipesByIngredient(
  userId: string,
  ingredientName: string
): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Filter in JS since JSONB array search is complex
  return (data || []).filter((recipe) =>
    recipe.ingredients.some((ing: Ingredient) =>
      ing.name.toLowerCase().includes(ingredientName.toLowerCase())
    )
  );
}