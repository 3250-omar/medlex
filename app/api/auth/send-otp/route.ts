import { NextResponse, type NextRequest } from "next/server";
import { sendOtpSchema } from "@/lib/auth/validation";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendPasswordResetEmail } from "@/lib/email/mailer";

function phonesMatch(p1?: string | null, p2?: string | null): boolean {
  if (!p1 || !p2) return false;
  const d1 = p1.replace(/\D/g, "");
  const d2 = p2.replace(/\D/g, "");
  if (!d1 || !d2) return false;
  if (d1 === d2) return true;
  if (d1.length >= 8 && d2.length >= 8) {
    return d1.slice(-8) === d2.slice(-8);
  }
  return false;
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  if (local.length <= 2) {
    return `${local}***@${domain}`;
  }
  const start = local.slice(0, 2);
  const end = local.slice(-1);
  return `${start}***${end}@${domain}`;
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const payload = sendOtpSchema.safeParse(body);

  if (!payload.success) {
    return NextResponse.json(
      {
        error:
          "Please enter your registered phone number and email or username.",
      },
      { status: 400 },
    );
  }

  const { phone, emailOrUsername } = payload.data;
  const admin = createAdminClient();

  const {
    data: { users },
    error: listError,
  } = await admin.auth.admin.listUsers({ perPage: 1000 });

  if (listError || !users) {
    return NextResponse.json(
      { error: "Unable to process verification request at this time." },
      { status: 500 },
    );
  }

  const targetIdentifier = emailOrUsername.toLowerCase().trim();

  const matchedUser = users.find((u) => {
    const userEmail = u.email?.toLowerCase().trim();
    const userUsername = (u.user_metadata?.username as string | undefined)
      ?.toLowerCase()
      .trim();
    const identifierMatches =
      userEmail === targetIdentifier || userUsername === targetIdentifier;
    if (!identifierMatches) return false;

    const userPhone = (u.user_metadata?.phone as string | undefined) ?? u.phone;
    return phonesMatch(userPhone, phone);
  });

  if (!matchedUser || !matchedUser.email) {
    return NextResponse.json(
      {
        error:
          "No matching account found with the provided phone number and email/username.",
      },
      { status: 404 },
    );
  }

  // Generate 6-digit OTP code and set 10 minutes expiry
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000;

  const { error: updateError } = await admin.auth.admin.updateUserById(
    matchedUser.id,
    {
      user_metadata: {
        ...matchedUser.user_metadata,
        reset_otp_code: code,
        reset_otp_expires: expiresAt,
      },
    },
  );

  if (updateError) {
    return NextResponse.json(
      { error: "Failed to generate verification code. Please try again." },
      { status: 500 },
    );
  }

  const fullName =
    (matchedUser.user_metadata?.full_name as string | undefined) ||
    (matchedUser.user_metadata?.username as string | undefined) ||
    null;

  // Send the email via Nodemailer
  const emailResult = await sendPasswordResetEmail({
    to: matchedUser.email,
    code,
    fullName,
  });

  const isDev = process.env.NODE_ENV !== "production";
  const masked = maskEmail(matchedUser.email);

  const result = {
    success: true,
    email: masked,
    phone: matchedUser.user_metadata?.phone || phone,
    emailSent: emailResult.sent,
    code: isDev || emailResult.simulated ? code : undefined,
  };

  return NextResponse.json({
    data: result,
    ...result,
  });
}
