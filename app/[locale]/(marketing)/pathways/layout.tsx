import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "en" | "ar" }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    locale,
    path: "/pathways",
    title: "Learning Pathways",
    description:
      "Explore MedLex learning pathways for clinicians, legal professionals, and institutions working where mental health meets the law.",
  });
}

export default function PathwaysLayout({ children }: { children: ReactNode }) {
  return children;
}
