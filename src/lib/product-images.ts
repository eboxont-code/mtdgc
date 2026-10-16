import netflix320 from "@/assets/netflix-320.webp.asset.json";
import netflix640 from "@/assets/netflix-640.webp.asset.json";
import pubg320 from "@/assets/pubg-320.webp.asset.json";
import pubg640 from "@/assets/pubg-640.webp.asset.json";
import freeFire320 from "@/assets/free-fire-320.webp.asset.json";
import freeFire640 from "@/assets/free-fire-640.webp.asset.json";
import mobileLegends320 from "@/assets/mobile-legends-320.webp.asset.json";
import mobileLegends640 from "@/assets/mobile-legends-640.webp.asset.json";
import roblox320 from "@/assets/roblox-320.webp.asset.json";
import roblox640 from "@/assets/roblox-640.webp.asset.json";

const images: Record<string, [string, string]> = {
  "netflix.jpg": [netflix320.url, netflix640.url],
  "pubg.jpg": [pubg320.url, pubg640.url],
  "free-fire.jpg": [freeFire320.url, freeFire640.url],
  "mobile-legends.jpg": [mobileLegends320.url, mobileLegends640.url],
  "roblox.jpg": [roblox320.url, roblox640.url],
};
export function productImageSources(url: string | null) {
  const name = url?.split("/").pop();
  const variants = name && url?.includes("/__l5e/assets-v1/") ? images[name] : undefined;
  return variants ? { src: variants[1], srcSet: `${variants[0]} 320w, ${variants[1]} 640w` } : { src: url ?? undefined };
}