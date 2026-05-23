#!/usr/bin/env node
/* ============================================================
   CAAT Design System — WCAG contrast audit
   ------------------------------------------------------------
   Computes WCAG 2.x contrast ratios for every real foreground/
   background colour pairing and reports pass/fail against AA:
     • Normal text .......... 4.5:1
     • Large text (≥24px, or ≥18.66px bold) 3:1
     • UI / non-text (1.4.11) 3:1
   Semi-transparent foregrounds are composited over their bg first.

   Two groups:
     REQUIRED   — pairings the system actually relies on. Must all PASS.
     RESTRICTED — colours that FAIL on certain surfaces and are therefore
                  documented as "do not use for text/UI there" (plus the
                  WCAG-exempt disabled state). Informational, not a gate.

   Run:  node scripts/contrast-audit.js   (exit 1 if any REQUIRED fails)
   ============================================================ */

const C = {
  blue: '#0f6791', blue900: '#003750', blue700: '#0b5a80', blue500: '#2f95d2',
  blue300: '#9dd2ed', blue100: '#e7f4fb',
  green: '#55a546', green900: '#204b1f', green700: '#367f32', green100: '#e8f5e6',
  lime: '#95e35c', teal: '#12a7b8',
  grey: '#eff2f7', grey200: '#dfe6ef', grey300: '#cbd7e3', grey100: '#e8ecf1',
  grey500: '#6f7d8c', ink: '#102637', muted: '#506273', white: '#ffffff',
  warning: '#efaa39', danger: '#b83232', beige: '#f8f5ee', disabled: '#8a99a8',
  successText: '#0a3622', successBg: '#d1e7dd',
  warningText: '#664d03', warningBg: '#fff3cd',
  dangerText: '#58151c', dangerBg: '#f8d7da', infoBg: '#cfe2ff',
  rebuildText: '#65420a', rebuildBg: '#fff6df',
  retireText: '#7a1f1f', retireBg: '#fde8e8',
};

const hex2rgb = h => {
  h = h.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
};
const over = (fg, a, bg) => fg.map((c, i) => Math.round(c * a + bg[i] * (1 - a)));
const lum = rgb => {
  const [r, g, b] = rgb.map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};
const T = { text: 4.5, large: 3, ui: 3 };
const score = ([label, fg, bg, type, alpha]) => {
  let fgRgb = hex2rgb(fg); const bgRgb = hex2rgb(bg);
  if (alpha != null) fgRgb = over(fgRgb, alpha, bgRgb);
  const r = ratio(fgRgb, bgRgb), need = T[type];
  return { label, type, r, need, ok: r >= need };
};

