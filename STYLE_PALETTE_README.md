# Medlex Foundations Style Palette & Design System

The Medlex Foundations interface is built on the authentic British academic, medicolegal, and clinical design language established by The CASC Academy. It synthesises traditional institutional gravitas (Oxford Navy, Antique Gold, and editorial serifs) with modern, accessible, high-performance web engineering.

Authoritative design tokens are defined in [`app/globals.css`](app/globals.css) and exposed directly via Tailwind CSS v4 `@theme inline`.

---

## 1. Core Colour Palette

### 1.1 Base Brand Tokens

| Token     | Hex Value | Intended Use & Role                                                                                                                     |
| --------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `--navy`  | `#1A365D` | Oxford / Royal Navy. Primary brand colour, top navigation bar, `.on-navy` sections, and headings on light surfaces.                     |
| `--navy2` | `#21436E` | Elevated Navy. Hover states, interactive controls, active badges, and secondary surfaces.                                               |
| `--deep`  | `#142A49` | Midnight Navy. Page footer background, `.on-deep` closing sections, contrast cards, and high-focus surfaces.                            |
| `--gold`  | `#D4AF37` | Classic MedLex Gold. Primary action buttons (`.btn-gold`, `variant="gold"`), key highlights, pass indicators, focus rings, and accents. |
| `--goldd` | `#B08D2A` | Darker Antique Gold. Section kickers, eyebrows, counter numerals, and accent borders on light surfaces.                                 |
| `--lgold` | `#E8D4A0` | Luminous Light Gold. Italic quotes, examiner reasoning emphasis, roles, and highlights on navy.                                         |
| `--tint`  | `#F6F2E6` | Warm Alabaster / Ivory. Alternating sections (`.on-tint`) providing warm, editorial contrast.                                           |
| `--ink`   | `#23303F` | Deep Slate Navy. High-contrast lead paragraphs, dropdown menus, and deep typography on light backgrounds.                               |
| `--char`  | `#313538` | Charcoal. Default reading body copy on light and tint surfaces.                                                                         |
| `--grey`  | `#5C636C` | Medium Slate Grey. Secondary descriptions, hints, metadata, and neutral supporting text.                                                |
| `--lbody` | `#D7DEE8` | Light Slate Body. Primary readable body copy on navy and deep midnight surfaces.                                                        |
| `--mute`  | `#9DB0C7` | Muted Steel Blue. Captions, metadata, footer notes, and secondary trust labels on dark surfaces.                                        |
| `--hair`  | `#E6E6E0` | Subtle hairline divider for clean separation on light and card surfaces (rendered as `rgba(230, 230, 224, 0.16)` in dark mode).         |

### 1.2 Clinical & Evaluation Status Indicators

Derived from the CASC examination and medicolegal evaluation rubric systems:

| Token / Class    | Hex / Value                | Intended Use & Role                                               |
| ---------------- | -------------------------- | ----------------------------------------------------------------- |
| `--red`          | `#EF4444`                  | Critical errors, fail indicators, and clinical contraindications. |
| `--red-bg`       | `#FAF1F1`                  | Soft tint background for failure points and warning callouts.     |
| `--red-border`   | `#D9B8B8`                  | Subtle border for failure/warning containers.                     |
| `--green`        | `#10B981`                  | Pass indicators, verified stations, and success criteria.         |
| `--green-bg`     | `rgba(16, 185, 129, 0.12)` | Soft tint background for passed stations and achievements.        |
| `--green-border` | `rgba(16, 185, 129, 0.35)` | Border for passed station containers and validated badges.        |

### 1.3 Semantic Theme Mappings

Variables in `:root` map core tokens to semantic layout roles:

