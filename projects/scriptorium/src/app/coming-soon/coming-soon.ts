import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Placeholder for the bookmarks whose page does not exist yet (Journal, Contacts…). */
@Component({
  selector: 'app-coming-soon',
  template: `<h1 class="coming-soon__title">{{ heading() }}</h1>
    <p class="coming-soon__text">Cette page n'existe pas encore.</p>`,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
      padding: var(--space-12);
    }
    @media (max-width: 767px) {
      :host {
        padding: var(--space-6) var(--space-4);
      }
    }
    .coming-soon__title {
      margin: 0;
      font: var(--type-title-lg);
    }
    .coming-soon__text {
      margin: 0;
      font: var(--type-body);
      color: var(--ink-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComingSoon {
  /** From the route's `data`. */
  readonly heading = input.required<string>();
}
