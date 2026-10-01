import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input } from '@angular/core';
import type { PlayerRef, VisibilityLevel } from '../shared/types';
import { playerNames } from './player-names';

/**
 * Restricted-visibility marker: « Secret MJ » (broken seal, dashed rule) or
 * « Pour toi et Kyra » (player faces, dotted rule). Always a glyph and a word.
 * Renders nothing for `table`, the norm, unless `showPublic`.
 */
@Component({
  selector: 'gr-visibility',
  // The host box is not rendered: the span behaves like the reference's bare span.gr-vis.
  host: { style: 'display: contents' },
  template: `@switch (level()) {
      @case ('gm') {
        <span class="gr-vis gr-vis--gm" [class]="markerClass()"
          ><svg class="gr-vis__glyph" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
            <path d="M5.2 1.1 A5 5 0 0 0 5.2 10.9 L6.2 8 L4.8 6 L6.4 3.6 Z" fill="currentColor" />
            <path d="M7.4 1.3 A5 5 0 0 1 7.4 10.7 L8.2 8.1 L6.9 6 L8.4 3.7 Z" fill="currentColor" /></svg
          >Secret MJ</span
        >
      }
      @case ('players') {
        <span class="gr-vis gr-vis--players" [class]="markerClass()" [title]="allNames()"
          ><span class="gr-vis__faces" aria-hidden="true">
            @for (initial of faces(); track $index) {
              <span class="gr-vis__face">{{ initial }}</span>
            }
          </span><span>{{ label() }}</span></span
        >
      }
      @default {
        @if (showPublic()) {
          <span class="gr-vis gr-vis--table" [class]="markerClass()">Toute la table</span>
        }
      }
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Visibility {
  readonly level = input<VisibilityLevel>('table');
  readonly players = input<readonly PlayerRef[]>([]);
  /** Drops the « Pour » (in an objective line). */
  readonly compact = input(false, { transform: booleanAttribute });
  /** Exceptionally shows « Toute la table » (in a form). */
  readonly showPublic = input(false, { transform: booleanAttribute });
  /** Extra class on the marker itself (the host box is not rendered), e.g. `gr-obj__vis`. */
  readonly markerClass = input<string>();

  protected readonly faces = computed(() =>
    this.players()
      .slice(0, 3)
      .map((p) => (p.name || '?').charAt(0).toUpperCase()),
  );
  protected readonly allNames = computed(() => this.players().map((p) => p.name).join(', '));
  protected readonly label = computed(
    () => `${this.compact() ? '' : 'Pour '}${playerNames(this.players())}`,
  );
}