```css
--paper: var(--navy);
--surface: var(--navy2);
--surface-2: var(--deep);
--line: rgba(255, 255, 255, 0.14);
--text: #ffffff;
--muted: var(--mute);
--accent: var(--navy);
--accent-2: var(--navy2);
--accent-soft: rgba(255, 255, 255, 0.12);
--signal: var(--gold);
--signal-light: var(--lgold);
--glow: rgba(212, 175, 55, 0.15);
--content-max: 1200px;
--header-h: 72px; /* 144px when exam countdown ticker is active */
```

### 1.4 Tailwind CSS v4 `@theme inline` Utilities

The design system exports utilities directly into the Tailwind engine:

- **Colours:** `bg-navy`, `bg-navy2`, `bg-deep`, `bg-gold`, `bg-goldd`, `bg-lgold`, `bg-tint`, `bg-ink`, `bg-char`, `bg-lbody`, `bg-mute`, `bg-hair`, `bg-paper`, `bg-surface`, `bg-surface-2`.
- **Text:** `text-navy`, `text-gold`, `text-goldd`, `text-lgold`, `text-lbody`, `text-mute`, `text-char`, `text-ink`.
- **Borders:** `border-hair`, `border-line`, `border-gold`, `border-navy`.

---

## 2. Typography & Hierarchy

The typographic system combines a distinguished editorial serif for authority and headings with a legible sans-serif for operational interface elements and data density.

### 2.1 Font Families

| Role                           | Font Family                      | Weights                               | CSS Variable / Tailwind Alias                                     |
| ------------------------------ | -------------------------------- | ------------------------------------- | ----------------------------------------------------------------- |
| **Serif / Display / Headings** | `Source Serif 4`, Georgia, serif | `400`, `600`, `700` (normal & italic) | `var(--font-serif)`, `font-serif`, `font-display`, `font-heading` |
| **Sans / Interface / Body**    | `Inter`, system-ui, sans-serif   | `400`, `500`, `600`, `700`            | `var(--font-sans)`, `font-sans`, `font-body`                      |

_Note: Backward-compatibility aliases `ovo` (pointing to `Source Serif 4`) and `manrope` (pointing to `Inter`) are provided in [`lib/fonts.ts`](lib/fonts.ts)._

### 2.2 Typographic Hierarchy & Utility Classes

- **`h1` (Display Title):**  
  `font-family: var(--serif); font-size: clamp(36px, 5.4vw, 60px); font-weight: 700; line-height: 1.12;`
- **`h2` (Section Title):**  
  `font-family: var(--serif); font-size: clamp(28px, 3.6vw, 40px); font-weight: 700; letter-spacing: -0.01em; line-height: 1.15;`
- **`h3` (Subsection Title):**  
  `font-family: var(--serif); font-size: 22px; font-weight: 700;`
- **`.lead` (Editorial Lead Paragraph):**  
  `font-family: var(--serif); font-size: clamp(18px, 2vw, 21px); line-height: 1.5; color: var(--ink); max-width: 62ch;` (on dark surfaces, inherits `var(--lbody)`).
- **`.kicker` (Section Kicker / Overline):**  
  `font-family: var(--sans); font-weight: 600; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--goldd); margin-bottom: 14px;`
- **`.eyebrow` (Compact Eyebrow):**  
  `font-family: var(--sans); font-weight: 700; font-size: 11.5px; letter-spacing: 0.17em; text-transform: uppercase; color: var(--goldd);`
- **`.pull` (Pullquote / Highlight Callout):**  
  `font-family: var(--serif); font-size: 24px; line-height: 1.35; color: var(--navy); border-top: 3px solid var(--gold); padding-top: 18px;`
- **`.measure` (Optimal Reading Length):**  
  `max-width: 64ch;`
- **Selection Highlight:**  
  `::selection` applies `background-color: var(--gold); color: var(--navy);`.
- **Focus Ring:**  
  `:focus-visible` applies `outline: 3px solid var(--gold); outline-offset: 3px; border-radius: 1px;`.

---

## 3. Button & Interactive Action System

