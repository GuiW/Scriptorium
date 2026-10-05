import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  booleanAttribute,
  computed,
  input,
} from '@angular/core';

/** Marks the projected giver of a QuestCard or a QuestMeta, usually a `gr-contact-chip`. */
@Directive({ selector: '[grQuestGiver]' })
export class QuestGiver {}

/** Place and level of a quest, in the order they follow the giver: « Otari », « Niv. 2 ». */
export function questMetaParts(location?: string, level?: number): string[] {
  return [location, level != null ? `Niv. ${level}` : null].filter(
    (part): part is string => !!part,
  );
}

/**
 * The metadata line of a quest, « Donnée par [giver] · place · Niv. N », used by QuestCard and
 * by any quest detail. The giver is a plain name, or a projected `[grQuestGiver]` ContactChip
 * (set `giverSlot`). Renders nothing when there is nothing to say; the host box is not rendered,
 * so the line sits in its parent's layout (QuestCard's head grid).
 */
@Component({
  selector: 'gr-quest-meta',
  host: { style: 'display: contents' },
  template: `@if (shown()) {
    <div class="gr-quest__meta">
      @if (hasGiver()) {
        <span class="gr-nowrap"
          >Donnée par <ng-content select="[grQuestGiver]" />{{ giverSlot() ? '' : giver() }}</span
        >
      }
      @for (part of parts(); track $index) {
        @if ($index > 0 || hasGiver()) {
          ·
        }
        <span class="gr-nowrap">{{ part }}</span>
      }
    </div>
  }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestMeta {
  /** Plain giver name; ignored when a ContactChip is projected. */
  readonly giver = input<string>();
  /** A `[grQuestGiver]` ContactChip is projected as the giver. */
  readonly giverSlot = input(false, { transform: booleanAttribute });
  readonly location = input<string>();
  readonly level = input<number>();

  protected readonly hasGiver = computed(() => this.giverSlot() || !!this.giver());
  protected readonly parts = computed(() => questMetaParts(this.location(), this.level()));
  protected readonly shown = computed(() => this.hasGiver() || this.parts().length > 0);
}
