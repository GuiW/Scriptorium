Filters a list by status, as underlined tabs — not to be confused with the bookmarks of `BookmarkNav`/`BookmarkTabs`, which are reserved for navigating between the app's pages.

- Provide `items` (`{id, label, count?}`), `value` (active id) and `onChange(id)`.
- The active tab turns `crimson` with a 2px bottom rule; the others stay `ink-muted`, `ink` on hover.
- `count`, in tabular figures next to the label, always covers every possible status for that content — including 0, never silently hidden in another tab.
- Each tab is a real button (`role="tab"`), touch target ≥ 44px.
- 2 to 5 tabs at most; a richer or multi-facet filter belongs in a menu, not in `Tabs`.
