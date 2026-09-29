Barre d'onglets mobile (< 768px) en bas d'écran : l'onglet actif porte un signet `crimson` qui pend du bord supérieur, comme un ruban qui dépasse du haut d'une page.

- Mêmes `items`, `value` et `onChange` que `BookmarkNav` : une seule liste pour les trois tailles. Les séparateurs sont ignorés et seules les 5 premières entrées s'affichent ; mettre les autres (Réglages, Lieux…) derrière un onglet « Plus ».
- À la sélection, le signet se déroule depuis le bord haut (0,22s, léger rebond) derrière l'icône, qui ne bouge pas ; animation coupée avec `prefers-reduced-motion`.
- Chaque onglet fait 64px de haut sur toute sa largeur (cible tactile ≥ 44px). Icône obligatoire ici (sinon un ◆ par défaut), ramenée à 16px quelle que soit sa taille d'origine, libellé de 11px sur un mot.
- `count` devient une pastille en losange `ember` (le nombre est lu par les lecteurs d'écran) : sur mobile, on signale qu'il y a du nouveau, pas combien.
- Fixer la barre en bas de l'écran (`position: fixed; bottom: 0`) et réserver 64px + la zone de sécurité en bas du contenu ; la barre ajoute déjà `env(safe-area-inset-bottom)`.
- Le nom de la campagne passe dans l'en-tête de page, pas dans la barre.
