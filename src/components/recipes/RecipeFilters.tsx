import { Flex, Input, Button } from "@chakra-ui/react";

type RecipeFiltersProps = {
  searchQuery: string;
  showFavouritesOnly: boolean;
  onSearchChange: (query: string) => void;
  onFavouritesToggle: (show: boolean) => void;
  onAddClick: () => void;
};

const RecipeFilters = ({
  searchQuery,
  showFavouritesOnly,
  onSearchChange,
  onFavouritesToggle,
  onAddClick,
}: RecipeFiltersProps) => {
  return (
    <Flex gap={4} wrap="wrap" align="center" justify="space-between">
      <Flex gap={4} wrap="wrap" align="center">
        <Input
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          maxW="300px"
        />

        <Flex align="center" gap={2}>
          <input
            type="checkbox"
            id="favourites-only"
            checked={showFavouritesOnly}
            onChange={(e) => onFavouritesToggle(e.target.checked)}
          />
          <label htmlFor="favourites-only" style={{ fontSize: "14px" }}>
            Favourites only
          </label>
        </Flex>
      </Flex>

      <Button onClick={onAddClick}>Add Recipe</Button>
    </Flex>
  );
};

export default RecipeFilters;