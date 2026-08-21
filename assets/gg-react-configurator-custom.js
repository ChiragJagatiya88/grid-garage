const CDN = "https://www.gridgarageinc.com/cdn/shop/files/";

const PATTERNS = [
  {
    id: "checkered",
    name: "Checkered Classic",
    hero: CDN + "pattern_checkered_classic_d08092bc-8916-4532-8b8f-ad5550b84e1b.png?width=1200",
    thumb: CDN + "pattern_checkered_classic_d08092bc-8916-4532-8b8f-ad5550b84e1b.png?width=500",
    zones: ["Tile Color A", "Tile Color B"],
    noDuplicate: true,
  },
  {
    id: "racetrack",
    name: "Racetrack",
    hero: CDN + "pattern_race_track_66647fc8-b4db-4788-ab16-8a3da5613ea1.png?width=1200",
    thumb: CDN + "pattern_race_track_66647fc8-b4db-4788-ab16-8a3da5613ea1.png?width=500",
    zones: ["Track Border", "Main Floor", "Inner Accent"],
  },
  {
    id: "showroom",
    name: "Showroom",
    hero: CDN + "pattern_showroom_b95cb6bf-601a-47e5-bd37-4c8aad9ee5be.png?width=1200",
    thumb: CDN + "pattern_showroom_b95cb6bf-601a-47e5-bd37-4c8aad9ee5be.png?width=500",
    zones: ["Main Floor", "Highlight Border", "Parking Bays"],
  },
  {
    id: "doubleborder",
    name: "Double Border",
    hero: CDN + "pattern_double_border_879468ef-fa13-4a2b-9e8f-b790922463e2.png?width=1200",
    thumb: CDN + "pattern_double_border_879468ef-fa13-4a2b-9e8f-b790922463e2.png?width=500",
    zones: ["Center Floor", "Inner Border", "Outer Border"],
  },
  {
    id: "solid",
    name: "Stealth Solid",
    hero: CDN + "converted-20260518-24213-51j20r.webp?v=1779131804&width=1200",
    thumb: CDN + "converted-20260518-24213-51j20r.webp?v=1779131804&width=500",
    zones: ["Base Floor"],
  },
];

// Real installed-floor photos (self-hosted theme assets) replace the CDN
// placeholder art on the pattern-selection cards. See window.GG_PATTERN_IMAGES,
// set in react-configurator.liquid.
if (window.GG_PATTERN_IMAGES) {
  PATTERNS.forEach((p) => {
    const img = window.GG_PATTERN_IMAGES[p.id];
    if (img) {
      p.hero = img;
      p.thumb = img;
    }
  });
}

const GGX_COLORS = [
  { name: "Black", hex: "#1a1a1a", image: CDN + "Black.png?v=1777583020&width=416" },
  { name: "Grey", hex: "#6b6f76", image: CDN + "Grey.png?v=1777583021&width=416" },
  { name: "Light Grey", hex: "#b8bcc1", image: CDN + "LightGrey.png?v=1777583021&width=416" },
  { name: "White", hex: "#f2f2ee", image: CDN + "5ecdce44-7929-4d00-801a-2fee623d09db.jpg?v=1778085573&width=416" },
  { name: "Orange", hex: "#e8781f", image: CDN + "Orange.png?v=1777583021&width=416" },
  { name: "Red", hex: "#c8202f", image: CDN + "Red.png?v=1777583021&width=416" },
  { name: "Blue", hex: "#1f4e9c", image: CDN + "aef1436e-d62c-47ca-b20b-88e02b20c3fe.jpg?v=1778085565&width=416" },
];

const DIAMOND_COLORS = [
  { name: "Royal Blue", hex: "#1f4e9c", image: CDN + "RackMultipart20260427-14370-flweyu.webp?v=1777312179&width=416" },
  { name: "Jet Black", hex: "#1a1a1a", image: CDN + "RackMultipart20260427-14370-hx2aa0.webp?v=1777312159&width=416" },
  { name: "Racing Red", hex: "#c8202f", image: CDN + "RackMultipart20260427-14370-6l3ic6.webp?v=1777312175&width=416" },
  { name: "Pearl Silver", hex: "#b8bcc1", image: CDN + "pearl-silver-dt-home_1000x_fcc55635-ce9c-4f09-a8aa-38a8a4d29e25.png?v=1777300435&width=416" },
  { name: "Slate Grey", hex: "#6b6f76", image: CDN + "RackMultipart20260427-14370-5rpo59.webp?v=1777312172&width=416" },
  { name: "Artic White", hex: "#f2f2ee", image: CDN + "RackMultipart20260427-14370-frs3az.webp?v=1777312156&width=416" },
  { name: "Tropical Orange", hex: "#e8781f", image: CDN + "RackMultipart20260427-14370-7x2vtg.webp?v=1777312183&width=416" },
];

const RIBSMOOTH_COLORS = [
  { name: "Tropical Orange", hex: "#e8781f", image: CDN + "RackMultipart20260427-14316-cpg6mo.webp?v=1777319524&width=416" },
  { name: "Royal Blue", hex: "#1f4e9c", image: CDN + "RackMultipart20260427-14316-cdc55d.webp?v=1777319518&width=416" },
  { name: "Jet Black", hex: "#1a1a1a", image: CDN + "RackMultipart20260427-14316-wgerx.webp?v=1777319506&width=416" },
  { name: "Racing Red", hex: "#c8202f", image: CDN + "RackMultipart20260427-14316-wwtqyr.webp?v=1777319515&width=416" },
  { name: "Pearl Silver", hex: "#b8bcc1", image: CDN + "RackMultipart20260427-14316-yrbx64.webp?v=1777319512&width=416" },
  { name: "Slate Grey", hex: "#6b6f76", image: CDN + "RackMultipart20260427-14316-a6l85i.webp?v=1777319521&width=416" },
  { name: "Artic White", hex: "#f2f2ee", image: CDN + "RackMultipart20260427-14316-4rekyv.webp?v=1777319497&width=416" },
];

const RIBPRO_COLORS = [
  { name: "Racing Red", hex: "#c8202f", image: CDN + "Ribtrax_45_RacingRed_1000x1000_5a55d4c0-e44d-474c-85d2-734cdd77c1d0.gif?v=1777026222&width=416" },
  { name: "Jet Black", hex: "#1a1a1a", image: CDN + "Ribtrax_45_JetBlack_1000x1000_e0371004-322e-493a-b0c3-22f9812b1f40.gif?v=1777026222&width=416" },
  { name: "Pearl Silver", hex: "#b8bcc1", image: CDN + "Ribtrax_45_PearlSilver_1000x1000_1.gif?v=1777026223&width=416" },
  { name: "Slate Grey", hex: "#6b6f76", image: CDN + "Ribtrax_45_SlateGrey_1000x1000_d2b06fde-f417-4cd5-aeac-ce377f47e8a7.gif?v=1777026222&width=416" },
  { name: "Artic White", hex: "#f2f2ee", image: CDN + "Ribtrax_45_ArcticWhite_1000x1000_24eccf45-bb46-4311-81d2-dd67a5f87919.gif?v=1777026222&width=416" },
  { name: "Royal Blue", hex: "#1f4e9c", image: CDN + "45-Ribtrax_RoyalBlue_HR_1000x_1000x_4d37b334-f348-4d7e-a948-02efc7f2c44a.webp?v=1777407837&width=416" },
];

