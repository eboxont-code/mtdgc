type SavedPaymentDetails = {
  qr_image_path?: string | null;
  bank_name?: string | null;
  account_name?: string | null;
  account_number?: string | null;
};

export function needsPaymentDetailsNotice(details: SavedPaymentDetails | null): boolean {
  if (!details) return true;
  return ![details.qr_image_path, details.bank_name, details.account_name, details.account_number]
    .some((value) => Boolean(value?.trim()));
}