import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  BADGE_TONES,
  Badge,
  Button,
  ButtonIcon,
  COLOR_TOKENS,
  ContactChip,
  ICON_NAMES,
  Icon,
  Medallion,
  Objective,
  REPUTATION_SCALES,
  Reputation,
  RewardList,
  RewardSummary,
  StatusFilter,
  ThemeService,
  Visibility,
  type BadgeTone,
  type PlayerRef,
  type QuestObjective,
  type Reward,
  type StatusFilterItem,
} from '@scriptorium/ui-grimoire';
import { DEMO_QUESTS } from './demo-quests';

/** TEMPORARY — checks the theme foundations and the base components in both themes. */
@Component({
  selector: 'app-theme-test',
  imports: [Badge, Button, ButtonIcon, ContactChip, Icon, Medallion, Objective, Reputation, RewardList, RewardSummary, StatusFilter, Visibility],
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
  protected readonly objectives = signal<QuestObjective[]>([
    { label: "Interroger le forgeron d'Otari", done: true },
    { label: "Trouver l'entrée de la crypte", done: true },
    { label: 'Retrouver le médaillon de la prêtresse' },
    {
      label: 'Épargner le gardien squelette',
      optional: true,
      visibility: { level: 'players', players: [{ name: 'Kyra' }] },
    },
    { label: 'Confirmer la trahison de Corvin', visibility: { level: 'gm' } },
  ]);
  protected readonly chipClicks = signal(0);
  protected readonly quests = DEMO_QUESTS;
  protected readonly extraRewards: Reward[] = [
    { kind: 'reputation', label: 'Chevaliers de Lastwall +2' },
    { kind: 'other', label: 'Un repas chez les Emberlyn', note: 'au choix du groupe' },
    { kind: 'item', label: 'Couronne du roi noyé', rarity: 'unique', visibility: { level: 'gm' } },
    { kind: 'other', label: 'Une faveur du conseil', visibility: { level: 'players', players: [{ name: 'Kyra' }] } },
  ];
  protected readonly kyra: PlayerRef[] = [{ name: 'Kyra' }];
  protected readonly youAndKyra: PlayerRef[] = [{ name: 'Ezren', you: true }, { name: 'Kyra' }];
  protected readonly party: PlayerRef[] = [
    { name: 'Ezren' },
    { name: 'Kyra' },
    { name: 'Merisiel' },
    { name: 'Valeros' },
  ];

  protected toggleObjective(index: number): void {
    this.objectives.update((list) =>
      list.map((o, i) => (i === index ? { ...o, done: !o.done } : o)),
    );
  }
}
