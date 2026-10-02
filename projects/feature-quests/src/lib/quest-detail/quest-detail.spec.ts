import { Component, input, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import type { QuestStatus } from '@scriptorium/ui-grimoire';
import type { Quest } from '../data/quest';
import { QUESTS_MOCK } from '../data/quests.mock';
import { QuestDetail, QuestDetailAction } from './quest-detail';

@Component({
  imports: [QuestDetail, QuestDetailAction],
  template: `<div [attr.data-theme]="theme()">
    <quests-quest-detail [quest]="quest()" [mode]="mode()" (objectiveToggle)="toggled.set($event)">
      <button questsDetailAction type="button">Fermer</button>
    </quests-quest-detail>
  </div>`,
})
class Host {
  readonly theme = input<string>();
  readonly quest = input.required<Quest>();
  readonly mode = input<'panel' | 'page'>('panel');
  readonly toggled = signal<number | null>(null);
}

const byId = (id: string) => QUESTS_MOCK.find((q) => q.id === id)!;

async function render(inputs: { quest: Quest; mode?: 'panel' | 'page'; theme?: string }) {
  const fixture = TestBed.createComponent(Host);
  for (const [key, value] of Object.entries(inputs)) fixture.componentRef.setInput(key, value);
  await fixture.whenStable();
  const el = (fixture.nativeElement as HTMLElement).querySelector('quests-quest-detail')!;
  return {
    fixture,
    el,
    text: (selector: string) => el.querySelector(selector)?.textContent?.trim(),
  };
}

describe('QuestDetail', () => {
  it('shows the title, status, giver, place, level and summary of a quest', async () => {
    const { el, text } = await render({ quest: byId('q1') });
    expect(text('h2.detail__title')).toBe('La crypte sous Otari');
    expect(text('gr-badge')).toContain('En cours');
    expect(text('.gr-chip__name')).toBe('Wrin Sivinxi');
    expect(el.querySelector('.gr-quest__meta')!.textContent!.replace(/\s+/g, ' ').trim()).toBe(
      'Donnée par W Wrin Sivinxi, Amical · Otari · Niv. 2',
    );
    expect(text('.detail__summary')).toMatch(/^Des lueurs/);
    expect(text('[questsDetailAction]')).toBe('Fermer');
  });

  it('lists the objectives under a heading, the rewards and the GM note', async () => {
    const { el, text } = await render({ quest: byId('q1') });
    const label = el.querySelector('.detail__label')!;
    expect(label.getAttribute('role')).toBe('heading');
    expect(label.getAttribute('aria-level')).toBe('3');
    expect(el.querySelector('section')!.getAttribute('aria-labelledby')).toBe(label.id);
    expect(el.querySelectorAll('li.gr-obj')).toHaveLength(4);
    expect(el.querySelectorAll('li.gr-obj--done')).toHaveLength(2);
    expect(el.querySelectorAll('.gr-reward')).toHaveLength(4);
    expect(el.querySelector('gr-secret-block')?.getAttribute('aria-label')).toBe('Secret MJ');
    expect(text('.detail__note')).toMatch(/^Le médaillon est un faux/);
    // The GM note follows the summary, before the objectives and apart from the rewards.
    const blocks = [...el.children].map(
      (child) => child.tagName.toLowerCase() + '.' + child.classList[0],
    );
    expect(blocks).toEqual([
      'header.detail__head',
      'p.detail__summary',
      'gr-secret-block.detail__secret',
      'section.detail__section',
      'gr-reward-list.gr-rewards',
    ]);
  });

  it('renders each status with its badge', async () => {
    const words: Record<QuestStatus, string> = {
      active: 'En cours',
      completed: 'Accomplie',
      failed: 'Échouée',
      rumor: 'Rumeur',
    };
    for (const [status, word] of Object.entries(words)) {
      const { el } = await render({ quest: { ...byId('q1'), status: status as QuestStatus } });
      expect(el.querySelector('gr-badge')!.className, status).toContain(`gr-badge--${status}`);
      expect(el.querySelector('gr-badge')!.textContent, status).toContain(word);
    }
  });

  it('marks a restricted quest with its visibility, glyph and word', async () => {
    const gm = await render({ quest: byId('q2') });
    expect(gm.el.querySelector('.detail__head gr-visibility')?.textContent).toContain('Secret MJ');
    const kyra = await render({ quest: byId('q6') });
    expect(kyra.el.querySelector('.detail__head gr-visibility')?.textContent).toContain('Kyra');
    const open = await render({ quest: byId('q1') });
    expect(open.el.querySelector('.detail__head gr-visibility')).toBeNull();
  });

  it('puts the visibility and the action above the title, the status beside it', async () => {
    for (const id of ['q1', 'q6']) {
      const { el } = await render({ quest: byId(id) });
      const top = el.querySelector('.detail__top')!;
      expect(top.querySelector('.detail__action [questsDetailAction]')?.textContent, id).toBe(
        'Fermer',
      );
      expect(!!top.querySelector('gr-visibility'), id).toBe(id === 'q6');
      // The title row only holds the title and the status, centred on its first line.
      const row = el.querySelector('.detail__title-row')!;
      expect(
        [...row.children].map((c) => c.className),
        id,
      ).toEqual(['detail__title', 'detail__status']);
      expect(row.querySelector('.detail__status gr-badge'), id).not.toBeNull();
    }
  });

  it('leaves out what a quest does not have', async () => {
    const { el } = await render({ quest: byId('q5') });
    expect(el.querySelector('.gr-chip')).toBeNull();
    expect(el.querySelector('.gr-quest__meta')!.textContent!.trim()).toBe('Côte des Brumes');
    expect(el.querySelector('section')).toBeNull();
    expect(el.querySelector('gr-reward-list')).toBeNull();
    expect(el.querySelector('gr-secret-block')).toBeNull();
  });

  it('is the page heading in page mode, with the larger summary', async () => {
    const { el } = await render({ quest: byId('q1'), mode: 'page' });
    expect(el.classList.contains('detail--page')).toBe(true);
    expect(el.querySelector('h1.detail__title')?.textContent).toBe('La crypte sous Otari');
    expect(el.querySelector('h2')).toBeNull();
    expect(el.querySelector('.detail__label')!.getAttribute('aria-level')).toBe('2');
  });

  it('emits the index of a toggled objective', async () => {
    const { fixture, el } = await render({ quest: byId('q1') });
    el.querySelectorAll<HTMLButtonElement>('.gr-obj__box')[2].click();
    expect(fixture.componentInstance.toggled()).toBe(2);
  });

  it('moves the focus to its title', async () => {
    const { fixture, el } = await render({ quest: byId('q1') });
    fixture.debugElement.query(By.directive(QuestDetail)).componentInstance.focus();
    expect(document.activeElement).toBe(el.querySelector('h2'));
  });

  it('renders the same markup under the dungeon theme', async () => {
    for (const id of ['q1', 'q2', 'q5', 'q6']) {
      // Each instance numbers its objectives heading and boxes.
      const html = (el: Element) =>
        el.outerHTML.replace(/(quest-objectives|gr-obj)-[a-z]*\d+/g, 'id');
      const light = html((await render({ quest: byId(id) })).el);
      const dark = html((await render({ quest: byId(id), theme: 'dungeon' })).el);
      expect(dark, id).toBe(light);
    }
  });
});
