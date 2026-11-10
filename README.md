# Ragnarok: The New World — Landing page (Groupe 106 V2)

Site web en **HTML, CSS et JavaScript** (sans framework), construit à partir de la maquette PDF et des deux affiches originales.

## Ce que contient le projet
- Page d'accueil avec une grande bannière **Hero**
- **Menu de navigation** fonctionnel (et menu « hamburger » sur mobile)
- Section **Game Features**
- Section **Community Events** avec les deux affiches
- **Fenêtres de détails** pour les événements
- **FAQ interactive** (7 questions)
- Boutons **Play Free Now** (lien Steam officiel)
- **Animations** : apparition des blocs au défilement, effets au survol
- **Design responsive** : ordinateur, tablette et mobile

## Structure des fichiers
```
ragnarok-landing-page/
├── index.html      → contenu et structure de la page
├── style.css       → couleurs, mise en page, animations, responsive
├── script.js       → menu, fenêtres d'événements, animations, lien Steam
├── README.md       → ce fichier
└── assets/          → toutes les images (format WebP, optimisées)
    ├── key-art.webp                  (image officielle du premier écran)
    ├── prontera.webp / -640.webp     (capture du jeu)
    ├── legend-cup.webp / -640.webp
    ├── home-decor-contest.webp / -640.webp
    ├── halloween-nights.webp / -640.webp
    └── explore-poster.webp
```

## Optimisation des images et vidéos
- Toutes les images sont en **WebP** (bien plus léger que PNG/JPG).
- Chaque grande image existe en **2 tailles** : `-640.webp` (petite, pour les cartes et le téléphone) et la grande (pour la visionneuse et les grands écrans). Le navigateur choisit seul la bonne taille (`srcset`).
- Les images plus bas dans la page se chargent **seulement quand on arrive dessus** (`loading="lazy"`). L'image du premier écran se charge **en priorité**.
- Les vidéos sont sur **YouTube** : elles ne se chargent **qu'au clic** sur le bouton ▶. La page reste donc légère.

## Lancer le site sur ton ordinateur
1. Télécharge et décompresse le ZIP.
2. Ouvre le dossier avec **Visual Studio Code**.
3. Installe l'extension **Live Server**.
4. Fais un clic droit sur `index.html`.
5. Choisis **« Open with Live Server »**.
6. La page s'ouvre dans ton navigateur.

(Tu peux aussi double-cliquer directement sur `index.html`.)

## Changer une vidéo
Dans `script.js`, colle l'identifiant YouTube dans `VIDEOS` (pour `https://www.youtube.com/watch?v=ABC123xyz`, l'identifiant est `ABC123xyz`).

## Le lien Steam est déjà configuré
Tous les boutons « Play Free Now » mènent **exactement** à :
https://store.steampowered.com/app/4212480/Ragnarok_The_New_World/

L'adresse est écrite à deux endroits :
- dans `index.html`, sur chaque bouton : les boutons marchent même sans JavaScript ;
- dans `script.js`, variable `STEAM_URL`.

N'ajoute aucun paramètre à ce lien : pour le challenge, AFBooster attribue le lien automatiquement.

## Publier le site

### Pour le challenge (TAF 2) : AFBooster
Héberge le dossier complet (avec `assets/`) dans la section **Landing Pages** d'AFBooster, puis teste les boutons depuis l'adresse publiée, sur ordinateur et sur téléphone.

### Gratuitement, pour un aperçu : GitHub Pages
1. Crée un compte sur https://github.com.
2. Crée un dépôt **public**, par exemple `ragnarok-landing-page`.
3. Envoie tous les fichiers, en gardant le dossier `assets/` à la racine.
4. Ouvre **Settings → Pages**.
5. Dans **Build and deployment**, choisis **Deploy from a branch**, branche `main`, dossier `/ (root)`, puis **Save**.
6. Après une ou deux minutes, l'adresse du site apparaît dans cette même page.

### Autre solution : Netlify
Va sur https://app.netlify.com/drop et glisse le dossier décompressé dans la zone indiquée. Le site est en ligne en quelques secondes.

## Avant de publier
- Vérifie que vous avez le droit d'utiliser les affiches et les logos du jeu.
- Teste tous les boutons et la FAQ sur ordinateur et sur téléphone.
- Garde la mention « page non officielle » du pied de page.

## Ajouter des captures dans la galerie

1. Mets l'image dans le dossier `assets/` (par exemple `assets/capture-1.jpg`).
2. Dans `script.js`, ajoute une ligne dans le tableau `GALLERY` :
   `{ src: "assets/capture-1.jpg", caption: "Texte sous l'image" },`
