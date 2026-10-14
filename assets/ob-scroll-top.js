(() => {
  const button = document.querySelector('[data-ob-scroll-top]');
  if (!button) return;

  // Mobile Trusted Shops badge reveal (component-ob-scroll-top.css): on home once the brand
  // marquee has left the top of the viewport, elsewhere when the footer is within half a
  // viewport below it.
  const badgeRevealed = () => {
    const marquee = document.querySelector('.ob-home-marquee');
    if (marquee) return marquee.getBoundingClientRect().bottom < 0;
    const footer = document.querySelector('footer.footer');
    return Boolean(footer) && footer.getBoundingClientRect().top < window.innerHeight * 1.5;
  };

  let ticking = false;
  const update = () => {
    ticking = false;
    button.hidden = window.scrollY < window.innerHeight;
    document.documentElement.classList.toggle('ob-trustbadge-reveal', badgeRevealed());
  };

  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true }
  );
  update();

  // The Trusted Shops widget draws its compact badge (seal, rating, toggle) only inside its
  // own (max-width: 648px) block. Copying that block's rules into an unconditional sheet
  // shows the compact badge at every width. The widget injects rules through CSSOM into
  // style[data-aphrodite] (no DOM mutation), so the copy is redone a frame after each
  // change to the badge's markup; that frame runs before paint.
  const compactSheet = document.createElement('style');
  compactSheet.dataset.obTrustbadgeCompact = '';
  const copyCompactRules = () => {
    let css = '';
    for (const node of document.querySelectorAll('style[data-aphrodite]')) {
      for (const rule of node.sheet?.cssRules ?? []) {
        if (!(rule instanceof CSSMediaRule) || !/max-width:\s*648px/.test(rule.conditionText)) continue;
        for (const inner of rule.cssRules) {
          if (/^\._[a-z0-9]+$/.test(inner.selectorText ?? '')) css += `${inner.cssText}\n`;
        }
      }
    }
    if (css !== compactSheet.textContent) compactSheet.textContent = css;
    if (!compactSheet.isConnected) document.head.append(compactSheet);
  };
  let compactQueued = false;
  const queueCompactCopy = () => {
    if (compactQueued) return;
    compactQueued = true;
    requestAnimationFrame(() => {
      compactQueued = false;
      copyCompactRules();
    });
  };
  let badgeObserved = false;
  const watchBadge = () => {
    const container = document.querySelector('[id^="trustbadge-container-"]');
    if (!container) return;
    queueCompactCopy();
    if (badgeObserved) return;
    badgeObserved = true;
    new MutationObserver(queueCompactCopy).observe(container, { childList: true, subtree: true });
  };
  new MutationObserver(watchBadge).observe(document.body, { childList: true });
  watchBadge();

  button.addEventListener('click', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // The button hides itself on the way up; a keyboard user's focus must not be left on it.
    if (button.matches(':focus-visible')) {
      document.querySelector('.skip-to-content-link')?.focus({ preventScroll: true });
    } else {
      button.blur();
    }
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
})();
