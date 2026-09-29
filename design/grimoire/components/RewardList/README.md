List of a quest's rewards: coins, XP, items, reputation, other; each line has its glyph, and an item carries its PF2e rarity.

- `rewards`: `[{kind, label, rarity?, note?, to?, claimed?, visibility?}]`.
  - `kind`: `coin` (◎, amount in `gold-ink`), `xp` (✦), `item` (◈), `reputation` (▲ `arcane`, for example « Chevaliers de Lastwall +1 »), `other` (❧: a title, a favour, a piece of land).
  - `rarity` (items): `common` (nothing shown), `uncommon` « Peu courant » `ember`, `rare` « Rare » `arcane`, `unique` « Unique » `gold-ink` circled in `gold`. The word carries the rarity, the colour reinforces it.
  - `note`: an italic detail (« niveau 3 », « au choix du groupe »); `to`: the character who received it (« → Kyra »); `claimed`: struck through in `ink-muted` once handed out.
  - `visibility`: a reward can be hidden (Secret MJ) or promised to some players, like an objective.
- `title`: « Récompenses » by default, `false` to remove it.
- Recommended order: coins, XP, items (rarest to most common), reputation, other.
- In `QuestCard`, the card foot only shows a **summary**: coins and XP as values, items counted (« 2 objets », in the colour of the rarest item, list on hover), the rest as « +1 ». The full list shows with `showRewards` (detailed view).
