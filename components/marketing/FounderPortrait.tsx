import Image from "next/image";

interface FounderPortraitProps {
  src?: string;
  alt?: string;
  caption?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export default function FounderPortrait({
  src = "/images/dr-ahmed-abouelghit.webp",
  alt = "Dr. Ahmed Abouelghit",
  caption,
  className = "max-w-[330px]",
  sizes = "(max-width: 1024px) min(88vw, 330px), 330px",
  priority = false,
}: FounderPortraitProps) {
  return (
    <figure className={`relative mx-auto w-full lg:mx-0 ${className}`}>
      {/* Offset Signal Tint Accent */}
      <div
        className="absolute inset-y-3 -right-4 -z-0 w-full bg-signal/15 rtl:-right-auto rtl:-left-4 md:inset-y-4 md:-right-5 md:rtl:left-auto md:rtl:-left-5"
        aria-hidden="true"
      />
      <div className="relative z-10 aspect-[4/5] overflow-hidden border border-white/10 bg-accent">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover object-top"
        />

        {/* MedLex Monogram Seal Badge */}
        <span
          className="absolute right-3 top-3 grid size-11 place-items-center rounded-full border border-white/45 bg-ink/30 font-body text-[8.5px] leading-3 text-white backdrop-blur-sm rtl:right-auto rtl:left-3 md:right-4 md:top-4 md:size-12 md:text-[9px] md:rtl:right-auto md:rtl:left-4"
          aria-hidden="true"
        >
          MED
          <br />
          LEX
        </span>

        {/* Caption Overlay */}
        {caption && (
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/80 to-transparent px-4 pb-4 pt-14 font-body text-[9.5px] font-semibold uppercase tracking-[0.14em] text-white/90 md:px-5 md:pb-5 md:pt-16 md:text-[10px]">
            {caption}
          </figcaption>
        )}
      </div>
    </figure>
  );
}
