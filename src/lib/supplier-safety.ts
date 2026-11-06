const UNSAFE_CUSTOMER_REQUIREMENT_PATTERNS = [
  /\\bpasswords?\\b/i,
  /\\bpasscodes?\\b/i,
  /\\bpassphrases?\\b/i,
  /\\botp\\b/i,
  /\\b(?:one[\\s-]?time|verification|authenticator|2fa|two[\\s-]?factor|sign[\\s-]?in)\\s+(?:password|code|token)\\b/i,
  /\\bauthenticator\\b/i,
  /\\bpins?\\b/i,
  /\\b(?:recovery|backup|seed)\\s+(?:codes?|phrases?)\\b/i,
  /\\b(?:login|log[\\s-]?in|sign[\\s-]?in)\\s+(?:credentials|details|password|access|code)\\b/i,
  /\\baccount\\s+(?:credentials|access|password|login)\\b/i,
  /\\b(?:session\\s+cookie|access\\s+token|secret\\s+key|private\\s+key)\\b/i,
  /\\bremote\\s+(?:access|control)\\b/i,
  /\\b(?:cvv|cvc|card\\s+security\\s+code)\\b/i,
  /\\b(?:credit|debit)\\s+card\\s+(?:number|details)\\b/i,
] as const;

export const UNSAFE_CUSTOMER_REQUIREMENT_MESSAGE =
  "Do not request passwords, OTP/2FA codes, PINs, recovery codes, payment credentials or account access. Request only necessary product identifiers or delivery contact details.";

export function findUnsafeCustomerRequirement(requirements: readonly string[]): string | null {
  return requirements.find((requirement) =>
    UNSAFE_CUSTOMER_REQUIREMENT_PATTERNS.some((pattern) => pattern.test(requirement)),
  ) ?? null;
}
