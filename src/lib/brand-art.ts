// Logo-on-brand-colour product art, drawn in code.
// Brand marks are Simple Icons SVG paths (simple-icons 16.35.0, CC0 1.0). The trademarks
// belong to their owners and are shown only to identify the product being sold.
// Brands Simple Icons does not carry fall back to a coded text tile.
// Products with real artwork (for example the Netflix listing) keep their own image.

const ICON = {
  google: "M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z",
  grammarly: "M12 24H.032V12c0-3.314 1.341-6.314 3.504-8.486C5.703 1.344 8.694 0 12 0c3.305 0 6.297 1.344 8.463 3.514 2.164 2.172 3.505 5.172 3.505 8.486s-1.338 6.314-3.505 8.486C18.297 22.656 15.305 24 12 24m2.889-13.137-1.271 2.205h4.418c-.505 2.882-3.018 5.078-6.036 5.078-3.38 0-6.132-2.757-6.132-6.146S8.618 5.854 12 5.854c1.821 0 3.458.801 4.584 2.069l1.143-1.988c-1.493-1.418-3.506-2.29-5.725-2.29-4.6 0-8.332 3.74-8.332 8.355s3.73 8.354 8.332 8.354c4.603 0 8.332-3.739 8.332-8.354 0-.387-.029-.765-.079-1.137z",
  nordvpn: "M2.2838 21.5414A11.9866 11.9866 0 010 14.4832C0 7.8418 5.3727 2.4586 12 2.4586c6.6279 0 12 5.3832 12 12.0246a11.9853 11.9853 0 01-2.2838 7.0582l-5.7636-9.3783-.5565.9419.5645 2.6186L12 8.9338l-2.45 4.1447.5707 2.6451-2.0764-3.5555-5.7605 9.3733z",
  spotify: "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z",
  youtube: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  valorant: "M23.792 2.152a.252.252 0 0 0-.098.083c-3.384 4.23-6.769 8.46-10.15 12.69-.107.093-.025.288.119.265 2.439.003 4.877 0 7.316.001a.66.66 0 0 0 .552-.25c.774-.967 1.55-1.934 2.324-2.903a.72.72 0 0 0 .144-.49c-.002-3.077 0-6.153-.003-9.23.016-.11-.1-.206-.204-.167zM.077 2.166c-.077.038-.074.132-.076.205.002 3.074.001 6.15.001 9.225a.679.679 0 0 0 .158.463l7.64 9.55c.12.152.308.25.505.247 2.455 0 4.91.003 7.365 0 .142.02.222-.174.116-.265C10.661 15.176 5.526 8.766.4 2.35c-.08-.094-.174-.272-.322-.184z",
} as const;

export type BrandIcon = { path: string; color: string };
export type BrandArt = { label: string; sub: string; bg: [string, string]; fg: string; icons: BrandIcon[] };

export const BRAND_ART: Record<string, BrandArt> = {
  "sample-adobe-creative-cloud": { label: "Adobe", sub: "Creative Cloud", bg: ["#E1251B", "#B3150C"], fg: "#FFFFFF", icons: [] },
  "sample-canva-pro": { label: "Canva", sub: "Pro", bg: ["#00C4CC", "#7D2AE8"], fg: "#FFFFFF", icons: [] },
  "sample-capcut-pro": { label: "CapCut", sub: "Pro", bg: ["#111111", "#2A2A2A"], fg: "#FFFFFF", icons: [] },
  "sample-chatgpt-plus": { label: "ChatGPT", sub: "Plus", bg: ["#10A37F", "#0B7A5F"], fg: "#FFFFFF", icons: [] },
  "sample-disney-plus-hotstar": { label: "Disney+", sub: "Hotstar", bg: ["#0B1647", "#1F3DA8"], fg: "#FFFFFF", icons: [] },
  "sample-genshin-impact-crystals": { label: "Genshin Impact", sub: "Genesis Crystals", bg: ["#1C2541", "#3A506B"], fg: "#F4DFA0", icons: [] },
  "sample-google-one-100gb": { label: "Google One", sub: "100 GB", bg: ["#FFFFFF", "#EEF3FE"], fg: "#202124", icons: [{ path: ICON.google, color: "#4285F4" }] },
  "sample-grammarly-premium": { label: "Grammarly", sub: "Premium", bg: ["#027E6F", "#015C51"], fg: "#FFFFFF", icons: [{ path: ICON.grammarly, color: "#FFFFFF" }] },
  "sample-kaspersky-standard": { label: "Kaspersky", sub: "Standard", bg: ["#006D5C", "#00483D"], fg: "#FFFFFF", icons: [] },
  "sample-microsoft-365-family": { label: "Microsoft 365", sub: "Family", bg: ["#0F6CBD", "#0A4C86"], fg: "#FFFFFF", icons: [] },
  "sample-nordvpn": { label: "NordVPN", sub: "VPN plan", bg: ["#4687FF", "#2C5FD9"], fg: "#FFFFFF", icons: [{ path: ICON.nordvpn, color: "#FFFFFF" }] },
  "sample-office-2021-pro-plus": { label: "Office 2021", sub: "Professional Plus", bg: ["#C43E1C", "#912C12"], fg: "#FFFFFF", icons: [] },
  "sample-prime-video": { label: "Prime Video", sub: "Membership", bg: ["#00A8E1", "#0F79AF"], fg: "#FFFFFF", icons: [] },
  "sample-deal-spotify-youtube": { label: "Spotify + YouTube", sub: "Bundle", bg: ["#121212", "#232323"], fg: "#FFFFFF", icons: [{ path: ICON.spotify, color: "#1ED760" }, { path: ICON.youtube, color: "#FF0000" }] },
  "sample-spotify-premium": { label: "Spotify", sub: "Premium", bg: ["#1ED760", "#17B04F"], fg: "#0B0B0B", icons: [{ path: ICON.spotify, color: "#0B0B0B" }] },
  "sample-valorant-points": { label: "VALORANT", sub: "Points", bg: ["#FA4454", "#C8303E"], fg: "#FFFFFF", icons: [{ path: ICON.valorant, color: "#FFFFFF" }] },
  "sample-windows-11-pro": { label: "Windows 11", sub: "Pro", bg: ["#0067C0", "#00478A"], fg: "#FFFFFF", icons: [] },
  "sample-deal-office-windows-bundle": { label: "Windows + Office", sub: "Bundle", bg: ["#0067C0", "#C43E1C"], fg: "#FFFFFF", icons: [] },
  "sample-youtube-premium": { label: "YouTube", sub: "Premium", bg: ["#0F0F0F", "#262626"], fg: "#FFFFFF", icons: [{ path: ICON.youtube, color: "#FF0000" }] },
};

