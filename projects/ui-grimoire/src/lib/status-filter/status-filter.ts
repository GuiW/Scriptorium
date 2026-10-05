import { FocusKeyManager, type FocusableOption } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import {
  ChangeDetectionStrategy,
  DestroyRef,
  Component,
  booleanAttribute,
  Directive,
  ElementRef,
  Injector,
  afterNextRender,
  afterRenderEffect,
  computed,
  effect,
  inject,
  input,
  model,
  signal,
  untracked,
  viewChildren,
} from '@angular/core';
import { Bump } from '../shared/motion';

/** Scrolls the row sideways, and only sideways, so that the whole option is visible. */
function revealInRow(row: HTMLElement, option: HTMLElement): void {
  const start = option.offsetLeft;
  const end = start + option.offsetWidth;
  const padding = parseFloat(getComputedStyle(row).paddingInlineStart) || 0;
  if (start - padding < row.scrollLeft) row.scrollLeft = start - padding;
  else if (end + padding > row.scrollLeft + row.clientWidth)
    row.scrollLeft = end + padding - row.clientWidth;
}

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
  readonly element = inject<ElementRef<HTMLButtonElement>>(ElementRef).nativeElement;
  readonly id = input.required<string>({ alias: 'grStatusFilterOption' });

  focus(): void {
    this.element.focus();
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
  imports: [Bump, StatusFilterOption],
  host: {
    class: 'gr-tabs',
    role: 'radiogroup',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-controls]': 'controls()',
    '(keydown)': 'onKeydown($event)',
    '[class.gr-tabs--compact]': 'compact()',
    // Sliding underline (bundle.css): position and width of the checked option.
    '[class.gr-tabs--slide]': 'indicator() !== null',
    '[style.--gr-tabs-x]': 'indicator()?.x',
    '[style.--gr-tabs-w]': 'indicator()?.w',
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
      @if (item.count !== undefined) {
        <span class="gr-tabs__count" [grBump]="item.count">{{ item.count }}</span>
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
  /**
   * Narrow screens: tighter options, and a row that scrolls sideways if they still do not fit,
   * the checked option kept in view.
   */
  readonly compact = input(false, { transform: booleanAttribute });

  private readonly options = viewChildren(StatusFilterOption);
  private readonly keyManager = new FocusKeyManager(this.options, inject(Injector))
    .withHorizontalOrientation(inject(Directionality).value)
    .withHomeAndEnd()
    .withWrap();

  /** Index of the only option reachable with Tab: the checked one, else the first. */
  protected readonly tabStop = computed(() =>
    Math.max(
      0,
      this.items().findIndex((item) => item.id === this.value()),
    ),
  );

  /** Position and width of the checked option, for the sliding underline; null before measuring. */
  protected readonly indicator = signal<{ x: string; w: string } | null>(null);
  /** Bumped when the group is resized, so the underline is measured again. */
  private readonly resized = signal(0);

  constructor() {
    // Keep the key manager on the checked option when the value changes from outside.
    effect(() => {
      const index = this.tabStop();
      if (this.options().length) untracked(() => this.keyManager.updateActiveItem(index));
    });

    // Measure the checked option after each render that can move it; the first measure
    // adds gr-tabs--slide, so the underline appears in place without gliding in.
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    afterRenderEffect(() => {
      this.resized();
      const id = this.value();
      const option = this.options().find((o) => o.id() === id);
      this.indicator.set(
        option
          ? { x: `${option.element.offsetLeft}px`, w: `${option.element.offsetWidth}px` }
          : null,
      );
      // A compact row may scroll: keep the checked option in view (keyboard focus already does).
      if (option && this.compact()) revealInRow(host, option.element);
    });

    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver(() => this.resized.update((n) => n + 1));
      observer.observe(host);
      destroyRef.onDestroy(() => observer.disconnect());
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
