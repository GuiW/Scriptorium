import type { ReactNode, MouseEventHandler, ChangeEventHandler } from 'react';

export type QuestStatus = 'active' | 'completed' | 'failed' | 'rumor';

/** Action button. One `primary` per screen. */
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'md' | 'sm';
  /** Leading glyph or icon element. */
  icon?: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  'aria-label'?: string;
  className?: string;
  children?: ReactNode;
}
export declare function Button(props: ButtonProps): JSX.Element;

/** Status or reward tag: always a glyph plus a word. */
export interface BadgeProps {
  tone?: QuestStatus | 'urgent' | 'reward';
  /** Override the default glyph; `false` hides it (only when the word alone is unambiguous). */
  glyph?: string | false;
  /** Defaults to the tone's French label (En cours, Accomplie…). */
  children?: ReactNode;
  className?: string;
}
export declare function Badge(props: BadgeProps): JSX.Element;

/** Labelled text input or textarea. */
export interface TextFieldProps {
  label: string;
  id?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  hint?: string;
  /** Error message; replaces the hint and marks the field invalid. */
  error?: string;
  multiline?: boolean;
  rows?: number;
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  className?: string;
}
export declare function TextField(props: TextFieldProps): JSX.Element;

/** One quest objective with a diamond checkbox. Render inside `<ul className="gr-objs">`. */
export interface ObjectiveProps {
  done?: boolean;
  visibility?: VisibilityValue;
  optional?: boolean;
  onToggle?: () => void;
  className?: string;
  children: ReactNode;
}
export declare function Objective(props: ObjectiveProps): JSX.Element;

export type VisibilityLevel = 'table' | 'players' | 'gm';
export interface PlayerRef { id?: string; name: string; /** The current viewer: label reads "Pour toi…". */ you?: boolean; character?: string; }
export interface VisibilityValue { level: VisibilityLevel; players?: PlayerRef[]; }

export interface QuestObjective { label: string; done?: boolean; optional?: boolean; visibility?: VisibilityValue; }

