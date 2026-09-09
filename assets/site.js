(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const mobile = window.matchMedia('(max-width: 800px)');
  toggle.hidden = false;
  function closeMenu(returnFocus = false) {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.querySelector('.menu-label').textContent = 'MENU';
    if (returnFocus) toggle.focus();
  }
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.menu-label').textContent = open ? 'CLOSE' : 'MENU';
  });
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  document.addEventListener('click', (event) => {
    if (!header.contains(event.target)) closeMenu();
  });
  header.addEventListener('focusout', (event) => {
    if (event.relatedTarget && !header.contains(event.relatedTarget)) closeMenu();
  });
  mobile.addEventListener('change', () => closeMenu());
  const navLinks = [...nav.querySelectorAll('a')];
  const sections = navLinks.map(link => document.querySelector(link.getAttribute('href')));
  let scrollPending = false;
  function updateScrollState() {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
    let active = null;
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= 180) active = section.id;
    }
    for (const link of navLinks) {
      if (link.hash === `#${active}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    scrollPending = false;
  }
  window.addEventListener('scroll', () => {
    if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateScrollState); }
  }, { passive: true });
  updateScrollState();

  const portraits = [
    { src: 'assets/img/gym_rapala.jpg', alt: '朝のトレーニングルームに立つ鈴木章裕', caption: '日々を鍛える。', label: 'MORNING TRAINING' },
    { src: 'assets/img/stage_award.jpg', alt: 'スーツ姿でマイクを手に登壇する鈴木章裕', caption: '人と出会う。', label: 'MEETING PEOPLE' },
    { src: 'assets/img/gym_ai_engineer.jpg', alt: 'AI ENGINEERのTシャツを着た鈴木章裕', caption: 'AIを実践する。', label: 'LEARNING BY DOING' }
  ];
  const portraitImage = document.querySelector('#hero-portrait');
  const portraitCaption = document.querySelector('#portrait-caption');
  const portraitButtons = [...document.querySelectorAll('[data-portrait]')];
  document.querySelector('.portrait-controls').hidden = false;
  portraitButtons.forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.portrait);
    const portrait = portraits[index];
    portraitImage.src = portrait.src;
    portraitImage.alt = portrait.alt;
    portraitImage.dataset.scene = String(index);
    portraitCaption.replaceChildren(document.createTextNode(portrait.caption));
    const label = document.createElement('span');
    label.textContent = portrait.label;
    portraitCaption.append(label);
    for (const item of portraitButtons) {
      const selected = item === button;
      item.classList.toggle('is-selected', selected);
      item.setAttribute('aria-pressed', String(selected));
    }
  }));

  const dialog = document.querySelector('.lightbox');
  const gallery = [...document.querySelectorAll('[data-gallery]')];
  const fullImage = document.querySelector('#lightbox-image');
  const caption = document.querySelector('#lightbox-caption');
  const count = document.querySelector('#photo-count');
  let photoIndex = 0;
  let opener = null;
  function showPhoto(index) {
    photoIndex = (index + gallery.length) % gallery.length;
    const link = gallery[photoIndex];
    fullImage.src = link.href;
    fullImage.alt = link.querySelector('img').alt;
    caption.textContent = link.dataset.caption;
    count.textContent = `${photoIndex + 1} / ${gallery.length}`;
  }
  if (typeof dialog.showModal === 'function') {
    gallery.forEach((link, index) => link.addEventListener('click', (event) => {
      // Preserve open-in-new-tab and download gestures on the original photo link.
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      showPhoto(index);
      dialog.showModal();
      document.body.classList.add('has-lightbox');
    }));
    dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
    document.querySelector('#photo-prev').addEventListener('click', () => showPhoto(photoIndex - 1));
    document.querySelector('#photo-next').addEventListener('click', () => showPhoto(photoIndex + 1));
    dialog.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(photoIndex - 1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(photoIndex + 1); }
    });
    dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => {
      document.body.classList.remove('has-lightbox');
      if (opener) opener.focus({ preventScroll: true });
    });
  }
})();
