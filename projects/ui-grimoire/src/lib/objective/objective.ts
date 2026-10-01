import { _IdGenerator } from '@angular/cdk/a11y';
import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { flagOnChange } from '../shared/motion';
import type { VisibilityValue } from '../shared/types';
import { Visibility } from '../visibility/visibility';

/**
 * One quest objective with a diamond checkbox, on an `li` inside `ul.gr-objs`.
 * The label is a `<label>` for the box: its text names the checkbox and a click
 * anywhere on the row toggles it (44px rows on touch screens, from bundle.css).
 */
@Component({
  // On the native li element to keep its semantics; the gr prefix is still enforced by review.
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'li[grObjective]',
  imports: [Visibility],
  host: { '[class]': 'classes()' },
  // The box is named by its <label for>, which elements-content does not see.
  template: `<!-- eslint-disable-next-line @angular-eslint/template/elements-content -->
    <button
      type="button"
      class="gr-obj__box"
      role="checkbox"
      [id]="boxId"
      [attr.aria-checked]="done()"
      (click)="doneChange.emit(!done())"
      (animationend)="stamp.set(false)"
    ></button>
    <label class="gr-obj__label" [for]="boxId"
      ><span class="gr-obj__text"><ng-content /></span>
      @if (optional()) {
        <span class="gr-obj__optional">(facultatif)</span>
      }
      @if (restricted(); as vis) {
        <gr-visibility
          [level]="vis.level"
          [players]="vis.players ?? []"
          compact
          markerClass="gr-obj__vis"
        />
      }
    </label>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Objective {
  readonly done = input(false, { transform: booleanAttribute });
  readonly optional = input(false, { transform: booleanAttribute });
  readonly visibility = input<VisibilityValue>();
  /** The new state, on a click on the box or the label, or Space / Enter on the box: `[(done)]` works. */
  readonly doneChange = output<boolean>();

  protected readonly boxId = inject(_IdGenerator).getId('gr-obj-');
  protected readonly restricted = computed(() => {
    const vis = this.visibility();
    return vis && vis.level !== 'table' ? vis : null;
  });
  /** Raised when the objective gets done (not on the first render): the diamond is stamped. */
  protected readonly stamp = flagOnChange(
    () => this.done(),
    (done) => done,
  );
  protected readonly classes = computed(
    () =>
      `gr-obj${this.done() ? ' gr-obj--done' : ''}${this.restricted() ? ' gr-obj--restricted' : ''}${this.stamp() ? ' gr-obj--stamp' : ''}`,
  );
}
