/**
 * IF Featured Collection — Swiper rail for product tile cards
 */
(function () {
  function waitForSwiper(cb) {
    if (typeof window.Swiper === 'function') {
      cb();
      return;
    }
    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      if (typeof window.Swiper === 'function') {
        clearInterval(timer);
        cb();
      } else if (tries > 80) {
        clearInterval(timer);
      }
    }, 50);
  }

  function syncNav(swiper, prevBtn, nextBtn) {
    if (!prevBtn || !nextBtn) return;
    const atStart = swiper.isBeginning;
    const atEnd = swiper.isEnd;
    prevBtn.disabled = atStart;
    nextBtn.disabled = atEnd;
    prevBtn.setAttribute('aria-disabled', atStart ? 'true' : 'false');
    nextBtn.setAttribute('aria-disabled', atEnd ? 'true' : 'false');
  }

  function initSection(root) {
    if (!root || root._ifFcReady) return;
    root._ifFcReady = true;

    const rail = root.querySelector('[data-if-fc-rail]');
    const prevBtn = root.querySelector('[data-if-fc-prev]');
    const nextBtn = root.querySelector('[data-if-fc-next]');
    const nav = root.querySelector('[data-if-fc-nav]');
    if (!rail || !rail.querySelector('.swiper-slide')) return;

    waitForSwiper(() => {
      const swiper = new window.Swiper(rail, {
        slidesPerView: 1.35,
        spaceBetween: 12,
        speed: 420,
        watchOverflow: true,
        observer: true,
        observeParents: true,
        breakpoints: {
          480: { slidesPerView: 1.6, spaceBetween: 12 },
          750: { slidesPerView: 3, spaceBetween: 14 },
          1200: { slidesPerView: 5, spaceBetween: 14 },
        },
        on: {
          init() {
            syncNav(this, prevBtn, nextBtn);
            if (nav) nav.hidden = this.isLocked;
          },
          slideChange() {
            syncNav(this, prevBtn, nextBtn);
          },
          resize() {
            syncNav(this, prevBtn, nextBtn);
            if (nav) nav.hidden = this.isLocked;
          },
          reachBeginning() {
            syncNav(this, prevBtn, nextBtn);
          },
          reachEnd() {
            syncNav(this, prevBtn, nextBtn);
          },
        },
      });

      root._ifFcSwiper = swiper;
      if (prevBtn) prevBtn.addEventListener('click', () => swiper.slidePrev());
      if (nextBtn) nextBtn.addEventListener('click', () => swiper.slideNext());
    });
  }

  function boot() {
    document.querySelectorAll('[data-if-fc]').forEach(initSection);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  document.addEventListener('shopify:section:load', (e) => {
    const root = e.target && e.target.querySelector('[data-if-fc]');
    if (root) {
      root._ifFcReady = false;
      initSection(root);
    }
  });
})();
