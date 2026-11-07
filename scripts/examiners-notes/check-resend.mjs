import { readFileSync } from "node:fs";

const env = readFileSync(".env.dev", "utf8");
const entry = env
  .split(/\r?\n/)
  .find((line) => /^RESEND_API_KEY\s*=/.test(line));
const key = entry
  ?.slice(entry.indexOf("=") + 1)
  .trim()
  .replace(/^["']|["']$/g, "");
if (!key) throw new Error("RESEND_API_KEY is not set in .env.dev");
const response = await fetch("https://api.resend.com/domains", {
  headers: { Authorization: `Bearer ${key}` },
});
if (!response.ok) {
  const error = await response.json().catch(() => ({}));
  throw new Error(
    `Resend domain lookup failed: HTTP ${response.status} (${error.name ?? "unknown"})`,
  );
}
const result = await response.json();
const domains = result.data.filter(
  (domain) => domain.name === "medlexsolutions.com",
);
console.log(
  JSON.stringify({
    domain: "medlexsolutions.com",
    status: domains.map((domain) => domain.status),
  }),
);
