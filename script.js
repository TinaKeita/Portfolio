// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Scroll progress bar + header state ----------
const progressBar = document.getElementById('scrollProgress');
const header = document.getElementById('siteHeader');
const toTopBtn = document.getElementById('toTop');

function onScroll() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  if (progressBar) progressBar.style.width = pct + '%';
  if (header) header.classList.toggle('scrolled', scrollTop > 12);
  if (toTopBtn) toTopBtn.classList.toggle('visible', scrollTop > 500);
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

if (toTopBtn) {
  toTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
}

// ---------- Scrollspy: highlight the active nav link ----------
const navLinks = Array.from(document.querySelectorAll('.nav-link'));
const navIndicator = document.querySelector('.nav-indicator');
const sections = navLinks
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

function moveIndicatorTo(link) {
  if (!navIndicator || !link) return;
  navIndicator.style.width = link.offsetWidth + 'px';
  navIndicator.style.transform = `translateX(${link.offsetLeft}px)`;
}

function setActiveLink(link) {
  navLinks.forEach(l => l.classList.remove('active'));
  if (link) {
    link.classList.add('active');
    moveIndicatorTo(link);
  }
}

if ('IntersectionObserver' in window && sections.length) {
  const spy = new IntersectionObserver(
    entries => {
      const visible = entries.filter(e => e.isIntersecting);
      if (visible.length) {
        const id = '#' + visible[0].target.id;
        const match = navLinks.find(l => l.getAttribute('href') === id);
        if (match) setActiveLink(match);
      }
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );
  sections.forEach(section => spy.observe(section));
}

window.addEventListener('load', () => {
  setActiveLink(navLinks[0]);
});
window.addEventListener('resize', () => {
  const active = document.querySelector('.nav-link.active');
  if (active) moveIndicatorTo(active);
});

// ---------- Highlight the "Say hi" button when the contact section is in view ----------
const navCta = document.querySelector('.nav-cta');
const contactSection = document.getElementById('contact');

if ('IntersectionObserver' in window && navCta && contactSection) {
  const ctaObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        navCta.classList.toggle('at-contact', entry.isIntersecting);
      });
    },
    { threshold: 0.35 }
  );
  ctaObserver.observe(contactSection);
}

// ---------- Video lightbox for project previews ----------
const videoLightbox = document.getElementById('videoLightbox');
const lightboxVideo = document.getElementById('lightboxVideo');
const lightboxClose = document.querySelector('.video-lightbox-close');

function openVideoLightbox(src) {
  if (!videoLightbox || !lightboxVideo) return;
  lightboxVideo.src = src;
  videoLightbox.classList.add('open');
  videoLightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  lightboxVideo.play().catch(() => {});
}

function closeVideoLightbox() {
  if (!videoLightbox || !lightboxVideo) return;
  videoLightbox.classList.remove('open');
  videoLightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  lightboxVideo.pause();
  lightboxVideo.removeAttribute('src');
  lightboxVideo.load();
}

document.querySelectorAll('.media-frame[data-video]').forEach(frame => {
  const playBtn = frame.querySelector('.media-play');
  if (playBtn) {
    playBtn.addEventListener('click', e => {
      e.stopPropagation();
      openVideoLightbox(frame.dataset.video);
    });
  }
});

if (videoLightbox) {
  videoLightbox.addEventListener('click', closeVideoLightbox);
}
if (lightboxClose) {
  lightboxClose.addEventListener('click', e => {
    e.stopPropagation();
    closeVideoLightbox();
  });
}
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeVideoLightbox();
});

// ---------- Fade content in and out as it scrolls through view ----------
const fadeEls = document.querySelectorAll('.fade-in');

if ('IntersectionObserver' in window && fadeEls.length) {
  const fadeObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        entry.target.classList.toggle('in-view', entry.isIntersecting);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
  );
  fadeEls.forEach(el => fadeObserver.observe(el));
} else {
  fadeEls.forEach(el => el.classList.add('in-view'));
}

// ---------- Project image tilt (responds to cursor, not autoplay) ----------
if (!prefersReducedMotion) {
  document.querySelectorAll('.media-frame').forEach(frame => {
    const strength = 8; // max degrees of tilt

    frame.addEventListener('mousemove', e => {
      const rect = frame.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      frame.style.transform = `rotateY(${x * strength}deg) rotateX(${-y * strength}deg)`;
    });

    frame.addEventListener('mouseleave', () => {
      frame.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
  });

  // ---------- Magnetic hover for nav links, project links, contact email ----------
  document.querySelectorAll('.magnetic').forEach(el => {
    const pull = 0.35;

    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * pull;
      const y = (e.clientY - rect.top - rect.height / 2) * pull;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });
}

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close menu after tapping a link (mobile)
  siteNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}