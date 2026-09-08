"use client";

import { useTranslations } from "next-intl";

interface InstitutionalDetailRowsProps {
  locale: string;
  onSelectService?: (serviceIndex: number) => void;
}

export default function InstitutionalDetailRows({
  locale,
  onSelectService,
}: InstitutionalDetailRowsProps) {
  const t = useTranslations("institutionalPage.details");
  const isRtl = locale === "ar";

  const services = [
    {
      id: "service-01",
      number: t("service1.number"),
      eyebrow: t("service1.eyebrow"),
      title: t("service1.title"),
      subtitle: t("service1.subtitle"),
      description: t("service1.description"),
      features: [
        t("service1.features.0"),
        t("service1.features.1"),
        t("service1.features.2"),
        t("service1.features.3"),
        t("service1.features.4"),
      ],
      spec: {
        eyebrow: t("service1.specCard.eyebrow"),
        items: [
          {
            label: t("service1.specCard.formatLabel"),
            value: t("service1.specCard.formatValue"),
          },
          {
            label: t("service1.specCard.timelineLabel"),
            value: t("service1.specCard.timelineValue"),
          },
          {
            label: t("service1.specCard.jurisdictionLabel"),
            value: t("service1.specCard.jurisdictionValue"),
          },
          {
            label: t("service1.specCard.clientsLabel"),
            value: t("service1.specCard.clientsValue"),
          },
        ],
        action: t("service1.specCard.action"),
      },
      formIndex: 0,
    },
    {
      id: "service-02",
      number: t("service2.number"),
      eyebrow: t("service2.eyebrow"),
      title: t("service2.title"),
      subtitle: t("service2.subtitle"),
      description: t("service2.description"),
      features: [
        t("service2.features.0"),
        t("service2.features.1"),
        t("service2.features.2"),
        t("service2.features.3"),
        t("service2.features.4"),
      ],
      spec: {
        eyebrow: t("service2.specCard.eyebrow"),
        items: [
          {
            label: t("service2.specCard.formatLabel"),
            value: t("service2.specCard.formatValue"),
          },
          {
            label: t("service2.specCard.timelineLabel"),
            value: t("service2.specCard.timelineValue"),
          },
          {
            label: t("service2.specCard.jurisdictionLabel"),
            value: t("service2.specCard.jurisdictionValue"),
          },
          {
            label: t("service2.specCard.clientsLabel"),
            value: t("service2.specCard.clientsValue"),
          },
        ],
        action: t("service2.specCard.action"),
      },
      formIndex: 1,
    },
    {
      id: "service-03",
      number: t("service3.number"),
      eyebrow: t("service3.eyebrow"),
      title: t("service3.title"),
      subtitle: t("service3.subtitle"),
      description: t("service3.description"),
      features: [
        t("service3.features.0"),
        t("service3.features.1"),
        t("service3.features.2"),
        t("service3.features.3"),
        t("service3.features.4"),
      ],
      spec: {
        eyebrow: t("service3.specCard.eyebrow"),
        items: [
          {
            label: t("service3.specCard.formatLabel"),
            value: t("service3.specCard.formatValue"),
          },
          {
            label: t("service3.specCard.timelineLabel"),
            value: t("service3.specCard.timelineValue"),
          },
          {
            label: t("service3.specCard.jurisdictionLabel"),
            value: t("service3.specCard.jurisdictionValue"),
          },
          {
            label: t("service3.specCard.clientsLabel"),
            value: t("service3.specCard.clientsValue"),
          },
        ],
        action: t("service3.specCard.action"),
      },
      formIndex: 2,
    },
    {
      id: "service-04",
      number: t("service4.number"),
      eyebrow: t("service4.eyebrow"),
      title: t("service4.title"),
      subtitle: t("service4.subtitle"),
      description: t("service4.description"),
      features: [
        t("service4.features.0"),
        t("service4.features.1"),
        t("service4.features.2"),
        t("service4.features.3"),
        t("service4.features.4"),
      ],
      spec: {
        eyebrow: t("service4.specCard.eyebrow"),
        items: [
          {
            label: t("service4.specCard.formatLabel"),
            value: t("service4.specCard.formatValue"),
          },
          {
            label: t("service4.specCard.timelineLabel"),
            value: t("service4.specCard.timelineValue"),
          },
          {
            label: t("service4.specCard.jurisdictionLabel"),
            value: t("service4.specCard.jurisdictionValue"),
          },
          {
            label: t("service4.specCard.clientsLabel"),
            value: t("service4.specCard.clientsValue"),
          },
        ],
        action: t("service4.specCard.action"),
      },
      formIndex: 3,
    },
  ];

  const handleActionClick = (formIndex: number) => {
    if (onSelectService) {
      onSelectService(formIndex);
    }
  };

  return (
    <div>
      {services.map((srv, idx) => {
        const isNavy = idx % 2 === 1;

        return (
          <section
            key={srv.id}
            id={srv.id}
            className={`py-20 lg:py-28 scroll-mt-24 ${
              isNavy
                ? "bg-navy text-lbody on-navy border-b border-white/10"
                : "bg-white text-char border-b border-slate-200/80"
            }`}
            aria-labelledby={`${srv.id}-heading`}
          >
            <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-12 lg:gap-16 xl:gap-20 items-start">
                {/* Main Content Column */}
                <div>
                  {/* Eyebrow with numbering */}
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-sm font-bold text-gold">
                      {srv.number}
                    </span>
                    <span className="h-0.5 w-7 bg-gold" aria-hidden="true" />
                    <span className="font-sans text-[11px] sm:text-xs uppercase tracking-[0.22em] text-gold font-semibold">
                      {srv.eyebrow}
                    </span>
                  </div>

                  {/* Service Heading */}
                  <h2
                    id={`${srv.id}-heading`}
                    className={`mt-4 font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight ${
                      isNavy ? "text-white!" : "text-navy!"
                    }`}
                  >
                    {srv.title}
                  </h2>

                  {/* Subtitle */}
                  <p className="mt-3 font-serif italic text-lg sm:text-xl text-gold font-semibold">
                    {srv.subtitle}
                  </p>

                  {/* Description */}
                  <p
                    className={`mt-5 font-sans text-base leading-relaxed max-w-3xl ${
                      isNavy ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    {srv.description}
                  </p>

                  {/* Capabilities Checklist */}
                  <div
                    className={`mt-8 pt-8 border-t ${
                      isNavy ? "border-white/15" : "border-slate-100"
                    }`}
                  >
                    <div
                      className={`font-sans text-[11px] uppercase tracking-[0.2em] font-semibold mb-5 ${
                        isNavy ? "text-gold" : "text-slate-500"
                      }`}
                    >
                      {isRtl
                        ? "نطاق الاختصاص والمخرجات"
                        : "Capabilities & Scope of Work"}
                    </div>
                    <ul className="space-y-3.5">
                      {srv.features.map((feat, fIdx) => (
                        <li
                          key={fIdx}
                          className={`flex items-start gap-3 font-sans text-sm leading-relaxed ${
                            isNavy ? "text-slate-200" : "text-slate-700"
                          }`}
                        >
                          <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-gold/60 bg-gold/15 text-gold font-bold text-xs">
                            ✓
                          </span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Sidebar Specification Card */}
                <div
                  className={`rounded-2xl p-7 sm:p-8 ${
                    isNavy
                      ? "border border-white/15 bg-deep/90 shadow-xl"
                      : "border border-gold/25 bg-white shadow-lg shadow-navy/5"
                  }`}
                >
                  {/* Header Tag */}
                  <div
                    className={`flex items-center justify-between pb-4 border-b ${
                      isNavy ? "border-white/10" : "border-slate-100"
                    }`}
                  >
                    <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-gold font-semibold">
                      {srv.spec.eyebrow}
                    </span>
                    <span
                      className={`font-serif text-xs font-bold ${
                        isNavy ? "text-white/50" : "text-slate-400"
                      }`}
                    >
                      {srv.number} / 04
                    </span>
                  </div>

                  {/* Specs list */}
                  <div className="mt-5 space-y-4">
                    {srv.spec.items.map((item, itIdx) => (
                      <div
                        key={itIdx}
                        className={`pb-3.5 border-b last:border-0 last:pb-0 ${
                          isNavy ? "border-white/10" : "border-slate-100"
                        }`}
                      >
                        <dt
                          className={`font-sans text-[11px] uppercase tracking-wider font-medium ${
                            isNavy ? "text-slate-400" : "text-slate-500"
                          }`}
                        >
                          {item.label}
                        </dt>
                        <dd
                          className={`mt-1 font-serif text-sm sm:text-base font-bold ${
                            isNavy ? "text-white" : "text-navy"
                          }`}
                        >
                          {item.value}
                        </dd>
                      </div>
                    ))}
                  </div>

                  {/* Action CTA Button */}
                  <div
                    className={`mt-8 pt-5 border-t ${
                      isNavy ? "border-white/10" : "border-slate-100"
                    }`}
                  >
                    <a
                      href="#institutional-inquiry"
                      onClick={() => handleActionClick(srv.formIndex)}
                      className={`w-full text-center !py-3.5 text-sm font-semibold inline-flex items-center justify-center gap-2 rounded-xl transition-all shadow-md ${
                        isNavy
                          ? "btn btn-gold !text-navy font-bold shadow-gold/10 hover:shadow-gold/20"
                          : "btn btn-navy shadow-navy/15 hover:shadow-navy/25"
                      }`}
                    >
                      <span>{srv.spec.action}</span>
                      <span aria-hidden="true" className="rtl:rotate-180">
                        {isRtl ? "←" : "→"}
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
