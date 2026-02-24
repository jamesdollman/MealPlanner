import { Box, Grid, Text, Spinner, Center } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSession } from "../../zustand/user";
import { useRecipesStore } from "../../zustand/recipes";
import type { Recipe, RecipeInsert } from "../../types";
import RecipeCard from "./RecipeCard";
import RecipeModal from "./RecipeModal";
import RecipeForm from "./RecipeForm";

type RecipeGridProps = {
  searchQuery: string;
  showFavouritesOnly: boolean;
  selectedTag: string;
  maxTotalTime: string;
};

const RecipeGrid = ({ searchQuery, showFavouritesOnly, selectedTag, maxTotalTime }: RecipeGridProps) => {
  const { recipes, isLoading, error, fetchRecipes, updateRecipe, deleteRecipe, toggleFavourite, addRecipe } =
    useRecipesStore();
  const user = useSession((state) => state.user);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [editRecipe, setEditRecipe] = useState<Recipe | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (user?.user?.id) {
      fetchRecipes(user.user.id);
    }
  }, [user?.user?.id, fetchRecipes]);

  const maxTime = maxTotalTime ? parseInt(maxTotalTime, 10) : null;
  const normalizedTag = selectedTag.trim().toLowerCase();

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = searchQuery
      ? recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesFavourites = showFavouritesOnly ? recipe.is_favourite : true;
    const matchesTag = normalizedTag
      ? recipe.tags.some((tag) => tag.toLowerCase().includes(normalizedTag))
      : true;
    const totalTime = (recipe.prep_time_min || 0) + (recipe.cook_time_min || 0);
    const matchesTime = maxTime !== null ? totalTime <= maxTime : true;
    return matchesSearch && matchesFavourites && matchesTag && matchesTime;
  });

  const handleEdit = (recipe: Recipe) => {
    setSelectedRecipe(null);
    setEditRecipe(recipe);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteRecipe(id);
    if (selectedRecipe?.id === id) {
      setSelectedRecipe(null);
    }
  };

  const handleDuplicate = async (recipe: Recipe) => {
    if (!user?.user?.id) return;
    const duplicated: RecipeInsert = {
      title: `${recipe.title} (Copy)`,
      description: recipe.description,
      ingredients: recipe.ingredients.map((ingredient) => ({ ...ingredient })),
      instructions: [...recipe.instructions],
      prep_time_min: recipe.prep_time_min,
      cook_time_min: recipe.cook_time_min,
      servings: recipe.servings,
      tags: [...recipe.tags],
      source: recipe.source,
      is_favourite: false,
      calories_kcal: recipe.calories_kcal,
      protein_g: recipe.protein_g,
      carbs_g: recipe.carbs_g,
      fat_g: recipe.fat_g,
    };
    await addRecipe(user.user.id, duplicated);
  };

  const handleFormSubmit = async (recipeData: RecipeInsert) => {
    if (editRecipe) {
      await updateRecipe(editRecipe.id, recipeData);
      setEditRecipe(null);
    }
    setIsFormOpen(false);
  };

  if (isLoading && recipes.length === 0) {
    return (
      <Center h="200px">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box>
      {/* TODO(step-1-scope): extend loading/error/empty treatment to modals/forms in a later pass. */}
      {error && (
        <Text color="red.fg" mb={4}>
          {error}
        </Text>
      )}

      <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
        {filteredRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onView={setSelectedRecipe}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onToggleFavourite={toggleFavourite}
          />
        ))}
      </Grid>

      {filteredRecipes.length === 0 && !isLoading && (
        <Text textAlign="center" color="text.muted" mt={8}>
          {searchQuery || showFavouritesOnly || selectedTag || maxTotalTime
            ? "No recipes match your filters"
            : "No recipes yet. Add your first recipe to get started!"}
        </Text>
      )}

      <RecipeModal
        recipe={selectedRecipe}
        open={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleFavourite={toggleFavourite}
      />

      <RecipeForm
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditRecipe(null);
        }}
        onSubmit={handleFormSubmit}
        editRecipe={editRecipe}
        isLoading={isLoading}
      />
    </Box>
  );
};

export default RecipeGrid;
