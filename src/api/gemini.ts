import type { PantryItem, RecipeInsert } from "../types";

type Suggestion = {
  title: string;
  description: string;
  tags: string[];
  ingredients: RecipeInsert["ingredients"];
  instructions: string[];
};

type GenerateRecipeOptions = {
  mealType: string;
  prepTime: number;
  servings: number;
  dietaryTags: string[];
  pantryItems: PantryItem[];
  promptNotes?: string;
};

const DEFAULT_GEMINI_API_KEY = "AIzaSyCNjNiF_nLqByjKc4qjKPAt_i38pCqdaec";
const GEMINI_MODEL = "gemini-2.0-flash";

function normalizeSuggestion(input: unknown, fallbackTag: string): Suggestion | null {
  if (typeof input !== "object" || input === null) return null;

  const item = input as {
    title?: unknown;
    description?: unknown;
    tags?: unknown;
    ingredients?: unknown;
    instructions?: unknown;
  };

  if (typeof item.title !== "string" || typeof item.description !== "string") {
    return null;
  }

  const tags = Array.isArray(item.tags)
    ? item.tags.filter((tag): tag is string => typeof tag === "string")
    : [fallbackTag];

  const ingredients = Array.isArray(item.ingredients)
    ? item.ingredients
        .map((ingredient) => {
          if (typeof ingredient !== "object" || ingredient === null) return null;
          const current = ingredient as { name?: unknown; quantity?: unknown; unit?: unknown; notes?: unknown };

          if (typeof current.name !== "string" || typeof current.unit !== "string") return null;

          return {
            name: current.name,
            quantity: typeof current.quantity === "number" ? current.quantity : Number(current.quantity) || 1,
            unit: current.unit,
            notes: typeof current.notes === "string" ? current.notes : undefined,
          };
        })
                .filter((value) => value !== null) as RecipeInsert["ingredients"]
    : [];

  const instructions = Array.isArray(item.instructions)
    ? item.instructions.filter((step): step is string => typeof step === "string")
    : [];

  if (!ingredients.length || !instructions.length) return null;

  return {
    title: item.title,
    description: item.description,
    tags: tags.length ? tags : [fallbackTag],
    ingredients,
    instructions,
  };
}

function extractJsonResponse(rawText: string): unknown {
  const fencedMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const jsonText = fencedMatch ? fencedMatch[1] : rawText;
  return JSON.parse(jsonText);
}

export async function generateGeminiRecipeSuggestions(options: GenerateRecipeOptions): Promise<Suggestion[]> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || DEFAULT_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing Gemini API key. Add VITE_GEMINI_API_KEY to your environment.");
  }

  const pantryNames = options.pantryItems.map((item) => item.name).slice(0, 20);

  const prompt = `Generate exactly 2 recipe suggestions as valid JSON array only.\nRequirements:\n- meal type: ${options.mealType}\n- prep time max: ${options.prepTime} minutes\n- servings: ${options.servings}\n- dietary tags: ${options.dietaryTags.join(", ") || "none"}\n- pantry items to prioritize: ${pantryNames.join(", ") || "none"}\n- additional notes: ${options.promptNotes || "none"}\nJSON shape per recipe:\n{\n  "title": string,\n  "description": string,\n  "tags": string[],\n  "ingredients": [{"name": string, "quantity": number, "unit": string, "notes": string?}],\n  "instructions": string[]\n}\nReturn no markdown and no extra text.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: "application/json",
        },
      }),
    },
  );

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Gemini request failed (${response.status}): ${details || "Unknown error"}`);
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  let parsed: unknown;
  try {
    parsed = extractJsonResponse(text);
  } catch {
    throw new Error("Gemini response was not valid JSON.");
  }

  if (!Array.isArray(parsed)) {
    throw new Error("Gemini response JSON must be an array of recipes.");
  }

  const suggestions = parsed
    .map((entry) => normalizeSuggestion(entry, options.mealType))
    .filter((entry): entry is Suggestion => Boolean(entry));

  if (!suggestions.length) {
    throw new Error("Gemini response did not include usable recipe suggestions.");
  }

  return suggestions.slice(0, 2);
}

export type { Suggestion };
