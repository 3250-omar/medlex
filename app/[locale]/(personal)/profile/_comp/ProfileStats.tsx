import { ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProfileStatsProps {
  enrolledCount: number;
  locale: string;
}

export default function ProfileStats({
  enrolledCount,
}: ProfileStatsProps) {
  const t = useTranslations("profile.stats");

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="border border-white/10 bg-white/[0.02] p-5">
        <p className="font-body text-[10px] uppercase tracking-[0.2em] text-signal">
          {t("enrolledCourses")}
        </p>
        <p className="mt-2 font-display text-3xl">{enrolledCount}</p>
        <p className="mt-1 font-body text-xs text-white/50">
          {enrolledCount > 0 ? t("activePathways") : t("noEnrollments")}
        </p>
      </div>

      <div className="border border-white/10 bg-white/[0.02] p-5">
        <p className="font-body text-[10px] uppercase tracking-[0.2em] text-signal">
          {t("membershipTier")}
        </p>
        <p className="mt-2 font-display text-2xl">
          {t("academyName")}
        </p>
        <p className="mt-1 font-body text-xs text-white/50">
          {t("fullAccess")}
        </p>
      </div>

      <div className="border border-white/10 bg-white/[0.02] p-5">
        <p className="font-body text-[10px] uppercase tracking-[0.2em] text-signal">
          {t("securityStatus")}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <ShieldCheck className="size-5 text-signal" />
          <span className="font-display text-xl">
            {t("verified")}
          </span>
        </div>
        <p className="mt-1 font-body text-xs text-white/50">
          {t("secureSession")}
        </p>
      </div>
    </section>
  );
}
