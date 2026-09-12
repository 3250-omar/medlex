import { NextResponse, type NextRequest } from "next/server";
import { resetPasswordSchema } from "@/lib/auth/validation";
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
  const payload = resetPasswordSchema.safeParse(body);

  if (!payload.success) {
    return NextResponse.json(
      { error: "Please fill in all fields with valid information." },
      { status: 400 },
    );
  }

  const { phone, emailOrUsername, code, newPassword } = payload.data;
  const admin = createAdminClient();

  const {
    data: { users },
    error: listError,
  } = await admin.auth.admin.listUsers({ perPage: 1000 });

  if (listError || !users) {
    return NextResponse.json(
      { error: "Unable to process password reset request at this time." },
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
          "No matching account found with the provided phone number and email or username.",
      },
      { status: 404 },
    );
  }

  const storedCode = matchedUser.user_metadata?.reset_otp_code;
  const storedExpires = matchedUser.user_metadata?.reset_otp_expires;

  if (!storedCode || String(storedCode).trim() !== String(code).trim()) {
    return NextResponse.json(
      {
        error:
          "Invalid verification code. Please check the code sent to your email.",
      },
      { status: 400 },
    );
  }

  if (typeof storedExpires === "number" && Date.now() > storedExpires) {
    return NextResponse.json(
      {
        error:
          "Verification code has expired. Please request a new verification code.",
      },
      { status: 400 },
    );
  }

  const { error: updateError } = await admin.auth.admin.updateUserById(
    matchedUser.id,
    {
      password: newPassword,
      user_metadata: {
        ...matchedUser.user_metadata,
        reset_otp_code: null,
        reset_otp_expires: null,
      },
    },
  );

  if (updateError) {
    return NextResponse.json(
      { error: updateError.message || "Failed to reset password." },
      { status: 500 },
    );
  }

  // Ensure public.profiles has phone recorded
  await admin
    .from("profiles")
    .update({ phone: matchedUser.user_metadata?.phone || phone })
    .eq("id", matchedUser.id);

  const result = {
    success: true,
    email: matchedUser.email,
  };

  return NextResponse.json({
    data: result,
    ...result,
  });
}
