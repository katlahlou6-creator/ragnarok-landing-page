/* =========================================================
   Ragnarok: The New World — Landing page (Groupe 106 V2)
   Interactions : menu mobile, fenêtre des événements,
   lien actif dans le menu, suivi des clics sur le CTA.
   Les boutons « Play Free on Steam » pointent directement vers
   https://store.steampowered.com/app/4212480/Ragnarok_The_New_World/
   (écrit dans index.html, sans paramètre ajouté).
   ========================================================= */

// ---------- Lien Steam officiel ----------
// URL exacte imposée par le TAF. Elle est aussi écrite directement dans index.html
// (attribut href de chaque bouton), donc les boutons fonctionnent même sans JavaScript.
const STEAM_URL = "https://store.steampowered.com/app/4212480/Ragnarok_The_New_World/";
document.querySelectorAll("[data-cta]").forEach(link => { link.href = STEAM_URL; });

// ---------- Photos du jeu (cases de Game Features) ----------
// Si une image manque, la case garde son fond coloré avec l'icône.
document.querySelectorAll("img.game-photo").forEach(img => {
  const hide = () => img.remove();
  if (img.complete && img.naturalWidth === 0) hide();
  else img.addEventListener("error", hide);
});

// ---------- Bande-annonce ----------
// Option 1 (recommandée) : vidéo YouTube officielle.
//   Colle ici l'identifiant de la vidéo : pour https://www.youtube.com/watch?v=ABC123xyz
//   l'identifiant est ABC123xyz.
const TRAILER_YOUTUBE_ID = "aNtKBoxVNlg";
// Option 2 : ton propre fichier vidéo, placé dans assets/ sous ce nom (format .mp4).
const TRAILER_FILE = "assets/trailer.mp4";

const trailer = document.getElementById("trailer");
const trailerFrame = document.getElementById("trailerFrame");
if (TRAILER_YOUTUBE_ID.trim()) {
  const iframe = document.createElement("iframe");
  iframe.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(TRAILER_YOUTUBE_ID.trim());
  iframe.title = "Ragnarok: The New World — trailer";
  iframe.allow = "accelerometer; encrypted-media; gyroscope; picture-in-picture";
  iframe.allowFullscreen = true;
  iframe.loading = "lazy";
  trailerFrame.appendChild(iframe);
  trailer.hidden = false;
} else {
  const video = document.createElement("video");
  video.src = TRAILER_FILE;
  video.controls = true;
  video.preload = "metadata";
  video.playsInline = true;
  video.addEventListener("loadedmetadata", () => { trailer.hidden = false; });
  trailerFrame.appendChild(video); // reste caché si le fichier n'existe pas
}

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

// ---------- Fenêtre des événements ----------
const eventData = {
  legend: {
    title: "Legend Cup — Valkyrie's Trial Squad Arena × Odin's Valhalla Guild Battle",
    image: "assets/legend-cup.webp",
    description: "The first global Ragnarok tournament, with two formats: form a squad for the Squad Arena, or fight with your guild in the Guild Battle. Guilds and squads from Southeast Asia, Taiwan, Hong Kong and Macau compete for the title of world's strongest.",
    meta: ["Squad Arena Destiny Imprint: Aug 6 – Dec 11, 2026", "Matches from November 2026", "US$1.01M base prize pool + bonus rewards"],
    source: "https://gevents.gnjoy.hk/rocqb02/"
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

const dialog = document.getElementById("eventDialog");
const dialogImage = document.getElementById("dialogImage");
const dialogTitle = document.getElementById("dialogTitle");
const dialogDescription = document.getElementById("dialogDescription");

function openEvent(key) {
  const item = eventData[key];
  if (!item || !dialog) return;
  dialogImage.src = item.image;
  dialogImage.alt = item.title;
  dialogTitle.textContent = item.title;
  dialogDescription.textContent = item.description;
  const metaList = document.getElementById("dialogMeta");
  metaList.replaceChildren(...item.meta.map(text => {
    const li = document.createElement("li");
    li.textContent = "• " + text;
    return li;
  }));
  document.getElementById("dialogSource").href = item.source;
  if (typeof dialog.showModal === "function") dialog.showModal();
}
document.querySelectorAll("[data-event]").forEach(button => {
  button.addEventListener("click", () => openEvent(button.dataset.event));
});
if (dialog) {
  document.getElementById("dialogClose").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => {
    if (event.target === dialog) dialog.close(); // clic en dehors de la fenêtre
  });
}

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
// Envoie un événement « cta_click » avec la position du bouton (header, hero,
// before, journey, dialog) si un outil d'analyse est installé sur la page
// (Google Tag Manager / GA4 via dataLayer). Le lien lui-même n'est pas modifié.
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
