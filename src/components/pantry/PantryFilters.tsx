import { Button, Flex, Input, NativeSelectField, NativeSelectRoot } from "@chakra-ui/react";
import { PANTRY_CATEGORIES } from "../../types";

type PantryFiltersProps = {
  searchQuery: string;
  selectedCategory: string | null;
  showLowStockOnly: boolean;
  showExpiringSoonOnly: boolean;
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string | null) => void;
  onLowStockToggle: (enabled: boolean) => void;
  onExpiringSoonToggle: (enabled: boolean) => void;
};

const PantryFilters = ({
  searchQuery,
  selectedCategory,
  showLowStockOnly,
  showExpiringSoonOnly,
  onSearchChange,
  onCategoryChange,
  onLowStockToggle,
  onExpiringSoonToggle,
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

      <label style={{ fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
        <input
          type="checkbox"
          checked={showLowStockOnly}
          onChange={(e) => onLowStockToggle(e.target.checked)}
        />
        Low stock
      </label>

      <label style={{ fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
        <input
          type="checkbox"
          checked={showExpiringSoonOnly}
          onChange={(e) => onExpiringSoonToggle(e.target.checked)}
        />
        Expiring soon
      </label>

      {(searchQuery || selectedCategory || showLowStockOnly || showExpiringSoonOnly) && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onSearchChange("");
            onCategoryChange(null);
            onLowStockToggle(false);
            onExpiringSoonToggle(false);
          }}
        >
          Clear Filters
        </Button>
      )}
    </Flex>
  );
};

export default PantryFilters;
