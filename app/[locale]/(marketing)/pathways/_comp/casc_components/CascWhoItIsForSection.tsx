// import Image from "next/image";

export default function CascWhoItIsForSection() {
  return (
    <section className="relative py-20 lg:py-24 border-t-4 border-gold border-b border-hair bg-white text-char overflow-hidden">
      {/* Background image commented out as requested:
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <Image
          src="/images/sectionImages/casc_hero_section.jpg"
          alt="Candidates preparing for the CASC examination"
          fill
          className="object-cover opacity-80"
          style={{ objectPosition: "50% 25%" }}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/92 via-navy/60 to-navy/90" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-transparent to-navy/70" />
      </div>
      */}

      <div className="relative z-10 mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 items-start">
          {/* Left Column: Who it is for & Quote */}
          <div className="lg:pr-12 xl:pr-16 flex flex-col justify-between">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold leading-tight text-navy! mb-6">
                Who it is for
              </h2>
              <p className="font-serif text-xl sm:text-2xl text-navy/90! leading-relaxed">
                You are sitting the MRCPsych CASC, you have done the reading,
                and you know the gap is in performance rather than knowledge —
                or you are resitting and cannot afford to prepare the same way
                again.
              </p>
            </div>

            {/* Quote callout with gold left border */}
            <div className="mt-10 sm:mt-14 border-l-[3px] border-gold pl-5 sm:pl-6 py-1">
              <p className="font-serif italic text-lg sm:text-xl text-navy/90 leading-relaxed">
                The exam is not judged on what you know. It is judged on what
                the examiner watches you do with it.
              </p>
            </div>
          </div>

          {/* Right Column: Also for. & Not for. with vertical divider */}
          <div className="lg:pl-12 xl:pl-16 lg:border-l lg:border-hair pt-8 lg:pt-0 border-t border-hair lg:border-t-0">
            {/* Also for. */}
            <div>
              <h3 className="font-serif text-2xl font-bold text-navy!">
                Also for
              </h3>
              <p className="mt-4 font-serif text-base sm:text-[17px] leading-relaxed text-grey">
                Candidates sitting other psychiatry clinical examinations built
                on observed stations — the Arab Board and national board OSCEs
                among them. The marking language here is the CASC&apos;s; the
                skills underneath it — structure under time, the alliance before
                the assessment, the risk question that actually gets answered —
                are the foundations of psychiatric practice anywhere.
              </p>
            </div>

            {/* Thin horizontal divider */}
            <div className="w-full h-px bg-hair my-8 sm:my-10" />

            {/* Not for. */}
            <div>
              <h3 className="font-serif text-2xl font-bold text-navy!">
                Not for
              </h3>
              <p className="mt-4 font-serif text-base sm:text-[17px] leading-relaxed text-grey">
                Anyone who wants model answers to memorise. This course will not
                give you scripts. It will show you why the scripts fail.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
