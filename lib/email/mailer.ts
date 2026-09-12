import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

interface SendPasswordResetEmailParams {
  to: string;
  code: string;
  fullName?: string | null;
}

function getEnvVar(name: string): string | undefined {
  if (process.env[name]) return process.env[name];
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const [key, ...vals] = trimmed.split("=");
        if (key.trim() === name) {
          return vals.join("=").trim().replace(/^["']|["']$/g, "");
        }
      }
    }
  } catch {}
  return undefined;
}

export async function sendPasswordResetEmail({
  to,
  code,
  fullName,
}: SendPasswordResetEmailParams): Promise<{ sent: boolean; simulated?: boolean; error?: string }> {
  const host = (getEnvVar("SMTP_HOST") || process.env.SMTP_HOST)?.trim();
  const user = (getEnvVar("SMTP_USER") || process.env.SMTP_USER)?.trim();
  const rawPass = (getEnvVar("SMTP_PASS") || process.env.SMTP_PASS);
  const pass = rawPass?.replace(/\s+/g, "").trim();

  let port = Number(getEnvVar("SMTP_PORT") || process.env.SMTP_PORT) || 465;
  const secureEnv = getEnvVar("SMTP_SECURE") || process.env.SMTP_SECURE;
  let secure = secureEnv === "true" || port === 465;

  if (host?.includes("gmail.com") && port === 587 && secure) {
    port = 465;
  } else if (port === 587) {
    secure = false;
  } else if (port === 465) {
    secure = true;
  }

  const from =
    (getEnvVar("SMTP_FROM") || process.env.SMTP_FROM)?.trim() ||
    `MedLex System <${user || "noreply@medlexsolutions.com"}>`;

  const displayName = fullName?.trim() || "Valued Colleague";

  const emailSubject = "MedLex - Password Reset Verification Code";

  const textContent = `Hello ${displayName},

You requested to reset your MedLex account password.
Your 6-digit verification code is: ${code}

This code will expire in 10 minutes.
If you did not request this password reset, you can safely ignore this email.

Best regards,
The MedLex Team
`;

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MedLex Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b1522; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #0b1522; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 540px; background-color: #111d2e; border: 1px solid #1e2f47; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);" cellspacing="0" cellpadding="0" border="0">
          <!-- Header Banner -->
          <tr>
            <td style="padding: 32px 36px; background: linear-gradient(135deg, #13273e 0%, #0d1b2a 100%); border-bottom: 1px solid #223752; text-align: center;">
              <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase; color: #22d3ee; margin-bottom: 8px;">MEDLEX PORTAL ACCESS</div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #ffffff; letter-spacing: -0.02em;">Password Reset Request</h1>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 36px 28px 36px;">
              <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #cbd5e1;">
                Hello <strong style="color: #ffffff;">${displayName}</strong>,
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #94a3b8;">
                We received a request to reset the password for your MedLex account. Please use the verification code below to verify your identity and create your new password:
              </p>

              <!-- Verification Code Block -->
              <div style="text-align: center; margin: 28px 0; padding: 20px; background-color: #080f18; border: 1px dashed #0284c7; border-radius: 12px;">
                <span style="display: block; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; color: #38bdf8; margin-bottom: 6px;">Your 6-Digit Code</span>
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 700; letter-spacing: 8px; color: #38bdf8; text-shadow: 0 0 12px rgba(56,189,248,0.25);">${code}</span>
              </div>

              <p style="margin: 0 0 12px 0; font-size: 13px; line-height: 1.5; color: #94a3b8; text-align: center;">
                ⏱ This code is valid for <strong style="color: #e2e8f0;">10 minutes</strong>.
              </p>

              <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #1e2f47;">
                <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #64748b;">
                  If you did not request this password reset, you can safely ignore this email. Your account remains secure and no changes were made.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 36px; background-color: #0b1522; border-top: 1px solid #172436; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #475569;">
                &copy; MedLex System &bull; Forensic & Medicolegal Practice &bull; All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  // If SMTP is not configured, simulate delivery in development and log cleanly
  if (!host || !user || !pass) {
    console.log(`\n======================================================`);
    console.log(`[MedLex Email Service] (SMTP not configured in .env)`);
    console.log(`[MedLex Email Service] Target Email: ${to}`);
    console.log(`[MedLex Email Service] Verification Code: ${code}`);
    console.log(`======================================================\n`);
    return { sent: false, simulated: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

    await transporter.sendMail({
      from,
      to,
      subject: emailSubject,
      text: textContent,
      html: htmlContent,
    });

    console.log(`[MedLex Email Service] Successfully sent reset code to ${to}`);
    return { sent: true };
  } catch (error) {
    console.error(`[MedLex Email Service] Failed to send email via SMTP to ${to}:`, error);
    // In dev / fallback, return simulated so user is not blocked
    return {
      sent: false,
      simulated: true,
      error: error instanceof Error ? error.message : "SMTP sending error",
    };
  }
}
