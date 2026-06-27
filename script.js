/* ═══════════════════════════════════════════════
   POWERSNAP PRO — SCRIPT.JS
   Animations, Interactivity, Scroll Effects
   ═══════════════════════════════════════════════ */

'use strict';

/* ─── Navbar scroll effect ─── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ─── Scroll Reveal ─── */
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const delay = parseInt(el.dataset.delay || '0', 10);

        setTimeout(() => {
          el.classList.add('visible');
        }, delay);

        observer.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
})();

/* ─── Hero Floating Particles ─── */
(function initParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;

  const NUM_PARTICLES = 28;
  const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#818cf8'];

  for (let i = 0; i < NUM_PARTICLES; i++) {
    const p = document.createElement('div');

    const size   = Math.random() * 4 + 1;
    const x      = Math.random() * 100;
    const y      = Math.random() * 100;
    const dur    = Math.random() * 12 + 8;
    const delay  = Math.random() * 6;
    const color  = colors[Math.floor(Math.random() * colors.length)];
    const opacity = Math.random() * 0.5 + 0.15;

    Object.assign(p.style, {
      position:     'absolute',
      width:        `${size}px`,
      height:       `${size}px`,
      borderRadius: '50%',
      background:   color,
      left:         `${x}%`,
      top:          `${y}%`,
      opacity:      opacity,
      animation:    `particle-float ${dur}s ${delay}s ease-in-out infinite`,
      pointerEvents: 'none',
    });

    container.appendChild(p);
  }

  // Inject keyframes for particles
  if (!document.getElementById('particle-keyframes')) {
    const style = document.createElement('style');
    style.id = 'particle-keyframes';
    style.textContent = `
      @keyframes particle-float {
        0%, 100% { transform: translateY(0) scale(1); opacity: var(--op, 0.3); }
        33%       { transform: translateY(-30px) scale(1.2); }
        66%       { transform: translateY(15px) scale(0.8); }
      }
    `;
    document.head.appendChild(style);
  }
})();

/* ─── FAQ Accordion ─── */
(function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all others
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('open');
          const otherBtn = other.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      item.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });
})();

/* ─── Stock Urgency Bar Animation ─── */
(function initUrgencyBar() {
  const fill = document.getElementById('stock-fill');
  if (!fill) return;

  // Animate bar after a short delay
  setTimeout(() => {
    fill.style.width = '30%';
  }, 800);

  // Live countdown simulation
  const stockCountEl = document.getElementById('stock-count');
  if (!stockCountEl) return;

  let stock = parseInt(stockCountEl.textContent, 10);

  const decrementStock = () => {
    if (stock <= 1) return;
    const chance = Math.random();
    if (chance > 0.7) {
      stock -= 1;
      stockCountEl.textContent = stock;
      stockCountEl.style.animation = 'none';
      void stockCountEl.offsetWidth; // reflow
      stockCountEl.style.animation = 'stock-pulse 0.4s ease';
    }
    scheduleNextDecrement();
  };

  const scheduleNextDecrement = () => {
    const delay = Math.random() * 25000 + 15000; // 15–40 seconds
    setTimeout(decrementStock, delay);
  };

  scheduleNextDecrement();

  // Inject stock pulse keyframe
  if (!document.getElementById('stock-kf')) {
    const style = document.createElement('style');
    style.id = 'stock-kf';
    style.textContent = `
      @keyframes stock-pulse {
        0%   { transform: scale(1.3); color: #f43f5e; }
        100% { transform: scale(1);   color: inherit; }
      }
    `;
    document.head.appendChild(style);
  }
})();

/* ─── Smooth CTA Button Pulse ─── */
(function initCTAPulse() {
  const ctaBtns = document.querySelectorAll('.btn-primary');
  if (!ctaBtns.length) return;

  // Inject pulse ring style
  if (!document.getElementById('cta-pulse-kf')) {
    const style = document.createElement('style');
    style.id = 'cta-pulse-kf';
    style.textContent = `
    .btn-primary.pulsing::after {
      content: '';
      position: absolute;
      inset: -5px;
      border-radius: 18px;
      border: 1.5px solid rgba(99,102,241,0.5);
      animation: ring-pulse 2s ease-out infinite;
    }
    @keyframes ring-pulse {
      0%   { transform: scale(1);    opacity: 0.8; }
      100% { transform: scale(1.08); opacity: 0; }
    }
  `;
    document.head.appendChild(style);
  }

  // Add pulse to the oferta CTA specifically after scroll into view
  const ofertaCTA = document.getElementById('oferta-cta-btn');
  if (ofertaCTA) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => ofertaCTA.classList.add('pulsing'), 1500);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(ofertaCTA);
  }
})();

