Liste des récompenses d'une quête : pièces, XP, objets, réputation, autre ; chaque ligne a son glyphe, et un objet porte sa rareté PF2e.

- `rewards` : `[{kind, label, rarity?, note?, to?, claimed?, visibility?}]`.
  - `kind` : `coin` (◎, montant en `gold-ink`), `xp` (✦), `item` (◈), `reputation` (▲ `arcane`, par ex. « Chevaliers de Lastwall +1 »), `other` (❧ : un titre, une faveur, un terrain).
  - `rarity` (objets) : `common` (rien d'affiché), `uncommon` « Peu courant » `ember`, `rare` « Rare » `arcane`, `unique` « Unique » `gold-ink` cerclé de `gold`. Le mot porte la rareté, la couleur la renforce.
  - `note` : précision en italique (« niveau 3 », « au choix du groupe ») ; `to` : le personnage qui l'a reçue (« → Kyra ») ; `claimed` : barré en `ink-muted` une fois remis.
  - `visibility` : une récompense peut être cachée (Secret MJ) ou promise à certains joueurs, comme un objectif.
- `title` : « Récompenses » par défaut, `false` pour le retirer.
- Ordre conseillé : pièces, XP, objets (du plus rare au plus courant), réputation, autre.
- Dans `QuestCard`, le pied de carte n'en montre qu'un **résumé** : pièces et XP en valeurs, les objets comptés (« 2 objets », dans la couleur de l'objet le plus rare, liste au survol), le reste en « +1 ». La liste complète s'affiche avec `showRewards` (vue détaillée).
