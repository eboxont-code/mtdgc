import { readFileSync } from "node:fs";
import { describe, test } from "node:test";
import { strict as assert } from "node:assert";

const proofMigration = readFileSync("drizzle/migrations/0009_payment_qr_private_and_payment_proofs.sql", "utf8");
const bucketMigration = readFileSync("supabase/cutover/0010_catchup_buckets.sql", "utf8");
const grantMigration = readFileSync("supabase/cutover/0011_harden_grants.sql", "utf8");
const adminSource = readFileSync("src/lib/admin.functions.ts", "utf8");

function policyStatement(source: string, policyName: string): string {
  const start = source.indexOf(`CREATE POLICY "${policyName}"`);
  assert.notEqual(start, -1, `policy "${policyName}" must exist`);
  const end = source.indexOf(";", start);
  assert.notEqual(end, -1, `policy "${policyName}" must terminate`);
  return source.slice(start, end + 1);
}

function exportedFunction(name: string): string {
  const start = adminSource.indexOf(`export const ${name} = createServerFn`);
  assert.notEqual(start, -1, `admin function ${name} must exist`);
  const next = adminSource.indexOf("\nexport const ", start + 1);
  return adminSource.slice(start, next === -1 ? adminSource.length : next);
}

function firstHandlerStatement(source: string): string {
  const handler = source.indexOf(".handler(");
  assert.notEqual(handler, -1, "server function handler must exist");
  const arrow = source.indexOf("=> {", handler);
  assert.notEqual(arrow, -1, "server function handler must use a block body");
  return source.slice(arrow + 4).trimStart().split("\n")[0]?.trim() ?? "";
}

describe("MT-0085 payment-proof access policy contract", () => {
  test("proof rows are RLS-protected and readable only by the authenticated order owner or an admin", () => {
    assert.ok(proofMigration.includes("ALTER TABLE public.payment_proofs ENABLE ROW LEVEL SECURITY"));
    const policy = policyStatement(proofMigration, "Owner or admin read proofs");
    assert.ok(policy.includes("ON public.payment_proofs FOR SELECT TO authenticated"));
    assert.ok(policy.includes("o.id = payment_proofs.order_id"));
    assert.ok(policy.includes("o.user_id = auth.uid()"));
    assert.ok(policy.includes("public.has_role(auth.uid(), 'admin'::public.app_role)"));
    assert.ok(!policy.includes("TO anon"));
    assert.ok(!/CREATE POLICY [^\n]+ ON public\.payment_proofs FOR (INSERT|UPDATE|DELETE)/i.test(proofMigration));
  });

  test("proof objects are private to the payment-proofs bucket and scoped to the order owner or admin", () => {
    const policy = policyStatement(proofMigration, "Payment proofs owner or admin read");
    assert.ok(policy.includes("ON storage.objects FOR SELECT TO authenticated"));
    assert.ok(policy.includes("bucket_id = 'payment-proofs'"));
    assert.ok(policy.includes("storage.foldername(name))[1]"));
    assert.ok(policy.includes("o.user_id = auth.uid()"));
    assert.ok(policy.includes("public.has_role(auth.uid(), 'admin'::public.app_role)"));
    assert.ok(!policy.includes("TO anon"));
    assert.ok(!/FOR (INSERT|UPDATE|DELETE)/i.test(policy));
  });

  test("authenticated proof-row grants are read-only and anonymous clients receive no proof-row grant", () => {
    assert.ok(grantMigration.includes("REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated"));
    assert.ok(grantMigration.includes("GRANT SELECT ON public.payment_proofs TO authenticated"));
    assert.ok(!/GRANT (INSERT|UPDATE|DELETE|ALL) ON public\.payment_proofs TO authenticated/i.test(grantMigration));
  });

  test("the payment-proofs bucket is private and retains its five-MiB storage cap", () => {
    assert.ok(bucketMigration.includes("'payment-proofs','payment-proofs',false,5242880,NULL"));
    assert.ok(bucketMigration.includes("ON CONFLICT (id) DO UPDATE SET public=false, file_size_limit=EXCLUDED.file_size_limit"));
  });

  test("payment-review queue and proof URL endpoints authenticate and authorize before reading", () => {
    for (const name of ["listPaymentsToVerify", "getPaymentProofUrl"]) {
      const source = exportedFunction(name);
      assert.ok(source.includes(".middleware([requireSupabaseAuth])"), `${name} must require an authenticated session`);
      assert.equal(firstHandlerStatement(source), "await assertAdmin(context as Ctx);", `${name} must check admin before accessing proof data`);
    }
    assert.ok(exportedFunction("getPaymentProofUrl").includes("createSignedUrl(proof.storage_path, 300)"));
  });
});
