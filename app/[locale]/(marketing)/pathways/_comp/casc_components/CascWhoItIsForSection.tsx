import Image from "next/image";

export default function CascWhoItIsForSection() {
  return (
    <section className="relative py-20 lg:py-28 border-b border-white/10 bg-navy text-lbody on-navy overflow-hidden">
      {/* Background photo with high opacity and dark overlay for crisp text readability */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <Image
          src="/images/sectionImages/casc_hero_section.jpg"
          alt="Candidates preparing for the CASC examination"
          fill
          className="object-cover opacity-80"
          style={{ objectPosition: "50% 25%" }}
          sizes="100vw"
        />
        {/* Dark gradient overlay keeping the center subject visible while making text on sides 100% readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy/92 via-navy/60 to-navy/90" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-transparent to-navy/70" />
      </div>

      <div className="relative z-10 mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left Column: Who it is for */}
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold leading-tight text-white">
            Who it is for
          </h2>
          <p className="mt-5 font-serif text-lg sm:text-xl text-white/90 leading-relaxed">
            You are sitting the MRCPsych CASC, you have done the reading, and
            you know the gap is in performance rather than knowledge — or you
            are resitting and cannot afford to prepare the same way again
          </p>
        </div>

        {/* Right Column: Also for. & Not for */}
        <div className="flex flex-col justify-center">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
            Also for.
          </h3>
          <p className="mt-3 font-sans text-sm sm:text-base leading-relaxed text-white/80">
            Candidates sitting other psychiatry clinical examinations built on
            observed stations — the Arab Board and national board OSCEs among
            them. The marking language here is the CASC’s; the skills underneath
            it — structure under time, the alliance before the assessment, the
            risk question that actually gets answered — are the foundations of
            psychiatric practice anywhere.
          </p>

          <h3 className="mt-8 font-serif text-xl sm:text-2xl font-bold text-white">
            Not for
          </h3>
          <p className="mt-3 font-sans text-sm sm:text-base leading-relaxed text-white/80">
            Anyone who wants model answers to memorise. This course will not give
            you scripts. It will show you why the scripts fail
          </p>
        </div>
      </div>
    </section>
  );
}
