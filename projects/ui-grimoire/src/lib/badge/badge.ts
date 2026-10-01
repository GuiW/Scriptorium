import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { flagOnChange } from '../shared/motion';

export type QuestStatus = 'active' | 'completed' | 'failed' | 'rumor';
export type BadgeTone = QuestStatus | 'urgent' | 'reward';

/** Glyph and default French label of each tone (STATUS in design/grimoire/components/bundle.js). */
export const BADGE_TONES: Record<BadgeTone, { glyph: string; label: string }> = {
  active: { glyph: '◆', label: 'En cours' },
  completed: { glyph: '✓', label: 'Accomplie' },
  failed: { glyph: '✕', label: 'Échouée' },
  rumor: { glyph: '?', label: 'Rumeur' },
  urgent: { glyph: '!', label: 'Urgent' },
  reward: { glyph: '✦', label: 'Récompense' },
};

/**
 * Status or reward tag: always a glyph plus a word, never colour alone.
 * Projected content replaces the tone's default label (for `reward`, pass the amount: « 250 po »).
 */
@Component({
  selector: 'gr-badge',
  host: { '[class]': 'classes()', '(animationend)': 'stamp.set(false)' },
  template: `@if (shownGlyph(); as g) {
      <span class="gr-badge__glyph" aria-hidden="true">{{ g }}</span>
    }<ng-content>{{ tones[tone()].label }}</ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Badge {
  readonly tone = input<BadgeTone>('active');
  /** Overrides the default glyph; `false` hides it (only when the word alone is unambiguous). */
  readonly glyph = input<string | false>();

  protected readonly tones = BADGE_TONES;
  /** Raised when the tone changes after the first render: the new status is pressed like a wax seal. */
  protected readonly stamp = flagOnChange(() => this.tone());
  protected readonly classes = computed(
    () => `gr-badge gr-badge--${this.tone()}${this.stamp() ? ' gr-badge--stamp' : ''}`,
  );
  protected readonly shownGlyph = computed(() => {
    const glyph = this.glyph();
    return glyph === false ? null : glyph || BADGE_TONES[this.tone()].glyph;
  });
}
