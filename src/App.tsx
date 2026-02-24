import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Pantry from "./pages/Pantry";
import Recipes from "./pages/Recipes";
import { usePageSelector } from "./zustand/page";
import { useSession } from "./zustand/user";
import { Box, Text } from "@chakra-ui/react";

const queryClient = new QueryClient();

function App() {
  const isUserSignedIn = useSession((state) => state.isLoggedIn);
  const selectedPage = usePageSelector((state) => state.page);
  const updatePageFromPath = usePageSelector((state) => state.updatePageFromPath);

  useEffect(() => {
    updatePageFromPath();

    const onPopState = () => updatePageFromPath();
    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, [updatePageFromPath]);

  return (
    <QueryClientProvider client={queryClient}>
      {!isUserSignedIn && <Login />}

      {isUserSignedIn && (
        <Box h="100vh" width="100vw">
          <Navbar />

          {selectedPage === "home" && <Home />}
          {selectedPage === "recipes" && <Recipes />}
          {selectedPage === "pantry" && <Pantry />}
          {selectedPage === "ai-generation" && <Text p={6}>AI Generation Page - Coming soon!</Text>}
          {selectedPage === "calendar" && <Text p={6}>Calendar Page - Coming soon!</Text>}
          {selectedPage === "grocery" && <Text p={6}>Grocery List Page - Coming soon!</Text>}
        </Box>
      )}
    </QueryClientProvider>
  );
}

export default App;