Medlex standardises on pill-shaped geometry (`rounded-full` / `border-radius: 999px`) for primary marketing and clinical actions, with rectangular rounded-lg elements reserved for dense interface controls.

### 3.1 CSS Utility Buttons

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--sans);
  font-weight: 600;
  font-size: 15px;
  padding: 14px 26px;
  border-radius: 999px;
  border: 2px solid transparent;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    transform 0.15s ease;
}
.btn:hover {
  transform: translateY(-1px);
}
```

- **`.btn-gold`**: Background `#D4AF37`, text `#1A365D`, border `#D4AF37`. Hover: `#dcbc4e`.
- **`.btn-navy`**: Background `#1A365D`, text `#ffffff`, border `#1A365D`. Hover: `#21436E`.
- **`.btn-ghost`**: Transparent background, text `#ffffff`, border `rgba(255, 255, 255, 0.55)`. Hover: `rgba(255, 255, 255, 0.08)`.

### 3.2 React Component (`@/components/ui/button.tsx`)

Built on `@base-ui/react/button` with `class-variance-authority`:

- **Variants:**
  - `default`: Primary gold action (`bg-primary text-primary-foreground hover:bg-[#dcbc4e]`).
  - `gold`: Explicit brand gold pill button (`bg-gold text-navy border-2 border-gold hover:bg-[#dcbc4e] font-semibold`).
  - `navy`: Explicit brand navy pill button (`bg-navy text-white border-2 border-navy hover:bg-navy2 font-semibold`).
  - `pillGhost`: Transparent on dark background with subtle white border (`border-2 border-white/55 hover:bg-white/10`).
  - `outline`: Secondary border-styled button (`border-border bg-background hover:bg-muted`).
  - `secondary`: Muted dark navy badge button (`bg-secondary text-secondary-foreground`).
  - `ghost`: Transparent hover button for icons and subtle items.
  - `destructive`: Soft red alert button (`bg-destructive/10 text-destructive hover:bg-destructive/20`).
  - `link`: Pure text link button with underline on hover.
- **Sizes:**
  - `pill`: `h-11 px-6 rounded-full text-[15px]` (standard marketing CTA).
  - `default`: `h-8 gap-1.5 px-2.5 text-sm`.
  - `sm`, `xs`, `lg`: Compact or extended interface buttons.
  - `icon`, `icon-sm`, `icon-xs`, `icon-lg`: Square icon actions.

---

## 4. Section Rhythm & Surface Contrast

Pages alternate between dark and light thematic bands to maintain reader engagement and visual authority.

| Section Class / Surface | Background                | Text Colour                | Heading Colour            | Typical Application                                    |
| ----------------------- | ------------------------- | -------------------------- | ------------------------- | ------------------------------------------------------ |
| **`.on-navy`**          | `#1A365D` (`var(--navy)`) | `#D7DEE8` (`var(--lbody)`) | `#FFFFFF`                 | Hero headers, primary pathway highlights, lead-ins.    |
| **`.on-tint`**          | `#F6F2E6` (`var(--tint)`) | `#313538` (`var(--char)`)  | `#1A365D` (`var(--navy)`) | Editorial essays, institutional case studies, quotes.  |
| **`.on-deep`**          | `#142A49` (`var(--deep)`) | `#D7DEE8` (`var(--lbody)`) | `#FFFFFF`                 | Closing CTA banners, footers, high-focus review cards. |
| **Standard Light**      | `#FFFFFF`                 | `#313538` (`var(--char)`)  | `#1A365D` (`var(--navy)`) | Curriculum tables, station details, forms, FAQs.       |

---

## 5. Architectural & Editorial Components

### 5.1 Pricing & Tier Cards (`.pricecard`)

The authentic British academic tier card format:

