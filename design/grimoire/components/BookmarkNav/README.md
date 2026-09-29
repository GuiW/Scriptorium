Navigation verticale de bureau : chaque entrée est un signet de livre (ruban à queue d'aronde) qui sort de la tranche, le signet actif en `crimson` dépasse le plus.

- Fournir `items` (`{id, label, icon?, count?}` ou `{divider: true}`), `value` (id actif) et `onChange(id)`.
- `title` et `kicker` affichent la campagne en tête (« Campagne » / « L'Âge des Cendres ») ; `footer` pour la session en cours ou le joueur connecté.
- Le signet actif s'étend sur toute la largeur, aplat `crimson`, texte `on-crimson`, `aria-current="page"`. Au survol, un signet inactif avance de 8px — le seul mouvement, désactivé avec `prefers-reduced-motion`.
- Colonne de 240px en `surface-sunk`, filet `hairline` à droite. Signets inactifs en `surface-raised`, `count` en chiffres tabulaires (quêtes en cours, par ex.).
- 5 à 7 entrées au plus ; libellés d'un ou deux mots (Quêtes, Journal, Contacts, Lieux, Butin). Icônes au trait facultatives, en `ink-muted`.
- `variant` : `full` (défaut, bureau ≥ 1200px) ou `rail` (tablette 768–1199px). En `rail`, la colonne fait 88px : icône au-dessus d'un libellé de 11px, compteur en exposant, nom de campagne réduit à son initiale dans un sceau doré ; le pied de colonne disparaît. Les icônes deviennent indispensables.
- Sous 768px, passer à `BookmarkTabs` avec la même liste `items`.
