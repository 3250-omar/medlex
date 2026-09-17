import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createLocalizedMetadata, type Locale } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createLocalizedMetadata(locale as Locale, "faq");
}

export default function FaqLayout({ children }: { children: ReactNode }) {
  return children;
}
