import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  BADGE_TONES,
  Badge,
  Button,
  ButtonIcon,
  COLOR_TOKENS,
  ICON_NAMES,
  Icon,
  Medallion,
  ThemeService,
  type BadgeTone,
} from '@scriptorium/ui-grimoire';

/** TEMPORARY — checks the theme foundations and the base components in both themes. */
@Component({
  selector: 'app-theme-test',
  imports: [Badge, Button, ButtonIcon, Icon, Medallion],
  templateUrl: './theme-test.html',
  styleUrl: './theme-test.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeTest {
  protected readonly themeService = inject(ThemeService);
  protected readonly colors = COLOR_TOKENS;
  protected readonly tones = Object.keys(BADGE_TONES) as BadgeTone[];
  protected readonly iconNames = ICON_NAMES;
}
