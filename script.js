/* ============================================================
   MAHALINGESHWARA TEMPLE — SCRIPT.JS (Premium Redesign)
   ============================================================ */

/* ===== MOBILE NAVIGATION ===== */
function toggleNav() {
  const navLinks = document.getElementById('nav-links');
  const navToggle = document.querySelector('.nav-toggle');
  if (!navLinks) return;
  const isOpen = navLinks.classList.toggle('active');
  if (navToggle) {
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  }
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeNav() {
  const navLinks = document.getElementById('nav-links');
  const navToggle = document.querySelector('.nav-toggle');
  if (navLinks) navLinks.classList.remove('active');
  if (navToggle) {
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-toggle').forEach(btn => {
    if (!btn.hasAttribute('onclick')) {
      btn.addEventListener('click', toggleNav);
    }
  });
});

document.addEventListener('click', (e) => {
  if (e.target.closest('.nav-links a')) { closeNav(); return; }
  const navLinks = document.getElementById('nav-links');
  if (navLinks && navLinks.classList.contains('active')) {
    if (!e.target.closest('.navbar') && !e.target.closest('.page-header nav')) {
      closeNav();
    }
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeNav();
});

/* ===== NAVBAR SCROLL ===== */
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (!navbar || navbar.classList.contains('solid-nav')) return;
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
    navbar.classList.remove('transparent');
  } else {
    navbar.classList.remove('scrolled');
    navbar.classList.add('transparent');
  }
}, { passive: true });

/* ===== HERO BG LOAD ===== */
document.addEventListener('DOMContentLoaded', () => {
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) setTimeout(() => heroBg.classList.add('loaded'), 120);
});

/* ===== SCROLL ANIMATIONS ===== */
document.addEventListener('DOMContentLoaded', () => {
  const opts = { threshold: 0.08, rootMargin: '0px 0px -50px 0px' };
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, opts);
  document.querySelectorAll('.fade-in, .slide-up').forEach(el => obs.observe(el));
});

/* ===== LAZY IMAGE LOADING ===== */
document.addEventListener('DOMContentLoaded', () => {
  const imgObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.addEventListener('load', () => img.classList.add('loaded'));
        img.addEventListener('error', () => img.classList.add('loaded'));
        if (img.complete) img.classList.add('loaded');
        imgObs.unobserve(img);
      }
    });
  });
  document.querySelectorAll('.gallery-item img').forEach(img => imgObs.observe(img));
});

/* ===== RITUAL CARDS ACCORDION ===== */
function toggleRitual(card) {
  const isOpen = card.classList.contains('open');
  document.querySelectorAll('.ritual-card.open').forEach(c => {
    c.classList.remove('open');
    c.setAttribute('aria-expanded', 'false');
    const d = c.querySelector('.ritual-details');
    if (d) d.classList.remove('active');
  });
  if (!isOpen) {
    card.classList.add('open');
    card.setAttribute('aria-expanded', 'true');
    const details = card.querySelector('.ritual-details');
    if (details) details.classList.add('active');
  }
}

/* Keyboard support for ritual cards */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.ritual-card').forEach(card => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleRitual(card);
      }
    });
  });
});

/* ===== SEVA ACCORDION ===== */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.seva-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.seva-item');
      if (!item) return;
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.seva-item.active').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.seva-header')?.setAttribute('aria-expanded', 'false');
      });
      if (!isActive) {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
      }
    });

    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        header.click();
      }
    });
  });
});