const RIBPRO_SPECIAL_COLORS = [
  { name: "Techno Green", hex: "#2e8b57", image: CDN + "Ribtrax_45_TechnoGreen_1000x1000_b01ebcb2-0f91-4d1e-8add-150349587eb3.gif?v=1777020277&width=416" },
  { name: "Carnival Pink", hex: "#d35b93", image: CDN + "Ribtrax_45_CarnivalPink_1000x1000_dcd63560-e56b-4f1a-9e52-8a1085c19d3a.gif?v=1777020277&width=416" },
  { name: "Cosmic Purple", hex: "#8e44ad", image: CDN + "Ribtrax_45_CosmicPurple_1000x1000_5f1d8c6f-bd43-4ac9-bd5b-a281b7233a6e.gif?v=1777020277&width=416" },
  { name: "Island Blue", hex: "#1686bd", image: CDN + "Ribtrax_45_IslandBlue_1000x1000_a819cba1-e4fa-46d9-b9fb-8651e20200ed.gif?v=1777020277&width=416" },
  { name: "Teal", hex: "#168b8b", image: CDN + "Ribtrax_45_Teal_1000x1000_26d30e29-4353-4a41-92a0-ff0ceb42647b.gif?v=1777020278&width=416" },
  { name: "Turf Green", hex: "#4f8c38", image: CDN + "Ribtrax_45_TurfGreen_1000x1000_1af55101-bae6-4da3-8a4a-4d3dae79c220.gif?v=1777020277&width=416" },
  { name: "Terra Cotta", hex: "#a6513d", image: CDN + "Ribtrax_45_TerraCotta_1000x1000_09fbe7b3-58a6-481f-96cc-4bee08623606.gif?v=1777020277&width=416" },
];

const ALL_COLORS = [
  ...GGX_COLORS,
  ...DIAMOND_COLORS,
  ...RIBSMOOTH_COLORS,
  ...RIBPRO_COLORS,
  ...RIBPRO_SPECIAL_COLORS,
];

const KIT_LABELS = {
  "2car": "2-Car Garage",
  "3car": "3-Car Garage",
  custom: "Design My Space",
};

const KIT_SQFT = {
  "2car": 430,
  "3car": 630,
};

const TILE_INCHES = {
  ggx: 17,
  diamond: 12,
  ribsmooth: 12,
  ribpro: 15.75,
  ribprosp: 15.75,
};

const SIZE_PRESETS = [
  { label: "20×20", w: 20, d: 20 },
  { label: "20×24", w: 20, d: 24 },
  { label: "24×24", w: 24, d: 24 },
  { label: "30×30", w: 30, d: 30 },
  { label: "40×40", w: 40, d: 40 },
];

// State
const state = {
  kit: "2car", // 2car, 3car, custom
  pattern: "checkered",
  zoneColors: [],
  dupWarn: null,
  width: null,
  length: null,
  shape: "rect", // rect, lshape
  cutouts: [],
  projectType: "Garage",
  customRecommendedKit: null, // "2car" | "3car" | null
  priceUnavailable: false,
};

let productData = null;
let currentColors = GGX_COLORS; // Default
let currentTileInches = 17;

// DOM Elements
const els = {
  heroImg: document.getElementById('gg-hero-img'),
  npName: document.getElementById('gg-np-name'),
  npColors: document.getElementById('gg-np-colors'),
  diagName: document.getElementById('gg-diag-name'),
  svgContainer: document.getElementById('gg-svg-container'),
  stageLegend: document.getElementById('gg-stage-legend'),
  patGrid: document.getElementById('gg-pat-grid'),
  zonesContainer: document.getElementById('gg-zones-container'),
  selList: document.getElementById('gg-sel-list'),
  priceAmt: document.getElementById('gg-price-amt'),
  stickyPrice: document.getElementById('gg-sticky-price'),
  kitGrid: document.getElementById('gg-kit-grid'),
  variantId: document.getElementById('gg-variant-id'),
  addQty: document.getElementById('gg-add-qty'),
  propsContainer: document.getElementById('gg-properties-container'),
  customDims: document.getElementById('gg-custom-dims'),
  dimW: document.getElementById('gg-dim-w'),
  dimL: document.getElementById('gg-dim-l'),
  presetRow: document.getElementById('gg-preset-row'),
  tileHelp: document.getElementById('gg-tile-help'),
  netAreaVal: document.getElementById('gg-net-area-val'),
  netAreaSub: document.getElementById('gg-net-area-sub'),
  projectType: document.getElementById('gg-project-type'),
  shapeRow: document.querySelector('.gg-shape-row'),
  cutoutsContainer: document.getElementById('gg-cutouts'),
  customEst: document.getElementById('gg-custom-est'),
  addToCartForm: document.getElementById('gg-add-to-cart-form'),
  stickyAddBtn: document.getElementById('gg-sticky-add-btn'),
  quoteToast: document.getElementById('gg-quote-toast'),
  downloadDesignBtn: document.getElementById('gg-download-design-btn'),
};

// function formatPrice(cents) {
//   return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 });
// }

function formatPrice(cents) {
  const dollars = cents / 100;
  const hasCents = Math.round(cents) % 100 !== 0;
  return dollars.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: hasCents ? 2 : 0,
  });
}

function colorByName(name) {
  return currentColors.find(c => c.name === name) || ALL_COLORS.find(c => c.name === name) || currentColors[0];
}

// Turn the raw per-product color list (from #gg-colors-json, sourced from this
// product's real Shopify color option) into { name, hex, image } tile entries.
// The hardcoded ALL_COLORS palettes are used only as a hex/image fallback by
// name — the actual list of colors offered always comes from Shopify.
function buildDynamicColors(rawList) {
  const FALLBACK_HEX = '#9C9E9A';
  return rawList
    .filter(entry => entry && entry.name)
    .map(entry => {
      const known = ALL_COLORS.find(c => c.name === entry.name);
      let hex = FALLBACK_HEX;
      if (entry.rgb) hex = `rgb(${entry.rgb})`;
      else if (known) hex = known.hex;
      const image = entry.image || (known ? known.image : '');
      return { name: entry.name, hex, image };
    });
}

function init() {
  const jsonEl = document.getElementById('gg-product-json');
  if (jsonEl) {
    productData = JSON.parse(jsonEl.textContent);

    // Determine tile size + a hardcoded-palette fallback based on product title
    const t = productData.title.toLowerCase();
    if (t.includes('diamondtrax')) { currentColors = DIAMOND_COLORS; currentTileInches = TILE_INCHES.diamond; }
    else if (t.includes('ribtrax smooth')) { currentColors = RIBSMOOTH_COLORS; currentTileInches = TILE_INCHES.ribsmooth; }
    else if (t.includes('ribtrax pro special')) { currentColors = RIBPRO_SPECIAL_COLORS; currentTileInches = TILE_INCHES.ribprosp; }
    else if (t.includes('ribtrax pro')) { currentColors = RIBPRO_COLORS; currentTileInches = TILE_INCHES.ribpro; }
    else { currentColors = GGX_COLORS; currentTileInches = TILE_INCHES.ggx; }
  }

  // Prefer the live color list pulled from this product's actual Shopify color
  // option — falls back to the hardcoded palette above only if that's missing.
  const colorsEl = document.getElementById('gg-colors-json');
  if (colorsEl) {
    try {
      const raw = JSON.parse(colorsEl.textContent);
      if (Array.isArray(raw) && raw.length) {
        currentColors = buildDynamicColors(raw);
      }
    } catch (err) {
      console.error('GG configurator: failed to parse gg-colors-json', err);
    }
  }

  // Restore an in-progress design for this product (e.g. after navigating to
  // /cart and back) before falling back to defaults.
  const restored = restoreState();
  if (!restored) {
    const p = PATTERNS.find(x => x.id === state.pattern);
    state.zoneColors = makeDefaultColors(currentColors, p.zones.length);
  }

  // Setup Kit Listeners
  if (els.kitGrid) {
    Array.from(els.kitGrid.children).forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Find closest button in case they clicked inner element
        const target = e.target.closest('button');
        if(!target) return;
        const kit = target.getAttribute('data-kit');
        state.kit = kit;
        state.dupWarn = null;
        renderKits();
        renderCustomDims();
        updatePriceAndCart();
        renderSummary();
      });
    });
  }

  // Setup Custom Dimensions Listeners
  if (els.dimW) els.dimW.addEventListener('input', (e) => onDim('width', e.target.value));
  if (els.dimL) els.dimL.addEventListener('input', (e) => onDim('length', e.target.value));

  if (els.presetRow) {
    Array.from(els.presetRow.children).forEach(btn => {
      btn.addEventListener('click', () => {
        applyPreset(parseFloat(btn.getAttribute('data-w')), parseFloat(btn.getAttribute('data-d')));
      });
    });
  }

  if (els.projectType) {
    els.projectType.addEventListener('change', (e) => {
      state.projectType = e.target.value;
    });
  }

  if (els.shapeRow) {
    Array.from(els.shapeRow.children).forEach(btn => {
      btn.addEventListener('click', () => setShape(btn.getAttribute('data-shape')));
    });
  }

