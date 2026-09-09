import FAQAccordion from "../../../_comps/FAQAccordion";

export const referenceFaqs = [
  {
    question: "How long do I have access?",
    answer:
      "Twelve months from the day you enrol — long enough to prepare, sit, and if it comes to it, resit at the following diet. If your access runs out before a resit, show us the booking and you get three further months at no charge.",
  },
  {
    question: "How long does a station take?",
    answer:
      "About forty-five minutes to work through properly in Learn Mode, plus seven minutes for Exam Mode. The library is ordered so that a domain can be walked in a sitting.",
  },
  {
    question: "Does it work on my phone?",
    answer:
      "Yes — every station is built for the phone screen first, and tested there.",
  },
  {
    question: "Is this a substitute for practising with colleagues?",
    answer:
      "No, and it says so repeatedly inside the course. It gives you the stations, the marking standard and a group to find people in. You still have to open your mouth in front of someone.",
  },
  {
    question: "Can I share it with colleagues?",
    answer:
      "The workbook, yes — it is designed to travel. The library, no: it lives inside your account, and the practice packs are written so that you bring colleagues to it rather than the other way round.",
  },
  {
    question: "I have already failed once. Is this useful?",
    answer:
      "The workbook has a chapter written specifically for resits, and the honest answer is in it: if you failed on structure, timing or communication, more reading will not touch it.",
  },
  {
    question: "Do I need to be in the UK?",
    answer: "No. Everything is online and the group spans several time zones.",
  },
  {
    question: "Is this endorsed by the Royal College of Psychiatrists?",
    answer: "No. It is an independent course.",
  },
];

export default function CascFaqSection() {
  return (
    <section className="py-20 lg:py-24 border-b border-hair bg-white text-char">
      <div className="mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10">
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold text-navy! text-center">
          Questions.
        </h2>
        <div className="mt-8 max-w-3xl mx-auto">
          <FAQAccordion items={referenceFaqs} />
        </div>
      </div>
    </section>
  );
}
