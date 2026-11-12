import { SITE_URL, WHATSAPP_NUMBER } from "@/lib/format";

/** Confirmed from the wordmark, footer, README and master plan. */
export const BRAND_NAME = "MTDGC";
export const BRAND_FULL_NAME = "Matrix Digital Goods & Commerce";
export const BRAND_TAGLINE = "Game top-ups, gift cards and subscriptions for Nepal and Australia.";

export const BRAND_DESCRIPTION =
  "MTDGC (Matrix Digital Goods & Commerce) is the Nepal and Australia store for game top-ups, gift cards and subscriptions. Prices are in NPR, with an Australian dollar guide. You order on this site and receive your item after payment is verified.";

export const RESELLER_NOTICE =
  "Brand names and logos appear only to identify the product being sold. Trademarks belong to their owners. MTDGC is an independent reseller.";

export const LOGO_ALT = "MTDGC logo, Matrix Digital Goods & Commerce";

export function organizationJson() {
  return {
    "@type": "Organization",
    name: BRAND_NAME,
    legalName: BRAND_FULL_NAME,
    alternateName: [BRAND_FULL_NAME, "Matrix Digital Goods and Commerce"],
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/icon-512.png`,
    image: `${SITE_URL}/og/mtdgc.png`,
    description: BRAND_DESCRIPTION,
    areaServed: [
      { "@type": "Country", name: "Nepal" },
      { "@type": "Country", name: "Australia" },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      telephone: `+${WHATSAPP_NUMBER}`,
      url: `${SITE_URL}/support`,
      availableLanguage: ["English", "Nepali"],
      areaServed: ["NP", "AU"],
    },
  };
}

export function websiteJson() {
  return {
    "@type": "WebSite",
    name: BRAND_NAME,
    alternateName: BRAND_FULL_NAME,
    url: `${SITE_URL}/`,
    description: BRAND_DESCRIPTION,
    inLanguage: ["en-NP", "en-AU"],
    publisher: { "@type": "Organization", name: BRAND_NAME, legalName: BRAND_FULL_NAME },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/catalog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
