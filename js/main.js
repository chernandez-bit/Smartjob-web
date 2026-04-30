/* Smartjob.cl — main.js */

/* ─── Nav scroll ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ─── Mobile menu ─── */
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
menuToggle.addEventListener('click', () => {
  const isHidden = mobileMenu.hasAttribute('hidden');
  if (isHidden) {
    mobileMenu.removeAttribute('hidden');
  } else {
    mobileMenu.setAttribute('hidden', '');
  }
});
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.setAttribute('hidden', '');
  });
});

/* ─── Scroll reveal ─── */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const delay = el.style.getPropertyValue('--delay') || '0ms';
    const ms = parseInt(delay) || 0;
    setTimeout(() => el.classList.add('visible'), ms);
    revealObs.unobserve(el);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObs.observe(el));

/* ─── Counter animation (Montserrat 90px stats) ─── */
const counters = document.querySelectorAll('.stat-num');
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.target);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    counterObs.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(el => counterObs.observe(el));

/* ─── Active nav highlight ─── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-a');
const activeObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => {
      const match = link.getAttribute('href') === '#' + entry.target.id;
      link.style.color = match ? 'var(--orange)' : '';
    });
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => activeObs.observe(s));

/* ─── Contact form preselector ─── */
(function () {
  const s = new URLSearchParams(window.location.search).get('s');
  if (!s) return;
  const map = { staffing: 'chip-staffing', cloud: 'chip-cloud' };
  const id = map[s];
  if (!id) return;
  const cb = document.getElementById(id);
  if (cb) cb.checked = true;
})();

/* ─── Webhook forms ─── */
const WEBHOOK_URL = 'https://smartjob.app.n8n.cloud/webhook/contact-form';

async function postToWebhook(payload, btn, form) {
  const orig = btn.textContent;
  btn.textContent = 'Enviando…';
  btn.disabled = true;
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    const ok = Array.isArray(data) ? data[0]?.success === true : data?.success === true;
    if (ok) {
      btn.textContent = '✓ Enviado';
      btn.style.background = '#1BB9A5';
      setTimeout(() => {
        btn.textContent = orig;
        btn.disabled = false;
        btn.style.background = '';
        form.reset();
      }, 3000);
    } else {
      throw new Error('success false');
    }
  } catch {
    btn.textContent = 'Error, reintenta';
    btn.style.background = '#e74c3c';
    setTimeout(() => {
      btn.textContent = orig;
      btn.disabled = false;
      btn.style.background = '';
    }, 3000);
  }
}

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(contactForm);
    const categories = [...contactForm.querySelectorAll('input[name="categories"]:checked')]
      .map(cb => cb.value);
    const payload = {
      source: 'contact',
      name: fd.get('name'),
      phone: fd.get('phone'),
      email: fd.get('email'),
      categories,
      message: fd.get('message')
    };
    await postToWebhook(payload, contactForm.querySelector('button[type="submit"]'), contactForm);
  });
}

const smarterForm = document.getElementById('smarter-form');
if (smarterForm) {
  smarterForm.addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(smarterForm);
    fd.append('source', 'smarter');
    const btn = smarterForm.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Enviando…';
    btn.disabled = true;
    try {
      const res = await fetch(WEBHOOK_URL, { method: 'POST', body: fd });
      const data = await res.json();
      const ok = Array.isArray(data) ? data[0]?.success === true : data?.success === true;
      if (!ok) throw new Error();
      btn.textContent = '✓ Enviado';
      btn.style.background = '#1BB9A5';
      setTimeout(() => {
        btn.textContent = orig;
        btn.disabled = false;
        btn.style.background = '';
        smarterForm.reset();
      }, 3000);
    } catch {
      btn.textContent = 'Error, reintenta';
      btn.style.background = '#e74c3c';
      setTimeout(() => {
        btn.textContent = orig;
        btn.disabled = false;
        btn.style.background = '';
      }, 3000);
    }
  });
}

/* ─── Newsletter feedback (visual only) ─── */
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = newsletterForm.querySelector('button[type="submit"]');
    if (!btn) return;
    const origHTML = btn.innerHTML;
    btn.innerHTML = '✓';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = origHTML;
      btn.disabled = false;
      newsletterForm.reset();
    }, 3000);
  });
}

/* ─── WhatsApp bubble ─── */
(function () {
  const toggle = document.getElementById('wa-toggle');
  const close  = document.getElementById('wa-close');
  const popup  = document.getElementById('wa-popup');
  if (!toggle || !popup) return;

  toggle.addEventListener('click', () => {
    const open = popup.hasAttribute('hidden');
    if (open) popup.removeAttribute('hidden');
    else popup.setAttribute('hidden', '');
  });

  if (close) {
    close.addEventListener('click', () => popup.setAttribute('hidden', ''));
  }

  document.addEventListener('click', e => {
    const bubble = document.getElementById('wa-bubble');
    if (bubble && !bubble.contains(e.target)) {
      popup.setAttribute('hidden', '');
    }
  });
})();