function esc(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);
}

/** True when the product has no artwork of its own and should use the coded tile. */
export function usesCodedArt(slug: string, imageUrl: string | null): boolean {
  if (!imageUrl) return true;
  return imageUrl.startsWith("/images/products/sample-") && slug in BRAND_ART;
}

/** Fallback art for products without a BRAND_ART entry: brand name on a dark green field. */
export function fallbackArt(label: string, sub: string): BrandArt {
  return { label, sub, bg: ["#0f1a14", "#16261d"], fg: "#E8F5EC", icons: [] };
}

export function brandArtFor(slug: string, name: string, brand: string, category?: string | null): BrandArt {
  return BRAND_ART[slug] ?? fallbackArt(brand || name, category ?? name);
}

/**
 * Square SVG for the art. Rendered inline on the site. The sample cover files in
 * public/images/products were rasterised from this same SVG.
 */
export function brandArtSvg(art: BrandArt, opts: { id: string; comingSoon?: boolean } = { id: "a" }): string {
  const id = opts.id.replace(/[^a-z0-9-]/gi, "");
  const hasIcon = art.icons.length > 0;
  const label = esc(art.label);
  const sub = esc(art.sub.toUpperCase());
  const len = art.label.length;
  const labelSize = hasIcon ? (len > 14 ? 30 : len > 10 ? 36 : 42) : len > 14 ? 40 : len > 10 ? 48 : len > 7 ? 58 : 68;
  const labelY = hasIcon ? 300 : 212;
  const subY = hasIcon ? 340 : 262;
  const iconSize = art.icons.length > 1 ? 96 : 120;
  const gap = 28;
  const total = art.icons.length * iconSize + (art.icons.length - 1) * gap;
  const icons = art.icons
    .map((icon, i) => {
      const x = 200 - total / 2 + i * (iconSize + gap);
      const y = 150 - iconSize / 2;
      const s = iconSize / 24;
      return `<path transform="translate(${x} ${y}) scale(${s})" d="${icon.path}" fill="${icon.color}"/>`;
    })
    .join("");
  const tag = opts.comingSoon
    ? `<g><rect x="252" y="22" width="126" height="32" rx="16" fill="#000" fill-opacity="0.45"/><text x="315" y="43" text-anchor="middle" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="700" letter-spacing="1" fill="#FFFFFF">COMING SOON</text></g>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" role="img" aria-label="${label}"><defs><linearGradient id="g-${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${art.bg[0]}"/><stop offset="1" stop-color="${art.bg[1]}"/></linearGradient><pattern id="p-${id}" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="${art.fg}" stroke-opacity="0.06" stroke-width="1"/></pattern></defs><rect width="400" height="400" fill="url(#g-${id})"/><rect width="400" height="400" fill="url(#p-${id})"/>${icons}<text x="200" y="${labelY}" text-anchor="middle" font-family="Space Grotesk, ui-sans-serif, system-ui, sans-serif" font-size="${labelSize}" font-weight="700" fill="${art.fg}">${label}</text><text x="200" y="${subY}" text-anchor="middle" font-family="JetBrains Mono, ui-monospace, monospace" font-size="16" font-weight="500" letter-spacing="3" fill="${art.fg}" fill-opacity="0.72">${sub}</text>${tag}</svg>`;
}
