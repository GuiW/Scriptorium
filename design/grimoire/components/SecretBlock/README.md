Cadre pour tout contenu restreint (note, paragraphe de journal, indice) : filet tireté `secret` (pointillé pour des joueurs choisis), onglet `Visibility` posé sur le bord haut, bande hachurée discrète en tête.

- `level` : `gm` (défaut) ou `players` ; `players` : `[{name, you?}]`.
- `children` : le contenu, en `body` par défaut.
- À utiliser pour un bloc à l'intérieur d'une page publique. Pour une quête entière, passer `visibility` à `QuestCard` ; pour un objectif, à `Objective`.
- Ne pas imbriquer deux cadres secrets.
