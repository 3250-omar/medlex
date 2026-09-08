"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { InterestDialogTrigger } from "@/components/marketing/InterestDialog";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "../_apiCalls/academyQueries";
import MarqueeStrip from "./MarqueeStrip";

interface HeroSectionProps {
  locale: string;
}

export default function HeroSection({ locale }: HeroSectionProps) {
  const t = useTranslations("home.hero");
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const heroRef = useRef<HTMLElement>(null);
  const guillocheRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = guillocheRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const guillocheCanvas = canvas;
    const drawingContext = context;
    let frame = 0;
    let time = 0;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    function draw() {
      const rect = guillocheCanvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      if (!width || !height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (
        guillocheCanvas.width !== Math.round(width * dpr) ||
        guillocheCanvas.height !== Math.round(height * dpr)
      ) {
        guillocheCanvas.width = Math.round(width * dpr);
        guillocheCanvas.height = Math.round(height * dpr);
      }
      drawingContext.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawingContext.clearRect(0, 0, width, height);
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.46;
      const goldVal = getComputedStyle(document.documentElement)
        .getPropertyValue("--gold")
        .trim();
      const accent =
        goldVal && !goldVal.startsWith("var") ? goldVal : "#D4AF37";
      const phase = time * 0.0016;
      drawingContext.strokeStyle = accent;
      drawingContext.lineWidth = 0.7;
      [
        { radius: 0.34, waves: 18, amplitude: 0.035 },
        { radius: 0.46, waves: 24, amplitude: 0.03 },
        { radius: 0.58, waves: 30, amplitude: 0.026 },
        { radius: 0.7, waves: 36, amplitude: 0.022 },
        { radius: 0.82, waves: 42, amplitude: 0.018 },
        { radius: 0.92, waves: 48, amplitude: 0.014 },
      ].forEach((ring, index) => {
        drawingContext.beginPath();
        drawingContext.globalAlpha = 0.4 - index * 0.035;
        const offset = phase * (index % 2 ? -1 : 1) * (1 + index * 0.12);
        for (let angle = 0; angle <= Math.PI * 2 + 0.01; angle += 0.008) {
          const radial =
            radius *
            (ring.radius +
              ring.amplitude *
                Math.sin(ring.waves * angle + offset * ring.waves));
          const x = centerX + radial * Math.cos(angle);
          const y = centerY + radial * Math.sin(angle);
          if (angle === 0) drawingContext.moveTo(x, y);
          else drawingContext.lineTo(x, y);
        }
        drawingContext.closePath();
        drawingContext.stroke();
      });
      drawingContext.globalAlpha = 0.16;
      drawingContext.beginPath();
      for (let angle = 0; angle <= Math.PI * 14 + 0.01; angle += 0.01) {
        const radial =
          radius * (0.52 + 0.28 * Math.cos(3.5 * angle + phase * 2));
        drawingContext.lineTo(
          centerX + radial * Math.cos(angle + phase * 0.4),
          centerY + radial * Math.sin(angle + phase * 0.4),
        );
      }
      drawingContext.stroke();
      drawingContext.globalAlpha = 0.42;
      drawingContext.beginPath();
      drawingContext.arc(centerX, centerY, radius * 0.99, 0, Math.PI * 2);
      drawingContext.stroke();
      drawingContext.globalAlpha = 0.2;
      drawingContext.beginPath();
      drawingContext.arc(centerX, centerY, radius * 1.05, 0, Math.PI * 2);
      drawingContext.stroke();
      drawingContext.globalAlpha = 0.3;
      for (let index = 0; index < 72; index += 1) {
        const angle = (index / 72) * Math.PI * 2 + phase * 0.15;
        const length = index % 6 === 0 ? 10 : 5;
        drawingContext.beginPath();
        drawingContext.moveTo(
          centerX + radius * 1.05 * Math.cos(angle),
          centerY + radius * 1.05 * Math.sin(angle),
        );
        drawingContext.lineTo(
          centerX + (radius * 1.05 + length) * Math.cos(angle),
          centerY + (radius * 1.05 + length) * Math.sin(angle),
        );
        drawingContext.stroke();
      }
      drawingContext.globalAlpha = 1;
    }
    const resizeObserver = new ResizeObserver(draw);
    resizeObserver.observe(guillocheCanvas);
    draw();
    function animate() {
      time += 1;
      draw();
      frame = requestAnimationFrame(animate);
    }
    if (!reduceMotion) frame = requestAnimationFrame(animate);
    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <section
      ref={heroRef}
      className="hero-shell on-navy relative flex min-h-screen flex-col overflow-hidden bg-[radial-gradient(ellipse_at_75%_35%,#21436E_0%,#1A365D_50%,#142A49_100%)] text-lbody"
      aria-label="MedLex hero"
    >
      <div className="relative flex w-full flex-1 items-center justify-center px-6 pb-14 pt-[calc(var(--header-h)+2rem)] sm:px-10 md:px-14 lg:px-20 xl:px-24 2xl:px-28">
        <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1.18fr)_minmax(0,.82fr)] lg:gap-14 xl:gap-20 2xl:gap-28">
          {/* Left */}
          <div className="w-full text-start max-w-3xl xl:max-w-4xl">
            {/* Eyebrow label */}
            <div className="hero-kicker mb-6 flex items-center justify-start gap-3">
              <span className="block h-px w-10 bg-gold/70" />
              <span className="font-sans text-[12px] uppercase tracking-[0.25em] text-gold font-semibold">
                {t("kicker")}
              </span>
            </div>

            {/* Headline */}
            <h1 className="hero-title mb-7 font-serif text-[clamp(42px,4.5vw,70px)] font-bold leading-[1.08] tracking-[-0.015em] text-white">
              <span className="hero-title-line">{t("line1")}</span>
              <span className="hero-title-line">
                {t("line2")}
                <em className="hero-answer not-italic text-gold">
                  {" "}
                  {t("answer")}
                </em>
              </span>
              <span className="hero-title-line">{t("line3")}</span>
            </h1>

            {/* Body */}
            <p className="hero-lede mb-8 max-w-[62ch] font-sans text-[18px] md:text-[20px] leading-[1.7] text-lbody">
              {t("body")}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-start gap-4">
              {user ? (
                <button
                  type="button"
                  onClick={() => router.push(`/${locale}/courses`)}
                  className="btn btn-gold !py-3.5 !px-8 text-sm font-semibold gap-2"
                >
                  Go to your courses
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                  >
                    <path d="M2.5 7h9M8.5 3.5L12 7l-3.5 3.5" />
                  </svg>
                </button>
              ) : (
                <InterestDialogTrigger className="btn btn-gold !py-3.5 !px-8 text-sm font-semibold gap-2">
                  {t("register")}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                  >
                    <path d="M2.5 7h9M8.5 3.5L12 7l-3.5 3.5" />
                  </svg>
                </InterestDialogTrigger>
              )}
              <a
                href="#pathways-heading"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("pathways-heading")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="btn btn-ghost !py-3.5 !px-8 text-sm font-semibold gap-2"
              >
                {t("pathways")}
              </a>
            </div>
          </div>

          <div
            className="hero-figure relative w-full max-w-lg md:max-w-xl lg:max-w-xl xl:max-w-2xl lg:ml-auto rtl:lg:mr-auto rtl:lg:ml-0"
            data-reveal
            style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
          >
            {/* Background compass/coordinate SVG centered directly on the image */}
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.24] z-0 select-none"
              aria-hidden="true"
            >
              <svg
                width="1100"
                height="1100"
                viewBox="0 0 900 900"
                fill="none"
                className="hero-astrolabe-spin w-[850px] h-[850px] sm:w-[980px] sm:h-[980px] md:w-[1100px] md:h-[1100px] lg:w-[1250px] lg:h-[1250px] xl:w-[1380px] xl:h-[1380px] max-w-none"
              >
                {/* Outermost precision tracks */}
                <circle
                  cx="450"
                  cy="450"
                  r="432"
                  stroke="#D4AF37"
                  strokeWidth="0.8"
                  opacity="0.45"
                />
                <circle
                  cx="450"
                  cy="450"
                  r="418"
                  stroke="#D4AF37"
                  strokeWidth="0.5"
                  opacity="0.35"
                />

                {/* Outer bezel calibration ticks (72 ticks, every 5 degrees) */}
                {Array.from({ length: 72 }, (_, i) => {
                  const deg = i * 5;
                  const isMajor = i % 6 === 0; // every 30 deg
                  const isMedium = i % 2 === 0; // every 10 deg
                  const len = isMajor ? 14 : isMedium ? 9 : 5;
                  const strokeWidth = isMajor ? 1.3 : isMedium ? 0.85 : 0.55;
                  const opacity = isMajor ? 0.65 : isMedium ? 0.45 : 0.28;
                  return (
                    <line
                      key={deg}
                      x1="450"
                      y1={450 - 432}
                      x2="450"
                      y2={450 - 432 + len}
                      stroke="#D4AF37"
                      strokeWidth={strokeWidth}
                      opacity={opacity}
                      transform={`rotate(${deg} 450 450)`}
                    />
                  );
                })}

                {/* 4 Cardinal Diamond Markers */}
                {[0, 90, 180, 270].map((deg) => (
                  <polygon
                    key={`diamond-${deg}`}
                    points="450,8 454,16 450,24 446,16"
                    fill="#D4AF37"
                    opacity="0.75"
                    transform={`rotate(${deg} 450 450)`}
                  />
                ))}

                {/* Nested orbital measurement rings */}
                <circle
                  cx="450"
                  cy="450"
                  r="384"
                  stroke="#D4AF37"
                  strokeWidth="0.75"
                  strokeDasharray="4 8"
                  opacity="0.32"
                />
                <circle
                  cx="450"
                  cy="450"
                  r="340"
                  stroke="#D4AF37"
                  strokeWidth="0.7"
                  strokeDasharray="24 8 6 8"
                  opacity="0.3"
                />
                <circle
                  cx="450"
                  cy="450"
                  r="285"
                  stroke="#D4AF37"
                  strokeWidth="0.6"
                  opacity="0.22"
                />
                <circle
                  cx="450"
                  cy="450"
                  r="230"
                  stroke="#D4AF37"
                  strokeWidth="0.75"
                  strokeDasharray="12 8"
                  opacity="0.28"
                />
                <circle
                  cx="450"
                  cy="450"
                  r="175"
                  stroke="#D4AF37"
                  strokeWidth="0.6"
                  opacity="0.2"
                />
                <circle
                  cx="450"
                  cy="450"
                  r="115"
                  stroke="#D4AF37"
                  strokeWidth="0.75"
                  strokeDasharray="4 4"
                  opacity="0.32"
                />

                {/* Major crosshairs with central aperture */}
                <line
                  x1="450"
                  y1="18"
                  x2="450"
                  y2="360"
                  stroke="#D4AF37"
                  strokeWidth="0.7"
                  opacity="0.5"
                />
                <line
                  x1="450"
                  y1="540"
                  x2="450"
                  y2="882"
                  stroke="#D4AF37"
                  strokeWidth="0.7"
                  opacity="0.5"
                />
                <line
                  x1="18"
                  y1="450"
                  x2="360"
                  y2="450"
                  stroke="#D4AF37"
                  strokeWidth="0.7"
                  opacity="0.5"
                />
                <line
                  x1="540"
                  y1="450"
                  x2="882"
                  y2="450"
                  stroke="#D4AF37"
                  strokeWidth="0.7"
                  opacity="0.5"
                />

                {/* Measurement hatch marks on crosshair axes */}
                {[200, 260, 320, 380].map((dist) => (
                  <g
                    key={`hatch-${dist}`}
                    stroke="#D4AF37"
                    strokeWidth="0.8"
                    opacity="0.45"
                  >
                    <line x1="446" y1={450 - dist} x2="454" y2={450 - dist} />
                    <line x1="446" y1={450 + dist} x2="454" y2={450 + dist} />
                    <line x1={450 - dist} y1="446" x2={450 - dist} y2="454" />
                    <line x1={450 + dist} y1="446" x2={450 + dist} y2="454" />
                  </g>
                ))}

                {/* Diagonal radials (45°, 135°, 225°, 315°) */}
                {[45, 135, 225, 315].map((deg) => (
                  <g key={`diag-${deg}`} transform={`rotate(${deg} 450 450)`}>
                    <line
                      x1="450"
                      y1="32"
                      x2="450"
                      y2="310"
                      stroke="#D4AF37"
                      strokeWidth="0.6"
                      strokeDasharray="6 10"
                      opacity="0.3"
                    />
                    <circle
                      cx="450"
                      cy="66"
                      r="2"
                      fill="#D4AF37"
                      opacity="0.55"
                    />
                  </g>
                ))}

                {/* Intermediate radial indicators at 15°, 75°, 105°, etc. */}
                {[15, 75, 105, 165, 195, 255, 285, 345].map((deg) => (
                  <line
                    key={`inter-${deg}`}
                    x1="450"
                    y1={450 - 418}
                    x2="450"
                    y2={450 - 375}
                    stroke="#D4AF37"
                    strokeWidth="0.55"
                    strokeDasharray="2 6"
                    opacity="0.25"
                    transform={`rotate(${deg} 450 450)`}
                  />
                ))}
              </svg>
            </div>

            {/* Image frame */}
            <canvas
              ref={guillocheRef}
              className="hero-guilloche"
              aria-hidden="true"
            />
            <div
              className="hero-frame relative z-10 overflow-hidden rounded-2xl border border-gold/30 bg-deep/80 shadow-2xl"
              style={{ aspectRatio: "4 / 3.2" }}
            >
              {/* Prototype photo treatment */}
              <div className="hero-photo relative h-full w-full">
                <Image
                  src="/images/medlex-hero-evidence.webp"
                  alt="A model brain examined under a magnifying glass"
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 42vw"
                  className="object-cover grayscale-[10%] contrast-[1.06]"
                />{" "}
                <div className="hero-evidence-tint" aria-hidden="true" />
                <div className="hero-scan" aria-hidden="true" />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-deep/90 via-deep/25 to-transparent"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Callout badge */}
            <div className="hero-stamp absolute -bottom-6 left-0 z-30 rtl:left-auto rtl:right-0">
              <b>3</b>
              <span>{t("badge")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-20 mt-auto w-full">
        <MarqueeStrip />
      </div>

      {/* Bottom subtle transition */}
      <div
        className="pointer-events-none absolute bottom-0 inset-x-0 z-10 h-24 bg-gradient-to-t from-deep via-deep/40 to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}
