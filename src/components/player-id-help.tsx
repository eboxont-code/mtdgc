import { ChevronDown, HelpCircle } from "lucide-react";

/** Plain-text steps for finding account IDs in supported games, keyed by brand. */
const GUIDES: Record<string, { title: string; steps: string[] }> = {
  garena: {
    title: "Where to find your Free Fire player ID",
    steps: [
      "Open Free Fire and sign in to the account you want to top up.",
      "Tap your avatar or profile banner at the top left of the lobby.",
      "Your player ID is the number shown under your nickname. Tap the copy icon next to it.",
    ],
  },
  krafton: {
    title: "Where to find your PUBG Mobile player ID",
    steps: [
      "Open PUBG Mobile and sign in to the account you want to top up.",
      "Tap your avatar at the top left of the lobby to open your profile.",
      "Your player ID is the number shown under your nickname. Tap it to copy.",
    ],
  },
  moonton: {
    title: "Where to find your Mobile Legends user ID and zone ID",
    steps: [
      "Open Mobile Legends and sign in to the account you want to top up.",
      "Tap your avatar at the top left of the main screen.",
      "You will see a number followed by another number in brackets, for example 12345678 (1234).",
      "The first number is your user ID. The number in brackets is your zone ID. Enter them in separate fields.",
    ],
  },
  supercell: {
    title: "Where to find your Clash of Clans player tag",
    steps: [
      "Open Clash of Clans and tap your experience level badge at the top left.",
      "Your player tag starts with # and appears under your name. Tap it to copy.",
      "For your Supercell ID email, open Settings and check the Supercell ID section.",
    ],
  },
};

export function PlayerIdHelp({ brand }: { brand?: string | null }) {
  const guide = GUIDES[(brand ?? "").trim().toLowerCase()];
  if (!guide) return null;
  return (
    <details className="group mt-3 rounded-xl border border-border bg-secondary/60">
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 px-3 text-sm font-medium [&::-webkit-details-marker]:hidden">
        <HelpCircle className="size-4 shrink-0 text-primary" />
        <span className="min-w-0 flex-1">{guide.title}</span>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <ol className="space-y-1.5 border-t border-border px-3 py-3 text-xs text-foreground/85">
        {guide.steps.map((step, i) => (
          <li key={i} className="flex gap-2"><span className="font-mono text-primary">{i + 1}.</span><span>{step}</span></li>
        ))}
      </ol>
    </details>
  );
}
