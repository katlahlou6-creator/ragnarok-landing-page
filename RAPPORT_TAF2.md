# Ragnarok: The New World — Landing page TAF 2

Récapitulatif des corrections apportées à la landing page à partir du brief TAF 1 (Groupe 106 V2) et des consignes du TAF 2.

- **Point de départ :** `Ragnarok_Hero_Preview_v2 copie/` (inchangé, conservé comme sauvegarde)
- **Résultat :** `Ragnarok_Landing_TAF2/`
- **Destination unique des CTA Steam :** `https://store.steampowered.com/app/4212480/Ragnarok_The_New_World/`

---

## 1. Rappel du brief (TAF 1)

| Élément | Choix |
|---|---|
| GEO | Philippines |
| Langue | Anglais |
| Plateforme | PC Windows via Steam (serveurs Asie du Sud-Est) |
| Audience | Joueurs de MMORPG / RPG fantasy sur PC |
| Promesse | « Your legend begins in Midgard. » |
| CTA | « Download free on Steam », même lien Steam partout |
| Conversion | First login (première connexion au jeu après installation) |
| À ne jamais faire | « No P2W », « N°1 en Asie », faux avis, mise en avant de la note Steam |

---

## 2. Structure du projet

```
Ragnarok_Landing_TAF2/
├── index.html
├── style.css
├── script.js
└── assets/
    ├── images/   (logo, affiches des vidéos, 8 visuels de classes)
    └── videos/   (vidéo Hero + 5 clips gameplay)
```

Nettoyage par rapport à la version de départ :

- Retrait de `__MACOSX/` et `.DS_Store` (fichiers système macOS).
- Retrait de `Ragnarok_Gameplay_Clean.mp4` (18,3 Mo, utilisé nulle part dans la page).
- Tous les chemins sont relatifs (`./style.css`, `./assets/...`).

---

## 3. Corrections section par section

### Partie 0 — Barre du haut

- **Ajouts :** le logo (retour en haut), le menu *Home · Gameplay · Features · FAQ · Download steps* et le bouton « Download free on Steam ».
- **Lien « Download steps » :** il fait seulement défiler vers la section Téléchargement (`#go2offer`) et n'ouvre pas Steam.
- **Comportement :** la barre n'est pas fixe (pas de bouton fixe sur téléphone, conformément au brief).
- **Sur mobile :**
  - le menu devient un bouton « Menu » accessible au clavier, qui se ferme avec Échap, au clic sur un lien ou à l'extérieur ;
  - sans JavaScript, la liste des liens reste visible.

### Partie 1 — Hero (promesse + CTA)

- **Titre :** « Your legend begins in Midgard. »
- **Texte :** « Explore the open world of Midgard, master your class and take on powerful bosses with your friends and guild. »
- **CTA :** « Download free on Steam » (au lieu de « Play on Steam »).
- **Micro-texte :** *Windows PC · Opens the Steam page · Gravity account required · Optional in-game purchases*
- **Vidéo :**
  - elle démarre automatiquement en **muet** sur tous les navigateurs ;
  - le son est activé seulement si l'utilisateur clique sur « Sound on » (volume 18 %) ;
  - elle ne démarre pas automatiquement si l'utilisateur a choisi de réduire les animations ou d'économiser les données.
- **Chargement :** l'affiche de la vidéo est préchargée en priorité, pour un affichage rapide du visuel principal (LCP).
- **Choix :** pas de CTA secondaire « Watch PC gameplay », à la demande de l'équipe.

### Partie 2 — Gameplay

- **Titre :** la section a désormais un titre fixe, « See the game in action ». Le nom du clip en cours s'affiche dessous (avant, le titre H2 changeait à chaque clip).
- **Carousel :** les 5 clips sont conservés (Gear Up, Advance Your Class, Face Powerful Monsters, Explore Midgard, Join the Battle).
- **Accessibilité du carousel :** navigation au clavier, pause/lecture et annonces pour les lecteurs d'écran.
- **CTA :** « Download free on Steam » + micro-texte.

### Partie 3 — Bénéfices

- **Section :** `id="features"`, avec le titre « A whole new world to explore with your guild ».
- **3 cartes réécrites selon le brief :**
  - **Explore Midgard :** premier Ragnarok en monde ouvert, avec le vol ;
  - **Fight Together :** boss MVP avec les amis et la guilde ;
  - **Become a Legend :** personnage, équipement, rôle dans le groupe.
- **Nouveau bloc « 8 classes. One character. Your way. » :**
  - présente Job Freedom (changement de classe sur le même personnage) et la personnalisation des tenues ;
  - 8 cartes : Swordsman, Archer, Mage, Acolyte, Thief, Merchant, Gunslinger, Druid ;
  - chaque carte a un visuel, un rôle et une phrase courte tirée des descriptions des classes.
