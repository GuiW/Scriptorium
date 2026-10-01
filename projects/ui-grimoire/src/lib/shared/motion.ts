import { effect, signal, untracked, type WritableSignal } from '@angular/core';

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
