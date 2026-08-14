/**
 * Douglas Advocacia — Main JavaScript
 * Interações, animações e funcionalidades
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollReveal();
  initHeaderScroll();
  initHoursWidget();
  initContactForm();
  initCounterAnimation();
  initSmoothScroll();
  initReviewsSlider();
});

/* ── Navigation ── */
function initNavigation() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  const links = menu.querySelectorAll('.nav__link, .nav__cta');

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    menu.classList.toggle('active');
    document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      menu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* ── Header scroll effect ── */
function initHeaderScroll() {
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }, { passive: true });
}

/* ── Scroll reveal animations ── */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  reveals.forEach(el => observer.observe(el));

  // Hero elements animate immediately
  const heroReveals = document.querySelectorAll('.hero .reveal');
  setTimeout(() => {
    heroReveals.forEach(el => el.classList.add('visible'));
  }, 300);
}

/* ── Interactive hours widget ── */
function initHoursWidget() {
  const today = new Date().getDay();
  const listItems = document.querySelectorAll('.hours-widget__list li');
  const todayLabel = document.getElementById('hoursToday');

  const dayNames = [
    'Domingo', 'Segunda-feira', 'Terça-feira',
    'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'
  ];

  listItems.forEach(item => {
    const day = parseInt(item.dataset.day, 10);
    if (day === today) {
      item.classList.add('today');
    }
  });

  if (todayLabel) {
    const now = new Date();
    const hours = now.getHours();
    const isWeekday = today >= 1 && today <= 5;
    const isSaturday = today === 6;
    const isOpen =
      (isWeekday && hours >= 8 && hours < 20) ||
      (isSaturday && hours >= 8 && hours < 13);

    todayLabel.textContent = isOpen
      ? `Hoje, ${dayNames[today]} — Estamos atendendo agora`
      : `Hoje, ${dayNames[today]} — Fora do horário de atendimento`;
  }
}

/* ── Contact form → WhatsApp ── */
function initContactForm() {
  const form = document.getElementById('heroForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('formName').value.trim();
    const email = document.getElementById('formEmail').value.trim();
    const phone = document.getElementById('formPhone').value.trim();
    const message = document.getElementById('formMessage').value.trim();

    const text = [
      `Olá, meu nome é ${name}.`,
      `E-mail: ${email}`,
      `Telefone: ${phone}`,
      '',
      `Mensagem: ${message}`
    ].join('\n');

    const encoded = encodeURIComponent(text);
    const whatsappURL = `https://wa.me/5532999999999?text=${encoded}`;

    window.open(whatsappURL, '_blank');
    form.reset();

    const btn = form.querySelector('.btn--submit');
    const originalText = btn.textContent;
    btn.textContent = 'Mensagem enviada ✓';
    btn.style.background = '#3F4C4A';

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
    }, 3000);
  });
}

/* ── Counter animation for stats ── */
function initCounterAnimation() {
  const counters = document.querySelectorAll('[data-count]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);

    el.textContent = current + '+';

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target + '+';
    }
  }

  requestAnimationFrame(update);
}

/* ── Smooth scroll for anchor links ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerHeight = document.getElementById('header').offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}

/* ── Google Reviews Carousel Slider ── */
function initReviewsSlider() {
  const track = document.getElementById('reviewsTrack');
  const wrapper = document.getElementById('reviewsWrapper');
  const prevBtn = document.getElementById('reviewsPrev');
  const nextBtn = document.getElementById('reviewsNext');
  const dotsContainer = document.getElementById('reviewsDots');

  if (!track || !wrapper) return;

  const cards = Array.from(track.children);
  const totalCards = cards.length;
  let currentIndex = 0;
  let autoplayTimer = null;
  const AUTOPLAY_INTERVAL = 4000; // Intervalo de 4 segundos para rolar

  // Retorna quantidade de cards visíveis conforme a largura de tela
  function getVisibleCardsCount() {
    const width = window.innerWidth;
    if (width <= 600) return 1;
    if (width <= 1024) return 2;
    return 3;
  }

  function getMaxIndex() {
    const visible = getVisibleCardsCount();
    return Math.max(0, totalCards - visible);
  }

  // Criar os pontos de navegação manual (dots)
  function createDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const maxIndex = getMaxIndex();

    for (let i = 0; i <= maxIndex; i++) {
      const dot = document.createElement('button');
      dot.className = `reviews__dot ${i === currentIndex ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Ir para avaliação ${i + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(i);
        resetAutoplay();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateSlider() {
    const maxIndex = getMaxIndex();
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    if (currentIndex < 0) currentIndex = 0;

    if (cards.length === 0) return;

    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = parseFloat(window.getComputedStyle(track).gap) || 24;

    const moveDistance = currentIndex * (cardWidth + gap);
    track.style.transform = `translateX(-${moveDistance}px)`;

    // Atualizar classe ativa dos dots
    if (dotsContainer) {
      const dots = Array.from(dotsContainer.children);
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    }

    // Estado dos botões de seta
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex >= maxIndex;
  }

  function goToSlide(index) {
    const maxIndex = getMaxIndex();
    if (index > maxIndex) {
      currentIndex = 0;
    } else if (index < 0) {
      currentIndex = maxIndex;
    } else {
      currentIndex = index;
    }
    updateSlider();
  }

  function nextSlide() {
    const maxIndex = getMaxIndex();
    if (currentIndex >= maxIndex) {
      currentIndex = 0; // Volta para o início em loop suave
    } else {
      currentIndex++;
    }
    updateSlider();
  }

  function prevSlide() {
    const maxIndex = getMaxIndex();
    if (currentIndex <= 0) {
      currentIndex = maxIndex;
    } else {
      currentIndex--;
    }
    updateSlider();
  }

  // Autoplay
  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, AUTOPLAY_INTERVAL);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  // Eventos das setas manuais
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoplay();
    });
  }

  // Pausar ao passar o mouse por cima do slider
  wrapper.addEventListener('mouseenter', stopAutoplay);
  wrapper.addEventListener('mouseleave', startAutoplay);

  // Suporte a gestos touch (swipe no celular/tablet)
  let startX = 0;
  let isDragging = false;

  track.addEventListener('touchstart', (e) => {
    stopAutoplay();
    startX = e.touches[0].clientX;
    isDragging = true;
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diffX = startX - currentX;
    if (Math.abs(diffX) > 40) {
      isDragging = false;
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      resetAutoplay();
    }
  }, { passive: true });

  track.addEventListener('touchend', () => {
    isDragging = false;
    startAutoplay();
  });

  // Redimensionamento de tela
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      createDots();
      updateSlider();
    }, 100);
  });

  // Inicializar slider
  createDots();
  updateSlider();
  startAutoplay();
}

