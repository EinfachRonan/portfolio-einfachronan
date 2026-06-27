const header = document.querySelector("[data-header]");
const filters = Array.from(document.querySelectorAll("[data-filter]"));
const tiles = Array.from(document.querySelectorAll("[data-category]"));
const lightboxButtons = Array.from(document.querySelectorAll("[data-lightbox]"));
const modal = document.querySelector("[data-lightbox-modal]");
const modalImage = document.querySelector("[data-lightbox-image]");
const modalClose = document.querySelector("[data-lightbox-close]");
const modalPrev = document.querySelector("[data-lightbox-prev]");
const modalNext = document.querySelector("[data-lightbox-next]");
const portfolioHero = document.querySelector("[data-portfolio-hero]");
const portfolioTitle = document.querySelector("[data-portfolio-title]");
const portfolioCopy = document.querySelector("[data-portfolio-copy]");
const portfolioHeroImage = document.querySelector("[data-portfolio-hero-image]");

const categories = {
  portrait: {
    title: "Portrait",
    copy: "Ruhige Portraits, klares Licht und natürliche Momente.",
    hero: "assets/photos/portrait-city-smile.webp",
    alt: "Portrait in der Stadt",
  },
  wedding: {
    title: "Hochzeit",
    copy: "Details, Menschen und echte Augenblicke vom Hochzeitstag.",
    hero: "assets/photos/wedding-blue-bouquet.webp",
    alt: "Hochzeitsdetail mit Ringen",
  },
  club: {
    title: "Club",
    copy: "Licht, Bewegung und Atmosphäre aus der Nacht.",
    hero: "assets/photos/club-dj-red-light.webp",
    alt: "DJ im Clublicht",
  },
  auto: {
    title: "Autos",
    copy: "Klare Linien, dunkle Stimmung und urbanes Licht.",
    hero: "assets/photos/automotive-audi-night.webp",
    alt: "Auto bei Nacht",
  },
  animal: {
    title: "Tiere",
    copy: "Natürliche Tierbilder mit Ruhe und Nähe.",
    hero: "assets/photos/animal-cats-window.webp",
    alt: "Katzen am Fenster",
  },
};

const hashAliases = {
  portraits: "portrait",
  portrait: "portrait",
  hochzeiten: "wedding",
  hochzeit: "wedding",
  club: "club",
  autos: "auto",
  auto: "auto",
  tiere: "animal",
};

let activeCategory = "portrait";
let activeItems = [];
let activeIndex = 0;

function updateHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 10);
}

function getInitialCategory() {
  const query = new URLSearchParams(window.location.search).get("filter");
  const hash = window.location.hash.replace("#", "");

  if (query && categories[query]) return query;
  if (hashAliases[hash]) return hashAliases[hash];
  return "portrait";
}

function syncHero(category) {
  const data = categories[category] ?? categories.portrait;
  if (portfolioHero) portfolioHero.dataset.category = category;
  if (portfolioTitle) portfolioTitle.textContent = data.title;
  if (portfolioCopy) portfolioCopy.textContent = data.copy;
  if (portfolioHeroImage) {
    portfolioHeroImage.src = data.hero;
    portfolioHeroImage.alt = data.alt;
  }
}

function refreshActiveItems() {
  activeItems = lightboxButtons
    .filter((button) => button.closest("[data-category]")?.dataset.category === activeCategory)
    .map((button) => {
      const image = button.querySelector("img");
      return {
        button,
        src: image?.getAttribute("src") ?? "",
        alt: image?.getAttribute("alt") ?? "",
      };
    });
}

function applyFilter(category, options = {}) {
  activeCategory = categories[category] ? category : "portrait";

  filters.forEach((filter) => {
    filter.classList.toggle("is-active", filter.dataset.filter === activeCategory);
  });

  tiles.forEach((tile) => {
    const isVisible = tile.dataset.category === activeCategory;
    tile.classList.toggle("is-hidden", !isVisible);
    tile.setAttribute("aria-hidden", String(!isVisible));
  });

  syncHero(activeCategory);
  refreshActiveItems();

  if (options.updateUrl) {
    const url = new URL(window.location.href);
    url.searchParams.set("filter", activeCategory);
    url.hash = "";
    window.history.replaceState({}, "", url);
  }

  if (options.scrollTop) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function openLightbox(index) {
  if (!modal || !modalImage || !activeItems[index]) return;
  activeIndex = index;
  modalImage.src = activeItems[activeIndex].src;
  modalImage.alt = activeItems[activeIndex].alt;
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
  const nextIndex = (activeIndex + direction + activeItems.length) % activeItems.length;
  openLightbox(nextIndex);
}

function setupReveal() {
  const revealItems = Array.from(document.querySelectorAll(".reveal"));

  revealItems.forEach((item, index) => {
    item.style.setProperty("--delay", `${Math.min((index % 8) * 55, 260)}ms`);
  });

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
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
    { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
  );

  revealItems.forEach((item) => observer.observe(item));
}

function setupTilt() {
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!canHover || reducedMotion) return;

  document.querySelectorAll(".tilt-card, .photo-tile button").forEach((item) => {
    item.addEventListener("pointermove", (event) => {
      const rect = item.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      item.style.setProperty("--tilt-x", `${(-y * 5).toFixed(2)}deg`);
      item.style.setProperty("--tilt-y", `${(x * 5).toFixed(2)}deg`);
    });

    item.addEventListener("pointerleave", () => {
      item.style.removeProperty("--tilt-x");
      item.style.removeProperty("--tilt-y");
    });
  });
}

window.history.scrollRestoration = "manual";
window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("load", () => {
  if (!window.location.hash || window.location.hash === "#start") {
    window.scrollTo(0, 0);
  }
});

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    applyFilter(filter.dataset.filter, { updateUrl: true, scrollTop: true });
  });
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

if (filters.length && tiles.length) {
  applyFilter(getInitialCategory());
}

updateHeader();
setupReveal();
setupTilt();
