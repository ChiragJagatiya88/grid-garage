/**
 * Recently viewed products — loads product cards via Section Rendering API.
 * Storage key must match snippets/recently-viewed-record.liquid
 */
class RecentlyViewedProducts extends HTMLElement {
  static STORAGE_KEY = 'grid-garage-recently-viewed';
  static CARD_SECTION = 'recently-viewed-product-card';

  observer = undefined;

  connectedCallback() {
    this.innerWrapper = this.querySelector('[data-recently-viewed-inner]');
    this.listEl = this.querySelector('[data-recently-viewed-list]');
    this.sectionEl = this.closest('.shopify-section');

    this.observer = new IntersectionObserver(
      (entries, obs) => {
        if (!entries[0].isIntersecting) return;
        obs.unobserve(this);
        this.loadProducts();
      },
      { rootMargin: '0px 0px 400px 0px' }
    );
    this.observer.observe(this);
  }

  disconnectedCallback() {
    this.observer?.disconnect();
  }

  async loadProducts() {
    const base = this.dataset.productsBase || '/products/';
    const limit = Math.max(1, Math.min(12, parseInt(this.dataset.limit, 10) || 4));
    const current = (this.dataset.currentProductHandle || '').trim();

    let handles = [];
    try {
      handles = JSON.parse(localStorage.getItem(RecentlyViewedProducts.STORAGE_KEY) || '[]');
    } catch {
      handles = [];
    }
    if (!Array.isArray(handles)) handles = [];

    const filtered = handles.filter((h) => typeof h === 'string' && h.length > 0 && h !== current).slice(0, limit);

    if (filtered.length === 0) {
      this.hideSection();
      return;
    }

    const sectionName = RecentlyViewedProducts.CARD_SECTION;
    const fetches = filtered.map(async (handle, index) => {
      const url = `${base}${encodeURIComponent(handle)}?sections=${encodeURIComponent(sectionName)}`;
      try {
        const res = await fetch(url);
        if (!res.ok) return { index, html: null };
        const data = await res.json();
        let fragment = data[sectionName];
        if (!fragment && data.sections && typeof data.sections === 'object') {
          fragment = data.sections[sectionName];
        }
        if (!fragment || typeof fragment !== 'string') return { index, html: null };
        return { index, html: fragment };
      } catch {
        return { index, html: null };
      }
    });

    const results = (await Promise.all(fetches)).filter((r) => r.html).sort((a, b) => a.index - b.index);

    if (results.length === 0) {
      this.hideSection();
      return;
    }

    const parser = new DOMParser();
    for (const { html } of results) {
      const doc = parser.parseFromString(html, 'text/html');
      const item =
        doc.querySelector('.recently-viewed-product-card__extract > li.grid__item') ||
        doc.querySelector('ul li.grid__item') ||
        doc.querySelector('li.grid__item');
      if (item && this.listEl) {
        this.listEl.appendChild(document.importNode(item, true));
      }
    }

    if (this.innerWrapper) {
      this.innerWrapper.hidden = false;
    }
    this.classList.add('recently-viewed-products--loaded');
  }

  hideSection() {
    if (this.sectionEl) {
      this.sectionEl.hidden = true;
    }
  }
}

customElements.define('recently-viewed-products', RecentlyViewedProducts);
