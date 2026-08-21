if (!customElements.get('product-share-icons')) {
  customElements.define(
    'product-share-icons',
    class ProductShareIcons extends HTMLElement {
      updateUrl(url) {
        const encUrl = encodeURIComponent(url);
        const title = this.dataset.shareTitle || document.title;
        const encTitle = encodeURIComponent(title);
        const media = this.dataset.shareMedia || '';

        const facebook = this.querySelector('[data-share-network="facebook"]');
        if (facebook) {
          facebook.href = `https://www.facebook.com/sharer.php?u=${encUrl}`;
        }

        const twitter = this.querySelector('[data-share-network="twitter"]');
        if (twitter) {
          twitter.href = `https://twitter.com/intent/tweet?url=${encUrl}&text=${encTitle}`;
        }

        const pinterest = this.querySelector('[data-share-network="pinterest"]');
        if (pinterest) {
          let href = `https://www.pinterest.com/pin/create/button/?url=${encUrl}&description=${encTitle}`;
          if (media) {
            href += `&media=${encodeURIComponent(media)}`;
          }
          pinterest.href = href;
        }
      }
    }
  );
}
