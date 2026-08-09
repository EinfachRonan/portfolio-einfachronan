const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const categories = {
  portrait: {
    title: "Portrait",
    eyebrow: "Menschen",
    copy: "Ruhige Portraits mit klarem Licht und echter Nähe.",
    mood: "light",
    hero: "assets/photos/portrait-redhair-sun.webp",
    heroAlt: "Portrait im Sonnenlicht",
    heroPosition: "center 30%",
  },
  wedding: {
    title: "Hochzeit",
    eyebrow: "Reportage",
    copy: "Details und Gesten, die den Tag festhalten.",
    mood: "light",
    hero: "assets/photos/wedding-blue-bouquet.webp",
    heroAlt: "Hochzeitsdetail mit Ringen",
    heroPosition: "center 38%",
  },
  animal: {
    title: "Tiere",
    eyebrow: "Tiere",
    copy: "Geduldige Tierportraits im natürlichen Licht.",
    mood: "light",
    hero: "assets/photos/animal-cats-window.webp",
    heroAlt: "Katzen am Fenster",
    heroPosition: "center 40%",
  },
  club: {
    title: "Club",
    eyebrow: "Nightlife",
    copy: "Bewegung und Atmosphäre aus der Nacht.",
    mood: "dark",
    hero: "assets/photos/club-dj-red-light.webp",
    heroAlt: "DJ im Clublicht",
    heroPosition: "center 42%",
  },
  auto: {
    title: "Autos",
    eyebrow: "Automotive",
    copy: "Klare Linien und urbane Lichtstimmung.",
    mood: "dark",
    hero: "assets/photos/automotive-audi-night.webp",
    heroAlt: "Auto bei Nacht",
    heroPosition: "center 50%",
  },
};

const header = document.querySelector("[data-header]");
const portfolioOverview = document.querySelector("[data-portfolio-overview]");
const portfolioDetail = document.querySelector("[data-portfolio-detail]");
const categoryHeroImage = document.querySelector("[data-category-hero-image]");
const categoryEyebrow = document.querySelector("[data-category-eyebrow]");
const categoryTitle = document.querySelector("[data-category-title]");
const categoryCopy = document.querySelector("[data-category-copy]");
const filterLinks = Array.from(document.querySelectorAll("[data-filter-link]"));
const routeLinks = Array.from(document.querySelectorAll("[data-category-route]"));
const tiles = Array.from(document.querySelectorAll("[data-category]"));
const lightboxButtons = Array.from(document.querySelectorAll("[data-lightbox]"));
const modal = document.querySelector("[data-lightbox-modal]");
const modalImage = document.querySelector("[data-lightbox-image]");
const modalClose = document.querySelector("[data-lightbox-close]");
const modalPrev = document.querySelector("[data-lightbox-prev]");
const modalNext = document.querySelector("[data-lightbox-next]");

let activeCategory = null;
let activeItems = [];
let activeIndex = 0;

function updateHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

function setupReveal() {
  const items = Array.from(document.querySelectorAll(".reveal"));
  if (!items.length) return;

  if (!("IntersectionObserver" in window) || reduceMotion) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
  );

  items.forEach((item) => observer.observe(item));
}

function getInitialCategory() {
  const query = new URLSearchParams(window.location.search).get("filter");
  return query && categories[query] ? query : null;
}

function refreshActiveItems() {
  activeItems = lightboxButtons
    .filter((button) => {
      const tile = button.closest("[data-category]");
      return tile?.dataset.category === activeCategory && !tile.hasAttribute("hidden");
    })
    .map((button) => {
      const image = button.querySelector("img");
      return {
        button,
        src: image?.getAttribute("src") ?? "",
        alt: image?.getAttribute("alt") ?? "",
      };
    });
}

function applyFilter(category, { updateUrl = false, scrollTop = false } = {}) {
  if (!categories[category]) return;
  activeCategory = category;
  const data = categories[category];

  if (portfolioOverview) portfolioOverview.hidden = true;
  if (portfolioDetail) portfolioDetail.hidden = false;
  document.body.dataset.mood = data.mood;

  if (categoryHeroImage) {
    categoryHeroImage.src = data.hero;
    categoryHeroImage.alt = data.heroAlt;
    categoryHeroImage.closest(".category-hero")?.style.setProperty("--hero-pos", data.heroPosition);
  }
  if (categoryEyebrow) categoryEyebrow.textContent = data.eyebrow;
  if (categoryTitle) categoryTitle.textContent = data.title;
  if (categoryCopy) categoryCopy.textContent = data.copy;

  filterLinks.forEach((link) => {
    const isActive = link.dataset.filterLink === category;
    link.classList.toggle("is-active", isActive);
    if (isActive) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  tiles.forEach((tile) => {
    tile.toggleAttribute("hidden", tile.dataset.category !== category);
  });

  refreshActiveItems();

  if (updateUrl) {
    const url = new URL(window.location.href);
    url.searchParams.set("filter", category);
    window.history.pushState({ filter: category }, "", url);
  }

  if (scrollTop) window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

function showOverview({ updateUrl = false } = {}) {
  activeCategory = null;
  if (portfolioOverview) portfolioOverview.hidden = false;
  if (portfolioDetail) portfolioDetail.hidden = true;
  document.body.dataset.mood = "dark";

  filterLinks.forEach((link) => {
    link.classList.remove("is-active");
    link.removeAttribute("aria-current");
  });

  if (updateUrl) {
    const url = new URL(window.location.href);
    url.searchParams.delete("filter");
    window.history.pushState({}, "", url);
  }
}

function renderLightboxImage(index) {
  if (!modalImage || !activeItems[index]) return;
  modalImage.src = activeItems[index].src;
  modalImage.alt = activeItems[index].alt;
}

function openLightbox(index) {
  if (!modal || !activeItems[index]) return;
  activeIndex = index;
  renderLightboxImage(activeIndex);
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-locked");
  modalClose?.focus();
}

function closeLightbox() {
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-locked");
}

function stepLightbox(direction) {
  if (!activeItems.length) return;
  activeIndex = (activeIndex + direction + activeItems.length) % activeItems.length;
  renderLightboxImage(activeIndex);
}

if (portfolioOverview && portfolioDetail) {
  const initial = getInitialCategory();
  if (initial) applyFilter(initial);
  else showOverview();

  routeLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = link.dataset.categoryRoute || "";
      const match = target.match(/filter=([a-z]+)/);
      if (!match || !categories[match[1]]) return;
      event.preventDefault();
      applyFilter(match[1], { updateUrl: true, scrollTop: true });
    });
  });

  filterLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const category = link.dataset.filterLink;
      if (!categories[category]) return;
      event.preventDefault();
      applyFilter(category, { updateUrl: true, scrollTop: true });
    });
  });

  window.addEventListener("popstate", () => {
    const category = getInitialCategory();
    if (category) applyFilter(category);
    else showOverview();
  });

  lightboxButtons.forEach((button) => {
    button.addEventListener("click", () => {
      refreshActiveItems();
      const index = activeItems.findIndex((item) => item.button === button);
      openLightbox(Math.max(index, 0));
    });
  });

  modalClose?.addEventListener("click", closeLightbox);
  modalPrev?.addEventListener("click", () => stepLightbox(-1));
  modalNext?.addEventListener("click", () => stepLightbox(1));
  modal?.addEventListener("click", (event) => {
    if (event.target === modal) closeLightbox();
  });

  window.addEventListener("keydown", (event) => {
    if (!modal?.classList.contains("is-open")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") stepLightbox(-1);
    if (event.key === "ArrowRight") stepLightbox(1);
  });
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();
setupReveal();
