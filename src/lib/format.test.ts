import { describe, expect, test } from "bun:test";
import { AVAILABILITY_LABEL, categoryTypeFromSlug, durationLabel, percentOff } from "./format";

describe("F7 catalog helpers", () => {
  test("formats months and complete years", () => {
    expect(durationLabel(1)).toBe("1 month");
    expect(durationLabel(3)).toBe("3 months");
    expect(durationLabel(12)).toBe("1 year");
    expect(durationLabel(0)).toBeNull();
  });
  test("rounds savings down and rejects invalid compare-at prices", () => {
    expect(percentOff(667, 1000)).toBe(33);
    expect(percentOff(1000, 1000)).toBeNull();
    expect(percentOff(1000, null)).toBeNull();
    expect(percentOff(0, 1000)).toBeNull();
  });
  test("limits availability to the two orderable statuses", () => {
    expect(AVAILABILITY_LABEL.available).toBe("Available");
    expect(AVAILABILITY_LABEL.low_stock).toBe("Limited");
    expect(AVAILABILITY_LABEL.coming_soon).toBe("Unavailable");
    expect(AVAILABILITY_LABEL.unknown).toBe("Unavailable");
  });
  test("maps existing category slugs without guessing other types", () => {
    expect(categoryTypeFromSlug("software")).toBe("software");
    expect(categoryTypeFromSlug("subscriptions")).toBe("subscription");
    expect(categoryTypeFromSlug("gift-cards")).toBe("gift_card");
    expect(categoryTypeFromSlug("game-top-ups")).toBe("game_top_up");
    expect(categoryTypeFromSlug("deals")).toBeNull();
  });
});