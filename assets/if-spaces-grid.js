/**
 * IF Spaces Grid — mobile Swiper pages (N cards/page) + numbered pager
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

  function buildPager(root, swiper) {
    var pagesEl = root.querySelector('[data-if-spc-pages]');
    var prev = root.querySelector('[data-if-spc-prev]');
    var next = root.querySelector('[data-if-spc-next]');
    if (!pagesEl) return;

    pagesEl.innerHTML = '';
    var total = swiper.slides.length;
    for (var i = 0; i < total; i++) {
      (function (index) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'if-spc__page-btn' + (index === swiper.activeIndex ? ' is-active' : '');
        btn.textContent = String(index + 1);
        btn.setAttribute('aria-label', 'Go to page ' + (index + 1));
        btn.addEventListener('click', function () {
          swiper.slideTo(index);
        });
        pagesEl.appendChild(btn);
      })(i);
    }

    function sync() {
      var buttons = pagesEl.querySelectorAll('.if-spc__page-btn');
      buttons.forEach(function (b, i) {
        b.classList.toggle('is-active', i === swiper.activeIndex);
      });
      if (prev) {
        prev.disabled = swiper.isBeginning;
        prev.setAttribute('aria-disabled', swiper.isBeginning ? 'true' : 'false');
      }
      if (next) {
        next.disabled = swiper.isEnd;
        next.setAttribute('aria-disabled', swiper.isEnd ? 'true' : 'false');
      }
    }

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

    swiper.on('slideChange', sync);
    sync();
  }

  function init(root) {
    if (root.dataset.ifSpcInit === 'true') return;
    var mobile = root.querySelector('[data-if-spc-mobile]');
    var el = root.querySelector('[data-if-spc-slider]');
    if (!mobile || !el || !el.querySelector('.swiper-slide')) return;

    /* Only init Swiper for mobile layout */
    if (window.matchMedia('(min-width: 750px)').matches) return;

    root.dataset.ifSpcInit = 'true';

    waitForSwiper(function () {
      if (root._ifSpcSwiper) {
        try {
          root._ifSpcSwiper.destroy(true, true);
        } catch (e) {}
      }

      var swiper = new window.Swiper(el, {
        slidesPerView: 1,
        spaceBetween: 0,
        speed: 420,
        autoHeight: true,
        watchOverflow: true,
        observer: true,
        observeParents: true,
      });

      root._ifSpcSwiper = swiper;
      buildPager(root, swiper);
    });
  }

  function boot() {
    document.querySelectorAll('[data-if-spc]').forEach(init);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.addEventListener('resize', function () {
    document.querySelectorAll('[data-if-spc]').forEach(function (root) {
      var isDesk = window.matchMedia('(min-width: 750px)').matches;
      if (isDesk) {
        if (root._ifSpcSwiper) {
          try {
            root._ifSpcSwiper.destroy(true, true);
          } catch (e) {}
          root._ifSpcSwiper = null;
          root.dataset.ifSpcInit = 'false';
        }
      } else if (root.dataset.ifSpcInit !== 'true') {
        init(root);
      }
    });
  });

  document.addEventListener('shopify:section:load', function (event) {
    var el = event && event.target;
    if (!el || !el.querySelectorAll) return;
    el.querySelectorAll('[data-if-spc]').forEach(function (root) {
      root.dataset.ifSpcInit = 'false';
      init(root);
    });
  });
})();
