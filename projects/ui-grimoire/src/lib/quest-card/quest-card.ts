import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  booleanAttribute,
  computed,
  contentChild,
  input,
  output,
} from '@angular/core';
import { Badge, type QuestStatus } from '../badge/badge';
import { Objective } from '../objective/objective';
import { RewardList } from '../reward-list/reward-list';
import { RewardSummary } from '../reward-summary/reward-summary';
import type { QuestObjective, Reward, VisibilityValue } from '../shared/types';
import { Visibility } from '../visibility/visibility';

/** Marks the projected giver of a QuestCard, usually a `gr-contact-chip`. */
@Directive({ selector: '[grQuestGiver]' })
export class QuestGiver {}

/**
 * Card summarising a quest: title, giver, place and level, status, objective progress
 * and rewards. Stays an `<article>`: when selectable, a button in the title is stretched
 * over the whole card by bundle.css, so a click anywhere selects it while the heading,
 * the objective boxes and the giver link keep working.
 */
@Component({
  selector: 'article[grQuestCard]',
  imports: [Badge, Objective, RewardList, RewardSummary, Visibility],
  host: {
    '[class]': 'classes()',
    // `title` is an input: never leave it as a tooltip on the whole card.
    '[attr.title]': 'null',
  },
  template: `@if (restricted(); as vis) {
      <div class="gr-quest__vis">
        <gr-visibility [level]="vis.level" [players]="vis.players ?? []" />
      </div>
    }
    <div class="gr-quest__head">
      <div>
        <h3 class="gr-quest__title">
          @if (selectable()) {
            <button
              type="button"
              class="gr-quest__open"
              [attr.aria-pressed]="selected()"
              (click)="activate.emit()"
            >
              {{ title() }}
            </button>
          } @else {
            {{ title() }}
          }
        </h3>
        @if (hasMeta()) {
          <div class="gr-quest__meta">
            @if (hasGiver()) {
              <span class="gr-nowrap"
                >Donnée par <ng-content select="[grQuestGiver]" />{{ giverSlot() ? '' : giver() }}</span
              >
            }
            @for (part of metaParts(); track $index) {
              @if ($index > 0 || hasGiver()) {
                ·
              }
              <span class="gr-nowrap">{{ part }}</span>
            }
          </div>
        }
      </div>
      <gr-badge [tone]="status()" />
    </div>
    @if (summary()) {
      <p class="gr-quest__summary">{{ summary() }}</p>
    }
    @if (showObjectives() && objectives().length) {
      <ul class="gr-objs">
        @for (o of objectives(); track $index; let i = $index) {
          <li
            grObjective
            [done]="o.done ?? false"
            [optional]="o.optional ?? false"
            [visibility]="o.visibility"
            (toggle)="objectiveToggle.emit(i)"
          >
            {{ o.label }}
          </li>
        }
      </ul>
    }
    @if (showRewards() && rewards().length) {
      <gr-reward-list class="gr-quest__rewards" [rewards]="rewards()" />
    }
    @if (objectives().length || rewards().length) {
      <div class="gr-quest__foot">
        @if (objectives().length) {
          <div
            class="gr-track"
            role="progressbar"
            aria-label="Objectifs"
            aria-valuemin="0"
            [attr.aria-valuemax]="objectives().length"
            [attr.aria-valuenow]="done()"
          >
            <div class="gr-track__fill" [style.width.%]="progress()"></div>
          </div>
          <span class="gr-count">{{ done() }}/{{ objectives().length }}</span>
        } @else {
          <div style="flex: 1"></div>
        }
        @if (rewards().length && !showRewards()) {
          <gr-reward-summary [rewards]="rewards()" />
        }
      </div>
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestCard {
  readonly title = input.required<string>();
  readonly status = input<QuestStatus>('active');
  /** Plain giver name; project a `[grQuestGiver]` ContactChip to link the NPC or faction. */
  readonly giver = input<string>();
  readonly location = input<string>();
  readonly level = input<number>();
  readonly summary = input<string>();
  readonly objectives = input<readonly QuestObjective[]>([]);
  /** Also lists the objectives inside the card (detailed view). */
  readonly showObjectives = input(false, { transform: booleanAttribute });
  readonly rewards = input<readonly Reward[]>([]);
  /** Shows the full reward list instead of the foot summary (detailed view). */
  readonly showRewards = input(false, { transform: booleanAttribute });
  /** Restricted quest: `secret` frame, hatched band and a Visibility tab on the top edge. */
  readonly visibility = input<VisibilityValue>();
  readonly selected = input(false, { transform: booleanAttribute });
  /** Makes the card selectable: a click anywhere emits `activate`. */
  readonly selectable = input(false, { transform: booleanAttribute });
  readonly activate = output<void>();
  /** Index of the objective whose box or label was activated (with `showObjectives`). */
  readonly objectiveToggle = output<number>();

  protected readonly giverSlot = contentChild(QuestGiver);
  protected readonly hasGiver = computed(() => !!this.giverSlot() || !!this.giver());
  protected readonly metaParts = computed(() =>
    [this.location(), this.level() != null ? `Niv. ${this.level()}` : null].filter(
      (part): part is string => !!part,
    ),
  );
  protected readonly hasMeta = computed(() => this.hasGiver() || this.metaParts().length > 0);
  protected readonly restricted = computed(() => {
    const vis = this.visibility();
    return vis && vis.level !== 'table' ? vis : null;
  });
  protected readonly done = computed(() => this.objectives().filter((o) => o.done).length);
  protected readonly progress = computed(() => {
    const total = this.objectives().length;
    return total ? Math.round((this.done() / total) * 100) : 0;
  });
  protected readonly classes = computed(() => {
    const vis = this.restricted();
    return [
      'gr-quest',
      `gr-quest--${this.status()}`,
      this.selected() ? 'gr-quest--selected' : '',
      vis ? 'gr-quest--restricted' : '',
      vis?.level === 'players' ? 'gr-quest--restricted-players' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });
}
