/*
  Interactions for Manar Hassan — UI/UX Designer Portfolio
  - Mobile nav toggle
  - Smooth scroll for anchor links
  - Scroll reveal animations
  - Project modal open/close
  - Testimonials slider
  - Scroll-to-top button
  - Footer year + Contact form validation
*/

// 1) Mobile Navigation Toggle
(function mobileNav() {
  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('nav-menu');
  if (!nav || !toggle || !menu) return;

  function update(expanded) {
    nav.setAttribute('data-open', String(expanded));
    toggle.setAttribute('aria-expanded', String(expanded));
  }

  toggle.addEventListener('click', () => {
    const isOpen = nav.getAttribute('data-open') === 'true';
    update(!isOpen);
  });

  menu.addEventListener('click', (e) => {
    if (e.target instanceof Element && e.target.matches('a')) update(false);
  });
})();

// 2) Smooth Scroll for links with [data-scroll]
(function smoothScroll() {
  const links = document.querySelectorAll('[data-scroll]');
  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = (e.currentTarget as HTMLAnchorElement).getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

// 3) Scroll Reveal Animations via IntersectionObserver
(function scrollReveal() {
  const revealEls = Array.from(document.querySelectorAll('.reveal'));
  if (!('IntersectionObserver' in window) || revealEls.length === 0) {
    revealEls.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach((el) => observer.observe(el));
})();

// 4) Project Modal
(function projectModal() {
  const modal = document.getElementById('project-modal');
  if (!modal) return;

  const image = document.getElementById('modal-image') as HTMLImageElement | null;
  const title = document.getElementById('modal-title');
  const desc = document.getElementById('modal-description');

  function open({ img, heading, text }) {
    if (image) image.src = img;
    if (image) image.alt = heading + ' preview';
    if (title) title.textContent = heading;
    if (desc) desc.textContent = text;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.addEventListener('click', (e) => {
    const target = e.target as Element | null;
    if (!target) return;
    if (target.matches('.open-modal')) {
      const btn = target as HTMLButtonElement;
      const img = btn.getAttribute('data-image') || '';
      const heading = btn.getAttribute('data-title') || '';
      const text = btn.getAttribute('data-description') || '';
      open({ img, heading, text });
    }
    if (target.hasAttribute('data-close-modal') || target.closest('[data-close-modal]')) {
      close();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') close();
  });
})();

// 5) Testimonials Slider
(function testimonialsSlider() {
  const slider = document.querySelector('.slider');
  const track = slider?.querySelector('.slider-track') as HTMLElement | null;
  const slides = Array.from(slider?.querySelectorAll('.slide') || []);
  const prev = slider?.querySelector('.prev') as HTMLButtonElement | null;
  const next = slider?.querySelector('.next') as HTMLButtonElement | null;
  const dotsWrap = slider?.querySelector('.slider-dots') as HTMLElement | null;

  if (!slider || !track || slides.length === 0 || !prev || !next || !dotsWrap) return;

  let index = 0;
  function update() {
    track.style.transform = `translateX(${-index * 100}%)`;
    const dots = Array.from(dotsWrap.querySelectorAll('button'));
    dots.forEach((d, i) => d.setAttribute('aria-selected', String(i === index)));
  }

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.setAttribute('role', 'tab');
    dot.addEventListener('click', () => { index = i; update(); });
    dotsWrap.appendChild(dot);
  });

  prev.addEventListener('click', () => { index = (index - 1 + slides.length) % slides.length; update(); });
  next.addEventListener('click', () => { index = (index + 1) % slides.length; update(); });

  // Auto-advance
  let timer = setInterval(() => { index = (index + 1) % slides.length; update(); }, 6000);
  slider.addEventListener('mouseenter', () => clearInterval(timer));
  slider.addEventListener('mouseleave', () => { timer = setInterval(() => { index = (index + 1) % slides.length; update(); }, 6000); });

  update();
})();

// 6) Scroll To Top Button
(function toTopButton() {
  const btn = document.getElementById('toTop');
  if (!btn) return;
  const onScroll = () => {
    if (window.scrollY > 400) btn.classList.add('show');
    else btn.classList.remove('show');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// 7) Footer Year
(function footerYear() {
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();

// 8) Contact Form Validation
(function contactFormValidation() {
  const form = document.getElementById('contact-form') as HTMLFormElement | null;
  if (!form) return;
  const name = document.getElementById('name') as HTMLInputElement | null;
  const email = document.getElementById('email') as HTMLInputElement | null;
  const message = document.getElementById('message') as HTMLTextAreaElement | null;
  const status = document.getElementById('form-status');

  function showError(el: HTMLElement | null, msg: string) {
    if (!el) return;
    el.textContent = msg;
  }

  function validateEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function clearErrors() {
    showError(document.getElementById('error-name'), '');
    showError(document.getElementById('error-email'), '');
    showError(document.getElementById('error-message'), '');
    if (status) status.textContent = '';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const nameVal = name?.value.trim() || '';
    const emailVal = email?.value.trim() || '';
    const messageVal = message?.value.trim() || '';

    let valid = true;
    if (nameVal.length < 2) { showError(document.getElementById('error-name'), 'Please enter your name.'); valid = false; }
    if (!validateEmail(emailVal)) { showError(document.getElementById('error-email'), 'Please enter a valid email.'); valid = false; }
    if (messageVal.length < 10) { showError(document.getElementById('error-message'), 'Please enter at least 10 characters.'); valid = false; }

    if (!valid) return;

    if (status) {
      status.textContent = 'Thanks! Your message has been prepared in your email client.';
    }

    // For a static portfolio, open the user's email client with a prefilled mailto link
    const subject = encodeURIComponent('Portfolio Inquiry');
    const body = encodeURIComponent(`Name: ${nameVal}\nEmail: ${emailVal}\n\n${messageVal}`);
    window.location.href = `mailto:manar.hassan@example.com?subject=${subject}&body=${body}`;

    form.reset();
  });
})();
