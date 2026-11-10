import { z } from "zod";

import { hasValidPhoneDigits } from "@/lib/customer-contact";

/** Existing server-side checkout constraints, separated so they can be tested directly. */
export const customerContactFields = z.object({
  name: z.string().trim().min(1).max(80),
  phone: z
    .string()
    .trim()
    .max(24)
    .refine(hasValidPhoneDigits, "Phone must have 7 to 15 digits")
    .optional()
    .default(""),
  email: z.string().trim().max(120).email().optional().or(z.literal("")),
});

export function hasCustomerContact(contact: { phone?: string; email?: string }): boolean {
  return Boolean(contact.phone) || Boolean(contact.email);
}
