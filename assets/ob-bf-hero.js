/*
  OB: Black Friday hero behaviour. Custom elements so the theme editor's section
  re-render starts them again without extra wiring.
*/
if (!customElements.get('ob-bf-hero')) {
  customElements.define(
    'ob-bf-hero',
    class extends HTMLElement {
      connectedCallback() {
        const pause = this.querySelector('.ob-bf-hero__pause');
        pause?.addEventListener('click', () => {
          const paused = pause.getAttribute('aria-pressed') !== 'true';
          pause.setAttribute('aria-pressed', paused);
          pause.setAttribute('aria-label', paused ? 'Animatie afspelen' : 'Animatie pauzeren');
          this.toggleAttribute('data-paused', paused);
        });

        const word = this.querySelector('.ob-bf-hero__word--outline');
        const canTrack =
          window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
          !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!word || !canTrack) return;

        let frame = null;
        this.addEventListener('pointermove', (event) => {
          if (frame) return;
          frame = requestAnimationFrame(() => {
            frame = null;
            const rect = word.getBoundingClientRect();
            this.classList.add('is-tracking');
            this.style.setProperty('--ob-bf-x', `${((event.clientX - rect.left) / rect.width) * 100}%`);
          });
        });
        this.addEventListener('pointerleave', () => {
          this.classList.remove('is-tracking');
          this.style.removeProperty('--ob-bf-x');
        });
      }
    }
  );
}

if (!customElements.get('ob-bf-countdown')) {
  customElements.define(
    'ob-bf-countdown',
    class extends HTMLElement {
      connectedCallback() {
        this.start = Date.parse(this.dataset.start);
        this.end = Date.parse(this.dataset.end);
        this.label = this.querySelector('.ob-bf-hero__countdown-label');
        this.tick();
        if (!this.hidden) this.timer = setInterval(() => this.tick(), 1000);
      }

      disconnectedCallback() {
        clearInterval(this.timer);
      }

      tick() {
        const now = Date.now();
        const before = now < this.start;
        const target = before ? this.start : this.end;
        if (!(target > now)) {
          this.hidden = true;
          clearInterval(this.timer);
          return;
        }
        this.label.textContent = before ? this.dataset.labelBefore : this.dataset.labelDuring;
        const seconds = Math.floor((target - now) / 1000);
        this.set('days', Math.floor(seconds / 86400));
        this.set('hours', Math.floor(seconds / 3600) % 24);
        this.set('minutes', Math.floor(seconds / 60) % 60);
        this.set('seconds', seconds % 60);
        this.classList.add('is-ready');
      }

      set(unit, value) {
        this.querySelector(`[data-unit="${unit}"]`).textContent = String(value).padStart(2, '0');
      }
    }
  );
}
