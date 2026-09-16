import Link from "next/link";
// import Image from "next/image";
import type { EnrolledCourse } from "../../../_apiCalls/academyQueries";
import EnrolOrContinue, { btnGold } from "./EnrolOrContinue";

type Props = {
  locale: string;
  cascEnrolment?: EnrolledCourse;
  continueSlug?: string | null;
};

export default function CascClosingBannerSection({
  locale,
  cascEnrolment,
  continueSlug,
}: Props) {
  return (
    <section className="relative py-20 lg:py-28 bg-tint text-center border-t border-hair overflow-hidden">
      {/* Background image commented out:
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <Image
          src="/images/sectionImages/reports_section.jpg"
          alt="Law and medical reports library background"
          fill
          className="object-cover object-center opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-deep/70 via-deep/60 to-deep/80" />
      </div>
      */}

      <div className="relative z-10 mx-auto max-w-3xl px-6 sm:px-8">
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold leading-tight text-navy! max-w-2xl mx-auto">
          The candidates who pass are rarely the ones who knew the most
        </h2>
        <p className="mt-5 font-serif text-lg sm:text-xl text-char leading-relaxed max-w-xl mx-auto">
          They are the ones who practised out loud, on purpose, with someone
          watching — and who knew, before they walked in, which four seconds of
          each station the mark actually turns on
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <EnrolOrContinue
            className={btnGold}
            cascEnrolment={cascEnrolment}
            continueSlug={continueSlug}
            locale={locale}
          />
          <Link
            className="btn btn-ghost !min-h-12 !px-7 font-semibold !text-navy !border-navy/30 hover:!bg-navy hover:!text-white text-sm !rounded-full transition-all hover:-translate-y-0.5"
            href={`/${locale}/academy/preview/station-7-2`}
          >
            Try a station free
          </Link>
        </div>
      </div>
    </section>
  );
}
