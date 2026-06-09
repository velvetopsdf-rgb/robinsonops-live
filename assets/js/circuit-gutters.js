(function () {
  const media = window.matchMedia('(min-width: 901px) and (prefers-reduced-motion: no-preference)');
  let nodes = [];
  let raf = 0;
  let pointer = null;

  function collectNodes() {
    nodes = Array.from(document.querySelectorAll('.circuit-gutters .cg-node'));
  }

  function clearNodes() {
    nodes.forEach((node) => {
      node.style.removeProperty('--cg-boost');
      node.classList.remove('cg-active');
    });
    document.querySelector('.circuit-gutters')?.classList.remove('cg-hot');
  }

  function frame() {
    raf = 0;
    if (!pointer || !media.matches) {
      clearNodes();
      return;
    }

    let hot = false;
    const radius = 220;
    nodes.forEach((node) => {
      const rect = node.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const distance = Math.hypot(x - pointer.x, y - pointer.y);
      const boost = Math.max(0, 1 - distance / radius);

      if (boost > 0) hot = true;
      node.style.setProperty('--cg-boost', boost.toFixed(3));
      node.classList.toggle('cg-active', boost > 0.45);
    });

    document.querySelector('.circuit-gutters')?.classList.toggle('cg-hot', hot);
  }

  function requestFrame() {
    if (!raf) raf = window.requestAnimationFrame(frame);
  }

  function onPointerMove(event) {
    if (!media.matches) return;
    pointer = { x: event.clientX, y: event.clientY };
    requestFrame();
  }

  function onPointerLeave() {
    pointer = null;
    requestFrame();
  }

  function onMediaChange() {
    if (media.matches) {
      collectNodes();
    } else {
      pointer = null;
      clearNodes();
    }
  }

  collectNodes();
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerleave', onPointerLeave, { passive: true });
  window.addEventListener('resize', collectNodes, { passive: true });
  media.addEventListener?.('change', onMediaChange);
  onMediaChange();
})();
