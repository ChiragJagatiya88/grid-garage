(function () {
  function initHero(root) {
    const sectionId = root.getAttribute('data-gg-hero');
    if (!sectionId) return;

    const slides = root.querySelectorAll('.gg-hero-gg__slide');
    if (slides.length <= 1) return;

    const prev = root.querySelector('[data-gg-hero-prev="' + sectionId + '"]');
    const next = root.querySelector('[data-gg-hero-next="' + sectionId + '"]');
    const dots = root.querySelectorAll('[data-gg-hero-dot="' + sectionId + '"]');
    const live = root.querySelector('[data-gg-hero-live="' + sectionId + '"]');

    let index = 0;
    for (let i = 0; i < slides.length; i++) {
      if (slides[i].classList.contains('is-active')) {
        index = i;
        break;
      }
    }

    function syncVideos(activeIdx) {
      slides.forEach(function (slide, i) {
        const vid = slide.querySelector('video');
        if (!vid) return;
        if (i === activeIdx) {
          const p = vid.play();
          if (p && typeof p.catch === 'function') {
            p.catch(function () {});
          }
        } else {
          vid.pause();
        }
      });
    }

    function announce(idx) {
      if (!live) return;
      const n = idx + 1;
      const template = live.getAttribute('data-announce-pattern') || '';
      live.textContent = template
        .replace(/__CURRENT__/g, String(n))
        .replace(/__TOTAL__/g, String(slides.length));
    }

    function setIndex(i) {
      const n = slides.length;
      const idx = ((i % n) + n) % n;
      index = idx;
      slides.forEach(function (slide, si) {
        const on = si === idx;
        slide.classList.toggle('is-active', on);
        slide.setAttribute('aria-hidden', on ? 'false' : 'true');
      });
      dots.forEach(function (dot, di) {
        const on = di === idx;
        dot.classList.toggle('is-active', on);
        dot.setAttribute('aria-current', on ? 'true' : 'false');
      });
      syncVideos(idx);
      announce(idx);
    }

    prev?.addEventListener('click', function () {
      setIndex(index - 1);
    });
    next?.addEventListener('click', function () {
      setIndex(index + 1);
    });

    dots.forEach(function (dot, di) {
      dot.addEventListener('click', function () {
        setIndex(di);
      });
    });

    syncVideos(index);
  }

  document.querySelectorAll('[data-gg-hero]').forEach(initHero);
})();
