(() => {
  const STORAGE_KEY = 'ob-recent-products-v1';
  const HISTORY_LIMIT = 12;
  const DISPLAY_LIMIT = 4;
  const initialized = new WeakSet();

  function readHistory() {
    try {
      const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(history)
        ? history.filter((handle) => typeof handle === 'string' && /^[a-z0-9-]+$/.test(handle))
        : [];
    } catch {
      return [];
    }
  }

  function writeHistory(handles) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(handles));
    } catch {
      // Private browsing may disable storage; the page still works without it.
    }
  }

  async function renderCard(section, handle) {
    try {
      const url = new URL(`${section.dataset.productsPath}${encodeURIComponent(handle)}`, location.origin);
      url.searchParams.set('section_id', section.dataset.sectionId);
      const response = await fetch(url);
      if (!response.ok) return null;
      const html = new DOMParser().parseFromString(await response.text(), 'text/html');
      const template = html.querySelector('.ob-recently-viewed__card');
      const card = template?.content.querySelector('.grid__item');
      // Sold-out products stay in history (they may come back) but aren't shown.
      if (!card || card.dataset.available !== 'true') return null;
      return card.cloneNode(true);
    } catch {
      return null;
    }
  }

  function initialize(section) {
    if (initialized.has(section)) return;
    initialized.add(section);

    const current = section.dataset.productHandle;
    if (!current) return;

    const history = [...new Set(readHistory())].filter((handle) => handle !== current);
    const candidates = history.slice().reverse();
    writeHistory([...history, current].slice(-HISTORY_LIMIT));
    if (!candidates.length) return;

    async function load() {
      // Newest first, a batch of DISPLAY_LIMIT at a time: unavailable entries
      // are backfilled from older history until the row is full.
      const shown = [];
      for (let start = 0; start < candidates.length && shown.length < DISPLAY_LIMIT; start += DISPLAY_LIMIT) {
        const batch = candidates.slice(start, start + DISPLAY_LIMIT);
        const cards = await Promise.all(batch.map((handle) => renderCard(section, handle)));
        shown.push(...cards.filter(Boolean));
      }
      if (!section.isConnected) return;
      const grid = section.querySelector('.product-grid');
      shown.slice(0, DISPLAY_LIMIT).forEach((card) => grid.append(card));
      if (grid.children.length) section.hidden = false;
    }

    load();
  }

  function initializeAll() {
    document.querySelectorAll('.ob-recently-viewed').forEach(initialize);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAll, { once: true });
  } else {
    initializeAll();
  }
  document.addEventListener('product-info:loaded', initializeAll);
  document.addEventListener('shopify:section:load', initializeAll);
})();
