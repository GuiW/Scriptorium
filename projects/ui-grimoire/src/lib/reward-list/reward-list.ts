import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Icon } from '../icon/icon';
import { RARITY_LABELS, REWARD_ICONS } from '../shared/rewards';
import type { Reward } from '../shared/types';
import { Visibility } from '../visibility/visibility';

/**
 * Full list of a quest's rewards: one icon per kind, the PF2e rarity word on items,
 * a note, and a marker when restricted.
 */
@Component({
  selector: 'gr-reward-list',
  imports: [Icon, Visibility],
  host: { class: 'gr-rewards' },
  template: `@if (title() !== false) {
      <div class="gr-rewards__title">{{ title() || 'Récompenses' }}</div>
    }
    <ul class="gr-rewards__list">
      @for (r of rewards(); track $index) {
        <li [class]="lineClass(r)">
          <span class="gr-reward__glyph" aria-hidden="true"
            ><gr-icon [name]="icons[r.kind] || 'quete'" [size]="16"
          /></span>
          <span class="gr-reward__label"
            >{{ r.label }}
            @if (r.note) {
              <span class="gr-reward__note">{{ r.note }}</span>
            }
          </span>
          @if (r.rarity && r.rarity !== 'common') {
            <span class="gr-reward__rarity">{{ rarities[r.rarity] }}</span>
          }
          @if (r.visibility && r.visibility.level !== 'table') {
            <gr-visibility
              [level]="r.visibility.level"
              [players]="r.visibility.players ?? []"
              compact
            />
          }
        </li>
      }
    </ul>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RewardList {
  readonly rewards = input<readonly Reward[]>([]);
  /** « Récompenses » by default; `false` removes the title. */
  readonly title = input<string | false>();

  protected readonly icons = REWARD_ICONS;
  protected readonly rarities = RARITY_LABELS;

  protected lineClass(r: Reward): string {
    return [
      'gr-reward',
      `gr-reward--${r.kind || 'other'}`,
      r.rarity ? `gr-rarity--${r.rarity}` : '',
    ]
      .filter(Boolean)
      .join(' ');
  }
}
