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

// Menu met tabbladen, gevuld vanuit js/menu.js
(function () {
  const tabs = document.querySelector(".tabs");
  const list = document.getElementById("menu-list");
  const price = p => (p ? `<span class="price">${p} MAD</span>` : "");
  function show(i) {
    tabs.querySelectorAll("button").forEach((b, k) => b.setAttribute("aria-selected", k === i));
    list.innerHTML = MENU[i].items.map(it => {
      const sizes = it.sizes && it.sizes.length
        ? `<ul class="sizes">${it.sizes.map(s => `<li><span>${s.label}${s.desc ? ` <small>${s.desc}</small>` : ""}</span>${price(s.price)}</li>`).join("")}</ul>` : "";
      return `<li><div class="row"><span class="dish">${it.name}</span>${price(it.price)}</div>${it.desc ? `<p class="desc">${it.desc}</p>` : ""}${sizes}</li>`;
    }).join("");
  }
  MENU.forEach((c, i) => {
    const b = document.createElement("button");
    b.type = "button"; b.setAttribute("role", "tab"); b.textContent = c.name;
    b.addEventListener("click", () => show(i));
    tabs.appendChild(b);
  });
  show(0);
})();
