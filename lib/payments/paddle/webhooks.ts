import "server-only";

import { createHash } from "node:crypto";
import { EventName, type EventEntity } from "@paddle/paddle-node-sdk";

export type PrivateSessionPaddleWebhook = {
  eventId: string;
  eventType:
    | typeof EventName.TransactionCompleted
    | typeof EventName.TransactionPaymentFailed
    | typeof EventName.TransactionCanceled;
  transactionId: string;
  paymentAttemptId: string | null;
  isSuccess: boolean;
  failureCode: string | null;
  payloadHash: string;
};

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function stringValue(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function uuidValue(value: unknown): string | null {
  const str = stringValue(value);
  return str && UUID_REGEX.test(str) ? str : null;
}

export function toPrivateSessionPaddleWebhook(
  event: EventEntity,
  rawBody: string,
): PrivateSessionPaddleWebhook | null {
  if (
    event.eventType !== EventName.TransactionCompleted &&
    event.eventType !== EventName.TransactionPaymentFailed &&
    event.eventType !== EventName.TransactionCanceled
  ) {
    return null;
  }

  const transaction = event.data as {
    id?: unknown;
    customData?: unknown;
  };
  const transactionId = stringValue(transaction.id);
  if (!transactionId) {
    throw new Error("Paddle transaction webhook did not include a transaction ID");
  }

  const customData =
    transaction.customData && typeof transaction.customData === "object"
      ? (transaction.customData as Record<string, unknown>)
      : null;

  return {
    eventId: event.eventId,
    eventType: event.eventType,
    transactionId,
    paymentAttemptId: uuidValue(customData?.payment_attempt_id),
    isSuccess: event.eventType === EventName.TransactionCompleted,
    failureCode:
      event.eventType === EventName.TransactionPaymentFailed
        ? "PADDLE_TRANSACTION_PAYMENT_FAILED"
        : event.eventType === EventName.TransactionCanceled
          ? "PADDLE_TRANSACTION_CANCELED"
          : null,
    payloadHash: createHash("sha256").update(rawBody, "utf8").digest("hex"),
  };
}
