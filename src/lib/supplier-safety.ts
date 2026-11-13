const UNSAFE_CUSTOMER_REQUIREMENT_PATTERNS = [
  /\bpasswords?\b/i,
  /\bpass\s+words?\b/i,
  /\bpasscodes?\b/i,
  /\bpassphrases?\b/i,
  /\bpasskeys?\b/i,
  /\botp\b/i,
  /\b(?:2fa|mfa)\b/i,
  /\b(?:one\s*time|verification|authenticator|authentication|two\s*factor|2\s*factor)\s+(?:app\s+)?(?:password|code|token|secret)\b/i,
  /\b(?:auth|authentication|verification|security)\s+(?:app\s+)?(?:code|token|secret)\b/i,
  /\bauthenticator\b/i,
  /\bpins?\b/i,
  /\b(?:recovery|backup|seed|secret)\s+(?:codes?|phrases?|keys?)\b/i,
  /\b(?:login|log\s+in|sign\s+in)\s+(?:credentials|details|password|access|code|token)\b/i,
  /\b(?:log\s+in|sign\s+in)\s+to\s+(?:your\s+)?(?:account|game|subscription|email|device)\b/i,
  /\b(?:game|subscription|email|google|apple|account)\s+(?:account\s+)?(?:login|credentials|password|passcode)\b/i,
  /\baccount\s+(?:credentials|access|password|login|control|handover|takeover|unlock\s+code)\b/i,
  /\b(?:session\s+(?:cookie|token)|auth(?:entication)?\s+cookie|access\s+token|bearer\s+token|refresh\s+token|oauth\s+(?:access\s+|refresh\s+)?token|secret\s+key|private\s+key|(?:api|client|developer)\s+(?:key|token|secret))\b/i,
  /\bremote\s+(?:access|control|desktop)\b/i,
  /\b(?:cvv|cvc|card\s+security\s+code)\b/i,
  /\b(?:credit|debit|payment)\s+card\s+(?:number|details)\b/i,
  /\bsecurity\s+(?:question|answer|key)\b/i,
  /\b(?:screen|device)\s+(?:lock|unlock)\s+(?:code|pin|password)\b/i,
  /\b(?:payment|bank|card)\s+(?:pin|password|passcode|credentials|login|security\s+code|verification\s+code|otp)\b/i,
  /\b(?:account|device)\s+(?:handover|takeover|control)\b/i,
] as const;

export const UNSAFE_CUSTOMER_REQUIREMENT_MESSAGE =
  "Do not request passwords, passcodes/passkeys, OTP/2FA/MFA codes, PINs, recovery/backup secrets, security answers, card/bank credentials, session/access tokens, API/client/developer keys or tokens, private keys or remote account access. Request only necessary product identifiers and delivery contact details.";

export const CUSTOMER_CREDENTIAL_WARNING =
  "Never share passwords, passcodes, passkeys, OTP/2FA/MFA codes, PINs, recovery/backup codes, security answers, card security codes, API/client/developer keys or tokens, private keys, session tokens or account-access credentials with MTDGC or a supplier.";

function normaliseRequirementLabel(requirement: string): string {
  return requirement
    .normalize("NFKC")
    .replace(/[_./-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function findUnsafeCustomerRequirement(requirements: readonly string[]): string | null {
  return requirements.find((requirement) => {
    const normalised = normaliseRequirementLabel(requirement);
    return UNSAFE_CUSTOMER_REQUIREMENT_PATTERNS.some((pattern) => pattern.test(normalised));
  }) ?? null;
}

export function isSafeCustomerRequirements(requirements: unknown): requirements is string[] {
  return Array.isArray(requirements)
    && requirements.every((requirement): requirement is string => typeof requirement === "string")
    && findUnsafeCustomerRequirement(requirements) === null;
}

export function getSafeCustomerRequirements(requirements: unknown): string[] {
  return isSafeCustomerRequirements(requirements) ? [...requirements] : [];
}
