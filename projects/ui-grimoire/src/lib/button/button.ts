import { ChangeDetectionStrategy, Component, Directive, computed, contentChild, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'md' | 'sm';

/** Marks the leading glyph or icon of a `grButton`: `<gr-icon grButtonIcon name="ajouter" />`. */
@Directive({ selector: '[grButtonIcon]' })
export class ButtonIcon {}

/**
 * Action button on the native `<button>`, which keeps disabled, click, form submission and aria-label.
 * One `primary` per screen; the label is a verb in the infinitive (« Ajouter un objectif »).
 */
@Component({
  selector: 'button[grButton]',
  host: { '[class]': 'classes()', '[attr.type]': 'type()' },
  template: `@if (icon()) {
      <span class="gr-btn__icon" aria-hidden="true"><ng-content select="[grButtonIcon]" /></span>
    }<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  readonly variant = input<ButtonVariant>('primary');
  /** `sm` is for desktop toolbars only: never on tablet or mobile, where targets must stay ≥ 44px. */
  readonly size = input<ButtonSize>('md');
  /** Defaults to `button` so a Grimoire button never submits a form by accident. */
  readonly type = input<'button' | 'submit' | 'reset'>('button');

  protected readonly icon = contentChild(ButtonIcon);
  protected readonly classes = computed(
    () => `gr-btn gr-btn--${this.variant()}${this.size() === 'sm' ? ' gr-btn--sm' : ''}`,
  );
}
