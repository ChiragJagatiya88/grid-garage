(function () {
  function pad(num) {
    return num < 10 ? '0' + num : String(num);
  }

  function initCarousel(root) {
    const sectionId = root.getAttribute('data-gg-tc');
    if (!sectionId) return;

    const slider = root.querySelector('.gg-tc__slider');
    const pairs = slider ? slider.querySelectorAll('.gg-tc__pair') : [];
    const prev = root.querySelector('[data-gg-tc-prev="' + sectionId + '"]');
    const next = root.querySelector('[data-gg-tc-next="' + sectionId + '"]');
    const countEl = root.querySelector('[data-gg-tc-count="' + sectionId + '"]');
    const segments = root.querySelectorAll('[data-gg-tc-seg="' + sectionId + '"]');

    if (!slider || pairs.length === 0) return;

    const total = pairs.length;

    function setIndex(i) {
      const idx = Math.max(0, Math.min(i, total - 1));
      const el = pairs[idx];
      if (el) {
        slider.scrollTo({ left: el.offsetLeft - slider.offsetLeft, behavior: 'smooth' });
      }
      if (countEl) {
        countEl.textContent = pad(idx + 1) + '/' + pad(total);
      }
      segments.forEach(function (seg, si) {
        seg.classList.toggle('is-active', si === idx);
        seg.setAttribute('aria-current', si === idx ? 'true' : 'false');
      });
      if (prev) prev.disabled = idx === 0;
      if (next) next.disabled = idx >= total - 1;
    }

    function currentIndex() {
      const scrollL = slider.scrollLeft;
      let idx = 0;
      let best = Infinity;
      pairs.forEach(function (pair, i) {
        const d = Math.abs(pair.offsetLeft - slider.offsetLeft - scrollL);
        if (d < best) {
          best = d;
          idx = i;
        }
      });
      return idx;
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

    let scrollEndTimer;
    slider.addEventListener(
      'scroll',
      function () {
        clearTimeout(scrollEndTimer);
        scrollEndTimer = setTimeout(function () {
          const idx = currentIndex();
          if (countEl) {
            countEl.textContent = pad(idx + 1) + '/' + pad(total);
          }
          segments.forEach(function (seg, si) {
            seg.classList.toggle('is-active', si === idx);
          });
          if (prev) prev.disabled = idx === 0;
          if (next) next.disabled = idx >= total - 1;
        }, 80);
      },
      { passive: true }
    );

    setIndex(0);
  }

  document.querySelectorAll('[data-gg-tc]').forEach(initCarousel);
})();
