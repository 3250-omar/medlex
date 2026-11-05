import test from "node:test";
import assert from "node:assert/strict";
import { resolveVisitAttribution } from "../lib/analytics/visit-attribution.ts";

const now = 1_800_000_000_000;
const input = (overrides = {}) => ({
  search: new URLSearchParams(),
  referrer: "",
  origin: "https://www.medlexsolutions.com",
  initialPage: true,
  previous: null,
  now,
  ...overrides,
});

test("keeps the entry referral across internal page navigation", () => {
  const entry = resolveVisitAttribution(input({ referrer: "https://www.google.com/search?q=medlex" }));
  const next = resolveVisitAttribution(input({ initialPage: false, previous: entry, now: now + 60000 }));
  assert.equal(next.referrer, "https://www.google.com");
  assert.equal(next.google_ads_click_detected, false);
});

test("records only the presence of a Google Ads click ID and keeps it for the session", () => {
  const entry = resolveVisitAttribution(input({ search: new URLSearchParams("gclid=example-click-id") }));
  const next = resolveVisitAttribution(input({ initialPage: false, previous: entry, now: now + 1000 }));
  assert.equal(next.google_ads_click_detected, true);
  assert.equal(JSON.stringify(next).includes("example-click-id"), false);
});

test("a new external entry or new campaign replaces the earlier source", () => {
  const previous = resolveVisitAttribution(input({ search: new URLSearchParams("gclid=abc&utm_source=google") }));
  const referral = resolveVisitAttribution(input({ referrer: "https://facebook.com/post", previous, now: now + 1000 }));
  assert.equal(referral.referrer, "https://facebook.com");
  assert.equal(referral.utm_source, null);
  assert.equal(referral.google_ads_click_detected, false);
  const campaign = resolveVisitAttribution(input({ search: new URLSearchParams("utm_source=email&utm_campaign=launch"), previous, now: now + 1000 }));
  assert.equal(campaign.utm_source, "email");
  assert.equal(campaign.google_ads_click_detected, false);
});

test("does not reuse a source after thirty minutes of inactivity", () => {
  const previous = resolveVisitAttribution(input({ referrer: "https://www.google.com" }));
  const result = resolveVisitAttribution(input({ previous, now: now + 31 * 60000 }));
  assert.equal(result.referrer, null);
});
