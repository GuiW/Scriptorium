# Dossier design

- `grimoire/` : le design system (tokens, fiches de composants, CSS et JS de référence, preset PrimeNG). `tokens.json` est la source de vérité des couleurs, polices, espacements, rayons et ombres.
- `quetes/` : les sources des maquettes de la page Quêtes (bureau, tablette, mobile, ajout de quête, état d'erreur). Ce sont des fichiers du format canvas, à lire pour la structure et les données de démo, pas à ouvrir tels quels dans un navigateur.
- `GAPS.md` : ce que le système ne couvre pas encore.

Notes :
- Il n'y a pas de `tokens.css` ici : il se génère depuis `tokens.json` (première tâche d'intégration).
- Les 22 icônes sont des icônes Lucide ; le mapping vers les noms Lucide est dans `grimoire/assets/Icons/README.md`.
- `grimoire/components/bundle.js` est l'implémentation React de référence (comportement, classes `gr-*`), pas du code à livrer.
