import { describe, expect, test } from "bun:test";
import { isTopup, productIdentifierHelp, validateProductDetails, validateProductIdentifier } from "./topup-details";

describe("top-up details", () => {
  test("only the existing top-up category qualifies", () => {
    expect(isTopup("game-top-ups")).toBe(true);
    expect(isTopup("gift-cards")).toBe(false);
    expect(isTopup(null)).toBe(false);
  });
  test("required IDs reject empty, letters and combined zone values", () => {
    for (const label of ["Player ID", "User ID", "Zone ID"]) {
      expect(validateProductIdentifier(label, "")).not.toBeNull();
      expect(validateProductIdentifier(label, "abc")).not.toBeNull();
      expect(validateProductIdentifier(label, "123456 (1234)")).not.toBeNull();
      expect(validateProductIdentifier(label, "123456")).toBeNull();
    }
  });
  test("recipient email and server format checks", () => {
    expect(validateProductIdentifier("Recipient email", "bad@")).not.toBeNull();
    expect(validateProductIdentifier("Recipient email", "buyer@example.com")).toBeNull();
    expect(validateProductIdentifier("Server", "<script>")).not.toBeNull();
    expect(validateProductIdentifier("Server", "Asia 1")).toBeNull();
  });
  test("checks only current required fields and reports missing ones", () => {
    expect(validateProductDetails(["Player ID", "Zone ID"], { "Player ID": "123", Email: "bad" })).toEqual({ "Zone ID": "Please enter zone id." });
  });
  test("Mobile Legends separates first user number from bracketed zone", () => {
    expect(productIdentifierHelp("Mobile Legends Diamonds", "User ID")).toContain("first number");
    expect(productIdentifierHelp("Mobile Legends Diamonds", "Zone ID")).toContain("without brackets");
    expect(productIdentifierHelp("PUBG Mobile UC", "Player ID")).toBeNull();
  });
});