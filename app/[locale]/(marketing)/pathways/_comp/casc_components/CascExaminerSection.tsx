import FounderPortrait from "@/components/marketing/FounderPortrait";

export default function CascExaminerSection() {
  return (
    <section
      id="about"
      className="py-20 lg:py-24 border-b border-white/10 bg-navy text-lbody on-navy"
    >
      <div className="mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12 items-start">
        <FounderPortrait
          caption="Dr Ahmed Abouelghit · former CASC examiner"
          className="w-full max-w-[280px] sm:max-w-[300px]"
        />
        <div>
          <p className="kicker text-gold">The examiner</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold leading-tight text-white">
            Dr Ahmed Abouelghit
          </h2>
          <p className="font-serif italic text-lg text-lgold mt-2 mb-6">
            Consultant Forensic Psychiatrist · former CASC examiner
          </p>

          <p className="font-sans text-sm sm:text-base leading-relaxed text-lbody mb-4">
            UK-trained Consultant Forensic Psychiatrist and Forensic Psychiatry
            Training Programme Director, with senior experience across clinical
            psychiatry, medico-legal practice, teaching and service leadership.
          </p>
          <p className="font-sans text-sm sm:text-base leading-relaxed text-lbody mb-4">
            He has sat on the other side of the table. He knows where the mark
            is actually decided in each station — and it is rarely where
            candidates think. It is the four seconds after a patient says
            something unexpected. It is the risk question asked in a form that
            lets the patient say no. It is the capacity assessment that is
            fluent and general when it needed to be specific to one decision on
            one afternoon. It is the examination performed perfectly in silence
            on a man who was never told why.
          </p>
          <p className="font-sans text-sm sm:text-base leading-relaxed text-lbody">
            These are the things that are easily missed and cost a great deal,
            and they are what this course is built around: not what to know, but
            what an examiner is watching for while you say it.
          </p>
        </div>
      </div>
    </section>
  );
}
