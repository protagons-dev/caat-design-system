/**
 * figma-export.js
 * Generates a fully self-contained HTML file for Figma import (html.to.design).
 *
 * Strategy: Fetch ALL CSS (Bootstrap + Bootstrap Icons + tokens + component),
 * resolve every CSS custom-property to its literal value, embed everything in
 * a single <style> block, and let html.to.design's own renderer handle layout.
 *
 * NO computed-style inlining — that breaks layout, cascade, and specificity.
 *
 * ── Markup source (two modes) ───────────────────────────────────────────────
 * PREFERRED — annotate the page's live demo instances; the exporter assembles
 * the variant/state sheet from them, so the demo IS the single source of truth:
 *
 *   <a class="caat-button caat-button--primary"
 *      data-figma="Default"  data-figma-group="Primary">Button Label</a>
 *   <a class="caat-button caat-button--primary"
 *      data-figma="Hover"    data-figma-group="Primary"
 *      data-figma-state="hover">Button Label</a>            ← exporter adds .is-hover
 *
 *   Attributes:
 *     data-figma="<label>"        Row label; marks this element for export (uses outerHTML).
 *     data-figma-group="<title>"  Section grouping (default "Component"); order preserved.
 *     data-figma-state="<name>"   Adds class .is-<name> to the exported clone (hover/active/focus/…).
 *     data-figma-dark             Render the instance inside a dark swatch (e.g. outline-white).
 *
 * FALLBACK — a hand-authored <template id="figma-template"> … markup … </template>
 * is still honoured when no [data-figma] annotations are present (legacy pages).
 *
 * Usage on any component page:
 *   <a onclick="downloadFigmaHTML('Button',['/assets/css/tokens.css','/assets/css/components/button.css'])">
 */

/* ── External assets to fetch & embed ── */
const BOOTSTRAP_CSS_URL   = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
const BOOTSTRAP_ICONS_URL = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css';

/* ── Figma-layout CSS (shared across every component export) ── */
const FIGMA_LAYOUT_CSS = `
*, *::before, *::after { box-sizing: border-box; }
body {
  font-family: var(--caat-font-primary);
  color: var(--caat-ink);
  background: #fff;
  padding: 2rem;
  margin: 0;
}
/* Neutralize non-visual Bootstrap behaviour for static Figma spec */
button, .btn { cursor: default !important; }
.dropdown-toggle::after { display: none !important; }
/* Ensure gap between text and chevron */
.accordion-button { gap: 1rem !important; }
.accordion-button::after { flex-shrink: 0; margin-left: auto; }

.figma-page-title {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--caat-blue-900);
  margin-bottom: .25rem;
}
.figma-page-subtitle {
  font-size: .85rem;
  color: var(--caat-muted);
  margin-bottom: 2.5rem;
}
.figma-section { margin-bottom: 3rem; }
.figma-section-title {
  font-size: .7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: var(--caat-muted);
  border-bottom: 1px solid var(--caat-grey-200);
  padding-bottom: .35rem;
  margin-bottom: 1.5rem;
}
.figma-row {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.25rem;
}
.figma-row-label {
  width: 7rem;
  flex-shrink: 0;
  font-size: .7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .06em;
  color: var(--caat-muted);
  text-align: right;
}
.figma-row-items {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}
.figma-dark-swatch {
  background: var(--caat-blue-900);
  padding: 1.25rem 1.5rem;
  border-radius: var(--caat-radius);
  display: inline-flex;
  align-items: center;
  gap: 1rem;
}
.figma-specs {
  margin-top: .5rem;
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}
.figma-spec {
  font-size: .65rem;
  color: var(--caat-muted);
  line-height: 1.4;
}
.figma-spec strong {
  display: block;
  color: var(--caat-ink);
  font-weight: 700;
}
.figma-colour-heading {
  font-size: .7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: var(--caat-muted);
  margin-top: 1.5rem;
  margin-bottom: .75rem;
}
`;

/* ────────────────────────────────────────────────────────────
   Robust var() resolver
   Handles nested parentheses in fallback values correctly,
   e.g. var(--x, rgba(0,0,0,.5)) and var(--a, var(--b, #fff))
   ──────────────────────────────────────────────────────────── */

/** Parse all --custom-property declarations from a CSS string into a map. */
function buildVarMap(cssText) {
  const map = {};
  const re = /--([\w-]+)\s*:\s*([^;]+)/g;
  let m;
  while ((m = re.exec(cssText)) !== null) {
    map['--' + m[1]] = m[2].trim();
  }
  return map;
}

/** Find the index of the closing ')' that matches the '(' at `start`. */
function findClosingParen(str, start) {
  let depth = 0;
  for (let i = start; i < str.length; i++) {
    if (str[i] === '(') depth++;
    else if (str[i] === ')') { depth--; if (depth === 0) return i; }
  }
  return -1;
}

