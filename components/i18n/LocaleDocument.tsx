"use client";

import { useEffect } from "react";
import type { Locale } from "@/lib/i18n/dictionaries";

export default function LocaleDocument({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  return null;
}