// add to cart code replaced from here
// if (atcForm) {

//   let allowAddToCart = false;

//   atcForm.addEventListener('submit', (e) => {

//     if (!allowAddToCart) {

//       e.preventDefault();

//       window.pendingGGAddToCart = () => {
//         allowAddToCart = true;
//         atcForm.requestSubmit();
//       };

//       console.log('GG KLAVIYO TRIGGER FIRED');

//       window._klOnsite = window._klOnsite || [];

//       window._klOnsite.push([
//         'openForm',
//         'WT9tcM'
//       ]);

//       return;
//     }

//   });

// }

// document.addEventListener('klaviyoForms:submit', function () {
//   console.log('Klaviyo submitted');

//   if (window.pendingGGAddToCart) {
//     window.pendingGGAddToCart();
//   }
// });

// document.addEventListener('klaviyoForms:close', function () {
//   console.log('Klaviyo closed');

//   if (window.pendingGGAddToCart) {
//     window.pendingGGAddToCart();
//   }
// });
// end here

// hide default add to cart code
// start
  if (els.addToCartForm) {
    els.addToCartForm.addEventListener('submit', (e) => {
      if (state.kit === 'custom') {
        const net = Math.round(netSqft());
        const cartVariant = getCustomCartVariant();
        if (!cartVariant || net <= 0) {
          e.preventDefault();
          window.location.href = '/pages/contact';
          return;
        }
      }
      if (state.priceUnavailable) {
        e.preventDefault();
        console.error('GG configurator: no matching variant found for kit "' + state.kit + '" — refusing to add to cart.');
      }
    });
  }
// end

  // Sticky mobile bar delegates to the real form's submit handling (requestSubmit
  // dispatches the 'submit' event; the form's native .submit() would not).
  if (els.stickyAddBtn && els.addToCartForm) {
    els.stickyAddBtn.addEventListener('click', () => {
      els.addToCartForm.requestSubmit();
    });
  }

  // "Request a Quote" is a plain link to the real Contact Us page
  // (href="/pages/contact") — no click override, no mailto. Intentionally
  // separate from "Download Design Summary" below, which still builds a PDF.
  if (els.downloadDesignBtn) {
    els.downloadDesignBtn.addEventListener('click', handleDownloadDesign);
  }

  // Initial Render
  renderKits();
  renderPatterns();
  renderZones();
  renderStage();
  renderCustomDims();
  updatePriceAndCart();
  renderSummary();
}

// ---- Custom floor helpers ----
function grossSqft() {
  return state.width && state.length ? state.width * state.length : 0;
}

function cutoutSqft() {
  if (state.shape !== 'lshape') return 0;
  return state.cutouts.reduce((sum, c) => sum + (c.width && c.depth ? c.width * c.depth : 0), 0);
}

function netSqft() {
  return Math.max(0, grossSqft() - cutoutSqft());
}

function recommendKit(area) {
  if (area === 0) return null;
  if (area <= KIT_SQFT['2car']) return '2car';
  if (area <= KIT_SQFT['3car']) return '3car';
  return null;
}

function isPriceByConsultation() {
  if (!productData?.tags) return false;
  return productData.tags.some(t => String(t).toLowerCase().includes('price by consultation'));
}

function variantPriceCents(variant) {
  if (!variant) return 0;
  const p = variant.price;
  return typeof p === 'number' ? p : Math.round(parseFloat(p) * 100);
}

function variantOptionValues(v) {
  return v.options || [v.option1, v.option2, v.option3].filter(Boolean);
}

// These products carry real Shopify "Color" / "Design Style" variant options
// left over from before this custom picker existed — pattern and color are
// chosen in our own UI, but the real Shopify checkout page is NOT theme-
// controlled and always shows the actual added variant's own native image,
// ignoring our line item properties. So instead of just picking any neutral
// variant, find every variant whose kit-size option matches, then prefer the
// one whose Color option exactly matches the customer's chosen Tile Color A
// (preferredColor) — our per-product color list is sourced from this same
// real Color option (#gg-colors-json), so the names line up 1:1. Falls back
// to a neutral default, then the first candidate, if no exact match exists
// (e.g. a custom/legacy color name not offered as a real variant option).
function findKitVariant(kit, preferredColor) {
  if (!productData || !productData.variants) return null;
  const num = kit === '2car' ? '2' : '3';
  const sizeRe = new RegExp('\\b' + num + '[\\s-]*car\\b', 'i');

  const candidates = productData.variants.filter(v =>
    variantOptionValues(v).some(o => o && sizeRe.test(o))
  );
  if (candidates.length <= 1) return candidates[0] || null;

  if (preferredColor) {
    const wanted = preferredColor.trim().toLowerCase();
    const exact = candidates.find(v =>
      variantOptionValues(v).some(o => o && o.trim().toLowerCase() === wanted)
    );
    if (exact) return exact;
  }

  for (const kw of DEFAULT_COLOR_KEYWORDS) {
    const match = candidates.find(v =>
      variantOptionValues(v).some(o => o && o.toLowerCase().includes(kw))
    );
    if (match) return match;
  }
  return candidates[0];
}

function getFallbackVariant() {
  if (!productData || !productData.variants) return null;
  return productData.variants.find(v => v.available) || productData.variants[0];
}

function getKitPrices() {
  let v2 = findKitVariant('2car');
  let v3 = findKitVariant('3car');
  
  let p2 = variantPriceCents(v2);
  let p3 = variantPriceCents(v3);
  
  if (!p2 && productData && productData.price) p2 = productData.price;
  if (!p3 && p2) p3 = Math.round(p2 * (KIT_SQFT['3car'] / KIT_SQFT['2car']));
  if (!p2 && p3) p2 = Math.round(p3 * (KIT_SQFT['2car'] / KIT_SQFT['3car']));
  
  return {
    '2car': p2,
    '3car': p3,
  };
}

// Fixed $/sqft (in cents) for custom-project overage pricing — spaces larger
// than the 3-car kit's 630 sqft — on specific product lines, set directly per
// business request rather than derived from the 3-car kit's real Shopify
// price. Applies to every custom size, not just oversized spaces — a small
// custom order should cost less than a full kit, not the same flat price.
function customPerSqftRateCents() {
  if (!productData || !productData.title) return null;
  const t = productData.title.toLowerCase();
  if (t.includes('swisstrax')) return 463; // $4.63/sqft
  if (t.includes('grid garage') || t.includes('gridgarage')) return 425; // $4.25/sqft
  return null;
}

// Every custom size is priced per-sqft — a fixed per-product-line rate above
// when one applies, otherwise derived from the real Shopify 3-car (or 2-car)
// kit price. No flat "kit minimum" — a 10x10 order costs less than a 20x20.
function calculateCustomSpacePrice(netSqft) {
  if (!netSqft || netSqft <= 0) return null;
  const prices = getKitPrices();
  const fixedRate = customPerSqftRateCents();
  if (fixedRate) return Math.round(netSqft * fixedRate);
  if (prices['3car']) return Math.round(netSqft * (prices['3car'] / KIT_SQFT['3car']));
  if (prices['2car']) return Math.round(netSqft * (prices['2car'] / KIT_SQFT['2car']));
  return null;
}

