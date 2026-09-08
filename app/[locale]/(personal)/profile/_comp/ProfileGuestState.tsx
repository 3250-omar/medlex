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
    <main className="min-h-screen bg-navy on-navy pb-24 pt-28 text-lbody sm:pt-36">
      <div className="mx-auto w-full max-w-2xl px-6 py-12 text-center sm:px-8">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold">
          <User className="size-8" />
        </div>
        <p className="kicker text-gold">
          {t("eyebrow")}
        </p>
        <h1 className="mt-3 font-serif text-3xl font-normal text-white sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mx-auto mt-4 max-w-md font-sans text-sm leading-relaxed text-lbody">
          {t("description")}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <InterestDialogTrigger className="btn btn-gold !rounded-full !min-h-12 !px-8 font-body text-sm font-semibold text-navy inline-flex items-center">
            {t("signIn")}
          </InterestDialogTrigger>
          <Link
            href={`/${locale}`}
            className="btn btn-ghost !rounded-full !min-h-12 !px-7 font-body text-sm text-white inline-flex items-center"
          >
            {t("returnHome")}
          </Link>
        </div>
      </div>
    </main>
  );
}
