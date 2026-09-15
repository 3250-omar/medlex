import Image from "next/image";
import { useTranslations } from "next-intl";

const AUDIENCE_KEYS = [
  "Psychiatrists",
  "Psychologists",
  "Courts",
  "Prosecution",
  "Ministries",
  "Legal counsel",
];

const STATS = [
  {
    value: "UK",
  },
  {
    value: "3",
  },
];

export default function WhoWeAreSection() {
  const t = useTranslations("home");

  return (
    <section
      className="bg-[#FAF7F2] py-16 sm:py-20 border-b border-[#E2D9CC]/60"
      aria-labelledby="who-we-are-heading"
      style={{ backgroundColor: "#FAF7F2" }}
    >
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-6">
        {/* Top row: Heading left, photograph & stats right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start mb-12 lg:mb-14">
          {/* Left Column: Narrative & Audiences */}
          <div>
            <h2
              id="who-we-are-heading"
              className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-medium leading-[1.15] mb-6"
              style={{ color: "#8A6D3B" }}
            >
              {t("who.title")}
            </h2>

            <p
              className="font-sans text-lg sm:text-[1.2rem] font-medium leading-[1.5] mb-6 sm:mb-8"
              style={{ color: "#1E2B37" }}
            >
              {t("who.intro")}
            </p>

            <p
              className="font-sans text-[1.02rem] sm:text-[1.05rem] leading-[1.65] mb-8 sm:mb-10"
              style={{ color: "#333333" }}
            >
              {t("who.paragraphs.0")}
            </p>

            {/* Audience Badges */}
            <div className="flex flex-wrap gap-2.5 sm:gap-3">
              {AUDIENCE_KEYS.map((audience, index) => (
                <span
                  key={audience}
                  className="rounded-full border border-[#1E2B37] px-4 sm:px-5 py-1.5 font-sans text-xs sm:text-[0.9rem] font-medium text-[#1E2B37] transition-all! hover:bg-[#1E2B37]! hover:text-white!"
                  style={{ borderColor: "#1E2B37", color: "#1E2B37" }}
                >
                  {t(`who.audiences.${index}`)}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Photograph stacked above two stat cards */}
          <div>
            <div className="rounded-[8px] overflow-hidden mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] bg-[#EAE5DC]">
              <Image
                src="/images/image.png"
                alt={t("who.imageAlt")}
                width={1200}
                height={675}
                priority
                className="w-full h-auto object-cover block"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>

            {/* 2 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {STATS.map((stat, idx) => (
                <div
                  key={stat.value}
                  className="rounded-[4px] p-6 sm:p-7 text-white flex flex-col justify-between"
                  style={{ backgroundColor: "#122238" }}
                >
                  <div
                    className="font-serif text-3xl sm:text-4xl font-medium mb-3"
                    style={{ color: "#D4AF37" }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="font-sans text-[0.92rem] sm:text-[0.95rem] leading-[1.45]"
                    style={{ color: "#E0E4E8" }}
                  >
                    {t(`who.stats.${idx}`)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Full-width mission line across the bottom with subtle top rule */}
        <div
          className="border-t pt-8 text-center"
          style={{ borderTop: "1px solid #E2D9CC" }}
        >
          <p
            className="font-serif text-lg sm:text-xl lg:text-[1.25rem] italic"
            style={{ color: "#1E2B37" }}
          >
            &ldquo;{t("who.quote")}&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
