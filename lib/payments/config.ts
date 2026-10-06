import "server-only";

export type PaddleEnvironment = "sandbox" | "production";

export type PaddleServerConfig = {
  apiKey: string;
  clientToken: string;
  environment: PaddleEnvironment;
  webhookSecret: string;
};

export type PaddlePublicConfig = Pick<
  PaddleServerConfig,
  "clientToken" | "environment"
>;

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

export function getPaddleEnvironment(): PaddleEnvironment {
  const value = process.env.NEXT_PUBLIC_PADDLE_ENV?.trim().toLowerCase();
  if (value !== "sandbox" && value !== "production") {
    throw new Error(
      "NEXT_PUBLIC_PADDLE_ENV must be either sandbox or production",
    );
  }
  return value;
}

export function getPaddleServerConfig(): PaddleServerConfig {
  return {
    apiKey: required("PADDLE_API_KEY"),
    clientToken: required("NEXT_PUBLIC_PADDLE_CLIENT_TOKEN"),
    environment: getPaddleEnvironment(),
    webhookSecret: required("PADDLE_WEBHOOK_SECRET"),
  };
}

export function getPaddleApiConfig(): Pick<
  PaddleServerConfig,
  "apiKey" | "environment"
> {
  return {
    apiKey: required("PADDLE_API_KEY"),
    environment: getPaddleEnvironment(),
  };
}

export function getPaddlePrivateSessionProductId(): string {
  const productId = required("PADDLE_PRIVATE_SESSION_PRODUCT_ID");
  if (!/^pro_[a-z\d]{26}$/.test(productId)) {
    throw new Error("PADDLE_PRIVATE_SESSION_PRODUCT_ID must be a Paddle product ID");
  }
  return productId;
}

export function getPaddlePublicConfig(): PaddlePublicConfig {
  return {
    clientToken: required("NEXT_PUBLIC_PADDLE_CLIENT_TOKEN"),
    environment: getPaddleEnvironment(),
  };
}

export function getPaddleWebhookSecret(): string {
  return required("PADDLE_WEBHOOK_SECRET");
}

export function isPaddlePaymentsEnabled(): boolean {
  return process.env.PADDLE_PAYMENTS_ENABLED?.trim().toLowerCase() === "true";
}