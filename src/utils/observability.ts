type EventPayload = Record<string, string | number | boolean | null | undefined>;

export const logRuntimeError = (error: unknown, context: string) => {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  console.error("[runtime-error]", {
    context,
    message,
    stack,
    timestamp: new Date().toISOString(),
  });
};

export const trackEvent = (event: string, payload?: EventPayload) => {
  console.info("[analytics-event]", {
    event,
    payload,
    timestamp: new Date().toISOString(),
  });
};
