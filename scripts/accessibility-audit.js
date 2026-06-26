#!/usr/bin/env node
/*
   CAAT Design System - static accessibility audit

   This audit intentionally avoids external dependencies so it can run in the
   local static-site repo and CI. It catches structural issues that should be
   true for every shipped HTML page. It is not a replacement for manual screen
   reader testing or a browser-based axe pass.

   Run: node scripts/accessibility-audit.js
*/

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

const EXCLUDED_DIRS = [
  `${path.sep}archive${path.sep}`,
  `${path.sep}assets${path.sep}includes${path.sep}`,
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, files);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

function isExcluded(file) {
  return EXCLUDED_DIRS.some(part => file.includes(part));
}

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function lineOf(source, index) {
  return source.slice(0, index).split(/\r?\n/).length;
}

function decodeText(text) {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&[a-zA-Z0-9#]+;/g, ' ');
}

function stripTags(html) {
  return decodeText(html)
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+aria-hidden=["']true["'][^>]*>[\s\S]*?<\/[^>]+>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function attrs(raw = '') {
  const out = {};
  const re = /([:@\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let match;
  while ((match = re.exec(raw))) {
    out[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? '';
  }
  return out;
}

function hasName(attributes, inner = '') {
  if ((attributes['aria-label'] || '').trim()) return true;
  if ((attributes['aria-labelledby'] || '').trim()) return true;
  if ((attributes.title || '').trim()) return true;
  if ((attributes.alt || '').trim()) return true;
  if ((attributes.value || '').trim()) return true;
  if (/<img\b[^>]*\balt=(?:"[^"]+"|'[^']+'|[^\s"'=<>`]+)/i.test(inner)) return true;
  return !!stripTags(inner);
}

function findIds(html) {
  const ids = new Map();
  const re = /<([a-zA-Z][\w:-]*)\b([^>]*)>/g;
  let match;
  while ((match = re.exec(html))) {
    const a = attrs(match[2]);
    if (!a.id) continue;
    if (!ids.has(a.id)) ids.set(a.id, []);
    ids.get(a.id).push(lineOf(html, match.index));
  }
  return ids;
}

function hasWrappingLabel(html, index) {
  const before = html.slice(0, index);
  const lastOpen = before.toLowerCase().lastIndexOf('<label');
  const lastClose = before.toLowerCase().lastIndexOf('</label>');
  if (lastOpen === -1 || lastOpen < lastClose) return false;
  const nextClose = html.toLowerCase().indexOf('</label>', index);
  return nextClose !== -1;
}

function auditFile(file) {
  const html = fs.readFileSync(file, 'utf8');
  const idMap = findIds(html);
  const ids = new Set(idMap.keys());
  const issues = [];
  const warnings = [];

  function report(level, index, message) {
    (level === 'warn' ? warnings : issues).push({
      file: rel(file),
      line: lineOf(html, index),
      message,
    });
  }

  const htmlTag = html.match(/<html\b([^>]*)>/i);
  if (!htmlTag || !attrs(htmlTag[1]).lang) {
    report('error', htmlTag ? html.indexOf(htmlTag[0]) : 0, '<html> must include lang');
  }

  const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  if (!title || !stripTags(title[1])) {
    report('error', title ? html.indexOf(title[0]) : 0, 'Page must include a non-empty <title>');
  }

  for (const [id, lines] of idMap.entries()) {
    if (lines.length > 1) {
      report('error', 0, `Duplicate id "${id}" on lines ${lines.join(', ')}`);
    }
  }

  let match;

  const skipLinkRe = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  while ((match = skipLinkRe.exec(html))) {
    const a = attrs(match[1]);
    const text = stripTags(match[2]).toLowerCase();
    if (!text.includes('skip')) continue;
    const href = a.href || '';
    if (!href.startsWith('#') || !ids.has(href.slice(1))) {
      report('error', match.index, `Skip link target "${href}" does not exist`);
    }
  }

  const navRe = /<nav\b([^>]*)>/gi;
  while ((match = navRe.exec(html))) {
    const a = attrs(match[1]);
    if (!a['aria-label'] && !a['aria-labelledby']) {
      report('error', match.index, '<nav> landmark needs aria-label or aria-labelledby');
    }
  }

  const imgRe = /<img\b([^>]*)>/gi;
  while ((match = imgRe.exec(html))) {
    const a = attrs(match[1]);
    if (a['aria-hidden'] === 'true' || a.role === 'presentation' || a.role === 'none') continue;
    if (a.alt === undefined) {
      report('error', match.index, '<img> must include alt (use alt="" for decorative images)');
    }
  }

  const iframeRe = /<iframe\b([^>]*)>/gi;
  while ((match = iframeRe.exec(html))) {
    const a = attrs(match[1]);
    if (!a.title) report('error', match.index, '<iframe> must include title');
  }

  const buttonRe = /<button\b([^>]*)>([\s\S]*?)<\/button>/gi;
  while ((match = buttonRe.exec(html))) {
    const a = attrs(match[1]);
    if (a['aria-hidden'] === 'true') continue;
    if (!hasName(a, match[2])) report('error', match.index, '<button> needs an accessible name');
  }

  const linkRe = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  while ((match = linkRe.exec(html))) {
    const a = attrs(match[1]);
    if (a['aria-hidden'] === 'true' || a.role === 'presentation' || a.role === 'none') continue;
    if (a.href !== undefined && !hasName(a, match[2])) {
      report('error', match.index, '<a href> needs an accessible name');
    }
    if ((a.href || '') === '#') {
      report('warn', match.index, 'Placeholder href="#" should be replaced before production');
    }
    if ((a.href || '').startsWith('#') && a.href !== '#' && !ids.has(a.href.slice(1))) {
      report('error', match.index, `Fragment target "${a.href}" does not exist`);
    }
  }

  const controlRe = /<(input|select|textarea)\b([^>]*)>/gi;
  const labelFor = new Set();
  const labelRe = /<label\b([^>]*)>/gi;
  while ((match = labelRe.exec(html))) {
    const a = attrs(match[1]);
    if (a.for) labelFor.add(a.for);
  }
  while ((match = controlRe.exec(html))) {
    const tag = match[1].toLowerCase();
    const a = attrs(match[2]);
    const type = (a.type || '').toLowerCase();
    if (tag === 'input' && ['hidden', 'button', 'submit', 'reset'].includes(type)) continue;
    if (a['aria-hidden'] === 'true') continue;
    const labelled =
      (a.id && labelFor.has(a.id)) ||
      a['aria-label'] ||
      a['aria-labelledby'] ||
      hasWrappingLabel(html, match.index);
    if (!labelled) report('error', match.index, `<${tag}> needs an associated label`);
  }

  const ariaRefRe = /<([a-zA-Z][\w:-]*)\b([^>]*)>/g;
  while ((match = ariaRefRe.exec(html))) {
    const a = attrs(match[2]);
    for (const attr of ['aria-labelledby', 'aria-describedby', 'aria-controls']) {
      if (!a[attr]) continue;
      for (const id of a[attr].trim().split(/\s+/)) {
        if (!ids.has(id)) report('error', match.index, `${attr} references missing id "${id}"`);
      }
    }
  }

  return { issues, warnings };
}

const files = walk(PUBLIC).filter(file => !isExcluded(file)).sort();
const allIssues = [];
const allWarnings = [];
const showWarnings = process.argv.includes('--show-warnings');

for (const file of files) {
  const result = auditFile(file);
  allIssues.push(...result.issues);
  allWarnings.push(...result.warnings);
}

for (const item of allIssues) {
  console.log(`ERROR ${item.file}:${item.line} ${item.message}`);
}
if (showWarnings) {
  for (const item of allWarnings) {
    console.log(`WARN  ${item.file}:${item.line} ${item.message}`);
  }
} else if (allWarnings.length) {
  const byMessage = new Map();
  for (const item of allWarnings) {
    byMessage.set(item.message, (byMessage.get(item.message) || 0) + 1);
  }
  for (const [message, count] of byMessage.entries()) {
    console.log(`WARN  ${count}x ${message}`);
  }
  console.log('Run with --show-warnings to print every warning location.');
}

console.log(`\nAccessibility audit: ${files.length} page(s), ${allIssues.length} error(s), ${allWarnings.length} warning(s).`);
if (allIssues.length) process.exit(1);
