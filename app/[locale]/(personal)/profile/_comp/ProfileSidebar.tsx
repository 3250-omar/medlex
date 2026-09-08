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
      <div className="rounded-2xl border border-white/10 bg-deep p-6">
        <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
          {t("quickActions")}
        </p>
        <h3 className="mt-2 font-serif text-lg font-normal text-white">
          {t("learningHub")}
        </h3>

        <div className="mt-5 space-y-2">
          <Link
            href={`/${locale}/courses`}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-3 font-sans text-xs text-lbody transition-colors hover:border-gold/40 hover:bg-white/5 hover:text-white"
          >
            <span className="flex items-center gap-2">
              <BookOpen className="size-3.5 text-gold" />
              {t("allCourses")}
            </span>
            <ArrowRight className="size-3.5 text-white/40" />
          </Link>

          <Link
            href={`/${locale}#pathways-heading`}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-3 font-sans text-xs text-lbody transition-colors hover:border-gold/40 hover:bg-white/5 hover:text-white"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="size-3.5 text-gold" />
              {t("pathways")}
            </span>
            <ArrowRight className="size-3.5 text-white/40" />
          </Link>

          <Link
            href={`/${locale}/academy`}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-3 font-sans text-xs text-lbody transition-colors hover:border-gold/40 hover:bg-white/5 hover:text-white"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="size-3.5 text-gold" />
              {t("aboutAcademy")}
            </span>
            <ArrowRight className="size-3.5 text-white/40" />
          </Link>
        </div>
      </div>

      {/* Help & Support Card */}
      <div className="rounded-2xl border border-white/10 bg-deep p-6">
        <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
          {t("support")}
        </p>
        <h3 className="mt-2 font-serif text-lg font-normal text-white">
          {t("needAssistance")}
        </h3>
        <p className="mt-2 font-sans text-xs leading-relaxed text-mute">
          {t("supportDescription")}
        </p>
        <Link
          href={`/${locale}/contact`}
          className="mt-4 inline-flex items-center gap-2 font-body text-xs font-semibold text-gold hover:text-goldd transition-colors"
        >
          {t("contactSupport")}
          <ArrowRight className="size-3 text-gold" />
        </Link>
      </div>
    </div>
  );
}
