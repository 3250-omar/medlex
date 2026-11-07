import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import ts from "typescript";

const recipient = process.argv[2];
if (!recipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) throw new Error("Provide one preview email address");
const dev = readFileSync(".env.dev", "utf8");
const prod = readFileSync(".env.prod", "utf8");
const readEnv = (source, name) => source.split(/\r?\n/).find((line) => line.startsWith(`${name}=`))?.slice(name.length + 1).trim().replace(/^["']|["']$/g, "");
const url = readEnv(dev, "NEXT_PUBLIC_SUPABASE_URL");
const adminKey = readEnv(dev, "SUPABASE_SERVICE_ROLE_KEY");
const resendKey = readEnv(prod, "RESEND_API_KEY");
const linked = JSON.parse(readFileSync("supabase/.temp/linked-project.json", "utf8"));
const ref = linked.ref || linked.project_ref || linked.id;
if (!url || url !== `https://${ref}.supabase.co` || !adminKey || !resendKey) throw new Error("Development project or email credentials not configured");

const result = await fetch(`${url}/rest/v1/examiners_notes_messages?sequence=eq.1&select=subject,preview,paragraphs`, {
  headers: { apikey: adminKey, Authorization: `Bearer ${adminKey}` },
});
if (!result.ok) throw new Error(`Could not load development message: HTTP ${result.status}`);
const [message] = await result.json();
if (!message) throw new Error("First message is missing in development");

const source = readFileSync("supabase/functions/_shared/examiners-notes/render.ts", "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
const exports = {};
new Function("exports", compiled.outputText)(exports);
const rendered = exports.renderNote(message, "Omar", "development");
const response = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json", "Idempotency-Key": `examiners-notes-preview/${randomUUID()}` },
  body: JSON.stringify({ from: "Dr Ahmed Abouelghit <info@medlexsolutions.com>", reply_to: "info@medlexsolutions.com", to: [recipient], ...rendered, subject: `[Preview] ${rendered.subject}` }),
});
if (!response.ok) {
  const failure = await response.json().catch(() => ({}));
  throw new Error(`Preview rejected: HTTP ${response.status} ${failure.message ?? ""}`);
}
const sent = await response.json();
console.log(`Preview accepted by Resend: ${sent.id}`);
