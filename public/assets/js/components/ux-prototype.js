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

  function resolve(a1, a2) {
    if (a1 === 'college') return PLANS.dbprime;
    if (a1 === 'after2019') return PLANS.dbplus;
    // "unsure" -> decided by join date
    return a2 === 'pre2019' ? PLANS.dbprime : PLANS.dbplus;
  }

  function resultHTML(plan) {
    return '<div class="proto-result__card proto-result--' + plan.key + '">' +
        '<div class="proto-result__header">' +
          '<p class="proto-result__eyebrow">Your plan</p>' +
          '<p class="proto-result__plan">' + plan.name + '</p>' +
        '</div>' +
        '<div class="proto-result__body">' +
          '<p>Based on your answer, you are likely in the <strong>' + plan.name + '</strong> plan.</p>' +
          '<p class="proto-result__desc">' + plan.desc + '</p>' +
        '</div>' +
        '<div class="proto-result__footer">' +
          '<button type="button" class="proto-result__restart" data-restart>' +
            '<i class="bi bi-arrow-left" aria-hidden="true"></i> Start over</button>' +
        '</div>' +
      '</div>';
  }

  function initChooser(root) {
    var step1 = root.querySelector('[data-step="1"]');
    var step2 = root.querySelector('[data-step="2"]');
    var resultBox = root.querySelector('[data-result]');
    var answers = {};

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

    function restart() {
      answers = {};
      step2.hidden = true;
      swap(step1);
    }

    root.addEventListener('click', function (e) {
      if (e.target.closest('[data-restart]')) { restart(); return; }
      if (e.target.closest('[data-back]')) { answers = {}; swap(step1); return; }
      var opt = e.target.closest('button[data-answer]');
      if (!opt) return;
      var step = opt.closest('.proto-chooser__panel').getAttribute('data-step');
      answers[step] = opt.getAttribute('data-answer');
      if (step === '1') {
        if (answers['1'] === 'unsure') swap(step2);
        else swap(resultBox, resultHTML(resolve(answers['1'])));
      } else {
        swap(resultBox, resultHTML(resolve(answers['1'], answers['2'])));
      }
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
