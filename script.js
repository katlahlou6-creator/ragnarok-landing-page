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
  { src: "assets/prontera.webp", caption: "In-game screenshot — welcome back to Prontera" },
  { src: "assets/key-art.webp", caption: "Official key art — Ragnarok: The New World" },
  { src: "assets/explore-poster.webp", caption: "Exploring the open world of Midgard" },
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
  button.className = "gallery-item";
  button.setAttribute("aria-label", "Open image: " + item.caption);
  const img = document.createElement("img");
  img.src = item.src.replace(/(prontera|legend-cup|halloween-nights|home-decor-contest)\.webp$/, "$1-640.webp");
  img.alt = item.caption;
  img.loading = "lazy";
  img.decoding = "async";
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
    image: "assets/explore-poster.webp",
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

// =========================================================
// SUIVI : Meta Pixel, paramètres de campagne (UTM) et événements
// Voir README, partie « Suivi Meta Pixel ».
// =========================================================

// 1) Colle ici le Pixel ID donné par Meta Events Manager (que des chiffres).
//    Tant qu'il est vide, aucun Pixel n'est chargé.
const META_PIXEL_ID = "";

// 2) Ajouter les UTM au lien Steam ?
//    false = lien Steam EXACT, sans paramètre (consigne du TAF : AFBooster attribue le lien).
//    true  = ajoute utm_source / utm_medium / utm_campaign / utm_content au lien Steam
//            (utile seulement pour la version GitHub Pages + Meta Ads, si le client l'accepte).
const ADD_UTM_TO_STEAM_LINK = false;

// --- Paramètres de campagne : lus dans l'adresse, gardés dans le navigateur ---
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "campaign", "adset", "ad"];
const TRACK_KEY = "ragnarok_tracking";
const store = {
  get() { try { return JSON.parse(localStorage.getItem(TRACK_KEY) || "{}"); } catch { return {}; } },
  set(v) { try { localStorage.setItem(TRACK_KEY, JSON.stringify(v)); } catch { /* navigation privée */ } }
};
const tracking = (() => {
  const params = new URLSearchParams(window.location.search);
  const saved = store.get();
  const current = {};
  UTM_KEYS.forEach(key => {
    const value = params.get(key);
    if (value) current[key] = value.slice(0, 100);
  });
  if (!current.utm_source && params.get("source")) current.utm_source = params.get("source").slice(0, 100);
  const result = {
    first: saved.first || (Object.keys(current).length ? current : null), // première source connue
    last: Object.keys(current).length ? current : (saved.last || null)    // dernière campagne connue
  };
  store.set(result);
  return result;
})();
const lastCampaign = tracking.last || {};
const trafficSource = lastCampaign.utm_source || "direct";

// --- Consentement (le Pixel ne se charge qu'après « Accept ») ---
const CONSENT_KEY = "ragnarok_consent";
const getConsent = () => { try { return localStorage.getItem(CONSENT_KEY); } catch { return null; } };
const setConsent = v => { try { localStorage.setItem(CONSENT_KEY, v); } catch { /* ignore */ } };

function loadMetaPixel() {
  if (!/^\d{6,20}$/.test(META_PIXEL_ID) || window.fbq) return;
  /* Code de base Meta Pixel */
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
  (window,document,"script","https://connect.facebook.net/en_US/fbevents.js");
  fbq("init", META_PIXEL_ID);
  fbq("track", "PageView");
}

const consentBar = document.getElementById("consentBar");
if (consentBar && META_PIXEL_ID) {
  const choice = getConsent();
  if (choice === "accepted") loadMetaPixel();
  else if (choice !== "refused") consentBar.hidden = false;
  consentBar.querySelector("[data-consent=accept]").addEventListener("click", () => {
    setConsent("accepted"); consentBar.hidden = true; loadMetaPixel();
  });
  consentBar.querySelector("[data-consent=refuse]").addEventListener("click", () => {
    setConsent("refused"); consentBar.hidden = true;
  });
}

