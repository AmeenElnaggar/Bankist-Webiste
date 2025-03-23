'use strict';
// Select Elements
const modal = document.querySelector('.modal')
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const links = document.querySelectorAll('.nav__link');
const linksContainer = document.querySelector('.nav__links');
const operationsContainer = document.querySelector(
  '.operations__tab-container'
);
const operationsButtons = document.querySelectorAll('.operations__tab');
const operationsContents = document.querySelectorAll('.operations__content');
const navLinks = document.querySelector('.nav__links');
const navBar = document.querySelector('.nav');
const sections = document.querySelectorAll('.section');
const header = document.querySelector('.header');
const images = document.querySelectorAll('img[data-src]');
const btnRight = document.querySelector('.slider__btn--right');
const btnLeft = document.querySelector('.slider__btn--left');
const slider = document.querySelector('.slider');
const slideImages = document.querySelectorAll('.slide');
const dotsContainer = document.querySelector('.dots');
// Functions
//----------

// openModal
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// CloseModal
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', function (e) {
  const s1Coords = section1.getBoundingClientRect();
  // window.scrollTo(s1Coords.left, s1Coords.top + window.scrollY);
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Scroll Nav
linksContainer.addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(`${id}`).scrollIntoView({ behavior: 'smooth' });
  }
});

// Operation Taps
operationsContainer.addEventListener('click', function (e) {
  const currTap = e.target.closest('.operations__tab');
  if (!currTap) return;
  operationsButtons.forEach(function (btn) {
    btn.classList.remove('operations__tab--active');
  });
  currTap.classList.add('operations__tab--active');
  operationsContents.forEach(function (cont) {
    cont.classList.remove('operations__content--active');
  });
  document
    .querySelector(`.operations__content--${currTap.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Links
const hoverFunc = function (e) {
  const link = e.target.closest('.nav__link');
  if (!link) return;
  const siblings = link.closest('.nav__links').querySelectorAll('.nav__link');
  siblings.forEach(ele => {
    if (ele !== link) ele.style.opacity = this;
  });
};
navLinks.addEventListener('mouseover', hoverFunc.bind(0.5));
navLinks.addEventListener('mouseout', hoverFunc.bind(1));

// Navbar Observe
const navHeight = navBar.getBoundingClientRect().height;
const obsFunc = function (entries) {
  entries.forEach(function (ele) {
    if (!ele.isIntersecting) {
      navBar.classList.add('sticky');
    } else {
      navBar.classList.remove('sticky');
    }
  });
};
const optionsNav = {
  root: null,
  // threshold: 0,
  rootMargin: `-${navHeight}px`,
};
const observeNav = new IntersectionObserver(obsFunc, optionsNav);

observeNav.observe(header);

// Section Observe
const observeSecFunc = function (entries) {
  entries.forEach(function (ele) {
    if (!ele.isIntersecting) return;
    ele.target.classList.remove('section--hidden');
    observeSec.unobserve(ele.target);
  });
};
const optionsSec = {
  root: null,
  threshold: 0.15,
};
const observeSec = new IntersectionObserver(observeSecFunc, optionsSec);
sections.forEach(function (sec) {
  observeSec.observe(sec);
  sec.classList.add('section--hidden');
});

// Images Observe
const observeImgFunc = function (entries) {
  entries.forEach(function (ele) {
    if (!ele.isIntersecting) return;
    ele.target.src = ele.target.dataset.src;
    ele.target.addEventListener('load', function () {
      ele.target.classList.remove('lazy-img');
      observeImg.unobserve(ele.target);
    });
  });
};
const optionsImg = {
  root: null,
  threshold: 0.2,
  rootMargin: '200px',
};
const observeImg = new IntersectionObserver(observeImgFunc, optionsImg);
images.forEach(function (img) {
  observeImg.observe(img);
});

// Slider
let curSlide = 0;
const slidesLength = slideImages.length;
const goToSlide = function (slide) {
  slideImages.forEach(function (img, i) {
    img.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
};

const nextSlide = function () {
  if (curSlide === slidesLength - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlide(curSlide);
  dotsActivate(curSlide);
};
const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = slidesLength - 1;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
  dotsActivate(curSlide);
};

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', e => {
  e.key === 'ArrowLeft' && prevSlide();
  e.key === 'ArrowRight' && nextSlide();
});

const createDots = function () {
  slideImages.forEach(function (_, i) {
    const html = `
    <button class="dots__dot" data-slide="${i}"></button>
    `;
    dotsContainer.insertAdjacentHTML('beforeend', html);
  });
};

dotsContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    goToSlide(slide);
    dotsActivate(slide);
  }
});

const dotsActivate = function (slide) {
  document.querySelectorAll('.dots__dot').forEach(function (dot) {
    dot.classList.remove('dots__dot--active');
  });
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

const init = function () {
  goToSlide(0);
  createDots();
  dotsActivate(0);
};
init();
