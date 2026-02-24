import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { useState } from "react";
import { PantryList, AddPantryItemModal } from "../components/pantry";
import { useSession } from "../zustand/user";
import { usePantryStore } from "../zustand/pantry";
import type { PantryItemInsert } from "../types";

const Pantry = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useSession((state) => state.user);
  const { addItem, isLoading } = usePantryStore();

  const handleAddItem = async (item: PantryItemInsert) => {
    if (user?.user?.id) {
      await addItem(user.user.id, item);
      setIsModalOpen(false);
    }
  };

  return (
    <Box p={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">My Pantry</Heading>
        <Button onClick={() => setIsModalOpen(true)}>Add Item</Button>
      </Flex>

      <PantryList />

      <AddPantryItemModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddItem}
        isLoading={isLoading}
      />
    </Box>
  );
};

export default Pantry;