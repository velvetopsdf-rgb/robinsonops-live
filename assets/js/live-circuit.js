/* ════════════════════════════════════════════════════════════════════════
   THE LIVE CIRCUIT — site-wide reactive circuit field (the signature)
   A fixed full-viewport canvas: jittered node grid + right-angle traces,
   a cursor spotlight that energizes the nearest nodes/traces, traveling
   light pulses (data moving through the system), intensifying on scroll.
   Performance: capped node count on small screens, single rAF, opacity/
   additive draws only. prefers-reduced-motion → no canvas at all.
   ════════════════════════════════════════════════════════════════════════ */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const canvas = document.getElementById('circuitField');
  if (!canvas || reduce.matches) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  let W = 0, H = 0, cols = 0, rows = 0;
  let nodes = [], edges = [], pulses = [];
  let raf = 0, running = false;

  // pointer (in CSS px), lerped for smooth spotlight travel
  const ptr = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false };
  let scrollK = 0; // 0..1 intensity from scroll depth

  const SIGNAL = [58, 159, 213];
  const BRIGHT = [123, 220, 255];

  function rand(a, b) { return a + Math.random() * (b - a); }

  function build() {
    const cssW = window.innerWidth;
    const cssH = window.innerHeight;
    W = cssW; H = cssH;
    canvas.width = Math.round(cssW * DPR);
    canvas.height = Math.round(cssH * DPR);
    canvas.style.width = cssW + 'px';
    canvas.style.height = cssH + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    // density: generous on desktop, capped on phones for perf
    const spacing = coarse ? 116 : (cssW < 1100 ? 104 : 92);
    cols = Math.ceil(cssW / spacing) + 2;
    rows = Math.ceil(cssH / spacing) + 2;

    nodes = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const jitter = spacing * 0.26;
        nodes.push({
          gx: c, gy: r,
          x: (c - 1) * spacing + rand(-jitter, jitter),
          y: (r - 1) * spacing + rand(-jitter, jitter),
          r: rand(1.1, 2.2),
          phase: rand(0, Math.PI * 2),
          energy: 0
        });
      }
    }

    // right-angle (circuit) traces between orthogonal neighbours.
    // L-shaped path via a midpoint so traces read as a circuit board, not a mesh.
    edges = [];
    const idx = (c, r) => r * cols + c;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const a = nodes[idx(c, r)];
        if (c < cols - 1 && Math.random() < 0.82) {
          const b = nodes[idx(c + 1, r)];
          edges.push(makeEdge(a, b, (c + r) % 2 === 0));
        }
        if (r < rows - 1 && Math.random() < 0.7) {
          const b = nodes[idx(c, r + 1)];
          edges.push(makeEdge(a, b, (c + r) % 2 === 1));
        }
      }
    }

    // seed pulses on a subset of edges
    const pulseCount = coarse ? 10 : Math.min(26, Math.round(edges.length * 0.03));
    pulses = [];
    for (let i = 0; i < pulseCount; i++) pulses.push(spawnPulse());
  }

  // an edge with an L-shaped midpoint; precompute the two leg lengths
  function makeEdge(a, b, horizFirst) {
    const mid = horizFirst ? { x: b.x, y: a.y } : { x: a.x, y: b.y };
    const l1 = Math.hypot(mid.x - a.x, mid.y - a.y);
    const l2 = Math.hypot(b.x - mid.x, b.y - mid.y);
    return { a, b, mid, l1, l2, len: l1 + l2 };
  }

  function spawnPulse() {
    const e = edges[(Math.random() * edges.length) | 0];
    return { e, t: Math.random(), speed: rand(0.0016, 0.0042) };
  }

  // position along an L-shaped edge at param t (0..1)
  function edgePoint(e, t) {
    const d = t * e.len;
    if (d <= e.l1) {
      const k = e.l1 === 0 ? 0 : d / e.l1;
      return { x: e.a.x + (e.mid.x - e.a.x) * k, y: e.a.y + (e.mid.y - e.a.y) * k };
    }
    const k = e.l2 === 0 ? 0 : (d - e.l1) / e.l2;
    return { x: e.mid.x + (e.b.x - e.mid.x) * k, y: e.mid.y + (e.b.y - e.mid.y) * k };
  }

  function rgba(c, a) { return `rgba(${c[0]},${c[1]},${c[2]},${a})`; }

  let t0 = 0;
  function frame(ts) {
    if (!running) return;
    if (!t0) t0 = ts;
    const time = ts * 0.001;

    // lerp pointer toward target
    ptr.x += (ptr.tx - ptr.x) * 0.14;
    ptr.y += (ptr.ty - ptr.y) * 0.14;

    ctx.clearRect(0, 0, W, H);

    const radius = 240;
    const baseTrace = 0.05 + scrollK * 0.04;

    // ---- traces ----
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (let i = 0; i < edges.length; i++) {
      const e = edges[i];
      let glow = 0;
      if (ptr.active) {
        const mx = (e.a.x + e.b.x) / 2, my = (e.a.y + e.b.y) / 2;
        const dist = Math.hypot(mx - ptr.x, my - ptr.y);
        glow = Math.max(0, 1 - dist / radius);
      }
      const a = baseTrace + glow * 0.5;
      if (a <= 0.012) continue;
      ctx.beginPath();
      ctx.moveTo(e.a.x, e.a.y);
      ctx.lineTo(e.mid.x, e.mid.y);
      ctx.lineTo(e.b.x, e.b.y);
      ctx.strokeStyle = glow > 0.15 ? rgba(BRIGHT, a) : rgba(SIGNAL, a);
      ctx.lineWidth = 1 + glow * 0.8;
      ctx.stroke();
    }

    // ---- nodes ----
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      let glow = 0;
      if (ptr.active) {
        const dist = Math.hypot(n.x - ptr.x, n.y - ptr.y);
        glow = Math.max(0, 1 - dist / radius);
      }
      n.energy += (glow - n.energy) * 0.18;
      const breathe = 0.5 + 0.5 * Math.sin(time * 1.1 + n.phase);
      const a = 0.18 + breathe * 0.12 + n.energy * 0.7 + scrollK * 0.05;
      const rr = n.r * (1 + n.energy * 1.4);
      const col = n.energy > 0.25 ? BRIGHT : SIGNAL;
      if (n.energy > 0.04) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, rr * 3.4, 0, Math.PI * 2);
        ctx.fillStyle = rgba(col, n.energy * 0.16);
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(n.x, n.y, rr, 0, Math.PI * 2);
      ctx.fillStyle = rgba(col, Math.min(0.95, a));
      ctx.fill();
    }

    // ---- traveling pulses ----
    const speedK = 1 + scrollK * 1.6;
    for (let i = 0; i < pulses.length; i++) {
      const p = pulses[i];
      p.t += p.speed * speedK;
      if (p.t >= 1) { pulses[i] = spawnPulse(); continue; }
      const pt = edgePoint(p.e, p.t);
      const g = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, 9);
      g.addColorStop(0, rgba(BRIGHT, 0.95));
      g.addColorStop(0.4, rgba(SIGNAL, 0.5));
      g.addColorStop(1, rgba(SIGNAL, 0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 2.1, 0, Math.PI * 2);
      ctx.fillStyle = rgba([220, 244, 255], 0.95);
      ctx.fill();
    }

    // ---- cursor spotlight (ambient radial glow) ----
    if (ptr.active) {
      const g = ctx.createRadialGradient(ptr.x, ptr.y, 0, ptr.x, ptr.y, radius * 1.05);
      g.addColorStop(0, rgba(SIGNAL, 0.10));
      g.addColorStop(0.5, rgba(SIGNAL, 0.04));
      g.addColorStop(1, rgba(SIGNAL, 0));
      ctx.fillStyle = g;
      ctx.fillRect(ptr.x - radius * 1.1, ptr.y - radius * 1.1, radius * 2.2, radius * 2.2);
    }

    raf = requestAnimationFrame(frame);
  }

  function start() { if (!running) { running = true; t0 = 0; raf = requestAnimationFrame(frame); } }
  function stop() { running = false; cancelAnimationFrame(raf); }

  // ---- events ----
  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 180);
  });

  window.addEventListener('pointermove', (e) => {
    ptr.tx = e.clientX; ptr.ty = e.clientY; ptr.active = true;
  }, { passive: true });
  window.addEventListener('pointerleave', () => { ptr.active = false; });
  window.addEventListener('blur', () => { ptr.active = false; });

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollK = Math.min(1, window.scrollY / max);
      ticking = false;
    });
  }, { passive: true });

  // pause when tab hidden (battery / perf)
  document.addEventListener('visibilitychange', () => { document.hidden ? stop() : start(); });

  build();
  canvas.classList.add('live');
  start();
})();
