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
    <div className="divide-y divide-white/10 bg-paper">
      {services.map((srv, idx) => (
        <section
          key={srv.id}
          id={srv.id}
          className="py-20 lg:py-28 scroll-mt-24"
          aria-labelledby={`${srv.id}-heading`}
        >
          <div
            className="mx-auto w-full px-6 md:px-8 lg:px-12"
            style={{ maxWidth: "var(--content-max)" }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-12 lg:gap-16 items-start">
              {/* Main Content Column */}
              <div>
                {/* Eyebrow with numbering */}
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold text-signal">
                    {srv.number}
                  </span>
                  <span className="h-px w-6 bg-white/20" aria-hidden="true" />
                  <span className="font-body text-[10px] uppercase tracking-[0.2em] text-muted font-semibold">
                    {srv.eyebrow}
                  </span>
                </div>

                {/* Service Heading */}
                <h2
                  id={`${srv.id}-heading`}
                  className="mt-4 font-display text-3xl md:text-4xl lg:text-5xl text-white font-normal leading-tight"
                >
                  {srv.title}
                </h2>

                {/* Subtitle */}
                <p className="mt-3 font-display text-lg sm:text-xl text-signal font-normal">
                  {srv.subtitle}
                </p>

                {/* Description */}
                <p className="mt-5 font-body text-sm sm:text-base text-muted leading-relaxed max-w-3xl">
                  {srv.description}
                </p>

                {/* Capabilities Checklist */}
                <div className="mt-8 pt-8 border-t border-white/10">
                  <div className="font-body text-[11px] uppercase tracking-[0.2em] text-white/60 font-semibold mb-5">
                    {isRtl ? "نطاق الاختصاص والمخرجات" : "Capabilities & Scope of Work"}
                  </div>
                  <ul className="space-y-3.5">
                    {srv.features.map((feat, fIdx) => (
                      <li
                        key={fIdx}
                        className="flex items-start gap-3 font-body text-xs sm:text-sm text-white/85 leading-relaxed"
                      >
                        <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-signal/40 bg-signal/10 text-signal">
                          <svg
                            className="h-2.5 w-2.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sidebar Specification Card */}
              <div className="bg-surface/90 border border-white/10 p-6 sm:p-8 relative">
                {/* Header Tag */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <span className="font-body text-[10px] uppercase tracking-[0.2em] text-signal font-semibold">
                    {srv.spec.eyebrow}
                  </span>
                  <span className="font-mono text-xs text-white/40">
                    {srv.number} / 04
                  </span>
                </div>

                {/* Specs list */}
                <div className="mt-5 space-y-4">
                  {srv.spec.items.map((item, itIdx) => (
                    <div key={itIdx} className="pb-3.5 border-b border-white/5 last:border-0 last:pb-0">
                      <dt className="font-body text-[10px] uppercase tracking-wider text-muted font-medium">
                        {item.label}
                      </dt>
                      <dd className="mt-1 font-body text-xs sm:text-sm text-white font-medium">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </div>

                {/* Action CTA Button */}
                <div className="mt-8 pt-5 border-t border-white/10">
                  <a
                    href="#institutional-inquiry"
                    onClick={() => handleActionClick(srv.formIndex)}
                    className="w-full inline-flex items-center justify-center bg-signal hover:bg-signal-light text-ink font-body text-xs uppercase tracking-wider font-semibold py-3.5 px-4 transition-colors"
                  >
                    <span>{srv.spec.action}</span>
                    <span className="ms-1.5" aria-hidden="true">
                      {isRtl ? "←" : "→"}
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
