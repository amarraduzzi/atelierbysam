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

// Menu: harmonica van arches, gevuld vanuit js/menu.js
(function () {
  const root = document.getElementById("acc");
  const PIC = ["tea.jpg", "latte.jpg", "doorway.jpg", "toast.jpg", "croissant.jpg"]; // foto per categorie (volgorde van MENU)
  const price = p => (p ? `<span class="price">${p} MAD</span>` : "");
  root.innerHTML = MENU.map((c, i) => {
    const items = c.items.map(it => {
      const sizes = it.sizes && it.sizes.length
        ? `<ul class="sizes">${it.sizes.map(s => `<li><span>${s.label}${s.desc ? ` <small>${s.desc}</small>` : ""}</span>${price(s.price)}</li>`).join("")}</ul>` : "";
      return `<li><div class="row"><span class="dish">${it.name}</span>${price(it.price)}</div>${it.desc ? `<p class="desc">${it.desc}</p>` : ""}${sizes}</li>`;
    }).join("");
    return `<div class="acc${i === 0 ? " open" : ""}"><div class="acc-pic" style="background-image:url(assets/photos/${PIC[i % PIC.length]})"></div><button class="acc-h" type="button" aria-expanded="${i === 0}" aria-controls="acc-${i}"><span>${c.name}</span></button><div class="acc-body" id="acc-${i}"><ul>${items}</ul></div></div>`;
  }).join("");
  const panels = [...root.querySelectorAll(".acc")];
  panels.forEach(p => p.querySelector(".acc-h").addEventListener("click", () => {
    panels.forEach(q => { const o = q === p; q.classList.toggle("open", o); q.querySelector(".acc-h").setAttribute("aria-expanded", o); });
  }));
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

// L'Atelier: arcade horizontale (desktop) / pile de cartes (mobile)
(function () {
  const sec = document.getElementById("atelier");
  if (!sec || window.matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  const track = sec.querySelector(".track");
  const ghost = sec.querySelector(".ghost");
  const bar = sec.querySelector(".prog i");
  const frames = [...sec.querySelectorAll(".frame")];
  const pans = [...track.children];
  const mq = window.matchMedia("(max-width:800px)");
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = t => 1 - Math.pow(1 - t, 3);
  let dist = 0, ticking = false, mobile = null;

  function reset() {
    track.style.transform = ""; ghost.style.transform = "";
    pans.forEach(p => { p.style.transform = ""; p.style.opacity = ""; p.style.zIndex = ""; p.style.pointerEvents = ""; });
    frames.forEach(f => f.style.removeProperty("--px"));
  }
  function measure() {
    const m = mq.matches;
    if (m !== mobile) { mobile = m; reset(); }
    const vh = window.innerHeight;
    if (mobile) {
      sec.style.height = ((pans.length - 1) * 0.85 * vh + vh) + "px";
    } else {
      dist = Math.max(0, track.scrollWidth - window.innerWidth);
      sec.style.height = dist + vh + "px";
    }
    update();
  }
  function update() {
    ticking = false;
    const vw = window.innerWidth, vh = window.innerHeight;
    const p = clamp(-sec.getBoundingClientRect().top / Math.max(1, sec.offsetHeight - vh));
    bar.style.transform = "scaleX(" + p + ")";
    if (mobile) {
      const steps = p * (pans.length - 1);
      pans.forEach((el, j) => {
        const cum = steps - j;
        let y = 0, s = 1, o = 1;
        if (cum < 0) {
          const t = clamp(cum + 1);
          y = (1 - ease(t)) * vh * (j === 1 ? 0.55 : 1.1);
          if (j > 1 && t === 0) o = 0;
        } else {
          const t = clamp(cum);
          y = -t * vh * 0.04; s = 1 - 0.07 * t; o = 1 - t;
        }
        el.style.transform = "translate(-50%,-50%) translate3d(0," + y + "px,0) scale(" + s + ")";
        el.style.opacity = o;
        el.style.zIndex = j + 1;
        el.style.pointerEvents = (cum >= -0.05 && cum < 0.5) ? "auto" : "none";
      });
    } else {
      track.style.transform = "translate3d(" + -p * dist + "px,0,0)";
      ghost.style.transform = "translate3d(" + -p * dist * 0.35 + "px,-50%,0)";
      frames.forEach(f => {
        const r = f.getBoundingClientRect();
        f.style.setProperty("--px", (r.left + r.width / 2 - vw / 2) * -0.07 + "px");
      });
    }
  }
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener("scroll", req, { passive: true });
  window.addEventListener("resize", measure);
  window.addEventListener("load", measure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  measure();
})();
