import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  BADGE_TONES,
  Badge,
  Button,
  ButtonIcon,
  COLOR_TOKENS,
  ICON_NAMES,
  Icon,
  Medallion,
  REPUTATION_SCALES,
  Reputation,
  StatusFilter,
  ThemeService,
  Visibility,
  type BadgeTone,
  type PlayerRef,
  type StatusFilterItem,
} from '@scriptorium/ui-grimoire';

/** TEMPORARY — checks the theme foundations and the base components in both themes. */
@Component({
  selector: 'app-theme-test',
  imports: [Badge, Button, ButtonIcon, Icon, Medallion, Reputation, StatusFilter, Visibility],
  templateUrl: './theme-test.html',
  styleUrl: './theme-test.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeTest {
  protected readonly themeService = inject(ThemeService);
  protected readonly colors = COLOR_TOKENS;
  protected readonly tones = Object.keys(BADGE_TONES) as BadgeTone[];
  protected readonly iconNames = ICON_NAMES;
  protected readonly npcSteps = REPUTATION_SCALES.npc.map((_, i) => i);
  protected readonly statuses: StatusFilterItem[] = [
    { id: 'active', label: 'En cours', count: 3 },
    { id: 'completed', label: 'Accomplies', count: 1 },
    { id: 'failed', label: 'Échouées', count: 1 },
    { id: 'rumor', label: 'Rumeurs', count: 1 },
  ];
  protected readonly status = signal('active');
  protected readonly kyra: PlayerRef[] = [{ name: 'Kyra' }];
  protected readonly youAndKyra: PlayerRef[] = [{ name: 'Ezren', you: true }, { name: 'Kyra' }];
  protected readonly party: PlayerRef[] = [
    { name: 'Ezren' },
    { name: 'Kyra' },
    { name: 'Merisiel' },
    { name: 'Valeros' },
  ];
}
