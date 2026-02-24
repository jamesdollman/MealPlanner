import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Pantry from "./pages/Pantry";
import Recipes from "./pages/Recipes";
import AIGeneration from "./pages/AIGeneration";
import Calendar from "./pages/Calendar";
import Grocery from "./pages/Grocery";
import { usePageSelector } from "./zustand/page";
import { useSession } from "./zustand/user";
import { Box } from "@chakra-ui/react";

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
          {selectedPage === "ai-generation" && <AIGeneration />}
          {selectedPage === "calendar" && <Calendar />}
          {selectedPage === "grocery" && <Grocery />}
        </Box>
      )}
    </QueryClientProvider>
  );
}

export default App;
