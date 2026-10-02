// Mobile navigation.
const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation menu');
  navLinks.classList.remove('is-open');
}

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
  navLinks.classList.toggle('is-open', !isOpen);
});
navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

const videoSpeed = document.querySelector('#video-speed');
videoSpeed.addEventListener('change', () => {
  const video = document.querySelector('.about-video');
  video.playbackRate = Number(videoSpeed.value);
});
const introVideo = document.querySelector('.about-video');
const videoStatus = document.querySelector('#video-status');
introVideo.addEventListener('error', () => {
  const code = introVideo.error?.code ?? 'unknown';
  videoStatus.textContent = `The browser could not decode the video (media error ${code}). Use the direct video link below.`;
});
window.addEventListener('resize', () => { if (window.innerWidth > 640) closeMenu(); });

// Add subtle reveal motion and keep the current section marked in the navigation.
const revealItems = document.querySelectorAll('.home-portrait, .home-copy, .about-visual, .about-copy, .section-heading, .hobby-feature, .contact-copy, .contact-form');
revealItems.forEach((item) => item.setAttribute('data-reveal', ''));
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const siteHeader = document.querySelector('.site-header');
const sectionLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const pageSections = [...document.querySelectorAll('#home, #about, #projects, #contact')];
function updateHeader() {
  siteHeader.classList.toggle('is-scrolled', window.scrollY > 12);
}
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });
if ('IntersectionObserver' in window) {
  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-30% 0px -55% 0px' });
  pageSections.forEach((section) => activeObserver.observe(section));
}

const form = document.querySelector('#contact-form');
const fields = ['name', 'email', 'message'];
function showFieldError(field, message) {
  const input = document.getElementById(field);
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
  document.getElementById(`${field}-error`).textContent = message;
}
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = form.elements.name.value.trim();
  const email = form.elements.email.value.trim();
  const message = form.elements.message.value.trim();
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const errors = {
    name: name ? '' : 'Please enter your name.',
    email: !email ? 'Please enter your email address.' : (!emailIsValid ? 'Please enter a valid email address.' : ''),
    message: message ? '' : 'Please add a message.'
  };
  fields.forEach((field) => showFieldError(field, errors[field]));
  const status = document.querySelector('#form-status');
  if (Object.values(errors).some(Boolean)) {
    status.textContent = 'Please fix the highlighted fields and try again.';
    form.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }
  status.textContent = `Thanks, ${name}! The form looks good. This demo doesn't send messages yet.`;
  form.reset();
  fields.forEach((field) => showFieldError(field, ''));
});
fields.forEach((field) => document.getElementById(field).addEventListener('input', () => showFieldError(field, '')));

