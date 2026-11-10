/* =========================================================
   Ragnarok: The New World — Landing page (Groupe 106 V2)
   Interactions : vidéo de gameplay, galerie, menu mobile,
   fenêtres des événements, lien actif, suivi des clics CTA.
   Les boutons « Play Free on Steam » pointent directement vers
   https://store.steampowered.com/app/4212480/Ragnarok_The_New_World/
   (écrit dans index.html, sans paramètre ajouté).
   ========================================================= */

// ---------- Lien Steam officiel ----------
const STEAM_URL = "https://store.steampowered.com/app/4212480/Ragnarok_The_New_World/";
document.querySelectorAll("[data-cta]").forEach(link => { link.href = STEAM_URL; });

// ---------- Photos du jeu ----------
// Si une image manque, la case garde son fond coloré avec l'icône.
document.querySelectorAll("img.game-photo").forEach(img => {
  const hide = () => img.remove();
  if (img.complete && img.naturalWidth === 0) hide();
  else img.addEventListener("error", hide);
});

// ---------- Vidéos YouTube officielles ----------
// Pour changer une vidéo, colle l'identifiant YouTube (ce qui suit « v= » dans le lien).
const VIDEOS = {
  gameplay: "KVHa83JkUV0", // Official SEA Launch Gameplay (bouton du premier écran)
  trailer: "KVHa83JkUV0"   // Section « Watch the gameplay »
};
const youtubeUrl = (id, autoplay) =>
  "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) + "?rel=0&playsinline=1" + (autoplay ? "&autoplay=1" : "");

function makeIframe(id, autoplay, title) {
  const iframe = document.createElement("iframe");
  iframe.src = youtubeUrl(id, autoplay);
  iframe.title = title;
  iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen";
  iframe.allowFullscreen = true;
  return iframe;
}

// Section « Watch the gameplay » : on affiche la miniature YouTube avec un bouton Play,
// et la vraie vidéo ne se charge qu'au clic (page plus rapide, marche sur mobile).
const trailerFrame = document.getElementById("trailerFrame");
const trailerThumb = document.getElementById("trailerThumb");
const trailerPlay = document.getElementById("trailerPlay");
if (trailerThumb && VIDEOS.trailer) {
  const thumb = "https://i.ytimg.com/vi/" + VIDEOS.trailer + "/hqdefault.jpg";
  const test = new Image();
  test.onload = () => { if (test.naturalWidth > 120) trailerThumb.src = thumb; }; // sinon on garde l'image locale
  test.src = thumb;
  trailerPlay.addEventListener("click", () => {
    trailerFrame.replaceChildren(makeIframe(VIDEOS.trailer, true, "Ragnarok: The New World — gameplay"));
  });
}

// Fenêtre vidéo (bouton « Watch gameplay » du premier écran)
const videoDialog = document.getElementById("videoDialog");
const videoFrame = document.getElementById("videoFrame");
document.querySelectorAll("[data-video]").forEach(button => {
  button.addEventListener("click", () => {
    const id = VIDEOS[button.dataset.video];
    if (!id) return;
    videoFrame.replaceChildren(makeIframe(id, true, "Ragnarok: The New World — gameplay"));
    openDialog(videoDialog);
  });
});
// Arrête la vidéo quand on ferme la fenêtre
videoDialog.addEventListener("close", () => videoFrame.replaceChildren());

// ---------- Galerie de captures ----------
// Pour ajouter une capture : place l'image dans assets/ puis ajoute une ligne ici.
const GALLERY = [
  { src: "assets/explore-poster.jpg", caption: "Exploring the open world of Midgard" },
  { src: "assets/legend-cup.webp", caption: "Legend Cup — the first global Ragnarok tournament" },
  { src: "assets/halloween-nights.webp", caption: "Halloween Nights — Sage and Rogue arrive" },
  { src: "assets/home-decor-contest.webp", caption: "Home Decor Contest — decorate your own home" }
];

const galleryGrid = document.getElementById("galleryGrid");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
let galleryIndex = 0;

GALLERY.forEach((item, index) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "gallery-item reveal";
  button.setAttribute("aria-label", "Open image: " + item.caption);
  const img = document.createElement("img");
  img.src = item.src;
  img.alt = item.caption;
  img.loading = "lazy";
  img.addEventListener("error", () => button.remove());
  const caption = document.createElement("span");
  caption.textContent = item.caption;
  button.append(img, caption);
  button.addEventListener("click", () => showImage(index));
  galleryGrid.appendChild(button);
});

function showImage(index) {
  galleryIndex = (index + GALLERY.length) % GALLERY.length;
  const item = GALLERY[galleryIndex];
  lightboxImage.src = item.src;
  lightboxImage.alt = item.caption;
  lightboxCaption.textContent = item.caption + "  ·  " + (galleryIndex + 1) + " / " + GALLERY.length;
  if (!lightbox.open) openDialog(lightbox);
}
document.getElementById("lightboxPrev").addEventListener("click", () => showImage(galleryIndex - 1));
document.getElementById("lightboxNext").addEventListener("click", () => showImage(galleryIndex + 1));
lightbox.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft") showImage(galleryIndex - 1);
  if (event.key === "ArrowRight") showImage(galleryIndex + 1);
});
// Glisser du doigt sur téléphone
let touchStartX = null;
lightbox.addEventListener("touchstart", event => { touchStartX = event.touches[0].clientX; }, { passive: true });
lightbox.addEventListener("touchend", event => {
  if (touchStartX === null) return;
  const dx = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) showImage(galleryIndex + (dx < 0 ? 1 : -1));
  touchStartX = null;
});

