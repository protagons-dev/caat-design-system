---
version: alpha
name: CAAT Design System
description: Agent-readable visual identity and implementation guidance for CAAT Pension Plan digital experiences.
colors:
  primary: "#003750"
  primary-hover: "#0b5a80"
  primary-active: "#00283a"
  primary-mid: "#0f6791"
  primary-focus: "#2f95d2"
  primary-soft: "#e7f4fb"
  secondary: "#367f32"
  secondary-active: "#204b1f"
  secondary-brand: "#55a546"
  accent-lime: "#95e35c"
  accent-teal: "#12a7b8"
  surface: "#ffffff"
  surface-subtle: "#eff2f7"
  surface-muted: "#e8ecf1"
  surface-brand: "#003750"
  text: "#102637"
  text-heading: "#003750"
  text-muted: "#506273"
  text-inverse: "#ffffff"
  border: "#dfe6ef"
  border-strong: "#cbd7e3"
  border-interactive: "#6f7d8c"
  success-bg: "#d1e7dd"
  success-text: "#0a3622"
  warning-bg: "#fff3cd"
  warning-text: "#664d03"
  danger-bg: "#fde8e8"
  danger-text: "#58151c"
typography:
  display:
    fontFamily: Libre Franklin
    fontSize: 3.5rem
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  h1:
    fontFamily: Libre Franklin
    fontSize: 2.5rem
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  h2:
    fontFamily: Libre Franklin
    fontSize: 2rem
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  h3:
    fontFamily: Libre Franklin
    fontSize: 1.75rem
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  body-md:
    fontFamily: Libre Franklin
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0"
  lead:
    fontFamily: Libre Franklin
    fontSize: 1.25rem
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0"
  label-caps:
    fontFamily: Libre Franklin
    fontSize: 0.75rem
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.08em"
  body-small:
    fontFamily: Libre Franklin
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0"
rounded:
  sm: 0.375rem
  md: 0.75rem
  lg: 1.25rem
  hero: 4.5rem
  full: 999px
spacing:
  xxs: 0.25rem
  xs: 0.5rem
  sm: 0.75rem
  md: 1rem
  lg: 1.5rem
  xl: 2rem
  section: 4rem
  section-compact: 3rem
  section-large: 6rem
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-inverse}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 0.7rem 1.15rem
    height: 2.75rem
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.text-inverse}"
    rounded: "{rounded.md}"
  button-primary-active:
    backgroundColor: "{colors.primary-active}"
    textColor: "{colors.text-inverse}"
    rounded: "{rounded.md}"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.text-inverse}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 0.7rem 1.15rem
    height: 2.75rem
  button-outline-primary:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 0.7rem 1.15rem
    height: 2.75rem
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: 1.5rem
  hero-panel:
    backgroundColor: rgba(0,94,128,.94)
    textColor: "{colors.text-inverse}"
    rounded: "{rounded.hero}"
    padding: 2rem
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    height: 3.4rem
  badge:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.full}"
    padding: 0.35rem 0.65rem
---

# CAAT Design System

This file is the agent-readable design reference for Claude, Gemini/Google, Codex, and other LLM coding agents. It is derived from the live CSS token source at `public/assets/css/tokens.css` and the foundation pages in `public/foundations/`.

## Overview

CAAT digital experiences should feel trustworthy, clear, and quietly confident. The visual language is institutional but not cold: deep blue creates authority, green and lime add optimism, and generous white or pale grey space keeps complex pension information approachable.

Design work should prioritize clarity, accessibility, and repeatable patterns over novelty. The system is content-forward: headings are direct, components are practical, and section rhythm helps users scan dense plan, employer, article, and resource pages without decorative clutter.

Use the token front matter as the normative source for exact values. Use the prose below to decide how those values should be applied when generating new screens or components.

## Colors

The palette is anchored by CAAT blue and supported by accessible green actions, soft neutral surfaces, and restrained feedback colors.

