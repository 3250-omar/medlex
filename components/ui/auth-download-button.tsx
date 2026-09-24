"use client";

import React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useCurrentUser } from "@/app/[locale]/(marketing)/_apiCalls/academyQueries";
import { cn } from "@/lib/utils";

export interface AuthDownloadButtonProps {
  /** The path to the file in /gifts/ or public folder */
  fileUrl: string;
  /** Custom download filename. Defaults to the basename of fileUrl */
  fileName?: string;
  /** Name of the resource in en and ar (e.g. { en: "Prospectus", ar: "دليل البرامج" }) */
  resourceName?: {
    en: string;
    ar: string;
  };
  /** Explicit override for login button label */
  loginLabel?: string;
  /** Explicit override for download button label */
  downloadLabel?: string;
  /** Optional icon */
  icon?: React.ReactNode;
  /** Custom class name */
  className?: string;
  /** Custom inline style */
  style?: React.CSSProperties;
  /** Fallback children if custom content is desired */
  children?: React.ReactNode;
}

export function AuthDownloadButton({
  fileUrl,
  fileName,
  resourceName,
  loginLabel,
  downloadLabel,
  icon,
  className,
  style,
  children,
}: AuthDownloadButtonProps) {
  const { data: user } = useCurrentUser();
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("common");

  const resolvedFileName =
    fileName || decodeURIComponent(fileUrl.split("/").pop() || "download.pdf");

  const defaultLoginText = resourceName
    ? t("loginToDownloadResource", {
        name: locale === "ar" ? resourceName.ar : resourceName.en,
      })
    : t("loginToDownload");

  const defaultDownloadText = resourceName
    ? t("downloadResource", {
        name: locale === "ar" ? resourceName.ar : resourceName.en,
      })
    : t("download");

  const redirectPath = pathname || `/${locale}`;
  const authUrl = `/${locale}/auth?tab=sign-in&redirect=${encodeURIComponent(redirectPath)}`;

  if (!user) {
    return (
      <Link href={authUrl} className={cn(className)} style={style}>
        {children || (
          <>
            {icon}
            <span>{loginLabel || defaultLoginText}</span>
          </>
        )}
      </Link>
    );
  }

  return (
    <a
      href={fileUrl}
      download={resolvedFileName}
      className={cn(className)}
      style={style}
    >
      {children || (
        <>
          {icon}
          <span>{downloadLabel || defaultDownloadText}</span>
        </>
      )}
    </a>
  );
}

export default AuthDownloadButton;
