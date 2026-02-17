import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useSession } from "./zustand/user";

function App() {
  const queryClient = new QueryClient();
  const isUserSignedIn = useSession((state) => state.isLoggedIn);

  return (
    <QueryClientProvider client={queryClient}>
      {!isUserSignedIn && <Login />}

      {isUserSignedIn && <Home />}
    </QueryClientProvider>
  );
}

export default App;
