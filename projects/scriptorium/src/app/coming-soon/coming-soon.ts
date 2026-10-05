import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Placeholder for the bookmarks whose page does not exist yet (Journal, Contacts…). */
@Component({
  selector: 'app-coming-soon',
  // The page frame (gutters, title) is the shared gr-page (ui-grimoire page.css).
  host: { class: 'gr-page' },
  template: `<h1 class="gr-page__title">{{ heading() }}</h1>
    <p class="coming-soon__text">Cette page n'existe pas encore.</p>`,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
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
