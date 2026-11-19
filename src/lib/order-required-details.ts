import { isSafeCustomerRequirements, UNSAFE_CUSTOMER_REQUIREMENT_MESSAGE } from "./supplier-safety";
import { validateProductDetails } from "./topup-details";

/** Validate the current saved requirements, never a client-provided requirement list. */
export function assertRequiredOrderDetails(requirements: unknown, fields: Record<string, string>): void {
  if (!isSafeCustomerRequirements(requirements)) throw new Error(UNSAFE_CUSTOMER_REQUIREMENT_MESSAGE);
  const errors = validateProductDetails(requirements, fields);
  const first = Object.entries(errors)[0];
  if (first) throw new Error(`${first[0]}: ${first[1]}`);
}