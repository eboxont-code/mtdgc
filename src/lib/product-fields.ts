/** Keep only the current listing's required delivery fields, including empty ones. */
export function requiredProductFields(requirements: readonly string[], values: Readonly<Record<string, string>>): Record<string, string> {
  return Object.fromEntries(requirements.map((key) => [key, values[key] ?? ""]));
}