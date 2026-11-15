/* =========================================================
   Ragnarok: The New World — Landing page (Groupe 106 V2)
   Interactions : vidéo de gameplay, galerie, fenêtres,
   apparition au défilement, suivi Meta (Pixel, UTM, événements).
   Tous les boutons « Download free on Steam » ouvrent directement
   https://store.steampowered.com/app/4212480/Ragnarok_The_New_World/
   (écrit dans index.html, sans paramètre ajouté).
   ========================================================= */

// ---------- Lien Steam officiel ----------
const STEAM_URL = "https://store.steampowered.com/app/4212480/Ragnarok_The_New_World/";
document.querySelectorAll("[data-cta]").forEach(link => { link.href = STEAM_URL; });

// ---------- Vidéo YouTube : colle ici l'identifiant (ce qui suit « v= ») ----------
const VIDEO_ID = "kjUtno9wKP8"; // « Ragnarok: The New World PC Gameplay & Trailer »
const ytUrl = id => "https://www.youtube-nocookie.com/embed/" + id + "?rel=0&playsinline=1&autoplay=1";
function makeIframe(){const f=document.createElement('iframe');f.src=ytUrl(VIDEO_ID);f.title="Ragnarok: The New World — PC gameplay";f.allow="autoplay; encrypted-media; picture-in-picture; fullscreen";f.allowFullscreen=true;f.referrerPolicy="strict-origin-when-cross-origin";return f;}
// Lien de secours vers YouTube (si la lecture intégrée est bloquée)
document.querySelectorAll("[data-yt-link]").forEach(a=>{a.href="https://www.youtube.com/watch?v="+VIDEO_ID;});

// Miniature YouTube (sinon on garde l'image locale)
const thumb=document.getElementById('gameThumb');
const t=new Image();t.onload=()=>{if(t.naturalWidth>120)thumb.src=t.src;};t.src="https://i.ytimg.com/vi/"+VIDEO_ID+"/hqdefault.jpg";

// Lecture dans le cadre (façade : la vidéo ne se charge qu'au clic)
const frame=document.getElementById('gameFrame');
document.getElementById('watchFrame').addEventListener('click',()=>{frame.querySelector('.inner').appendChild(makeIframe());frame.classList.add('playing');});

// ---------- Fenêtres ----------
const videoModal=document.getElementById('videoModal'),videoWrap=document.getElementById('videoWrap'),lightbox=document.getElementById('lightbox');
function openModal(m){m.classList.add('open');document.body.style.overflow='hidden';}
function closeModals(){document.querySelectorAll('.modal.open').forEach(m=>m.classList.remove('open'));videoWrap.replaceChildren();document.body.style.overflow='';}
document.getElementById('watchHero').addEventListener('click',()=>{videoWrap.replaceChildren(makeIframe());openModal(videoModal);});
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',closeModals));
document.querySelectorAll('.modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)closeModals();}));

// ---------- Galerie : ajoute une ligne pour chaque nouvelle image de assets/ ----------
const GALLERY=[
  {src:"assets/key-art.webp",cap:"Official key art — Ragnarok: The New World"},
  {src:"assets/explore-poster.webp",cap:"Exploring the open world of Midgard"},
  {src:"assets/legend-cup.webp",cap:"Legend Cup — Squad Arena × Guild Battle"},
  {src:"assets/halloween-nights.webp",cap:"Halloween Nights — Sage and Rogue arrive"},
  {src:"assets/home-decor-contest.webp",cap:"Home Decor Contest — decorate your own home"}
];
const gal=document.getElementById('gallery');let cur=0;
GALLERY.forEach((g,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label','View: '+g.cap);
  const im=document.createElement('img');im.src=g.src.replace(/(legend-cup|halloween-nights|home-decor-contest)\.webp$/,'$1-640.webp');im.alt=g.cap;im.loading='lazy';
  im.addEventListener('error',()=>b.remove());b.appendChild(im);b.addEventListener('click',()=>show(i));gal.appendChild(b);});
const lbImg=document.getElementById('lbImg'),lbCap=document.getElementById('lbCap');
function show(i){cur=(i+GALLERY.length)%GALLERY.length;lbImg.src=GALLERY[cur].src;lbImg.alt=GALLERY[cur].cap;lbCap.textContent=GALLERY[cur].cap;if(!lightbox.classList.contains('open'))openModal(lightbox);}
document.getElementById('lbPrev').addEventListener('click',()=>show(cur-1));
document.getElementById('lbNext').addEventListener('click',()=>show(cur+1));
let x0=null;lightbox.addEventListener('touchstart',e=>{x0=e.touches[0].clientX;},{passive:true});
lightbox.addEventListener('touchend',e=>{if(x0===null)return;const dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>40)show(cur+(dx<0?1:-1));x0=null;});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape')closeModals();
  if(lightbox.classList.contains('open')){if(e.key==='ArrowRight')show(cur+1);if(e.key==='ArrowLeft')show(cur-1);}
});

