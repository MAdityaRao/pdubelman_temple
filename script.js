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
        let visibleCount = 0;
        galleryItems.forEach(item => {
          const match = filter === 'all' || item.dataset.category === filter;
          if (match) {
            item.style.display = '';
            // Use rAF to trigger transition after display is restored
            requestAnimationFrame(() => item.classList.remove('gallery-filtered'));
            visibleCount++;
          } else {
            item.style.display = 'none';
          }
        });
        // Scroll gallery back to start when filter changes
        if (galleryContainer) galleryContainer.scrollLeft = 0;
      });
    });
  }

  /* Lightbox */
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img || !lightbox || !lightboxImg) return;
      closeNav(); // close mobile nav if open before showing lightbox
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

  /* Drag to scroll gallery — desktop mouse only */
  if (galleryContainer) {
    let isDragging = false, startX = 0, scrollLeft = 0, hasDragged = false;

    galleryContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      hasDragged = false;
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
      const walk = (x - startX) * 1.4;
      if (Math.abs(walk) > 3) hasDragged = true;
      galleryContainer.scrollLeft = scrollLeft - walk;
    }, { passive: false });

    // Prevent click from firing after a drag
    galleryContainer.addEventListener('click', (e) => {
      if (hasDragged) { e.stopPropagation(); hasDragged = false; }
    }, true);
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

