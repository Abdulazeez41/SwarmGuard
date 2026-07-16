import { env, isMockMode } from "@/config/env";
import { commandAnalysisResponse, appSnapshot } from "@/lib/mock-data";
import { delay } from "@/lib/utils";
import { AppSnapshot, CommandAnalysisResponse } from "@/lib/types";

export type RequestOptions = {
  method?: "GET" | "POST";
  body?: unknown;
  headers?: HeadersInit;
};

class ApiClient {
  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    if (isMockMode) {
      await delay(env.demoLatencyMs);

      if (path === "/snapshot") {
        return structuredClone(appSnapshot) as T;
      }

      if (path === "/command/analyze") {
        return structuredClone(commandAnalysisResponse) as T;
      }

      throw new Error(`Unknown mock endpoint: ${path}`);
    }

    const response = await fetch(`${env.apiBaseUrl}${path}`, {
      method: options.method ?? "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return (await response.json()) as T;
  }

  connectActivityStream(onMessage: (message: string) => void) {
    if (typeof window === "undefined") {
      return () => undefined;
    }

    if (isMockMode) {
      const samples = [
        "Swarm memory synced to the latest evaluation evidence.",
        "Replacement watch remains active on the audit lane.",
        "Confidence recalculated after contract optimization evidence arrived.",
      ];
      const interval = window.setInterval(() => {
        onMessage(samples[Math.floor(Math.random() * samples.length)] ?? samples[0]);
      }, 6000);
      return () => window.clearInterval(interval);
    }

    const socket = new WebSocket(env.wsUrl);
    socket.onmessage = (event) => onMessage(String(event.data));
    return () => socket.close();
  }
}

export const apiClient = new ApiClient();

export type SnapshotResponse = AppSnapshot;
export type AnalyzeResponse = CommandAnalysisResponse;
