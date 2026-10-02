import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Button, ThemeService, type ThemeId } from '@scriptorium/ui-grimoire';

/** French theme names (THEMES carries the design system's English ones). */
const THEME_LABELS: Record<ThemeId, string> = { parchment: 'Parchemin', dungeon: 'Donjon' };

/** The Réglages page: for now, the theme (Parchemin or Donjon), remembered by ThemeService. */
@Component({
  selector: 'app-settings',
  imports: [Button],
  template: `<h1 class="settings__title">Réglages</h1>
    <section class="settings__section" aria-labelledby="settings-theme">
      <h2 id="settings-theme" class="settings__label">Thème</h2>
      <p class="settings__text">
        Thème actuel : <strong>{{ labels[themes.theme()] }}</strong>
      </p>
      <div>
        <button grButton variant="secondary" (click)="themes.toggle()">
          Passer au thème {{ labels[themes.next().id] }}
        </button>
      </div>
    </section>`,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--space-8);
      padding: var(--space-12);
      color: var(--ink);
    }
    .settings__title {
      margin: 0;
      font: var(--type-title-lg);
    }
    .settings__section {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }
    .settings__label {
      margin: 0;
      font: var(--type-label-caps);
      letter-spacing: var(--type-label-caps-tracking);
      text-transform: uppercase;
      color: var(--ink-muted);
    }
    .settings__text {
      margin: 0;
      font: var(--type-body);
    }
    @media (max-width: 767px) {
      :host {
        gap: var(--space-6);
        padding: var(--space-6) var(--space-4);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Settings {
  protected readonly themes = inject(ThemeService);
  protected readonly labels = THEME_LABELS;
}
