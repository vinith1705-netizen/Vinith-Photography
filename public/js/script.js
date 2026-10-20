/**
 * MAGIZINI PHOTOGRAPHY - Vanilla JavaScript
 * Interactive behavior:
 * - Sticky header & scrollspy
 * - Mobile navigation menu
 * - Category filter for gallery
 * - Fullscreen responsive gallery lightbox
 * - Contact form validation & WhatsApp enquiry generator
 * - Scroll reveal animations
 * - Back to top button
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initScrollspy();
  initGalleryLightbox();
  initGalleryFilters();
  initContactForm();
  initScrollReveal();
  initBackToTop();
  initHeroGearInteractivity();
});

/* ==========================================================================
   1. STICKY HEADER
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   2. MOBILE NAVIGATION
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const links = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer) return;

  const toggleDrawer = () => {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  };

  const openDrawer = () => {
    drawer.classList.add('open');
    toggleBtn.classList.add('active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    toggleBtn.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', toggleDrawer);

  links.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // Reset on desktop resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 860 && drawer.classList.contains('open')) {
      closeDrawer();
    }
  }, { passive: true });
}

/* ==========================================================================
   3. SCROLLSPY
   ========================================================================== */
function initScrollspy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  const onScroll = () => {
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ==========================================================================
   4. GALLERY LIGHTBOX
   ========================================================================== */
function initGalleryLightbox() {
  const galleryCards = Array.from(document.querySelectorAll('.gallery-card'));
  const lightbox = document.getElementById('gallery-lightbox');
  if (!galleryCards.length || !lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxTitle = lightbox.querySelector('.lightbox-title');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const lightboxCounter = lightbox.querySelector('.lightbox-counter');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  let currentIndex = 0;
  let activeCards = [...galleryCards];

  const updateActiveCards = () => {
    activeCards = galleryCards.filter(card => card.style.display !== 'none');
  };

  const showImage = (index) => {
    updateActiveCards();
    if (!activeCards.length) return;

    if (index < 0) {
      currentIndex = activeCards.length - 1;
    } else if (index >= activeCards.length) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    const card = activeCards[currentIndex];
    const imgEl = card.querySelector('.gallery-img');
    const titleEl = card.querySelector('.gallery-item-title');
    const categoryEl = card.querySelector('.gallery-category-tag');

    const highResSrc = card.getAttribute('data-full-img') || imgEl.getAttribute('src');
    const titleText = titleEl ? titleEl.textContent : 'Wedding Memory';
    const catText = categoryEl ? categoryEl.textContent : 'Magizini Photography';

    lightboxImg.setAttribute('src', highResSrc);
    lightboxImg.setAttribute('alt', titleText);
    if (lightboxTitle) lightboxTitle.textContent = titleText;
    if (lightboxCaption) lightboxCaption.textContent = catText;
    if (lightboxCounter) lightboxCounter.textContent = `${currentIndex + 1} / ${activeCards.length}`;
  };

  const openLightbox = (cardIndex) => {
    updateActiveCards();
    const card = galleryCards[cardIndex];
    const newIdx = activeCards.indexOf(card);
    currentIndex = newIdx !== -1 ? newIdx : 0;

    showImage(currentIndex);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  galleryCards.forEach((card, idx) => {
    card.addEventListener('click', () => openLightbox(idx));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(idx);
      }
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showImage(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showImage(currentIndex + 1);
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });
  }

  // Click outside to close
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-container')) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      showImage(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      showImage(currentIndex + 1);
    }
  });

  // Touch swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        showImage(currentIndex - 1); // Swiped right -> prev
      } else {
        showImage(currentIndex + 1); // Swiped left -> next
      }
    }
  }, { passive: true });
}

/* ==========================================================================
   5. GALLERY FILTERS
   ========================================================================== */
