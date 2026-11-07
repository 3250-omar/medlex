import { renderNote } from "../_shared/examiners-notes/render.ts";

declare const Deno: {
  env: { get(name: string): string | undefined };
  serve(handler: (request: Request) => Response | Promise<Response>): void;
};
declare const EdgeRuntime: { waitUntil(promise: Promise<unknown>): void };

const required = (name: string): string => {
  const value = Deno.env.get(name)?.trim();
  if (!value) throw new Error(`Missing ${name}`);
  return value;
};

Deno.serve(async (request: Request) => {
  if (request.method !== "POST")
    return new Response("Method not allowed", { status: 405 });
  let url: string,
    key: string,
    secret: string,
    apiKey: string,
    environment: string;
  try {
    url = required("SUPABASE_URL");
    key = required("SUPABASE_SERVICE_ROLE_KEY");
    secret = required("EXAMINERS_NOTES_CRON_SECRET");
    apiKey = required("RESEND_API_KEY");
    environment = required("EXAMINERS_NOTES_ENV");
    if (environment !== "development" && environment !== "production")
      throw new Error("Invalid environment");
  } catch (error) {
    console.error(error);
    return new Response("Configuration error", { status: 500 });
  }
  if (request.headers.get("x-cron-secret") !== secret)
    return new Response("Unauthorized", { status: 401 });
  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
  async function rpc(name: string, args: Record<string, unknown> = {}) {
    const response = await fetch(`${url}/rest/v1/rpc/${name}`, {
      method: "POST",
      headers,
      body: JSON.stringify(args),
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok)
      throw new Error(
        `RPC ${name}: ${response.status} ${await response.text()}`,
      );
    const body = await response.text();
    return body ? JSON.parse(body) : null;
  }
  let processed = 0;
  const startedAt = Date.now();
  let continueBatch = false;
  try {
    // Continue the same weekly dispatch in bounded function invocations.
    while (processed < 20) {
      if (processed > 0 && Date.now() - startedAt >= 70000) {
        continueBatch = true;
        break;
      }
      const [job] = (await rpc("claim_examiners_note")) as Array<{
        enrollment_id: string;
        message_number: number;
        email: string | null;
        first_name: string;
        subject: string;
        preview: string;
        paragraphs: string[];
      }>;
      if (!job) break;
      const finish = (
        outcome: string,
        id: string | null,
        error: string | null,
      ) =>
        rpc("finish_examiners_note", {
          p_enrollment: job.enrollment_id,
          p_number: job.message_number,
          p_outcome: outcome,
          p_provider_id: id,
          p_error: error,
        });
      if (!job.email) {
        await finish("failed", null, "Missing email address");
        processed++;
        continue;
      }
      const note = renderNote(job, job.first_name, environment);
      let response: Response;
      try {
        response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          signal: AbortSignal.timeout(20000),
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "Idempotency-Key": `examiners-notes/${environment}/${job.enrollment_id}/${job.message_number}`,
          },
          body: JSON.stringify({
            from: "Dr Ahmed Abouelghit <info@medlexsolutions.com>",
            reply_to: "info@medlexsolutions.com",
            to: [job.email],
            ...note,
          }),
        });
      } catch (error) {
        await finish("pending", null, `Network error: ${String(error)}`);
        processed++;
        continue;
      }
      const result = (await response.json().catch(() => ({}))) as {
        id?: string;
        message?: string;
      };
      if (response.ok && result.id) await finish("accepted", result.id, null);
      else if (response.status === 429 || response.status >= 500) {
        await finish(
          "pending",
          null,
          `${response.status}: ${result.message ?? "Provider error"}`,
        );
        if (response.status === 429) {
          console.error(
            "Resend rate or quota limit reached; pending notes need monitoring.",
          );
          break;
        }
      } else if (response.ok)
        await finish(
          "uncertain",
          null,
          "Provider response did not include an ID",
        );
      else {
        await finish(
          "failed",
          null,
          `${response.status}: ${result.message ?? "Provider rejected request"}`,
        );
        if (response.status === 401 || response.status === 403) {
          console.error(
            "Resend rejected sender authorization; stopping this batch.",
          );
          break;
        }
      }
      processed++;
      if (Date.now() - startedAt >= 70000) {
        continueBatch = true;
        break;
      }
    }
    if (processed === 20 || continueBatch) {
      EdgeRuntime.waitUntil(
        fetch(`${url}/functions/v1/examiners-notes`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-cron-secret": secret },
          body: "{}",
          signal: AbortSignal.timeout(120000),
        }).then((next) => {
          if (!next.ok) console.error(`Next email batch failed: HTTP ${next.status}`);
        }).catch((error) => console.error("Next email batch could not start:", error)),
      );
    }
    return Response.json({ processed, continuation: processed === 20 || continueBatch });
  } catch (error) {
    console.error(error);
    return new Response("Processing error", { status: 500 });
  }
});
