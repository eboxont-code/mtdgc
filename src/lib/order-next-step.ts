export type OrderNextAction = "payment_proof" | "wait" | "support" | "check_delivery" | "none";

export type OrderNextStep = { action: OrderNextAction; message: string };

const NEXT_STEPS: Readonly<Record<string, OrderNextStep>> = {
  pending: { action: "support", message: "Action needed: contact support to confirm the payment step for this order. Do not pay again if you have already paid." },
  pending_payment: { action: "payment_proof", message: "Action needed: pay using the checkout details or the details our team sends you, then upload your screenshot and transaction reference on your order page. If a replacement proof was requested, upload it there; do not pay again." },
  payment_submitted: { action: "wait", message: "Please wait while our team checks your payment screenshot and reference. Submission is not payment verification. No further action is needed unless our team asks." },
  paid: { action: "wait", message: "Please wait for our team to confirm the next step. This payment status was set manually; it does not by itself confirm payment verification. Do not pay again." },
  verified: { action: "wait", message: "Please wait while our team prepares your order following payment approval. No further action is needed unless our team asks for details." },
  processing: { action: "wait", message: "Please wait while our team prepares your item. No further action is needed unless our team asks for details." },
  delivered: { action: "check_delivery", message: "Action needed: check your delivery email, order page or the account details supplied for this item. Contact support if the item is missing or does not match your order." },
  fulfilled: { action: "check_delivery", message: "Action needed: check your delivery email, order page or the account details supplied for this item. Contact support if the item is missing or does not match your order." },
  completed: { action: "check_delivery", message: "Action needed: check your delivery email, order page or the account details supplied for this item. Contact support if the item is missing or does not match your order." },
  rejected: { action: "support", message: "Action needed: contact support about the payment review. Upload a replacement proof only if requested and your order returns to Waiting for payment. Do not pay again without checking." },
  failed: { action: "support", message: "Action needed: contact support to confirm why the order failed and what to do next. Do not pay again without checking." },
  cancelled: { action: "none", message: "No further payment or proof upload is needed for this cancelled order. If you already paid, contact support to confirm how that payment will be handled." },
  refunded: { action: "check_delivery", message: "Action needed: check your payment account for the refund. This order status alone does not confirm a money transfer; contact support if you cannot find it." },
};

export function getOrderNextStep(status: string): OrderNextStep {
  return NEXT_STEPS[status] ?? { action: "support", message: "Action needed: contact support to confirm the next step for this order. Do not make another payment without checking." };
}