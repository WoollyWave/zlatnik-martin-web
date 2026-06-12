import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Sdílené konstanty — jeden zdroj pravdy pro rytmus animací.
const EASE = 'power3.out';
const DUR = 1.3;
const SCROLL_START = 'top 88%'; // trigger těsně před vstupem do viewportu
const DESKTOP_MQ = '(min-width: 1024px)';

/** Vrátí selektor jen pokud na stránce existuje — GSAP jinak loguje "target not found". */
function ifExists(selector: string): string | null {
  return document.querySelector(selector) ? selector : null;
}

function delayOf(el: HTMLElement): number {
  return parseFloat(el.dataset.delay || '0');
}

// 1. Navigation float-in
function animateNav() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;
  gsap.from(nav, { y: -24, opacity: 0, duration: 1.5, ease: EASE, delay: 0.1 });
}

// 2. Hero orchestrated timeline — přesně v DOM pořadí: label → H1 → copy → buttons → status → meta.
function animateHero() {
  // [selektor, pozice v timeline, vlastní tween props]
  const steps: Array<[string, number, gsap.TweenVars]> = [
    ['.hero-label > .label-dot', 0, { opacity: 0, y: 12 }],
    ['.hero-headline span.block', 0.12, { opacity: 0, y: 20, stagger: 0.1 }],
    ['.hero-copy', 0.3, { opacity: 0, y: 16 }],
    ['.hero-btn-group > *', 0.45, { opacity: 0, y: 12, stagger: 0.07 }],
    ['.hero-status', 0.7, { opacity: 0, y: 10 }],
    ['.hero-meta > div', 0.85, { opacity: 0, y: 12, stagger: 0.07 }],
    ['.hero-img-wrap', 0.2, { scale: 1.05, opacity: 0, duration: 1.4, ease: 'power2.out' }],
    ['.hero-plaque', 1.1, { opacity: 0, y: 16 }],
    ['.hero-vol', 1.2, { opacity: 0 }],
  ];
  // Jen selektory přítomné na stránce — vnitřní stránky mají jen část hero prvků.
  const present = steps.filter(([sel]) => ifExists(sel));
  if (present.length === 0) return;

  const presentSelectors = present.map(([sel]) => sel).join(', ');
  // clearProps + onInterrupt safety net: pokud timeline nedoběhne (hot-reload, scroll, tab blur),
  // inline opacity:0 ze .from() by jinak nechalo prvky neviditelné.
  const clear = () => gsap.set(presentSelectors, { clearProps: 'opacity,transform,scale' });
  const tl = gsap.timeline({
    delay: 0.15,
    defaults: { ease: EASE, duration: 0.6 },
    onComplete: clear,
    onInterrupt: clear,
  });
  for (const [sel, at, vars] of present) {
    tl.from(sel, vars, at);
  }
}

// 3. Image parallax — jemný svislý posun při scrollu
function animateParallax() {
  gsap.utils.toArray<HTMLElement>('[data-anim="parallax"]').forEach((el) => {
    gsap.set(el, { scale: 1.1 });
    gsap.to(el, {
      yPercent: 10,
      ease: 'none',
      scrollTrigger: {
        trigger: el.parentElement as HTMLElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });
}

// 4. Scroll-triggered reveals — up / fade / scale / stagger
function animateScrollReveals() {
  const scrollConfig = (el: HTMLElement) => ({ trigger: el, start: SCROLL_START });

  const variants: Record<string, (el: HTMLElement) => gsap.TweenVars> = {
    up: (el) => ({ y: 30, opacity: 0, duration: DUR, ease: EASE, delay: delayOf(el) }),
    fade: (el) => ({ opacity: 0, duration: DUR, ease: EASE, delay: delayOf(el) }),
    scale: (el) => ({ scale: 1.04, opacity: 0, duration: 1.6, ease: 'power2.out', delay: delayOf(el) }),
  };

  for (const [name, vars] of Object.entries(variants)) {
    gsap.utils.toArray<HTMLElement>(`[data-anim="${name}"]`).forEach((el) => {
      gsap.from(el, { scrollTrigger: scrollConfig(el), ...vars(el) });
    });
  }

  gsap.utils.toArray<HTMLElement>('[data-anim="stagger"]').forEach((parent) => {
    const children = parent.querySelectorAll('[data-anim-child]');
    if (children.length === 0) return;
    gsap.from(children, {
      scrollTrigger: scrollConfig(parent),
      y: 20,
      opacity: 0,
      duration: DUR,
      ease: EASE,
      stagger: 0.12,
      delay: delayOf(parent),
    });
  });
}

// 5. Ring reveal — desktop scroll-linked rotace, mobile jednorázový jemný příchod
function animateRingReveal() {
  const ringEls = gsap.utils.toArray<HTMLElement>('[data-anim="ring-reveal"]');
  if (ringEls.length === 0) return;
  const isDesktop = window.matchMedia(DESKTOP_MQ).matches;

  ringEls.forEach((el) => {
    const section = el.closest('section');
    if (!section) return;
    if (isDesktop) {
      gsap.fromTo(
        el,
        { rotate: -12 },
        {
          rotate: 12,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        },
      );
    } else {
      gsap.set(el, { opacity: 0, scale: 0.94, rotate: -6 });
      gsap.to(el, {
        opacity: 1,
        scale: 1,
        rotate: 0,
        duration: 1.4,
        ease: EASE,
        scrollTrigger: { trigger: el, start: SCROLL_START, once: true },
      });
    }
  });
}

// 6. Floating prvky (scattered galerie) — fade-in + scroll-linked drift
function animateFloats() {
  document.querySelectorAll<HTMLElement>('[data-float]').forEach((el, i) => {
    const speed = parseFloat(el.getAttribute('data-float') || '0.5');
    gsap.fromTo(
      el,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1.2, delay: 0.3 + i * 0.1, ease: 'power2.out' },
    );
    gsap.to(el, {
      y: speed * -80,
      ease: 'none',
      scrollTrigger: {
        trigger: el.closest('section') as HTMLElement,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });
  });
}

function init() {
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    animateNav();
    animateHero();
    animateParallax();
    animateScrollReveals();
    animateRingReveal();
    animateFloats();
  });
}

// Spustit hned, pokud DOM už je ready (lazy-loaded skript) — jinak počkat na DOMContentLoaded.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
