import { Box, Heading } from "@chakra-ui/react";
import { useState } from "react";
import { RecipeFilters, RecipeGrid, RecipeForm } from "../components/recipes";
import { useSession } from "../zustand/user";
import { useRecipesStore } from "../zustand/recipes";
import type { RecipeInsert } from "../types";

const Recipes = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState("");
  const [maxTotalTime, setMaxTotalTime] = useState("");
  const user = useSession((state) => state.user);
  const { searchQuery, showFavouritesOnly, setSearchQuery, setShowFavouritesOnly, addRecipe, isLoading } =
    useRecipesStore();

  const handleAddRecipe = async (recipe: RecipeInsert) => {
    if (user?.user?.id) {
      await addRecipe(user.user.id, recipe);
      setIsFormOpen(false);
    }
  };

  return (
    <Box p={6}>
      <Heading size="lg" mb={6}>
        Recipes
      </Heading>

      <RecipeFilters
        searchQuery={searchQuery}
        showFavouritesOnly={showFavouritesOnly}
        onSearchChange={setSearchQuery}
        onFavouritesToggle={setShowFavouritesOnly}
        selectedTag={selectedTag}
        maxTotalTime={maxTotalTime}
        onTagChange={setSelectedTag}
        onMaxTotalTimeChange={setMaxTotalTime}
        onAddClick={() => setIsFormOpen(true)}
      />

      <Box mt={6}>
        <RecipeGrid
          searchQuery={searchQuery}
          showFavouritesOnly={showFavouritesOnly}
          selectedTag={selectedTag}
          maxTotalTime={maxTotalTime}
        />
      </Box>

      <RecipeForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddRecipe}
        isLoading={isLoading}
      />
    </Box>
  );
};

export default Recipes;