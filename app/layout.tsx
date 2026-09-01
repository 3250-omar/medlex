import type { Metadata } from "next";
import { ovo, manrope } from "@/lib/fonts";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: {
    template: "%s | MedLex",
    default: "MedLex — Forensic & Medicolegal Psychiatry Education",
  },
  description:
    "MedLex trains psychiatrists to produce evaluations that survive cross-examination and gives courts, prosecutors, and ministries psychiatric evidence built to a documented standard.",
  metadataBase: new URL("https://medlex.academy"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(ovo.variable, manrope.variable, "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
