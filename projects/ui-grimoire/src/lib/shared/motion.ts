import { Directive, effect, input, signal, untracked, type WritableSignal } from '@angular/core';

/**
 * A flag raised when `source` changes after the first render (never on it), and only when
 * `when` accepts the new value. Drives one-shot animation classes (`gr-obj--stamp`,
 * `gr-badge--stamp`); the component lowers it again on `animationend`.
 * Call it in an injection context (a field initializer).
 */
export function flagOnChange<T>(
  source: () => T,
  when: (value: T) => boolean = () => true,
): WritableSignal<boolean> {
  const flag = signal(false);
  let first = true;
  effect(() => {
    const value = source();
    if (first) {
      first = false;
      return;
    }
    if (when(value)) untracked(() => flag.set(true));
  });
  return flag;
}

/**
 * Makes its element jump once (`gr-bump`) when the bound value changes after the first
 * render: a count that goes up or down, for example.
 */
@Directive({
  selector: '[grBump]',
  host: { '[class.gr-bump]': 'bump()', '(animationend)': 'bump.set(false)' },
})
export class Bump {
  readonly grBump = input<unknown>();
  protected readonly bump = flagOnChange(() => this.grBump());
}
