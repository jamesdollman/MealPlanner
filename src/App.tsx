import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./pages/Login";
import { useSession } from "./zustand/user";
import { Text } from "@chakra-ui/react";

function App() {
  const queryClient = new QueryClient();
  const isUserSignedIn = useSession((state) => state.isLoggedIn);

  return (
    <QueryClientProvider client={queryClient}>
      {!isUserSignedIn && <Login />}
      {isUserSignedIn && <Text>Welcome!</Text>}
    </QueryClientProvider>
  );
}

export default App;
