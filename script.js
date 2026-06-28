const header = document.querySelector("[data-header]");
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
const categoryCards = Array.from(document.querySelectorAll("[data-category-card]"));
const portfolioSpotlights = Array.from(document.querySelectorAll("[data-spotlight]"));
const heroSlides = Array.from(document.querySelectorAll(".hero-slide"));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const isTouch = window.matchMedia("(pointer: coarse)").matches;
const pageFadeDurationMs = reduceMotion ? 0 : 240;

const categories = {
  portrait: {
    title: "Portrait",
    copy: "Ruhige Portraits, klares Licht und natürliche Momente.",
    hero: "assets/photos/portrait-city-smile.webp",
    alt: "Portrait in der Stadt",
    images: [
      { src: "assets/photos/portrait-city-smile.webp", alt: "Portrait in der Stadt" },
      { src: "assets/photos/portrait-redhair-sun.webp", alt: "Rothaarige Frau im Sonnenlicht" },
      { src: "assets/photos/portrait-riverside-profile.webp", alt: "Profilportrait am Wasser" },
      { src: "assets/photos/portrait-white-shirt-outdoor.webp", alt: "Portrait draußen am Wasser" },
      { src: "assets/photos/portrait-window-stripes.webp", alt: "Portrait vor hellem Fenster" },
      { src: "assets/photos/portrait-studio-beanie.webp", alt: "Studio Portrait mit Mütze" },
      { src: "assets/photos/portrait-blue-jacket-glasses.jpg", alt: "Portrait mit Brille" },
      { src: "assets/photos/portrait-cap-outdoor.webp", alt: "Portrait mit weißer Cap" },
      { src: "assets/photos/portrait-night-arcade.webp", alt: "Nachtportrait" },
      { src: "assets/photos/portrait-urban-walk.webp", alt: "Portrait in der Stadt" },
      { src: "assets/photos/portrait-point-night.webp", alt: "Portrait bei Nacht" },
      { src: "assets/photos/portrait-leather-jacket-snow.webp", alt: "Portrait im Schnee" },
    ],
  },
  wedding: {
    title: "Hochzeit",
    copy: "Details, Menschen und echte Augenblicke vom Hochzeitstag.",
    hero: "assets/photos/wedding-blue-bouquet.webp",
    alt: "Hochzeitsdetail mit Ringen",
    images: [
      { src: "assets/photos/wedding-blue-bouquet.webp", alt: "Hände mit Eheringen auf Brautstrauß" },
      { src: "assets/photos/wedding-red-bouquet.webp", alt: "Hochzeitsringe und Brautstrauß" },
      { src: "assets/photos/wedding-guest-toast.webp", alt: "Hochzeitsgast mit Glas" },
      { src: "assets/photos/wedding-table-flowers.webp", alt: "Blumen auf Hochzeitstisch" },
      { src: "assets/photos/wedding-table-detail.webp", alt: "Details auf Hochzeitstisch" },
    ],
  },
  club: {
    title: "Club",
    copy: "Licht, Bewegung und Atmosphäre aus der Nacht.",
    hero: "assets/photos/club-dj-red-light.webp",
    alt: "DJ im Clublicht",
    images: [
      { src: "assets/photos/club-dj-profile-dark.webp", alt: "DJ im dunklen Raum" },
      { src: "assets/photos/club-dj-red-light.webp", alt: "DJ am Mischpult mit rotem Licht" },
      { src: "assets/photos/club-dj-console.webp", alt: "DJ am Mischpult" },
    ],
  },
  auto: {
    title: "Autos",
    copy: "Klare Linien, dunkle Stimmung und urbanes Licht.",
    hero: "assets/photos/automotive-audi-night.webp",
    alt: "Auto bei Nacht",
    images: [{ src: "assets/photos/automotive-audi-night.webp", alt: "Audi bei Nacht" }],
  },
  animal: {
    title: "Tiere",
    copy: "Natürliche Tierbilder mit Ruhe und Nähe.",
    hero: "assets/photos/animal-cats-window.webp",
    alt: "Katzen am Fenster",
    images: [
      { src: "assets/photos/animal-cats-window.webp", alt: "Zwei Katzen am Fenster" },
      { src: "assets/photos/animal-cat-close.webp", alt: "Katze leckt ihre Pfote" },
      { src: "assets/photos/animal-dog-grass.webp", alt: "Hund auf einer Wiese" },
    ],
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
let heroSlideTimer = null;

function scrollPageTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

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
  portfolioOverview.toggleAttribute("hidden", hasCategory);
  portfolioDetail.toggleAttribute("hidden", !hasCategory);
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
    if (isActive) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
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
    scrollPageTop();
    window.requestAnimationFrame(scrollPageTop);
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

function shuffle(list) {
  const clone = [...list];
  for (let index = clone.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [clone[index], clone[randomIndex]] = [clone[randomIndex], clone[index]];
  }
  return clone;
}

function setupRandomCategoryImages() {
  if (!categoryCards.length) return;

  categoryCards.forEach((card) => {
    const category = card.dataset.categoryCard;
    const image = card.querySelector("img");
    const pool = categories[category]?.images ?? [];
    if (!image || !pool.length) return;

    const selected = pool[Math.floor(Math.random() * pool.length)];
    image.src = selected.src;
    image.alt = selected.alt;
  });
}

function setupRandomPortfolioSpotlights() {
  if (!portfolioSpotlights.length) return;

  portfolioSpotlights.forEach((spotlight) => {
    const category = spotlight.dataset.spotlight;
    const image = spotlight.querySelector("img");
    const pool = categories[category]?.images ?? [];
    if (!image || !pool.length) return;

    const selected = pool[Math.floor(Math.random() * pool.length)];
    image.src = selected.src;
    image.alt = selected.alt;
  });
}

function getHeroSlideshowImages() {
  if (window.innerWidth <= 680) {
    return [
      categories.portrait.images[0],
      categories.portrait.images[1],
    ].filter(Boolean);
  }

  const ordered = [
    categories.auto.images[0],
    categories.animal.images[0],
    categories.club.images[0],
    categories.club.images[2],
    categories.auto.images[0],
    categories.animal.images[0],
  ].filter(Boolean);

  const deduped = ordered.filter((item, index, list) => {
    return list.findIndex((entry) => entry.src === item.src && entry.alt === item.alt) === index;
  });

  return deduped.slice(0, 6);
}

function setupHeroSlideshow() {
  if (heroSlides.length < 2) return;

  const slides = getHeroSlideshowImages();
  if (!slides.length) return;

  let activeSlideIndex = 0;
  let visibleLayer = 0;

  heroSlides.forEach((slide, index) => {
    const image = slides[index % slides.length];
    slide.src = image.src;
    slide.alt = image.alt;
    slide.classList.toggle("is-active", index === 0);
  });

  if (reduceMotion || slides.length < 2) return;

  heroSlideTimer = window.setInterval(() => {
    const nextLayer = visibleLayer === 0 ? 1 : 0;
    activeSlideIndex = (activeSlideIndex + 1) % slides.length;
    const nextImage = slides[activeSlideIndex];
    const nextSlide = heroSlides[nextLayer];
    const currentSlide = heroSlides[visibleLayer];

    nextSlide.src = nextImage.src;
    nextSlide.alt = nextImage.alt;
    nextSlide.classList.add("is-active");
    currentSlide.classList.remove("is-active");
    visibleLayer = nextLayer;
  }, 5200);
}

function setupPortfolioRouting() {
  if (!portfolioSpotlights.length) return;

  portfolioSpotlights.forEach((spotlight) => {
    const target = spotlight.dataset.categoryRoute;
    if (!target) return;

    spotlight.addEventListener("click", (event) => {
      if (event.target.closest("a, button")) return;
      window.location.href = target;
    });

    spotlight.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      window.location.href = target;
    });
  });
}

