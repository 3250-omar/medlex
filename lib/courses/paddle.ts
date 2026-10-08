import "server-only";

import type {
  CreateTransactionRequestBody,
  CurrencyCode,
} from "@paddle/paddle-node-sdk";
import {
  getPaddleCourseProductId,
  getPaddlePrivateSessionProductId,
} from "@/lib/payments/config";
import { getPaddleClient } from "@/lib/payments/paddle/server";

export type CourseCheckoutSnapshot = {
  attemptId: string;
  courseId: string;
  courseSlug: string;
  title: string;
  amountMinor: number;
  currency: CurrencyCode;
  session: { title: string; amountMinor: number } | null;
};

export async function createCoursePaddleTransaction(
  snapshot: CourseCheckoutSnapshot,
): Promise<{ transactionId: string; checkoutUrl: string }> {
  const request: CreateTransactionRequestBody = {
    currencyCode: snapshot.currency,
    customData: {
      source: "medlex_course",
      payment_attempt_id: snapshot.attemptId,
      course_id: snapshot.courseId,
      course_slug: snapshot.courseSlug,
    },
    items: [
      {
        quantity: 1,
        price: {
          productId: getPaddleCourseProductId(),
          name: snapshot.title,
          description: `Medlex course access: ${snapshot.courseSlug}`,
          unitPrice: {
            amount: String(snapshot.amountMinor),
            currencyCode: snapshot.currency,
          },
          quantity: { minimum: 1, maximum: 1 },
        },
      },
      ...(snapshot.session
        ? [{
            quantity: 1,
            price: {
              productId: getPaddlePrivateSessionProductId(),
              name: snapshot.session.title,
              description: `Private coaching bundled with ${snapshot.courseSlug}`,
              unitPrice: {
                amount: String(snapshot.session.amountMinor),
                currencyCode: snapshot.currency,
              },
              quantity: { minimum: 1, maximum: 1 },
            },
          }]
        : []),
    ],
  };

  const transaction = await getPaddleClient().transactions.create(request);
  if (!transaction.checkout?.url) {
    throw new Error("Paddle did not return a checkout URL for this course");
  }

  return { transactionId: transaction.id, checkoutUrl: transaction.checkout.url };
}