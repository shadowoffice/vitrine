import { describe, expect, it } from "vitest";

import {
  isProposalResponse,
  proposalPriorities,
  proposalPriorityLabels,
  proposalRequestSchema,
} from "@/lib/proposal";

const validProposal = {
  acceptsContact: true,
  companyName: "Construction Boréale",
  contactName: "Marie Tremblay",
  email: "marie@example.test",
  priority: "projects",
  teamSize: "6-15",
} as const;

describe("proposal schema", () => {
  it("normalizes a valid proposal and applies safe defaults", () => {
    const parsed = proposalRequestSchema.parse({
      ...validProposal,
      companyName: "  Construction Boréale  ",
      currentTools: [" Excel "],
      phone: "   ",
    });

    expect(parsed.companyName).toBe("Construction Boréale");
    expect(parsed.currentTools).toEqual(["Excel"]);
    expect(parsed.phone).toBeUndefined();
  });

  it("defaults current tools to an empty list", () => {
    expect(proposalRequestSchema.parse(validProposal).currentTools).toEqual([]);
  });

  it.each([
    [{ ...validProposal, acceptsContact: false }],
    [{ ...validProposal, email: "invalide" }],
    [{ ...validProposal, priority: "unknown" }],
    [{ ...validProposal, teamSize: "1000+" }],
    [
      {
        ...validProposal,
        currentTools: Array.from({ length: 9 }, (_, index) => `Outil ${index}`),
      },
    ],
  ])("rejects an invalid proposal", (payload) => {
    expect(proposalRequestSchema.safeParse(payload).success).toBe(false);
  });

  it("keeps a label for every priority", () => {
    expect(Object.keys(proposalPriorityLabels).sort()).toEqual(
      [...proposalPriorities].sort(),
    );
  });
});

describe("proposal response guard", () => {
  it("accepts complete known responses", () => {
    expect(
      isProposalResponse({
        reference: "pro-123",
        safeError: null,
        safeSummary: "Demande reçue.",
        status: "accepted",
      }),
    ).toBe(true);
  });

  it.each([
    [null],
    [{ status: "accepted" }],
    [{ reference: "pro-123", safeSummary: "Demande reçue.", status: "other" }],
  ])("rejects malformed responses", (payload) => {
    expect(isProposalResponse(payload)).toBe(false);
  });
});
