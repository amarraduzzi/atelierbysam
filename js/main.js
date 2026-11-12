// ===== Instellingen: pas het WhatsApp-nummer aan (landcode, zonder + of spaties) =====
const WHATSAPP = "212600000000";

// ===== Koppeling met het Amplify-kassasysteem (Supabase) =====
// Vul in na het aanmaken van de zaak in het beheer. De sleutel is de openbare "publishable/anon" sleutel
// (Supabase > Settings > API Keys): die mag alleen de openbare reserveringsfuncties gebruiken.
// Laat url of key leeg: dan blijft het formulier via WhatsApp werken.
const SYSTEEM = {
  url: "https://ntpeocxdpjgonexvwbln.supabase.co",
  key: "",                 // sb_publishable_...
  slug: "",                // slug van de zaak in Amplify, bv. atelier-by-sam
  menuUrl: "",             // adres van de gastenpagina, bv. https://menu.jouwdomein.com (voor de link "Annuleren")
  tz: "Africa/Casablanca"
};

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

// Reserveren: de beschikbare tijden komen live uit het Amplify-kassasysteem, de reservering komt direct in het systeem.
// Is het systeem niet ingesteld (SYSTEEM.url leeg) of onbereikbaar, dan valt het formulier terug op WhatsApp.
(function () {
  const form = document.getElementById("resa");
  const persEl = document.getElementById("pers"), daysEl = document.getElementById("days");
  const slotsEl = document.getElementById("slots"), more = document.getElementById("date-more");
  const recap = document.getElementById("recap"), submitBtn = document.getElementById("resa-btn");
  const done = document.getElementById("resa-done"), errEl = document.getElementById("resa-err");
  const LIVE = !!(SYSTEEM.url && SYSTEEM.key && SYSTEEM.slug);
  const TZ = SYSTEEM.tz || "Africa/Casablanca";
  const state = { pers: "2", date: "", time: "", slots: null };
  let maxParty = 8, daysAhead = 30, reqId = 0;

  const fr = (d, o) => d.toLocaleDateString("fr-FR", o);
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  // dag als JJJJ-MM-DD in de tijdzone van de zaak
  const ymd = d => new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
  const hm = iso => new Intl.DateTimeFormat("fr-FR", { timeZone: TZ, hour: "2-digit", minute: "2-digit" }).format(new Date(iso)).replace(":", "h");
  const hourOf = iso => +new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", hourCycle: "h23" }).format(new Date(iso));
  const GROUPS = [["Matin & midi", 0, 14], ["Après-midi", 14, 18], ["Soir", 18, 24]];
  state.date = ymd(new Date());

  // --- aanroepen naar het systeem (PostgREST RPC, alleen openbare functies) ---
  async function rpc(fn, args) {
    let res;
    try {
      res = await fetch(`${SYSTEEM.url}/rest/v1/rpc/${fn}`, {
        method: "POST",
        headers: Object.assign({ "Content-Type": "application/json", apikey: SYSTEEM.key }, SYSTEEM.key.startsWith("eyJ") ? { Authorization: "Bearer " + SYSTEEM.key } : {}),
        body: JSON.stringify(args)
      });
    } catch (_) { throw new Error("network"); }
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error((data && data.message) || "other");
    return data;
  }
  const ERR = {
    slot_unavailable: "Ce créneau vient d’être pris. Choisissez une autre heure.",
    party_too_big: "Pour un grand groupe, contactez-nous sur WhatsApp.",
    customer_required: "Indiquez votre nom et un numéro de téléphone valide.",
    rate_limited: "Vous avez déjà plusieurs réservations à venir. Contactez-nous sur WhatsApp.",
    booking_off: "Les réservations en ligne sont fermées. Contactez-nous sur WhatsApp.",
    network: "Pas de connexion. Réessayez ou contactez-nous sur WhatsApp.",
    other: "Une erreur est survenue. Réessayez ou contactez-nous sur WhatsApp."
  };
  const errText = e => ERR[e && e.message] || ERR.other;

  const mk = (txt, val, on) => { const b = document.createElement("button"); b.type = "button"; b.textContent = txt; b.dataset.v = val; b.setAttribute("aria-pressed", on); return b; };
  const mkDay = (top, bottom, val, on) => { const b = document.createElement("button"); b.type = "button"; b.innerHTML = `<small>${top}</small><b>${bottom}</b>`; b.dataset.v = val; b.setAttribute("aria-pressed", on); return b; };
  const setOn = (box, val) => box.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", b.dataset.v === val));
  const showErr = t => { errEl.textContent = t || ""; errEl.hidden = !t; };

  function drawPers() {
    persEl.innerHTML = "";
    const top = Math.min(maxParty, 8);
    for (let i = 1; i <= top; i++) persEl.appendChild(mk(String(i), String(i), String(i) === state.pers));
  }
  const today = new Date();
  function drawDays() {
    daysEl.innerHTML = "";
    for (let i = 0; i < 5; i++) {
      const d = new Date(today.getTime() + i * 86400000);
      const top = i === 0 ? "Aujourd’hui" : i === 1 ? "Demain" : cap(fr(d, { weekday: "long", timeZone: TZ }));
      const bottom = `${new Intl.DateTimeFormat("fr-FR", { timeZone: TZ, day: "numeric" }).format(d)} ${fr(d, { month: "short", timeZone: TZ }).replace(".", "")}`;
      daysEl.appendChild(mkDay(top, bottom, ymd(d), ymd(d) === state.date));
    }
    daysEl.appendChild(mkDay("Autre date", "Calendrier", "other", false));
    more.min = ymd(today);
    more.max = ymd(new Date(today.getTime() + daysAhead * 86400000));
  }

  // --- tijden: live uit het systeem, of vaste lijst zonder systeem ---
  function fallbackSlots() {
    const out = [], now = Date.now(), base = new Date(state.date + "T00:00:00");
    for (let h = 10; h <= 20; h++) for (const m of [0, 30]) { const d = new Date(base); d.setHours(h, m); if (d.getTime() > now + 30 * 60000) out.push(d.toISOString()); }
    return out;
  }
  async function loadSlots() {
    const id = ++reqId;
    state.time = ""; state.slots = null; draw();
    slotsEl.innerHTML = '<p class="slots-empty">Chargement…</p>';
    let list;
    if (LIVE) {
      try { list = await rpc("booking_slots", { p_slug: SYSTEEM.slug, p_date: state.date, p_party: +state.pers }); }
      catch (e) { if (id !== reqId) return; list = null; slotsEl.innerHTML = `<p class="slots-empty">${errText(e)}</p>`; state.slots = []; draw(); return; }
    } else list = fallbackSlots();
    if (id !== reqId) return;
    state.slots = list || [];
    drawSlots();
    draw();
  }
  function drawSlots() {
    slotsEl.innerHTML = "";
    if (!state.slots.length) { slotsEl.innerHTML = '<p class="slots-empty">Plus de place ce jour-là. Choisissez un autre jour.</p>'; return; }
    GROUPS.forEach(([name, from, to]) => {
      const list = state.slots.filter(s => { const h = hourOf(s); return h >= from && h < to; });
      if (!list.length) return;
      const g = document.createElement("div"); g.className = "sg";
      g.innerHTML = `<p class="sg-t">${name}</p>`;
      const row = document.createElement("div"); row.className = "sg-row";
      list.forEach(s => row.appendChild(mk(hm(s), s, state.time === s)));
      g.appendChild(row); slotsEl.appendChild(g);
    });
  }
  function describe() {
    const d = new Date(state.date + "T12:00:00");
    const p = state.pers === "1" ? "1 personne" : state.pers + " personnes";
    return `${cap(fr(d, { weekday: "long", day: "numeric", month: "long" }))} · ${state.time ? hm(state.time) : "…"} · ${p}`;
  }
  function draw() { recap.classList.remove("warn"); recap.classList.toggle("ok", !!state.time); recap.textContent = state.time ? describe() : "Choisissez une heure"; }

  persEl.addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; state.pers = b.dataset.v; setOn(persEl, state.pers); showErr(""); loadSlots(); });
  daysEl.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.v === "other") { more.hidden = false; setOn(daysEl, "other"); more.focus(); if (more.showPicker) try { more.showPicker(); } catch (_) {} return; }
    more.hidden = true; state.date = b.dataset.v; setOn(daysEl, state.date); showErr(""); loadSlots();
  });
  more.addEventListener("change", () => { if (more.value) { state.date = more.value; showErr(""); loadSlots(); } });
  slotsEl.addEventListener("click", e => { const b = e.target.closest("button"); if (!b || b.disabled) return; state.time = b.dataset.v; setOn(slotsEl, state.time); draw(); });

  // --- versturen ---
  const waMsg = (nom, tel, note) => `Bonjour, je souhaite réserver chez L’Atelier by Sam.\nNom : ${nom}\nTéléphone : ${tel}\nDate : ${cap(fr(new Date(state.date + "T12:00:00"), { weekday: "long", day: "numeric", month: "long" }))}\nHeure : ${hm(state.time)}\nPersonnes : ${state.pers}` + (note ? `\nRemarque : ${note}` : "");
  const openWA = text => window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank", "noopener");

  function showDone(res, nom) {
    const confirmed = res.status === "confirmed";
    const link = SYSTEEM.menuUrl ? `${SYSTEEM.menuUrl.replace(/\/$/, "")}/${SYSTEEM.slug}?resa=${res.token}` : "";
    done.innerHTML = `<h3>${confirmed ? "Réservation confirmée" : "Demande envoyée"}</h3>
      <p>${confirmed ? "Merci" : "Merci"} ${nom.replace(/[<>&"]/g, "")} ! ${confirmed ? "Votre table est réservée" : "Nous confirmons votre réservation très vite"} :</p>
      <p class="done-when">${describe()}</p>
      ${link ? `<p><a class="btn btn-solid" href="${link}">Suivre ou annuler ma réservation</a></p>` : ""}
      <p><button type="button" class="linklike" id="resa-again">Faire une autre réservation</button></p>`;
    form.hidden = true; done.hidden = false;
    done.scrollIntoView({ block: "center", behavior: "smooth" });
    document.getElementById("resa-again").addEventListener("click", () => { form.reset(); form.hidden = false; done.hidden = true; state.time = ""; loadSlots(); });
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    showErr("");
    const f = new FormData(form), nom = (f.get("nom") || "").trim(), tel = (f.get("tel") || "").trim(), note = (f.get("note") || "").trim();
    if (!state.time) { recap.textContent = "Choisissez une heure"; recap.classList.add("warn"); slotsEl.scrollIntoView({ block: "center", behavior: "smooth" }); return; }
    if (!nom) { form.nom.focus(); return; }
    if (LIVE && tel.replace(/\D/g, "").length < 9) { showErr(ERR.customer_required); form.tel.focus(); return; }
    if (!LIVE) { openWA(waMsg(nom, tel, note)); return; }
    submitBtn.disabled = true; submitBtn.textContent = "Envoi…";
    try {
      const res = await rpc("book_table", { p_slug: SYSTEEM.slug, p_booking: {
        client_id: (crypto.randomUUID ? crypto.randomUUID() : undefined), starts_at: state.time, party_size: +state.pers, name: nom, phone: tel.replace(/[^\d]/g, ""), note: note || undefined } });
      showDone(res, nom);
    } catch (err) {
      showErr(errText(err));
      if (err.message === "slot_unavailable") loadSlots();
    } finally { submitBtn.disabled = false; submitBtn.textContent = "Réserver"; }
  });

  drawPers(); drawDays(); loadSlots();
  // instellingen van de zaak (max. personen, aantal dagen vooruit)
  if (LIVE) rpc("get_booking_info", { p_slug: SYSTEEM.slug }).then(info => {
    if (!info) return;
    if (info.enabled === false) { showErr(ERR.booking_off); }
    maxParty = info.max_party || maxParty; daysAhead = info.days_ahead || daysAhead;
    if (info.timezone && info.timezone !== TZ) console.warn("Tijdzone van het systeem:", info.timezone);
    drawPers(); drawDays();
  }).catch(() => {});
})();

