const header = document.querySelector("[data-header]");
const tiles = Array.from(document.querySelectorAll("[data-category]"));
const lightboxButtons = Array.from(document.querySelectorAll("[data-lightbox]"));
const modal = document.querySelector("[data-lightbox-modal]");
const modalImage = document.querySelector("[data-lightbox-image]");
const modalClose = document.querySelector("[data-lightbox-close]");
const modalPrev = document.querySelector("[data-lightbox-prev]");
const modalNext = document.querySelector("[data-lightbox-next]");
const modalCounter = document.querySelector("[data-lightbox-counter]");
const portfolioOverview = document.querySelector("[data-portfolio-overview]");
const portfolioDetail = document.querySelector("[data-portfolio-detail]");
const portfolioTitle = document.querySelector("[data-portfolio-title]");
const portfolioCopy = document.querySelector("[data-portfolio-copy]");
const portfolioEyebrow = document.querySelector("[data-portfolio-eyebrow]");
const categoryCards = Array.from(document.querySelectorAll("[data-category-card]"));
const portfolioSpotlights = Array.from(document.querySelectorAll("[data-spotlight]"));
const ambientAudio = document.querySelector("[data-ambient-audio]");
const musicToggle = document.querySelector("[data-music-toggle]");
const introLoader = document.querySelector("[data-intro-loader]");
const heroSlides = Array.from(document.querySelectorAll(".hero-slide"));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const musicStorageKey = "einfachronan-music-enabled";
const musicTimeStorageKey = "einfachronan-music-time";

