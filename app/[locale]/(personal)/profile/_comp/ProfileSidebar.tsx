import Link from "next/link";
import { BookOpen, Sparkles, ExternalLink, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProfileSidebarProps {
  locale: string;
}

export default function ProfileSidebar({ locale }: ProfileSidebarProps) {
  const t = useTranslations("profile.sidebar");

  return (
    <div className="space-y-6">
      {/* Quick Links Card */}
      <div className="border border-white/10 bg-white/[0.02] p-6">
        <p className="font-body text-[10px] uppercase tracking-[0.2em] text-signal">
          {t("quickActions")}
        </p>
        <h3 className="mt-1 font-display text-lg">
          {t("learningHub")}
        </h3>

        <div className="mt-5 space-y-2">
          <Link
            href={`/${locale}/courses`}
            className="flex items-center justify-between border border-white/5 bg-white/[0.02] p-3 font-body text-xs text-white/80 transition-colors hover:border-signal/40 hover:bg-white/5 hover:text-white"
          >
            <span className="flex items-center gap-2">
              <BookOpen className="size-3.5 text-signal" />
              {t("allCourses")}
            </span>
            <ArrowRight className="size-3.5 text-white/40" />
          </Link>

          <Link
            href={`/${locale}#pathways-heading`}
            className="flex items-center justify-between border border-white/5 bg-white/[0.02] p-3 font-body text-xs text-white/80 transition-colors hover:border-signal/40 hover:bg-white/5 hover:text-white"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="size-3.5 text-signal" />
              {t("pathways")}
            </span>
            <ArrowRight className="size-3.5 text-white/40" />
          </Link>

          <Link
            href={`/${locale}/academy`}
            className="flex items-center justify-between border border-white/5 bg-white/[0.02] p-3 font-body text-xs text-white/80 transition-colors hover:border-signal/40 hover:bg-white/5 hover:text-white"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="size-3.5 text-signal" />
              {t("aboutAcademy")}
            </span>
            <ArrowRight className="size-3.5 text-white/40" />
          </Link>
        </div>
      </div>

      {/* Help & Support Card */}
      <div className="border border-white/10 bg-white/[0.02] p-6">
        <p className="font-body text-[10px] uppercase tracking-[0.2em] text-signal">
          {t("support")}
        </p>
        <h3 className="mt-1 font-display text-lg">
          {t("needAssistance")}
        </h3>
        <p className="mt-2 font-body text-xs leading-relaxed text-white/60">
          {t("supportDescription")}
        </p>
        <Link
          href={`/${locale}/contact`}
          className="mt-4 inline-flex items-center gap-2 font-body text-xs font-semibold text-signal hover:underline"
        >
          {t("contactSupport")}
          <ArrowRight className="size-3 text-signal" />
        </Link>
      </div>
    </div>
  );
}
