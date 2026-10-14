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
