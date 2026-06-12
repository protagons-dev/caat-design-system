/* ============================================================
   CAAT Side Navigation — Component JS
   AEM client library: caat/components/side-nav/clientlibs/js

   Mobile disclosure ONLY. Below the desktop breakpoint the nav
   collapses behind a prominent "In this section" toggle (per
   QLD Gov DS / USWDS side-nav guidance); on desktop the toggle
   is hidden by CSS and the nav is always expanded.

   Progressive enhancement: this script adds .caat-side-nav--collapsible,
   and ONLY that class allows CSS to collapse the body — without JS
   (or without a toggle in the markup) the nav stays fully expanded.
   ============================================================ */

(function () {
  'use strict';

  function init() {
    document.querySelectorAll('.caat-side-nav').forEach(function (nav) {
      var toggle = nav.querySelector('.caat-side-nav__toggle');
      var body = nav.querySelector('.caat-side-nav__body');
      if (!toggle || !body) return;

      nav.classList.add('caat-side-nav--collapsible');
      toggle.setAttribute('aria-expanded', 'false');

      toggle.addEventListener('click', function () {
        var open = nav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
