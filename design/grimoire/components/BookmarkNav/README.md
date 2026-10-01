Desktop vertical navigation: each entry is a book bookmark (a swallow-tailed ribbon) coming out of the spine; the active one, in `crimson`, reaches furthest.

- Provide `items` (`{id, label, link, icon?, count?}` or `{divider: true}`) and `value` (active id). Each bookmark is a link to its page (`link`), not a button: it can be opened in a new tab and is announced as a destination. `onChange(id)` is still called on click.
- `title` and `kicker` show the campaign at the top (« Campagne » / « L'Âge des Cendres »); `footer` for the current session or the signed-in player.
- The active bookmark spans the full width: `crimson` fill, `on-crimson` text, `aria-current="page"`. The focus ring is drawn inside the ribbon (inset 2px): an outer ring would be clipped by its notched shape. On hover, an inactive bookmark moves out by 8px — the only motion, disabled under `prefers-reduced-motion`.
- 240px column in `surface-sunk`, `hairline` rule on the right. Inactive bookmarks in `surface-raised`, `count` in tabular figures (quests in progress, for example).
- 5 to 7 entries at most; one- or two-word labels (Quêtes, Journal, Contacts, Lieux, Butin). Optional line icons, in `ink-muted`.
- `variant`: `full` (default, desktop ≥ 1200px) or `rail` (tablet 768–1199px). In `rail`, the column is 88px wide: icon above an 11px label, counter as a superscript, campaign name reduced to its initial in a gold seal (the seal is `aria-hidden`, the full name is kept for screen readers in `.gr-sr`, as is the counter: « , 3 »); the column footer disappears. Icons become mandatory.
- Below 768px, switch to `BookmarkTabs` with the same `items` list.
