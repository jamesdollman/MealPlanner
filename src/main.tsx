window.addEventListener("error", (event) => {
  logRuntimeError(event.error ?? event.message, "window.error");
});

window.addEventListener("unhandledrejection", (event) => {
  logRuntimeError(event.reason, "window.unhandledrejection");
});

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "./components/ui/provider";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { logRuntimeError } from "./utils/observability";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </Provider>
  </StrictMode>,
);
