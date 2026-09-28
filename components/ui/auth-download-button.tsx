"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import { useCurrentUser } from "@/app/[locale]/(marketing)/_apiCalls/academyQueries";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Download, CheckCircle2, Loader2, Mail } from "lucide-react";

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
  downloadLabel,
  icon,
  className,
  style,
  children,
}: AuthDownloadButtonProps) {
  const { data: user } = useCurrentUser();
  const locale = useLocale();
  const isAr = locale === "ar";

  const resolvedFileName =
    fileName || decodeURIComponent(fileUrl.split("/").pop() || "download.pdf");

  const resourceTitle = resourceName
    ? isAr
      ? resourceName.ar
      : resourceName.en
    : isAr
      ? "الدليل المجاني"
      : "Free Guide";

  const defaultButtonLabel =
    downloadLabel ||
    (isAr ? `تحميل ${resourceTitle}` : `Download ${resourceTitle}`);

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const triggerDownload = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = resolvedFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    if (user) {
      triggerDownload();
      return;
    }
    e.preventDefault();
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      await fetch("/api/gifts/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          email: email.trim(),
          resource: resolvedFileName,
          fileUrl,
        }),
      });

      // Immediate browser download
      triggerDownload();
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        setIsOpen(false);
      }, 3000);
    } catch (err) {
      console.error("Error submitting guide request:", err);
      // Still trigger download on error so user is never blocked
      triggerDownload();
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setIsOpen(false);
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleButtonClick}
        className={cn(className)}
        style={style}
      >
        {children || (
          <>
            {icon || <Download className="size-4 shrink-0" />}
            <span>{defaultButtonLabel}</span>
          </>
        )}
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md bg-[#0e1d38] text-white border border-[#c5a059]/30 p-6 rounded-2xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl sm:text-2xl font-bold text-white text-start">
              {isAr ? "تحميل الدليل المجاني" : "Download Your Free Guide"}
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-300 text-start mt-1">
              {isAr
                ? `أدخل بريدك الإلكتروني وسنقوم بإرسال نسخة إليك وبدء التحميل فوراً.`
                : `Enter your email to receive a copy of ${resourceTitle} and download it immediately.`}
            </DialogDescription>
          </DialogHeader>

          {isSuccess ? (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
              <CheckCircle2 className="size-12 text-[#c5a059] animate-bounce" />
              <p className="font-serif text-lg font-semibold text-white">
                {isAr ? "تم التحميل بنجاح!" : "Download Started!"}
              </p>
              <p className="text-xs text-slate-300 max-w-xs">
                {isAr
                  ? "تم بدء تحميل الملف وتم إرسال نسخة إلى بريدك الإلكتروني أيضاً."
                  : "Your file is downloading now, and a copy has been sent to your email."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 text-start">
                  {isAr ? "الاسم (اختياري)" : "Name (optional)"}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isAr ? "د. أحمد..." : "Dr. John Doe"}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#08121f] border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-[#c5a059] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 text-start">
                  {isAr ? "البريد الإلكتروني *" : "Email address *"}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isAr ? "name@hospital.org" : "name@example.com"}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#08121f] border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-[#c5a059] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 px-5 rounded-lg bg-[#c5a059] hover:bg-[#b08d2a] text-[#0e1d38] font-bold text-sm transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>{isAr ? "جاري الإرسال..." : "Sending..."}</span>
                  </>
                ) : (
                  <>
                    <Mail className="size-4 shrink-0" />
                    <span>{isAr ? "أرسل لي الدليل" : "Send me the guide"}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AuthDownloadButton;
