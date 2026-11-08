import { describe, test } from "node:test";
import { strict as assert } from "node:assert";

import { requirementHelp } from "./product-help";

describe("product requirement guidance", () => {
  test("Mobile Legends user IDs receive game-account instructions", () => {
    assert.equal(
      requirementHelp("Mobile Legends user ID"),
      "Open the game, tap your profile picture and copy the number shown under your name.",
    );
  });

  test("mobile contact fields still receive phone instructions", () => {
    assert.equal(requirementHelp("Mobile number"), "The mobile number we should contact about this order.");
  });
});
