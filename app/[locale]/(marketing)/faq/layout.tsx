import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: "en" | "ar" }> }): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({ locale, path: "/faq", title: "Frequently Asked Questions", description: "Answers to common questions about MedLex courses, professional learning pathways, and enrolment." });
}

export default function FaqLayout({ children }: { children: ReactNode }) { return children; }
