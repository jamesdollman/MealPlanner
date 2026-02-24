import { Flex, Input, Button } from "@chakra-ui/react";

type RecipeFiltersProps = {
  searchQuery: string;
  showFavouritesOnly: boolean;
  selectedTag: string;
  maxTotalTime: string;
  onSearchChange: (query: string) => void;
  onFavouritesToggle: (show: boolean) => void;
  onTagChange: (tag: string) => void;
  onMaxTotalTimeChange: (value: string) => void;
  onAddClick: () => void;
};

const RecipeFilters = ({
  searchQuery,
  showFavouritesOnly,
  selectedTag,
  maxTotalTime,
  onSearchChange,
  onFavouritesToggle,
  onTagChange,
  onMaxTotalTimeChange,
  onAddClick,
}: RecipeFiltersProps) => {
  return (
    <Flex gap={4} wrap="wrap" align="center" justify="space-between">
      <Flex gap={4} wrap="wrap" align="center">
        <Input
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          maxW="260px"
        />

        <Input
          placeholder="Filter tag"
          value={selectedTag}
          onChange={(e) => onTagChange(e.target.value)}
          maxW="180px"
        />

        <Input
          placeholder="Max total time (min)"
          type="number"
          min={0}
          value={maxTotalTime}
          onChange={(e) => onMaxTotalTimeChange(e.target.value)}
          maxW="200px"
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