// A real Shopify variant priced at an exact $/sqft rate (option value
// containing "per sq", e.g. "Custom (Per Sq Ft)"). Shopify can only ever
// charge a real variant's real price — line item properties like "Net Area"
// never affect the total. Using this variant with quantity = sqft (see
// updatePriceAndCart) is what makes the checkout total actually match the
// on-page estimate for custom sizes. Falls back to the flat kit variant if
// no such per-sqft variant has been set up for this product yet.
function findCustomPerSqftVariant(preferredColor) {
  if (!productData || !productData.variants) return null;
  const candidates = productData.variants.filter(v =>
    variantOptionValues(v).some(o => o && /per[\s-]*sq/i.test(o))
  );
  if (candidates.length <= 1) return candidates[0] || null;

  if (preferredColor) {
    const wanted = preferredColor.trim().toLowerCase();
    const exact = candidates.find(v =>
      variantOptionValues(v).some(o => o && o.trim().toLowerCase() === wanted)
    );
    if (exact) return exact;
  }

  for (const kw of DEFAULT_COLOR_KEYWORDS) {
    const match = candidates.find(v =>
      variantOptionValues(v).some(o => o && o.toLowerCase().includes(kw))
    );
    if (match) return match;
  }
  return candidates[0];
}

function getCustomCartVariant() {
  // The real per-sqft variant always wins when one exists for this product —
  // it's what makes the checkout total match the on-page estimate for every
  // custom size, not just ones that happen to fit inside a kit's capacity.
  // customRecommendedKit gets set as soon as any width/depth is typed (see
  // onDim), so checking it first — like the old flat-kit-price logic did —
  // would always shadow this and never actually run.
  const perSqftVariant = findCustomPerSqftVariant(state.zoneColors[0]);
  if (perSqftVariant) return perSqftVariant;

  // No per-sqft variant configured for this product yet — fall back to the
  // old flat-kit-price behavior.
  if (state.customRecommendedKit) {
    return findKitVariant(state.customRecommendedKit, state.zoneColors[0]) || getFallbackVariant();
  }
  const net = Math.round(netSqft());
  if (net > KIT_SQFT['3car'] && !isPriceByConsultation()) {
    return findKitVariant('3car', state.zoneColors[0]) || getFallbackVariant();
  }
  return getFallbackVariant();
}

function getCustomSizeLabel() {
  if (state.customRecommendedKit) {
    return `${KIT_LABELS[state.customRecommendedKit]} (custom fit)`;
  }
  const net = Math.round(netSqft());
  if (net > 0 && !isPriceByConsultation()) return 'Design My Space (custom fit)';
  return 'Design My Space (quote needed)';
}

function tileCounts() {
  const tileFt = currentTileInches / 12;
  return {
    inches: currentTileInches,
    tileFt,
    across: state.width ? Math.ceil(state.width / tileFt) : 0,
    down: state.length ? Math.ceil(state.length / tileFt) : 0,
  };
}

function onDim(key, v) {
  const num = parseFloat(v);
  state[key] = isFinite(num) && num > 0 ? num : null;
  const area = Math.round(netSqft());
  state.customRecommendedKit = recommendKit(area);
  renderCustomDims();
  updatePriceAndCart();
  renderSummary();
}

function applyPreset(w, d) {
  state.width = w;
  state.length = d;
  if (els.dimW) els.dimW.value = w;
  if (els.dimL) els.dimL.value = d;
  const area = Math.round(netSqft());
  state.customRecommendedKit = recommendKit(area);
  renderCustomDims();
  updatePriceAndCart();
  renderSummary();
}

function setShape(shape) {
  state.shape = shape;
  if (shape === 'lshape' && state.cutouts.length === 0) {
    state.cutouts.push({ id: 'co-' + Date.now(), corner: 'br', width: null, depth: null });
  }
  const area = Math.round(netSqft());
  state.customRecommendedKit = recommendKit(area);
  renderCustomDims();
  updatePriceAndCart();
  renderSummary();
}

function addCutout() {
  state.cutouts.push({ id: 'co-' + Date.now(), corner: 'tr', width: null, depth: null });
  renderCustomDims();
  updatePriceAndCart();
  renderSummary();
}

function removeCutout(id) {
  state.cutouts = state.cutouts.filter(c => c.id !== id);
  const area = Math.round(netSqft());
  state.customRecommendedKit = recommendKit(area);
  renderCustomDims();
  updatePriceAndCart();
  renderSummary();
}

function updateCutout(id, patch) {
  const c = state.cutouts.find(x => x.id === id);
  if (!c) return;
  Object.assign(c, patch);
  const area = Math.round(netSqft());
  state.customRecommendedKit = recommendKit(area);
  renderCustomDims();
  updatePriceAndCart();
  renderSummary();
}

function renderCutouts() {
  if (!els.cutoutsContainer) return;
  if (state.shape !== 'lshape') {
    els.cutoutsContainer.style.display = 'none';
    els.cutoutsContainer.innerHTML = '';
    return;
  }
  els.cutoutsContainer.style.display = '';
  els.cutoutsContainer.innerHTML = '';

  const corners = [
    { id: 'tl', title: 'Top-left' },
    { id: 'tr', title: 'Top-right' },
    { id: 'bl', title: 'Bottom-left' },
    { id: 'br', title: 'Bottom-right' },
  ];

  state.cutouts.forEach((c, i) => {
    const div = document.createElement('div');
    div.className = 'gg-cutout';

    const head = document.createElement('div');
    head.className = 'gg-cutout-head';
    head.innerHTML = `<span class="gg-cutout-title">Cut-out ${i + 1}</span>`;
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'gg-cutout-remove';
    removeBtn.textContent = 'Remove';
    removeBtn.onclick = () => removeCutout(c.id);
    head.appendChild(removeBtn);
    div.appendChild(head);

    const body = document.createElement('div');
    body.className = 'gg-cutout-body';

    const cornerPicker = document.createElement('div');
    cornerPicker.className = 'gg-corner-picker';
    cornerPicker.setAttribute('role', 'radiogroup');
    cornerPicker.setAttribute('aria-label', 'Cut-out corner');
    corners.forEach(corner => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', c.corner === corner.id);
      btn.className = `gg-corner ${c.corner === corner.id ? 'sel' : ''}`;
      btn.title = corner.title;
      btn.onclick = () => updateCutout(c.id, { corner: corner.id });
      cornerPicker.appendChild(btn);
    });
    body.appendChild(cornerPicker);

    const widthDim = document.createElement('div');
    widthDim.className = 'gg-dim';
    widthDim.innerHTML = `
      <label>Cut width</label>
      <div class="gg-dim-input">
        <input type="number" inputmode="decimal" min="0" step="0.5" placeholder="0" value="${c.width ?? ''}">
        <span class="gg-dim-unit">ft</span>
      </div>
    `;
    widthDim.querySelector('input').addEventListener('input', (e) => {
      const n = parseFloat(e.target.value);
      updateCutout(c.id, { width: isFinite(n) && n > 0 ? n : null });
    });
    body.appendChild(widthDim);

    const depthDim = document.createElement('div');
    depthDim.className = 'gg-dim';
    depthDim.innerHTML = `
      <label>Cut depth</label>
      <div class="gg-dim-input">
        <input type="number" inputmode="decimal" min="0" step="0.5" placeholder="0" value="${c.depth ?? ''}">
        <span class="gg-dim-unit">ft</span>
      </div>
    `;
    depthDim.querySelector('input').addEventListener('input', (e) => {
      const n = parseFloat(e.target.value);
      updateCutout(c.id, { depth: isFinite(n) && n > 0 ? n : null });
    });
    body.appendChild(depthDim);

    div.appendChild(body);
    els.cutoutsContainer.appendChild(div);
  });

  const addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.className = 'gg-cutout-add';
  addBtn.textContent = '+ Add another cut-out';
  addBtn.onclick = addCutout;
  els.cutoutsContainer.appendChild(addBtn);

  const help = document.createElement('p');
  help.className = 'gg-cf-help gg-cf-help-sm';
  help.textContent = 'Bottom = garage-door side. Each cut-out is subtracted from the total square footage and its position determines which edge pieces we include.';
  els.cutoutsContainer.appendChild(help);
}

