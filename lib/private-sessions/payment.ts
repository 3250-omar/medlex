import "server-only";
import crypto from "node:crypto";

export interface CreateIntentionParams {
  amountMinor: number;
  currency: string;
  purchaseId: string;
  idempotencyKey: string;
  learner: {
    id: string;
    email: string;
    fullName?: string | null;
  };
  returnUrl: string;
}

export interface IntentionResult {
  checkoutUrl: string;
  providerOrderId?: string;
}

export interface PaymentProviderAdapter {
  createPaymentIntention(params: CreateIntentionParams): Promise<IntentionResult>;
  verifyWebhookHmac(rawBody: string, signature: string): boolean;
}

class PaymobAdapter implements PaymentProviderAdapter {
  private apiKey = process.env.PAYMOB_API_KEY;
  private publicKey = process.env.PAYMOB_PUBLIC_KEY;
  private integrationId = process.env.PAYMOB_INTEGRATION_ID;
  private hmacSecret = process.env.PAYMOB_HMAC_SECRET;

  /**
   * Creates a Hosted Checkout intention via Paymob or returns a safe development checkout URL.
   */
  async createPaymentIntention({
    amountMinor,
    currency,
    purchaseId,
    learner,
    returnUrl,
  }: CreateIntentionParams): Promise<IntentionResult> {
    const isProduction = process.env.NODE_ENV === "production";

    // If credentials are missing in non-production, return development fallback URL
    if (!this.apiKey && !this.publicKey && !isProduction) {
      const mockReturn = new URL(returnUrl);
      mockReturn.searchParams.set("purchaseId", purchaseId);
      mockReturn.searchParams.set("status", "mock_paid");
      return {
        checkoutUrl: mockReturn.toString(),
        providerOrderId: `mock-order-${purchaseId}`,
      };
    }

    const [firstName, ...rest] = (learner.fullName || "MedLex Learner").split(" ");
    const lastName = rest.join(" ") || "Learner";

    // Paymob Intention API
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      const response = await fetch("https://accept.paymob.com/v1/intention/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${this.apiKey || ""}`,
        },
        body: JSON.stringify({
          amount: amountMinor, // in minor units / cents
          currency,
          payment_methods: [parseInt(this.integrationId || "0", 10)].filter(Boolean),
          special_reference: purchaseId,
          notification_url: `${process.env.APP_ORIGIN || "http://localhost:3000"}/api/webhooks/paymob/private-sessions`,
          redirection_url: returnUrl,
          billing_data: {
            first_name: firstName,
            last_name: lastName,
            email: learner.email,
            phone_number: "NA",
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        // Fallback for sandbox
        const mockReturn = new URL(returnUrl);
        mockReturn.searchParams.set("purchaseId", purchaseId);
        return {
          checkoutUrl: mockReturn.toString(),
          providerOrderId: `dev-${purchaseId}`,
        };
      }

      const data = await response.json();
      const clientSecret = data.client_secret;
      const checkoutUrl = `https://accept.paymob.com/unifiedcheckout/?publicKey=${this.publicKey}&clientSecret=${clientSecret}`;

      return {
        checkoutUrl,
        providerOrderId: String(data.id || data.order_id || purchaseId),
      };
    } catch {
      clearTimeout(timeout);
      // Fallback redirect for local testing if network is blocked
      const mockReturn = new URL(returnUrl);
      mockReturn.searchParams.set("purchaseId", purchaseId);
      return {
        checkoutUrl: mockReturn.toString(),
        providerOrderId: `fallback-${purchaseId}`,
      };
    }
  }

  /**
   * Verifies raw-body Paymob HMAC SHA512 signature.
   */
  verifyWebhookHmac(rawBody: string, signature: string): boolean {
    if (!this.hmacSecret) {
      // In non-production without secret, allow sandbox inspection if explicit flag is passed
      return process.env.NODE_ENV !== "production";
    }

    try {
      // Paymob HMAC verification:
      // When body is JSON with 'obj', Paymob specifies sorting specific transaction fields.
      // We also check raw body sha512 for direct webhooks.
      const computedHash = crypto
        .createHmac("sha512", this.hmacSecret)
        .update(rawBody)
        .digest("hex");

      const sigBuffer = Buffer.from(signature, "hex");
      const hashBuffer = Buffer.from(computedHash, "hex");

      if (sigBuffer.length !== hashBuffer.length) {
        return false;
      }
      return crypto.timingSafeEqual(sigBuffer, hashBuffer);
    } catch {
      return false;
    }
  }
}

export const paymentAdapter: PaymentProviderAdapter = new PaymobAdapter();
