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
const categoryRouteLinks = Array.from(document.querySelectorAll("[data-category-route]"));
const heroSlides = Array.from(document.querySelectorAll(".hero-slide"));
const heroSection = document.querySelector(".hero-home");
const heroCta = document.querySelector(".hero-cta");
const ambientAudio = document.querySelector("[data-ambient-audio]");
const musicToggle = document.querySelector("[data-music-toggle]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const isTouch = window.matchMedia("(pointer: coarse)").matches;
const pageFadeDurationMs = reduceMotion ? 0 : 240;
const musicStorageKey = "einfachronan-music-enabled";
const musicTimeStorageKey = "einfachronan-music-time";

const categories = {
  portrait: {
    title: "Portrait",
    copy: "Ruhige Portraits, klares Licht und natürliche Momente.",
    hero: "assets/photos/portrait-city-smile.webp",
    alt: "Portrait in der Stadt",
    images: [
      { src: "assets/photos/portrait-city-smile.webp", alt: "Portrait in der Stadt" },
      { src: "assets/photos/portrait-urban-walk.webp", alt: "Portrait in der Stadt" },
      { src: "assets/photos/portrait-riverside-profile.webp", alt: "Profilportrait am Wasser" },
      { src: "assets/photos/portrait-white-shirt-outdoor.webp", alt: "Portrait draußen am Wasser" },
      { src: "assets/photos/portrait-cap-outdoor.webp", alt: "Portrait mit weißer Cap" },
      { src: "assets/photos/portrait-redhair-sun.webp", alt: "Rothaarige Frau im Sonnenlicht" },
      { src: "assets/photos/IMG_4214.JPG", alt: "Portrait mit Sonnenbrille im warmen Licht" },
      { src: "assets/photos/IMG_6190.JPG", alt: "Portrait mit Cap im Gegenlicht" },
      { src: "assets/photos/portrait-window-stripes.webp", alt: "Portrait vor hellem Fenster" },
      { src: "assets/photos/portrait-studio-beanie.webp", alt: "Studio Portrait mit Mütze" },
      { src: "assets/photos/portrait-blue-jacket-glasses.jpg", alt: "Portrait mit Brille" },
      { src: "assets/photos/IMG_4051.JPG", alt: "Portrait im Sessel mit ruhigem Licht" },
      { src: "assets/photos/IMG_7060.JPG", alt: "Portrait am Bahnhof bei kühlem Licht" },
      { src: "assets/photos/portrait-night-arcade.webp", alt: "Nachtportrait" },
      { src: "assets/photos/portrait-point-night.webp", alt: "Portrait bei Nacht" },
      { src: "assets/photos/portrait-leather-jacket-snow.webp", alt: "Portrait im Schnee" },
      { src: "assets/photos/IMG_8490.JPG", alt: "Nachtportrait im Schnee" },
      { src: "assets/photos/IMG_9603.JPG", alt: "Portrait auf dem Parkdeck bei Nacht" },
      { src: "assets/photos/IMG_9677.JPG", alt: "Stehendes Nachtportrait auf dem Parkdeck" },
      { src: "assets/photos/IMG_9686.JPG", alt: "Portrait vor dramatischem Nachthimmel" },
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
      { src: "assets/photos/wedding-table-flowers.webp", alt: "Blumen auf Hochzeitstisch" },
      { src: "assets/photos/wedding-table-detail.webp", alt: "Details auf Hochzeitstisch" },
      { src: "assets/photos/wedding-guest-toast.webp", alt: "Hochzeitsgast mit Glas" },
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
      { src: "assets/photos/IMG_5413.JPG", alt: "Nahaufnahme einer Katze mit aufmerksamem Blick" },
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
let musicReady = false;
let musicPositionReady = false;
let lastSavedMusicTime = 0;
let musicToggleUnlocked = !document.body.classList.contains("home-page");

function revealMusicToggle() {
  if (!musicToggle) return;
  if (musicToggleUnlocked) return;
  musicToggleUnlocked = true;
  musicToggle.hidden = false;
  window.requestAnimationFrame(() => {
    musicToggle.classList.add("is-visible");
  });
}

function updateMusicToggleVisibility() {
  if (!musicToggle) return;

  if (!document.body.classList.contains("home-page")) {
    musicToggleUnlocked = true;
    musicToggle.hidden = false;
    musicToggle.classList.add("is-visible");
    return;
  }

  if (musicToggleUnlocked) {
    musicToggle.hidden = false;
    musicToggle.classList.add("is-visible");
    return;
  }

  const hasScrolled = window.scrollY > 24;
  const reachedHeroCta =
    !!heroCta &&
    hasScrolled &&
    heroCta.getBoundingClientRect().top <= (window.innerHeight || 1) * 0.88;
  const leftHero =
    !!heroSection &&
    hasScrolled &&
    heroSection.getBoundingClientRect().bottom <= (window.innerHeight || 1) * 0.82;

  if (reachedHeroCta || leftHero) {
    revealMusicToggle();
    return;
  }

  musicToggle.classList.remove("is-visible");
  musicToggle.hidden = true;
}

function scrollPageTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

function navigateToRoute(route) {
  if (!route) return;
  persistMusicTime();
  window.location.assign(route);
}

function updateHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 36);
}

function setMusicButtonState(isPlaying) {
  if (!musicToggle) return;
  musicToggle.classList.toggle("is-playing", isPlaying);
  musicToggle.setAttribute("aria-pressed", String(isPlaying));
  musicToggle.setAttribute(
    "aria-label",
    isPlaying ? "Hintergrundmusik pausieren" : "Hintergrundmusik starten",
  );
  const label = musicToggle.querySelector(".music-toggle-label");
  if (label) label.textContent = isPlaying ? "Ambiente an" : "Ambiente aus";
}

function persistMusicState(isEnabled) {
  try {
    window.localStorage.setItem(musicStorageKey, isEnabled ? "on" : "off");
  } catch {}
}

function persistMusicTime(time = ambientAudio?.currentTime ?? 0, force = false) {
  if (!ambientAudio || !Number.isFinite(time)) return;

  const safeTime = Math.max(0, time);
  if (!force && Math.abs(safeTime - lastSavedMusicTime) < 0.35) return;

  lastSavedMusicTime = safeTime;

  try {
    const storedTime = safeTime.toFixed(3);
    window.localStorage.setItem(musicTimeStorageKey, storedTime);
    window.sessionStorage.setItem(musicTimeStorageKey, storedTime);
  } catch {}
}

function readMusicState() {
  try {
    return window.localStorage.getItem(musicStorageKey);
  } catch {
    return null;
  }
}

function readMusicTime() {
  try {
    const rawValue =
      window.localStorage.getItem(musicTimeStorageKey) ??
      window.sessionStorage.getItem(musicTimeStorageKey);
    const parsedValue = Number.parseFloat(rawValue ?? "");
    return Number.isFinite(parsedValue) && parsedValue >= 0 ? parsedValue : 0;
  } catch {
    return 0;
  }
}

function restoreMusicTime() {
  if (!ambientAudio || musicPositionReady) return;

  const savedTime = readMusicTime();
  if (!savedTime) {
    musicPositionReady = true;
    return;
  }

  const applySavedTime = () => {
    const maxTime =
      Number.isFinite(ambientAudio.duration) && ambientAudio.duration > 0
        ? Math.max(0, ambientAudio.duration - 0.25)
        : savedTime;
    ambientAudio.currentTime = Math.min(savedTime, maxTime);
    lastSavedMusicTime = ambientAudio.currentTime;
    musicPositionReady = true;
  };

  if (ambientAudio.readyState >= 1) {
    applySavedTime();
    return;
  }

  ambientAudio.addEventListener("loadedmetadata", applySavedTime, { once: true });
}

async function tryPlayAmbientAudio() {
  if (!ambientAudio) return false;
  try {
    await ambientAudio.play();
    setMusicButtonState(true);
    persistMusicState(true);
    return true;
  } catch {
    setMusicButtonState(false);
    return false;
  }
}

function setupAmbientAudio() {
  if (!ambientAudio || !musicToggle || musicReady) return;
  musicReady = true;
  ambientAudio.volume = 0.3;
  ambientAudio.loop = true;
  restoreMusicTime();

  const savedState = readMusicState();
  const shouldAutoplay = savedState !== "off";
  setMusicButtonState(false);
  updateMusicToggleVisibility();

  let interactionResumeBound = false;
  const bindInteractionResume = () => {
    if (interactionResumeBound || !shouldAutoplay) return;
    interactionResumeBound = true;

    const resumePlayback = async () => {
      if (!ambientAudio.paused || readMusicState() === "off") return;
      restoreMusicTime();
      const started = await tryPlayAmbientAudio();
      if (started) {
        document.removeEventListener("pointerdown", resumePlayback, true);
        document.removeEventListener("keydown", resumePlayback, true);
        document.removeEventListener("touchstart", resumePlayback, true);
      }
    };

    document.addEventListener("pointerdown", resumePlayback, true);
    document.addEventListener("keydown", resumePlayback, true);
    document.addEventListener("touchstart", resumePlayback, true);
  };

  if (shouldAutoplay) {
    window.requestAnimationFrame(() => {
      void tryPlayAmbientAudio().then((started) => {
        if (!started) bindInteractionResume();
      });
    });
  }

  musicToggle.addEventListener("click", async () => {
    if (ambientAudio.paused) {
      restoreMusicTime();
      const started = await tryPlayAmbientAudio();
      if (!started) setMusicButtonState(false);
      return;
    }

    persistMusicTime(undefined, true);
    ambientAudio.pause();
    persistMusicState(false);
    setMusicButtonState(false);
  });

  ambientAudio.addEventListener("play", () => {
    persistMusicState(true);
    persistMusicTime(undefined, true);
    setMusicButtonState(true);
  });
  ambientAudio.addEventListener("pause", () => {
    persistMusicTime(undefined, true);
    persistMusicState(false);
    setMusicButtonState(false);
  });
  ambientAudio.addEventListener("timeupdate", () => persistMusicTime());
  ambientAudio.addEventListener("seeked", () => persistMusicTime(undefined, true));
  ambientAudio.addEventListener("ended", () => persistMusicTime(0, true));

  window.addEventListener("pagehide", () => persistMusicTime(undefined, true), { passive: true });
  window.addEventListener("beforeunload", () => persistMusicTime(undefined, true));
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") persistMusicTime(undefined, true);
  });
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
  updateMusicToggleVisibility();
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
      categories.wedding.images[0],
      categories.animal.images[0],
      categories.portrait.images[9],
    ].filter(Boolean);
  }

  const ordered = [
    categories.auto.images[0],
    categories.animal.images[0],
    categories.animal.images[3],
    categories.portrait.images[0],
    categories.portrait.images[15],
    categories.portrait.images[19],
    categories.club.images[1],
    categories.wedding.images[0],
    categories.portrait.images[9],
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
  }, 7000);
}

function setupPortfolioRouting() {
  if (!portfolioSpotlights.length) return;

  portfolioSpotlights.forEach((spotlight) => {
    const target = spotlight.dataset.categoryRoute;
    if (!target) return;

    spotlight.addEventListener("click", (event) => {
      if (event.target.closest("a, button")) return;
      navigateToRoute(target);
    });

    spotlight.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      navigateToRoute(target);
    });
  });
}

function setupCategoryRoutes() {
  if (!categoryRouteLinks.length) return;

  categoryRouteLinks.forEach((link) => {
    const target = link.dataset.categoryRoute || link.getAttribute("href");
    if (!target) return;

    link.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      navigateToRoute(target);
    });
  });
}

function setupPageFade() {
  document.body.classList.add("is-page-ready");

  document.querySelectorAll("a[href]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      if (link.dataset.categoryRoute) return;
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
      persistMusicTime();
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
  updateMusicToggleVisibility();
  updateParallax();
  setupRandomCategoryImages();
  setupRandomPortfolioSpotlights();
  setupHeroSlideshow();
  setupPortfolioRouting();
  setupCategoryRoutes();
  setupAmbientAudio();
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
updateMusicToggleVisibility();
setupReveal();
setupTilt();
updateParallax();
setupPageFade();
