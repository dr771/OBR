(() => {
  const SELECTOR = '[data-ob-load-more]';

  const normalizeAppendedCard = (card) => {
    card.classList.remove('scroll-trigger', 'animate--slide-in', 'scroll-trigger--cancel');
    card.removeAttribute('data-cascade');
    card.style.removeProperty('--animation-order');

    card.querySelectorAll('img').forEach((image) => {
      image.removeAttribute('fetchpriority');
      image.loading = 'lazy';
    });
  };

  const loadMore = async (button) => {
    const nextUrl = button.dataset.obNextUrl;
    const sectionId = button.dataset.obSectionId;
    if (!nextUrl || !sectionId || button.disabled) return;

    const originalLabel = button.textContent;
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    button.textContent = 'Laden…';

    try {
      const url = new URL(nextUrl, window.location.origin);
      url.searchParams.set('section_id', sectionId);

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error(`Load-more request failed (${response.status})`);

      const responseDocument = new DOMParser().parseFromString(await response.text(), 'text/html');
      const sourceGrid = responseDocument.getElementById('product-grid');
      const targetGrid = document.getElementById('product-grid');
      const sourceControl = responseDocument.querySelector('.ob-load-more');
      const targetControl = button.closest('.ob-load-more');

      if (!sourceGrid || !targetGrid || !targetControl) throw new Error('Load-more response is incomplete');

      const cards = [...sourceGrid.children];
      if (!cards.length) throw new Error('Load-more response contains no products');

      const fragment = document.createDocumentFragment();
      cards.forEach((card) => {
        normalizeAppendedCard(card);
        fragment.append(card);
      });
      targetGrid.append(fragment);

      if (sourceControl) {
        targetControl.replaceWith(sourceControl);
      } else {
        targetControl.remove();
      }
    } catch (error) {
      console.warn('[OB PLP] Unable to load more products.', error);
      button.disabled = false;
      button.removeAttribute('aria-busy');
      button.textContent = originalLabel;
    }
  };

  document.addEventListener('click', (event) => {
    const button = event.target.closest(SELECTOR);
    if (!button) return;
    loadMore(button);
  });
})();