- **Deep CAAT Blue (#003750):** Primary brand color. Use for headings, primary actions, dark section bands, selected states, and key navigation surfaces.
- **Action Blue Hover (#0b5a80):** Hover state for primary actions and links. It keeps interaction feedback visible without leaving the brand range.
- **Action Blue Active (#00283a):** Pressed state for primary actions. Use only for active or current interaction feedback.
- **Accessible CAAT Green (#367f32):** Secondary action color. This is the AA-safe green for white text; do not use the brighter brand green for text-bearing buttons.
- **Lime Accent (#95e35c):** High-energy accent used sparingly, especially eyebrow text on dark hero panels or brand bands.
- **Ink Text (#102637):** Default body text color. It should carry most reading surfaces.
- **Muted Text (#506273):** Secondary copy, metadata, captions, and supporting labels.
- **Subtle Surface (#eff2f7):** Alternating section background and quiet page blocks. It separates content without adding divider bands.
- **White (#ffffff):** Main page and card surface. Most components sit on white or subtle grey.
- **Borders (#dfe6ef / #cbd7e3):** Decorative dividers and card borders. Use the stronger border for tables and nested structure.

Feedback colors are semantic. Use success, warning, and danger backgrounds only for system messages, validation, status labels, and alerts. Do not use them as brand decoration.

## Typography

Use **Libre Franklin** for every UI surface. Do not introduce additional typefaces. The tone depends on confident weight, compact hierarchy, and readable line height rather than expressive font mixing.

- **Display:** 3.5rem, weight 900, tight line height. Reserve for true page-level display moments.
- **H1:** 2.5rem, weight 800. Use once per page or major template.
- **H2/H3:** 2rem and 1.75rem, weight 800. Use for section hierarchy and component page headings.
- **Body:** 1rem, weight 400, line-height 1.6. This is the default reading style.
- **Lead:** 1.25rem, weight 400. Use for page introductions and section summaries.
- **Eyebrow labels:** 0.75rem, uppercase, weight 700, letter-spacing 0.08em. Eyebrows are labels, not headings.

Headings use tight letter spacing and strong weight. Body copy should stay normal tracking. Long-form prose follows the rich-text rhythm: larger space before a new heading, smaller space after it so the heading stays attached to the paragraph it introduces.

## Layout

Pages are built from full-width vertical sections with constrained content inside Bootstrap containers. The background change is the divider; do not add thick rules, decorative separators, or empty spacer bands between page sections.

Use these section roles:

- **White sections:** Default for primary content, forms, articles, video embeds, and CTA transitions.
- **Grey sections:** Alternating content bands, card grids, testimonials, logo walls, and feature lists.
- **Brand blue sections:** High-emphasis moments such as stat strips, strength metrics, and final proof points. Use one or two per page at most.

Spacing follows a 4px-based scale. Standard page sections use 4rem vertical padding on desktop and compress one step on mobile. Components should use token spacing internally, with card grids generally using 1.25rem gaps and section headers capped near 44rem for readable measure.

Use Bootstrap breakpoints exactly as the system defines them: mobile below 768px, tablet 768px to 991.98px, and desktop at 992px and above. Prefer intrinsic responsiveness with grid, flex-wrap, aspect-ratio, and container widths before adding media queries.

## Elevation & Depth

Depth is present but restrained. Most hierarchy comes from color contrast, spacing, typography, and borders. Shadows should feel soft and blue-tinted, never heavy or generic black.

- **No shadow:** Flat content regions, tables, ordinary page sections.
- **Small shadow:** Raised cards and subtle hover feedback.
- **Default shadow:** Cards, framed media, hero surfaces, and standard elevated panels.
- **Medium shadow:** Dropdowns and popovers.
- **Large shadow:** Modals and focused overlays.
- **Hover lift:** Buttons lift 1px, list rows 2px, cards 3px, hero panels 4px.

Always pair hover elevation with a visible state change such as border color, background shade, or shadow. Respect `prefers-reduced-motion`; the base stylesheet already suppresses motion globally.

## Shapes

The system uses moderately rounded geometry. It should feel modern and approachable without becoming bubbly.

- **Small radius (0.375rem):** Inputs, small controls, Bootstrap-compatible utility radius.
- **Default radius (0.75rem):** Buttons, cards, compact panels, and most rectangular UI.
- **Large radius (1.25rem):** Hero frames, media cards, modals, and larger panels.
- **Hero signature radius (4.5rem):** Bottom-right corner of translucent hero panels only.
- **Full radius (999px):** Pills, badges, toggles, and compact status chips.

Do not mix sharp and rounded corners within the same component family. Use the hero signature corner only where the component is clearly behaving like a CAAT hero panel.

## Components

Build with the existing CAAT component classes and CSS tokens. Do not create one-off styles when a component already exists.

**Buttons:** Use `.caat-button` with the primary, secondary, outline, white-outline, link, size, loading, and full-mobile modifiers. Primary actions are deep blue. Secondary actions use accessible green. Buttons have 0.75rem radius, 2px transparent borders, clear hover/active states, and a solid blue focus ring.

**Cards:** Use `.caat-card` for grouped content. Cards are white, bordered, softly rounded, and lift on hover. Image cards must use an explicit aspect-ratio modifier such as 1:1, 4:5, 4:3, 3:2, or 16:9. Pick one ratio per grid.

**Hero panels:** Compose the layout-specific hero classes with `.caat-hero-panel`. The panel is translucent brand blue, uses inverse text, includes the signature bottom-right radius, and sits over real imagery or meaningful visual context.

**Forms:** Extend Bootstrap form controls through `.caat-form`. Inputs use small radius, a minimum 3.4rem height, interactive borders, and the shared focus ring. Labels are bold blue-heading text at small size.

**Section headers:** Use the Text/Title component patterns. Section headers are centered, max-width 44rem, and use restrained supporting copy.

**Navigation and footers:** Keep navigation surfaces utilitarian and scan-friendly. Link columns, side navigation, and in-page navigation should use clear labels, compact spacing, visible focus, and no decorative ornament.

**Feedback:** Use alerts, badges, toasts, and validation states semantically. A color should communicate status only when that status exists in the content.

## Do's and Don'ts

- Do use semantic CAAT tokens before primitives when writing component CSS.
- Do use deep CAAT blue for primary hierarchy and action, accessible green for secondary action, and lime only as a sparse accent.
- Do keep section backgrounds full width and content constrained inside containers.
- Do use the existing component classes, state classes, and ARIA attributes documented in the design system.
- Do maintain WCAG AA contrast for normal text and visible focus for every interactive element.
- Do keep typography in Libre Franklin and maintain the documented heading/body scale.
- Do use real image assets for heroes, cards, and media-led pages when the user needs to understand the actual subject.
- Don't hard-code new hex values when a CAAT token exists.
- Don't add decorative divider bands between page sections.
- Don't use the brighter brand green for white-text buttons; use the accessible green action token.
- Don't create nested cards or card-like page sections.
- Don't introduce extra typefaces, one-off border radii, or custom shadows.
- Don't use a blue brand band more than one or two times on a page.
- Don't use the hero signature radius on ordinary cards or controls.