// ── REQUIRED: real pairings, must all PASS (reflects shipped tokens) ──
const REQUIRED = [
  ['Body (ink) on white',                 C.ink, C.white,   'text'],
  ['Body (ink) on subtle band (grey)',    C.ink, C.grey,    'text'],
  ['Body (ink) on grey-100',              C.ink, C.grey100, 'text'],
  ['Body (ink) on beige',                 C.ink, C.beige,   'text'],
  ['Body (ink) on blue-100 tint',         C.ink, C.blue100, 'text'],
  ['Secondary (muted) on white',          C.muted, C.white, 'text'],
  ['Secondary (muted) on subtle band',    C.muted, C.grey,  'text'],
  ['Secondary (muted) on grey-100',       C.muted, C.grey100,'text'],
  ['Heading/link (blue-900) on white',    C.blue900, C.white,'text'],
  ['Link-hover/eyebrow (blue-700) on white', C.blue700, C.white, 'text'],
  ['Eyebrow (blue-700) on subtle band',   C.blue700, C.grey, 'text'],
  ['Eyebrow (blue-700) on blue-100',      C.blue700, C.blue100, 'text'],
  ['Th text (blue-900) on blue-100',      C.blue900, C.blue100, 'text'],
  ['White on blue-900 (primary / dark band)', C.white, C.blue900, 'text'],
  ['White on blue-700 (primary hover)',   C.white, C.blue700, 'text'],
  ['White on blue (#0f6791)',             C.white, C.blue,   'text'],
  ['White on green-700 (secondary btn — FIXED)', C.white, C.green700, 'text'],
  ['White on green-900 (secondary hover)',C.white, C.green900,'text'],
  ['White on danger',                     C.white, C.danger, 'text'],
  ['Invalid border (danger) on white',    C.danger, C.white, 'ui'],
  ['Invalid/error message (danger-text) on white', C.dangerText, C.white, 'text'],
  ['Selected bg blue-900 + white text',   C.white, C.blue900, 'text'],
  ['Hover bg: ink on blue-100',           C.ink, C.blue100, 'text'],
  ['Selection text (blue-900) on lime',   C.blue900, C.lime, 'text'],
  ['Eyebrow on-dark (blue-300) on blue-900', C.blue300, C.blue900, 'text'],
  ['Hero eyebrow (lime) on blue-900',     C.lime, C.blue900, 'text'],
  ['Success text on success bg',          C.successText, C.successBg, 'text'],
  ['Warning text on warning bg',          C.warningText, C.warningBg, 'text'],
  ['Danger text on danger bg',            C.dangerText, C.dangerBg, 'text'],
  ['Info: ink on info bg',                C.ink, C.infoBg,  'text'],
  ['Badge ready (green-900) on green-100',C.green900, C.green100, 'text'],
  ['Badge planned (blue-900) on blue-100',C.blue900, C.blue100, 'text'],
  ['Badge rebuild on #fff6df',            C.rebuildText, C.rebuildBg, 'text'],
  ['Badge retire on #fde8e8',             C.retireText, C.retireBg, 'text'],
  ['Input border (grey-500) on white — FIXED', C.grey500, C.white, 'ui'],
  ['Input focus edge (blue-500) on white',C.blue500, C.white, 'ui'],
  ['Focus ring solid blue-500 on white — FIXED', C.blue500, C.white, 'ui'],
  ['Focus ring solid blue-500 on dark navy — FIXED', C.blue500, C.blue900, 'ui'],
];

// ── RESTRICTED / EXEMPT: documented constraints (informational) ──
const RESTRICTED = [
  ['Disabled text on white (WCAG-EXEMPT)',     C.disabled, C.white, 'text'],
  ['White on teal — restrict: no white text',  C.white, C.teal,   'text'],
  ['White on warning — restrict: dark text only', C.white, C.warning, 'text'],
  ['Lime as text/UI on white — restrict: dark-bg only', C.lime, C.white, 'ui'],
  ['blue-300 as UI on white — restrict: tint/on-dark only', C.blue300, C.white, 'ui'],
  ['Warning amber as UI on white — restrict: pair w/ icon+text', C.warning, C.white, 'ui'],
  ['grey-200 divider on white — decorative (1.4.11 exempt)', C.grey200, C.white, 'ui'],
  ['grey-300 divider on white — decorative (1.4.11 exempt)', C.grey300, C.white, 'ui'],
];

const pad = (s, n) => String(s).padEnd(n);
const line = r => pad(r.label, 50) + pad(r.type, 6) + pad(r.r.toFixed(2) + ':1', 9) +
  (r.ok ? 'PASS' : `FAIL (<${r.need})`);

console.log('\nCAAT Design System — WCAG AA contrast audit\n' + '='.repeat(69));
console.log('REQUIRED (must all pass)\n' + '-'.repeat(69));
const req = REQUIRED.map(score);
req.forEach(r => console.log(line(r)));
const reqFail = req.filter(r => !r.ok).length;

console.log('\nRESTRICTED / EXEMPT (informational — these colours are documented');
console.log('as not-for-text/UI on the given surface)\n' + '-'.repeat(69));
RESTRICTED.map(score).forEach(r => console.log(line(r)));

console.log('='.repeat(69));
console.log(`REQUIRED: ${req.length}   PASS: ${req.length - reqFail}   FAIL: ${reqFail}\n`);
process.exit(reqFail ? 1 : 0);
