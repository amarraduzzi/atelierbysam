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

// Hero: de boog opent zich bij het scrollen
(function () {
  const reveal = document.getElementById("accueil");
  const gate = reveal.querySelector(".gate");
  const pic = gate.querySelector("picture img");
  const shade = gate.querySelector(".shade");
  const over = gate.querySelector(".gate-over");
  const words = reveal.querySelectorAll(".w");
  const kicker = reveal.querySelector(".kicker");
  const hint = reveal.querySelector(".hint");
  const mq = window.matchMedia("(max-width:800px)");
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = t => 1 - Math.pow(1 - t, 3);
  let ticking = false;

  function update() {
    ticking = false;
    const vw = window.innerWidth, vh = window.innerHeight;
    const travel = reveal.offsetHeight - vh;
    const p = clamp(-reveal.getBoundingClientRect().top / (travel * 0.85));
    const e = ease(p);
    const mobile = mq.matches;
    const w0 = mobile ? vw * 0.64 : Math.min(vw * 0.30, 380);
    const h0 = mobile ? vh * 0.56 : vh * 0.68;
    const w = lerp(w0, vw, e), h = lerp(h0, vh, e);
    gate.style.width = w + "px";
    gate.style.height = h + "px";
    const r = (1 - e) * w / 2;
    gate.style.borderRadius = r + "px " + r + "px 0 0";
    if (mobile) gate.style.top = lerp(vh * 0.34, 0, e) + "px";
    else { gate.style.top = ""; gate.style.margin = "0 " + lerp(-vw * 0.016, 0, e) + "px"; }
    pic.style.transform = "scale(" + lerp(1.12, 1, e) + ")";
    pic.style.objectPosition = (mobile ? 50 : lerp(26, 50, e)) + "% " + (mobile ? 50 : lerp(70, 50, e)) + "%";
    const fade = clamp(1 - p / 0.45);
    words.forEach(el => (el.style.opacity = fade));
    kicker.style.opacity = fade; hint.style.opacity = fade;
    const t = clamp((p - 0.6) / 0.3);
    shade.style.opacity = t; over.style.opacity = t;
    over.style.pointerEvents = t > 0.5 ? "auto" : "none";
  }
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener("scroll", req, { passive: true });
  window.addEventListener("resize", req);
  update();
})();
