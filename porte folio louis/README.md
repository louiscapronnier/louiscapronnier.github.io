# Portfolio BTS SIO (SLAM/SISR) - Vanilla

Projet: site portfolio moderne pour l'épreuve du BTS SIO (SLAM ou SISR).

## Contenu

Fichiers principaux:
- `index.html` : structure semantic + contenu des sections
- `style.css` : design responsive + dark mode + animations légères
- `script.js` : dark mode, animations au scroll, lien navigation active, modal projets, validation formulaire
- `images/` : images/avatars + captures factices a remplacer

## Personnaliser rapidement

1. Remplace `Votre Nom` / `Votre Prenom Nom` par ton identité dans `index.html`.
2. Remplace les URL `https://github.com/...` et LinkedIn par les tiennes.
3. Place ton CV en PDF sous `docs/cv-louis-capronnier.pdf` (le bouton sur l’accueil pointe vers ce fichier).
4. Édite les 3 cartes projets (titre, description, compétences, contexte, lien GitHub) dans `index.html`.
5. Remplace les placeholders “captures” dans `images/` si tu as des vrais screenshots.
   - Optionnel: conserve les SVG si tu veux un rendu propre sans gros fichiers.

## Hébergement sur GitHub Pages

Option simple (recommandée): site statique à la racine.

1. Crée un dépôt GitHub (par exemple `portfolio-bts-sio`).
2. Push le contenu de ce dossier (tous les fichiers) sur la branche `main` (ou `master`).
3. GitHub -> **Settings** -> **Pages**.
4. Sous **Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: `main`
   - Folder: `/ (root)`
5. Sauvegarde. Attends la publication (souvent ~1 minute).

Ton site sera accessible via:
- `https://<ton-compte>.github.io/<ton-repo>/`

## SEO et accessibilité (points à dire à l'oral)

- Structure: titres `h1/h2/h3` coherents + sections `aria-labelledby`.
- Navigation: menu fixe + “skip link” pour acces clavier.
- Formulaire: labels associes + `aria-live` pour feedback.
- Progress bars: `role="progressbar"` et attributs `aria-valuenow`.
- Performance: images en placeholders, CSS/JS légers, `loading="lazy"` sur les captures.

