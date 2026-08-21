(function () {
  function pad(num) {
    return num < 10 ? '0' + num : String(num);
  }

  /**
   * @param {HTMLElement} slider - .gg-rev__slider with data-rev-slider
   */
  function initRevSlider(slider) {
    var sectionId = slider.getAttribute('data-rev-slider');
    if (!sectionId) return;

    var cards = slider.querySelectorAll('.gg-rev__card');
    if (cards.length === 0) return;

    var prev = document.querySelector('[data-rev-prev="' + sectionId + '"]');
    var next = document.querySelector('[data-rev-next="' + sectionId + '"]');
    var countEl = document.querySelector('[data-rev-cur="' + sectionId + '"]');
    var segments = document.querySelectorAll('[data-rev-seg="' + sectionId + '"]');

    var total = cards.length;

    function currentIndex() {
      var scrollL = slider.scrollLeft;
      var idx = 0;
      var best = Infinity;
      cards.forEach(function (card, i) {
        var target = card.offsetLeft - slider.offsetLeft;
        var d = Math.abs(target - scrollL);
        if (d < best) {
          best = d;
          idx = i;
        }
      });
      return idx;
    }

    function updateSegments(idx) {
      segments.forEach(function (seg, si) {
        var on = si === idx;
        seg.classList.toggle('is-active', on);
        seg.setAttribute('aria-selected', on ? 'true' : 'false');
      });
    }

    function updateArrows(idx) {
      if (prev) {
        prev.disabled = idx === 0;
        prev.classList.toggle('is-disabled', idx === 0);
      }
      if (next) {
        var atEnd = idx >= total - 1;
        next.disabled = atEnd;
        next.classList.toggle('is-disabled', atEnd);
      }
    }

    function updateCount(idx) {
      if (countEl) {
        countEl.textContent = pad(idx + 1) + '/' + pad(total);
      }
    }

    function setIndex(i) {
      var idx = Math.max(0, Math.min(i, total - 1));
      var card = cards[idx];
      if (card) {
        var left = card.offsetLeft - slider.offsetLeft;
        slider.scrollTo({ left: left, behavior: 'smooth' });
      }
      updateCount(idx);
      updateSegments(idx);
      updateArrows(idx);
    }

    prev?.addEventListener('click', function () {
      setIndex(currentIndex() - 1);
    });
    next?.addEventListener('click', function () {
      setIndex(currentIndex() + 1);
    });

    segments.forEach(function (seg, si) {
      seg.addEventListener('click', function () {
        setIndex(si);
      });
    });

    slider.addEventListener(
      'keydown',
      function (e) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          setIndex(currentIndex() - 1);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          setIndex(currentIndex() + 1);
        }
      },
      false
    );

    var scrollEndTimer;
    slider.addEventListener(
      'scroll',
      function () {
        clearTimeout(scrollEndTimer);
        scrollEndTimer = setTimeout(function () {
          var idx = currentIndex();
          updateCount(idx);
          updateSegments(idx);
          updateArrows(idx);
        }, 80);
      },
      { passive: true }
    );

    setIndex(0);
  }

  function initAll() {
    document.querySelectorAll('[data-rev-slider]').forEach(initRevSlider);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  document.addEventListener('shopify:section:load', function (event) {
    var root = event.target;
    if (!root || !root.querySelector) return;
    var s = root.querySelector('[data-rev-slider]');
    if (s) initRevSlider(s);
  });
})();
