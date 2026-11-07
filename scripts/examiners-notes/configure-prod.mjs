import { readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const prod = readFileSync(".env.prod", "utf8");
const dev = readFileSync(".env.dev", "utf8");
function get(source, name) {
  const line = source
    .split(/\r?\n/)
    .find((item) => item.startsWith(`${name}=`));
  return line
    ?.slice(name.length + 1)
    .trim()
    .replace(/^["']|["']$/g, "");
}
const url = get(prod, "NEXT_PUBLIC_SUPABASE_URL");
const devUrl = get(dev, "NEXT_PUBLIC_SUPABASE_URL");
const key = get(prod, "RESEND_API_KEY");
const linked = JSON.parse(
  readFileSync("supabase/.temp/linked-project.json", "utf8"),
);
const ref = linked.ref || linked.project_ref || linked.id;
if (
  !ref ||
  !url ||
  url !== `https://${ref}.supabase.co` ||
  url === devUrl ||
  !key
) {
  throw new Error(
    "Linked project does not match production or Resend key missing",
  );
}
const secret = randomBytes(32).toString("hex");
const envPath = join("supabase", ".temp", "examiners-notes-prod-secrets.tmp");
const sqlPath = join("supabase", ".temp", "examiners-notes-prod-vault.tmp.sql");
const cli = join("node_modules", "supabase", "dist", "supabase.js");
function run(args) {
  const result = spawnSync(process.execPath, [cli, ...args], {
    encoding: "utf8",
    timeout: 120000,
  });
  if (result.error || result.status !== 0)
    throw new Error(
      `Supabase command failed (${args[0]} ${args[1]}), exit ${result.status}`,
    );
}
try {
  writeFileSync(
    envPath,
    `EXAMINERS_NOTES_ENV=production\nEXAMINERS_NOTES_CRON_SECRET=${secret}\nRESEND_API_KEY=${key}\n`,
    { mode: 0o600 },
  );
  writeFileSync(
    sqlPath,
    `do $$ declare v_id uuid; begin
    select id into v_id from vault.secrets where name='examiners_notes_url';
    if v_id is null then perform vault.create_secret('${url}/functions/v1/examiners-notes','examiners_notes_url');
    else perform vault.update_secret(v_id, '${url}/functions/v1/examiners-notes'); end if;
    select id into v_id from vault.secrets where name='examiners_notes_cron_secret';
    if v_id is null then perform vault.create_secret('${secret}','examiners_notes_cron_secret');
    else perform vault.update_secret(v_id, '${secret}'); end if;
  end $$;`,
    { mode: 0o600 },
  );
  run(["secrets", "set", "--env-file", envPath]);
  console.log("Production function secrets configured.");
  run(["db", "query", "--linked", "--file", sqlPath]);
  console.log("Production Vault secrets configured.");
} finally {
  for (const path of [envPath, sqlPath]) {
    try {
      unlinkSync(path);
    } catch {
      /* absent */
    }
  }
}