/* ===== SEVA BOOKING — WhatsApp submit ===== */
function submitSevaBooking() {
  const nameEl     = document.getElementById('bf-name');
  const phoneEl    = document.getElementById('bf-phone');
  const sevaEl     = document.getElementById('bf-seva');
  const dateEl     = document.getElementById('bf-date');
  const occasionEl = document.getElementById('bf-occasion');
  const notesEl    = document.getElementById('bf-notes');

  function showErr(id, show) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('visible', show);
  }
  function markErr(el, invalid) {
    if (el) el.classList.toggle('input-error', invalid);
  }

  let valid = true;

  const nameVal = nameEl ? nameEl.value.trim() : '';
  const nameOk = nameVal.length >= 2;
  showErr('err-name', !nameOk); markErr(nameEl, !nameOk);
  if (!nameOk) valid = false;

  const rawPhone = phoneEl ? phoneEl.value.replace(/[\s\-().+]/g, '') : '';
  const phoneOk = /^\d{10,13}$/.test(rawPhone);
  showErr('err-phone', !phoneOk); markErr(phoneEl, !phoneOk);
  if (!phoneOk) valid = false;

  const sevaVal = sevaEl ? sevaEl.value.trim() : '';
  const sevaOk = sevaVal !== '';
  showErr('err-seva', !sevaOk); markErr(sevaEl, !sevaOk);
  if (!sevaOk) valid = false;

  const dateVal = dateEl ? dateEl.value : '';
  const dateOk = dateVal !== '';
  showErr('err-date', !dateOk); markErr(dateEl, !dateOk);
  if (!dateOk) valid = false;

  if (!valid) return;

  const formattedDate = new Date(dateVal + 'T00:00:00').toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  const lines = [
    '🙏 *Seva Booking Request*',
    '*Sri Mahalingeshwara Temple, Padubelman*',
    '─────────────────────',
    `👤 *Name:* ${nameVal}`,
    `📞 *Phone:* ${phoneEl.value.trim()}`,
    `🕉️ *Seva:* ${sevaVal}`,
    `📅 *Date:* ${formattedDate}`,
  ];
  const occasionVal = occasionEl ? occasionEl.value.trim() : '';
  if (occasionVal) lines.push(`🎉 *Occasion:* ${occasionVal}`);
  const notesVal = notesEl ? notesEl.value.trim() : '';
  if (notesVal) lines.push(`📝 *Notes:* ${notesVal}`);
  lines.push('─────────────────────');
  lines.push('_Please confirm availability. Thank you!_');

  const msg = encodeURIComponent(lines.join('\n'));
  window.open('https://wa.me/919880544629?text=' + msg, '_blank', 'noopener,noreferrer');
}

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
    'images.upi.alt': 'Temple UPI QR Code',
    'booking.title': 'Book a Seva via WhatsApp',
    'booking.subtitle': "Fill in your details and we'll open WhatsApp with your booking pre-filled",
    'booking.name.label': 'Your Full Name',
    'booking.name.placeholder': 'e.g. Ramesh Kumar',
    'booking.name.err': 'Please enter your name (min 2 characters)',
    'booking.phone.label': 'Phone Number',
    'booking.phone.placeholder': 'e.g. 98765 43210',
    'booking.phone.err': 'Please enter a valid 10-digit phone number',
    'booking.seva.label': 'Select Seva',
    'booking.seva.placeholder': '-- Choose a Seva --',
    'booking.seva.group1': 'Daily Sevas',
    'booking.seva.group2': 'Special Sevas',
    'booking.seva.opt1': 'Panchakajaya — ₹20',
    'booking.seva.opt2': 'Rudrabhisheka — ₹50',
    'booking.seva.opt3': 'Maha Pooje — ₹50',
    'booking.seva.opt4': 'Nitya Pooje — ₹250',
    'booking.seva.opt5': 'Shashwatha Pooje — ₹3001',
    'booking.seva.opt6': 'Ranga Pooje — As per request',
    'booking.seva.opt7': 'Shatarudrabhisheka — As per request',
    'booking.seva.err': 'Please select a seva',
    'booking.date.label': 'Preferred Date',
    'booking.date.err': 'Please select a date',
    'booking.occasion.label': 'Occasion',
    'booking.occasion.placeholder': 'e.g. Birthday, Anniversary',
    'booking.optional': '(optional)',
    'booking.notes.label': 'Additional Notes',
    'booking.notes.placeholder': 'Any special instructions or requests...',
    'booking.submit': 'Send Booking on WhatsApp',
    'booking.note': 'Tapping the button will open WhatsApp with your booking details pre-filled. The temple team will confirm your seva within 24 hours.'
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
    'images.upi.alt': 'ದೇವಾಲಯ ಯುಪಿಐ ಕ್ಯೂಆರ್ ಕೋಡ್',
    'booking.title': 'ವಾಟ್ಸ್‌ಆಪ್ ಮೂಲಕ ಸೇವೆ ಬುಕ್ ಮಾಡಿ',
    'booking.subtitle': 'ನಿಮ್ಮ ವಿವರಗಳನ್ನು ತುಂಬಿಸಿ — ನಿಮ್ಮ ಬುಕ್ಕಿಂಗ್ ವಾಟ್ಸ್‌ಆಪ್‌ನಲ್ಲಿ ತೆರೆಯಲ್ಪಡುತ್ತದೆ',
    'booking.name.label': 'ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು',
    'booking.name.placeholder': 'ಉದಾ: ರಮೇಶ್ ಕುಮಾರ್',
    'booking.name.err': 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹೆಸರನ್ನು ನಮೂದಿಸಿ',
    'booking.phone.label': 'ಫೋನ್ ಸಂಖ್ಯೆ',
    'booking.phone.placeholder': 'ಉದಾ: 98765 43210',
    'booking.phone.err': 'ದಯವಿಟ್ಟು ಸರಿಯಾದ ಫೋನ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ',
    'booking.seva.label': 'ಸೇವೆ ಆಯ್ಕೆ ಮಾಡಿ',
    'booking.seva.placeholder': '-- ಸೇವೆ ಆಯ್ಕೆ ಮಾಡಿ --',
    'booking.seva.group1': 'ದೈನಂದಿನ ಸೇವೆಗಳು',
    'booking.seva.group2': 'ವಿಶೇಷ ಸೇವೆಗಳು',
    'booking.seva.opt1': 'ಪಂಚಕಜ್ಜಾಯ — ₹20',
    'booking.seva.opt2': 'ರುದ್ರಾಭಿಷೇಕ — ₹50',
    'booking.seva.opt3': 'ಮಹಾ ಪೂಜೆ — ₹50',
    'booking.seva.opt4': 'ನಿತ್ಯ ಪೂಜೆ — ₹250',
    'booking.seva.opt5': 'ಶಾಶ್ವತ ಪೂಜೆ — ₹3001',
    'booking.seva.opt6': 'ರಂಗ ಪೂಜೆ — ವಿನಂತಿಯಂತೆ',
    'booking.seva.opt7': 'ಶತರುದ್ರಾಭಿಷೇಕ — ವಿನಂತಿಯಂತೆ',
    'booking.seva.err': 'ದಯವಿಟ್ಟು ಸೇವೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ',
    'booking.date.label': 'ಆದ್ಯತೆಯ ದಿನಾಂಕ',
    'booking.date.err': 'ದಯವಿಟ್ಟು ದಿನಾಂಕ ಆಯ್ಕೆ ಮಾಡಿ',
    'booking.occasion.label': 'ಸಂದರ್ಭ',
    'booking.occasion.placeholder': 'ಉದಾ: ಹುಟ್ಟುಹಬ್ಬ, ವಾರ್ಷಿಕೋತ್ಸವ',
    'booking.optional': '(ಐಚ್ಛಿಕ)',
    'booking.notes.label': 'ಹೆಚ್ಚಿನ ಟಿಪ್ಪಣಿಗಳು',
    'booking.notes.placeholder': 'ಯಾವುದಾದರೂ ವಿಶೇಷ ಸೂಚನೆಗಳು...',
    'booking.submit': 'ವಾಟ್ಸ್‌ಆಪ್‌ನಲ್ಲಿ ಬುಕ್ಕಿಂಗ್ ಕಳುಹಿಸಿ',
    'booking.note': 'ಬಟನ್ ಒತ್ತಿದ ನಂತರ ನಿಮ್ಮ ಬುಕ್ಕಿಂಗ್ ವಿವರಗಳೊಂದಿಗೆ ವಾಟ್ಸ್‌ಆಪ್ ತೆರೆಯುತ್ತದೆ. ದೇವಾಲಯ ತಂಡವು 24 ಗಂಟೆಯೊಳಗೆ ದೃಢೀಕರಿಸುತ್ತದೆ.'
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
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const val = i18n[lang]?.[key];
    if (val !== undefined) el.setAttribute('placeholder', val);
  });
  document.querySelectorAll('[data-i18n-label]').forEach(el => {
    const key = el.getAttribute('data-i18n-label');
    const val = i18n[lang]?.[key];
    if (val !== undefined) el.setAttribute('label', val);
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