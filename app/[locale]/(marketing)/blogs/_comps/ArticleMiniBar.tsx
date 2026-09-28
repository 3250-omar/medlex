"use client";

import { useEffect, useState, useCallback } from "react";
import { HeaderUserAction } from "@/components/layout/_comp/header";

interface ArticleMiniBarProps {
  title: string;
  isRtl?: boolean;
}

export function ArticleMiniBar({ title }: ArticleMiniBarProps) {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);

  const calculateProgress = useCallback(() => {
    const doc = document.documentElement;
    const totalScroll = doc.scrollTop || window.scrollY || 0;
    const maxScroll = doc.scrollHeight - doc.clientHeight || 1;
    const currentProgress = Math.min(
      100,
      Math.max(0, (totalScroll / maxScroll) * 100),
    );
    setProgress(currentProgress);

    // Show mini bar as soon as user starts scrolling
    setShow(totalScroll > 50);
  }, []);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          calculateProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    const rafId = window.requestAnimationFrame(calculateProgress);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [calculateProgress]);

  return (
    <aside
      aria-label="Reading progress"
      aria-hidden={!show}
      className={`fixed inset-x-0 top-0 z-50 bg-[#0b1a30]/95 backdrop-blur-md border-b border-[#d6b03f]/25 transition-transform duration-300 ${
        show ? "translate-y-0" : "-translate-y-full pointer-events-none"
      }`}
    >
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
        <span className="font-serif text-base sm:text-lg text-[#f3efe4] truncate max-w-[200px] sm:max-w-md md:max-w-xl font-medium">
          {title}
        </span>
        <HeaderUserAction />
      </div>
      <div
        className="absolute -bottom-px inset-s-0 h-[2px] bg-[#d6b03f] transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </aside>
  );
}
