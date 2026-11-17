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


// =========================================================
// MA TOUCHE — Class Finder, PC check, Send to my PC, progress bar
// =========================================================

// Pushes an event to Google Tag Manager / AFBooster tracking if a dataLayer exists (does nothing otherwise).
const pushEvent = (name, data = {}) => {
  if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event: name, ...data });
};

// Reading progress line at the very top of the page
(() => {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

// Class Finder: 3 questions -> points per class -> the best match is highlighted in the grid
(() => {
  const form = document.getElementById('class-finder');
  if (!form) return;
  const CLASSES = ['Swordsman', 'Archer', 'Mage', 'Acolyte', 'Thief', 'Merchant', 'Gunslinger', 'Druid'];
  const POINTS = {
    q1: { front: { Swordsman: 3, Thief: 3, Merchant: 2, Druid: 1 }, range: { Archer: 3, Gunslinger: 3, Mage: 1 }, back: { Mage: 3, Acolyte: 3, Druid: 1 } },
    q2: { damage: { Mage: 2, Gunslinger: 2, Thief: 2, Archer: 1 }, team: { Acolyte: 3, Swordsman: 2 }, zeny: { Merchant: 4 }, shape: { Druid: 4 } },
    q3: { steady: { Swordsman: 2, Archer: 2, Acolyte: 1, Merchant: 1 }, fast: { Thief: 2, Gunslinger: 2 }, clever: { Mage: 2, Druid: 2, Merchant: 1, Archer: 1 } }
  };
  const WHY = {
    Swordsman: 'You hold the front line so your party can shine.',
    Archer: 'You strike from a distance and stay in control of the fight.',
    Mage: 'You clear whole groups of enemies with powerful spells.',
    Acolyte: 'You heal and protect your party through the toughest fights.',
    Thief: 'You hit fast and hard, built on speed and critical hits.',
    Merchant: 'You trade, craft and earn Zeny while you adventure.',
    Gunslinger: 'You switch firearms to deal heavy damage from range.',
    Druid: 'You shift between Werewolf, Bird-Man and Human forms.'
  };
  const result = document.getElementById('finder-result');
  const grid = document.querySelector('.classes__grid');
  const cards = [...document.querySelectorAll('.class-card')];
  const cardFor = name => cards.find(card => card.querySelector('h4')?.textContent.trim() === name);

  const clearMatch = () => {
    cards.forEach(card => card.classList.remove('is-match'));
    grid?.classList.remove('has-match');
  };

  form.addEventListener('change', () => {
    const answers = ['q1', 'q2', 'q3'].map(q => form.elements[q].value);
    if (answers.some(a => !a)) return; // wait until all 3 questions are answered
    const score = Object.fromEntries(CLASSES.map(c => [c, 0]));
    answers.forEach((a, i) => Object.entries(POINTS['q' + (i + 1)][a]).forEach(([c, p]) => { score[c] += p; }));
    const best = CLASSES.reduce((a, b) => (score[b] > score[a] ? b : a));
    const card = cardFor(best);

    document.getElementById('finder-name').textContent = best;
    document.getElementById('finder-why').textContent = WHY[best];
    result.hidden = false;
    clearMatch();
    if (card) {
      card.classList.add('is-match');
      grid?.classList.add('has-match');
    }
    pushEvent('class_finder_result', { class_name: best });
  });

  document.getElementById('finder-retry').addEventListener('click', () => {
    form.reset();
    result.hidden = true;
    clearMatch();
    form.querySelector('input')?.focus();
  });
})();

// PC readiness check: progress bar, then the final CTA lights up when all 4 boxes are ticked
(() => {
  const box = document.getElementById('ready-check');
  if (!box) return;
  const inputs = [...box.querySelectorAll('input[type=checkbox]')];
  const action = document.querySelector('.how-to-start__action');
  let sent = false;
  const update = () => {
    const done = inputs.filter(i => i.checked).length;
    document.getElementById('ready-count').textContent = `${done} / ${inputs.length} ready`;
    document.getElementById('ready-bar').style.width = `${(done / inputs.length) * 100}%`;
    const all = done === inputs.length;
    document.getElementById('ready-done').hidden = !all;
    action?.classList.toggle('is-ready', all);
    if (all && !sent) { sent = true; pushEvent('pc_ready_check_complete'); }
  };
  inputs.forEach(i => i.addEventListener('change', update));
  update();
})();

// Send to my PC: on a phone, share the page link (or copy it) so the visitor can open it on their computer
(() => {
  const button = document.getElementById('send-to-pc');
  if (!button) return;
  const status = document.getElementById('send-status');
  const url = window.location.href.split('#')[0];
  button.addEventListener('click', async () => {
    pushEvent('send_to_pc_click');
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Ragnarok: The New World', text: 'Download Ragnarok: The New World free on Steam (Windows PC):', url });
        status.textContent = 'Shared! Open the link on your computer.';
        return;
      } catch (error) {
        if (error && error.name === 'AbortError') return; // the visitor closed the share sheet
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      status.textContent = 'Link copied. Paste it in a message to yourself and open it on your PC.';
    } catch {
      status.textContent = url; // last resort: show the link so it can be copied by hand
    }
  });
})();


// Hero slideshow: a new scene every 6 seconds, cross-fading with a slow zoom.
// Pauses when the hero is off screen or the tab is hidden; stays on the first scene with "reduce motion".
(() => {
  const box = document.getElementById('hero-slides');
  if (!box) return;
  const slides = [...box.querySelectorAll('.hero__slide')];
  const dotsBox = document.getElementById('hero-dots');
  const DELAY = 6000;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const dots = slides.map(() => { const d = document.createElement('span'); dotsBox?.appendChild(d); return d; });
  let index = 0, timer = 0, visible = true;

  const show = next => {
    slides[index].classList.remove('is-active');
    index = (next + slides.length) % slides.length;
    const slide = slides[index];
    // Restart the zoom animation from the beginning on the new scene
    slide.style.animation = 'none'; void slide.offsetWidth; slide.style.animation = '';
    slide.classList.add('is-active');
    dots.forEach((d, i) => {
      d.classList.toggle('is-active', i === index);
      d.classList.toggle('is-done', i < index);
    });
    const after = slides[(index + 1) % slides.length]; // warm up the next image
    if (after.loading === 'lazy') after.loading = 'eager';
  };
  const start = () => { stop(); if (!motion.matches && visible && !document.hidden) timer = setInterval(() => show(index + 1), DELAY); };
  const stop = () => { clearInterval(timer); timer = 0; };

  show(0);
  start();
  document.addEventListener('visibilitychange', start);
  motion.addEventListener('change', () => { if (motion.matches) { stop(); show(0); } else start(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; start(); }).observe(box);
  }
})();

// Hero music: the cinematic's soundtrack as a seamless 17-second loop (assets/audio/midgard-theme.m4a).
// Always off on arrival; it only starts when the visitor presses "Sound on", fades in gently, and pauses with the tab.
(() => {
  const button = document.getElementById('music-toggle');
  if (!button) return;
  const SRC = './assets/audio/midgard-theme.m4a';
  const VOLUME = 0.45;          // the file is normalized to -16 LUFS; 0.45 keeps it in the background
  const label = document.getElementById('music-label');
  const waves = document.getElementById('music-waves');
  let on = false, ctx = null, gain = null, started = false, fallback = null;

  const render = () => {
    label.textContent = on ? 'Sound off' : 'Sound on';
    button.setAttribute('aria-label', on ? 'Turn music off' : 'Turn music on');
    button.setAttribute('aria-pressed', String(on));
    button.classList.toggle('is-on', on);
    waves.setAttribute('d', on ? 'M16 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14' : 'm16 9 6 6m0-6-6 6');
  };

  // Gapless loop through the Web Audio API (an <audio loop> leaves a small gap in some browsers)
  const startWebAudio = async () => {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) throw new Error('no Web Audio');
    if (!ctx) {
      ctx = new AC();                       // created inside the click, so mobile browsers allow it
      gain = ctx.createGain();
      gain.gain.value = 0;
      gain.connect(ctx.destination);
    }
    await ctx.resume();
    if (!started) {
      const data = await (await fetch(SRC)).arrayBuffer();
      const buffer = await ctx.decodeAudioData(data);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(gain);
      source.start();
      started = true;
    }
    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.setTargetAtTime(VOLUME, ctx.currentTime, 0.4);   // ~1.2 s fade-in
  };

  // Simple fallback (e.g. page opened from a local file, where fetch is blocked)
  const startFallback = async () => {
    if (!fallback) { fallback = new Audio(SRC); fallback.loop = true; }
    fallback.volume = VOLUME;
    await fallback.play();
  };

  const stop = () => {
    if (ctx && gain) {
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setTargetAtTime(0, ctx.currentTime, 0.15);
      setTimeout(() => { if (!on) ctx.suspend(); }, 700);
    }
    fallback?.pause();
  };

  button.hidden = false;
  render();
  button.addEventListener('click', async () => {
    on = !on;
    render();
    if (!on) { stop(); return; }
    try {
      if (fallback) await startFallback(); else await startWebAudio();
    } catch {
      try { ctx?.suspend(); ctx = null; await startFallback(); }
      catch { on = false; render(); }
    }
    if (on && typeof pushEvent === 'function') pushEvent('hero_music_on');
  });

  // Pause the music while the tab is hidden, resume it when the visitor comes back
  document.addEventListener('visibilitychange', () => {
    if (!on) return;
    if (document.hidden) { ctx?.suspend(); fallback?.pause(); }
    else { ctx?.resume(); fallback?.play().catch(() => {}); }
  });
})();
