/* ============================================================
   Prototype-only behavior: "Find your plan" DBprime / DBplus chooser.
   Illustrative routing for the usability test — not real pension logic.
   ============================================================ */
(function () {
  'use strict';

  var PLANS = {
    dbprime: {
      key: 'dbprime',
      name: 'DBprime',
      desc: 'DBprime is a defined benefit pension plan for full-time employees at Ontario colleges, providing secure lifetime retirement income.'
    },
    dbplus: {
      key: 'dbplus',
      name: 'DBplus',
      desc: 'DBplus is CAAT’s flexible defined benefit plan available to a broad range of employers and employees, offering secure and portable retirement income.'
    }
  };

  // Full-time Ontario college -> DBprime; everyone else -> DBplus.
  function resolvePlan(answer) {
    return answer === 'college-ft' ? PLANS.dbprime : PLANS.dbplus;
  }

  function planHTML(plan) {
    return '<div class="proto-result__card proto-result--' + plan.key + '">' +
        '<div class="proto-result__header">' +
          '<p class="proto-result__eyebrow">Your plan</p>' +
          '<p class="proto-result__plan">' + plan.name + '</p>' +
        '</div>' +
        '<div class="proto-result__body">' +
          '<p>Based on your answer, you are likely in the <strong>' + plan.name + '</strong> plan.</p>' +
          '<p class="proto-result__desc">' + plan.desc + '</p>' +
        '</div>' +
        footerHTML() +
      '</div>';
  }

  function helpHTML() {
    return '<div class="proto-result__card proto-result--help">' +
        '<div class="proto-result__header">' +
          '<p class="proto-result__eyebrow">Let’s help you find out</p>' +
          '<p class="proto-result__plan">Not sure? Here’s where to check.</p>' +
        '</div>' +
        '<div class="proto-result__body">' +
          '<p class="proto-help__lead"><strong>Need help? Reach us directly:</strong></p>' +
          '<p class="proto-help__contact">' +
            '<span><i class="bi bi-telephone" aria-hidden="true"></i> 1-866-350-2228</span>' +
            '<span><i class="bi bi-envelope" aria-hidden="true"></i> member@caatpension.ca</span>' +
          '</p>' +
          '<hr class="proto-help__divider">' +
          '<p class="proto-help__sub">You can also confirm your plan type yourself:</p>' +
          '<p class="proto-help__link"><a href="member-login.html"><i class="bi bi-box-arrow-up-right" aria-hidden="true"></i> My Pension</a></p>' +
          '<p class="proto-help__link"><a href="#"><i class="bi bi-camera-video" aria-hidden="true"></i> Video walkthrough: How to navigate the portal</a></p>' +
        '</div>' +
        footerHTML() +
      '</div>';
  }

  function footerHTML() {
    return '<div class="proto-result__footer">' +
      '<button type="button" class="proto-result__restart" data-restart>' +
        '<i class="bi bi-arrow-left" aria-hidden="true"></i> Start over</button>' +
    '</div>';
  }

  function initChooser(root) {
    var step1 = root.querySelector('[data-step="1"]');
    var resultBox = root.querySelector('[data-result]');

    // Fade/slide the currently visible element out, then the target in.
    function swap(target, fill) {
      var current = root.querySelector('.proto-chooser__panel:not([hidden]), .proto-chooser__result:not([hidden])');
      var reveal = function () {
        if (current && current !== target) { current.hidden = true; current.classList.remove('is-leaving'); }
        if (typeof fill === 'string') target.innerHTML = fill;
        target.hidden = false;
        target.classList.add('is-entering');
        void target.offsetWidth;          // reflow so the transition runs
        target.classList.remove('is-entering');
      };
      if (current && current !== target) {
        current.classList.add('is-leaving');
        window.setTimeout(reveal, 200);
      } else {
        reveal();
      }
    }

    root.addEventListener('click', function (e) {
      if (e.target.closest('[data-restart]')) { swap(step1); return; }
      var opt = e.target.closest('button[data-answer]');
      if (!opt) return;
      var answer = opt.getAttribute('data-answer');
      swap(resultBox, answer === 'unsure' ? helpHTML() : planHTML(resolvePlan(answer)));
    });
  }

  function init() {
    document.querySelectorAll('[data-proto-chooser]').forEach(initChooser);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
