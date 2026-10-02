import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  type ElementRef,
  computed,
  input,
  output,
  viewChild,
} from '@angular/core';
import {
  Badge,
  ContactChip,
  Objective,
  RewardList,
  SecretBlock,
  Visibility,
} from '@scriptorium/ui-grimoire';
import type { Quest } from '../data/quest';

let nextId = 0;

/** Marks the action shown beside the title, « Fermer » in the side panel. */
@Directive({ selector: '[questsDetailAction]' })
export class QuestDetailAction {}

/**
 * Everything about one quest, as the GM sees it: in the side panel on desktop (`panel`, h2) or
 * as the page itself on tablet and mobile (`page`, h1, larger summary).
 */
@Component({
  selector: 'quests-quest-detail',
  imports: [Badge, ContactChip, Objective, RewardList, SecretBlock, Visibility],
  host: { class: 'detail', '[class.detail--page]': "mode() === 'page'" },
  template: `<header class="detail__head">
      <div class="detail__top">
        @if (restricted(); as vis) {
          <gr-visibility [level]="vis.level" [players]="vis.players ?? []" />
        }
        <span class="detail__action"><ng-content select="[questsDetailAction]" /></span>
      </div>
      <div class="detail__title-row">
        @if (mode() === 'page') {
          <h1 #heading class="detail__title" tabindex="-1">{{ quest().title }}</h1>
        } @else {
          <h2 #heading class="detail__title" tabindex="-1">{{ quest().title }}</h2>
        }
        <span class="detail__status"><gr-badge [tone]="quest().status" /></span>
      </div>
      @if (hasMeta()) {
        <div class="gr-quest__meta">
          @if (quest().giver; as giver) {
            <span class="gr-nowrap"
              >Donnée par
              <gr-contact-chip
                [name]="giver.name"
                [kind]="giver.kind"
                [reputation]="giver.reputation"
            /></span>
          }
          @for (part of metaParts(); track $index) {
            @if ($index > 0 || quest().giver) {
              ·
            }
            <span class="gr-nowrap">{{ part }}</span>
          }
        </div>
      }
    </header>
    @if (quest().summary) {
      <p class="detail__summary">{{ quest().summary }}</p>
    }
    <!-- The GM note right under the summary it completes, apart from the rewards. -->
    @if (quest().secretNote) {
      <gr-secret-block class="detail__secret" level="gm">
        <p class="detail__note">{{ quest().secretNote }}</p>
      </gr-secret-block>
    }
    @if (quest().objectives.length) {
      <section class="detail__section" [attr.aria-labelledby]="objectivesId">
        <div
          class="detail__label"
          role="heading"
          [attr.aria-level]="mode() === 'page' ? 2 : 3"
          [id]="objectivesId"
        >
          Objectifs
        </div>
        <ul class="gr-objs">
          @for (o of quest().objectives; track $index; let i = $index) {
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
      </section>
    }
    @if (quest().rewards.length) {
      <gr-reward-list class="detail__rewards" [rewards]="quest().rewards" />
    }`,
  styleUrl: './quest-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestDetail {
  readonly quest = input.required<Quest>();
  readonly mode = input<'panel' | 'page'>('panel');
  /** Index of the objective whose box or label was activated. */
  readonly objectiveToggle = output<number>();

  private readonly heading = viewChild.required<ElementRef<HTMLElement>>('heading');
  protected readonly objectivesId = `quest-objectives-${nextId++}`;

  protected readonly restricted = computed(() => {
    const vis = this.quest().visibility;
    return vis && vis.level !== 'table' ? vis : null;
  });
  protected readonly metaParts = computed(() => {
    const { location, level } = this.quest();
    return [location, level != null ? `Niv. ${level}` : null].filter((p): p is string => !!p);
  });
  protected readonly hasMeta = computed(() => !!this.quest().giver || this.metaParts().length > 0);

  /** Moves the focus to the title, when the detail opens. */
  focus(): void {
    this.heading().nativeElement.focus();
  }
}
