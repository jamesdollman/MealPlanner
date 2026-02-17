import { useMutation } from "@tanstack/react-query";
import { PasswordInput } from ".././components/ui/password-input";
import {
  Box,
  Button,
  Dialog,
  Field,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useSession } from ".././zustand/user";
import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabase = createClient(
   import.meta.env.VITE_SUPABASE_PROJECT_URL,
   import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setLoggedInState = useSession((state) => state.setLoggedInState);

  const {
    mutate: login,
    isPending,
    error,
  } = useMutation({
    mutationFn: async () => {
      const response = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (response.error) throw new Error("Login failed");
      return response;
    },
    onSuccess: (data) => {
      setLoggedInState(data.data);
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });

  return (
    <Dialog.Root defaultOpen={true} open={true} placement={'center'}>
      <Dialog.Trigger />
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.CloseTrigger />
          <Dialog.Header alignSelf={"center"}>
            <Dialog.Title>Meal Planner Log in</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body />
          <Stack gap="4" paddingLeft={4} paddingRight={4}>
            <Field.Root>
              <Field.Label>Email</Field.Label>
              <Input
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field.Root>
            <Field.Root>
              <Field.Label>Password</Field.Label>
              <PasswordInput
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && (
                <Text color={"red"}>Your email/password is incorrect</Text>
              )}
            </Field.Root>
          </Stack>
          <Dialog.Footer>
            <Box alignSelf={"end"} pt={4}>
              <Button onClick={() => login()}>
                {isPending ? "Logging in..." : "Log In"}
              </Button>
            </Box>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default Login;
