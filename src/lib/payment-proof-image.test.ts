import assert from "node:assert/strict";
import { test } from "node:test";
import sharp from "sharp";

import { normalizePaymentProofImage, PAYMENT_PROOF_MAX_BYTES } from "./payment-proof-image";

async function createImage(format: "jpeg" | "png" | "webp"): Promise<Uint8Array> {
  const source = sharp({
    create: {
      width: 8,
      height: 6,
      channels: 4,
      background: { r: 20, g: 80, b: 160, alpha: 1 },
    },
  });

  const output = format === "jpeg"
    ? await source.jpeg().toBuffer()
    : format === "png"
      ? await source.png().toBuffer()
      : await source.webp().toBuffer();

  return new Uint8Array(output);
}

for (const [mime, format] of [
  ["image/jpeg", "jpeg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
] as const) {
  test(`fully decodes and losslessly normalizes ${format} payment proofs`, async () => {
    const input = await createImage(format);
    const result = await normalizePaymentProofImage(input, mime);

    assert.equal(result.ok, true);
    if (!result.ok) return;

    assert.equal(result.contentType, "image/webp");
    assert.equal(result.extension, "webp");
    const metadata = await sharp(result.data).metadata();
    assert.equal(metadata.format, "webp");
    assert.equal(metadata.width, 8);
    assert.equal(metadata.height, 6);
  });
}

test("rejects a declared MIME that does not match the decoded format", async () => {
  const jpeg = await createImage("jpeg");
  const result = await normalizePaymentProofImage(jpeg, "image/png");
  assert.equal(result.ok, false);
});

test("rejects truncated image data even when the leading signature is valid", async () => {
  const png = await createImage("png");
  const truncated = png.slice(0, Math.floor(png.byteLength / 2));
  const result = await normalizePaymentProofImage(truncated, "image/png");
  assert.equal(result.ok, false);
});

test("rejects empty, oversized and unsupported image inputs", async () => {
  assert.equal((await normalizePaymentProofImage(new Uint8Array(), "image/png")).ok, false);
  assert.equal((await normalizePaymentProofImage(new Uint8Array(PAYMENT_PROOF_MAX_BYTES + 1), "image/png")).ok, false);
  assert.equal((await normalizePaymentProofImage(new Uint8Array([1, 2, 3]), "image/svg+xml")).ok, false);
});

test("rejects images that exceed the decoded pixel limit", async () => {
  const oversizedPixels = new Uint8Array(await sharp({
    create: {
      width: 4_600,
      height: 4_600,
      channels: 3,
      background: "#fff",
    },
  }).png().toBuffer());

  const result = await normalizePaymentProofImage(oversizedPixels, "image/png");
  assert.equal(result.ok, false);
});

test("strips source metadata while preserving the decoded pixels in lossless WebP", async () => {
  const withExif = new Uint8Array(await sharp({
    create: {
      width: 8,
      height: 6,
      channels: 3,
      background: { r: 12, g: 34, b: 56 },
    },
  }).withExif({ IFD0: { ImageDescription: "payment-proof-test" } }).jpeg().toBuffer());

  const sourceMetadata = await sharp(withExif).metadata();
  assert.ok(sourceMetadata.exif);

  const sourcePixels = await sharp(withExif).raw().toBuffer();
  const result = await normalizePaymentProofImage(withExif, "image/jpeg");
  assert.equal(result.ok, true);
  if (!result.ok) return;

  const metadata = await sharp(result.data).metadata();
  assert.equal(metadata.exif, undefined);
  const normalizedPixels = await sharp(result.data).raw().toBuffer();
  assert.deepEqual(normalizedPixels, sourcePixels);
});
