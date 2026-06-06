/* hero-crackle.js — cursor-triggered electric arcs over the command hero.
   ADDITIVE ONLY: does not touch command-hero.js or its pointer-tracking mechanic.
   Reads .command-node screen positions and draws lightning along the nearest traces
   as the cursor approaches. Hard-bails on touch + reduced-motion. Capped for 60fps. */
(() => {
  const hero = document.getElementById('heroCommand');
  if (!hero) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (reduceMotion || !finePointer) return; // base hero stays exactly as-is

  const canvas = hero.querySelector('.command-crackle');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const RADIUS = 210;        // px: how close the cursor must be to a node to light it
  const MAX_ARCS = 4;        // hard cap on lightning bolts per frame
  const SEG = 7;             // segments per bolt
  const CORE = '#e9f2fb';    // chrome-white core
  const GLOW = '58,159,213'; // brand blue (rgb for rgba())

  const nodeEls = Array.from(hero.querySelectorAll('.command-node'));
  if (!nodeEls.length) return;

  let heroRect = hero.getBoundingClientRect();
  let nodes = [];            // {x, y} in canvas/local px
  let neighbor = [];         // index of each node's nearest neighbor
  const pointer = { x: 0, y: 0, active: false };
  let running = false;
  let pulse = 0;             // global crackle intensity 0..1, decays when idle

  function sizeCanvas() {
    heroRect = hero.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(heroRect.width * DPR));
    canvas.height = Math.max(1, Math.round(heroRect.height * DPR));
    canvas.style.width = heroRect.width + 'px';
    canvas.style.height = heroRect.height + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function measureNodes() {
    heroRect = hero.getBoundingClientRect();
    nodes = nodeEls.map((el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2 - heroRect.left, y: r.top + r.height / 2 - heroRect.top };
    });
    // precompute nearest neighbour for each node (for "along the trace" arcs)
    neighbor = nodes.map((n, i) => {
      let best = -1, bestD = Infinity;
      for (let j = 0; j < nodes.length; j++) {
        if (j === i) continue;
        const dx = nodes[j].x - n.x, dy = nodes[j].y - n.y;
        const d = dx * dx + dy * dy;
        if (d < bestD) { bestD = d; best = j; }
      }
      return best;
    });
  }

  // deterministic-ish jitter that changes over time so the bolt "crackles"
  function drawBolt(x1, y1, x2, y2, t, intensity) {
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len, ny = dx / len; // perpendicular
    const amp = Math.min(18, len * 0.14) * intensity;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    for (let s = 1; s < SEG; s++) {
      const f = s / SEG;
      const wobble = Math.sin(f * 9 + t * 0.018 + s) * Math.cos(t * 0.011 + s * 2.3);
      const off = wobble * amp * (1 - Math.abs(f - 0.5) * 1.2);
      ctx.lineTo(x1 + dx * f + nx * off, y1 + dy * f + ny * off);
    }
    ctx.lineTo(x2, y2);

    // soft outer glow
    ctx.strokeStyle = 'rgba(' + GLOW + ',' + (0.5 * intensity).toFixed(3) + ')';
    ctx.lineWidth = 3.2;
    ctx.shadowColor = 'rgba(' + GLOW + ',0.9)';
    ctx.shadowBlur = 14;
    ctx.stroke();

    // bright thin core
    ctx.strokeStyle = 'rgba(233,242,251,' + (0.9 * intensity).toFixed(3) + ')';
    ctx.lineWidth = 1.1;
    ctx.shadowBlur = 4;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  function nodeFlash(n, intensity) {
    const r = 14;
    const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r);
    g.addColorStop(0, 'rgba(233,242,251,' + (0.7 * intensity).toFixed(3) + ')');
    g.addColorStop(0.4, 'rgba(' + GLOW + ',' + (0.5 * intensity).toFixed(3) + ')');
    g.addColorStop(1, 'rgba(' + GLOW + ',0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  let lastT = 0;
  function frame(t) {
    if (!lastT) lastT = t;
    lastT = t;

    // decay crackle when pointer not active; stop loop once dark
    if (!pointer.active) pulse = Math.max(0, pulse - 0.06);
    if (pulse <= 0.001 && !pointer.active) {
      ctx.clearRect(0, 0, heroRect.width, heroRect.height);
      running = false;
      return;
    }

    ctx.clearRect(0, 0, heroRect.width, heroRect.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // collect nodes within radius of the cursor, nearest first
    const near = [];
    for (let i = 0; i < nodes.length; i++) {
      const d = Math.hypot(nodes[i].x - pointer.x, nodes[i].y - pointer.y);
      if (d < RADIUS) near.push({ i, d });
    }
    near.sort((a, b) => a.d - b.d);

    let arcs = 0;
    for (let k = 0; k < near.length && arcs < MAX_ARCS; k++) {
      const { i, d } = near[k];
      const prox = (1 - d / RADIUS) * pulse;     // 0..1 strength for this node
      if (prox <= 0.02) continue;
      const n = nodes[i];

      // arc along the trace to the nearest neighbour
      const nb = neighbor[i];
      if (nb >= 0) { drawBolt(n.x, n.y, nodes[nb].x, nodes[nb].y, t + i * 50, prox); arcs++; }

      // faint arc from the cursor to the closest node (the "spark" from the spotlight)
      if (k === 0 && arcs < MAX_ARCS) { drawBolt(pointer.x, pointer.y, n.x, n.y, t + 17, prox * 0.8); arcs++; }

      nodeFlash(n, prox);
    }

    requestAnimationFrame(frame);
  }

  function ensureRunning() {
    if (!running) { running = true; requestAnimationFrame(frame); }
  }

  // --- pointer (own passive listeners; does not interfere with command-hero.js) ---
  hero.addEventListener('pointermove', (e) => {
    if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
    pointer.x = e.clientX - heroRect.left;
    pointer.y = e.clientY - heroRect.top;
    pointer.active = true;
    pulse = Math.min(1, pulse + 0.2);
    ensureRunning();
  }, { passive: true });

  hero.addEventListener('pointerleave', () => { pointer.active = false; }, { passive: true });

  // --- recompute geometry on resize / scroll (throttled via rAF) ---
  let geoQueued = false;
  function queueGeo() {
    if (geoQueued) return;
    geoQueued = true;
    requestAnimationFrame(() => { geoQueued = false; sizeCanvas(); measureNodes(); });
  }
  window.addEventListener('resize', queueGeo, { passive: true });
  window.addEventListener('scroll', () => {
    heroRect = hero.getBoundingClientRect();
  }, { passive: true });

  // init (wait a tick so the hero has laid out / fonts settled)
  function init() { sizeCanvas(); measureNodes(); }
  if (document.readyState === 'complete') { init(); }
  else { window.addEventListener('load', init); init(); }
})();
