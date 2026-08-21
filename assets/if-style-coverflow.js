/**
 * IF Style Coverflow — mobile-tuned effect, gentle on desktop
 * (high modifier/depth on wide screens was collapsing middle slides to dots)
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

  /**
   * Keep desktop close to the working mobile recipe.
   * Only nudge stretch slightly for larger card widths.
   */
  function coverflowFor(width) {
    if (width >= 1100) {
      return {
        rotate: 0,
        stretch: -24,
        depth: 55,
        modifier: 1.35,
        scale: 0.84,
        slideShadows: false,
      };
    }
    if (width >= 750) {
      return {
        rotate: 0,
        stretch: -20,
        depth: 60,
        modifier: 1.45,
        scale: 0.83,
        slideShadows: false,
      };
    }
    /* Mobile — leave as-is (user confirmed perfect) */
    return {
      rotate: 0,
      stretch: -18,
      depth: 70,
      modifier: 1.85,
      scale: 0.82,
      slideShadows: false,
    };
  }

  function init(root) {
    if (root.dataset.ifCfInit === 'true') return;
    var el = root.querySelector('[data-if-cf-slider]');
    if (!el || !el.querySelector('.swiper-slide')) return;
    root.dataset.ifCfInit = 'true';

    waitForSwiper(function () {
      if (root._ifCfSwiper) {
        try {
          root._ifCfSwiper.destroy(true, true);
        } catch (e) {}
        root._ifCfSwiper = null;
      }

      var slideCount = el.querySelectorAll('.swiper-slide').length;
      var startIndex = Math.floor(slideCount / 2);
      var useLoop = slideCount >= 3;
      var w = window.innerWidth || 1100;

      var swiper = new window.Swiper(el, {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        spaceBetween: 0,
        initialSlide: startIndex,
        loop: useLoop,
        loopAdditionalSlides: Math.max(slideCount, 4),
        loopAddBlankSlides: false,
        speed: 500,
        watchSlidesProgress: true,
        resistanceRatio: 0.75,
        coverflowEffect: coverflowFor(w),
        breakpoints: {
          750: {
            coverflowEffect: coverflowFor(750),
          },
          1100: {
            coverflowEffect: coverflowFor(1100),
          },
        },
        on: {
          init: function (instance) {
            requestAnimationFrame(function () {
              instance.update();
              if (useLoop) {
                instance.slideToLoop(startIndex % slideCount, 0, false);
              } else {
                instance.slideTo(startIndex, 0, false);
              }
            });
          },
        },
      });

      root._ifCfSwiper = swiper;

      var imgs = el.querySelectorAll('img');
      var pending = imgs.length;
      function onImg() {
        pending -= 1;
        if (pending <= 0 && root._ifCfSwiper) {
          root._ifCfSwiper.update();
        }
      }
      if (pending) {
        imgs.forEach(function (img) {
          if (img.complete) onImg();
          else {
            img.addEventListener('load', onImg, { once: true });
            img.addEventListener('error', onImg, { once: true });
          }
        });
      }
    });
  }

  function boot() {
    document.querySelectorAll('[data-if-cf]').forEach(init);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  document.addEventListener('shopify:section:load', function (event) {
    var el = event && event.target;
    if (!el || !el.querySelectorAll) return;
    el.querySelectorAll('[data-if-cf]').forEach(function (root) {
      root.dataset.ifCfInit = 'false';
      init(root);
    });
  });
})();
