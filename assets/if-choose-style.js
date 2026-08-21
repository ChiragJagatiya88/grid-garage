/**
 * IF Choose Your Style
 * Desktop: hover title → swap left preview image
 * Mobile: click title → show image under that title
 */
(function () {
  var MQ = window.matchMedia('(min-width: 750px)');

  function activate(root, styleId, opts) {
    opts = opts || {};
    var items = root.querySelectorAll('[data-if-sty-item]');
    var previews = root.querySelectorAll('[data-if-sty-preview-item]');

    items.forEach(function (item) {
      var on = item.getAttribute('data-style-id') === styleId;
      item.classList.toggle('is-active', on);
      var btn = item.querySelector('[data-if-sty-btn]');
      var media = item.querySelector('[data-if-sty-mobile-media]');
      if (btn) btn.setAttribute('aria-expanded', on ? 'true' : 'false');
      if (media) {
        if (MQ.matches) {
          media.hidden = true;
        } else {
          media.hidden = !on;
        }
      }
    });

    previews.forEach(function (el) {
      var on = el.getAttribute('data-style-id') === styleId;
      el.classList.toggle('is-active', on);
      el.hidden = !on;
    });
  }

  function init(root) {
    if (root.dataset.ifStyInit === 'true') return;
    root.dataset.ifStyInit = 'true';

    var items = root.querySelectorAll('[data-if-sty-item]');
    if (!items.length) return;

    var activeId =
      (root.querySelector('[data-if-sty-item].is-active') || items[0]).getAttribute(
        'data-style-id'
      );

    activate(root, activeId);

    items.forEach(function (item) {
      var id = item.getAttribute('data-style-id');
      var btn = item.querySelector('[data-if-sty-btn]');
      if (!btn) return;

      btn.addEventListener('mouseenter', function () {
        if (!MQ.matches) return;
        activate(root, id);
      });

      btn.addEventListener('focus', function () {
        if (!MQ.matches) return;
        activate(root, id);
      });

      btn.addEventListener('click', function () {
        if (MQ.matches) {
          activate(root, id);
          return;
        }
        /* Mobile: toggle / switch accordion under title */
        activate(root, id);
      });
    });

    function onMqChange() {
      var current =
        (root.querySelector('[data-if-sty-item].is-active') || items[0]).getAttribute(
          'data-style-id'
        );
      activate(root, current);
    }

    if (typeof MQ.addEventListener === 'function') {
      MQ.addEventListener('change', onMqChange);
    } else if (typeof MQ.addListener === 'function') {
      MQ.addListener(onMqChange);
    }
  }

  function boot() {
    document.querySelectorAll('[data-if-sty]').forEach(init);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  document.addEventListener('shopify:section:load', function (event) {
    var el = event && event.target;
    if (!el || !el.querySelectorAll) return;
    el.querySelectorAll('[data-if-sty]').forEach(function (root) {
      root.dataset.ifStyInit = 'false';
      init(root);
    });
  });
})();
