/* ============================================================
   MAHALINGESHWARA TEMPLE — SCRIPT.JS
   ============================================================ */

/* --- Mobile Navigation --- */
function toggleNav() {
  const navLinks = document.getElementById('nav-links');
  const navToggle = document.querySelector('.nav-toggle');
  if (!navLinks) return;
  const isOpen = navLinks.classList.toggle('active');
  if (navToggle) navToggle.classList.toggle('open', isOpen);
}

function closeNav() {
  const navLinks = document.getElementById('nav-links');
  const navToggle = document.querySelector('.nav-toggle');
  if (navLinks) navLinks.classList.remove('active');
  if (navToggle) navToggle.classList.remove('open');
}

/* Close nav on link click */
document.addEventListener('click', (e) => {
  const navLinks = document.getElementById('nav-links');
  if (!navLinks) return;
  if (e.target.closest('.nav-links a')) closeNav();
});

/* --- Navbar Scroll Effect --- */
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (!navbar || navbar.classList.contains('solid-nav')) return;
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* --- Hero background parallax load --- */
document.addEventListener('DOMContentLoaded', () => {
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    setTimeout(() => heroBg.classList.add('loaded'), 100);
  }
});

/* --- Scroll Animations (Intersection Observer) --- */
document.addEventListener('DOMContentLoaded', () => {
  const observerOpts = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOpts);

  document.querySelectorAll('.fade-in, .slide-up').forEach(el => observer.observe(el));
});

/* --- Ritual Cards Accordion --- */
function toggleRitual(card) {
  const isOpen = card.classList.contains('open');
  document.querySelectorAll('.ritual-card.open').forEach(c => c.classList.remove('open'));
  document.querySelectorAll('.ritual-details.active').forEach(d => d.classList.remove('active'));

  if (!isOpen) {
    card.classList.add('open');
    const details = card.querySelector('.ritual-details');
    if (details) details.classList.add('active');
  }
}

/* --- Seva Accordion --- */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.seva-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.seva-item');
      if (!item) return;
      const isActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.seva-item.active').forEach(i => {
        i.classList.remove('active');
        const h = i.querySelector('.seva-header');
        if (h) h.setAttribute('aria-expanded', 'false');
      });

      // Open clicked (if was closed)
      if (!isActive) {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });
});

/* --- Gallery: Filter, Lightbox & Drag Scroll --- */
document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const galleryContainer = document.getElementById('gallery-container');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');

  /* Filtering */
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        galleryItems.forEach(item => {
          if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.style.opacity = '0';
            item.style.display = 'flex';
            requestAnimationFrame(() => {
              requestAnimationFrame(() => { item.style.opacity = '1'; });
            });
          } else {
            item.style.opacity = '0';
            setTimeout(() => { item.style.display = 'none'; }, 300);
          }
        });
      });
    });
  }

  /* Gallery item fade transitions */
  galleryItems.forEach(item => {
    item.style.transition = 'opacity 0.3s ease, transform 0.35s ease, box-shadow 0.35s ease';
  });

  /* Drag-to-scroll */
  if (galleryContainer) {
    let isDown = false;
    let startX;
    let scrollLeft;
    let moved = false;

    galleryContainer.addEventListener('mousedown', e => {
      isDown = true;
      moved = false;
      startX = e.pageX - galleryContainer.offsetLeft;
      scrollLeft = galleryContainer.scrollLeft;
    });
    galleryContainer.addEventListener('mouseleave', () => { isDown = false; });
    galleryContainer.addEventListener('mouseup', () => { isDown = false; });
    galleryContainer.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - galleryContainer.offsetLeft;
      const walk = (x - startX) * 1.4;
      if (Math.abs(walk) > 4) moved = true;
      galleryContainer.scrollLeft = scrollLeft - walk;
    });

    /* Prevent lightbox opening when user is dragging */
    galleryItems.forEach(item => {
      item.addEventListener('click', e => {
        if (moved) { moved = false; return; }
        const img = item.querySelector('img');
        if (!img || !lightbox || !lightboxImg) return;
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      });
    });
  }

  /* Lightbox close */
  if (lightbox && lightboxImg) {
    const closeLightbox = () => {
      lightbox.style.display = 'none';
      lightboxImg.src = '';
      document.body.style.overflow = '';
    };
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && lightbox.style.display === 'flex') closeLightbox();
    });
  }
});

