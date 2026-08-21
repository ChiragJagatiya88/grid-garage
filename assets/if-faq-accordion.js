/**
 * IF FAQ Accordion — smooth open/close + optional one-at-a-time
 */
(function () {
  var DURATION = 320;

  function getAnswer(item) {
    return item.querySelector('.if-faq__answer');
  }

  function prefersReducedMotion() {
    return (
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  function clearAnim(answer) {
    if (!answer) return;
    answer.style.height = '';
    answer.style.overflow = '';
    answer.style.opacity = '';
    answer.style.transition = '';
    answer.classList.remove('is-animating');
  }

  function animateOpen(item) {
    var answer = getAnswer(item);
    if (!answer) {
      item.open = true;
      return;
    }

    if (prefersReducedMotion()) {
      item.open = true;
      clearAnim(answer);
      return;
    }

    item.open = true;
    answer.classList.add('is-animating');
    answer.style.overflow = 'hidden';
    answer.style.height = '0px';
    answer.style.opacity = '0';
    answer.style.transition = 'none';

    /* Force reflow before transitioning */
    void answer.offsetHeight;

    answer.style.transition =
      'height ' + DURATION + 'ms ease, opacity ' + DURATION + 'ms ease';
    answer.style.height = answer.scrollHeight + 'px';
    answer.style.opacity = '1';

    var done = function (e) {
      if (e && e.propertyName && e.propertyName !== 'height') return;
      answer.removeEventListener('transitionend', done);
      if (item.open) {
        answer.style.height = 'auto';
        answer.style.overflow = '';
        answer.style.opacity = '';
        answer.style.transition = '';
        answer.classList.remove('is-animating');
      }
    };
    answer.addEventListener('transitionend', done);
  }

  function animateClose(item) {
    var answer = getAnswer(item);
    if (!answer) {
      item.open = false;
      return Promise.resolve();
    }

    if (prefersReducedMotion() || !item.open) {
      item.open = false;
      clearAnim(answer);
      return Promise.resolve();
    }

    return new Promise(function (resolve) {
      answer.classList.add('is-animating');
      answer.style.overflow = 'hidden';
      answer.style.height = answer.scrollHeight + 'px';
      answer.style.opacity = '1';
      answer.style.transition = 'none';
      void answer.offsetHeight;

      answer.style.transition =
        'height ' + DURATION + 'ms ease, opacity ' + DURATION + 'ms ease';
      answer.style.height = '0px';
      answer.style.opacity = '0';

      var done = function (e) {
        if (e && e.propertyName && e.propertyName !== 'height') return;
        answer.removeEventListener('transitionend', done);
        item.open = false;
        clearAnim(answer);
        resolve();
      };
      answer.addEventListener('transitionend', done);
    });
  }

  function init(root) {
    if (root.dataset.ifFaqInit === 'true') return;
    root.dataset.ifFaqInit = 'true';

    var oneAtATime = !root.hasAttribute('data-multi-open');
    var items = Array.prototype.slice.call(
      root.querySelectorAll('[data-if-faq-item]')
    );
    if (!items.length) return;

    items.forEach(function (item) {
      var summary = item.querySelector('.if-faq__summary');
      if (!summary) return;

      summary.addEventListener('click', function (e) {
        e.preventDefault();
        if (item.dataset.ifFaqBusy === 'true') return;

        if (item.open) {
          item.dataset.ifFaqBusy = 'true';
          animateClose(item).then(function () {
            item.dataset.ifFaqBusy = 'false';
          });
          return;
        }

        item.dataset.ifFaqBusy = 'true';

        var closers = [];
        if (oneAtATime) {
          items.forEach(function (other) {
            if (other !== item && other.open) {
              closers.push(animateClose(other));
            }
          });
        }

        Promise.all(closers).then(function () {
          animateOpen(item);
          /* Allow next click after open transition starts settling */
          window.setTimeout(function () {
            item.dataset.ifFaqBusy = 'false';
          }, DURATION + 40);
        });
      });
    });
  }

  function boot() {
    document.querySelectorAll('[data-if-faq]').forEach(init);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  document.addEventListener('shopify:section:load', function (event) {
    var el = event && event.target;
    if (!el || !el.querySelectorAll) return;
    el.querySelectorAll('[data-if-faq]').forEach(function (root) {
      root.dataset.ifFaqInit = 'false';
      init(root);
    });
  });
})();
