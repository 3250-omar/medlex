import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CASC_PRIVATE_ROBOTS } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  robots: CASC_PRIVATE_ROBOTS,
};

export default function AcademyLayout({ children }: { children: ReactNode }) {
  return children;
}
