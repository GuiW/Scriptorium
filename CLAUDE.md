# Interface — design system Grimoire

Source de vérité visuelle : `design/grimoire/` (tokens.json, README.md, fiches de composants, integration/primeng.md, grimoire-preset.ts, bundle.css).
Maquettes de référence : `design/quetes/` (canvas exporté, captures Parchemin et Donjon).

## Règles

- Angular 22, composants standalone, état en signals, Nx : les composants Grimoire vont dans une lib dédiée (`ui-grimoire`), la page Quêtes dans la lib de la feature.
- Aucune couleur, taille de police, espacement, rayon ou ombre en dur : uniquement les variables CSS de `tokens.css` (`var(--surface)`, `var(--space-4)`…). Ce fichier est généré depuis `design/grimoire/tokens.json` : ne jamais l'éditer à la main, relancer le script de génération.
- Thèmes : Parchemin (défaut) et Donjon, via l'attribut `data-theme="donjon"` sur un ancêtre. Tout composant doit être vérifié dans les deux.
- Composants génériques (champs, boutons, listes, overlays) : PrimeNG 22 avec `GrimoirePreset`. Composants métier (QuestCard, Objective, Reputation, Visibility, SecretBlock, VisibilityPicker, RewardList, Tabs, BookmarkNav, BookmarkTabs) : réécrits en Angular, mêmes classes `gr-*` que `bundle.css`, mêmes noms de props que `index.d.ts`.
- Un besoin non couvert par un composant ou un token : ne pas inventer de style. L'ajouter à `design/GAPS.md`, proposer une solution avec l'existant, et attendre une décision.

## Accessibilité (non négociable)

- Un statut ou une visibilité = un glyphe ET un mot, jamais la couleur seule (◆ En cours, ✓ Accomplie, ✕ Échouée, ? Rumeur ; Secret MJ / « Pour toi »).
- Anneau de focus `var(--focus)`, 2px, décalé de 2px, sur tout élément interactif.
- Cibles tactiles ≥ 44px sur tablette et mobile : `Button` en taille par défaut, jamais `sm`.
- Navigation entre pages : BookmarkNav / BookmarkTabs. Filtre par statut dans une liste : `Tabs`. Ne pas les intervertir.

## Langue et ton

- Interface en français, casse de phrase, libellés d'action à l'infinitif (« Ajouter un objectif »). Pas d'emoji, pas de « OK » ni de « Valider » seul.
- Vocabulaire de table : quête, objectif, session, donneur, récompense.
- Statuts : En cours, Accomplie, Échouée, Rumeur.

## Méthode

- Travailler par tranche : tokens et thème, puis composants un par un (feuilles avant composés), puis navigation, puis la page.
- Pour chaque tranche : plan validé avant le code, un test de rendu par composant (tous les statuts, thème sombre), un commit séparé.
- Données de démo : reprendre celles du canvas (6 quêtes, dont une Secret MJ et une partagée avec Kyra).
