import type {
  ContactKind,
  QuestObjective,
  QuestStatus,
  Reward,
  VisibilityValue,
} from '@scriptorium/ui-grimoire';

/** TEMPORARY — the canvas's demo quests (design/quetes/Main.dc.html); moves to the feature library with the page. */
export interface DemoQuest {
  id: string;
  title: string;
  status: QuestStatus;
  giver?: { name: string; kind: ContactKind; reputation: number };
  location: string;
  level?: number;
  summary: string;
  visibility?: VisibilityValue;
  objectives: QuestObjective[];
  rewards: Reward[];
}

export const DEMO_QUESTS: DemoQuest[] = [
  {
    id: 'q1',
    title: 'La crypte sous Otari',
    status: 'active',
    giver: { name: 'Wrin Sivinxi', kind: 'npc', reputation: 3 },
    location: 'Otari',
    level: 2,
    summary:
      'Des lueurs ont été vues sous la vieille chapelle. Wrin paiera bien qui découvrira leur source.',
    objectives: [
      { label: "Interroger le forgeron d'Otari", done: true },
      { label: "Trouver l'entrée de la crypte", done: true },
      { label: 'Retrouver le médaillon de la prêtresse' },
      {
        label: 'Épargner le gardien squelette',
        optional: true,
        visibility: { level: 'players', players: [{ name: 'Kyra' }] },
      },
    ],
    rewards: [
      { kind: 'coin', label: '250 po' },
      { kind: 'xp', label: '80 XP' },
      { kind: 'item', label: 'Lame de lune', rarity: 'rare', note: 'épée longue +1' },
      { kind: 'item', label: 'Potion de guérison moyenne', rarity: 'uncommon' },
    ],
  },
  {
    id: 'q2',
    title: 'Le serment des Cendres',
    status: 'active',
    visibility: { level: 'gm' },
    giver: { name: 'Les Chevaliers de Lastwall', kind: 'faction', reputation: 1 },
    location: "Ravin d'Ardis",
    level: 4,
    summary:
      "Un éclaireur de Lastwall a disparu près du ravin ; la faction ignore encore qu'il a rejoint les cultistes.",
    objectives: [
      { label: "Suivre la piste de l'éclaireur", done: true },
      { label: 'Confirmer sa trahison' },
      { label: 'Décider du sort de Corvin' },
    ],
    rewards: [
      { kind: 'coin', label: '500 po' },
      { kind: 'reputation', label: 'Chevaliers de Lastwall +2' },
    ],
  },
  {
    id: 'q3',
    title: "L'escorte du marchand",
    status: 'completed',
    giver: { name: 'Oleg Leveton', kind: 'npc', reputation: 4 },
    location: 'Route de Breachill',
    level: 1,
    summary:
      'Trois jours sur la route, une charrette de fourrures et une bande de gobelins trop curieux.',
    objectives: [
      { label: "Escorter la charrette jusqu'à Breachill", done: true },
      { label: "Repousser l'embuscade", done: true },
      { label: 'Livrer les fourrures', done: true },
    ],
    rewards: [{ kind: 'coin', label: '80 po' }],
  },
  {
    id: 'q4',
    title: 'Le pacte des ombres',
    status: 'failed',
    location: "Marché noir d'Almas",
    level: 3,
    summary: 'Un informateur promettait le nom du commanditaire ; il a filé avant la pleine lune.',
    objectives: [
      { label: "Retrouver l'informateur", done: true },
      { label: 'Obtenir le nom avant la pleine lune' },
    ],
    rewards: [],
  },
  {
    id: 'q5',
    title: 'Le phare noyé',
    status: 'rumor',
    location: 'Côte des Brumes',
    summary: "Un marin ivre jure avoir vu la lanterne s'allumer sous les flots.",
    objectives: [],
    rewards: [],
  },
  {
    id: 'q6',
    title: 'La dette des Emberlyn',
    status: 'active',
    visibility: { level: 'players', players: [{ name: 'Kyra' }] },
    giver: { name: 'Yvane Emberlyn', kind: 'npc', reputation: 4 },
    location: 'Otari',
    level: 2,
    summary:
      "La grand-mère de Kyra demande qu'on retrouve la broche de famille, gagée pour payer une dette de jeu.",
    objectives: [
      { label: 'Retrouver le prêteur sur gages', done: true },
      { label: 'Racheter ou reprendre la broche' },
    ],
    rewards: [
      { kind: 'reputation', label: 'Famille Emberlyn +1' },
      { kind: 'other', label: 'Un repas chez les Emberlyn' },
    ],
  },
];
