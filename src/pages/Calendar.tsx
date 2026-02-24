import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  NativeSelectField,
  NativeSelectRoot,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import type { MealType } from "../types";
import { useRecipesStore } from "../zustand/recipes";
import { useSession } from "../zustand/user";

const STORAGE_KEY = "mealplanner:calendar-v1";
const MEAL_TYPES: MealType[] = ["breakfast", "lunch", "dinner"];

type DailyPlan = Record<MealType, string | null>;
type CalendarPlan = Record<string, DailyPlan>;

const createDayPlan = (): DailyPlan => ({ breakfast: null, lunch: null, dinner: null, snack: null });

const getWeekDays = () => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));

  return Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    const iso = date.toISOString().split("T")[0];
    return {
      iso,
      label: date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }),
    };
  });
};

const Calendar = () => {
  const user = useSession((state) => state.user);
  const { recipes, fetchRecipes } = useRecipesStore();
  const [plans, setPlans] = useState<CalendarPlan>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as CalendarPlan) : {};
  });
  const weekDays = useMemo(() => getWeekDays(), []);

  useEffect(() => {
    if (user?.user?.id) {
      fetchRecipes(user.user.id);
    }
  }, [fetchRecipes, user?.user?.id]);


  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  }, [plans]);

  const updatePlan = (date: string, mealType: MealType, recipeId: string) => {
    setPlans((current) => ({
      ...current,
      [date]: {
        ...(current[date] ?? createDayPlan()),
        [mealType]: recipeId || null,
      },
    }));
  };

  const copyPreviousDay = (date: string, previousDate?: string) => {
    if (!previousDate || !plans[previousDate]) return;
    setPlans((current) => ({
      ...current,
      [date]: { ...plans[previousDate] },
    }));
  };

  const clearDay = (date: string) => {
    setPlans((current) => ({ ...current, [date]: createDayPlan() }));
  };

  return (
    <Box p={6}>
      <Heading size="lg" mb={6}>Meal Calendar (Weekly)</Heading>
      <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={4}>
        {weekDays.map((day, index) => (
          <Card.Root key={day.iso}>
            <Card.Body>
              <Flex justify="space-between" align="center" mb={3}>
                <Text fontWeight="bold">{day.label}</Text>
                <Flex gap={2}>
                  <Button size="xs" variant="outline" onClick={() => copyPreviousDay(day.iso, weekDays[index - 1]?.iso)}>
                    Copy Prev
                  </Button>
                  <Button size="xs" variant="outline" onClick={() => clearDay(day.iso)}>
                    Clear
                  </Button>
                </Flex>
              </Flex>

              <Stack gap={3}>
                {MEAL_TYPES.map((mealType) => (
                  <Box key={`${day.iso}-${mealType}`}>
                    <Text textTransform="capitalize" mb={1}>{mealType}</Text>
                    <NativeSelectRoot>
                      <NativeSelectField
                        value={plans[day.iso]?.[mealType] ?? ""}
                        onChange={(e) => updatePlan(day.iso, mealType, e.target.value)}
                      >
                        <option value="">None</option>
                        {recipes.map((recipe) => (
                          <option key={recipe.id} value={recipe.id}>
                            {recipe.title}
                          </option>
                        ))}
                      </NativeSelectField>
                    </NativeSelectRoot>
                  </Box>
                ))}
              </Stack>
            </Card.Body>
          </Card.Root>
        ))}
      </Grid>
    </Box>
  );
};

export default Calendar;
