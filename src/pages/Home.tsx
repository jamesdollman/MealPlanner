import { Box, Text } from "@chakra-ui/react";
import Navbar from ".././components/Navbar";
import { usePageSelector } from "../zustand/page";

const Home = () => {
  const selectedPage = usePageSelector((state) => state.page);

  return (
    <Box h="100vh" width="100vw">
      <Navbar />

      {selectedPage === 'home' && (
        <Text>Home Page</Text>
      )}

      {selectedPage === 'recipes' && (
        <Text>Recipes Page</Text>
      )}
    </Box>
  );
};

export default Home;
