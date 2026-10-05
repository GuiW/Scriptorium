import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { QuestsStore } from '@scriptorium/feature-quests/data';
import { provideTestViewport } from '@scriptorium/ui-grimoire/testing';
import { PAGES } from '../pages';
import { Shell } from './shell';

@Component({ template: `<h1>Page</h1>` })
class Page {}

async function render(width: number, theme?: string) {
  TestBed.configureTestingModule({
    providers: [
      provideTestViewport(width),
      provideRouter([
        {
          path: '',
          component: Shell,
          children: Object.values(PAGES).map(({ path }) => ({ path, component: Page })),
        },
      ]),
    ],
  });
  document.documentElement.dataset['theme'] = theme ?? 'parchment';
  const harness = await RouterTestingHarness.create('/quetes');
  const root = harness.routeNativeElement!.closest('app-shell') as HTMLElement;
  return { harness, root };
}

const labels = (root: HTMLElement, selector: string) =>
  [...root.querySelectorAll(selector)].map((el) => el.textContent!.trim());

describe('Shell', () => {
  afterEach(() => delete document.documentElement.dataset['theme']);

  it('shows the full BookmarkNav on desktop, with the campaign and the session', async () => {
    const { root } = await render(1440);
    const nav = root.querySelector('nav.gr-bnav')!;
    expect(nav.classList.contains('gr-bnav--rail')).toBe(false);
    expect(nav.querySelector('.gr-bnav__kicker')?.textContent).toBe('Campagne');
    expect(nav.querySelector('.gr-bnav__title')?.textContent).toBe("L'Âge des Cendres");
    expect(nav.querySelector('.gr-bnav__foot')?.textContent).toBe('Session XIV · 12 septembre');
    expect(labels(root, '.gr-bnav__label')).toEqual([
      'Quêtes',
      'Journal',
      'Contacts',
      'Lieux',
      'Butin',
      'Réglages',
    ]);
    expect(root.querySelector('.gr-btabs')).toBeNull();
    expect(root.querySelector('main h1')?.textContent).toBe('Page');
  });

  it('shows the rail on tablet', async () => {
    const { root } = await render(1024);
    expect(root.querySelector('nav.gr-bnav')?.classList.contains('gr-bnav--rail')).toBe(true);
    expect(root.querySelector('.gr-bnav__foot')).toBeNull();
    expect(root.querySelector('.gr-btabs')).toBeNull();
  });

  it('shows the BookmarkTabs after the page on mobile, with Réglages in the five entries', async () => {
    const { root } = await render(390);
    expect(root.querySelector('.gr-bnav')).toBeNull();
    const tabs = root.querySelector('nav.gr-btabs')!;
    expect(root.querySelector('main')!.nextElementSibling).toBe(tabs);
    expect(labels(root, '.gr-btabs__label')).toEqual([
      'Quêtes',
      'Journal',
      'Contacts',
      'Butin',
      'Réglages',
    ]);
    expect(tabs.querySelector('a[href="/reglages"]')).not.toBeNull();
  });

  it('marks Quêtes as the current page and counts the quests in progress', async () => {
    const { root, harness } = await render(1440);
    const current = root.querySelector('[aria-current="page"]')!;
    expect(current.getAttribute('href')).toBe('/quetes');
    expect(current.querySelector('.gr-bnav__count')?.textContent).toBe('3');
    expect(TestBed.inject(QuestsStore).counts().active).toBe(3);

    await harness.navigateByUrl('/journal');
    expect(root.querySelector('[aria-current="page"]')?.getAttribute('href')).toBe('/journal');
  });

  it('renders the same navigation under the dungeon theme', async () => {
    for (const width of [1440, 1024, 390]) {
      TestBed.resetTestingModule();
      const light = (await render(width)).root.querySelector('nav')!.outerHTML;
      TestBed.resetTestingModule();
      const dark = (await render(width, 'dungeon')).root.querySelector('nav')!.outerHTML;
      expect(dark, `${width}px`).toBe(light);
    }
  });
});
