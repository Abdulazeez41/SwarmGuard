import { describe, expect, it } from "vitest";
import { swarmguardApi } from "@/lib/api/swarmguard";

describe("swarmguardApi", () => {
  it("returns the operating snapshot in mock mode", async () => {
    const snapshot = await swarmguardApi.getSnapshot();
    expect(snapshot.summaryCards.length).toBeGreaterThan(0);
    expect(snapshot.agents.some((agent) => agent.role === "Project")).toBe(true);
  });

  it("analyzes a command without requiring API keys", async () => {
    const response = await swarmguardApi.analyzeCommand({
      command: "Create a healthcare intake assistant with triage safeguards.",
      source: "text",
    });
    expect(response.summaryCards[0]?.title).toBe("Project Summary");
    expect(response.recommendedWorkforce.length).toBeGreaterThan(3);
  });
});
