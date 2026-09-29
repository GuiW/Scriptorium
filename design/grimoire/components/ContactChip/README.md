Référence en ligne à un PNJ ou une faction, sous forme de petite étiquette (fond `surface-sunk`, filet `hairline`) qui tient ensemble le médaillon, le nom et l'attitude ; à utiliser comme `giver` d'une `QuestCard` ou dans le texte.

- `kind` : `npc` (sceau rond) ou `faction` (écu). La forme distingue les deux, sans couleur.
- `reputation` ajoute un petit losange dans la couleur de l'attitude ; le mot est lu par les lecteurs d'écran et apparaît au survol.
- `onClick` en fait un lien vers la fiche contact (filet `gold` au survol).
- Pas d'autre information dans la puce : le détail vit dans `ContactCard`.
