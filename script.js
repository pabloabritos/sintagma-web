const body = document.body;
const header = document.querySelector("[data-header]");

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxCounter = document.querySelector("[data-lightbox-counter]");
const lightboxPrev = document.querySelector("[data-lightbox-prev]");
const lightboxNext = document.querySelector("[data-lightbox-next]");
const lightboxClose = document.querySelector("[data-lightbox-close]");

let galleryImages = [];
let galleryIndex = 0;

const updateLightbox = () => {
  const current = galleryImages[galleryIndex];
  lightboxImage.src = current.src;
  lightboxImage.alt = current.alt;
  const hasMultiple = galleryImages.length > 1;
  lightboxPrev.hidden = !hasMultiple;
  lightboxNext.hidden = !hasMultiple;
  lightboxCounter.textContent = hasMultiple ? `${galleryIndex + 1} / ${galleryImages.length}` : "";
};

const openLightbox = (images, index) => {
  galleryImages = images;
  galleryIndex = index;
  updateLightbox();
  lightbox.hidden = false;
  body.classList.add("lightbox-open");
};

const closeLightbox = () => {
  lightbox.hidden = true;
  body.classList.remove("lightbox-open");
};

const showPrev = () => {
  galleryIndex = (galleryIndex - 1 + galleryImages.length) % galleryImages.length;
  updateLightbox();
};

const showNext = () => {
  galleryIndex = (galleryIndex + 1) % galleryImages.length;
  updateLightbox();
};

document.querySelectorAll(".consultorio-card").forEach((card) => {
  const images = Array.from(card.querySelectorAll("img")).map((img) => ({ src: img.src, alt: img.alt }));
  const trigger = card.querySelector(".photo-placeholder");

  trigger.addEventListener("click", () => openLightbox(images, 0));
  trigger.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(images, 0);
    }
  });
});

lightboxPrev.addEventListener("click", showPrev);
lightboxNext.addEventListener("click", showNext);
lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (lightbox.hidden) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") showPrev();
  if (event.key === "ArrowRight") showNext();
});
