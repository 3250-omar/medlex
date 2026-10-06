"use client";

import type { Paddle, PaddleEventData } from "@paddle/paddle-js";

type PaddleCheckoutEventHandler = (event: PaddleEventData) => void;

let paddlePromise: Promise<Paddle | undefined> | null = null;
let activeEventHandler: PaddleCheckoutEventHandler | null = null;

function getPaddleClientConfig(): {
  token: string;
  environment: "sandbox" | "production";
} {
  const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN?.trim();
  const environment = process.env.NEXT_PUBLIC_PADDLE_ENV?.trim().toLowerCase();

  if (!token) {
    throw new Error("Paddle client token is not configured");
  }
  if (environment !== "sandbox" && environment !== "production") {
    throw new Error("Paddle environment is not configured");
  }

  return { token, environment };
}

async function getPaddle(): Promise<Paddle> {
  if (!paddlePromise) {
    const { initializePaddle } = await import("@paddle/paddle-js");
    const config = getPaddleClientConfig();

    paddlePromise = initializePaddle({
      token: config.token,
      environment: config.environment,
      eventCallback: (event) => activeEventHandler?.(event),
    });
  }

  const paddle = await paddlePromise;
  if (!paddle) {
    paddlePromise = null;
    throw new Error("Paddle Checkout could not be initialized");
  }

  return paddle;
}

export async function openPaddleCheckout({
  transactionId,
  locale,
  onEvent,
}: {
  transactionId: string;
  locale: "en" | "ar";
  onEvent: PaddleCheckoutEventHandler;
}): Promise<void> {
  activeEventHandler = onEvent;
  const paddle = await getPaddle();

  paddle.Checkout.open({
    transactionId,
    settings: {
      displayMode: "overlay",
      theme: "light",
      locale,
      variant: "one-page",
    },
  });
}

export function closePaddleCheckout(): void {
  activeEventHandler = null;
  window.Paddle?.Checkout.close();
}