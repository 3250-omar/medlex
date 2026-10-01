"use client";

import { useCallback, useContext, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { InterestDialogContext } from "@/components/marketing/InterestDialog";
import CheckoutDialog, {
  DEFAULT_CANCELLATION_WAIVER_TEXT,
  type CheckoutConfirmationData,
} from "@/components/checkout/CheckoutDialog";
import {
  academyQueryKeys,
  useCurrentUser,
  useSubscribeToCourse,
} from "../../_apiCalls/academyQueries";
import { useQueryClient } from "@tanstack/react-query";
import { type PathwayKey } from "./pathwayContent";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CheckCircle2, Loader2, Mail } from "lucide-react";

export default function SubscribeButton({
  children,
  pathway = "casc-academy",
  autoRedirect = true,
  onSuccess,
  className,
  showArrow = true,
  itemTitle,
  itemPrice = "£147",
  requireCancellationWaiver = true,
  waiverText = DEFAULT_CANCELLATION_WAIVER_TEXT,
  isWaitlist = true,
  selectedPackageInfo,
}: {
  children: React.ReactNode;
  pathway?: PathwayKey;
  autoRedirect?: boolean;
  onSuccess?: () => void;
  className?: string;
  showArrow?: boolean;
  itemTitle?: string;
  itemPrice?: string;
  requireCancellationWaiver?: boolean;
  waiverText?: string;
  isWaitlist?: boolean;
  selectedPackageInfo?: string;
}) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const router = useRouter();
  const queryClient = useQueryClient();
  const dialog = useContext(InterestDialogContext);
  const { data: user, isLoading } = useCurrentUser();
  const subscribe = useSubscribeToCourse();

  const [showCheckout, setShowCheckout] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [waitlistName, setWaitlistName] = useState("");
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [isWaitlistSubmitting, setIsWaitlistSubmitting] = useState(false);
  const [isWaitlistSuccess, setIsWaitlistSuccess] = useState(false);

  const completeSubscription = useCallback(
    async (waiverData?: CheckoutConfirmationData) => {
      try {
        const result = await subscribe.mutateAsync({
          slug: pathway,
          waiverAccepted: waiverData?.waiverAccepted ?? false,
          waiverText: waiverData?.waiverText,
        });

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: academyQueryKeys.currentUser,
          }),
          queryClient.invalidateQueries({
            queryKey: academyQueryKeys.enrolledCourses,
          }),
        ]);

        setShowCheckout(false);

        if (onSuccess) {
          onSuccess();
        }

        if (autoRedirect) {
          router.push(
            `/${locale}/academy/courses/${pathway}/learn/${result.firstUnitSlug ?? "start-here"}`,
          );
        }
      } catch (err: unknown) {
        await queryClient.invalidateQueries({
          queryKey: academyQueryKeys.enrolledCourses,
        });

        const message =
          err instanceof Error ? err.message : String(err ?? "");
        const isAlreadySubscribed =
          message.includes("already_subscribed") ||
          (typeof err === "object" &&
            err !== null &&
            "status" in err &&
            (err as { status: number }).status === 409);

        if (isAlreadySubscribed) {
          setShowCheckout(false);
          if (onSuccess) {
            onSuccess();
          }
          if (autoRedirect) {
            router.push(`/${locale}/academy/courses/${pathway}/learn/start-here`);
          }
          return;
        }

        console.error("[SubscribeButton] Subscription error:", err);
      }
    },
    [
      autoRedirect,
      locale,
      onSuccess,
      pathway,
      queryClient,
      router,
      subscribe,
    ],
  );

  function handleClick() {
    if (isWaitlist) {
      if (user?.email && !waitlistEmail) {
        setWaitlistEmail(user.email);
      }
      setShowWaitlist(true);
      return;
    }

    if (!user) {
      dialog?.openInterestDialog(pathway, "register", () => {
        setShowCheckout(true);
      });
      return;
    }
    setShowCheckout(true);
  }

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail) return;

    setIsWaitlistSubmitting(true);
    try {
      await fetch("/api/gifts/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: waitlistName.trim() || undefined,
          email: waitlistEmail.trim(),
          pathway,
          type: "enrol_waitlist",
          resource: selectedPackageInfo
            ? `${pathway} Enrolment Waitlist — ${selectedPackageInfo} (${itemPrice})`
            : `${pathway} Enrolment Waitlist`,
        }),
      });

      setIsWaitlistSuccess(true);
      setTimeout(() => {
        setIsWaitlistSuccess(false);
        setShowWaitlist(false);
      }, 3500);
    } catch (err) {
      console.error("[SubscribeButton] Error submitting waitlist:", err);
      setIsWaitlistSuccess(true);
      setTimeout(() => {
        setIsWaitlistSuccess(false);
        setShowWaitlist(false);
      }, 3500);
    } finally {
      setIsWaitlistSubmitting(false);
    }
  };

  const courseTitle =
    itemTitle ||
    (pathway === "casc-academy"
      ? "The CASC Academy — Complete Access"
      : "Course Enrolment");

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading || subscribe.isPending}
        className={
          className ||
          "btn btn-gold !rounded-full !min-h-12 !px-7 font-body text-sm font-semibold text-navy inline-flex items-center justify-center transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        }
      >
        {subscribe.isPending ? "…" : children}
        {showArrow && (
          <span className="ms-3" aria-hidden="true">
            →
          </span>
        )}
      </button>

      {/* Waitlist Modal */}
      <Dialog open={showWaitlist} onOpenChange={setShowWaitlist}>
        <DialogContent className="sm:max-w-md bg-[#0e1d38] text-white border border-[#c5a059]/30 p-6 rounded-2xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl sm:text-2xl font-bold text-white text-start">
              {isAr
                ? "الانضمام إلى قائمة انتظار التسجيل"
                : "Join the Enrolment Waitlist"}
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-300 text-start mt-2 leading-relaxed">
              {isAr
                ? "سيتم فتح باب التسجيل قريباً. اترك بريدك الإلكتروني لتكون أول من يعلم."
                : "Enrolment opens shortly. Leave your email and you will be the first to know."}
            </DialogDescription>
          </DialogHeader>

          {selectedPackageInfo && (
            <div className="mt-2 p-3 rounded-xl bg-[#142646] border border-[#c5a059]/40 flex items-center justify-between text-xs sm:text-sm">
              <span className="text-slate-200 font-medium">
                {selectedPackageInfo}
              </span>
              {itemPrice && (
                <span className="font-bold text-[#c5a059] ms-2 shrink-0">
                  {itemPrice}
                </span>
              )}
            </div>
          )}

          {isWaitlistSuccess ? (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#c5a059] animate-bounce" />
              <p className="font-semibold text-lg text-white">
                {isAr ? "شكراً لك!" : "Thank You!"}
              </p>
              <p className="text-sm text-slate-300 max-w-xs">
                {isAr
                  ? "تمت إضافتك إلى قائمة الانتظار بنجاح. سنعلمك فور فتح باب التسجيل."
                  : "You're on the list. We'll send you an email the moment enrolment opens."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleWaitlistSubmit} className="space-y-4 mt-2">
              <div>
                <label
                  htmlFor="waitlist-name"
                  className="block text-xs font-medium text-slate-300 mb-1.5 text-start"
                >
                  {isAr ? "الاسم (اختياري)" : "Full Name (Optional)"}
                </label>
                <input
                  id="waitlist-name"
                  type="text"
                  value={waitlistName}
                  onChange={(e) => setWaitlistName(e.target.value)}
                  placeholder={isAr ? "د. محمد أحمد" : "Dr. Jane Smith"}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#142646] border border-[#c5a059]/30 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#c5a059] text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="waitlist-email"
                  className="block text-xs font-medium text-slate-300 mb-1.5 text-start"
                >
                  {isAr ? "البريد الإلكتروني *" : "Email Address *"}
                </label>
                <input
                  id="waitlist-email"
                  type="email"
                  required
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  placeholder="doctor@example.com"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#142646] border border-[#c5a059]/30 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#c5a059] text-sm"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isWaitlistSubmitting || !waitlistEmail}
                  className="w-full py-3 px-4 rounded-lg bg-[#c5a059] hover:bg-[#b08d48] text-navy font-semibold text-sm transition-all duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isWaitlistSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{isAr ? "جاري الإرسال..." : "Submitting..."}</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      <span>{isAr ? "أعلمني عند الفتح" : "Notify me"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Reusable Checkout Dialog */}
      <CheckoutDialog
        open={showCheckout}
        onOpenChange={setShowCheckout}
        itemName={courseTitle}
        price={itemPrice}
        requireCancellationWaiver={requireCancellationWaiver}
        waiverText={waiverText}
        isProcessing={subscribe.isPending}
        onConfirm={completeSubscription}
      />
    </>
  );
}
