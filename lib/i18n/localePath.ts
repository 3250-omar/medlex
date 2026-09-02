export type SupportedLocale = "en" | "ar";

export function getLocalePath(
  pathname: string,
  targetLocale: SupportedLocale,
): string {
  const pathWithoutLocale = pathname.replace(/^\/(?:en|ar)(?=\/|$)/, "");
  return `/${targetLocale}${pathWithoutLocale}`;
}
