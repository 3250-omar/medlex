import Image from "next/image";
import { useTranslations } from "next-intl";

export default function CascDomainsSection() {
  const t = useTranslations("cascDomains");

  return (
    <section
      id="library"
      className="py-20 lg:py-24 border-b border-hair bg-white scroll-mt-16"
    >
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
              <p className="kicker text-goldd">{t("kicker")}</p>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold leading-tight text-navy!">
                {t("title")}
              </h2>
              <p className="mt-4 font-serif text-lg sm:text-xl text-char leading-relaxed max-w-3xl">
                {t("subtitle")}
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-8 xl:gap-x-12">
              {[
                {
                  num: "1",
                  title: t("d1Title"),
                  sub: t("d1Sub"),
                },
                {
                  num: "2",
                  title: t("d2Title"),
                  sub: t("d2Sub"),
                },
                {
                  num: "3",
                  title: t("d3Title"),
                  sub: t("d3Sub"),
                },
                {
                  num: "4",
                  title: t("d4Title"),
                  sub: t("d4Sub"),
                },
                {
                  num: "5",
                  title: t("d5Title"),
                  sub: t("d5Sub"),
                },
                {
                  num: "6",
                  title: t("d6Title"),
                  sub: t("d6Sub"),
                },
                {
                  num: "7",
                  title: t("d7Title"),
                  sub: t("d7Sub"),
                },
                {
                  num: "8",
                  title: t("d8Title"),
                  sub: t("d8Sub"),
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
