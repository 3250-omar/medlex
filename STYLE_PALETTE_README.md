# Medlex Foundations Style Palette & Design System

The Medlex Foundations interface is built on the authentic British academic and clinical design language established by The CASC Academy. Authoritative design tokens are in [`app/globals.css`](app/globals.css) and exposed directly via Tailwind CSS v4 `@theme inline`.

## Core Colour Tokens

| Token | Hex Value | Intended Use & Role |
| --- | --- | --- |
| `--navy` | `#1A365D` | Oxford / Royal Navy. Primary brand colour, header background, `.on-navy` sections, and headings on light surfaces. |
| `--navy2` | `#21436E` | Elevated Navy. Hover states, active controls, and secondary badges. |
| `--deep` | `#142A49` | Deepest Midnight Navy. Footer background, `.on-deep` closing sections, contrast cards, and high-focus surfaces. |
| `--gold` | `#D4AF37` | Classic MedLex Gold. Primary action buttons (`.btn-gold`), key highlights, pass indicators, focus rings, and accents. |
| `--goldd` | `#B08D2A` | Darker Antique Gold. Section kickers, counter numerals, and accent borders on light surfaces. |
| `--lgold` | `#E8D4A0` | Luminous Light Gold. Italic quotes, examiner reasoning emphasis, roles, and highlights on navy. |
| `--tint` | `#F6F2E6` | Warm Alabaster / Ivory. Alternating sections (`.on-tint`) providing warm, editorial contrast. |
| `--ink` | `#23303F` | Deep Slate Navy. High-contrast lead paragraphs and deep typography on light backgrounds. |
| `--char` | `#313538` | Charcoal. Default reading body copy on light and tint surfaces. |
| `--grey` | `#5C636C` | Medium Slate Grey. Secondary descriptions, hints, and neutral supporting text. |
| `--lbody` | `#D7DEE8` | Light Slate Body. Primary readable body copy on navy and deep midnight surfaces. |
| `--mute` | `#9DB0C7` | Muted Steel Blue. Captions, metadata, footer notes, and secondary trust labels on dark surfaces. |
| `--hair` | `#E6E6E0` | Subtle hairline divider for clean separation on light and card surfaces. |

## Typography & Geometry

- **Serif / Display Headings:** `Source Serif 4` (weights `400`, `600`, `700`, normal and italic), exposed as `var(--font-serif)` and `font-display`.
- **Sans / Interface & Body:** `Inter` (weights `400`, `500`, `600`, `700`), exposed as `var(--font-sans)` and `font-body`.
- **Headings hierarchy:**
  - `h1`: `font-family: var(--serif); font-size: clamp(36px, 5.4vw, 60px); font-weight: 700; line-height: 1.12;`
  - `h2`: `font-family: var(--serif); font-size: clamp(28px, 3.6vw, 40px); font-weight: 700; letter-spacing: -0.01em;`
  - `h3`: `font-family: var(--serif); font-size: 22px; font-weight: 700;`
  - `.lead`: `font-family: var(--serif); font-size: clamp(18px, 2vw, 21px); line-height: 1.5; color: var(--ink);`
  - `.kicker`: `font-family: var(--sans); font-weight: 600; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--goldd);`

## Button Styling

- **Pill Geometry:** Primary actions use pill-shaped geometry (`border-radius: 999px` / `rounded-full`) with `font-weight: 600` and `font-size: 15px`.
- `.btn-gold`: Background `#D4AF37`, text `#1A365D`, hover `#dcbc4e`.
- `.btn-navy`: Background `#1A365D`, text `#ffffff`, hover `#21436E`.
- `.btn-ghost`: Transparent background, white text, border `rgba(255, 255, 255, 0.55)`.
- Focus Treatment: `:focus-visible` renders a 3px solid `#D4AF37` outline with 3px offset.

## Section Rhythm & Themes

- `.on-navy`: Background `#1A365D`, text `#D7DEE8`, headings `#ffffff`.
- `.on-tint`: Background `#F6F2E6`, text `#313538`, headings `#1A365D`.
- `.on-deep`: Background `#142A49`, text `#D7DEE8`, headings `#ffffff`.
- `.pricecard`: White card with a 6px solid `#D4AF37` top border and 18px radius.

