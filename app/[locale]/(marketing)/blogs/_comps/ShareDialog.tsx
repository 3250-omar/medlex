"use client";

import React, {
  useState,
  useSyncExternalStore,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Share2, Copy, Check, Mail, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { incrementBlogShares } from "../_actions/blog-actions";

const emptySubscribe = () => () => {};

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  blogId?: string;
  url?: string;
  isRtl?: boolean;
  onShareTracked?: (newCount: number) => void;
}

export function ShareDialog({
  open,
  onOpenChange,
  title,
  blogId,
  url,
  isRtl = false,
  onShareTracked,
}: ShareDialogProps) {
  const [copied, setCopied] = useState(false);

  const currentUrl = useSyncExternalStore(
    emptySubscribe,
    () => url || (typeof window !== "undefined" ? window.location.href : ""),
    () => url || "",
  );

  const canNativeShare = useSyncExternalStore(
    emptySubscribe,
    () =>
      typeof navigator !== "undefined" && typeof navigator.share === "function",
    () => false,
  );

  const hasTrackedShareRef = useRef(false);

  useEffect(() => {
    if (!open) {
      hasTrackedShareRef.current = false;
    }
  }, [open]);

  const trackShare = useCallback(async () => {
    if (!blogId || hasTrackedShareRef.current) return;
    hasTrackedShareRef.current = true;
    try {
      const res = await incrementBlogShares(blogId);
      if (res && res.success && typeof res.count === "number") {
        onShareTracked?.(res.count);
      }
    } catch (err) {
      console.error("Error recording share:", err);
    }
  }, [blogId, onShareTracked]);

  const handleCopy = useCallback(async () => {
    if (!currentUrl) return;
    trackShare();
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      // Fallback
      const input = document.createElement("input");
      input.value = currentUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  }, [currentUrl, trackShare]);

  const handleNativeShare = useCallback(async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      trackShare();
      try {
        await navigator.share({
          title,
          url: currentUrl,
        });
      } catch {
        // User dismissed native share sheet
      }
    }
  }, [title, currentUrl, trackShare]);

  const sharePlatforms = useMemo(
    () => [
      {
        id: "whatsapp",
        name: isRtl ? "واتساب" : "WhatsApp",
        accent: "group-hover:border-[#25D366]/50 group-hover:bg-[#25D366]/10",
        iconColor: "text-[#25D366]",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-5 shrink-0"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        ),
        url: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + "\n\n" + currentUrl)}`,
      },
      {
        id: "linkedin",
        name: isRtl ? "لينكد إن" : "LinkedIn",
        accent: "group-hover:border-[#0A66C2]/50 group-hover:bg-[#0A66C2]/10",
        iconColor: "text-[#0A66C2]",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-5 shrink-0"
          >
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        ),
        url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
      },
      {
        id: "twitter",
        name: "X (Twitter)",
        accent: "group-hover:border-white/40 group-hover:bg-white/10",
        iconColor: "text-white",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-4.5 shrink-0"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        ),
        url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`,
      },
      {
        id: "facebook",
        name: isRtl ? "فيسبوك" : "Facebook",
        accent: "group-hover:border-[#1877F2]/50 group-hover:bg-[#1877F2]/10",
        iconColor: "text-[#1877F2]",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-5 shrink-0"
          >
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        ),
        url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
      },
      {
        id: "telegram",
        name: isRtl ? "تيليجرام" : "Telegram",
        accent: "group-hover:border-[#24A1DE]/50 group-hover:bg-[#24A1DE]/10",
        iconColor: "text-[#24A1DE]",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-5 shrink-0"
          >
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.536-.196 1.006.128.832.943z" />
          </svg>
        ),
        url: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`,
      },
      {
        id: "email",
        name: isRtl ? "البريد الإلكتروني" : "Email",
        accent: "group-hover:border-[#d6b03f]/50 group-hover:bg-[#d6b03f]/10",
        iconColor: "text-[#e8cd7a]",
        icon: <Mail className="size-5 shrink-0" />,
        url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(title + "\n\n" + currentUrl)}`,
      },
    ],
    [isRtl, title, currentUrl],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent
        initialFocus={false}
        finalFocus={false}
        className="fixed! top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 border border-[#d6b03f]/30 bg-gradient-to-b from-[#142642] via-[#0e1d35] to-[#081324] text-[#f3efe4] backdrop-blur-2xl sm:max-w-lg rounded-[24px] p-6 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_50px_rgba(214,176,63,0.12)] overflow-hidden"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Soft radial golden aura */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 inset-x-0 mx-auto size-64 bg-[#d6b03f]/12 blur-3xl rounded-full"
        />

        {/* Dialog Header */}
        <DialogHeader className="relative z-10 text-start space-y-3 pb-2">
          <div className="flex items-center gap-3.5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#d6b03f]/15 text-[#e8cd7a] border border-[#d6b03f]/35 shadow-[0_0_20px_rgba(214,176,63,0.15)]">
              <Share2 className="size-5" />
            </div>
            <div>
              <DialogTitle className="font-serif text-2xl sm:text-[26px] font-medium text-[#f3efe4] tracking-tight leading-snug">
                {isRtl ? "مشاركة المقال" : "Share Article"}
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-[#a9b6cb] mt-0.5 font-sans leading-relaxed">
                {isRtl
                  ? "شارك هذه المعرفة الطبية القانونية مع زملائك وشبكتك المهنية"
                  : "Share this medicolegal insight with your professional network"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="relative z-10 mt-4 space-y-5">
          {/* Social Platforms Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {sharePlatforms.map((platform) => (
              <a
                key={platform.id}
                href={platform.url}
                target={platform.id === "email" ? undefined : "_blank"}
                rel={
                  platform.id === "email" ? undefined : "noopener noreferrer"
                }
                onClick={trackShare}
                className={cn(
                  "group relative flex flex-col items-center justify-center text-center p-3.5 rounded-xl border border-white/10 bg-[#17305a]/45 hover:bg-[#17305a]/80 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] select-none no-underline",
                  platform.accent,
                )}
                title={platform.name}
              >
                <div
                  className={cn(
                    "transition-transform duration-200 group-hover:scale-110 mb-2",
                    platform.iconColor,
                  )}
                >
                  {platform.icon}
                </div>
                <span className="font-sans text-xs sm:text-[13px] font-medium text-[#f3efe4] group-hover:text-white transition-colors">
                  {platform.name}
                </span>
              </a>
            ))}
          </div>

          {/* Native System Share (Mobile / Supported Devices) */}
          {canNativeShare && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#d6b03f]/25 bg-[#17305a]/60 hover:bg-[#17305a] text-xs sm:text-sm font-medium text-[#c9d3e3] hover:text-[#f3efe4] transition-all cursor-pointer shadow-sm"
            >
              <Smartphone className="size-4 text-[#e8cd7a]" />
              <span>
                {isRtl
                  ? "مشاركة عبر تطبيقات الهاتف الأخرى..."
                  : "More device sharing options..."}
              </span>
            </button>
          )}

          {/* Direct Copy Link Field */}
          <div className="space-y-2 pt-3 border-t border-[#d6b03f]/20">
            <div className="flex items-center justify-between text-xs text-[#a9b6cb] font-sans">
              <span>
                {isRtl ? "رابط المقال المباشر:" : "Direct article link:"}
              </span>
              {copied && (
                <span className="text-emerald-400 font-semibold inline-flex items-center gap-1.5 animate-in fade-in duration-200">
                  <Check className="size-3.5" />
                  {isRtl ? "تم النسخ بنجاح!" : "Copied to clipboard!"}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#081324] border border-[#d6b03f]/30 focus-within:border-[#d6b03f] focus-within:ring-2 focus-within:ring-[#d6b03f]/20 transition-all">
              <input
                type="text"
                readOnly
                value={currentUrl}
                aria-label={isRtl ? "رابط المقال" : "Article Link"}
                className="w-full bg-transparent px-3 text-xs sm:text-sm font-mono text-[#c9d3e3] outline-none select-all truncate"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <button
                type="button"
                onClick={handleCopy}
                className={cn(
                  "inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 cursor-pointer shadow-sm",
                  copied
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : "bg-[#d6b03f] hover:bg-[#e8cd7a] text-[#0b1a30] active:scale-95",
                )}
              >
                {copied ? (
                  <>
                    <Check className="size-3.5" />
                    <span>{isRtl ? "تم النسخ" : "Copied"}</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    <span>{isRtl ? "نسخ" : "Copy"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
