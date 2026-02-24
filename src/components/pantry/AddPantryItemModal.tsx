import {
  Box,
  Button,
  Dialog,
  Field,
  Input,
  NativeSelectField,
  NativeSelectRoot,
  Portal,
  Stack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import type { PantryItem, PantryItemInsert, PantryCategory } from "../../types";
import { PANTRY_CATEGORIES, PANTRY_UNITS } from "../../types";

type AddPantryItemModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (item: PantryItemInsert) => void;
  editItem?: PantryItem | null;
  isLoading?: boolean;
};

const defaultItem: PantryItemInsert = {
  name: "",
  quantity: 1,
  unit: "item",
  category: "other",
  expiry_date: null,
};

const AddPantryItemModal = ({
  open,
  onClose,
  onSubmit,
  editItem,
  isLoading,
}: AddPantryItemModalProps) => {
  const [item, setItem] = useState<PantryItemInsert>(defaultItem);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editItem) {
      setItem({
        name: editItem.name,
        quantity: editItem.quantity,
        unit: editItem.unit,
        category: editItem.category,
        expiry_date: editItem.expiry_date,
      });
    } else {
      setItem(defaultItem);
    }
    setErrors({});
  }, [editItem, open]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!item.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (item.quantity <= 0) {
      newErrors.quantity = "Quantity must be greater than 0";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(item);
    }
  };

  const handleClose = () => {
    setItem(defaultItem);
    setErrors({});
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && handleClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>
                {editItem ? "Edit Pantry Item" : "Add Pantry Item"}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Stack gap={4}>
                <Field.Root invalid={!!errors.name}>
                  <Field.Label>Name</Field.Label>
                  <Input
                    value={item.name}
                    onChange={(e) => setItem({ ...item, name: e.target.value })}
                    placeholder="e.g., Milk, Eggs, Rice"
                  />
                  {errors.name && (
                    <Field.ErrorText>{errors.name}</Field.ErrorText>
                  )}
                </Field.Root>

                <Box display="flex" gap={4}>
                  <Field.Root flex={1} invalid={!!errors.quantity}>
                    <Field.Label>Quantity</Field.Label>
                    <Input
                      type="number"
                      min={0}
                      step={0.1}
                      value={item.quantity}
                      onChange={(e) =>
                        setItem({ ...item, quantity: parseFloat(e.target.value) || 0 })
                      }
                    />
                    {errors.quantity && (
                      <Field.ErrorText>{errors.quantity}</Field.ErrorText>
                    )}
                  </Field.Root>

                  <Field.Root flex={1}>
                    <Field.Label>Unit</Field.Label>
                    <NativeSelectRoot>
                      <NativeSelectField
                        value={item.unit}
                        onChange={(e) => setItem({ ...item, unit: e.target.value })}
                      >
                        {PANTRY_UNITS.map((unit) => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </NativeSelectField>
                    </NativeSelectRoot>
                  </Field.Root>
                </Box>

                <Field.Root>
                  <Field.Label>Category</Field.Label>
                  <NativeSelectRoot>
                    <NativeSelectField
                      value={item.category}
                      onChange={(e) =>
                        setItem({ ...item, category: e.target.value as PantryCategory })
                      }
                    >
                      {PANTRY_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                      ))}
                    </NativeSelectField>
                  </NativeSelectRoot>
                </Field.Root>

                <Field.Root>
                  <Field.Label>Expiry Date (optional)</Field.Label>
                  <Input
                    type="date"
                    value={item.expiry_date || ""}
                    onChange={(e) =>
                      setItem({ ...item, expiry_date: e.target.value || null })
                    }
                  />
                </Field.Root>
              </Stack>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} loading={isLoading}>
                {editItem ? "Save Changes" : "Add Item"}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default AddPantryItemModal;