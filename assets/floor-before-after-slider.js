/**
 * Floor: before/after comparison slider (pointer + touch)
 * Drag uses document-level move/up so the handle tracks the cursor/finger even when it leaves the knob.
 */
(function () {
  function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
  }

  function init(root) {
    if (root.dataset.floorBasInit === 'true') return;
    root.dataset.floorBasInit = 'true';

    const viewport = root.querySelector('[data-floor-bas-viewport]');
    if (!viewport) return;

    let activePointerId = null;

    function setPosition(clientX) {
      const rect = viewport.getBoundingClientRect();
      if (rect.width <= 0) return;
      const x = clientX - rect.left;
      const pct = clamp((x / rect.width) * 100, 0, 100);
      root.style.setProperty('--floor-bas-pos', pct + '%');
    }

    function endDrag(e) {
      if (activePointerId === null) return;
      if (e && e.pointerId !== activePointerId) return;
      activePointerId = null;
      document.removeEventListener('pointermove', onDocumentPointerMove);
      document.removeEventListener('pointerup', onDocumentPointerUp);
      document.removeEventListener('pointercancel', onDocumentPointerUp);
    }

    function onDocumentPointerMove(e) {
      if (e.pointerId !== activePointerId) return;
      e.preventDefault();
      setPosition(e.clientX);
    }

    function onDocumentPointerUp(e) {
      endDrag(e);
    }

    function onViewportPointerDown(e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      e.preventDefault();
      activePointerId = e.pointerId;
      setPosition(e.clientX);
      document.addEventListener('pointermove', onDocumentPointerMove, { passive: false });
      document.addEventListener('pointerup', onDocumentPointerUp);
      document.addEventListener('pointercancel', onDocumentPointerUp);
    }

    viewport.addEventListener('pointerdown', onViewportPointerDown);
  }

  function runInit() {
    document.querySelectorAll('[data-floor-bas-root]').forEach(init);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runInit);
  } else {
    runInit();
  }

  document.addEventListener('shopify:section:load', function (event) {
    var el = event && event.target;
    if (!el || !el.querySelectorAll) return;
    el.querySelectorAll('[data-floor-bas-root]').forEach(init);
  });
})();
