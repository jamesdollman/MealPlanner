import {
  Box,
  Dialog,
  Flex,
  IconButton,
  Portal,
  Stack,
  Text,
  Badge,
} from "@chakra-ui/react";
import { FaHeart, FaRegHeart, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import type { Recipe } from "../../types";

type RecipeModalProps = {
  recipe: Recipe | null;
  open: boolean;
  onClose: () => void;
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: string) => void;
  onToggleFavourite: (id: string) => void;
};

const RecipeModal = ({
  recipe,
  open,
  onClose,
  onEdit,
  onDelete,
  onToggleFavourite,
}: RecipeModalProps) => {
  if (!recipe) return null;

  const totalTime = (recipe.prep_time_min || 0) + (recipe.cook_time_min || 0);

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="xl">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxH="90vh" overflowY="auto">
            <Dialog.Header>
              <Flex justify="space-between" align="center">
                <Dialog.Title fontSize="xl">{recipe.title}</Dialog.Title>
                <Flex gap={2}>
                  <IconButton
                    variant="ghost"
                    aria-label={recipe.is_favourite ? "Unfavourite" : "Favourite"}
                    onClick={() => onToggleFavourite(recipe.id)}
                  >
                    {recipe.is_favourite ? (
                      <FaHeart color="red" />
                    ) : (
                      <FaRegHeart />
                    )}
                  </IconButton>
                  <IconButton
                    variant="ghost"
                    aria-label="Edit"
                    onClick={() => onEdit(recipe)}
                  >
                    <FaEdit />
                  </IconButton>
                  <IconButton
                    variant="ghost"
                    aria-label="Delete"
                    color="red.fg"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this recipe?")) {
                        onDelete(recipe.id);
                        onClose();
                      }
                    }}
                  >
                    <FaTrash />
                  </IconButton>
                  <IconButton variant="ghost" aria-label="Close" onClick={onClose}>
                    <FaTimes />
                  </IconButton>
                </Flex>
              </Flex>
            </Dialog.Header>
            <Dialog.Body>
              <Stack gap={4}>
                {recipe.description && (
                  <Text color="text.muted">{recipe.description}</Text>
                )}

                <Flex gap={4} wrap="wrap">
                  {recipe.prep_time_min !== null && (
                    <Box>
                      <Text fontSize="sm" color="text.subtle">
                        Prep Time
                      </Text>
                      <Text fontWeight="semibold">{recipe.prep_time_min} min</Text>
                    </Box>
                  )}
                  {recipe.cook_time_min !== null && (
                    <Box>
                      <Text fontSize="sm" color="text.subtle">
                        Cook Time
                      </Text>
                      <Text fontWeight="semibold">{recipe.cook_time_min} min</Text>
                    </Box>
                  )}
                  {totalTime > 0 && (
                    <Box>
                      <Text fontSize="sm" color="text.subtle">
                        Total Time
                      </Text>
                      <Text fontWeight="semibold">{totalTime} min</Text>
                    </Box>
                  )}
                  <Box>
                    <Text fontSize="sm" color="text.subtle">
                      Servings
                    </Text>
                    <Text fontWeight="semibold">{recipe.servings}</Text>
                  </Box>
                  {recipe.calories_kcal !== null && (
                    <Box>
                      <Text fontSize="sm" color="text.subtle">Calories</Text>
                      <Text fontWeight="semibold">{recipe.calories_kcal} kcal</Text>
                    </Box>
                  )}
                </Flex>

                {(recipe.protein_g !== null || recipe.carbs_g !== null || recipe.fat_g !== null) && (
                  <Flex gap={4} wrap="wrap">
                    {recipe.protein_g !== null && <Text fontSize="sm">Protein: {recipe.protein_g}g</Text>}
                    {recipe.carbs_g !== null && <Text fontSize="sm">Carbs: {recipe.carbs_g}g</Text>}
                    {recipe.fat_g !== null && <Text fontSize="sm">Fat: {recipe.fat_g}g</Text>}
                  </Flex>
                )}

                {recipe.tags && recipe.tags.length > 0 && (
                  <Flex gap={2} wrap="wrap">
                    {recipe.tags.map((tag) => (
                      <Badge key={tag} variant="subtle">
                        {tag}
                      </Badge>
                    ))}
                  </Flex>
                )}

                <Box>
                  <Text fontWeight="semibold" mb={2}>
                    Ingredients
                  </Text>
                  <Stack gap={1}>
                    {recipe.ingredients.map((ingredient, index) => (
                      <Flex key={index} gap={2}>
                        <Text>
                          {ingredient.quantity} {ingredient.unit} {ingredient.name}
                          {ingredient.notes && (
                            <Text as="span" color="text.muted" ml={1}>
                              ({ingredient.notes})
                            </Text>
                          )}
                        </Text>
                      </Flex>
                    ))}
                  </Stack>
                </Box>

                <Box>
                  <Text fontWeight="semibold" mb={2}>
                    Instructions
                  </Text>
                  <Stack gap={3}>
                    {recipe.instructions.map((instruction, index) => (
                      <Flex key={index} gap={2}>
                        <Text fontWeight="bold" color="text.muted">
                          {index + 1}.
                        </Text>
                        <Text>{instruction}</Text>
                      </Flex>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default RecipeModal;