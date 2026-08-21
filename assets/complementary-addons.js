if (!customElements.get('complementary-addon-item')) {
  customElements.define(
    'complementary-addon-item',
    class ComplementaryAddonItem extends HTMLElement {
      constructor() {
        super();
        this._onSelectChange = this._onSelectChange.bind(this);
        this._onCheckboxChange = this._onCheckboxChange.bind(this);
      }

      connectedCallback() {
        this.selectEl = this.querySelector('[data-addon-variant-select]');
        this.qtyEl = this.querySelector('[data-addon-quantity]');
        this.checkboxEl = this.querySelector('[data-addon-checkbox]');
        this.priceEl = this.querySelector('[data-addon-price]');
        this.errorEl = this.querySelector('[data-addon-error]');

        const jsonEl = this.querySelector('[data-addon-variants]');
        try {
          this.variantData = jsonEl ? JSON.parse(jsonEl.textContent) : { variants: [] };
        } catch (e) {
          this.variantData = { variants: [] };
        }

        this.selectEl?.addEventListener('change', this._onSelectChange);
        this.checkboxEl?.addEventListener('change', this._onCheckboxChange);
        this._syncPriceFromSelect();
      }

      disconnectedCallback() {
        this.selectEl?.removeEventListener('change', this._onSelectChange);
        this.checkboxEl?.removeEventListener('change', this._onCheckboxChange);
      }

      _onSelectChange() {
        this._syncPriceFromSelect();
        this._hideError();
      }

      /**
       * Checkbox only marks the add-on for inclusion with the main Add to cart action.
       */
      _onCheckboxChange() {
        this._hideError();
        if (!this.checkboxEl?.checked) return;

        const variantId = this.getVariantId();
        const variant = this.variantData.variants?.find((x) => String(x.id) === String(variantId));
        if (!variant || !variant.available) {
          this._showError(window.variantStrings?.unavailable || 'Unavailable');
          this.checkboxEl.checked = false;
        }
      }

      _syncPriceFromSelect() {
        if (!this.priceEl) return;
        const opt = this.selectEl?.selectedOptions[0];
        if (opt?.dataset.priceFormatted) {
          this.priceEl.textContent = opt.dataset.priceFormatted;
          return;
        }
        const id = this.getVariantId();
        const v = this.variantData.variants?.find((x) => String(x.id) === String(id));
        if (v?.price_formatted) this.priceEl.textContent = v.price_formatted;
      }

      getVariantId() {
        if (this.selectEl) return this.selectEl.value;
        return this.dataset.defaultVariantId;
      }

      getQuantity() {
        const raw = parseInt(this.qtyEl?.value, 10);
        if (Number.isNaN(raw) || raw < 1) return 1;
        return raw;
      }

      _hideError() {
        if (!this.errorEl) return;
        this.errorEl.hidden = true;
        this.errorEl.textContent = '';
      }

      _showError(msg) {
        if (!this.errorEl) return;
        this.errorEl.textContent = msg;
        this.errorEl.hidden = false;
      }
    }
  );
}

/**
 * After the main product is added, append each checked complementary add-on (same request chain).
 * @param {HTMLElement} cart - cart-notification or cart-drawer
 * @param {object} initialResponse - JSON from the main product /cart/add.js call
 * @param {ParentNode} [scope] - e.g. closest product-info (avoids quick-add modal picking main page add-ons)
 * @returns {Promise<{ ok: boolean, lastResponse: object, message?: string }>}
 */
window.addCheckedComplementaryAddonsToCart = async function (cart, initialResponse, scope) {
  let lastResponse = initialResponse;
  const root = scope || document;
  const addons = root.querySelectorAll('complementary-addon-item');

  for (const el of addons) {
    const checkbox = el.querySelector('[data-addon-checkbox]');
    if (!checkbox?.checked) continue;

    const variantId = el.getVariantId();
    const variant = el.variantData?.variants?.find((x) => String(x.id) === String(variantId));
    if (!variant?.available) {
      el._showError(window.variantStrings?.unavailable || 'Unavailable');
      checkbox.checked = false;
      return { ok: false, lastResponse, message: window.variantStrings?.unavailable };
    }

    const formData = new FormData();
    formData.append('id', variantId);
    formData.append('quantity', String(el.getQuantity()));
    formData.append('sections', cart.getSectionsToRender().map((section) => section.id));
    formData.append('sections_url', window.location.pathname);

    const config = fetchConfig('javascript');
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    delete config.headers['Content-Type'];
    config.body = formData;

    try {
      const res = await fetch(`${routes.cart_add_url}`, config);
      const data = await res.json();

      if (data.status) {
        publish(PUB_SUB_EVENTS.cartError, {
          source: 'complementary-addon-item',
          productVariantId: variantId,
          errors: data.errors || data.description,
          message: data.message,
        });
        el._showError(data.description || window.cartStrings?.error || 'Error');
        checkbox.checked = false;
        return { ok: false, lastResponse, message: data.description };
      }

      lastResponse = data;
    } catch (e) {
      console.error(e);
      el._showError(window.cartStrings?.error || 'Error');
      checkbox.checked = false;
      return { ok: false, lastResponse, message: window.cartStrings?.error };
    }
  }

  return { ok: true, lastResponse };
};
