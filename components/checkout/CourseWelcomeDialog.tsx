"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import confetti from "canvas-confetti";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  CheckCircle2,
  MessageCircle,
  Headphones,
  ArrowRight,
  BookOpen,
  Sparkles,
} from "lucide-react";

export interface CourseWelcomeDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  courseTitle?: string;
  courseSlug?: string;
  whatsappSupportNumber?: string;
  whatsappSupportUrl?: string;
}

/**
 * Triggers the CourseWelcomeDialog globally.
 * Can be called from any component (even if that component unmounts right after).
 */
export function triggerCourseWelcomeModal(data?: {
  courseTitle?: string;
  courseSlug?: string;
}) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("medlex:open-course-welcome", { detail: data }),
    );
  }
}

export default function CourseWelcomeDialog({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  courseTitle: initialTitle = "The CASC Academy",
  courseSlug: initialSlug = "casc-academy",
  whatsappSupportNumber = "+20 101 951 5321",
  whatsappSupportUrl = "https://wa.me/201019515321",
}: CourseWelcomeDialogProps = {}) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const router = useRouter();

  const [internalOpen, setInternalOpen] = useState(false);
  const [courseTitle, setCourseTitle] = useState(initialTitle);
  const [courseSlug, setCourseSlug] = useState(initialSlug);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const handleOpenChange = (nextOpen: boolean) => {
    if (isControlled && controlledOnOpenChange) {
      controlledOnOpenChange(nextOpen);
    } else {
      setInternalOpen(nextOpen);
    }
  };

  useEffect(() => {
    const handleGlobalTrigger = (e: Event) => {
      const customEvent = e as CustomEvent<{
        courseTitle?: string;
        courseSlug?: string;
      }>;
      if (customEvent.detail) {
        if (customEvent.detail.courseTitle)
          setCourseTitle(customEvent.detail.courseTitle);
        if (customEvent.detail.courseSlug)
          setCourseSlug(customEvent.detail.courseSlug);
      }
      handleOpenChange(true);
    };

    window.addEventListener("medlex:open-course-welcome", handleGlobalTrigger);
    return () => {
      window.removeEventListener(
        "medlex:open-course-welcome",
        handleGlobalTrigger,
      );
    };
  }, []);

  // Fire celebration confetti when dialog opens
  useEffect(() => {
    if (!open) return;

    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ["#c5a059", "#10b981", "#ffffff"],
    });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }, [open]);

  const handleStartLearning = () => {
    handleOpenChange(false);
    router.push(`/${locale}/academy/courses/${courseSlug}`);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-lg bg-[#0e1d38] text-white border border-[#c5a059]/40 p-6 sm:p-8 rounded-2xl shadow-2xl overflow-hidden"
        dir={isAr ? "rtl" : "ltr"}
      >
        {/* Subtle decorative top glow */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-36 bg-gradient-to-b from-[#c5a059]/30 to-transparent blur-2xl pointer-events-none"
          aria-hidden="true"
        />

        <DialogHeader className="text-center sm:text-center relative z-10">
          <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-[#c5a059]/20 to-[#10b981]/20 border border-[#c5a059]/40 shadow-inner">
            <Sparkles className="size-7 text-[#c5a059] animate-pulse" />
          </div>

          <DialogTitle className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight text-center">
            {isAr
              ? "تهانينا! تم تفعيل اشتراكك بنجاح 🎉"
              : "Welcome & Congratulations! 🎉"}
          </DialogTitle>

          <DialogDescription className="text-sm sm:text-[15px] text-slate-300 mt-2 leading-relaxed text-center">
            {isAr
              ? `أهلاً بك كأحد الأعضاء المؤسسين في ${courseTitle}. حسابك أصبح مفعلًا وجاهزًا بالكامل الآن.`
              : `Thank you for joining ${courseTitle} as one of our founding members. Your full access is now active.`}
          </DialogDescription>
        </DialogHeader>

        {/* Informative Cards */}
        <div className="mt-5 space-y-3.5 relative z-10 text-start">
          {/* Card 1: WhatsApp Group Notification */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-4 transition-all">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-emerald-500/20 p-2 text-emerald-400 shrink-0 mt-0.5">
                <MessageCircle className="size-5" />
              </div>
              <div className="flex-1 text-xs sm:text-sm">
                <div className="font-semibold text-emerald-300 text-sm mb-1 flex items-center gap-1.5">
                  <span>
                    {isAr ? "جروب واتساب الأعضاء" : "Members' WhatsApp Group"}
                  </span>
                  <span className="text-[10px] font-normal uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">
                    {isAr ? "خلال أسبوعين" : "Within 2 weeks"}
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed text-xs sm:text-[13px]">
                  {isAr
                    ? "سيتم إطلاق جروب الواتساب المخصص للمشتركين خلال الأسبوعين القادمين. ستتم إضافتك إليه تلقائياً برقم هاتفك المسجل دون أي إجراء إضافي منك."
                    : "The dedicated members' group will launch within the next two weeks. You'll be added automatically with your registered phone number — there is nothing you need to do."}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: WhatsApp Support */}
          <div className="rounded-xl border border-white/10 bg-[#08121f] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-[#c5a059]/15 p-2 text-[#c5a059] shrink-0">
                <Headphones className="size-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">
                  {isAr ? "فريق الدعم عبر واتساب" : "WhatsApp Support"}
                </div>
                <div
                  className="text-sm font-semibold text-white tracking-wide"
                  dir="ltr"
                >
                  {whatsappSupportNumber}
                </div>
              </div>
            </div>

            <a
              href={whatsappSupportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-black font-semibold text-xs sm:text-sm px-4 py-2.5 transition-colors shadow-sm shrink-0"
            >
              <MessageCircle className="size-4 fill-current" />
              <span>{isAr ? "محادثة الدعم" : "Chat on WhatsApp"}</span>
            </a>
          </div>

          {/* Card 3: Email confirmation reminder */}
          <div className="flex items-center gap-2 text-xs text-slate-400 px-1">
            <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
            <span>
              {isAr
                ? "تم إرسال رسالة ترحيبية وتفاصيل اشتراكك إلى بريدك الإلكتروني."
                : "A welcome email with your course details has been sent to your inbox."}
            </span>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-2.5 relative z-10">
          <button
            type="button"
            onClick={handleStartLearning}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#c5a059] to-[#dfb86c] text-[#0e1d38] font-bold text-sm sm:text-base px-6 py-3.5 hover:opacity-95 transition-all shadow-lg shadow-[#c5a059]/20 cursor-pointer"
          >
            <BookOpen className="size-4" />
            <span>{isAr ? "ابدأ دراسة الكورس الآن" : "Start Course Now"}</span>
            <ArrowRight className={`size-4 ${isAr ? "rotate-180" : ""}`} />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
