/*
 * /cart — reveal-on-scroll checkout bar (mobile).
 *
 * The checkout button rides in the summary card like any other control. It re-appears
 * as a fixed bottom bar only once it has been scrolled *past* — never while it is still
 * ahead of the shopper, so the two are never on screen at once and the page opens
 * without a bar. Mirrors the PLP's `.ob-summon-filters` reveal (assets/ob-plp.js): one
 * IntersectionObserver, one state class, no scroll listener.
 *
 * `boundingClientRect.bottom <= 0` rather than `!isIntersecting`: the latter is also
 * true while the card is still below the fold, which would show the bar on load.
 *
 * Mobile-only by construction — the CSS that fixes the button lives inside a
 * max-width:749px block, so toggling the class is inert at desktop and there is no
 * matchMedia bookkeeping to keep in sync.
 *
 * The dock reserves the button's height (CSS min-height). That matters: if the card
 * collapsed when the button left the flow, the dock itself would move, the observer
 * would fire again, and the bar would oscillate.
 */
(() => {
  const dock = document.querySelector('[data-ob-cart-cta-dock]');
  if (!dock || typeof IntersectionObserver !== 'function') return;

  new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        dock.classList.toggle('is-stuck', entry.boundingClientRect.bottom <= 0);
      });
    },
    { threshold: 0 },
  ).observe(dock);
})();
