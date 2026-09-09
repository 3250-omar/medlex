import Image from "next/image";

export default function CascDomainsSection() {
  return (
    <section className="py-20 lg:py-24 border-b border-hair bg-white">
      <div className="mx-auto w-full max-w-[1720px] px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="flex flex-col lg:flex-row items-stretch justify-between gap-10 lg:gap-14 xl:gap-16">
          {/* Stretched Image Column (Start) */}
          <div className="w-full lg:w-2/5 xl:w-[38%] 2xl:w-[40%] flex">
            <div className="relative w-full h-full min-h-[380px] sm:min-h-[460px] lg:min-h-full rounded-2xl overflow-hidden border border-hair shadow-xl bg-tint">
              <Image
                src="/images/sectionImages/libirary_section.jpeg"
                alt="The Library — Eight domains, forty-three stations"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </div>

          {/* Content Column (End) */}
          <div className="w-full lg:w-3/5 xl:w-[62%] 2xl:w-[60%] flex flex-col justify-between">
            <div>
              <p className="kicker text-goldd">The library</p>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold leading-tight text-navy!">
                Eight domains. Forty-three stations.
              </h2>
              <p className="mt-4 font-serif text-lg sm:text-xl text-char leading-relaxed max-w-3xl">
                Organised the way examiners think, each domain with its own hub
                and the stations that test it.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-8 xl:gap-x-12">
              {[
                {
                  num: "1",
                  title: "Communication & Rapport",
                  sub: "The grammar of every consultation.",
                },
                {
                  num: "2",
                  title: "Information Giving",
                  sub: "The difference between a leaflet and a lightbulb.",
                },
                {
                  num: "3",
                  title: "Risk Assessment",
                  sub: "Where marks are lost fastest and most quietly.",
                },
                {
                  num: "4",
                  title: "Mental State Examination",
                  sub: "Phenomenology, and the questions that get you there.",
                },
                {
                  num: "5",
                  title: "Capacity, Consent & the Law",
                  sub: "Decision-specific, time-specific, defensible.",
                },
                {
                  num: "6",
                  title: "Management & Emergencies",
                  sub: "The ward at three in the morning.",
                },
                {
                  num: "7",
                  title: "Difficult Conversations",
                  sub: "Families, complaints, colleagues, apologies.",
                },
                {
                  num: "8",
                  title: "Physical Examination",
                  sub: "The examinations psychiatry cannot delegate.",
                },
              ].map((d) => (
                <div
                  key={d.num}
                  className="grid grid-cols-[44px_1fr] gap-3 py-4 sm:py-5 border-b border-hair items-baseline"
                >
                  <span className="font-serif text-2xl font-bold text-gold leading-none">
                    {d.num}
                  </span>
                  <div>
                    <b className="font-serif text-lg font-semibold text-navy! block">
                      {d.title}
                    </b>
                    <span className="text-sm text-grey leading-relaxed">
                      {d.sub}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
