import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Badge } from '../badge/badge';
import { Icon } from '../icon/icon';
import { RARITIES } from '../shared/rewards';
import type { Rarity, Reward } from '../shared/types';

/**
 * Compact summary of a quest's rewards, for a card foot: coins and XP as a gold value,
 * items counted in the colour of the rarest one (list on hover), the rest as « +N ».
 */
@Component({
  selector: 'gr-reward-summary',
  imports: [Badge, Icon],
  host: { class: 'gr-rsum' },
  template: `@if (values(); as v) {
      <gr-badge tone="reward" glyph="✦">{{ v }}</gr-badge>
    }
    @if (items().length) {
      <span class="gr-rsum__items gr-rarity--{{ rarest() }}" [title]="itemNames()"
        ><gr-icon name="butin" [size]="14" />{{ itemCount() }}</span
      >
    }
    @if (others() > 0) {
      <span class="gr-rsum__more">+{{ others() }}</span>
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RewardSummary {
  readonly rewards = input<readonly Reward[]>([]);

  /** « 250 po · 80 XP », or null without coins or XP. */
  protected readonly values = computed(
    () =>
      this.rewards()
        .filter((r) => r.kind === 'coin' || r.kind === 'xp')
        .map((r) => r.label)
        .join(' · ') || null,
  );
  protected readonly items = computed(() => this.rewards().filter((r) => r.kind === 'item'));
  protected readonly others = computed(
    () => this.rewards().filter((r) => r.kind !== 'coin' && r.kind !== 'xp' && r.kind !== 'item').length,
  );
  protected readonly rarest = computed(() =>
    this.items().reduce<Rarity>(
      (best, r) => (RARITIES.indexOf(r.rarity ?? 'common') > RARITIES.indexOf(best) ? r.rarity! : best),
      'common',
    ),
  );
  protected readonly itemNames = computed(() => this.items().map((r) => r.label).join(', '));
  protected readonly itemCount = computed(() => {
    const n = this.items().length;
    return n === 1 ? '1 objet' : `${n} objets`;
  });
}