function setupPageFade() {
  document.body.classList.add("is-page-ready");

  document.querySelectorAll("a[href]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      if (link.target && link.target !== "_self") return;
      if (link.hasAttribute("download")) return;

      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin && url.protocol !== "file:") return;

      const currentBase = `${window.location.pathname}${window.location.search}`;
      const nextBase = `${url.pathname}${url.search}`;
      if (currentBase === nextBase && url.hash) return;

      if (transitionLocked) {
        event.preventDefault();
        return;
      }

      transitionLocked = true;
      event.preventDefault();
      document.body.classList.remove("is-page-ready");
      document.body.classList.add("is-page-leaving");

      window.setTimeout(() => {
        window.location.href = link.href;
      }, pageFadeDurationMs);
    });
  });
}

window.history.scrollRestoration = "manual";

window.addEventListener("pageshow", () => {
  document.body.classList.add("is-page-ready");
  document.body.classList.remove("is-page-leaving");
  if (getInitialCategory()) {
    scrollPageTop();
  }
});

window.addEventListener("load", () => {
  scrollPageTop();
  document.body.classList.add("is-page-ready");
  document.body.classList.remove("is-page-leaving");
  updateHeader();
  updateParallax();
  setupRandomCategoryImages();
  setupRandomPortfolioSpotlights();
  setupHeroSlideshow();
  setupPortfolioRouting();
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
  if (initialCategory) applyFilter(initialCategory, { scrollTop: true });
  else showPortfolioOverview();
} else if (tiles.length && portfolioOverview && portfolioDetail) {
  const initialCategory = getInitialCategory();
  if (initialCategory) applyFilter(initialCategory, { scrollTop: true });
  else showPortfolioOverview();
}

updateHeader();
setupReveal();
setupTilt();
updateParallax();
setupPageFade();
