const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const filters = Array.from(document.querySelectorAll("[data-filter]"));
const tiles = Array.from(document.querySelectorAll("[data-category]"));
const modal = document.querySelector("[data-lightbox-modal]");
const modalImage = document.querySelector("[data-lightbox-image]");
const modalCaption = document.querySelector("[data-lightbox-caption]");
const modalClose = document.querySelector("[data-lightbox-close]");
const modalPrev = document.querySelector("[data-lightbox-prev]");
const modalNext = document.querySelector("[data-lightbox-next]");
const lightboxButtons = Array.from(document.querySelectorAll("[data-lightbox]"));
const slider = document.querySelector("[data-slider]");
const sliderPrev = document.querySelector("[data-slider-prev]");
const sliderNext = document.querySelector("[data-slider-next]");
const sliderProgress = document.querySelector("[data-slider-progress]");
const portfolioTitle = document.querySelector("[data-portfolio-title]");
const portfolioCopy = document.querySelector("[data-portfolio-copy]");
const portfolioHeroImage = document.querySelector("[data-portfolio-hero-image]");
const portfolioHero = document.querySelector(".portfolio-hero-feature");
const hashFilterMap = {
  club: "club",
  portraits: "portrait",
  portrait: "portrait",
  hochzeiten: "wedding",
  hochzeit: "wedding",
  autos: "auto",
  auto: "auto",
  tiere: "animal",
};
const validFilters = new Set(["club", "portrait", "wedding", "auto", "animal"]);
const filterTitleMap = {
  club: "Club",
  portrait: "Portrait",
  wedding: "Hochzeit",
  auto: "Autos",
  animal: "Tiere",
};
const filterCopyMap = {
  club: "Clubfotos mit Licht, Bewegung und Atmosphäre.",
  portrait: "Ruhige Portraits, klare Ausschnitte und echtes Licht.",
  wedding: "Details, Menschen und Momente vom Hochzeitstag.",
  auto: "Autos bei Nacht, urbanes Licht und klare Linien.",
  animal: "Tierbilder nah, ruhig und natürlich.",
};
const filterHeroMap = {
  club: {
    src: "assets/photos/club-dj-console.webp",
    alt: "DJ am Mischpult",
  },
  portrait: {
    src: "assets/photos/portrait-city-smile.webp",
    alt: "Lächelndes Portrait auf einer Straße",
  },
  wedding: {
    src: "assets/photos/wedding-blue-bouquet.webp",
    alt: "Hände mit Eheringen auf blauweißem Brautstrauß",
  },
  auto: {
    src: "assets/photos/automotive-audi-night.webp",
    alt: "Audi bei Nacht unter Tankstellenlicht",
  },
  animal: {
    src: "assets/photos/animal-cats-window.webp",
    alt: "Zwei Katzen auf einem Fensterplatz",
  },
};

let activeIndex = 0;
let activeGalleryItems = [];
document.body.classList.add("js-ready");

const galleryItems = lightboxButtons.map((button) => {
  const image = button.querySelector("img");
  if (image) {
    button.style.backgroundImage = `url("${image.getAttribute("src")}")`;
  }

  return {
    button,
    category: button.closest("[data-category]")?.dataset.category,
    src: image.getAttribute("src"),
    alt: image.getAttribute("alt"),
  };
});

function getActiveFilter() {
  const activeFilter = filters.find((button) => button.classList.contains("is-active"));
  return activeFilter?.dataset.filter ?? "portrait";
}

function refreshActiveGalleryItems(selected = getActiveFilter()) {
  activeGalleryItems = galleryItems.filter((item) => item.category === selected);
}

function setPageAtmosphere() {
  const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  const progress = Math.min(window.scrollY / maxScroll, 1);

  header.classList.toggle("is-scrolled", window.scrollY > 24);
  document.documentElement.style.setProperty("--bg-wash", progress.toFixed(3));
}

function closeMenu() {
  header.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
}

function openLightbox(index) {
  if (!activeGalleryItems.length) refreshActiveGalleryItems();
  if (!modal || !modalImage || !modalCaption || !modalClose || !activeGalleryItems[index]) return;

  activeIndex = index;
  const item = activeGalleryItems[activeIndex];
  modalImage.src = item.src;
  modalImage.alt = item.alt;
  modalCaption.textContent = "";
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-locked");
  modalClose.focus();
}

function closeLightbox() {
  if (!modal) return;

  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-locked");
}

function stepLightbox(direction) {
  if (!activeGalleryItems.length) refreshActiveGalleryItems();
  if (!activeGalleryItems.length) return;

  activeIndex = (activeIndex + direction + activeGalleryItems.length) % activeGalleryItems.length;
  openLightbox(activeIndex);
}

