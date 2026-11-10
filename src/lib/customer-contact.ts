export const CUSTOMER_CONTACT_LIMITS = Object.freeze({
  name: 80,
  phone: 24,
  email: 120,
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type CustomerContactErrors = Partial<Record<"name" | "phone" | "email", string>>;

/** Mirrors the existing server rule: count digits after removing formatting characters. */
export function hasValidPhoneDigits(value: string): boolean {
  if (!value) return true;
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

/** Client-side checks aligned with the existing server field limits and phone digit rule. */
export function validateCheckoutContact(contact: {
  name: string;
  phone: string;
  email: string;
}): CustomerContactErrors {
  const errors: CustomerContactErrors = {};
  const name = contact.name.trim();
  const phone = contact.phone.trim();
  const email = contact.email.trim();

  if (!name) errors.name = "Please add your full name.";
  else if (name.length > CUSTOMER_CONTACT_LIMITS.name) {
    errors.name = "Full name must be 80 characters or fewer.";
  }

  if (!phone && !email) {
    errors.phone = "Add a mobile number or an email so we can reach you.";
  }
  if (phone.length > CUSTOMER_CONTACT_LIMITS.phone) {
    errors.phone = "Mobile number must be 24 characters or fewer.";
  } else if (phone && !hasValidPhoneDigits(phone)) {
    errors.phone = "Mobile number must have 7 to 15 digits.";
  }

  if (email.length > CUSTOMER_CONTACT_LIMITS.email) {
    errors.email = "Email address must be 120 characters or fewer.";
  } else if (email && !EMAIL_RE.test(email)) {
    errors.email = "That email address does not look right.";
  }

  return errors;
}
