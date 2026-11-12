export type LandingFaq = { q: string; a: string };

export type Landing = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  productSlugs: string[];
  categorySlug?: string;
  paragraphs: string[];
  steps: { title: string; body: string }[];
  faqs: LandingFaq[];
};

export const LANDINGS: Landing[] = [
  {
    slug: "free-fire-diamonds-nepal",
    title: "Free Fire diamonds in Nepal | MTDGC",
    description:
      "Buy Garena Free Fire diamonds from MTDGC, Matrix Digital Goods & Commerce. Packs are priced in NPR, with an Australian dollar guide, and credited to your player ID after payment is verified.",
    h1: "Free Fire diamonds in Nepal",
    productSlugs: ["free-fire-diamonds"],
    categorySlug: "game-top-ups",
    paragraphs: [
      "Free Fire diamonds are the in-game currency for Garena Free Fire. On MTDGC you choose a diamond pack, send the player ID from your profile, and the diamonds are credited to that account after your payment is verified.",
      "Packs are priced in Nepalese rupees. Customers in Australia also see an Australian dollar guide beside the NPR price. The amount you pay is the NPR total at checkout.",
      "Diamonds are used for characters, bundles, the Elite Pass and in-game events. MTDGC needs the player ID and the in-game name shown on the listing. It does not need your Free Fire password. Check the ID before you place the order, because a credited top-up stays on the account that received it.",
      "The delivery time to expect is the time printed on the Free Fire Diamonds listing. Delivery follows payment verification.",
    ],
    steps: [
      { title: "Open the listing", body: "Choose a diamond pack on the Free Fire Diamonds page. The NPR price, and the Australian dollar guide, are on that page." },
      { title: "Copy your player ID", body: "In Free Fire, open your profile and copy the number under your name, plus the nickname the listing asks for." },
      { title: "Place the order and pay", body: "Checkout gives you an order number and the QR or bank details for the NPR total. Pay that amount and upload your payment confirmation." },
      { title: "Diamonds are credited", body: "After payment is verified, the diamonds are added to the player ID on the order. Track the order with your order number." },
    ],
    faqs: [
      {
        q: "How do I buy Free Fire diamonds in Nepal?",
        a: "Open the Free Fire Diamonds listing on MTDGC, choose a pack, enter your player ID and in-game name, and place the order. Pay the NPR total by QR or bank transfer and upload your payment confirmation. Diamonds are credited to that player ID after payment is verified.",
      },
      {
        q: "Where is my Free Fire player ID?",
        a: "Open Free Fire, tap your profile avatar, and copy the number under your name. MTDGC does not need your password.",
      },
      {
        q: "What currency do I pay?",
        a: "You pay the NPR price shown at checkout. An Australian dollar figure beside a price is a reading guide for customers in Australia.",
      },
      {
        q: "How long does a Free Fire top-up take?",
        a: "The Free Fire Diamonds listing states the delivery time to expect. Delivery follows payment verification. If the order passes that time, contact support with your order number.",
      },
    ],
  },
  {
    slug: "pubg-uc-nepal",
    title: "PUBG Mobile UC in Nepal | MTDGC",
    description:
      "Buy PUBG Mobile UC from MTDGC, Matrix Digital Goods & Commerce. UC packs are priced in NPR, with an Australian dollar guide, and credited to your player ID after payment is verified.",
    h1: "PUBG Mobile UC in Nepal",
    productSlugs: ["pubg-mobile-uc"],
    categorySlug: "game-top-ups",
    paragraphs: [
      "Unknown Cash (UC) is the in-game currency for PUBG Mobile. MTDGC credits the pack you choose to the player ID on your order after payment is verified. UC is used for the Royale Pass, crates and the in-game shop.",
      "Every pack is priced in NPR. An Australian dollar guide sits beside the price so customers in Australia can read it before they pay. Checkout stays in NPR.",
      "Find your PUBG Mobile player ID on your profile screen and copy it carefully. MTDGC does not need your login or password. A credited top-up cannot be moved to a different ID.",
      "Use the delivery time on the PUBG Mobile UC listing as the time to expect. You can follow the order with your order number.",
    ],
    steps: [
      { title: "Choose a UC pack", body: "Open the PUBG Mobile UC listing and select the pack. The selling price is the NPR amount." },
      { title: "Add your player ID", body: "Copy the player ID and the in-game name from your PUBG Mobile profile. Those are the details used for delivery." },
      { title: "Pay the NPR total", body: "Your order page shows the QR code or bank details. Pay the exact total and upload the payment confirmation." },
      { title: "UC is added to your account", body: "After payment is verified, the UC is credited to the player ID you provided." },
    ],
    faqs: [
      {
        q: "How do I buy PUBG UC in Nepal?",
        a: "Choose a pack on the PUBG Mobile UC listing, enter your player ID, place the order, and pay the NPR total. Upload your payment confirmation. UC is credited after payment is verified.",
      },
      {
        q: "What is UC?",
        a: "UC is Unknown Cash, the currency inside PUBG Mobile. It is spent in the in-game shop, on the Royale Pass and on crates.",
      },
      {
        q: "Can I order PUBG UC from Australia?",
        a: "Yes. MTDGC serves customers in Nepal and Australia. You pay the NPR price. The Australian dollar figure is a guide.",
      },
      {
        q: "What if I enter the wrong player ID?",
        a: "Tell support immediately with your order number if the top-up has not been credited yet. Once UC is credited to an ID, it cannot be moved.",
      },
    ],
  },
  {
    slug: "steam-gift-card-nepal",
    title: "Steam gift card in Nepal | MTDGC",
    description:
      "Steam wallet codes from MTDGC, Matrix Digital Goods & Commerce. The listing shows whether a code can be ordered, the store region, and the NPR price, with an Australian dollar guide.",
    h1: "Steam gift card in Nepal",
    productSlugs: ["steam-wallet-code"],
    categorySlug: "gift-cards",
    paragraphs: [
      "A Steam wallet code adds balance to a Steam account. The code is tied to a store region, so the region on the denomination has to match the region of the Steam account that will redeem it.",
      "MTDGC lists Steam wallet codes with the NPR selling price and an Australian dollar guide. The product page shows whether that code can be ordered today. If the listing is not open, you cannot check out, and no payment is taken.",
      "When a code is open for orders, you place the order on this site, pay the NPR total, and upload your payment confirmation. After payment is verified, the code is sent to your delivery email and shown on your order page.",
      "Redeem a code in the Steam client under Games, then Redeem a Steam Wallet Code, while signed in to the account that should receive the balance. A code that has been revealed cannot be taken back, so confirm the region and the email before you pay.",
    ],
    steps: [
      { title: "Check the listing", body: "Open the Steam Wallet Code page. It shows the region, the NPR price and whether the code can be ordered." },
      { title: "Match your Steam region", body: "The wallet region on the denomination must be the region of your Steam account. A mismatch will not redeem." },
      { title: "Order and pay in NPR", body: "Place the order with your delivery email, pay the NPR total, and upload your payment confirmation." },
      { title: "Redeem the code", body: "After verification, redeem the code in Steam on the account that should receive the wallet balance." },
    ],
    faqs: [
      {
        q: "Will a Steam wallet code work on my account?",
        a: "Only if the store region on the code matches your Steam account region. Check the region on the listing before you order.",
      },
      {
        q: "Can I order a Steam code right now?",
        a: "The Steam Wallet Code page shows whether it is open for orders. A listing that is not open does not take payment.",
      },
      {
        q: "How is the code delivered?",
        a: "After payment is verified, the code is sent to your delivery email and shown on your order page.",
      },
      {
        q: "Who sells the code?",
        a: "MTDGC, Matrix Digital Goods & Commerce, sells the code as an independent reseller. Steam and Valve trademarks belong to their owners.",
      },
    ],
  },
  {
    slug: "game-top-up-australia",
    title: "Game top-up Australia | MTDGC",
    description:
      "Order game top-ups from Australia at MTDGC, Matrix Digital Goods & Commerce. Prices are in NPR with an Australian dollar guide. Top-ups are credited to your player ID after payment is verified.",
    h1: "Game top-ups from Australia",
    productSlugs: [],
    categorySlug: "game-top-ups",
    paragraphs: [
      "MTDGC sells game top-ups to customers in Australia and Nepal. You order on this website: choose the game, enter the player ID the listing asks for, and pay the NPR total. The top-up is credited after payment is verified.",
      "Prices are set in Nepalese rupees. Each price also shows an Australian dollar guide so you can read the amount before you pay. The guide is not a second checkout currency. The amount due is the NPR price.",
      "A top-up uses the player ID, and sometimes a zone or server ID, from your game profile. MTDGC does not ask for your game password, one-time code or payment PIN. Support for customers in Australia is the same WhatsApp line and the support page on this site.",
      "The delivery time on the game's listing is the time to expect. Track the order with the order number from checkout, and contact support if it passes that time.",
    ],
    steps: [
      { title: "Pick the game", body: "Open a game top-up listing. The page shows the packs, the region and the details the order needs." },
      { title: "Read the NPR price and the A$ guide", body: "You pay the NPR amount. The Australian dollar figure is there so the price is easy to read from Australia." },
      { title: "Enter your player ID", body: "Copy it from the game profile. Add a zone or server only when the listing asks for one." },
      { title: "Pay and track", body: "Pay by QR or bank transfer, upload the payment confirmation, and follow delivery with your order number." },
    ],
    faqs: [
      {
        q: "Can I order a game top-up from Australia?",
        a: "Yes. MTDGC serves customers in Australia and Nepal from this store. You place the order on the website.",
      },
      {
        q: "Do I pay in Australian dollars?",
        a: "You pay the NPR price. Listings show an Australian dollar guide beside the NPR amount. Checkout does not charge a separate AUD total.",
      },
      {
        q: "What details does a top-up need?",
        a: "The player ID printed in the game, and a zone or server if the listing asks. Never send a password.",
      },
      {
        q: "How do I reach support from Australia?",
        a: "Message MTDGC on WhatsApp at +977 9740204403 or use the support page. Include your order number.",
      },
    ],
  },
];

export function getLanding(slug: string): Landing | undefined {
  return LANDINGS.find((landing) => landing.slug === slug);
}

export function landingPath(slug: string): string {
  return `/guides/${slug}`;
}

export const LANDING_PATHS = LANDINGS.map((landing) => landingPath(landing.slug));
