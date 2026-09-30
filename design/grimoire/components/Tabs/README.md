Filters a list by status, as underlined tabs — not to be confused with the bookmarks of `BookmarkNav`/`BookmarkTabs`, which are reserved for navigating between the app's pages. Called `StatusFilter` in Angular (`gr-status-filter`); `Tabs` stays the canvas name.

- Provide `items` (`{id, label, count?}`), `value` (active id) and `onChange(id)`.
- The active tab turns `crimson` with a 2px bottom rule; the others stay `ink-muted`, `ink` on hover.
- `count`, in tabular figures next to the label, always covers every possible status for that content — including 0, never silently hidden in another tab.
- It looks like tabs but is a single-choice filter: every option filters the same list, there is no panel per tab. So it is a radio group, not a tablist: `role="radiogroup"` with the `aria-label` (« Filtrer les quêtes »), each option a real button with `role="radio"` and `aria-checked`, touch target ≥ 44px.
- Keyboard: Tab enters the group on the checked option; the arrow keys, Home and End move to another option and select it (the list is filtered at once).
- 2 to 5 options at most; a richer or multi-facet filter belongs in a menu, not here.
