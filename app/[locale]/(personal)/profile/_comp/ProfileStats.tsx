import { ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProfileStatsProps {
  enrolledCount: number;
  locale: string;
}

export default function ProfileStats({ enrolledCount }: ProfileStatsProps) {
  const t = useTranslations("profile.stats");

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="rounded-2xl border border-white/10 bg-deep p-6">
        <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
          {t("enrolledCourses")}
        </p>
        <p className="mt-2 font-serif text-3xl font-normal text-white">
          {enrolledCount}
        </p>
        <p className="mt-1 font-sans text-xs text-mute">
          {enrolledCount > 0 ? t("activePathways") : t("noEnrollments")}
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-deep p-6">
        <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
          {t("membershipTier")}
        </p>
        <p className="mt-2 font-serif text-2xl font-normal text-white">
          {t("academyName")}
        </p>
        <p className="mt-1 font-sans text-xs text-mute">{t("fullAccess")}</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-deep p-6">
        <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
          {t("securityStatus")}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <ShieldCheck className="size-5 text-gold" />
          <span className="font-serif text-xl font-normal text-white">
            {t("verified")}
          </span>
        </div>
        <p className="mt-1 font-sans text-xs text-mute">{t("secureSession")}</p>
      </div>
    </section>
  );
}
