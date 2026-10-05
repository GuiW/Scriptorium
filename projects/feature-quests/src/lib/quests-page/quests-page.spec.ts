import { BreakpointObserver, type BreakpointState } from '@angular/cdk/layout';
import { computed, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { BehaviorSubject, map } from 'rxjs';
import { QUESTS_MOCK } from '../data/quests.mock';
import { QuestsStore } from '../data/quests.store';
import { QUESTS_ROUTES } from '../quests.routes';

/** A viewport of a fixed width; answers the `(min-width: Npx)` queries of injectLayout(). */
class FakeViewport {
  constructor(private readonly width: number) {}
  isMatched(query: string | string[]): boolean {
    return [query].flat().some((q) => this.width >= Number(/min-width: (\d+)px/.exec(q)![1]));
  }
  observe(query: string | string[]) {
    return new BehaviorSubject(this.width).pipe(
      map((): BreakpointState => ({ matches: this.isMatched(query), breakpoints: {} })),
    );
  }
}

const DESKTOP = 1440;
const TABLET = 1024;
const MOBILE = 390;

/** `mount` is where the app mounts the feature; the app uses `quetes`. */
async function render(url: string, width = DESKTOP, providers: unknown[] = [], mount = 'quetes') {
  TestBed.configureTestingModule({
    providers: [
      { provide: BreakpointObserver, useValue: new FakeViewport(width) },
      provideRouter([{ path: mount, children: QUESTS_ROUTES }], withComponentInputBinding()),
      ...(providers as []),
    ],
  });
  const harness = await RouterTestingHarness.create(url);
  const router = TestBed.inject(Router);
  const page = () => harness.routeNativeElement as HTMLElement;
  const settle = async () => {
    await harness.fixture.whenStable();
    harness.detectChanges();
  };
  return {
    harness,
    router,
    page,
    settle,
    cards: () =>
      [...page().querySelectorAll<HTMLElement>('[data-quest]')].map((c) => c.dataset['quest']),
    card: (id: string) => page().querySelector<HTMLElement>(`[data-quest="${id}"]`)!,
  };
}

describe('QuestsPage', () => {
  afterEach(() => delete document.documentElement.dataset['theme']);

  it('lists the quests in progress by default, under the Quêtes heading', async () => {
    const { page, cards } = await render('/quetes');
    expect(page().querySelector('h1')?.textContent).toBe('Quêtes');
    expect(cards()).toEqual(['q1', 'q2', 'q6']);
    expect(page().querySelector('.quests__panel')).toBeNull();
  });

  it('counts each status in the filter, which controls the list', async () => {
    const { page } = await render('/quetes');
    const filter = page().querySelector('gr-status-filter')!;
    expect(filter.getAttribute('aria-label')).toBe('Filtrer les quêtes');
    const options = [...filter.querySelectorAll('[role="radio"]')];
    expect(options.map((o) => o.textContent!.replace(/\s+/g, ' ').trim())).toEqual([
      'En cours3',
      'Accomplies1',
      'Échouées1',
      'Rumeurs1',
    ]);
    expect(options[0].getAttribute('aria-checked')).toBe('true');
    expect(page().querySelector('#quests-list')).not.toBeNull();
  });

  it('reads the filter from the URL, for every status', async () => {
    const expected = { accomplies: ['q3'], echouees: ['q4'], rumeurs: ['q5'] };
    for (const [param, ids] of Object.entries(expected)) {
      TestBed.resetTestingModule();
      const { page, cards } = await render(`/quetes?statut=${param}`);
      expect(cards(), param).toEqual(ids);
      expect(page().querySelector('[aria-checked="true"]')?.textContent, param).toContain(
        { accomplies: 'Accomplies', echouees: 'Échouées', rumeurs: 'Rumeurs' }[param],
      );
    }
  });

  it('writes the chosen filter to the URL', async () => {
    const { page, router, settle, cards } = await render('/quetes');
    page().querySelectorAll<HTMLButtonElement>('[role="radio"]')[3].click();
    await settle();
    expect(router.url).toBe('/quetes?statut=rumeurs');
    expect(cards()).toEqual(['q5']);

    page().querySelectorAll<HTMLButtonElement>('[role="radio"]')[0].click();
    await settle();
    expect(router.url).toBe('/quetes');
  });

  it('says so when a status has no quest', async () => {
    const quests = signal(QUESTS_MOCK.filter((q) => q.status === 'active'));
    const store = {
      quests,
      counts: computed(() => ({ active: quests().length, completed: 0, failed: 0, rumor: 0 })),
      quest: (id: string) => quests().find((q) => q.id === id),
      toggleObjective: () => undefined,
    };
    const { page, cards } = await render('/quetes?statut=accomplies', DESKTOP, [
      { provide: QuestsStore, useValue: store },
    ]);
    expect(cards()).toEqual([]);
    expect(page().querySelector('.quests__empty')?.textContent).toBe(
      'Aucune quête accomplie pour l’instant.',
    );
  });

  it('opens a quest in a side panel beside the list on desktop, and closes it', async () => {
    const { page, router, settle, card, cards } = await render('/quetes');
    card('q2').querySelector<HTMLButtonElement>('.gr-quest__open')!.click();
    await settle();
    expect(router.url).toBe('/quetes/q2');
    expect(cards()).toEqual(['q1', 'q2', 'q6']);
    expect(card('q2').classList.contains('gr-quest--selected')).toBe(true);
    const panel = page().querySelector('aside.quests__panel')!;
    expect(panel.getAttribute('aria-label')).toBe('Détail de la quête');
    expect(panel.querySelector('h2')?.textContent).toBe('Le serment des Cendres');
    expect(document.activeElement).toBe(panel.querySelector('h2'));

    const close = panel.querySelector<HTMLButtonElement>('[questsDetailAction]')!;
    expect(close.textContent!.trim()).toBe('Fermer');
    close.click();
    await settle();
    expect(router.url).toBe('/quetes');
    expect(page().querySelector('.quests__panel')).toBeNull();
    expect(document.activeElement).toBe(card('q2').querySelector('.gr-quest__open'));
  });

  it('builds a new detail, with its entrance, for another quest but not for a ticked objective', async () => {
    const { page, settle, card } = await render('/quetes/q1');
    const detail = () => page().querySelector('.quests__panel quests-quest-detail')!;
    const first = detail();

    page().querySelectorAll<HTMLButtonElement>('.quests__panel .gr-obj__box')[2].click();
    await settle();
    expect(detail()).toBe(first);

    card('q2').querySelector<HTMLButtonElement>('.gr-quest__open')!.click();
    await settle();
    expect(detail()).not.toBe(first);
    expect(detail().querySelector('h2')?.textContent).toBe('Le serment des Cendres');
  });

  it('orders the cards of a filter for their staggered entrance', async () => {
    const { card } = await render('/quetes');
    expect(
      ['q1', 'q2', 'q6'].map((id) => card(id).style.getPropertyValue('--quests-order')),
    ).toEqual(['0', '1', '2']);
  });

  it('works wherever the app mounts it, without knowing its own path', async () => {
    const mount = 'campagne/:campagne/registre';
    const { page, router, settle, card } = await render(
      '/campagne/c1/registre?statut=echouees',
      DESKTOP,
      [],
      mount,
    );
    card('q4').querySelector<HTMLButtonElement>('.gr-quest__open')!.click();
    await settle();
    expect(router.url).toBe('/campagne/c1/registre/q4?statut=echouees');

    page().querySelector<HTMLButtonElement>('.quests__panel [questsDetailAction]')!.click();
    await settle();
    expect(router.url).toBe('/campagne/c1/registre?statut=echouees');

    await router.navigateByUrl('/campagne/c1/registre/nope');
    await settle();
    expect(router.url).toBe('/campagne/c1/registre');

    TestBed.resetTestingModule();
    const tablet = await render('/campagne/c2/registre/q1', TABLET, [], mount);
    expect(tablet.page().querySelector('a.gr-btn')?.getAttribute('href')).toBe(
      '/campagne/c2/registre',
    );
  });

  it('keeps the filter when a quest opens and closes', async () => {
    const { router, settle, card } = await render('/quetes?statut=echouees');
    card('q4').querySelector<HTMLButtonElement>('.gr-quest__open')!.click();
    await settle();
    expect(router.url).toBe('/quetes/q4?statut=echouees');
  });

  it('shows the quest as its own page on tablet and mobile, with a link back', async () => {
    for (const width of [TABLET, MOBILE]) {
      TestBed.resetTestingModule();
      const { page } = await render('/quetes/q1?statut=accomplies', width);
      expect(page().querySelector('.quests__grid'), `${width}px`).toBeNull();
      expect(page().querySelector('.quests__panel'), `${width}px`).toBeNull();
      expect(page().querySelector('h1')?.textContent, `${width}px`).toBe('La crypte sous Otari');
      expect(document.activeElement, `${width}px`).toBe(page().querySelector('h1'));
      const back = page().querySelector('a.gr-btn')!;
      expect(back.textContent!.trim(), `${width}px`).toBe('‹ Retour aux quêtes');
      expect(back.getAttribute('href'), `${width}px`).toBe('/quetes?statut=accomplies');
      expect(back.className, `${width}px`).toBe('gr-btn gr-btn--ghost');
    }
  });

  it('ticks an objective from the detail: the card progress follows', async () => {
    const { page, settle, card } = await render('/quetes/q1');
    expect(card('q1').querySelector('.gr-count')?.textContent).toBe('2/4');
    page().querySelectorAll<HTMLButtonElement>('.quests__panel .gr-obj__box')[2].click();
    await settle();
    expect(card('q1').querySelector('.gr-count')?.textContent).toBe('3/4');
    expect(TestBed.inject(QuestsStore).quest('q1')!.objectives[2].done).toBe(true);
  });

  it('goes back to the list for an unknown quest', async () => {
    const { router, settle, page } = await render('/quetes/nope?statut=rumeurs');
    await settle();
    expect(router.url).toBe('/quetes?statut=rumeurs');
    expect(page().querySelector('h1')?.textContent).toBe('Quêtes');
  });

  it('renders the same page under the dungeon theme', async () => {
    for (const [url, width] of [
      ['/quetes', DESKTOP],
      ['/quetes/q2', DESKTOP],
      ['/quetes/q6', MOBILE],
    ] as const) {
      // Each instance numbers its objectives heading and boxes.
      const html = (el: HTMLElement) =>
        el.outerHTML.replace(/(quest-objectives|gr-obj)-[a-z]*\d+/g, 'id');
      TestBed.resetTestingModule();
      const light = html((await render(url, width)).page());
      TestBed.resetTestingModule();
      document.documentElement.dataset['theme'] = 'dungeon';
      const dark = html((await render(url, width)).page());
      delete document.documentElement.dataset['theme'];
      expect(dark, url).toBe(light);
    }
  });
});
