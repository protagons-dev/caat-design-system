const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'public', 'components');

fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'index.html').forEach(f => {
  const p = path.join(dir, f);
  let h = fs.readFileSync(p, 'utf8');
  if (h.includes('figma-template') && !h.includes('<script src="/assets/js/figma-export.js"></script>')) {
    h = h.replace('</body>', '<script src="/assets/js/figma-export.js"></script>\n</body>');
    fs.writeFileSync(p, h, 'utf8');
    console.log('Fixed: ' + f);
  } else if (!h.includes('figma-template')) {
    console.log('No template: ' + f);
  } else {
    console.log('Already has script: ' + f);
  }
});
