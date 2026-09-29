Carte résumant une quête dans le journal : titre, donneur, statut, progression des objectifs, récompense.

- Fournir `title` et `status` ; `giver`, `location`, `level` forment la ligne de métadonnées. Passer un `<ContactChip>` en `giver` pour relier le PNJ ou la faction.
- `objectives` alimente la piste de progression (`arcane` en cours, `forest` accomplie, `crimson` échouée) et le compteur 2/4 ; `showObjectives` les liste aussi dans la carte (vue détaillée).
- `rewards` (voir `RewardList`) : le pied en montre un résumé — pièces et XP en valeurs dorées, objets comptés dans la couleur du plus rare (« 2 objets »), le reste en « +1 ». `showRewards` affiche la liste complète au-dessus du pied. L'ancienne prop `reward` (« 250 po ») reste acceptée.
- `onClick` rend la carte sélectionnable ; `selected` pose le filet `gold` 2px.
- Résumé : deux phrases au plus, voix du récit. Grille de cartes : `space-4` d'écart, 320–440px de large.
- `visibility` `{level, players}` : `gm` ou `players` pose un filet tireté `secret` (pointillé pour des joueurs choisis), une bande hachurée `secret-hatch` en tête de carte et un onglet `Visibility` sur le bord haut. Chaque objectif peut aussi porter son propre `visibility`.
