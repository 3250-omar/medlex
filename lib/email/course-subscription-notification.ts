import "server-only";

// ---------------------------------------------------------------------------
// Course Subscription Email Templates
// ---------------------------------------------------------------------------
// Two emails are sent when a paid course checkout completes:
//  1. Admin notification  → CONTACT_RECIPIENT_EMAIL (the owner)
//  2. User welcome email  → the subscribing learner
// ---------------------------------------------------------------------------

export interface CourseSubscriptionEmailParams {
  userName: string;
  userEmail: string;
  courseTitle: string;
  courseSlug: string;
  amountFormatted: string; // e.g. "£150.00"
  enrolledAt: Date;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns the date of the coming Monday (the next Monday from `now`).
 * If today IS Monday, returns the *following* Monday (7 days ahead).
 */
function getNextMonday(now: Date): Date {
  const dayOfWeek = now.getUTCDay(); // 0 = Sun, 1 = Mon, …
  const daysUntilMonday =
    dayOfWeek === 0 ? 1 : dayOfWeek === 1 ? 7 : 8 - dayOfWeek;
  const next = new Date(now);
  next.setUTCDate(next.getUTCDate() + daysUntilMonday);
  return next;
}

function formatDateEnglish(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Cairo",
  });
}

function formatDateShort(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Cairo",
    hour12: true,
  });
}

// ---------------------------------------------------------------------------
// 1. ADMIN NOTIFICATION
// ---------------------------------------------------------------------------

export function generateAdminNewSubscriptionEmail({
  userName,
  userEmail,
  courseTitle,
  amountFormatted,
  enrolledAt,
}: CourseSubscriptionEmailParams): {
  subject: string;
  html: string;
  text: string;
} {
  const dateStr = formatDateShort(enrolledAt);

  const subject = `🎉 New Subscription: ${userName} — ${courseTitle}`;

  const text = [
    `New course subscription received.`,
    ``,
    `Student: ${userName}`,
    `Email: ${userEmail}`,
    `Course: ${courseTitle}`,
    `Amount: ${amountFormatted}`,
    `Enrolled at: ${dateStr} (Cairo time)`,
    ``,
    `— MedLex System`,
  ].join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Course Subscription</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fafc; padding: 36px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 540px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="padding: 28px 32px 20px 32px; border-bottom: 1px solid #f1f5f9;">
              <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #0284c7; margin-bottom: 6px;">MEDLEX ADMIN</div>
              <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #0f172a;">🎉 New Course Subscription</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <p style="margin: 0 0 10px 0; font-size: 14px; color: #64748b;"><strong style="color: #0f172a;">Student:</strong> ${userName}</p>
                    <p style="margin: 0 0 10px 0; font-size: 14px; color: #64748b;"><strong style="color: #0f172a;">Email:</strong> <a href="mailto:${userEmail}" style="color: #0284c7; text-decoration: underline;">${userEmail}</a></p>
                    <p style="margin: 0 0 10px 0; font-size: 14px; color: #64748b;"><strong style="color: #0f172a;">Course:</strong> ${courseTitle}</p>
                    <p style="margin: 0 0 10px 0; font-size: 14px; color: #64748b;"><strong style="color: #0f172a;">Amount:</strong> <span style="color: #16a34a; font-weight: 700;">${amountFormatted}</span></p>
                    <p style="margin: 0; font-size: 14px; color: #64748b;"><strong style="color: #0f172a;">Enrolled:</strong> ${dateStr} (Cairo)</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 16px 32px; background-color: #fafafa; border-top: 1px solid #f1f5f9; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">&copy; MedLex System &bull; Admin Notification</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html, text };
}

// ---------------------------------------------------------------------------
// 2. USER WELCOME EMAIL
// ---------------------------------------------------------------------------

