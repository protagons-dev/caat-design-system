#!/usr/bin/env node
/* ============================================================
   CAAT Design System — Token Reference Audit
   ------------------------------------------------------------
   Guards the component CONTRACT pages (public/components/*.html)
   against token drift. For every token cited in a contract's
   "Design Tokens" table it checks:

     1. WRONG   — a stated hex/dimension value that disagrees with
                  the real value in tokens.css (resolving var() chains).
     2. UNKNOWN — a --caat-* token that is defined nowhere (neither
                  tokens.css nor any component CSS), i.e. fabricated.

   Component-scoped custom properties that a component CSS legitimately
   defines (e.g. --caat-icon-btn-brand, --caat-stack-gap) are recognised
   and not flagged.

   Exit code 1 on any finding, so it can run in CI next to
   contrast-audit.js. Run: node scripts/token-reference-audit.js
   ============================================================ */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', 'public');
const TOKENS_CSS = path.join(ROOT, 'assets/css/tokens.css');
const COMPONENTS_DIR = path.join(ROOT, 'components');
const CSS_DIR = path.join(ROOT, 'assets/css');

/* 1. Canonical token → value map (tokens.css is the source of truth) */
const tokensCss = fs.readFileSync(TOKENS_CSS, 'utf8');
const raw = {};
let m;
const defRe = /(--caat-[\w-]+)\s*:\s*([^;]+);/g;
while ((m = defRe.exec(tokensCss))) raw[m[1]] = m[2].trim();

function resolve(v, depth = 0) {
  if (depth > 10) return v;
  const mm = v.match(/^var\((--caat-[\w-]+)\)$/);
  if (mm && raw[mm[1]] !== undefined) return resolve(raw[mm[1]], depth + 1);
  return v;
}
const canon = {};
for (const k in raw) canon[k] = resolve(raw[k]);

/* 2. Every --caat-* custom property DEFINED anywhere (tokens + component CSS).
      Used to tell a fabricated token from a legitimate component-scoped one. */
const defined = new Set(Object.keys(raw));
for (const f of fs.readdirSync(path.join(CSS_DIR, 'components'))) {
  if (!f.endsWith('.css')) continue;
  const css = fs.readFileSync(path.join(CSS_DIR, 'components', f), 'utf8');
  let mm;
  const re = /(--caat-[\w-]+)\s*:/g;
  while ((mm = re.exec(css))) defined.add(mm[1]);
}

/* 3. Helpers */
const norm = s => s.toLowerCase().replace(/\s+/g, '').replace(/^0(\.\d)/, '$1').replace(/(\D)0(\.\d)/g, '$1$2');
const isHex = s => /^#[0-9a-f]{3,8}$/i.test(s.trim());
const looksValue = s =>
  isHex(s.trim()) ||
  /^-?\d*\.?\d+\s*(rem|px|em|ms|s|%)$/i.test(s.trim()) ||
  /^\d{3,4}$/.test(s.trim());

/* 4. Scan each contract's Tokens section */
const files = fs.readdirSync(COMPONENTS_DIR).filter(f => f.endsWith('.html') && f !== 'index.html').sort();
let wrong = 0, unknown = 0, pages = 0;
const report = [];

for (const f of files) {
  const html = fs.readFileSync(path.join(COMPONENTS_DIR, f), 'utf8');
  const sec = html.match(/id="tokens"[\s\S]*?<\/section>/);
  if (!sec) continue;
  const issues = [];
  for (const row of sec[0].match(/<tr>[\s\S]*?<\/tr>/g) || []) {
    const cells = (row.match(/<td[^>]*>([\s\S]*?)<\/td>/g) || [])
      .map(c => c.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').trim());
    const tokCell = cells.find(c => /--caat-[\w-]+/.test(c));
    if (!tokCell) continue;
    // a single cell may list a/b shorthand (e.g. "-bg / -text"); check each token
    for (const tok of tokCell.match(/--caat-[\w-]+/g) || []) {
      if (!defined.has(tok)) { issues.push(`  UNKNOWN  ${tok}  (defined nowhere)`); unknown++; }
    }
    const tok = (tokCell.match(/--caat-[\w-]+/) || [])[0];
    const valCell = cells.slice(1).find(c => looksValue(c));
    if (valCell && tok in canon && looksValue(canon[tok]) && norm(valCell) !== norm(canon[tok])) {
      issues.push(`  WRONG    ${tok}  stated="${valCell}"  actual="${canon[tok]}"`);
      wrong++;
    }
  }
  if (issues.length) { pages++; report.push(`\n${f}`, ...issues); }
}

if (report.length) console.log(report.join('\n'));
console.log(`\n──────────`);
console.log(`Token-reference audit: ${wrong} wrong value(s), ${unknown} unknown token(s) across ${pages} page(s).`);
if (wrong || unknown) {
  console.log('FAIL — contracts disagree with tokens.css. Fix the cited rows.');
  process.exit(1);
}
console.log('PASS — every cited token exists and every stated value matches tokens.css.');
