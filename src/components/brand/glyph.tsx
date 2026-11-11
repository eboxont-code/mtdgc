// Shared MTDGC glyph: a 5x5 matrix that forms the letter M.
const MATRIX = [
  [1, 0, 0, 0, 1],
  [1, 1, 0, 1, 1],
  [1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
] as const;

const CELL_SIZE = 4.2;
const GRID_PITCH = 5.8;
const GRID_OFFSET = 2.3;

export function Glyph({ className = "size-5", title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      shapeRendering="geometricPrecision"
    >
      {MATRIX.flatMap((row, r) => row.map((lit, c) => (
        <rect
          key={`${r}-${c}`}
          x={GRID_OFFSET + c * GRID_PITCH}
          y={GRID_OFFSET + r * GRID_PITCH}
          width={CELL_SIZE}
          height={CELL_SIZE}
          rx="1.05"
          fill={lit ? "#36f593" : "#103d2b"}
        />
      )))}
    </svg>
  );
}
