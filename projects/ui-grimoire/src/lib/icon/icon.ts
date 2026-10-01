import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {
  LucideBookOpen,
  LucideCalendarDays,
  LucideCoins,
  LucideDynamicIcon,
  LucideEar,
  LucideEllipsis,
  LucideEyeOff,
  LucideFlame,
  LucideFunnel,
  LucideGem,
  LucideKey,
  LucideMap,
  LucideMapPin,
  LucidePlus,
  LucideScrollText,
  LucideSearch,
  LucideSettings,
  LucideShield,
  LucideSkull,
  LucideSparkles,
  LucideUserRound,
  LucideUsers,
  LucideVenetianMask,
  type LucideIcon,
} from '@lucide/angular';

/** Grimoire business icons, keyed by their French business name (design/grimoire/assets/Icons/README.md). */
export const ICONS = {
  quete: LucideScrollText,
  journal: LucideBookOpen,
  session: LucideCalendarDays,
  pnj: LucideUserRound,
  faction: LucideShield,
  joueurs: LucideUsers,
  mj: LucideVenetianMask,
  lieu: LucideMapPin,
  carte: LucideMap,
  butin: LucideGem,
  pieces: LucideCoins,
  xp: LucideSparkles,
  rumeur: LucideEar,
  indice: LucideKey,
  secret: LucideEyeOff,
  urgent: LucideFlame,
  danger: LucideSkull,
  reglages: LucideSettings,
  ajouter: LucidePlus,
  rechercher: LucideSearch,
  filtrer: LucideFunnel,
  plus: LucideEllipsis,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

export const ICON_NAMES = Object.keys(ICONS) as IconName[];

/**
 * Grimoire business icon (Lucide, ISC licence), 1.5px stroke, `currentColor`.
 * Decorative unless `label` is set; a lone icon that carries meaning needs a `label`.
 */
@Component({
  selector: 'gr-icon',
  imports: [LucideDynamicIcon],
  // The host box is not rendered: the <svg> behaves exactly like the reference's bare svg.gr-icon.
  host: { style: 'display: contents' },
  template: `<svg
    [lucideIcon]="icon()"
    [class]="'gr-icon'"
    [size]="size()"
    [strokeWidth]="strokeWidth()"
    [title]="label()"
    [attr.role]="label() ? 'img' : null"
    [attr.aria-label]="label() || null"
    [attr.data-icon]="name()"
    focusable="false"
  ></svg>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Icon {
  readonly name = input.required<IconName>();
  /** Size in px: 16 in a line of text, 20 in buttons and lists (default), 24 in navigation. */
  readonly size = input(20);
  readonly strokeWidth = input(1.5);
  /** Accessible name; without it the icon is hidden from screen readers. */
  readonly label = input<string>();

  protected readonly icon = computed(() => ICONS[this.name()]);
}
