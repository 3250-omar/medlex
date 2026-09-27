"use client";

import * as React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { Images } from "lucide-react";

interface ArticleGalleryCarouselProps {
  images: string[];
  title?: string;
  isRtl?: boolean;
}

export function ArticleGalleryCarousel({
  images,
  title,
  isRtl = false,
}: ArticleGalleryCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const count = images?.length ?? 0;
  const [current, setCurrent] = React.useState(1);

  React.useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
    };

    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  if (!images || images.length === 0) return null;

  return (
    <>
      <section className="mx-auto max-w-[860px] mt-12 pt-8 border-t border-white/10 select-none">
        {/* Section Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gold/10 border border-gold/30 text-gold">
              <Images className="size-4" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-white font-normal">
              {isRtl ? "معرض صور المقال" : "Article Photo Gallery"}
            </h3>
          </div>

          {/* Counter Badge */}
          {count > 1 && (
            <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-navy2/80 border border-white/10 text-xs font-mono text-gold tracking-wider shadow-sm">
              <span>{current}</span>
              <span className="mx-1 text-white/40">/</span>
              <span className="text-white/70">{count}</span>
            </div>
          )}
        </div>

        {/* Main Carousel Container */}
        <div className="relative px-2 sm:px-0">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
              direction: isRtl ? "rtl" : "ltr",
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-3 sm:-ml-4">
              {images.map((imgUrl, index) => (
                <CarouselItem
                  key={index}
                  className={cn(
                    "pl-3 sm:pl-4",
                    images.length === 1
                      ? "basis-full"
                      : "basis-full sm:basis-[85%] md:basis-[80%]",
                  )}
                >
                  <div
                    className="group relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/15 bg-navy2/60 shadow-2xl transition-all duration-300 hover:border-gold/50"
                  >
                    <Image
                      src={imgUrl}
                      alt={`${title || "Article image"} - ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 860px"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      priority={index === 0}
                    />

                    {/* Aesthetic subtle bottom gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity pointer-events-none" />

                    {/* Index badge inside slide */}
                    <div className="absolute top-3 end-3 px-2 py-0.5 rounded-md bg-navy/80 backdrop-blur-md border border-white/10 text-[11px] font-mono text-white/80">
                      #{index + 1}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation Controls (Visible when more than 1 image) */}
            {images.length > 1 && (
              <>
                <CarouselPrevious className="hidden sm:inline-flex -start-5 border-gold/40 hover:border-gold bg-navy/90 text-gold hover:bg-gold hover:text-navy" />
                <CarouselNext className="hidden sm:inline-flex -end-5 border-gold/40 hover:border-gold bg-navy/90 text-gold hover:bg-gold hover:text-navy" />
              </>
            )}
          </Carousel>

          {/* Thumbnail Dots Bar below Carousel */}
          {images.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-5">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => api?.scrollTo(idx)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                    current === idx + 1
                      ? "w-6 bg-gold shadow-sm"
                      : "w-1.5 bg-white/20 hover:bg-white/40",
                  )}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
