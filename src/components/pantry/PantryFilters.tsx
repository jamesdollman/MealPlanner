import { Button, Flex, Input, NativeSelectField, NativeSelectRoot } from "@chakra-ui/react";
import { PANTRY_CATEGORIES } from "../../types";

type PantryFiltersProps = {
  searchQuery: string;
  selectedCategory: string | null;
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string | null) => void;
};

const PantryFilters = ({
  searchQuery,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
}: PantryFiltersProps) => {
  return (
    <Flex gap={4} wrap="wrap" align="center">
      <Input
        placeholder="Search pantry..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        maxW="300px"
      />

      <NativeSelectRoot maxW="200px">
        <NativeSelectField
          value={selectedCategory || ""}
          onChange={(e) =>
            onCategoryChange(e.target.value || null)
          }
        >
          <option value="">All Categories</option>
          {PANTRY_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </NativeSelectField>
      </NativeSelectRoot>

      {(searchQuery || selectedCategory) && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onSearchChange("");
            onCategoryChange(null);
          }}
        >
          Clear Filters
        </Button>
      )}
    </Flex>
  );
};

export default PantryFilters;