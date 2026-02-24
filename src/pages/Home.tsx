import { Box, Button, Grid, Heading, Stack, Text } from "@chakra-ui/react";
import { usePageSelector } from "../zustand/page";

const Home = () => {
  const updatePage = usePageSelector((state) => state.updatePage);

  return (
    <Box p={{ base: 4, md: 6 }}>
      <Stack gap={2} mb={6}>
        <Heading size="lg">Welcome to Meal Planner</Heading>
        <Text color="fg.muted">
          Start with a pantry inventory, build recipes, then assign meals to your calendar and auto-generate groceries.
        </Text>
      </Stack>

      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
        <Box borderWidth="1px" borderRadius="md" p={4}>
          <Heading size="sm" mb={2}>
            1. Add Pantry Items
          </Heading>
          <Text fontSize="sm" color="fg.muted" mb={3}>
            Keep your inventory current so recommendations and grocery deficits are accurate.
          </Text>
          <Button size="sm" onClick={() => updatePage("pantry")}>
            Go to Pantry
          </Button>
        </Box>

        <Box borderWidth="1px" borderRadius="md" p={4}>
          <Heading size="sm" mb={2}>
            2. Build Your Recipe Library
          </Heading>
          <Text fontSize="sm" color="fg.muted" mb={3}>
            Add favorites and filter by dietary tags or total cook time.
          </Text>
          <Button size="sm" onClick={() => updatePage("recipes")}>
            Go to Recipes
          </Button>
        </Box>

        <Box borderWidth="1px" borderRadius="md" p={4}>
          <Heading size="sm" mb={2}>
            3. Plan & Shop
          </Heading>
          <Text fontSize="sm" color="fg.muted" mb={3}>
            Assign meals on your calendar and generate a grouped grocery list.
          </Text>
          <Button size="sm" onClick={() => updatePage("calendar")}>
            Open Calendar
          </Button>
        </Box>
      </Grid>
    </Box>
  );
};

export default Home;
