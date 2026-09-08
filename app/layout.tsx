import type { Metadata } from "next";
import { sourceSerif4, inter } from "@/lib/fonts";
import "./globals.css";
import { cn } from "@/lib/utils";
import { siteUrl } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: {
    template: "%s | MedLex",
    default: "MedLex — Forensic & Medicolegal Psychiatry Education",
  },
  description:
    "MedLex trains psychiatrists to produce evaluations that survive cross-examination and gives courts, prosecutors, and ministries psychiatric evidence built to a documented standard.",
  metadataBase: siteUrl,
  applicationName: "MedLex",
  category: "Education",
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn("dark", sourceSerif4.variable, inter.variable, "font-sans")}
      data-theme="dark"
      data-scroll-behavior="smooth"
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-paper text-text antialiased">
        {children}
      </body>
    </html>
  );
}
