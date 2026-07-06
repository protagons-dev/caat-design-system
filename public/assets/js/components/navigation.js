/* ============================================================
   CAAT Navigation — Component JS
   AEM client library: caat/components/navigation/clientlibs/js

   Mobile drill-down menu (offcanvas): one panel per node that has
   children, drill forward to Level 4, "Back" returns to the
   previous level. Desktop collapse and dropdown show/hide stays
   Bootstrap-native; this file normalizes mega-menu tab order and
   handles mobile drill-down.

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

  var focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');
  var hoverOpenDelay = 120;
  var hoverCloseDelay = 180;
  var desktopMedia = window.matchMedia('(min-width: 992px)');

  function isVisible(el) {
    return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  }

  function getFocusable(container) {
    return Array.prototype.slice.call(container.querySelectorAll(focusableSelector)).filter(function (el) {
      return !el.disabled && el.getAttribute('aria-hidden') !== 'true' && isVisible(el);
    });
  }

  function getMegaFocusOrder(menu) {
    var levelTwoLinks = Array.prototype.slice.call(menu.querySelectorAll('.mega-category-title[href]')).filter(isVisible);
    var allFocusable = getFocusable(menu);
    var ordered = levelTwoLinks.slice();

    allFocusable.forEach(function (el) {
      if (levelTwoLinks.indexOf(el) === -1) ordered.push(el);
    });

    return ordered;
  }

  function initMegaMenuKeyboard(menu) {
    menu.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;

      var order = getMegaFocusOrder(menu);
      if (order.length < 2) return;

      var currentIndex = order.indexOf(document.activeElement);
      if (currentIndex === -1) return;

      var nextIndex = currentIndex + (e.shiftKey ? -1 : 1);
      if (nextIndex < 0 || nextIndex >= order.length) return;

      e.preventDefault();
      order[nextIndex].focus();
    });
  }

  function closeMegaMenu(item, restoreFocus) {
    if (!item) return;

    var toggle = item.querySelector('.nav-link-toggle');
    var menu = item.querySelector('.mega-menu');

    item.classList.remove('show');
    if (toggle) {
      toggle.classList.remove('show');
      toggle.setAttribute('aria-expanded', 'false');
      if (restoreFocus) toggle.focus();
    }
    if (menu) menu.classList.remove('show');
  }

  function closeOtherMegaMenus(activeItem) {
    document.querySelectorAll('.caat-navbar .nav-item.dropdown.show').forEach(function (item) {
      if (item !== activeItem && item.querySelector('.mega-menu')) closeMegaMenu(item, false);
    });
  }

  function openMegaMenu(item) {
    if (!item) return;

    var toggle = item.querySelector('.nav-link-toggle');
    var menu = item.querySelector('.mega-menu');
    if (!toggle || !menu) return;

    closeOtherMegaMenus(item);
    item.classList.add('show');
    toggle.classList.add('show');
    toggle.setAttribute('aria-expanded', 'true');
    menu.classList.add('show');
  }

  function initMegaMenuToggle(toggle) {
    var item = toggle.closest('.nav-item.dropdown');
    var menu = item ? item.querySelector('.mega-menu') : null;
    if (!item || !menu) return;
    var openTimer;
    var closeTimer;

    function clearTimers() {
      window.clearTimeout(openTimer);
      window.clearTimeout(closeTimer);
    }

    function scheduleOpen() {
      if (!desktopMedia.matches) return;
      clearTimers();
      openTimer = window.setTimeout(function () {
        openMegaMenu(item);
      }, hoverOpenDelay);
    }

    function scheduleClose() {
      if (!desktopMedia.matches) return;
      clearTimers();
      closeTimer = window.setTimeout(function () {
        closeMegaMenu(item, false);
      }, hoverCloseDelay);
    }

    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      clearTimers();

      var isOpen = item.classList.contains('show');

      if (isOpen) {
        closeMegaMenu(item, false);
      } else {
        openMegaMenu(item);
      }
    });

    item.addEventListener('pointerenter', scheduleOpen);
    item.addEventListener('pointerleave', scheduleClose);
    menu.addEventListener('pointerenter', scheduleOpen);
    menu.addEventListener('pointerleave', scheduleClose);

    item.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && item.classList.contains('show')) {
        e.stopPropagation();
        clearTimers();
        closeMegaMenu(item, true);
      }
    });
  }

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
    document.querySelectorAll('.caat-navbar .mega-menu').forEach(initMegaMenuKeyboard);
    document.querySelectorAll('.caat-navbar .nav-link-toggle[data-bs-toggle="dropdown"]').forEach(initMegaMenuToggle);
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.caat-navbar .nav-item.dropdown.show')) closeOtherMegaMenus(null);
    });
    document.querySelectorAll('[data-caat-drillnav]').forEach(initDrillnav);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
