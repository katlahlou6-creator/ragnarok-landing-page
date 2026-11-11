# Ragnarok: The New World — Landing page (Groupe 106 V2)

Site web en **HTML, CSS et JavaScript** (sans framework), construit à partir de la maquette PDF et des deux affiches originales.

## Ce que contient le projet
- Page d'accueil avec une grande bannière **Hero**
- **Menu de navigation** fonctionnel (et menu « hamburger » sur mobile)
- Section **Game Features**
- Section **Community Events** avec les deux affiches
- **Fenêtres de détails** pour les événements
- **FAQ interactive** (7 questions)
- Boutons **Play Free on Steam** (lien Steam officiel)
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

## Ajouter des captures dans la galerie

1. Mets l'image dans le dossier `assets/` (par exemple `assets/capture-1.jpg`).
2. Dans `script.js`, ajoute une ligne dans le tableau `GALLERY` :
   `{ src: "assets/capture-1.jpg", caption: "Texte sous l'image" },`

## Suivi Meta Pixel (plan de tracking)
Tout se règle en haut de la partie « SUIVI » de `script.js` :

1. **Créer le Pixel** dans Meta Events Manager (Connect Data → Web → « Ragnarok Landing Page »), copier le **Pixel ID**.
2. Le coller dans `const META_PIXEL_ID = "";` (que des chiffres), puis **Commit changes** sur GitHub.
3. Tant que le Pixel ID est vide : aucun Pixel, aucun bandeau. Une fois rempli : un bandeau de consentement apparaît, et le Pixel ne se charge **qu'après « Accept »**.

**Événements envoyés :**
| Événement | Quand | Sens |
|---|---|---|
| PageView | chargement de la page | visite |
| ViewContent | clic sur une vidéo de gameplay (1 fois par visite) | intérêt |
| CTA_Click | clic sur un bouton « Play Free on Steam » du haut (barre, premier écran, fenêtre d'événement) ou sur « Start » → `#go2offer` | intention |
| SectionView | une section (Gameplay, World, Community, offre finale) atteint le milieu de l'écran | lecture du contenu |
| EventDetailsView | ouverture du détail d'un événement | intérêt communauté |
| GalleryView | ouverture d'une image de la galerie | intérêt visuel |
| SteamOutboundClick | clic sur le grand bouton final « Play Free on Steam » | départ vers Steam |
| CompleteRegistration | **jamais** : un clic vers Steam n'est pas une inscription | — |

**Paramètres de campagne :** les UTM de l'adresse (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `campaign`, `adset`, `ad`, ou `?source=`) sont gardés dans le navigateur (première source + dernière campagne) et ajoutés aux événements.

**Lien Steam :** `ADD_UTM_TO_STEAM_LINK = false` par défaut → lien Steam **exact**, comme l'exige le TAF (AFBooster attribue le lien). Mettre `true` seulement pour la version GitHub Pages + Meta Ads si le client l'accepte.

**Parcours CTA :** les boutons « Play Free on Steam » du haut mènent à la section finale `#go2offer` ; seul le grand bouton de cette section ouvre Steam (lien exact).

## Règles de conversion (appliquées partout)
- **Un seul libellé de bouton :** « Play Free on Steam ». Les boutons du haut mènent à `#go2offer`, le grand bouton final ouvre Steam.
- **Plateforme claire avant le clic :** « Free download for Windows PC via Steam » sous les boutons du premier écran et sous le bouton final, plus une question dans la FAQ.
- **Aucune mention** de jeu sur Android, iOS ou de progression entre appareils.
- **Réseaux sociaux en option :** simples liens texte sous la FAQ et dans le pied de page, jamais à côté du bouton de téléchargement.
- **Infos vérifiées le 11 novembre 2026** (fiche Steam et annonces officielles) : configuration (12 Go de RAM minimum, 16 Go recommandés, 30 Go de stockage), 4 langues, prix (gratuit), compte Gravity requis, dotation du Legend Cup (US$1,01 M garantis + pool des ventes du Pass). Les dates non confirmées par une source officielle ont été retirées.
