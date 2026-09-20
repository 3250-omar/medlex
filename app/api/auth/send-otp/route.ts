import { NextResponse, type NextRequest } from "next/server";
import { sendOtpSchema } from "@/lib/auth/validation";
import {
  findRecoveryUser,
  issueRecoveryOtp,
} from "@/lib/auth/passwordRecovery";
import { sendPasswordResetEmail } from "@/lib/email/mailer";
import {
  consumeRateLimit,
  getRequestIdentifier,
} from "@/lib/security/rateLimit";

const GENERIC_RESPONSE = {
  data: { success: true },
};

export async function POST(request: NextRequest) {
  const requestIdentifier = getRequestIdentifier(request);
  const rateLimit = consumeRateLimit(
    "password-reset-request",
    requestIdentifier,
    5,
    15 * 60 * 1000,
  );
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Please wait before requesting another verification code." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      },
    );
  }

  const payload = sendOtpSchema.safeParse(await request.json().catch(() => null));
  if (!payload.success) {
    return NextResponse.json(GENERIC_RESPONSE);
  }

  try {
    const user = await findRecoveryUser(
      payload.data.phone,
      payload.data.emailOrUsername,
    );
    if (!user?.email) return NextResponse.json(GENERIC_RESPONSE);

    const code = await issueRecoveryOtp(user);
    await sendPasswordResetEmail({
      to: user.email,
      code,
      fullName:
        typeof user.user_metadata?.full_name === "string"
          ? user.user_metadata.full_name
          : null,
    });
  } catch (error) {
    console.error("Password reset OTP request failed", error);
  }

  return NextResponse.json(GENERIC_RESPONSE);
}