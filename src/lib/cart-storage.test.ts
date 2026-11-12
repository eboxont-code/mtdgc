import { test } from "node:test";
import { strict as assert } from "node:assert";
import { MAX_QTY, parseStoredCart } from "./cart-storage";

const selectedVariant = {
  sku: "MLBB-86",
  productSlug: "mobile-legends-diamonds",
  productName: "Mobile Legends Diamonds",
  variantName: "86 Diamonds",
  priceMinor: 12500,
  image: null,
  region: "Global",
  categorySlug: "game-top-ups",
  quantity: 2,
  fields: { "Player ID": "123456", "Zone ID": "7890" },
};

test("MT-0188 restores the exact selected SKU, variant, price and required delivery fields", () => {
  assert.deepEqual(parseStoredCart(JSON.stringify([selectedVariant])), [selectedVariant]);
});

test("MT-0188 drops malformed entries individually without losing valid cart lines", () => {
  const restored = parseStoredCart(JSON.stringify([
    null,
    { sku: "missing-fields" },
    { ...selectedVariant, priceMinor: 0 },
    { ...selectedVariant, productSlug: "sample-preview" },
    selectedVariant,
  ]));
  assert.deepEqual(restored, [selectedVariant]);
});

test("MT-0188 caps a restored quantity at the existing cart maximum", () => {
  const [line] = parseStoredCart(JSON.stringify([{ ...selectedVariant, quantity: MAX_QTY + 50 }]));
  assert.equal(line.quantity, MAX_QTY);
});

test("MT-0188 normalizes legacy snapshots without optional image and quantity fields", () => {
  const { image: _image, quantity: _quantity, ...legacy } = selectedVariant;
  assert.deepEqual(parseStoredCart(JSON.stringify([legacy])), [{ ...legacy, image: null, quantity: 1 }]);
});

test("MT-0188 ignores invalid JSON and non-array storage values", () => {
  assert.deepEqual(parseStoredCart("{"), []);
  assert.deepEqual(parseStoredCart(JSON.stringify({ ...selectedVariant })), []);
  assert.deepEqual(parseStoredCart(null), []);
});

test("MT-0188 keeps only string delivery-field values from browser storage", () => {
  const [line] = parseStoredCart(JSON.stringify([{ ...selectedVariant, fields: { "Player ID": "123456", ignored: 7 } }]));
  assert.deepEqual(line.fields, { "Player ID": "123456" });
});
