import { apiClient } from "@/lib/api/client";
import { AnalyzeResponse, SnapshotResponse } from "@/lib/api/client";

export type AnalyzeCommandInput = {
  command: string;
  source: "voice" | "text";
};

export const swarmguardApi = {
  getSnapshot() {
    return apiClient.request<SnapshotResponse>("/snapshot");
  },
  analyzeCommand(input: AnalyzeCommandInput) {
    return apiClient.request<AnalyzeResponse>("/command/analyze", {
      method: "POST",
      body: input,
    });
  },
  connectActivityStream(onMessage: (message: string) => void) {
    return apiClient.connectActivityStream(onMessage);
  },
};
