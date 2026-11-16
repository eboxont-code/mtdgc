/** Only existing category/required-field labels identify top-ups. */
export function isTopup(categorySlug?: string | null): boolean {
  return categorySlug === "game-top-ups";
}

export const TOPUP_DETAILS_WARNING = "Check your player ID, zone and server. Top-ups cannot be reversed once delivered.";

/** Format checks only; cannot establish ownership or an account's existence. */
export function validateProductIdentifier(label: string, input: string): string | null {
  const value = input.trim();
  if (!value) return `Please enter ${label.toLowerCase()}.`;
  if (value.length > 120 || /[\u0000-\u001f<>]/.test(value)) return "Enter a valid detail using no more than 120 characters.";
  if (/e-?mail/i.test(label) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid recipient email.";
  if (/player tag/i.test(label) && !/^#?[A-Za-z0-9]+$/.test(value)) return "Enter the player tag from your game profile.";
  if (/player id|user id|\buid\b|zone id/i.test(label) && !/^\d+$/.test(value)) return "Enter digits only, copied from your game profile.";
  if (/server/i.test(label) && !/^[\p{L}\p{N} ._#()-]+$/u.test(value)) return "Enter the server shown in your game profile.";
  return null;
}

export function validateProductDetails(requirements: readonly string[], fields: Record<string, string>): Record<string, string> {
  return Object.fromEntries(requirements.flatMap((label) => {
    const error = validateProductIdentifier(label, fields[label] ?? "");
    return error ? [[label, error]] : [];
  }));
}

export function productIdentifierHelp(name: string, label: string): string | null {
  if (!/mobile legends/i.test(name)) return null;
  if (/zone|server/i.test(label)) return "On your Mobile Legends profile, the number in brackets after your user ID is your zone ID. Enter it separately, without brackets.";
  if (/player id|user id|\buid\b/i.test(label)) return "Open your Mobile Legends profile. Enter the first number as your user ID, without the zone number in brackets.";
  return null;
}