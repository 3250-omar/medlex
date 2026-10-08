import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type {
  CurrencyCode,
  CreateTransactionRequestBody,
} from "@paddle/paddle-node-sdk";
import { getPaddlePrivateSessionProductId } from "@/lib/payments/config";
import { toPaddleCurrency } from "@/lib/payments/paddle/currencies";

type CheckoutMode = "direct" | "package";

export type ResolvedPrivateSessionPrice = {
  courseId: string;
  courseSlug: string;
  offerId: string;
  offerCode: "direct" | "package_5" | "package_10";
  offerKind: CheckoutMode;
  sessionCount: 1 | 5 | 10;
  titleEn: string;
  titleAr: string;
  amountMinor: number;
  currency: CurrencyCode;
  countryCode: string;
};

export class PrivateSessionPricingError extends Error {
  constructor(
    readonly code:
      | "COURSE_NOT_FOUND"
      | "OFFER_NOT_FOUND"
      | "OFFER_MODE_MISMATCH"
      | "INVALID_PRICE"
      | "UNSUPPORTED_CURRENCY"
      | "PRICE_LOOKUP_FAILED",
    message: string,
  ) {
    super(message);
    this.name = "PrivateSessionPricingError";
  }
}

function normalizeCountryCode(countryCode: string): string {
  const normalized = countryCode.trim().toUpperCase();
  return /^[A-Z]{2}$/.test(normalized) ? normalized : "EG";
}

function validateOfferForMode(
  offer: Database["public"]["Tables"]["private_session_offers"]["Row"],
  mode: CheckoutMode,
): void {
  const isValidDirect =
    mode === "direct" && offer.kind === "direct" && offer.session_count === 1;
  const isValidPackage =
    mode === "package" &&
    offer.kind === "package" &&
    (offer.session_count === 5 || offer.session_count === 10);

  if (!isValidDirect && !isValidPackage) {
    throw new PrivateSessionPricingError(
      "OFFER_MODE_MISMATCH",
      "The selected offer is not valid for this checkout mode",
    );
  }
}

export async function resolvePrivateSessionPrice({
  supabase,
  courseSlug,
  offerId,
  mode,
  countryCode,
}: {
  supabase: SupabaseClient<Database>;
  courseSlug: string;
  offerId: string;
  mode: CheckoutMode;
  countryCode: string;
}): Promise<ResolvedPrivateSessionPrice> {
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id, slug")
    .eq("slug", courseSlug)
    .maybeSingle();

  if (courseError) {
    throw new PrivateSessionPricingError(
      "PRICE_LOOKUP_FAILED",
      "Could not load the course for pricing",
    );
  }
  if (!course) {
    throw new PrivateSessionPricingError("COURSE_NOT_FOUND", "Course not found");
  }

  const { data: offer, error: offerError } = await supabase
    .from("private_session_offers")
    .select(
      "id, course_id, code, kind, session_count, price_minor, currency, title_en, title_ar, is_active, created_by, updated_by, created_at, updated_at",
    )
    .eq("id", offerId)
    .eq("course_id", course.id)
    .eq("is_active", true)
    .maybeSingle();

  if (offerError) {
    throw new PrivateSessionPricingError(
      "PRICE_LOOKUP_FAILED",
      "Could not load the selected offer",
    );
  }
  if (!offer) {
    throw new PrivateSessionPricingError(
      "OFFER_NOT_FOUND",
      "The selected offer is unavailable",
    );
  }

  validateOfferForMode(offer, mode);

  const normalizedCountryCode = normalizeCountryCode(countryCode);
  const { data: exactPrice, error: exactPriceError } = await supabase
    .from("offer_country_prices")
    .select("price_minor, currency")
    .eq("offer_id", offer.id)
    .eq("country_code", normalizedCountryCode)
    .eq("is_active", true)
    .maybeSingle();

  if (exactPriceError) {
    throw new PrivateSessionPricingError(
      "PRICE_LOOKUP_FAILED",
      "Could not load country-specific pricing",
    );
  }

  let resolvedPrice = exactPrice;
  if (!resolvedPrice) {
    const { data: fallbackPrice, error: fallbackPriceError } = await supabase
      .from("offer_country_prices")
      .select("price_minor, currency")
      .eq("offer_id", offer.id)
      .eq("country_code", "__OTHER__")
      .eq("is_active", true)
      .maybeSingle();

    if (fallbackPriceError) {
      throw new PrivateSessionPricingError(
        "PRICE_LOOKUP_FAILED",
        "Could not load fallback pricing",
      );
    }
    resolvedPrice = fallbackPrice;
  }

  const amountMinor = resolvedPrice?.price_minor ?? offer.price_minor;
  const rawCurrency = resolvedPrice?.currency ?? offer.currency;

  if (!Number.isSafeInteger(amountMinor) || amountMinor <= 0) {
    throw new PrivateSessionPricingError(
      "INVALID_PRICE",
      "A paid checkout requires a positive whole-minor-unit amount",
    );
  }

  let currency: CurrencyCode;
  try {
    currency = toPaddleCurrency(rawCurrency);
  } catch {
    throw new PrivateSessionPricingError(
      "UNSUPPORTED_CURRENCY",
      `Paddle does not support the configured ${rawCurrency} currency`,
    );
  }

  return {
    courseId: course.id,
    courseSlug: course.slug,
    offerId: offer.id,
    offerCode: offer.code,
    offerKind: offer.kind,
    sessionCount: offer.session_count,
    titleEn: offer.title_en,
    titleAr: offer.title_ar,
    amountMinor,
    currency,
    countryCode: normalizedCountryCode,
  };
}

export function buildPrivateSessionTransactionRequest({
  price,
  paymentAttemptId,
}: {
  price: ResolvedPrivateSessionPrice;
  paymentAttemptId: string;
}): CreateTransactionRequestBody {
  const productId = getPaddlePrivateSessionProductId();

  return {
    currencyCode: price.currency,
    customData: {
      source: "medlex_private_sessions",
      payment_attempt_id: paymentAttemptId,
      course_id: price.courseId,
      offer_id: price.offerId,
      offer_code: price.offerCode,
      country_code: price.countryCode,
    },
    items: [
      {
        quantity: 1,
        price: {
          productId,
          name: price.titleEn,
          description: `Medlex private session offer: ${price.offerCode}`,
          unitPrice: {
            amount: String(price.amountMinor),
            currencyCode: price.currency,
          },
          quantity: {
            minimum: 1,
            maximum: 1,
          },
        },
      },
    ],
  };
}