/* ============================================================
   CAAT Button — Component JS
   AEM client library: caat/components/button/clientlibs/js
   Auto-generates analytics data attributes from label and URL.
   ============================================================ */

(function () {
  'use strict';

  /**
   * Auto-populate analytics attributes on CAAT buttons that
   * do not already have a data-analytics-label set.
   */
  function initButtonAnalytics() {
    var buttons = document.querySelectorAll('.caat-button[href], button.caat-button');
    buttons.forEach(function (btn) {
      if (btn.getAttribute('data-analytics-label')) return;

      // Set component type
      btn.setAttribute('data-analytics-component', 'button');

      // Determine category
      var category = 'CTA';
      if (btn.hasAttribute('download')) category = 'download';
      else if (btn.getAttribute('target') === '_blank') category = 'external';
      else if (btn.getAttribute('type') === 'submit') category = 'form';
      else if ((btn.getAttribute('href') || '').charAt(0) === '#') category = 'anchor';
      btn.setAttribute('data-analytics-category', category);

      // Normalize label
      var label = (btn.textContent || '').trim().toLowerCase()
        .replace(/[^a-z0-9 ]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 60);
      btn.setAttribute('data-analytics-label', label);

      // Destination
      var dest = btn.getAttribute('href') || '';
      if (dest) btn.setAttribute('data-analytics-destination', dest);
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initButtonAnalytics);
  } else {
    initButtonAnalytics();
  }
})();
