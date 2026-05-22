#!/usr/bin/env node
/**
 * add-figma-exports.js
 *
 * Patches every component contract page to add:
 *  1. A "Figma HTML" download badge in the header
 *  2. A <template id="figma-template"> with component-specific markup
 *  3. A <script src="/assets/js/figma-export.js"> before </body>
 *
 * Run once:  node scripts/add-figma-exports.js
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '..', 'public', 'components');

// ─── Component definitions ──────────────────────────────────────────────
// Each entry: { file, name, css[], template }
// css[] = paths passed to downloadFigmaHTML()
// template = the HTML that goes inside <template id="figma-template">

const components = [

// ── Accordion ──
{
  file: 'accordion.html',
  name: 'Accordion',
  css: ['/assets/css/tokens.css', '/assets/css/components/accordion.css'],
  template: `
<h1 class="figma-page-title">Accordion</h1>
<p class="figma-page-subtitle">CAAT Design System · All variants and states</p>

<div class="figma-section">
  <h2 class="figma-section-title">Default</h2>
  <div class="figma-row">
    <span class="figma-row-label">Collapsed</span>
    <div class="figma-row-items" style="flex-direction:column;align-items:stretch;max-width:36rem;">
      <div class="caat-accordion">
        <div class="accordion-item" style="border:1px solid var(--caat-grey-200);border-radius:var(--caat-radius);">
          <h3 class="accordion-header"><button class="accordion-button collapsed" style="border-radius:var(--caat-radius);">What is DBplus?</button></h3>
        </div>
      </div>
    </div>
  </div>
  <div class="figma-row">
    <span class="figma-row-label">Expanded</span>
    <div class="figma-row-items" style="flex-direction:column;align-items:stretch;max-width:36rem;">
      <div class="caat-accordion">
        <div class="accordion-item" style="border:1px solid var(--caat-grey-200);border-radius:var(--caat-radius);">
          <h3 class="accordion-header"><button class="accordion-button" style="border-radius:var(--caat-radius) var(--caat-radius) 0 0;">What is DBplus?</button></h3>
          <div class="accordion-body">DBplus is a modern defined benefit pension plan that provides a predictable, secure lifetime pension. Members and employers share the cost equally.</div>
        </div>
      </div>
    </div>
  </div>
  <div class="figma-row">
    <span class="figma-row-label">Focus</span>
    <div class="figma-row-items" style="flex-direction:column;align-items:stretch;max-width:36rem;">
      <div class="caat-accordion">
        <div class="accordion-item" style="border:1px solid var(--caat-grey-200);border-radius:var(--caat-radius);">
          <h3 class="accordion-header"><button class="accordion-button collapsed" style="border-radius:var(--caat-radius);box-shadow:var(--caat-focus);border-color:var(--caat-blue-300);">How do contributions work?</button></h3>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Multi-item Group</h2>
  <div class="figma-row">
    <span class="figma-row-label">Stacked</span>
    <div class="figma-row-items" style="flex-direction:column;align-items:stretch;max-width:36rem;">
      <div class="caat-accordion">
        <div class="accordion-item" style="border:1px solid var(--caat-grey-200);border-bottom:0;">
          <h3 class="accordion-header"><button class="accordion-button" style="background:var(--caat-blue-100);box-shadow:inset 0 -1px 0 var(--caat-grey-200);">What is DBplus?</button></h3>
          <div class="accordion-body">DBplus is a modern defined benefit pension plan.</div>
        </div>
        <div class="accordion-item" style="border:1px solid var(--caat-grey-200);border-bottom:0;">
          <h3 class="accordion-header"><button class="accordion-button collapsed">How do I enroll?</button></h3>
        </div>
        <div class="accordion-item" style="border:1px solid var(--caat-grey-200);">
          <h3 class="accordion-header"><button class="accordion-button collapsed">What happens when I retire?</button></h3>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Specifications</h2>
  <div class="figma-specs">
    <div class="figma-spec"><strong>Font</strong>Libre Franklin 800</div>
    <div class="figma-spec"><strong>Expanded bg</strong>var(--caat-blue-100)</div>
    <div class="figma-spec"><strong>Text colour</strong>var(--caat-blue-900)</div>
    <div class="figma-spec"><strong>Border</strong>var(--caat-grey-200)</div>
    <div class="figma-spec"><strong>Focus ring</strong>var(--caat-focus)</div>
    <div class="figma-spec"><strong>Body text</strong>var(--caat-ink), line-height 1.6</div>
  </div>
</div>
`
},

// ── Alerts ──
{
  file: 'alerts.html',
  name: 'Alert',
  css: ['/assets/css/tokens.css', '/assets/css/components/alerts.css'],
  template: `
<h1 class="figma-page-title">Alert</h1>
<p class="figma-page-subtitle">CAAT Design System · All variants and states</p>

<div class="figma-section">
  <h2 class="figma-section-title">Variants</h2>
  <div class="figma-row">
    <span class="figma-row-label">Info</span>
    <div class="figma-row-items" style="flex:1;max-width:36rem;">
      <div class="caat-alert caat-alert--info" style="width:100%;"><span class="caat-alert__icon"><i class="bi bi-info-circle-fill"></i></span><div class="caat-alert__body"><h4 class="caat-alert__heading">Did you know?</h4><p>Your pension grows each year you contribute to DBplus.</p></div></div>
    </div>
  </div>
  <div class="figma-row">
    <span class="figma-row-label">Success</span>
    <div class="figma-row-items" style="flex:1;max-width:36rem;">
      <div class="caat-alert caat-alert--success" style="width:100%;"><span class="caat-alert__icon"><i class="bi bi-check-circle-fill"></i></span><div class="caat-alert__body"><h4 class="caat-alert__heading">Success</h4><p>Your beneficiary details have been updated.</p></div></div>
    </div>
  </div>
  <div class="figma-row">
    <span class="figma-row-label">Warning</span>
    <div class="figma-row-items" style="flex:1;max-width:36rem;">
      <div class="caat-alert caat-alert--warning" style="width:100%;"><span class="caat-alert__icon"><i class="bi bi-exclamation-triangle-fill"></i></span><div class="caat-alert__body"><h4 class="caat-alert__heading">Attention</h4><p>Please review your contact information before submitting.</p></div></div>
    </div>
  </div>
  <div class="figma-row">
    <span class="figma-row-label">Danger</span>
    <div class="figma-row-items" style="flex:1;max-width:36rem;">
      <div class="caat-alert caat-alert--danger" style="width:100%;"><span class="caat-alert__icon"><i class="bi bi-x-circle-fill"></i></span><div class="caat-alert__body"><h4 class="caat-alert__heading">Error</h4><p>We couldn't process your request. Please try again.</p></div></div>
    </div>
  </div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Dismissible</h2>
  <div class="figma-row">
    <span class="figma-row-label">With close</span>
    <div class="figma-row-items" style="flex:1;max-width:36rem;">
      <div class="caat-alert caat-alert--info" style="width:100%;"><span class="caat-alert__icon"><i class="bi bi-info-circle-fill"></i></span><div class="caat-alert__body"><p>This is a dismissible alert with a close button.</p></div><button class="caat-alert__close" aria-label="Close">×</button></div>
    </div>
  </div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Specifications</h2>
  <div class="figma-specs">
    <div class="figma-spec"><strong>Padding</strong>1rem 1.25rem</div>
    <div class="figma-spec"><strong>Border radius</strong>var(--caat-radius)</div>
    <div class="figma-spec"><strong>Font size</strong>0.95rem</div>
    <div class="figma-spec"><strong>Icon size</strong>1.25rem</div>
    <div class="figma-spec"><strong>Gap</strong>0.75rem</div>
  </div>
  <h3 class="figma-colour-heading">Colour values</h3>
  <div class="figma-specs">
    <div class="figma-spec"><strong>Info bg</strong>#cfe2ff</div>
    <div class="figma-spec"><strong>Success bg</strong>#d1e7dd</div>
    <div class="figma-spec"><strong>Warning bg</strong>#fff3cd</div>
    <div class="figma-spec"><strong>Danger bg</strong>#f8d7da</div>
  </div>
</div>
`
},

// ── Badge ──
{
  file: 'badge.html',
  name: 'Badge',
  css: ['/assets/css/tokens.css', '/assets/css/components/badge.css'],
  template: `
<h1 class="figma-page-title">Badge</h1>
<p class="figma-page-subtitle">CAAT Design System · All variants</p>

<div class="figma-section">
  <h2 class="figma-section-title">Colour Variants</h2>
  <div class="figma-row"><span class="figma-row-label">Primary</span><div class="figma-row-items"><span class="caat-badge caat-badge--primary">Primary</span></div></div>
  <div class="figma-row"><span class="figma-row-label">Secondary</span><div class="figma-row-items"><span class="caat-badge caat-badge--secondary">Secondary</span></div></div>
  <div class="figma-row"><span class="figma-row-label">Info</span><div class="figma-row-items"><span class="caat-badge caat-badge--info">Info</span></div></div>
  <div class="figma-row"><span class="figma-row-label">Warning</span><div class="figma-row-items"><span class="caat-badge caat-badge--warning">Warning</span></div></div>
  <div class="figma-row"><span class="figma-row-label">Danger</span><div class="figma-row-items"><span class="caat-badge caat-badge--danger">Danger</span></div></div>
  <div class="figma-row"><span class="figma-row-label">Light</span><div class="figma-row-items"><span class="caat-badge caat-badge--light">Light</span></div></div>
  <div class="figma-row"><span class="figma-row-label">Dark</span><div class="figma-row-items"><span class="caat-badge caat-badge--dark">Dark</span></div></div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Pill Variants</h2>
  <div class="figma-row"><span class="figma-row-label">Primary Pill</span><div class="figma-row-items"><span class="caat-badge caat-badge--primary caat-badge--pill">Primary</span></div></div>
  <div class="figma-row"><span class="figma-row-label">Outline Pill</span><div class="figma-row-items"><span class="caat-badge caat-badge--outline caat-badge--pill">Outline</span></div></div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Soft Variants</h2>
  <div class="figma-row"><span class="figma-row-label">Soft Blue</span><div class="figma-row-items"><span class="caat-badge caat-badge--soft-blue caat-badge--pill">Pension News</span></div></div>
  <div class="figma-row"><span class="figma-row-label">Soft Green</span><div class="figma-row-items"><span class="caat-badge caat-badge--soft-green caat-badge--pill">Employer</span></div></div>
  <div class="figma-row"><span class="figma-row-label">Soft Teal</span><div class="figma-row-items"><span class="caat-badge caat-badge--soft-teal caat-badge--pill">Investment</span></div></div>
  <div class="figma-row"><span class="figma-row-label">Soft Warning</span><div class="figma-row-items"><span class="caat-badge caat-badge--soft-warning caat-badge--pill">Attention</span></div></div>
  <div class="figma-row"><span class="figma-row-label">Soft Danger</span><div class="figma-row-items"><span class="caat-badge caat-badge--soft-danger caat-badge--pill">Urgent</span></div></div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Status Badges</h2>
  <div class="figma-row"><span class="figma-row-label">Active</span><div class="figma-row-items"><span class="caat-badge caat-badge--active caat-badge--pill">Active</span></div></div>
  <div class="figma-row"><span class="figma-row-label">Pending</span><div class="figma-row-items"><span class="caat-badge caat-badge--pending caat-badge--pill">Pending</span></div></div>
  <div class="figma-row"><span class="figma-row-label">Retired</span><div class="figma-row-items"><span class="caat-badge caat-badge--retired caat-badge--pill">Retired</span></div></div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Specifications</h2>
  <div class="figma-specs">
    <div class="figma-spec"><strong>Font size</strong>0.75rem</div>
    <div class="figma-spec"><strong>Font weight</strong>700</div>
    <div class="figma-spec"><strong>Padding (base)</strong>0.35em 0.65em</div>
    <div class="figma-spec"><strong>Padding (pill)</strong>0.35em 0.75em</div>
    <div class="figma-spec"><strong>Radius (base)</strong>0.375rem</div>
    <div class="figma-spec"><strong>Radius (pill)</strong>50rem</div>
  </div>
</div>
`
},

// ── Breadcrumb ──
{
  file: 'breadcrumb.html',
  name: 'Breadcrumb',
  css: ['/assets/css/tokens.css', '/assets/css/components/breadcrumb.css'],
  template: `
<h1 class="figma-page-title">Breadcrumb</h1>
<p class="figma-page-subtitle">CAAT Design System · All variants</p>

<div class="figma-section">
  <h2 class="figma-section-title">Default</h2>
  <div class="figma-row">
    <span class="figma-row-label">Standard</span>
    <div class="figma-row-items">
      <nav class="caat-breadcrumb" aria-label="breadcrumb"><ol class="breadcrumb"><li class="breadcrumb-item"><a href="#">Home</a></li><li class="breadcrumb-item"><a href="#">Members</a></li><li class="breadcrumb-item active" aria-current="page">My Pension</li></ol></nav>
    </div>
  </div>
  <div class="figma-row">
    <span class="figma-row-label">Truncated</span>
    <div class="figma-row-items">
      <nav class="caat-breadcrumb caat-breadcrumb--truncated" aria-label="breadcrumb"><ol class="breadcrumb"><li class="breadcrumb-item"><a href="#">Home</a></li><li class="breadcrumb-item breadcrumb-item--ellipsis">…</li><li class="breadcrumb-item active" aria-current="page">Current Page</li></ol></nav>
    </div>
  </div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Specifications</h2>
  <div class="figma-specs">
    <div class="figma-spec"><strong>Font size</strong>0.85rem</div>
    <div class="figma-spec"><strong>Link colour</strong>var(--caat-blue-900)</div>
    <div class="figma-spec"><strong>Link weight</strong>500</div>
    <div class="figma-spec"><strong>Active colour</strong>var(--caat-muted)</div>
  </div>
</div>
`
},

// ── Card ──
{
  file: 'card.html',
  name: 'Card',
  css: ['/assets/css/tokens.css', '/assets/css/components/card.css'],
  template: `
<h1 class="figma-page-title">Card</h1>
<p class="figma-page-subtitle">CAAT Design System · All variants and states</p>

<div class="figma-section">
  <h2 class="figma-section-title">Default Card</h2>
  <div class="figma-row">
    <span class="figma-row-label">Default</span>
    <div class="figma-row-items">
      <div class="caat-card" style="width:18rem;"><div style="padding:1.25rem;"><div class="icon-token"><i class="bi bi-shield-check"></i></div><h3 style="font-size:1.1rem;font-weight:700;color:var(--caat-blue-900);text-align:center;">Secure Pension</h3><p style="font-size:.9rem;color:var(--caat-ink);text-align:center;">Your pension is backed by a robust funding framework.</p></div></div>
    </div>
  </div>
  <div class="figma-row">
    <span class="figma-row-label">Hover</span>
    <div class="figma-row-items">
      <div class="caat-card" style="width:18rem;transform:translateY(-3px);box-shadow:var(--caat-shadow);border-color:var(--caat-blue-300);"><div style="padding:1.25rem;"><div class="icon-token"><i class="bi bi-shield-check"></i></div><h3 style="font-size:1.1rem;font-weight:700;color:var(--caat-blue-900);text-align:center;">Secure Pension</h3><p style="font-size:.9rem;color:var(--caat-ink);text-align:center;">Your pension is backed by a robust funding framework.</p></div></div>
    </div>
  </div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Image Card</h2>
  <div class="figma-row">
    <span class="figma-row-label">With image</span>
    <div class="figma-row-items">
      <div class="caat-card" style="width:18rem;"><div class="caat-card-image" style="background:var(--caat-grey);display:flex;align-items:center;justify-content:center;color:var(--caat-muted);font-size:2rem;"><i class="bi bi-image"></i></div><div style="padding:1.25rem;"><span class="caat-card-kicker">Pension News</span><h3 style="font-size:1.1rem;font-weight:700;color:var(--caat-blue-900);">DBplus plan updates</h3><p style="font-size:.875rem;color:var(--caat-ink);">Latest changes to your pension plan benefits.</p></div></div>
    </div>
  </div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Icon Token Variants</h2>
  <div class="figma-row">
    <span class="figma-row-label">Blue</span>
    <div class="figma-row-items"><div class="icon-token" style="width:3rem;height:3rem;border-radius:50%;display:grid;place-items:center;background:var(--caat-blue-100);color:var(--caat-blue-900);font-size:1.5rem;"><i class="bi bi-shield-check"></i></div></div>
  </div>
  <div class="figma-row">
    <span class="figma-row-label">Green</span>
    <div class="figma-row-items"><div class="icon-token green" style="width:3rem;height:3rem;border-radius:50%;display:grid;place-items:center;background:var(--caat-green-100);color:var(--caat-green-700);font-size:1.5rem;"><i class="bi bi-graph-up-arrow"></i></div></div>
  </div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Specifications</h2>
  <div class="figma-specs">
    <div class="figma-spec"><strong>Border</strong>1px solid var(--caat-grey-200)</div>
    <div class="figma-spec"><strong>Border radius</strong>var(--caat-radius)</div>
    <div class="figma-spec"><strong>Hover shadow</strong>var(--caat-shadow)</div>
    <div class="figma-spec"><strong>Hover border</strong>var(--caat-blue-300)</div>
    <div class="figma-spec"><strong>Hover lift</strong>translateY(-3px)</div>
    <div class="figma-spec"><strong>Image height</strong>12rem (default)</div>
    <div class="figma-spec"><strong>Kicker</strong>0.78rem, uppercase, 900 weight</div>
  </div>
</div>
`
},

// ── Dropdown ──
{
  file: 'dropdown.html',
  name: 'Dropdown',
  css: ['/assets/css/tokens.css', '/assets/css/components/dropdown.css'],
  template: `
<h1 class="figma-page-title">Dropdown</h1>
<p class="figma-page-subtitle">CAAT Design System · Menu variants and states</p>

<div class="figma-section">
  <h2 class="figma-section-title">Menu Items — States</h2>
  <div class="figma-row"><span class="figma-row-label">Default</span><div class="figma-row-items"><div style="padding:.5rem 1rem;font-size:.9rem;color:var(--caat-ink);font-weight:500;">Menu Item</div></div></div>
  <div class="figma-row"><span class="figma-row-label">Hover</span><div class="figma-row-items"><div style="padding:.5rem 1rem;font-size:.9rem;background:var(--caat-blue-100);color:var(--caat-blue-900);font-weight:500;border-radius:.25rem;">Menu Item</div></div></div>
  <div class="figma-row"><span class="figma-row-label">Active</span><div class="figma-row-items"><div style="padding:.5rem 1rem;font-size:.9rem;background:var(--caat-blue-900);color:#fff;font-weight:500;border-radius:.25rem;">Menu Item</div></div></div>
  <div class="figma-row"><span class="figma-row-label">Disabled</span><div class="figma-row-items"><div style="padding:.5rem 1rem;font-size:.9rem;color:var(--caat-disabled);font-weight:500;">Menu Item</div></div></div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Menu Anatomy</h2>
  <div class="figma-row">
    <span class="figma-row-label">Light menu</span>
    <div class="figma-row-items">
      <div style="border:1px solid var(--caat-grey-200);border-radius:var(--caat-radius);box-shadow:var(--caat-shadow);padding:.5rem 0;min-width:12rem;background:#fff;">
        <div style="padding:.5rem 1rem .25rem;font-size:.75rem;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:var(--caat-muted);">Section</div>
        <div style="padding:.5rem 1rem;font-size:.9rem;color:var(--caat-ink);font-weight:500;">Action one</div>
        <div style="padding:.5rem 1rem;font-size:.9rem;color:var(--caat-ink);font-weight:500;">Action two</div>
        <hr style="border-top:1px solid var(--caat-grey-200);margin:.35rem 0;">
        <div style="padding:.5rem 1rem;font-size:.9rem;color:var(--caat-ink);font-weight:500;">Action three</div>
      </div>
    </div>
  </div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Specifications</h2>
  <div class="figma-specs">
    <div class="figma-spec"><strong>Border</strong>1px solid var(--caat-grey-200)</div>
    <div class="figma-spec"><strong>Radius</strong>var(--caat-radius)</div>
    <div class="figma-spec"><strong>Shadow</strong>var(--caat-shadow)</div>
    <div class="figma-spec"><strong>Item padding</strong>0.5rem 1rem</div>
    <div class="figma-spec"><strong>Font size</strong>0.9rem</div>
    <div class="figma-spec"><strong>Min width</strong>12rem</div>
  </div>
</div>
`
},

// ── Forms ──
{
  file: 'forms.html',
  name: 'Form',
  css: ['/assets/css/tokens.css', '/assets/css/components/forms.css'],
  template: `
<h1 class="figma-page-title">Form</h1>
<p class="figma-page-subtitle">CAAT Design System · Input types, validation, and multi-step</p>

<div class="figma-section">
  <h2 class="figma-section-title">Input States</h2>
  <div class="figma-row"><span class="figma-row-label">Default</span><div class="figma-row-items" style="max-width:20rem;flex:1;"><label style="font-weight:700;color:var(--caat-blue-900);font-size:.9rem;display:block;margin-bottom:.25rem;">Full name</label><input type="text" placeholder="Enter your name" style="width:100%;min-height:3.4rem;padding:.5rem .75rem;border:1px solid #ced4da;border-radius:.375rem;font-family:var(--caat-font-primary);font-size:1rem;"></div></div>
  <div class="figma-row"><span class="figma-row-label">Focus</span><div class="figma-row-items" style="max-width:20rem;flex:1;"><label style="font-weight:700;color:var(--caat-blue-900);font-size:.9rem;display:block;margin-bottom:.25rem;">Full name</label><input type="text" value="John Smith" style="width:100%;min-height:3.4rem;padding:.5rem .75rem;border:1px solid var(--caat-blue-900);border-radius:.375rem;font-family:var(--caat-font-primary);font-size:1rem;box-shadow:var(--caat-focus);"></div></div>
  <div class="figma-row"><span class="figma-row-label">Valid</span><div class="figma-row-items" style="max-width:20rem;flex:1;"><label style="font-weight:700;color:var(--caat-blue-900);font-size:.9rem;display:block;margin-bottom:.25rem;">Email</label><input type="text" value="john@example.com" style="width:100%;min-height:3.4rem;padding:.5rem .75rem;border:2px solid var(--caat-green);border-radius:.375rem;font-family:var(--caat-font-primary);font-size:1rem;"></div></div>
  <div class="figma-row"><span class="figma-row-label">Invalid</span><div class="figma-row-items" style="max-width:20rem;flex:1;"><label style="font-weight:700;color:var(--caat-blue-900);font-size:.9rem;display:block;margin-bottom:.25rem;">Email</label><input type="text" value="invalid" style="width:100%;min-height:3.4rem;padding:.5rem .75rem;border:2px solid var(--caat-danger);border-radius:.375rem;font-family:var(--caat-font-primary);font-size:1rem;"><div style="color:var(--caat-danger);font-size:.85rem;margin-top:.25rem;">Please enter a valid email address.</div></div></div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Specifications</h2>
  <div class="figma-specs">
    <div class="figma-spec"><strong>Input height</strong>3.4rem</div>
    <div class="figma-spec"><strong>Label weight</strong>700</div>
    <div class="figma-spec"><strong>Label colour</strong>var(--caat-blue-900)</div>
    <div class="figma-spec"><strong>Border radius</strong>0.375rem</div>
    <div class="figma-spec"><strong>Focus ring</strong>var(--caat-focus)</div>
    <div class="figma-spec"><strong>Valid border</strong>var(--caat-green)</div>
    <div class="figma-spec"><strong>Invalid border</strong>var(--caat-danger)</div>
  </div>
</div>
`
},

// ── Hero ──
{
  file: 'hero.html',
  name: 'Hero',
  css: ['/assets/css/tokens.css', '/assets/css/components/hero.css'],
  template: `
<h1 class="figma-page-title">Hero</h1>
<p class="figma-page-subtitle">CAAT Design System · Composable hero variants</p>

<div class="figma-section">
  <h2 class="figma-section-title">Hero Card</h2>
  <div class="figma-row">
    <span class="figma-row-label">Default</span>
    <div class="figma-row-items">
      <div style="background:rgba(0,94,128,.94);color:#fff;border-radius:0 0 4.5rem 0;padding:2rem;max-width:22rem;">
        <div style="color:rgba(255,255,255,.7);font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;margin-bottom:.5rem;">Pension Solutions</div>
        <div style="width:8rem;height:.35rem;background:var(--caat-green);margin-bottom:1rem;"></div>
        <h3 style="font-weight:800;color:#fff;font-size:1.35rem;letter-spacing:-.03em;margin-bottom:.5rem;">A pension that works for you</h3>
        <p style="color:rgba(255,255,255,.88);font-size:.9rem;">Learn how DBplus provides secure, lifetime retirement income.</p>
      </div>
    </div>
  </div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Stat Strip</h2>
  <div class="figma-row">
    <span class="figma-row-label">Stats</span>
    <div class="figma-row-items" style="flex:1;">
      <div class="caat-stat-strip" style="width:100%;max-width:36rem;border-radius:0 0 var(--caat-radius-lg) var(--caat-radius-lg);">
        <div class="caat-stat-item"><strong>$73B</strong><span>Assets</span></div>
        <div class="caat-stat-item"><strong>94K+</strong><span>Members</span></div>
        <div class="caat-stat-item"><strong>700+</strong><span>Employers</span></div>
      </div>
    </div>
  </div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Specifications</h2>
  <div class="figma-specs">
    <div class="figma-spec"><strong>Card bg</strong>rgba(0,94,128,.94)</div>
    <div class="figma-spec"><strong>Card radius</strong>0 0 4.5rem 0</div>
    <div class="figma-spec"><strong>Accent rule</strong>var(--caat-green), .35rem high</div>
    <div class="figma-spec"><strong>Stat strip bg</strong>var(--caat-blue-900)</div>
    <div class="figma-spec"><strong>Stat value</strong>1.75rem, weight 900</div>
    <div class="figma-spec"><strong>Media min-height</strong>22rem</div>
  </div>
</div>
`
},

// ── List Group ──
{
  file: 'list-group.html',
  name: 'List Group',
  css: ['/assets/css/tokens.css', '/assets/css/components/list-group.css'],
  template: `
<h1 class="figma-page-title">List Group</h1>
<p class="figma-page-subtitle">CAAT Design System · All variants and states</p>

<div class="figma-section">
  <h2 class="figma-section-title">Item States</h2>
  <div class="figma-row"><span class="figma-row-label">Default</span><div class="figma-row-items"><div style="padding:.875rem 1.25rem;font-size:.95rem;color:var(--caat-ink);background:#fff;border:1px solid var(--caat-grey-200);border-radius:var(--caat-radius);min-width:16rem;">List item</div></div></div>
  <div class="figma-row"><span class="figma-row-label">Hover</span><div class="figma-row-items"><div style="padding:.875rem 1.25rem;font-size:.95rem;color:var(--caat-blue-900);background:var(--caat-blue-100);border:1px solid var(--caat-grey-200);border-radius:var(--caat-radius);min-width:16rem;">List item</div></div></div>
  <div class="figma-row"><span class="figma-row-label">Active</span><div class="figma-row-items"><div style="padding:.875rem 1.25rem;font-size:.95rem;color:#fff;background:var(--caat-blue-900);border:1px solid var(--caat-blue-900);border-radius:var(--caat-radius);min-width:16rem;">List item</div></div></div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">With Badge</h2>
  <div class="figma-row"><span class="figma-row-label">Badge</span><div class="figma-row-items"><div style="padding:.875rem 1.25rem;font-size:.95rem;color:var(--caat-ink);background:#fff;border:1px solid var(--caat-grey-200);border-radius:var(--caat-radius);min-width:16rem;display:flex;justify-content:space-between;align-items:center;">Documents <span class="caat-list-group__badge">3</span></div></div></div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Specifications</h2>
  <div class="figma-specs">
    <div class="figma-spec"><strong>Padding</strong>0.875rem 1.25rem</div>
    <div class="figma-spec"><strong>Font size</strong>0.95rem</div>
    <div class="figma-spec"><strong>Border</strong>1px solid var(--caat-grey-200)</div>
    <div class="figma-spec"><strong>Active bg</strong>var(--caat-blue-900)</div>
    <div class="figma-spec"><strong>Hover bg</strong>var(--caat-blue-100)</div>
  </div>
</div>
`
},

// ── Modal ──
{
  file: 'modal.html',
  name: 'Modal',
  css: ['/assets/css/tokens.css', '/assets/css/components/modal.css'],
  template: `
<h1 class="figma-page-title">Modal</h1>
<p class="figma-page-subtitle">CAAT Design System · Dialog variants</p>

<div class="figma-section">
  <h2 class="figma-section-title">Standard Modal</h2>
  <div class="figma-row">
    <span class="figma-row-label">Default</span>
    <div class="figma-row-items">
      <div style="border-radius:var(--caat-radius);box-shadow:var(--caat-shadow);background:#fff;width:24rem;overflow:hidden;">
        <div style="padding:1.25rem 1.5rem;border-bottom:2px solid var(--caat-grey-200);display:flex;justify-content:space-between;align-items:center;"><span style="font-weight:800;color:var(--caat-blue-900);font-size:1.2rem;">Modal Title</span><span style="font-size:1.25rem;cursor:pointer;">×</span></div>
        <div style="padding:1.5rem;font-size:.95rem;line-height:1.6;color:var(--caat-ink);">Modal body content goes here. This is a standard informational dialog.</div>
        <div style="padding:1rem 1.5rem;border-top:1px solid var(--caat-grey-200);display:flex;gap:.5rem;justify-content:flex-end;"><span class="caat-button caat-button--outline-primary caat-button--sm">Cancel</span><span class="caat-button caat-button--primary caat-button--sm">Confirm</span></div>
      </div>
    </div>
  </div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Specifications</h2>
  <div class="figma-specs">
    <div class="figma-spec"><strong>Border radius</strong>var(--caat-radius)</div>
    <div class="figma-spec"><strong>Shadow</strong>var(--caat-shadow)</div>
    <div class="figma-spec"><strong>Header border</strong>2px solid var(--caat-grey-200)</div>
    <div class="figma-spec"><strong>Title weight</strong>800</div>
    <div class="figma-spec"><strong>Body font size</strong>0.95rem</div>
  </div>
</div>
`
},

// ── Navigation ──
{
  file: 'navigation.html',
  name: 'Navigation',
  css: ['/assets/css/tokens.css', '/assets/css/components/navigation.css'],
  template: `
<h1 class="figma-page-title">Navigation</h1>
<p class="figma-page-subtitle">CAAT Design System · Navbar, mega menu, and footer</p>

<div class="figma-section">
  <h2 class="figma-section-title">Nav Link States</h2>
  <div class="figma-row"><span class="figma-row-label">Default</span><div class="figma-row-items"><span style="padding:.6rem 1rem;font-weight:600;font-size:.9rem;color:var(--caat-ink);border-radius:.35rem;">Members</span></div></div>
  <div class="figma-row"><span class="figma-row-label">Hover</span><div class="figma-row-items"><span style="padding:.6rem 1rem;font-weight:600;font-size:.9rem;color:var(--caat-blue-900);background:rgba(0,92,153,.05);border-radius:.35rem;">Members</span></div></div>
  <div class="figma-row"><span class="figma-row-label">Active</span><div class="figma-row-items"><span style="padding:.6rem 1rem;font-weight:600;font-size:.9rem;color:var(--caat-blue-900);background:var(--caat-blue-100);border-radius:.35rem;">Members</span></div></div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Utility Bar</h2>
  <div class="figma-row">
    <span class="figma-row-label">Dark strip</span>
    <div class="figma-row-items" style="flex:1;">
      <div style="background:var(--caat-blue-900);padding:.4rem 1rem;font-size:.78rem;color:rgba(255,255,255,.85);display:flex;gap:1rem;border-radius:.35rem;max-width:30rem;">
        <span>Contact Us</span><span>Français</span>
      </div>
    </div>
  </div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Specifications</h2>
  <div class="figma-specs">
    <div class="figma-spec"><strong>Navbar bg</strong>#fff</div>
    <div class="figma-spec"><strong>Border bottom</strong>1px solid var(--caat-grey-200)</div>
    <div class="figma-spec"><strong>Shadow</strong>var(--caat-shadow-sm)</div>
    <div class="figma-spec"><strong>Nav link size</strong>0.9rem, weight 600</div>
    <div class="figma-spec"><strong>Utility bar bg</strong>var(--caat-blue-900)</div>
    <div class="figma-spec"><strong>Mega menu border-top</strong>3px solid var(--caat-blue-900)</div>
  </div>
</div>
`
},

// ── Offcanvas ──
{
  file: 'offcanvas.html',
  name: 'Offcanvas',
  css: ['/assets/css/tokens.css', '/assets/css/components/offcanvas.css'],
  template: `
<h1 class="figma-page-title">Offcanvas</h1>
<p class="figma-page-subtitle">CAAT Design System · Side panel variants</p>

<div class="figma-section">
  <h2 class="figma-section-title">Panel Anatomy</h2>
  <div class="figma-row">
    <span class="figma-row-label">Start panel</span>
    <div class="figma-row-items">
      <div style="width:20rem;background:#fff;box-shadow:var(--caat-shadow);border-radius:0 var(--caat-radius) var(--caat-radius) 0;overflow:hidden;">
        <div style="padding:1.25rem 1.5rem;border-bottom:1px solid var(--caat-grey-200);display:flex;justify-content:space-between;align-items:center;"><span style="font-weight:800;font-size:1.25rem;color:var(--caat-blue-900);">Menu</span><span style="font-size:1.25rem;cursor:pointer;color:var(--caat-ink);">×</span></div>
        <div style="padding:1.5rem;font-size:.9375rem;color:var(--caat-ink);line-height:1.6;"><div style="padding:.5rem 0;border-bottom:1px solid var(--caat-grey-200);">Members</div><div style="padding:.5rem 0;border-bottom:1px solid var(--caat-grey-200);">Employers</div><div style="padding:.5rem 0;">About CAAT</div></div>
      </div>
    </div>
  </div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Specifications</h2>
  <div class="figma-specs">
    <div class="figma-spec"><strong>Width</strong>320px</div>
    <div class="figma-spec"><strong>Shadow</strong>var(--caat-shadow)</div>
    <div class="figma-spec"><strong>Header padding</strong>1.25rem 1.5rem</div>
    <div class="figma-spec"><strong>Title weight</strong>800</div>
    <div class="figma-spec"><strong>Backdrop opacity</strong>0.35</div>
  </div>
</div>
`
},

// ── Pagination ──
{
  file: 'pagination.html',
  name: 'Pagination',
  css: ['/assets/css/tokens.css', '/assets/css/components/pagination.css'],
  template: `
<h1 class="figma-page-title">Pagination</h1>
<p class="figma-page-subtitle">CAAT Design System · All states and sizes</p>

<div class="figma-section">
  <h2 class="figma-section-title">Item States</h2>
  <div class="figma-row"><span class="figma-row-label">Default</span><div class="figma-row-items"><span style="display:inline-flex;align-items:center;justify-content:center;min-width:44px;min-height:44px;padding:.375rem .75rem;font-size:.9375rem;font-weight:500;color:var(--caat-blue-900);background:#fff;border:1px solid var(--caat-grey-200);border-radius:var(--caat-radius);">3</span></div></div>
  <div class="figma-row"><span class="figma-row-label">Hover</span><div class="figma-row-items"><span style="display:inline-flex;align-items:center;justify-content:center;min-width:44px;min-height:44px;padding:.375rem .75rem;font-size:.9375rem;font-weight:500;color:var(--caat-blue-900);background:var(--caat-blue-100);border:1px solid var(--caat-blue-700);border-radius:var(--caat-radius);">3</span></div></div>
  <div class="figma-row"><span class="figma-row-label">Active</span><div class="figma-row-items"><span style="display:inline-flex;align-items:center;justify-content:center;min-width:44px;min-height:44px;padding:.375rem .75rem;font-size:.9375rem;font-weight:700;color:#fff;background:var(--caat-blue-900);border:1px solid var(--caat-blue-900);border-radius:var(--caat-radius);">3</span></div></div>
  <div class="figma-row"><span class="figma-row-label">Disabled</span><div class="figma-row-items"><span style="display:inline-flex;align-items:center;justify-content:center;min-width:44px;min-height:44px;padding:.375rem .75rem;font-size:.9375rem;font-weight:500;color:var(--caat-grey-200);background:var(--caat-grey);border:1px solid var(--caat-grey-200);border-radius:var(--caat-radius);opacity:.65;">‹</span></div></div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Full Row</h2>
  <div class="figma-row">
    <span class="figma-row-label">Default</span>
    <div class="figma-row-items" style="gap:.25rem;">
      <span style="display:inline-flex;align-items:center;justify-content:center;min-width:44px;min-height:44px;padding:.375rem .75rem;color:var(--caat-grey-200);background:var(--caat-grey);border:1px solid var(--caat-grey-200);border-radius:var(--caat-radius);opacity:.65;">‹</span>
      <span style="display:inline-flex;align-items:center;justify-content:center;min-width:44px;min-height:44px;padding:.375rem .75rem;color:#fff;background:var(--caat-blue-900);border:1px solid var(--caat-blue-900);border-radius:var(--caat-radius);font-weight:700;">1</span>
      <span style="display:inline-flex;align-items:center;justify-content:center;min-width:44px;min-height:44px;padding:.375rem .75rem;color:var(--caat-blue-900);background:#fff;border:1px solid var(--caat-grey-200);border-radius:var(--caat-radius);">2</span>
      <span style="display:inline-flex;align-items:center;justify-content:center;min-width:44px;min-height:44px;padding:.375rem .75rem;color:var(--caat-blue-900);background:#fff;border:1px solid var(--caat-grey-200);border-radius:var(--caat-radius);">3</span>
      <span style="display:inline-flex;align-items:center;justify-content:center;min-width:44px;min-height:44px;padding:.375rem .75rem;color:var(--caat-ink);">…</span>
      <span style="display:inline-flex;align-items:center;justify-content:center;min-width:44px;min-height:44px;padding:.375rem .75rem;color:var(--caat-blue-900);background:#fff;border:1px solid var(--caat-grey-200);border-radius:var(--caat-radius);">›</span>
    </div>
  </div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Specifications</h2>
  <div class="figma-specs">
    <div class="figma-spec"><strong>Min size</strong>44×44px</div>
    <div class="figma-spec"><strong>Border radius</strong>var(--caat-radius)</div>
    <div class="figma-spec"><strong>Active bg</strong>var(--caat-blue-900)</div>
    <div class="figma-spec"><strong>Hover bg</strong>var(--caat-blue-100)</div>
    <div class="figma-spec"><strong>Small size</strong>36×36px</div>
    <div class="figma-spec"><strong>Large size</strong>52×52px</div>
  </div>
</div>
`
},

// ── Popover ──
{
  file: 'popover.html',
  name: 'Popover',
  css: ['/assets/css/tokens.css', '/assets/css/components/popover.css'],
  template: `
<h1 class="figma-page-title">Popover</h1>
<p class="figma-page-subtitle">CAAT Design System · Popover anatomy</p>

<div class="figma-section">
  <h2 class="figma-section-title">Default Popover</h2>
  <div class="figma-row">
    <span class="figma-row-label">With header</span>
    <div class="figma-row-items">
      <div style="max-width:300px;border:1px solid var(--caat-grey-200);border-radius:var(--caat-radius);box-shadow:var(--caat-shadow-sm);background:#fff;">
        <div style="font-weight:700;font-size:.875rem;color:var(--caat-blue-900);background:var(--caat-blue-100);padding:.625rem .875rem;border-radius:var(--caat-radius) var(--caat-radius) 0 0;border-bottom:1px solid var(--caat-grey-200);">Popover Title</div>
        <div style="font-size:.8125rem;line-height:1.5;color:var(--caat-ink);padding:.75rem .875rem;">Popover body content with helpful contextual information.</div>
      </div>
    </div>
  </div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Specifications</h2>
  <div class="figma-specs">
    <div class="figma-spec"><strong>Max width</strong>300px</div>
    <div class="figma-spec"><strong>Border</strong>1px solid var(--caat-grey-200)</div>
    <div class="figma-spec"><strong>Shadow</strong>var(--caat-shadow-sm)</div>
    <div class="figma-spec"><strong>Header bg</strong>var(--caat-blue-100)</div>
    <div class="figma-spec"><strong>Body font size</strong>0.8125rem</div>
  </div>
</div>
`
},

// ── Progress ──
{
  file: 'progress.html',
  name: 'Progress',
  css: ['/assets/css/tokens.css', '/assets/css/components/progress.css'],
  template: `
<h1 class="figma-page-title">Progress</h1>
<p class="figma-page-subtitle">CAAT Design System · Bar and stepped variants</p>

<div class="figma-section">
  <h2 class="figma-section-title">Bar Variants</h2>
  <div class="figma-row"><span class="figma-row-label">Default</span><div class="figma-row-items" style="flex:1;max-width:24rem;"><div class="caat-progress"><div class="caat-progress__bar" style="width:60%;">60%</div></div></div></div>
  <div class="figma-row"><span class="figma-row-label">Success</span><div class="figma-row-items" style="flex:1;max-width:24rem;"><div class="caat-progress"><div class="caat-progress__bar caat-progress__bar--success" style="width:80%;">80%</div></div></div></div>
  <div class="figma-row"><span class="figma-row-label">Warning</span><div class="figma-row-items" style="flex:1;max-width:24rem;"><div class="caat-progress"><div class="caat-progress__bar caat-progress__bar--warning" style="width:45%;">45%</div></div></div></div>
  <div class="figma-row"><span class="figma-row-label">Danger</span><div class="figma-row-items" style="flex:1;max-width:24rem;"><div class="caat-progress"><div class="caat-progress__bar caat-progress__bar--danger" style="width:20%;">20%</div></div></div></div>
  <div class="figma-row"><span class="figma-row-label">Striped</span><div class="figma-row-items" style="flex:1;max-width:24rem;"><div class="caat-progress"><div class="caat-progress__bar caat-progress__bar--striped" style="width:70%;">70%</div></div></div></div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Sizes</h2>
  <div class="figma-row"><span class="figma-row-label">Small</span><div class="figma-row-items" style="flex:1;max-width:24rem;"><div class="caat-progress caat-progress--sm"><div class="caat-progress__bar" style="width:50%;"></div></div></div></div>
  <div class="figma-row"><span class="figma-row-label">Default</span><div class="figma-row-items" style="flex:1;max-width:24rem;"><div class="caat-progress"><div class="caat-progress__bar" style="width:50%;"></div></div></div></div>
  <div class="figma-row"><span class="figma-row-label">Large</span><div class="figma-row-items" style="flex:1;max-width:24rem;"><div class="caat-progress caat-progress--lg"><div class="caat-progress__bar" style="width:50%;">50%</div></div></div></div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Specifications</h2>
  <div class="figma-specs">
    <div class="figma-spec"><strong>Track bg</strong>var(--caat-grey-200)</div>
    <div class="figma-spec"><strong>Bar bg</strong>var(--caat-blue-900)</div>
    <div class="figma-spec"><strong>Height (sm)</strong>0.5rem</div>
    <div class="figma-spec"><strong>Height (default)</strong>0.75rem</div>
    <div class="figma-spec"><strong>Height (lg)</strong>1rem</div>
    <div class="figma-spec"><strong>Border radius</strong>var(--caat-radius)</div>
  </div>
</div>
`
},

// ── Search ──
{
  file: 'search.html',
  name: 'Search',
  css: ['/assets/css/tokens.css', '/assets/css/components/search.css'],
  template: `
<h1 class="figma-page-title">Search</h1>
<p class="figma-page-subtitle">CAAT Design System · Input, suggestions, and results</p>

<div class="figma-section">
  <h2 class="figma-section-title">Search Input</h2>
  <div class="figma-row"><span class="figma-row-label">Default</span><div class="figma-row-items" style="flex:1;max-width:28rem;"><div style="position:relative;"><i class="bi bi-search" style="position:absolute;left:.875rem;top:50%;transform:translateY(-50%);color:var(--caat-muted);font-size:1.25rem;"></i><input type="text" placeholder="Search CAAT..." style="width:100%;height:3.5rem;padding-left:3rem;padding-right:3rem;font-size:1.125rem;border:2px solid var(--caat-grey-200);border-radius:var(--caat-radius);color:var(--caat-ink);font-family:var(--caat-font-primary);"></div></div></div>
  <div class="figma-row"><span class="figma-row-label">Focus</span><div class="figma-row-items" style="flex:1;max-width:28rem;"><div style="position:relative;"><i class="bi bi-search" style="position:absolute;left:.875rem;top:50%;transform:translateY(-50%);color:var(--caat-muted);font-size:1.25rem;"></i><input type="text" value="pension" style="width:100%;height:3.5rem;padding-left:3rem;padding-right:3rem;font-size:1.125rem;border:2px solid var(--caat-blue-900);border-radius:var(--caat-radius);color:var(--caat-ink);font-family:var(--caat-font-primary);box-shadow:var(--caat-focus);"></div></div></div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Specifications</h2>
  <div class="figma-specs">
    <div class="figma-spec"><strong>Height</strong>3.5rem</div>
    <div class="figma-spec"><strong>Font size</strong>1.125rem</div>
    <div class="figma-spec"><strong>Border</strong>2px solid var(--caat-grey-200)</div>
    <div class="figma-spec"><strong>Border radius</strong>var(--caat-radius)</div>
    <div class="figma-spec"><strong>Focus ring</strong>var(--caat-focus)</div>
    <div class="figma-spec"><strong>Icon size</strong>1.25rem</div>
  </div>
</div>
`
},

// ── Separator ──
{
  file: 'separator.html',
  name: 'Separator',
  css: ['/assets/css/tokens.css', '/assets/css/components/separator.css'],
  template: `
<h1 class="figma-page-title">Separator</h1>
<p class="figma-page-subtitle">CAAT Design System · Divider variants</p>

<div class="figma-section">
  <h2 class="figma-section-title">Variants</h2>
  <div class="figma-row"><span class="figma-row-label">Default</span><div class="figma-row-items" style="flex:1;max-width:24rem;"><hr class="caat-separator"></div></div>
  <div class="figma-row"><span class="figma-row-label">Thick</span><div class="figma-row-items" style="flex:1;max-width:24rem;"><hr class="caat-separator caat-separator--thick"></div></div>
  <div class="figma-row"><span class="figma-row-label">Accent</span><div class="figma-row-items" style="flex:1;max-width:24rem;"><hr class="caat-separator caat-separator--accent"></div></div>
  <div class="figma-row"><span class="figma-row-label">With label</span><div class="figma-row-items" style="flex:1;max-width:24rem;"><div class="caat-separator caat-separator--with-label"><span class="caat-separator__label">Or</span></div></div></div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Specifications</h2>
  <div class="figma-specs">
    <div class="figma-spec"><strong>Default</strong>1px solid var(--caat-grey-200)</div>
    <div class="figma-spec"><strong>Thick</strong>3px solid var(--caat-blue-900)</div>
    <div class="figma-spec"><strong>Accent</strong>3px, 60px wide, var(--caat-green)</div>
  </div>
</div>
`
},

// ── Spinner ──
{
  file: 'spinner.html',
  name: 'Spinner',
  css: ['/assets/css/tokens.css', '/assets/css/components/spinner.css'],
  template: `
<h1 class="figma-page-title">Spinner</h1>
<p class="figma-page-subtitle">CAAT Design System · Loading indicators</p>

<div class="figma-section">
  <h2 class="figma-section-title">Border Spinner</h2>
  <div class="figma-row"><span class="figma-row-label">Small</span><div class="figma-row-items"><div class="caat-spinner caat-spinner--sm" role="status"></div></div></div>
  <div class="figma-row"><span class="figma-row-label">Default</span><div class="figma-row-items"><div class="caat-spinner" role="status"></div></div></div>
  <div class="figma-row"><span class="figma-row-label">Large</span><div class="figma-row-items"><div class="caat-spinner caat-spinner--lg" role="status"></div></div></div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Growing Spinner</h2>
  <div class="figma-row"><span class="figma-row-label">Default</span><div class="figma-row-items"><div class="caat-spinner caat-spinner--grow" role="status"></div></div></div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Specifications</h2>
  <div class="figma-specs">
    <div class="figma-spec"><strong>Colour</strong>var(--caat-blue-900)</div>
    <div class="figma-spec"><strong>Size (sm)</strong>1rem</div>
    <div class="figma-spec"><strong>Size (default)</strong>2rem</div>
    <div class="figma-spec"><strong>Size (lg)</strong>3rem</div>
    <div class="figma-spec"><strong>Border width</strong>0.2em</div>
  </div>
</div>
`
},

// ── Tables ──
{
  file: 'tables.html',
  name: 'Table',
  css: ['/assets/css/tokens.css', '/assets/css/components/tables.css'],
  template: `
<h1 class="figma-page-title">Table</h1>
<p class="figma-page-subtitle">CAAT Design System · Table variants</p>

<div class="figma-section">
  <h2 class="figma-section-title">Default Table</h2>
  <div class="figma-row">
    <span class="figma-row-label">Striped</span>
    <div class="figma-row-items" style="flex:1;max-width:32rem;">
      <div class="caat-table__wrapper" style="width:100%;">
        <table class="caat-table caat-table--striped">
          <thead><tr><th>Plan</th><th>Type</th><th>Members</th></tr></thead>
          <tbody><tr><td>DBplus</td><td>Defined Benefit</td><td>94,000+</td></tr><tr><td>DBprime</td><td>Defined Benefit</td><td>12,000+</td></tr><tr><td>DC</td><td>Defined Contribution</td><td>5,000+</td></tr></tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Specifications</h2>
  <div class="figma-specs">
    <div class="figma-spec"><strong>Header bg</strong>var(--caat-blue-900)</div>
    <div class="figma-spec"><strong>Header text</strong>#fff, 0.85rem, uppercase</div>
    <div class="figma-spec"><strong>Cell padding</strong>0.75rem 1rem</div>
    <div class="figma-spec"><strong>Stripe bg</strong>var(--caat-grey)</div>
    <div class="figma-spec"><strong>Hover bg</strong>var(--caat-blue-100)</div>
    <div class="figma-spec"><strong>Border</strong>1px solid var(--caat-grey-200)</div>
  </div>
</div>
`
},

// ── Tabs ──
{
  file: 'tabs.html',
  name: 'Tabs',
  css: ['/assets/css/tokens.css', '/assets/css/components/tabs.css'],
  template: `
<h1 class="figma-page-title">Tabs</h1>
<p class="figma-page-subtitle">CAAT Design System · Tab and pill variants</p>

<div class="figma-section">
  <h2 class="figma-section-title">Standard Tabs — States</h2>
  <div class="figma-row"><span class="figma-row-label">Default</span><div class="figma-row-items"><span style="padding:.75rem 1.25rem;font-weight:600;font-size:.95rem;color:var(--caat-ink);border-bottom:3px solid transparent;">Tab Label</span></div></div>
  <div class="figma-row"><span class="figma-row-label">Hover</span><div class="figma-row-items"><span style="padding:.75rem 1.25rem;font-weight:600;font-size:.95rem;color:var(--caat-blue-900);border-bottom:3px solid var(--caat-blue-100);">Tab Label</span></div></div>
  <div class="figma-row"><span class="figma-row-label">Active</span><div class="figma-row-items"><span style="padding:.75rem 1.25rem;font-weight:600;font-size:.95rem;color:var(--caat-blue-900);border-bottom:3px solid var(--caat-green);">Tab Label</span></div></div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Pill Tabs — States</h2>
  <div class="figma-row"><span class="figma-row-label">Default</span><div class="figma-row-items"><span style="padding:.5rem 1.25rem;font-weight:600;font-size:.95rem;color:var(--caat-ink);border-radius:50rem;">Tab Label</span></div></div>
  <div class="figma-row"><span class="figma-row-label">Hover</span><div class="figma-row-items"><span style="padding:.5rem 1.25rem;font-weight:600;font-size:.95rem;color:var(--caat-ink);border-radius:50rem;background:var(--caat-blue-100);">Tab Label</span></div></div>
  <div class="figma-row"><span class="figma-row-label">Active</span><div class="figma-row-items"><span style="padding:.5rem 1.25rem;font-weight:600;font-size:.95rem;color:#fff;border-radius:50rem;background:var(--caat-blue-900);">Tab Label</span></div></div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Specifications</h2>
  <div class="figma-specs">
    <div class="figma-spec"><strong>Font size</strong>0.95rem</div>
    <div class="figma-spec"><strong>Font weight</strong>600</div>
    <div class="figma-spec"><strong>Active indicator</strong>3px solid var(--caat-green)</div>
    <div class="figma-spec"><strong>Pill radius</strong>50rem</div>
    <div class="figma-spec"><strong>Pill active bg</strong>var(--caat-blue-900)</div>
  </div>
</div>
`
},

// ── Testimonials ──
{
  file: 'testimonials.html',
  name: 'Testimonial',
  css: ['/assets/css/tokens.css', '/assets/css/components/testimonials.css'],
  template: `
<h1 class="figma-page-title">Testimonial</h1>
<p class="figma-page-subtitle">CAAT Design System · Quote card variants</p>

<div class="figma-section">
  <h2 class="figma-section-title">Default Testimonial</h2>
  <div class="figma-row">
    <span class="figma-row-label">With avatar</span>
    <div class="figma-row-items">
      <div class="caat-testimonial" style="max-width:24rem;">
        <div class="caat-testimonial__stars"><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i></div>
        <blockquote class="caat-testimonial__quote">"CAAT's DBplus pension gives me confidence about my retirement."</blockquote>
        <div class="caat-testimonial__attribution">
          <div class="caat-testimonial__avatar caat-testimonial__avatar--initials" style="width:48px;height:48px;border-radius:50%;">JS</div>
          <div><div class="caat-testimonial__name">Jane Smith</div><div class="caat-testimonial__role">HR Director, Acme Corp</div></div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Specifications</h2>
  <div class="figma-specs">
    <div class="figma-spec"><strong>Padding</strong>2rem</div>
    <div class="figma-spec"><strong>Border</strong>1px solid var(--caat-grey-200)</div>
    <div class="figma-spec"><strong>Shadow</strong>var(--caat-shadow-sm)</div>
    <div class="figma-spec"><strong>Quote size</strong>1.1rem italic</div>
    <div class="figma-spec"><strong>Avatar</strong>48×48px, border-radius 50%</div>
    <div class="figma-spec"><strong>Stars colour</strong>var(--caat-warning)</div>
  </div>
</div>
`
},

// ── Toast ──
{
  file: 'toast.html',
  name: 'Toast',
  css: ['/assets/css/tokens.css', '/assets/css/components/toast.css'],
  template: `
<h1 class="figma-page-title">Toast</h1>
<p class="figma-page-subtitle">CAAT Design System · Notification variants</p>

<div class="figma-section">
  <h2 class="figma-section-title">Variants</h2>
  <div class="figma-row"><span class="figma-row-label">Success</span><div class="figma-row-items"><div class="caat-toast caat-toast--success" style="max-width:22rem;"><div class="caat-toast__header"><span class="caat-toast__icon"><i class="bi bi-check-circle-fill"></i></span><span class="caat-toast__title">Success</span><span class="caat-toast__meta">Just now</span><button class="caat-toast__close">×</button></div><div class="caat-toast__body">Your changes have been saved.</div></div></div></div>
  <div class="figma-row"><span class="figma-row-label">Warning</span><div class="figma-row-items"><div class="caat-toast caat-toast--warning" style="max-width:22rem;"><div class="caat-toast__header"><span class="caat-toast__icon"><i class="bi bi-exclamation-triangle-fill"></i></span><span class="caat-toast__title">Warning</span><span class="caat-toast__meta">2m ago</span><button class="caat-toast__close">×</button></div><div class="caat-toast__body">Session will expire in 5 minutes.</div></div></div></div>
  <div class="figma-row"><span class="figma-row-label">Error</span><div class="figma-row-items"><div class="caat-toast caat-toast--error" style="max-width:22rem;"><div class="caat-toast__header"><span class="caat-toast__icon"><i class="bi bi-x-circle-fill"></i></span><span class="caat-toast__title">Error</span><span class="caat-toast__meta">Just now</span><button class="caat-toast__close">×</button></div><div class="caat-toast__body">Something went wrong. Please try again.</div></div></div></div>
  <div class="figma-row"><span class="figma-row-label">Info</span><div class="figma-row-items"><div class="caat-toast caat-toast--info" style="max-width:22rem;"><div class="caat-toast__header"><span class="caat-toast__icon"><i class="bi bi-info-circle-fill"></i></span><span class="caat-toast__title">Info</span><span class="caat-toast__meta">5m ago</span><button class="caat-toast__close">×</button></div><div class="caat-toast__body">A new report is available for download.</div></div></div></div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Specifications</h2>
  <div class="figma-specs">
    <div class="figma-spec"><strong>Border radius</strong>var(--caat-radius)</div>
    <div class="figma-spec"><strong>Shadow</strong>var(--caat-shadow-sm)</div>
    <div class="figma-spec"><strong>Container</strong>fixed bottom-right, max-width 350px</div>
    <div class="figma-spec"><strong>Animation</strong>slide-in from right, 0.3s</div>
  </div>
</div>
`
},

// ── Tooltip ──
{
  file: 'tooltip.html',
  name: 'Tooltip',
  css: ['/assets/css/tokens.css', '/assets/css/components/tooltip.css'],
  template: `
<h1 class="figma-page-title">Tooltip</h1>
<p class="figma-page-subtitle">CAAT Design System · Tooltip placements</p>

<div class="figma-section">
  <h2 class="figma-section-title">Tooltip</h2>
  <div class="figma-row">
    <span class="figma-row-label">Default</span>
    <div class="figma-row-items">
      <div style="background:var(--caat-blue-900);color:#fff;border-radius:var(--caat-radius);font-size:.8125rem;line-height:1.4;max-width:250px;padding:.5rem .75rem;text-align:left;">Helpful tooltip text explaining a feature</div>
    </div>
  </div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Trigger Types</h2>
  <div class="figma-row"><span class="figma-row-label">Icon trigger</span><div class="figma-row-items"><i class="bi bi-question-circle" style="color:var(--caat-blue-700);font-size:1rem;cursor:pointer;"></i></div></div>
  <div class="figma-row"><span class="figma-row-label">Link trigger</span><div class="figma-row-items"><span style="color:var(--caat-blue-700);text-decoration:underline dotted;text-underline-offset:3px;cursor:pointer;">What is DBplus?</span></div></div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Specifications</h2>
  <div class="figma-specs">
    <div class="figma-spec"><strong>Background</strong>var(--caat-blue-900)</div>
    <div class="figma-spec"><strong>Text</strong>#fff, 0.8125rem</div>
    <div class="figma-spec"><strong>Max width</strong>250px</div>
    <div class="figma-spec"><strong>Padding</strong>0.5rem 0.75rem</div>
    <div class="figma-spec"><strong>Border radius</strong>var(--caat-radius)</div>
  </div>
</div>
`
},

// ── Article Layout ──
{
  file: 'article-layout.html',
  name: 'Article Layout',
  css: ['/assets/css/tokens.css', '/assets/css/components/article-layout.css'],
  template: `
<h1 class="figma-page-title">Article Layout</h1>
<p class="figma-page-subtitle">CAAT Design System · Prose, sidebar, and share elements</p>

<div class="figma-section">
  <h2 class="figma-section-title">Typography Scale</h2>
  <div class="figma-row"><span class="figma-row-label">H1</span><div class="figma-row-items"><span style="font-weight:900;letter-spacing:-.04em;color:var(--caat-blue-900);font-size:2rem;">Article Title</span></div></div>
  <div class="figma-row"><span class="figma-row-label">H2</span><div class="figma-row-items"><span style="font-weight:800;color:var(--caat-blue-900);font-size:1.5rem;">Section Heading</span></div></div>
  <div class="figma-row"><span class="figma-row-label">Body</span><div class="figma-row-items"><span style="font-size:1rem;line-height:1.75;color:var(--caat-ink);">Body text with 1.75 line height for optimal readability.</span></div></div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Share Buttons</h2>
  <div class="figma-row"><span class="figma-row-label">Default</span><div class="figma-row-items" style="gap:.5rem;"><span style="width:2.5rem;height:2.5rem;border-radius:50%;border:1px solid var(--caat-grey-200);background:#fff;display:inline-flex;align-items:center;justify-content:center;color:var(--caat-blue-900);font-size:1rem;"><i class="bi bi-link-45deg"></i></span><span style="width:2.5rem;height:2.5rem;border-radius:50%;border:1px solid var(--caat-grey-200);background:#fff;display:inline-flex;align-items:center;justify-content:center;color:var(--caat-blue-900);font-size:1rem;"><i class="bi bi-envelope"></i></span><span style="width:2.5rem;height:2.5rem;border-radius:50%;border:1px solid var(--caat-grey-200);background:#fff;display:inline-flex;align-items:center;justify-content:center;color:var(--caat-blue-900);font-size:1rem;"><i class="bi bi-linkedin"></i></span></div></div>
  <div class="figma-row"><span class="figma-row-label">Hover</span><div class="figma-row-items"><span style="width:2.5rem;height:2.5rem;border-radius:50%;border:1px solid var(--caat-blue-900);background:var(--caat-blue-900);display:inline-flex;align-items:center;justify-content:center;color:#fff;font-size:1rem;"><i class="bi bi-link-45deg"></i></span></div></div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Specifications</h2>
  <div class="figma-specs">
    <div class="figma-spec"><strong>Max prose width</strong>720px</div>
    <div class="figma-spec"><strong>Body line height</strong>1.75</div>
    <div class="figma-spec"><strong>Blockquote border</strong>4px solid var(--caat-blue-700)</div>
    <div class="figma-spec"><strong>Share button</strong>2.5rem, 50% radius</div>
  </div>
</div>
`
},

// ── Blog Listing ──
{
  file: 'blog-listing.html',
  name: 'Blog Listing',
  css: ['/assets/css/tokens.css', '/assets/css/components/blog-listing.css'],
  template: `
<h1 class="figma-page-title">Blog Listing</h1>
<p class="figma-page-subtitle">CAAT Design System · Grid, list, and filter variants</p>

<div class="figma-section">
  <h2 class="figma-section-title">Card Anatomy</h2>
  <div class="figma-row">
    <span class="figma-row-label">Blog card</span>
    <div class="figma-row-items">
      <div style="width:18rem;border-radius:var(--caat-radius);box-shadow:var(--caat-shadow-sm);overflow:hidden;background:#fff;">
        <div style="width:100%;aspect-ratio:16/9;background:var(--caat-grey);display:flex;align-items:center;justify-content:center;color:var(--caat-muted);font-size:2rem;"><i class="bi bi-image"></i></div>
        <div style="padding:1.25rem;">
          <span style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.04em;padding:.35em .75em;border-radius:50rem;background:var(--caat-blue-100);color:var(--caat-blue-900);display:inline-block;margin-bottom:.625rem;">Pension News</span>
          <h3 style="font-weight:700;font-size:1.125rem;line-height:1.35;color:var(--caat-blue-900);margin:0 0 .5rem;">Understanding your DBplus pension</h3>
          <p style="font-size:.9375rem;line-height:1.55;color:var(--caat-ink);margin:0 0 1rem;">Learn about contributions, growth, and retirement options.</p>
          <div style="font-size:.8125rem;color:var(--caat-muted);display:flex;gap:.75rem;">
            <span><i class="bi bi-calendar3" style="font-size:.75rem;"></i> May 1, 2026</span>
            <span><i class="bi bi-clock" style="font-size:.75rem;"></i> 4 min</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Filter Pills</h2>
  <div class="figma-row"><span class="figma-row-label">Default</span><div class="figma-row-items"><span style="font-size:.875rem;font-weight:600;padding:.4em 1.1em;border-radius:50rem;border:1px solid var(--caat-grey-200);background:#fff;color:var(--caat-ink);">All Posts</span></div></div>
  <div class="figma-row"><span class="figma-row-label">Active</span><div class="figma-row-items"><span style="font-size:.875rem;font-weight:600;padding:.4em 1.1em;border-radius:50rem;border:1px solid var(--caat-blue-900);background:var(--caat-blue-900);color:#fff;">All Posts</span></div></div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Specifications</h2>
  <div class="figma-specs">
    <div class="figma-spec"><strong>Grid</strong>3 cols, 1.5rem gap</div>
    <div class="figma-spec"><strong>Card shadow</strong>var(--caat-shadow-sm)</div>
    <div class="figma-spec"><strong>Hover lift</strong>translateY(-4px)</div>
    <div class="figma-spec"><strong>Image ratio</strong>16:9</div>
    <div class="figma-spec"><strong>Category badge</strong>0.75rem, pill, var(--caat-blue-100)</div>
  </div>
</div>
`
},

// ── Data Visualization ──
{
  file: 'data-visualization.html',
  name: 'Data Visualization',
  css: ['/assets/css/tokens.css', '/assets/css/components/data-visualization.css'],
  template: `
<h1 class="figma-page-title">Data Visualization</h1>
<p class="figma-page-subtitle">CAAT Design System · Stat cards, charts, and legends</p>

<div class="figma-section">
  <h2 class="figma-section-title">Stat Card</h2>
  <div class="figma-row">
    <span class="figma-row-label">Default</span>
    <div class="figma-row-items">
      <div class="caat-dataviz__card" style="min-width:10rem;"><div class="caat-dataviz__value">$73B</div><div class="caat-dataviz__label">Total Assets</div><div class="caat-dataviz__trend caat-dataviz__trend--up">↑ 8.2%</div></div>
    </div>
  </div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Bar Chart</h2>
  <div class="figma-row">
    <span class="figma-row-label">Horizontal</span>
    <div class="figma-row-items" style="flex:1;max-width:28rem;">
      <div class="caat-dataviz__bar-chart" style="width:100%;">
        <div class="caat-dataviz__bar-row"><span class="caat-dataviz__bar-label">DBplus</span><div class="caat-dataviz__bar-track"><div class="caat-dataviz__bar" style="width:78%;">78%</div></div></div>
        <div class="caat-dataviz__bar-row"><span class="caat-dataviz__bar-label">DBprime</span><div class="caat-dataviz__bar-track"><div class="caat-dataviz__bar" style="width:45%;">45%</div></div></div>
      </div>
    </div>
  </div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Specifications</h2>
  <div class="figma-specs">
    <div class="figma-spec"><strong>Stat value</strong>2.5rem, weight 900</div>
    <div class="figma-spec"><strong>Card padding</strong>1.5rem</div>
    <div class="figma-spec"><strong>Bar height</strong>2rem</div>
    <div class="figma-spec"><strong>Bar bg</strong>var(--caat-blue-900)</div>
    <div class="figma-spec"><strong>Track bg</strong>var(--caat-blue-100)</div>
    <div class="figma-spec"><strong>Trend up</strong>var(--caat-green-700)</div>
    <div class="figma-spec"><strong>Trend down</strong>var(--caat-danger-dark)</div>
  </div>
</div>
`
},

// ── Download ──
{
  file: 'download.html',
  name: 'Download',
  css: ['/assets/css/tokens.css', '/assets/css/components/download.css'],
  template: `
<h1 class="figma-page-title">Download</h1>
<p class="figma-page-subtitle">CAAT Design System · File download variants</p>

<div class="figma-section">
  <h2 class="figma-section-title">File Type Icons</h2>
  <div class="figma-row"><span class="figma-row-label">PDF</span><div class="figma-row-items"><div class="caat-download__icon caat-download__icon--pdf"><i class="bi bi-file-earmark-pdf"></i></div></div></div>
  <div class="figma-row"><span class="figma-row-label">Excel</span><div class="figma-row-items"><div class="caat-download__icon caat-download__icon--xlsx"><i class="bi bi-file-earmark-spreadsheet"></i></div></div></div>
  <div class="figma-row"><span class="figma-row-label">Word</span><div class="figma-row-items"><div class="caat-download__icon caat-download__icon--docx"><i class="bi bi-file-earmark-word"></i></div></div></div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Download Row</h2>
  <div class="figma-row">
    <span class="figma-row-label">Horizontal</span>
    <div class="figma-row-items" style="flex:1;max-width:32rem;">
      <div class="caat-download" style="width:100%;">
        <div class="caat-download__icon caat-download__icon--pdf"><i class="bi bi-file-earmark-pdf"></i></div>
        <div class="caat-download__info"><h4 class="caat-download__title">Annual Report 2025</h4><p class="caat-download__meta">PDF · 2.4 MB</p></div>
      </div>
    </div>
  </div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Specifications</h2>
  <div class="figma-specs">
    <div class="figma-spec"><strong>Icon size</strong>3rem × 3rem</div>
    <div class="figma-spec"><strong>Border</strong>1px solid var(--caat-grey-200)</div>
    <div class="figma-spec"><strong>Radius</strong>var(--caat-radius)</div>
    <div class="figma-spec"><strong>Hover</strong>var(--caat-shadow-sm), translateY(-2px)</div>
    <div class="figma-spec"><strong>Title weight</strong>600</div>
  </div>
</div>
`
},

// ── Image / Embed ──
{
  file: 'image-embed.html',
  name: 'Image / Embed',
  css: ['/assets/css/tokens.css', '/assets/css/components/image-embed.css'],
  template: `
<h1 class="figma-page-title">Image / Embed</h1>
<p class="figma-page-subtitle">CAAT Design System · Responsive media variants</p>

<div class="figma-section">
  <h2 class="figma-section-title">Aspect Ratios</h2>
  <div class="figma-row"><span class="figma-row-label">16:9</span><div class="figma-row-items"><div style="width:12rem;aspect-ratio:16/9;background:var(--caat-grey);border-radius:var(--caat-radius);display:flex;align-items:center;justify-content:center;color:var(--caat-muted);"><i class="bi bi-image" style="font-size:1.5rem;"></i></div></div></div>
  <div class="figma-row"><span class="figma-row-label">4:3</span><div class="figma-row-items"><div style="width:12rem;aspect-ratio:4/3;background:var(--caat-grey);border-radius:var(--caat-radius);display:flex;align-items:center;justify-content:center;color:var(--caat-muted);"><i class="bi bi-image" style="font-size:1.5rem;"></i></div></div></div>
  <div class="figma-row"><span class="figma-row-label">1:1</span><div class="figma-row-items"><div style="width:8rem;aspect-ratio:1/1;background:var(--caat-grey);border-radius:var(--caat-radius);display:flex;align-items:center;justify-content:center;color:var(--caat-muted);"><i class="bi bi-image" style="font-size:1.5rem;"></i></div></div></div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Specifications</h2>
  <div class="figma-specs">
    <div class="figma-spec"><strong>Border radius</strong>var(--caat-radius)</div>
    <div class="figma-spec"><strong>Caption</strong>0.875rem, opacity 0.7</div>
    <div class="figma-spec"><strong>Embed bg</strong>var(--caat-grey-200)</div>
  </div>
</div>
`
},

// ── Logo Wall ──
{
  file: 'logo-wall.html',
  name: 'Logo Wall',
  css: ['/assets/css/tokens.css', '/assets/css/components/logo-wall.css'],
  template: `
<h1 class="figma-page-title">Logo Wall</h1>
<p class="figma-page-subtitle">CAAT Design System · Employer logo grid variants</p>

<div class="figma-section">
  <h2 class="figma-section-title">Logo Item States</h2>
  <div class="figma-row"><span class="figma-row-label">Default</span><div class="figma-row-items"><div style="padding:1rem;border-radius:var(--caat-radius);background:#fff;border:1px solid var(--caat-grey-200);min-height:5rem;width:8rem;display:flex;align-items:center;justify-content:center;color:var(--caat-muted);font-size:.85rem;opacity:.6;">Logo</div></div></div>
  <div class="figma-row"><span class="figma-row-label">Hover</span><div class="figma-row-items"><div style="padding:1rem;border-radius:var(--caat-radius);background:#fff;border:1px solid var(--caat-grey-200);min-height:5rem;width:8rem;display:flex;align-items:center;justify-content:center;color:var(--caat-ink);font-size:.85rem;box-shadow:var(--caat-shadow-sm);transform:translateY(-2px);">Logo</div></div></div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Specifications</h2>
  <div class="figma-specs">
    <div class="figma-spec"><strong>Grid</strong>auto-fit, minmax(8rem, 1fr)</div>
    <div class="figma-spec"><strong>Item min-height</strong>5rem</div>
    <div class="figma-spec"><strong>Logo max-height</strong>3rem</div>
    <div class="figma-spec"><strong>Default filter</strong>grayscale(100%), opacity 0.6</div>
    <div class="figma-spec"><strong>Hover filter</strong>grayscale(0%), opacity 1</div>
  </div>
</div>
`
},

// ── Feature Resource Hero ──
{
  file: 'feature-resource-hero.html',
  name: 'Feature Resource Hero',
  css: ['/assets/css/tokens.css', '/assets/css/components/feature-resource-hero.css'],
  template: `
<h1 class="figma-page-title">Feature Resource Hero</h1>
<p class="figma-page-subtitle">CAAT Design System · Hero with resource preview</p>

<div class="figma-section">
  <h2 class="figma-section-title">Default Variant</h2>
  <div class="figma-row">
    <span class="figma-row-label">Text + Preview</span>
    <div class="figma-row-items" style="flex:1;max-width:36rem;">
      <div style="display:grid;grid-template-columns:1fr auto;gap:2rem;align-items:center;">
        <div>
          <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--caat-green-700);margin-bottom:.5rem;">Pension Solutions</div>
          <h3 style="font-weight:900;font-size:1.5rem;color:var(--caat-blue-900);letter-spacing:-.02em;line-height:1.15;margin-bottom:.75rem;">A better pension matters</h3>
          <p style="font-size:1rem;color:var(--caat-muted);line-height:1.5;">The attraction and retention strategy every employer should be thinking about.</p>
        </div>
        <div style="width:8rem;height:10rem;background:var(--caat-grey);border-radius:var(--caat-radius);box-shadow:var(--caat-shadow);display:flex;align-items:center;justify-content:center;color:var(--caat-muted);font-size:2rem;"><i class="bi bi-file-earmark-pdf"></i></div>
      </div>
    </div>
  </div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Specifications</h2>
  <div class="figma-specs">
    <div class="figma-spec"><strong>Eyebrow</strong>0.75rem, 700, uppercase</div>
    <div class="figma-spec"><strong>Title</strong>clamp(1.5rem, 3.5vw, 2.5rem), 900</div>
    <div class="figma-spec"><strong>Preview max-width</strong>16rem</div>
    <div class="figma-spec"><strong>Preview shadow</strong>var(--caat-shadow)</div>
    <div class="figma-spec"><strong>Hover lift</strong>translateY(-4px) rotate(-1deg)</div>
  </div>
</div>
`
},

// ── Text / Title ──
{
  file: 'text-title.html',
  name: 'Text / Title',
  css: ['/assets/css/tokens.css', '/assets/css/components/text-title.css'],
  template: `
<h1 class="figma-page-title">Text / Title</h1>
<p class="figma-page-subtitle">CAAT Design System · Typography system</p>

<div class="figma-section">
  <h2 class="figma-section-title">Heading Scale</h2>
  <div class="figma-row"><span class="figma-row-label">Display</span><div class="figma-row-items"><span class="caat-title caat-title--display" style="margin:0;">Display</span></div></div>
  <div class="figma-row"><span class="figma-row-label">H1</span><div class="figma-row-items"><span class="caat-title caat-title--h1" style="margin:0;">Heading 1</span></div></div>
  <div class="figma-row"><span class="figma-row-label">H2</span><div class="figma-row-items"><span class="caat-title caat-title--h2" style="margin:0;">Heading 2</span></div></div>
  <div class="figma-row"><span class="figma-row-label">H3</span><div class="figma-row-items"><span class="caat-title caat-title--h3" style="margin:0;">Heading 3</span></div></div>
  <div class="figma-row"><span class="figma-row-label">H4</span><div class="figma-row-items"><span class="caat-title caat-title--h4" style="margin:0;">Heading 4</span></div></div>
  <div class="figma-row"><span class="figma-row-label">H5</span><div class="figma-row-items"><span class="caat-title caat-title--h5" style="margin:0;">Heading 5</span></div></div>
  <div class="figma-row"><span class="figma-row-label">H6</span><div class="figma-row-items"><span class="caat-title caat-title--h6" style="margin:0;">Heading 6</span></div></div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Text Variants</h2>
  <div class="figma-row"><span class="figma-row-label">Lead</span><div class="figma-row-items"><span class="caat-text caat-text--lead">Lead paragraph text at 1.25rem.</span></div></div>
  <div class="figma-row"><span class="figma-row-label">Body</span><div class="figma-row-items"><span class="caat-text">Standard body text at 1rem.</span></div></div>
  <div class="figma-row"><span class="figma-row-label">Small</span><div class="figma-row-items"><span class="caat-text caat-text--small">Small text at 0.875rem.</span></div></div>
  <div class="figma-row"><span class="figma-row-label">Muted</span><div class="figma-row-items"><span class="caat-text caat-text--muted">Muted text at 60% opacity.</span></div></div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Eyebrow + Subtitle</h2>
  <div class="figma-row"><span class="figma-row-label">Eyebrow</span><div class="figma-row-items"><span class="caat-title__eyebrow">Pension Solutions</span></div></div>
  <div class="figma-row"><span class="figma-row-label">Subtitle</span><div class="figma-row-items"><span class="caat-title__subtitle">Supporting text that provides additional context.</span></div></div>
</div>

<div class="figma-section">
  <h2 class="figma-section-title">Specifications</h2>
  <div class="figma-specs">
    <div class="figma-spec"><strong>Font</strong>Libre Franklin</div>
    <div class="figma-spec"><strong>Display</strong>3.5rem, 900, -0.04em</div>
    <div class="figma-spec"><strong>H1</strong>2.5rem, 800</div>
    <div class="figma-spec"><strong>Body</strong>1rem, 400, line-height 1.6</div>
    <div class="figma-spec"><strong>Heading colour</strong>var(--caat-blue-900)</div>
    <div class="figma-spec"><strong>Body colour</strong>var(--caat-ink)</div>
    <div class="figma-spec"><strong>Eyebrow</strong>0.75rem, 700, uppercase, var(--caat-blue-700)</div>
  </div>
</div>
`
},

]; // end components array

// ─── Patching logic ─────────────────────────────────────────────────────

let patched = 0;
let skipped = 0;

for (const comp of components) {
  const filePath = path.join(COMPONENTS_DIR, comp.file);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠  File not found: ${comp.file}`);
    skipped++;
    continue;
  }

  let html = fs.readFileSync(filePath, 'utf8');

  // Skip if already patched
  if (html.includes('figma-template')) {
    console.log(`⏭  Already patched: ${comp.file}`);
    skipped++;
    continue;
  }

  const cssArg = JSON.stringify(comp.css).replace(/"/g, "'");
  const badgeHtml = `\n        <a href="#" onclick="downloadFigmaHTML('${comp.name}',${cssArg}); return false;" class="badge" style="background:var(--caat-blue-100);color:var(--caat-blue-900);text-decoration:none;font-size:.75rem;padding:.35em .75em;border-radius:50rem;cursor:pointer;"><i class="bi bi-download"></i> Figma HTML</a>`;

  // 1. Insert badge after last </span> in the d-flex badge row, or after the header
  // Strategy: find the badge/status area and add our badge
  
  // Try pattern A: standard contract pages with `badge bg-secondary`
  const badgePattern = /(<span class="badge bg-secondary">caat\/components\/[^<]+<\/span>)/;
  const statusPattern = /(<span class="status-badge[^"]*">[^<]*<\/span>(?:\s*<span class="status-badge[^"]*">[^<]*(?:<[^>]+>[^<]*)*<\/span>)*)/;
  
  if (badgePattern.test(html)) {
    html = html.replace(badgePattern, `$1${badgeHtml}`);
  } else if (statusPattern.test(html)) {
    // download.html pattern — has status-badge but no bg-secondary badge
    html = html.replace(statusPattern, `$1${badgeHtml}`);
  } else {
    // logo-wall.html, feature-resource-hero.html — plain <header>
    const headerPattern = /(<p class="lead">[\s\S]*?<\/p>)/;
    if (headerPattern.test(html)) {
      html = html.replace(headerPattern, `$1\n      <div class="d-flex gap-2 flex-wrap mb-3">${badgeHtml}\n      </div>`);
    } else {
      console.log(`⚠  Could not find insertion point for badge: ${comp.file}`);
      skipped++;
      continue;
    }
  }

  // 2. Insert <template> before the footer (or before </body> as fallback)
  const templateBlock = `\n<!-- ════════════════════════════════════════════════════════════\n     FIGMA EXPORT TEMPLATE (hidden — used by figma-export.js)\n     ════════════════════════════════════════════════════════════ -->\n<template id="figma-template">\n${comp.template}\n</template>\n`;
  
  // Try to insert before the FOOTER comment
  const footerComment = /\n(<!-- [═=]+\s*\n\s*FOOTER\s*\n\s*[═=]+ -->)/;
  if (footerComment.test(html)) {
    html = html.replace(footerComment, `${templateBlock}\n$1`);
  } else {
    // Fallback: insert before </body>
    html = html.replace('</body>', `${templateBlock}\n</body>`);
  }

  // 3. Add the script tag before </body> (if not already present)
  if (!html.includes('figma-export.js')) {
    html = html.replace('</body>', '<script src="/assets/js/figma-export.js"></script>\n</body>');
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✅ Patched: ${comp.file}`);
  patched++;
}

console.log(`\nDone! Patched ${patched} files, skipped ${skipped}.`);
