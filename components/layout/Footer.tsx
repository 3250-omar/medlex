import Link from "next/link";
import Container from "./Container";

const QUICK_LINKS = [
  { label: "Courses", href: "/courses" },
  { label: "For Institutions", href: "/institutional" },
  { label: "About Dr. Ahmed", href: "/founder" },
  { label: "Pathways", href: "/pathways" },
];

const LEGAL_LINKS = [
  { label: "Terms of Use", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Refund Policy", href: "/refund-policy" },
];

interface FooterProps {
  locale: string;
}

export default function Footer({ locale }: FooterProps) {
  return (
    <footer className="bg-ink text-white">
      {/* ── Pre-footer CTA ───────────────────────────────────────── */}
      <div className="border-b border-white/10">
        <Container className="py-14">
          <div className="flex flex-col items-center justify-between gap-8 text-center lg:flex-row lg:text-left">
            <div>
              <h2 className="font-display text-2xl text-white lg:text-3xl">
                Advance Your Expertise. Serve Justice Better.
              </h2>
              <p className="mt-2 font-body text-sm text-white/40">
                Join thousands of professionals elevating standards in forensic and medicolegal psychiatry.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Link
                href={`/${locale}/courses`}
                className="bg-signal px-7 py-3 text-center font-body text-sm tracking-wide text-ink transition-colors hover:bg-signal-light"
              >
                Explore Courses →
              </Link>
              <Link
                href={`/${locale}/institutional`}
                className="border border-white/20 px-7 py-3 text-center font-body text-sm tracking-wide text-white transition-colors hover:border-white/50"
              >
                Institutional Services
              </Link>
            </div>
          </div>
        </Container>
      </div>

      {/* ── Footer body ──────────────────────────────────────────── */}
      <Container className="py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center border border-signal/30">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M7 1L13 7L7 13L1 7L7 1Z" stroke="var(--signal)" strokeWidth="1" />
                </svg>
              </span>
              <span className="font-display text-[13px] tracking-[0.2em] text-white">MEDLEX</span>
            </div>
            <p className="font-body text-xs leading-relaxed text-white/35">
              Advancing medicolegal psychiatry through structured education and expert consultation.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-5 font-body text-[9px] uppercase tracking-[0.2em] text-white/35">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-3">
              {QUICK_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={`/${locale}${l.href}`}
                    className="font-body text-sm text-white/55 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-5 font-body text-[9px] uppercase tracking-[0.2em] text-white/35">
              Legal
            </h3>
            <ul className="flex flex-col gap-3">
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={`/${locale}${l.href}`}
                    className="font-body text-sm text-white/55 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="mb-5 font-body text-[9px] uppercase tracking-[0.2em] text-white/35">
              Connect
            </h3>
            <a
              href="mailto:info@medlex.academy"
              className="font-body text-sm text-white/55 transition-colors hover:text-white"
            >
              info@medl ex.academy
            </a>
            {/* Social */}
            <div className="mt-6 flex gap-4">
              <a
                href="#"
                aria-label="LinkedIn"
                className="text-white/25 transition-colors hover:text-signal"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="X / Twitter"
                className="text-white/25 transition-colors hover:text-signal"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="font-body text-xs text-white/25">
            © {new Date().getFullYear()} MEDLEX. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href={`/${locale}/privacy`}
              className="font-body text-xs text-white/25 transition-colors hover:text-white/60"
            >
              Privacy Policy
            </Link>
            <Link
              href={`/${locale}/terms`}
              className="font-body text-xs text-white/25 transition-colors hover:text-white/60"
            >
              Terms of Use
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