/* ─── Header CTA active state on section in view ─── */
(function initActiveSections() {
  const sections = document.querySelectorAll('section[id]');
  const navCta   = document.querySelector('.nav-cta');
  if (!sections.length || !navCta) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.id === 'oferta') {
          navCta.style.boxShadow = '0 0 40px rgba(99,102,241,0.7)';
        } else {
          navCta.style.boxShadow = '';
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach((s) => observer.observe(s));
})();

/* ─── Hero image tilt on mouse move ─── */
(function initHeroTilt() {
  const heroImg = document.getElementById('hero-product-img');
  const hero    = document.getElementById('hero');
  if (!heroImg || !hero) return;

  hero.addEventListener('mousemove', (e) => {
    const { left, top, width, height } = hero.getBoundingClientRect();
    const x = (e.clientX - left) / width  - 0.5;  // -0.5 to 0.5
    const y = (e.clientY - top)  / height - 0.5;

    const rotateX = (-y * 10).toFixed(2);
    const rotateY = ( x * 10).toFixed(2);

    heroImg.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${Math.sin(Date.now() / 1000) * 8}px)`;
  });

  hero.addEventListener('mouseleave', () => {
    heroImg.style.transform = '';
  });
})();

/* ─── Countdown timer (oferta) ─── */
(function initCountdown() {
  // Create a 24h countdown from page load
  const ofertaSection = document.getElementById('oferta');
  if (!ofertaSection) return;

  const DURATION = 24 * 60 * 60; // 24 hours in seconds
  const storageKey = 'powersnap_timer_end';

  let endTime = parseInt(sessionStorage.getItem(storageKey) || '0', 10);
  if (!endTime || endTime < Date.now()) {
    endTime = Date.now() + DURATION * 1000;
    sessionStorage.setItem(storageKey, endTime.toString());
  }

  // Create timer element
  const timerEl = document.createElement('div');
  timerEl.className = 'countdown-timer';
  timerEl.innerHTML = `
    <span class="countdown-label">⏱ La oferta expira en:</span>
    <div class="countdown-blocks">
      <div class="countdown-block"><span id="cd-h">00</span><small>horas</small></div>
      <div class="countdown-sep">:</div>
      <div class="countdown-block"><span id="cd-m">00</span><small>min</small></div>
      <div class="countdown-sep">:</div>
      <div class="countdown-block"><span id="cd-s">00</span><small>seg</small></div>
    </div>
  `;

  // Insert before urgency bar
  const urgencyBar = document.getElementById('urgency-bar');
  if (urgencyBar) urgencyBar.insertAdjacentElement('beforebegin', timerEl);

  // Inject styles
  if (!document.getElementById('countdown-styles')) {
    const style = document.createElement('style');
    style.id = 'countdown-styles';
    style.textContent = `
      .countdown-timer {
        margin-bottom: 20px;
        padding: 16px 20px;
        background: rgba(99,102,241,0.06);
        border: 1px solid rgba(99,102,241,0.2);
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .countdown-label {
        font-size: 0.85rem;
        font-weight: 600;
        color: #818cf8;
        letter-spacing: 0.03em;
      }
      .countdown-blocks {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .countdown-block {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 52px;
      }
      .countdown-block span {
        font-size: 1.8rem;
        font-weight: 900;
        letter-spacing: -0.04em;
        background: linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        line-height: 1;
      }
      .countdown-block small {
        font-size: 0.65rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #8b93c4;
        margin-top: 4px;
      }
      .countdown-sep {
        font-size: 1.6rem;
        font-weight: 900;
        color: #6366f1;
        margin-bottom: 14px;
      }
    `;
    document.head.appendChild(style);
  }

  const pad = (n) => String(n).padStart(2, '0');

  const tick = () => {
    const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
    const h = Math.floor(remaining / 3600);
    const m = Math.floor((remaining % 3600) / 60);
    const s = remaining % 60;

    const hEl = document.getElementById('cd-h');
    const mEl = document.getElementById('cd-m');
    const sEl = document.getElementById('cd-s');

    if (hEl) hEl.textContent = pad(h);
    if (mEl) mEl.textContent = pad(m);
    if (sEl) sEl.textContent = pad(s);
  };

  tick();
  setInterval(tick, 1000);
})();

/* ─── Init complete ─── */
console.log('⚡ PowerSnap Pro — Landing loaded successfully');