/** Summary card for one quest in the log. */
export interface QuestCardProps {
  title: string;
  status?: QuestStatus;
  /** A name, or a `<ContactChip>` to link the NPC / faction. */
  giver?: ReactNode;
  location?: string;
  level?: number;
  summary?: string;
  objectives?: QuestObjective[];
  /** Also list the objectives inside the card. */
  showObjectives?: boolean;
  /** Rewards; the card foot shows a summary, `showRewards` the full list. */
  rewards?: Reward[];
  showRewards?: boolean;
  /** @deprecated single coin reward, e.g. "250 po" — use `rewards`. */
  reward?: string;
  /** Restricted quest: dashed secret frame + Visibility tab. */
  visibility?: VisibilityValue;
  selected?: boolean;
  /** Makes the card a toggle button. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}
export declare function QuestCard(props: QuestCardProps): JSX.Element;

/** A session's journal entry, with drop cap and ornament. */
export interface JournalEntryProps {
  /** Roman numeral recommended: "XIV". */
  session?: string;
  date?: string;
  title: string;
  author?: string;
  /** Paragraphs (`<p>`) and `<blockquote>` for NPC speech. */
  children: ReactNode;
  className?: string;
}
export declare function JournalEntry(props: JournalEntryProps): JSX.Element;

/** Hairline divider broken by a gold diamond. */
export declare function Ornament(): JSX.Element;

export type ContactKind = 'npc' | 'faction';

/**
 * Where an NPC or faction stands toward the party: a position on a 5-step scale.
 * Default labels — npc: Hostile, Inamical, Indifférent, Amical, Serviable (PF2e attitudes);
 * faction: Haï, Méfiant, Ignoré, Apprécié, Vénéré.
 */
export interface ReputationProps {
  kind?: ContactKind;
  /** 0-based index into the scale (default: the middle step). */
  value?: number;
  /** Custom scale (e.g. a 7-step PF2e faction reputation). */
  labels?: string[];
  /** Change since last session. */
  trend?: 'up' | 'down';
  compact?: boolean;
  className?: string;
}
export declare function Reputation(props: ReputationProps): JSX.Element;

/** Round seal (NPC) or shield (faction) with an initial or a small portrait. */
export interface MedallionProps { name: string; kind?: ContactKind; image?: string; size?: 'md' | 'xs'; }
export declare function Medallion(props: MedallionProps): JSX.Element;

/** Inline reference to an NPC or faction — e.g. as QuestCard `giver`. */
export interface ContactChipProps {
  name: string;
  kind?: ContactKind;
  image?: string;
  /** Shows a small diamond in the attitude colour (label read out to screen readers). */
  reputation?: number;
  labels?: string[];
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}
export declare function ContactChip(props: ContactChipProps): JSX.Element;

/** Short contact card: identity, stance, linked quests. Not a character sheet. */
export interface ContactCardProps {
  name: string;
  kind?: ContactKind;
  /** One line: "Astrologue, Otari". */
  role?: string;
  image?: string;
  reputation?: number;
  labels?: string[];
  trend?: 'up' | 'down';
  /** One or two sentences max; clamped to 2 lines. */
  note?: string;
  quests?: { active?: number; completed?: number; failed?: number };
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}
export declare function ContactCard(props: ContactCardProps): JSX.Element;

/** A bookmark leads to a page: it is a link to `link`, with `aria-current="page"` when active. */
export interface BookmarkNavItem { id: string; label?: string; icon?: ReactNode; count?: number; divider?: boolean; link?: string; }

/** Desktop vertical navigation: each entry a ribbon bookmark; the active one in crimson reaches furthest. */
export interface BookmarkNavProps {
  items: BookmarkNavItem[];
  /** `full` (desktop ≥1200px, default) or `rail` (tablet 768–1199px: 88px, icon + short label). */
  variant?: 'full' | 'rail';
  /** Active item id. */
  value?: string;
  onChange?: (id: string) => void;
  /** Campaign name shown at the top. */
  title?: ReactNode;
  kicker?: ReactNode;
  footer?: ReactNode;
  'aria-label'?: string;
  className?: string;
}
export declare function BookmarkNav(props: BookmarkNavProps): JSX.Element;

/** Mobile (<768px) bottom tab bar; the active tab's ribbon hangs from the top edge. Same items as BookmarkNav; first 5 non-divider items shown. */
export interface BookmarkTabsProps {
  items: BookmarkNavItem[];
  value?: string;
  onChange?: (id: string) => void;
  'aria-label'?: string;
  className?: string;
}
export declare function BookmarkTabs(props: BookmarkTabsProps): JSX.Element;

export interface TabItem { id: string; label: string; count?: number; }

/**
 * Filter a list by status (2–5 options), shown as underlined tabs — distinct from BookmarkNav/BookmarkTabs,
 * which are for page navigation. A single-choice radio group (`role="radiogroup"` / `"radio"`), not a tablist:
 * every option filters the same list. `StatusFilter` in Angular; `Tabs` is kept as the canvas name.
 */
export interface TabsProps {
  items: TabItem[];
  value?: string;
  onChange?: (id: string) => void;
  'aria-label'?: string;
  className?: string;
}
export declare function Tabs(props: TabsProps): JSX.Element;
export type StatusFilterProps = TabsProps;
export declare const StatusFilter: typeof Tabs;

/** Restricted-visibility marker: "Secret MJ" (broken seal) or "Pour toi et Kyra" (player faces), same frame. Renders nothing for `table` unless `showPublic`. */
export interface VisibilityProps { level?: VisibilityLevel; players?: PlayerRef[]; compact?: boolean; showPublic?: boolean; className?: string; }
export declare function Visibility(props: VisibilityProps): JSX.Element | null;

/** Frame for any restricted content block, with a Visibility tab on its top edge. */
export interface SecretBlockProps { level?: 'gm' | 'players'; players?: PlayerRef[]; children: ReactNode; className?: string; }
export declare function SecretBlock(props: SecretBlockProps): JSX.Element;

/** GM-side control: whole table / some players (multi-select from roster) / GM only. */
export interface VisibilityPickerProps {
  level?: VisibilityLevel;
  players?: PlayerRef[];
  roster: PlayerRef[];
  onChange?: (value: { level: VisibilityLevel; players: PlayerRef[] }) => void;
  label?: string;
  className?: string;
}
export declare function VisibilityPicker(props: VisibilityPickerProps): JSX.Element;

export type RewardKind = 'coin' | 'xp' | 'item' | 'reputation' | 'other';
export type Rarity = 'common' | 'uncommon' | 'rare' | 'unique';
export interface Reward {
  kind: RewardKind;
  /** "250 po", "80 XP", "Lame de lune", "Chevaliers de Lastwall +1". */
  label: string;
  /** Items only (PF2e rarity). */
  rarity?: Rarity;
  note?: string;
  visibility?: VisibilityValue;
}

/** Full list of a quest's rewards, one glyph per kind, rarity word on items. */
export interface RewardListProps { rewards: Reward[]; title?: string | false; className?: string; }
export declare function RewardList(props: RewardListProps): JSX.Element;

/** Compact summary for a card foot: coin + XP values, items counted in the rarest item's colour. */
export interface RewardSummaryProps { rewards: Reward[]; }
export declare function RewardSummary(props: RewardSummaryProps): JSX.Element;

export type IconName = 'quete' | 'journal' | 'session' | 'pnj' | 'faction' | 'joueurs' | 'mj' | 'lieu' | 'carte' | 'butin' | 'pieces' | 'xp' | 'rumeur' | 'indice' | 'secret' | 'urgent' | 'danger' | 'reglages' | 'ajouter' | 'rechercher' | 'filtrer' | 'plus';
/** Grimoire business icons (Lucide, ISC), 1.5px stroke, currentColor. Decorative unless `label` is set. */
export interface IconProps { name: IconName; size?: number; strokeWidth?: number; label?: string; className?: string; }
export declare function Icon(props: IconProps): JSX.Element | null;
