import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  contentChild,
  input,
  output,
} from '@angular/core';
import { Badge, type QuestStatus } from '../badge/badge';
import { Objective } from '../objective/objective';
import { QuestGiver, QuestMeta } from '../quest-meta/quest-meta';
import { RewardList } from '../reward-list/reward-list';
import { RewardSummary } from '../reward-summary/reward-summary';
import { flagOnChange } from '../shared/motion';
import { rewardsWithin } from '../shared/rewards';
import type { QuestObjective, Reward, VisibilityValue } from '../shared/types';
import { restrictedVisibility } from '../visibility/restricted';
import { Visibility } from '../visibility/visibility';

// The giver marker belongs to the meta line; still importable from here, where QuestCard users look.
export { QuestGiver };

/**
 * Card summarising a quest: title, giver, place and level, status, objective progress
 * and rewards. Stays an `<article>`: when selectable, a button in the title is stretched
 * over the whole card by bundle.css, so a click anywhere selects it while the heading,
 * the objective boxes and the giver link keep working.
 */
@Component({
  // On the native article element to keep its semantics; the gr prefix is still enforced by review.
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'article[grQuestCard]',
  imports: [Badge, Objective, QuestMeta, RewardList, RewardSummary, Visibility],
  host: {
    '[class]': 'classes()',
    // `title` is an input: never leave it as a tooltip on the whole card.
    '[attr.title]': 'null',
    '(animationend)': 'onAnimationEnd($event)',
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
        <gr-quest-meta
          [giver]="giver()"
          [giverSlot]="!!giverSlot()"
          [location]="location()"
          [level]="level()"
          ><ng-container ngProjectAs="[grQuestGiver]"
            ><ng-content select="[grQuestGiver]" /></ng-container
        ></gr-quest-meta>
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
            (doneChange)="objectiveToggle.emit(i)"
          >
            {{ o.label }}
          </li>
        }
      </ul>
    }
    @if (showRewards() && rewards().length) {
      <gr-reward-list class="gr-quest__rewards" [rewards]="rewards()" />
    }
    @if (objectives().length || footRewards().length) {
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
        @if (footRewards().length && !showRewards()) {
          <gr-reward-summary [rewards]="footRewards()" />
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

  /** Raised when the card becomes selected (not on the first render): a gold ring spreads once. */
  protected readonly chosen = flagOnChange(
    () => this.selected(),
    (selected) => selected,
  );
  /** A projected ContactChip, passed on to the meta line. */
  protected readonly giverSlot = contentChild(QuestGiver);
  protected readonly restricted = computed(() => restrictedVisibility(this.visibility()));
  /** Rewards summarised in the foot: those more restricted than the quest are left out. */
  protected readonly footRewards = computed(() => rewardsWithin(this.rewards(), this.visibility()));
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
      // Detailed card: the summary is not clamped to 3 lines.
      this.showObjectives() || this.showRewards() ? 'gr-quest--detailed' : '',
      this.selected() ? 'gr-quest--selected' : '',
      this.chosen() ? 'gr-quest--chosen' : '',
      vis ? 'gr-quest--restricted' : '',
      vis?.level === 'players' ? 'gr-quest--restricted-players' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  /** Ends the selection ring; the stamp and seal of the children bubble up here too. */
  protected onAnimationEnd(event: AnimationEvent): void {
    if (event.target === event.currentTarget) this.chosen.set(false);
  }
}
