import Image from "next/image";

export default function CascHowStationWorksSection() {
  return (
    <section
      id="station"
      className="py-20 lg:py-24 border-b border-hair bg-tint"
    >
      <div className="mx-auto w-full max-w-[1720px] px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="flex flex-col lg:flex-row items-stretch justify-between gap-10 lg:gap-14 xl:gap-16">
          {/* Content Column */}
          <div className="w-full lg:w-3/5 xl:w-[60%] flex flex-col justify-between">
            <div>
              <p className="kicker text-goldd">How a station works</p>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold leading-tight text-navy!">
                Not lectures. Not model answers. Stations, taken apart.
              </h2>
              <p className="mt-4 max-w-3xl font-serif text-lg sm:text-xl leading-relaxed text-char">
                Every station is built the same way, around a single named trap —
                the specific error that costs candidates the mark in that
                scenario. Then you make the decisions yourself.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[
                {
                  num: "1",
                  title: "The trap, named",
                  desc: "What this station is really testing, and the two ways good candidates get it wrong.",
                },
                {
                  num: "2",
                  title: "Two failures, one pass",
                  desc: "The same consultation three times, line by line. One failure is obvious; the other is the kind one, and worse.",
                },
                {
                  num: "3",
                  title: "The examiner's reasoning",
                  desc: "Tap any moment and read what an examiner is thinking as it happens — and why the mark is being lost or won.",
                },
                {
                  num: "4",
                  title: "Seven decisions",
                  desc: "You are in the chair. Choose, read the examiner's response, try again until you find the move that works.",
                },
                {
                  num: "5",
                  title: "Exam Mode, then the cards",
                  desc: "Seven minutes, timed, on a patient you have not met. Then a three-person practice pack to run with colleagues that evening.",
                },
              ].map((step) => (
                <div
                  key={step.num}
                  className="border-t-2 border-gold pt-5 bg-transparent"
                >
                  <span className="font-serif text-3xl font-bold text-gold block leading-none mb-3">
                    {step.num}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-navy! mb-2">
                    {step.title}
                  </h3>
                  <p className="font-sans text-sm leading-relaxed text-grey">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Stretched Image Column */}
          <div className="w-full lg:w-2/5 xl:w-[40%] flex">
            <div className="relative w-full h-full min-h-[380px] sm:min-h-[460px] lg:min-h-full rounded-2xl overflow-hidden border border-hair shadow-xl bg-white">
              <Image
                src="/images/sectionImages/How_station_works_section.jpg"
                alt="How a station works — clinical consultation"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
