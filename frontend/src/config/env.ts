const toBoolean = (value: string | undefined, fallback: boolean) => {
  if (value === undefined) return fallback;
  return value.toLowerCase() === "true";
};

export const env = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "SwarmGuard",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api",
  apiMode: (process.env.NEXT_PUBLIC_API_MODE ?? "mock") as "mock" | "live",
  authMode: (process.env.NEXT_PUBLIC_AUTH_MODE ?? "demo") as "demo" | "jwt",
  wsUrl: process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000/ws",
  demoLatencyMs: Number(process.env.NEXT_PUBLIC_DEMO_LATENCY_MS ?? "950"),
  reducedGlow: toBoolean(process.env.NEXT_PUBLIC_REDUCED_GLOW, false),
};

export const isMockMode = env.apiMode === "mock";
