import {
  Box,
  Button,
  Flex,
  Grid,
  Text,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "../../zustand/user";
import { usePantryStore } from "../../zustand/pantry";
import type { PantryItem, PantryItemInsert } from "../../types";
import PantryItemCard from "./PantryItemCard";
import AddPantryItemModal from "./AddPantryItemModal";
import PantryFilters from "./PantryFilters";

const LOW_STOCK_THRESHOLD = 2;
const PantryList = () => {
  const { items, isLoading, error, fetchItems, addItem, updateItem, deleteItem, searchQuery, selectedCategory, setSearchQuery, setSelectedCategory } =
    usePantryStore();
  const user = useSession((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<PantryItem | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [showExpiringSoonOnly, setShowExpiringSoonOnly] = useState(false);

  useEffect(() => {
    if (user?.user?.id) {
      fetchItems(user.user.id);
    }
  }, [user?.user?.id, fetchItems]);

  const now = new Date();
  const soonCutoff = new Date();
  soonCutoff.setDate(soonCutoff.getDate() + 7);
  const nowMs = now.getTime();
  const soonCutoffMs = soonCutoff.getTime();

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        const matchesSearch = searchQuery
          ? item.name.toLowerCase().includes(searchQuery.toLowerCase())
          : true;
        const matchesCategory = selectedCategory
          ? item.category === selectedCategory
          : true;
        const isLowStock = item.quantity <= LOW_STOCK_THRESHOLD;
        const expiresAt = item.expiry_date ? new Date(item.expiry_date).getTime() : null;
        const isExpiringSoon =
          expiresAt !== null && expiresAt >= nowMs && expiresAt <= soonCutoffMs;
        const matchesLowStock = showLowStockOnly ? isLowStock : true;
        const matchesExpiringSoon = showExpiringSoonOnly ? isExpiringSoon : true;

        return matchesSearch && matchesCategory && matchesLowStock && matchesExpiringSoon;
      }),
    [items, searchQuery, selectedCategory, showLowStockOnly, showExpiringSoonOnly, nowMs, soonCutoffMs]
  );

  const lowStockCount = items.filter((item) => item.quantity <= LOW_STOCK_THRESHOLD).length;
  const expiringSoonCount = items.filter((item) => {
    if (!item.expiry_date) return false;
    const expiresAt = new Date(item.expiry_date).getTime();
    return expiresAt >= nowMs && expiresAt <= soonCutoffMs;
  }).length;

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
      setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Delete ${selectedIds.length} selected items?`)) return;

    for (const id of selectedIds) {
      await deleteItem(id);
    }
    setSelectedIds([]);
  };

  const handleCategoryBulkSet = async (category: string) => {
    if (selectedIds.length === 0) return;
    for (const id of selectedIds) {
      const selectedItem = items.find((item) => item.id === id);
      if (selectedItem && selectedItem.category !== category) {
        await updateItem(id, { category });
      }
    }
    setSelectedIds([]);
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
        showLowStockOnly={showLowStockOnly}
        showExpiringSoonOnly={showExpiringSoonOnly}
        onSearchChange={setSearchQuery}
        onCategoryChange={setSelectedCategory}
        onLowStockToggle={setShowLowStockOnly}
        onExpiringSoonToggle={setShowExpiringSoonOnly}
      />

      <Flex mt={4} gap={2} wrap="wrap" align="center">
        <Text fontSize="sm" color={lowStockCount > 0 ? "orange.fg" : "text.muted"}>
          {lowStockCount} low-stock item{lowStockCount === 1 ? "" : "s"}
        </Text>
        <Text fontSize="sm" color={expiringSoonCount > 0 ? "orange.fg" : "text.muted"}>
          {expiringSoonCount} expiring soon
        </Text>
      </Flex>

      {selectedIds.length > 0 && (
        <Flex mt={4} gap={2} wrap="wrap" align="center">
          <Text fontSize="sm">{selectedIds.length} selected</Text>
          <Button size="sm" variant="outline" colorPalette="red" onClick={handleDeleteSelected}>
            Delete Selected
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleCategoryBulkSet("produce")}>
            Set Produce
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleCategoryBulkSet("other")}>
            Set Other
          </Button>
        </Flex>
      )}

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
            isSelected={selectedIds.includes(item.id)}
            onToggleSelect={(id, checked) =>
              setSelectedIds((prev) =>
                checked ? [...prev, id] : prev.filter((currentId) => currentId !== id)
              )
            }
          />
        ))}
      </Grid>

      {filteredItems.length === 0 && !isLoading && (
        <Text textAlign="center" color="text.muted" mt={8}>
          {searchQuery || selectedCategory || showLowStockOnly || showExpiringSoonOnly
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
