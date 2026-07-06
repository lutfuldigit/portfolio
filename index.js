document.addEventListener('DOMContentLoaded', () => {

  // ===== MOBILE MENU =====
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ===== NAVBAR SCROLL EFFECT =====
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // ===== ACTIVE NAV LINK ON SCROLL =====
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 200;
      const bottom = top + section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < bottom) {
        current = section.getAttribute('id');
      }
    });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink();

  // ===== SCROLL REVEAL =====
  const revealElements = document.querySelectorAll(
    '.service-card, .portfolio-card, .why-card, ' +
    '.about-grid, .tools-section, .hero-content'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.revealDelay || (i % 5) * 0.1;
        entry.target.style.transitionDelay = `${delay}s`;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  // ===== ABOUT READ MORE =====
  const aboutToggle = document.getElementById('aboutToggle');
  const aboutMore = document.getElementById('aboutMore');

  if (aboutToggle && aboutMore) {
    aboutToggle.addEventListener('click', () => {
      const isOpen = aboutMore.classList.toggle('open');
      aboutToggle.innerHTML = isOpen
        ? 'Show Less <i class="fa-solid fa-chevron-up"></i>'
        : 'Read More <i class="fa-solid fa-chevron-down"></i>';
    });
  }

  // ===== GRAPHICS GALLERY =====
  const gallery = document.getElementById('graphicsGallery');
  const leftArrow = document.querySelector('.gallery-arrow--left');
  const rightArrow = document.querySelector('.gallery-arrow--right');
  const galleryCards = document.querySelectorAll('.graphics-card');

  let galleryObserver;
  if (galleryCards.length) {
    galleryObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          galleryObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });
    galleryCards.forEach(card => galleryObserver.observe(card));
  }

  if (gallery && leftArrow && rightArrow) {
    const scrollAmount = 320;
    leftArrow.addEventListener('click', () => {
      gallery.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
    rightArrow.addEventListener('click', () => {
      gallery.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }

  // ===== PORTFOLIO FILTER =====
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');
  const graphicsCards = document.querySelectorAll('.graphics-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      portfolioCards.forEach(card => {
        card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
      });

      graphicsCards.forEach(card => {
        if (filter === 'all' || filter === 'graphics') {
          card.style.display = 'block';
          if (!card.classList.contains('visible') && galleryObserver) {
            galleryObserver.observe(card);
          }
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ===== COUNTER ANIMATION =====
  const statNumbers = document.querySelectorAll('.stat-number');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        if (!target || el.dataset.animated) return;
        el.dataset.animated = 'true';

        let current = 0;
        const increment = Math.ceil(target / 40);
        const duration = 1200;
        const stepTime = duration / 40;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = current + (target > 20 ? '+' : '+');
        }, stepTime);

        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  // ===== GRAPHICS LIGHTBOX =====
  (function initLightbox() {
    const cards = document.querySelectorAll('.graphics-card');
    if (!cards.length) return;

    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-backdrop"></div>
      <button class="lightbox-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
      <button class="lightbox-nav lightbox-prev" aria-label="Previous"><i class="fa-solid fa-chevron-left"></i></button>
      <button class="lightbox-nav lightbox-next" aria-label="Next"><i class="fa-solid fa-chevron-right"></i></button>
      <div class="lightbox-content">
        <img src="" alt="">
        <h3></h3>
      </div>`;
    document.body.appendChild(lightbox);

    const imgEl = lightbox.querySelector('img');
    const titleEl = lightbox.querySelector('h3');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    const backdrop = lightbox.querySelector('.lightbox-backdrop');

    let currentIndex = -1;

    function open(index) {
      if (index < 0 || index >= cards.length) return;
      currentIndex = index;
      const card = cards[index];
      const img = card.querySelector('img');
      const title = card.querySelector('h3');
      imgEl.src = img.src;
      imgEl.alt = img.alt;
      titleEl.textContent = title ? title.textContent : '';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      currentIndex = -1;
    }

    function navigate(dir) {
      const next = currentIndex + dir;
      if (next < 0 || next >= cards.length) return;
      imgEl.style.opacity = '0';
      imgEl.style.transform = dir > 0 ? 'translateX(40px)' : 'translateX(-40px)';
      setTimeout(() => {
        open(next);
        imgEl.style.opacity = '';
        imgEl.style.transform = '';
      }, 200);
    }

    cards.forEach((card, i) => {
      card.addEventListener('click', () => open(i));
    });

    closeBtn.addEventListener('click', close);
    backdrop.addEventListener('click', close);
    prevBtn.addEventListener('click', () => navigate(-1));
    nextBtn.addEventListener('click', () => navigate(1));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft' && lightbox.classList.contains('open')) navigate(-1);
      if (e.key === 'ArrowRight' && lightbox.classList.contains('open')) navigate(1);
    });
  })();

  // ===== BACK TO TOP =====
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== SMOOTH SCROLL FOR NAV =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
