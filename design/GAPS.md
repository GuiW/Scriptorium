# Écarts design system — page Quêtes

Ce que le système ne couvre pas encore, ou couvre mal. On n'invente pas de style : chaque ligne attend une décision.

## Résolus (dans le design system, version 24)

| Besoin | Résolution |
|---|---|
| Filtre par statut (En cours / Accomplies / Échouées / Rumeurs) | Composant `Tabs` ajouté, 4 onglets, distinct des signets de navigation |
| Message « Choisis au moins un joueur » du `VisibilityPicker` | Affiché en `crimson` gras avec ✕ quand aucun joueur n'est coché ; l'écran doit désactiver « Créer » (voir l'écran « visibilité incomplète » du canvas) |
| Ombres des signets en thème Donjon (`BookmarkNav`, `BookmarkTabs`) | Variante `[data-theme="donjon"]` dans `bundle.css` (noir plutôt que brun) |
| Rose `secret` trop vif en Donjon (lu comme un état sélectionné) | `#d9a3cb` → `#c4a5bd` ; hachures alignées |

## Ouverts

| Besoin | Où | Piste, sans nouveau style |
|---|---|---|
| Ajout d'une quête sur mobile : aucun composant « feuille modale » | Écran « Nouvelle quête » | Page plein écran (barre Annuler / Créer, titre `title-lg`, champs `TextField`, `VisibilityPicker`) ; à valider avant de créer un composant `Sheet` |
| Onglets et cartes non interactifs dans les maquettes | Toute la page | Comportement à spécifier : le filtre par onglet filtre la grille, la sélection d'une carte ouvre le panneau (bureau) ou la page (tablette, mobile) |
| Le nombre d'onglets `Tabs` sur petit écran (4 onglets à 390px) | Mobile | À tester en vrai ; si cela déborde, défilement horizontal ou passage à 3 onglets + « Autres » |
| Onglet « Rumeurs » : les rumeurs peuvent-elles être promues en quête ? | Produit | Décision produit avant le code |
| Bouton `sm` dans les barres d'outils desktop (« Fermer » du panneau) | Bureau | Acceptable à la souris ; à revoir si l'app est utilisée au doigt sur grand écran |

## Règle d'usage

Tout nouvel écart découvert pendant l'implémentation s'ajoute ici avec : l'écran concerné, ce qui manque, la solution qui n'utilise que l'existant, et la décision attendue.