/* --- Smooth anchor scrolling --- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
    const top = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* --- Year auto-fill --- */
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

/* ============================================================
   i18n — Language switch (Seva page)
   ============================================================ */
const i18n = {
  en: {
    title: 'Sevas | Mahalingeshwara Temple',
    'hero.h1': 'Divine Sevas and Offerings',
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
    'sevas.nitya.desc': "The temple's daily worship cycle with alankara, naivedya and arati, performed on behalf of the devotee. Supporting Nitya Pooje sustains the temple's spiritual rhythm.",
    'sevas.shashwatha.name': 'Shashwatha Pooje',
    'sevas.shashwatha.desc': "A one-time endowment through which pooja is performed annually in the devotee's name, carrying blessings to future generations.",
    'sevas.ranga.name': 'Ranga Pooje',
    'sevas.ranga.desc': '<p>Ranga Pooje is a special evening ritual performed only on the request of devotees. It begins at <strong>6:00 PM</strong>, where freshly cooked rice is first offered to <strong>Lord Mahalingeshwara</strong> and <strong>Lord Ganapathi</strong>. Following this, the <em>Bali</em> ritual is carried out, where uncooked rice placed on leaves is respectfully offered to the Bali stones located both inside and outside the temple premises.</p>',
    'sevas.shatarudra.name': 'Shatarudrabhisheka',
    'sevas.shatarudra.desc': '<p>Shatarudrabhisheka is regarded as one of the most powerful and sacred sevas offered to Lord Mahalingeshwara. In this ritual, the <strong>Sri Rudram</strong> is chanted one hundred times with deep devotion while the Shiva Linga is bathed with holy water, panchamruta, tender coconut, and other sacred offerings.</p>',
    'contact.line': 'For bookings and details: +91 9880544629 \u2022 padubelmantemple@gmail.com',
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
    'footer.templename': 'Mahalingeshwara Temple, Padubelman',
    'footer.mantra': 'Om Namah Shivaya',
    'images.upi.alt': 'Temple UPI QR Code'
  },
  kn: {
    title: '\u0cb8\u0cc7\u0cb5\u0cc6\u0c97\u0cb3\u0cc1 | \u0cae\u0cb9\u0cbe\u0cb2\u0cbf\u0c82\u0c97\u0cc7\u0cb6\u0ccd\u0cb5\u0cb0 \u0ca6\u0cc7\u0cb5\u0cbe\u0cb2\u0caf',
    'hero.h1': '\u0ca6\u0cc8\u0cb5\u0cbf\u0c95 \u0cb8\u0cc7\u0cb5\u0cc6\u0c97\u0cb3\u0cc1 \u0cae\u0ca4\u0ccd\u0ca4\u0cc1 \u0cb8\u0cae\u0cb0\u0ccd\u0caa\u0ca3\u0cc6\u0c97\u0cb3\u0cc1',
    'hero.p': '\u0cad\u0c95\u0ccd\u0ca4\u0cbf\u0cad\u0cbe\u0cb5\u0ca6\u0cbf\u0c82\u0ca6 \u0ca8\u0cc6\u0cb0\u0cb5\u0cc7\u0cb0\u0cc1\u0cb5 \u0ca6\u0cc8\u0ca8\u0c82\u0ca6\u0cbf\u0ca8 \u0caa\u0cc2\u0c9c\u0cc6, \u0c85\u0cad\u0cbf\u0cb7\u0cc7\u0c95, \u0cb9\u0ccb\u0cae \u0cae\u0ca4\u0ccd\u0ca4\u0cc1 \u0cb5\u0cbf\u0cb6\u0cc7\u0cb7 \u0cb5\u0cbf\u0ca7\u0cbf\u0c97\u0cb3\u0cc1',
    'groups.daily': '\u0ca6\u0cc8\u0ca8\u0c82\u0ca6\u0cbf\u0ca8 \u0cb8\u0cc7\u0cb5\u0cc6\u0c97\u0cb3\u0cc1',
    'groups.special': '\u0cb5\u0cbf\u0cb6\u0cc7\u0cb7 \u0cb8\u0cc7\u0cb5\u0cc6\u0c97\u0cb3\u0cc1 (\u0cb5\u0cbf\u0ca8\u0c82\u0ca4\u0cbf\u0caf \u0cae\u0cc7\u0cb0\u0cc6\u0c97\u0cc6)',
    'badges.daily': '\u0caa\u0ccd\u0cb0\u0ca4\u0cbf \u0ca6\u0cbf\u0ca8',
    'badges.endowment': '\u0cb8\u0ccd\u0c96\u0cbe\u0caf\u0cbf \u0ca8\u0cbf\u0ca7\u0cbf',
    'badges.special': '\u0cb5\u0cbf\u0cb6\u0cc7\u0cb7',
    'prices.asReq': '\u0cb5\u0cbf\u0ca8\u0c82\u0ca4\u0cbf\u0caf\u0c82\u0ca4\u0cc6',
    'sevas.panchakajaya.name': '\u0caa\u0c82\u0c9a\u0c95\u0c9c\u0ccd\u0c9c\u0cbe\u0caf',
    'sevas.panchakajaya.desc': '\u0caa\u0c82\u0c9a\u0c95\u0c9c\u0ccd\u0c9c\u0cbe\u0caf\u0cb5\u0cc1 \u0cac\u0cc6\u0cb2\u0ccd\u0cb2, \u0cc6\u0cb3\u0ccd\u0cb3\u0cc1, \u0ca4\u0cc6\u0c82\u0c97\u0cbf\u0ca8\u0c95\u0cbe\u0caf\u0cbf, \u0ca4\u0cc1\u0caa\u0ccd\u0caa \u0cae\u0ca4\u0ccd\u0ca4\u0cc1 \u0c9c\u0cc7\u0ca8\u0cc1\u0c97\u0cb3\u0cbf\u0c82\u0ca6 \u0ca4\u0caf\u0cbe\u0cb0\u0cbe\u0c97\u0cc1\u0cb5 \u0caa\u0cc2\u0c9c\u0cbe \u0caa\u0ccd\u0cb0\u0cb8\u0cbe\u0ca6.',
    'sevas.rudra.name': '\u0cb0\u0cc1\u0ca6\u0ccd\u0cb0\u0cbe\u0cad\u0cbf\u0cb7\u0cc7\u0c95',
    'sevas.rudra.desc': '\u0cb6\u0cbf\u0cb5\u0cb2\u0cbf\u0c82\u0c97\u0c95\u0ccd\u0c95\u0cc6 \u0ca8\u0cc0\u0cb0\u0cc1, \u0cb9\u0cbe\u0cb2\u0cc1 \u0cb9\u0cbe\u0c97\u0cc2 \u0caa\u0cb5\u0cbf\u0ca4\u0ccd\u0cb0 \u0ca6\u0ccd\u0cb0\u0cb5\u0ccd\u0caf\u0c97\u0cb3\u0cbf\u0c82\u0ca6 \u0c85\u0cad\u0cbf\u0cb7\u0cc7\u0c95 \u0cae\u0cbe\u0ca1\u0cc1\u0ca4\u0ccd\u0ca4\u0cbe \u0cb6\u0ccd\u0cb0\u0cc0 \u0cb0\u0cc1\u0ca6\u0ccd\u0cb0\u0cae\u0ccd \u0caa\u0ca0\u0cbf\u0cb8\u0cb2\u0cbe\u0c97\u0cc1\u0ca4\u0ccd\u0ca4\u0ca6\u0cc6.',
    'sevas.maha.name': '\u0cae\u0cb9\u0cbe \u0caa\u0cc2\u0c9c\u0cc6',
    'sevas.maha.desc': '\u0c85\u0cb2\u0c82\u0c95\u0cbe\u0cb0, \u0ca8\u0cc8\u0cb5\u0cc7\u0ca6\u0ccd\u0caf \u0cae\u0ca4\u0ccd\u0ca4\u0cc1 \u0cae\u0c82\u0c97\u0cb3\u0cbe\u0cb0\u0ca4\u0cbf \u0c92\u0cb3\u0c97\u0cca\u0c82\u0ca1 \u0cb8\u0c82\u0caa\u0cc2\u0cb0\u0ccd\u0cb3 \u0caa\u0cc2\u0c9c\u0cc6.',
    'sevas.nitya.name': '\u0ca8\u0cbf\u0ca4\u0ccd\u0caf \u0caa\u0cc2\u0c9c\u0cc6',
    'sevas.nitya.desc': '\u0c85\u0cb2\u0c82\u0c95\u0cbe\u0cb0, \u0ca8\u0cc8\u0cb5\u0cc7\u0ca6\u0ccd\u0caf \u0cae\u0ca4\u0ccd\u0ca4\u0cc1 \u0c86\u0cb0\u0ca4\u0cbf\u0caf\u0cca\u0c82\u0ca6\u0cbf\u0c97\u0cc6 \u0ca6\u0cbf\u0ca8\u0ca8\u0cbf\u0ca4\u0ccd\u0caf\u0ca6 \u0ca6\u0cc7\u0cb5\u0cbe\u0cb2\u0caf \u0caa\u0cc2\u0c9c\u0cc6.',
    'sevas.shashwatha.name': '\u0cb6\u0cbe\u0cb6\u0ccd\u0cb5\u0ca4 \u0caa\u0cc2\u0c9c\u0cc6',
    'sevas.shashwatha.desc': '\u0c92\u0cae\u0ccd\u0cae\u0cc6\u0ca6\u0cbf\u0ca8 \u0ca6\u0cbe\u0ca8 \u0cae\u0cc1\u0c96\u0cbe\u0c82\u0ca4\u0cb0 \u0caa\u0ccd\u0cb0\u0ca4\u0cbf\u0cb5\u0cb0\u0ccd\u0cb7 \u0cad\u0c95\u0ccd\u0ca4\u0cb0 \u0cb9\u0cc6\u0cb8\u0cb0\u0cbf\u0ca8\u0cb2\u0ccd\u0cb2\u0cbf \u0caa\u0cc2\u0c9c\u0cc6 \u0ca8\u0cc6\u0cb0\u0cb5\u0cc7\u0cb0\u0cc1\u0cb5 \u0cb8\u0cc7\u0cb5\u0cc6.',
    'sevas.ranga.name': '\u0cb0\u0c82\u0c97 \u0caa\u0cc2\u0c9c\u0cc6',
    'sevas.ranga.desc': '<p>\u0cb0\u0c82\u0c97 \u0caa\u0cc2\u0c9c\u0cc6 \u0cad\u0c95\u0ccd\u0ca4\u0cb0 \u0cb5\u0cbf\u0ca8\u0c82\u0ca4\u0cbf\u0caf \u0cae\u0cc7\u0cb0\u0cc6\u0c97\u0cc6 \u0cae\u0cbe\u0ca4\u0ccd\u0cb0 \u0ca8\u0ca1\u0cc6\u0caf\u0cc1\u0cb5 \u0cb5\u0cbf\u0cb6\u0cc7\u0cb7 \u0cb8\u0cbe\u0caf\u0c82\u0c95\u0cbe\u0cb2\u0ca6 \u0cb5\u0cbf\u0ca7\u0cbf.</p>',
    'sevas.shatarudra.name': '\u0cb6\u0ca4\u0cb0\u0cc1\u0ca6\u0ccd\u0cb0\u0cbe\u0cad\u0cbf\u0cb7\u0cc7\u0c95',
    'sevas.shatarudra.desc': '<p>\u0cb6\u0ca4\u0cb0\u0cc1\u0ca6\u0ccd\u0cb0\u0cbe\u0cad\u0cbf\u0cb7\u0cc7\u0c95\u0cb5\u0cc1 \u0cae\u0cb9\u0cbe\u0cb2\u0cbf\u0c82\u0c97\u0cc7\u0cb6\u0ccd\u0cb5\u0cb0\u0ca8\u0cbf\u0c97\u0cc6 \u0cb8\u0cb2\u0ccd\u0cb2\u0cbf\u0cb8\u0cc1\u0cb5 \u0c85\u0ca4\u0ccd\u0caf\u0c82\u0ca4 \u0caa\u0cb5\u0cbf\u0ca4\u0ccd\u0cb0 \u0cae\u0ca4\u0ccd\u0ca4\u0cc1 \u0cb6\u0c95\u0ccd\u0ca4\u0cbf\u0caf\u0cc1\u0ca4 \u0cb8\u0cc7\u0cb5\u0cc6\u0c97\u0cb3\u0cb2\u0ccd\u0cb2\u0cbf \u0c92\u0c82\u0ca6\u0cbe\u0c97\u0cbf\u0ca6\u0cc6.</p>',
    'contact.line': '\u0cac\u0cc1\u0c95\u0ccd\u0c95\u0cbf\u0c82\u0c97\u0ccd \u0cae\u0ca4\u0ccd\u0ca4\u0cc1 \u0cb5\u0cbf\u0cb5\u0cb0\u0c97\u0cb3\u0cbf\u0c97\u0cc6: +91 9880544629 \u2022 padubelmantemple@gmail.com',
    'donation.title': '\u0ca6\u0cbe\u0ca8\u0c97\u0cb3\u0cc1 \u0cae\u0ca4\u0ccd\u0ca4\u0cc1 \u0ca6\u0cc7\u0cb5\u0cbe\u0cb2\u0caf \u0cac\u0cc6\u0c82\u0cac\u0cb2',
    'donation.note': '\u0cad\u0c95\u0ccd\u0ca4\u0cb0\u0cc1 \u0ca6\u0cc8\u0ca8\u0c82\u0ca6\u0cbf\u0ca8 \u0caa\u0cc2\u0c9c\u0cc6\u0c97\u0cb3\u0cc1, \u0cb5\u0cbf\u0cb6\u0cc7\u0cb7 \u0cb8\u0cc7\u0cb5\u0cc6\u0c97\u0cb3\u0cc1 \u0cae\u0ca4\u0ccd\u0ca4\u0cc1 \u0ca6\u0cc7\u0cb5\u0cbe\u0cb2\u0caf\u0cbe\u0cad\u0cbf\u0cb5\u0cc3\u0ca6\u0ccd\u0ca7\u0cbf\u0c97\u0cbe\u0c97\u0cbf \u0ca6\u0caf\u0cb5\u0cbf\u0c9f\u0ccd\u0c9f\u0cc1 \u0ca6\u0cbe\u0ca8\u0cb5\u0cbe\u0c97\u0cbf \u0cb8\u0cb9\u0c95\u0cb0\u0cbf\u0cb8\u0cac\u0cb9\u0cc1\u0ca6\u0cc1.',
    'donation.templename.label': '\u0ca6\u0cc7\u0cb5\u0cbe\u0cb2\u0caf\u0ca6 \u0cb9\u0cc6\u0cb8\u0cb0\u0cc1:',
    'donation.templename.value': '\u0cae\u0cb9\u0cbe\u0cb2\u0cbf\u0c82\u0c97\u0cc7\u0cb6\u0ccd\u0cb5\u0cb0 \u0ca6\u0cc7\u0cb5\u0cbe\u0cb2\u0caf, \u0caa\u0ca6\u0cc1\u0cac\u0cc6\u0cb2\u0ccd\u0cae\u0ca3',
    'donation.bank.label': '\u0cac\u0ccd\u0caf\u0cbe\u0c82\u0c95\u0ccd:',
    'donation.bank.value': '\u0c87\u0c82\u0ca1\u0cbf\u0caf\u0ca8\u0ccd \u0d13\u0cb5\u0cb0\u0ccd\u200c\u0cb8\u0cc0\u0cb8\u0ccd \u0cac\u0ccd\u0caf\u0cbe\u0c82\u0c95\u0ccd',
    'donation.branch.label': '\u0cb6\u0cbe\u0c96\u0cc6:',
    'donation.branch.value': '\u0cac\u0cc6\u0cb2\u0cae\u0ca3\u0ccd\u0ca3\u0cc1 (2591)',
    'donation.acno.label': '\u0c96\u0cbe\u0ca4\u0cc6 \u0cb8\u0c82\u0c96\u0ccd\u0caf\u0cc6:',
    'donation.ifsc.label': '\u0c90\u0c8e\u0cab\u0ccd\u200c\u0c8e\u0cb8\u0ccd\u200c\u0cb8\u0cbf:',
    'donation.upi.text': '\u0caf\u0cc1\u0caa\u0cbf\u0a90 \u0cae\u0cc2\u0cb2\u0c95 \u0ca6\u0cbe\u0ca8 \u0cae\u0cbe\u0ca1\u0cb2\u0cc1 \u0cb8\u0ccd\u0c95\u0ccd\u0caf\u0cbe\u0ca8\u0ccd \u0cae\u0cbe\u0ca1\u0cbf:',
    'footer.templename': '\u0cae\u0cb9\u0cbe\u0cb2\u0cbf\u0c82\u0c97\u0cc7\u0cb6\u0ccd\u0cb0 \u0ca6\u0cc7\u0cb5\u0cbe\u0cb2\u0caf, \u0caa\u0ca6\u0cc1\u0cac\u0cc6\u0cb2\u0ccd\u0cae\u0ca3',
    'footer.mantra': '\u0d13\u0c82 \u0ca8\u0cae\u0c83 \u0cb6\u0cbf\u0cb5\u0cbe\u0caf',
    'images.upi.alt': '\u0ca6\u0cc7\u0cb5\u0cbe\u0cb2\u0caf \u0caf\u0cc1\u0caa\u0cbf\u0a90 \u0c95\u0ccd\u0caf\u0cc2\u0c86\u0cb0\u0ccd \u0c95\u0ccb\u0ca1\u0ccd'
  }
};

