import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Input,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { generateGroceryListFromPlan, readCalendarPlanFromStorage } from "../utils/groceryGeneration";
import { trackEvent } from "../utils/observability";
import type { GroceryItem } from "../types";
import { usePantryStore } from "../zustand/pantry";
import { useRecipesStore } from "../zustand/recipes";
import { useSession } from "../zustand/user";

const CALENDAR_STORAGE_KEY = "mealplanner:calendar-v1";
const GROCERY_STORAGE_KEY = "mealplanner:grocery-v1";

const readGroceryListFromStorage = (): GroceryItem[] => {
  try {
    const saved = localStorage.getItem(GROCERY_STORAGE_KEY);
    return saved ? (JSON.parse(saved) as GroceryItem[]) : [];
  } catch {
    return [];
  }
};

const Grocery = () => {
  const user = useSession((state) => state.user);
  const { items: pantryItems, fetchItems } = usePantryStore();
  const { recipes, fetchRecipes } = useRecipesStore();

  const [list, setList] = useState<GroceryItem[]>(readGroceryListFromStorage);
  const [manualName, setManualName] = useState("");

  useEffect(() => {
    if (user?.user?.id) {
      fetchItems(user.user.id);
      fetchRecipes(user.user.id);
    }
  }, [fetchItems, fetchRecipes, user?.user?.id]);

  useEffect(() => {
    localStorage.setItem(GROCERY_STORAGE_KEY, JSON.stringify(list));
  }, [list]);

  const generatedList = useMemo(() => {
    const plans = readCalendarPlanFromStorage(CALENDAR_STORAGE_KEY);
    return generateGroceryListFromPlan(plans, recipes, pantryItems);
  }, [pantryItems, recipes]);

  const regenerate = () => {
    const manualItems = list.filter((item) => !item.recipe_titles?.length);
    const refreshedList = [...generatedList, ...manualItems];
    setList(refreshedList);
    trackEvent("grocery_regenerated", { generated: generatedList.length, manualRetained: manualItems.length });
  };

  const toggleChecked = (target: GroceryItem) => {
    setList((current) =>
      current.map((item) =>
        item.name === target.name && item.unit === target.unit
          ? { ...item, checked: !item.checked }
          : item,
      ),
    );
  };

  const archiveCompleted = () => {
    const completedCount = list.filter((item) => item.checked).length;
    setList((current) => current.filter((item) => !item.checked));
    trackEvent("grocery_archive_completed", { completedCount });
  };

  const addManualItem = () => {
    if (!manualName.trim()) return;
    const trimmedName = manualName.trim();
    setList((current) => [
      ...current,
      { name: trimmedName, quantity: 1, unit: "item", category: "other", checked: false },
    ]);
    setManualName("");
    trackEvent("grocery_manual_item_added", { name: trimmedName });
  };

  return (
    <Box p={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Grocery List</Heading>
        <Flex gap={2}>
          <Button variant="outline" onClick={regenerate}>Regenerate from Plan</Button>
          <Button variant="outline" onClick={archiveCompleted}>Archive Completed</Button>
        </Flex>
      </Flex>

      <Flex gap={2} mb={4}>
        <Input value={manualName} onChange={(e) => setManualName(e.target.value)} placeholder="Add manual grocery item" />
        <Button onClick={addManualItem}>Add</Button>
      </Flex>

      {!list.length && <Text color="fg.muted">No grocery items yet. Regenerate from your calendar meal plan.</Text>}

      {!!list.length && (
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Done</Table.ColumnHeader>
              <Table.ColumnHeader>Item</Table.ColumnHeader>
              <Table.ColumnHeader>Quantity</Table.ColumnHeader>
              <Table.ColumnHeader>Category</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {list.map((item) => (
              <Table.Row key={`${item.name}-${item.unit}`}>
                <Table.Cell>
                  <Checkbox.Root checked={item.checked} onCheckedChange={() => toggleChecked(item)}>
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                  </Checkbox.Root>
                </Table.Cell>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.quantity} {item.unit}</Table.Cell>
                <Table.Cell>{item.category}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}

      <Stack mt={4} gap={1}>
        <Text fontWeight="medium">Generation Rules</Text>
        <Text fontSize="sm" color="fg.muted">• Ingredients assigned in calendar recipes are aggregated.</Text>
        <Text fontSize="sm" color="fg.muted">• Pantry inventory is subtracted to generate deficits only.</Text>
        <Text fontSize="sm" color="fg.muted">• Manual items are preserved when regenerating.</Text>
      </Stack>
    </Box>
  );
};

export default Grocery;
