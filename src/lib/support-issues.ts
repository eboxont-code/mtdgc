export const SUPPORT_ISSUE_TYPES = [
  "Wrong player ID or UID",
  "Delayed delivery",
  "Invalid code",
  "Wrong item",
  "Refund request",
  "Payment question",
  "Account access",
  "Something else",
] as const;

export type SupportIssueType = (typeof SUPPORT_ISSUE_TYPES)[number];

const LEGACY_SUPPORT_ISSUE_TYPES: Readonly<Record<string, SupportIssueType>> = {
  "Order not delivered": "Delayed delivery",
};

/** Restore a saved form choice without losing drafts created before the category rename. */
export function restoreSupportIssueType(value: unknown): SupportIssueType {
  if (typeof value !== "string") return SUPPORT_ISSUE_TYPES[0];
  if ((SUPPORT_ISSUE_TYPES as readonly string[]).includes(value)) return value as SupportIssueType;
  return LEGACY_SUPPORT_ISSUE_TYPES[value] ?? SUPPORT_ISSUE_TYPES[0];
}
