import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/transport";
import {
  generateAdminNewSubscriptionEmail,
  generateUserCourseWelcomeEmail,
  type CourseSubscriptionEmailParams,
} from "@/lib/email/course-subscription-notification";

export const dynamic = "force-dynamic";

/**
 * TEST-ONLY endpoint to verify subscription emails are sent correctly.
 * 
 * Usage: GET /api/test-subscription-email?email=your@email.com
 * x
 * ⚠️  DELETE THIS FILE before deploying to production.
 */
export async function GET(request: Request) {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Test endpoint disabled in production" },
      { status: 403 },
    );
  }

  const url = new URL(request.url);
  const testEmail = url.searchParams.get("email");

  if (!testEmail) {
    return NextResponse.json(
      { error: "Missing ?email= query parameter" },
      { status: 400 },
    );
  }

  const emailParams: CourseSubscriptionEmailParams = {
    userName: "Ahmed Testing",
    userEmail: testEmail,
    courseTitle: "The CASC Academy",
    courseSlug: "casc-academy",
    amountFormatted: "£150.00",
    enrolledAt: new Date(),
  };

  const adminEmail = generateAdminNewSubscriptionEmail(emailParams);
  const userWelcome = generateUserCourseWelcomeEmail(emailParams);

  const adminRecipient =
    process.env.CONTACT_RECIPIENT_EMAIL || testEmail;

  console.log("[Test Email] Sending admin email to:", adminRecipient);
  console.log("[Test Email] Sending user welcome email to:", testEmail);
  console.log("[Test Email] RESEND_API_KEY configured:", !!process.env.RESEND_API_KEY);

  const [adminResult, userResult] = await Promise.allSettled([
    sendEmail({
      to: adminRecipient,
      subject: adminEmail.subject,
      html: adminEmail.html,
      text: adminEmail.text,
    }),
    sendEmail({
      to: testEmail,
      subject: userWelcome.subject,
      html: userWelcome.html,
      text: userWelcome.text,
    }),
  ]);

  return NextResponse.json({
    adminEmail: {
      to: adminRecipient,
      status: adminResult.status,
      result:
        adminResult.status === "fulfilled"
          ? adminResult.value
          : { error: String(adminResult.reason) },
    },
    userEmail: {
      to: testEmail,
      status: userResult.status,
      result:
        userResult.status === "fulfilled"
          ? userResult.value
          : { error: String(userResult.reason) },
    },
    resendConfigured: !!process.env.RESEND_API_KEY,
  });
}
