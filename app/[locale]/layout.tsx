import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Providers from "@/app/providers";
import LocaleDocument from "@/components/i18n/LocaleDocument";
import { NextIntlClientProvider } from "next-intl";

const SUPPORTED_LOCALES = ["en", "ar"] as const;

type Locale = (typeof SUPPORTED_LOCALES)[number];

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!SUPPORTED_LOCALES.includes(locale as Locale)) notFound();
  const messages = (await import(`../../lib/i18n/translations/${locale}.json`)).default;

  return (
    <>
      <LocaleDocument locale={locale as Locale} />
      <NextIntlClientProvider locale={locale} messages={messages}>
      <Providers>
        <div lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className="flex min-h-screen flex-col">
          <Header locale={locale} />
          <main id="main-content" className="flex flex-1 flex-col">{children}</main>
          <Footer locale={locale} />
        </div>
      </Providers>
      </NextIntlClientProvider>
    </>
  );
}