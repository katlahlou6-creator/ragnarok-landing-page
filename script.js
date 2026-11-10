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
  decor: {
    title: "Home Decor Contest",
    image: "assets/home-decor-contest.webp",
    description: "Decorate your home in Midgard and show it to the community. Become the crowd favorite!"
  },
  halloween: {
    title: "Halloween Nights — Two New Class Paths",
    image: "assets/halloween-nights.webp",
    description: "A seasonal update that brings two new class paths to explore."
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