/**
 * Resolve every var() in a CSS string using the provided variable map.
 * Properly handles:
 *  - Nested parentheses in fallbacks: var(--x, rgba(0,55,80,.1))
 *  - Nested var() in fallbacks:       var(--a, var(--b, #fff))
 *  - Undefined vars with fallbacks:   var(--undefined-token, #cfe2ff) → #cfe2ff
 *  - Undefined vars without fallback: var(--missing) → "" (removed)
 */
function resolveAllVars(css, varMap, depth) {
  if (depth === undefined) depth = 0;
  if (depth > 15) return css;

  let result = '';
  let i = 0;

  while (i < css.length) {
    const idx = css.indexOf('var(', i);
    if (idx === -1) { result += css.slice(i); break; }

    // Copy everything before this var(
    result += css.slice(i, idx);

    // Find the matching closing paren
    const openParenIdx = idx + 3;
    const closeIdx = findClosingParen(css, openParenIdx);
    if (closeIdx === -1) {
      result += css.slice(idx);
      break;
    }

    // Extract content between var( and )
    const inner = css.slice(openParenIdx + 1, closeIdx).trim();

    // Split into variable name and fallback on the FIRST top-level comma
    let commaPos = -1;
    let parenDepth = 0;
    for (let j = 0; j < inner.length; j++) {
      if (inner[j] === '(') parenDepth++;
      else if (inner[j] === ')') parenDepth--;
      else if (inner[j] === ',' && parenDepth === 0) { commaPos = j; break; }
    }

    const varName  = (commaPos === -1 ? inner : inner.slice(0, commaPos)).trim();
    const fallback = commaPos === -1 ? '' : inner.slice(commaPos + 1).trim();

    // Resolve: prefer the map value, fall back to the CSS fallback
    let resolved = (varMap[varName] !== undefined) ? varMap[varName] : fallback;

    // Recursively resolve if the result itself contains var()
    if (resolved.includes('var(')) {
      resolved = resolveAllVars(resolved, varMap, depth + 1);
    }

    result += resolved;
    i = closeIdx + 1;
  }

  return result;
}

/* ────────────────────────────────────────────────────────────
   Spec collector — assemble the Figma sheet from annotated demos
   ──────────────────────────────────────────────────────────── */

const FIGMA_ATTRS = ['data-figma', 'data-figma-group', 'data-figma-state', 'data-figma-dark'];

/** Remove all data-figma* attributes from a node and its descendants. */
function stripFigmaAttrs(node) {
  if (node.nodeType !== 1) return;
  FIGMA_ATTRS.forEach(a => node.removeAttribute(a));
  node.querySelectorAll('[data-figma],[data-figma-group],[data-figma-state],[data-figma-dark]')
      .forEach(el => FIGMA_ATTRS.forEach(a => el.removeAttribute(a)));
}

