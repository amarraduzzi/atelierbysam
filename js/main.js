// ===== Instellingen: pas het WhatsApp-nummer aan (landcode, zonder + of spaties) =====
const WHATSAPP = "212600000000";

const burger = document.querySelector(".burger");
const nav = document.getElementById("nav");
burger.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  burger.setAttribute("aria-expanded", open);
});
nav.querySelectorAll("a").forEach(a =>
  a.addEventListener("click", () => {
    nav.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  })
);

document.getElementById("y").textContent = new Date().getFullYear();

document.getElementById("resa").addEventListener("submit", e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const msg =
    `Bonjour, je souhaite réserver chez L’Atelier by Sam.\n` +
    `Nom : ${f.get("nom")}\nDate : ${f.get("date")}\nHeure : ${f.get("heure")}\n` +
    `Personnes : ${f.get("pers")}`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
});
