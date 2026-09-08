import { Mail, Calendar, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import type { CurrentUser } from "@/app/[locale]/(marketing)/_apiCalls/academyQueries";

interface ProfileHeaderProps {
  user: CurrentUser;
  locale: string;
  onSignOut: () => void;
}

export default function ProfileHeader({
  user,
  locale,
  onSignOut,
}: ProfileHeaderProps) {
  const t = useTranslations("profile.header");
  const isAr = locale === "ar";
  const userName = user.fullName ?? user.email ?? t("defaultUser");
  const initials = userName.charAt(0).toUpperCase();

  const formattedJoinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(isAr ? "ar-EG" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <section className="relative overflow-hidden  p-6  sm:p-8">
      <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          {/* Avatar circle */}
          <div className="flex size-20 shrink-0 items-center justify-center rounded-full border-2 border-gold/40 bg-gold font-serif text-2xl font-bold text-navy shadow-[0_0_24px_rgba(212,175,55,0.25)]">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt=""
                className="size-full rounded-full object-cover"
              />
            ) : (
              initials
            )}
          </div>

          {/* Name & Quick details */}
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-serif text-2xl font-normal text-white sm:text-3xl">
                {userName}
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 font-body text-[11px] font-semibold text-gold">
                <span className="size-1.5 rounded-full bg-gold animate-pulse" />
                {t("activeMember")}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-4 font-body text-xs text-mute">
              {user.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="size-3.5 text-mute" />
                  {user.email}
                </span>
              )}
              {user.username && (
                <span className="text-gold font-medium">@{user.username}</span>
              )}
              {formattedJoinDate && (
                <span className="flex items-center gap-1.5 text-white/40">
                  <Calendar className="size-3.5" />
                  {t("memberSince")} {formattedJoinDate}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Header Action: Sign Out */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={onSignOut}
            className="flex items-center gap-2 border border-white/15 px-4 py-2 font-body text-xs text-destructive transition-colors hover:border-destructive/40 hover:bg-destructive/10"
          >
            <LogOut className="size-3.5" />
            {t("signOut")}
          </button>
        </div>
      </div>
    </section>
  );
}
