Card summarising a quest in the journal: title, giver, status, objective progress, reward.

- Provide `title` and `status`; `giver`, `location` and `level` make up the metadata line. Pass a `<ContactChip>` as `giver` to link the NPC or faction.
- `objectives` feeds the progress track (`arcane` in progress, `forest` completed, `crimson` failed) and the 2/4 counter; `showObjectives` also lists them in the card (detailed view).
- `rewards` (see `RewardList`): the foot shows a summary — coins and XP as gold values, items counted in the colour of the rarest one (« 2 objets »), the rest as « +1 ». `showRewards` shows the full list above the foot. The legacy `reward` prop (« 250 po ») is still accepted.
- `onClick` makes the card selectable; `selected` adds the 2px `gold` rule. The card stays an `<article>`: the title holds a `button.gr-quest__open` (`aria-pressed`) stretched over the whole card, so a click anywhere selects it while the heading, the objective checkboxes and the giver link keep working; the focus ring goes around the card.
- Summary: two sentences at most, in the narrative voice. Card grid: `space-4` gap, 320–440px wide.
- `visibility` `{level, players}`: `gm` or `players` adds a dashed `secret` rule (the same for GM secrets and chosen players), a `secret-hatch` hatched band at the top of the card and a `Visibility` tab on the top edge. Each objective can also carry its own `visibility`.
