import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CASC_PRIVATE_ROBOTS } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const isCasc = slug === "casc-academy";
  return {
    title: isCasc
      ? "Certificate | CASC Academy | MedLex"
      : "Certificate | MedLex",
    robots: CASC_PRIVATE_ROBOTS,
  };
}

export default function CourseCertificateLayout({
  children,
}: {
  children: ReactNode;
  params: Promise<{ locale: string; slug: string }>;
}) {
  return children;
}
