// Logo-on-brand-colour product art, drawn in code.
// Brand marks are sourced from Simple Icons and Iconify's logos set (CC0 1.0).
// Trademarks belong to their respective owners and identify the product being sold.
// Brands Simple Icons does not carry fall back to a coded text tile.
// Products with real artwork (for example the Netflix listing) keep their own image.

const ICON = {
  google: "M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z",
  grammarly: "M12 24H.032V12c0-3.314 1.341-6.314 3.504-8.486C5.703 1.344 8.694 0 12 0c3.305 0 6.297 1.344 8.463 3.514 2.164 2.172 3.505 5.172 3.505 8.486s-1.338 6.314-3.505 8.486C18.297 22.656 15.305 24 12 24m2.889-13.137-1.271 2.205h4.418c-.505 2.882-3.018 5.078-6.036 5.078-3.38 0-6.132-2.757-6.132-6.146S8.618 5.854 12 5.854c1.821 0 3.458.801 4.584 2.069l1.143-1.988c-1.493-1.418-3.506-2.29-5.725-2.29-4.6 0-8.332 3.74-8.332 8.355s3.73 8.354 8.332 8.354c4.603 0 8.332-3.739 8.332-8.354 0-.387-.029-.765-.079-1.137z",
  nordvpn: "M2.2838 21.5414A11.9866 11.9866 0 010 14.4832C0 7.8418 5.3727 2.4586 12 2.4586c6.6279 0 12 5.3832 12 12.0246a11.9853 11.9853 0 01-2.2838 7.0582l-5.7636-9.3783-.5565.9419.5645 2.6186L12 8.9338l-2.45 4.1447.5707 2.6451-2.0764-3.5555-5.7605 9.3733z",
  spotify: "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z",
  youtube: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  valorant: "M23.792 2.152a.252.252 0 0 0-.098.083c-3.384 4.23-6.769 8.46-10.15 12.69-.107.093-.025.288.119.265 2.439.003 4.877 0 7.316.001a.66.66 0 0 0 .552-.25c.774-.967 1.55-1.934 2.324-2.903a.72.72 0 0 0 .144-.49c-.002-3.077 0-6.153-.003-9.23.016-.11-.1-.206-.204-.167zM.077 2.166c-.077.038-.074.132-.076.205.002 3.074.001 6.15.001 9.225a.679.679 0 0 0 .158.463l7.64 9.55c.12.152.308.25.505.247 2.455 0 4.91.003 7.365 0 .142.02.222-.174.116-.265C10.661 15.176 5.526 8.766.4 2.35c-.08-.094-.174-.272-.322-.184z",
  kaspersky: "M10.812 12.014c0 .91-.555 1.34-1.25 1.34h-.424v-.546h.392c.419 0 .698-.226.698-.794 0-.563-.264-.844-.71-.844-.43 0-.738.265-.738.833v2.282H8.2v-3.589h.58v.309h.082a.94.94 0 0 1 .776-.375c.64 0 1.174.463 1.174 1.384zm-3.804-.237l-.386-.039c-.304-.027-.464-.11-.464-.287 0-.21.204-.33.497-.33.303 0 .496.143.512.347h.557c-.022-.518-.424-.838-1.064-.838-.645 0-1.08.342-1.08.843 0 .42.264.69.865.75l.392.039c.237.022.397.072.397.298 0 .204-.15.352-.54.352-.361 0-.539-.163-.601-.382H5.49c.06.5.481.89 1.203.89.678 0 1.12-.359 1.12-.888 0-.469-.31-.706-.805-.755zm6.047.753c-.091.208-.308.366-.616.366-.425 0-.739-.276-.739-.871 0-.568.292-.882.744-.882.403 0 .634.242.657.606h-1.043v.42h1.61v-.277c0-.766-.507-1.262-1.23-1.262-.672 0-1.317.457-1.317 1.395 0 .937.645 1.395 1.318 1.395.615 0 1.054-.38 1.19-.89zm-9.127-1.9c-.634 0-1.108.33-1.163.838h.623c.044-.188.215-.325.54-.325.42 0 .557.22.557.49v.91c-.237.27-.513.397-.788.397-.287 0-.486-.138-.486-.386 0-.237.155-.386.452-.386h.464v-.419h-.48c-.662 0-1.031.331-1.031.838 0 .474.358.833.948.833.331 0 .623-.133.838-.292h.083v.226h.579v-1.776c0-.656-.447-.948-1.136-.948zM0 13.354h.579v-3.64H0zm2.432-2.658h-.706l-.844 1.108v.348l.866 1.202h.717L1.45 11.975zm20.928 0l-.474 1.053c-.116.254-.226.502-.259.667h-.083c-.033-.165-.148-.408-.264-.661l-.474-1.059h-.64l1.114 2.387-.552 1.202h.618L24 10.696zm-2.322 0h-.706l-.843 1.108v.348l.865 1.202h.717l-1.015-1.379zm-3.625 1.08l-.386-.038c-.303-.027-.463-.11-.463-.287 0-.21.204-.33.496-.33.303 0 .496.143.513.347h.557c-.022-.518-.425-.838-1.064-.838-.645 0-1.081.342-1.081.843 0 .42.265.69.866.75l.391.039c.237.022.397.072.397.298 0 .204-.149.352-.54.352-.36 0-.538-.163-.6-.382h-.603c.06.5.481.89 1.203.89.678 0 1.12-.359 1.12-.888 0-.469-.31-.706-.806-.755zm1.193 1.578h.58v-3.64h-.58zm-3.817-2.35h-.083v-.308h-.579v2.658h.579v-1.39c0-.474.219-.75.65-.75h.367v-.584h-.212c-.4 0-.57.15-.722.375z",
} as const;

