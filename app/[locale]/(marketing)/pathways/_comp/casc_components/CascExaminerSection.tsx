import FounderPortrait from "@/components/marketing/FounderPortrait";
import { useTranslations } from "next-intl";

export default function CascExaminerSection() {
  const t = useTranslations("cascExaminer");

  return (
    <section
      id="about"
      className="py-20 lg:py-24 border-b border-white/10 bg-navy text-lbody on-navy"
    >
      <div className="mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12 items-start">
        <FounderPortrait
          caption={t("caption")}
          className="w-full max-w-[280px] sm:max-w-[300px]"
        />
        <div>
          <p className="kicker text-gold">{t("kicker")}</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold leading-tight text-white">
            {t("name")}
          </h2>
          <p className="font-serif italic text-lg text-lgold mt-2 mb-6">
            {t("role")}
          </p>

          <p className="font-sans text-sm sm:text-base leading-relaxed text-lbody mb-4">
            {t("bio1")}
          </p>
          <p className="font-sans text-sm sm:text-base leading-relaxed text-lbody mb-4">
            {t("bio2")}
          </p>
          <p className="font-sans text-sm sm:text-base leading-relaxed text-lbody">
            {t("bio3")}
          </p>
        </div>
      </div>
    </section>
  );
}
