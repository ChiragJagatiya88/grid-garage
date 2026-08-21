/**
 * Collection facets (drawer): open header search from button inside .facets-container.
 */
(function () {
  if (window.__collectionFacetsSearchInit) return;
  window.__collectionFacetsSearchInit = true;

  document.addEventListener('click', function (event) {
    const btn = event.target.closest('[data-open-header-search]');
    if (!btn) return;
    event.preventDefault();
    const summary = document.querySelector('details-modal.header__search summary.header__icon--search');
    if (summary) summary.click();
  });
})();
