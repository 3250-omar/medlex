import { getRequestConfig } from "next-intl/server";

const supportedLocales = ["en", "ar"] as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = supportedLocales.includes(
    requested as (typeof supportedLocales)[number],
  )
    ? (requested as (typeof supportedLocales)[number])
    : "en";
  const messages = (await import(`../lib/i18n/translations/${locale}.json`))
    .default;

  return { locale, messages };
});