function renderCustomDims() {
  if (!els.customDims) return;

  if (state.kit !== 'custom') {
    els.customDims.style.display = 'none';
    return;
  }
  els.customDims.style.display = '';

  // Preset selection state
  if (els.presetRow) {
    Array.from(els.presetRow.children).forEach(btn => {
      const w = parseFloat(btn.getAttribute('data-w'));
      const d = parseFloat(btn.getAttribute('data-d'));
      const isSel = state.width === w && state.length === d;
      btn.classList.toggle('sel', isSel);
      btn.setAttribute('aria-pressed', isSel);
    });
  }

  // Shape buttons
  if (els.shapeRow) {
    Array.from(els.shapeRow.children).forEach(btn => {
      const isSel = btn.getAttribute('data-shape') === state.shape;
      btn.classList.toggle('sel', isSel);
      btn.setAttribute('aria-pressed', isSel);
    });
  }

  const gross = grossSqft();
  const cuts = cutoutSqft();
  const net = netSqft();

  if (els.netAreaVal) {
    els.netAreaVal.textContent = net ? `${Math.round(net)} sq ft` : '—';
  }
  if (els.netAreaSub) {
    if (state.shape === 'lshape' && cuts > 0) {
      els.netAreaSub.style.display = '';
      els.netAreaSub.textContent = `${Math.round(gross)} − ${Math.round(cuts)} cut-out`;
    } else {
      els.netAreaSub.style.display = 'none';
    }
  }

  if (els.tileHelp) {
    if (state.width && state.length) {
      const tc = tileCounts();
      els.tileHelp.style.display = '';
      els.tileHelp.innerHTML = `Each tile is <b>${tc.inches}″</b> (${tc.tileFt.toFixed(4)} ft) square. We round each side up to a whole number of tiles — your floor uses <b>${tc.across} × ${tc.down}</b> tiles (${tc.across * tc.down} total field tiles before cut-outs).`;
    } else {
      els.tileHelp.style.display = 'none';
    }
  }

  renderCutouts();

  if (els.customEst) {
    if (net > 0 && productData) {
      els.customEst.style.display = '';
      const consultNote = isPriceByConsultation()
        ? ' · pricing by consultation'
        : '';
      els.customEst.innerHTML = `Complete kit for <b>${productData.title}</b> — ${Math.round(net)} sq ft<span class="gg-custom-est-sub"> · edges &amp; corner ramps included${consultNote}</span>`;
    } else {
      els.customEst.style.display = 'none';
    }
  }
}

// Preferred order for the color a zone defaults to before the customer has
// picked anything — neutral tones first (never an unpicked color like Orange).
// Matched by keyword, not exact name, so this holds up across differently
// named color options on different products (e.g. "Slate Grey" vs "Storm Gray").
const DEFAULT_COLOR_KEYWORDS = [
  'jet black', 'black', 'slate grey', 'slate gray', 'royal blue', 'blue',
  'pearl silver', 'silver', 'grey', 'gray', 'white',
];

function pickDefaultColorName(colors, used) {
  for (const kw of DEFAULT_COLOR_KEYWORDS) {
    const match = colors.find(c => !used.has(c.name) && c.name.toLowerCase().includes(kw));
    if (match) return match.name;
  }
  const fallback = colors.find(c => !used.has(c.name)) || colors[0];
  return fallback.name;
}

function makeDefaultColors(colors, count) {
  const used = new Set();
  const zoneColors = [];
  for (let i = 0; i < count; i++) {
    const name = pickDefaultColorName(colors, used);
    used.add(name);
    zoneColors.push(name);
  }
  return zoneColors;
}

function renderKits() {
  if (!els.kitGrid) return;
  Array.from(els.kitGrid.children).forEach(btn => {
    const kit = btn.getAttribute('data-kit');
    if (state.kit === kit) {
      btn.classList.add('sel');
      btn.setAttribute('aria-pressed', 'true');
    } else {
      btn.classList.remove('sel');
      btn.setAttribute('aria-pressed', 'false');
    }
  });
}

function renderPatterns() {
  els.patGrid.innerHTML = '';
  PATTERNS.forEach(p => {
    const sel = state.pattern === p.id;
    const btn = document.createElement('button');
    btn.className = `gg-pat-card ${sel ? 'sel' : ''}`;
    btn.setAttribute('aria-pressed', sel);
    btn.onclick = () => {
      if (state.pattern === p.id) return;
      state.pattern = p.id;
      state.zoneColors = makeDefaultColors(currentColors, p.zones.length);
      state.dupWarn = null;
      renderPatterns();
      renderZones();
      renderStage();
      renderSummary();
      updatePriceAndCart();
    };
    btn.innerHTML = `
      ${sel ? '<span class="gg-pat-check">✓</span>' : ''}
      <span class="gg-pat-thumb">
        <img src="${p.thumb}" alt="${p.name}" loading="lazy">
      </span>
      <div class="gg-pat-name">${p.name}</div>
    `;
    els.patGrid.appendChild(btn);
  });
}

function renderZones() {
  els.zonesContainer.innerHTML = '';
  const p = PATTERNS.find(x => x.id === state.pattern);
  
  p.zones.forEach((zoneName, zi) => {
    const sel = state.zoneColors[zi];
    const div = document.createElement('div');
    div.className = 'gg-zone';
    
    let html = `
      <div class="gg-zone-head">
        <span class="gg-zone-name">${zoneName}</span>
        <span class="gg-zone-val">${sel}</span>
      </div>
      <div class="gg-tile-row">
    `;
    
    const tileRow = document.createElement('div');
    tileRow.className = 'gg-tile-row';
    
    currentColors.forEach(c => {
      const isSel = c.name === sel;
      const btn = document.createElement('button');
      btn.className = `gg-tile ${isSel ? 'sel' : ''}`;
      btn.setAttribute('aria-label', `${zoneName}: ${c.name}`);
      btn.setAttribute('aria-pressed', isSel);
      btn.title = c.name;
      btn.onclick = () => {
        if (p.noDuplicate) {
          const clash = state.zoneColors.findIndex((col, i) => i !== zi && col === c.name);
          if (clash !== -1) {
            state.dupWarn = zi;
            renderZones();
            return;
          }
        }
        state.zoneColors[zi] = c.name;
        state.dupWarn = null;
        renderZones();
        renderStage();
        renderSummary();
        updatePriceAndCart();
      };
      btn.innerHTML = c.image
        ? `<img class="gg-tile-fill" src="${c.image}" alt="" loading="lazy">`
        : `<span class="gg-tile-fill" style="background:${c.hex}"></span>`;
      tileRow.appendChild(btn);
    });
    
    div.innerHTML = `
      <div class="gg-zone-head">
        <span class="gg-zone-name">${zoneName}</span>
        <span class="gg-zone-val">${sel}</span>
      </div>
    `;
    div.appendChild(tileRow);
    
    const warn = document.createElement('div');
    warn.className = `gg-zone-warn ${state.dupWarn === zi ? 'show' : ''}`;
    warn.textContent = `${p.name} needs two different colors — that one is already used.`;
    div.appendChild(warn);
    
    els.zonesContainer.appendChild(div);
  });
}

