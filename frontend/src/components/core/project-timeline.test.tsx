import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ProjectTimeline } from "@/components/core/project-timeline";
import { timeline } from "@/lib/mock-data";

describe("ProjectTimeline", () => {
  it("shows details for expanded timeline steps", async () => {
    const user = userEvent.setup();
    render(<ProjectTimeline events={timeline} />);

    await user.click(screen.getByRole("button", { name: /replacement triggered/i }));

    expect(
      screen.getByText(/payment routing all updated without human intervention/i),
    ).toBeInTheDocument();
  });
});
