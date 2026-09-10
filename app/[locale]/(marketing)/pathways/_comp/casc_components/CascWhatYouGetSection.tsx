import Image from "next/image";

const whatYouGetItems = [
  {
    title: "The station library",
    how: "Online · phone, tablet, desktop",
    desc: "43 stations across 8 domains, each with two failing takes, a passing take, the examiner's reasoning, seven decision points, take-home principles, a timed Exam Mode and a three-person practice pack.",
    image: "/images/sectionImages/station_section.png",
  },
  {
    title: "Twelve weeks to the CASC",
    how: "Fillable workbook · type or print",
    desc: "A planning workbook: four routes depending on the weeks you have, twelve weekly planner pages, a station log, a domain tracker, mock debrief sheets, the last fourteen days, and a chapter for candidates resitting.",
    image: "/images/sectionImages/book_section.png",
  },
  {
    title: "The candidates' WhatsApp group",
    how: "Everyone enrolled · all time zones",
    desc: "It exists to solve the problem that actually stops people practising — not motivation, but finding two other people who are free on Tuesday evening. Find a trio, fix a time, swap the stations you found hardest.",
    image: "/images/sectionImages/whatsapp_section.jpeg",
  },
  {
    title: "The examiner's notes",
    how: "By email · through your preparation",
    desc: "Short notes from the examiner's side of the table, sent as you work through the library: one thing examiners see, one thing to practise this week, and the station it lives in.",
    image: "/images/sectionImages/notes_section.jpeg",
  },
  {
    title: "Your certificate",
    how: "On completion · in your name",
    desc: "Issued when you finish, recording the 43 stations and 8 domains you worked through.",
    image: "/images/sectionImages/certificate_section.jpeg",
  },
];

export default function CascWhatYouGetSection() {
  return (
    <section
      id="included"
      className="py-20 lg:py-24 border-b border-white/10 bg-navy text-lbody on-navy"
    >
      <div className="mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10">
        <p className="kicker text-gold">What you get</p>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold leading-tight text-white">
          Everything a candidate needs, in one place.
        </h2>
        <p className="mt-4 font-serif text-lg sm:text-xl text-lbody max-w-3xl leading-relaxed">
          Enrolment gives you the whole of it — the library and the four things
          built around it.
        </p>

        <div className="mt-16 space-y-16 md:space-y-20 lg:space-y-24">
          {whatYouGetItems.map((item, index) => {
            const isImageLeft = index % 2 === 0;
            return (
              <div
                key={item.title}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center"
              >
                {/* Image Column */}
                <div
                  className={
                    isImageLeft ? "order-1 md:order-1" : "order-1 md:order-2"
                  }
                >
                  <div className="group relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-white/15 bg-deep shadow-xl">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>

                {/* Text Column */}
                <div
                  className={
                    isImageLeft ? "order-2 md:order-2" : "order-2 md:order-1"
                  }
                >
                  <h3 className="font-serif text-2xl sm:text-3xl lg:text-[32px] font-bold leading-tight text-white">
                    {item.title}
                  </h3>
                  <div className="text-xs sm:text-sm font-sans text-mute mt-2">
                    {item.how}
                  </div>
                  <p className="mt-4 font-sans text-sm sm:text-base lg:text-[17px] leading-relaxed text-lbody max-w-xl">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
