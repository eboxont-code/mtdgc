// Payment providers shown at checkout. Only manual_qr is live.
// Khalti and eSewa are disabled placeholders: no SDKs, no keys, no network calls.

export type PaymentProvider = {
  id: "manual_qr" | "khalti" | "esewa";
  label: string;
  enabled: boolean;
  /** How the customer sees this option at checkout. */
  display: "qr_and_bank" | "disabled";
  description: string;
};

export const PAYMENT_PROVIDERS: PaymentProvider[] = [
  {
    id: "manual_qr",
    label: "QR or bank transfer",
    enabled: true,
    display: "qr_and_bank",
    description: "Scan the QR or use the bank details, then upload your payment screenshot with the transaction reference.",
  },
  { id: "khalti", label: "Khalti", enabled: false, display: "disabled", description: "Not available yet." },
  { id: "esewa", label: "eSewa", enabled: false, display: "disabled", description: "Not available yet." },
];

export const enabledProviders = () => PAYMENT_PROVIDERS.filter((p) => p.enabled);
