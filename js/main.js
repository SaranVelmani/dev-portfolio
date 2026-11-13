/* Portfolio interactions. Content comes from js/data.js (window.PORTFOLIO). */
(function () {
  "use strict";

  const D = window.PORTFOLIO;
  const root = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hasGSAP = !!(window.gsap && window.ScrollTrigger);
  const animate = hasGSAP && !reduced;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------------- Render content ---------------- */
  function renderMarquee() {
    const t = $("[data-marquee]");
    const items = D.marquee.map((m) => `<span>${esc(m)}</span>`).join("");
    t.innerHTML = items + items; // doubled for a seamless loop
  }

  function visualFor(p) {
    const acc = p.accent;
    switch (p.visual) {
      case "chat":
        return `<div class="viz viz-chat">
          <div class="b me">Petrol 250</div>
          <div class="b ai"><small>⛽ Added expense · Transport</small><b>₹250</b></div>
          <div class="b me">Salary 42000 on 1st</div>
          <div class="b ai"><small>💼 Income · recurring monthly</small><b>₹42,000</b></div></div>`;
      case "wave": {
        let bars = "";
        for (let i = 0; i < 32; i++) bars += `<i style="--i:${i};--h:${Math.round(30 + 60 * Math.abs(Math.sin(i * 0.55)))}"></i>`;
        return `<div class="viz viz-wave">${bars}</div>`;
      }
      case "shield":
        return `<div class="viz viz-ring"><svg viewBox="0 0 200 200" aria-hidden="true">
          <g class="orb"><circle cx="100" cy="100" r="88" fill="none" stroke="${acc}" stroke-opacity=".35" stroke-dasharray="4 8"/><circle cx="100" cy="12" r="5" fill="${acc}"/><circle cx="188" cy="100" r="4" fill="#fff"/><circle cx="24" cy="140" r="4" fill="${acc}"/></g>
          <circle cx="100" cy="100" r="60" fill="none" stroke="#fff" stroke-opacity=".12"/>
          <path d="M100 52 L136 66 V98 C136 124 120 140 100 150 C80 140 64 124 64 98 V66 Z" fill="${acc}" fill-opacity=".18" stroke="${acc}" stroke-width="2"/>
          <path d="M86 100 L97 111 L116 90" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`;
      case "candles": {
        const c = [[20, 120, 90, 140, 1], [40, 100, 70, 125, 1], [60, 80, 60, 100, 0], [80, 95, 75, 118, 1], [100, 60, 50, 85, 1], [120, 70, 55, 95, 0], [140, 45, 35, 70, 1], [160, 50, 30, 62, 1], [180, 30, 20, 50, 1]];
        let s = "";
        c.forEach(([x, o, h, l, up]) => {
          const col = up ? acc : "#ef4444";
          s += `<line x1="${x}" y1="${h - 10}" x2="${x}" y2="${l + 10}" stroke="${col}" stroke-width="2"/><rect x="${x - 6}" y="${Math.min(o, h)}" width="12" height="${Math.abs(l - o) || 6}" rx="2" fill="${col}"/>`;
        });
        return `<div class="viz viz-candles"><svg viewBox="0 0 200 170" aria-hidden="true"><path d="M10 150 H195" stroke="#fff" stroke-opacity=".12"/>${s}<text x="10" y="166" fill="#8b8b98" font-family="JetBrains Mono" font-size="9">dry_run=true · kill switch armed</text></svg></div>`;
      }
      case "bars": {
        let b = "";
        for (let i = 0; i < 9; i++) b += `<i style="--i:${i}"></i>`;
        return `<div class="viz viz-bars">${b}</div>`;
      }
      case "book":
        return `<div class="viz viz-book">
          <div class="bk" style="background:linear-gradient(135deg,#7f1d1d,#ea580c);transform:translateX(-38%) rotate(-12deg)"><span>Job Hunt Playbook</span><small>2026</small></div>
          <div class="bk" style="background:linear-gradient(135deg,#1e3a8a,#eab308);transform:translateX(38%) rotate(10deg)"><span>Python in 30 Days</span><small>2026</small></div>
          <div class="bk" style="background:linear-gradient(135deg,#0c4a6e,#0891b2);transform:translateY(-4%)"><span>SQL Practice Book</span><small>60 problems</small></div></div>`;
      case "download":
        return `<div class="viz viz-download"><svg viewBox="0 0 200 200" aria-hidden="true"><rect x="30" y="30" width="140" height="140" rx="28" fill="none" stroke="${acc}" stroke-width="2" stroke-opacity=".6"/><path d="M100 60 V125 M75 102 L100 127 L125 102" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><rect x="62" y="142" width="76" height="8" rx="4" fill="${acc}"/></svg></div>`;
      case "images":
        return `<div class="viz-images">${p.images.map((src, i) => `<img src="${src}" alt="${esc(p.name)} screenshot ${i + 1}" loading="lazy" width="1200" height="750">`).join("")}</div>`;
      default:
        return "";
    }
  }

  function renderProjects() {
    const track = $("[data-projects]");
    track.innerHTML = D.projects.map((p, i) => {
      const links = [];
      if (p.live) links.push(`<a href="${p.live}" target="_blank" rel="noopener">Live demo ↗</a>`);
      if (p.code) links.push(`<a href="${p.code}" target="_blank" rel="noopener">Source ↗</a>`);
      if (!p.code) links.push(`<span class="private">Private repository</span>`);
      return `<article class="project" style="--acc:${p.accent}" data-cursor="view" aria-label="${esc(p.name)}">
        <div class="project__visual"><span class="project__num">${String(i + 1).padStart(2, "0")}</span><div class="project__visual-inner">${visualFor(p)}</div></div>
        <div class="project__body">
          <div class="project__tag"><span>${esc(p.tag)}</span><span>${esc(p.year)}</span></div>
          <h3 class="project__name">${esc(p.name)}</h3>
          <p class="project__purpose">${esc(p.purpose)}</p>
          <p class="project__role"><b>My role:</b> ${esc(p.role)}</p>
          <ul class="project__features">${p.features.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
          <p class="project__highlight">${esc(p.highlight)}</p>
          <div class="project__stack">${p.stack.map((s) => `<span>${esc(s)}</span>`).join("")}</div>
          <div class="project__links">${links.join("")}</div>
        </div></article>`;
    }).join("") + `<article class="project project--end"><div><h3>Have a project<br>like these?</h3><a class="btn btn--primary magnetic" href="#contact"><span>Let's talk</span></a></div></article>`;
  }

  function renderJourney() {
    const tl = $("[data-timeline]");
    tl.insertAdjacentHTML("beforeend", D.timeline.map((t) =>
      `<li class="tl${t.current ? " current" : ""}"><time>${esc(t.when)}</time><h3>${esc(t.what)}</h3><p>${esc(t.where)}</p></li>`).join(""));
    const w = D.work;
    $("[data-job]").innerHTML = `<div class="job__head"><h3>${esc(w.title)}</h3><span>● ${esc(w.period)}</span></div>
      <p class="job__co">${esc(w.company)} · ${esc(w.place)}</p>
      <ul>${w.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>`;
  }

  /* ---------------- Skills constellation ---------------- */
  let skillIndex = 0;
  function renderSkillTabs() {
    const tabs = $("[data-skill-tabs]");
    tabs.innerHTML = D.skills.map((s, i) =>
      `<button class="skills__tab" role="tab" id="tab-${s.id}" aria-selected="${i === 0}" aria-controls="skill-stage" data-i="${i}">
        <small>${String(i + 1).padStart(2, "0")}</small><b>${esc(s.title)}</b><em>${esc(s.blurb)}</em></button>`).join("");
    $("[data-skill-stage]").id = "skill-stage";
    tabs.addEventListener("click", (e) => {
      const b = e.target.closest(".skills__tab");
      if (b) showSkills(+b.dataset.i);
    });
    tabs.addEventListener("keydown", (e) => {
      if (!["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)) return;
      e.preventDefault();
      const n = (skillIndex + (e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1) + D.skills.length) % D.skills.length;
      showSkills(n);
      $$(".skills__tab")[n].focus();
    });
  }

  function layoutSkills() {
    const stage = $("[data-skill-stage]");
    const chips = $$(".chip", stage);
    const svg = $(".skills__lines", stage);
    const wide = window.innerWidth > 960;
    if (!wide) { svg.innerHTML = ""; return; }
    const w = stage.clientWidth, h = stage.clientHeight;
    const cx = w / 2, cy = h / 2;
    const rx = w * 0.40, ry = h * 0.38;
    let lines = `<defs><linearGradient id="skillGrad" x1="0" x2="1"><stop offset="0" stop-color="#3b82f6"/><stop offset="1" stop-color="#8b5cf6"/></linearGradient></defs>`;
    chips.forEach((c, i) => {
      const a = (i / chips.length) * Math.PI * 2 - Math.PI / 2 + (i % 2 ? 0.12 : -0.05);
      const r = i % 2 ? 0.82 : 1;
      const x = cx + Math.cos(a) * rx * r, y = cy + Math.sin(a) * ry * r;
      c.style.left = x + "px";
      c.style.top = y + "px";
      lines += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${animate ? 1 : 0}"/>`;
    });
    svg.innerHTML = lines;
  }

  function showSkills(i, first) {
    if (i === skillIndex && !first) return;
    skillIndex = i;
    const s = D.skills[i];
    $$(".skills__tab").forEach((t, k) => t.setAttribute("aria-selected", k === i));
    $("[data-skill-core-label]").textContent = s.title;
    const orbit = $("[data-skill-orbit]");
    const build = () => {
      orbit.innerHTML = s.items.map((it, k) => `<li class="chip"><span style="--d:${(-k * 0.7).toFixed(1)}s">${esc(it)}</span></li>`).join("");
      layoutSkills();
      if (animate) {
        gsap.fromTo($$(".chip span", orbit), { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, stagger: 0.05, ease: "back.out(1.8)" });
        gsap.to($$(".skills__lines line"), { strokeDashoffset: 0, duration: 0.9, stagger: 0.04, ease: "power3.out" });
      }
    };
    if (animate && !first && orbit.children.length) {
      gsap.to($$(".chip span", orbit), { scale: 0.4, opacity: 0, duration: 0.25, stagger: 0.02, onComplete: build });
      gsap.to($$(".skills__lines line"), { strokeDashoffset: 1, duration: 0.25 });
    } else build();
  }

  /* ---------------- Small helpers ---------------- */
  function clock() {
    const el = $(".hero__clock");
    const tick = () => {
      el.textContent = new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" }).format(new Date()) + " IST";
    };
    tick();
    setInterval(tick, 30000);
  }

  function menu(scrollTo) {
    const btn = $(".nav__burger"), m = $("#menu");
    const set = (open) => {
      btn.setAttribute("aria-expanded", open);
      btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      m.classList.toggle("is-open", open);
      m.setAttribute("aria-hidden", !open);
    };
    btn.addEventListener("click", () => set(btn.getAttribute("aria-expanded") !== "true"));
    $$("a", m).forEach((a) => a.addEventListener("click", () => set(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") set(false); });
    // Smooth anchor scrolling
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      const target = id === "#top" ? document.body : $(id);
      if (!target) return;
      e.preventDefault();
      scrollTo(target);
      if (id !== "#top") history.replaceState(null, "", id);
    });
  }

  function splitChars(el) {
    const txt = el.textContent;
    el.innerHTML = [...txt].map((c) => `<span class="char">${c === " " ? "&nbsp;" : esc(c)}</span>`).join("");
    return $$(".char", el);
  }
  function splitWords(el) {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w) => `<span class="word-wrap"><span class="word">${esc(w)}</span></span>`).join(" ");
    return $$(".word", el);
  }

  /* ---------------- Hero particles ---------------- */
  function particles() {
    const canvas = $(".hero__canvas");
    const ctx = canvas.getContext("2d");
    const mobile = window.innerWidth < 760;
    const count = mobile ? 38 : 90;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w, h, pts = [], running = true, raf;
    const mouse = { x: -9999, y: -9999 };
    function size() {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function seed() {
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.4, hue: Math.random() < 0.5 ? "59,130,246" : "139,92,246",
      }));
    }
    function frame() {
      ctx.clearRect(0, 0, w, h);
      const link = mobile ? 90 : 130;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < 22000) { const f = (22000 - d2) / 22000 * 0.6; p.vx += (dx / Math.sqrt(d2 + 1)) * f; p.vy += (dy / Math.sqrt(d2 + 1)) * f; }
        p.vx *= 0.96; p.vy *= 0.96;
        p.vx += (Math.random() - 0.5) * 0.02; p.vy += (Math.random() - 0.5) * 0.02;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0; if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.hue},.85)`; ctx.fill();
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j], ex = p.x - q.x, ey = p.y - q.y, e = Math.sqrt(ex * ex + ey * ey);
          if (e < link) {
            ctx.strokeStyle = `rgba(${p.hue},${(1 - e / link) * 0.22})`;
            ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
      }
      if (running) raf = requestAnimationFrame(frame);
    }
    size(); seed(); frame();
    window.addEventListener("resize", () => { size(); seed(); });
    canvas.parentElement.addEventListener("pointermove", (e) => {
      const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    canvas.parentElement.addEventListener("pointerleave", () => { mouse.x = mouse.y = -9999; });
    new IntersectionObserver(([en]) => {
      const vis = en.isIntersecting;
      if (vis && !running) { running = true; frame(); }
      if (!vis) { running = false; cancelAnimationFrame(raf); }
    }).observe(canvas);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) { running = false; cancelAnimationFrame(raf); }
      else if (!running) { running = true; frame(); }
    });
  }

  /* ---------------- Cursor + magnetic ---------------- */
  function cursor() {
    if (!finePointer) return;
    const c = $(".cursor"), dot = $(".cursor__dot"), ring = $(".cursor__ring"), label = $(".cursor__ring span");
    const xD = gsap.quickTo(dot, "x", { duration: 0.08 }), yD = gsap.quickTo(dot, "y", { duration: 0.08 });
    const xR = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3" }), yR = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3" });
    window.addEventListener("pointermove", (e) => { c.classList.add("is-ready"); xD(e.clientX); yD(e.clientY); xR(e.clientX); yR(e.clientY); });
    document.addEventListener("pointerover", (e) => {
      const v = e.target.closest("[data-cursor='view']");
      const l = e.target.closest("a, button");
      c.classList.toggle("is-view", !!v && !l);
      c.classList.toggle("is-link", !!l);
      label.textContent = v && !l ? (window.innerWidth > 960 ? "Scroll" : "View") : "";
    });
    $$(".magnetic").forEach((m) => {
      const xT = gsap.quickTo(m, "x", { duration: 0.6, ease: "elastic.out(1,0.4)" });
      const yT = gsap.quickTo(m, "y", { duration: 0.6, ease: "elastic.out(1,0.4)" });
      m.addEventListener("pointermove", (e) => {
        const r = m.getBoundingClientRect();
        xT((e.clientX - (r.left + r.width / 2)) * 0.3);
        yT((e.clientY - (r.top + r.height / 2)) * 0.35);
      });
      m.addEventListener("pointerleave", () => { xT(0); yT(0); });
    });
  }

  /* ---------------- 3D tilt ---------------- */
  function tilt(el, strength = 6) {
    if (!finePointer) return;
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3" });
    gsap.set(el, { transformPerspective: 1200 });
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * strength);
      rx(-((e.clientY - r.top) / r.height - 0.5) * strength);
    });
    el.addEventListener("pointerleave", () => { rx(0); ry(0); });
  }

  /* ---------------- Boot ---------------- */
  renderMarquee();
  renderProjects();
  renderJourney();
  renderSkillTabs();
  clock();

  // Scrub-text words (static colour when not animating)
  const scrub = $(".scrub-text");
  scrub.innerHTML = scrub.textContent.trim().split(/\s+/).map((w) => `<span class="w">${esc(w)}</span>`).join(" ");

  if (!animate) {
    $(".loader") && $(".loader").remove();
    showSkills(0, true);
    window.addEventListener("resize", layoutSkills);
    menu((t) => t.scrollIntoView({ behavior: reduced ? "auto" : "smooth" }));
    if (!reduced) particles();
    return;
  }

  root.classList.add("anim");
  gsap.registerPlugin(ScrollTrigger);

  // Smooth scroll
  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  menu((t) => (lenis ? lenis.scrollTo(t, { offset: 0, duration: 1.4 }) : t.scrollIntoView({ behavior: "smooth" })));

  const nameChars = splitChars($("[data-split]"));
  const wordGroups = $$(".split-words").map((el) => ({ el, words: splitWords(el) }));
  $$(".sport-title").forEach((el) => {
    el.innerHTML = el.innerHTML.split("<br>").map((line) => `<span class="word-wrap"><span class="word">${line}</span></span>`).join("<br>");
  });

  /* Loader → hero intro */
  const loaderEl = $(".loader");
  const count = { v: 0 };
  const intro = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } })
    .to(nameChars, { y: 0, duration: 1.4, stagger: 0.06 })
    .to(".hero__eyebrow", { opacity: 1, duration: 1 }, 0.3)
    .to(".reveal-line", { clipPath: "inset(0 0 0% 0)", y: 0, duration: 1.2, stagger: 0.12 }, 0.4)
    .to(".hero__row .reveal-up, .hero__ctas", { opacity: 1, y: 0, duration: 1.2, stagger: 0.1 }, 0.6);

  gsap.timeline({
    onComplete() {
      loaderEl.remove();
      lenis && lenis.start();
      ScrollTrigger.refresh();
    },
  })
    .to(".loader__name span", { y: 0, duration: 0.9, stagger: 0.06, ease: "expo.out" })
    .to(".loader__bar i", { scaleX: 1, duration: 1.5, ease: "power2.inOut" }, 0.2)
    .to(count, { v: 100, duration: 1.5, ease: "power2.inOut", onUpdate() { $(".loader__count b").textContent = Math.round(count.v); } }, 0.2)
    .to(".loader__name span", { y: "-110%", duration: 0.6, stagger: 0.04, ease: "expo.in" }, "+=0.1")
    .to(".loader__curtain", { scaleY: 1, duration: 0.6, ease: "expo.inOut" }, "-=0.35")
    .set(".loader__inner", { opacity: 0 })
    .set(".loader__curtain", { transformOrigin: "top" })
    .to(".loader__curtain", { scaleY: 0, duration: 0.8, ease: "expo.inOut" })
    .add(() => intro.play(), "-=0.5")
    .to(loaderEl, { autoAlpha: 0, duration: 0.01 });

  particles();
  cursor();

  /* Hero exit parallax */
  gsap.to(".hero__name", { yPercent: -35, scale: 0.92, opacity: 0.2, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.fromTo(".hero__content .hero__row, .hero__ctas", { y: 0, opacity: 1 }, { y: -80, opacity: 0, ease: "none", immediateRender: false, scrollTrigger: { trigger: ".hero", start: "30% top", end: "bottom top", scrub: true } });

  /* Section titles: word reveals */
  wordGroups.forEach(({ el, words }) => {
    gsap.from(words, { yPercent: 110, rotate: 4, duration: 1.1, ease: "expo.out", stagger: 0.06, scrollTrigger: { trigger: el, start: "top 88%" } });
  });
  $$(".sport-title").forEach((el) => {
    gsap.from($$(".word", el), { yPercent: 110, duration: 1.2, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: el, start: "top 85%" } });
  });
  $$(".section-label").forEach((el) => gsap.from(el, { opacity: 0, x: -30, duration: 1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%" } }));

  /* About: scroll-scrubbed words + photo parallax */
  gsap.to(".scrub-text .w", { color: "#f4f4f6", stagger: 0.1, ease: "none", scrollTrigger: { trigger: ".scrub-text", start: "top 80%", end: "bottom 45%", scrub: true } });
  gsap.fromTo(".about__frame", { clipPath: "inset(18% 12% 18% 12% round 20px)" }, { clipPath: "inset(0% 0% 0% 0% round 20px)", ease: "none", scrollTrigger: { trigger: ".about", start: "top 85%", end: "top 25%", scrub: true } });
  gsap.fromTo(".about__frame img", { yPercent: -12, scale: 1.15 }, { yPercent: 0, scale: 1, ease: "none", scrollTrigger: { trigger: ".about", start: "top bottom", end: "bottom top", scrub: true } });
  gsap.from(".about__facts > div, .about__philosophy li", { opacity: 0, y: 30, duration: 0.9, stagger: 0.08, ease: "expo.out", scrollTrigger: { trigger: ".about__facts", start: "top 85%" } });

  /* Skills */
  ScrollTrigger.create({ trigger: ".skills__stage", start: "top 75%", once: true, onEnter: () => showSkills(0, true) });
  window.addEventListener("resize", layoutSkills);
  const orbit = $("[data-skill-orbit]"), stage = $("[data-skill-stage]");
  if (finePointer) {
    gsap.set(orbit, { transformPerspective: 900 });
    const ox = gsap.quickTo(orbit, "rotationY", { duration: 1, ease: "power3" }), oy = gsap.quickTo(orbit, "rotationX", { duration: 1, ease: "power3" });
    stage.addEventListener("pointermove", (e) => {
      const r = stage.getBoundingClientRect();
      ox(((e.clientX - r.left) / r.width - 0.5) * 14);
      oy(-((e.clientY - r.top) / r.height - 0.5) * 14);
    });
    stage.addEventListener("pointerleave", () => { ox(0); oy(0); });
  }

  /* Work: horizontal gallery on desktop, stacked reveal on mobile */
  const mm = gsap.matchMedia();
  mm.add("(min-width: 961px)", () => {
    const track = $(".work__track");
    const dist = () => track.scrollWidth - window.innerWidth;
    const tween = gsap.to(track, { x: () => -dist(), ease: "none", scrollTrigger: {
      trigger: ".work__pin", start: "top top", end: () => "+=" + dist(), pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
    } });
    gsap.to(".work__progress i", { scaleX: 1, ease: "none", scrollTrigger: { trigger: ".work__pin", start: "top top", end: () => "+=" + dist(), scrub: true } });
    $$(".project").forEach((card) => {
      const inner = $(".project__visual-inner", card);
      if (inner) gsap.fromTo(inner, { xPercent: -8, scale: 1.12 }, { xPercent: 8, scale: 1, ease: "none", scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
      gsap.from($$(".project__name, .project__purpose, .project__features li, .project__stack span", card), {
        y: 30, opacity: 0, stagger: 0.03, duration: 0.8, ease: "expo.out",
        scrollTrigger: { trigger: card, containerAnimation: tween, start: "left 75%" },
      });
      tilt(card, 3);
    });
  });
  mm.add("(max-width: 960px)", () => {
    $$(".project").forEach((card) => gsap.from(card, { y: 60, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: card, start: "top 88%" } }));
  });

  /* Journey */
  gsap.to(".timeline__line i", { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".timeline", start: "top 70%", end: "bottom 60%", scrub: true } });
  $$(".tl").forEach((li) => {
    ScrollTrigger.create({ trigger: li, start: "top 70%", onEnter: () => li.classList.add("is-on"), onLeaveBack: () => li.classList.remove("is-on") });
    gsap.from(li.children, { x: 40, opacity: 0, duration: 1, stagger: 0.08, ease: "expo.out", scrollTrigger: { trigger: li, start: "top 82%" } });
  });
  gsap.from(".job", { y: 60, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".job", start: "top 85%" } });
  gsap.from(".job li", { x: 30, opacity: 0, duration: 0.8, stagger: 0.07, ease: "expo.out", scrollTrigger: { trigger: ".job ul", start: "top 85%" } });

  /* Football: pitch lines draw, ball rolls across */
  $$(".pitch__lines > *").forEach((el) => {
    const len = el.getTotalLength ? el.getTotalLength() : 0;
    if (len) gsap.fromTo(el, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: ".pitch", start: "top 80%", end: "center center", scrub: true } });
  });
  gsap.timeline({ scrollTrigger: { trigger: ".pitch", start: "top 60%", end: "bottom 20%", scrub: 1 } })
    .fromTo(".pitch__ball", { x: 0, y: 0, rotation: 0 }, { x: () => window.innerWidth * 0.48, y: () => -window.innerHeight * 0.28, rotation: 540, ease: "power1.inOut" })
    .to(".pitch__ball", { x: () => window.innerWidth * 0.8, y: () => -window.innerHeight * 0.05, rotation: 900, ease: "power1.in" });
  gsap.from(".pitch .lights i", { opacity: 0, scaleY: 0.3, stagger: 0.12, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: ".pitch", start: "top 60%" } });
  gsap.from(".pitch__copy p, .pitch__copy .pitch__tag", { opacity: 0, y: 30, duration: 1, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: ".pitch__copy", start: "top 80%" } });

  /* Cricket: ball comes in, bat swings, ball flies off */
  gsap.timeline({ scrollTrigger: { trigger: ".crease", start: "top 60%", end: "bottom 30%", scrub: 1 } })
    .fromTo(".crease__ball", { x: 0, y: 0, rotation: 0, scale: 0.6 }, { x: () => window.innerWidth * 0.6, y: () => window.innerHeight * 0.42, rotation: 720, scale: 1, ease: "power1.in", duration: 1 })
    .fromTo(".crease__bat", { rotation: 40 }, { rotation: -70, ease: "power4.in", duration: 0.35 }, 0.72)
    .to(".crease__ball", { x: () => window.innerWidth * 0.2, y: () => -window.innerHeight * 0.4, rotation: 1440, scale: 0.4, ease: "power2.out", duration: 0.9 }, 1);
  gsap.from(".crease .lights i", { opacity: 0, scaleY: 0.3, stagger: 0.12, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: ".crease", start: "top 60%" } });
  gsap.from(".crease__stumps i", { scaleY: 0, transformOrigin: "bottom", stagger: 0.08, duration: 1, ease: "back.out(2)", scrollTrigger: { trigger: ".crease", start: "top 55%" } });
  gsap.from(".crease__copy p, .crease__copy .pitch__tag", { opacity: 0, y: 30, duration: 1, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: ".crease__copy", start: "top 80%" } });

  /* Contact */
  gsap.from(".contact__lead, .contact__mail, .contact__links li", { opacity: 0, y: 40, duration: 1.1, stagger: 0.08, ease: "expo.out", scrollTrigger: { trigger: ".contact__lead", start: "top 88%" } });

  /* Nav hides on scroll down, returns on scroll up */
  const nav = $(".nav");
  ScrollTrigger.create({ start: 200, end: "max", onUpdate: (s) => gsap.to(nav, { yPercent: s.direction === 1 && !$("#menu").classList.contains("is-open") ? -120 : 0, duration: 0.5, ease: "power3.out", overwrite: true }) });

  // Recalculate once fonts and images settle
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { layoutSkills(); ScrollTrigger.refresh(); });
  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
