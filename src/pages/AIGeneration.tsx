import {
  Badge,
  Box,
  Button,
  Field,
  Flex,
  Heading,
  Input,
  NativeSelectField,
  NativeSelectRoot,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import type { PantryItem } from "../types";
import { generateGeminiRecipeSuggestions, type Suggestion } from "../api/gemini";
import { usePantryStore } from "../zustand/pantry";
import { useRecipesStore } from "../zustand/recipes";
import { useSession } from "../zustand/user";

const DIETARY_TAGS = ["vegetarian", "vegan", "gluten_free", "high_protein", "low_carb"];

const createFallbackSuggestions = ({
  mealType,
  prepTime,
  servings,
  dietaryTags,
  pantryItems,
}: {
  mealType: string;
  prepTime: number;
  servings: number;
  dietaryTags: string[];
  pantryItems: PantryItem[];
}): Suggestion[] => {
  const pantryNames = pantryItems.map((item) => item.name).slice(0, 6);
  const hasProtein = pantryNames.some((name) => /chicken|beef|tofu|beans|eggs|salmon|lentil/i.test(name));

  return [
    {
      title: `${mealType[0].toUpperCase()}${mealType.slice(1)} Bowl (${prepTime} min)`,
      description: `A fast ${mealType} bowl using pantry staples and fresh toppings.`,
      tags: [mealType, ...dietaryTags],
      ingredients: [
        { name: pantryNames[0] ?? "rice", quantity: 2, unit: "cups" },
        { name: pantryNames[1] ?? "mixed vegetables", quantity: 1, unit: "cup" },
        { name: hasProtein ? pantryNames.find((name) => /chicken|beef|tofu|beans|eggs|salmon|lentil/i.test(name)) ?? "beans" : "beans", quantity: 1, unit: "cup" },
      ],
      instructions: [
        "Prep and chop ingredients.",
        "Cook core ingredients in one pan.",
        "Season, plate, and serve.",
      ],
    },
    {
      title: `Sheet Pan ${mealType} for ${servings}`,
      description: `Balanced ${mealType} with minimal cleanup and flexible ingredients.`,
      tags: [mealType, ...dietaryTags],
      ingredients: [
        { name: pantryNames[2] ?? "potatoes", quantity: 3, unit: "items" },
        { name: pantryNames[3] ?? "onion", quantity: 1, unit: "item" },
        { name: pantryNames[4] ?? "olive oil", quantity: 2, unit: "tbsp" },
      ],
      instructions: [
        "Preheat oven to 425°F (220°C).",
        "Toss ingredients on a sheet pan with oil and seasoning.",
        "Roast until cooked through and serve hot.",
      ],
    },
  ];
};

const AIGeneration = () => {
  const user = useSession((state) => state.user);
  const { items, fetchItems } = usePantryStore();
  const { addRecipe, fetchRecipes, isLoading } = useRecipesStore();
  const [mealType, setMealType] = useState("dinner");
  const [prepTime, setPrepTime] = useState("30");
  const [servings, setServings] = useState("4");
  const [dietaryTags, setDietaryTags] = useState<string[]>([]);
  const [promptNotes, setPromptNotes] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (user?.user?.id) {
      fetchItems(user.user.id);
      fetchRecipes(user.user.id);
    }
  }, [fetchItems, fetchRecipes, user?.user?.id]);

  const toggleTag = (tag: string) => {
    setDietaryTags((current) => (current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag]));
  };

  const handleGenerate = async () => {
    const prepTimeValue = Number(prepTime);
    const servingsValue = Number(servings);

    if (Number.isNaN(prepTimeValue) || prepTimeValue <= 0 || prepTimeValue > 180) {
      setError("Prep time must be between 1 and 180 minutes.");
      return;
    }

    if (Number.isNaN(servingsValue) || servingsValue <= 0 || servingsValue > 20) {
      setError("Servings must be between 1 and 20.");
      return;
    }

    setError(null);
    setIsGenerating(true);

    const generationOptions = {
      mealType,
      prepTime: prepTimeValue,
      servings: servingsValue,
      dietaryTags,
      pantryItems: items,
      promptNotes,
    };

    try {
      const geminiSuggestions = await generateGeminiRecipeSuggestions(generationOptions);
      setSuggestions(geminiSuggestions);
    } catch (generationError) {
      const message = generationError instanceof Error ? generationError.message : "Unknown generation error.";
      setSuggestions(createFallbackSuggestions(generationOptions));
      setError(`Gemini is unavailable right now, so we generated local suggestions instead. ${message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveToRecipes = async (suggestion: Suggestion) => {
    if (!user?.user?.id) return;

    await addRecipe(user.user.id, {
      title: suggestion.title,
      description: `${suggestion.description}${promptNotes ? ` Notes: ${promptNotes}` : ""}`,
      ingredients: suggestion.ingredients,
      instructions: suggestion.instructions,
      prep_time_min: Number(prepTime),
      cook_time_min: 20,
      servings: Number(servings),
      tags: suggestion.tags,
      source: "ai_generated",
      is_favourite: false,
    });
  };

  return (
    <Box p={6}>
      <Heading size="lg" mb={6}>AI Meal Generation</Heading>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
        <Stack gap={4}>
          <Field.Root>
            <Field.Label>Meal Type</Field.Label>
            <NativeSelectRoot>
              <NativeSelectField value={mealType} onChange={(e) => setMealType(e.target.value)}>
                {['breakfast', 'lunch', 'dinner', 'snack'].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </NativeSelectField>
            </NativeSelectRoot>
          </Field.Root>

          <Field.Root>
            <Field.Label>Prep Time (minutes)</Field.Label>
            <Input value={prepTime} onChange={(e) => setPrepTime(e.target.value)} type="number" min={1} max={180} />
          </Field.Root>

          <Field.Root>
            <Field.Label>Servings</Field.Label>
            <Input value={servings} onChange={(e) => setServings(e.target.value)} type="number" min={1} max={20} />
          </Field.Root>

          <Field.Root>
            <Field.Label>Prompt Notes</Field.Label>
            <Textarea
              value={promptNotes}
              onChange={(e) => setPromptNotes(e.target.value.slice(0, 250))}
              placeholder="Any specific flavors or constraints?"
            />
          </Field.Root>

          <Box>
            <Text mb={2} fontWeight="medium">Dietary Tags</Text>
            <Flex wrap="wrap" gap={2}>
              {DIETARY_TAGS.map((tag) => (
                <Button key={tag} size="xs" variant={dietaryTags.includes(tag) ? "solid" : "outline"} onClick={() => toggleTag(tag)}>
                  {tag}
                </Button>
              ))}
            </Flex>
          </Box>

          <Button onClick={handleGenerate} loading={isGenerating}>Generate Suggestions</Button>
          {error && <Text color="red.fg">{error}</Text>}
        </Stack>

        <Stack gap={4}>
          <Text fontWeight="medium">Generated Suggestions</Text>
          {!suggestions.length && <Text color="fg.muted">No suggestions yet. Generate meals to get started.</Text>}
          {suggestions.map((suggestion) => (
            <Box key={suggestion.title} borderWidth="1px" borderRadius="md" p={4}>
              <Heading size="sm">{suggestion.title}</Heading>
              <Text mt={2}>{suggestion.description}</Text>
              <Flex gap={2} mt={3} wrap="wrap">
                {suggestion.tags.map((tag) => (
                  <Badge key={`${suggestion.title}-${tag}`}>{tag}</Badge>
                ))}
              </Flex>
              <Button mt={3} size="sm" onClick={() => saveToRecipes(suggestion)} loading={isLoading}>
                Save to Recipes
              </Button>
            </Box>
          ))}
        </Stack>
      </SimpleGrid>
    </Box>
  );
};

export default AIGeneration;
