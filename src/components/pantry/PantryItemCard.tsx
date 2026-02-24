import {
  Box,
  Flex,
  IconButton,
  Menu,
  Portal,
  Text,
} from "@chakra-ui/react";
import { FaEllipsisV, FaClock } from "react-icons/fa";
import type { PantryItem } from "../../types";

type PantryItemCardProps = {
  item: PantryItem;
  onEdit: (item: PantryItem) => void;
  onDelete: (id: string) => void;
};

const PantryItemCard = ({ item, onEdit, onDelete }: PantryItemCardProps) => {
  const isExpiringSoon =
    item.expiry_date &&
    new Date(item.expiry_date) <=
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const isExpired =
    item.expiry_date && new Date(item.expiry_date) < new Date();

  return (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      bg={isExpired ? "red.subtle" : isExpiringSoon ? "orange.subtle" : "bg"}
      _hover={{ shadow: "md" }}
      transition="all 0.2s"
    >
      <Flex justify="space-between" align="start">
        <Box flex={1}>
          <Flex align="center" gap={2}>
            <Text fontWeight="semibold">{item.name}</Text>
            {(isExpiringSoon || isExpired) && (
              <FaClock color={isExpired ? "red" : "orange"} />
            )}
          </Flex>
          <Text fontSize="sm" color="text.muted">
            {item.quantity} {item.unit}
          </Text>
          <Text fontSize="xs" color="text.subtle" textTransform="capitalize">
            {item.category}
          </Text>
          {item.expiry_date && (
            <Text
              fontSize="xs"
              color={isExpired ? "red.fg" : isExpiringSoon ? "orange.fg" : "text.subtle"}
            >
              Expires: {new Date(item.expiry_date).toLocaleDateString()}
            </Text>
          )}
        </Box>

        <Menu.Root>
          <Menu.Trigger asChild>
            <IconButton variant="ghost" size="sm" aria-label="Options">
              <FaEllipsisV />
            </IconButton>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value="edit" onClick={() => onEdit(item)}>
                  Edit
                </Menu.Item>
                <Menu.Item
                  value="delete"
                  color="red.fg"
                  onClick={() => onDelete(item.id)}
                >
                  Delete
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </Flex>
    </Box>
  );
};

export default PantryItemCard;