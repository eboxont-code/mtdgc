export function renderErrorPage(): string {
  const matrix = [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ] as const;
  const cells = matrix.flatMap((row, r) =>
    row.map((lit, c) =>
      `<rect x="${2.3 + c * 5.8}" y="${2.3 + r * 5.8}" width="4.2" height="4.2" rx="1.05" fill="${lit ? "#36f593" : "#103d2b"}"/>`,
    ),
  ).join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load | MTDGC</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#070b09" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #070b09; color: #f4fff8; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      .brand { display: inline-flex; align-items: center; gap: .7rem; margin: 0 auto 2rem; text-align: left; }
      .brand svg { width: 2.5rem; height: 2.5rem; flex: none; }
      .brand-copy { display: flex; flex-direction: column; line-height: 1; }
      .brand-copy strong { color: #f4fff8; font: 700 1.25rem/1 ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .06em; }
      .brand-copy small { margin-top: .35rem; color: #9baea3; font: 500 .52rem/1.2 ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .08em; text-transform: uppercase; white-space: nowrap; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #a9b8ae; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.5rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #36f593; color: #07140d; font-weight: 600; }
      .secondary { background: #101b14; color: #f4fff8; border-color: #294334; }
      @media (max-width: 360px) { .brand-copy small { font-size: .44rem; letter-spacing: .04em; } }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="brand" aria-label="MTDGC, Matrix Digital Goods and Commerce">
        <svg viewBox="0 0 32 32" role="img" aria-label="MTDGC 5 by 5 emerald M" shape-rendering="geometricPrecision">${cells}</svg>
        <span class="brand-copy">
          <strong>MTDGC</strong>
          <small>Matrix Digital Goods &amp; Commerce</small>
        </span>
      </div>
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}
