import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function Footer({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "footer" });

  return (
    <footer className="print:hidden border-t-2 border-[#b08d2a] bg-[#0b1726] text-[#c7d2de] relative overflow-hidden">
      <div className="w-full flex flex-col lg:flex-row items-stretch">
        {/* Left Column: Plaque Image with Vignette/Shadow & Motto */}
        <div className="relative w-full lg:w-[42%] xl:w-[40%] min-h-[360px] sm:min-h-[440px] lg:min-h-[580px] flex flex-col justify-end overflow-hidden">
          {/* Base Image */}
          <Image
            src="/images/medicolegal/bg_3__final.jpg"
            alt="MedLex — Where Medicine Meets Justice"
            fill
            priority
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="object-cover object-left lg:object-center"
          />

          {/* Depth / Multiplied vignette shadow */}
          <div
            className="pointer-events-none absolute inset-0 bg-black/25 mix-blend-multiply"
            aria-hidden="true"
          />

          {/* Seamless right-side gradient into dark navy background */}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-[#0b1726] rtl:bg-gradient-to-l rtl:from-black/20 rtl:via-transparent rtl:to-[#0b1726]"
            aria-hidden="true"
          />

          {/* Subtle bottom shadow to anchor the motto */}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b1726] via-[#0b1726]/40 to-transparent"
            aria-hidden="true"
          />

          {/* Motto Engraved on Stone Ledge */}
          <div className="relative z-10 px-8 pb-10 sm:pb-12 text-center lg:text-left rtl:lg:text-right">
            <p className="font-serif italic text-lg sm:text-xl lg:text-[1.35rem] text-[#c5a059] tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              {t("motto")}
            </p>
          </div>
        </div>

        {/* Right Column: Information, Navigation & Actions */}
        <div className="w-full lg:w-[58%] xl:w-[60%] px-6 sm:px-10 lg:px-12 xl:px-16 py-12 lg:py-16 flex flex-col justify-between bg-[#0b1726]">
          <div>
            {/* Subtle top rule */}
            <div className="h-[1px] w-full max-w-md bg-white/15 mb-6" />

            {/* Narrative summary */}
            <p className="font-sans text-[13.5px] sm:text-[14.5px] leading-relaxed text-[#c7d2de] max-w-2xl">
              {t("description")}
            </p>

            {/* Jurisdictions / Locations */}
            <p className="font-sans text-xs sm:text-[13px] font-semibold text-[#c5a059] tracking-wider mt-3 mb-10">
              {t("locations")}
            </p>

            {/* 3-Column Navigation Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-10 mb-12">
              {/* 1. Pathways */}
              <div>
                <h3 className="font-serif text-[17px] font-semibold text-white mb-4">
                  {t("pathways")}
                </h3>
                <ul className="space-y-4 font-sans">
                  <li>
                    <Link
                      href={`/${locale}/pathways/medico-legal`}
                      className="group block"
                    >
                      <span className="block text-sm font-medium text-white group-hover:text-[#c5a059] transition-colors">
                        {t("education")}
                      </span>
                      <span className="block text-[11px] text-[#c5a059] mt-0.5">
                        {t("waitlistOpen")}
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${locale}/pathways/casc-academy`}
                      className="group block"
                    >
                      <span className="block text-sm font-medium text-white group-hover:text-[#c5a059] transition-colors">
                        {t("academy")}
                      </span>
                      <span className="block text-[11px] text-[#c5a059] mt-0.5">
                        {t("openNow")}
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${locale}/pathways/foundations`}
                      className="group block"
                    >
                      <span className="block text-sm font-medium text-white group-hover:text-[#c5a059] transition-colors">
                        {t("foundations")}
                      </span>
                      <span className="block text-[11px] text-[#c5a059] mt-0.5">
                        {t("inProduction")}
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* 2. MedLex */}
              <div>
                <h3 className="font-serif text-[17px] font-semibold text-white mb-4">
                  {t("medlex")}
                </h3>
                <ul className="space-y-3 font-sans text-sm">
                  <li>
                    <Link
                      href={`/${locale}/founder`}
                      className="block text-[#c7d2de] hover:text-[#c5a059] transition-colors"
                    >
                      {t("founder")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${locale}/institutional`}
                      className="block text-[#c7d2de] hover:text-[#c5a059] transition-colors"
                    >
                      {t("institutional")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${locale}#faq`}
                      className="block text-[#c7d2de] hover:text-[#c5a059] transition-colors"
                    >
                      {t("questions")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${locale}/contact`}
                      className="block text-[#c7d2de] hover:text-[#c5a059] transition-colors"
                    >
                      {t("contact")}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* 3. Contact */}
              <div>
                <h3 className="font-serif text-[17px] font-semibold text-white mb-4">
                  {t("contact")}
                </h3>
                <div className="space-y-3 font-sans text-sm">
                  <a
                    href="mailto:support@medlexsolutions.com"
                    className="block text-[#c7d2de] hover:text-[#c5a059] transition-colors"
                  >
                    [support email]
                  </a>
                  <a
                    href="tel:+201019515321"
                    className="block text-[#c7d2de] hover:text-[#c5a059] transition-colors dir-ltr w-fit"
                  >
                    {t("phone")}
                  </a>
                  <Link
                    href={`/${locale === "en" ? "ar" : "en"}`}
                    className="block text-[#c7d2de] hover:text-[#c5a059] transition-colors"
                  >
                    {locale === "en" ? "العربية" : "English"}
                  </Link>
                  <div className="pt-2">
                    <Link
                      href={`/${locale}/contact`}
                      className="inline-flex items-center justify-center bg-[#c5a059] hover:bg-[#d4af37] text-[#0b1726] font-semibold text-xs sm:text-sm px-5 py-2.5 rounded shadow transition-all duration-200"
                    >
                      {t("register")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright and Legal */}
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-white/50 gap-4 font-sans">
            <p>{t("copyright")}</p>
            <div className="flex items-center gap-4">
              <Link
                href={`/${locale}/privacy`}
                className="hover:text-white transition-colors"
              >
                {t("privacy")}
              </Link>
              <span>·</span>
              <Link
                href={`/${locale}/terms`}
                className="hover:text-white transition-colors"
              >
                {t("terms")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