// --- Envoi d'un événement (Meta Pixel si accepté + dataLayer si présent) ---
function trackEvent(name, data = {}, standard = false) {
  const payload = { traffic_source: trafficSource, campaign: lastCampaign.utm_campaign || "unknown", ...data };
  if (typeof window.fbq === "function") window.fbq(standard ? "track" : "trackCustom", name, payload);
  if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event: name, ...payload });
}

// --- Lien Steam : exact par défaut, UTM seulement si ADD_UTM_TO_STEAM_LINK = true ---
const steamLinks = document.querySelectorAll('a[href^="https://store.steampowered.com/app/4212480/"]');
if (ADD_UTM_TO_STEAM_LINK) {
  const url = new URL(STEAM_URL);
  url.searchParams.set("utm_source", trafficSource);
  url.searchParams.set("utm_medium", lastCampaign.utm_medium || "paid_social");
  url.searchParams.set("utm_campaign", lastCampaign.utm_campaign || "ragnarok_campaign");
  url.searchParams.set("utm_content", lastCampaign.utm_content || "landing_page");
  steamLinks.forEach(link => { link.href = url.toString(); });
}

// SteamOutboundClick : départ vers Steam (intention, PAS une inscription).
// On n'envoie jamais CompleteRegistration : Steam ne confirme pas l'inscription à la page.
steamLinks.forEach(link => {
  link.addEventListener("click", () => {
    trackEvent("SteamOutboundClick", {
      cta_position: link.dataset.cta || "other",
      device: window.matchMedia("(max-width: 900px)").matches ? "mobile" : "desktop"
    });
  });
});

// CTA_Click : les boutons « Play Free Now » du haut de page mènent à l'offre finale (#go2offer).
// Là, le grand bouton ouvre Steam. On ferme la fenêtre ouverte et on met le bouton final en valeur.
const steamButton = document.getElementById("steamButton");
document.querySelectorAll('a[href="#go2offer"]').forEach(link => {
  link.addEventListener("click", () => {
    trackEvent("CTA_Click", { cta_position: link.dataset.position || "nav" });
    const openDialog = link.closest("dialog");
    if (openDialog) openDialog.close();
    if (steamButton) {
      steamButton.classList.remove("highlight");
      void steamButton.offsetWidth; // relance l'animation
      steamButton.classList.add("highlight");
    }
  });
});

// ViewContent : la personne lance réellement la vidéo de gameplay (une seule fois par visite)
let gameplaySent = false;
document.querySelectorAll("[data-video], #trailerPlay").forEach(button => {
  button.addEventListener("click", () => {
    if (gameplaySent) return;
    gameplaySent = true;
    trackEvent("ViewContent", { content_name: "gameplay_video", content_type: "video" }, true);
  });
});

// --- Signaux d'intérêt pour l'algorithme (une seule fois par visite et par élément) ---
const sentOnce = new Set();
function trackOnce(key, name, data, standard = false) {
  if (sentOnce.has(key)) return;
  sentOnce.add(key);
  trackEvent(name, data, standard);
}

// SectionView : la personne a vraiment regardé une section (elle atteint le milieu de l'écran)
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      trackOnce("section_" + entry.target.id, "SectionView", { section: entry.target.id });
      sectionObserver.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -50% 0px" }); // la section atteint le milieu de l'écran
  ["relive", "explore", "community", "go2offer"].forEach(id => {
    const el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
  });
}

// EventDetailsView : ouverture du détail d'un événement
document.querySelectorAll("[data-event]").forEach(button => {
  button.addEventListener("click", () =>
    trackOnce("event_" + button.dataset.event, "EventDetailsView", { event_name: button.dataset.event }));
});

// GalleryView : ouverture d'une image de la galerie
if (galleryGrid) {
  galleryGrid.addEventListener("click", () => trackOnce("gallery", "GalleryView", {}));
}
