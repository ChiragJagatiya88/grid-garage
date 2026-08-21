(function () {
  function pad(num) {
    return num < 10 ? '0' + num : String(num);
  }

  /**
   * Match Dawn SliderComponent page math (global.js).
   * @param {HTMLElement} slider
   * @param {NodeListOf<Element>} slideItems
   */
  function computeSliderState(slider, slideItems) {
    var visible = Array.from(slideItems).filter(function (el) {
      return el.clientWidth > 0;
    });
    if (visible.length < 2) {
      return { offset: 1, totalPages: 1, visible: visible };
    }
    var offset = visible[1].offsetLeft - visible[0].offsetLeft;
    if (!offset || offset < 1) {
      offset = visible[0].offsetWidth || 1;
    }
    var slidesPerPage = Math.floor((slider.clientWidth - visible[0].offsetLeft) / offset);
    if (slidesPerPage < 1) slidesPerPage = 1;
    var totalPages = visible.length - slidesPerPage + 1;
    if (totalPages < 1) totalPages = 1;
    return { offset: offset, totalPages: totalPages, visible: visible };
  }

  function currentPageFromScroll(slider, offset) {
    if (!offset) return 1;
    return Math.round(slider.scrollLeft / offset) + 1;
  }

  function initFeaturedCollectionSlider(root) {
    var sectionId = root.getAttribute('data-gg-fc-slider');
    if (!sectionId) return;

    var slider = root.querySelector('[id^="Slider-"]');
    var slideItems = slider ? slider.querySelectorAll('[id^="Slide-"]') : null;
    if (!slider || !slideItems || slideItems.length === 0) return;

    var segmentsWrap = root.querySelector('[data-fc-segments="' + sectionId + '"]');
    var countEl = root.querySelector('[data-fc-count="' + sectionId + '"]');
    var prefix = segmentsWrap ? segmentsWrap.getAttribute('data-segment-aria-prefix') || 'Go to slide' : '';
    var ofWord = segmentsWrap ? segmentsWrap.getAttribute('data-segment-aria-of') || 'of' : 'of';

    if (!segmentsWrap || !countEl) return;

    var state = { offset: 1, totalPages: 1, segmentButtons: [] };

    function ariaForSegment(indexOneBased, total) {
      return prefix + ' ' + indexOneBased + ' ' + ofWord + ' ' + total;
    }

    function rebuildSegments() {
      var computed = computeSliderState(slider, slideItems);
      state.offset = computed.offset;
      state.totalPages = computed.totalPages;
      state.segmentButtons = [];

      segmentsWrap.innerHTML = '';
      for (var i = 0; i < state.totalPages; i++) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'gg-fc-controls__segment' + (i === 0 ? ' is-active' : '');
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        btn.setAttribute('aria-label', ariaForSegment(i + 1, state.totalPages));
        (function (pageIndex) {
          btn.addEventListener('click', function () {
            slider.scrollTo({
              left: pageIndex * state.offset,
              behavior: 'smooth',
            });
          });
        })(i);
        segmentsWrap.appendChild(btn);
        state.segmentButtons.push(btn);
      }
      syncFromScroll();
    }

    function syncFromScroll() {
      var page = currentPageFromScroll(slider, state.offset);
      page = Math.max(1, Math.min(page, state.totalPages));
      var idx = page - 1;
      countEl.textContent = pad(page) + '/' + pad(state.totalPages);
      state.segmentButtons.forEach(function (b, bi) {
        var on = bi === idx;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', on ? 'true' : 'false');
      });
    }

    var scrollTimer;
    slider.addEventListener(
      'scroll',
      function () {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(syncFromScroll, 80);
      },
      { passive: true }
    );

    slider.addEventListener(
      'keydown',
      function (e) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          slider.scrollTo({
            left: Math.max(0, slider.scrollLeft - state.offset),
            behavior: 'smooth',
          });
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          slider.scrollTo({
            left: slider.scrollLeft + state.offset,
            behavior: 'smooth',
          });
        }
      },
      false
    );

    if (!slider.hasAttribute('tabindex')) {
      slider.setAttribute('tabindex', '0');
    }

    var ro = new ResizeObserver(function () {
      rebuildSegments();
    });
    ro.observe(slider);

    rebuildSegments();
  }

  function initAll() {
    document.querySelectorAll('slider-component[data-gg-fc-slider]').forEach(initFeaturedCollectionSlider);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  document.addEventListener('shopify:section:load', function (event) {
    var target = event.target;
    if (!target || !target.querySelector) return;
    var root = target.querySelector('slider-component[data-gg-fc-slider]');
    if (root) initFeaturedCollectionSlider(root);
  });
})();
