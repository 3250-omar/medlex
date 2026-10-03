"use client";

import React, { createContext, useContext, useState, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePrivateSessionContext } from "../privateSessionQueries";

export type SessionOption = "none" | "1" | "5" | "10" | "custom";

export interface CascPricingContextValue {
  selectedOption: SessionOption;
  setSelectedOption: (opt: SessionOption) => void;
  customCount: number;
  setCustomCount: React.Dispatch<React.SetStateAction<number>>;
  singlePrice: number;
  pkg5Price: number;
  pkg10Price: number;
  coursePrice: number;
  currency: string;
  sessionsPrice: number;
  sessionsLabel: string;
  savingsAmount: number;
  totalPrice: number;
  formattedTotal: string;
  formattedCoursePrice: string;
  selectedPackageInfo: string;
  mainCtaLabel: string;
  formatPrice: (amount: number) => string;
}

const CascPricingContext = createContext<CascPricingContextValue | null>(null);

export function CascPricingProvider({
  courseData,
  children,
}: {
  courseData?: { price: number; currency: string } | null;
  children: React.ReactNode;
}) {
  const locale = useLocale();
  const t = useTranslations("cascHero");
  const isAr = locale === "ar";

  const { data: contextData } = usePrivateSessionContext("casc-academy");
  const offers = contextData?.offers || [];
  const directOffer = offers.find((o) => o.code === "direct");
  const pkg5Offer = offers.find((o) => o.code === "package_5");
  const pkg10Offer = offers.find((o) => o.code === "package_10");

  const singlePrice = directOffer ? directOffer.priceMinor / 100 : 120;
  const pkg5Price = pkg5Offer ? pkg5Offer.priceMinor / 100 : 540;
  const pkg10Price = pkg10Offer ? pkg10Offer.priceMinor / 100 : 960;
  const coursePrice = courseData?.price ?? 147;
  const currency = courseData?.currency || "GBP";

  const [selectedOption, setSelectedOption] = useState<SessionOption>("none");
  const [customCount, setCustomCount] = useState<number>(3);

  const formatPrice = useMemo(() => {
    return (amount: number) => {
      return new Intl.NumberFormat(isAr ? "ar-EG" : "en-GB", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }).format(amount);
    };
  }, [currency, isAr]);

  const { sessionsPrice, sessionsLabel, savingsAmount } = useMemo(() => {
    let price = 0;
    let label = "";
    let savings = 0;

    if (selectedOption === "none") {
      price = 0;
      label = t("noSessionsSelected");
    } else if (selectedOption === "1") {
      price = singlePrice;
      label = t("optSingle");
    } else if (selectedOption === "5") {
      price = pkg5Price;
      label = t("opt5");
      savings = singlePrice * 5 - pkg5Price;
    } else if (selectedOption === "10") {
      price = pkg10Price;
      label = t("opt10");
      savings = singlePrice * 10 - pkg10Price;
    } else if (selectedOption === "custom") {
      if (customCount === 5) {
        price = pkg5Price;
        savings = singlePrice * 5 - pkg5Price;
      } else if (customCount === 10) {
        price = pkg10Price;
        savings = singlePrice * 10 - pkg10Price;
      } else {
        price = customCount * singlePrice;
      }
      label = t("sessionsCount", { count: customCount });
    }

    return { sessionsPrice: price, sessionsLabel: label, savingsAmount: savings };
  }, [selectedOption, customCount, singlePrice, pkg5Price, pkg10Price, t]);

  const totalPrice = coursePrice + sessionsPrice;
  const formattedTotal = formatPrice(totalPrice);
  const formattedCoursePrice = formatPrice(coursePrice);

  const selectedPackageInfo = useMemo(() => {
    return selectedOption === "none"
      ? isAr
        ? "دورة CASC فقط"
        : "The CASC Academy (Course Only)"
      : isAr
        ? `دورة CASC + ${sessionsLabel}`
        : `The CASC Academy + ${sessionsLabel} Mentoring`;
  }, [isAr, selectedOption, sessionsLabel]);

  const mainCtaLabel = useMemo(() => {
    return isAr
      ? `الانضمام إلى قائمة الانتظار — ${formattedTotal}`
      : `Join Waitlist — ${formattedTotal}`;
  }, [isAr, formattedTotal]);

  const value: CascPricingContextValue = useMemo(
    () => ({
      selectedOption,
      setSelectedOption,
      customCount,
      setCustomCount,
      singlePrice,
      pkg5Price,
      pkg10Price,
      coursePrice,
      currency,
      sessionsPrice,
      sessionsLabel,
      savingsAmount,
      totalPrice,
      formattedTotal,
      formattedCoursePrice,
      selectedPackageInfo,
      mainCtaLabel,
      formatPrice,
    }),
    [
      selectedOption,
      customCount,
      singlePrice,
      pkg5Price,
      pkg10Price,
      coursePrice,
      currency,
      sessionsPrice,
      sessionsLabel,
      savingsAmount,
      totalPrice,
      formattedTotal,
      formattedCoursePrice,
      selectedPackageInfo,
      mainCtaLabel,
      formatPrice,
    ],
  );

  return (
    <CascPricingContext.Provider value={value}>
      {children}
    </CascPricingContext.Provider>
  );
}

export function useCascPricing(): CascPricingContextValue | null {
  return useContext(CascPricingContext);
}
