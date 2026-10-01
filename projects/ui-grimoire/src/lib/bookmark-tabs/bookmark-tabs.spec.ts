import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import type { BookmarkNavItem } from '../bookmark-nav/bookmark-nav';
import { BookmarkTabs } from './bookmark-tabs';

/** The canvas's navigation, plus one entry without an icon. */
const ITEMS: BookmarkNavItem[] = [
  { id: 'quests', label: 'Quêtes', link: '/quetes', icon: 'quete', count: 3 },
  { id: 'journal', label: 'Journal', link: '/journal', icon: 'journal' },
  { id: 'contacts', label: 'Contacts', link: '/contacts', icon: 'joueurs' },
  { id: 'd1', divider: true },
  { id: 'places', label: 'Lieux', link: '/lieux' },
  { id: 'loot', label: 'Butin', link: '/butin', icon: 'butin', count: 0 },
  { id: 'settings', label: 'Réglages', link: '/reglages', icon: 'reglages' },
];

@Component({
  imports: [BookmarkTabs],
  template: `<div [attr.data-theme]="theme()"><nav grBookmarkTabs [items]="items"></nav></div>`,
})
class Host {
  readonly theme = input<string>();
  readonly items = ITEMS;
}

async function render(inputs: Partial<Record<keyof Host, unknown>> = {}, url = '/quetes') {
  TestBed.configureTestingModule({ providers: [provideRouter([{ path: '**', children: [] }])] });
  await TestBed.inject(Router).navigateByUrl(url);
  const fixture = TestBed.createComponent(Host);
  for (const [key, value] of Object.entries(inputs)) fixture.componentRef.setInput(key, value);
  await fixture.whenStable();
  const nav = (fixture.nativeElement as HTMLElement).querySelector('nav')!;
  const tabs = () => [...nav.querySelectorAll<HTMLAnchorElement>('a.gr-btabs__tab')];
  return { fixture, nav, tabs };
}

describe('BookmarkTabs', () => {
  it('renders a labelled bar of links, dividers ignored, five entries at most', async () => {
    const r = await render();
    expect(r.nav.className).toBe('gr-btabs');
    expect(r.nav.getAttribute('aria-label')).toBe('Navigation principale');
    expect(r.tabs().map((a) => a.querySelector('.gr-btabs__label')?.textContent)).toEqual([
      'Quêtes',
      'Journal',
      'Contacts',
      'Lieux',
      'Butin',
    ]);
    expect(r.tabs().map((a) => a.getAttribute('href'))).toEqual([
      '/quetes',
      '/journal',
      '/contacts',
      '/lieux',
      '/butin',
    ]);
  });

  it('shows a 16px icon in a decorative ribbon, or ◆ by default', async () => {
    const r = await render();
    const ribbon = r.tabs()[0].querySelector('.gr-btabs__ribbon')!;
    expect(ribbon.getAttribute('aria-hidden')).toBe('true');
    expect(ribbon.querySelector('.gr-btabs__icon svg')?.getAttribute('width')).toBe('16');
    expect(r.tabs()[3].querySelector('.gr-btabs__icon')?.textContent?.trim()).toBe('◆');
  });

  it('turns a count into a dot, with the number for screen readers', async () => {
    const r = await render();
    expect(r.tabs()[0].querySelector('.gr-btabs__dot')).not.toBeNull();
    expect(r.tabs()[0].querySelector('.gr-sr')?.textContent).toBe(', 3');
    expect(r.tabs()[1].querySelector('.gr-btabs__dot')).toBeNull();
    // 0 means nothing new: no dot.
    expect(r.tabs()[4].querySelector('.gr-btabs__dot')).toBeNull();
    expect(r.tabs()[4].querySelector('.gr-sr')).toBeNull();
  });

  it('marks the current page, and follows navigation', async () => {
    const r = await render();
    const active = () =>
      r.tabs().filter((a) => a.classList.contains('gr-btabs__tab--on')).map((a) => a.getAttribute('href'));
    expect(active()).toEqual(['/quetes']);
    expect(r.tabs()[0].getAttribute('aria-current')).toBe('page');
    await TestBed.inject(Router).navigateByUrl('/lieux');
    await r.fixture.whenStable();
    expect(active()).toEqual(['/lieux']);
    expect(r.tabs()[3].getAttribute('aria-current')).toBe('page');
    expect(r.tabs()[0].hasAttribute('aria-current')).toBe(false);
  });

  it('renders the same markup under the dungeon theme', async () => {
    const light = await render();
    TestBed.resetTestingModule();
    const dark = await render({ theme: 'dungeon' });
    expect(dark.nav.outerHTML).toBe(light.nav.outerHTML);
  });
});
