/**
 * Grid Garage product cards: swatch click updates main image (from data-* on the swatch), price (optional JSON), and links.
 */
(function () {
  const SELECTED_CLASS = 'gg-pc__swatch--selected';

  function parseCardData(scriptEl) {
    if (!scriptEl) return null;
    try {
      return JSON.parse(scriptEl.textContent.trim());
    } catch (e) {
      return null;
    }
  }

  function findCardImage(card) {
    return card.querySelector('img.gg-pc__img') || card.querySelector('.gg-pc__media img');
  }

  function findEntry(values, rawName) {
    if (!values || !values.length || rawName == null) return null;
    const name = String(rawName);
    let entry = values.find(function (v) {
      return v && v.name === name;
    });
    if (entry) return entry;
    const trimmed = name.trim();
    entry = values.find(function (v) {
      return v && String(v.name).trim() === trimmed;
    });
    if (entry) return entry;
    const lower = trimmed.toLowerCase();
    return (
      values.find(function (v) {
        return v && String(v.name).trim().toLowerCase() === lower;
      }) || null
    );
  }

  function applyImageFromAnchor(img, anchor, data) {
    if (!img) return;
    const src = anchor.getAttribute('data-variant-src');
    if (!src) return;

    const srcSet = anchor.getAttribute('data-variant-srcset');
    const alt = anchor.getAttribute('data-variant-alt');
    const sizesAttr = anchor.getAttribute('data-img-sizes');

    img.loading = 'eager';
    img.decoding = 'async';
    if (srcSet) {
      img.srcset = srcSet;
    } else {
      img.removeAttribute('srcset');
    }
    const sizes = sizesAttr || (data && data.sizes);
    if (sizes) {
      img.sizes = sizes;
    }
    img.src = src;
    if (alt) {
      img.alt = alt;
    }
  }

  function applyImageFromEntry(img, entry, data) {
    if (!img || !entry) return;
    let src = entry.src;
    if (!src && entry.srcSet) {
      const first = String(entry.srcSet).split(',')[0].trim().split(/\s+/)[0];
      if (first) src = first;
    }
    if (!src) return;

    img.loading = 'eager';
    img.decoding = 'async';
    if (entry.srcSet) {
      img.srcset = entry.srcSet;
    } else {
      img.removeAttribute('srcset');
    }
    if (data && data.sizes) {
      img.sizes = data.sizes;
    }
    img.src = src;
    if (entry.alt) {
      img.alt = entry.alt;
    }
  }

  function applySelection(card, anchor) {
    card.querySelectorAll('a[data-gg-pc-swatch]').forEach(function (sw) {
      sw.classList.remove(SELECTED_CLASS);
      sw.removeAttribute('aria-current');
    });
    anchor.classList.add(SELECTED_CLASS);
    anchor.setAttribute('aria-current', 'true');
  }

  function handleSwatchActivate(anchor, e) {
    if (e && (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)) return false;

    const card = anchor.closest('.gg-pc[data-gg-interactive]');
    if (!card) return false;

    if (e) e.preventDefault();

    const img = findCardImage(card);
    const scriptEl = card.querySelector('script.gg-pc__json[type="application/json"]');
    const data = parseCardData(scriptEl);
    const raw = anchor.getAttribute('data-option-value');
    const entry = data && data.values && raw != null ? findEntry(data.values, raw) : null;

    if (anchor.getAttribute('data-variant-src')) {
      applyImageFromAnchor(img, anchor, data);
    } else if (entry) {
      applyImageFromEntry(img, entry, data);
    }

    if (entry) {
      const priceSlot = card.querySelector('[data-gg-pc-price-root]');
      if (priceSlot && typeof entry.priceHtml === 'string') {
        if (typeof entry.useSimplePriceClass === 'boolean') {
          priceSlot.classList.toggle('gg-pc__price--simple', entry.useSimplePriceClass);
        }
        priceSlot.innerHTML = entry.priceHtml;
      }
    }

    const href = (entry && entry.href) || anchor.getAttribute('href');
    const mediaLink = card.querySelector('[data-gg-pc-media-link]');
    const titleLink = card.querySelector('.gg-pc__title-link');
    if (href) {
      if (mediaLink) mediaLink.setAttribute('href', href);
      if (titleLink) titleLink.setAttribute('href', href);
    }

    applySelection(card, anchor);
    return true;
  }

  document.addEventListener(
    'click',
    function (e) {
      const anchor = e.target.closest('a[data-gg-pc-swatch]');
      if (!anchor) return;
      handleSwatchActivate(anchor, e);
    },
    true
  );

  document.addEventListener(
    'keydown',
    function (e) {
      if (e.key !== ' ') return;
      const anchor = e.target.closest('a[data-gg-pc-swatch]');
      if (!anchor || !anchor.closest('.gg-pc[data-gg-interactive]')) return;
      e.preventDefault();
      anchor.click();
    },
    false
  );

  window.ggProductCardActivateSwatch = function (anchorElement) {
    if (!anchorElement || !anchorElement.closest) return false;
    const a = anchorElement.closest('a[data-gg-pc-swatch]') || anchorElement;
    return handleSwatchActivate(a, null);
  };
})();
