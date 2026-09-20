import "server-only";

import crypto from "node:crypto";
import type { User } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";

const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;

type RecoveryMetadata = {
  reset_otp_hash?: unknown;
  reset_otp_expires?: unknown;
  reset_otp_attempts?: unknown;
};

export function phonesMatch(left?: string | null, right?: string | null): boolean {
  const normalizedLeft = left?.replace(/\D/g, "") ?? "";
  const normalizedRight = right?.replace(/\D/g, "") ?? "";
  return (
    normalizedLeft.length >= 8 &&
    normalizedRight.length >= 8 &&
    normalizedLeft === normalizedRight
  );
}

function getOtpHash(code: string): string {
  const pepper =
    process.env.AUTH_OTP_HASH_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!pepper) throw new Error("OTP hash secret is not configured");
  return crypto.createHmac("sha256", pepper).update(code).digest("hex");
}

function readNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

/** Avoids the former 1,000-user ceiling; migrate usernames into profiles for indexed lookup. */
export async function findRecoveryUser(
  phone: string,
  emailOrUsername: string,
): Promise<User | null> {
  const admin = createAdminClient();
  const identifier = emailOrUsername.trim().toLowerCase();
  const perPage = 100;

  for (let page = 1; ; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;

    const user = data.users.find((candidate) => {
      const email = candidate.email?.trim().toLowerCase();
      const username =
        typeof candidate.user_metadata?.username === "string"
          ? candidate.user_metadata.username.trim().toLowerCase()
          : undefined;
      const storedPhone =
        typeof candidate.user_metadata?.phone === "string"
          ? candidate.user_metadata.phone
          : candidate.phone;
      return (
        (email === identifier || username === identifier) &&
        phonesMatch(storedPhone, phone)
      );
    });

    if (user) return user;
    if (data.users.length < perPage) return null;
  }
}

export async function issueRecoveryOtp(user: User): Promise<string> {
  const code = crypto.randomInt(100_000, 1_000_000).toString();
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.updateUserById(user.id, {
    user_metadata: {
      ...(user.user_metadata ?? {}),
      reset_otp_hash: getOtpHash(code),
      reset_otp_expires: Date.now() + OTP_TTL_MS,
      reset_otp_attempts: 0,
      reset_otp_code: null,
    },
  });
  if (error) throw error;
  return code;
}

export async function verifyRecoveryOtp(user: User, code: string): Promise<boolean> {
  const metadata = (user.user_metadata ?? {}) as RecoveryMetadata;
  const expiresAt = readNumber(metadata.reset_otp_expires);
  const attempts = readNumber(metadata.reset_otp_attempts) ?? 0;
  const expectedHash =
    typeof metadata.reset_otp_hash === "string" ? metadata.reset_otp_hash : null;
  const suppliedHash = getOtpHash(code);
  const hashesMatch =
    expectedHash !== null &&
    Buffer.from(expectedHash, "hex").length === Buffer.from(suppliedHash, "hex").length &&
    crypto.timingSafeEqual(
      Buffer.from(expectedHash, "hex"),
      Buffer.from(suppliedHash, "hex"),
    );
  const valid =
    hashesMatch &&
    expiresAt !== null &&
    expiresAt > Date.now() &&
    attempts < MAX_OTP_ATTEMPTS;

  const nextMetadata = {
    ...(user.user_metadata ?? {}),
    reset_otp_attempts: valid ? null : attempts + 1,
    reset_otp_hash: valid ? null : expectedHash,
    reset_otp_expires: valid ? null : expiresAt,
    reset_otp_code: null,
  };
  await createAdminClient().auth.admin.updateUserById(user.id, {
    user_metadata: nextMetadata,
  });
  return valid;
}