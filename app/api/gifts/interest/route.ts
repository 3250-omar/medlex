import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/transport";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, resource, fileUrl, pathway, type } = body || {};

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required" },
        { status: 400 },
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = (name && typeof name === "string" ? name.trim() : "") || "Colleague";
    const resourceTitle = resource || "MedLex Resource Guide";
    const isWaitlist = type === "enrol_waitlist";

    // 1. Record lead into contacts_requests table
    try {
      const supabase = await createClient();
      await supabase.from("contacts_requests").insert({
        full_name: cleanName === "Colleague" ? "Guest / Subscriber" : cleanName,
        gmail: cleanEmail,
        phone: "N/A",
        pathway: pathway || resourceTitle,
        notes: isWaitlist
          ? `Waitlist submission: ${resourceTitle}`
          : `Free guide download: ${resourceTitle} (${fileUrl || "N/A"})`,
        locale: "en",
      });
    } catch (dbErr) {
      console.error("[api/gifts/interest] Failed to save lead to database:", dbErr);
    }

    // 2. Dispatch confirmation / resource email via Resend
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://medlexsolutions.com";
      const fullDownloadUrl = fileUrl
        ? fileUrl.startsWith("http")
          ? fileUrl
          : `${siteUrl}${fileUrl.startsWith("/") ? "" : "/"}${fileUrl}`
        : null;

      const subject = isWaitlist
        ? `MedLex — You are on the waitlist for ${resourceTitle}`
        : `Your MedLex Guide: ${resourceTitle}`;

      const html = isWaitlist
        ? `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; color: #0E1D38; background: #FAF9F6; border: 1px solid #DFD5C0; border-radius: 8px;">
          <h2 style="color: #0E1D38; font-size: 24px; margin-bottom: 16px;">Dear ${cleanName},</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #2C3E50;">
            Thank you for your interest in <strong>${resourceTitle}</strong>.
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #2C3E50;">
            Enrolment will open shortly. As you are on our priority waitlist, you will be among the very first to receive access details and opening announcements.
          </p>
          <div style="margin: 28px 0; padding: 20px; background: #F5EFE3; border-left: 4px solid #C5A059; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px; color: #0E1D38; font-weight: 600;">
              MedLex Solutions · Where medicine meets justice
            </p>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #555;">
              If you have any questions, feel free to reply directly to this email or contact us at <a href="mailto:info@medlexsolutions.com" style="color: #0E1D38; text-decoration: underline;">info@medlexsolutions.com</a>.
            </p>
          </div>
        </div>
      `
        : `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; color: #0E1D38; background: #FAF9F6; border: 1px solid #DFD5C0; border-radius: 8px;">
          <h2 style="color: #0E1D38; font-size: 24px; margin-bottom: 16px;">Dear ${cleanName},</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #2C3E50;">
            Thank you for requesting <strong>${resourceTitle}</strong> from MedLex.
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #2C3E50;">
            Your guide has begun downloading in your browser. You can also access and save your copy anytime using the direct link below:
          </p>
          ${
            fullDownloadUrl
              ? `
          <div style="margin: 24px 0;">
            <a href="${fullDownloadUrl}" style="display: inline-block; background-color: #0E1D38; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 15px;">
              Download ${resourceTitle} (PDF)
            </a>
          </div>
          `
              : ""
          }
          <div style="margin: 28px 0; padding: 20px; background: #F5EFE3; border-left: 4px solid #C5A059; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px; color: #0E1D38; font-weight: 600;">
              MedLex Solutions · Professional Education in Psychiatry, Law and Leadership
            </p>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #555;">
              Questions or enquiries? Contact our team at <a href="mailto:info@medlexsolutions.com" style="color: #0E1D38; text-decoration: underline;">info@medlexsolutions.com</a>.
            </p>
          </div>
        </div>
      `;

      await sendEmail({
        to: cleanEmail,
        subject,
        html,
        text: isWaitlist
          ? `Thank you for your interest in ${resourceTitle}. Enrolment opens shortly and we will notify you first.`
          : `Thank you for requesting ${resourceTitle}. You can download it here: ${fullDownloadUrl || siteUrl}`,
      });
    } catch (emailErr) {
      console.error("[api/gifts/interest] Failed to dispatch email:", emailErr);
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("[api/gifts/interest] Error:", err);
    return NextResponse.json({ success: true });
  }
}

