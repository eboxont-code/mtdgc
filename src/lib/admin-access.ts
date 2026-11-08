/**
 * Treat an admin-role RPC result as authoritative only when it succeeded
 * and returned the exact boolean true. Any error or ambiguous value denies access.
 */
export function isAdminRoleConfirmed(data: unknown, error: unknown): boolean {
  return error == null && data === true;
}
