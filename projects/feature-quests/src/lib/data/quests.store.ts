import { Injectable, computed, signal } from '@angular/core';
import type { QuestStatus } from '@scriptorium/ui-grimoire';
import type { Quest } from './quest';
import { QUESTS_MOCK } from './quests.mock';

/**
 * The campaign's quests, as signals. Mock data for now: when the backend arrives, only the
 * inside of this store changes (an httpResource and its calls), components keep reading the
 * same signals.
 */
@Injectable({ providedIn: 'root' })
export class QuestsStore {
  private readonly state = signal<readonly Quest[]>(QUESTS_MOCK);

  readonly quests = this.state.asReadonly();
  /** Number of quests in each status: StatusFilter counts, BookmarkNav counter. */
  readonly counts = computed(() => {
    const counts: Record<QuestStatus, number> = { active: 0, completed: 0, failed: 0, rumor: 0 };
    for (const quest of this.state()) counts[quest.status]++;
    return counts;
  });

  quest(id: string): Quest | undefined {
    return this.state().find((quest) => quest.id === id);
  }

  /** Ticks or unticks an objective; the quest and its objective list are replaced, not mutated. */
  toggleObjective(questId: string, index: number): void {
    this.state.update((quests) =>
      quests.map((quest) =>
        quest.id === questId && quest.objectives[index]
          ? {
              ...quest,
              objectives: quest.objectives.map((o, i) =>
                i === index ? { ...o, done: !o.done } : o,
              ),
            }
          : quest,
      ),
    );
  }
}