const categories = {
  portrait: {
    title: "Portrait",
    copy: "Ruhige Portraits, klares Licht und natürliche Momente.",
    eyebrow: "Menschen",
    images: [
      { src: "assets/photos/portrait-city-smile.webp", alt: "Portrait in der Stadt" },
      { src: "assets/photos/portrait-urban-walk.webp", alt: "Portrait in der Stadt" },
      { src: "assets/photos/portrait-riverside-profile.webp", alt: "Profilportrait am Wasser" },
      { src: "assets/photos/portrait-white-shirt-outdoor.webp", alt: "Portrait draußen am Wasser" },
      { src: "assets/photos/portrait-cap-outdoor.webp", alt: "Portrait mit weißer Cap" },
      { src: "assets/photos/portrait-redhair-sun.webp", alt: "Rothaarige Frau im Sonnenlicht" },
      { src: "assets/photos/portrait-sunglasses-warm.webp", alt: "Portrait mit Sonnenbrille im warmen Licht" },
      { src: "assets/photos/portrait-cap-backlight.webp", alt: "Portrait mit Cap im Gegenlicht" },
      { src: "assets/photos/portrait-rural-man-field.webp", alt: "Portrait auf dem Feld bei warmem Licht" },
      { src: "assets/photos/portrait-rural-man-field-close.webp", alt: "Portrait im Kornfeld" },
      { src: "assets/photos/portrait-rural-man-village.webp", alt: "Stehendes Portrait im Dorf" },
      { src: "assets/photos/portrait-rural-man-dog-road.webp", alt: "Portrait mit Hund auf einer Landstraße" },
      { src: "assets/photos/portrait-window-stripes.webp", alt: "Portrait vor hellem Fenster" },
      { src: "assets/photos/portrait-studio-beanie.webp", alt: "Studio Portrait mit Mütze" },
      { src: "assets/photos/portrait-blue-jacket-glasses.webp", alt: "Portrait mit Brille" },
      { src: "assets/photos/portrait-armchair-calm.webp", alt: "Portrait im Sessel mit ruhigem Licht" },
      { src: "assets/photos/portrait-station-cool.webp", alt: "Portrait am Bahnhof bei kühlem Licht" },
      { src: "assets/photos/portrait-night-arcade.webp", alt: "Nachtportrait" },
      { src: "assets/photos/portrait-point-night.webp", alt: "Portrait bei Nacht" },
      { src: "assets/photos/portrait-leather-jacket-snow.webp", alt: "Portrait im Schnee" },
      { src: "assets/photos/portrait-snow-night.webp", alt: "Nachtportrait im Schnee" },
      { src: "assets/photos/portrait-parkdeck-night.webp", alt: "Portrait auf dem Parkdeck bei Nacht" },
      { src: "assets/photos/portrait-parkdeck-standing.webp", alt: "Stehendes Nachtportrait auf dem Parkdeck" },
      { src: "assets/photos/portrait-nightsky-dramatic.webp", alt: "Portrait vor dramatischem Nachthimmel" },
    ],
  },
  wedding: {
    title: "Hochzeit",
    copy: "Details, Menschen und echte Augenblicke vom Hochzeitstag.",
    eyebrow: "Reportage",
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
    eyebrow: "Nightlife",
    images: [
      { src: "assets/photos/club-dj-profile-dark.webp", alt: "DJ im dunklen Raum" },
      { src: "assets/photos/club-dj-red-light.webp", alt: "DJ am Mischpult mit rotem Licht" },
      { src: "assets/photos/club-dj-console.webp", alt: "DJ am Mischpult" },
    ],
  },
  auto: {
    title: "Autos",
    copy: "Klare Linien, dunkle Stimmung und urbanes Licht.",
    eyebrow: "Automotive",
    images: [{ src: "assets/photos/automotive-audi-night.webp", alt: "Audi bei Nacht" }],
  },
  animal: {
    title: "Tiere",
    copy: "Natürliche Tierbilder mit Ruhe und Nähe.",
    eyebrow: "Tiere",
    images: [
      { src: "assets/photos/animal-cats-window.webp", alt: "Zwei Katzen am Fenster" },
      { src: "assets/photos/animal-cat-portrait-close.webp", alt: "Nahaufnahme einer Katze mit aufmerksamem Blick" },
      { src: "assets/photos/animal-cat-close.webp", alt: "Katze leckt ihre Pfote" },
      { src: "assets/photos/animal-dog-grass.webp", alt: "Hund auf einer Wiese" },
      { src: "assets/photos/animal-boxer-run-road.webp", alt: "Boxer läuft auf einer Landstraße" },
      { src: "assets/photos/animal-boxer-road-sit.webp", alt: "Boxer sitzt auf einer Landstraße" },
      { src: "assets/photos/animal-boxer-road-sit-2.webp", alt: "Boxer sitzt zentral auf einer Landstraße" },
      { src: "assets/photos/animal-boxer-close-1.webp", alt: "Nahes Boxerportrait im warmen Licht" },
      { src: "assets/photos/animal-boxer-close-2.webp", alt: "Boxer Nahaufnahme von oben" },
      { src: "assets/photos/animal-boxer-close-under.webp", alt: "Boxer Nahaufnahme zwischen den Beinen einer Person" },
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
let musicReady = false;
let musicPositionReady = false;
let lastSavedMusicTime = 0;
let musicToggleUnlocked = !document.body.classList.contains("home-page");

function revealMusicToggle() {
  if (!musicToggle || musicToggleUnlocked) return;
  musicToggleUnlocked = true;
  musicToggle.hidden = false;
  window.requestAnimationFrame(() => {
    musicToggle.classList.add("is-visible");
  });
}

function updateMusicToggleVisibility() {
  if (!musicToggle) return;

  if (!document.body.classList.contains("home-page") || musicToggleUnlocked) {
    musicToggleUnlocked = true;
    musicToggle.hidden = false;
    musicToggle.classList.add("is-visible");
    return;
  }

  if (window.scrollY > 48) {
    revealMusicToggle();
  }
}

function updateHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
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
  ambientAudio.playsInline = true;
  restoreMusicTime();

  setMusicButtonState(false);
  updateMusicToggleVisibility();

  // Kein Autoplay-Versuch: preload bleibt "none", die Audiodatei wird erst
  // geladen, wenn jemand aktiv den Ambiente-Button drueckt.
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
  window.addEventListener("pageshow", () => restoreMusicTime());
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
  if (portfolioEyebrow) portfolioEyebrow.textContent = data.eyebrow ?? "Kuratiert";
  if (portfolioTitle) portfolioTitle.textContent = data.title;
  if (portfolioCopy) portfolioCopy.textContent = data.copy;
}

function refreshActiveItems() {
  activeItems = lightboxButtons
    .filter((button) => {
      const tile = button.closest("[data-category]");
      return tile?.dataset.category === activeCategory && !tile.classList.contains("is-hidden");
    })
    .sort((buttonA, buttonB) => {
      const rectA = buttonA.getBoundingClientRect();
      const rectB = buttonB.getBoundingClientRect();
      const topDelta = Math.abs(rectA.top - rectB.top);

      if (topDelta > 18) return rectA.top - rectB.top;
      return rectA.left - rectB.left;
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

function applyFilter(category) {
  activeCategory = categories[category] ? category : "portrait";
  updatePortfolioMode(activeCategory);

  tiles.forEach((tile) => {
    const isVisible = tile.dataset.category === activeCategory;
    tile.classList.toggle("is-hidden", !isVisible);
    tile.setAttribute("aria-hidden", String(!isVisible));
  });

  syncHero(activeCategory);
  refreshActiveItems();
}

function showPortfolioOverview() {
  updatePortfolioMode(null);

  tiles.forEach((tile) => {
    tile.classList.add("is-hidden");
    tile.setAttribute("aria-hidden", "true");
  });
}

function renderLightboxImage(index) {
  if (!modalImage || !activeItems[index]) return;
  modalImage.style.opacity = "0";
  modalImage.style.transform = "scale(0.98)";

  if (modalCounter) {
    modalCounter.textContent = `${index + 1} / ${activeItems.length}`;
  }

  window.setTimeout(() => {
    modalImage.src = activeItems[index].src;
    modalImage.alt = activeItems[index].alt;
    modalImage.style.opacity = "1";
    modalImage.style.transform = "scale(1)";
  }, reduceMotion ? 0 : 80);
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
    item.style.setProperty("--delay", `${Math.min((index % 6) * 60, 240)}ms`);
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
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
  );

  revealItems.forEach((item) => observer.observe(item));
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
  return [
    { src: "assets/photos/automotive-audi-night.webp", alt: "Auto bei Nacht", position: "center 38%" },
    { src: "assets/photos/portrait-rural-man-field.webp", alt: "Portrait auf dem Feld bei warmem Licht", position: "center 30%" },
    { src: "assets/photos/club-dj-profile-dark.webp", alt: "DJ im dunklen Raum", position: "center 34%" },
    { src: "assets/photos/animal-cats-window.webp", alt: "Zwei Katzen am Fenster", position: "center 34%" },
    { src: "assets/photos/wedding-blue-bouquet.webp", alt: "Hochzeitsdetail mit Ringen", position: "center 30%" },
    { src: "assets/photos/portrait-nightsky-dramatic.webp", alt: "Portrait vor dramatischem Nachthimmel", position: "center 28%" },
  ];
}

function setupHeroSlideshow() {
  if (heroSlides.length < 2) return;

  const images = getHeroSlideshowImages();
  let activeIndexHero = 0;
  let visibleLayer = 0;

  heroSlides.forEach((slide, index) => {
    const image = images[index % images.length];
    slide.src = image.src;
    slide.alt = image.alt;
    slide.style.objectPosition = image.position;
    slide.classList.toggle("is-active", index === 0);
  });

  if (reduceMotion || images.length < 2) return;

  window.setInterval(() => {
    const nextLayer = visibleLayer === 0 ? 1 : 0;
    activeIndexHero = (activeIndexHero + 1) % images.length;
    const image = images[activeIndexHero];
    const nextSlide = heroSlides[nextLayer];

    nextSlide.src = image.src;
    nextSlide.alt = image.alt;
    nextSlide.style.objectPosition = image.position;
    nextSlide.classList.add("is-active");
    heroSlides[visibleLayer].classList.remove("is-active");
    visibleLayer = nextLayer;
  }, 6500);
}

function setupHeroParallax() {
  const heroSection = document.querySelector(".hero-home");
  const heroMedia = document.querySelector("[data-hero-media]");
  if (!heroSection || !heroMedia) return;

  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!canHover || reduceMotion) return;

  const maxShiftX = 20;
  const maxShiftY = 12;
  let ticking = false;
  let lastEvent = null;

  function apply() {
    ticking = false;
    if (!lastEvent) return;
    const rect = heroSection.getBoundingClientRect();
    const x = (lastEvent.clientX - rect.left) / rect.width - 0.5;
    const y = (lastEvent.clientY - rect.top) / rect.height - 0.5;
    heroMedia.style.setProperty("--parallax-x", `${(-x * maxShiftX).toFixed(2)}px`);
    heroMedia.style.setProperty("--parallax-y", `${(-y * maxShiftY).toFixed(2)}px`);
  }

  heroSection.addEventListener("pointermove", (event) => {
    lastEvent = event;
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(apply);
  });

  heroSection.addEventListener("pointerleave", () => {
    heroMedia.style.setProperty("--parallax-x", "0px");
    heroMedia.style.setProperty("--parallax-y", "0px");
  });
}

const cursorHoverTargets = "a, button, .category-row, .photo-tile button";
const cursorLabels = {
  ".category-row": "Ansehen",
  ".photo-tile button": "Zoom",
};

function getCursorLabel(target) {
  for (const [selector, label] of Object.entries(cursorLabels)) {
    if (target.matches(selector)) return label;
  }
  return "";
}

function setupCustomCursor() {
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!canHover || reduceMotion) return;

  const cursor = document.createElement("div");
  cursor.className = "custom-cursor";
  cursor.setAttribute("aria-hidden", "true");
  const label = document.createElement("span");
  label.className = "custom-cursor-label";
  cursor.appendChild(label);
  document.body.appendChild(cursor);
  document.body.classList.add("has-custom-cursor");

  window.addEventListener(
    "pointermove",
    (event) => {
      cursor.style.setProperty("--cursor-x", `${event.clientX}px`);
      cursor.style.setProperty("--cursor-y", `${event.clientY}px`);
    },
    { passive: true },
  );

  document.addEventListener("pointerover", (event) => {
    const target = event.target.closest(cursorHoverTargets);
    if (!target) return;
    cursor.classList.add("is-active");
    label.textContent = getCursorLabel(target);
  });

  document.addEventListener("pointerout", (event) => {
    const target = event.target.closest(cursorHoverTargets);
    if (!target) return;
    cursor.classList.remove("is-active");
    label.textContent = "";
  });
}

function setupLightboxSwipe() {
  if (!modal) return;

  let startX = 0;
  let startY = 0;
  let tracking = false;

  modal.addEventListener(
    "touchstart",
    (event) => {
      if (event.touches.length !== 1) return;
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
      tracking = true;
    },
    { passive: true },
  );

  modal.addEventListener(
    "touchend",
    (event) => {
      if (!tracking) return;
      tracking = false;
      const touch = event.changedTouches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;

      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        stepLightbox(dx < 0 ? 1 : -1);
      } else if (dy > 80 && Math.abs(dy) > Math.abs(dx)) {
        closeLightbox();
      }
    },
    { passive: true },
  );
}

function setupAutoplayFallback() {
  if (!ambientAudio || !document.body.classList.contains("home-page")) return;

  const interactionEvents = ["pointerdown", "keydown", "touchstart", "wheel"];
  const retry = async () => {
    if (!ambientAudio.paused) {
      interactionEvents.forEach((eventName) => window.removeEventListener(eventName, retry));
      return;
    }
    const started = await tryPlayAmbientAudio();
    if (started) {
      interactionEvents.forEach((eventName) => window.removeEventListener(eventName, retry));
    }
  };

  interactionEvents.forEach((eventName) => window.addEventListener(eventName, retry, { passive: true }));
}

function runIntro() {
  if (!introLoader) return;

  if (reduceMotion) {
    introLoader.remove();
    tryPlayAmbientAudio();
    return;
  }

  window.setTimeout(() => {
    introLoader.classList.add("is-leaving");
    tryPlayAmbientAudio();
    window.setTimeout(() => introLoader.remove(), 750);
  }, 900);
}

function onScroll() {
  updateHeader();
  updateMusicToggleVisibility();
}

window.history.scrollRestoration = "manual";

window.addEventListener("load", () => {
  document.body.classList.add("is-page-ready");
  updateHeader();
  updateMusicToggleVisibility();
  setupRandomCategoryImages();
  setupRandomPortfolioSpotlights();
});

window.addEventListener("scroll", onScroll, { passive: true });

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

if (tiles.length && portfolioOverview && portfolioDetail) {
  const initialCategory = getInitialCategory();
  if (initialCategory) applyFilter(initialCategory);
  else showPortfolioOverview();
}

setupAmbientAudio();
setupHeroSlideshow();
setupHeroParallax();
setupCustomCursor();
setupLightboxSwipe();
setupAutoplayFallback();
runIntro();
updateHeader();
updateMusicToggleVisibility();
setupReveal();
document.body.classList.add("is-page-ready");
