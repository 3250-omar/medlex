"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";

interface ArticleGalleryProps {
  images?: string[] | null;
  title: string;
  isRtl?: boolean;
}

export function ArticleGallery({
  images,
  title,
  isRtl = false,
}: ArticleGalleryProps) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const validImages = useMemo(() => {
    return Array.isArray(images)
      ? images.filter(
          (img): img is string => typeof img === "string" && img.trim().length > 0,
        )
      : [];
  }, [images]);

  const count = validImages.length;

  const toArabicNumerals = useCallback((n: number) => {
    return String(n).replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d, 10)]);
  }, []);

  const formatCounter = useCallback(
    (idx: number, total: number) => {
      if (isRtl) {
        return `${toArabicNumerals(idx + 1)} / ${toArabicNumerals(total)}`;
      }
      return `${idx + 1} / ${total}`;
    },
    [isRtl, toArabicNumerals],
  );

  const handlePrev = useCallback(() => {
    setIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  const handleNext = useCallback(() => {
    setIndex((prev) => (prev + 1) % count);
  }, [count]);

  const handleOpenLightbox = useCallback(() => {
    setLightboxOpen(true);
  }, []);

  const handleCloseLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const handleSelectImage = useCallback((i: number) => {
    setIndex(i);
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseLightbox();
      } else if (e.key === "ArrowLeft") {
        if (isRtl) handleNext();
        else handlePrev();
      } else if (e.key === "ArrowRight") {
        if (isRtl) handlePrev();
        else handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, isRtl, handlePrev, handleNext, handleCloseLightbox]);

  const currentImage = useMemo(() => {
    return validImages[index] || null;
  }, [validImages, index]);

  if (count === 0 || !currentImage) return null;

  return (
    <section
      className="mt-14 pt-8 border-t border-[#d6b03f]/25"
      aria-labelledby="gallery-heading"
    >
      <div className="flex justify-between items-baseline mb-4">
        <h2
          id="gallery-heading"
          className="font-serif font-medium text-2xl text-[#f3efe4]"
        >
          {isRtl ? "معرض صور المقال" : "Photo gallery"}
        </h2>
        <span className="text-sm text-[#a9b6cb]">
          {formatCounter(index, count)}
        </span>
      </div>

      {/* 16/9 Stage */}
      <div className="relative aspect-[16/9] rounded-[18px] overflow-hidden border border-[#d6b03f]/25 bg-[#0b1a30] group">
        <Image
          src={currentImage}
          alt={`${title} - image ${index + 1}`}
          fill
          sizes="(max-width: 1080px) 100vw, 1080px"
          className="object-cover transition-opacity duration-300"
        />

        {/* Click anywhere to open lightbox */}
        <button
          type="button"
          onClick={handleOpenLightbox}
          className="absolute inset-0 bg-transparent z-[1] cursor-zoom-in"
          aria-label={isRtl ? "عرض الصورة بحجم كامل" : "Open photo full screen"}
        />

        {/* Prev Arrow */}
        {count > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label={isRtl ? "الصورة السابقة" : "Previous photo"}
            className="absolute top-1/2 -translate-y-1/2 start-3.5 z-10 w-11 h-11 rounded-full border border-[#d6b03f]/30 bg-[#0b1a30]/85 text-[#e8cd7a] hover:bg-[#17305a] hover:border-[#d6b03f] flex items-center justify-center transition-colors shadow-md cursor-pointer"
          >
            <svg
              className={`w-5 h-5 stroke-current fill-none ${isRtl ? "rotate-180" : ""}`}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Next Arrow */}
        {count > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label={isRtl ? "الصورة التالية" : "Next photo"}
            className="absolute top-1/2 -translate-y-1/2 end-3.5 z-10 w-11 h-11 rounded-full border border-[#d6b03f]/30 bg-[#0b1a30]/85 text-[#e8cd7a] hover:bg-[#17305a] hover:border-[#d6b03f] flex items-center justify-center transition-colors shadow-md cursor-pointer"
          >
            <svg
              className={`w-5 h-5 stroke-current fill-none ${isRtl ? "rotate-180" : ""}`}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Expand Icon Badge */}
        <span
          aria-hidden="true"
          className="absolute top-3.5 end-3.5 z-10 w-9 h-9 rounded-lg border border-[#d6b03f]/30 bg-[#0b1a30]/85 text-[#e8cd7a] flex items-center justify-center pointer-events-none"
        >
          <svg
            className="w-4 h-4 stroke-current fill-none"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
          </svg>
        </span>
      </div>

      {/* Thumbnails Row */}
      {count > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 mt-3">
          {validImages.map((img, i) => {
            const isCurrent = i === index;
            return (
              <button
                key={img}
                type="button"
                onClick={() => handleSelectImage(i)}
                aria-current={isCurrent}
                aria-label={`${isRtl ? "صورة" : "Photo"} ${i + 1}`}
                className={`relative aspect-[16/10] rounded-[10px] overflow-hidden border-2 transition-all cursor-pointer ${
                  isCurrent
                    ? "border-[#d6b03f] opacity-100 ring-2 ring-[#d6b03f]/30"
                    : "border-transparent opacity-60 hover:opacity-90"
                }`}
              >
                <Image
                  src={img}
                  alt=""
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Full-Screen Lightbox Modal */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={isRtl ? "عارض الصور" : "Photo viewer"}
          className="fixed inset-0 z-50 bg-[#050c18]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 select-none"
          onClick={handleCloseLightbox}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={handleCloseLightbox}
            aria-label={isRtl ? "إغلاق" : "Close"}
            className="absolute top-5 end-5 z-20 w-11 h-11 rounded-full border border-[#d6b03f]/30 bg-[#17305a] text-[#f3efe4] hover:border-[#d6b03f] hover:text-[#e8cd7a] flex items-center justify-center transition-colors cursor-pointer"
          >
            <svg
              className="w-5 h-5 stroke-current fill-none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Lightbox Prev */}
          {count > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label={isRtl ? "السابق" : "Previous"}
              className="absolute top-1/2 -translate-y-1/2 start-5 z-20 w-12 h-12 rounded-full border border-[#d6b03f]/30 bg-[#17305a]/90 text-[#e8cd7a] hover:border-[#d6b03f] flex items-center justify-center transition-colors cursor-pointer"
            >
              <svg
                className={`w-6 h-6 stroke-current fill-none ${isRtl ? "rotate-180" : ""}`}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Lightbox Next */}
          {count > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label={isRtl ? "التالي" : "Next"}
              className="absolute top-1/2 -translate-y-1/2 end-5 z-20 w-12 h-12 rounded-full border border-[#d6b03f]/30 bg-[#17305a]/90 text-[#e8cd7a] hover:border-[#d6b03f] flex items-center justify-center transition-colors cursor-pointer"
            >
              <svg
                className={`w-6 h-6 stroke-current fill-none ${isRtl ? "rotate-180" : ""}`}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Image Container */}
          <div
            className="relative w-full max-w-5xl aspect-[16/9] rounded-xl overflow-hidden border border-[#d6b03f]/30 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={currentImage}
              alt={`${title} - large ${index + 1}`}
              fill
              sizes="1200px"
              priority
              className="object-contain"
            />
          </div>

          {/* Counter at bottom */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm text-[#a9b6cb] font-medium">
            {formatCounter(index, count)}
          </div>
        </div>
      )}
    </section>
  );
}
