// Pagina "Notre histoire": zachte verschijn-animaties bij het scrollen en een handtekening die zich tekent.
(function () {
  const root = document.documentElement;
  const calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (calm || !("IntersectionObserver" in window)) return; // zonder animatie blijft alles gewoon zichtbaar
  root.classList.add("js");
  const targets = document.querySelectorAll(".h-body > *:not(.h-end), .h-wide, .h-end > *, .tl .eyebrow, .rv, .h-hero > *");
  targets.forEach(el => el.classList.add("rv"));
  const sign = document.querySelector(".sign");
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    io.unobserve(e.target);
  }), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  targets.forEach(el => io.observe(el));
  if (sign) io.observe(sign);
})();
