import "server-only";

import type { CurrencyCode } from "@paddle/paddle-node-sdk";

const paddleCurrencies = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "AUD",
  "CAD",
  "CHF",
  "CLP",
  "HKD",
  "SGD",
  "SEK",
  "ARS",
  "BRL",
  "CNY",
  "COP",
  "CZK",
  "DKK",
  "HUF",
  "ILS",
  "INR",
  "KRW",
  "MXN",
  "NOK",
  "NZD",
  "PEN",
  "PLN",
  "RUB",
  "THB",
  "TRY",
  "TWD",
  "UAH",
  "VND",
  "ZAR",
] as const satisfies readonly CurrencyCode[];

const paddleCurrencySet = new Set<string>(paddleCurrencies);

export function toPaddleCurrency(currency: string): CurrencyCode {
  const normalized = currency.trim().toUpperCase();
  if (!paddleCurrencySet.has(normalized)) {
    throw new Error(`Paddle does not support ${normalized || "this"} currency`);
  }
  return normalized as CurrencyCode;
}

export function isPaddleCurrency(currency: string): boolean {
  return paddleCurrencySet.has(currency.trim().toUpperCase());
}