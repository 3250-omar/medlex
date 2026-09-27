"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function ShareButtons({
  isRtl,
}: {
  title: string;
  isRtl: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-deep/60 text-xs font-medium text-mute hover:text-gold hover:border-gold/30 hover:bg-deep transition-all duration-200 cursor-pointer shadow-xs"
        title={isRtl ? "نسخ الرابط" : "Copy Link"}
      >
        {copied ? (
          <>
            <Check className="size-3.5 text-emerald-400" />
            <span className="text-emerald-400 font-semibold">
              {isRtl ? "تم نسخ الرابط" : "Link Copied"}
            </span>
          </>
        ) : (
          <>
            <Copy className="size-3.5 text-gold/80" />
            <span>{isRtl ? "مشاركة المقال" : "Share"}</span>
          </>
        )}
      </button>
    </div>
  );
}
