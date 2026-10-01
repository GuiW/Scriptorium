import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import {
  BookmarkNav,
  campaignInitial,
  type BookmarkNavItem,
  type BookmarkNavVariant,
} from './bookmark-nav';

/** The canvas's navigation. */
const NAV_ITEMS: BookmarkNavItem[] = [
  { id: 'quests', label: 'Quêtes', link: '/quetes', icon: 'quete', count: 3 },
  { id: 'journal', label: 'Journal', link: '/journal', icon: 'journal' },
  { id: 'contacts', label: 'Contacts', link: '/contacts', icon: 'joueurs' },
  { id: 'places', label: 'Lieux', link: '/lieux', icon: 'carte' },
  { id: 'loot', label: 'Butin', link: '/butin', icon: 'butin' },
  { id: 'd1', divider: true },
  { id: 'settings', label: 'Réglages', link: '/reglages', icon: 'reglages' },
];

@Component({
  imports: [BookmarkNav],
  template: `<div [attr.data-theme]="theme()">
    <nav
      grBookmarkNav
      [items]="items"
      [variant]="variant()"
      kicker="Campagne"
      [title]="'L\\'Âge des Cendres'"
      footer="Session XIV · 12 septembre"
    ></nav>
  </div>`,
})
class Host {
  readonly theme = input<string>();
  readonly variant = input<BookmarkNavVariant>('full');
  readonly items = NAV_ITEMS;
}

async function render(inputs: Partial<Record<keyof Host, unknown>> = {}, url = '/quetes') {
  TestBed.configureTestingModule({ providers: [provideRouter([{ path: '**', children: [] }])] });
  await TestBed.inject(Router).navigateByUrl(url);
  const fixture = TestBed.createComponent(Host);
  for (const [key, value] of Object.entries(inputs)) fixture.componentRef.setInput(key, value);
  await fixture.whenStable();
  const nav = (fixture.nativeElement as HTMLElement).querySelector('nav')!;
  const links = () => [...nav.querySelectorAll<HTMLAnchorElement>('a.gr-bnav__ribbon')];
  const active = () => links().filter((a) => a.classList.contains('gr-bnav__ribbon--on'));
  return { fixture, nav, links, active };
}

/** Class order is not meaningful: Angular's [class] binding may reorder it. */
const classes = (el: Element) => [...el.classList].sort();

describe('BookmarkNav', () => {
  it('renders a labelled nav with the campaign head, the bookmarks and the footer', async () => {
    const r = await render();
    expect(r.nav.className).toBe('gr-bnav');
    expect(r.nav.getAttribute('aria-label')).toBe('Navigation principale');
    expect(r.nav.hasAttribute('title')).toBe(false);
    expect(r.nav.querySelector('.gr-bnav__kicker')?.textContent).toBe('Campagne');
    expect(r.nav.querySelector('.gr-bnav__title')?.textContent).toBe("L'Âge des Cendres");
    expect(r.nav.querySelector('.gr-bnav__foot')?.textContent).toBe('Session XIV · 12 septembre');
    expect(r.links().map((a) => a.querySelector('.gr-bnav__label')?.textContent)).toEqual([
      'Quêtes',
      'Journal',
      'Contacts',
      'Lieux',
      'Butin',
      'Réglages',
    ]);
  });

  it('makes every entry a link to its page, with a 16px decorative icon', async () => {
    const r = await render();
    expect(r.links().map((a) => a.getAttribute('href'))).toEqual([
      '/quetes',
      '/journal',
      '/contacts',
      '/lieux',
      '/butin',
      '/reglages',
    ]);
    const icon = r.links()[0].querySelector('.gr-bnav__icon');
    expect(icon?.getAttribute('aria-hidden')).toBe('true');
    expect(icon?.querySelector('svg')?.getAttribute('width')).toBe('16');
  });

  it('marks the current page, and follows navigation', async () => {
    const r = await render();
    expect(r.active().map((a) => a.textContent?.trim())).toEqual(['Quêtes3']);
    expect(r.active()[0].getAttribute('aria-current')).toBe('page');
    expect(r.links()[1].hasAttribute('aria-current')).toBe(false);

    await TestBed.inject(Router).navigateByUrl('/journal');
    await r.fixture.whenStable();
    expect(r.active().map((a) => a.getAttribute('href'))).toEqual(['/journal']);
    expect(r.links()[1].getAttribute('aria-current')).toBe('page');
    expect(r.links()[0].hasAttribute('aria-current')).toBe(false);
  });

  it('keeps a section active on its sub-pages', async () => {
    const r = await render({}, '/quetes/q1');
    expect(r.active().map((a) => a.getAttribute('href'))).toEqual(['/quetes']);
  });

  it('separates groups with a divider and shows the count in full', async () => {
    const r = await render();
    const divider = r.nav.querySelector('li.gr-bnav__divider');
    expect(divider?.getAttribute('role')).toBe('separator');
    expect(divider?.previousElementSibling?.textContent).toContain('Butin');
    expect(r.links()[0].querySelector('.gr-bnav__count')?.textContent).toBe('3');
    expect(r.links()[1].querySelector('.gr-bnav__count')).toBeNull();
  });

  it('reduces the rail to a seal, short labels and a counter read out to screen readers', async () => {
    const r = await render({ variant: 'rail' });
    expect(classes(r.nav)).toEqual(['gr-bnav', 'gr-bnav--rail']);
    const head = r.nav.querySelector('.gr-bnav__head')!;
    expect(head.getAttribute('title')).toBe("L'Âge des Cendres");
    expect(head.querySelector('.gr-bnav__mono')?.textContent).toBe('A');
    expect(head.querySelector('.gr-bnav__mono')?.getAttribute('aria-hidden')).toBe('true');
    expect(head.querySelector('.gr-sr')?.textContent).toBe("L'Âge des Cendres");
    expect(r.nav.querySelector('.gr-bnav__kicker')).toBeNull();
    expect(r.nav.querySelector('.gr-bnav__foot')).toBeNull();
    const count = r.links()[0].querySelector('.gr-bnav__count')!;
    expect(count.querySelector('[aria-hidden="true"]')?.textContent).toBe('3');
    expect(count.querySelector('.gr-sr')?.textContent).toBe(', 3');
  });

  it('takes the campaign initial without its article or accent', () => {
    expect(campaignInitial("L'Âge des Cendres")).toBe('A');
    expect(campaignInitial('Les Éclats de Sarenrae')).toBe('E');
    expect(campaignInitial('Otari')).toBe('O');
  });

  it('renders the same markup under the dungeon theme', async () => {
    for (const variant of ['full', 'rail'] as const) {
      const light = await render({ variant });
      TestBed.resetTestingModule();
      const dark = await render({ variant, theme: 'dungeon' });
      expect(dark.nav.outerHTML, variant).toBe(light.nav.outerHTML);
      TestBed.resetTestingModule();
    }
  });
});
