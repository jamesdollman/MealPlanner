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
import { useMemo, useState } from "react";
import { useSession } from ".././zustand/user";
import { supabase } from "../api/supabase";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setLoggedInState = useSession((state) => state.setLoggedInState);

  const emailError = useMemo(() => {
    if (!email) return "Email is required";
    if (!EMAIL_REGEX.test(email)) return "Please enter a valid email address";
    return "";
  }, [email]);

  const passwordError = useMemo(() => {
    if (!password) return "Password is required";
    if (!STRONG_PASSWORD_REGEX.test(password)) {
      return "Password must be 8+ chars with upper, lower, number, and special character";
    }
    return "";
  }, [password]);

  const isFormValid = !emailError && !passwordError;

  const {
    mutate: login,
    isPending,
    error,
  } = useMutation({
    mutationFn: async () => {
      if (!isFormValid) throw new Error("Please fix form errors before logging in");

      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (response.error) throw new Error("Login failed");
      return response;
    },
    onSuccess: (data) => {
      setLoggedInState(data.data);
    },
    onError: (loginError) => {
      console.error("Login error:", loginError);
    },
  });

  return (
    <Dialog.Root defaultOpen={true} open={true} placement={"center"}>
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
            <Field.Root invalid={Boolean(emailError && email.length > 0)}>
              <Field.Label>Email</Field.Label>
              <Input
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && email.length > 0 && <Text color="red.fg">{emailError}</Text>}
            </Field.Root>
            <Field.Root invalid={Boolean(passwordError && password.length > 0)}>
              <Field.Label>Password</Field.Label>
              <PasswordInput
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && password.length > 0 && <Text color="red.fg">{passwordError}</Text>}
              {error && <Text color={"red.fg"}>Your email/password is incorrect</Text>}
            </Field.Root>
          </Stack>
          <Dialog.Footer>
            <Box alignSelf={"end"} pt={4}>
              <Button onClick={() => login()} disabled={!isFormValid || isPending}>
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
