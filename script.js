(() => {
  const deck = document.querySelector('#deck');
  const slides = [...document.querySelectorAll('.slide')];
  const dots = [...document.querySelectorAll('.slide-dot')];
  const current = document.querySelector('#current-slide');
  const progress = document.querySelector('#progress-bar');
  const status = document.querySelector('#sr-status');
  let activeIndex = 0;
  let scrollLocked = false;

  const goTo = (index, behavior = 'smooth') => {
    const next = Math.max(0, Math.min(slides.length - 1, index));
    slides[next].scrollIntoView({ behavior, block: 'start' });
  };

  const setActive = (index) => {
    activeIndex = index;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
    dots.forEach((dot, i) => {
      const isCurrent = i === index;
      dot.classList.toggle('is-active', isCurrent);
      if (isCurrent) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    current.textContent = String(index + 1).padStart(2, '0');
    progress.style.width = `${((index + 1) / slides.length) * 100}%`;
    status.textContent = `Slide ${index + 1} of ${slides.length}`;
  };

  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) setActive(Number(visible.target.dataset.slideIndex));
  }, { root: deck, threshold: [0.55, 0.8] });
  slides.forEach((slide) => observer.observe(slide));
  dots.forEach((dot) => dot.addEventListener('click', () => goTo(Number(dot.dataset.slide))));

  window.addEventListener('keydown', (event) => {
    if (event.defaultPrevented || ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
    if (event.key === ' ' || event.code === 'Space') {
      event.preventDefault();
      if (scrollLocked) return;
      scrollLocked = true;
      goTo(activeIndex + (event.shiftKey ? -1 : 1));
      window.setTimeout(() => { scrollLocked = false; }, 650);
    } else if (event.key === 'ArrowDown' || event.key === 'PageDown') {
      event.preventDefault();
      goTo(activeIndex + 1);
    } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
      event.preventDefault();
      goTo(activeIndex - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      goTo(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      goTo(slides.length - 1);
    }
  });
})();
