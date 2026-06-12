/* ============================================================
   CAAT Navigation — Component JS
   AEM client library: caat/components/navigation/clientlibs/js

   Mobile drill-down menu (offcanvas): one panel per node that has
   children, drill forward to Level 4, "Back" returns to the
   previous level. Desktop behaviour (collapse, mega menu) stays
   Bootstrap-native — this file handles ONLY the drill-down.

   Markup contract (see navigation.html §6):
     [data-caat-drillnav]                 container (offcanvas-body)
       .caat-drillnav__panel              one per level node; the
                                          FIRST panel is the root
       .caat-drillnav__next[data-target]  drills into panel #id
       .caat-drillnav__back               returns one level
   Hidden panels carry the `hidden` attribute; the next-trigger
   mirrors state via aria-expanded.
   ============================================================ */

(function () {
  'use strict';

  function initDrillnav(root) {
    var panels = root.querySelectorAll('.caat-drillnav__panel');
    if (!panels.length) return;

    var stack = [panels[0]];          // panel history; [0] is the root
    var triggers = {};                // panel id -> the trigger that opened it

    panels.forEach(function (p, i) {
      if (i > 0) p.hidden = true;
    });

    function current() { return stack[stack.length - 1]; }

    function show(panel, direction) {
      panel.hidden = false;
      panel.classList.remove('caat-drillnav__panel--fwd', 'caat-drillnav__panel--back');
      // restart the slide animation
      void panel.offsetWidth;
      panel.classList.add(direction === 'back' ? 'caat-drillnav__panel--back' : 'caat-drillnav__panel--fwd');
    }

    function drillForward(trigger) {
      var target = root.querySelector('#' + trigger.getAttribute('data-target'));
      if (!target || target === current()) return;
      current().hidden = true;
      trigger.setAttribute('aria-expanded', 'true');
      triggers[target.id] = trigger;
      stack.push(target);
      show(target, 'fwd');
      var back = target.querySelector('.caat-drillnav__back');
      if (back) back.focus();
    }

    function drillBack() {
      if (stack.length < 2) return;
      var leaving = stack.pop();
      leaving.hidden = true;
      var trigger = triggers[leaving.id];
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
      show(current(), 'back');
      if (trigger) trigger.focus();
    }

    function reset() {
      while (stack.length > 1) {
        var leaving = stack.pop();
        leaving.hidden = true;
        var trigger = triggers[leaving.id];
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }
      current().hidden = false;
      current().classList.remove('caat-drillnav__panel--fwd', 'caat-drillnav__panel--back');
    }

    root.addEventListener('click', function (e) {
      var next = e.target.closest('.caat-drillnav__next');
      if (next) { drillForward(next); return; }
      var back = e.target.closest('.caat-drillnav__back');
      if (back) drillBack();
    });

    // Escape inside a sub-panel goes back a level (the offcanvas
    // itself closes on Escape only from the root panel).
    root.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && stack.length > 1) {
        e.stopPropagation();
        drillBack();
      }
    });

    // Reset to the root panel whenever the offcanvas closes, or when a
    // host container asks for it (non-offcanvas hosts dispatch
    // 'caat-drillnav:reset' on the [data-caat-drillnav] element).
    var offcanvas = root.closest('.offcanvas');
    if (offcanvas) offcanvas.addEventListener('hidden.bs.offcanvas', reset);
    root.addEventListener('caat-drillnav:reset', reset);
  }

  function init() {
    document.querySelectorAll('[data-caat-drillnav]').forEach(initDrillnav);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
