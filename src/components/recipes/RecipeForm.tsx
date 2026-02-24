import {
  Box,
  Button,
  Dialog,
  Field,
  Flex,
  IconButton,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import type { Recipe, RecipeInsert, Ingredient } from "../../types";

type RecipeFormProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (recipe: RecipeInsert) => void;
  editRecipe?: Recipe | null;
  isLoading?: boolean;
};

const defaultRecipe: RecipeInsert = {
  title: "",
  description: "",
  ingredients: [{ name: "", quantity: 1, unit: "item" }],
  instructions: [""],
  prep_time_min: null,
  cook_time_min: null,
  servings: 4,
  tags: [],
  source: "manual",
  is_favourite: false,
  calories_kcal: null,
  protein_g: null,
  carbs_g: null,
  fat_g: null,
};

const RecipeForm = ({
  open,
  onClose,
  onSubmit,
  editRecipe,
  isLoading,
}: RecipeFormProps) => {
  const [recipe, setRecipe] = useState<RecipeInsert>(defaultRecipe);
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editRecipe) {
      setRecipe({
        title: editRecipe.title,
        description: editRecipe.description || "",
        ingredients: editRecipe.ingredients,
        instructions: editRecipe.instructions,
        prep_time_min: editRecipe.prep_time_min,
        cook_time_min: editRecipe.cook_time_min,
        servings: editRecipe.servings,
        tags: editRecipe.tags,
        source: editRecipe.source,
        is_favourite: editRecipe.is_favourite,
        calories_kcal: editRecipe.calories_kcal,
        protein_g: editRecipe.protein_g,
        carbs_g: editRecipe.carbs_g,
        fat_g: editRecipe.fat_g,
      });
    } else {
      setRecipe(defaultRecipe);
    }
    setErrors({});
  }, [editRecipe, open]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!recipe.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (recipe.ingredients.length === 0 || recipe.ingredients.every(i => !i.name.trim())) {
      newErrors.ingredients = "At least one ingredient is required";
    }
    if (recipe.instructions.length === 0 || recipe.instructions.every(i => !i.trim())) {
      newErrors.instructions = "At least one instruction is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      const cleanedRecipe = {
        ...recipe,
        ingredients: recipe.ingredients.filter(i => i.name.trim()),
        instructions: recipe.instructions.filter(i => i.trim()),
      };
      onSubmit(cleanedRecipe);
    }
  };

  const addIngredient = () => {
    setRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, { name: "", quantity: 1, unit: "item" }],
    });
  };

  const updateIngredient = (index: number, updates: Partial<Ingredient>) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = { ...newIngredients[index], ...updates };
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  const removeIngredient = (index: number) => {
    if (recipe.ingredients.length > 1) {
      setRecipe({
        ...recipe,
        ingredients: recipe.ingredients.filter((_, i) => i !== index),
      });
    }
  };

  const addInstruction = () => {
    setRecipe({
      ...recipe,
      instructions: [...recipe.instructions, ""],
    });
  };

  const updateInstruction = (index: number, value: string) => {
    const newInstructions = [...recipe.instructions];
    newInstructions[index] = value;
    setRecipe({ ...recipe, instructions: newInstructions });
  };

  const removeInstruction = (index: number) => {
    if (recipe.instructions.length > 1) {
      setRecipe({
        ...recipe,
        instructions: recipe.instructions.filter((_, i) => i !== index),
      });
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !recipe.tags.includes(tagInput.trim())) {
      setRecipe({
        ...recipe,
        tags: [...recipe.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setRecipe({
      ...recipe,
      tags: recipe.tags.filter((t) => t !== tag),
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="xl">
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content maxH="90vh" overflowY="auto">
          <Dialog.Header>
            <Dialog.Title>
              {editRecipe ? "Edit Recipe" : "Add Recipe"}
            </Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Stack gap={4}>
              <Field.Root invalid={!!errors.title}>
                <Field.Label>Title</Field.Label>
                <Input
                  value={recipe.title}
                  onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
                  placeholder="Recipe title"
                />
                {errors.title && <Field.ErrorText>{errors.title}</Field.ErrorText>}
              </Field.Root>

              <Field.Root>
                <Field.Label>Description (optional)</Field.Label>
                <Input
                  value={recipe.description || ""}
                  onChange={(e) => setRecipe({ ...recipe, description: e.target.value })}
                  placeholder="Brief description"
                />
              </Field.Root>

              <Flex gap={4}>
                <Field.Root flex={1}>
                  <Field.Label>Prep Time (min)</Field.Label>
                  <Input
                    type="number"
                    min={0}
                    value={recipe.prep_time_min || ""}
                    onChange={(e) =>
                      setRecipe({
                        ...recipe,
                        prep_time_min: e.target.value ? parseInt(e.target.value) : null,
                      })
                    }
                  />
                </Field.Root>

                <Field.Root flex={1}>
                  <Field.Label>Cook Time (min)</Field.Label>
                  <Input
                    type="number"
                    min={0}
                    value={recipe.cook_time_min || ""}
                    onChange={(e) =>
                      setRecipe({
                        ...recipe,
                        cook_time_min: e.target.value ? parseInt(e.target.value) : null,
                      })
                    }
                  />
                </Field.Root>

                <Field.Root flex={1}>
                  <Field.Label>Servings</Field.Label>
                  <Input
                    type="number"
                    min={1}
                    value={recipe.servings}
                    onChange={(e) =>
                      setRecipe({ ...recipe, servings: parseInt(e.target.value) || 4 })
                    }
                  />
                </Field.Root>
              </Flex>


              <Flex gap={4}>
                <Field.Root flex={1}>
                  <Field.Label>Calories (kcal)</Field.Label>
                  <Input
                    type="number"
                    min={0}
                    value={recipe.calories_kcal || ""}
                    onChange={(e) =>
                      setRecipe({
                        ...recipe,
                        calories_kcal: e.target.value ? parseInt(e.target.value) : null,
                      })
                    }
                  />
                </Field.Root>

                <Field.Root flex={1}>
                  <Field.Label>Protein (g)</Field.Label>
                  <Input
                    type="number"
                    min={0}
                    value={recipe.protein_g || ""}
                    onChange={(e) =>
                      setRecipe({
                        ...recipe,
                        protein_g: e.target.value ? parseInt(e.target.value) : null,
                      })
                    }
                  />
                </Field.Root>

                <Field.Root flex={1}>
                  <Field.Label>Carbs (g)</Field.Label>
                  <Input
                    type="number"
                    min={0}
                    value={recipe.carbs_g || ""}
                    onChange={(e) =>
                      setRecipe({
                        ...recipe,
                        carbs_g: e.target.value ? parseInt(e.target.value) : null,
                      })
                    }
                  />
                </Field.Root>

                <Field.Root flex={1}>
                  <Field.Label>Fat (g)</Field.Label>
                  <Input
                    type="number"
                    min={0}
                    value={recipe.fat_g || ""}
                    onChange={(e) =>
                      setRecipe({
                        ...recipe,
                        fat_g: e.target.value ? parseInt(e.target.value) : null,
                      })
                    }
                  />
                </Field.Root>
              </Flex>

              <Field.Root invalid={!!errors.ingredients}>
                <Field.Label>Ingredients</Field.Label>
                <Stack gap={2}>
                  {recipe.ingredients.map((ingredient, index) => (
                    <Flex key={index} gap={2} align="center">
                      <Input
                        flex={2}
                        placeholder="Name"
                        value={ingredient.name}
                        onChange={(e) =>
                          updateIngredient(index, { name: e.target.value })
                        }
                      />
                      <Input
                        flex={1}
                        type="number"
                        min={0}
                        step={0.1}
                        placeholder="Qty"
                        value={ingredient.quantity}
                        onChange={(e) =>
                          updateIngredient(index, {
                            quantity: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                      <Input
                        flex={1}
                        placeholder="Unit"
                        value={ingredient.unit}
                        onChange={(e) =>
                          updateIngredient(index, { unit: e.target.value })
                        }
                      />
                      <IconButton
                        variant="ghost"
                        size="sm"
                        aria-label="Remove ingredient"
                        onClick={() => removeIngredient(index)}
                        disabled={recipe.ingredients.length === 1}
                      >
                        <FaTrash />
                      </IconButton>
                    </Flex>
                  ))}
                  <Button size="sm" variant="outline" onClick={addIngredient}>
                    <FaPlus style={{ marginRight: "4px" }} />
                    Add Ingredient
                  </Button>
                </Stack>
                {errors.ingredients && (
                  <Field.ErrorText>{errors.ingredients}</Field.ErrorText>
                )}
              </Field.Root>

              <Field.Root invalid={!!errors.instructions}>
                <Field.Label>Instructions</Field.Label>
                <Stack gap={2}>
                  {recipe.instructions.map((instruction, index) => (
                    <Flex key={index} gap={2} align="flex-start">
                      <Text mt={2} color="text.muted" minW="24px">
                        {index + 1}.
                      </Text>
                      <Input
                        flex={1}
                        placeholder="Step description"
                        value={instruction}
                        onChange={(e) => updateInstruction(index, e.target.value)}
                      />
                      <IconButton
                        variant="ghost"
                        size="sm"
                        mt={1}
                        aria-label="Remove instruction"
                        onClick={() => removeInstruction(index)}
                        disabled={recipe.instructions.length === 1}
                      >
                        <FaTrash />
                      </IconButton>
                    </Flex>
                  ))}
                  <Button size="sm" variant="outline" onClick={addInstruction}>
                    <FaPlus style={{ marginRight: "4px" }} />
                    Add Step
                  </Button>
                </Stack>
                {errors.instructions && (
                  <Field.ErrorText>{errors.instructions}</Field.ErrorText>
                )}
              </Field.Root>

              <Field.Root>
                <Field.Label>Tags</Field.Label>
                <Flex gap={2} wrap="wrap" mb={2}>
                  {recipe.tags.map((tag) => (
                    <Box
                      key={tag}
                      px={2}
                      py={1}
                      borderRadius="md"
                      bg="bg.subtle"
                      fontSize="sm"
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      {tag}
                      <IconButton
                        variant="ghost"
                        size="xs"
                        aria-label="Remove tag"
                        onClick={() => removeTag(tag)}
                      >
                        ×
                      </IconButton>
                    </Box>
                  ))}
                </Flex>
                <Flex gap={2}>
                  <Input
                    placeholder="Add a tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button variant="outline" onClick={addTag}>
                    Add
                  </Button>
                </Flex>
              </Field.Root>
            </Stack>
          </Dialog.Body>
          <Dialog.Footer>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} loading={isLoading}>
              {editRecipe ? "Save Changes" : "Add Recipe"}
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default RecipeForm;