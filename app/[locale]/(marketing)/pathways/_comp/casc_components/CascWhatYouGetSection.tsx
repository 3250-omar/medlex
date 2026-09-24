import Image from "next/image";
import { useTranslations } from "next-intl";

export default function CascWhatYouGetSection() {
  const t = useTranslations("cascWhatYouGet");

  const whatYouGetItems = [
    {
      title: t("item1Title"),
      how: t("item1How"),
      desc: t("item1Desc"),
      image: "/images/sectionImages/station_section.png",
    },
    {
      title: t("item2Title"),
      how: t("item2How"),
      desc: t("item2Desc"),
      image: "/images/sectionImages/book_section.png",
    },
    {
      title: t("item3Title"),
      how: t("item3How"),
      desc: t("item3Desc"),
      image: "/images/sectionImages/whatsapp_section.jpeg",
    },
    {
      title: t("item4Title"),
      how: t("item4How"),
      desc: t("item4Desc"),
      image: "/images/sectionImages/new.jpg",
    },
    {
      title: t("item5Title"),
      how: t("item5How"),
      desc: t("item5Desc"),
      image: "/images/sectionImages/certificate_section.jpeg",
    },
  ];

  return (
    <section
      id="included"
      className="py-20 lg:py-24 border-b border-white/10 bg-navy text-lbody on-navy scroll-mt-16"
    >
      <div className="mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10">
        <p className="kicker text-gold">{t("kicker")}</p>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold leading-tight text-white">
          {t("title")}
        </h2>
        <p className="mt-4 font-serif text-lg sm:text-xl text-lbody max-w-3xl leading-relaxed">
          {t("subtitle")}
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