/* ===== GALLERY: FILTER + LIGHTBOX + DRAG SCROLL ===== */
document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const galleryContainer = document.getElementById('gallery-container');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');

  /* Filter */
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        galleryItems.forEach(item => {
          const match = filter === 'all' || item.dataset.category === filter;
          item.style.display = match ? '' : 'none';
          item.style.opacity = match ? '1' : '0';
        });
      });
    });
  }

  /* Lightbox */
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img || !lightbox || !lightboxImg) return;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
    /* Keyboard */
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.click(); }
    });
  });

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    if (lightboxImg) lightboxImg.src = '';
  }

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* Drag to scroll gallery */
  if (galleryContainer) {
    let isDragging = false, startX = 0, scrollLeft = 0;

    galleryContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.pageX - galleryContainer.offsetLeft;
      scrollLeft = galleryContainer.scrollLeft;
      galleryContainer.style.cursor = 'grabbing';
    });
    galleryContainer.addEventListener('mouseleave', () => {
      isDragging = false;
      galleryContainer.style.cursor = '';
    });
    galleryContainer.addEventListener('mouseup', () => {
      isDragging = false;
      galleryContainer.style.cursor = '';
    });
    galleryContainer.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - galleryContainer.offsetLeft;
      galleryContainer.scrollLeft = scrollLeft - (x - startX) * 1.4;
    });
  }
});

/* ===== AMBIENT CURSOR GLOW (desktop only) ===== */
document.addEventListener('DOMContentLoaded', () => {
  const layer = document.getElementById('ambientLayer');
  if (!layer || window.matchMedia('(max-width:900px)').matches) return;
  if (window.matchMedia('(hover:none)').matches) return;

  window.addEventListener('pointermove', (e) => {
    document.documentElement.style.setProperty('--mx', `${e.clientX}px`);
    document.documentElement.style.setProperty('--my', `${e.clientY}px`);
  }, { passive: true });
});

/* ===== ACTIVE NAV LINK on scroll ===== */
document.addEventListener('DOMContentLoaded', () => {
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  if (!sections.length || !navLinks.length) return;

  const setActive = () => {
    const fromTop = window.scrollY + 130;
    let current = sections[0].id;
    sections.forEach(s => { if (s.offsetTop <= fromTop) current = s.id; });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };

  setActive();
  window.addEventListener('scroll', setActive, { passive: true });
});

/* ===== FOOTER YEAR ===== */
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
});

