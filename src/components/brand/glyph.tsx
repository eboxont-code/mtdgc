// MTDGC glyph: a 3x3 grid of pixels, three columns lit at different heights,
// like a column of falling code caught mid-frame.
const LIT: Array<[number, number]> = [
  [0, 1], [0, 2],
  [1, 0], [1, 1], [1, 2],
  [2, 2],
];

export function Glyph({ className = "size-5", title }: { className?: string; title?: string }) {
  const cells: Array<[number, number]> = [];
  for (let c = 0; c < 3; c += 1) for (let r = 0; r < 3; r += 1) cells.push([c, r]);
  return (
    <svg viewBox="0 0 24 24" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      {cells.map(([c, r]) => {
        const lit = LIT.some(([lc, lr]) => lc === c && lr === r);
        return (
          <rect
            key={`${c}-${r}`}
            x={c * 8.5 + 0.5}
            y={r * 8.5 + 0.5}
            width="6.5"
            height="6.5"
            rx="1.6"
            fill="var(--primary)"
            opacity={lit ? 1 : 0.22}
          />
        );
      })}
    </svg>
  );
}
