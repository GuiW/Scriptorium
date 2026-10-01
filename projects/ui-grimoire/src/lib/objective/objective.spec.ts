import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { VisibilityValue } from '../shared/types';
import { Objective } from './objective';

@Component({
  imports: [Objective],
  template: `<div [attr.data-theme]="theme()">
    <ul class="gr-objs">
      <li
        grObjective
        [done]="done()"
        [optional]="optional()"
        [visibility]="visibility()"
        (doneChange)="changes.push($event)"
      >
        Retrouver le médaillon de la prêtresse
      </li>
    </ul>
  </div>`,
})
class Host {
  readonly theme = input<string>();
  readonly done = input(false);
  readonly optional = input(false);
  readonly visibility = input<VisibilityValue>();
  changes: boolean[] = [];
}

async function render(inputs: Partial<Record<keyof Host, unknown>> = {}) {
  const fixture = TestBed.createComponent(Host);
  for (const [key, value] of Object.entries(inputs)) fixture.componentRef.setInput(key, value);
  await fixture.whenStable();
  const li = (fixture.nativeElement as HTMLElement).querySelector('li');
  if (!li) throw new Error('no objective rendered');
  return {
    fixture,
    li,
    box: li.querySelector<HTMLButtonElement>('button.gr-obj__box')!,
    label: li.querySelector<HTMLLabelElement>('label.gr-obj__label')!,
    vis: li.querySelector('.gr-vis'),
  };
}

/** Class order is not meaningful: Angular's [class] binding may reorder it. */
const classes = (el: Element) => [...el.classList].sort();

describe('Objective', () => {
  it('renders an unchecked objective whose label names the checkbox', async () => {
    const r = await render();
    expect(classes(r.li)).toEqual(['gr-obj']);
    expect(r.box.getAttribute('type')).toBe('button');
    expect(r.box.getAttribute('role')).toBe('checkbox');
    expect(r.box.getAttribute('aria-checked')).toBe('false');
    expect(r.box.hasAttribute('aria-label')).toBe(false);
    expect(r.label.htmlFor).toBe(r.box.id);
    expect(r.box.id).toMatch(/^gr-obj-/);
    expect(r.label.textContent?.trim()).toBe('Retrouver le médaillon de la prêtresse');
  });

  it('gives every objective its own box id', async () => {
    const a = await render();
    const b = await render();
    expect(a.box.id).not.toBe(b.box.id);
  });

  it('checks a done objective', async () => {
    const r = await render({ done: true });
    expect(classes(r.li)).toEqual(['gr-obj', 'gr-obj--done']);
    expect(r.box.getAttribute('aria-checked')).toBe('true');
  });

  it('marks an optional objective', async () => {
    const r = await render({ optional: true });
    expect(r.label.querySelector('.gr-obj__optional')?.textContent).toBe('(facultatif)');
  });

  it('toggles from the box and from anywhere on the label', async () => {
    const r = await render();
    r.box.click();
    r.label.click();
    // Not bound back to done here, so both clicks ask for the same new state.
    expect(r.fixture.componentInstance.changes).toEqual([true, true]);
  });

  it('shows a compact marker for an objective shared with some players', async () => {
    const r = await render({ visibility: { level: 'players', players: [{ name: 'Kyra' }] } });
    expect(classes(r.li)).toEqual(['gr-obj', 'gr-obj--restricted']);
    expect(classes(r.vis!)).toEqual(['gr-obj__vis', 'gr-vis', 'gr-vis--players']);
    expect(r.vis?.lastElementChild?.textContent).toBe('Kyra');
    expect(r.vis?.closest('label')).toBe(r.label);
  });

  it('shows « Secret MJ » for a GM-only objective, nothing for the whole table', async () => {
    const gm = await render({ visibility: { level: 'gm' } });
    expect(gm.vis?.textContent?.trim()).toBe('Secret MJ');
    const table = await render({ visibility: { level: 'table' } });
    expect(table.vis).toBeNull();
    expect(classes(table.li)).toEqual(['gr-obj']);
  });

  it('wraps the projected text in the span that carries the strike-through', async () => {
    const r = await render({ done: true });
    expect(r.label.firstElementChild?.className).toBe('gr-obj__text');
    expect(r.label.firstElementChild?.textContent?.trim()).toBe(
      'Retrouver le médaillon de la prêtresse',
    );
  });

  it('stamps the diamond when the objective gets done, never on the first render', async () => {
    const done = await render({ done: true });
    expect(done.li.classList.contains('gr-obj--stamp')).toBe(false);

    const r = await render();
    r.fixture.componentRef.setInput('done', true);
    await r.fixture.whenStable();
    expect(r.li.classList.contains('gr-obj--stamp')).toBe(true);
    r.box.dispatchEvent(new Event('animationend'));
    await r.fixture.whenStable();
    expect(r.li.classList.contains('gr-obj--stamp')).toBe(false);

    r.fixture.componentRef.setInput('done', false);
    await r.fixture.whenStable();
    expect(r.li.classList.contains('gr-obj--stamp')).toBe(false);
  });

  it('renders the same markup under the dungeon theme, ids aside', async () => {
    const inputs = { done: true, visibility: { level: 'gm' } as VisibilityValue };
    const light = await render(inputs);
    const dark = await render({ ...inputs, theme: 'dungeon' });
    const strip = (html: string) => html.replace(/gr-obj-\w+/g, 'gr-obj-N');
    expect(strip(dark.li.outerHTML)).toBe(strip(light.li.outerHTML));
  });
});
