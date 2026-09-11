/*
  OB: homepage brand marquee - continuous JS-driven scroll (requestAnimationFrame,
  writing `transform` directly) instead of a CSS keyframe. A CSS animation can
  only start/stop instantly, and changing `animation-duration` mid-flight
  recomputes position against the new duration at the same elapsed time -
  a visible jump, not a slowdown. Here the px/sec speed itself eases toward a
  slower target on hover/focus and back on leave, so the row visibly keeps
  moving instead of snapping.

  Distance is one rendered `.ob-home-marquee__set` width - the block list
  renders twice back-to-back (see ob-home-brand-marquee.liquid) so wrapping
  the translateX at exactly that width is the seamless loop point.
*/
document.addEventListener('DOMContentLoaded', () => {
  const marquee = document.querySelector('.ob-home-marquee');
  if (!marquee) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const track = marquee.querySelector('.ob-home-marquee__track');
  const set = marquee.querySelector('.ob-home-marquee__set');
  if (!track || !set) return;

  const BASE_DURATION_S = 36;
  const HOVER_SPEED_FACTOR = 0.35;
  const EASE_PER_SECOND = 3;

  let distance = set.getBoundingClientRect().width;
  let x = 0;
  let speed = distance / BASE_DURATION_S;
  let targetSpeed = speed;
  let hovered = false;
  let last = null;
  let resizeRaf = null;

  const applyTarget = () => {
    const base = distance / BASE_DURATION_S;
    targetSpeed = hovered ? base * HOVER_SPEED_FACTOR : base;
  };

  const setHovered = (on) => {
    hovered = on;
    applyTarget();
  };

  marquee.addEventListener('mouseenter', () => setHovered(true));
  marquee.addEventListener('mouseleave', () => setHovered(false));
  marquee.addEventListener('focusin', () => setHovered(true));
  marquee.addEventListener('focusout', (event) => {
    if (!marquee.contains(event.relatedTarget)) setHovered(false);
  });

  window.addEventListener('resize', () => {
    if (resizeRaf) return;
    resizeRaf = requestAnimationFrame(() => {
      resizeRaf = null;
      const newDistance = set.getBoundingClientRect().width;
      if (newDistance > 0) {
        distance = newDistance;
        applyTarget();
      }
    });
  });

  const tick = (now) => {
    if (last === null) last = now;
    const dt = Math.min(now - last, 100);
    last = now;

    const ease = Math.min((dt / 1000) * EASE_PER_SECOND, 1);
    speed += (targetSpeed - speed) * ease;
    x -= (speed * dt) / 1000;
    if (distance > 0 && x <= -distance) x += distance;
    track.style.transform = `translate3d(${x}px, 0, 0)`;

    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
});
