import { Component, ElementRef, afterNextRender, signal, viewChild } from '@angular/core';

interface Stat {
  readonly value: string;
  readonly label: string;
}

/** Verbatim from spec section 9 — deliberately non-numeric ("Enterprise"/"Angular"/"Remote"), not invented counts. */
const STATS: readonly Stat[] = [
  { value: '5+', label: 'Years Experience' },
  { value: 'Enterprise', label: 'Projects' },
  { value: 'Angular', label: 'Specialist' },
  { value: 'Remote', label: 'Ready' },
];

@Component({
  selector: 'app-stats',
  template: `
    <section class="mx-auto max-w-content px-4 py-12 md:px-6 lg:px-8">
      <div #container class="grid grid-cols-2 gap-8 lg:grid-cols-4">
        @for (stat of stats; track stat.label) {
          <div
            class="flex flex-col items-center gap-1 text-center transition-all duration-[var(--transition-slow)] ease-[var(--ease-standard)]"
            [class]="pendingReveal() ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'"
          >
            <p class="text-h3 font-bold text-text-primary sm:text-h2">{{ stat.value }}</p>
            <p class="text-small text-text-secondary">{{ stat.label }}</p>
          </div>
        }
      </div>
    </section>
  `,
})
export class Stats {
  protected readonly stats = STATS;

  /**
   * Defaults to false (fully visible) so SSR output, no-JS clients, and
   * crawlers never see hidden content — this class is only ever applied by
   * browser JS below, and only for an element confirmed to start off-screen.
   */
  protected readonly pendingReveal = signal(false);

  private readonly container = viewChild.required<ElementRef<HTMLElement>>('container');

  constructor() {
    afterNextRender(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      const element = this.container().nativeElement;
      const rect = element.getBoundingClientRect();
      const startsOffscreen = rect.top >= window.innerHeight || rect.bottom <= 0;
      if (!startsOffscreen) {
        return;
      }

      this.pendingReveal.set(true);
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            this.pendingReveal.set(false);
            observer.disconnect();
          }
        },
        { threshold: 0.3 },
      );
      observer.observe(element);
    });
  }
}
