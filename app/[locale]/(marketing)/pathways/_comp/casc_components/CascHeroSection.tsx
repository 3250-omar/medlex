"use client";

import Link from "next/link";
import Image from "next/image";
import type { EnrolledCourse } from "../../../_apiCalls/academyQueries";
import EnrolOrContinue, { btnGold, btnGhost } from "./EnrolOrContinue";

type Props = {
  locale: string;
  cascEnrolment?: EnrolledCourse;
  continueSlug?: string | null;
};

export default function CascHeroSection({
  locale,
  cascEnrolment,
  continueSlug,
}: Props) {
  return (
    <section className="relative bg-navy text-lbody on-navy pt-20 pb-0 border-b border-white/10 overflow-hidden">
      {/* Background image with opacity percentage */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <Image
          src="/images/sectionImages/casc_hero_section.jpg"
          alt="CASC examination background"
          fill
          priority
          className="object-cover object-center opacity-90"
        />
        {/* Subtle gradient overlays blending into navy */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/85 to-navy" />
      </div>

      <div className="relative z-10 mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10">
        <p className="kicker text-gold">
          The CASC Academy · by MedLex Foundations
        </p>
        <h1 className="mt-4 max-w-4xl font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.12] text-white">
          Learn the CASC from the examiner’s side of the table.
        </h1>
        <p className="mt-6 max-w-2xl font-serif text-lg sm:text-xl lg:text-[22px] leading-relaxed text-lbody">
          Forty-three stations, each shown failed two ways and passed once —
          with what the examiner is thinking at every decision. Built by a
          former CASC examiner.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <EnrolOrContinue
            className={btnGold}
            cascEnrolment={cascEnrolment}
            continueSlug={continueSlug}
            locale={locale}
          />
          <Link
            className={btnGhost}
            href={`/${locale}/academy/preview/station-7-2`}
          >
            Try a station free
          </Link>
        </div>

        <p className="mt-5 text-[13.5px] text-mute">
          Eight domains · 43 stations · 43 role-play practice cases · 12
          months&apos; access
        </p>

        {/* Real 3-take consultation showcase */}
        <div className="mt-16 border-t border-white/15 pt-8 pb-12">
          <p className="font-serif italic text-base sm:text-lg text-lgold max-w-3xl leading-relaxed">
            Darren Boyd, 44, is on his feet with a printout in his fist. His
            daughter Libby, 15, is three weeks into fluoxetine — and he found
            out from a pharmacy bag. Almost every fact he shouts is slightly
            wrong. Seven minutes.
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 rounded-2xl border border-white/15 bg-deep overflow-hidden shadow-lg">
            {/* Fail 1 */}
            <div className="p-6 sm:p-7 border-b md:border-b-0 md:border-r border-white/15">
              <p className="text-xs font-bold uppercase tracking-wider text-mute mb-3">
                Fail 1 — the defence
              </p>
              <p className="font-serif text-[15.5px] sm:text-base leading-relaxed text-white mb-4">
                &ldquo;Mr Boyd, I’ll stop you there, because nothing improper
                has happened. Libby was assessed as Gillick competent. Her
                mother attended with her. Fluoxetine is the recommended first
                line — and with respect, that printout misreads the data.&rdquo;
              </p>
              <div className="border-l-2 border-gold pl-3 text-[13.5px] leading-relaxed text-lbody">
                <b className="text-lgold font-semibold block mb-1">
                  What the examiner is thinking
                </b>
                Six sentences, six accurate facts — and the station is already
                lost. Every word answered the armour; not one answered the man.
              </div>
            </div>

            {/* Fail 2 */}
            <div className="p-6 sm:p-7 border-b md:border-b-0 md:border-r border-white/15">
              <p className="text-xs font-bold uppercase tracking-wider text-mute mb-3">
                Fail 2 — the surrender
              </p>
              <p className="font-serif text-[15.5px] sm:text-base leading-relaxed text-white mb-4">
                &ldquo;Mr Boyd — I can see why you’re angry, and I’m sorry. You
                should have been consulted, absolutely. Look — if you’re not
                comfortable with Libby being on it, we can stop the fluoxetine
                today and think again.&rdquo;
              </p>
              <div className="border-l-2 border-gold pl-3 text-[13.5px] leading-relaxed text-lbody">
                <b className="text-lgold font-semibold block mb-1">
                  What the examiner is thinking
                </b>
                The room is quieter already — and everything paying for the
                quiet was never this doctor’s to spend. A fault conceded that
                did not occur, and a fifteen-year-old’s working treatment
                offered to her father, in her absence, as the price of his calm.
              </div>
            </div>

            {/* Pass */}
            <div className="p-6 sm:p-7 bg-deep/90">
              <p className="text-xs font-bold uppercase tracking-wider text-gold mb-3">
                The pass
              </p>
              <p className="font-serif text-[15.5px] sm:text-base leading-relaxed text-white mb-4">
                &ldquo;Mr Boyd — I’m glad you came in, and I’m not going
                anywhere, so let’s sit. You found out from a pharmacy bag on a
                kitchen counter, and you’ve been reading things that would
                frighten any parent. Before I explain anything, tell me the
                thing that’s worrying you most.&rdquo;
              </p>
              <div className="border-l-2 border-gold pl-3 text-[13.5px] leading-relaxed text-lbody">
                <b className="text-lgold font-semibold block mb-1">
                  What the examiner is thinking
                </b>
                Not one fact corrected, not one protocol cited — and the
                temperature has already dropped. The corrections can all wait.
                They will land later precisely because they were not fired now.
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 text-sm text-mute">
            <span>
              This is the opening of Station 7.2. Every station in the library
              is built this way.
            </span>
            <Link
              href={`/${locale}/academy/preview/station-7-2`}
              className="text-gold font-semibold hover:text-lgold transition-colors inline-flex items-center gap-1"
            >
              Read the whole station, free →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
