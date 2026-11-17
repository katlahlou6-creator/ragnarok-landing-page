'use strict';
// Complete 18.4-second cinematic. It always starts muted so autoplay works in every browser;
// sound is opt-in through the button and stays low at 18%.
const video = document.querySelector('#hero-video');
const soundToggle = document.querySelector('#sound-toggle');
const soundLabel = document.querySelector('#sound-label');
const soundWaves = document.querySelector('#sound-waves');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (video && soundToggle) {
  video.volume = 0.18;
  video.muted = true;
  soundToggle.hidden = false;
  const updateSound = () => {
    const audible = !video.muted;
    soundLabel.textContent = audible ? 'Sound off' : 'Sound on';
    soundToggle.setAttribute('aria-label', audible ? 'Turn video sound off' : 'Turn video sound on');
    soundToggle.setAttribute('aria-pressed', String(audible));
    soundWaves.setAttribute('d', audible ? 'M16 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14' : 'm16 9 6 6m0-6-6 6');
  };
  soundToggle.addEventListener('click', async () => {
    video.muted = !video.muted;
    if (video.paused && !video.muted) {
      try { await video.play(); } catch { video.muted = true; }
    }
    updateSound();
  });
  video.addEventListener('volumechange', updateSound);
  video.addEventListener('error', () => { soundToggle.hidden = true; });
  reducedMotion.addEventListener('change', event => { if (event.matches) video.pause(); });
  if (!reducedMotion.matches && !navigator.connection?.saveData) {
    video.play().catch(() => { /* Keep the full-frame poster visible. */ });
  }
  updateSound();
}

// Independent gameplay carousel; the Hero's playback behavior stays unchanged.
(() => {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;
  const cards = [...carousel.querySelectorAll('.carousel__card')];
  const clips = cards.map(card => card.querySelector('video'));
  // The section heading stays fixed; only the visible caption follows the active clip.
  const caption = document.querySelector('#gameplay-caption');
  const backdrop = carousel.querySelector('.carousel__backdrop');
  const interactions = cards.map(card => card.querySelector('.carousel__interaction'));
  const updateLabels = () => interactions.forEach((button, i) => {
    button.setAttribute('aria-label', `${paused ? 'Resume' : 'Pause'} ${cards[i].dataset.title}`);
    button.tabIndex = i === active ? 0 : -1;
  });
  const status = carousel.querySelector('.carousel__status');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let paused = motion.matches;
  let visible = false;
  let revision = 0;

  const sync = async () => {
    const ticket = ++revision;
    clips.forEach(clip => { clip.muted = true; clip.pause(); });
    updateLabels();
    if (paused || !visible || document.hidden) return;
    const clip = clips[active];
    try {
      await clip.play();
      // A previous play request may settle after navigation or leaving the viewport.
      if (clip !== clips[active] || paused || !visible || document.hidden) clip.pause();
    } catch {
      if (ticket !== revision) return;
      paused = true;
      updateLabels();
      status.textContent = 'Playback is paused. Activate the central video to resume.';
    }
  };

  const show = (index, announce = false) => {
    const restoreFocus = document.activeElement === interactions[active];
    active = (index + cards.length) % cards.length;
    clips.forEach(clip => clip.pause());
    cards.forEach((card, i) => {
      card.classList.remove('is-active', 'is-previous', 'is-next', 'is-hidden');
      card.classList.add(i === active ? 'is-active' : i === (active + 1) % cards.length ? 'is-next' : i === (active - 1 + cards.length) % cards.length ? 'is-previous' : 'is-hidden');
      card.setAttribute('aria-hidden', String(i !== active));
    });
    if (caption) caption.textContent = cards[active].dataset.title;
    backdrop.style.backgroundImage = `url("${clips[active].getAttribute('poster')}")`;
    clips[active].currentTime = 0;
    updateLabels();
    if (restoreFocus) interactions[active].focus({ preventScroll: true });
    if (announce) status.textContent = `${active + 1} of ${cards.length}: ${cards[active].dataset.title}`;
    sync();
  };

  carousel.querySelector('.carousel__previous').addEventListener('click', () => show(active - 1, true));
  carousel.querySelector('.carousel__next').addEventListener('click', () => show(active + 1, true));
  interactions.forEach((button, i) => button.addEventListener('click', () => {
    if (i !== active) return;
    paused = !paused;
    if (!paused && clips[active].ended) clips[active].currentTime = 0;
    sync();
  }));
  carousel.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const target = { ArrowLeft: active - 1, ArrowRight: active + 1, Home: 0, End: cards.length - 1 }[event.key];
    if (target === undefined) return;
    event.preventDefault();
    show(target, true);
  });
  clips.forEach((clip, i) => {
    clip.muted = true;
    clip.addEventListener('ended', () => {
      if (i !== active || paused || !visible || document.hidden) return;
      if (motion.matches) { paused = true; sync(); }
      else show(active + 1);
    });
    clip.addEventListener('error', () => {
      if (i !== active) return;
      paused = true;
      sync();
      status.textContent = 'This video could not be loaded. Try the next video.';
    });
  });
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting && entries[0].intersectionRatio >= .25;
    sync();
  }, { threshold: [0, .25] });
  observer.observe(carousel);
  document.addEventListener('visibilitychange', sync);
  motion.addEventListener('change', () => {
    // A preference change never restarts motion without an explicit click.
    paused = true;
    sync();
  });
  sync();
})();

