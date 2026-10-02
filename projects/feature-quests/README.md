# feature-quests

The Quêtes page: quest model, store, list filtered by status and quest detail.

Never published: the `scriptorium` app compiles it from source through the
`@scriptorium/feature-quests` alias (`tsconfig.json`) and loads `QUESTS_ROUTES` lazily.
It only has `test` and `lint` targets:

```bash
ng test feature-quests
ng lint feature-quests
```

Components are written with the `ui-grimoire` components and the `tokens.css` variables only
(see `CLAUDE.md`). The data is mock for now (`data/quests.mock.ts`); when the backend arrives,
only `QuestsStore` changes.
