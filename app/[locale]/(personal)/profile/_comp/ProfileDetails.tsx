import { User } from "lucide-react";
import { useTranslations } from "next-intl";
import type { CurrentUser } from "@/app/[locale]/(marketing)/_apiCalls/academyQueries";

interface ProfileDetailsProps {
  user: CurrentUser;
  locale: string;
}

export default function ProfileDetails({
  user,
  locale,
}: ProfileDetailsProps) {
  const t = useTranslations("profile.details");
  const formattedExamDate = user.examDate
    ? new Date(`${user.examDate}T00:00:00`).toLocaleDateString(
        locale === "ar" ? "ar-EG" : "en-GB",
        { day: "numeric", month: "long", year: "numeric" },
      )
    : null;

  return (
    <section className="rounded-2xl border border-white/10 bg-deep p-6 sm:p-8">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
            {t("eyebrow")}
          </p>
          <h2 className="mt-1 font-serif text-2xl font-normal text-white">
            {t("title")}
          </h2>
        </div>
        <User className="size-5 text-gold/40" />
      </div>

      <dl className="mt-6 divide-y divide-white/5">
        <div className="flex flex-col py-3.5 sm:flex-row sm:justify-between">
          <dt className="font-body text-xs text-white/50">
            {t("fullName")}
          </dt>
          <dd className="mt-1 font-body text-sm font-medium text-white sm:mt-0">
            {user.fullName ?? t("notSpecified")}
          </dd>
        </div>

        <div className="flex flex-col py-3.5 sm:flex-row sm:justify-between">
          <dt className="font-body text-xs text-white/50">
            {t("email")}
          </dt>
          <dd className="mt-1 font-body text-sm font-medium text-white sm:mt-0">
            {user.email ?? "—"}
          </dd>
        </div>

        <div className="flex flex-col py-3.5 sm:flex-row sm:justify-between">
          <dt className="font-body text-xs text-white/50">
            {t("username")}
          </dt>
          <dd className="mt-1 font-body text-sm font-medium text-white sm:mt-0">
            {user.username ? `@${user.username}` : t("notSet")}
          </dd>
        </div>

        <div className="flex flex-col py-3.5 sm:flex-row sm:justify-between">
          <dt className="font-body text-xs text-white/50">
            {t("phone")}
          </dt>
          <dd className="mt-1 font-body text-sm font-medium text-white sm:mt-0">
            {user.phone ?? t("notSpecified")}
          </dd>
        </div>

        <div className="flex flex-col py-3.5 sm:flex-row sm:justify-between">
          <dt className="font-body text-xs text-white/50">
            {t("examDate")}
          </dt>
          <dd className="mt-1 font-body text-sm font-medium text-white sm:mt-0">
            {formattedExamDate ?? t("notSpecified")}
          </dd>
        </div>

        <div className="flex flex-col py-3.5 sm:flex-row sm:justify-between">
          <dt className="font-body text-xs text-white/50">
            {t("userId")}
          </dt>
          <dd className="mt-1 font-mono text-xs text-white/40 sm:mt-0">
            {user.id}
          </dd>
        </div>
      </dl>
    </section>
  );
}
