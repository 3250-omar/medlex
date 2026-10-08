import "server-only";

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

class PaddlePaymentAdapter implements PaymentProviderAdapter {
  /**
   * Transaction creation is implemented in Phase 3. Keep this adapter
   * fail-closed so no caller can accidentally treat a local redirect as a
   * successful Paddle checkout.
   */
  async createPaymentIntention(): Promise<IntentionResult> {
    throw new Error("Paddle transaction creation is not implemented yet");
  }

  /**
   * Webhook verification is implemented in Phase 5. Never accept a webhook
   * until Paddle's signature has been verified against the raw request body.
   */
  verifyWebhookHmac(): boolean {
    return false;
  }
}

export const paymentAdapter: PaymentProviderAdapter = new PaddlePaymentAdapter();
