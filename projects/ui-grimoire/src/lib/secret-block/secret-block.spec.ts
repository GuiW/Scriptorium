import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { PlayerRef } from '../shared/types';
import { SecretBlock } from './secret-block';

@Component({
  imports: [SecretBlock],
  template: `<div [attr.data-theme]="theme()">
    <gr-secret-block [level]="level()" [players]="players()">
      <p>Le médaillon est un faux : le vrai est resté dans le coffre de la prêtresse.</p>
      <p>Wrin le sait et se tait.</p>
    </gr-secret-block>
  </div>`,
})
class Host {
  readonly theme = input<string>();
  readonly level = input<'gm' | 'players'>('gm');
  readonly players = input<PlayerRef[]>([]);
}

async function render(inputs: Partial<Record<keyof Host, unknown>> = {}) {
  const fixture = TestBed.createComponent(Host);
  for (const [key, value] of Object.entries(inputs)) fixture.componentRef.setInput(key, value);
  await fixture.whenStable();
  const block = (fixture.nativeElement as HTMLElement).querySelector('gr-secret-block');
  if (!block) throw new Error('no secret block rendered');
  return {
    block,
    tab: block.querySelector('.gr-secret__tab'),
    body: block.querySelector('.gr-secret__body'),
  };
}

/** Class order is not meaningful: Angular's [class] binding may reorder it. */
const classes = (el: Element) => [...el.classList].sort();

describe('SecretBlock', () => {
  it('frames GM-only content as a labelled group with a « Secret MJ » tab', async () => {
    const r = await render();
    expect(classes(r.block)).toEqual(['gr-secret', 'gr-secret--gm']);
    expect(r.block.getAttribute('role')).toBe('group');
    expect(r.block.getAttribute('aria-label')).toBe('Secret MJ');
    expect(r.tab?.querySelector('.gr-vis')?.className).toBe('gr-vis gr-vis--gm');
    expect(r.tab?.textContent?.trim()).toBe('Secret MJ');
  });

  it('frames content shared with some players', async () => {
    const r = await render({
      level: 'players',
      players: [{ name: 'Ezren', you: true }, { name: 'Kyra' }],
    });
    expect(classes(r.block)).toEqual(['gr-secret', 'gr-secret--players']);
    expect(r.block.getAttribute('aria-label')).toBe('Partagé avec toi et Kyra');
    expect(r.tab?.querySelector('.gr-vis--players')?.lastElementChild?.textContent).toBe(
      'Pour toi et Kyra',
    );
  });

  it('projects the content into the body', async () => {
    const r = await render();
    const paragraphs = r.body?.querySelectorAll('p');
    expect(paragraphs?.length).toBe(2);
    expect(paragraphs?.[1].textContent).toBe('Wrin le sait et se tait.');
    expect(r.tab?.nextElementSibling).toBe(r.body);
  });

  it('renders the same markup under the dungeon theme', async () => {
    for (const level of ['gm', 'players'] as const) {
      const inputs = { level, players: [{ name: 'Kyra' }] };
      const light = await render(inputs);
      const dark = await render({ ...inputs, theme: 'dungeon' });
      expect(dark.block.outerHTML, level).toBe(light.block.outerHTML);
    }
  });
});
