import { FocusKeyManager, type FocusableOption } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  Injector,
  computed,
  effect,
  inject,
  input,
  model,
  untracked,
  viewChildren,
} from '@angular/core';

/** One option of the filter (TabItem in design/grimoire/components/index.d.ts). */
export interface StatusFilterItem {
  id: string;
  label: string;
  /** Always shown when set, including 0. */
  count?: number;
}

/** Internal (exported for the Angular compiler only): gives the key manager something focusable for each option. */
@Directive({ selector: 'button[grStatusFilterOption]' })
export class StatusFilterOption implements FocusableOption {
  private readonly element = inject<ElementRef<HTMLButtonElement>>(ElementRef);
  readonly id = input.required<string>({ alias: 'grStatusFilterOption' });

  focus(): void {
    this.element.nativeElement.focus();
  }
}

/**
 * Filters a list by status: a single choice shown as underlined tabs (`Tabs` in the canvas).
 * Semantically a radio group, since every option filters the same list: Tab enters on the
 * checked option, the arrow keys, Home and End move and select at once.
 * Not for page navigation — see BookmarkNav / BookmarkTabs.
 */
@Component({
  selector: 'gr-status-filter',
  imports: [StatusFilterOption],
  host: {
    class: 'gr-tabs',
    role: 'radiogroup',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-controls]': 'controls()',
    '(keydown)': 'onKeydown($event)',
  },
  template: `@for (item of items(); track item.id; let i = $index) {
    <button
      type="button"
      role="radio"
      class="gr-tabs__tab"
      [grStatusFilterOption]="item.id"
      [class.gr-tabs__tab--on]="item.id === value()"
      [attr.aria-checked]="item.id === value()"
      [tabIndex]="i === tabStop() ? 0 : -1"
      (click)="select(i)"
    >
      <span class="gr-tabs__label">{{ item.label }}</span>
      @if (item.count != null) {
        <span class="gr-tabs__count">{{ item.count }}</span>
      }
    </button>
  }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusFilter {
  readonly items = input.required<readonly StatusFilterItem[]>();
  /** Id of the checked option; two-way bindable, `valueChange` replaces the reference's onChange. */
  readonly value = model<string>();
  readonly ariaLabel = input<string>(undefined, { alias: 'aria-label' });
  /** Id of the list this filter filters. */
  readonly controls = input<string>();

  private readonly options = viewChildren(StatusFilterOption);
  private readonly keyManager = new FocusKeyManager(this.options, inject(Injector))
    .withHorizontalOrientation(inject(Directionality).value)
    .withHomeAndEnd()
    .withWrap();

  /** Index of the only option reachable with Tab: the checked one, else the first. */
  protected readonly tabStop = computed(() =>
    Math.max(0, this.items().findIndex((item) => item.id === this.value())),
  );

  constructor() {
    // Keep the key manager on the checked option when the value changes from outside.
    effect(() => {
      const index = this.tabStop();
      if (this.options().length) untracked(() => this.keyManager.updateActiveItem(index));
    });
  }

  protected select(index: number): void {
    this.keyManager.updateActiveItem(index);
    this.value.set(this.items()[index].id);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const before = this.keyManager.activeItemIndex;
    this.keyManager.onKeydown(event);
    const after = this.keyManager.activeItemIndex;
    if (after != null && after !== before) this.value.set(this.items()[after].id);
  }
}
