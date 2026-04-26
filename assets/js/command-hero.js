(() => {
  const hero = document.getElementById('heroCommand');
  if (!hero) return;

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointerQuery = window.matchMedia('(pointer: fine)');
  const debugEnabled = new URLSearchParams(window.location.search).get('heroDebug') === '1';

  const settings = {
    bootSequenceDurationMs: 2100,
    circuitPulseSpeedMs: 4700,
    shimmerIntervalMs: 6800,
    cursorGlowRadiusPx: 340,
    cursorGlowOpacity: 0.55,
    pointerGlowStrength: 1.85,
    staticInterferenceOpacity: 0.24,
    staticMaskRadiusPx: 280,
    parallaxStrengthPx: 30,
    blueBloomIntensity: 0.78,
    nodePulseFrequencyMs: 2800,
    nodeActivationRadiusPx: 420,
    nodePulseStrength: 1.8,
    circuitGlowStrength: 1.45,
    magneticRadiusPx: 220,
    ctaMagneticStrength: 1.35
  };

  const trackingActive = !motionQuery.matches && finePointerQuery.matches;
  let debugBadge = null;

  if (debugEnabled) {
    debugBadge = document.createElement('div');
    debugBadge.className = 'command-debug-badge';
    hero.appendChild(debugBadge);
  }

  const updateDebug = (label = 'idle') => {
    if (!debugBadge) return;
    debugBadge.textContent = [
      'command-hero.js loaded',
      `pointer tracking: ${trackingActive ? 'active' : 'inactive'}`,
      `reduced motion: ${motionQuery.matches}`,
      `pointer: ${label}`
    ].join('\n');
  };

  hero.style.setProperty('--boot-sequence-duration', `${settings.bootSequenceDurationMs}ms`);
  hero.style.setProperty('--circuit-pulse-speed', `${settings.circuitPulseSpeedMs}ms`);
  hero.style.setProperty('--route-b-delay', `${Math.round(settings.circuitPulseSpeedMs * -0.42)}ms`);
  hero.style.setProperty('--route-c-delay', `${Math.round(settings.circuitPulseSpeedMs * -0.2)}ms`);
  hero.style.setProperty('--route-d-delay', `${Math.round(settings.circuitPulseSpeedMs * -0.66)}ms`);
  hero.style.setProperty('--shimmer-interval', `${settings.shimmerIntervalMs}ms`);
  hero.style.setProperty('--cursor-glow-radius', `${settings.cursorGlowRadiusPx}px`);
  hero.style.setProperty('--cursor-glow-opacity', settings.cursorGlowOpacity.toFixed(2));
  hero.style.setProperty('--static-mask-radius', `${settings.staticMaskRadiusPx}px`);
  hero.style.setProperty('--pointer-glow-strength', settings.pointerGlowStrength);
  hero.style.setProperty('--static-interference-opacity', settings.staticInterferenceOpacity);
  hero.style.setProperty('--static-intensity', settings.staticInterferenceOpacity);
  hero.style.setProperty('--parallax-strength', `${settings.parallaxStrengthPx}px`);
  hero.style.setProperty('--blue-bloom-intensity', settings.blueBloomIntensity);
  hero.style.setProperty('--blue-bloom-primary', (settings.blueBloomIntensity * 0.28).toFixed(3));
  hero.style.setProperty('--blue-bloom-secondary', (settings.blueBloomIntensity * 0.22).toFixed(3));
  hero.style.setProperty('--pointer-glow-primary', (settings.pointerGlowStrength * 0.22).toFixed(3));
  hero.style.setProperty('--pointer-glow-secondary', (settings.pointerGlowStrength * 0.11).toFixed(3));
  hero.style.setProperty('--pointer-glow-hot', (settings.pointerGlowStrength * 0.13).toFixed(3));
  hero.style.setProperty('--pointer-glow-outer', (settings.pointerGlowStrength * 0.06).toFixed(3));
  hero.style.setProperty('--node-pulse-frequency', `${settings.nodePulseFrequencyMs}ms`);
  hero.style.setProperty('--circuit-base-alpha', '0.34');
  hero.style.setProperty('--circuit-field-glow', '18px');
  hero.style.setProperty('--circuit-flow-alpha', '0.92');
  hero.style.setProperty('--circuit-flow-width', '2.8');
  hero.style.setProperty('--circuit-activation-radius', `${settings.nodeActivationRadiusPx}px`);
  hero.style.setProperty('--circuit-glow-strength', settings.circuitGlowStrength);
  hero.style.setProperty('--node-pulse-strength', settings.nodePulseStrength);
  hero.style.setProperty('--cta-magnetic-strength', settings.ctaMagneticStrength);

  requestAnimationFrame(() => {
    hero.classList.add('command-ready');
  });

  updateDebug('inactive');

  if (!hero.querySelector('.command-cursor-corona')) {
    const corona = document.createElement('div');
    corona.className = 'command-cursor-corona';
    corona.setAttribute('aria-hidden', 'true');
    hero.appendChild(corona);
  }

  if (!trackingActive) {
    hero.classList.add('command-static');
    return;
  }

  const parallaxLayers = Array.from(hero.querySelectorAll('.js-parallax'));
  const nodes = Array.from(hero.querySelectorAll('.command-node'));
  const ctas = Array.from(hero.querySelectorAll('.command-cta'));

  const state = {
    active: false,
    pointerX: 0,
    pointerY: 0,
    lastPointerX: 0,
    lastPointerY: 0,
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    motion: 0,
    raf: 0,
    burstTimer: 0
  };

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const setPointerVars = (rect, event) => {
    state.pointerX = event.clientX;
    state.pointerY = event.clientY;

    const localX = event.clientX - rect.left;
    const localY = event.clientY - rect.top;
    const normalX = localX / rect.width - 0.5;
    const normalY = localY / rect.height - 0.5;
    const movement = Math.hypot(
      event.clientX - state.lastPointerX,
      event.clientY - state.lastPointerY
    );

    state.lastPointerX = event.clientX;
    state.lastPointerY = event.clientY;
    state.targetX = normalX * settings.parallaxStrengthPx;
    state.targetY = normalY * settings.parallaxStrengthPx;
    state.motion = clamp(state.motion + movement / 52, 0, 1);

    hero.style.setProperty('--pointer-x', `${localX}px`);
    hero.style.setProperty('--pointer-y', `${localY}px`);
    hero.style.setProperty('--pointer-active', '1');
    hero.style.setProperty('--pointer-field-opacity', settings.cursorGlowOpacity.toFixed(2));
    hero.style.setProperty('--pointer-motion', state.motion.toFixed(3));
    hero.style.setProperty('--static-field-opacity', (state.motion * settings.staticInterferenceOpacity).toFixed(3));
    hero.style.setProperty('--corona-opacity', (0.22 + state.motion * 0.74).toFixed(3));
    hero.style.setProperty('--corona-scale', (0.86 + state.motion * 0.28).toFixed(3));
    hero.style.setProperty('--circuit-base-alpha', (0.34 + state.motion * 0.36 * settings.circuitGlowStrength).toFixed(3));
    hero.style.setProperty('--circuit-field-glow', `${(18 + state.motion * 46 * settings.circuitGlowStrength).toFixed(1)}px`);
    hero.style.setProperty('--circuit-flow-alpha', (0.92 + state.motion * 0.08).toFixed(3));
    hero.style.setProperty('--circuit-flow-width', (2.8 + state.motion * 1.8).toFixed(2));
    hero.style.setProperty('--tilt-x', `${clamp(normalX * 6.8, -6.8, 6.8)}deg`);
    hero.style.setProperty('--tilt-y', `${clamp(normalY * -5.8, -5.8, 5.8)}deg`);

    hero.classList.add('command-pointer-active', 'command-pointer-burst');
    window.clearTimeout(state.burstTimer);
    state.burstTimer = window.setTimeout(() => {
      hero.classList.remove('command-pointer-burst');
    }, 180);

    updateDebug(`active x=${Math.round(localX)} y=${Math.round(localY)}`);
  };

  const updateNodes = () => {
    nodes.forEach((node) => {
      const rect = node.getBoundingClientRect();
      const nodeX = rect.left + rect.width / 2;
      const nodeY = rect.top + rect.height / 2;
      const distance = Math.hypot(nodeX - state.pointerX, nodeY - state.pointerY);
      const boost = state.active
        ? clamp(1 - distance / settings.nodeActivationRadiusPx, 0, 1)
        : 0;

      node.style.setProperty('--node-boost', boost.toFixed(3));
      node.style.setProperty('--node-alpha', (0.56 + boost * 0.44).toFixed(3));
      node.style.setProperty('--node-scale', (1 + boost * settings.nodePulseStrength).toFixed(3));
    });
  };

  const updateCtas = () => {
    ctas.forEach((cta) => {
      const rect = cta.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.hypot(centerX - state.pointerX, centerY - state.pointerY);
      const pull = state.active ? clamp(1 - distance / settings.magneticRadiusPx, 0, 1) : 0;
      const magnetX = ((state.pointerX - centerX) / settings.magneticRadiusPx) * 12 * pull * settings.ctaMagneticStrength;
      const magnetY = ((state.pointerY - centerY) / settings.magneticRadiusPx) * 9 * pull * settings.ctaMagneticStrength;

      cta.style.setProperty('--magnet-x', `${magnetX.toFixed(2)}px`);
      cta.style.setProperty('--magnet-y', `${magnetY.toFixed(2)}px`);
      cta.style.setProperty('--magnet-glow', pull.toFixed(3));
      cta.style.setProperty('--magnet-shadow', `${(58 * pull).toFixed(2)}px`);
      cta.style.setProperty('--magnet-inset-shadow', `${(26 * pull).toFixed(2)}px`);
      cta.style.setProperty('--magnet-sweep-opacity', (0.2 + pull * 0.56).toFixed(3));
    });
  };

  const animate = () => {
    state.currentX += (state.targetX - state.currentX) * 0.1;
    state.currentY += (state.targetY - state.currentY) * 0.1;
    state.motion *= 0.92;

    parallaxLayers.forEach((layer) => {
      const depth = Number(layer.dataset.depth || 0.2);
      layer.style.transform = `translate3d(${(state.currentX * depth).toFixed(2)}px, ${(state.currentY * depth).toFixed(2)}px, 0)`;
    });

    hero.style.setProperty('--pointer-motion', state.motion.toFixed(3));
    hero.style.setProperty('--pointer-field-opacity', (state.active ? settings.cursorGlowOpacity : state.motion * settings.cursorGlowOpacity).toFixed(3));
    hero.style.setProperty(
      '--static-field-opacity',
      (state.active ? state.motion * settings.staticInterferenceOpacity : 0).toFixed(3)
    );
    hero.style.setProperty('--corona-opacity', (state.active ? 0.22 + state.motion * 0.74 : state.motion * 0.45).toFixed(3));
    hero.style.setProperty('--corona-scale', (0.86 + state.motion * 0.28).toFixed(3));
    hero.style.setProperty(
      '--circuit-base-alpha',
      (0.34 + (state.active ? state.motion * 0.36 * settings.circuitGlowStrength : state.motion * 0.18)).toFixed(3)
    );
    hero.style.setProperty(
      '--circuit-field-glow',
      `${(18 + (state.active ? state.motion * 46 * settings.circuitGlowStrength : state.motion * 18)).toFixed(1)}px`
    );
    hero.style.setProperty(
      '--circuit-flow-alpha',
      (0.92 + (state.active ? state.motion * 0.08 : 0)).toFixed(3)
    );
    hero.style.setProperty(
      '--circuit-flow-width',
      (2.8 + (state.active ? state.motion * 1.8 : state.motion * 0.7)).toFixed(2)
    );
    updateNodes();
    updateCtas();

    const unsettled = Math.abs(state.targetX - state.currentX) > 0.04
      || Math.abs(state.targetY - state.currentY) > 0.04
      || state.motion > 0.01;

    if (unsettled) {
      state.raf = requestAnimationFrame(animate);
    } else {
      state.raf = 0;
    }
  };

  const requestLoop = () => {
    if (!state.raf) {
      state.raf = requestAnimationFrame(animate);
    }
  };

  hero.addEventListener('pointerenter', (event) => {
    state.active = true;
    state.lastPointerX = event.clientX;
    state.lastPointerY = event.clientY;
    setPointerVars(hero.getBoundingClientRect(), event);
    requestLoop();
  }, { passive: true });

  hero.addEventListener('pointermove', (event) => {
    state.active = true;
    setPointerVars(hero.getBoundingClientRect(), event);
    requestLoop();
  }, { passive: true });

  hero.addEventListener('pointerleave', () => {
    state.active = false;
    state.targetX = 0;
    state.targetY = 0;
    hero.style.setProperty('--pointer-active', '0');
    hero.style.setProperty('--tilt-x', '0deg');
    hero.style.setProperty('--tilt-y', '0deg');
    hero.classList.remove('command-pointer-active');
    updateDebug('inactive');
    requestLoop();
  }, { passive: true });
})();
