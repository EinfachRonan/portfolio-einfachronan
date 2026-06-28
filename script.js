const header = document.querySelector("[data-header]");
const introScreen = document.querySelector(".intro-screen");
const filters = Array.from(document.querySelectorAll("[data-filter]"));
const tiles = Array.from(document.querySelectorAll("[data-category]"));
const lightboxButtons = Array.from(document.querySelectorAll("[data-lightbox]"));
const modal = document.querySelector("[data-lightbox-modal]");
const modalImage = document.querySelector("[data-lightbox-image]");
const modalClose = document.querySelector("[data-lightbox-close]");
const modalPrev = document.querySelector("[data-lightbox-prev]");
const modalNext = document.querySelector("[data-lightbox-next]");
const portfolioOverview = document.querySelector("[data-portfolio-overview]");
const portfolioDetail = document.querySelector("[data-portfolio-detail]");
const portfolioHero = document.querySelector("[data-portfolio-hero]");
const portfolioTitle = document.querySelector("[data-portfolio-title]");
const portfolioCopy = document.querySelector("[data-portfolio-copy]");
const portfolioHeroImage = document.querySelector("[data-portfolio-hero-image]");
const filterLinks = Array.from(document.querySelectorAll("[data-filter-link]"));
const parallaxMedia = Array.from(document.querySelectorAll("[data-parallax-media]"));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const isTouch = window.matchMedia("(pointer: coarse)").matches;
const introDurationMs = reduceMotion ? 650 : 2200;

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
let scrollTicking = false;
let transitionLocked = false;
let portfolioMode = "overview";

function updateHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 36);
}

function getInitialCategory() {
  const query = new URLSearchParams(window.location.search).get("filter");
  const hash = window.location.hash.replace("#", "");

  if (query && categories[query]) return query;
  if (hashAliases[hash]) return hashAliases[hash];
  return null;
}

function updatePortfolioMode(category) {
  if (!portfolioOverview || !portfolioDetail) return;

  const hasCategory = Boolean(category && categories[category]);
  portfolioMode = hasCategory ? "detail" : "overview";
  portfolioOverview.hidden = hasCategory;
  portfolioDetail.hidden = !hasCategory;
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
  updatePortfolioMode(activeCategory);

  filterLinks.forEach((link) => {
    const isActive = link.dataset.filterLink === activeCategory;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
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
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }
}

function showPortfolioOverview() {
  updatePortfolioMode(null);

  tiles.forEach((tile) => {
    tile.classList.add("is-hidden");
    tile.setAttribute("aria-hidden", "true");
  });

  filterLinks.forEach((link) => {
    link.classList.remove("is-active");
    link.removeAttribute("aria-current");
  });
}

function renderLightboxImage(index) {
  if (!modalImage || !activeItems[index]) return;
  modalImage.style.opacity = "0";
  modalImage.style.transform = "scale(0.985)";

  window.setTimeout(() => {
    modalImage.src = activeItems[index].src;
    modalImage.alt = activeItems[index].alt;
    modalImage.style.opacity = "1";
    modalImage.style.transform = "scale(1)";
  }, reduceMotion ? 0 : 90);
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

function setupReveal() {
  const revealItems = Array.from(document.querySelectorAll(".reveal"));

  revealItems.forEach((item, index) => {
    item.style.setProperty("--delay", `${Math.min((index % 7) * 70, 280)}ms`);
  });

  if (!("IntersectionObserver" in window) || reduceMotion) {
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
    { rootMargin: "0px 0px -10% 0px", threshold: 0.14 },
  );

  revealItems.forEach((item) => observer.observe(item));
}

function setupTilt() {
  if (!canHover || reduceMotion) return;

  document.querySelectorAll(".tilt-card, .photo-tile button").forEach((item) => {
    item.addEventListener("pointermove", (event) => {
      const rect = item.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      item.style.setProperty("--tilt-x", `${(-y * 4.2).toFixed(2)}deg`);
      item.style.setProperty("--tilt-y", `${(x * 4.8).toFixed(2)}deg`);
    });

    item.addEventListener("pointerleave", () => {
      item.style.removeProperty("--tilt-x");
      item.style.removeProperty("--tilt-y");
    });
  });
}

function updateParallax() {
  scrollTicking = false;
  if (reduceMotion || isTouch) return;

  const viewport = window.innerHeight || 1;
  parallaxMedia.forEach((block) => {
    const rect = block.getBoundingClientRect();
    const progress = (rect.top + rect.height * 0.5 - viewport * 0.5) / viewport;
    const shift = Math.max(Math.min(progress * -18, 18), -18);
    block.style.setProperty("--parallax-shift", `${shift}px`);
  });
}

function onScroll() {
  updateHeader();
  if (scrollTicking) return;
  scrollTicking = true;
  window.requestAnimationFrame(updateParallax);
}

function runIntro() {
  if (!introScreen) {
    document.body.classList.add("is-intro-complete");
    document.documentElement.style.scrollBehavior = "smooth";
    return;
  }

  introScreen.classList.remove("play");
  void introScreen.offsetWidth;
  introScreen.classList.add("play");
  document.body.classList.remove("is-intro-complete");
  document.body.classList.remove("is-transitioning");
  document.documentElement.style.scrollBehavior = "auto";
  document.documentElement.style.setProperty("--intro-duration", `${introDurationMs}ms`);
  window.setTimeout(() => {
    document.body.classList.add("is-intro-complete");
    updateParallax();
    window.setTimeout(() => {
      document.documentElement.style.scrollBehavior = "smooth";
    }, 500);
  }, introDurationMs);
}

function isInternalNavigation(link) {
  const href = link.getAttribute("href");
  if (!href || href.startsWith("#")) return false;
  if (link.target && link.target !== "_self") return false;
  if (link.hasAttribute("download")) return false;

  const url = new URL(href, window.location.href);
  if (url.protocol.startsWith("http")) {
    if (url.origin !== window.location.origin) return false;
  } else if (url.protocol === "file:") {
    if (window.location.protocol !== "file:") return false;
  } else {
    return false;
  }

  const currentBase = `${window.location.pathname}${window.location.search}`;
  const nextBase = `${url.pathname}${url.search}`;
  if (currentBase === nextBase && url.hash) return false;

  return true;
}

function setupPageTransitions() {
  document.querySelectorAll("a[href]").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (!isInternalNavigation(link)) return;
      if (transitionLocked) {
        event.preventDefault();
        return;
      }

      transitionLocked = true;
      event.preventDefault();
      document.body.classList.add("is-transitioning");
      document.body.classList.remove("is-intro-complete");
      if (introScreen) {
        introScreen.classList.remove("play");
        void introScreen.offsetWidth;
        introScreen.classList.add("play");
      }

      window.setTimeout(() => {
        window.location.href = link.href;
      }, Math.max(introDurationMs - 180, 420));
    });
  });
}

window.history.scrollRestoration = "manual";

window.addEventListener("load", () => {
  window.scrollTo(0, 0);
  runIntro();
  updateHeader();
  updateParallax();
});

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", updateParallax, { passive: true });

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
  const initialCategory = getInitialCategory();
  if (initialCategory) {
    applyFilter(initialCategory);
  } else {
    showPortfolioOverview();
  }
} else if (tiles.length && portfolioOverview && portfolioDetail) {
  const initialCategory = getInitialCategory();
  if (initialCategory) {
    applyFilter(initialCategory);
  } else {
    showPortfolioOverview();
  }
}

updateHeader();
setupReveal();
setupTilt();
updateParallax();
setupPageTransitions();
