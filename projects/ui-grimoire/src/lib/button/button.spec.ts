import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Icon } from '../icon/icon';
import { Button, ButtonIcon, type ButtonSize, type ButtonVariant } from './button';

@Component({
  imports: [Button, ButtonIcon, Icon],
  template: `<div [attr.data-theme]="theme()">
    <form (submit)="$event.preventDefault()">
      @if (withIcon()) {
        <button grButton [variant]="variant()" [size]="size()" [disabled]="disabled()">
          <gr-icon grButtonIcon name="ajouter" />Ajouter un objectif
        </button>
      } @else if (submit()) {
        <button grButton type="submit">Créer</button>
      } @else {
        <button grButton [variant]="variant()" [size]="size()" [disabled]="disabled()">
          Ajouter un objectif
        </button>
      }
    </form>
  </div>`,
})
class Host {
  readonly theme = input<string>();
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly disabled = input(false);
  readonly withIcon = input(false);
  readonly submit = input(false);
}

@Component({
  imports: [Button],
  template: `<div [attr.data-theme]="theme()">
    <a grButton variant="ghost" href="/quetes">‹ Retour aux quêtes</a>
  </div>`,
})
class LinkHost {
  readonly theme = input<string>();
}

async function render(inputs: Partial<Record<keyof Host, unknown>> = {}) {
  const fixture = TestBed.createComponent(Host);
  for (const [key, value] of Object.entries(inputs)) fixture.componentRef.setInput(key, value);
  await fixture.whenStable();
  const button = (fixture.nativeElement as HTMLElement).querySelector('button');
  if (!button) throw new Error('no button rendered');
  return button;
}

describe('Button', () => {
  it('renders each variant and size with the reference classes', async () => {
    for (const variant of ['primary', 'secondary', 'ghost'] as const) {
      expect((await render({ variant })).className, variant).toBe(`gr-btn gr-btn--${variant}`);
      expect((await render({ variant, size: 'sm' })).className, `${variant} sm`).toBe(
        `gr-btn gr-btn--${variant} gr-btn--sm`,
      );
    }
  });

  it('defaults to a primary, medium, type="button" button', async () => {
    const button = await render();
    expect(button.className).toBe('gr-btn gr-btn--primary');
    expect(button.getAttribute('type')).toBe('button');
    expect(button.textContent!.trim()).toBe('Ajouter un objectif');
  });

  it('keeps an explicit type', async () => {
    expect((await render({ submit: true })).getAttribute('type')).toBe('submit');
  });

  it('wraps a projected icon in a hidden gr-btn__icon span, before the label', async () => {
    const button = await render({ withIcon: true });
    const icon = button.querySelector('.gr-btn__icon');
    expect(icon?.getAttribute('aria-hidden')).toBe('true');
    expect(icon?.querySelector('svg.gr-icon')).not.toBeNull();
    expect(button.firstElementChild).toBe(icon);
    expect(button.textContent!.trim()).toBe('Ajouter un objectif');
  });

  it('has no icon span without an icon', async () => {
    expect((await render()).querySelector('.gr-btn__icon')).toBeNull();
  });

  it('uses the native disabled state', async () => {
    expect((await render({ disabled: true })).disabled).toBe(true);
  });

  it('works on a link, without a type, in both themes', async () => {
    for (const theme of [undefined, 'dungeon']) {
      const fixture = TestBed.createComponent(LinkHost);
      fixture.componentRef.setInput('theme', theme);
      await fixture.whenStable();
      const link = (fixture.nativeElement as HTMLElement).querySelector('a')!;
      expect(link.className, theme).toBe('gr-btn gr-btn--ghost');
      expect(link.hasAttribute('type'), theme).toBe(false);
      expect(link.getAttribute('href'), theme).toBe('/quetes');
      expect(link.textContent!.trim(), theme).toBe('‹ Retour aux quêtes');
    }
  });

  it('renders the same markup under the dungeon theme', async () => {
    const light = await render({ variant: 'secondary', withIcon: true });
    const dark = await render({ variant: 'secondary', withIcon: true, theme: 'dungeon' });
    expect(dark.outerHTML).toBe(light.outerHTML);
  });
});
