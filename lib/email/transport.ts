import "server-only";
import nodemailer from "nodemailer";

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

function getTransport() {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.replace(/\s+/g, "").trim();
  const port = Number(process.env.SMTP_PORT) || 587;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
}: SendEmailOptions): Promise<SendEmailResult> {
  const transporter = getTransport();
  const from =
    process.env.SMTP_FROM?.trim() ||
    `MedLex System <${process.env.SMTP_USER || "noreply@medlexsolutions.com"}>`;
  const defaultReplyTo =
    process.env.SMTP_REPLY_TO || "support@medlexsolutions.com";

  if (!transporter) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "SMTP server is not configured in production environment",
      );
    }
    // In local development, log to console but make sure it's explicitly recorded
    console.log(`[Dev Email Transport] To: ${to}, Subject: ${subject}`);
    return {
      success: true,
      messageId: `dev-mock-${Date.now()}`,
    };
  }

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
      replyTo: replyTo || defaultReplyTo,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to send email via SMTP";
    return {
      success: false,
      error: message,
    };
  }
}
