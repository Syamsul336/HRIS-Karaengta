// ═══════════════════════════════════════════════════════════
// ANIMATIONS.JS — Count-up, scroll-reveal, bar & row animations
// ═══════════════════════════════════════════════════════════

export function animateCount(el, target, duration = 800) {
  if (!el) return;
  const start = performance.now();
  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

export function observeReveal() {
  document.querySelectorAll('.reveal').forEach(el => {
    el.classList.remove('visible');
    revealObserver.observe(el);
  });
}

export function animateBarsIn(ctx) {
  const bars = (ctx || document).querySelectorAll('.bar-chart .bar');
  bars.forEach((bar, i) => {
    const targetH = bar.getAttribute('data-height') || bar.style.height;
    bar.style.transition = 'none';
    bar.style.height     = '0px';
    bar.style.opacity    = '0';
    bar.offsetHeight;
    setTimeout(() => {
      bar.style.transition = 'height .65s cubic-bezier(.22,.68,0,1.2), opacity .3s ease';
      bar.style.height     = targetH + 'px';
      bar.style.opacity    = '1';
    }, 40 + i * 80);
  });
  (ctx || document).querySelectorAll('.bar-chart .bar-val').forEach((el, i) => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(6px)';
    el.style.transition = 'none';
    el.offsetHeight;
    setTimeout(() => {
      el.style.transition = 'opacity .4s ease, transform .4s ease';
      el.style.opacity    = '1';
      el.style.transform  = 'translateY(0)';
    }, 80 + i * 80);
  });
}

export function animateRowsIn(tbody) {
  if (!tbody) return;
  Array.from(tbody.querySelectorAll('tr')).forEach((row, i) => {
    row.style.opacity    = '0';
    row.style.transform  = 'translateX(-12px)';
    row.style.transition = 'none';
    row.offsetHeight;
    setTimeout(() => {
      row.style.transition = 'opacity .35s ease, transform .35s ease';
      row.style.opacity    = '1';
      row.style.transform  = 'translateX(0)';
    }, 50 + i * 40);
  });
}

export function animateProgressBars(ctx) {
  (ctx || document).querySelectorAll('.progress-fill').forEach((fill, i) => {
    const target = fill.style.width;
    fill.style.transition = 'none';
    fill.style.width      = '0';
    fill.offsetHeight;
    setTimeout(() => {
      fill.style.transition = 'width .75s cubic-bezier(.22,.68,0,1.2)';
      fill.style.width      = target;
    }, 80 + i * 35);
  });
}

export function animateDonutIn() {
  const svg = document.getElementById('donut-svg');
  if (!svg) return;
  svg.querySelectorAll('circle[stroke-dasharray]').forEach((c, i) => {
    const arr   = c.getAttribute('stroke-dasharray');
    const total = arr ? parseFloat(arr.split(' ')[0]) : 0;
    c.style.transition       = 'none';
    c.style.strokeDashoffset = total;
    c.style.opacity          = '0';
    c.offsetHeight;
    setTimeout(() => {
      c.style.transition       = `stroke-dashoffset .8s cubic-bezier(.22,.68,0,1.2) ${i * 0.15}s, opacity .4s ease ${i * 0.15}s`;
      c.style.strokeDashoffset = '0';
      c.style.opacity          = '1';
    }, 80);
  });
}

export function runPageAnimations(page) {
  const pageEl = document.getElementById('page-' + page);
  if (!pageEl) return;

  pageEl.querySelectorAll('.reveal').forEach(el => {
    el.classList.remove('visible');
    setTimeout(() => el.classList.add('visible'), 30);
  });

  pageEl.querySelectorAll('.stat-card-new').forEach((card, i) => {
    card.style.animation = 'none';
    card.offsetHeight;
    card.style.animation      = '';
    card.style.animationDelay = (0.05 + i * 0.07) + 's';
  });

  animateBarsIn(pageEl);

  pageEl.querySelectorAll('table tbody').forEach(tbody => animateRowsIn(tbody));

  animateProgressBars(pageEl);

  if (page === 'dashboard') animateDonutIn();

  // Simpan nilai asli di data-val supaya re-run (ganti halaman bolak-balik) tetap benar
  pageEl.querySelectorAll('.stat-num-new').forEach(el => {
    const stored = parseInt(el.dataset.val);
    const val    = isNaN(stored) ? (parseInt(el.textContent) || 0) : stored;
    if (!el.dataset.val && val > 0) el.dataset.val = val;
    if (val > 0) {
      el.textContent = '0';
      animateCount(el, val, 800);
    }
  });
}