// Compact menu on small screens. Without JS the full link list stays visible.
(() => {
  const header = document.querySelector('.header');
  const toggle = header?.querySelector('.nav__toggle');
  const menu = document.querySelector('#nav-menu');
  if (!toggle || !menu) return;
  header.classList.add('has-js-nav');
  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';
  const setOpen = open => {
    toggle.setAttribute('aria-expanded', String(open));
    header.classList.toggle('is-nav-open', open);
  };
  toggle.addEventListener('click', () => setOpen(!isOpen()));
  menu.addEventListener('click', event => { if (event.target.closest('a')) setOpen(false); });
  document.addEventListener('click', event => { if (isOpen() && !header.contains(event.target)) setOpen(false); });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !isOpen()) return;
    setOpen(false);
    toggle.focus();
  });
})();

// Progressive enhancement: hidden entrance states exist only after successful JS setup.
(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches || !('IntersectionObserver' in window)) return;
  const states = new Map();
  let fastUntil = 0;
  let lastY = window.scrollY;
  let lastTime = performance.now();

  const finish = element => {
    const state = states.get(element);
    if (!state) return;
    state.phase = 'done';
    clearTimeout(state.timer);
    element.classList.remove('scroll-reveal-pending', 'scroll-reveal-running');
    element.style.removeProperty('--reveal-delay');
    observer.unobserve(element);
  };
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const element = entry.target;
      const state = states.get(element);
      if (!state || state.phase !== 'pending') continue;
      if (!entry.isIntersecting) {
        if (entry.boundingClientRect.bottom <= 0) finish(element);
        continue;
      }
      observer.unobserve(element);
      state.phase = 'queued';
      // Two frames ensure the masked state has been painted before its transition.
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (state.phase !== 'queued') return;
        if (motion.matches || element.open || element.contains(document.activeElement) || element.getBoundingClientRect().bottom <= 0) {
          finish(element);
          return;
        }
        const delay = performance.now() < fastUntil ? 0 : state.delay;
        element.style.setProperty('--reveal-delay', `${delay}ms`);
        element.classList.add('scroll-reveal-running');
        element.classList.remove('scroll-reveal-pending');
        state.phase = 'running';
        state.timer = setTimeout(() => finish(element), 550 + delay);
      }));
    }
  }, { threshold: 0, rootMargin: '0px 0px -8px 0px' });

  try {
    document.querySelectorAll('main > section:not(.hero)').forEach(section => {
      const targets = [...section.querySelectorAll('h2, p, .benefit-card, .class-card, .how-to-start__steps > li, .requirements, .faq__item, .carousel')]
        .filter(element => {
          if (element.matches('h2, p')) return !element.closest('.benefit-card, .class-card, .how-to-start__steps li, .requirements, .faq__item, .carousel');
          return !element.open;
        });
      targets.forEach((target, index) => {
        let element = target;
        if (target.matches('.benefit-card, .class-card, .carousel')) {
          element = document.createElement('div');
          element.className = 'scroll-reveal-shell';
          target.before(element);
          element.append(target);
        }
        if (element.getBoundingClientRect().bottom <= 0 || element.contains(document.activeElement)) return;
        states.set(element, { phase: 'pending', delay: Math.min(index * 80, 240) });
        element.classList.add('scroll-reveal-pending');
        observer.observe(element);
        element.addEventListener('focusin', () => finish(element));
        if (element.matches('details')) element.addEventListener('toggle', () => {
          if (element.open) finish(element);
        });
        element.addEventListener('transitionend', event => {
          if (event.target === element && event.propertyName === 'opacity') finish(element);
        });
      });
    });
  } catch (error) {
    // A partial setup failure must not leave any content hidden.
    states.forEach((_, element) => finish(element));
    observer.disconnect();
    console.warn('Scroll entrance setup skipped:', error);
    return;
  }

  window.addEventListener('scroll', () => {
    const now = performance.now();
    const distance = Math.abs(window.scrollY - lastY);
    const elapsed = Math.max(1, now - lastTime);
    // Only remove stagger for a large jump or genuinely rapid scrolling.
    // Never cancel an entrance merely because the visitor is scrolling.
    if (distance > window.innerHeight * .6 || (distance > 60 && distance / elapsed > 3)) {
      fastUntil = now + 200;
      states.forEach((state, element) => {
        if (state.phase === 'running') element.style.setProperty('--reveal-delay', '0ms');
      });
    }
    lastY = window.scrollY;
    lastTime = now;
  }, { passive: true });
  motion.addEventListener('change', () => {
    if (!motion.matches) return;
    states.forEach((_, element) => finish(element));
    observer.disconnect();
  });
})();


// Subtle cinematic pointer parallax on the hero; disabled for touch and reduced motion.
(() => {
  const stage = document.querySelector('.hero__stage');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!stage || motion.matches || !window.matchMedia('(pointer: fine)').matches) return;
  let frame = 0;
  stage.addEventListener('pointermove', event => {
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const rect = stage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      stage.style.setProperty('--pointer-x', `${-x * 10}px`);
      stage.style.setProperty('--pointer-y', `${-y * 8}px`);
    });
  });
  stage.addEventListener('pointerleave', () => {
    stage.style.setProperty('--pointer-x', '0px');
    stage.style.setProperty('--pointer-y', '0px');
  });
})();
