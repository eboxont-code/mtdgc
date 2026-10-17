import { useEffect, useRef } from "react";

// Subtle falling-code texture: binary digits and Devanagari numerals.
// Runs only while visible, caps at about 24fps, and stays off for reduced motion.
const GLYPHS = "01०१२३४५६७८९01";

export function CodeRain({ className = "", opacity = 0.14 }: { className?: string; opacity?: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 14;
    let columns: number[] = [];
    let frame = 0;
    let last = 0;
    let visible = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      columns = Array.from({ length: Math.ceil(width / size) }, () => Math.random() * -40);
    };

    const draw = (time: number) => {
      frame = requestAnimationFrame(draw);
      if (!visible || time - last < 42) return;
      last = time;
      const { width, height } = canvas.getBoundingClientRect();
      ctx.fillStyle = "rgba(7, 11, 9, 0.16)";
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${size - 2}px "JetBrains Mono", ui-monospace, monospace`;
      columns.forEach((y, i) => {
        const glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? "0";
        ctx.fillStyle = Math.random() > 0.96 ? "rgba(200, 255, 220, 0.9)" : "rgba(61, 255, 143, 0.75)";
        ctx.fillText(glyph, i * size, y * size);
        columns[i] = y * size > height && Math.random() > 0.975 ? 0 : y + 0.5;
      });
    };

    resize();
    const observer = new IntersectionObserver(([entry]) => { visible = !!entry?.isIntersecting && !document.hidden; });
    observer.observe(canvas);
    const onVisibility = () => { if (document.hidden) visible = false; };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", resize);
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} style={{ opacity }} />;
}