/* ===== SEVA i18n (seva.html only) ===== */
const i18n = {
  en: {
    title: 'Sevas | Mahalingeshwara Temple',
    'hero.h1': 'Divine Sevas & Offerings',
    'hero.p': 'Daily poojas, abhishekas, homas, and special rituals offered with devotion',
    'groups.daily': 'Daily Sevas',
    'groups.special': 'Special Sevas (On Request)',
    'badges.daily': 'Daily',
    'badges.special': 'Special',
    'prices.asReq': 'As per request',
    'sevas.panchakajaya.name': 'Panchakajaya',
    'sevas.panchakajaya.desc': 'Panchakajaya is a wholesome prasada prepared with jaggery, sesame, coconut, ghee and honey. Offered with simple devotion, it signifies balance of the five elements and the sweetness of a steady mind.',
    'sevas.rudra.name': 'Rudrabhisheka',
    'sevas.rudra.desc': 'The Shiva Linga is bathed with water, milk and sacred dravyas while chanting Sri Rudram. Devotees undertake this seva to dissolve inner negativity and invite clarity, health and protection.',
    'sevas.maha.name': 'Maha Pooje',
    'sevas.maha.desc': 'A complete worship including alankara, naivedya and mangalarati. This seva is performed for overall well-being and the grace of Lord Mahalingeshwara.',
    'sevas.nitya.name': 'Nitya Pooje',
    'sevas.nitya.desc': 'The temple\'s daily worship cycle with alankara, naivedya and arati, performed on behalf of the devotee. Supporting Nitya Pooje sustains the temple\'s spiritual rhythm.',
    'sevas.shashwatha.name': 'Shashwatha Pooje',
    'sevas.shashwatha.desc': 'A one-time endowment through which pooja is performed annually in the devotee\'s name, carrying blessings to future generations.',
    'sevas.ranga.name': 'Ranga Pooje',
    'sevas.shatarudra.name': 'Shatarudrabhisheka',
    'contact.line': 'For bookings and details: +91 9880 544 629 · padubelmantemple@gmail.com',
    'donation.title': 'Donations and Temple Support',
    'donation.note': 'Devotees may kindly contribute towards daily poojas, special sevas, and the development of the temple. Your offerings help sustain the spiritual and cultural activities of Mahalingeshwara Temple.',
    'donation.templename.label': 'Temple Name:',
    'donation.templename.value': 'Mahalingeshwara Temple, Padubelman',
    'donation.bank.label': 'Bank:',
    'donation.bank.value': 'Indian Overseas Bank',
    'donation.branch.label': 'Branch:',
    'donation.branch.value': 'Belmannu (2591)',
    'donation.acno.label': 'Account No:',
    'donation.ifsc.label': 'IFSC:',
    'donation.upi.text': 'Scan to Donate via UPI:',
    'footer.mantra': 'Om Namah Shivaya',
    'footer.templename': 'Mahalingeshwara Temple, Padubelman',
    'images.upi.alt': 'Temple UPI QR Code'
  },
  kn: {
    title: 'ಸೇವೆಗಳು | ಮಹಾಲಿಂಗೇಶ್ವರ ದೇವಾಲಯ',
    'hero.h1': 'ದೈವಿಕ ಸೇವೆಗಳು ಮತ್ತು ಸಮರ್ಪಣೆಗಳು',
    'hero.p': 'ಭಕ್ತಿಭಾವದಿಂದ ನೆರವೇರುವ ದೈನಂದಿನ ಪೂಜೆ, ಅಭಿಷೇಕ, ಹೋಮ ಮತ್ತು ವಿಶೇಷ ವಿಧಿಗಳು',
    'groups.daily': 'ದೈನಂದಿನ ಸೇವೆಗಳು',
    'groups.special': 'ವಿಶೇಷ ಸೇವೆಗಳು (ವಿನಂತಿಯ ಮೇರೆಗೆ)',
    'badges.daily': 'ಪ್ರತಿ ದಿನ',
    'badges.special': 'ವಿಶೇಷ',
    'prices.asReq': 'ವಿನಂತಿಯಂತೆ',
    'sevas.panchakajaya.name': 'ಪಂಚಕಜ್ಜಾಯ',
    'sevas.panchakajaya.desc': 'ಪಂಚಕಜ್ಜಾಯವು ಬೆಲ್ಲ, ಎಳ್ಳು, ತೆಂಗಿನಕಾಯಿ, ತುಪ್ಪ ಮತ್ತು ಜೇನುಗಳಿಂದ ತಯಾರಾಗುವ ಪೂಜಾ ಪ್ರಸಾದ.',
    'sevas.rudra.name': 'ರುದ್ರಾಭಿಷೇಕ',
    'sevas.rudra.desc': 'ಶಿವಲಿಂಗಕ್ಕೆ ನೀರು, ಹಾಲು ಹಾಗೂ ಪವಿತ್ರ ದ್ರವ್ಯಗಳಿಂದ ಅಭಿಷೇಕ ಮಾಡುತ್ತಾ ಶ್ರೀ ರುದ್ರಂ ಪಠಿಸಲಾಗುತ್ತದೆ.',
    'sevas.maha.name': 'ಮಹಾ ಪೂಜೆ',
    'sevas.maha.desc': 'ಅಲಂಕಾರ, ನೈವೇದ್ಯ ಮತ್ತು ಮಂಗಳಾರತಿ ಒಳಗೊಂಡ ಸಂಪೂರ್ಣ ಪೂಜೆ.',
    'sevas.nitya.name': 'ನಿತ್ಯ ಪೂಜೆ',
    'sevas.nitya.desc': 'ಅಲಂಕಾರ, ನೈವೇದ್ಯ ಮತ್ತು ಆರತಿಯೊಂದಿಗೆ ದೈನಂದಿನ ದೇವಾಲಯ ಪೂಜೆ.',
    'sevas.shashwatha.name': 'ಶಾಶ್ವತ ಪೂಜೆ',
    'sevas.shashwatha.desc': 'ಒಮ್ಮೆದಿನ ದಾನ ಮುಖಾಂತರ ಪ್ರತಿವರ್ಷ ಭಕ್ತರ ಹೆಸರಿನಲ್ಲಿ ಪೂಜೆ ನೆರವೇರುವ ಸೇವೆ.',
    'sevas.ranga.name': 'ರಂಗ ಪೂಜೆ',
    'sevas.shatarudra.name': 'ಶತರುದ್ರಾಭಿಷೇಕ',
    'contact.line': 'ಬುಕ್ಕಿಂಗ್ ಮತ್ತು ವಿವರಗಳಿಗೆ: +91 9880544629 • padubelmantemple@gmail.com',
    'donation.title': 'ದಾನಗಳು ಮತ್ತು ದೇವಾಲಯ ಬೆಂಬಲ',
    'donation.note': 'ಭಕ್ತರು ದೈನಂದಿನ ಪೂಜೆಗಳು, ವಿಶೇಷ ಸೇವೆಗಳು ಮತ್ತು ದೇವಾಲಯಾಭಿವೃದ್ಧಿಗಾಗಿ ದಯವಿಟ್ಟು ದಾನವಾಗಿ ಸಹಕರಿಸಬಹುದು.',
    'donation.templename.label': 'ದೇವಾಲಯದ ಹೆಸರು:',
    'donation.templename.value': 'ಮಹಾಲಿಂಗೇಶ್ವರ ದೇವಾಲಯ, ಪದುಬೆಲ್ಮಣ',
    'donation.bank.label': 'ಬ್ಯಾಂಕ್:',
    'donation.bank.value': 'ಇಂಡಿಯನ್ ಓವರ್‌ಸೀಸ್ ಬ್ಯಾಂಕ್',
    'donation.branch.label': 'ಶಾಖೆ:',
    'donation.branch.value': 'ಬೆಲಮಣ್ಣು (2591)',
    'donation.acno.label': 'ಖಾತೆ ಸಂಖ್ಯೆ:',
    'donation.ifsc.label': 'ಐಎಫ್‌ಎಸ್‌ಸಿ:',
    'donation.upi.text': 'ಯುಪಿಐ ಮೂಲಕ ದಾನ ಮಾಡಲು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ:',
    'footer.mantra': 'ಓಂ ನಮಃ ಶಿವಾಯ',
    'footer.templename': 'ಮಹಾಲಿಂಗೇಶ್ವರ ದೇವಾಲಯ, ಪದುಬೆಲ್ಮಣ',
    'images.upi.alt': 'ದೇವಾಲಯ ಯುಪಿಐ ಕ್ಯೂಆರ್ ಕೋಡ್'
  }
};

function applyLang(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = i18n[lang]?.[key];
    if (val !== undefined) {
      if (/<\/?(strong|em|p|br|span)/i.test(String(val))) el.innerHTML = val;
      else el.textContent = val;
    }
  });
  document.querySelectorAll('[data-i18n-alt]').forEach(el => {
    const key = el.getAttribute('data-i18n-alt');
    const val = i18n[lang]?.[key];
    if (val) el.setAttribute('alt', val);
  });
  if (i18n[lang]?.title) document.title = i18n[lang].title;
  const btn = document.getElementById('langBtn');
  if (btn) {
    btn.textContent = lang === 'en' ? 'ಕನ್ನಡ' : 'English';
    btn.setAttribute('aria-pressed', String(lang === 'kn'));
  }
  try { localStorage.setItem('lang', lang); } catch(e) {}
  document.documentElement.lang = lang === 'kn' ? 'kn' : 'en';
}

document.addEventListener('DOMContentLoaded', () => {
  const langBtn = document.getElementById('langBtn');
  if (!langBtn) return;
  let currentLang = 'en';
  try { currentLang = localStorage.getItem('lang') || 'en'; } catch(e) {}
  applyLang(currentLang);
  langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'kn' : 'en';
    applyLang(currentLang);
  });
});