import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { AuditTrail } from "@/components/core/audit-trail";
import { auditTrail } from "@/lib/mock-data";

describe("AuditTrail", () => {
  it("expands and collapses audit records", async () => {
    const user = userEvent.setup();
    render(<AuditTrail records={auditTrail} />);

    expect(screen.getByText(/Complexity model 0.78/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /self-healing trigger/i }));
    expect(screen.getByText(/Anomaly score 0.73/i)).toBeInTheDocument();
  });
});
