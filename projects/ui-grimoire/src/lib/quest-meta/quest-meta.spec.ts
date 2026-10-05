import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ContactChip } from '../contact-chip/contact-chip';
import { QuestGiver, QuestMeta, questMetaParts } from './quest-meta';

@Component({
  imports: [ContactChip, QuestGiver, QuestMeta],
  template: `<div [attr.data-theme]="theme()">
    @if (chip()) {
      <gr-quest-meta giverSlot [location]="location()" [level]="level()">
        <gr-contact-chip grQuestGiver name="Wrin Sivinxi" [reputation]="3" />
      </gr-quest-meta>
    } @else {
      <gr-quest-meta [giver]="giver()" [location]="location()" [level]="level()" />
    }
  </div>`,
})
class Host {
  readonly theme = input<string>();
  readonly chip = input(false);
  readonly giver = input<string>();
  readonly location = input<string>('Otari');
  readonly level = input<number | undefined>(2);
}

async function render(inputs: Partial<Record<keyof Host, unknown>> = {}) {
  const fixture = TestBed.createComponent(Host);
  for (const [key, value] of Object.entries(inputs)) fixture.componentRef.setInput(key, value);
  await fixture.whenStable();
  const host = fixture.nativeElement as HTMLElement;
  const line = host.querySelector('.gr-quest__meta');
  return { host, line, text: line?.textContent?.replace(/\s+/g, ' ').trim() };
}

describe('QuestMeta', () => {
  it('formats the place and the level', () => {
    expect(questMetaParts('Otari', 2)).toEqual(['Otari', 'Niv. 2']);
    expect(questMetaParts('Otari')).toEqual(['Otari']);
    expect(questMetaParts(undefined, 0)).toEqual(['Niv. 0']);
    expect(questMetaParts()).toEqual([]);
  });

  it('puts a plain giver first, then the place and the level, each unbroken', async () => {
    const r = await render({ giver: 'Wrin Sivinxi' });
    expect(r.text).toBe('Donnée par Wrin Sivinxi · Otari · Niv. 2');
    expect(r.line!.querySelectorAll('.gr-nowrap')).toHaveLength(3);
  });

  it('shows a projected ContactChip as the giver', async () => {
    const r = await render({ chip: true });
    expect(r.line!.querySelector('.gr-nowrap .gr-chip__name')?.textContent).toBe('Wrin Sivinxi');
    expect(r.text).toBe('Donnée par W Wrin Sivinxi, Amical · Otari · Niv. 2');
  });

  it('starts with the place when there is no giver', async () => {
    expect((await render()).text).toBe('Otari · Niv. 2');
    expect((await render({ level: undefined })).text).toBe('Otari');
  });

  it('renders nothing when there is nothing to say', async () => {
    const r = await render({ location: undefined, level: undefined });
    expect(r.line).toBeNull();
  });

  it('renders the same markup under the dungeon theme', async () => {
    for (const inputs of [{ giver: 'Wrin Sivinxi' }, { chip: true }]) {
      const light = (await render(inputs)).line!.outerHTML;
      const dark = (await render({ ...inputs, theme: 'dungeon' })).line!.outerHTML;
      expect(dark).toBe(light);
    }
  });
});
