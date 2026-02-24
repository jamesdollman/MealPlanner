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
  onAddClick: () => void;
};

const RecipeGrid = ({ searchQuery, showFavouritesOnly }: RecipeGridProps) => {
  const { recipes, isLoading, error, fetchRecipes, updateRecipe, deleteRecipe, toggleFavourite } =
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

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = searchQuery
      ? recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesFavourites = showFavouritesOnly ? recipe.is_favourite : true;
    return matchesSearch && matchesFavourites;
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
      {error && (
        <Text color="red.fg" mb={4}>
          {error}
        </Text>
      )}

      <Grid
        templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
        gap={4}
      >
        {filteredRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onView={setSelectedRecipe}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleFavourite={toggleFavourite}
          />
        ))}
      </Grid>

      {filteredRecipes.length === 0 && !isLoading && (
        <Text textAlign="center" color="text.muted" mt={8}>
          {searchQuery || showFavouritesOnly
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