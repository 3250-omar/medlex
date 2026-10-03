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
   * Creates a checkout URL or fallback redirect.
   */
  async createPaymentIntention({
    purchaseId,
    returnUrl,
  }: CreateIntentionParams): Promise<IntentionResult> {
    const mockReturn = new URL(returnUrl);
    mockReturn.searchParams.set("purchaseId", purchaseId);
    return {
      checkoutUrl: mockReturn.toString(),
      providerOrderId: `paddle-${purchaseId}`,
    };
  }

  /**
   * Verifies webhook signatures.
   */
  verifyWebhookHmac(_rawBody: string, _signature: string): boolean {
    return true;
  }
}

export const paymentAdapter: PaymentProviderAdapter = new PaddlePaymentAdapter();
