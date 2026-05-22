const fs = require('fs');
const dir = 'c:/Apps/designsystem/public/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'index.html');
const log = [];

for (const file of files) {
  const fp = `${dir}/${file}`;
  let html = fs.readFileSync(fp, 'utf8');
  const name = file.replace('.html', '');

  const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/);
  const titleName = titleMatch
    ? titleMatch[1].trim()
    : name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const baseLink = '<link href="/assets/css/caat-base.css" rel="stylesheet">';
  if (html.includes(baseLink)) {
    const imports = [];
    if (!html.includes('/assets/css/components/badge.css')) {
      imports.push('<link href="/assets/css/components/badge.css" rel="stylesheet">');
    }
    if (!html.includes('/assets/css/components/breadcrumb.css')) {
      imports.push('<link href="/assets/css/components/breadcrumb.css" rel="stylesheet">');
    }
    if (!html.includes('/assets/css/components/button.css')) {
      imports.push('<link href="/assets/css/components/button.css" rel="stylesheet">');
    }

    if (imports.length) {
      html = html.replace(baseLink, `${baseLink}\n${imports.join('\n')}`);
      log.push(`${file}: added imports ${imports.join(', ')}`);
    }
  }

  const resourceMatch = html.match(/<span class="badge bg-secondary">(.*?)<\/span>/);
  const resourceType = resourceMatch ? resourceMatch[1].trim() : `caat/components/${name}`;

  const figmaMatch = html.match(/onclick="(downloadFigmaHTML\([^\"]+\)); return false;"/);
  const figmaCall = figmaMatch ? figmaMatch[1] : null;

  const mainContentMarker = '  <main>\n\n    <!-- Page header -->';
  if (html.includes(mainContentMarker) && !html.includes('caat-breadcrumb')) {
    html = html.replace(mainContentMarker,
      `  <main>\n\n    <!-- Breadcrumb -->\n    <nav class="caat-breadcrumb mb-3" aria-label="Breadcrumb">\n      <ol class="breadcrumb">\n        <li class="breadcrumb-item"><a href="/components/index.html">Components</a></li>\n        <li class="breadcrumb-item active" aria-current="page">${titleName}</li>\n      </ol>\n    </nav>\n\n    <!-- Page header -->`);
    log.push(`${file}: inserted breadcrumb`);
  }

  const actionRowRegex = /<div class="d-flex gap-2 flex-wrap mb-3">[\s\S]*?<\/div>/;
  if (figmaCall && actionRowRegex.test(html)) {
    const newRow = [
      '<div class="d-flex gap-2 align-items-center flex-wrap mb-3">',
      `        <span class="caat-badge caat-badge--outline caat-badge--pill">${resourceType}</span>`,
      `        <a href="#" onclick="${figmaCall}; return false;" class="caat-button caat-button--secondary"><i class="bi bi-download"></i> Figma HTML</a>`,
      '      </div>'
    ].join('\n');

    html = html.replace(actionRowRegex, newRow);
    log.push(`${file}: replaced action row`);
  } else {
    log.push(`${file}: skipped action row figmaCall=${Boolean(figmaCall)} actionRow=${actionRowRegex.test(html)}`);
  }

  fs.writeFileSync(fp, html, 'utf8');
}

fs.writeFileSync('c:/Apps/designsystem/fix-page-headers.log', log.join('\n'), 'utf8');
