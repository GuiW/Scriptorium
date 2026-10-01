import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { PlayerRef } from '../shared/types';
import { playerNames } from '../visibility/player-names';
import { Visibility } from '../visibility/visibility';

/**
 * Frame for a restricted content block inside a public page (note, journal paragraph,
 * clue): dashed `secret` rule (the same for chosen players), hatched band at the top and a
 * Visibility tab on the top edge. Do not nest two secret frames.
 */
@Component({
  selector: 'gr-secret-block',
  imports: [Visibility],
  host: {
    // The reference's frame is a div: keep it a block wherever the host is placed.
    style: 'display: block',
    '[class]': 'classes()',
    role: 'group',
    '[attr.aria-label]': 'ariaLabel()',
  },
  template: `<div class="gr-secret__tab">
      <gr-visibility [level]="level()" [players]="players()" />
    </div>
    <div class="gr-secret__body"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecretBlock {
  readonly level = input<'gm' | 'players'>('gm');
  readonly players = input<readonly PlayerRef[]>([]);

  protected readonly classes = computed(() => `gr-secret gr-secret--${this.level()}`);
  protected readonly ariaLabel = computed(() =>
    this.level() === 'gm' ? 'Secret MJ' : `Partagé avec ${playerNames(this.players())}`,
  );
}
