import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { QuestStatus } from '../badge/badge';
import { ContactChip } from '../contact-chip/contact-chip';
import type { QuestObjective, Reward, VisibilityValue } from '../shared/types';
import { QuestCard, QuestGiver } from './quest-card';

/** Q1 of the canvas. */
const OBJECTIVES: QuestObjective[] = [
  { label: "Interroger le forgeron d'Otari", done: true },
  { label: "Trouver l'entrée de la crypte", done: true },
  { label: 'Retrouver le médaillon de la prêtresse' },
  {
    label: 'Épargner le gardien squelette',
    optional: true,
    visibility: { level: 'players', players: [{ name: 'Kyra' }] },
  },
];
const REWARDS: Reward[] = [
  { kind: 'coin', label: '250 po' },
  { kind: 'xp', label: '80 XP' },
  { kind: 'item', label: 'Lame de lune', rarity: 'rare' },
];

@Component({
  imports: [ContactChip, QuestCard, QuestGiver],
  template: `<div [attr.data-theme]="theme()">
    <article
      grQuestCard
      [title]="'La crypte sous Otari'"
      [status]="status()"
      [giver]="giver()"
      [location]="location()"
      [level]="level()"
      [summary]="summary()"
      [objectives]="objectives()"
      [showObjectives]="showObjectives()"
      [rewards]="rewards()"
      [showRewards]="showRewards()"
      [visibility]="visibility()"
      [selected]="selected()"
      [selectable]="selectable()"
      (activate)="activations = activations + 1"
      (objectiveToggle)="toggled.push($event)"
    >
      @if (chip()) {
        <gr-contact-chip grQuestGiver name="Wrin Sivinxi" [reputation]="3" link />
      }
    </article>
  </div>`,
})
class Host {
  readonly theme = input<string>();
  readonly status = input<QuestStatus>('active');
  readonly giver = input<string>();
  readonly chip = input(false);
  readonly location = input<string>('Otari');
  readonly level = input<number>(2);
  readonly summary = input<string>('Des lueurs ont été vues sous la vieille chapelle.');
  readonly objectives = input<QuestObjective[]>(OBJECTIVES);
  readonly showObjectives = input(false);
  readonly rewards = input<Reward[]>(REWARDS);
  readonly showRewards = input(false);
  readonly visibility = input<VisibilityValue>();
  readonly selected = input(false);
  readonly selectable = input(false);
  activations = 0;
  toggled: number[] = [];
}

async function render(inputs: Partial<Record<keyof Host, unknown>> = {}) {
  const fixture = TestBed.createComponent(Host);
  for (const [key, value] of Object.entries(inputs)) fixture.componentRef.setInput(key, value);
  await fixture.whenStable();
  const card = (fixture.nativeElement as HTMLElement).querySelector('article');
  if (!card) throw new Error('no quest card rendered');
  const q = <T extends Element = HTMLElement>(s: string) => card.querySelector<T>(s);
  return { fixture, card, q, host: fixture.componentInstance };
}

/** Class order is not meaningful: Angular's [class] binding may reorder it. */
const classes = (el: Element) => [...el.classList].sort();
const text = (el: Element | null) => el?.textContent?.replace(/\s+/g, ' ').trim();