export type BrandIcon = { path?: string; color?: string; width?: number; height?: number; body?: string };
export type BrandArt = { label: string; sub: string; bg: [string, string]; fg: string; icons: BrandIcon[] };

// Additional verified marks from Iconify's CC0 logos set.
const SVG_ICON: Record<string, BrandIcon> = {
  "adobe": {
    "width": 512,
    "height": 134,
    "body": "<path fill=\"#fa0f00\" d=\"m221.02 88.874l-5.524 17.025c-.152.567-.68.952-1.266.921h-13.327c-.805 0-1.033-.46-.922-1.149l23.005-66.373a20.9 20.9 0 0 0 1.155-7.02a.766.766 0 0 1 .689-.804h18.408c.555 0 .805.116.922.688l26.098 73.626c.228.555.117 1.032-.555 1.032h-14.954a1.16 1.16 0 0 1-1.266-.805l-5.864-17.141zm4.138-14.377h18.18l-1.75-5.633c-2.411-7.66-5.621-17.629-7.34-24.047h-.117c-1.838 7.708-5.98 20.363-8.973 29.68m46.932 4.232c-.005-16.448 12.3-30.252 33.356-30.252c.917 0 2.072.116 3.799.227V26.043a.727.727 0 0 1 .587-.797l14.71-.008c.556 0 .695.227.695.688V93.91a65 65 0 0 0 .46 8.402c0 .444-.074.693-.456.89l-.348.142a57.8 57.8 0 0 1-22.662 4.604c-17.025 0-30.14-9.662-30.14-29.22m37.155-16.337a11.9 11.9 0 0 0-4.26-.555a15.35 15.35 0 0 0-16.465 15.007l.018 1.096c0 11.389 6.558 16.337 15.298 16.337a16.2 16.2 0 0 0 5.409-.689zm81.83 14.32l.041 1.206c0 18.063-11.733 30.024-28.32 30.024c-19.673 0-28.414-14.837-28.414-29.68a28.147 28.147 0 0 1 28.642-29.791c18.044 0 27.574 13.211 28.051 28.24m-40.473 1.306c0 10.123 4.715 16.564 12.422 16.564c6.664 0 11.733-5.753 11.733-16.337c0-8.973-3.681-16.447-12.421-16.447c-6.664 0-11.734 5.98-11.734 16.22m50.654-52.78l14.032-.006c.921 0 1.15.117 1.15.922v23.583a37 37 0 0 1 7.706-1.217l1.955-.049a26.326 26.326 0 0 1 27.63 25.998l-.021 1.383c0 21.512-17.025 32.096-34.506 32.096a60.2 60.2 0 0 1-18.063-2.643a1.36 1.36 0 0 1-.689-1.15v-78.11c0-.555.228-.805.806-.805m22.959 36.79l-.987.014a23.4 23.4 0 0 0-6.785.922v31.174c.93.215 1.876.356 2.828.42l1.43.04a15.83 15.83 0 0 0 16.66-17.252a13.516 13.516 0 0 0-13.146-15.317m51.97 20.371c.555 6.558 5.175 11.966 16.448 11.966c4.847.09 9.662-.811 14.148-2.648c.35-.228.694-.117.694.555V103.2c0 .805-.227 1.15-.805 1.383a38.65 38.65 0 0 1-15.79 3.374l-1.812-.043c-21.623 0-29.22-14.837-29.22-29.102c0-15.479 9.296-29.643 26.498-30.342l1.339-.027a23.455 23.455 0 0 1 24.272 24.85a37 37 0 0 1-.556 7.707a.994.994 0 0 1-.921.921q-4.433.42-8.884.47zm14.954-11.156a37.5 37.5 0 0 0 5.753-.227v-.806a9.357 9.357 0 0 0-9.779-9.09a10.9 10.9 0 0 0-11.045 10.123zM75.314 49.137l35.466 84.148H87.535l-10.611-26.798H50.97zM150.599 0v133.269L94.921 0zM55.701 0L0 133.269V0z\"/>"
  },
  "openai": {
    "width": 512,
    "height": 126,
    "body": "<path d=\"M365.131 49.074c-7.537 0-12.917 2.575-15.557 7.45l-1.42 2.64v-8.819H335.89v53.61h12.901V72.06c0-7.62 4.142-11.991 11.356-11.991c6.88 0 10.825 4.256 10.825 11.674v32.211h12.907V69.442c0-12.764-7.007-20.368-18.747-20.368m-62.565 0c-15.224 0-24.652 9.5-24.652 24.789v7.527c0 14.703 9.538 23.835 24.893 23.835c10.271 0 17.47-3.763 22-11.504l-7.998-4.602c-3.347 4.465-8.694 7.231-13.997 7.231c-7.773 0-12.413-4.798-12.413-12.84v-2.131h36.008v-8.891c0-14.243-9.352-23.414-23.83-23.414zm12.1 23.638h-24.311v-1.287c0-8.825 4.333-13.695 12.2-13.695c7.576 0 12.101 4.798 12.101 12.84zM512 41.52V31.265h-44.625V41.52h15.646v52.157h-15.646v10.255H512V93.677h-15.651V41.52zM173.638 29.786c-19.93 0-32.32 12.419-32.32 32.42v10.813c0 19.995 12.385 32.42 32.32 32.42s32.321-12.425 32.321-32.42V62.205c-.005-20.022-12.408-32.42-32.321-32.42m18.987 43.973c0 13.279-6.919 20.893-18.987 20.893s-18.982-7.614-18.982-20.893V61.46c0-13.279 6.925-20.893 18.988-20.893S192.63 48.18 192.63 61.46zm53.856-24.685c-6.771 0-12.633 2.805-15.69 7.5l-1.386 2.136v-8.365h-12.27V122.4h12.906V96.3l1.38 2.049c2.904 4.306 8.574 6.875 15.17 6.875c11.125 0 22.35-7.27 22.35-23.518v-9.115c0-11.707-6.919-23.518-22.46-23.518m9.554 32.003c0 8.64-5.04 14.008-13.148 14.008c-7.56 0-12.835-5.675-12.835-13.794v-8.064c0-8.217 5.319-14.002 12.945-14.002c8.047 0 13.048 5.363 13.048 14.002zM419.54 31.27l-26.037 72.684h13.109l4.985-15.58h29.932l.05.154l4.93 15.426h13.104l-26.082-72.69zm-4.744 46.855l11.745-36.748l11.625 36.748zM116.085 51.561a31.37 31.37 0 0 0-2.695-25.774a31.77 31.77 0 0 0-34.184-15.224A31.4 31.4 0 0 0 55.536.001a31.74 31.74 0 0 0-30.278 21.99A31.4 31.4 0 0 0 4.282 37.213a31.77 31.77 0 0 0 3.906 37.218a31.4 31.4 0 0 0 2.695 25.748a31.77 31.77 0 0 0 34.21 15.256a31.4 31.4 0 0 0 23.644 10.562a31.74 31.74 0 0 0 30.278-21.99a31.4 31.4 0 0 0 20.97-15.223a31.73 31.73 0 0 0-3.9-37.224m-47.348 66.22a23.52 23.52 0 0 1-15.108-5.478c.186-.104.548-.285.756-.422l25.09-14.484a4.07 4.07 0 0 0 2.06-3.567V58.453l10.6 6.119a.37.37 0 0 1 .208.296v29.28c0 13.041-10.564 23.618-23.606 23.633M18.015 96.12a23.56 23.56 0 0 1-2.82-15.821c.185.115.514.312.744.443l25.096 14.49a4.08 4.08 0 0 0 4.12 0L75.77 77.528v12.238a.37.37 0 0 1-.148.328L50.26 104.732c-11.292 6.502-25.716 2.637-32.245-8.64zm-6.573-54.782a23.5 23.5 0 0 1 12.287-10.354v29.823a4.08 4.08 0 0 0 2.06 3.567l30.623 17.683l-10.639 6.141a.37.37 0 0 1-.356.033L20.059 73.589c-11.282-6.527-15.148-20.957-8.64-32.25zm87.102 20.27L67.92 43.924l10.59-6.125a.38.38 0 0 1 .355-.033l25.359 14.643a23.61 23.61 0 0 1-3.649 42.598V65.191a4.08 4.08 0 0 0-2.049-3.583zM109.1 45.721a30 30 0 0 0-.745-.444L83.26 30.788a4.08 4.08 0 0 0-4.12 0L48.517 48.466V36.233a.4.4 0 0 1 .154-.328l25.358-14.638a23.61 23.61 0 0 1 35.06 24.46zM42.738 67.546l-10.605-6.119a.4.4 0 0 1-.203-.295V31.85a23.605 23.605 0 0 1 38.714-18.155c-.186.105-.52.285-.756.422l-25.09 14.484a4.08 4.08 0 0 0-2.06 3.567zm5.758-12.418l13.64-7.878l13.635 7.878v15.744l-13.64 7.877l-13.64-7.877z\"/>"
  },
  "google_one": {
    "width": 256,
    "height": 516,
    "body": "<defs><linearGradient id=\"SVGDvi8keKw\" x1=\"50%\" x2=\"50%\" y1=\"100.777%\" y2=\"-.04%\"><stop offset=\"0%\" stop-color=\"#1a73e8\"/><stop offset=\"100%\" stop-color=\"#4285f4\"/></linearGradient></defs><path fill=\"#34a853\" d=\"M256 404.228v54.076c0 31.638-25.573 57.3-57.122 57.3c-31.55 0-57.124-25.633-57.124-57.3V316.726z\"/><path fill=\"url(#SVGDvi8keKw)\" d=\"M256 57.299v346.929l-114.246-87.502V178.752l93.477-77.278c13.71-11.307 20.77-27.682 20.77-44.175\"/><path fill=\"#ea4335\" d=\"M255.971 55.307c.03.644.03 1.289.03 1.963c0 16.492-7.06 32.868-20.77 44.175l-93.477 77.278V57.299c0-18.748 8.994-35.446 22.967-45.904a38 38 0 0 1 3.076-2.138c.498-.322.966-.645 1.464-.938c.908-.585 1.875-1.113 2.754-1.581l2.52-1.26l2.108-.967c.85-.351 1.7-.703 2.608-1.025c.85-.322 1.757-.615 2.636-.908c1.64-.498 3.31-.967 5.039-1.318c.498-.118 1.025-.205 1.581-.323l1.143-.175c.674-.118 1.347-.205 2.021-.293a32 32 0 0 1 2.402-.264c.645-.059 1.29-.117 1.934-.146c.937-.03 1.904-.059 2.87-.059h.03c2.08 0 4.101.117 6.152.322q1.493.176 3.075.44c.996.146 1.992.351 3.047.586c.996.205 1.992.468 2.988.761c.82.205 1.67.469 2.49.762c1.611.527 3.222 1.113 4.746 1.787a78 78 0 0 1 2.285 1.025c.966.469 1.933.967 2.87 1.465a59 59 0 0 1 4.102 2.519c.146.117.292.205.439.293c1.435.996 2.812 2.08 4.189 3.193c.674.586 1.347 1.142 2.021 1.758l.059.058c.644.615 1.289 1.23 1.933 1.875s1.29 1.318 1.904 1.963c1.26 1.347 2.402 2.783 3.486 4.247c.762.996 1.465 2.05 2.139 3.076c.322.498.644.967.937 1.465c.586.908 1.113 1.875 1.582 2.754c.352.703.908 1.845 1.26 2.519c.322.703.644 1.406.937 2.109c.352.85.703 1.728 1.025 2.607c.323.85.616 1.758.88 2.637c.38 1.26.702 2.519.995 3.75c.176.585.293 1.142.381 1.728c.176.82.322 1.61.469 2.402c.117.644.175 1.289.263 1.933c.118.791.205 1.582.264 2.402c.059.645.117 1.29.146 1.934c-.029.293 0 .615 0 .937\"/><path fill=\"#fbbc04\" d=\"M162.494 13.065a39 39 0 0 1 2.168-1.67c-13.914 10.458-22.908 27.127-22.908 45.904v121.453l-48.51 40.162c-10.605 8.817-23.436 13.065-36.237 13.065c-16.434 0-32.75-7.09-44-20.828C-7 186.72-3.543 150.63 20.741 130.534z\"/>"
  },
  "microsoft_icon": {
    "width": 256,
    "height": 256,
    "body": "<path fill=\"#f1511b\" d=\"M121.666 121.666H0V0h121.666z\"/><path fill=\"#80cc28\" d=\"M256 121.666H134.335V0H256z\"/><path fill=\"#00adef\" d=\"M121.663 256.002H0V134.336h121.663z\"/><path fill=\"#fbbc09\" d=\"M256 256.002H134.335V134.336H256z\"/>"
  },
  "microsoft_windows_icon": {
    "width": 256,
    "height": 256,
    "body": "<path fill=\"#0078d4\" d=\"M0 0h121.329v121.329H0zm134.671 0H256v121.329H134.671zM0 134.671h121.329V256H0zm134.671 0H256V256H134.671z\"/>"
  }
};

