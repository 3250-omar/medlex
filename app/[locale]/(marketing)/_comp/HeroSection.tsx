"use client";

import { type PointerEvent, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { InterestDialogTrigger } from "@/components/marketing/InterestDialog";
import MarqueeStrip from "./MarqueeStrip";

interface HeroSectionProps {
  locale: string;
}

export default function HeroSection({ locale }: HeroSectionProps) {
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
      const accent = getComputedStyle(document.documentElement)
        .getPropertyValue("--signal")
        .trim();
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
  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    heroRef.current?.style.setProperty(
      "--hero-x",
      (((event.clientX - bounds.left) / bounds.width - 0.5) * 2).toFixed(3),
    );
    heroRef.current?.style.setProperty(
      "--hero-y",
      (((event.clientY - bounds.top) / bounds.height - 0.5) * 2).toFixed(3),
    );
  }

  function resetPointer() {
    heroRef.current?.style.setProperty("--hero-x", "0");
    heroRef.current?.style.setProperty("--hero-y", "0");
  }
  return (
    <section
      ref={heroRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      className="hero-shell relative flex min-h-screen flex-col overflow-hidden bg-[radial-gradient(circle_at_68%_42%,#17334b_0%,#0b1a2e_52%,#071525_100%)]"
      aria-label="Hero â€” MedLex"
    >
      {/* â”€â”€ Geometric background decoration â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.07]"
        aria-hidden="true"
      >
        <svg width="700" height="700" viewBox="0 0 700 700" fill="none">
          {[320, 270, 210, 150].map((r) => (
            <circle
              key={r}
              cx="350"
              cy="350"
              r={r}
              stroke="var(--signal)"
              strokeWidth="0.6"
            />
          ))}
          <line
            x1="350"
            y1="30"
            x2="350"
            y2="670"
            stroke="var(--signal)"
            strokeWidth="0.4"
          />
          <line
            x1="30"
            y1="350"
            x2="670"
            y2="350"
            stroke="var(--signal)"
            strokeWidth="0.4"
          />
          <line
            x1="124"
            y1="124"
            x2="576"
            y2="576"
            stroke="var(--signal)"
            strokeWidth="0.4"
          />
          <line
            x1="576"
            y1="124"
            x2="124"
            y2="576"
            stroke="var(--signal)"
            strokeWidth="0.4"
          />
        </svg>
      </div>

      <div
        className="relative mx-auto flex w-full flex-1 items-center px-6 py-32 md:px-8 lg:px-12"
        style={{ maxWidth: "var(--content-max)" }}
      >
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,.92fr)] lg:gap-14">
          {/* â”€â”€ Left â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div>
            {/* Eyebrow label */}
            <div className="hero-kicker mb-7 flex items-center gap-4">
              <span className="block h-px w-12 bg-signal opacity-70" />
              <span className="font-body text-[10px] uppercase tracking-[0.3em] text-white/50">
                Forensic &amp; Medicolegal Psychiatry Â· MENA
              </span>
            </div>

            {/* Headline */}
            <h1 className="hero-title mb-9 font-display text-[clamp(38px,5vw,64px)] leading-[1.06] tracking-[-0.012em] text-white!">
              <span className="hero-title-line">Where medicine</span>
              <span className="hero-title-line">
                is asked to{" "}
                <em className="hero-answer not-italic text-signal">answer</em>
              </span>
              <span className="hero-title-line">to the court.</span>
            </h1>

            {/* Body */}
            <p className="hero-lede mb-9 max-w-[52ch] font-body text-[18px] leading-[1.7] text-white/65">
              MedLex trains psychiatrists to produce evaluations that survive
              cross-examination, and gives courts, prosecutors, and ministries
              psychiatric evidence built to a documented standard.
            </p>

            {/* CTAs */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <InterestDialogTrigger className="inline-flex items-center gap-2 border border-signal px-7 py-3.5 font-body text-sm tracking-wide text-signal transition-all duration-200 hover:bg-signal hover:text-ink">
                Register your interest
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
              <Link
                href={`/${locale}/pathways`}
                className="inline-flex items-center gap-2 border border-white/20 px-7 py-3.5 font-body text-sm tracking-wide text-white/70 transition-all duration-200 hover:border-white/50 hover:text-white"
              >
                The three pathways
              </Link>
            </div>
          </div>

          {/* â”€â”€ Right â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div
            className="hero-figure relative mx-auto w-full max-w-xl lg:ml-auto lg:max-w-xl"
            data-reveal
            style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
          >
            {/* Image frame */}
            <canvas
              ref={guillocheRef}
              className="hero-guilloche"
              aria-hidden="true"
            />
            <div
              className="hero-frame relative border border-white/10 bg-accent/30"
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
                  className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Callout badge */}
            <div className="hero-stamp absolute -bottom-7 left-0 z-30">
              <b>3</b>
              <span>
                Educational pathways, one for each professional audience
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-20 mt-auto w-full">
        <MarqueeStrip />
      </div>

      {/* Bottom fade-to-paper */}
      <div
        className="pointer-events-none absolute bottom-0 inset-x-0 z-10 h-20 bg-gradient-to-t from-ink to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}
