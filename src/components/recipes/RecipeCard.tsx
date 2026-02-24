import {
  Box,
  Flex,
  IconButton,
  Text,
  Badge,
  Menu,
  Portal,
} from "@chakra-ui/react";
import { FaHeart, FaRegHeart, FaEllipsisV, FaClock } from "react-icons/fa";
import type { Recipe } from "../../types";

type RecipeCardProps = {
  recipe: Recipe;
  onView: (recipe: Recipe) => void;
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: string) => void;
  onDuplicate: (recipe: Recipe) => void;
  onToggleFavourite: (id: string) => void;
};

const RecipeCard = ({
  recipe,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleFavourite,
}: RecipeCardProps) => {
  const totalTime = (recipe.prep_time_min || 0) + (recipe.cook_time_min || 0);

  return (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      bg="bg"
      _hover={{ shadow: "md", cursor: "pointer" }}
      transition="all 0.2s"
      onClick={() => onView(recipe)}
    >
      <Flex justify="space-between" align="start">
        <Box flex={1}>
          <Flex align="center" gap={2}>
            <Text fontWeight="semibold" fontSize="lg">
              {recipe.title}
            </Text>
            <IconButton
              variant="ghost"
              size="sm"
              aria-label={recipe.is_favourite ? "Unfavourite" : "Favourite"}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavourite(recipe.id);
              }}
            >
              {recipe.is_favourite ? (
                <FaHeart color="red" />
              ) : (
                <FaRegHeart />
              )}
            </IconButton>
          </Flex>

          {recipe.description && (
            <Text fontSize="sm" color="text.muted" mt={1} lineClamp={2}>
              {recipe.description}
            </Text>
          )}

          <Flex gap={4} mt={2} wrap="wrap">
            {totalTime > 0 && (
              <Flex align="center" gap={1} fontSize="sm" color="text.subtle">
                <FaClock />
                <Text>{totalTime} min</Text>
              </Flex>
            )}
            <Text fontSize="sm" color="text.subtle">
              {recipe.servings} servings
            </Text>
            {recipe.calories_kcal !== null && (
              <Text fontSize="sm" color="text.subtle">{recipe.calories_kcal} kcal</Text>
            )}
          </Flex>

          {(recipe.protein_g !== null || recipe.carbs_g !== null || recipe.fat_g !== null) && (
            <Flex gap={3} mt={1} wrap="wrap">
              {recipe.protein_g !== null && (
                <Text fontSize="xs" color="text.subtle">P: {recipe.protein_g}g</Text>
              )}
              {recipe.carbs_g !== null && (
                <Text fontSize="xs" color="text.subtle">C: {recipe.carbs_g}g</Text>
              )}
              {recipe.fat_g !== null && (
                <Text fontSize="xs" color="text.subtle">F: {recipe.fat_g}g</Text>
              )}
            </Flex>
          )}

          {recipe.tags && recipe.tags.length > 0 && (
            <Flex gap={1} mt={2} wrap="wrap">
              {recipe.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} size="sm" variant="subtle">
                  {tag}
                </Badge>
              ))}
              {recipe.tags.length > 3 && (
                <Badge size="sm" variant="subtle">
                  +{recipe.tags.length - 3}
                </Badge>
              )}
            </Flex>
          )}
        </Box>

        <Menu.Root>
          <Menu.Trigger asChild>
            <IconButton
              variant="ghost"
              size="sm"
              aria-label="Options"
              onClick={(e) => e.stopPropagation()}
            >
              <FaEllipsisV />
            </IconButton>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item
                  value="view"
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(recipe);
                  }}
                >
                  View
                </Menu.Item>
                <Menu.Item
                  value="edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(recipe);
                  }}
                >
                  Edit
                </Menu.Item>
                <Menu.Item
                  value="duplicate"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate(recipe);
                  }}
                >
                  Duplicate
                </Menu.Item>
                <Menu.Item
                  value="delete"
                  color="red.fg"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(recipe.id);
                  }}
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

export default RecipeCard;