const COLS = 20, ROWS = 13;
function getZoneIndex(pid, col, row) {
  const lc = COLS - 1, lr = ROWS - 1;
  switch (pid) {
    case "solid":
      return 0;
    case "checkered":
      return (col + row) % 2 === 0 ? 0 : 1;
    case "racetrack": {
      const onOuterBorder = col <= 1 || row <= 1 || col >= lc - 1 || row >= lr - 1;
      if (onOuterBorder) return 0;
      // Ring sits directly against the outer border (no gap tile) and is a
      // bounded rectangle outline, not two full-length crossing lines.
      const ringMinCol = 2, ringMaxCol = lc - 2;
      const ringMinRow = 2, ringMaxRow = lr - 2;
      const onInnerAccent =
        ((row === ringMinRow || row === ringMaxRow) && col >= ringMinCol && col <= ringMaxCol) ||
        ((col === ringMinCol || col === ringMaxCol) && row >= ringMinRow && row <= ringMaxRow);
      if (onInnerAccent) return 2;
      const insideAccent = col > ringMinCol && col < ringMaxCol && row > ringMinRow && row < ringMaxRow;
      if (insideAccent) {
        return (col + row) % 2 === 0 ? 0 : 1;
      }
      return 1;
    }
    case "showroom": {
      // Two parking bays (Parking Bays / color C), each hugged by its own
      // 1-tile highlight border (Highlight Border / color B), with exactly a
      // 1-tile gap between the two borders down the center aisle. Everything
      // else — the whole outer margin surrounding both — is the main floor
      // color (Main Floor / color A). The border is NOT the outer frame of
      // the whole diagram; it only outlines the two bays themselves.
      const boxW = 5, boxH = 7; // Parking Bays fill size (rectangle, +1 tile top/bottom)
      const ring = 1; // Highlight Border thickness around each bay
      const gap = 1; // Main Floor gap between the two borders, center aisle
      const blockW = boxW + ring * 2;
      const blockH = boxH + ring * 2;
      const groupW = blockW * 2 + gap;
      const marginX = Math.floor((COLS - groupW) / 2);
      const marginY = Math.floor((ROWS - blockH) / 2);

      const leftMinCol = marginX, leftMaxCol = marginX + blockW - 1;
      const rightMinCol = leftMaxCol + gap + 1, rightMaxCol = rightMinCol + blockW - 1;
      const blockMinRow = marginY, blockMaxRow = marginY + blockH - 1;

      const zoneForBlock = (blockMinCol, blockMaxCol) => {
        if (col < blockMinCol || col > blockMaxCol || row < blockMinRow || row > blockMaxRow) return null;
        const inBoxCol = col >= blockMinCol + ring && col <= blockMaxCol - ring;
        const inBoxRow = row >= blockMinRow + ring && row <= blockMaxRow - ring;
        return (inBoxCol && inBoxRow) ? 2 : 1;
      };
      return zoneForBlock(leftMinCol, leftMaxCol) ?? zoneForBlock(rightMinCol, rightMaxCol) ?? 0;
    }
    case "doubleborder": {
      const onOuter = col === 0 || row === 0 || col === lc || row === lr;
      if (onOuter) return 2;
      // Ring sits directly against the outer border (no gap tile) and is a
      // bounded rectangle outline, not two full-length crossing lines.
      const ringMinCol = 1, ringMaxCol = lc - 1;
      const ringMinRow = 1, ringMaxRow = lr - 1;
      const onInner =
        ((row === ringMinRow || row === ringMaxRow) && col >= ringMinCol && col <= ringMaxCol) ||
        ((col === ringMinCol || col === ringMaxCol) && row >= ringMinRow && row <= ringMaxRow);
      if (onInner) return 1;
      return 0;
    }
    default:
      return 0;
  }
}

function renderStage() {
  const p = PATTERNS.find(x => x.id === state.pattern);
  els.heroImg.src = p.hero;
  
  els.heroImg.classList.add('gg-fading');
  setTimeout(() => els.heroImg.classList.remove('gg-fading'), 60);

  els.npName.textContent = p.name;
  els.npColors.textContent = state.zoneColors.slice(0, p.zones.length).join(" + ");
  els.diagName.textContent = p.name;

  // Render SVG
  let svgInner = '';
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const zi = Math.min(getZoneIndex(p.id, c, r), p.zones.length - 1);
      const col = colorByName(state.zoneColors[zi]);
      svgInner += `<rect x="${c * 15}" y="${r * 15}" width="15" height="15" fill="${col.hex}" stroke="rgba(255,255,255,.10)" stroke-width="0.5"></rect>`;
    }
  }
  els.svgContainer.innerHTML = `<svg viewBox="0 0 ${COLS * 15} ${ROWS * 15}" role="img" aria-label="Live color zone preview">${svgInner}</svg>`;

  // Render Legend
  els.stageLegend.innerHTML = '';
  p.zones.forEach((zName, zi) => {
    const c = colorByName(state.zoneColors[zi]);
    const span = document.createElement('span');
    span.className = 'gg-stage-leg';
    span.innerHTML = `
      <span class="gg-stage-leg-dot" style="background: ${c.hex}"></span>
      <b>${zName}</b>
      <em>${c.name}</em>
    `;
    els.stageLegend.appendChild(span);
  });
}


// Builds the same "Your Selections" data as plain text, for the quote email body.
function buildSelectionsText() {
  if (!productData) return '';
  const p = PATTERNS.find(x => x.id === state.pattern);

  let sizeLabel = KIT_LABELS[state.kit];
  if (state.kit === 'custom') {
    sizeLabel = getCustomSizeLabel();
  }

  const lines = [
    `Size: ${sizeLabel}`,
    `Collection: ${productData.title}`,
    `Tile Size: ${currentTileInches}" x ${currentTileInches}"`,
    `Pattern: ${p.name}`,
  ];
  p.zones.forEach((z, zi) => {
    const c = colorByName(state.zoneColors[zi]);
    lines.push(`${z}: ${c.name}`);
  });

  if (state.kit === 'custom') {
    lines.push(`Project Type: ${state.projectType}`);
    if (state.width && state.length) lines.push(`Floor Size: ${state.width}ft x ${state.length}ft`);
    lines.push(`Floor Shape: ${state.shape === 'lshape' ? 'L-shape (cut-out)' : 'Rectangle'}`);
    const net = Math.round(netSqft());
    if (net > 0) lines.push(`Net Area: ${net} sq ft`);
  }

  return lines.join('\n');
}

// Rasterizes the live zone-guide SVG to an offscreen <canvas>. Shared by the
// plain PNG download (mailto/quote flow) and the PDF summary (spec sheet flow).
function rasterizeDesignCanvas() {
  return new Promise((resolve, reject) => {
    const svgEl = els.svgContainer ? els.svgContainer.querySelector('svg') : null;
    if (!svgEl) { reject(new Error('No design preview to rasterize')); return; }

    const xml = new XMLSerializer().serializeToString(svgEl);
    let svg64;
    try {
      svg64 = btoa(unescape(encodeURIComponent(xml)));
    } catch (err) {
      reject(err);
      return;
    }

    const img = new Image();
    img.onload = () => {
      try {
        const scale = 3;
        const w = COLS * 15, h = ROWS * 15;
        const canvas = document.createElement('canvas');
        canvas.width = w * scale;
        canvas.height = h * scale;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#0E0F11';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas);
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error('Design preview image failed to load'));
    img.src = 'data:image/svg+xml;base64,' + svg64;
  });
}

// Rasterizes the live zone-guide SVG to a PNG and triggers a browser download.
// Resolves true/false depending on whether the download actually fired — callers
// should still proceed to open the mailto link either way (best-effort image).
function downloadDesignImage(filename) {
  return rasterizeDesignCanvas()
    .then((canvas) => new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) { resolve(false); return; }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 4000);
        resolve(true);
      }, 'image/png');
    }))
    .catch(() => false);
}