// Menu: harmonica van arches, gevuld vanuit js/menu.js
(function () {
  const root = document.getElementById("acc");
  const PIC = ["menu-tea-chaudes.jpg", "menu-froides.jpg", "menu-smoothies.jpg", "menu-sales.jpg", "menu-sucres.jpg"]; // foto per categorie (volgorde van MENU)
  const POS = ["60% 61%", "64% 58%", "55% 58%", "40% 73%", "52% 67%"]; // uitsnede per foto: x y
  const price = p => (p ? `<span class="price">${p} MAD</span>` : "");
  root.innerHTML = MENU.map((c, i) => {
    const items = c.items.map(it => {
      const sizes = it.sizes && it.sizes.length
        ? `<ul class="sizes">${it.sizes.map(s => `<li><span>${s.label}${s.desc ? ` <small>${s.desc}</small>` : ""}</span>${price(s.price)}</li>`).join("")}</ul>` : "";
      return `<li><div class="row"><span class="dish">${it.name}</span>${price(it.price)}</div>${it.desc ? `<p class="desc">${it.desc}</p>` : ""}${sizes}</li>`;
    }).join("");
    return `<div class="acc${i === 0 ? " open" : ""}"><div class="acc-pic" style="background-image:url(assets/photos/${PIC[i % PIC.length]});background-position:${POS[i % POS.length]}"></div><button class="acc-h" type="button" aria-expanded="${i === 0}" aria-controls="acc-${i}"><span>${c.name}</span></button><div class="acc-body" id="acc-${i}"><ul>${items}</ul></div></div>`;
  }).join("");
  const panels = [...root.querySelectorAll(".acc")];
  root.insertAdjacentHTML("beforebegin", `<div class="chips" role="tablist" aria-label="Catégories">${MENU.map((c, i) => `<button type="button" role="tab" aria-selected="${i === 0}">${c.name}</button>`).join("")}</div>`);
  const chips = [...root.parentNode.querySelectorAll(".chips button")];
  function openPanel(p, fromChip) {
    const k = panels.indexOf(p);
    panels.forEach(q => { const o = q === p; q.classList.toggle("open", o); q.querySelector(".acc-h").setAttribute("aria-expanded", o); });
    chips.forEach((b, j) => b.setAttribute("aria-selected", j === k));
    p.querySelector(".acc-body").scrollTop = 0;
    if (fromChip) {
      chips[k].scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
      if (root.getBoundingClientRect().top < 110) root.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }
  panels.forEach(p => p.querySelector(".acc-h").addEventListener("click", () => openPanel(p, false)));
  chips.forEach((b, j) => b.addEventListener("click", () => openPanel(panels[j], true)));
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
  let dist = 0, ticking = false, mobile = null;
  document.documentElement.classList.add("js");
  const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.15 }) : null;
  [...track.children].forEach(p => io ? io.observe(p) : p.classList.add("in"));

  function reset() {
    track.style.transform = ""; ghost.style.transform = "";
    pans.forEach(p => { p.style.transform = ""; p.style.opacity = ""; p.style.zIndex = ""; p.style.pointerEvents = ""; });
    frames.forEach(f => f.style.removeProperty("--px"));
  }
  function measure() {
    const m = mq.matches;
    if (m !== mobile) { mobile = m; reset(); }
    const vh = window.innerHeight;
    if (mobile) { sec.style.height = ""; return; }
    dist = Math.max(0, track.scrollWidth - window.innerWidth);
    sec.style.height = dist + vh + "px";
    update();
  }
  function update() {
    ticking = false;
    const vw = window.innerWidth, vh = window.innerHeight;
    if (mobile) return;
    const p = clamp(-sec.getBoundingClientRect().top / Math.max(1, sec.offsetHeight - vh));
    bar.style.transform = "scaleX(" + p + ")";
    {
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

// Actiebalk (mobiel): verschijnt na de hero, verdwijnt bij het reserveringsformulier
(function () {
  const bar = document.getElementById("bar"), resa = document.getElementById("reserver");
  if (!bar) return;
  if (typeof WHATSAPP !== "undefined") document.getElementById("bar-wa").href = "https://wa.me/" + WHATSAPP;
  let t = false;
  const upd = () => {
    t = false;
    const r = resa.getBoundingClientRect();
    bar.classList.toggle("show", window.scrollY > window.innerHeight * 1.2 && !(r.top < window.innerHeight * 0.7 && r.bottom > 0));
  };
  window.addEventListener("scroll", () => { if (!t) { t = true; requestAnimationFrame(upd); } }, { passive: true });
  upd();
})();
