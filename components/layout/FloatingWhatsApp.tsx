"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";

interface FloatingWhatsAppProps {
  phoneNumber?: string;
  formattedNumber?: string;
}

export default function FloatingWhatsApp({
  phoneNumber = "201019515321",
  formattedNumber = "+20 101 951 5321",
}: FloatingWhatsAppProps) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const [isHovered, setIsHovered] = useState(false);

  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  return (
    <aside
      aria-label={isAr ? "الدعم الفني عبر واتساب" : "WhatsApp Support"}
      className="fixed bottom-6 end-6 z-50 flex items-center gap-3 print:hidden select-none"
      dir={isAr ? "rtl" : "ltr"}
    >
      {/* Tooltip Card (visible on hover/focus or subtle peek) */}
      <div
        className={`pointer-events-none transition-all duration-300 ease-out origin-bottom-right ${
          isHovered
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-2 scale-95"
        }`}
        role="tooltip"
      >
        <div className="relative rounded-2xl border border-white/15 bg-[#0e1d38]/95 px-4 py-3 text-white shadow-2xl backdrop-blur-md">
          {/* Online status indicator */}
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
              {isAr ? "الدعم متاح الآن" : "WhatsApp Us"}
            </span>
          </div>

          {/* Number Display */}
          <div className="text-sm font-bold text-white tracking-wide" dir="ltr">
            {formattedNumber}
          </div>

          <p className="text-[11px] text-slate-300 mt-0.5">
            {isAr
              ? "انقر للمحادثة الفورية عبر واتساب"
              : "Click to chat directly with us"}
          </p>

          {/* Tooltip triangle tail */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#0e1d38] border-white/15 rotate-45 ${
              isAr
                ? "-left-1.5 border-b border-l"
                : "-right-1.5 border-t border-r"
            }`}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        aria-label={
          isAr
            ? `تواصل معنا عبر واتساب على ${formattedNumber}`
            : `WhatsApp Us at ${formattedNumber}`
        }
        className="group relative flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_25px_rgba(37,211,102,0.35)] transition-all duration-300 hover:scale-110 hover:bg-[#20ba59] hover:shadow-[0_12px_30px_rgba(37,211,102,0.5)] active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25D366]"
      >
        {/* Subtle breathing ripple */}
        <span
          className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none"
          aria-hidden="true"
        />

        {/* Official WhatsApp SVG Icon */}
        <svg
          viewBox="0 0 24 24"
          width="32"
          height="32"
          fill="currentColor"
          className="relative z-10 transition-transform duration-300 group-hover:rotate-6"
          aria-hidden="true"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      </a>
    </aside>
  );
}
