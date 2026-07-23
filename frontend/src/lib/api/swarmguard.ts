import { AnalyzeResponse, apiClient, SnapshotResponse } from "@/lib/api/client";
import { BackendStreamEvent } from "@/lib/types";

export type AnalyzeCommandInput = {
  command: string;
  source: "voice" | "text";
};

export const swarmguardApi = {
  getSnapshot() {
    return apiClient.request<SnapshotResponse>("/api/snapshot");
  },
  analyzeCommand(input: AnalyzeCommandInput) {
    return apiClient.request<AnalyzeResponse>("/api/command/analyze", {
      method: "POST",
      body: input,
    });
  },
  connectActivityStream(
    onMessage: (message: string) => void,
    onEvent?: (event: BackendStreamEvent) => void,
  ) {
    return apiClient.connectActivityStream(onMessage, onEvent);
  },
};
