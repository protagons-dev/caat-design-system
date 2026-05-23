# CAAT Design System — Gaps, Opportunities & Recommendations

> A working reference for fleshing out the design system comprehensively. Each item states **what's there now**, **the gap**, **the recommendation**, and **the rationale**. Use the priority tags to sequence the work.
>
> **Context:** Static Bootstrap 5 documentation site → backing an AEM-authored CAAT Pension Plan website (Ontario). Each of the 32 components already ships a strong 14-section AEM authoring contract (Summary, Tokens, Authoring Fields, Validation, Content Guidance, Semantic HTML, CSS Contract, Accessibility, SEO, Analytics, AEM Notes, Dialog Model, QA Checklist, Definition of Done).
>
> **Last updated:** 2026-05-23

---

## How to read this document

| Tag | Meaning |
|---|---|
| **P0** | Foundational or legal. Blocks consistency or compliance; do first. |
| **P1** | High value. Common decisions teams hit within weeks; resolve early. |
| **P2** | Maturity. Rounds out the system; schedule deliberately. |

**Legal anchor:** CAAT (>50 employees, Ontario) is bound by the **AODA**, which requires **WCAG 2.0 AA today and WCAG 2.2 AA by 2027** ([Level Access](https://www.levelaccess.com/blog/aoda-compliance-requirements-for-websites/)). Build to **2.2 AA now** to avoid rework. Accessibility items below are flagged accordingly.

---

## Executive summary

**What's genuinely strong:** the per-component AEM contract is more rigorous than most public design systems — authoring fields, validation, analytics, and a Definition of Done are rare and valuable. Responsive behavior and content guidance are documented on every component.

**The core problem:** the system is **strong at the component layer but thin at the foundation layer**, and **silent on cross-cutting decisions** that every component quietly depends on. Three symptoms:

1. **Tokens are values, not a system.** There's a rich colour palette but no type scale, no spacing scale, no motion/z-index/breakpoint tokens, and no separation between *raw values* and *intent*. Font sizes are hand-picked per component (`.72rem`, `.78rem`, `.82rem`, `.84rem`, `.92rem`…), which is the tell-tale sign of a missing scale.
2. **Recurring patterns are defined three different ways.** The eyebrow is the clearest example (see §B1) — it exists as `.eyebrow`, `.caat-title__eyebrow`, and `.caat-feature-hero__eyebrow`, with different sizes, weights, and colours. Each divergence is a decision nobody made on purpose.
3. **Whole categories of decision are undocumented:** dark mode, motion, iconography, interaction states, bilingual EN/FR, imagery, and a stated accessibility target. These will be decided ad hoc — inconsistently — the first time each comes up, unless articulated now.

**The recommendation in one line:** add a **foundations layer** (token tiers + 8 missing scales), **consolidate the recurring patterns** into single documented decisions, and **fill the ~25 missing components/patterns** — several of which are core to a pension website (calculators, multi-step enrolment, plan comparison).

---

# Part A — Foundational / token gaps

The current `tokens.css` is a flat list of ~60 values. Modern systems organize tokens in **three tiers** ([W3C Design Tokens CG](https://www.w3.org/community/design-tokens/), spec reached first stable version Oct 2025):

- **Primitive** (raw): `--caat-blue-500: #2f95d2`
- **Semantic** (intent): `--color-action-primary: var(--caat-blue-900)`
- **Component** (context): `--button-bg-primary: var(--color-action-primary)`

> Pragmatic note: industry experience is that *two* tiers (primitive + semantic) is what usually survives contact with a real codebase; component tokens only where a component genuinely needs to override ([Robin Cannon](https://www.robin-cannon.com/p/the-design-token-cargo-cult)). **Recommendation: adopt primitive + semantic now; add component tokens only on demand.** This single change is what makes dark mode and rebranding tractable later.

### A1. Type scale — **P0**
- **Now:** font families, 3 letter-spacing tokens. No font-size, line-height, or weight tokens. Sizes chosen per component.
- **Gap:** no shared scale → inconsistent hierarchy, impossible to tune globally.
- **Recommend:** a named modular scale with paired line-heights, e.g.
  ```css
  --font-size-2xs: .75rem;  --line-2xs: 1.4;   /* eyebrows, captions, badges */
  --font-size-xs:  .875rem; --line-xs: 1.45;   /* fine print, table cells   */
  --font-size-sm:  .9375rem;--line-sm: 1.5;
  --font-size-md:  1rem;    --line-md: 1.6;    /* body (current default)    */
  --font-size-lg:  1.125rem;--line-lg: 1.55;   /* lead paragraph            */
  --font-size-xl:  1.5rem;  --line-xl: 1.3;    /* h3                        */
  --font-size-2xl: 2rem;    --line-2xl: 1.2;   /* h2                        */
  --font-size-3xl: 2.75rem; --line-3xl: 1.1;   /* h1 / display              */
  ```
  Plus weight tokens (`--font-weight-regular/semibold/bold/extrabold: 400/600/700/800`) — the system already leans on 600/700/800/900 informally.
- **Rationale:** the type scale is the backbone of hierarchy. Without it, "what size is a card subtitle" is re-decided every time. Pair with line-heights so French text (≈30% longer) wraps predictably.

### A2. Spacing scale — **P0**
- **Now:** ad-hoc rem values + Bootstrap utilities; section rhythm is documented narratively in `page-layout.html` but not tokenized.
- **Recommend:** a 4px-based scale (`--space-1: .25rem` … `--space-16: 4rem`) and *reference it* in component CSS and the layout guide.
- **Rationale:** consistent spacing is the cheapest way to look intentional. Tokenizing the rhythm that `page-layout.html` already describes makes it enforceable, not just advisory.

### A3. Semantic colour layer + AODA contrast audit — **P0 (legal)** · ✅ RESOLVED (2026-05-23)

> **Done:** Semantic colour layer added (Part A intro). Contrast audit scripted (`scripts/contrast-audit.js`) and run over 34 required pairings — **all pass AA**. Three failures fixed at the token layer: focus ring (was `rgba(...,.35)` 1.47:1 → solid blue-500, 3.31:1 light / 3.82:1 dark), secondary button (white on `--caat-green` 3.06:1 → green-700 fill 4.95:1), form-control borders (grey-200 1.26:1 → new `--caat-color-border-interactive` / `grey-500` 4.21:1). Usage restrictions documented for warning/teal/lime/blue-300/dividers; disabled text noted as WCAG-exempt. Results live on the Design Tokens page (Contrast section). Re-run the script after any colour change.

- **Now:** ~40 colour values including good alert/status sets. But roles are implicit (`--bs-primary` = blue-900) and **contrast is unverified**.
- **Gap:** no semantic names (`--color-text-default`, `--color-bg-subtle`, `--color-border`, `--color-action-primary`, `--color-focus`), and no record that `--caat-blue (#0f6791)` on white, `--caat-muted (#506273)`, lime selection, etc. meet **4.5:1** (text) / **3:1** (large text & UI).
- **Recommend:** (1) introduce a semantic colour layer; (2) run a contrast audit of every foreground/background pairing and record pass/fail in the tokens page; (3) fix or restrict any pair that fails AA. Pay special attention to: muted text on tinted backgrounds, green/lime on white, status text colours, and link colour on coloured sections.
- **Rationale:** AODA makes this non-optional. Doing it at the token layer means every component inherits compliant colour automatically.

### A4. Dark mode strategy — **P1 (decide now, build later)**
- **Now:** documented on exactly 1 of 32 components (dropdown). No theme tokens.
- **Gap:** no decision on whether dark mode is in scope. Retrofitting later is expensive; designing the semantic layer for it now is nearly free.
- **Recommend:** make an explicit **yes/no/deferred** call. If yes or deferred, structure semantic tokens so a `[data-theme="dark"]` block can re-point them — don't hardcode `#fff`/`#102637` in components. Document the decision even if it's "not now."
- **Rationale:** "we'll add dark mode later" is only cheap if the token architecture anticipated it. The semantic layer (A3) is the enabling move.

### A5. Elevation scale — **P2**
- **Now:** 2 shadows (`--caat-shadow`, `--caat-shadow-sm`) + focus ring.
- **Recommend:** a 4–5 step elevation scale mapped to roles (raised card / sticky header / dropdown / modal / toast) so layering reads as a system.
- **Rationale:** consistent elevation communicates depth and focus order; two shadows force overloading.

### A6. Z-index / layering scale — **P1**
- **Now:** z-index values are **hardcoded and undocumented** (skip-link `2000`, drawer `1051/1050/1049`; Bootstrap uses 1000–1090 internally).
- **Gap:** no map → stacking bugs (modal behind sticky nav, toast behind backdrop) are inevitable, and they collide with Bootstrap's own range.
- **Recommend:** a documented scale that *coexists with Bootstrap's* (`--z-base:0; --z-sticky:1020; --z-drawer:1045; --z-backdrop:1050; --z-modal:1055; --z-popover:1070; --z-toast:1090; --z-skiplink:1100`).
- **Rationale:** layering is invisible until it breaks, then it's a frustrating bug class. A single ordered list prevents it.

### A7. Motion tokens + reduced motion — **P1 (a11y)**
- **Now:** transitions are inline and inconsistent (`.15s`, `.25s ease`); motion is documented on ~19/32 components; no global `prefers-reduced-motion` rule.
- **Recommend:** duration tokens (`--motion-fast:120ms; --motion-base:200ms; --motion-slow:320ms`) and easing tokens (`--ease-standard`, `--ease-emphasized`), plus a global:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, ::before, ::after { animation-duration:.01ms !important; transition-duration:.01ms !important; }
  }
  ```
- **Rationale:** consistent timing makes the UI feel coherent; the reduced-motion query is a WCAG 2.2 expectation and trivial to add once.

### A8. Breakpoint tokens + radius/border/opacity — **P2**
- **Now:** relies on Bootstrap breakpoints implicitly; only 2 radii; no border-width or opacity tokens.
- **Recommend:** document the breakpoint set explicitly (even if "same as Bootstrap"), extend radius to a small scale (`sm/md/lg/pill`), and add `--border-width-1/2` and a couple of opacity tokens for disabled/overlay states.
- **Rationale:** "which breakpoint do we design to" and "how round is a pill" are real recurring questions; cheap to answer once.

### A9. Iconography system — **P1**
- **Now:** Bootstrap Icons via CDN, used freely; no guidance.
- **Gap:** no rules on sizing, alignment, semantic vs decorative (`aria-hidden`), custom/brand icons (e.g., pension-specific), or colour. No icon inventory.
- **Recommend:** a foundations page covering icon sizes (tokenized: 16/20/24/32), stroke/visual weight pairing with type, accessibility (`aria-hidden="true"` for decorative, labelled for meaningful), the approved set, and the process for adding a custom icon.
- **Rationale:** icons drift fastest of any element. A pension site will need domain icons (statements, calculators, retirement) that Bootstrap Icons won't cover.

---

# Part B — Cross-cutting design decisions to articulate

These aren't components — they're decisions that *every* component inherits. Each needs a single documented answer.

### B1. Eyebrow / kicker — the worked example — **P1** · ✅ RESOLVED (2026-05-23)
This is the canonical case the brief calls out, so it's treated in full as a template for the others.

> **Done:** consolidated to a single canonical `.caat-eyebrow` (+ `.caat-eyebrow--on-dark`) driven by semantic tokens (`--caat-text-eyebrow-*`, `--caat-color-eyebrow` / `-on-dark`). Canonical spec **.75rem / 700 / .08em / uppercase / blue-700**, on-dark **blue-300**. Legacy classes (`.eyebrow`, `.caat-title__eyebrow`, `.caat-feature-hero__eyebrow`) now consume the same tokens (deprecated aliases — non-breaking). Unified the feature-hero light colour (was green-700) to blue-700. **On-dark decision (confirmed):** neutral default `--caat-color-eyebrow-on-dark` = blue-300 for general use; **hero eyebrows keep the lime brand accent** via `--caat-color-eyebrow-on-dark-hero` = lime (applied to `caat-hero-card`, `caat-feature-hero--dark`, `caat-feature-hero--fullbleed`). Guidance (when/when-not, length, FR, semantics) added to the Design Tokens foundations page.

**Now — three divergent definitions:**
| Class | Where | Size | Weight | Colour | Case |
|---|---|---|---|---|---|
| `.eyebrow` | `caat-base.css` | .78rem | 800 | `--caat-blue-700` | uppercase |
| `.caat-title__eyebrow` | text-title | .75rem | 700 | (per tokens doc) | uppercase |
| `.caat-feature-hero__eyebrow` | feature hero | varies | — | — | — |

Plus a documentation-only use of `.eyebrow` as a section label inside the doc site itself ("Components", "On this page") — a *fourth* meaning, conflating "eyebrow" (a content pattern) with "overline label" (UI chrome).

**The decision to articulate — recommend a single `Eyebrow` foundation entry covering:**
- **Definition & intent:** a short kicker *above a heading* for **categorization/context only** — never load-bearing information. If the headline doesn't stand alone without it, the structure is wrong ([UX Movement](https://uxmovement.com/content/increasing-headline-clicks-with-eyebrow-text/)).
- **When to use:** above a page/section title to label topic, series, or content type. **When *not* to:** above sub-headings within body content; as a substitute for a real heading; for critical info.
- **One token-driven style:** `--font-size-2xs`, weight 700–800, `--caat-letter-spacing-label`, uppercase. Define the **on-light** colour (`--caat-blue-700`) **and an on-dark variant** (the hero/feature uses sit on imagery — currently unspecified, a real bug source).
- **Length rule:** target ≤ 24 characters / 2–3 words; specify truncation/wrap behavior. **Note French expansion** — set a max that survives ≈30% longer FR strings.
- **Semantics & accessibility:** an eyebrow is **not a heading**. Mark it up as a `<p>`/`<span>` *inside* or *adjacent to* the heading, or use the "eyebrow-as-`<small>`-within-`<h1>`" pattern so screen readers announce one coherent heading — don't create a phantom `<h*>` that pollutes the document outline ([CFPB headings](https://cfpb.github.io/design-system/foundation/headings), [REI Cedar Eyebrow](https://cedar.rei.com/guidelines/typography/eyebrow)).
- **Naming cleanup:** rename the doc-site chrome label to `.overline` (or `.section-label`) so "eyebrow" means exactly one thing. Consolidate the three component variants to a single `.caat-eyebrow` consumed by hero/feature/title.

**Rationale:** three styles for one concept guarantees visual drift and makes "what's our eyebrow" unanswerable. One definition with explicit on-dark + bilingual rules removes a recurring decision and an accessibility trap.

### B2. Interaction state model — **P0** · ✅ RESOLVED (2026-05-23)

> **Done:** Authored the **Interaction States** foundations page (`/foundations/interaction-states.html`) — the 9-state matrix (default/hover/focus-visible/active/disabled/loading/error/selected/read-only) with live demos, token, and ARIA/keyboard per state; a keyboard-interaction reference table; target-size (2.5.8) and colour-independence (1.4.1) rules; and a drop-in component checklist for each contract's Accessibility section. Added reusable `--caat-color-state-*` tokens (all AA-verified). Adoption across the 32 component contracts is the follow-on (folds into the component migration task).

- **Now:** focus ring and hover are defined; other states are per-component and partial. Keyboard interaction documented on only 7/32 components.
- **Gap:** no canonical list of states every interactive component must define.
- **Recommend:** a standard matrix — **default, hover, focus-visible, active/pressed, disabled, loading, error/invalid, selected/current, read-only** — with a token-driven appearance for each, and a rule that the contract's Accessibility section must specify keyboard behavior for *every* interactive component (not just the obvious ones).
- **Rationale:** missing states (no loading button, no invalid input style, unclear focus on custom controls) are the most common real-world UX defects. A required matrix turns "did we handle disabled?" into a checklist item.

### B3. Focus management & visible focus — **P0 (a11y)** · ✅ RESOLVED (2026-05-23)

> **Done:** Covered on the Interaction States page (Focus Management section): standardize on `:focus-visible`; DOM-order focus + roving tabindex for composite widgets; overlays trap focus and restore to trigger on `Esc`/close; skip link + landmark requirements; focus-not-obscured (2.4.11). The focus ring itself was made AA-visible in the contrast-audit work (solid blue-500, 3:1 on light & dark).

- **Now:** good `--caat-focus` ring on buttons/inputs.
- **Gap:** no documented rule for `:focus-visible` (vs `:focus`), focus order, focus trapping in modal/offcanvas, or focus return after close.
- **Recommend:** standardize on `:focus-visible`, require focus trap + restore for all overlay components, and document skip-link/landmark expectations.
- **Rationale:** keyboard operability is core AODA; overlays without focus management are a frequent failure.

### B4. Layout, grid & container strategy — **P1**
- **Now:** `page-layout.html` covers section rhythm, background tiers, and grid well.
- **Gap:** max content widths, reading-measure (line length) caps for long-form, and gutter tokens aren't pinned down; relationship to AEM layout containers could be tighter.
- **Recommend:** define container max-widths, a `~65–75ch` measure cap for article body, and gutter tokens; cross-link to the AEM responsive grid.
- **Rationale:** consistent page architecture and readable line lengths are high-impact and currently semi-specified.

### B5. Bilingual EN/FR — **P0 (Ontario context)**
- **Now:** navigation documents an EN/FR toggle; no component-level i18n guidance.
- **Gap:** no system-wide rules for text expansion, `lang`/`hreflang`, date/number formatting, or which strings are authorable vs hardcoded.
- **Recommend:** a foundations page: design to **+30–35% text length**, never bake text into fixed-width components, set `lang` correctly per page/section, define FR formatting of dates/currency, and require every component contract to note its i18n behavior.
- **Rationale:** French is a first-class requirement for an Ontario public-facing pension site; retrofitting for text expansion breaks layouts that were pixel-fit to English.

### B6. Voice, tone & UX writing / microcopy — **P1**
- **Now:** each component has Content Guidance, but there's no global voice or microcopy standard.
- **Gap:** no rules for error messages, button verbs, empty states, helper text, number/currency presentation, or plain-language level (pension content skews jargon-heavy).
- **Recommend:** a content foundations page: voice principles, a plain-language target, error-message formula (what happened + how to fix), button label conventions (verb-first), and a glossary approach for pension terms.
- **Rationale:** microcopy is where trust is won or lost on a financial site; per-component guidance can't enforce a consistent voice on its own.

### B7. Imagery, art direction & data-viz colour — **P1**
- **Now:** a `data-visualization` component exists; no imagery guidance.
- **Gap:** no aspect-ratio set, focal-point/cropping rules, alt-text standards, illustration style, or **colour-blind-safe** data-viz palette + non-colour encoding.
- **Recommend:** define standard aspect ratios, art-direction rules, mandatory meaningful alt text (with a "decorative = empty alt" rule), and a categorical/sequential data-viz palette verified for contrast and colour-blindness (don't encode meaning by hue alone).
- **Rationale:** charts that rely on colour alone fail AODA and mislead ~8% of male users; imagery rules keep a content-heavy site coherent.

### B8. Global empty / loading / error states — **P1**
- **Now:** spinner and toast exist; no shared patterns for empty results, skeleton loading, or page-level errors.
- **Recommend:** standard patterns for empty states (illustration + explanation + action), skeleton/loading (see C), and error pages (404/500/maintenance) using system components.
- **Rationale:** these states are guaranteed to occur; leaving them undefined yields jarring, off-brand fallbacks.

### B9. Density, truncation & line-length — **P2**
- **Recommend:** decide whether a compact density variant is needed (tables/forms), and set truncation rules (ellipsis vs wrap vs "show more") per content type.
- **Rationale:** prevents per-instance hacks once data-dense pages appear.

---

# Part C — Missing components & patterns

Benchmarked against Carbon, Polaris (90+ components), Material 3, and USWDS. Grouped by family; **★ = especially relevant to a pension site.**

### Form controls
> **Important — `forms.html` is already strong.** It documents text/email/tel inputs, **native date inputs**, select, textarea, checkbox & radio, **validation states** (`is-valid`/`is-invalid`, `aria-invalid`, `invalid-feedback`) with well-written error microcopy, a **multi-step progress indicator** (`.caat-form__progress-step` with `aria-current="step"`), and a **SIN / sensitive-data field** example. So the items below are mostly **"extract & formalize"**, not "build from scratch." The real gap is *organizational*: these controls are bundled inside one mega-"Forms" component rather than documented as individual controls with their own state matrices (B2).

| Component | Status / why | Priority |
|---|---|---|
| Atomic input / textarea / select / checkbox / radio (broken out) | **Exist inside `forms.html`**; extract into individually documented controls with the B2 state matrix so they're reusable beyond the forms page | P1 |
| **Switch / toggle** | **Genuinely absent** (no `form-switch`); needed for opt-ins (e-statements, consent) | P1 |
| **File upload** ★ | **Genuinely absent**; document submission (proofs, forms) | P1 |
| Combobox / autocomplete | **Absent**; employer lookup, search-as-you-type | P1 |
| Range slider | **Absent**; calculator inputs (retirement age, contribution %) | P2 |
| Number stepper | **Absent**; contribution amounts, dependents | P2 |
| Segmented control | **Absent**; compact either/or (monthly/annual) | P2 |
| Custom date picker ★ | Native `type="date"` already used; only build a **custom accessible** picker if native UX/locale (FR) proves insufficient — evaluate, don't assume | P2 |

### Feedback & status
| Component | Why | Priority |
|---|---|---|
| **Skeleton loader** | Modern perceived-performance standard; pairs with spinner | P1 |
| **Empty state** | Search/results/portal with no data | P1 |
| **Announcement / banner bar** ★ | Site-wide notices, plan updates, deadlines | P1 |
| **Cookie consent** ★ | Legal/privacy requirement | P0 |
| Inline notification (non-toast) | Persistent in-page messages distinct from alerts | P2 |
| Loading button state | Submit-in-progress (ties to B2) | P1 |

### Navigation & wayfinding
| Component | Why | Priority |
|---|---|---|
| **Stepper / multi-step wizard** ★ | Enrolment / join flows, applications | P0 |
| **On-this-page / anchor nav** | Long pension guides and policy pages | P1 |
| Back-to-top | Long-form pages | P2 |
| Mega menu (formalize under navigation) | Already in nav; document as its own pattern | P2 |
| Sub-navigation / section nav | Multi-page sections (e.g., "About the plan") | P1 |

### Content & data display
| Component | Why | Priority |
|---|---|---|
| **Stat / metric / KPI** ★ | Used in the template but not a formal component | P1 |
| **Comparison table** ★ | DBplus vs other plans / option comparison | P0 |
| **Tag / chip (removable)** | Filters, categories, applied facets | P1 |
| Avatar | Member portal, testimonials, advisors | P2 |
| Timeline | Retirement journey, plan history, process steps | P2 |
| Callout / note / disclaimer box | Highlighted regulatory notes (heavy on pension sites) | P1 |
| Pull quote | Editorial/testimonial emphasis | P2 |
| Definition list / glossary term | Pension terminology with inline definitions | P1 |

### Patterns (compositions, not single components)
| Pattern | Why | Priority |
|---|---|---|
| **Forms validation pattern** ★ | **Field-level validation exists in `forms.html`**; promote it to a *referenced standard* (when to validate, inline vs error-summary, the error formula) that all inputs cite — not buried in one component | P1 |
| **Multi-step wizard / stepper** ★ | **Visual step indicator exists** in `forms.html` Variant 2; extract into a standalone, reusable wizard pattern (state persistence, back/next, validation per step, progress semantics) for enrolment/applications | P1 |
| **Secure/sensitive form** ★ | **Embryonic** (SIN field + pattern in `forms.html`); formalize masking, trust signals, and SIN/DOB handling guidance | P1 |
| **Pension calculator** ★ | Signature tool for a pension site; inputs→result→assumptions | P1 |
| **Plan comparison** ★ | Decision support across plan types | P0 |
| Filtering / faceted search + results | Resource libraries, forms/documents finder | P1 |
| Error pages (404/500/maintenance) | Guaranteed to occur | P1 |
| Login / portal entry pattern | Members log in to a portal; entry CTA + states | P1 |
| Document / forms library | Downloadable statements, guides, forms at scale | P1 |

---

# Part D — Documentation, consistency & governance gaps

The component contract is excellent; these gaps are *around* it.

| # | Gap | Recommendation | Priority |
|---|---|---|---|
| D1 | **Dark mode** documented on 1/32 components | Resolve A4 first, then add a contract row for theme behavior (or state "light only") | P1 |
| D2 | **Keyboard interaction** documented on 7/32 | Require the Accessibility section to specify keyboard behavior for every interactive component | P0 |
| D3 | **Motion** documented on ~19/32 | After A7, require a motion note (even "none") per component | P2 |
| D4 | **i18n** only on navigation | After B5, add an i18n line to every contract | P1 |
| D5 | **Status badges** inconsistent (10/32 unlabeled; mixed `new`/`new-component`/`rebuild`) | Define a fixed lifecycle vocabulary (e.g., *Planned → In progress → Stable → Deprecated*) and label all 32 | P1 |
| D6 | **Index has no categorization** (flat grid of 32) | Group by family (Form Controls / Feedback / Navigation / Content / Patterns) — mirrors Part C and aids findability | P2 |
| D7 | **Two heading-naming conventions** ("Summary" vs "Component Summary") | Pick one voice and normalize all 32 | P2 |
| D8 | **No versioning / changelog** | Add a changelog + semver discipline; record breaking token/markup changes | P1 |
| D9 | **No contribution / governance model** | Document how a component is proposed, reviewed, and promoted through the lifecycle (D5); who owns the system | P1 |
| D10 | **Figma ↔ code parity** unstated | Note the source of truth and how design and tokens stay in sync | P2 |
| D11 | **Pattern vs component distinction** absent | Add a "Patterns" section (Part C) distinct from components; many items above are compositions. **Expanded in [Part F](#part-f--component-composition-tiers--dependency-completeness)** — tier taxonomy + dependency audit. | P1 |
| D12 | **No principles page** | Articulate 4–6 design principles that justify decisions (clarity, trust, plain language, accessibility-first) | P2 |

---

# Part E — Suggested sequence

A dependency-aware ordering (foundations unlock everything downstream):

**Phase 1 — Foundation & compliance (P0)**
1. Token tiers: add a **semantic layer** over the existing primitives (A3) — unlocks dark mode + theming.
2. **Type scale** (A1) and **spacing scale** (A2).
3. **AODA contrast audit** of all colour pairings (A3) — legal.
4. **Interaction state model** + **focus management** (B2, B3) — legal + correctness.
5. **Bilingual rules** (B5) — blocks real page-building.
6. Fill genuine P0 builds: **plan comparison** (C) and **cookie consent** (C, legal). *(Validation, the multi-step stepper, and atomic inputs already exist inside `forms.html` — those are P1 extract/promote tasks, not P0 builds.)*

**Phase 2 — Cohesion & high-value patterns (P1)**
7. **Eyebrow consolidation** (B1) + remaining recurring-pattern cleanups.
8. Motion (A7), z-index (A6), iconography (A9) foundations.
9. Voice/microcopy (B6), imagery + data-viz colour (B7), empty/loading/error patterns (B8).
10. P1 components/patterns: skeleton, announcement bar, stat/KPI, tag/chip, calculator, secure form, on-this-page nav, status-badge lifecycle (D5), changelog + governance (D8, D9).

**Phase 3 — Maturity (P2)**
11. Dark mode build-out (if A4 = yes), elevation scale, density, breakpoint/radius/opacity tokens.
12. Remaining components (avatar, timeline, pull quote, segmented control…), index categorization (D6), naming normalization (D7), principles page (D12).

---

# Part F — Component composition, tiers & dependency completeness

Triggered by a real finding: `article-layout` reuses the standalone **Breadcrumb** component but **reimplements** social icons, table-of-contents, and related-articles internally — and social icons are also hand-built a *second* time in `navigation` (`.caat-article__share-btn` vs `.caat-footer-social`). Composites that reimplement shared parts instead of composing them cause silent duplication and drift (the eyebrow's three variants and the card "kicker" were the same disease).

### F1. A 3-tier taxonomy — **P1**
Tag every component with a tier. Components may only depend "downward."

| Tier | Definition | Examples |
|---|---|---|
| **Base** (atoms/molecules) | Self-contained; composes nothing (or only tokens) | button, badge, breadcrumb, alert, separator, spinner, progress, tooltip, popover, toast, image-embed, text-title, pagination, tables, tabs, accordion, modal, offcanvas, dropdown, search, list-group, download-item, eyebrow |
| **Composite** (organisms) | Built by composing base components | card, hero, feature-resource-hero, navigation, blog-listing, testimonials, data-visualization, forms, article-layout |
| **Pattern / Template** | Full-page compositions | pensions-matter, the article page |

### F2. Two rules for composites
1. **Compose, don't reimplement.** A composite references base components; it must never hand-rebuild a button, icon, eyebrow, or card internally. (Violations today: §F4.)
2. **Declare dependencies.** Add a **"Composed of"** block to every composite's contract (and a reciprocal **"Used by"** to bases). Proposed contract addition:
   ```
   ## Composed of
   - [Breadcrumb](/components/breadcrumb.html)
   - [Rich Text](/components/text-title.html)
   - [Social / Share Links](/components/social-links.html)
   - [In-page Nav](/components/in-page-nav.html)
   - [Card](/components/card.html) ×N (related articles)
   ```

### F3. The completeness rule — **P1**
> **A composite may only depend on components that have their own documented page.** No "phantom" sub-components defined solely inside a composite.

Make it enforceable later with a check that every "Composed of" link resolves to an existing page.

### F4. Dependency audit (composites → constituents → page status)
| Composite | Composed of | Gaps |
|---|---|---|
| **card** | badge ✅, button ✅, *kicker* | kicker ⚠ duplicates **eyebrow** → use `.caat-eyebrow` |
| **hero** | button ✅, eyebrow ✅, *stat-strip* | **Stat/KPI ❌** no page |
| **feature-resource-hero** | button ✅, eyebrow ✅, image-embed ✅ | — |
| **navigation** | button ✅, search ✅, dropdown ✅, offcanvas ✅, accordion ✅, *footer-social* | **Social/Share Links ❌** (reimplemented) |
| **blog-listing** | card ✅, badge ✅, pagination ✅ | — |
| **testimonials** | card ✅, *avatar*, carousel (Bootstrap) | **Avatar ❌** no page |
| **data-visualization** | tables ✅, *stat* | **Stat/KPI ❌** no page |
| **forms** | button ✅, *field/validation*, *stepper* | extract Field + Stepper (see Part C) |
| **article-layout** | breadcrumb ✅, rich-text ✅, *share*, *toc*, *related*, *meta* | **Social/Share ❌**, **In-page Nav/ToC ❌**, related→**Card** ✅, **Byline/Meta ❌** |

### F5. Phantom sub-components to promote (prioritized)
| Promote to a component | Reused by | Priority |
|---|---|---|
| **Icon Button / Icon Link** (atom) | underlies social, share, close, nav actions | P1 |
| **Social / Share Links** | article-layout, navigation (currently 2 copies) | P1 |
| **In-page Nav (Table of Contents)** | article-layout (any long page) | P1 |
| **Stat / KPI** | hero, data-visualization | P1 |
| **Avatar** | testimonials, (future) member portal | P2 |
| **Byline / Meta** | article-layout | P2 |

*Not new components:* **related articles** = a grid of **Card**; the **kicker** = **eyebrow** (consolidate).

> Sequencing: this slots into Phase 2. Do F1–F3 (taxonomy + standard + rule) first, then promote the P1 phantom components (Social/Share, In-page Nav, Stat/KPI, Icon Button) and refactor `article-layout` + `navigation` to consume them — which also removes the social-icon duplication.

---

## Appendix — references

- W3C Design Tokens Community Group & 2025.10 stable spec — <https://www.w3.org/community/design-tokens/>
- On token tiers in practice ("two-tier survives") — <https://www.robin-cannon.com/p/the-design-token-cargo-cult>
- AODA / WCAG 2.2 AA by 2027 — <https://www.levelaccess.com/blog/aoda-compliance-requirements-for-websites/>
- Eyebrow text best practice — <https://uxmovement.com/content/increasing-headline-clicks-with-eyebrow-text/>
- Accessible headings / eyebrow semantics — CFPB <https://cfpb.github.io/design-system/foundation/headings>, REI Cedar <https://cedar.rei.com/guidelines/typography/eyebrow>
- Component coverage benchmarks — Carbon <https://carbondesignsystem.com/contributing/component-checklist/>, Design System Checklist <https://www.designsystemchecklist.com/category/core-components>

---

*This is a living reference. As decisions are made, fold them back into the foundations pages and the per-component contract so the documentation site stays the single source of truth.*
