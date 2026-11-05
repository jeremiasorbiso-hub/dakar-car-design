gsap.registerPlugin(ScrollTrigger);

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
if (location.hash) history.replaceState(null, '', location.pathname + location.search);
window.scrollTo(0, 0);
window.addEventListener('load', () => window.scrollTo(0, 0));

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Preloader ---------- */
const preloader = document.getElementById('preloader');
let heroTl;
let preloaderDone = false;
function runPreloader(){
  if (preloaderDone) return;
  preloaderDone = true;
  if (reduceMotion){ preloader.remove(); return; }
  const bars = preloader.querySelectorAll('.preloader__bars span');
  const tl = gsap.timeline({
    onComplete(){
      if (heroTl) heroTl.play();
      gsap.to(preloader, {
        yPercent: -100, duration: .7, ease: 'power3.inOut', delay: .15,
        onComplete(){ preloader.remove(); }
      });
    }
  });
  tl.from('.preloader__word', { autoAlpha: 0, y: 24, duration: .6, ease: 'power3.out' })
    .to(bars, { scaleX: 1, duration: .5, stagger: .12, ease: 'power2.out' }, .2);
}
window.addEventListener('load', runPreloader);
setTimeout(runPreloader, 1800);

/* ---------- Custom cursor ---------- */
if (canHover && !reduceMotion){
  const cursor = document.getElementById('cursor');
  const moveX = gsap.quickTo(cursor, 'x', { duration: .25, ease: 'power3' });
  const moveY = gsap.quickTo(cursor, 'y', { duration: .25, ease: 'power3' });
  window.addEventListener('pointermove', (e) => { moveX(e.clientX); moveY(e.clientY); });
  document.querySelectorAll('[data-cursor-hover]').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
  });
} else {
  document.getElementById('cursor').remove();
}

/* ---------- Scroll progress bar ---------- */
gsap.to('#progress', {
  scaleX: 1,
  ease: 'none',
  scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true }
});

/* ---------- Nav scroll state ---------- */
const nav = document.getElementById('nav');
ScrollTrigger.create({
  start: 'top -60',
  onUpdate(self){ nav.classList.toggle('is-scrolled', self.scroll() > 60); }
});

/* ---------- Mobile menu ---------- */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => {
  const open = burger.getAttribute('aria-expanded') === 'true';
  burger.setAttribute('aria-expanded', String(!open));
  mobileMenu.classList.toggle('is-open', !open);
  document.body.style.overflow = open ? '' : 'hidden';
});
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  burger.setAttribute('aria-expanded', 'false');
  mobileMenu.classList.remove('is-open');
  document.body.style.overflow = '';
}));

/* ---------- Hero scroll button ---------- */
document.getElementById('heroScroll').addEventListener('click', () => {
  document.getElementById('servicios').scrollIntoView({ behavior: 'smooth' });
});

/* ---------- Hero entrance + parallax ---------- */
const heroEls = '.hero__eyebrow, .hero__title, .hero__lead, .hero__ctas, .hero__tags';

if (reduceMotion){
  gsap.set(heroEls, { autoAlpha: 1, y: 0 });
  gsap.set('.hero__bar', { scaleX: 1 });
} else {
  gsap.set(heroEls, { autoAlpha: 0, y: 24 });
  heroTl = gsap.timeline({ paused: true });
  heroTl.to('.hero__eyebrow', { autoAlpha: 1, y: 0, duration: .6, ease: 'power3.out' })
    .to('.hero__title', { autoAlpha: 1, y: 0, duration: .7, ease: 'power3.out' }, .08)
    .to('.hero__bar', { scaleX: 1, duration: .6, stagger: .08, ease: 'power3.out' }, .3)
    .to('.hero__lead', { autoAlpha: 1, y: 0, duration: .6, ease: 'power3.out' }, .35)
    .to('.hero__ctas', { autoAlpha: 1, y: 0, duration: .6, ease: 'power3.out' }, .45)
    .to('.hero__tags', { autoAlpha: 1, y: 0, duration: .6, ease: 'power3.out' }, .55);
}