function updateSliderProgress() {
  if (!slider || !sliderProgress) return;

  const maxScroll = Math.max(slider.scrollWidth - slider.clientWidth, 1);
  const progress = Math.min(slider.scrollLeft / maxScroll, 1);
  const visibleShare = Math.min(slider.clientWidth / slider.scrollWidth, 1);

  const progressWidth = Math.max(visibleShare * 100, 18);
  sliderProgress.style.width = `${progressWidth}%`;
  sliderProgress.style.left = `${progress * (100 - progressWidth)}%`;
}

function setupPortfolioSlider() {
  if (!slider || !sliderPrev || !sliderNext) return;

  const stepSlider = (direction) => {
    slider.scrollBy({
      left: direction * Math.max(slider.clientWidth * 0.82, 280),
      behavior: "smooth",
    });
  };

  sliderPrev.addEventListener("click", () => stepSlider(-1));
  sliderNext.addEventListener("click", () => stepSlider(1));
  slider.addEventListener("scroll", updateSliderProgress, { passive: true });
  window.addEventListener("resize", updateSliderProgress);
  updateSliderProgress();
}

function setupRevealAnimation() {
  const revealGroups = [
    ".hero",
    ".hero-brand",
    ".hero-copy",
    ".hero-feature",
    ".slider-head",
    ".hero-strip figure",
    ".portfolio-hero",
    ".home-category",
    ".section-heading",
    ".feature-story",
    ".preview-card",
    ".photo-tile",
    ".service",
    ".contact > *",
  ];
  const revealItems = Array.from(document.querySelectorAll(revealGroups.join(",")));

  revealItems.forEach((item, index) => {
    item.classList.add("reveal");
    item.style.setProperty("--reveal-delay", `${Math.min((index % 8) * 45, 260)}ms`);
  });

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const revealVisibleItems = () => {
    revealItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.94 && rect.bottom > 0) {
        item.classList.add("is-visible");
      }
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.12,
    },
  );

  revealItems.forEach((item) => observer.observe(item));
  requestAnimationFrame(revealVisibleItems);
  window.addEventListener("load", () => requestAnimationFrame(revealVisibleItems));
  window.setTimeout(revealVisibleItems, 350);
  window.addEventListener("hashchange", () => requestAnimationFrame(revealVisibleItems));
}

function applyGalleryFilter(selected = "portrait") {
  filters.forEach((button) => button.classList.toggle("is-active", button.dataset.filter === selected));
  if (portfolioTitle) {
    portfolioTitle.textContent = filterTitleMap[selected] ?? filterTitleMap.portrait;
  }
  if (portfolioCopy) {
    portfolioCopy.textContent = filterCopyMap[selected] ?? filterCopyMap.portrait;
  }
  if (portfolioHeroImage && filterHeroMap[selected]) {
    portfolioHeroImage.src = filterHeroMap[selected].src;
    portfolioHeroImage.alt = filterHeroMap[selected].alt;
  }
  if (portfolioHero) {
    portfolioHero.dataset.category = selected;
  }
  tiles.forEach((tile) => {
    tile.classList.toggle("is-hidden", tile.dataset.category !== selected);
  });
  refreshActiveGalleryItems(selected);
}

function applyFilterFromLocation() {
  if (!filters.length || !tiles.length) return;

  const queryFilter = new URLSearchParams(window.location.search).get("filter");
  const hash = window.location.hash.replace("#", "");
  const selected = validFilters.has(queryFilter) ? queryFilter : hashFilterMap[hash] ?? "portrait";

  applyGalleryFilter(selected);
}

window.addEventListener("scroll", setPageAtmosphere, { passive: true });
setupPortfolioSlider();
setupRevealAnimation();
setPageAtmosphere();

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

if (nav) {
  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      closeMenu();
    }
  });
}

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    applyGalleryFilter(filter.dataset.filter);
    const url = new URL(window.location.href);
    const selected = filter.dataset.filter;
    url.searchParams.set("filter", selected);
    url.hash = "portfolio";
    window.history.replaceState({}, "", url);
  });
});

window.addEventListener("hashchange", applyFilterFromLocation);
applyFilterFromLocation();

lightboxButtons.forEach((button) => {
  button.addEventListener("click", () => {
    refreshActiveGalleryItems();
    const index = activeGalleryItems.findIndex((item) => item.button === button);
    openLightbox(Math.max(index, 0));
  });
});

modalClose?.addEventListener("click", closeLightbox);
modalPrev?.addEventListener("click", () => stepLightbox(-1));
modalNext?.addEventListener("click", () => stepLightbox(1));

modal?.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeLightbox();
  }
});

window.addEventListener("keydown", (event) => {
  if (!modal?.classList.contains("is-open")) return;

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") stepLightbox(-1);
  if (event.key === "ArrowRight") stepLightbox(1);
});
