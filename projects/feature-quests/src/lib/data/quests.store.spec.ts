import { TestBed } from '@angular/core/testing';
import { QUESTS_MOCK } from './quests.mock';
import { QuestsStore } from './quests.store';

describe('QuestsStore', () => {
  let store: QuestsStore;
  beforeEach(() => (store = TestBed.inject(QuestsStore)));

  it('starts with the six canvas quests, one Secret MJ and one shared with Kyra', () => {
    const quests = store.quests();
    expect(quests).toHaveLength(6);
    expect(quests.filter((q) => q.visibility?.level === 'gm')).toHaveLength(1);
    expect(
      quests.filter((q) => q.visibility?.players?.some((p) => p.name === 'Kyra')),
    ).toHaveLength(1);
  });

  it('counts the quests of each status', () => {
    expect(store.counts()).toEqual({ active: 3, completed: 1, failed: 1, rumor: 1 });
  });

  it('finds a quest by id', () => {
    expect(store.quest('q1')?.title).toBe('La crypte sous Otari');
    expect(store.quest('nope')).toBeUndefined();
  });

  it('toggles an objective without mutating the previous state', () => {
    const before = store.quests();
    const crypt = store.quest('q1')!;
    expect(crypt.objectives[2].done).toBeFalsy();

    store.toggleObjective('q1', 2);

    const after = store.quest('q1')!;
    expect(after.objectives[2].done).toBe(true);
    expect(after).not.toBe(crypt);
    expect(store.quests()).not.toBe(before);
    expect(crypt.objectives[2].done).toBeFalsy();
    expect(QUESTS_MOCK[0].objectives[2].done).toBeFalsy();
    // Untouched quests keep their identity.
    expect(store.quest('q2')).toBe(before[1]);

    store.toggleObjective('q1', 2);
    expect(store.quest('q1')!.objectives[2].done).toBe(false);
  });

  it('ignores an unknown quest or objective', () => {
    const before = store.quests();
    store.toggleObjective('nope', 0);
    store.toggleObjective('q5', 0);
    expect(store.quests()).toEqual(before);
  });
});
