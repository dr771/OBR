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

/*
  Load more appends native result pages. The pages a shopper loaded and their
  scroll offset live in this history entry's state, so returning from a PDP
  (a fresh load whenever the bfcache misses) re-appends them and scrolls back
  instead of dropping the shopper on the first page. Dawn's facets popstate
  handler reads `searchParams` from the same state, so it is always kept.
*/
(() => {
  const SELECTOR = '[data-ob-load-more]';
  const STATE_KEY = 'obLoadMore';

  const normalizeAppendedCard = (card) => {
    card.classList.remove('scroll-trigger', 'animate--slide-in', 'scroll-trigger--cancel');
    card.removeAttribute('data-cascade');
    card.style.removeProperty('--animation-order');

    card.querySelectorAll('img').forEach((image) => {
      image.removeAttribute('fetchpriority');
      image.loading = 'lazy';
    });
  };

  const readState = () => (history.state && history.state[STATE_KEY]) || { pages: [] };

  const writeState = (patch) => {
    const current = history.state || {};
    const searchParams =
      typeof current.searchParams === 'string' ? current.searchParams : window.location.search.slice(1);
    try {
      history.replaceState({ ...current, searchParams, [STATE_KEY]: { ...readState(), ...patch } }, '');
    } catch (error) {
      /* State unavailable: load more still works, it just isn't restored. */
    }
  };

  const fetchPage = async (nextUrl, sectionId) => {
    const url = new URL(nextUrl, window.location.origin);
    url.searchParams.set('section_id', sectionId);

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error(`Load-more request failed (${response.status})`);

    const responseDocument = new DOMParser().parseFromString(await response.text(), 'text/html');
    const sourceGrid = responseDocument.getElementById('product-grid');
    const cards = sourceGrid ? [...sourceGrid.children] : [];
    if (!cards.length) throw new Error('Load-more response contains no products');

    return { cards, control: responseDocument.querySelector('.ob-load-more') };
  };

  // Appends one fetched page and returns the control that replaced targetControl (null when exhausted).
  const appendPage = ({ cards, control }, targetControl) => {
    const targetGrid = document.getElementById('product-grid');
    if (!targetGrid || !targetControl) throw new Error('Load-more target is missing');

    const fragment = document.createDocumentFragment();
    cards.forEach((card) => {
      normalizeAppendedCard(card);
      fragment.append(card);
    });
    targetGrid.append(fragment);

    if (control) {
      targetControl.replaceWith(control);
      return control;
    }
    targetControl.remove();
    return null;
  };

  const setBusy = (button) => {
    const originalLabel = button.textContent;
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    button.textContent = 'Laden…';
    return () => {
      button.disabled = false;
      button.removeAttribute('aria-busy');
      button.textContent = originalLabel;
    };
  };

  const loadMore = async (button) => {
    const nextUrl = button.dataset.obNextUrl;
    const sectionId = button.dataset.obSectionId;
    if (!nextUrl || !sectionId || button.disabled) return;

    const reset = setBusy(button);
    try {
      appendPage(await fetchPage(nextUrl, sectionId), button.closest('.ob-load-more'));
      writeState({ pages: [...readState().pages, nextUrl] });
    } catch (error) {
      console.warn('[OB PLP] Unable to load more products.', error);
      reset();
    }
  };

  const restore = async () => {
    const { pages, scrollY } = readState();
    const button = document.querySelector(SELECTOR);
    if (!pages.length) return;
    if (!button || pages[0] !== button.dataset.obNextUrl) {
      writeState({ pages: [], scrollY: 0 });
      return;
    }

    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    const reset = setBusy(button);
    try {
      const results = await Promise.all(pages.map((url) => fetchPage(url, button.dataset.obSectionId)));
      let control = button.closest('.ob-load-more');
      results.forEach((result) => {
        if (control) control = appendPage(result, control);
      });
    } catch (error) {
      console.warn('[OB PLP] Unable to restore loaded products.', error);
      writeState({ pages: [], scrollY: 0 });
      reset();
    }
    window.scrollTo(0, scrollY || 0);
    if ('scrollRestoration' in history) history.scrollRestoration = 'auto';
  };

  document.addEventListener('click', (event) => {
    const button = event.target.closest(SELECTOR);
    if (!button) return;
    loadMore(button);
  });

  // Leaving the page (PDP click, reload): remember where the shopper was.
  window.addEventListener('pagehide', () => {
    if (readState().pages.length) writeState({ scrollY: window.scrollY });
  });

  // Facet history inside the page: Dawn re-renders that entry's first page.
  window.addEventListener('popstate', () => {
    if (readState().pages.length) writeState({ pages: [], scrollY: 0 });
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', restore, { once: true });
  } else {
    restore();
  }
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

/*
  Single colour mode renders the Kleur row as radios, and a checked radio
  ignores a second tap natively. Remember the pre-tap state and clear it
  ourselves, so a colour deselects like the Gender and Maat checkboxes.
*/
(() => {
  const ROW_RADIO = '.ob-mobile-bar__row--color input[type="radio"]';
  const radioFor = (target) => {
    const label = target.closest('label');
    return target.closest(ROW_RADIO) || (label && label.control && label.control.matches(ROW_RADIO) ? label.control : null);
  };

  document.addEventListener(
    'pointerdown',
    (event) => {
      const radio = radioFor(event.target);
      if (radio) radio.dataset.obWasChecked = String(radio.checked);
    },
    true,
  );

  document.addEventListener('click', (event) => {
    if (!event.target.matches(ROW_RADIO)) return;
    const radio = event.target;
    const wasChecked = radio.dataset.obWasChecked === 'true';
    delete radio.dataset.obWasChecked;
    if (!wasChecked) return;

    radio.checked = false;
    radio.dispatchEvent(new Event('input', { bubbles: true }));
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
