export const GIFT_CARD_CATEGORY_SLUG = "gift-cards";

export const GIFT_CARD_PRICE_DISCLOSURE =
  "The option name is the card's face value and denomination currency. The amount in NPR is MTDGC's selling price, not the card balance. MTDGC adds no separate checkout fee; your bank or payment provider may charge its own fee."; 

export function isGiftCardCategory(categorySlug: string | null | undefined): boolean {
  return categorySlug === GIFT_CARD_CATEGORY_SLUG;
}