function applyLang(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = i18n[lang] && i18n[lang][key];
    if (val !== undefined) {
      if (/<\/?(strong|em|p|br|span)/i.test(String(val))) el.innerHTML = val;
      else el.textContent = val;
    }
  });
  document.querySelectorAll('[data-i18n-alt]').forEach(el => {
    const key = el.getAttribute('data-i18n-alt');
    const val = i18n[lang] && i18n[lang][key];
    if (val !== undefined) el.setAttribute('alt', val);
  });
  if (i18n[lang] && i18n[lang].title) document.title = i18n[lang].title;
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
/* --- Premium interactions layer --- */
document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const glow = document.getElementById('cursorGlow');

  window.addEventListener('pointermove', (event) => {
    root.style.setProperty('--mx', `${event.clientX}px`);
    root.style.setProperty('--my', `${event.clientY}px`);
    if (glow) {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    }
  }, { passive: true });

  const tiltItems = document.querySelectorAll('[data-tilt]');
  tiltItems.forEach((item) => {
    item.addEventListener('pointermove', (event) => {
      const rect = item.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      item.style.transform = `perspective(900px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-4px)`;
    });

    item.addEventListener('pointerleave', () => {
      item.style.transform = '';
    });
  });

  const sections = Array.from(document.querySelectorAll('section[id]'));
  const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  if (sections.length && navLinks.length) {
    const setActiveLink = () => {
      const fromTop = window.scrollY + 120;
      let current = sections[0].id;
      sections.forEach((section) => {
        if (section.offsetTop <= fromTop) current = section.id;
      });
      navLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${current}`;
        link.classList.toggle('active', active);
      });
    };

    setActiveLink();
    window.addEventListener('scroll', setActiveLink, { passive: true });
  }
});
