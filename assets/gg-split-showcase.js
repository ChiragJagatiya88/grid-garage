(function () {
  function initSplitShowcase(root) {
    const sectionId = root.getAttribute('data-split-slider');
    if (!sectionId) return;

    const slider = root.querySelector('.slider');
    const slides = slider ? slider.querySelectorAll('.slider__slide') : [];
    const panels = document.querySelectorAll('[data-split-text="' + sectionId + '"]');
    const currentEl = document.querySelector('[data-split-current="' + sectionId + '"]');
    const prevBtn = document.querySelector('[data-split-prev="' + sectionId + '"]');
    const nextBtn = document.querySelector('[data-split-next="' + sectionId + '"]');

    if (!slider || slides.length === 0) return;

    let index = 0;

    function updateUI() {
      if (currentEl) {
        currentEl.textContent = String(index + 1);
      }
      panels.forEach(function (panel, i) {
        panel.classList.toggle('is-active', i === index);
        panel.hidden = i !== index;
      });
    }

    function goTo(i) {
      index = ((i % slides.length) + slides.length) % slides.length;
      const slide = slides[index];
      if (slide && slider) {
        slider.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' });
      }
      updateUI();
    }

    prevBtn?.addEventListener('click', function () {
      goTo(index - 1);
    });
    nextBtn?.addEventListener('click', function () {
      goTo(index + 1);
    });

    slider.addEventListener(
      'scroll',
      function () {
        const scrollLeft = slider.scrollLeft;
        let closest = 0;
        let minDist = Infinity;
        slides.forEach(function (slide, i) {
          const d = Math.abs(slide.offsetLeft - scrollLeft);
          if (d < minDist) {
            minDist = d;
            closest = i;
          }
        });
        if (closest !== index) {
          index = closest;
          updateUI();
        }
      },
      { passive: true }
    );

    panels.forEach(function (panel, i) {
      panel.hidden = i !== 0;
    });
    updateUI();
  }

  document.querySelectorAll('slider-component[data-split-slider]').forEach(initSplitShowcase);
})();