// Lazy-loads jsPDF the first time a PDF is needed, so product pages that never
// use "Download Design Summary" don't pay for it on every load. Self-hosted as
// a theme asset (see window.GG_JSPDF_URL, set in react-configurator.liquid) so
// this never breaks on a CDN version mismatch/outage; a public CDN is only a
// last-resort fallback if the local asset URL wasn't set for some reason.
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
  const primary = window.GG_JSPDF_URL;
  const cdnFallback = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js';
  jsPDFLoadPromise = (primary ? loadJsPDFFrom(primary) : Promise.reject(new Error('No local jsPDF URL')))
    .catch(() => loadJsPDFFrom(cdnFallback));
  return jsPDFLoadPromise;
}

// A site can never make a mailto: link auto-attach a file — no browser or mail
// client allows that (it would let any page silently attach arbitrary files to
// a user's outgoing mail). This is the closest real equivalent: download the
// design image, then open a pre-filled email and tell the person to attach it.
let quoteToastTimer = null;
function showQuoteToast(message) {
  if (!els.quoteToast) return;
  els.quoteToast.textContent = message;
  els.quoteToast.classList.add('show');
  if (quoteToastTimer) window.clearTimeout(quoteToastTimer);
  quoteToastTimer = window.setTimeout(() => {
    els.quoteToast.classList.remove('show');
  }, 6000);
}

// "Download Design Summary" — a single PDF with the live design image AND the
// full text specification sheet (kit size, series, pattern, colors), so the
// customer and we both have the exact spec on hand, not just a picture.
async function handleDownloadDesign(e) {
  if (e) e.preventDefault();
  const p = PATTERNS.find(x => x.id === state.pattern);
  const filenameSlug = (productData ? productData.title : 'gridgarage') + '-' + p.name;
  const cleanSlug = filenameSlug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  try {
    const [canvas, JsPDF] = await Promise.all([rasterizeDesignCanvas(), loadJsPDF()]);
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
    doc.text(productData ? productData.title : '', margin, y);
    doc.text(new Date().toLocaleDateString(), pageW - margin, y, { align: 'right' });
    y += 22;

    const imgW = pageW - margin * 2;
    const imgH = imgW * (canvas.height / canvas.width);
    doc.addImage(imgData, 'PNG', margin, y, imgW, imgH);
    y += imgH + 26;

    doc.setDrawColor(224, 224, 224);
    doc.line(margin, y, pageW - margin, y);
    y += 24;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(20);
    doc.text('Specifications', margin, y);
    y += 20;

    doc.setFontSize(11);
    buildSelectionsText().split('\n').forEach((line) => {
      if (!line) return;
      if (y > pageH - margin) { doc.addPage(); y = margin; }
      const sep = line.indexOf(':');
      const label = sep === -1 ? line : line.slice(0, sep + 1);
      const value = sep === -1 ? '' : line.slice(sep + 1).trim();
      doc.setFont('helvetica', 'bold');
      doc.text(label, margin, y);
      doc.setFont('helvetica', 'normal');
      doc.text(value, margin + 140, y);
      y += 18;
    });

    y += 12;
    if (y > pageH - margin) { doc.addPage(); y = margin; }
    // This button only appears where a live price is shown (the consultation
    // branch has no "Download Design Summary" button at all), so mirror the
    // same "Total Price" the customer already sees on the add-to-cart card
    // instead of assuming pricing is unavailable.
    const priceShown = els.priceAmt && els.priceAmt.textContent ? els.priceAmt.textContent.trim() : '';
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(20);
    doc.text(priceShown ? `Total Price: ${priceShown}` : 'Please call or email us for pricing — info@gridgarageinc.com', margin, y);

    doc.save(`gridgarage-design-summary-${cleanSlug}.pdf`);
    showQuoteToast('Design summary PDF downloaded!');
  } catch (err) {
    // CDN blocked, ad-blocker, etc. — still give the customer something useful.
    const downloaded = await downloadDesignImage(`gridgarage-design-${cleanSlug}.png`);
    if (downloaded) {
      showQuoteToast('PDF unavailable — downloaded design image instead.');
    } else {
      showQuoteToast('Failed to generate design summary. Please try again.');
    }
  }
}

const STATE_STORAGE_PREFIX = 'gg-config-state-';

function getStateStorageKey() {
  if (!productData || !productData.id) return null;
  return STATE_STORAGE_PREFIX + productData.id;
}

// Keeps the in-progress design alive across a full page reload — e.g. a
// customer adds to cart, opens the cart to double-check their layout, then
// clicks back into the product. sessionStorage (not localStorage) so a design
// only survives the current shopping session, not indefinitely across visits.
function persistState() {
  const key = getStateStorageKey();
  if (!key || typeof window.sessionStorage === 'undefined') return;
  try {
    window.sessionStorage.setItem(key, JSON.stringify({
      kit: state.kit,
      pattern: state.pattern,
      zoneColors: state.zoneColors,
      width: state.width,
      length: state.length,
      shape: state.shape,
      cutouts: state.cutouts,
      projectType: state.projectType,
      customRecommendedKit: state.customRecommendedKit,
    }));
  } catch (err) {
    // Private-browsing / storage-quota failures should never break the configurator.
  }
}

// Returns true if a saved design for this exact product was found and applied.
function restoreState() {
  const key = getStateStorageKey();
  if (!key || typeof window.sessionStorage === 'undefined') return false;
  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return false;
    const saved = JSON.parse(raw);
    if (!saved || typeof saved !== 'object') return false;

    const pattern = PATTERNS.find(x => x.id === saved.pattern);
    if (!pattern) return false;

    state.kit = saved.kit || state.kit;
    state.pattern = saved.pattern;
    state.zoneColors = Array.isArray(saved.zoneColors) && saved.zoneColors.length === pattern.zones.length
      ? saved.zoneColors
      : makeDefaultColors(currentColors, pattern.zones.length);
    state.width = saved.width ?? null;
    state.length = saved.length ?? null;
    state.shape = saved.shape === 'lshape' ? 'lshape' : 'rect';
    state.cutouts = Array.isArray(saved.cutouts) ? saved.cutouts : [];
    state.projectType = saved.projectType || state.projectType;
    state.customRecommendedKit = saved.customRecommendedKit || null;

    if (els.dimW) els.dimW.value = state.width ?? '';
    if (els.dimL) els.dimL.value = state.length ?? '';
    if (els.projectType) els.projectType.value = state.projectType;

    return true;
  } catch (err) {
    return false;
  }
}