describe('QuestCard', () => {
  it('renders an article with its title, status badge, summary and no tooltip', async () => {
    const r = await render();
    expect(r.card.tagName).toBe('ARTICLE');
    expect(classes(r.card)).toEqual(['gr-quest', 'gr-quest--active']);
    expect(r.card.hasAttribute('title')).toBe(false);
    expect(text(r.q('h3.gr-quest__title'))).toBe('La crypte sous Otari');
    expect(r.q('h3 button')).toBeNull();
    expect(r.q('.gr-quest__head gr-badge')?.className).toBe('gr-badge gr-badge--active');
    expect(text(r.q('p.gr-quest__summary'))).toBe('Des lueurs ont été vues sous la vieille chapelle.');
  });

  it('renders every status with its badge and track colour class', async () => {
    for (const status of ['active', 'completed', 'failed', 'rumor'] as const) {
      const r = await render({ status });
      expect(r.card.classList.contains(`gr-quest--${status}`), status).toBe(true);
      expect(r.q('gr-badge')?.classList.contains(`gr-badge--${status}`), status).toBe(true);
    }
  });

  it('builds the meta line from a plain giver, the place and the level', async () => {
    const r = await render({ giver: 'Wrin Sivinxi' });
    expect(text(r.q('.gr-quest__meta'))).toBe('Donnée par Wrin Sivinxi · Otari · Niv. 2');
    expect(r.card.querySelectorAll('.gr-quest__meta .gr-nowrap').length).toBe(3);
  });

  it('accepts a projected ContactChip as the giver', async () => {
    const r = await render({ chip: true });
    const chip = r.q('.gr-quest__meta .gr-nowrap button.gr-chip--link');
    expect(chip?.querySelector('.gr-chip__name')?.textContent).toBe('Wrin Sivinxi');
    expect(text(r.q('.gr-quest__meta'))).toBe('Donnée par W Wrin Sivinxi, Amical · Otari · Niv. 2');
  });

  it('drops missing meta parts and the whole line when empty', async () => {
    expect(text((await render({ level: undefined })).q('.gr-quest__meta'))).toBe('Otari');
    const none = await render({ location: undefined, level: undefined });
    expect(none.q('.gr-quest__meta')).toBeNull();
  });

  it('shows objective progress as a labelled progress bar', async () => {
    const r = await render();
    const track = r.q('.gr-quest__foot .gr-track')!;
    expect(track.getAttribute('role')).toBe('progressbar');
    expect(track.getAttribute('aria-label')).toBe('Objectifs');
    expect(track.getAttribute('aria-valuemin')).toBe('0');
    expect(track.getAttribute('aria-valuemax')).toBe('4');
    expect(track.getAttribute('aria-valuenow')).toBe('2');
    expect(r.q('.gr-track__fill')?.style.width).toBe('50%');
    expect(r.q('.gr-count')?.textContent).toBe('2/4');
    expect(r.q('.gr-quest__foot gr-reward-summary')).not.toBeNull();
  });

  it('keeps the reward summary right-aligned without objectives, and drops an empty foot', async () => {
    const rewardsOnly = await render({ objectives: [] });
    expect(rewardsOnly.q('.gr-track')).toBeNull();
    expect(rewardsOnly.q<HTMLElement>('.gr-quest__foot > div')?.style.flex).toBe('1 1 0%');
    expect(rewardsOnly.q('gr-reward-summary')).not.toBeNull();
    const empty = await render({ objectives: [], rewards: [] });
    expect(empty.q('.gr-quest__foot')).toBeNull();
  });

  it('frames a GM-only quest and one shared with Kyra', async () => {
    const gm = await render({ visibility: { level: 'gm' } });
    expect(classes(gm.card)).toEqual(['gr-quest', 'gr-quest--active', 'gr-quest--restricted']);
    expect(text(gm.q('.gr-quest__vis'))).toBe('Secret MJ');
    const kyra = await render({ visibility: { level: 'players', players: [{ name: 'Kyra' }] } });
    expect(kyra.card.classList.contains('gr-quest--restricted-players')).toBe(true);
    expect(kyra.q('.gr-quest__vis .gr-vis--players')?.lastElementChild?.textContent).toBe('Pour Kyra');
    const table = await render({ visibility: { level: 'table' } });
    expect(table.q('.gr-quest__vis')).toBeNull();
  });

  it('spreads a gold ring once when the card becomes selected, never on the first render', async () => {
    const already = await render({ selectable: true, selected: true });
    expect(already.card.classList.contains('gr-quest--chosen')).toBe(false);

    const r = await render({ selectable: true, showObjectives: true });
    r.fixture.componentRef.setInput('selected', true);
    await r.fixture.whenStable();
    expect(r.card.classList.contains('gr-quest--chosen')).toBe(true);
    // A child's animation (an objective stamp) bubbling up does not end the ring.
    r.q('.gr-obj__box')!.dispatchEvent(new Event('animationend', { bubbles: true }));
    await r.fixture.whenStable();
    expect(r.card.classList.contains('gr-quest--chosen')).toBe(true);
    r.card.dispatchEvent(new Event('animationend', { bubbles: true }));
    await r.fixture.whenStable();
    expect(r.card.classList.contains('gr-quest--chosen')).toBe(false);
  });

  it('becomes selectable through a stretched button in the title', async () => {
    const r = await render({ selectable: true, selected: true });
    expect(r.card.tagName).toBe('ARTICLE');
    expect(r.card.classList.contains('gr-quest--selected')).toBe(true);
    const open = r.q<HTMLButtonElement>('h3.gr-quest__title > button.gr-quest__open')!;
    expect(open.getAttribute('type')).toBe('button');
    expect(open.getAttribute('aria-pressed')).toBe('true');
    expect(text(open)).toBe('La crypte sous Otari');
    open.click();
    expect(r.host.activations).toBe(1);
  });

  it('marks a detailed card, whose summary is not clamped', async () => {
    expect((await render()).card.classList.contains('gr-quest--detailed')).toBe(false);
    expect((await render({ showObjectives: true })).card.classList.contains('gr-quest--detailed')).toBe(true);
    expect((await render({ showRewards: true })).card.classList.contains('gr-quest--detailed')).toBe(true);
  });

  it('lists the objectives and the full rewards in the detailed view', async () => {
    const r = await render({ showObjectives: true, showRewards: true });
    const items = r.card.querySelectorAll('ul.gr-objs > li.gr-obj');
    expect(items.length).toBe(4);
    expect(items[3].querySelector('.gr-obj__vis')).not.toBeNull();
    expect(r.q('gr-reward-list.gr-quest__rewards')).not.toBeNull();
    expect(r.q('.gr-quest__foot gr-reward-summary')).toBeNull();
    items[2].querySelector<HTMLButtonElement>('.gr-obj__box')!.click();
    expect(r.host.toggled).toEqual([2]);
  });

  it('does not select the card when an objective is toggled', async () => {
    const r = await render({ showObjectives: true, selectable: true });
    r.card.querySelector<HTMLButtonElement>('.gr-obj__box')!.click();
    expect(r.host.activations).toBe(0);
    expect(r.host.toggled).toEqual([0]);
  });

  it('renders the same markup under the dungeon theme, ids aside', async () => {
    const inputs = { visibility: { level: 'gm' } as VisibilityValue, showObjectives: true, chip: true };
    const light = await render(inputs);
    const dark = await render({ ...inputs, theme: 'dungeon' });
    const strip = (html: string) => html.replace(/gr-obj-\w+/g, 'gr-obj-N');
    expect(strip(dark.card.outerHTML)).toBe(strip(light.card.outerHTML));
  });
});
