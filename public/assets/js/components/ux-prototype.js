/* ============================================================
   Prototype-only behavior: DBprime / DBplus plan-design router.
   Illustrative routing for the usability test — not real pension logic.
   ============================================================ */
(function () {
  'use strict';

  var ESTIMATOR = {
    dbprime: { name: 'DBprime', slug: 'use-the-dbprime-estimator', note: 'You appear to be in the DBprime plan design (defined benefit based on your salary and years of service).' },
    dbplus: { name: 'DBplus', slug: 'use-the-dbplus-pension-estimator', note: 'You appear to be in the DBplus plan design (defined benefit based on your contributions).' },
    college: { name: 'DBplus (College sector)', slug: 'use-the-dbplus-college-pension-estimator', note: 'You appear to be in the DBplus plan design for the college sector.' }
  };

  function resolve(a1, a2) {
    if (a1 === 'college') return ESTIMATOR.college;
    if (a2 === 'pre2019') return ESTIMATOR.dbprime;
    return ESTIMATOR.dbplus; // post2019 or default
  }

  function showResult(root, plan) {
    var box = root.querySelector('[data-result]');
    box.hidden = false;
    box.innerHTML =
      '<h3>Your plan design: ' + plan.name + '</h3>' +
      '<p>' + plan.note + '</p>' +
      '<a class="caat-button caat-button--primary caat-button--sm" href="' + plan.slug + '.html">' +
      'Continue to the ' + plan.name + ' estimator <i class="bi bi-arrow-right caat-button__icon" aria-hidden="true"></i></a>' +
      '<p class="proto-router__disclaimer mt-2 mb-0">Not right? <button type="button" class="btn btn-link p-0 align-baseline" data-restart>Start over</button></p>';
    box.scrollIntoView({ block: 'nearest' });
  }

  function initRouter(root) {
    var answers = {};
    root.addEventListener('click', function (e) {
      var restart = e.target.closest('[data-restart]');
      if (restart) {
        answers = {};
        root.querySelectorAll('.caat-button.is-active').forEach(function (b) { b.classList.remove('is-active'); });
        root.querySelector('.proto-router__step[data-step="2"]').hidden = true;
        root.querySelector('[data-result]').hidden = true;
        return;
      }
      var btn = e.target.closest('button[data-answer]');
      if (!btn) return;
      var step = btn.closest('.proto-router__step');
      var n = step.getAttribute('data-step');
      answers[n] = btn.getAttribute('data-answer');
      step.querySelectorAll('button[data-answer]').forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');

      if (n === '1') {
        if (answers['1'] === 'college') {
          showResult(root, resolve('college'));
        } else {
          root.querySelector('.proto-router__step[data-step="2"]').hidden = false;
          root.querySelector('[data-result]').hidden = true;
        }
      } else if (n === '2') {
        showResult(root, resolve(answers['1'], answers['2']));
      }
    });
  }

  function init() {
    document.querySelectorAll('[data-proto-router]').forEach(initRouter);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
