/**
 * Floor: Grid Garage reviews — carousel when more than 2 testimonial blocks.
 */
(function () {
  var MQ_DESKTOP = '(min-width: 990px)';

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function slidesPerView() {
    return window.matchMedia(MQ_DESKTOP).matches ? 2 : 1;
  }

  function maxIndex(slideCount) {
    return Math.max(0, slideCount - slidesPerView());
  }

  function init(root) {
    if (root.getAttribute('data-should-slider') !== 'true') return;
    if (root.dataset.flrRevInit === 'true') return;
    root.dataset.flrRevInit = 'true';

    var track = root.querySelector('[data-flr-rev-track]');
    var viewport = root.querySelector('[data-flr-rev-viewport]');
    var dotsRoot = root.querySelector('[data-flr-rev-dots]');
    var prevBtn = root.querySelector('[data-flr-rev-prev]');
    var nextBtn = root.querySelector('[data-flr-rev-next]');
    var live = root.querySelector('[data-flr-rev-live]');

    if (!track || !viewport) return;

    var slides = Array.prototype.slice.call(track.children);
    if (slides.length === 0) return;

    var index = 0;
    var autoplayTimer = null;

    var autoplay = root.getAttribute('data-autoplay') === 'true';
    var intervalMs = parseInt(root.getAttribute('data-interval') || '5000', 10);
    var showDots = root.getAttribute('data-show-dots') === 'true';

    function stepWidth() {
      var first = slides[0];
      if (!first) return 0;
      var cs = window.getComputedStyle(track);
      var gap = parseFloat(cs.gap || cs.columnGap) || 0;
      return first.offsetWidth + gap;
    }

    function setTrackTransition(enabled) {
      if (prefersReducedMotion()) {
        track.style.transition = 'none';
        return;
      }
      track.style.transition = enabled ? 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
    }

    function applyTransform() {
      var w = stepWidth();
      var x = Math.round(-index * w);
      track.style.transform = 'translate3d(' + x + 'px,0,0)';
    }

    function toggleNavVisibility() {
      var m = maxIndex(slides.length);
      var needsNav = m > 0;
      root.classList.toggle('flr-rev__outer--no-nav', !needsNav);
      if (prevBtn) {
        prevBtn.hidden = !needsNav;
        prevBtn.setAttribute('aria-hidden', needsNav ? 'false' : 'true');
      }
      if (nextBtn) {
        nextBtn.hidden = !needsNav;
        nextBtn.setAttribute('aria-hidden', needsNav ? 'false' : 'true');
      }
      if (dotsRoot) {
        var hideDots = !needsNav || !showDots;
        dotsRoot.hidden = hideDots;
        dotsRoot.setAttribute('aria-hidden', hideDots ? 'true' : 'false');
      }
    }

    function updateDots() {
      if (!dotsRoot) return;
      var btns = dotsRoot.querySelectorAll('.flr-rev__dot');
      btns.forEach(function (btn, i) {
        if (i === index) {
          btn.setAttribute('aria-current', 'true');
        } else {
          btn.removeAttribute('aria-current');
        }
      });
    }

    function announce() {
      if (!live) return;
      var m = maxIndex(slides.length);
      var template = root.getAttribute('data-live-template') || '';
      live.textContent = template
        .replace(/\{current\}/g, String(index + 1))
        .replace(/\{total\}/g, String(m + 1));
    }

    function buildDots() {
      if (!dotsRoot || !showDots) return;
      dotsRoot.innerHTML = '';
      var pages = maxIndex(slides.length) + 1;
      var labelPage = root.getAttribute('data-dot-label') || 'Slide {n}';
      for (var d = 0; d < pages; d++) {
        (function (pageIndex) {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'flr-rev__dot';
          btn.setAttribute('aria-label', labelPage.replace(/\{n\}/g, String(pageIndex + 1)));
          btn.addEventListener('click', function () {
            goTo(pageIndex);
            stopAutoplay();
            startAutoplay();
          });
          dotsRoot.appendChild(btn);
        })(d);
      }
    }

    function goTo(i) {
      var m = maxIndex(slides.length);
      index = Math.max(0, Math.min(i, m));
      setTrackTransition(true);
      applyTransform();
      updateDots();
      announce();
      if (prevBtn) prevBtn.disabled = index <= 0;
      if (nextBtn) nextBtn.disabled = index >= m;
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function startAutoplay() {
      stopAutoplay();
      if (!autoplay || maxIndex(slides.length) <= 0) return;
      autoplayTimer = window.setInterval(function () {
        var m = maxIndex(slides.length);
        if (index >= m) {
          goTo(0);
        } else {
          goTo(index + 1);
        }
      }, intervalMs);
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        goTo(index - 1);
        stopAutoplay();
        startAutoplay();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        goTo(index + 1);
        stopAutoplay();
        startAutoplay();
      });
    }

    root.addEventListener('mouseenter', stopAutoplay);
    root.addEventListener('mouseleave', startAutoplay);
    root.addEventListener('focusin', stopAutoplay);
    root.addEventListener('focusout', function (e) {
      if (!root.contains(e.relatedTarget)) startAutoplay();
    });

    var resizeQueued = false;
    function onResize() {
      if (resizeQueued) return;
      resizeQueued = true;
      window.requestAnimationFrame(function () {
        resizeQueued = false;
        var m = maxIndex(slides.length);
        if (index > m) index = m;
        buildDots();
        setTrackTransition(false);
        applyTransform();
        setTrackTransition(!prefersReducedMotion());
        toggleNavVisibility();
        updateDots();
        announce();
        if (prevBtn) prevBtn.disabled = index <= 0;
        if (nextBtn) nextBtn.disabled = index >= m;
      });
    }
    window.addEventListener('resize', onResize);

    buildDots();
    toggleNavVisibility();
    index = 0;
    setTrackTransition(false);
    applyTransform();
    setTrackTransition(!prefersReducedMotion());
    updateDots();
    announce();
    var m0 = maxIndex(slides.length);
    if (prevBtn) prevBtn.disabled = true;
    if (nextBtn) nextBtn.disabled = m0 <= 0 || index >= m0;
    startAutoplay();
  }

  function runInit() {
    document.querySelectorAll('[data-flr-rev-root]').forEach(init);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runInit);
  } else {
    runInit();
  }

  document.addEventListener('shopify:section:load', function (event) {
    var el = event && event.target;
    if (!el || !el.querySelectorAll) return;
    el.querySelectorAll('[data-flr-rev-root]').forEach(function (node) {
      delete node.dataset.flrRevInit;
      init(node);
    });
  });
})();
