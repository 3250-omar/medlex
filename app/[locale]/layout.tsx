import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Providers from "@/app/providers";
import { sourceSerif4, inter, fraunces, cairo } from "@/lib/fonts";
import "@/app/globals.css";
import { cn } from "@/lib/utils";
import { siteUrl } from "@/lib/seo/metadata";

const SUPPORTED_LOCALES = ["en", "ar"] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export const metadata: Metadata = {
  title: {
    template: "%s | MedLex",
    default: "MedLex | Forensic Psychiatry Education & CASC Training",
  },
  description:
    "MedLex trains psychiatrists to produce evaluations that survive cross-examination and provides courts, legal counsel, and ministries psychiatric evidence built to a documented standard.",
  metadataBase: siteUrl,
  applicationName: "MedLex",
  category: "Education",
  icons: {
    icon: "/favicon.ico",
    apple: "/images/new-emblem.png",
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
      : undefined,
  },
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  if (!SUPPORTED_LOCALES.includes(locale as Locale)) notFound();

  const messages = (await import(`../../lib/i18n/translations/${locale}.json`))
    .default;

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={cn(
        "dark",
        sourceSerif4.variable,
        fraunces.variable,
        inter.variable,
        cairo.variable,
        "font-sans",
      )}
      data-theme="dark"
      data-scroll-behavior="smooth"
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-paper text-text antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main id="main-content" className="flex flex-1 flex-col">
                {children}
              </main>
              <Footer locale={locale} />
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
