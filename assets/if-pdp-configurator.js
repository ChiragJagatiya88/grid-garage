/**
 * IF PDP Configurator — size / pattern / color + live preview
 * Tile qty = ceil(sqft / tileArea) — e.g. 17" on 400 sq ft → 200 tiles.
 * Preview grid still uses ceil(floorFt / tileFt) per side for layout.
 * 2-Car kit = 20×20 ft (400 sq ft).
 */
(function () {
  const CDN = 'https://www.gridgarageinc.com/cdn/shop/files/';

  const PATTERNS = [
    {
      id: 'checkered',
      name: 'Checkered Classic',
      shortName: 'Checkered',
      zones: ['Tile Color A', 'Tile Color B'],
      noDuplicate: true,
    },
    {
      id: 'racetrack',
      name: 'Racetrack',
      shortName: 'Racetrack',
      zones: ['Track Border', 'Main Floor', 'Inner Accent'],
    },
    {
      id: 'showroom',
      name: 'Showroom',
      shortName: 'Showroom',
      zones: ['Main Floor', 'Highlight Border', 'Parking Bays'],
    },
    {
      id: 'doubleborder',
      name: 'Double Border',
      shortName: 'Double Border',
      zones: ['Center Floor', 'Inner Border', 'Outer Border'],
    },
    {
      id: 'solid',
      name: 'Stealth Solid',
      shortName: 'Stealth Solid',
      zones: ['Base Floor'],
    },
  ];

  const FALLBACK_COLORS = [
    { name: 'Black', hex: '#1a1a1a', image: CDN + 'Black.png?v=1777583020&width=416' },
    { name: 'Grey', hex: '#6b6f76', image: CDN + 'Grey.png?v=1777583021&width=416' },
    { name: 'Light Grey', hex: '#b8bcc1', image: CDN + 'LightGrey.png?v=1777583021&width=416' },
    { name: 'Red', hex: '#c8202f', image: CDN + 'Red.png?v=1777583021&width=416' },
    { name: 'Orange', hex: '#e8781f', image: CDN + 'Orange.png?v=1777583021&width=416' },
    { name: 'Blue', hex: '#1f4e9c', image: CDN + 'aef1436e-d62c-47ca-b20b-88e02b20c3fe.jpg?v=1778085565&width=416' },
    { name: 'White', hex: '#f2f2ee', image: CDN + '5ecdce44-7929-4d00-801a-2fee623d09db.jpg?v=1778085573&width=416' },
  ];

  /** Kit floor footprints in feet. 2-Car = 400 sq ft. */
  const KIT_DIMS = {
    '2car': { width: 20, length: 20, sqft: 400 },
    '3car': { width: 24, length: 26, sqft: 624 },
    custom: { width: 20, length: 20, sqft: 400 },
  };

  const KIT_LABELS = {
    '2car': '2-Car Garage',
    '3car': '3-Car Garage',
    custom: 'Design My Space',
  };

  /** Sq ft baselines used for custom $/sqft rate derivation (matches old configurator). */
  const KIT_SQFT = {
    '2car': 430,
    '3car': 630,
  };

  const DEFAULT_COLOR_KEYWORDS = [
    'racing red', 'red', 'jet black', 'black', 'slate grey', 'grey', 'gray',
    'royal blue', 'blue', 'orange', 'white',
  ];

  /** Default zone colors per pattern (load + pattern switch). */
  const PATTERN_DEFAULT_COLORS = {
    checkered: ['Black', 'Blue'],
    racetrack: ['Black', 'Blue', 'Grey'],
    showroom: ['Black', 'Blue', 'Grey'],
    doubleborder: ['Black', 'Blue', 'Grey'],
    solid: ['Black'],
  };

  function patternImages() {
    return window.IF_CFG_PATTERN_IMAGES || window.GG_PATTERN_IMAGES || {};
  }

  /** Parse "17\" x 17\" inch" / "15.75\" × 15.75\"" → inches number */
  function parseTileInches(label) {
    if (!label) return 17;
    const m = String(label).match(/(\d+(?:\.\d+)?)/);
    const n = m ? parseFloat(m[1]) : 17;
    return n > 0 ? n : 17;
  }

  /** Order qty from floor area ÷ tile coverage (matches sq-ft calculator). */
  function tilesFromSqft(sqft, tileInches) {
    const tileArea = Math.pow((tileInches || 0) / 12, 2);
    if (!tileArea || !(sqft > 0)) return 0;
    return Math.ceil(sqft / tileArea);
  }

  function tileCounts(widthFt, lengthFt, tileInches) {
    const tileFt = tileInches / 12;
    const across = widthFt ? Math.ceil(widthFt / tileFt) : 0;
    const down = lengthFt ? Math.ceil(lengthFt / tileFt) : 0;
    const sqft = Math.round((widthFt || 0) * (lengthFt || 0));
    return {
      inches: tileInches,
      tileFt,
      across,
      down,
      total: tilesFromSqft(sqft, tileInches),
      widthFt,
      lengthFt,
      sqft,
    };
  }

  /** Scale pattern zone counts so they sum to targetTotal (largest-remainder). */
  function scaleZoneCounts(counts, targetTotal) {
    const gridTotal = counts.reduce((sum, n) => sum + n, 0);
    if (targetTotal <= 0 || gridTotal <= 0) {
      return counts.map(() => 0);
    }
    if (gridTotal === targetTotal) return counts.slice();

    const exact = counts.map((n) => (n / gridTotal) * targetTotal);
    const floored = exact.map((n) => Math.floor(n));
    let remaining = targetTotal - floored.reduce((sum, n) => sum + n, 0);
    const order = exact
      .map((n, i) => ({ i: i, frac: n - floored[i] }))
      .sort((a, b) => b.frac - a.frac);
    for (let k = 0; k < remaining; k++) {
      floored[order[k % order.length].i]++;
    }
    return floored;
  }

  function cutoutTileSpan(ft, tileFt) {
    if (!ft || !tileFt || ft <= 0) return 0;
    return Math.max(1, Math.ceil(ft / tileFt));
  }

  /** True if cell (col,row) falls inside any L-shape cut-out. */
  function isCutoutCell(col, row, cols, rows, cutouts, tileFt) {
    if (!cutouts || !cutouts.length) return false;
    for (let i = 0; i < cutouts.length; i++) {
      const co = cutouts[i];
      if (!co.width || !co.depth) continue;
      const cw = Math.min(cols, cutoutTileSpan(co.width, tileFt));
      const cd = Math.min(rows, cutoutTileSpan(co.depth, tileFt));
      if (!cw || !cd) continue;
      let inCut = false;
      switch (co.corner) {
        case 'tl':
          inCut = col < cw && row < cd;
          break;
        case 'tr':
          inCut = col >= cols - cw && row < cd;
          break;
        case 'bl':
          inCut = col < cw && row >= rows - cd;
          break;
        case 'br':
        default:
          inCut = col >= cols - cw && row >= rows - cd;
          break;
      }
      if (inCut) return true;
    }
    return false;
  }

  const CUTOUT_CORNERS = [
    { id: 'tl', title: 'Top-left' },
    { id: 'tr', title: 'Top-right' },
    { id: 'bl', title: 'Bottom-left' },
    { id: 'br', title: 'Bottom-right' },
  ];

  const CUT_DEPTH_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">' +
    '<g clip-path="url(#if-cfg-clip-depth)">' +
    '<path d="M2.46094 11.4182V10.0237" stroke="#DC1C1B" stroke-width="0.730469" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M4.49512 11.0862V10.0237" stroke="#DC1C1B" stroke-width="0.730469" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M6.5293 11.4182V10.0237" stroke="#DC1C1B" stroke-width="0.730469" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M8.5625 11.0862V10.0237" stroke="#DC1C1B" stroke-width="0.730469" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M10.5957 11.4182V10.0237" stroke="#DC1C1B" stroke-width="0.730469" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M12.6299 11.0862V10.0237" stroke="#DC1C1B" stroke-width="0.730469" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M14.6641 11.4182V10.0237" stroke="#DC1C1B" stroke-width="0.730469" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M15.0202 7.54965V8.49627L16.6973 6.81918L15.0202 5.14209V6.08871H2.10482V5.14209L0.427734 6.81918L2.10482 8.49627V7.54965H15.0202Z" stroke="#DC1C1B" stroke-width="0.730469" stroke-miterlimit="10" stroke-linejoin="round"/>' +
    '<path d="M16.6973 9.95728H0.427734V13.5432H16.6973V9.95728Z" stroke="#0E100F" stroke-width="0.730469" stroke-miterlimit="10" stroke-linejoin="round"/>' +
    '</g><defs><clipPath id="if-cfg-clip-depth"><rect width="17" height="17" fill="white"/></clipPath></defs></svg>';

  const CUT_WIDTH_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">' +
    '<g clip-path="url(#if-cfg-clip-width)">' +
    '<path d="M6.48633 3.2417L7.88086 3.2417" stroke="#DC1C1B" stroke-width="0.730469" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M6.81836 5.27539L7.88086 5.27539" stroke="#DC1C1B" stroke-width="0.730469" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M6.48633 7.30908L7.88086 7.30908" stroke="#DC1C1B" stroke-width="0.730469" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M6.81836 9.34277L7.88086 9.34277" stroke="#DC1C1B" stroke-width="0.730469" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M6.48633 11.3765L7.88086 11.3765" stroke="#DC1C1B" stroke-width="0.730469" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M6.81836 13.4102L7.88086 13.4102" stroke="#DC1C1B" stroke-width="0.730469" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M6.48633 15.4438L7.88086 15.4438" stroke="#DC1C1B" stroke-width="0.730469" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M10.3551 15.8004L9.40852 15.8004L11.0856 17.4775L12.7627 15.8004L11.8161 15.8004L11.8161 2.8851L12.7627 2.8851L11.0856 1.20801L9.40852 2.8851L10.3551 2.8851L10.3551 15.8004Z" stroke="#DC1C1B" stroke-width="0.730469" stroke-miterlimit="10" stroke-linejoin="round"/>' +
    '<path d="M7.94727 17.4775L7.94727 1.20801L4.36133 1.20801L4.36133 17.4775L7.94727 17.4775Z" stroke="#0E100F" stroke-width="0.730469" stroke-miterlimit="10" stroke-linejoin="round"/>' +
    '</g><defs><clipPath id="if-cfg-clip-width"><rect width="17" height="17" fill="white" transform="translate(17) rotate(90)"/></clipPath></defs></svg>';

  function cutDimIcon(key, uid) {
    const clipId = 'if-cfg-clip-' + key + '-' + uid;
    const src = key === 'width' ? CUT_WIDTH_ICON : CUT_DEPTH_ICON;
    return src
      .replace(/if-cfg-clip-width/g, clipId)
      .replace(/if-cfg-clip-depth/g, clipId);
  }

  function getZoneIndex(pid, col, row, cols, rows) {
    const lc = cols - 1;
    const lr = rows - 1;
    switch (pid) {
      case 'solid':
        return 0;
      case 'checkered':
        return (col + row) % 2 === 0 ? 0 : 1;
      case 'racetrack': {
        /* Old site: 2-tile Track Border margin, 1-tile Inner Accent ring,
           checkered Main Floor (zones 0/1) centered inside the ring. */
        if (cols < 7 || rows < 7) {
          const onOuter = col === 0 || row === 0 || col === lc || row === lr;
          if (onOuter) return 0;
          const onInner =
            ((row === 1 || row === lr - 1) && col >= 1 && col <= lc - 1) ||
            ((col === 1 || col === lc - 1) && row >= 1 && row <= lr - 1);
          if (onInner) return 2;
          return (col + row) % 2 === 0 ? 0 : 1;
        }
        const onOuterBorder =
          col <= 1 || row <= 1 || col >= lc - 1 || row >= lr - 1;
        if (onOuterBorder) return 0;
        const ringMinCol = 2;
        const ringMaxCol = lc - 2;
        const ringMinRow = 2;
        const ringMaxRow = lr - 2;
        const onInnerAccent =
          ((row === ringMinRow || row === ringMaxRow) &&
            col >= ringMinCol &&
            col <= ringMaxCol) ||
          ((col === ringMinCol || col === ringMaxCol) &&
            row >= ringMinRow &&
            row <= ringMaxRow);
        if (onInnerAccent) return 2;
        const insideAccent =
          col > ringMinCol &&
          col < ringMaxCol &&
          row > ringMinRow &&
          row < ringMaxRow;
        if (insideAccent) {
          return (col + row) % 2 === 0 ? 0 : 1;
        }
        return 1;
      }
      case 'showroom': {
        const boxW = Math.max(2, Math.floor(cols * 0.28));
        const boxH = Math.max(3, Math.floor(rows * 0.4));
        const ring = 1;
        const gap = 1;
        const blockW = boxW + ring * 2;
        const blockH = boxH + ring * 2;
        const groupW = blockW * 2 + gap;
        const marginX = Math.max(0, Math.floor((cols - groupW) / 2));
        const marginY = Math.max(0, Math.floor((rows - blockH) / 2));
        const leftMin = marginX;
        const leftMax = marginX + blockW - 1;
        const rightMin = leftMax + gap + 1;
        const rightMax = rightMin + blockW - 1;
        const rowMin = marginY;
        const rowMax = marginY + blockH - 1;

        const zoneFor = (bMin, bMax) => {
          if (col < bMin || col > bMax || row < rowMin || row > rowMax) return null;
          const inBox =
            col >= bMin + ring && col <= bMax - ring && row >= rowMin + ring && row <= rowMax - ring;
          return inBox ? 2 : 1;
        };
        return zoneFor(leftMin, leftMax) ?? zoneFor(rightMin, rightMax) ?? 0;
      }
      case 'doubleborder': {
        const onOuter = col === 0 || row === 0 || col === lc || row === lr;
        if (onOuter) return 2;
        const onInner =
          ((row === 1 || row === lr - 1) && col >= 1 && col <= lc - 1) ||
          ((col === 1 || col === lc - 1) && row >= 1 && row <= lr - 1);
        if (onInner) return 1;
        return 0;
      }
      default:
        return 0;
    }
  }

  function zoneLetterLabel(zi) {
    return 'color ' + String.fromCharCode(97 + (zi || 0));
  }

  function resolveColorName(colors, wanted) {
    if (!wanted) return null;
    const w = String(wanted).trim().toLowerCase();
    if (!w) return null;
    const list = colors && colors.length ? colors : FALLBACK_COLORS;
    const exact = list.find((c) => c.name.toLowerCase() === w);
    if (exact) return exact.name;
    const includes = list.find(
      (c) => c.name.toLowerCase().includes(w) || w.includes(c.name.toLowerCase())
    );
    if (includes) return includes.name;
    /* Grey / Gray alias */
    if (w === 'grey' || w === 'gray') {
      const g = list.find((c) => /gr[ae]y/i.test(c.name));
      if (g) return g.name;
    }
    return null;
  }

  function pickDefaultColorName(colors, used) {
    for (const kw of DEFAULT_COLOR_KEYWORDS) {
      const match = colors.find((c) => !used.has(c.name) && c.name.toLowerCase().includes(kw));
      if (match) return match.name;
    }
    const fallback = colors.find((c) => !used.has(c.name)) || colors[0];
    return fallback ? fallback.name : 'Black';
  }

  function makeDefaultColors(colors, patternId, count) {
    const prefs = PATTERN_DEFAULT_COLORS[patternId] || [];
    const used = new Set();
    const out = [];
    const n = count || prefs.length || 1;
    for (let i = 0; i < n; i++) {
      let name = resolveColorName(colors, prefs[i]);
      if (!name || used.has(name)) {
        name = pickDefaultColorName(colors, used);
      }
      used.add(name);
      out.push(name);
    }
    return out;
  }

  function variantOptionValues(v) {
    return v.options || [v.option1, v.option2, v.option3].filter(Boolean);
  }

  function isKitOrSqftOption(val) {
    const s = String(val || '');
    return /\b[23][\s-]*car\b/i.test(s) || /per[\s-]*sq/i.test(s) || /\bkit\b/i.test(s);
  }

  function variantLooksLikeTileSku(v) {
    return !variantOptionValues(v).some(isKitOrSqftOption);
  }

  function variantMatchesColor(v, colorName) {
    if (!v || !colorName) return false;
    const wanted = String(colorName).trim().toLowerCase();
    if (!wanted) return false;
    return variantOptionValues(v).some((o) => {
      if (!o || isKitOrSqftOption(o)) return false;
      const t = String(o).trim().toLowerCase();
      return t === wanted || t.includes(wanted) || wanted.includes(t);
    });
  }

  /** Prefer a single-tile color variant (not 2-car / 3-car kits). */
  function findColorTileVariant(productData, colorName) {
    if (!productData || !productData.variants || !colorName) return null;
    const hits = productData.variants.filter((v) => variantMatchesColor(v, colorName));
    if (!hits.length) return null;
    const pick = (list) =>
      list.find((v) => v.available !== false) || list[0] || null;
    const tileSkus = hits.filter(variantLooksLikeTileSku);
    if (tileSkus.length) return pick(tileSkus);
    const perSqft = hits.filter((v) =>
      variantOptionValues(v).some((o) => /per[\s-]*sq/i.test(String(o)))
    );
    if (perSqft.length) return pick(perSqft);
    const nonKit = hits.filter(
      (v) => !variantOptionValues(v).some((o) => /\b[23][\s-]*car\b/i.test(String(o)))
    );
    return pick(nonKit);
  }

  function findKitVariant(productData, kit, preferredColor) {
    if (!productData || !productData.variants) return null;
    const num = kit === '3car' ? '3' : '2';
    const sizeRe = new RegExp('\\b' + num + '[\\s-]*car\\b', 'i');

    const candidates = productData.variants.filter((v) =>
      variantOptionValues(v).some((o) => o && sizeRe.test(o))
    );
    if (candidates.length <= 1) return candidates[0] || null;

    if (preferredColor) {
      const wanted = preferredColor.trim().toLowerCase();
      const exact = candidates.find((v) =>
        variantOptionValues(v).some((o) => o && o.trim().toLowerCase() === wanted)
      );
      if (exact) return exact;
    }

    for (let i = 0; i < DEFAULT_COLOR_KEYWORDS.length; i++) {
      const kw = DEFAULT_COLOR_KEYWORDS[i];
      const match = candidates.find((v) =>
        variantOptionValues(v).some((o) => o && o.toLowerCase().includes(kw))
      );
      if (match) return match;
    }
    return candidates[0];
  }

  function findCustomPerSqftVariant(productData, preferredColor) {
    if (!productData || !productData.variants) return null;
    const candidates = productData.variants.filter((v) =>
      variantOptionValues(v).some((o) => o && /per[\s-]*sq/i.test(o))
    );
    if (candidates.length <= 1) return candidates[0] || null;

    if (preferredColor) {
      const wanted = preferredColor.trim().toLowerCase();
      const exact = candidates.find((v) =>
        variantOptionValues(v).some((o) => o && o.trim().toLowerCase() === wanted)
      );
      if (exact) return exact;
    }

    for (let i = 0; i < DEFAULT_COLOR_KEYWORDS.length; i++) {
      const kw = DEFAULT_COLOR_KEYWORDS[i];
      const match = candidates.find((v) =>
        variantOptionValues(v).some((o) => o && o.toLowerCase().includes(kw))
      );
      if (match) return match;
    }
    return candidates[0];
  }

  /** Hide HulkApps / leftover Design Style pickers that conflict with our UI. */
  function hideAppOptions() {
    const labelsToHide = [
      'choose your design style',
      'tile color a',
      'tile color b',
      'tile color c',
      'floor color',
      'border color',
      'design style',
      'pattern',
      'a-center floor color',
      'b-inner border color',
      'c-outer border color',
    ];

    document
      .querySelectorAll(
        '.hulkapps_option, .hulkapps-option, [class*="hulkapps_option"], .product-form__input, .product-form__item, fieldset, .gg-picker-wrap, [id*="hulkapps"]'
      )
      .forEach((container) => {
        if (container.closest('[data-if-cfg-dream]')) return;
        const text = (container.textContent || '').toLowerCase();
        if (!labelsToHide.some((l) => text.includes(l))) return;
        if (container.tagName === 'FORM' || container.tagName === 'BODY') return;
        container.style.display = 'none';
        container.setAttribute('aria-hidden', 'true');
        container.innerHTML = '';
      });
  }

  function watchAndHideAppOptions() {
    hideAppOptions();
    if (window.__ifCfgHideOptsObs) return;
    const observer = new MutationObserver(() => hideAppOptions());
    observer.observe(document.body, { childList: true, subtree: true });
    window.__ifCfgHideOptsObs = observer;
  }

  function buildColors(rawList) {
    if (!Array.isArray(rawList) || !rawList.length) return FALLBACK_COLORS.slice();
    return rawList
      .filter((e) => e && e.name)
      .map((e) => {
        const known =
          FALLBACK_COLORS.find((c) => c.name.toLowerCase() === e.name.toLowerCase()) ||
          FALLBACK_COLORS.find((c) => e.name.toLowerCase().includes(c.name.toLowerCase()));
        let hex = '#9C9E9A';
        if (e.rgb) hex = `rgb(${e.rgb})`;
        else if (known) hex = known.hex;
        return {
          name: e.name,
          hex,
          image: e.image || (known ? known.image : ''),
        };
      });
  }

  let jsPDFLoadPromise = null;

  function loadJsPDFFrom(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        if (window.jspdf && window.jspdf.jsPDF) resolve(window.jspdf.jsPDF);
        else reject(new Error('jsPDF failed to initialize from ' + src));
      };
      script.onerror = () => reject(new Error('Failed to load jsPDF from ' + src));
      document.head.appendChild(script);
    });
  }

  function loadJsPDF() {
    if (window.jspdf && window.jspdf.jsPDF) return Promise.resolve(window.jspdf.jsPDF);
    if (jsPDFLoadPromise) return jsPDFLoadPromise;
    const primary = window.GG_JSPDF_URL || window.IF_CFG_JSPDF_URL;
    const cdnFallback = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js';
    jsPDFLoadPromise = (primary
      ? loadJsPDFFrom(primary)
      : Promise.reject(new Error('No local jsPDF URL'))
    ).catch(() => loadJsPDFFrom(cdnFallback));
    return jsPDFLoadPromise;
  }

  function initRoot(root) {
    const sectionId = root.getAttribute('data-if-cfg-id');
    const productEl = document.getElementById('if-cfg-product-json-' + sectionId);
    const colorsEl = document.getElementById('if-cfg-colors-json-' + sectionId);
    const catalogEl = document.getElementById('if-cfg-catalog-json-' + sectionId);

    let productData = null;
    try {
      if (productEl) productData = JSON.parse(productEl.textContent);
    } catch (e) {}

    let colors = FALLBACK_COLORS.slice();
    try {
      if (colorsEl) colors = buildColors(JSON.parse(colorsEl.textContent));
    } catch (e) {}

    let catalog = {};
    try {
      if (catalogEl) catalog = JSON.parse(catalogEl.textContent) || {};
    } catch (e) {}

    const selectedNameEl = root.querySelector('[data-if-cfg-selected-name]');
    const selectedTileCard = root.querySelector('.if-cfg__tile.is-selected');
    const tileSizeLabel =
      (selectedTileCard && selectedTileCard.getAttribute('data-tile-size')) ||
      root.getAttribute('data-tile-size') ||
      '17" x 17" inch';

    const state = {
      kit: 'custom',
      pattern: 'checkered',
      zoneColors: [],
      activeZone: 0,
      dupWarn: false,
      tileInches: parseTileInches(tileSizeLabel),
      tileSizeLabel: tileSizeLabel,
      width: KIT_DIMS['2car'].width,
      length: KIT_DIMS['2car'].length,
      shape: 'rect',
      cutouts: [],
      projectType: 'Other',
      productHandle:
        (productData && productData.handle) ||
        (selectedTileCard && selectedTileCard.getAttribute('data-product-handle')) ||
        '',
    };

    const preview = root.querySelector('[data-if-cfg-preview]');
    const previewStage = root.querySelector('[data-if-cfg-stage]');
    const sizeGrid = root.querySelector('[data-if-cfg-size-grid]');
    const patGrid = root.querySelector('[data-if-cfg-pat-grid]');
    const patternNameEl = root.querySelector('[data-if-cfg-pattern-name]');
    const zoneChips = root.querySelector('[data-if-cfg-zone-chips]');
    const zoneRows = root.querySelector('[data-if-cfg-zone-rows]');
    const dupWarnEl = root.querySelector('[data-if-cfg-dup-warn]');
    const customPanel = root.querySelector('[data-if-cfg-custom]');
    const projectSelect = root.querySelector('[data-if-cfg-project]');
    const depthInput = root.querySelector('[data-if-cfg-depth]');
    const widthInput = root.querySelector('[data-if-cfg-width]');
    const presetsRow = root.querySelector('[data-if-cfg-presets]');
    const shapeRow = root.querySelector('[data-if-cfg-shape-row]');
    const cutoutsEl = root.querySelector('[data-if-cfg-cutouts]');
    const selList = root.querySelector('[data-if-cfg-sel-list]');
    const propsEl = root.querySelector('[data-if-cfg-properties]');
    const atcForm = root.querySelector('[data-if-cfg-atc-form]');
    const variantInput = root.querySelector('[data-if-cfg-variant-id]');
    const qtyInput = atcForm && atcForm.querySelector('input[name="quantity"]');
    const pdfBtn = root.querySelector('[data-if-cfg-pdf]');
    const shopPayBtn = root.querySelector('[data-if-cfg-shop-pay]');
    const customErrorEl = root.querySelector('[data-if-cfg-custom-error]');
    const CUSTOM_INCOMPLETE_MSG =
      'Please customize your project or select a 2-car garage kit';

    const p0 = PATTERNS.find((x) => x.id === state.pattern);
    state.zoneColors = makeDefaultColors(colors, state.pattern, p0.zones.length);
    state.projectType = (projectSelect && projectSelect.value) || 'Other';

    function colorByName(name) {
      return (
        colors.find((c) => c.name === name) ||
        FALLBACK_COLORS.find((c) => c.name === name) ||
        colors[0] ||
        FALLBACK_COLORS[0]
      );
    }

    function colorsFromAjaxProduct(ajaxProduct) {
      if (!ajaxProduct || !ajaxProduct.options) return [];
      const opts = ajaxProduct.options;
      let colorOpt = null;
      for (let i = 0; i < opts.length; i++) {
        const n = String(opts[i].name || opts[i] || '').toLowerCase();
        if (
          n === 'color' ||
          n === 'colour' ||
          n === 'tile color' ||
          n === 'tile colour' ||
          n.indexOf('color') !== -1
        ) {
          colorOpt = opts[i];
          break;
        }
      }
      if (!colorOpt) return [];
      const values = colorOpt.values || [];
      const pos = (colorOpt.position || 1) - 1;
      return values.map((name) => {
        const val = typeof name === 'string' ? name : name.name || String(name);
        let image = '';
        if (ajaxProduct.variants) {
          const match = ajaxProduct.variants.find((v) => {
            const optsArr = v.options || [v.option1, v.option2, v.option3];
            return optsArr[pos] === val;
          });
          if (match && match.featured_image) {
            image =
              typeof match.featured_image === 'string'
                ? match.featured_image
                : match.featured_image.src || '';
          }
        }
        return { name: val, image: image, rgb: '' };
      });
    }

    function zoneIndexForColorB() {
      const zones = currentPattern().zones || [];
      const named = zones.findIndex((z) => /tile color b/i.test(String(z)));
      if (named !== -1) return named;
      return zones.length > 1 ? 1 : 0;
    }

    function applyZoneColorB(colorName) {
      if (!colorName) return;
      const p = currentPattern();
      const zi = zoneIndexForColorB();
      const resolved = resolveColorName(colors, colorName) || colorName;
      if (p.noDuplicate) {
        const clash = state.zoneColors.findIndex((n, i) => i !== zi && n === resolved);
        if (clash !== -1) {
          const used = new Set(state.zoneColors);
          used.delete(state.zoneColors[clash]);
          used.add(resolved);
          const other = pickDefaultColorName(colors, used);
          if (other) state.zoneColors[clash] = other;
        }
      }
      state.zoneColors[zi] = resolved;
      state.activeZone = zi;
      state.dupWarn = false;
    }

    function updateTileCardImage(card, imageUrl) {
      if (!card || !imageUrl) return;
      const wrap = card.querySelector('.if-cfg__tile-img');
      if (!wrap) return;
      let img = wrap.querySelector('img');
      if (!img) {
        const placeholder = wrap.querySelector('.placeholder-svg');
        if (placeholder) placeholder.remove();
        img = document.createElement('img');
        img.alt = card.getAttribute('data-product-title') || '';
        img.loading = 'lazy';
        wrap.appendChild(img);
      }
      img.src = imageUrl;
      img.removeAttribute('srcset');
      img.removeAttribute('sizes');
    }

    function applyProductEntry(entry, opts) {
      if (!entry || !entry.product) return false;
      productData = entry.product;
      if (!productData.handle && entry.handle) productData.handle = entry.handle;
      if (!productData.title && entry.title) productData.title = entry.title;
      if (entry.tags) productData.tags = entry.tags;

      const nextColors = buildColors(entry.colors && entry.colors.length ? entry.colors : []);
      colors = nextColors.length ? nextColors : FALLBACK_COLORS.slice();

      const tileSize =
        entry.tileSize ||
        (opts && opts.tileSize) ||
        state.tileSizeLabel ||
        '12" x 12" inch';
      state.tileSizeLabel = tileSize;
      state.tileInches = parseTileInches(tileSize);
      state.productHandle = entry.handle || productData.handle || '';
      state.dupWarn = false;
      state.activeZone = 0;
      state.zoneColors = makeDefaultColors(colors, state.pattern, currentPattern().zones.length);
      if (opts && opts.zoneColorB) {
        applyZoneColorB(opts.zoneColorB);
      }

      root.setAttribute('data-tile-size', tileSize);
      if (selectedNameEl) {
        selectedNameEl.textContent = entry.title || productData.title || '';
      }

      root.querySelectorAll('[data-if-cfg-tile]').forEach((card) => {
        const on =
          card.getAttribute('data-product-handle') === state.productHandle ||
          String(card.getAttribute('data-product-id')) === String(productData.id);
        card.classList.toggle('is-selected', on);
        card.setAttribute('aria-pressed', on ? 'true' : 'false');
      });

      updateBuyMode();
      syncCartFields();
      renderAll();
      root._ifCfgProduct = productData;
      root._ifCfgColors = colors;

      if (opts && opts.pushUrl && entry.url) {
        try {
          window.history.replaceState({ ifCfgProduct: entry.handle }, '', entry.url);
        } catch (e) {}
      }

      document.dispatchEvent(
        new CustomEvent('if:product-change', {
          detail: {
            handle: state.productHandle,
            id: productData.id,
            title: productData.title,
            tileSize: state.tileSizeLabel,
          },
        })
      );
      return true;
    }

    async function switchProduct(handle, opts) {
      if (!handle) return;
      if (handle === state.productHandle && !(opts && opts.force)) {
        if (opts && opts.zoneColorB) {
          applyZoneColorB(opts.zoneColorB);
          renderAll();
        }
        return;
      }

      const fromCatalog = catalog[handle];
      if (fromCatalog) {
        applyProductEntry(fromCatalog, opts);
        return;
      }

      /* Fallback: Shopify Ajax product API */
      try {
        const res = await fetch('/products/' + encodeURIComponent(handle) + '.js');
        if (!res.ok) throw new Error('Product fetch failed');
        const ajaxProduct = await res.json();
        const entry = {
          id: ajaxProduct.id,
          handle: ajaxProduct.handle,
          title: ajaxProduct.title,
          url: '/products/' + ajaxProduct.handle,
          tileSize:
            (opts && opts.tileSize) ||
            state.tileSizeLabel ||
            '12" x 12" inch',
          tags: ajaxProduct.tags || [],
          product: ajaxProduct,
          colors: colorsFromAjaxProduct(ajaxProduct),
        };
        catalog[handle] = entry;
        applyProductEntry(entry, opts);
      } catch (err) {
        console.error('IF configurator: failed to switch product', handle, err);
      }
    }

    function waitForSwiper(cb) {
      if (typeof window.Swiper === 'function') {
        cb();
        return;
      }
      let tries = 0;
      const timer = setInterval(() => {
        tries += 1;
        if (typeof window.Swiper === 'function') {
          clearInterval(timer);
          cb();
        } else if (tries > 80) {
          clearInterval(timer);
        }
      }, 50);
    }

    function syncTilesNav(swiper, prevBtn, nextBtn) {
      if (!prevBtn || !nextBtn) return;
      const atStart = swiper.isBeginning;
      const atEnd = swiper.isEnd;
      prevBtn.disabled = atStart;
      nextBtn.disabled = atEnd;
      prevBtn.setAttribute('aria-disabled', atStart ? 'true' : 'false');
      nextBtn.setAttribute('aria-disabled', atEnd ? 'true' : 'false');
    }

    function bindTiles() {
      const tilesRail = root.querySelector('[data-if-cfg-tiles-rail]');
      const prevBtn = root.querySelector('[data-if-cfg-tiles-prev]');
      const nextBtn = root.querySelector('[data-if-cfg-tiles-next]');
      const tilesNav = root.querySelector('[data-if-cfg-tiles-nav]');

      root.querySelectorAll('[data-if-cfg-tile]').forEach((card) => {
        card.addEventListener('click', (e) => {
          e.preventDefault();
          const handle = card.getAttribute('data-product-handle');
          if (!handle) return;
          switchProduct(handle, {
            pushUrl: true,
            tileSize: card.getAttribute('data-tile-size') || '',
            force: true,
          });
        });
      });

      root.querySelectorAll('.if-cfg__tile-swatches').forEach((row) => {
        let startX = 0;
        let startScroll = 0;
        let dragged = false;

        row.addEventListener('pointerdown', (e) => {
          e.stopPropagation();
          startX = e.clientX;
          startScroll = row.scrollLeft;
          dragged = false;
        });
        row.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });
        row.addEventListener('mousedown', (e) => e.stopPropagation());
        row.addEventListener('pointermove', () => {
          if (Math.abs(row.scrollLeft - startScroll) > 4) dragged = true;
        });
        row.addEventListener('click', (e) => {
          if (dragged || Math.abs(e.clientX - startX) > 6) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }
          const sw = e.target.closest('[data-if-cfg-swatch]');
          if (!sw || !row.contains(sw)) return;
          e.preventDefault();
          e.stopPropagation();

          const card = row.closest('[data-if-cfg-tile]');
          if (!card) return;
          const handle = card.getAttribute('data-product-handle');
          const colorName = sw.getAttribute('data-color-name') || '';
          const imageUrl = sw.getAttribute('data-image') || '';

          updateTileCardImage(card, imageUrl);
          card.querySelectorAll('[data-if-cfg-swatch]').forEach((el) => {
            el.classList.toggle('is-selected', el === sw);
          });

          if (!handle) {
            applyZoneColorB(colorName);
            renderAll();
            return;
          }
          switchProduct(handle, {
            pushUrl: true,
            tileSize: card.getAttribute('data-tile-size') || '',
            zoneColorB: colorName,
          });
        });
        row.addEventListener('keydown', (e) => {
          if (e.key !== 'Enter' && e.key !== ' ') return;
          const sw = e.target.closest('[data-if-cfg-swatch]');
          if (!sw || !row.contains(sw)) return;
          e.preventDefault();
          sw.click();
        });
        row.addEventListener(
          'wheel',
          (e) => {
            if (row.scrollWidth <= row.clientWidth + 1) return;
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
              row.scrollLeft += e.deltaY;
              e.preventDefault();
            }
            e.stopPropagation();
          },
          { passive: false }
        );
      });

      if (!tilesRail || !tilesRail.querySelector('.swiper-slide')) return;

      waitForSwiper(() => {
        if (root._ifTilesSwiper) {
          try {
            root._ifTilesSwiper.destroy(true, true);
          } catch (err) {
            /* ignore */
          }
        }

        const swiper = new window.Swiper(tilesRail, {
          slidesPerView: 1.35,
          spaceBetween: 12,
          speed: 420,
          watchOverflow: true,
          observer: true,
          observeParents: true,
          breakpoints: {
            480: { slidesPerView: 1.6, spaceBetween: 12 },
            750: { slidesPerView: 3, spaceBetween: 14 },
            1200: { slidesPerView: 5, spaceBetween: 14 },
          },
          on: {
            init() {
              syncTilesNav(this, prevBtn, nextBtn);
              if (tilesNav) {
                tilesNav.hidden = this.isLocked;
              }
            },
            slideChange() {
              syncTilesNav(this, prevBtn, nextBtn);
            },
            resize() {
              syncTilesNav(this, prevBtn, nextBtn);
              if (tilesNav) {
                tilesNav.hidden = this.isLocked;
              }
            },
            reachBeginning() {
              syncTilesNav(this, prevBtn, nextBtn);
            },
            reachEnd() {
              syncTilesNav(this, prevBtn, nextBtn);
            },
          },
        });

        root._ifTilesSwiper = swiper;

        if (prevBtn) {
          prevBtn.addEventListener('click', () => swiper.slidePrev());
        }
        if (nextBtn) {
          nextBtn.addEventListener('click', () => swiper.slideNext());
        }
      });
    }

    function currentPattern() {
      return PATTERNS.find((x) => x.id === state.pattern) || PATTERNS[0];
    }

    function currentTileCounts() {
      return tileCounts(state.width, state.length, state.tileInches);
    }

    /** Tile qty per zone from live pattern + shape (L-shape cut-outs excluded). */
    function countZoneTiles() {
      const p = currentPattern();
      const tc = currentTileCounts();
      const cols = Math.max(0, tc.across);
      const rows = Math.max(0, tc.down);
      const activeCutouts =
        state.kit === 'custom' && state.shape === 'lshape' ? state.cutouts : [];
      const gridCounts = new Array(p.zones.length).fill(0);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (isCutoutCell(c, r, cols, rows, activeCutouts, tc.tileFt)) continue;
          const zi = Math.min(getZoneIndex(p.id, c, r, cols, rows), p.zones.length - 1);
          gridCounts[zi]++;
        }
      }

      const targetTotal = tilesFromSqft(netSqft(), state.tileInches);
      const counts = scaleZoneCounts(gridCounts, targetTotal);
      const total = counts.reduce((sum, n) => sum + n, 0);

      return { counts: counts, total: total, across: cols, down: rows };
    }

    function cutoutSqft() {
      if (state.kit !== 'custom' || state.shape !== 'lshape') return 0;
      return state.cutouts.reduce(
        (sum, c) => sum + (c.width && c.depth ? c.width * c.depth : 0),
        0
      );
    }

    function netSqft() {
      const gross = (state.width || 0) * (state.length || 0);
      return Math.max(0, gross - cutoutSqft());
    }

    function sizeLabel() {
      if (state.kit === 'custom') {
        if (state.width && state.length) {
          return `Custom ${state.width}×${state.length} ft`;
        }
        return KIT_LABELS.custom;
      }
      const card =
        sizeGrid &&
        sizeGrid.querySelector(`.if-cfg__size-card[data-kit="${state.kit}"] .if-cfg__size-name`);
      const name = card && card.textContent.trim();
      return name || KIT_LABELS[state.kit] || state.kit;
    }

    function formatTileSize() {
      const n = state.tileInches;
      return `${n}" × ${n}"`;
    }

    function escapeHtml(str) {
      return String(str == null ? '' : str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    function renderSummary() {
      if (!selList) return;
      const p = currentPattern();
      const net = Math.round(netSqft());
      const zoneTiles = countZoneTiles();
      const project =
        state.kit === 'custom'
          ? state.projectType || 'Other'
          : KIT_LABELS[state.kit] || '—';

      let html = `
        <div class="if-cfg__sel-item">
          <span class="if-cfg__sel-l">Size</span>
          <span class="if-cfg__sel-v">${escapeHtml(sizeLabel())}</span>
        </div>
        <div class="if-cfg__sel-item">
          <span class="if-cfg__sel-l">Project</span>
          <span class="if-cfg__sel-v">${escapeHtml(project)}</span>
        </div>
        <div class="if-cfg__sel-item">
          <span class="if-cfg__sel-l">Total Sq Ft</span>
          <span class="if-cfg__sel-v">${net > 0 ? `${net} sq ft` : '—'}</span>
        </div>
        <div class="if-cfg__sel-item">
          <span class="if-cfg__sel-l">Collection</span>
          <span class="if-cfg__sel-v">${escapeHtml((productData && productData.title) || '')}</span>
        </div>
        <div class="if-cfg__sel-item">
          <span class="if-cfg__sel-l">Tile Size</span>
          <span class="if-cfg__sel-v">${escapeHtml(formatTileSize())}</span>
        </div>
        <div class="if-cfg__sel-item">
          <span class="if-cfg__sel-l">Pattern</span>
          <span class="if-cfg__sel-v">${escapeHtml(p.name)}</span>
        </div>
      `;

      p.zones.forEach((_, zi) => {
        const col = colorByName(state.zoneColors[zi]);
        const qty = zoneTiles.counts[zi] || 0;
        html += `
          <div class="if-cfg__sel-item if-cfg__sel-item--color">
            <span class="if-cfg__sel-color">
              <span class="if-cfg__sel-dot" style="background:${col.hex}"></span>
              <span class="if-cfg__sel-color-name">${escapeHtml(col.name)}</span>
              <span class="if-cfg__sel-color-tag">${escapeHtml(zoneLetterLabel(zi))}</span>
            </span>
            <span class="if-cfg__sel-qty">${qty}</span>
          </div>
        `;
      });

      html += `
        <div class="if-cfg__sel-item if-cfg__sel-item--total">
          <span class="if-cfg__sel-l">Total tiles</span>
          <span class="if-cfg__sel-qty if-cfg__sel-qty--total">${zoneTiles.total}</span>
        </div>
      `;

      selList.innerHTML = html;
      syncCartFields();
    }

    function preferredColorName() {
      return colorByName(state.zoneColors[0]).name;
    }

    function variantPriceCents(variant) {
      if (!variant) return 0;
      const p = variant.price;
      return typeof p === 'number' ? p : Math.round(parseFloat(p) * 100);
    }

    function formatMoneyCents(cents) {
      if (!isFinite(cents) || cents <= 0) return '';
      try {
        return (cents / 100).toLocaleString('en-US', {
          style: 'currency',
          currency: (window.Shopify && Shopify.currency && Shopify.currency.active) || 'USD',
          maximumFractionDigits: 0,
        });
      } catch (e) {
        return '$' + Math.round(cents / 100);
      }
    }

    function getKitPrices() {
      let p2 = variantPriceCents(findKitVariant(productData, '2car'));
      let p3 = variantPriceCents(findKitVariant(productData, '3car'));
      if (!p2 && productData && productData.price) {
        p2 =
          typeof productData.price === 'number'
            ? productData.price
            : Math.round(parseFloat(productData.price) * 100);
      }
      if (!p3 && p2) p3 = Math.round(p2 * (KIT_SQFT['3car'] / KIT_SQFT['2car']));
      if (!p2 && p3) p2 = Math.round(p3 * (KIT_SQFT['2car'] / KIT_SQFT['3car']));
      return { '2car': p2, '3car': p3 };
    }

    function customPerSqftRateCents() {
      if (!productData || !productData.title) return null;
      const t = productData.title.toLowerCase();
      if (t.includes('swisstrax')) return 463; // $4.63/sqft
      if (t.includes('grid garage') || t.includes('gridgarage')) return 425; // $4.25/sqft
      return null;
    }

    /** Custom Design My Space total in cents = net sq ft × rate (old configurator). */
    function calculateCustomSpacePrice(net) {
      if (!net || net <= 0) return null;
      const fixedRate = customPerSqftRateCents();
      if (fixedRate) return Math.round(net * fixedRate);
      const prices = getKitPrices();
      if (prices['3car']) return Math.round(net * (prices['3car'] / KIT_SQFT['3car']));
      if (prices['2car']) return Math.round(net * (prices['2car'] / KIT_SQFT['2car']));
      return null;
    }

    function resolveCartVariant() {
      const preferred = preferredColorName();
      if (state.kit === 'custom') {
        return (
          findCustomPerSqftVariant(productData, preferred) ||
          findKitVariant(productData, '2car', preferred) ||
          (productData && productData.variants && productData.variants[0]) ||
          null
        );
      }
      return (
        findKitVariant(productData, state.kit, preferred) ||
        (productData && productData.variants && productData.variants[0]) ||
        null
      );
    }

    /** Display price for UI — custom uses sqft estimate, kits use variant. */
    function getDisplayPriceText() {
      if (state.kit === 'custom') {
        const net = Math.round(netSqft());
        if (net <= 0) return '';
        const calc = calculateCustomSpacePrice(net);
        if (calc) return formatMoneyCents(calc);
        const variant = resolveCartVariant();
        if (!variant) return '';
        const unit = variantPriceCents(variant);
        const usingPerSqft = variantOptionValues(variant).some(
          (o) => o && /per[\s-]*sq/i.test(o)
        );
        return formatMoneyCents(usingPerSqft ? unit * net : unit);
      }
      return formatMoneyCents(variantPriceCents(resolveCartVariant()));
    }

    function isPriceByConsultation() {
      const tags =
        (productData && productData.tags) ||
        (catalog[state.productHandle] && catalog[state.productHandle].tags) ||
        [];
      if (!Array.isArray(tags)) return false;
      return tags.some((t) =>
        String(t).toLowerCase().includes('price by consultation')
      );
    }

    /** Toggle ATC vs Request a Quote (matches old "price by consultation" products). */
    function updateBuyMode() {
      const isQuote = isPriceByConsultation();
      const quoteEl = root.querySelector('[data-if-cfg-buy-quote]');
      const cartEl = root.querySelector('[data-if-cfg-buy-cart]');
      if (quoteEl) quoteEl.hidden = !isQuote;
      if (cartEl) cartEl.hidden = isQuote;
      root.classList.toggle('is-consultation', isQuote);
      root.setAttribute('data-consultation', isQuote ? 'true' : 'false');
    }

    function sharedCartProperties() {
      const p = currentPattern();
      const rows = [['Pattern', p.name]];
      if (state.kit === 'custom') {
        const net = Math.round(netSqft());
        rows.push(['Project Type', state.projectType || 'Other']);
        if (state.width && state.length) {
          rows.push(['Floor Size', `${state.width}ft × ${state.length}ft`]);
        }
        rows.push([
          'Floor Shape',
          state.shape === 'lshape' ? 'L-shape (cut-out)' : 'Rectangle',
        ]);
        if (net > 0) rows.push(['Net Area', `${net} sq ft`]);
      }
      return rows;
    }

    /** One cart line per color, quantity = tile count for that color. */
    function buildCartItems() {
      const p = currentPattern();
      const zoneTiles = countZoneTiles();
      const byColor = {};

      p.zones.forEach((zName, zi) => {
        const qty = zoneTiles.counts[zi] || 0;
        if (qty <= 0) return;
        const col = colorByName(state.zoneColors[zi]);
        const key = col.name;
        if (!byColor[key]) {
          byColor[key] = { name: col.name, quantity: 0, roles: [] };
        }
        byColor[key].quantity += qty;
        byColor[key].roles.push(zoneLetterLabel(zi));
      });

      const items = [];
      Object.keys(byColor).forEach((name) => {
        const entry = byColor[name];
        const variant =
          findColorTileVariant(productData, name) ||
          findCustomPerSqftVariant(productData, name) ||
          null;
        if (!variant || !variant.id || entry.quantity <= 0) return;

        /* Variant option (Color: White / Color: Black) is enough — no extra props. */
        items.push({
          id: variant.id,
          quantity: entry.quantity,
        });
      });
      return items;
    }

    function addConfiguredItemsToCart(opts) {
      const options = opts || {};
      const redirectTo = options.redirect || '/cart';
      const items = buildCartItems();
      if (!items.length) {
        return Promise.reject(new Error('No tile items to add'));
      }

      return fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ items: items }),
      }).then((res) => {
        if (!res.ok) throw new Error('Cart add failed');
        return res.json();
      }).then((data) => {
        if (redirectTo) window.location.href = redirectTo;
        return data;
      });
    }

    function syncCartFields() {
      syncLineItemProperties();
      syncVariantId();
    }

    /** Temporarily skip custom line-item props; cart shows selected variant Color. */
    function syncLineItemProperties() {
      if (propsEl) propsEl.innerHTML = '';

      /* Remove foreign HulkApps / Design Style fields that get injected into our form */
      if (atcForm) {
        Array.from(atcForm.querySelectorAll('input, select, textarea')).forEach((el) => {
          if (propsEl && propsEl.contains(el)) return;
          if (el === variantInput) return;
          const name = (el.getAttribute('name') || '').toLowerCase();
          if (
            name.includes('design style') ||
            name.includes('tile color') ||
            name.includes('hulkapps') ||
            (name.startsWith('properties[') && !(propsEl && propsEl.contains(el)))
          ) {
            el.remove();
          }
        });
      }
    }

    function syncVariantId() {
      const items = buildCartItems();
      const first = items[0];
      if (variantInput) variantInput.value = first ? first.id : '';
      if (qtyInput) qtyInput.value = first ? String(first.quantity) : '1';
    }

    function buildSelectionsText() {
      const p = currentPattern();
      const lines = [
        `Size: ${sizeLabel()}`,
        `Collection: ${(productData && productData.title) || ''}`,
        `Tile Size: ${formatTileSize()}`,
        `Pattern: ${p.name}`,
      ];
      p.zones.forEach((zName, zi) => {
        lines.push(`${zName}: ${colorByName(state.zoneColors[zi]).name}`);
      });
      if (state.kit === 'custom') {
        lines.push(`Project Type: ${state.projectType || 'Other'}`);
        if (state.width && state.length) {
          lines.push(`Floor Size: ${state.width}ft × ${state.length}ft`);
        }
        lines.push(
          `Floor Shape: ${state.shape === 'lshape' ? 'L-shape (cut-out)' : 'Rectangle'}`
        );
        const net = Math.round(netSqft());
        if (net > 0) lines.push(`Net Area: ${net} sq ft`);
      }
      return lines.join('\n');
    }

    function formatMoneyFromVariant(variant) {
      return formatMoneyCents(variantPriceCents(variant));
    }

    /** Draw live floor preview onto canvas (same layout as on-page grid). */
    function rasterizeDesignCanvas() {
      return new Promise((resolve, reject) => {
        try {
          const p = currentPattern();
          const tc = currentTileCounts();
          const cols = Math.max(1, Math.min(tc.across, 40));
          const rows = Math.max(1, Math.min(tc.down, 40));
          const activeCutouts =
            state.kit === 'custom' && state.shape === 'lshape' ? state.cutouts : [];
          const cell = 15;
          const scale = 3;
          const canvas = document.createElement('canvas');
          canvas.width = cols * cell * scale;
          canvas.height = rows * cell * scale;
          const ctx = canvas.getContext('2d');
          ctx.scale(scale, scale);
          ctx.fillStyle = '#0E0F11';
          ctx.fillRect(0, 0, cols * cell, rows * cell);

          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              if (isCutoutCell(c, r, cols, rows, activeCutouts, tc.tileFt)) continue;
              const zi = Math.min(
                getZoneIndex(p.id, c, r, cols, rows),
                p.zones.length - 1
              );
              const col = colorByName(state.zoneColors[zi]);
              ctx.fillStyle = col.hex || '#9C9E9A';
              ctx.fillRect(c * cell, r * cell, cell, cell);
              ctx.strokeStyle = 'rgba(255,255,255,0.10)';
              ctx.lineWidth = 0.5;
              ctx.strokeRect(c * cell + 0.25, r * cell + 0.25, cell - 0.5, cell - 0.5);
            }
          }
          resolve(canvas);
        } catch (err) {
          reject(err);
        }
      });
    }

    function downloadDesignImage(filename) {
      return rasterizeDesignCanvas()
        .then(
          (canvas) =>
            new Promise((resolve) => {
              canvas.toBlob((blob) => {
                if (!blob) {
                  resolve(false);
                  return;
                }
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                a.remove();
                setTimeout(() => URL.revokeObjectURL(url), 4000);
                resolve(true);
              }, 'image/png');
            })
        )
        .catch(() => false);
    }

    function showPdfToast(message) {
      let toast = root.querySelector('[data-if-cfg-toast]');
      if (!toast) {
        toast = document.createElement('div');
        toast.className = 'if-cfg__toast';
        toast.setAttribute('data-if-cfg-toast', '');
        root.appendChild(toast);
      }
      toast.textContent = message;
      toast.classList.add('is-visible');
      clearTimeout(toast._timer);
      toast._timer = setTimeout(() => toast.classList.remove('is-visible'), 5000);
    }

    async function handleDownloadDesign(e) {
      if (e) e.preventDefault();
      const p = currentPattern();
      const filenameSlug =
        ((productData && productData.title) || 'gridgarage') + '-' + p.name;
      const cleanSlug = filenameSlug
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      if (pdfBtn) {
        pdfBtn.disabled = true;
        pdfBtn.setAttribute('aria-busy', 'true');
      }

      try {
        const [canvas, JsPDF] = await Promise.all([
          rasterizeDesignCanvas(),
          loadJsPDF(),
        ]);
        const imgData = canvas.toDataURL('image/png');
        const doc = new JsPDF({ unit: 'pt', format: 'letter' });
        const pageW = doc.internal.pageSize.getWidth();
        const pageH = doc.internal.pageSize.getHeight();
        const margin = 48;
        let y = margin;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.setTextColor(20);
        doc.text('GridGarage — Design Summary', margin, y);
        y += 20;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(120);
        doc.text((productData && productData.title) || '', margin, y);
        doc.text(new Date().toLocaleDateString(), pageW - margin, y, {
          align: 'right',
        });
        y += 22;

        const imgW = pageW - margin * 2;
        const imgH = imgW * (canvas.height / canvas.width);
        const maxImgH = pageH * 0.45;
        const drawH = Math.min(imgH, maxImgH);
        const drawW = drawH * (canvas.width / canvas.height);
        doc.addImage(imgData, 'PNG', margin, y, drawW, drawH);
        y += drawH + 26;

        doc.setDrawColor(224, 224, 224);
        doc.line(margin, y, pageW - margin, y);
        y += 24;

        /* Specs (left) + Contact Us (right) */
        const supportPhone =
          root.getAttribute('data-support-phone') || '(888) 898-8022';
        const supportEmail =
          root.getAttribute('data-support-email') || 'info@gridgarageinc.com';
        const accentRgb = [220, 28, 27];
        const specColW = 292;
        const colGap = 28;
        const contactX = margin + specColW + colGap;
        const contactMaxW = pageW - margin - contactX;
        const specValueX = margin + 118;

        if (y > pageH - margin - 80) {
          doc.addPage();
          y = margin;
        }
        const headingY = y;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(20);
        doc.text('Specifications', margin, y);
        doc.text('Contact Us', contactX, y);
        y += 20;

        function drawPhoneIcon(docRef, x, yBase) {
          docRef.setDrawColor(accentRgb[0], accentRgb[1], accentRgb[2]);
          docRef.setLineWidth(1.15);
          docRef.setLineCap('round');
          docRef.setLineJoin('round');
          docRef.roundedRect(x + 3.5, yBase - 9, 6.5, 11, 1.4, 1.4, 'S');
          docRef.line(x + 5.2, yBase + 0.6, x + 8.3, yBase + 0.6);
          docRef.line(x + 11.5, yBase - 7, x + 13.5, yBase - 9);
          docRef.line(x + 11.5, yBase - 4.5, x + 14, yBase - 7);
        }

        function drawMailIcon(docRef, x, yBase) {
          docRef.setDrawColor(accentRgb[0], accentRgb[1], accentRgb[2]);
          docRef.setLineWidth(1.15);
          docRef.setLineCap('round');
          docRef.setLineJoin('round');
          docRef.roundedRect(x, yBase - 8, 13, 10, 1.2, 1.2, 'S');
          docRef.line(x, yBase - 8, x + 6.5, yBase - 2.5);
          docRef.line(x + 13, yBase - 8, x + 6.5, yBase - 2.5);
        }

        let ySpec = y;
        doc.setFontSize(11);
        buildSelectionsText()
          .split('\n')
          .forEach((line) => {
            if (!line) return;
            if (ySpec > pageH - margin) {
              doc.addPage();
              ySpec = margin;
            }
            const sep = line.indexOf(':');
            const label = sep === -1 ? line : line.slice(0, sep + 1);
            const value = sep === -1 ? '' : line.slice(sep + 1).trim();
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(20);
            doc.text(label, margin, ySpec);
            doc.setFont('helvetica', 'normal');
            const valueLines = doc.splitTextToSize(value, specColW - (specValueX - margin));
            doc.text(valueLines, specValueX, ySpec);
            ySpec += 18 * Math.max(1, valueLines.length);
          });

        let yContact = y;
        const iconPad = 20;
        const textW = Math.max(80, contactMaxW - iconPad);

        if (supportPhone) {
          drawPhoneIcon(doc, contactX, yContact);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.setTextColor(accentRgb[0], accentRgb[1], accentRgb[2]);
          const phoneLines = doc.splitTextToSize(supportPhone, textW);
          doc.text(phoneLines, contactX + iconPad, yContact);
          yContact += 18 * Math.max(1, phoneLines.length) + 4;
        }

        if (supportEmail) {
          drawMailIcon(doc, contactX, yContact);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.setTextColor(accentRgb[0], accentRgb[1], accentRgb[2]);
          const emailLines = doc.splitTextToSize(supportEmail, textW);
          doc.text(emailLines, contactX + iconPad, yContact);
          yContact += 18 * Math.max(1, emailLines.length);
        }

        const ruleX = margin + specColW + colGap / 2;
        const ruleTop = headingY - 4;
        const ruleBottom = Math.max(ySpec, yContact);
        doc.setDrawColor(224, 224, 224);
        doc.setLineWidth(0.8);
        doc.line(ruleX, ruleTop, ruleX, ruleBottom);

        y = Math.max(ySpec, yContact);

        doc.save(`gridgarage-design-summary-${cleanSlug}.pdf`);
        showPdfToast('Design summary PDF downloaded!');
      } catch (err) {
        console.error('IF configurator PDF:', err);
        const downloaded = await downloadDesignImage(
          `gridgarage-design-${cleanSlug}.png`
        );
        if (downloaded) {
          showPdfToast('PDF unavailable — downloaded design image instead.');
        } else {
          showPdfToast('Failed to generate design summary. Please try again.');
        }
      } finally {
        if (pdfBtn) {
          pdfBtn.disabled = false;
          pdfBtn.removeAttribute('aria-busy');
        }
      }
    }

    function newCutout(corner) {
      return {
        id: 'co-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        corner: corner || 'br',
        width: 5,
        depth: 2,
      };
    }

    function ensureCutouts() {
      if (state.shape === 'lshape' && state.cutouts.length === 0) {
        state.cutouts.push(newCutout('br'));
      }
    }

    function setShape(shape) {
      state.shape = shape === 'lshape' ? 'lshape' : 'rect';
      ensureCutouts();
      syncShapeButtons();
      renderCutouts();
      renderPreview();
      renderSummary();
    }

    function addCutout() {
      const used = state.cutouts.map((c) => c.corner);
      const nextCorner =
        CUTOUT_CORNERS.find((c) => used.indexOf(c.id) === -1) || CUTOUT_CORNERS[0];
      state.cutouts.push(newCutout(nextCorner.id));
      renderCutouts();
      renderPreview();
      renderSummary();
    }

    function removeCutout(id) {
      if (state.cutouts.length <= 1) return;
      state.cutouts = state.cutouts.filter((c) => c.id !== id);
      renderCutouts();
      renderPreview();
      renderSummary();
    }

    function updateCutout(id, patch, opts) {
      const c = state.cutouts.find((x) => x.id === id);
      if (!c) return;
      Object.assign(c, patch);
      if (opts && opts.rebuild) renderCutouts();
      renderPreview();
      renderSummary();
    }

    function renderCutouts() {
      if (!cutoutsEl) return;
      if (state.shape !== 'lshape') {
        cutoutsEl.hidden = true;
        cutoutsEl.innerHTML = '';
        return;
      }

      ensureCutouts();
      cutoutsEl.hidden = false;
      cutoutsEl.innerHTML = '';

      state.cutouts.forEach((c, i) => {
        const card = document.createElement('div');
        card.className = 'if-cfg__cutout';
        card.dataset.cutoutId = c.id;

        const head = document.createElement('div');
        head.className = 'if-cfg__cutout-head';
        head.innerHTML = `<span class="if-cfg__cutout-title">Cut-out ${i + 1}</span>`;
        if (state.cutouts.length > 1) {
          const removeBtn = document.createElement('button');
          removeBtn.type = 'button';
          removeBtn.className = 'if-cfg__cutout-remove';
          removeBtn.setAttribute('aria-label', `Remove cut-out ${i + 1}`);
          removeBtn.innerHTML =
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>';
          removeBtn.addEventListener('click', () => removeCutout(c.id));
          head.appendChild(removeBtn);
        }
        card.appendChild(head);

        const body = document.createElement('div');
        body.className = 'if-cfg__cutout-body';

        const picker = document.createElement('div');
        picker.className = 'if-cfg__corner-picker';
        picker.setAttribute('role', 'radiogroup');
        picker.setAttribute('aria-label', `Cut-out ${i + 1} corner`);
        CUTOUT_CORNERS.forEach((corner) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.setAttribute('role', 'radio');
          const on = c.corner === corner.id;
          btn.setAttribute('aria-checked', on ? 'true' : 'false');
          btn.className = 'if-cfg__corner' + (on ? ' is-selected' : '');
          btn.title = corner.title;
          btn.setAttribute('aria-label', corner.title);
          btn.addEventListener('click', () => updateCutout(c.id, { corner: corner.id }, { rebuild: true }));
          picker.appendChild(btn);
        });
        body.appendChild(picker);

        const makeDim = (label, key, value) => {
          const wrap = document.createElement('div');
          wrap.className = 'if-cfg__cut-dim';
          const lab = document.createElement('label');
          lab.className = 'if-cfg__custom-label';
          lab.textContent = label;
          const inputWrap = document.createElement('div');
          inputWrap.className = 'if-cfg__dim-input';
          inputWrap.innerHTML =
            `<span class="if-cfg__dim-icon">${cutDimIcon(key, c.id + '-' + i)}</span>`;
          const input = document.createElement('input');
          input.type = 'number';
          input.inputMode = 'decimal';
          input.min = '0';
          input.step = '0.5';
          input.placeholder = '0';
          input.value = value != null ? String(value) : '';
          input.addEventListener('input', () => {
            const n = parseFloat(input.value);
            updateCutout(c.id, { [key]: isFinite(n) && n > 0 ? n : null });
          });
          inputWrap.appendChild(input);
          wrap.appendChild(lab);
          wrap.appendChild(inputWrap);
          return wrap;
        };

        body.appendChild(makeDim('Cut width (ft)', 'width', c.width));
        body.appendChild(makeDim('Cut depth (ft)', 'depth', c.depth));
        card.appendChild(body);
        cutoutsEl.appendChild(card);
      });

      const addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.className = 'if-cfg__cutout-add';
      addBtn.textContent = '+ ADD ANOTHER CUTOUT';
      addBtn.addEventListener('click', addCutout);
      cutoutsEl.appendChild(addBtn);

      const help = document.createElement('p');
      help.className = 'if-cfg__cutout-help';
      help.textContent =
        'Bottom = garage-door side. Each cut-out is labeled on the grid below with its size.';
      cutoutsEl.appendChild(help);
    }

    function applyKitDims(kit) {
      if (kit === 'custom') {
        const w = widthInput ? parseFloat(widthInput.value) : NaN;
        const d = depthInput ? parseFloat(depthInput.value) : NaN;
        state.width = isFinite(w) && w > 0 ? w : null;
        state.length = isFinite(d) && d > 0 ? d : null;
        return;
      }
      const dims = KIT_DIMS[kit] || KIT_DIMS['2car'];
      state.width = dims.width;
      state.length = dims.length;
    }

    function syncCustomPanel(kit) {
      if (!customPanel) return;
      const show = kit === 'custom';
      customPanel.hidden = !show;
      if (show) {
        syncPresetButtons();
        syncShapeButtons();
        renderCutouts();
      }
    }

    function syncPresetButtons() {
      if (!presetsRow) return;
      presetsRow.querySelectorAll('.if-cfg__preset').forEach((btn) => {
        const w = parseFloat(btn.getAttribute('data-w'));
        const d = parseFloat(btn.getAttribute('data-d'));
        const on = state.width === w && state.length === d;
        btn.classList.toggle('is-selected', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }

    function syncShapeButtons() {
      if (!shapeRow) return;
      shapeRow.querySelectorAll('.if-cfg__shape-btn').forEach((btn) => {
        const on = btn.getAttribute('data-shape') === state.shape;
        btn.classList.toggle('is-selected', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      if (cutoutsEl) cutoutsEl.hidden = state.shape !== 'lshape';
    }

    function setCustomDims(width, depth) {
      state.width = width;
      state.length = depth;
      if (widthInput) widthInput.value = String(width);
      if (depthInput) depthInput.value = String(depth);
      clearCustomError();
      syncPresetButtons();
      renderPreview();
      renderSummary();
    }

    function isCustomConfigured() {
      if (state.kit !== 'custom') return true;
      const w = widthInput ? parseFloat(widthInput.value) : state.width;
      const d = depthInput ? parseFloat(depthInput.value) : state.length;
      return isFinite(w) && w > 0 && isFinite(d) && d > 0;
    }

    function clearCustomError() {
      if (!customErrorEl) return;
      customErrorEl.hidden = true;
      customErrorEl.textContent = '';
    }

    function showCustomError() {
      if (!customErrorEl) return;
      customErrorEl.hidden = false;
      customErrorEl.textContent = CUSTOM_INCOMPLETE_MSG;
    }

    function validateCustomBeforeBuy(e) {
      if (isCustomConfigured()) {
        clearCustomError();
        return true;
      }
      if (e) e.preventDefault();
      showCustomError();
      customErrorEl && customErrorEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return false;
    }

    function renderPreview() {
      if (!preview) return;
      const p = currentPattern();
      const useDummy =
        state.kit === 'custom' && !(state.width > 0 && state.length > 0);
      const floorW = useDummy ? 20 : state.width > 0 ? state.width : KIT_DIMS['2car'].width;
      const floorD = useDummy ? 20 : state.length > 0 ? state.length : KIT_DIMS['2car'].length;
      const tc = tileCounts(floorW, floorD, state.tileInches);
      const cols = Math.max(1, Math.min(tc.across, 40));
      const rows = Math.max(1, Math.min(tc.down, 40));
      /* Cut-outs only on Design My Space + L-shape — never on 2-Car / kit presets */
      const activeCutouts =
        state.kit === 'custom' && state.shape === 'lshape' && !useDummy
          ? state.cutouts
          : [];

      let html = '';
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cut = isCutoutCell(c, r, cols, rows, activeCutouts, tc.tileFt);
          if (cut) {
            html += `<span class="if-cfg__preview-tile is-cutout" aria-hidden="true"></span>`;
            continue;
          }
          const zi = Math.min(getZoneIndex(p.id, c, r, cols, rows), p.zones.length - 1);
          const col = colorByName(state.zoneColors[zi]);
          const bg = col.image
            ? `/*background-image:url('${col.image}');*/background-color:${col.hex}`
            : `background-color:${col.hex}`;
          html += `<span class="if-cfg__preview-tile" style="${bg}" title="${col.name}"></span>`;
        }
      }

      if (previewStage) {
        previewStage.style.setProperty('--if-cfg-ar-w', String(floorW));
        previewStage.style.setProperty('--if-cfg-ar-d', String(floorD));
      }

      preview.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
      preview.style.gridTemplateRows = `repeat(${rows}, minmax(0, 1fr))`;
      preview.dataset.cols = String(cols);
      preview.dataset.rows = String(rows);
      preview.dataset.total = String(tc.total);
      preview.dataset.tileInches = String(tc.inches);
      preview.dataset.widthFt = String(floorW);
      preview.dataset.depthFt = String(floorD);
      preview.dataset.dummyPreview = useDummy ? 'true' : 'false';
      preview.setAttribute(
        'aria-label',
        useDummy
          ? `Floor preview placeholder: 20' × 20' — ${cols} × ${rows} tiles`
          : `Floor preview: ${floorW}' × ${floorD}' — ${cols} × ${rows} tiles (${tc.inches}" tile, ${tc.sqft} sq ft)`
      );
      preview.innerHTML = html;

      if (cols * rows > 200) preview.style.gap = '2px';
      else if (cols * rows > 100) preview.style.gap = '3px';
      else preview.style.gap = '';
    }

    function renderPatterns() {
      if (!patGrid) return;
      const imgs = patternImages();
      patGrid.innerHTML = '';
      PATTERNS.forEach((p) => {
        const sel = state.pattern === p.id;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'if-cfg__pat-card' + (sel ? ' is-selected' : '');
        btn.setAttribute('aria-pressed', sel ? 'true' : 'false');
        btn.dataset.pattern = p.id;
        const src = imgs[p.id] || '';
        btn.innerHTML =
          `<span class="if-cfg__pat-thumb">${
            src ? `<img src="${src}" alt="${p.name}" loading="lazy">` : ''
          }</span>` +
          `<span class="if-cfg__pat-name">${p.name}</span>`;
        btn.addEventListener('click', () => {
          state.pattern = p.id;
          state.zoneColors = makeDefaultColors(colors, p.id, p.zones.length);
          state.activeZone = 0;
          state.dupWarn = false;
          renderAll();
        });
        patGrid.appendChild(btn);
      });
      if (patternNameEl) patternNameEl.textContent = currentPattern().shortName;
    }

    function swatchStyle(col) {
      if (col.image) return `background-image:url('${col.image}');/*background-color:${col.hex}*/`;
      return `background-color:${col.hex}`;
    }

    function renderColors() {
      const p = currentPattern();
      if (zoneChips) {
        zoneChips.innerHTML = '';
        p.zones.forEach((zName, zi) => {
          const col = colorByName(state.zoneColors[zi]);
          const chip = document.createElement('button');
          chip.type = 'button';
          chip.className =
            'if-cfg__zone-chip' + (state.activeZone === zi ? ' is-active' : '');
          chip.innerHTML =
            `<span class="if-cfg__zone-chip-sw" style="${swatchStyle(col)}"></span>` +
            `<span class="if-cfg__zone-chip-label"><b>${zName}</b> <span class="color_name">${col.name}</span></span>`;
          chip.addEventListener('click', () => {
            state.activeZone = zi;
            renderColors();
          });
          zoneChips.appendChild(chip);
        });
      }

      if (zoneRows) {
        zoneRows.innerHTML = '';
        p.zones.forEach((zName, zi) => {
          const wrap = document.createElement('div');
          wrap.className = 'if-cfg__zone-row';
          wrap.innerHTML = `<span class="if-cfg__zone-row-label">${zName}</span>`;
          const row = document.createElement('div');
          row.className = 'if-cfg__swatch-row';
          colors.forEach((c) => {
            const sel = state.zoneColors[zi] === c.name;
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'if-cfg__color-swatch' + (sel ? ' is-selected' : '');
            btn.setAttribute('aria-pressed', sel ? 'true' : 'false');
            btn.title = c.name;
            const sw = document.createElement('span');
            sw.className = 'if-cfg__color-swatch-bg';
            sw.style.cssText = swatchStyle(c);
            sw.setAttribute('aria-hidden', 'true');
            btn.appendChild(sw);
            btn.addEventListener('click', () => {
              if (p.noDuplicate) {
                const clash = state.zoneColors.findIndex(
                  (n, i) => i !== zi && n === c.name
                );
                if (clash !== -1) {
                  state.dupWarn = true;
                  state.activeZone = zi;
                  renderColors();
                  return;
                }
              }
              state.zoneColors[zi] = c.name;
              state.activeZone = zi;
              state.dupWarn = false;
              renderAll();
            });
            row.appendChild(btn);
          });
          wrap.appendChild(row);
          zoneRows.appendChild(wrap);
        });
      }

      if (dupWarnEl) {
        if (p.noDuplicate && state.dupWarn) {
          dupWarnEl.hidden = false;
          dupWarnEl.textContent =
            p.name + ' needs two different colors — that one is already used.';
        } else {
          dupWarnEl.hidden = true;
          dupWarnEl.textContent = '';
        }
      }
    }

    function syncHeroCtas(kit) {
      document.querySelectorAll('[data-if-kit-cta]').forEach((btn) => {
        const on = btn.getAttribute('data-if-kit') === kit;
        btn.classList.toggle('is-selected', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }

    function setKit(kit, opts) {
      const next = kit || '2car';
      const prev = state.kit;
      state.kit = next;
      if (next === 'custom' && prev !== 'custom') {
        if (widthInput) widthInput.value = '';
        if (depthInput) depthInput.value = '';
      }
      applyKitDims(next);
      clearCustomError();
      if (sizeGrid) {
        sizeGrid.querySelectorAll('.if-cfg__size-card').forEach((b) => {
          const on = b.getAttribute('data-kit') === next;
          b.classList.toggle('is-selected', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
      }
      syncHeroCtas(next);
      syncCustomPanel(next);
      renderPreview();
      renderSummary();
      document.dispatchEvent(
        new CustomEvent('if:kit-change', {
          detail: { kit: next, tiles: currentTileCounts() },
        })
      );

      if (opts && opts.scroll) {
        const target = document.getElementById('if-configure');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    function bindCustomPanel() {
      if (projectSelect) {
        projectSelect.addEventListener('change', () => {
          state.projectType = projectSelect.value;
          renderSummary();
        });
      }

      const onDimInput = () => {
        if (state.kit !== 'custom') return;
        const w = parseFloat(widthInput && widthInput.value);
        const d = parseFloat(depthInput && depthInput.value);
        state.width = isFinite(w) && w > 0 ? w : null;
        state.length = isFinite(d) && d > 0 ? d : null;
        if (isCustomConfigured()) clearCustomError();
        syncPresetButtons();
        renderPreview();
        renderSummary();
      };

      if (widthInput) widthInput.addEventListener('input', onDimInput);
      if (depthInput) depthInput.addEventListener('input', onDimInput);

      if (presetsRow) {
        presetsRow.querySelectorAll('.if-cfg__preset').forEach((btn) => {
          btn.addEventListener('click', () => {
            const w = parseFloat(btn.getAttribute('data-w'));
            const d = parseFloat(btn.getAttribute('data-d'));
            setCustomDims(w, d);
          });
        });
      }

      if (shapeRow) {
        shapeRow.querySelectorAll('.if-cfg__shape-btn').forEach((btn) => {
          btn.addEventListener('click', () => {
            setShape(btn.getAttribute('data-shape') || 'rect');
          });
        });
      }
    }

    function bindSizes() {
      if (!sizeGrid) return;
      const selected = sizeGrid.querySelector('.if-cfg__size-card.is-selected');
      const fallback =
        sizeGrid.querySelector('.if-cfg__size-card[data-kit="custom"]') ||
        sizeGrid.querySelector('.if-cfg__size-card');
      state.kit = (selected || fallback).getAttribute('data-kit') || 'custom';
      applyKitDims(state.kit);
      syncHeroCtas(state.kit);
      syncCustomPanel(state.kit);

      sizeGrid.querySelectorAll('.if-cfg__size-card').forEach((btn) => {
        btn.addEventListener('click', () => {
          setKit(btn.getAttribute('data-kit') || '2car');
        });
      });
    }

    function bindDreamActions() {
      if (pdfBtn) {
        pdfBtn.addEventListener('click', (e) => {
          handleDownloadDesign(e);
        });
      }
      if (shopPayBtn && atcForm) {
        shopPayBtn.addEventListener('click', (e) => {
          if (!validateCustomBeforeBuy(e)) return;
          hideAppOptions();
          syncCartFields();
          if (!buildCartItems().length) {
            console.error('IF configurator: no matching variant for kit "' + state.kit + '"');
            return;
          }
          const hasPopup = document.querySelector('#discount-popup');
          if (hasPopup) {
            atcForm.setAttribute('data-if-cfg-redirect', '/checkout');
            if (typeof atcForm.requestSubmit === 'function') atcForm.requestSubmit();
            else atcForm.submit();
            return;
          }
          addConfiguredItemsToCart({ redirect: '/checkout' }).catch((err) => {
            console.error(err);
          });
        });
      }
      if (atcForm) {
        atcForm.addEventListener('submit', (e) => {
          if (!validateCustomBeforeBuy(e)) return;
          hideAppOptions();
          syncCartFields();
          if (!buildCartItems().length) {
            e.preventDefault();
            console.error('IF configurator: no matching variant for kit "' + state.kit + '"');
            return;
          }
          const hasPopup = document.querySelector('#discount-popup');
          if (hasPopup) return;
          e.preventDefault();
          addConfiguredItemsToCart({
            redirect: atcForm.getAttribute('data-if-cfg-redirect') || '/cart',
          }).catch((err) => {
            console.error(err);
          });
        });
      }
    }

    function bindHeroCtas() {
      document.querySelectorAll('[data-if-kit-cta]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          setKit(btn.getAttribute('data-if-kit') || '2car', { scroll: true });
        });
      });
    }

    function renderAll() {
      renderPatterns();
      renderColors();
      renderPreview();
      renderSummary();
    }

    watchAndHideAppOptions();
    bindTiles();
    bindSizes();
    bindCustomPanel();
    bindHeroCtas();
    bindDreamActions();
    updateBuyMode();
    renderAll();

    root._ifCfgState = state;
    root._ifCfgColors = colors;
    root._ifCfgProduct = productData;
    root._ifCfgSetKit = setKit;
    root._ifCfgSwitchProduct = switchProduct;
    root._ifCfgTileCounts = currentTileCounts;
    root._ifCfgAddToCart = addConfiguredItemsToCart;
    root._ifCfgBuildCartItems = buildCartItems;
  }

  function boot() {
    document.querySelectorAll('[data-if-cfg]').forEach(initRoot);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
