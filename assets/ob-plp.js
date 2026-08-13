(() => {
  const COLOR_PARAM = 'filter.v.m.custom.filtercolors';

  const normalizeSingleColorUrl = () => {
    const container = document.querySelector('.facets-container[data-ob-color-selection="single"]');
    if (!container) return;

    const url = new URL(window.location.href);
    const values = url.searchParams.getAll(COLOR_PARAM);
    if (values.length <= 1) return;

    const retainedValue = values[0];
    url.searchParams.delete(COLOR_PARAM);
    url.searchParams.append(COLOR_PARAM, retainedValue);

    const searchParams = url.searchParams.toString();
    const canonicalPath = `${url.pathname}${searchParams ? `?${searchParams}` : ''}${url.hash}`;
    history.replaceState({ searchParams }, '', canonicalPath);

    const form = document.querySelector('facet-filters-form');
    if (form && typeof form.onSubmitForm === 'function') {
      form.onSubmitForm(searchParams);
      return;
    }

    window.location.replace(url.toString());
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', normalizeSingleColorUrl, { once: true });
  } else {
    normalizeSingleColorUrl();
  }
})();

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

(() => {
  const STORAGE_KEY = 'ob-plp-filter-bar';

  document.addEventListener('click', (event) => {
    const toggle = event.target.closest('[data-ob-bar-toggle]');
    if (!toggle) return;

    const panel = document.getElementById(toggle.getAttribute('aria-controls'));
    if (!panel) return;

    const willOpen = panel.hidden;
    panel.hidden = !willOpen;
    toggle.setAttribute('aria-expanded', String(willOpen));

    try {
      localStorage.setItem(STORAGE_KEY, willOpen ? 'open' : 'closed');
    } catch (error) {
      /* Storage blocked: state remains valid for the current page. */
    }

    if (!willOpen) return;
    requestAnimationFrame(() => {
      const bar = toggle.closest('.ob-mobile-bar');
      const grid = document.getElementById('product-grid');
      if (!bar || !grid) return;

      const barTop = bar.getBoundingClientRect().top;
      const gridTop = grid.getBoundingClientRect().top;
      const needed = Math.max(gridTop - window.innerHeight + 24, 0);
      const allowed = Math.max(barTop - 80, 0);
      const delta = Math.min(needed, allowed);
      if (delta > 0) window.scrollBy({ top: delta, behavior: 'smooth' });
    });
  });
})();

(() => {
  const button = document.querySelector('.ob-summon-filters');
  const panel = button && document.getElementById(button.dataset.obSummonTarget);
  const aside = panel && panel.closest('aside');
  if (!button || !panel || !aside || typeof IntersectionObserver !== 'function') return;

  const offset = Number.parseFloat(getComputedStyle(button).top) || 0;

  const resetPanel = () => {
    panel.style.removeProperty('position');
    panel.style.removeProperty('left');
    panel.style.removeProperty('top');
  };

  const parkPanel = () => {
    const asideRect = aside.getBoundingClientRect();
    const panelHeight = panel.getBoundingClientRect().height;
    const targetTop = Math.max(asideRect.top, Math.min(offset, asideRect.bottom - panelHeight));

    if (targetTop <= asideRect.top) {
      resetPanel();
      return;
    }

    panel.style.position = 'absolute';
    panel.style.left = '0';
    panel.style.top = `${targetTop - asideRect.top}px`;
  };

  new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => button.classList.toggle('ob-summon-filters--visible', !entry.isIntersecting));
    },
    { threshold: 0, rootMargin: `${-offset}px 0px 0px 0px` },
  ).observe(panel);

  const sentinel = document.createElement('span');
  sentinel.setAttribute('aria-hidden', 'true');
  sentinel.style.cssText =
    'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;visibility:hidden;';
  aside.append(sentinel);

  new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && panel.style.position) resetPanel();
    });
  }).observe(sentinel);

  button.addEventListener('click', parkPanel);

  window.OBFilters = window.OBFilters || {};
  window.OBFilters.reclampPanel = () => {
    if (panel.style.position) parkPanel();
  };
})();
