/**
 * IF Before / After — pointer + touch drag comparison
 */
(function () {
  function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
  }

  function syncImageWidth(root, viewport) {
    if (!viewport) return;
    var w = viewport.getBoundingClientRect().width;
    if (w > 0) {
      root.style.setProperty('--if-ba-vp-w', w + 'px');
      viewport.style.setProperty('--if-ba-vp-w', w + 'px');
    }
  }

  function setPosition(root, viewport, clientX) {
    var rect = viewport.getBoundingClientRect();
    if (rect.width <= 0) return;
    var pct = clamp(((clientX - rect.left) / rect.width) * 100, 0, 100);
    var value = pct + '%';
    root.style.setProperty('--if-ba-pos', value);
    viewport.style.setProperty('--if-ba-pos', value);
  }

  function init(root) {
    if (root.dataset.ifBaInit === 'true') return;
    root.dataset.ifBaInit = 'true';

    var viewport = root.querySelector('[data-if-ba-viewport]');
    if (!viewport) return;

    syncImageWidth(root, viewport);

    var activePointerId = null;

    function onMove(e) {
      if (e.pointerId !== activePointerId) return;
      e.preventDefault();
      setPosition(root, viewport, e.clientX);
    }

    function onUp(e) {
      if (activePointerId === null) return;
      if (e && e.pointerId !== activePointerId) return;
      activePointerId = null;
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointercancel', onUp);
    }

    function onDown(e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      e.preventDefault();
      activePointerId = e.pointerId;
      setPosition(root, viewport, e.clientX);
      document.addEventListener('pointermove', onMove, { passive: false });
      document.addEventListener('pointerup', onUp);
      document.addEventListener('pointercancel', onUp);
    }

    viewport.addEventListener('pointerdown', onDown);

    window.addEventListener('resize', function () {
      syncImageWidth(root, viewport);
    });

    if (typeof ResizeObserver !== 'undefined') {
      var ro = new ResizeObserver(function () {
        syncImageWidth(root, viewport);
      });
      ro.observe(viewport);
    }
  }

  function boot() {
    document.querySelectorAll('[data-if-ba]').forEach(init);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  document.addEventListener('shopify:section:load', function (event) {
    var el = event && event.target;
    if (!el || !el.querySelectorAll) return;
    el.querySelectorAll('[data-if-ba]').forEach(function (root) {
      root.dataset.ifBaInit = 'false';
      init(root);
    });
  });
})();
