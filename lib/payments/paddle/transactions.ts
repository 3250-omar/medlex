import "server-only";

import { getPaddleClient } from "@/lib/payments/paddle/server";
import {
  buildPrivateSessionTransactionRequest,
  type ResolvedPrivateSessionPrice,
} from "@/lib/private-sessions/pricing";

export async function createPrivateSessionPaddleTransaction({
  price,
  paymentAttemptId,
}: {
  price: ResolvedPrivateSessionPrice;
  paymentAttemptId: string;
}): Promise<{ transactionId: string; checkoutUrl: string }> {
  const transaction = await getPaddleClient().transactions.create(
    buildPrivateSessionTransactionRequest({ price, paymentAttemptId }),
  );

  if (!transaction.checkout?.url) {
    throw new Error("Paddle did not return a checkout URL for this transaction");
  }

  return {
    transactionId: transaction.id,
    checkoutUrl: transaction.checkout.url,
  };
}

export async function getPaddleCheckoutUrl(
  transactionId: string,
): Promise<string> {
  const transaction = await getPaddleClient().transactions.get(transactionId);
  if (!transaction.checkout?.url) {
    throw new Error("Paddle checkout URL is unavailable for this transaction");
  }
  return transaction.checkout.url;
}