if (canHover && !reduceMotion){
  const beamX = gsap.quickTo('.hero__beam--1', 'x', { duration: .6, ease: 'power3' });
  const beamX2 = gsap.quickTo('.hero__beam--2', 'x', { duration: .7, ease: 'power3' });
  const titleX = gsap.quickTo('.hero__dakar', 'x', { duration: .8, ease: 'power3' });
  document.querySelector('.hero').addEventListener('mousemove', (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - .5;
    beamX(px * -40); beamX2(px * -60); titleX(px * 14);
  });
}

/* ---------- Scroll reveals ---------- */
gsap.set('[data-reveal]', { autoAlpha: 0 });
ScrollTrigger.batch('[data-reveal]', {
  start: 'top 85%',
  once: true,
  onEnter: batch => gsap.to(batch, {
    autoAlpha: 1, y: 0, duration: .8, ease: 'power3.out', stagger: .1, overwrite: true
  })
});

/* ---------- Card tilt ---------- */
if (canHover && !reduceMotion){
  document.querySelectorAll('[data-tilt]').forEach(card => {
    const rotX = gsap.quickTo(card, 'rotationX', { duration: .4, ease: 'power3' });
    const rotY = gsap.quickTo(card, 'rotationY', { duration: .4, ease: 'power3' });
    const lift = gsap.quickTo(card, 'y', { duration: .4, ease: 'power3' });
    gsap.set(card, { transformPerspective: 700, transformStyle: 'preserve-3d' });
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - .5;
      const py = (e.clientY - r.top) / r.height - .5;
      rotY(px * 10); rotX(py * -10); lift(-4);
    });
    card.addEventListener('mouseleave', () => { rotX(0); rotY(0); lift(0); });
  });
}

/* ---------- Before / after sliders ---------- */
document.querySelectorAll('[data-compare]').forEach(el => {
  const frame = el.querySelector('.compare__frame');
  const beforeImg = el.querySelector('.compare__img--before');
  const divider = el.querySelector('.compare__divider');
  const handle = el.querySelector('.compare__handle');
  let dragging = false;

  function setPos(pct){
    pct = Math.min(100, Math.max(0, pct));
    beforeImg.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    divider.style.left = pct + '%';
    handle.style.left = pct + '%';
    handle.setAttribute('aria-valuenow', Math.round(pct));
  }

  function fromClientX(clientX){
    const r = frame.getBoundingClientRect();
    setPos(((clientX - r.left) / r.width) * 100);
  }

  frame.addEventListener('pointerdown', (e) => {
    dragging = true;
    frame.setPointerCapture(e.pointerId);
    fromClientX(e.clientX);
  });
  frame.addEventListener('pointermove', (e) => { if (dragging) fromClientX(e.clientX); });
  frame.addEventListener('pointerup', () => { dragging = false; });
  frame.addEventListener('pointercancel', () => { dragging = false; });

  handle.addEventListener('keydown', (e) => {
    const current = parseFloat(handle.getAttribute('aria-valuenow'));
    if (e.key === 'ArrowLeft'){ setPos(current - 5); e.preventDefault(); }
    if (e.key === 'ArrowRight'){ setPos(current + 5); e.preventDefault(); }
  });

  if (!reduceMotion){
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter(){
        const proxy = { v: 50 };
        gsap.fromTo(proxy, { v: 18 }, {
          v: 62, duration: 1.3, delay: .2, ease: 'power2.inOut',
          onUpdate(){ setPos(proxy.v); }
        });
      }
    });
  }
});

/* ---------- Stat counters ---------- */
document.querySelectorAll('.stat__num').forEach(num => {
  const target = parseInt(num.dataset.count, 10);
  ScrollTrigger.create({
    trigger: num,
    start: 'top 90%',
    once: true,
    onEnter(){
      gsap.to(num, {
        textContent: target,
        duration: 1.6,
        ease: 'power2.out',
        snap: { textContent: 1 },
        onUpdate(){ num.textContent = Math.round(gsap.getProperty(num, 'textContent')); }
      });
    }
  });
});
