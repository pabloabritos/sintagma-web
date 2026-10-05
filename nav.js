const navHeader = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");

const setNavOpen = (open) => {
  navHeader.classList.toggle("nav-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
};

navToggle.addEventListener("click", () => setNavOpen(!navHeader.classList.contains("nav-open")));

document.querySelectorAll(".site-nav a").forEach((link) => {
  link.addEventListener("click", () => setNavOpen(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setNavOpen(false);
});
