"use client";

import { useTranslations } from "next-intl";
import LogoLoop from "@/components/LogoLoop";

interface MarqueeStripProps {
  locale?: string;
}

export default function MarqueeStrip({ locale }: MarqueeStripProps) {
  const t = useTranslations("marquee");
  const isRtl = locale === "ar";
  const items = (t.raw("items") as string[]) || [];

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
        ariaLabel={t("ariaLabel")}
      />
    </div>
  );
}
