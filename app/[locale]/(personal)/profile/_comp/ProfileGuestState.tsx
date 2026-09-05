import Link from "next/link";
import { User } from "lucide-react";
import { useTranslations } from "next-intl";
import { InterestDialogTrigger } from "@/components/marketing/InterestDialog";

interface ProfileGuestStateProps {
  locale: string;
}

export default function ProfileGuestState({ locale }: ProfileGuestStateProps) {
  const t = useTranslations("profile.guest");

  return (
    <main className="min-h-screen bg-ink pb-24 pt-28 text-white sm:pt-36">
      <div className="mx-auto w-full max-w-2xl px-6 py-12 text-center sm:px-8">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full border border-signal/30 bg-signal/10 text-signal">
          <User className="size-8" />
        </div>
        <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-signal">
          {t("eyebrow")}
        </p>
        <h1 className="mt-3 font-display text-3xl sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mx-auto mt-4 max-w-md font-body text-sm leading-relaxed text-white/60">
          {t("description")}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <InterestDialogTrigger className="inline-flex min-h-11 items-center bg-signal px-7 font-body text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5 hover:bg-signal-light">
            {t("signIn")}
          </InterestDialogTrigger>
          <Link
            href={`/${locale}`}
            className="inline-flex min-h-11 items-center border border-white/20 px-6 font-body text-sm text-white/80 transition-colors hover:border-white hover:text-white"
          >
            {t("returnHome")}
          </Link>
        </div>
      </div>
    </main>
  );
}