- **Hiérarchie des titres corrigée :** H2 pour la section, H3 pour les cartes, H4 pour les classes.
- **CTA :** « Download free on Steam » + micro-texte.

### Partie 4 — Téléchargement (`#go2offer`)

- **Titre :** « Start your adventure in 3 steps ».
- **3 étapes :**
  1. **Open the Steam page :** ajouter le jeu à sa bibliothèque Steam (compte Steam gratuit si besoin).
  2. **Install the game :** prévoir environ 30 Go libres.
  3. **Launch the game and log in :** compte Gravity dans le launcher, choix du serveur, first login.
- **Bloc « Before you play » (prérequis) :**
  - Windows PC via Steam ;
  - 12 Go de RAM ;
  - 30 Go d'espace ;
  - connexion haut débit ;
  - serveurs SEA ;
  - compte Gravity ;
  - langues : anglais, indonésien, thaï, chinois simplifié.
- **CTA final :** « Download free on Steam » + micro-texte.
- **Note pour téléphone :** visible seulement sur les écrans tactiles ; elle rappelle que la version Steam est pour PC Windows.

### FAQ (`#faq`)

5 questions qui répondent aux objections identifiées dans le brief :

1. **Is this Ragnarok Online?** Non, c'est un nouveau jeu en monde ouvert sorti en 2026, pas un remake.
2. **Is the game free to play?** Oui, avec des achats optionnels.
3. **Is it pay-to-win?** Réponse honnête : les avis sont partagés, le joueur peut essayer gratuitement avant de dépenser. Pas de « No P2W ».
4. **Does the game play itself?** Un mode auto et l'accumulation de ressources hors ligne existent, mais on peut jouer soi-même.
5. **Can I play on my phone?** La page mène à la version PC Windows sur Steam.

### Pied de page

- **Mention principale :** « Ragnarok © Gravity Co., Ltd. All rights reserved. »
- **Crédit des visuels :** les noms, logos et médias appartiennent à Gravity Co., Ltd.
- **Mention d'honnêteté :** la page est une page promotionnelle indépendante, pas un site officiel Gravity.

---

## 4. Optimisation des médias

### Images des classes (PNG → WebP, 480 px de large)

| Avant | Après |
|---|---|
| ~1 Mo par image (8 images, ~8 Mo) | ~32 Ko par image (8 images, ~260 Ko) |

Toutes les images ont `width`/`height` (pas de décalage de mise en page) et `loading="lazy"` sous la ligne de flottaison.

### Vidéos (FFmpeg, H.264, `faststart`)

| Vidéo | Avant | Après |
|---|---|---|
| midgard-hero.mp4 (Hero, avec son) | 9,59 Mo | 6,07 Mo |
| join-the-battle.mp4 | 3,94 Mo | 2,41 Mo |
| face-powerful-monsters.mp4 | 3,12 Mo | 1,86 Mo |
| advance-your-class.mp4 | 2,05 Mo | 1,25 Mo |
| explore-midgard.mp4 | 1,69 Mo | 1,00 Mo |
| gear-up.mp4 | 1,16 Mo | 0,70 Mo |
| **Total** | **21,5 Mo** | **13,3 Mo (−38 %)** |

- **Résolutions et durées :** inchangées.
- **Son :** retiré des clips du carousel, qui sont lus en muet.
- **Contrôle qualité :** comparaison visuelle d'images et mesure SSIM (0,978 pour la vidéo Hero), sans différence visible.
- **Clips du carousel :** chargés seulement quand ils sont nécessaires (`preload="none"`).

---

## 5. Vérifications effectuées

- **Tailles d'écran :** desktop (1440 et 1280 px), petit desktop (1024 px), tablette (768 px) et mobile (375 px).
- **Mise en page :** aucun débordement horizontal.
- **Erreurs :** aucune erreur JavaScript dans la console ; aucune image ni vidéo introuvable.
- **CTA :** les 5 boutons « Download free on Steam » pointent exactement vers la fiche Steam 4212480.
- **Navigation :** le menu mobile s'ouvre et se ferme, et les liens défilent vers les bonnes sections.
- **Vidéos :** la vidéo Hero se lance et les 6 vidéos se chargent sans erreur après compression.

---

## 6. Reste à faire (après import sur AFBooster)

