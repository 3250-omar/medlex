import { NextResponse, type NextRequest } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

const contactSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(120),
  email: z.string().trim().email("Invalid email address").max(150),
  professionalRole: z
    .string()
    .trim()
    .min(2, "Professional role is required")
    .max(150),
  organisation: z.string().trim().max(150).optional().default(""),
  pathway: z.string().trim().min(1, "Pathway is required").max(150),
  notes: z.string().trim().max(3000).optional().default(""),
  locale: z.string().trim().max(10).optional().default("en"),
  _hp: z.string().optional().default(""), // Honeypot field for bot spam prevention
});

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json().catch(() => null);

    // 1. Silent rejection of spam bots filling honeypot
    if (rawBody?._hp) {
      console.warn("[Contact API] Bot submission suppressed via honeypot.");
      return NextResponse.json({
        success: true,
        message: "Message received successfully",
      });
    }

    // 2. Validate incoming payload
    const parsed = contactSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const {
      fullName,
      email,
      professionalRole,
      organisation,
      pathway,
      notes,
      locale,
    } = parsed.data;

    const isRtl = locale === "ar";
    const host = process.env.SMTP_HOST?.trim();
    const port = Number(process.env.SMTP_PORT) || 587;
    const secure = process.env.SMTP_SECURE === "true" || port === 465;
    const user = process.env.SMTP_USER?.trim();
    const pass = process.env.SMTP_PASS?.trim();
    const fromAddress =
      process.env.SMTP_FROM?.trim() ||
      `"MedLex System" <${user || "noreply@medlexsolutions.com"}>`;
    const toAddress =
      process.env.CONTACT_RECIPIENT_EMAIL?.trim() || "info@medlexsolutions.com";

    // 3. Handle unconfigured SMTP
    if (!host || !user || !pass) {
      // In local development, simulate successful dispatch so the UI flow can be verified
      if (process.env.NODE_ENV === "development") {
        console.log(
          "\n=======================================================\n" +
            "[Contact API - DEV SIMULATION MODE]\n" +
            "SMTP credentials not fully set in .env. Email dispatch simulated:\n" +
            `• Recipient Admin: ${toAddress}\n` +
            `• Registrant: ${fullName} <${email}>\n` +
            `• Role: ${professionalRole} | Org: ${organisation || "None"}\n` +
            `• Pathway: ${pathway}\n` +
            `• Locale: ${locale}\n` +
            `• Notes: ${notes || "None"}\n` +
            "=======================================================\n",
        );

        return NextResponse.json({
          success: true,
          simulated: true,
          message:
            "Development simulation: SMTP is not configured in .env. Submission logged to console.",
        });
      }

      console.warn(
        "[Contact API] SMTP credentials missing in server environment (SMTP_HOST, SMTP_USER, SMTP_PASS).",
      );
      return NextResponse.json(
        {
          error:
            "Mail service is not configured. Please contact info@medlexsolutions.com directly.",
        },
        { status: 503 },
      );
    }

    // 4. Create Nodemailer transporter with connection safeguards
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

    const safeFullName = escapeHtml(fullName);
    const safeEmail = escapeHtml(email);
    const safeRole = escapeHtml(professionalRole);
    const safeOrg = escapeHtml(organisation || "Not specified");
    const safePathway = escapeHtml(pathway);
    const safeNotes = escapeHtml(notes || "None provided").replace(
      /\n/g,
      "<br/>",
    );
    const receivedAt = new Date().toUTCString();

    // ──────────────────────────────────────────
    // 5. Admin Notification Email
    // ──────────────────────────────────────────
    const adminSubject = `[MedLex Inquiry] ${pathway} — ${fullName}`;

    const adminTextContent = `
New Contact / Interest Registration
------------------------------------
Full Name: ${fullName}
Email: ${email}
Professional Role: ${professionalRole}
Organisation: ${organisation || "Not specified"}
Pathway: ${pathway}
Locale: ${locale}
Submitted At: ${receivedAt}

Notes:
${notes || "None provided"}
    `.trim();

    const adminHtmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${adminSubject}</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #F8F9FA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 620px; margin: 0 auto; background-color: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    <!-- Header -->
    <tr>
      <td style="background-color: #0B192C; padding: 30px 32px; text-align: left;">
        <span style="display: inline-block; font-size: 11px; font-weight: 700; color: #C5A880; letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 6px;">
          MedLex Academy & Solutions
        </span>
        <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.01em;">
          New Contact & Interest Registration
        </h1>
      </td>
    </tr>

    <!-- Summary Box -->
    <tr>
      <td style="padding: 22px 32px; background-color: #FCFBF9; border-bottom: 1px solid #f1f5f9;">
        <p style="margin: 0 0 6px 0; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">
          Selected Pathway
        </p>
        <p style="margin: 0; font-size: 18px; font-weight: 700; color: #0B192C;">
          ${safePathway}
        </p>
      </td>
    </tr>

    <!-- Fields Table -->
    <tr>
      <td style="padding: 24px 32px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px; border-collapse: collapse;">
          <tr>
            <td style="padding: 11px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; width: 140px; font-weight: 600;">Full Name</td>
            <td style="padding: 11px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-weight: 600;">${safeFullName}</td>
          </tr>
          <tr>
            <td style="padding: 11px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600;">Email</td>
            <td style="padding: 11px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a;">
              <a href="mailto:${safeEmail}" style="color: #0B192C; text-decoration: underline; font-weight: 600;">${safeEmail}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 11px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600;">Professional Role</td>
            <td style="padding: 11px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a;">${safeRole}</td>
          </tr>
          <tr>
            <td style="padding: 11px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600;">Organisation</td>
            <td style="padding: 11px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a;">${safeOrg}</td>
          </tr>
          <tr>
            <td style="padding: 11px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600;">Language / Locale</td>
            <td style="padding: 11px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a;">${escapeHtml(locale.toUpperCase())}</td>
          </tr>
          <tr>
            <td style="padding: 11px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 600;">Timestamp</td>
            <td style="padding: 11px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 13px;">${receivedAt}</td>
          </tr>
        </table>

        <!-- Notes Section -->
        <div style="margin-top: 24px; padding: 18px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
          <p style="margin: 0 0 8px 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #475569;">
            Additional Notes / Questions:
          </p>
          <div style="font-size: 14px; line-height: 1.6; color: #334155;">
            ${safeNotes}
          </div>
        </div>

        <!-- Quick Reply Action -->
        <div style="margin-top: 26px; text-align: center;">
          <a href="mailto:${safeEmail}?subject=Re:%20MedLex%20Enquiry%20-%20${encodeURIComponent(pathway)}" style="display: inline-block; background-color: #0B192C; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-size: 14px; font-weight: 600;">
            Reply to ${safeFullName}
          </a>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #f8fafc; padding: 18px 32px; text-align: center; border-top: 1px solid #f1f5f9;">
        <p style="margin: 0; font-size: 12px; color: #94a3b8;">
          This inquiry was submitted from the MedLex official website.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    // ──────────────────────────────────────────
    // 6. User Confirmation / Autoresponder Email
    // ──────────────────────────────────────────
    const userSubject = isRtl
      ? `مِدلكس — تم استلام اهتمامك بمسار ${pathway}`
      : `MedLex — We received your inquiry regarding ${pathway}`;

    const userTextContent = isRtl
      ? `
مرحبًا ${fullName}،

شكرًا لتسجيل اهتمامك في برامج مِدلكس (MedLex).

تفاصيل طلبك:
- المسار: ${pathway}
- الدور المهني: ${professionalRole}
- الجهة: ${organisation || "غير محدد"}

سيتواصل معك فريقنا الأكاديمي قريبًا بمجرد فتح باب التسجيل وتأكيد مواعيد الدفعة القادمة وتفاصيل المنهج.

إذا كان لديك أي استفسار عاجل، يمكنك مراسلتنا مباشرة على ${toAddress} أو الاتصال على +20 101 951 5321.

مع خالص التحية،
فريق مِدلكس للحلول والاستشارات الأكاديمية
      `.trim()
      : `
Dear ${fullName},

Thank you for registering your interest with MedLex.

Your submission details:
- Pathway: ${pathway}
- Professional Role: ${professionalRole}
- Organisation: ${organisation || "Not specified"}

Our academic team will be in touch with syllabus outlines, cohort schedules, and enrolment details when the next intake opens.

If you have any immediate questions, feel free to reply to this email or reach us at ${toAddress} or +20 101 951 5321.

Warm regards,
MedLex Academy Team
      `.trim();

    const userHtmlContent = `
<!DOCTYPE html>
<html lang="${isRtl ? "ar" : "en"}" dir="${isRtl ? "rtl" : "ltr"}">
<head>
  <meta charset="UTF-8">
  <title>${userSubject}</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #F8F9FA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; direction: ${isRtl ? "rtl" : "ltr"}; text-align: ${isRtl ? "right" : "left"};">
  <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 620px; margin: 0 auto; background-color: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    <!-- Header -->
    <tr>
      <td style="background-color: #0B192C; padding: 32px; text-align: center;">
        <span style="display: inline-block; font-size: 11px; font-weight: 700; color: #C5A880; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 6px;">
          MedLex Academy & Solutions
        </span>
        <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.01em;">
          ${isRtl ? "شكرًا لتواصلك معنا" : "Thank You For Reaching Out"}
        </h1>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding: 32px 36px;">
        <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #0B192C;">
          ${isRtl ? `عزيزنا/عزيزتنا ${safeFullName}،` : `Dear ${safeFullName},`}
        </p>

        <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.7; color: #475569;">
          ${
            isRtl
              ? `تم استلام اهتمامك بمسار <strong>${safePathway}</strong> بنجاح. سيقوم فريقنا الأكاديمي بمراجعة استفسارك ومشاركتك تفاصيل الدفعة القادمة ومواعيد التسجيل.`
              : `We have successfully received your inquiry regarding <strong>${safePathway}</strong>. Our academic team is reviewing your submission and will contact you directly with upcoming cohort dates, curriculum syllabus, and registration details.`
          }
        </p>

        <!-- Details Card -->
        <div style="background-color: #FCFBF9; border: 1px solid #F1EFE9; border-radius: 10px; padding: 20px; margin: 24px 0;">
          <p style="margin: 0 0 12px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #C5A880;">
            ${isRtl ? "ملخص بيانات التسجيل" : "Registration Summary"}
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 13px; color: #334155;">
            <tr>
              <td style="padding: 6px 0; font-weight: 600; color: #64748b; width: 140px;">
                ${isRtl ? "المسار:" : "Pathway:"}
              </td>
              <td style="padding: 6px 0; font-weight: 700; color: #0B192C;">
                ${safePathway}
              </td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: 600; color: #64748b;">
                ${isRtl ? "الدور المهني:" : "Role:"}
              </td>
              <td style="padding: 6px 0; color: #0B192C;">
                ${safeRole}
              </td>
            </tr>
            ${
              organisation
                ? `
            <tr>
              <td style="padding: 6px 0; font-weight: 600; color: #64748b;">
                ${isRtl ? "الجهة:" : "Organisation:"}
              </td>
              <td style="padding: 6px 0; color: #0B192C;">
                ${safeOrg}
              </td>
            </tr>
            `
                : ""
            }
          </table>
        </div>

        <p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.7; color: #475569;">
          ${
            isRtl
              ? `إذا كان لديك أي سؤال إضافي أو ترغب في التحدث مع أحد مسؤولي البرامج فورًا، يمكنك الرد على هذه الرسالة أو التواصل معنا على:`
              : `If you have any questions in the meantime or require urgent assistance, you can reply directly to this email or contact us via:`
          }
        </p>

        <p style="margin: 0; font-size: 13px; font-weight: 600; color: #0B192C;">
          ✉ <a href="mailto:${toAddress}" style="color: #0B192C; text-decoration: underline;">${toAddress}</a> &nbsp;|&nbsp; ☎ <a href="tel:+201019515321" style="color: #0B192C; text-decoration: none;" dir="ltr">+20 101 951 5321</a>
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #f8fafc; padding: 20px 32px; text-align: center; border-top: 1px solid #f1f5f9;">
        <p style="margin: 0 0 6px 0; font-size: 12px; color: #64748b;">
          MedLex — Forensic Psychiatry, CASC Academy & Medico-Legal Education
        </p>
        <p style="margin: 0; font-size: 11px; color: #94a3b8;">
          ${
            isRtl
              ? "تُستخدم بياناتك فقط لأغراض المتابعة الأكاديمية مع مِدلكس ولن يتم مشاركتها إطلاقًا."
              : "Your details are used solely to communicate about MedLex programmes and are never shared."
          }
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    // ──────────────────────────────────────────
    // 7. Dispatch Emails
    // ──────────────────────────────────────────
    // Primary: Admin Notification
    await transporter.sendMail({
      from: fromAddress,
      to: toAddress,
      replyTo: email,
      subject: adminSubject,
      text: adminTextContent,
      html: adminHtmlContent,
    });

    // Secondary: User Auto-acknowledgement (Non-blocking failure)
    try {
      await transporter.sendMail({
        from: fromAddress,
        to: email,
        replyTo: toAddress,
        subject: userSubject,
        text: userTextContent,
        html: userHtmlContent,
      });
    } catch (userMailErr) {
      console.warn(
        "[Contact API] User confirmation email could not be delivered, but admin notification succeeded:",
        userMailErr,
      );
    }

    return NextResponse.json({
      success: true,
      message: "Inquiry and confirmation processed successfully",
    });
  } catch (error: unknown) {
    console.error("[Contact API Error]:", error);
    const message =
      error instanceof Error ? error.message : "Failed to send email";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
