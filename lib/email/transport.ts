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
  const rawPass = process.env.SMTP_PASS?.trim() || "";
  // Strip surrounding quotes or internal spaces from copied app passwords
  const pass = rawPass.replace(/^["']|["']$/g, "").replace(/\s+/g, "").trim();
  const port = Number(process.env.SMTP_PORT) || 587;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  if (!user || !pass) {
    return null;
  }

  // If host is gmail or user is a gmail address, prefer the built-in 'gmail' service
  // to avoid SSL/TLS handshake quirks and specific port timeout issues
  const isGmail = host?.includes("gmail") || user.endsWith("@gmail.com");

  if (isGmail) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
      connectionTimeout: 10000,
      greetingTimeout: 5000,
      socketTimeout: 15000,
    });
  }

  if (!host) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    connectionTimeout: 8000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === "production",
    },
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
