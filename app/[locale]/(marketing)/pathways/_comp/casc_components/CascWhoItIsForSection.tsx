import { useTranslations } from "next-intl";

export default function CascWhoItIsForSection() {
  const t = useTranslations("cascWhoItIsFor");

  return (
    <section className="relative py-20 lg:py-24 border-t-4 border-gold border-b border-hair bg-white text-char overflow-hidden">
      <div className="relative z-10 mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 items-start">
          {/* Left Column: Who it is for & Quote */}
          <div className="lg:pe-12 xl:pe-16 flex flex-col justify-between border-e-[2px] border-gray-300">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold leading-tight text-navy! mb-6">
                {t("title")}
              </h2>
              <p className="font-serif text-xl sm:text-2xl text-navy/90! leading-relaxed">
                {t("mainDesc")}
              </p>
            </div>

            {/* Quote callout with gold left border */}
            <div className="mt-10 sm:mt-14 border-s-8 border-gold ps-5 sm:ps-6 py-1">
              <p className="font-serif italic text-lg sm:text-xl text-navy/90 leading-relaxed">
                {t("quote")}
              </p>
            </div>
          </div>

          {/* Right Column: Also for. & Not for. with vertical divider */}
          <div className="lg:ps-12 xl:ps-16 lg:border-s lg:border-hair pt-8 lg:pt-0 border-t border-hair lg:border-t-0">
            {/* Also for. */}
            <div>
              <h3 className="font-serif text-2xl font-bold text-navy!">
                {t("alsoForTitle")}
              </h3>
              <p className="mt-4 font-serif text-base sm:text-[17px] leading-relaxed text-grey">
                {t("alsoForDesc")}
              </p>
            </div>

            {/* Thin horizontal divider */}
            <div className="w-full h-[2px] bg-gray-300 my-8 sm:my-10" />

            {/* Not for. */}
            <div>
              <h3 className="font-serif text-2xl font-bold text-navy!">
                {t("notForTitle")}
              </h3>
              <p className="mt-4 font-serif text-base sm:text-[17px] leading-relaxed text-grey">
                {t("notForDesc")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
