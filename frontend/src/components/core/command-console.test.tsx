import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CommandConsole } from "@/components/core/command-console";
import { commandAnalysisResponse } from "@/lib/mock-data";
import { swarmguardApi } from "@/lib/api/swarmguard";

vi.mock("@/lib/api/swarmguard", () => ({
  swarmguardApi: {
    analyzeCommand: vi.fn(),
    connectActivityStream: vi.fn(() => () => undefined),
  },
}));

function renderWithQuery(ui: React.ReactNode) {
  return render(
    <QueryClientProvider client={new QueryClient()}>{ui}</QueryClientProvider>,
  );
}

describe("CommandConsole", () => {
  beforeEach(() => {
    vi.mocked(swarmguardApi.analyzeCommand).mockResolvedValue(commandAnalysisResponse);
  });

  it("submits a command and reveals workforce summary cards", async () => {
    const user = userEvent.setup();
    renderWithQuery(<CommandConsole />);

    const textbox = screen.getByLabelText(/project command/i);
    await user.clear(textbox);
    await user.type(textbox, "Build an AI claims adjudication system with security review.");
    await user.click(screen.getByRole("button", { name: /generate workforce/i }));

    await waitFor(() => {
      expect(screen.getByText(/DeFi Staking Launchpad/i)).toBeInTheDocument();
    });

    expect(vi.mocked(swarmguardApi.analyzeCommand).mock.calls[0]?.[0]).toEqual({
      command: "Build an AI claims adjudication system with security review.",
      source: "text",
    });
  });
});
