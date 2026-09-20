import { NextResponse, type NextRequest } from "next/server";
import { resetPasswordSchema } from "@/lib/auth/validation";
import { findRecoveryUser, verifyRecoveryOtp } from "@/lib/auth/passwordRecovery";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  consumeRateLimit,
  getRequestIdentifier,
} from "@/lib/security/rateLimit";

const INVALID_RESET_RESPONSE = {
  error: "Unable to reset the password with the supplied details.",
};

export async function POST(request: NextRequest) {
  const rateLimit = consumeRateLimit(
    "password-reset-confirm",
    getRequestIdentifier(request),
    10,
    15 * 60 * 1000,
  );
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Please wait before trying again." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      },
    );
  }

  const payload = resetPasswordSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!payload.success) {
    return NextResponse.json(INVALID_RESET_RESPONSE, { status: 400 });
  }

  try {
    const user = await findRecoveryUser(
      payload.data.phone,
      payload.data.emailOrUsername,
    );
    if (!user || !(await verifyRecoveryOtp(user, payload.data.code))) {
      return NextResponse.json(INVALID_RESET_RESPONSE, { status: 400 });
    }

    const { error } = await createAdminClient().auth.admin.updateUserById(user.id, {
      password: payload.data.newPassword,
    });
    if (error) throw error;

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    console.error("Password reset failed", error);
    return NextResponse.json(
      { error: "Unable to reset the password. Please request a new code." },
      { status: 500 },
    );
  }
}