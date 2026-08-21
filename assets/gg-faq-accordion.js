/**
 * FAQ Accordion functionality
 * Handles click events, toggles visibility, and manages accordion behavior
 */

(function () {
  'use strict';

  const selectors = {
    section: '[data-section-id]',
    item: '.gg-faq__item',
    question: '.gg-faq__question'
  };

  const classes = {
    open: 'is-open'
  };

  /**
   * Initialize FAQ accordion
   */
  function initFaqAccordion() {
    const sections = document.querySelectorAll(selectors.section);

    sections.forEach(function (section) {
      const items = section.querySelectorAll(selectors.item);

      items.forEach(function (item) {
        const question = item.querySelector(selectors.question);

        if (!question) return;

        question.addEventListener('click', function () {
          const isOpen = item.classList.contains(classes.open);

          // Close all items in this section (accordion behavior)
          items.forEach(function (otherItem) {
            if (otherItem !== item && otherItem.classList.contains(classes.open)) {
              otherItem.classList.remove(classes.open);
              const otherQuestion = otherItem.querySelector(selectors.question);
              if (otherQuestion) {
                otherQuestion.setAttribute('aria-expanded', 'false');
              }
            }
          });

          // Toggle current item
          if (isOpen) {
            item.classList.remove(classes.open);
            question.setAttribute('aria-expanded', 'false');
          } else {
            item.classList.add(classes.open);
            question.setAttribute('aria-expanded', 'true');
          }
        });
      });
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFaqAccordion);
  } else {
    initFaqAccordion();
  }
})();