/** HTML-escape a string for safe insertion into the generated markup. */
function escapeHTML(s) {
  return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

/**
 * Collect [data-figma] annotated instances from the page, in document order,
 * grouped by data-figma-group. Returns [] when the page uses no annotations
 * (so the caller can fall back to <template id="figma-template">).
 */
function collectFigmaSpecs(root) {
  const els = Array.from(root.querySelectorAll('[data-figma]'));
  if (!els.length) return [];

  const groups = [];
  const byTitle = {};
  for (const el of els) {
    const title = el.getAttribute('data-figma-group') || 'Component';
    if (!byTitle[title]) { byTitle[title] = { title, rows: [] }; groups.push(byTitle[title]); }

    const clone = el.cloneNode(true);
    const state = el.getAttribute('data-figma-state');
    if (state) state.split(/\s+/).forEach(s => clone.classList.add('is-' + s));
    stripFigmaAttrs(clone);

    byTitle[title].rows.push({
      label: el.getAttribute('data-figma') || '',
      dark:  el.hasAttribute('data-figma-dark'),
      html:  clone.outerHTML
    });
  }
  return groups;
}

/** Build the Figma sheet body markup from collected spec groups. */
function buildFigmaBody(componentName, groups) {
  let html = `<h1 class="figma-page-title">${escapeHTML(componentName)}</h1>\n` +
             `<p class="figma-page-subtitle">CAAT Design System · Variants &amp; states</p>\n`;
  for (const g of groups) {
    html += `\n<div class="figma-section">\n  <h2 class="figma-section-title">${escapeHTML(g.title)}</h2>\n`;
    for (const r of g.rows) {
      const item = r.dark ? `<div class="figma-dark-swatch">${r.html}</div>` : r.html;
      html += `  <div class="figma-row">\n` +
              `    <span class="figma-row-label">${escapeHTML(r.label)}</span>\n` +
              `    <div class="figma-row-items">${item}</div>\n` +
              `  </div>\n`;
    }
    html += `</div>\n`;
  }
  return html;
}

/* ────────────────────────────────────────────────────────────
   Main export function
   ──────────────────────────────────────────────────────────── */

/**
 * Fetch all CSS, embed Bootstrap raw, resolve ONLY CAAT custom properties
 * in component + layout CSS, assemble a self-contained HTML, trigger download.
 *
 * Why this hybrid approach:
 *  - html.to.design doesn't reliably resolve CSS custom properties, so CAAT
 *    tokens (--caat-*) must be flattened to literal values in our CSS.
 *  - Bootstrap's CSS must stay raw/unmodified because its internal --bs-*
 *    variable system (including [data-bs-theme=dark]) gets corrupted by
 *    naive regex resolution. Bootstrap's own vars resolve fine in the
 *    plugin's browser engine since they're scoped to selectors it manages.
 *  - We build the var map ONLY from tokens.css + component CSS (the CAAT
 *    files), never from Bootstrap. This keeps the map clean.
 *
 * @param {string}   componentName  Display name, e.g. "Button"
 * @param {string[]} cssFiles       Paths, e.g. ['/assets/css/tokens.css', '/assets/css/components/button.css']
 */
async function downloadFigmaHTML(componentName, cssFiles) {
  try {
    // 1. Fetch Bootstrap CSS, Bootstrap Icons CSS, and all component CSS in parallel
    const allUrls   = [BOOTSTRAP_CSS_URL, BOOTSTRAP_ICONS_URL, ...cssFiles];
    const responses = await Promise.all(allUrls.map(f => fetch(f)));
    const allSheets = await Promise.all(responses.map(r => {
      if (!r.ok) throw new Error(`Failed to fetch ${r.url}`);
      return r.text();
    }));

    // Separate the fetched sheets
    const bootstrapCSS    = allSheets[0];
    const iconsCSS        = allSheets[1];
    const componentSheets = allSheets.slice(2);

    // 2. Build variable map from ONLY CAAT sources (tokens + component CSS).
    //    Do NOT include Bootstrap — its [data-bs-theme=dark] block would
    //    overwrite light-theme values and turn everything dark.
    const caatCSS = componentSheets.join('\n') + '\n' + FIGMA_LAYOUT_CSS;
    const varMap = buildVarMap(caatCSS);

    // 3. Resolve CAAT var() references in component sheets and layout CSS.
    //    This turns var(--caat-blue-900) → #003750, etc.
    //    Any var(--caat-xxx, #fallback) where --caat-xxx is undefined will
    //    correctly resolve to the fallback value.
    const resolvedComponentSheets = componentSheets.map(s => resolveAllVars(s, varMap));
    const resolvedLayoutCSS       = resolveAllVars(FIGMA_LAYOUT_CSS, varMap);

    // 4. Get markup. PREFERRED: assemble from [data-figma] annotated demos
    //    (single source of truth). FALLBACK: a legacy <template id="figma-template">.
    let rawMarkup;
    const specGroups = collectFigmaSpecs(document);
    if (specGroups.length) {
      rawMarkup = buildFigmaBody(componentName, specGroups);
    } else {
      const tpl = document.getElementById('figma-template');
      if (!tpl) {
        throw new Error('No [data-figma] annotations and no <template id="figma-template"> on this page.');
      }
      rawMarkup = tpl.innerHTML;
    }
    // Resolve any inline CAAT var() in the gathered markup
    const bodyMarkup = resolveAllVars(rawMarkup, varMap);

    // 5. Assemble self-contained HTML.
    //    - Bootstrap CSS: embedded RAW (its own var system stays intact)
    //    - Bootstrap Icons: embedded RAW
    //    - CAAT component CSS: all var() resolved to literal values
    //    - Figma layout CSS: all var() resolved to literal values
    //    - Only external dep: Google Fonts <link>
    const slug = componentName.toLowerCase().replace(/\s+/g, '-');
    const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${componentName} — CAAT Design System — Figma Import</title>
<link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
/* ── Bootstrap 5.3.3 (embedded raw — do not resolve its internal vars) ── */
${bootstrapCSS}
</style>
<style>
/* ── Bootstrap Icons (embedded raw) ── */
${iconsCSS}
</style>
<style>
/* ── CAAT design tokens + component CSS (all CAAT vars resolved to literals) ── */
${resolvedComponentSheets.join('\n\n')}
</style>
<style>
/* ── Figma layout helpers (CAAT vars resolved) ── */
${resolvedLayoutCSS}
</style>
</head>
<body>
${bodyMarkup}
</body>
</html>`;

    // 6. Trigger download
    const blob = new Blob([html], { type: 'text/html' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `${slug}-figma.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('[figma-export]', err);
    alert('Figma export failed — see console for details.');
  }
}
