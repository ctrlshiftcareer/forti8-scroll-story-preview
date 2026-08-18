/* Forti8 scroll-story. Scroll progress drives transforms. No video scrub. */
(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  const smallMQ = window.matchMedia("(max-width: 900px)");

  const BEATS = [
    {
      id: "chaos",
      kicker: "01 — Today",
      title: "Your business has grown, but your processes haven’t.",
      lede: "Excel. Word. Email. WhatsApp. Approvals sitting in someone’s inbox. The same data, typed again.",
      line: "",
      cta: false,
      plate: 0,
      linger: 0.42,
    },
    {
      id: "study",
      kicker: "02 — Study",
      title: "We study how your company actually works.",
      lede: "Not the org chart. The real path from request to done — including the steps nobody wrote down.",
      line: "",
      cta: false,
      plate: 1,
      linger: 0.36,
    },
    {
      id: "auto",
      kicker: "03 — Cut",
      title: "We identify what should be automated.",
      lede: "Bottlenecks leave. Connections stay. What remains is the work that actually needs a person.",
      line: "",
      cta: false,
      plate: 1,
      linger: 0.32,
    },
    {
      id: "assemble",
      kicker: "04 — Build",
      title: "We build your system around your company.",
      lede: "Ops platform. Workflow. Document generation. AI inside the process. A dashboard you own.",
      line: "",
      cta: false,
      plate: 2,
      linger: 0.38,
    },
    {
      id: "morph",
      kicker: "05 — Proof",
      title: "Before you commit, we can build the demo.",
      lede: "Bring the deck. We turn it into a working interface you can click before you buy.",
      line: "Don’t imagine your software. See it.",
      cta: false,
      plate: 3,
      linger: 0.4,
    },
    {
      id: "finish",
      kicker: "06 — Start",
      title: "Show us the process you hate doing manually.",
      lede: "We’ll show you what it could become.",
      line: "",
      cta: true,
      plate: 5,
      linger: 0.22,
    },
  ];

  const LABELS = {
    chaos: {
      excel: ["Excel", "Q3_ops.xlsx · 14 tabs", "Manual"],
      word: ["Word", "SOP_approvals.docx", "Manual"],
      email: ["Email", "Re: still pending?", "Inbox"],
      wa: ["WhatsApp", "47 unread · “did you approve?”", "Chat"],
      approval: ["Approval", "Waiting on finance", "Stuck"],
      dup: ["Duplicated data", "SKU listed 3×", "Drift"],
      drive: ["Shared drive", "/ops/final_v7_REAL", "Lost"],
      cal: ["Meetings", "12 status calls / week", "Tax"],
    },
    study: {
      excel: ["Request in", "Customer sends the order", "Step 1"],
      word: ["Intake", "Logged by whoever is free", "Step 2"],
      email: ["Quote", "Built in a spreadsheet", "Step 3"],
      wa: ["Approve", "Finance, then ops", "Step 4"],
      approval: ["Fulfill", "Warehouse + carrier", "Step 5"],
      dup: ["Invoice", "Re-typed from the quote", "Step 6"],
      drive: ["Exception", "Someone hunts the file", "Step 7"],
      cal: ["Close", "Status meeting to confirm", "Step 8"],
    },
  };

  // [x%, y%, rotate, scale] — percent of canvas, chip top-left
  const POS = {
    chaos: {
      excel:    [2,  6,  -8, 1],
      word:     [58, 3,   7, 1],
      email:    [28, 36, -3, 1],
      wa:       [70, 30, 11, 1],
      approval: [8,  64,  5, 1],
      dup:      [44, 70, -10, 1],
      drive:    [74, 66,  6, 1],
      cal:      [4,  38, -12, 1],
    },
    study: {
      excel:    [4,  14, 0, 1],
      word:     [28, 14, 0, 1],
      email:    [52, 14, 0, 1],
      wa:       [76, 14, 0, 1],
      approval: [4,  58, 0, 1],
      dup:      [28, 58, 0, 1],
      drive:    [52, 58, 0, 1],
      cal:      [76, 58, 0, 1],
    },
    auto: {
      excel:    [4,  14, 0, 1],
      word:     [28, 14, 0, 1],
      email:    [52, 14, 0, 1],
      wa:       [76, 18, 0, 0.78],
      approval: [4,  58, 0, 1],
      dup:      [28, 58, 0, 1],
      drive:    [52, 62, 0, 0.78],
      cal:      [76, 58, 0, 1],
    },
    assemble: {
      excel:    [8,  18, 0, 0.7],
      word:     [22, 18, 0, 0.7],
      email:    [38, 22, 0, 0.65],
      wa:       [58, 22, 0, 0.55],
      approval: [8,  48, 0, 0.7],
      dup:      [28, 50, 0, 0.65],
      drive:    [54, 52, 0, 0.5],
      cal:      [72, 48, 0, 0.55],
    },
    morph: {
      excel:    [50, 50, 0, 0.2],
      word:     [50, 50, 0, 0.2],
      email:    [50, 50, 0, 0.2],
      wa:       [50, 50, 0, 0.2],
      approval: [50, 50, 0, 0.2],
      dup:      [50, 50, 0, 0.2],
      drive:    [50, 50, 0, 0.2],
      cal:      [50, 50, 0, 0.2],
    },
    finish: {
      excel:    [50, 50, 0, 0.2],
      word:     [50, 50, 0, 0.2],
      email:    [50, 50, 0, 0.2],
      wa:       [50, 50, 0, 0.2],
      approval: [50, 50, 0, 0.2],
      dup:      [50, 50, 0, 0.2],
      drive:    [50, 50, 0, 0.2],
      cal:      [50, 50, 0, 0.2],
    },
  };

  const EDGE = {
    study: [
      ["excel", "word"],
      ["word", "email"],
      ["email", "wa"],
      ["excel", "approval"],
      ["approval", "dup"],
      ["dup", "drive"],
      ["drive", "cal"],
      ["wa", "cal"],
    ],
    autoKeep: [
      ["excel", "word"],
      ["word", "email"],
      ["email", "cal"],
      ["excel", "approval"],
      ["approval", "dup"],
      ["dup", "cal"],
    ],
    autoCut: [
      ["email", "wa"],
      ["drive", "cal"],
    ],
  };

  const AI = [
    "Extracting line items from the order…",
    "Drafting the packing list from PO-1831…",
    "Flagged one missing HS code — routed to ops.",
    "Documents generated. Ready to send.",
  ];

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const track = $("#track");
  const stage = $("#stage");
  const canvas = $("#canvas");
  const bar = $("#bar");
  const topbar = $(".top");
  const kicker = $("#kicker");
  const headline = $("#headline");
  const lede = $("#lede");
  const line = $("#line");
  const cta = $("#cta");
  const hint = $("#hint");
  const copycol = $(".copycol");
  const system = $("#system");
  const paper = $("#paper");
  const ui = $("#ui");
  const chips = $$(".chip");
  const plates = $$(".plate");
  const dots = $$("[data-dot]");
  const wires = $$("#wires path");
  const cards = $$(".card");
  const bars = $$(".bars i");
  const kpi1 = $("#kpi1");
  const kpi2 = $("#kpi2");
  const aiLine = $("#aiLine");

  const chipMap = Object.fromEntries(chips.map((el) => [el.dataset.chip, el]));

  let beatIdx = 0;
  let lastCopy = -1;
  let ticking = false;
  let lastW = innerWidth;
  let progress = 0;

  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  function lingerMap(t, amt) {
    if (amt <= 0) return t;
    const s = t * t * (3 - 2 * t);
    return t * (1 - amt) + s * amt;
  }
  function mixPos(a, b, t) {
    return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t), lerp(a[3], b[3], t)];
  }

  function ranges() {
    // Assemble + morph get more scroll; finish a little less.
    const w = [1.15, 1.15, 1.05, 1.45, 1.35, 0.95];
    const sum = w.reduce((s, n) => s + n, 0);
    let c = 0;
    return w.map((n) => {
      const from = c / sum;
      c += n;
      return [from, c / sum];
    });
  }
  const R = ranges();

  function at(p) {
    if (p <= 0) return { i: 0, t: 0, local: 0 };
    if (p >= 1) return { i: 5, t: 1, local: 1 };
    for (let i = 0; i < R.length; i++) {
      const [a, b] = R[i];
      if (p < b || i === R.length - 1) {
        const raw = clamp((p - a) / (b - a), 0, 1);
        const local = lingerMap(raw, BEATS[i].linger);
        return { i, t: raw, local };
      }
    }
    return { i: 5, t: 1, local: 1 };
  }

  function setCopy(i) {
    if (i === lastCopy) return;
    lastCopy = i;
    const b = BEATS[i];
    copycol.classList.add("is-swap");
    const apply = () => {
      kicker.textContent = b.kicker;
      headline.textContent = b.title;
      lede.textContent = b.lede;
      if (b.line) {
        line.hidden = false;
        line.textContent = b.line;
      } else {
        line.hidden = true;
      }
      cta.hidden = !b.cta;
      hint.style.display = i === 0 && !reduce ? "" : "none";
      copycol.classList.remove("is-swap");
    };
    if (reduce) apply();
    else setTimeout(apply, 160);
    dots.forEach((d, n) => d.classList.toggle("is-on", n === i));
  }

  function setLabels(mode) {
    const pack = LABELS[mode] || LABELS.study;
    chips.forEach((el) => {
      const row = pack[el.dataset.chip];
      if (!row) return;
      el.querySelector(".chip-name").textContent = row[0];
      el.querySelector(".chip-meta").textContent = row[1];
      el.querySelector(".chip-tag").textContent = row[2];
    });
  }

  function place(el, pos, extra = {}) {
    const [x, y, r, s] = pos;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const px = (x / 100) * w + (extra.ox || 0);
    const py = (y / 100) * h + (extra.oy || 0);
    const op = extra.op == null ? 1 : extra.op;
    el.style.transform = `translate3d(${px}px, ${py}px, 0) rotate(${r}deg) scale(${s})`;
    el.style.opacity = String(op);
  }

  function holdThenGo(local, hold) {
    const h = hold == null ? 0.52 : hold;
    if (local <= h) return 0;
    return ease((local - h) / (1 - h));
  }

  function nodePt(pos, id) {
    const row = pos[id];
    if (!row) return null;
    const [x, y, , s] = row;
    // Chip top-left in % of canvas → viewBox 1000×620, plus half-chip.
    return { x: (x / 100) * 1000 + 94 * (s || 1), y: (y / 100) * 620 + 28 * (s || 1) };
  }

  function drawWire(path, a, b, t, rust) {
    if (!a || !b || t <= 0.001) {
      path.style.opacity = "0";
      return;
    }
    const midX = (a.x + b.x) / 2;
    const d = `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} C ${midX.toFixed(1)} ${a.y.toFixed(1)}, ${midX.toFixed(1)} ${b.y.toFixed(1)}, ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
    path.setAttribute("d", d);
    const len = Math.max(48, Math.hypot(b.x - a.x, b.y - a.y) * 1.2);
    path.style.strokeDasharray = String(len);
    path.style.strokeDashoffset = String(len * (1 - t));
    path.style.opacity = String(0.35 + 0.5 * t);
    path.classList.toggle("wire-cut", !!rust);
  }

  function updateWires(i, local, pose) {
    wires.forEach((p) => { p.style.opacity = "0"; });
    if (i < 1 || !pose) return;

    if (i === 1) {
      EDGE.study.forEach((pair, n) => {
        const t = clamp((local - n * 0.07) / 0.45, 0, 1);
        drawWire(wires[n], nodePt(pose, pair[0]), nodePt(pose, pair[1]), ease(t), false);
      });
      return;
    }

    if (i === 2) {
      EDGE.autoKeep.forEach((pair, n) => {
        drawWire(wires[n], nodePt(pose, pair[0]), nodePt(pose, pair[1]), 1, false);
      });
      EDGE.autoCut.forEach((pair, n) => {
        const fade = 1 - ease(clamp(local * 1.4, 0, 1));
        drawWire(wires[6 + n], nodePt(pose, pair[0]), nodePt(pose, pair[1]), fade, true);
      });
      // new shortcuts appear
      const shortcutT = ease(clamp((local - 0.25) / 0.55, 0, 1));
      drawWire(wires[8], nodePt(pose, "email"), nodePt(pose, "cal"), shortcutT, true);
      drawWire(wires[9], nodePt(pose, "dup"), nodePt(pose, "cal"), shortcutT, true);
      return;
    }

    if (i === 3) {
      const fade = 1 - ease(clamp(local * 1.6, 0, 1));
      EDGE.autoKeep.forEach((pair, n) => {
        drawWire(wires[n], nodePt(pose, pair[0]), nodePt(pose, pair[1]), fade, false);
      });
    }
  }

  function applySystem(i, local) {
    const mobile = smallMQ.matches;
    if (i < 3) {
      system.style.opacity = "0";
      system.style.pointerEvents = "none";
      system.setAttribute("aria-hidden", "true");
      paper.style.opacity = "0";
      cards.forEach((c) => { c.style.opacity = "0"; c.style.transform = "translateY(10px)"; });
      bars.forEach((b) => b.style.setProperty("--bar", "0"));
      return;
    }

    system.setAttribute("aria-hidden", "false");

    if (i === 3) {
      const t = ease(local);
      const s = lerp(0.86, 1, t);
      system.style.opacity = String(clamp(t * 1.25, 0, 1));
      system.style.transform = `translate(-50%, -50%) scale(${s})`;
      paper.style.opacity = "0";
      ui.style.opacity = "1";
      populateUI(t);
      return;
    }

    if (i === 4) {
      // Document covers, then becomes the UI.
      const cover = ease(clamp(local / 0.28, 0, 1));
      const reveal = ease(clamp((local - 0.32) / 0.58, 0, 1));
      system.style.opacity = "1";
      const s = lerp(1, mobile ? 1 : 1.02, reveal);
      system.style.transform = `translate(-50%, -50%) scale(${s})`;
      paper.style.opacity = String(cover * (1 - reveal));
      ui.style.opacity = "1";
      populateUI(1);
      return;
    }

    // finish
    system.style.opacity = "1";
    system.style.transform = "translate(-50%, -50%) scale(1)";
    paper.style.opacity = "0";
    ui.style.opacity = "1";
    populateUI(1);
  }

  function populateUI(t) {
    cards.forEach((c, n) => {
      const ct = clamp((t - 0.18 - n * 0.08) / 0.28, 0, 1);
      c.style.opacity = String(ct);
      c.style.transform = `translateY(${lerp(12, 0, ct)}px)`;
    });
    bars.forEach((b) => b.style.setProperty("--bar", String(ease(clamp((t - 0.45) / 0.4, 0, 1)))));
    if (kpi1) kpi1.textContent = String(Math.round(lerp(11, 2.4, ease(clamp((t - 0.5) / 0.45, 0, 1))) * 10) / 10);
    if (kpi2) kpi2.textContent = `${Math.round(lerp(18, 81, ease(clamp((t - 0.5) / 0.45, 0, 1))))}%`;
    if (aiLine) {
      const idx = clamp(Math.floor(t * AI.length), 0, AI.length - 1);
      aiLine.textContent = AI[idx];
    }
  }

  function applyPlates(i, local) {
    const here = BEATS[i].plate;
    const next = BEATS[Math.min(i + 1, 5)].plate;
    plates.forEach((p) => {
      const n = +p.dataset.plate;
      let op = 0;
      if (n === here) op = 0.16 * (1 - local * 0.35);
      if (n === next && next !== here) op = Math.max(op, 0.16 * local);
      if (i >= 4 && n === 5) op = Math.max(op, 0.14);
      p.style.opacity = String(op);
    });
  }

  function apply(p) {
    progress = p;
    const { i, local } = at(p);
    beatIdx = i;
    setCopy(i);
    applyPlates(i, local);

    const mode = i === 0 ? "chaos" : "study";
    setLabels(mode);

    const fromKey = BEATS[i].id;
    const toKey = BEATS[Math.min(i + 1, 5)].id;
    const A = POS[fromKey];
    const B = POS[toKey];
    const go = holdThenGo(local, i === 3 ? 0.62 : 0.52);

    chips.forEach((el) => {
      const id = el.dataset.chip;
      const pos = i >= 4 ? POS.morph[id] : mixPos(A[id], B[id], go);
      let op = 1;
      if (i === 2 && el.dataset.bottleneck) {
        op = lerp(1, 0.28, ease(local));
        el.classList.add("is-bottleneck", "is-gone");
      } else {
        el.classList.remove("is-gone");
        if (i === 2) el.classList.remove("is-bottleneck");
        else el.classList.toggle("is-bottleneck", i > 2 && !!el.dataset.bottleneck);
      }
      if (i === 3) op = lerp(el.dataset.bottleneck ? 0.28 : 1, 0, ease(local));
      if (i >= 4) op = 0;
      if (i === 0) {
        // slight drift in the mess
        const drift = Math.sin((p * 18 + el.dataset.node) ) * 4;
        place(el, pos, { oy: drift, op });
      } else {
        place(el, pos, { op });
      }
    });

    applySystem(i, local);
    updateWires(i, local, A);

    bar.style.width = `${(p * 100).toFixed(2)}%`;
    topbar.classList.toggle("is-on", p > 0.01);
  }

  function measure() {
    const max = Math.max(1, track.offsetHeight - innerHeight);
    return clamp(scrollY / max, 0, 1);
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      apply(measure());
    });
  }

  function onResize() {
    // Ignore URL-bar-only height changes on touch (no jump).
    if (coarse && Math.abs(innerWidth - lastW) < 2) return;
    lastW = innerWidth;
    apply(measure());
  }

  if (reduce) {
    document.documentElement.classList.add("reduce");
    // Static stacked reading: snap each beat as you pass it, no interpolation.
    const snap = () => {
      const p = measure();
      const { i } = at(p);
      apply(R[i][0] + (R[i][1] - R[i][0]) * 0.4);
      setCopy(i);
    };
    addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { ticking = false; snap(); });
    }, { passive: true });
    addEventListener("resize", onResize, { passive: true });
    snap();
    return;
  }

  const qp = new URLSearchParams(location.search);
  const lockP = qp.has("p") ? clamp(+qp.get("p"), 0, 1) : null;
  addEventListener("scroll", () => { if (lockP == null) onScroll(); }, { passive: true });
  addEventListener("resize", onResize, { passive: true });
  apply(lockP == null ? measure() : lockP);
})();
