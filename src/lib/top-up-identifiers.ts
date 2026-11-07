export type TopUpIdentifierGuidance = {
  kind: "account" | "routing" | "verification" | "account-email";
  title: string;
  message: string;
};

/** Guidance for the exact game-account fields used by the current top-up catalogue. */
export function getTopUpIdentifierGuidance(requirement: string): TopUpIdentifierGuidance | null {
  const label = requirement.trim();
  if (!label) return null;

  if (/supercell\s*id\s*email/i.test(label)) {
    return {
      kind: "account-email",
      title: "Supercell ID email",
      message:
        "Use the email address associated with the Supercell ID for the intended game account. It may differ from your MTDGC delivery email. Never enter a password or verification code.",
    };
  }

  if (/player\s*tag/i.test(label)) {
    return {
      kind: "account",
      title: "Player tag",
      message:
        "Copy the full Player tag exactly as displayed in the game's profile, including any symbols shown. Check every character; a typo may identify a different account.",
    };
  }

  if (/(?:player|user)\s*id|\buid\b/i.test(label)) {
    return {
      kind: "account",
      title: "Player/User ID",
      message:
        "Copy this exact identifier directly from the game's own profile. Check every digit and character; a typo may identify a different account.",
    };
  }

  if (/zone\s*id|\bserver\b/i.test(label)) {
    return {
      kind: "routing",
      title: "Zone ID / Server",
      message:
        "Check this Zone ID or Server against the same in-game profile. It is separate from the Player/User ID; verify each requested field.",
    };
  }

  if (/nickname/i.test(label)) {
    return {
      kind: "verification",
      title: "Nickname is only a cross-check",
      message:
        "Enter the current in-game nickname for verification only. It does not replace the required Player/User ID or Player tag.",
    };
  }

  return null;
}

/** A Supercell ID email is account-specific, not the customer's generic delivery email. */
export function shouldPrefillDeliveryEmail(requirement: string): boolean {
  return /e-?mail/i.test(requirement) && !/supercell\s*id/i.test(requirement);
}