function updatePriceAndCart() {
  if (!productData) return;

  let targetVariant = null;
  let price = 0;
  const net = Math.round(netSqft());
  const isConsultation = isPriceByConsultation();

  if (state.kit === 'custom') {
    targetVariant = getCustomCartVariant();
  } else {
    targetVariant = findKitVariant(state.kit, state.zoneColors[0]);
  }

  const isLargeCustomQuote = state.kit === 'custom' && net > KIT_SQFT['3car'] && isConsultation;
  const isQuoteState = state.kit === 'custom' && (net <= 0 || isLargeCustomQuote);

  let priceText = "Unavailable";
  if (state.kit === 'custom') {
    // Custom kit's own variant (getCustomCartVariant) is a real Shopify
    // variant even before a size is entered — it exists so Add to Cart has
    // something to submit, not because there's a price to show yet. Never
    // fall through to its raw unit price here; no size means no price.
    if (net > 0 && !isLargeCustomQuote) {
      const calc = calculateCustomSpacePrice(net);
      if (calc) {
        price = calc;
        priceText = formatPrice(calc);
      } else if (targetVariant) {
        price = variantPriceCents(targetVariant);
        priceText = formatPrice(price);
      } else {
        priceText = "—";
      }
    } else {
      priceText = "—";
    }
  } else if (targetVariant) {
    price = variantPriceCents(targetVariant);
    priceText = formatPrice(price);
  }
  if (els.priceAmt) els.priceAmt.textContent = priceText;
  if (els.stickyPrice) els.stickyPrice.textContent = priceText;

  state.priceUnavailable = !targetVariant && !isQuoteState;
  if (els.variantId) els.variantId.value = targetVariant ? targetVariant.id : '';

  // Quantity = sqft only when we actually landed on the real per-sqft-priced
  // variant — that's what makes unit price × quantity equal the on-page
  // estimate at checkout. Every other case (standard kits, oversized-quote,
  // consultation) stays quantity 1, same as always.
  if (els.addQty) {
    const usingPerSqft = state.kit === 'custom' && targetVariant &&
      variantOptionValues(targetVariant).some(o => o && /per[\s-]*sq/i.test(o));
    els.addQty.value = usingPerSqft ? Math.max(1, net) : 1;
  }

  // Line item properties — temporarily disabled.
  // Cart should show selected variant data only (e.g. Color: White / Color: Black).
  // const p = PATTERNS.find(x => x.id === state.pattern);
  // let propsHtml = `<input type="hidden" name="properties[Pattern]" value="${p.name}">`;
  // p.zones.forEach((z, zi) => {
  //   propsHtml += `<input type="hidden" name="properties[${z}]" value="${state.zoneColors[zi]}">`;
  // });
  // if (state.kit === 'custom') {
  //   const net = Math.round(netSqft());
  //   propsHtml += `<input type="hidden" name="properties[Project Type]" value="${state.projectType}">`;
  //   if (state.width && state.length) {
  //     propsHtml += `<input type="hidden" name="properties[Floor Size]" value="${state.width}ft × ${state.length}ft">`;
  //   }
  //   propsHtml += `<input type="hidden" name="properties[Floor Shape]" value="${state.shape === 'lshape' ? 'L-shape (cut-out)' : 'Rectangle'}">`;
  //   if (net > 0) {
  //     propsHtml += `<input type="hidden" name="properties[Net Area]" value="${net} sq ft">`;
  //   }
  // }
  if (els.propsContainer) els.propsContainer.innerHTML = '';

  updateCollectionCardPrices();
  persistState();
}

// "Choose Your Collection" cards show each sibling product's real kit price
// (not its cheapest/per-tile variant) for the currently selected kit size —
// and for Design My Space, no price at all until a size is entered, then
// that product's $/sqft rate × the customer's net area. Data attributes are
// set once in Liquid (see react-configurator.liquid); this just re-picks
// which one to display whenever kit/size state changes.
function updateCollectionCardPrices() {
  const cards = document.querySelectorAll('.gg-coll-price[data-price-2car]');
  if (!cards.length) return;
  const net = Math.round(netSqft());
  cards.forEach((el) => {
    const p2 = parseInt(el.getAttribute('data-price-2car'), 10) || 0;
    const p3 = parseInt(el.getAttribute('data-price-3car'), 10) || 0;
    const perSqft = parseInt(el.getAttribute('data-price-per-sqft'), 10) || 0;

    if (state.kit === 'custom') {
      el.textContent = (net > 0 && perSqft > 0) ? formatPrice(Math.round(net * perSqft)) : '';
      return;
    }
    const cents = state.kit === '3car' ? p3 : p2;
    el.textContent = cents ? formatPrice(cents) : '';
  });
}

function renderSummary() {
  if (!productData) return;
  const p = PATTERNS.find(x => x.id === state.pattern);

  let sizeLabel = KIT_LABELS[state.kit];
  if (state.kit === 'custom') {
    sizeLabel = getCustomSizeLabel();
  }

  let html = `
    <div class="gg-sel-item">
      <span class="gg-sel-l">Size</span>
      <span class="gg-sel-v">${sizeLabel}</span>
    </div>
  `;

  if (state.kit === 'custom') {
    const net = Math.round(netSqft());
    html += `
      <div class="gg-sel-item">
        <span class="gg-sel-l">Project</span>
        <span class="gg-sel-v">${state.projectType}</span>
      </div>
      <div class="gg-sel-item">
        <span class="gg-sel-l">Total Sq Ft</span>
        <span class="gg-sel-v">${net > 0 ? `${net} sq ft` : '—'}</span>
      </div>
    `;
  }

  html += `
    <div class="gg-sel-item">
      <span class="gg-sel-l">Collection</span>
      <span class="gg-sel-v">${productData.title}</span>
    </div>
    <div class="gg-sel-item">
      <span class="gg-sel-l">Tile Size</span>
      <span class="gg-sel-v">${currentTileInches}&quot; × ${currentTileInches}&quot;</span>
    </div>
    <div class="gg-sel-item">
      <span class="gg-sel-l">Pattern</span>
      <span class="gg-sel-v">${p.name}</span>
    </div>
  `;
  
  p.zones.forEach((z, zi) => {
    const c = colorByName(state.zoneColors[zi]);
    html += `
      <div class="gg-sel-item">
        <span class="gg-sel-l">${z}</span>
        <span class="gg-sel-v">
          <span class="gg-s-dot" style="background: ${c.hex}"></span>
          ${c.name}
        </span>
      </div>
    `;
  });
  
  els.selList.innerHTML = html;
}

// Remove old "Choose Your Design Style" picker and duplicate Shopify/HulkApps variant pickers
// that conflict with the new configurator's left-panel pattern + color selectors
function hideAppOptions() {
  const labelsToHide = [
    "choose your design style",
    "tile color a",
    "tile color b",
    "tile color c",
    "floor color",
    "border color",
    "design style",
    "pattern",
    "a-center floor color",
    "b-inner border color",
    "c-outer border color"
  ];

  document.querySelectorAll('.hulkapps_option, .hulkapps-option, [class*="hulkapps_option"], .product-form__input, .product-form__item, fieldset, .gg-picker-wrap').forEach(container => {
    const text = container.textContent.toLowerCase();
    if (labelsToHide.some(l => text.includes(l))) {
      // Extra safety check so we don't accidentally remove the whole form
      if (container.tagName !== 'FORM' && container.tagName !== 'BODY') {
        container.style.display = 'none';
        container.setAttribute('aria-hidden', 'true');
        container.innerHTML = '';
        
        // Hide parent wrappers if they are now empty/useless
        let curr = container.parentElement;
        while (curr && curr.tagName !== 'FORM' && curr.tagName !== 'BODY') {
          // Check if parent has any visible non-empty text content left
          if (curr.textContent.trim() === '') {
             curr.style.display = 'none';
          }
          curr = curr.parentElement;
        }
      }
    }
  });
}

function removeOldPickers() {
  // 1. Remove the old gg-pattern-color-picker widget container if it exists
  const oldPickerContainer = document.getElementById('gg-pattern-color-picker-container');
  if (oldPickerContainer) {
    const wrapper = oldPickerContainer.closest('.product__block, .product-form__block, .product-form__input, fieldset, .shopify-block') || oldPickerContainer;
    wrapper.style.display = 'none';
    wrapper.innerHTML = '';
  }

  // 2. Hide HulkApps / Shopify options immediately
  hideAppOptions();

  // 3. Observe body for dynamically injected app options
  const observer = new MutationObserver((mutations) => {
    let shouldCheck = false;
    for (const mutation of mutations) {
      if (mutation.addedNodes.length) {
        shouldCheck = true;
        break;
      }
    }
    if (shouldCheck) hideAppOptions();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // 4. Kill the old GGPatternColorPicker instance if it exists
  if (window.ggPatternColorPicker) {
    try { window.ggPatternColorPicker.container.style.display = 'none'; } catch (_) {}
    window.ggPatternColorPicker = null;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  removeOldPickers();
  init();
});

