import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  untracked,
  viewChild,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  Button,
  ContactChip,
  QuestCard,
  QuestGiver,
  StatusFilter,
  injectLayout,
  type QuestStatus,
  type StatusFilterItem,
} from '@scriptorium/ui-grimoire';
import { QuestsStore } from '../data/quests.store';
import { QuestDetail, QuestDetailAction } from '../quest-detail/quest-detail';

/** The status filters, in order, with their `?statut=` value (none for En cours). */
const FILTERS: readonly {
  status: QuestStatus;
  param: string | null;
  label: string;
  empty: string;
}[] = [
  { status: 'active', param: null, label: 'En cours', empty: 'Aucune quête en cours.' },
  {
    status: 'completed',
    param: 'accomplies',
    label: 'Accomplies',
    empty: 'Aucune quête accomplie pour l’instant.',
  },
  {
    status: 'failed',
    param: 'echouees',
    label: 'Échouées',
    empty: 'Aucune quête échouée pour l’instant.',
  },
  { status: 'rumor', param: 'rumeurs', label: 'Rumeurs', empty: 'Aucune rumeur pour l’instant.' },
];

/**
 * The Quêtes page: quests filtered by status (the filter lives in the URL) and, for
 * `/quetes/:questId`, the quest detail: in a side panel beside the list on desktop, as the
 * page itself on tablet and mobile.
 */
@Component({
  selector: 'quests-page',
  imports: [
    Button,
    ContactChip,
    QuestCard,
    QuestDetail,
    QuestDetailAction,
    QuestGiver,
    RouterLink,
    StatusFilter,
  ],
  host: { class: 'quests' },
  templateUrl: './quests-page.html',
  styleUrl: './quests-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestsPage {
  /** Route parameter: the open quest. */
  readonly questId = input<string>();
  /** Query parameter: accomplies, echouees or rumeurs; En cours without it. */
  readonly statut = input<string>();

  private readonly store = inject(QuestsStore);
  private readonly router = inject(Router);
  private readonly injector = inject(Injector);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  protected readonly layout = injectLayout();

  private readonly filter = computed(
    () => FILTERS.find((f) => f.param === this.statut()) ?? FILTERS[0],
  );
  protected readonly status = computed(() => this.filter().status);
  protected readonly emptyText = computed(() => this.filter().empty);
  protected readonly filters = computed<StatusFilterItem[]>(() =>
    FILTERS.map((f) => ({ id: f.status, label: f.label, count: this.store.counts()[f.status] })),
  );
  protected readonly quests = computed(() =>
    this.store.quests().filter((q) => q.status === this.status()),
  );
  protected readonly selected = computed(() => {
    const id = this.questId();
    return id ? this.store.quest(id) : undefined;
  });
  /** Desktop shows the detail beside the list; smaller screens show it instead of the list. */
  protected readonly inPanel = computed(() => this.layout() === 'desktop');

  private readonly detail = viewChild(QuestDetail);
  private previousId: string | undefined;

  constructor() {
    // An unknown quest: back to the list, without keeping the wrong address in the history.
    effect(() => {
      if (this.questId() && !this.selected()) {
        untracked(() => this.navigate(['/quetes'], { replaceUrl: true }));
      }
    });

    // Focus follows the detail: its title when it opens, the quest's card when it closes.
    effect(() => {
      const id = this.questId();
      const previous = this.previousId;
      this.previousId = id;
      if (id === previous) return;
      afterNextRender(
        () => {
          if (id) this.detail()?.focus();
          else if (previous) this.cardButton(previous)?.focus();
        },
        { injector: this.injector },
      );
    });
  }

  protected selectStatus(status: string | undefined): void {
    const param = FILTERS.find((f) => f.status === status)?.param ?? null;
    // Arrow keys move the selection: no history entry for each step.
    void this.router.navigate([], {
      queryParams: { statut: param },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  protected open(id: string): void {
    this.navigate(['/quetes', id]);
  }

  protected close(): void {
    this.navigate(['/quetes']);
  }

  protected toggleObjective(index: number): void {
    const quest = this.selected();
    if (quest) this.store.toggleObjective(quest.id, index);
  }

  private navigate(commands: string[], extras: { replaceUrl?: boolean } = {}): void {
    void this.router.navigate(commands, { queryParamsHandling: 'preserve', ...extras });
  }

  private cardButton(id: string): HTMLElement | null {
    return this.host.querySelector(`[data-quest="${id}"] .gr-quest__open`);
  }
}
