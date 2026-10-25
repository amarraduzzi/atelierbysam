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

// Hero: het raam opent zich bij het scrollen
(function () {
  const reveal = document.getElementById("accueil");
  const gate = reveal.querySelector(".gate");
  const video = gate.querySelector(".g-video");
  const photo = gate.querySelector(".g-photo");
  const photoImg = photo.querySelector("img");
  const shade = gate.querySelector(".shade");
  const over = gate.querySelector(".gate-over");
  const back = reveal.querySelector(".w.back");
  const front = reveal.querySelector(".w.front");
  const badge = reveal.querySelector(".badge");
  const hint = reveal.querySelector(".hint");
  const deco = reveal.querySelector(".deco");
  const mq = window.matchMedia("(max-width:800px)");
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = t => 1 - Math.pow(1 - t, 3);
  let ticking = false;
  if (window.matchMedia("(prefers-reduced-motion:reduce)").matches) video.pause();

  function update() {
    ticking = false;
    const vw = window.innerWidth, vh = window.innerHeight;
    const travel = reveal.offsetHeight - vh;
    const p = clamp(-reveal.getBoundingClientRect().top / (travel * 0.85));
    const e = ease(p);
    const mobile = mq.matches;
    // zelfde maten als --aw / --ah in style.css
    const w0 = mobile ? vw * 0.74 : Math.min(vw * 0.44, 520);
    const h0 = mobile ? vh * 0.70 : vh * 0.76;
    const w = lerp(w0, vw, e), h = lerp(h0, vh, e);
    gate.style.width = w + "px";
    gate.style.height = h + "px";
    const r = (1 - e) * w / 2;
    gate.style.borderRadius = r + "px " + r + "px 0 0";
    const swap = clamp((p - 0.2) / 0.45);
    photo.style.opacity = swap;
    photoImg.style.transform = "scale(" + lerp(1.15, 1, e) + ")";
    photoImg.style.objectPosition = (mobile ? 50 : lerp(30, 50, e)) + "% 60%";
    back.style.opacity = clamp(1 - p / 0.4);
    front.style.opacity = clamp(1 - p / 0.4);
    badge.style.opacity = clamp(1 - p / 0.25);
    hint.style.opacity = clamp(1 - p / 0.15);
    const df = clamp(1 - p / 0.35);
    deco.style.opacity = df;
    deco.style.visibility = df < 0.02 ? "hidden" : "visible";
    const t = clamp((p - 0.62) / 0.3);
    shade.style.opacity = t; over.style.opacity = t;
    over.style.pointerEvents = t > 0.5 ? "auto" : "none";
  }
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener("scroll", req, { passive: true });
  window.addEventListener("resize", req);
  update();
})();
