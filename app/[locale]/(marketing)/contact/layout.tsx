import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: "en" | "ar" }> }): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({ locale, path: "/contact", title: "Contact MedLex", description: "Contact MedLex about forensic and medicolegal psychiatry education, training, and institutional services." });
}

export default function ContactLayout({ children }: { children: ReactNode }) { return children; }
