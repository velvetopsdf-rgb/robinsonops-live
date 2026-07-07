/* ════════════════════════════════════════════════════════════════════════
   THROUGHLINE v2 — shared site behaviour: scroll reveals, nav state,
   mobile nav, mono count-up readouts. Reduced-motion aware.
   ════════════════════════════════════════════════════════════════════════ */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- nav: condense on scroll + mobile toggle ---- */
  const nav = document.querySelector('.site-nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const toggle = nav.querySelector('.nav-toggle');
    const links = nav.querySelector('.nav-links');
    if (toggle && links) {
      toggle.addEventListener('click', () => {
        const open = links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      links.querySelectorAll('a').forEach((a) =>
        a.addEventListener('click', () => links.classList.remove('open')));
    }
  }

  /* ---- scroll reveals (varied, never blocking content) ---- */
  const revs = document.querySelectorAll('.rv');
  if (reduce || !('IntersectionObserver' in window)) {
    revs.forEach((el) => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    revs.forEach((el) => io.observe(el));
  }

  /* ---- service card pointer sheen (sets --mx for the radial) ---- */
  document.querySelectorAll('.svc-card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    }, { passive: true });
  });

  /* ---- count-up readouts ---- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const run = (el) => {
      const target = parseFloat(el.dataset.count);
      const decimals = (el.dataset.decimals | 0);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      if (reduce) { el.textContent = prefix + target.toFixed(decimals) + suffix; return; }
      const dur = 1400; let start = 0;
      const step = (ts) => {
        if (!start) start = ts;
        const p = Math.min(1, (ts - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = prefix + target.toFixed(decimals) + suffix;
      };
      requestAnimationFrame(step);
    };
    if (!('IntersectionObserver' in window)) {
      counters.forEach(run);
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
      }, { threshold: 0.5 });
      counters.forEach((el) => io.observe(el));
    }
  }

  /* ---- current year ---- */
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ---- background videos (hero + deployment banner) ---- */
  document.querySelectorAll('video[data-bgvideo]').forEach((v) => {
    if (reduce) {
      // reduced motion: don't animate — pause and let the poster frame stand
      v.removeAttribute('autoplay');
      v.pause();
      return;
    }
    const tryPlay = () => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };
    v.addEventListener('playing', () => v.classList.add('playing'), { once: true });
    v.addEventListener('loadeddata', tryPlay, { once: true });
    tryPlay();
    // pause when fully offscreen to save battery / decode cost
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        entries.forEach((e) => { e.isIntersecting ? tryPlay() : v.pause(); });
      }, { threshold: 0.01 }).observe(v);
    }
  });
})();


/* V3 PASS 2 ALIVE INTERACTIONS */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  const surfaces = document.querySelectorAll('.v3-card, .v3-panel, .machine-card, .hw-img, .command-console');
  surfaces.forEach((surface) => {
    surface.addEventListener('pointermove', (event) => {
      const rect = surface.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      surface.style.setProperty('--mx', x.toFixed(2) + '%');
      surface.style.setProperty('--my', y.toFixed(2) + '%');
    }, { passive: true });
  });

  const nav = document.querySelector('.site-nav');
  if (nav) {
    let last = window.scrollY;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      nav.classList.toggle('nav-hidden', y > last && y > 140);
      last = y;
    }, { passive: true });
  }
})();