// ---------- Fenêtres (ouverture / fermeture communes) ----------
function openDialog(dialog) {
  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "");
}
document.querySelectorAll("dialog").forEach(dialog => {
  dialog.querySelectorAll("[data-close]").forEach(btn => btn.addEventListener("click", () => dialog.close()));
  dialog.addEventListener("click", event => {
    if (event.target === dialog) dialog.close(); // clic en dehors de la fenêtre
  });
});

// ---------- Apparition des blocs au défilement ----------
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("visible"));
}

// ---------- Menu mobile ----------
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

function setMenu(open) {
  mainNav.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
}
menuToggle.addEventListener("click", () => setMenu(!mainNav.classList.contains("open")));
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && mainNav.classList.contains("open")) setMenu(false);
});
document.addEventListener("click", event => {
  if (mainNav.classList.contains("open") && !mainNav.contains(event.target) && !menuToggle.contains(event.target)) setMenu(false);
});

// ---------- Fenêtre des événements ----------
const eventData = {
  legend: {
    title: "Legend Cup — Valkyrie's Trial Squad Arena × Odin's Valhalla Guild Battle",
    image: "assets/legend-cup.webp",
    description: "The first global Ragnarok tournament, with two formats: form a squad for the Squad Arena, or fight with your guild in the Guild Battle. Guilds and squads from Southeast Asia, Taiwan, Hong Kong and Macau compete for the title of world's strongest.",
    meta: [
      "Squad Arena sign-up: Aug 6 – Dec 11, 2026",
      "Matches from November 2026",
      "Guild Battle Swiss stage: Dec 15–24, 2026",
      "US$1.01M base prize pool, plus a share of Legend Cup Pass sales"
    ],
    source: "https://gevents.gnjoy.hk/rocqb02/"
  },
  fields: {
    title: "New Fields & Mounts — Oct 23 update",
    image: "assets/explore-poster.jpg",
    description: "The October 23 maintenance opened new field maps around Comodo, Lutie and Aldebaran, added new mounts (some dropped by MVP bosses) and started the Halloween countdown.",
    meta: [
      "Available since Oct 23, 2026",
      "New fields: Comodo, Lutie, Aldebaran",
      "New mounts, including MVP drops"
    ],
    source: "https://gwww.gnjoy.hk/sea_official/detail.html?group_id=179266348724&language=en-US"
  },
  decor: {
    title: "Home Decor Contest",
    image: "assets/home-decor-contest.webp",
    description: "Decorate your Home, submit your design, then earn free votes every day to support your favorite homes. Entering, advancing and placing on the leaderboard all give rewards.",
    meta: ["Announced in the October 2026 update", "Limited-edition Home furniture, exclusive titles, Home materials"],
    source: "https://gwww.gnjoy.hk/sea_official/detail.html?group_id=179144915915&language=en-US"
  },
  halloween: {
    title: "Halloween Nights — Two New Class Paths",
    image: "assets/halloween-nights.webp",
    description: "The Halloween season is over, but its update stays: the new second-job paths Sage and Rogue are now part of the game.",
    meta: ["Halloween events: Oct 24 – early Nov 2026 (ended)", "Hallowspin: mounts and other rewards", "Sage and Rogue: available now"],
    source: "https://gwww.gnjoy.hk/sea_official/detail.html?group_id=179266348724&language=en-US"
  }
};

const eventDialog = document.getElementById("eventDialog");
function openEvent(key) {
  const item = eventData[key];
  if (!item) return;
  const image = document.getElementById("dialogImage");
  image.src = item.image;
  image.alt = item.title;
  document.getElementById("dialogTitle").textContent = item.title;
  document.getElementById("dialogDescription").textContent = item.description;
  document.getElementById("dialogMeta").replaceChildren(...item.meta.map(text => {
    const li = document.createElement("li");
    li.textContent = "• " + text;
    return li;
  }));
  document.getElementById("dialogSource").href = item.source;
  openDialog(eventDialog);
}
document.querySelectorAll("[data-event]").forEach(button => {
  button.addEventListener("click", () => openEvent(button.dataset.event));
});

// ---------- Lien actif dans le menu ----------
const navLinks = [...document.querySelectorAll(".nav-link")];
const sections = navLinks
  .map(link => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link =>
        link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id)
      );
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  sections.forEach(section => observer.observe(section));
}

// ---------- Suivi des clics sur le CTA ----------
// Envoie « cta_click » avec la position du bouton si un outil d'analyse
// (Google Tag Manager / GA4 via dataLayer) est installé. Le lien n'est pas modifié.
document.querySelectorAll("[data-cta]").forEach(link => {
  link.addEventListener("click", () => {
    const payload = {
      event: "cta_click",
      cta_position: link.dataset.cta,
      device: window.matchMedia("(max-width: 900px)").matches ? "mobile" : "desktop"
    };
    if (Array.isArray(window.dataLayer)) window.dataLayer.push(payload);
  });
});
