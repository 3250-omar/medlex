import "server-only";

import { Environment, Paddle } from "@paddle/paddle-node-sdk";
import { getPaddleApiConfig } from "../config";

let paddleClient: Paddle | null = null;
let paddleClientEnvironment: Environment | null = null;

export function getPaddleClient(): Paddle {
  const config = getPaddleApiConfig();
  const environment =
    config.environment === "production"
      ? Environment.production
      : Environment.sandbox;

  if (!paddleClient || paddleClientEnvironment !== environment) {
    paddleClient = new Paddle(config.apiKey, { environment });
    paddleClientEnvironment = environment;
  }

  return paddleClient;
}
