import { readFileSync } from "node:fs";
import { describe, test } from "node:test";
import { strict as assert } from "node:assert";

const proofMigration = readFileSync("drizzle/migrations/0009_payment_qr_private_and_payment_proofs.sql", "utf8");
const bucketMigration = readFileSync("supabase/cutover/0010_catchup_buckets.sql", "utf8");
const grantMigration = readFileSync("supabase/cutover/0011_harden_grants.sql", "utf8");

describe("MT-0085 payment-proof access policy contract", () => {
  test("proof rows are readable only by the authenticated order owner or an admin", () => {
    const start = proofMigration.indexOf('CREATE POLICY "Owner or admin read proofs"');
    assert.notEqual(start, -1, "owner/admin proof-row policy must exist");
    const policy = proofMigration.slice(start);

    assert.match(policy, /ON public\.payment_proofs FOR SELECT TO authenticated/);
    assert.match(policy, /o\.id = payment_proofs\.order_id/);
    assert.match(policy, /o\.user_id = auth\.uid\(\)/);
    assert.match(policy, /has_role\(auth\.uid\(\), 'admin'::public\.app_role\)/);
    assert.doesNotMatch(policy, /TO anon/);
    assert.doesNotMatch(proofMigration, /CREATE POLICY [^\n]+ ON public\.payment_proofs FOR (?:INSERT|UPDATE|DELETE)/i);
  });

  test("proof objects are private to the payment-proofs bucket and scoped to the order owner or admin", () => {
    const start = proofMigration.indexOf('CREATE POLICY "Payment proofs owner or admin read"');
    assert.notEqual(start, -1, "owner/admin proof-object policy must exist");
    const policy = proofMigration.slice(start);

    assert.match(policy, /ON storage\.objects FOR SELECT TO authenticated/);
    assert.match(policy, /bucket_id = 'payment-proofs'/);
    assert.match(policy, /o\.id::text = \(storage\.foldername\(name\)\)\[1\]/);
    assert.match(policy, /o\.user_id = auth\.uid\(\)/);
    assert.match(policy, /has_role\(auth\.uid\(\), 'admin'::public\.app_role\)/);
    assert.doesNotMatch(policy, /TO anon/);
    assert.doesNotMatch(policy, /FOR (?:INSERT|UPDATE|DELETE)/i);
  });

  test("authenticated clients receive read-only table grants for payment proofs", () => {
    assert.match(grantMigration, /REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated/);
    assert.match(grantMigration, /GRANT SELECT ON public\.payment_proofs TO authenticated/);
    assert.doesNotMatch(grantMigration, /GRANT (?:INSERT|UPDATE|DELETE|ALL) ON public\.payment_proofs TO authenticated/i);
  });

  test("the payment-proofs bucket is private and retains its five-MiB storage cap", () => {
    assert.match(bucketMigration, /'payment-proofs'\s*,\s*'payment-proofs'\s*,\s*false\s*,\s*5242880/);
    assert.match(bucketMigration, /ON CONFLICT \(id\) DO UPDATE SET public=false, file_size_limit=EXCLUDED\.file_size_limit/);
  });
});
