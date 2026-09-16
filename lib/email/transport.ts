import "server-only";
// =====================================================================
// NODEMAILER TRANSPORT (COMMENTED OUT — replaced by Resend HTTP API)
// Reason: Vercel serverless blocks SMTP ports 25/465/587.
// Resend uses HTTPS (port 443) which works everywhere.
// =====================================================================
// import nodemailer from "nodemailer";

import { Resend } from "resend";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// =====================================================================
// OLD NODEMAILER TRANSPORT (kept for reference)
// =====================================================================
// function getTransport() {
//   const host = process.env.SMTP_HOST?.trim();
//   const user = process.env.SMTP_USER?.trim();
//   const rawPass = process.env.SMTP_PASS?.trim() || "";
//   const pass = rawPass.replace(/^["']|["']$/g, "").replace(/\s+/g, "").trim();
//   const port = Number(process.env.SMTP_PORT) || 587;
//   const secure = process.env.SMTP_SECURE === "true" || port === 465;
//   if (!user || !pass) return null;
//   const isGmail = host?.includes("gmail") || user.endsWith("@gmail.com");
//   if (isGmail) {
//     return nodemailer.createTransport({
//       service: "gmail",
//       auth: { user, pass },
//       connectionTimeout: 10000,
//       greetingTimeout: 5000,
//       socketTimeout: 15000,
//     });
//   }
//   if (!host) return null;
//   return nodemailer.createTransport({
//     host, port, secure,
//     auth: { user, pass },
//     connectionTimeout: 8000,
//     greetingTimeout: 5000,
//     socketTimeout: 10000,
//     tls: { rejectUnauthorized: process.env.NODE_ENV === "production" },
//   });
// }
// =====================================================================

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
}: SendEmailOptions): Promise<SendEmailResult> {
  const resend = getResendClient();
  const from =
    process.env.EMAIL_FROM?.trim() ||
    process.env.SMTP_FROM?.trim() ||
    `MedLex System <onboarding@resend.dev>`;
  const defaultReplyTo =
    process.env.SMTP_REPLY_TO || "support@medlexsolutions.com";

  if (!resend) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "RESEND_API_KEY is not configured in production environment",
      );
    }
    // In local development, log to console
    console.log(`[Dev Email Transport] To: ${to}, Subject: ${subject}`);
    return {
      success: true,
      messageId: `dev-mock-${Date.now()}`,
    };
  }

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: [to],
      subject,
      html,
      text,
      replyTo: replyTo || defaultReplyTo,
    });

    if (error) {
      console.error(`[Resend] Failed to send email to ${to}:`, error);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log(`[Resend] Successfully sent email to ${to}, id: ${data?.id}`);
    return {
      success: true,
      messageId: data?.id,
    };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to send email via Resend";
    console.error(`[Resend] Exception sending to ${to}:`, message);
    return {
      success: false,
      error: message,
    };
  }
}