function initGalleryFilters() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const cards = document.querySelectorAll('.gallery-card');

  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   6. CONTACT FORM & WHATSAPP INTEGRATION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('wedding-enquiry-form');
  const noticeBox = document.getElementById('form-notice-box');
  const whatsappRedirectBtn = document.getElementById('form-whatsapp-btn');

  if (!form) return;

  const nameInput = document.getElementById('client-name');
  const phoneInput = document.getElementById('client-phone');
  const dateInput = document.getElementById('wedding-date');
  const locationInput = document.getElementById('event-location');
  const messageInput = document.getElementById('client-message');

  // Input clear error listeners
  [nameInput, phoneInput, dateInput, locationInput].forEach(input => {
    if (!input) return;
    input.addEventListener('input', () => {
      input.classList.remove('input-error');
      const errEl = document.getElementById(`${input.id}-error`);
      if (errEl) errEl.textContent = '';
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      setError(nameInput, 'Please enter your full name');
      isValid = false;
    }

    // Validate Phone (At least 10 digits)
    const phoneVal = phoneInput.value.replace(/[^0-9]/g, '');
    if (!phoneVal || phoneVal.length < 10) {
      setError(phoneInput, 'Please enter a valid 10-digit phone number');
      isValid = false;
    }

    // Validate Wedding Date
    if (!dateInput.value) {
      setError(dateInput, 'Please select your wedding date');
      isValid = false;
    }

    // Validate Location
    if (!locationInput.value.trim() || locationInput.value.trim().length < 2) {
      setError(locationInput, 'Please provide the event location/venue');
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    // Build structured message for WhatsApp
    const enquiryDetails = [
      `*New Wedding Photography Enquiry - Magizini Photography*`,
      `• *Name:* ${nameInput.value.trim()}`,
      `• *Phone:* ${phoneInput.value.trim()}`,
      `• *Wedding Date:* ${dateInput.value}`,
      `• *Location:* ${locationInput.value.trim()}`,
      `• *Notes/Message:* ${messageInput.value.trim() || 'No additional message'}`
    ].join('%0A');

    const whatsappUrl = `https://wa.me/918095410495?text=${enquiryDetails}`;

    // Display honest status explaining backend configuration
    if (noticeBox) {
      noticeBox.className = 'form-notice-box warning visible';
      noticeBox.innerHTML = `
        <strong>Direct Enquiry Ready:</strong> No server backend is connected to automatically store submissions in a database.
        To send your enquiry to Magizini Photography right now without losing any entered details, click below to open WhatsApp with your details prefilled:
        <div class="form-notice-actions">
          <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm">
            Send via WhatsApp Now (+91 80954 10495)
          </a>
        </div>
      `;
    }

    if (whatsappRedirectBtn) {
      whatsappRedirectBtn.setAttribute('href', whatsappUrl);
    }
  });

  function setError(input, message) {
    input.classList.add('input-error');
    const errEl = document.getElementById(`${input.id}-error`);
    if (errEl) errEl.textContent = message;
    input.focus();
  }
}

/* ==========================================================================
   7. SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  // Immediately reveal elements already inside or near viewport
  const revealVisibleElements = () => {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= vh + 40 && rect.bottom >= -20) {
        el.classList.add('revealed');
      }
    });
  };

  // Run initial check immediately
  revealVisibleElements();

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px 60px 0px'
    });

    revealElements.forEach(el => {
      if (!el.classList.contains('revealed')) {
        observer.observe(el);
      }
    });
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // Guaranteed safety reveal timeout: all text is revealed unconditionally
  setTimeout(() => {
    revealElements.forEach(el => el.classList.add('revealed'));
  }, 1200);
}

/* ==========================================================================
   8. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   9. HERO GEAR INTERACTIVITY (PARALLAX, SHUTTER FLASH & HOVER EFFECTS)
   ========================================================================== */
function initHeroGearInteractivity() {
  const heroSection = document.querySelector('.hero-section');
  const droneEl = document.getElementById('gear-drone');
  const videocamEl = document.getElementById('gear-videocam');
  const cameraEl = document.getElementById('gear-camera');
  const flashBeam = document.getElementById('camera-flash-beam');

  if (!heroSection) return;

  // 1. Drone dynamic flight maneuver on click
  if (droneEl) {
    droneEl.addEventListener('click', () => {
      droneEl.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.9, 0.3, 1.2)';
      droneEl.style.transform = 'translate3d(-20px, -24px, 0) rotate(-6deg) scale(1.14)';
      setTimeout(() => {
        droneEl.style.transform = 'translate3d(12px, 8px, 0) rotate(3deg) scale(0.98)';
      }, 350);
      setTimeout(() => {
        droneEl.style.transform = '';
        droneEl.style.transition = '';
      }, 700);
    });
  }

  // 2. Shutter Flash on clicking photo camera
  if (cameraEl && flashBeam) {
    cameraEl.addEventListener('click', () => {
      flashBeam.classList.add('flash-active');
      cameraEl.style.transform = 'scale(0.95)';
      setTimeout(() => {
        cameraEl.style.transform = '';
      }, 150);
      setTimeout(() => {
        flashBeam.classList.remove('flash-active');
      }, 180);
    });
  }

  // 3. Cinema camera pulse on click
  if (videocamEl) {
    videocamEl.addEventListener('click', () => {
      videocamEl.style.transform = 'translateY(-50%) scale(1.2) rotate(-5deg)';
      setTimeout(() => {
        videocamEl.style.transform = '';
      }, 350);
    });
  }

  // 4. Subtle mouse parallax on hero equipment for desktop
  let ticking = false;
  heroSection.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 992) return;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const rect = heroSection.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;

        if (droneEl && !droneEl.matches(':hover')) {
          droneEl.style.transform = `translate3d(${relX * 24}px, ${relY * 18}px, 0) rotate(${relX * 4}deg)`;
        }
        if (videocamEl && !videocamEl.matches(':hover')) {
          videocamEl.style.transform = `translateY(-50%) translate3d(${relX * 14}px, ${relY * 12}px, 0)`;
        }
        if (cameraEl && !cameraEl.matches(':hover')) {
          cameraEl.style.transform = `translate3d(${-relX * 12}px, ${-relY * 10}px, 0)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Reset transform on mouseleave
  heroSection.addEventListener('mouseleave', () => {
    if (droneEl) droneEl.style.transform = '';
    if (videocamEl) videocamEl.style.transform = '';
    if (cameraEl) cameraEl.style.transform = '';
  }, { passive: true });
}

