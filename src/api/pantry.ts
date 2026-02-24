import { supabase } from "./supabase";
import type { PantryItem, PantryItemInsert, PantryItemUpdate } from "../types";

export async function getPantryItems(userId: string): Promise<PantryItem[]> {
  const { data, error } = await supabase
    .from("pantry_items")
    .select("*")
    .eq("user_id", userId)
    .order("name", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getPantryItem(id: string): Promise<PantryItem | null> {
  const { data, error } = await supabase
    .from("pantry_items")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createPantryItem(
  userId: string,
  item: PantryItemInsert
): Promise<PantryItem> {
  const { data, error } = await supabase
    .from("pantry_items")
    .insert({ ...item, user_id: userId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePantryItem(
  id: string,
  updates: PantryItemUpdate
): Promise<PantryItem> {
  const { data, error } = await supabase
    .from("pantry_items")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePantryItem(id: string): Promise<void> {
  const { error } = await supabase
    .from("pantry_items")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function getPantryItemsByCategory(
  userId: string,
  category: string
): Promise<PantryItem[]> {
  const { data, error } = await supabase
    .from("pantry_items")
    .select("*")
    .eq("user_id", userId)
    .eq("category", category)
    .order("name", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function searchPantryItems(
  userId: string,
  query: string
): Promise<PantryItem[]> {
  const { data, error } = await supabase
    .from("pantry_items")
    .select("*")
    .eq("user_id", userId)
    .ilike("name", `%${query}%`)
    .order("name", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getExpiringItems(
  userId: string,
  days: number = 7
): Promise<PantryItem[]> {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);

  const { data, error } = await supabase
    .from("pantry_items")
    .select("*")
    .eq("user_id", userId)
    .not("expiry_date", "is", null)
    .lte("expiry_date", futureDate.toISOString().split("T")[0])
    .order("expiry_date", { ascending: true });

  if (error) throw error;
  return data || [];
}