(() => {
  const button = document.querySelector('[data-ob-scroll-top]');
  if (!button) return;

  let ticking = false;
  const update = () => {
    ticking = false;
    button.hidden = window.scrollY < window.innerHeight;
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
