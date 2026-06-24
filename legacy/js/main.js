document.addEventListener('DOMContentLoaded', () => {
  initCarousels();
  initHeroSlider();
  initMobileMenu();
});

function initCarousels() {
  document.querySelectorAll('[aria-label="Post carousel"]').forEach((carousel) => {
    const track = carousel.querySelector('.flex.snap-x');
    if (!track) return;

    const prevBtn = carousel.querySelector('[aria-label="Previous slide"]');
    const nextBtn = carousel.querySelector('[aria-label="Next slide"]');
    const slides = track.querySelectorAll('.shrink-0');
    if (!slides.length) return;

    const getScrollAmount = () => {
      const slide = slides[0];
      const gap = parseFloat(getComputedStyle(track).gap) || 16;
      return slide.offsetWidth + gap;
    };

    const updateButtons = () => {
      if (!prevBtn || !nextBtn) return;
      const maxScroll = track.scrollWidth - track.clientWidth;
      prevBtn.disabled = track.scrollLeft <= 0;
      nextBtn.disabled = track.scrollLeft >= maxScroll - 1;
    };

    prevBtn?.addEventListener('click', () => {
      track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });

    nextBtn?.addEventListener('click', () => {
      track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });

    track.addEventListener('scroll', updateButtons, { passive: true });
    updateButtons();
  });
}

function initHeroSlider() {
  const heroBg = document.getElementById('home-slider-bg');
  if (!heroBg) return;

  const bgImg = heroBg.querySelector('img');
  const selectorItems = heroBg.querySelectorAll('.selector li');
  const mobileDots = heroBg.querySelectorAll('.lg\\:hidden ul.flex.gap-4 li');

  const slides = [
    {
      image: 'https://danangfantasticity.com/wp-content/uploads/2026/05/cham-khoanh-khac.jpg',
      alt: 'Những lưu ý quan trọng khi tham dự Lễ hội pháo hoa quốc tế Đà Nẵng 2026 - DIFF 2026',
    },
    {
      image: 'https://danangfantasticity.com/wp-content/uploads/2026/03/gia-ve-le-hoi-phao-hoa-da-nang-2026-diff-01.jpg',
      alt: 'Lễ hội pháo hoa Quốc tế Đà Nẵng 2026',
    },
  ];

  let current = 0;

  const goTo = (index) => {
    current = index % slides.length;
    if (bgImg) {
      bgImg.style.opacity = '0';
      setTimeout(() => {
        bgImg.src = slides[current].image;
        bgImg.alt = slides[current].alt;
        bgImg.style.opacity = '1';
      }, 300);
    }

    selectorItems.forEach((item, i) => {
      const bar = item.querySelector('.selected-bar');
      if (bar) bar.style.display = i === current ? 'block' : 'none';
    });

    mobileDots.forEach((dot, i) => {
      dot.classList.toggle('opacity-50', i !== current);
      dot.classList.toggle('bg-white', true);
    });
  };

  selectorItems.forEach((item, i) => {
    item.addEventListener('click', () => goTo(i));
  });

  mobileDots.forEach((dot, i) => {
    dot.addEventListener('click', () => goTo(i));
  });

  setInterval(() => goTo(current + 1), 6000);
}

function initMobileMenu() {
  const menuBtn = document.querySelector('[aria-label="Open menu"], .mobile-menu-btn');
  const mobileNav = document.querySelector('.mobile-nav, .lg\\:hidden.fixed');

  menuBtn?.addEventListener('click', () => {
    mobileNav?.classList.toggle('hidden');
  });
}
