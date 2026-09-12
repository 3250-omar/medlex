import { NextResponse, type NextRequest } from "next/server";
import { sendOtpSchema } from "@/lib/auth/validation";
import { createAdminClient } from "@/lib/supabase/admin";

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

  if (!matchedUser) {
    return NextResponse.json(
      {
        error:
          "No matching account found with the provided phone number and email/username.",
      },
      { status: 404 },
    );
  }

  // Generate 6-digit OTP and set 10 minutes expiry
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
      { error: "Failed to generate verification code." },
      { status: 500 },
    );
  }

  const rawPhone =
    (matchedUser.user_metadata?.phone as string | undefined) || phone;
  const cleanPhone = rawPhone.replace(/\D/g, "");
  const messageText = `Your MedLex password reset verification code is: *${code}*. It will expire in 10 minutes.`;
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;

  const result = {
    success: true,
    phone: rawPhone,
    cleanPhone,
    code,
    waUrl,
  };

  return NextResponse.json({
    data: result,
    ...result,
  });
}
