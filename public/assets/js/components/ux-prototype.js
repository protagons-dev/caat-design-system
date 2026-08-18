/* ============================================================
   Prototype-only behavior: "Find your plan" DBprime / DBplus chooser.
   Illustrative routing for the usability test — not real pension logic.
   ============================================================ */
(function () {
  'use strict';

  var LINKS = {
    handbook:   'forms-and-fact-sheets.html',
    employers:  'merged-plan-pages.html',
    myPension:  'member-login.html',
    statement:  'your-annual-pension-statement.html'
  };

  // One icon + link row (My Pension, statement video, secure message).
  function linkRow(icon, href, label) {
    return '<p class="proto-result__link"><a href="' + href + '">' +
      '<i class="bi ' + icon + '" aria-hidden="true"></i> ' + label + '</a></p>';
  }

  function divider() {
    return '<hr class="proto-result__divider">';
  }

  // Shared closing block: where to self-serve a plan-design confirmation.
  // `also` inserts "also" for answers that already offered another route.
  function confirmBlock(also) {
    return '<p class="proto-result__note">You can ' + (also ? 'also ' : '') +
        'confirm your plan design on your Annual Pension Statement and My Pension, ' +
        'your online member portal.</p>' +
      linkRow('bi-box-arrow-up-right', LINKS.myPension, 'Log into My Pension') +
      linkRow('bi-camera-video', LINKS.statement, 'Find your statement information');
  }

  function handbookNote(copy) {
    return '<p class="proto-result__note">' + copy +
      ' Learn more in your <a href="' + LINKS.handbook + '">Member Handbook</a>.</p>';
  }

  var DBPLUS_FORMULA = 'The pension you earn in DBplus is based on the total contributions ' +
    'made by you and your employer, and is calculated using the CAAT’s Annual Pension Factor.';

  var ANSWERS = {
    'college': {
      title: 'I work for a college',
      body: function () {
        return '<p class="proto-result__lead">If you work <strong>full-time</strong> at an ' +
            'Ontario college, you are a <strong>DBprime</strong> member.</p>' +
          handbookNote('With DBprime, your pension is calculated using a formula based on ' +
            'your earnings and years of pensionable service.') +
          divider() +
          '<p class="proto-result__lead">If you work <strong>part-time or on contract</strong> ' +
            'at an Ontario college, you are a <strong>DBplus</strong> member.</p>' +
          handbookNote(DBPLUS_FORMULA) +
          divider() +
          confirmBlock(false);
      }
    },
    'non-college': {
      title: 'I work for a non-college employer',
      body: function () {
        return '<p class="proto-result__lead">You are a <strong>DBplus</strong> member.</p>' +
          handbookNote(DBPLUS_FORMULA) +
          divider() +
          confirmBlock(false);
      }
    },
    'merger': {
      title: 'My pension plan joined CAAT through a merger',
      body: function () {
        return '<p class="proto-result__lead">You’re either a ' +
            '<strong>DBplus or DBprime</strong> member.</p>' +
          '<p class="proto-result__note">Confirm your plan design by selecting your employer ' +
            'from <a href="' + LINKS.employers + '">this list</a>.</p>' +
          divider() +
          confirmBlock(true);
      }
    },
    'unsure': {
      title: 'I’m not sure',
      body: function () {
        return confirmBlock(false) +
          divider() +
          '<p class="proto-result__lead"><strong>Need help? Contact us directly.</strong></p>' +
          '<p class="proto-result__contact"><i class="bi bi-telephone" aria-hidden="true"></i> ' +
            'Toll free: <a href="tel:18663502228">1-866-350-2228</a></p>' +
          '<p class="proto-result__contact"><i class="bi bi-envelope" aria-hidden="true"></i> ' +
            'Email: <a href="mailto:member@caatpension.ca">member@caatpension.ca</a></p>' +
          linkRow('bi-box-arrow-up-right', LINKS.myPension, 'Secure message on My Pension');
      }
    }
  };

  function resultHTML(answer) {
    var a = ANSWERS[answer];
    if (!a) return '';
    return '<div class="proto-result__card">' +
        '<div class="proto-result__header">' +
          '<p class="proto-result__eyebrow">Your plan</p>' +
          '<h3 class="proto-result__plan">' + a.title + '</h3>' +
        '</div>' +
        '<div class="proto-result__body">' + a.body() + '</div>' +
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
    // `focusTarget` moves keyboard/SR focus onto the answer; it stays false on
    // the initial render and on "Start over" so focus is never stolen.
    function swap(target, fill, focusTarget) {
      var current = root.querySelector('.proto-chooser__panel:not([hidden]), .proto-chooser__result:not([hidden])');
      var reveal = function () {
        if (current && current !== target) { current.hidden = true; current.classList.remove('is-leaving'); }
        if (typeof fill === 'string') target.innerHTML = fill;
        target.hidden = false;
        target.classList.add('is-entering');
        void target.offsetWidth;          // reflow so the transition runs
        target.classList.remove('is-entering');
        if (focusTarget && typeof target.focus === 'function') target.focus();
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
      var html = resultHTML(opt.getAttribute('data-answer'));
      if (html) swap(resultBox, html, true);
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
