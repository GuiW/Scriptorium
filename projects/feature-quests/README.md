# feature-quests

The Quêtes page: quest model, store, list filtered by status and quest detail.

Never published: the `scriptorium` app compiles it from source through two aliases
(`tsconfig.json`):

- `@scriptorium/feature-quests`: `QUESTS_ROUTES` only, loaded lazily with `import()`. The app's
  ESLint config forbids a static import of it, which would put the page in the main bundle.
- `@scriptorium/feature-quests/data`: the quest model and `QuestsStore`, for what the app needs
  eagerly (the quest counter in the navigation).

It only has `test` and `lint` targets:

```bash
ng test feature-quests
ng lint feature-quests
```

Components are written with the `ui-grimoire` components and the `tokens.css` variables only
(see `CLAUDE.md`). The data is mock for now (`data/quests.mock.ts`); when the backend arrives,
only `QuestsStore` changes.
