import { Box, Text } from "@chakra-ui/react";
import Navbar from ".././components/Navbar";
import { usePageSelector } from "../zustand/page";
import Pantry from "./Pantry";
import Recipes from "./Recipes";

const Home = () => {
  const selectedPage = usePageSelector((state) => state.page);

  return (
    <Box h="100vh" width="100vw">
      <Navbar />

      {selectedPage === 'home' && (
        <Text p={6}>Welcome to Meal Planner! Use the navigation to get started.</Text>
      )}

      {selectedPage === 'recipes' && (
        <Recipes />
      )}

      {selectedPage === 'pantry' && (
        <Pantry />
      )}

      {selectedPage === 'ai-generation' && (
        <Text p={6}>AI Generation Page - Coming soon!</Text>
      )}

      {selectedPage === 'calendar' && (
        <Text p={6}>Calendar Page - Coming soon!</Text>
      )}

      {selectedPage === 'grocery' && (
        <Text p={6}>Grocery List Page - Coming soon!</Text>
      )}
    </Box>
  );
};

export default Home;