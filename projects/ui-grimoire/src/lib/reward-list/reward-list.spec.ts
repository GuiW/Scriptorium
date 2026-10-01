import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Icon, type IconName } from '../icon/icon';
import { REWARD_ICONS } from '../shared/rewards';
import type { Reward } from '../shared/types';
import { RewardList } from './reward-list';

@Component({
  imports: [RewardList],
  template: `<div [attr.data-theme]="theme()">
    @if (title() === undefined) {
      <gr-reward-list [rewards]="rewards()" />
    } @else {
      <gr-reward-list [rewards]="rewards()" [title]="title()!" />
    }
  </div>`,
})
class Host {
  readonly theme = input<string>();
  readonly rewards = input<Reward[]>([]);
  readonly title = input<string | false>();
}

async function render(inputs: Partial<Record<keyof Host, unknown>> = {}) {
  const fixture = TestBed.createComponent(Host);
  for (const [key, value] of Object.entries(inputs)) fixture.componentRef.setInput(key, value);
  await fixture.whenStable();
  const list = (fixture.nativeElement as HTMLElement).querySelector('gr-reward-list');
  if (!list) throw new Error('no reward list rendered');
  const items = [...list.querySelectorAll('li')];
  return { list, items, title: list.querySelector('.gr-rewards__title') };
}

/** Class order is not meaningful: Angular's class bindings may reorder it. */
const classes = (el: Element) => [...el.classList].sort();

/** Q1 of the canvas, plus one reward of every other kind. */
const ALL: Reward[] = [
  { kind: 'coin', label: '250 po' },
  { kind: 'xp', label: '80 XP' },
  { kind: 'item', label: 'Lame de lune', rarity: 'rare', note: 'épée longue +1' },
  { kind: 'item', label: 'Potion de guérison moyenne', rarity: 'uncommon' },
  { kind: 'reputation', label: 'Chevaliers de Lastwall +2' },
  { kind: 'other', label: 'Un repas chez les Emberlyn' },
];

@Component({
  imports: [Icon],
  template: `<gr-icon [name]="name()" [size]="16" />`,
})
class RefIcon {
  readonly name = input.required<IconName>();
}

/** Drawing of a 16px icon rendered on its own, to tell icons apart. */
async function iconDrawing(name: IconName): Promise<string | undefined> {
  const fixture = TestBed.createComponent(RefIcon);
  fixture.componentRef.setInput('name', name);
  await fixture.whenStable();
  return (fixture.nativeElement as HTMLElement).querySelector('svg')?.innerHTML;
}

describe('RewardList', () => {
  it('renders the default title and one line per reward with its kind icon', async () => {
    const r = await render({ rewards: ALL });
    expect(r.list.className).toBe('gr-rewards');
    expect(r.title?.textContent).toBe('Récompenses');
    expect(r.list.querySelector('ul')?.className).toBe('gr-rewards__list');
    expect(r.items.length).toBe(6);
    for (const [i, reward] of ALL.entries()) {
      expect(r.items[i].classList.contains(`gr-reward--${reward.kind}`)).toBe(true);
      const glyph = r.items[i].querySelector('.gr-reward__glyph');
      expect(glyph?.getAttribute('aria-hidden')).toBe('true');
      const svg = glyph?.querySelector('svg');
      expect(svg?.getAttribute('width')).toBe('16');
      expect(svg?.innerHTML, reward.kind).toBe(await iconDrawing(REWARD_ICONS[reward.kind]));
      expect(r.items[i].querySelector('.gr-reward__label')?.textContent).toContain(reward.label);
    }
  });

  it('shows the rarity word, except for common items', async () => {
    const r = await render({
      rewards: [
        { kind: 'item', label: 'Corde', rarity: 'common' },
        { kind: 'item', label: 'Potion', rarity: 'uncommon' },
        { kind: 'item', label: 'Lame', rarity: 'rare' },
        { kind: 'item', label: 'Couronne', rarity: 'unique' },
      ],
    });
    expect(r.items.map((li) => li.querySelector('.gr-reward__rarity')?.textContent ?? null)).toEqual([
      null,
      'Peu courant',
      'Rare',
      'Unique',
    ]);
    expect(classes(r.items[2])).toEqual(['gr-rarity--rare', 'gr-reward', 'gr-reward--item']);
  });

  it('adds the note in the label', async () => {
    const r = await render({ rewards: ALL });
    const note = r.items[2].querySelector('.gr-reward__label .gr-reward__note');
    expect(note?.textContent).toBe('épée longue +1');
  });

  it('marks a restricted reward with a compact visibility marker', async () => {
    const r = await render({
      rewards: [
        { kind: 'item', label: 'Clé du caveau', visibility: { level: 'gm' } },
        { kind: 'other', label: 'Une faveur', visibility: { level: 'players', players: [{ name: 'Kyra' }] } },
        { kind: 'coin', label: '10 po', visibility: { level: 'table' } },
      ],
    });
    expect(r.items[0].querySelector('.gr-vis')?.textContent?.trim()).toBe('Secret MJ');
    expect(r.items[1].querySelector('.gr-vis')?.lastElementChild?.textContent).toBe('Kyra');
    expect(r.items[2].querySelector('.gr-vis')).toBeNull();
  });

  it('accepts a custom title and removes it with false', async () => {
    expect((await render({ rewards: ALL, title: 'Butin promis' })).title?.textContent).toBe('Butin promis');
    expect((await render({ rewards: ALL, title: false })).title).toBeNull();
  });

  it('renders the same markup under the dungeon theme', async () => {
    const light = await render({ rewards: ALL });
    const dark = await render({ rewards: ALL, theme: 'dungeon' });
    expect(dark.list.outerHTML).toBe(light.list.outerHTML);
  });
});