export const BRAND_ART: Record<string, BrandArt> = {
  "sample-adobe-creative-cloud": { label: "Adobe", sub: "Creative Cloud", bg: ["#E1251B", "#B3150C"], fg: "#FFFFFF", icons: [SVG_ICON.adobe] },
  "sample-canva-pro": { label: "Canva", sub: "Pro", bg: ["#00C4CC", "#7D2AE8"], fg: "#FFFFFF", icons: [] },
  "sample-capcut-pro": { label: "CapCut", sub: "Pro", bg: ["#111111", "#2A2A2A"], fg: "#FFFFFF", icons: [] },
  "sample-chatgpt-plus": { label: "ChatGPT", sub: "Plus", bg: ["#10A37F", "#0B7A5F"], fg: "#FFFFFF", icons: [SVG_ICON.openai] },
  "sample-disney-plus-hotstar": { label: "Disney+", sub: "Hotstar", bg: ["#0B1647", "#1F3DA8"], fg: "#FFFFFF", icons: [] },
  "sample-genshin-impact-crystals": { label: "Genshin Impact", sub: "Genesis Crystals", bg: ["#1C2541", "#3A506B"], fg: "#F4DFA0", icons: [] },
  "sample-google-one-100gb": { label: "Google One", sub: "100 GB", bg: ["#FFFFFF", "#EEF3FE"], fg: "#202124", icons: [SVG_ICON.google_one] },
  "sample-grammarly-premium": { label: "Grammarly", sub: "Premium", bg: ["#027E6F", "#015C51"], fg: "#FFFFFF", icons: [{ path: ICON.grammarly, color: "#FFFFFF" }] },
  "sample-kaspersky-standard": { label: "Kaspersky", sub: "Standard", bg: ["#006D5C", "#00483D"], fg: "#FFFFFF", icons: [{ path: ICON.kaspersky, color: "#FFFFFF" }] },
  "sample-microsoft-365-family": { label: "Microsoft 365", sub: "Family", bg: ["#0F6CBD", "#0A4C86"], fg: "#FFFFFF", icons: [SVG_ICON.microsoft_icon] },
  "sample-nordvpn": { label: "NordVPN", sub: "VPN plan", bg: ["#4687FF", "#2C5FD9"], fg: "#FFFFFF", icons: [{ path: ICON.nordvpn, color: "#FFFFFF" }] },
  "sample-office-2021-pro-plus": { label: "Office 2021", sub: "Professional Plus", bg: ["#C43E1C", "#912C12"], fg: "#FFFFFF", icons: [SVG_ICON.microsoft_icon] },
  "sample-prime-video": { label: "Prime Video", sub: "Membership", bg: ["#00A8E1", "#0F79AF"], fg: "#FFFFFF", icons: [] },
  "sample-deal-spotify-youtube": { label: "Spotify + YouTube", sub: "Bundle", bg: ["#121212", "#232323"], fg: "#FFFFFF", icons: [{ path: ICON.spotify, color: "#1ED760" }, { path: ICON.youtube, color: "#FF0000" }] },
  "sample-spotify-premium": { label: "Spotify", sub: "Premium", bg: ["#1ED760", "#17B04F"], fg: "#0B0B0B", icons: [{ path: ICON.spotify, color: "#0B0B0B" }] },
  "sample-valorant-points": { label: "VALORANT", sub: "Points", bg: ["#FA4454", "#C8303E"], fg: "#FFFFFF", icons: [{ path: ICON.valorant, color: "#FFFFFF" }] },
  "sample-windows-11-pro": { label: "Windows 11", sub: "Pro", bg: ["#0067C0", "#00478A"], fg: "#FFFFFF", icons: [SVG_ICON.microsoft_windows_icon] },
  "sample-deal-office-windows-bundle": { label: "Windows + Office", sub: "Bundle", bg: ["#0067C0", "#C43E1C"], fg: "#FFFFFF", icons: [SVG_ICON.microsoft_icon] },
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
  const gap = art.icons.length > 1 ? 28 : 0;
  const layouts = art.icons.map((icon) => {
    const viewWidth = icon.width ?? 24;
    const viewHeight = icon.height ?? 24;
    const desiredScale = iconSize / viewHeight;
    const maxWidthScale = 260 / viewWidth;
    const scale = Math.min(desiredScale, maxWidthScale);
    return { icon, width: viewWidth * scale, height: viewHeight * scale, viewWidth, viewHeight };
  });
  const total = layouts.reduce((sum, item) => sum + item.width, 0) + Math.max(0, layouts.length - 1) * gap;
  let cursorX = 200 - total / 2;
  const icons = layouts.map(({ icon, width, height, viewWidth, viewHeight }) => {
    const x = cursorX;
    const y = 150 - height / 2;
    cursorX += width + gap;
    const rawMarkup = icon.body ?? (icon.path ? `<path d="${icon.path}" fill="${icon.color ?? art.fg}"/>` : "");
    const scope = `logo-${id}`;
    const markup = rawMarkup
      .replace(/\\bid="([^"]+)"/g, (_match, name: string) => `id="${scope}-${name}"`)
      .replace(/url\\(#([^)]+)\\)/g, (_match, name: string) => `url(#${scope}-${name})`);
    return `<svg x="${x}" y="${y}" width="${width}" height="${height}" viewBox="0 0 ${viewWidth} ${viewHeight}" preserveAspectRatio="xMidYMid meet">${markup}</svg>`;
  }).join("");
  const tag = opts.comingSoon
    ? `<g><rect x="252" y="22" width="126" height="32" rx="16" fill="#000" fill-opacity="0.45"/><text x="315" y="43" text-anchor="middle" font-family="JetBrains Mono, ui-monospace, monospace" font-size="13" font-weight="700" letter-spacing="1" fill="#FFFFFF">COMING SOON</text></g>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" role="img" aria-label="${label}"><defs><linearGradient id="g-${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${art.bg[0]}"/><stop offset="1" stop-color="${art.bg[1]}"/></linearGradient><pattern id="p-${id}" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="${art.fg}" stroke-opacity="0.06" stroke-width="1"/></pattern></defs><rect width="400" height="400" fill="url(#g-${id})"/><rect width="400" height="400" fill="url(#p-${id})"/>${icons}<text x="200" y="${labelY}" text-anchor="middle" font-family="Space Grotesk, ui-sans-serif, system-ui, sans-serif" font-size="${labelSize}" font-weight="700" fill="${art.fg}">${label}</text><text x="200" y="${subY}" text-anchor="middle" font-family="JetBrains Mono, ui-monospace, monospace" font-size="16" font-weight="500" letter-spacing="3" fill="${art.fg}" fill-opacity="0.72">${sub}</text>${tag}</svg>`;
}
