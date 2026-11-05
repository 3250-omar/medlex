"use client";

export default function CookieSettingsButton({ locale }: { locale: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("medlex:open-cookie-settings"))}
      className="min-h-11 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      {locale === "ar" ? "إعدادات الكوكيز" : "Cookie settings"}
    </button>
  );
}