export function generateUserCourseWelcomeEmail({
  userName,
  enrolledAt,
}: CourseSubscriptionEmailParams): {
  subject: string;
  html: string;
  text: string;
} {
  const nextMonday = getNextMonday(enrolledAt);
  const nextMondayStr = formatDateEnglish(nextMonday);

  const subject = "Welcome to The CASC Academy — MedLex";

  const text = [
    `Dear Dr ${userName},`,
    ``,
    `Thank you for joining The CASC Academy, and welcome as one of our founding members.`,
    ``,
    `Weekly examiner's notes: Every Monday during your subscription, you'll receive an email from Dr Abouelghit with guidance from the examiner's side of the table. It covers what to focus on, common pitfalls, and how to pace your preparation. The first one will reach you on Monday ${nextMondayStr}, from info@medlexsolutions.com. Please add this address to your contacts so it doesn't land in spam.`,
    ``,
    `WhatsApp group: The members' group will open within the next two weeks. You'll be added automatically, so there's nothing you need to do.`,
    ``,
    `Articles: We publish articles on the CASC and related topics on our website, medlexsolutions.com/en/blogs, and new ones are added regularly. They're worth following alongside the course.`,
    ``,
    `In the meantime, the best place to start is the workbook. Use it to map out your study schedule against your exam date.`,
    ``,
    `If anything is unclear, just message us here.`,
    ``,
    `Best wishes with your preparation,`,
    `The MedLex Team`,
  ].join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to The CASC Academy</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fafc; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Main Container: Pure White -->
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);" cellspacing="0" cellpadding="0" border="0">

          <!-- Clean Minimal Header -->
          <tr>
            <td style="padding: 32px 36px 20px 36px; border-bottom: 1px solid #f1f5f9;">
              <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #0284c7; margin-bottom: 4px;">THE CASC ACADEMY</div>
              <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #0f172a; line-height: 1.3;">Welcome, Dr ${userName}</h1>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 28px 36px 32px 36px; font-size: 15px; line-height: 1.7; color: #334155;">
              
              <p style="margin: 0 0 16px 0;">
                Dear Dr ${userName},
              </p>

              <p style="margin: 0 0 24px 0;">
                Thank you for joining <strong>The CASC Academy</strong>, and welcome as one of our founding members.
              </p>

              <!-- Section 1: Weekly Examiner's Notes -->
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 3px solid #0284c7; border-radius: 6px; padding: 16px 18px; margin: 0 0 16px 0;">
                <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 6px;">
                  Weekly Examiner's Notes
                </div>
                <div style="font-size: 14px; line-height: 1.6; color: #475569;">
                  Every Monday during your subscription, you'll receive an email from Dr&nbsp;Abouelghit with guidance from the examiner's side of the table. It covers what to focus on, common pitfalls, and how to pace your preparation. The first one will reach you on <strong style="color: #0f172a;">Monday ${nextMondayStr}</strong>, from <a href="mailto:info@medlexsolutions.com" style="color: #0284c7; text-decoration: underline;">info@medlexsolutions.com</a>. Please add this address to your contacts so it doesn't land in spam.
                </div>
              </div>

              <!-- Section 2: WhatsApp Group -->
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 3px solid #10b981; border-radius: 6px; padding: 16px 18px; margin: 0 0 16px 0;">
                <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 6px;">
                  WhatsApp Group
                </div>
                <div style="font-size: 14px; line-height: 1.6; color: #475569;">
                  The members' group will open within the next two weeks. You'll be added automatically, so there's nothing you need to do.
                </div>
              </div>

              <!-- Section 3: Articles -->
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 3px solid #f59e0b; border-radius: 6px; padding: 16px 18px; margin: 0 0 20px 0;">
                <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 6px;">
                  Articles
                </div>
                <div style="font-size: 14px; line-height: 1.6; color: #475569;">
                  We publish articles on the CASC and related topics on our website, <a href="https://medlexsolutions.com/en/blogs" style="color: #0284c7; text-decoration: underline;">medlexsolutions.com/en/blogs</a>, and new ones are added regularly. They're worth following alongside the course.
                </div>
              </div>

              <p style="margin: 0 0 16px 0;">
                In the meantime, the best place to start is the workbook. Use it to map out your study schedule against your exam date.
              </p>

              <p style="margin: 0 0 28px 0;">
                If anything is unclear, just message us here.
              </p>

              <!-- Sign-off -->
              <div style="padding-top: 16px; border-top: 1px solid #f1f5f9;">
                <div style="font-size: 14px; color: #64748b; margin-bottom: 4px;">Best wishes with your preparation,</div>
                <div style="font-size: 15px; font-weight: 700; color: #0f172a;">The MedLex Team</div>
              </div>

            </td>
          </tr>

          <!-- Clean Subtle Footer -->
          <tr>
            <td style="padding: 16px 36px; background-color: #fafafa; border-top: 1px solid #f1f5f9; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                &copy; MedLex System &bull; <a href="https://medlexsolutions.com" style="color: #94a3b8; text-decoration: none;">medlexsolutions.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html, text };
}
