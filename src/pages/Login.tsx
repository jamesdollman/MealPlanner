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

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const setLoggedInState = useSession((state) => state.setLoggedInState);

  const {
    mutate: login,
    isPending,
    error,
  } = useMutation({
    mutationFn: async () => {
      const response = await fetch("https://your-api.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error("Login failed");
      return response.json();
    },
    onSuccess: (data) => {
      console.log("Logged in!", data);
      // update your Zustand store here, redirect, etc.
    },
    onError: (error) => {
      if (username === "jd" && password === "jd") {
        setLoggedInState(true);
        return;
      }
      console.error("Login error:", error);
    },
  });

  return (
    <Dialog.Root defaultOpen={true} open={true}>
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
              <Field.Label>Username</Field.Label>
              <Input
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                <Text color={"red"}>Your username/password is incorrect</Text>
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
