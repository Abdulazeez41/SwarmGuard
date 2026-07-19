import { env, isMockMode } from "@/config/env";
import { appSnapshot, commandAnalysisResponse } from "@/lib/mock-data";
import {
  ApiErrorPayload,
  AppSnapshot,
  BackendStreamEvent,
  CommandAnalysisResponse,
} from "@/lib/types";
import { delay } from "@/lib/utils";

export type RequestOptions = {
  method?: "GET" | "POST";
  body?: unknown;
  headers?: HeadersInit;
};

function isErrorPayload(payload: unknown): payload is ApiErrorPayload {
  if (!payload || typeof payload !== "object") return false;
  return Boolean(
    ("error" in payload && typeof payload.error === "string") ||
    ("detail" in payload && typeof payload.detail === "string") ||
    ("message" in payload && typeof payload.message === "string"),
  );
}

function toReadableStreamMessage(event: BackendStreamEvent): string {
  switch (event.type) {
    case "connected":
      return event.message ?? "SwarmGuard live stream active.";
    case "swarm_initiated":
      return event.task_id
        ? `Swarm ${event.task_id} deployed. Workforce initialization broadcast to all live panels.`
        : (event.message ?? "Swarm initiated.");
    case "milestone_evaluated":
      return event.action
        ? `Milestone evaluated. Backend action: ${event.action.replaceAll("_", " ")}.`
        : "Milestone evaluation broadcast received.";
    case "heartbeat":
      return event.timestamp
        ? `Heartbeat received at ${new Date(event.timestamp * 1000).toLocaleTimeString()}.`
        : "Heartbeat received.";
    default:
      return event.message ?? JSON.stringify(event);
  }
}

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

    const payload = (await response.json()) as T | ApiErrorPayload;

    if (!response.ok) {
      if (isErrorPayload(payload)) {
        throw new Error(
          payload.error ??
            payload.detail ??
            payload.message ??
            `API request failed with status ${response.status}`,
        );
      }
      throw new Error(`API request failed with status ${response.status}`);
    }

    if (isErrorPayload(payload)) {
      throw new Error(
        payload.error ??
          payload.detail ??
          payload.message ??
          "Backend returned an application error.",
      );
    }

    return payload as T;
  }

  connectActivityStream(
    onMessage: (message: string) => void,
    onEvent?: (event: BackendStreamEvent) => void,
  ) {
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
        const sample =
          samples[Math.floor(Math.random() * samples.length)] ?? samples[0];
        onMessage(sample);
      }, 6000);
      return () => window.clearInterval(interval);
    }

    const socket = new WebSocket(env.wsUrl);
    socket.onmessage = (messageEvent) => {
      try {
        const parsed = JSON.parse(
          String(messageEvent.data),
        ) as BackendStreamEvent;
        onEvent?.(parsed);
        onMessage(toReadableStreamMessage(parsed));
      } catch {
        onMessage(String(messageEvent.data));
      }
    };
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "subscribe", channel: "swarmguard" }));
    };
    socket.onerror = () => {
      onMessage(
        "Live stream encountered a transport error. Snapshot data remains available.",
      );
    };
    return () => socket.close();
  }
}

export const apiClient = new ApiClient();

export type SnapshotResponse = AppSnapshot;
export type AnalyzeResponse = CommandAnalysisResponse;
