Inline reference to an NPC or a faction, as a small tag (`surface-sunk` background, `hairline` rule) holding the medallion, the name and the attitude together; use it as the `giver` of a `QuestCard` or in running text.

- `kind`: `npc` (round seal) or `faction` (shield). The shape tells them apart, without colour.
- `reputation` adds a small diamond in the attitude's colour; the word is read by screen readers and appears on hover.
- `onClick` turns it into a link to the contact card (`gold` rule on hover).
- No other information in the chip: the details live in `ContactCard`.
