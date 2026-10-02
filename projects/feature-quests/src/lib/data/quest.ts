import type {
  ContactKind,
  QuestObjective,
  QuestStatus,
  Reward,
  VisibilityValue,
} from '@scriptorium/ui-grimoire';

/** The NPC or faction who gave a quest, with the table's reputation step with them (0 to 4). */
export interface QuestGiverRef {
  name: string;
  kind: ContactKind;
  reputation: number;
}

/** A quest as the GM sees it. */
export interface Quest {
  id: string;
  title: string;
  status: QuestStatus;
  giver?: QuestGiverRef;
  location?: string;
  level?: number;
  summary?: string;
  /** Restricted quest; no value means the whole table sees it. */
  visibility?: VisibilityValue;
  objectives: readonly QuestObjective[];
  rewards: readonly Reward[];
  /** What only the GM knows, shown in a Secret MJ block in the detail. */
  secretNote?: string;
}