1. Importer l'archive dans la section **Landing Pages** du compte affilié de la classe. `index.html` est à la racine de l'archive.
2. Ouvrir l'URL publique en **navigation privée**, sur mobile et sur ordinateur.
3. Cliquer sur les CTA et vérifier la destination Steam et l'attribution au compte de la classe.
4. Lancer **PageSpeed Insights / Lighthouse** sur la version hébergée et corriger si besoin.
5. Vérifier que le carousel démarre bien automatiquement quand il apparaît à l'écran.
6. Remettre l'URL publique dans l'espace de dépôt.


## 7. Finition visuelle — édition Enhanced

- Renforcement du rendu cinématique du hero : contraste/couleurs, profondeur légère et particules lumineuses décoratives.
- Entrée progressive du titre, du texte et du CTA.
- Effets hover plus dynamiques sur les CTA, cartes de fonctionnalités et classes.
- Léger parallaxe du hero à la souris sur ordinateur, désactivé sur tactile et avec « réduire les animations ».
- Le son du trailer reste volontairement activé uniquement après clic sur « Sound on » : aucun son surprise au chargement.
- Les préférences d'accessibilité « réduire les animations » sont respectées.


## 8. Ma touche — Ghali Bennani

Objectif : aider le visiteur à **se projeter** (quelle classe jouer), à **lever le dernier frein** avant le téléchargement (mon PC est-il prêt ?) et à **ne pas perdre le trafic mobile** (les pubs Meta arrivent surtout sur téléphone, alors que le jeu est sur PC).

| Ajout | Ce que ça fait | Pourquoi c'est utile |
|---|---|---|
| **Hero en diaporama cinématique** | La vidéo du Hero est remplacée par 6 scènes tirées de la cinématique (forêt, désert, ciel, combat de nuit, héros, canyon), en 1600×900. Elles s'enchaînent toutes les 6 s en fondu avec un lent zoom, et des petits traits dorés montrent la progression. | Images nettes dès le chargement, sans attendre la vidéo : la page est bien plus légère (−6,4 Mo, 0,48 Mo pour les 6 images). Pause automatique hors écran ; scène fixe avec « réduire les animations ». |
| **Class Finder** (section Features) | 3 questions → la page recommande une des 8 classes, met sa carte en avant (« Your match ») et propose « See how to start ↓ ». | Engagement : le visiteur choisit déjà son personnage avant d'aller sur Steam. Les 8 classes peuvent toutes sortir (testé sur les 36 combinaisons de réponses). |
| **« Is your PC ready for Midgard? »** (section #go2offer) | 4 cases à cocher (Windows PC, 12 Go de RAM, 30 Go libres, compte Steam) + barre de progression. À 4/4 : « You're all set » et le bouton Steam final s'illumine. | Moins d'abandons entre l'installation et le *first login* (notre conversion) : le joueur vérifie les prérequis avant de télécharger. |
| **« Send this page to my PC »** (téléphone uniquement) | Ouvre le partage du téléphone (ou copie le lien) pour s'envoyer la page et l'ouvrir sur l'ordinateur. | Récupère les visiteurs mobiles au lieu de les perdre : ils peuvent continuer sur PC. |
| **Barre de progression de lecture** | Fine ligne dorée en haut de l'écran qui avance avec le défilement. | Repère visuel, donne envie d'aller jusqu'au bout. Purement décorative (pas un bouton fixe). |
| **Partage et onglet** | Icône d'onglet (logo) + balises Open Graph (titre, description, image). | Aperçu propre quand le lien est partagé. Sur AFBooster, mettre l'adresse complète de l'image dans `og:image`. |
| **Suivi** | Événements `class_finder_result`, `pc_ready_check_complete`, `send_to_pc_click` envoyés au `dataLayer` s'il existe. | Mesurer si ces ajouts sont utilisés. Ne fait rien si aucun outil de suivi n'est installé. |

**Corrections de l'édition Enhanced :**

- **Débordement horizontal :** l'agrandissement de la vidéo du Hero rendait la page plus large que l'écran (+30 px sur ordinateur, +12 px sur téléphone). Corrigé : retour à 0 px.
- **Menu téléphone :** une fois ouvert, il passait derrière le titre du Hero et « FAQ » / « Download steps » n'étaient plus cliquables. Corrigé.

**Règles du brief respectées :** toujours 5 boutons Steam avec le lien exact ; pas de CTA secondaire dans le Hero ; pas de bouton fixe sur téléphone ; pas de faux avis, de note Steam ni de « No P2W » ; anglais ; aucune ressource externe (tout reste dans l'archive) ; « réduire les animations » respecté.

**Vérifié :** ordinateur (1440 px) et iPhone 13, aucune erreur JavaScript, aucun débordement horizontal, menu téléphone, Class Finder, check PC, bouton « Send to my PC ».
