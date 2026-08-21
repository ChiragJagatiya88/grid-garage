/**
 * IF Customer Reviews — Swiper carousel
 */
(function () {
  function waitForSwiper(cb) {
    if (typeof window.Swiper === 'function') {
      cb();
      return;
    }
    var tries = 0;
    var timer = setInterval(function () {
      tries += 1;
      if (typeof window.Swiper === 'function') {
        clearInterval(timer);
        cb();
      } else if (tries > 80) {
        clearInterval(timer);
      }
    }, 50);
  }

  function syncNav(swiper, prev, next) {
    if (!prev || !next) return;
    var atStart = swiper.isBeginning;
    var atEnd = swiper.isEnd;
    prev.disabled = atStart;
    next.disabled = atEnd;
    prev.setAttribute('aria-disabled', atStart ? 'true' : 'false');
    next.setAttribute('aria-disabled', atEnd ? 'true' : 'false');
  }

  function init(root) {
    var el = root.querySelector('[data-if-rev-rail]');
    var prev = root.querySelector('[data-if-rev-prev]');
    var next = root.querySelector('[data-if-rev-next]');
    if (!el || !el.querySelector('.swiper-slide')) return;

    var swiper = new window.Swiper(el, {
      slidesPerView: 1.15,
      spaceBetween: 12,
      speed: 420,
      watchOverflow: true,
      observer: true,
      observeParents: true,
      breakpoints: {
        750: { slidesPerView: 2, spaceBetween: 16 },
        990: { slidesPerView: 3, spaceBetween: 16 },
        1200: { slidesPerView: 4, spaceBetween: 16 },
      },
      on: {
        init: function () {
          syncNav(this, prev, next);
        },
        slideChange: function () {
          syncNav(this, prev, next);
        },
        resize: function () {
          syncNav(this, prev, next);
        },
        reachBeginning: function () {
          syncNav(this, prev, next);
        },
        reachEnd: function () {
          syncNav(this, prev, next);
        },
      },
    });

    if (prev) {
      prev.addEventListener('click', function () {
        swiper.slidePrev();
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        swiper.slideNext();
      });
    }

    root._ifRevSwiper = swiper;
  }

  function boot() {
    waitForSwiper(function () {
      document.querySelectorAll('[data-if-rev]').forEach(init);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  document.addEventListener('shopify:section:load', function (event) {
    var root = event.target && event.target.querySelector('[data-if-rev]');
    if (root) waitForSwiper(function () { init(root); });
  });
})();
