import Link from "next/link";
import Image from "next/image";
import { btnNavy } from "./EnrolOrContinue";

type Props = {
  locale: string;
};

export default function CascCoachingSection({ locale }: Props) {
  return (
    <section className="py-20 lg:py-24 border-b border-hair bg-white text-char">
      <div className="mx-auto w-full max-w-[1720px] px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-12 xl:gap-16 max-w-6xl mx-auto">
          {/* Coaching Information Card */}
          <div className="w-full lg:w-1/2 max-w-xl border border-hair rounded-2xl p-8 sm:p-10 bg-white shadow-sm">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-navy!">
              If a weakness will not shift
            </h3>
            <p className="mt-3 font-sans text-sm sm:text-base leading-relaxed text-char/80">
              Most candidates do not need coaching. If you are not yet practising
              out loud every week, arrange that first — it is free and it will do
              more. Coaching is worth buying when a specific weakness has not
              moved despite regular practice, or after a failed attempt: sixty
              minutes online, performing stations and being marked the way an
              examiner marks
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 py-4 border-y border-hair">
              <div>
                <b className="font-serif text-base font-semibold text-navy! block mb-1">
                  One to one, 60 minutes
                </b>
                <span className="text-sm text-grey">
                  £120 · five for £540 · ten for £960
                </span>
              </div>
              <div>
                <b className="font-serif text-base font-semibold text-navy! block mb-1">
                  Small group, maximum three
                </b>
                <span className="text-sm text-grey">
                  £60 per person · five for £250
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col items-start sm:items-center justify-between gap-4">
              <Link href={`/${locale}/contact`} className={btnNavy}>
                Book a session
              </Link>
              <span className="text-xs text-grey">
                Booked separately; not part of the course price.
              </span>
            </div>
          </div>

          {/* Coaching Image */}
          <div className="w-full lg:w-1/2 max-w-xl">
            <div className="group relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-hair shadow-xl bg-tint">
              <Image
                src="/images/sectionImages/coaching_section.jpg"
                alt="One-to-one CASC coaching session"
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
