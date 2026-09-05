import { User } from "lucide-react";
import { useTranslations } from "next-intl";
import type { CurrentUser } from "@/app/[locale]/(marketing)/_apiCalls/academyQueries";

interface ProfileDetailsProps {
  user: CurrentUser;
  locale: string;
}

export default function ProfileDetails({ user }: ProfileDetailsProps) {
  const t = useTranslations("profile.details");

  return (
    <section className="border border-white/10 bg-white/[0.02] p-6 sm:p-8">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <p className="font-body text-[10px] uppercase tracking-[0.2em] text-signal">
            {t("eyebrow")}
          </p>
          <h2 className="mt-1 font-display text-2xl font-normal">
            {t("title")}
          </h2>
        </div>
        <User className="size-5 text-white/30" />
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
