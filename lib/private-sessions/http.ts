import { NextResponse, type NextRequest } from "next/server";
import { type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Extracts correlation ID from request headers or generates a new one.
 */
export function getCorrelationId(req: Request | NextRequest): string {
  const existing = req.headers.get("x-correlation-id") || req.headers.get("x-request-id");
  if (existing && existing.trim().length > 0) {
    return existing.trim().slice(0, 64);
  }
  return crypto.randomUUID();
}

/**
 * Extracts and validates the required Idempotency-Key header (16 to 128 chars).
 */
export function getIdempotencyKey(req: Request | NextRequest): string | null {
  const header = req.headers.get("idempotency-key") || req.headers.get("Idempotency-Key");
  if (!header) return null;
  const trimmed = header.trim();
  if (trimmed.length < 16 || trimmed.length > 128) {
    return null;
  }
  return trimmed;
}

/**
 * Standard API error response generator.
 */
export function errorResponse({
  status,
  code,
  message,
  fieldErrors,
  correlationId,
}: {
  status: number;
  code: string;
  message: string;
  fieldErrors?: Record<string, string[]>;
  correlationId?: string;
}): NextResponse {
  return NextResponse.json(
    {
      error: {
        code,
        message,
        ...(fieldErrors ? { fieldErrors } : {}),
        ...(correlationId ? { correlationId } : {}),
      },
    },
    {
      status,
      headers: {
        "Content-Type": "application/json",
        ...(correlationId ? { "x-correlation-id": correlationId } : {}),
      },
    }
  );
}

export function unauthorizedError(message = "Authentication required", correlationId?: string) {
  return errorResponse({
    status: 401,
    code: "UNAUTHORIZED",
    message,
    correlationId,
  });
}

export function emailVerificationRequiredError(
  message = "A verified email is required to book or purchase private sessions",
  correlationId?: string
) {
  return errorResponse({
    status: 403,
    code: "EMAIL_VERIFICATION_REQUIRED",
    message,
    correlationId,
  });
}

export function validationError(
  message = "Validation failed",
  fieldErrors?: Record<string, string[]>,
  correlationId?: string
) {
  return errorResponse({
    status: 422,
    code: "VALIDATION_ERROR",
    message,
    fieldErrors,
    correlationId,
  });
}

export function conflictError(
  message = "Operation conflicted with current resource state",
  code = "CONFLICT",
  correlationId?: string
) {
  return errorResponse({
    status: 409,
    code,
    message,
    correlationId,
  });
}

export function notFoundError(message = "Resource not found", correlationId?: string) {
  return errorResponse({
    status: 404,
    code: "NOT_FOUND",
    message,
    correlationId,
  });
}

export function rateLimitError(
  message = "Rate limit exceeded. Please wait before retrying.",
  correlationId?: string
) {
  return errorResponse({
    status: 429,
    code: "RATE_LIMIT_EXCEEDED",
    message,
    correlationId,
  });
}

export function internalError(
  message = "An unexpected server error occurred",
  correlationId?: string
) {
  return errorResponse({
    status: 500,
    code: "INTERNAL_ERROR",
    message,
    correlationId,
  });
}

/**
 * Sanitizes object for safe logging. Strips passwords, raw authorization tokens,
 * full secrets, raw card details, and meeting join links.
 */
export function sanitizeForLogging(obj: unknown): unknown {
  if (!obj || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeForLogging(item));
  }

  const SENSITIVE_KEYS = new RegExp(
    "^(password|secret|token|authorization|key|join_url|session_link|card|pan|cvv|hmac)",
    "i"
  );

  const clean: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    if (SENSITIVE_KEYS.test(k)) {
      clean[k] = "[REDACTED]";
    } else if (typeof v === "object" && v !== null) {
      clean[k] = sanitizeForLogging(v);
    } else {
      clean[k] = v;
    }
  }
  return clean;
}

/**
 * Guards routes requiring an authenticated user with a verified email.
 */
export async function authenticateAndRequireVerifiedUser(
  supabase: SupabaseClient<Database>,
  correlationId?: string
): Promise<
  | { success: true; user: { id: string; email: string; fullName: string | null } }
  | { success: false; response: NextResponse }
> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user || !user.email) {
    return { success: false, response: unauthorizedError("Sign in to continue", correlationId) };
  }

  const isVerified = Boolean(
    user.email_confirmed_at ||
      user.confirmed_at ||
      user.user_metadata?.email_verified
  );

  if (!isVerified) {
    return {
      success: false,
      response: emailVerificationRequiredError(
        "Please verify your email address before booking or purchasing sessions",
        correlationId
      ),
    };
  }

  const fullName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : null;

  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      fullName,
    },
  };
}
