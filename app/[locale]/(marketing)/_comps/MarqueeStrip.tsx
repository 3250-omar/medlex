"use client";

import LogoLoop from "@/components/LogoLoop";

interface MarqueeStripProps {
  locale?: string;
}

const ITEMS_EN = [
  "MEDICO-LEGAL EDUCATION",
  "COURT-READY REPORTING STANDARDS",
  "UK-TRAINED CONSULTANT LEADERSHIP",
  "THE CASC ACADEMY",
  "MEDLEX FOUNDATIONS",
  "WRITING PSYCHIATRIC EVIDENCE",
  "CASC EXAMINATION PREPARATION",
  "CLINICAL LEADERSHIP",
];

const ITEMS_AR = [
  "التعليم الطبي القانوني",
  "معايير التقارير الجاهزة للمحاكم",
  "قيادة استشارية بتدريب بريطاني",
  "أكاديمية CASC",
  "مِدلكس للتأسيس",
  "كتابة الأدلة النفسية",
  "التحضير لامتحان CASC",
  "القيادة السريرية",
];

export default function MarqueeStrip({ locale }: MarqueeStripProps) {
  const isRtl = locale === "ar";
  const items = isRtl ? ITEMS_AR : ITEMS_EN;

  const marqueeItems = items.map((item) => ({
    ariaLabel: item,
    node: (
      <span className="inline-flex h-12 items-center border-r rtl:border-r-0 rtl:border-l border-gold/15 px-8 font-sans text-[11px] font-medium uppercase rtl:normal-case tracking-[0.22em] rtl:tracking-normal text-mute">
        {item}
      </span>
    ),
  }));

  return (
    <div className="overflow-hidden border-y border-gold/15 bg-deep">
      <LogoLoop
        logos={marqueeItems}
        speed={42}
        direction={isRtl ? "right" : "left"}
        gap={0}
        fadeOut
        fadeOutColor="#142A49"
        ariaLabel="MedLex areas of expertise"
      />
    </div>
  );
}
