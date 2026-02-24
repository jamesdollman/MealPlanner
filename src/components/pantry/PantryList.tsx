import { Box, Grid, Text, Spinner, Center } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSession } from "../../zustand/user";
import { usePantryStore } from "../../zustand/pantry";
import type { PantryItem, PantryItemInsert } from "../../types";
import PantryItemCard from "./PantryItemCard";
import AddPantryItemModal from "./AddPantryItemModal";
import PantryFilters from "./PantryFilters";

const PantryList = () => {
  const { items, isLoading, error, fetchItems, addItem, updateItem, deleteItem, searchQuery, selectedCategory, setSearchQuery, setSelectedCategory } =
    usePantryStore();
  const user = useSession((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<PantryItem | null>(null);

  useEffect(() => {
    if (user?.user?.id) {
      fetchItems(user.user.id);
    }
  }, [user?.user?.id, fetchItems]);

  const filteredItems = items.filter((item) => {
    const matchesSearch = searchQuery
      ? item.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesCategory = selectedCategory
      ? item.category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = async (item: PantryItemInsert) => {
    if (user?.user?.id) {
      await addItem(user.user.id, item);
      setIsModalOpen(false);
    }
  };

  const handleUpdateItem = async (item: PantryItemInsert) => {
    if (editItem) {
      await updateItem(editItem.id, item);
      setEditItem(null);
      setIsModalOpen(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      await deleteItem(id);
    }
  };

  const handleEditItem = (item: PantryItem) => {
    setEditItem(item);
    setIsModalOpen(true);
  };

  if (isLoading && items.length === 0) {
    return (
      <Center h="200px">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box>
      <PantryFilters
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        onSearchChange={setSearchQuery}
        onCategoryChange={setSelectedCategory}
      />

      {/* TODO(step-1-scope): extend loading/error/empty treatment to modals/forms in a later pass. */}
      {error && (
        <Text color="red.fg" mt={4}>
          {error}
        </Text>
      )}

      <Grid
        templateColumns="repeat(auto-fill, minmax(250px, 1fr))"
        gap={4}
        mt={6}
      >
        {filteredItems.map((item) => (
          <PantryItemCard
            key={item.id}
            item={item}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
          />
        ))}
      </Grid>

      {filteredItems.length === 0 && !isLoading && (
        <Text textAlign="center" color="text.muted" mt={8}>
          {searchQuery || selectedCategory
            ? "No items match your filters"
            : "Your pantry is empty. Add some items to get started!"}
        </Text>
      )}

      <AddPantryItemModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditItem(null);
        }}
        onSubmit={editItem ? handleUpdateItem : handleAddItem}
        editItem={editItem}
        isLoading={isLoading}
      />
    </Box>
  );
};

export default PantryList;