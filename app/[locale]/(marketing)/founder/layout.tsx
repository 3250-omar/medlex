import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: "en" | "ar" }> }): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({ locale, path: "/founder", title: "Dr Ahmed Abouelghit | Founder", description: "Meet the forensic psychiatrist behind MedLex and its evidence-led approach to medicolegal psychiatry education." });
}

export default function FounderLayout({ children }: { children: ReactNode }) { return children; }
