import { Alert, Box, Button, Heading, Text } from "@chakra-ui/react";
import { Component, type ErrorInfo, type ReactNode } from "react";
import { logRuntimeError } from "../utils/observability";

type ErrorBoundaryProps = { children: ReactNode };
type ErrorBoundaryState = { hasError: boolean };

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, info: ErrorInfo) {
    logRuntimeError(error, `ReactErrorBoundary: ${info.componentStack}`);
  }

  private reset = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Box p={6}>
          <Alert.Root status="error" mb={4}>
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Something went wrong</Alert.Title>
              <Alert.Description>
                We hit an unexpected error. Reload the app to continue.
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>
          <Heading size="md" mb={2}>Unexpected application error</Heading>
          <Text mb={4}>The issue has been logged for diagnostics.</Text>
          <Button onClick={this.reset}>Reload app</Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