// ---------- Apparition au défilement ----------
const reveals=document.querySelectorAll('.reveal');
if('IntersectionObserver' in window){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}}),{threshold:.12});
  reveals.forEach(r=>io.observe(r));
}else reveals.forEach(r=>r.classList.add('visible'));

// =========================================================
// SUIVI : Meta Pixel, paramètres de campagne (UTM) et événements
// =========================================================

// 1) Colle ici le Pixel ID donné par Meta Events Manager (que des chiffres).
//    Tant qu'il est vide, aucun Pixel n'est chargé et le bandeau reste caché.
const META_PIXEL_ID = "";

// 2) Ajouter les UTM au lien Steam ?
//    false = lien Steam EXACT, sans paramètre (consigne du TAF : AFBooster attribue le lien).
//    true  = ajoute les UTM au lien Steam (seulement si le client l'accepte).
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
  UTM_KEYS.forEach(key => { const value = params.get(key); if (value) current[key] = value.slice(0, 100); });
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
  consentBar.querySelector("[data-consent=accept]").addEventListener("click", () => { setConsent("accepted"); consentBar.hidden = true; loadMetaPixel(); });
  consentBar.querySelector("[data-consent=refuse]").addEventListener("click", () => { setConsent("refused"); consentBar.hidden = true; });
}

// --- Envoi d'un événement (Meta Pixel si accepté + dataLayer si présent) ---
function trackEvent(name, data = {}, standard = false) {
  const payload = { traffic_source: trafficSource, campaign: lastCampaign.utm_campaign || "unknown", ...data };
  if (typeof window.fbq === "function") window.fbq(standard ? "track" : "trackCustom", name, payload);
  if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event: name, ...payload });
}
const sentOnce = new Set();
function trackOnce(key, name, data, standard = false) {
  if (sentOnce.has(key)) return;
  sentOnce.add(key);
  trackEvent(name, data, standard);
}

// --- Lien Steam : exact par défaut, UTM seulement si ADD_UTM_TO_STEAM_LINK = true ---
const steamLinks = document.querySelectorAll("[data-cta]");
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

// CTA_Click : un lien interne vers #go2offer (s'il y en a) met le grand bouton en valeur.
const steamButton = document.getElementById("steamButton");
document.querySelectorAll('a[href="#go2offer"]').forEach(link => {
  link.addEventListener("click", () => {
    trackEvent("CTA_Click", { cta_position: link.dataset.position || "nav" });
    closeModals();
    if (steamButton) { steamButton.classList.remove("highlight"); void steamButton.offsetWidth; steamButton.classList.add("highlight"); }
  });
});

// ViewContent : la personne lance réellement la vidéo de gameplay (une seule fois par visite)
["watchHero", "watchFrame"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener("click", () => trackOnce("video", "ViewContent", { content_name: "gameplay_video", content_type: "video" }, true));
});

// GalleryView : ouverture d'une image de la galerie
gal.addEventListener("click", e => { if (e.target.closest("button")) trackOnce("gallery", "GalleryView", {}); });

// SectionView : la section atteint le milieu de l'écran (une fois par section)
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      trackOnce("section_" + entry.target.id, "SectionView", { section: entry.target.id });
      sectionObserver.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -50% 0px" });
  ["gameplay", "explore", "community", "go2offer"].forEach(id => {
    const el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
  });
}
