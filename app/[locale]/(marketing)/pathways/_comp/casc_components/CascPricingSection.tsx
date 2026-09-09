import type { EnrolledCourse } from "../../../_apiCalls/academyQueries";
import EnrolOrContinue from "./EnrolOrContinue";

type Props = {
  locale: string;
  cascEnrolment?: EnrolledCourse;
  continueSlug?: string | null;
};

export default function CascPricingSection({
  locale,
  cascEnrolment,
  continueSlug,
}: Props) {
  return (
    <section
      id="enrol"
      className="py-20 lg:py-28 border-b border-white/10 bg-navy text-lbody on-navy"
    >
      <div className="mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <p className="kicker text-gold">Enrol</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">
            The founding hundred.
          </h2>
          <p className="mt-5 font-serif text-xl leading-relaxed text-lbody">
            The first hundred candidates pay £147. After that the price is £247.
            This is not a countdown timer: there are a hundred places at the
            founding price, and when they are gone, they are gone.
          </p>
          <p className="mt-4 font-sans text-base text-lbody/90 leading-relaxed">
            In exchange, I ask for one thing — a short piece of honest feedback
            once you have worked through it.
          </p>
        </div>

        <div className="bg-white text-char rounded-2xl p-8 sm:p-10 border-t-8 border-gold shadow-xl">
          <div className="font-serif text-5xl sm:text-6xl font-bold text-navy! leading-none">
            £147
          </div>
          <div className="text-sm text-grey mt-2 mb-6">
            for the founding hundred · then £247
          </div>

          <ul className="list-none p-0 m-0 mb-8 divide-y divide-hair">
            {[
              "The full 43-station library",
              "Twelve Weeks to the CASC — the workbook",
              "The candidates' WhatsApp group",
              "The examiner's notes by email",
              "Your certificate on completion",
              "12 months' access — extended free by three months if you resit",
            ].map((item) => (
              <li
                key={item}
                className="py-2.5 text-sm sm:text-base text-char flex items-center gap-2"
              >
                <span className="text-gold font-bold">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <EnrolOrContinue
            className="btn btn-gold !min-h-12 w-full text-center text-sm font-semibold !rounded-full shadow-sm"
            label="Enrol now — £147"
            cascEnrolment={cascEnrolment}
            continueSlug={continueSlug}
            locale={locale}
          />
        </div>
      </div>
    </section>
  );
}
