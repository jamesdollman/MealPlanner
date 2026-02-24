import { useMutation } from "@tanstack/react-query";
import { PasswordInput } from ".././components/ui/password-input";
import {
  Badge,
  Box,
  Button,
  Dialog,
  Field,
  HStack,
  Input,
  Stack,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useSession } from ".././zustand/user";
import { supabase } from "../api/supabase";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const Login = () => {
  const [tab, setTab] = useState<"login" | "register">("login");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");

  const setLoggedInState = useSession((state) => state.setLoggedInState);

  const loginEmailError = useMemo(() => {
    if (!loginEmail) return "Email is required";
    if (!EMAIL_REGEX.test(loginEmail)) return "Please enter a valid email address";
    return "";
  }, [loginEmail]);

  const loginPasswordError = useMemo(() => {
    if (!loginPassword) return "Password is required";
    return "";
  }, [loginPassword]);

  const registerNameError = useMemo(() => {
    if (!registerName.trim()) return "Display name is required";
    if (registerName.trim().length < 2) return "Display name must be at least 2 characters";
    return "";
  }, [registerName]);

  const registerEmailError = useMemo(() => {
    if (!registerEmail) return "Email is required";
    if (!EMAIL_REGEX.test(registerEmail)) return "Please enter a valid email address";
    return "";
  }, [registerEmail]);

  const registerPasswordError = useMemo(() => {
    if (!registerPassword) return "Password is required";
    if (!STRONG_PASSWORD_REGEX.test(registerPassword)) {
      return "Password must be 8+ chars with upper, lower, number, and special character";
    }
    return "";
  }, [registerPassword]);

  const registerConfirmPasswordError = useMemo(() => {
    if (!registerConfirmPassword) return "Please confirm your password";
    if (registerConfirmPassword !== registerPassword) return "Passwords do not match";
    return "";
  }, [registerConfirmPassword, registerPassword]);

  const isLoginValid = !loginEmailError && !loginPasswordError;
  const isRegisterValid =
    !registerNameError && !registerEmailError && !registerPasswordError && !registerConfirmPasswordError;

  const {
    mutate: login,
    isPending: isLoggingIn,
    error: loginError,
  } = useMutation({
    mutationFn: async () => {
      if (!isLoginValid) throw new Error("Please fix form errors before logging in");

      const response = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (response.error) throw new Error(response.error.message || "Login failed");
      return response;
    },
    onSuccess: (data) => {
      setLoggedInState(data.data);
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });

  const {
    mutate: register,
    isPending: isRegistering,
    error: registerError,
  } = useMutation({
    mutationFn: async () => {
      if (!isRegisterValid) throw new Error("Please fix form errors before registering");

      const response = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          data: {
            display_name: registerName.trim(),
          },
        },
      });

      if (response.error) throw new Error(response.error.message || "Registration failed");
      return response;
    },
    onSuccess: (data) => {
      if (data.data.session && data.data.user) {
        setLoggedInState(data.data);
      }
    },
    onError: (error) => {
      console.error("Registration error:", error);
    },
  });

  return (
    <Dialog.Root defaultOpen={true} open={true} placement={"center"}>
      <Dialog.Trigger />
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content maxW="lg" mx={4}>
          <Dialog.Header alignSelf={"center"}>
            <Stack align="center" gap={1}>
              <Dialog.Title>Welcome to Meal Planner</Dialog.Title>
              <Text color="fg.muted" fontSize="sm">
                Plan meals, track pantry items, and generate smarter grocery lists.
              </Text>
            </Stack>
          </Dialog.Header>

          <Dialog.Body>
            <Tabs.Root
              value={tab}
              onValueChange={(details) => setTab(details.value as "login" | "register")}
              fitted
              variant="line"
            >
              <Tabs.List mb={4}>
                <Tabs.Trigger value="login">Log in</Tabs.Trigger>
                <Tabs.Trigger value="register">
                  Register <Badge ml={2}>New</Badge>
                </Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="login">
                <Stack gap="4">
                  <Field.Root invalid={Boolean(loginEmailError && loginEmail.length > 0)}>
                    <Field.Label>Email</Field.Label>
                    <Input
                      placeholder="Enter your email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      type="email"
                    />
                    {loginEmailError && loginEmail.length > 0 && <Text color="red.fg">{loginEmailError}</Text>}
                  </Field.Root>

                  <Field.Root invalid={Boolean(loginPasswordError && loginPassword.length > 0)}>
                    <Field.Label>Password</Field.Label>
                    <PasswordInput
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                    {loginPasswordError && loginPassword.length > 0 && (
                      <Text color="red.fg">{loginPasswordError}</Text>
                    )}
                    {loginError && <Text color={"red.fg"}>Your email/password is incorrect.</Text>}
                  </Field.Root>

                  <HStack justify="space-between">
                    <Text fontSize="sm" color="fg.muted">
                      Tip: Use your existing account credentials.
                    </Text>
                    <Button onClick={() => login()} disabled={!isLoginValid || isLoggingIn}>
                      {isLoggingIn ? "Logging in..." : "Log In"}
                    </Button>
                  </HStack>
                </Stack>
              </Tabs.Content>

              <Tabs.Content value="register">
                <Stack gap="4">
                  <Field.Root invalid={Boolean(registerNameError && registerName.length > 0)}>
                    <Field.Label>Display name</Field.Label>
                    <Input
                      placeholder="How should we address you?"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                    />
                    {registerNameError && registerName.length > 0 && (
                      <Text color="red.fg">{registerNameError}</Text>
                    )}
                  </Field.Root>

                  <Field.Root invalid={Boolean(registerEmailError && registerEmail.length > 0)}>
                    <Field.Label>Email</Field.Label>
                    <Input
                      placeholder="Enter your email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      type="email"
                    />
                    {registerEmailError && registerEmail.length > 0 && (
                      <Text color="red.fg">{registerEmailError}</Text>
                    )}
                  </Field.Root>

                  <Field.Root invalid={Boolean(registerPasswordError && registerPassword.length > 0)}>
                    <Field.Label>Password</Field.Label>
                    <PasswordInput
                      placeholder="Create a strong password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                    />
                    {registerPasswordError && registerPassword.length > 0 && (
                      <Text color="red.fg">{registerPasswordError}</Text>
                    )}
                  </Field.Root>

                  <Field.Root invalid={Boolean(registerConfirmPasswordError && registerConfirmPassword.length > 0)}>
                    <Field.Label>Confirm password</Field.Label>
                    <PasswordInput
                      placeholder="Re-enter your password"
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    />
                    {registerConfirmPasswordError && registerConfirmPassword.length > 0 && (
                      <Text color="red.fg">{registerConfirmPasswordError}</Text>
                    )}
                    {registerError && <Text color={"red.fg"}>Unable to create account. Please try again.</Text>}
                  </Field.Root>

                  <HStack justify="space-between">
                    <Text fontSize="sm" color="fg.muted">
                      You may be asked to verify your email before first sign-in.
                    </Text>
                    <Button onClick={() => register()} disabled={!isRegisterValid || isRegistering}>
                      {isRegistering ? "Creating..." : "Create account"}
                    </Button>
                  </HStack>
                </Stack>
              </Tabs.Content>
            </Tabs.Root>
          </Dialog.Body>

          <Dialog.Footer>
            <Box w="100%">
              <Text fontSize="xs" color="fg.subtle">
                By continuing, you agree to keep your account details secure.
              </Text>
            </Box>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default Login;
