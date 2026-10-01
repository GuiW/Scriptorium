import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
  output,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Medallion } from '../medallion/medallion';
import { REPUTATION_SCALES, reputationStep, reputationTone } from '../reputation/reputation';
import type { ContactKind } from '../shared/types';

/**
 * Inline reference to an NPC or a faction: xs medallion, name and, optionally, a small
 * diamond in the attitude colour (its word read by screen readers and shown on hover).
 * With `link`, it becomes a button to the contact card.
 */
@Component({
  selector: 'gr-contact-chip',
  imports: [Medallion, NgTemplateOutlet],
  // The host box is not rendered: the chip is the reference's bare span or button.
  host: { style: 'display: contents' },
  template: `<ng-template #content>
      <gr-medallion [name]="name()" [kind]="kind()" [image]="image()" size="xs" />
      <span class="gr-chip__name">{{ name() }}</span>
      @if (stance(); as s) {
        <span class="gr-chip__rep gr-rep--{{ s.tone }}"><span class="gr-sr">, {{ s.label }}</span></span>
      }
    </ng-template>
    @if (link()) {
      <button type="button" class="gr-chip gr-chip--link" [attr.title]="title()" (click)="activate.emit()">
        <ng-container *ngTemplateOutlet="content" />
      </button>
    } @else {
      <span class="gr-chip" [attr.title]="title()"><ng-container *ngTemplateOutlet="content" /></span>
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactChip {
  readonly name = input.required<string>();
  readonly kind = input<ContactKind>('npc');
  readonly image = input<string>();
  /** 0-based step on the attitude scale; adds the coloured diamond. */
  readonly reputation = input<number>();
  /** Custom scale (see Reputation). */
  readonly labels = input<readonly string[]>();
  /** Makes the chip a button to the contact card (`activate` on click). */
  readonly link = input(false, { transform: booleanAttribute });
  readonly activate = output<void>();

  protected readonly stance = computed(() => {
    const value = this.reputation();
    if (value == null) return null;
    const scale = this.labels() ?? REPUTATION_SCALES[this.kind()];
    const step = reputationStep(scale.length, value);
    return { tone: reputationTone(scale.length, step), label: scale[step] };
  });
  protected readonly title = computed(() => {
    const s = this.stance();
    return s ? `${this.name()} — ${s.label}` : null;
  });
}
