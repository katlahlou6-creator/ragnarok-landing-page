# Ragnarok: The New World — Landing page (Groupe 106 V2)

Site web en **HTML, CSS et JavaScript** (sans framework), construit à partir de la maquette PDF et des deux affiches originales.

## Ce que contient le projet
- Page d'accueil avec une grande bannière **Hero**
- **Menu de navigation** fonctionnel (et menu « hamburger » sur mobile)
- Section **Game Features**
- Section **Community Events** avec les deux affiches
- **Fenêtres de détails** pour les événements
- **FAQ interactive** (7 questions)
- Boutons **Play Free on Steam**
- **Animations** : apparition des blocs au défilement, effets au survol
- **Design responsive** : ordinateur, tablette et mobile

## Structure des fichiers
```
ragnarok-landing-page/
├── index.html      → contenu et structure de la page
├── styles.css      → couleurs, mise en page, animations, responsive
├── script.js       → menu, fenêtres d'événements, animations, lien Steam
├── README.md       → ce fichier
└── assets/
    ├── home-decor-contest.webp
    └── halloween-nights.webp
```
Les affiches sont au format WebP : même image, mais environ 25 fois plus légère que le PNG, pour une page rapide.

## Lancer le site sur ton ordinateur
1. Télécharge et décompresse le ZIP.
2. Ouvre le dossier avec **Visual Studio Code**.
3. Installe l'extension **Live Server**.
4. Fais un clic droit sur `index.html`.
5. Choisis **« Open with Live Server »**.
6. La page s'ouvre dans ton navigateur.

(Tu peux aussi double-cliquer directement sur `index.html`.)

## Ajouter tes photos et ta vidéo
**Photos des 3 cases « Game Features »** : mets 3 images (format .jpg) dans le dossier `assets/`, avec ces noms exacts :
- `explore.jpg` : un paysage, le monde ouvert
- `classes.jpg` : les classes ou un personnage
- `bosses.jpg` : un combat de boss en groupe

**Vidéo (bande-annonce)**, au choix :
- **YouTube** : dans `script.js`, colle l'identifiant de la vidéo dans `TRAILER_YOUTUBE_ID` (pour `https://www.youtube.com/watch?v=ABC123xyz`, l'identifiant est `ABC123xyz`) ;
- **ton fichier** : mets-le dans `assets/` sous le nom `trailer.mp4`.

Tant qu'une photo ou la vidéo manque, la page garde son affichage normal.

## Le lien Steam est déjà configuré
Tous les boutons « Play Free on Steam » mènent **exactement** à :
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
