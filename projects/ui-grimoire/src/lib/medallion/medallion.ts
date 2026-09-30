import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { ContactKind } from '../shared/types';

export type MedallionSize = 'md' | 'xs';

/** Leading article skipped when picking the initial (« L'Ordre » → « O »). */
const LEADING_ARTICLE = /^(l['’]|les |la |le |the )/i;

/** Initial shown on a medallion without an image. */
export function medallionInitial(name: string): string {
  const words = (name || '?').trim().replace(LEADING_ARTICLE, '');
  return (words || '?').charAt(0).toUpperCase();
}

/**
 * Round seal (NPC) or shield (faction) with an initial or a small portrait.
 * Decorative: the name is carried by the surrounding component.
 */
@Component({
  selector: 'gr-medallion',
  host: { '[class]': 'classes()', 'aria-hidden': 'true' },
  template: `@if (image(); as src) {
      <img [src]="src" alt="" />
    } @else {
      {{ initial() }}
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Medallion {
  readonly name = input.required<string>();
  readonly kind = input<ContactKind>('npc');
  readonly image = input<string>();
  readonly size = input<MedallionSize>('md');

  protected readonly classes = computed(
    () => `gr-medal gr-medal--${this.kind()} gr-medal--${this.size()}`,
  );
  protected readonly initial = computed(() => medallionInitial(this.name()));
}
