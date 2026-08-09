const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const moodByCategory = {
  portrait: "light",
  wedding: "light",
  animal: "light",
  club: "dark",
  auto: "dark",
};

const header = document.querySelector("[data-header]");
const filterPills = Array.from(document.querySelectorAll("[data-filter]"));
const filterCount = document.querySelector("[data-filter-count]");
const tiles = Array.from(document.querySelectorAll("[data-category]"));
const lightboxButtons = Array.from(document.querySelectorAll("[data-lightbox]"));
const modal = document.querySelector("[data-lightbox-modal]");
const modalImage = document.querySelector("[data-lightbox-image]");
const modalClose = document.querySelector("[data-lightbox-close]");
const modalPrev = document.querySelector("[data-lightbox-prev]");
const modalNext = document.querySelector("[data-lightbox-next]");

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

/* ---------- Portfolio: filter bar + gallery ---------- */

function countFor(filter) {
  if (filter === "all") return tiles.length;
  return tiles.filter((tile) => tile.dataset.category === filter).length;
}

function refreshActiveItems() {
  activeItems = lightboxButtons
    .filter((button) => !button.closest("[data-category]")?.hasAttribute("hidden"))
    .map((button) => {
      const image = button.querySelector("img");
      return {
        button,
        src: image?.getAttribute("src") ?? "",
        alt: image?.getAttribute("alt") ?? "",
      };
    });
}

function applyFilter(filter, { updateUrl = false } = {}) {
  const isValid = filter === "all" || moodByCategory[filter];
  const activeFilter = isValid ? filter : "all";

  tiles.forEach((tile) => {
    tile.toggleAttribute("hidden", !(activeFilter === "all" || tile.dataset.category === activeFilter));
  });

  filterPills.forEach((pill) => {
    const isActive = pill.dataset.filter === activeFilter;
    pill.classList.toggle("is-active", isActive);
    if (isActive) pill.setAttribute("aria-current", "page");
    else pill.removeAttribute("aria-current");
  });

  document.body.dataset.mood = activeFilter === "all" ? "dark" : moodByCategory[activeFilter];
  if (filterCount) filterCount.textContent = `${countFor(activeFilter)} Bilder`;

  refreshActiveItems();

  if (updateUrl) {
    const url = new URL(window.location.href);
    if (activeFilter === "all") url.searchParams.delete("filter");
    else url.searchParams.set("filter", activeFilter);
    window.history.pushState({ filter: activeFilter }, "", url);
  }
}

function getInitialFilter() {
  const query = new URLSearchParams(window.location.search).get("filter");
  return query && moodByCategory[query] ? query : "all";
}

/* ---------- Lightbox ---------- */

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

if (filterPills.length && tiles.length) {
  applyFilter(getInitialFilter());

  filterPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      applyFilter(pill.dataset.filter, { updateUrl: true });
    });
  });

  window.addEventListener("popstate", () => applyFilter(getInitialFilter()));
}

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

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();
setupReveal();
