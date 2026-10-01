import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterRenderEffect,
  booleanAttribute,
  computed,
  input,
  signal,
  viewChildren,
} from '@angular/core';
import { flagOnChange } from '../shared/motion';
import type { ContactKind } from '../shared/types';

export type ReputationTrend = 'up' | 'down';
export type ReputationTone = 'hostile' | 'cold' | 'neutral' | 'warm' | 'ally';

/** Default 5-step scales (SCALES in design/grimoire/components/bundle.js). */
export const REPUTATION_SCALES: Record<ContactKind, readonly string[]> = {
  npc: ['Hostile', 'Inamical', 'Indifférent', 'Amical', 'Serviable'],
  faction: ['Haï', 'Méfiant', 'Ignoré', 'Apprécié', 'Vénéré'],
};

/** Colour steps, spread along the scale whatever its length. */
export const REPUTATION_TONES: readonly ReputationTone[] = ['hostile', 'cold', 'neutral', 'warm', 'ally'];

/** Clamps `value` to the scale; defaults to the middle step. */
export function reputationStep(length: number, value?: number | null): number {
  return Math.max(0, Math.min(length - 1, value == null ? Math.floor(length / 2) : value));
}

/** Tone of a step on a scale of `length` steps. */
export function reputationTone(length: number, step: number): ReputationTone {
  return REPUTATION_TONES[length > 1 ? Math.round((step / (length - 1)) * 4) : 2];
}

/**
 * Where an NPC or a faction stands toward the party: a position on a scale,
 * shown as a filled diamond on a track and always paired with its word.
 */
@Component({
  selector: 'gr-reputation',
  host: {
    '[class]': 'classes()',
    role: 'img',
    '[attr.aria-label]': 'ariaLabel()',
  },
  template: `<span class="gr-rep__track" aria-hidden="true" [style.--gr-rep-x]="markerX()">
      @for (label of scale(); track $index) {
        <span #stepEl class="gr-rep__step" [class.gr-rep__step--on]="$index === step()"></span>
      }
      <span class="gr-rep__marker"></span>
    </span>
    <span class="gr-rep__label" aria-hidden="true">{{ scale()[step()] }}</span>
    @if (trendGlyph(); as glyph) {
      <span
        class="gr-rep__trend"
        [class.gr-rep__trend--pulse]="pulse()"
        aria-hidden="true"
        (animationend)="pulse.set(false)"
        >{{ glyph }}</span
      >
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Reputation {
  readonly kind = input<ContactKind>('npc');
  /** 0-based index into the scale (default: the middle step). */
  readonly value = input<number>();
  /** Custom scale (e.g. a 7-step PF2e faction reputation). */
  readonly labels = input<readonly string[]>();
  /** Change since the last session. */
  readonly trend = input<ReputationTrend>();
  readonly compact = input(false, { transform: booleanAttribute });

  protected readonly scale = computed(() => this.labels() ?? REPUTATION_SCALES[this.kind()]);
  protected readonly step = computed(() => reputationStep(this.scale().length, this.value()));
  /** Centre of the current step in the track, for the gliding marker; null before measuring. */
  protected readonly markerX = signal<string | null>(null);
  /** Raised when a trend appears or changes after the first render: the arrow pulses once. */
  protected readonly pulse = flagOnChange(() => this.trend(), (trend) => trend != null);
  private readonly steps = viewChildren('stepEl', { read: ElementRef<HTMLElement> });

  protected readonly classes = computed(() => {
    const tone = reputationTone(this.scale().length, this.step());
    return `gr-rep gr-rep--${tone}${this.compact() ? ' gr-rep--compact' : ''}${this.markerX() ? ' gr-rep--slide' : ''}`;
  });

  constructor() {
    // Measure the current step after each render that can move it; the first measure adds
    // gr-rep--slide, so the marker appears in place without gliding in.
    afterRenderEffect(() => {
      const el = this.steps()[this.step()]?.nativeElement;
      this.markerX.set(el ? `${el.offsetLeft + el.offsetWidth / 2}px` : null);
    });
  }
  protected readonly trendGlyph = computed(() => {
    const trend = this.trend();
    return trend === 'up' ? '▲' : trend === 'down' ? '▼' : null;
  });
  protected readonly ariaLabel = computed(() => {
    const n = this.scale().length;
    const trend = this.trend();
    const change = trend === 'up' ? ', en hausse' : trend === 'down' ? ', en baisse' : '';
    return `Réputation : ${this.scale()[this.step()]} (${this.step() + 1} sur ${n})${change}`;
  });
}
