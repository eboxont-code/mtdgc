import { readdirSync, readFileSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, test } from "node:test";
import { strict as assert } from "node:assert";

const ROOT = resolve(fileURLToPath(new URL("../..", import.meta.url)));
const SKIPPED_DIRECTORIES = new Set([
  ".git",
  "node_modules",
  "dist",
  "dist-ssr",
  ".output",
  ".vinxi",
  ".nitro",
  ".tanstack",
  "coverage",
]);
const TEXT_EXTENSIONS = new Set([
  ".cjs",
  ".css",
  ".env",
  ".example",
  ".html",
  ".ini",
  ".js",
  ".json",
  ".jsonc",
  ".lock",
  ".md",
  ".mjs",
  ".properties",
  ".sh",
  ".sql",
  ".toml",
  ".ts",
  ".tsx",
  ".txt",
  ".xml",
  ".yaml",
  ".yml",
]);

function readProjectFile(path: string): string {
  return readFileSync(join(ROOT, path), "utf8");
}

function collectTextFiles(directory = ROOT): Array<{ path: string; content: string }> {
  const files: Array<{ path: string; content: string }> = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && SKIPPED_DIRECTORIES.has(entry.name)) continue;

    const absolutePath = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectTextFiles(absolutePath));
      continue;
    }

    if (!entry.isFile()) continue;
    const extension = extname(entry.name).toLowerCase();
    if (!TEXT_EXTENSIONS.has(extension) && !entry.name.startsWith(".env")) continue;

    const bytes = readFileSync(absolutePath);
    if (bytes.length > 5 * 1024 * 1024 || bytes.includes(0)) continue;

    files.push({
      path: relative(ROOT, absolutePath).replaceAll("\\", "/"),
      content: bytes.toString("utf8"),
    });
  }

  return files;
}

function findCredentialLikeValues(files: Array<{ path: string; content: string }>) {
  const patterns: Array<[string, RegExp]> = [
    ["Supabase secret API key", /\bsb_secret_[A-Za-z0-9_-]{20,}\b/g],
    ["Stripe secret key", /\b(?:sk|rk)_(?:live|test)_[A-Za-z0-9]{16,}\b/g],
    ["GitHub token", /\b(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,})\b/g],
    ["AWS access key ID", /\bAKIA[A-Z0-9]{16}\b/g],
    ["Slack token", /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/g],
    ["Google API key", /\bAIza[0-9A-Za-z_-]{35}\b/g],
    ["GitLab token", /\bglpat-[A-Za-z0-9_-]{20,}\b/g],
    ["npm token", /\bnpm_[A-Za-z0-9]{36}\b/g],
    ["Anthropic API key", /\bsk-ant-[A-Za-z0-9_-]{20,}\b/g],
    ["Sentry auth token", /\bsntrys_[A-Za-z0-9_-]{20,}\b/g],
    ["PEM private key", /-----BEGIN (?:RSA |EC |OPENSSH |DSA |PGP )?PRIVATE KEY-----/g],
    ["Password-bearing PostgreSQL URL", /\bpostgres(?:ql)?:\/\/[^/\s:@]+:[^@\s/]+@/gi],
    [
      "Private environment credential assignment",
      /\b(?:SUPABASE_SERVICE_ROLE_KEY|SUPABASE_SECRET_KEY|SUPABASE_DB_PASSWORD|LOVABLE_DB_MIGRATION_URL|ESEWA_SECRET_KEY|KHALTI_SECRET_KEY|STRIPE_SECRET_KEY|PAYPAL_CLIENT_SECRET|PAYMENT_GATEWAY_SECRET|SUPPLIER_API_KEY|SUPPLIER_SECRET|SUPPLIER_TOKEN)\s*[:=]\s*["']?([A-Za-z0-9+/=_-]{20,})/gi,
    ],
  ];

  const findings: Array<{ path: string; kind: string }> = [];

  for (const file of files) {
    for (const [kind, pattern] of patterns) {
      pattern.lastIndex = 0;
      if (pattern.test(file.content)) findings.push({ path: file.path, kind });
    }

    const jwtPattern = /\b(eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})\b/g;
    for (const match of file.content.matchAll(jwtPattern)) {
      const payload = match[1]?.split(".")[1];
      if (!payload) continue;

      try {
        const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { role?: unknown };
        if (claims.role === "service_role") {
          findings.push({ path: file.path, kind: "Supabase service-role JWT" });
          break;
        }
      } catch {
        // Ignore non-JWT strings that happen to share the three-segment shape.
      }
    }
  }

  return findings;
}

function sectionBetween(source: string, start: string, end: string): string {
  const startIndex = source.indexOf(start);
  assert.notEqual(startIndex, -1, `Missing source section: ${start}`);
  const endIndex = source.indexOf(end, startIndex + start.length);
  assert.notEqual(endIndex, -1, `Missing end marker: ${end}`);
  return source.slice(startIndex, endIndex);
}

