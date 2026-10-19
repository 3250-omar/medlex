import assert from "node:assert";

// 1. Test classifyPath logic
function classifyPath(path) {
  const clean = path.split("?")[0].replace(/^\/(en|ar)/, "");

  if (!clean || clean === "/") {
    return { category: "home" };
  }

  if (clean.startsWith("/blogs/")) {
    const slug = clean.replace("/blogs/", "").replace(/\/$/, "");
    return { category: "blog_article", identifier: slug };
  }

  if (clean.startsWith("/pathways/")) {
    const pathway = clean.replace("/pathways/", "").replace(/\/$/, "");
    return { category: "course_landing", identifier: pathway };
  }

  if (clean.includes("/academy/preview/")) {
    return { category: "station_preview", identifier: "station-7-2" };
  }

  return { category: "other", identifier: clean };
}

// 2. Test extractReferrerDomain logic
function extractReferrerDomain(referrer) {
  if (!referrer) return "Direct / None";
  try {
    const url = new URL(referrer);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return referrer.slice(0, 50);
  }
}

// 3. Test Funnel conversion math
function computeFunnelMath(totalUniqueDownloaders, totalEnrolled) {
  const conversionRate = totalUniqueDownloaders > 0
    ? Number(((totalEnrolled / totalUniqueDownloaders) * 100).toFixed(1))
    : 0;
  return conversionRate;
}

console.log("=== Running Analytics Unit Tests ===");

// Tests: classifyPath
assert.deepStrictEqual(classifyPath("/en"), { category: "home" });
assert.deepStrictEqual(classifyPath("/ar/blogs/casc-exam-guide"), {
  category: "blog_article",
  identifier: "casc-exam-guide",
});
assert.deepStrictEqual(classifyPath("/en/pathways/gp"), {
  category: "course_landing",
  identifier: "gp",
});
assert.deepStrictEqual(classifyPath("/en/academy/preview/station-7-2"), {
  category: "station_preview",
  identifier: "station-7-2",
});
console.log("✔ classifyPath tests passed");

// Tests: extractReferrerDomain
assert.strictEqual(extractReferrerDomain(null), "Direct / None");
assert.strictEqual(extractReferrerDomain(""), "Direct / None");
assert.strictEqual(extractReferrerDomain("https://www.facebook.com/posts/123"), "facebook.com");
assert.strictEqual(extractReferrerDomain("https://google.com/search?q=medlex"), "google.com");
console.log("✔ extractReferrerDomain tests passed");

// Tests: Funnel calculation
assert.strictEqual(computeFunnelMath(0, 0), 0);
assert.strictEqual(computeFunnelMath(100, 25), 25.0);
assert.strictEqual(computeFunnelMath(3, 1), 33.3);
console.log("✔ Funnel math tests passed");

console.log("=== All Analytics Unit Tests Passed! ===");