- **Card Body:** Pure white `#ffffff`, `border-radius: 18px`, `padding: 36px`, `box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12)`.
- **Top Accent:** `border-top: 6px solid var(--gold)`.
- **Big Numeral (`.big`):** `font-family: var(--serif); font-size: 64px; font-weight: 700; color: var(--navy); line-height: 1;`.
- **Feature List:** Bulleted with gold em-dash (`content: "— "; color: var(--gold);`) separated by `--hair` borders.

### 5.2 Hero Architectural & Motion System

- **Guilloche Canvas (`<canvas>`):** Procedural geometric curves drawn continuously with `var(--gold)` (`#D4AF37`) at 0.7px line width, evoking banknotes and classical academic diplomas.
- **Astrolabe Spin (`.hero-astrolabe-spin`):** Continuous 120s celestial rotational motion (`spinCounterClockwise`).
- **Photo Duotone Grade (`.hero-photo`):** Grayscale and olive evidence monochrome filter treatment (`grayscale(1) sepia(0.42) saturate(0.62) contrast(1.08) brightness(0.88)`), receded beneath a legal gradient overlay.
- **Hero Stamp (`.hero-stamp`):** Floating credential badge with `border-inline-start: 3.5px solid var(--gold)`, deep navy background `#142A49`, and bold serif callout numeral.
- **Answer Accent (`.hero-answer`):** Highlight bar under key words rendered in `#405775`.

### 5.3 Motion Tokens & Accessibility

- **Easing:** `--ease-editorial: cubic-bezier(0.22, 1, 0.36, 1)`.
- **Entrance Animation:** `--motion-enter: 700ms`.
- **Classes:**
  - `.reveal`: Gentle 14px slide and fade-in over 700ms.
  - `.reveal-delay-1`: 90ms delay.
  - `.reveal-delay-2`: 180ms delay.
  - `--animate-marquee`: Infinite 35s linear horizontal loop.
- **Reduced Motion:** Strict `@media (prefers-reduced-motion: reduce)` rules disable all spins, canvas calculations, and translations.

### 5.4 Dynamic UI Patterns

- **`SpotlightCard`:** Mouse-following radial highlight effect (`radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)`).
- **`LogoLoop`:** Smooth, infinite marquee displaying partner institutions and regulatory bodies.
- **`ExamCountdown` & `Counter`:** Real-time countdown clock in the navigation bar displaying days, hours, minutes, and seconds until upcoming CASC/examination sittings.

---

## 6. Brand Identity & Logo Assets

### 6.1 Official Brand Assets

- **Header Emblem:** [`public/images/new-emblem.png`](public/images/new-emblem.png) (and transparent variant `new-emblem-transparent.png`). Gold crest badge enclosed in a subtle bordered navy frame.
- **Footer & Lockup:** [`public/images/new-logo design.jpg`](public/images/new-logo%20design.jpg) / [`public/images/new-logo-lockup.png`](public/images/new-logo-lockup.png) / [`public/images/new-logo-transparent.png`](public/images/new-logo-transparent.png). Complete brand identity with bilingual emblem and institutional descriptor.

### 6.2 Brand Typographic Lockup

When rendered as live interface typography:

- **Title:** `font-display text-[13px] tracking-[0.2em] text-white` (`MEDLEX`).
- **Subtitle / Descriptor:** `font-body text-[8px] tracking-[0.15em] text-white/40 uppercase` (`FORENSIC & MEDICOLEGAL PSYCHIATRY`).

---

## 7. Directionality & Internationalization (RTL / LTR)

Medlex is engineered for seamless bilingual delivery in English (`en`) and Arabic (`ar`):

- **Logical CSS Properties:** Layouts use `inset-inline-start`, `inset-inline-end`, `border-inline-start`, `padding-inline`, and `margin-inline` rather than left/right primitives.
- **Text Alignment:** Handled responsively via `text-start` and `text-end`.
- **Kickers & Dividers:** Align to the leading reading edge dynamically across both scripts.
- **Font Rendering:** `Inter` and `Source Serif 4` provide clean optical weight parity alongside Arabic system typography.