describe("MT-0165 secret and payment configuration safeguards", () => {
  test("local environment files are ignored and the tracked example contains blank values only", () => {
    const gitignore = readProjectFile(".gitignore");
    const envExample = readProjectFile(".env.example");

    assert.match(gitignore, /^\.env$/m);
    assert.match(gitignore, /^\.env\.\*$/m);
    assert.match(gitignore, /^!\.env\.example$/m);

    const entries = envExample
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => /^[A-Z][A-Z0-9_]*=/.test(line))
      .map((line) => {
        const separator = line.indexOf("=");
        return { key: line.slice(0, separator), value: line.slice(separator + 1).trim() };
      });

    assert.deepEqual(entries.map((entry) => entry.key), [
      "VITE_SUPABASE_URL",
      "VITE_SUPABASE_PUBLISHABLE_KEY",
      "SUPABASE_URL",
      "SUPABASE_PUBLISHABLE_KEY",
      "SUPABASE_SERVICE_ROLE_KEY",
      "VITE_SENTRY_DSN",
      "LOVABLE_DB_MIGRATION_URL",
    ]);
    assert.ok(entries.every((entry) => entry.value === ""), "example values must remain blank");
    assert.ok(!entries.some((entry) => entry.key.startsWith("VITE_") && /SERVICE_ROLE|SECRET|MIGRATION|PASSWORD/i.test(entry.key)));
  });

  test("the browser client uses only the publishable key and the service-role key stays server-only", () => {
    const browserClient = readProjectFile("src/integrations/supabase/client.ts");
    const serverClient = readProjectFile("src/integrations/supabase/client.server.ts");

    assert.match(browserClient, /VITE_SUPABASE_PUBLISHABLE_KEY/);
    assert.match(browserClient, /SUPABASE_PUBLISHABLE_KEY/);
    assert.doesNotMatch(browserClient, /SUPABASE_SERVICE_ROLE_KEY|SUPABASE_SECRET_KEY|LOVABLE_DB_MIGRATION_URL|client\.server/);

    assert.match(serverClient, /process\.env\[['"]SUPABASE_SERVICE_ROLE_KEY['"]\]/);
    assert.doesNotMatch(serverClient, /import\.meta\.env|VITE_/);
    assert.match(serverClient, /trusted server-side operations, never expose to client code/i);
  });

  test("the CI build uses a placeholder rather than a production service-role value", () => {
    const workflow = readProjectFile(".github/workflows/quality.yml");
    const assignment = workflow.match(/^\s*SUPABASE_SERVICE_ROLE_KEY:\s*(.*?)\s*$/m);

    assert.ok(assignment?.[1]);
    assert.match(assignment[1].toLowerCase(), /placeholder/);
    assert.doesNotMatch(workflow, /VITE_SUPABASE_SERVICE_ROLE_KEY/);
  });

  test("the current repository text files contain no recognised high-confidence credential values", () => {
    const findings = findCredentialLikeValues(collectTextFiles());

    // Report only paths and credential categories; never include matched values.
    assert.deepEqual(findings, []);
  });

  test("public payment instructions use an explicit customer-facing field allowlist", () => {
    const orders = readProjectFile("src/lib/orders.functions.ts");
    const publicSettings = sectionBetween(
      orders,
      'export const getPaymentSettings =',
      'function sniffImage',
    );

    assert.match(
      publicSettings,
      /\.select\("qr_image_path, bank_name, account_name, account_number, instructions, fonepay_enabled"\)/,
    );
    assert.doesNotMatch(publicSettings, /\.select\(["']\*["']\)/);
    assert.match(publicSettings, /createSignedUrl\(data\.qr_image_path, 3600\)/);
    assert.doesNotMatch(publicSettings, /SERVICE_ROLE_KEY|SECRET_KEY|merchant[_-]?key|api[_-]?key/i);
  });

  test("payment-setting reads and mutations require authenticated administrator authorization", () => {
    const admin = readProjectFile("src/lib/admin.functions.ts");
    const paymentEndpoints = sectionBetween(
      admin,
      "export const getAdminPaymentSettings",
      "export const listPaymentsToVerify",
    );

    const endpoints = [
      "getAdminPaymentSettings",
      "savePaymentSettings",
      "uploadPaymentQr",
    ];

    for (const name of endpoints) {
      const start = paymentEndpoints.indexOf(`export const ${name}`);
      assert.notEqual(start, -1, `Missing payment endpoint: ${name}`);
      const nextExport = paymentEndpoints.indexOf("export const ", start + 1);
      const block = paymentEndpoints.slice(start, nextExport === -1 ? undefined : nextExport);

      assert.match(block, /\.middleware\(\[requireSupabaseAuth\]\)/);
      const guardIndex = block.indexOf("await assertAdmin(context as Ctx)");
      assert.notEqual(guardIndex, -1, `${name} must check administrator access`);

      const firstOperation = Math.min(
        ...[".select(", ".upsert(", ".upload("]
          .map((marker) => block.indexOf(marker))
          .filter((index) => index >= 0),
      );
      if (Number.isFinite(firstOperation)) {
        assert.ok(guardIndex < firstOperation, `${name} must authorize before accessing payment data`);
      }
    }

    assert.match(
      paymentEndpoints,
      /bank_name: optText\(80\), account_name: optText\(80\), account_number: optText\(40\), instructions: optText\(500\), fonepay_enabled: z\.boolean\(\)/,
    );
  });

  test("the payment-settings schema contains no gateway or supplier credential columns", () => {
    const types = readProjectFile("src/integrations/supabase/types.ts");
    const paymentSettings = sectionBetween(types, "payment_settings: {", "payment_proofs: {");

    assert.doesNotMatch(paymentSettings, /secret|token|password|api[_-]?key|merchant[_-]?credential|supplier/i);
    assert.match(paymentSettings, /account_number/);
    assert.match(paymentSettings, /bank_name/);
    assert.match(paymentSettings, /fonepay_enabled/);
  });
});
