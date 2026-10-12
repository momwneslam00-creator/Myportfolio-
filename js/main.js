document.documentElement.classList.add('js');

(function () {
  const root = document.documentElement;

  /* ---------- Theme toggle ---------- */
  const toggle = document.getElementById('themeToggle');
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    const icon = toggle.querySelector('i');
    icon.className = theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon-stars';
    toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
  applyTheme(root.getAttribute('data-theme') || 'light');
  toggle.addEventListener('click', function () {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  /* ---------- Compact navbar on scroll ---------- */
  const nav = document.getElementById('siteNav');
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 40); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Close mobile menu after clicking a link ---------- */
  const menu = document.getElementById('navMenu');
  menu.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      if (menu.classList.contains('show')) {
        bootstrap.Collapse.getOrCreateInstance(menu).hide();
      }
    });
  });

  /* ---------- Highlight the current section in the nav ---------- */
  const links = menu.querySelectorAll('.nav-link');
  const sections = Array.from(links).map(function (l) {
    return document.querySelector(l.getAttribute('href'));
  });
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (l) {
            const active = l.getAttribute('href') === '#' + entry.target.id;
            l.classList.toggle('active', active);
            if (active) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { if (s) spy.observe(s); });

    /* ---------- Fade-in on scroll ---------- */
    const reveal = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { reveal.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Contact form ----------
     There is no backend, so this form does NOT send email by itself.
     It validates the fields, then opens the visitor's email app with the message filled in.
     To connect a real service later (Formspree, EmailJS, etc.), replace this handler. */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.classList.remove('error');
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !emailOk || !message) {
      status.classList.add('error');
      status.textContent = 'Please fill in your name, a valid email and a message.';
      return;
    }
    const subject = encodeURIComponent('Portfolio message from ' + name);
    const body = encodeURIComponent(message + '\n\nFrom: ' + name + ' (' + email + ')');
    window.location.href = 'mailto:islammomen868@gmail.com?subject=' + subject + '&body=' + body;
    status.textContent = 'Opening your email app to send the message.';
  });
})();
