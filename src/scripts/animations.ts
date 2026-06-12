import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function init() {
  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const ease = 'power3.out';
    const dur = 1.3;

    // 1. Navigation float-in
    const nav = document.getElementById('main-nav');
    if (nav) {
      gsap.from(nav, { y: -24, opacity: 0, duration: 1.5, ease, delay: 0.1 });
    }

    // 2. Hero orchestrated timeline
    // Animace jde přesně v DOM pořadí: label-dot → H1 → copy → buttons → status → meta.
    // clearProps + onInterrupt safety net: pokud timeline nedoběhne (hot-reload, scroll, tab blur),
    // inline opacity:0 ze .from() by jinak nechalo prvky neviditelné.
    const heroTargets = '.label-dot, .hero-headline span.block, .hero-copy, .hero-btn-group > *, .hero-status, .hero-meta > div, .hero-img-wrap, .hero-plaque, .hero-vol';
    const heroTl = gsap.timeline({
      delay: 0.15,
      defaults: { ease, duration: 0.6 },
      onComplete: () => gsap.set(heroTargets, { clearProps: 'opacity,transform,scale' }),
      onInterrupt: () => gsap.set(heroTargets, { clearProps: 'opacity,transform,scale' }),
    });
    heroTl
      .from('.hero-label > .label-dot', { opacity: 0, y: 12 }, 0)
      .from('.hero-headline span.block', { opacity: 0, y: 20, stagger: 0.1 }, 0.12)
      .from('.hero-copy', { opacity: 0, y: 16 }, 0.3)
      .from('.hero-btn-group > *', { opacity: 0, y: 12, stagger: 0.07 }, 0.45)
      .from('.hero-status', { opacity: 0, y: 10 }, 0.7)
      .from('.hero-meta > div', { opacity: 0, y: 12, stagger: 0.07 }, 0.85)
      .from('.hero-img-wrap', { scale: 1.05, opacity: 0, duration: 1.4, ease: 'power2.out' }, 0.2)
      .from('.hero-plaque', { opacity: 0, y: 16 }, 1.1)
      .from('.hero-vol', { opacity: 0 }, 1.2);

    // 3. Image parallax
    gsap.utils.toArray('[data-anim="parallax"]').forEach((img) => {
      const el = img as HTMLElement;
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

    // 4. Scroll-triggered animations
    const scrollConfig = (el: HTMLElement) => ({ trigger: el, start: 'top 88%' });

    // Up
    gsap.utils.toArray('[data-anim="up"]').forEach((el) => {
      const htmlEl = el as HTMLElement;
      gsap.from(htmlEl, {
        scrollTrigger: scrollConfig(htmlEl),
        y: 30, opacity: 0, duration: dur, ease,
        delay: parseFloat(htmlEl.dataset.delay || '0'),
      });
    });

    // Fade
    gsap.utils.toArray('[data-anim="fade"]').forEach((el) => {
      const htmlEl = el as HTMLElement;
      gsap.from(htmlEl, {
        scrollTrigger: scrollConfig(htmlEl),
        opacity: 0, duration: dur, ease,
        delay: parseFloat(htmlEl.dataset.delay || '0'),
      });
    });

    // Scale
    gsap.utils.toArray('[data-anim="scale"]').forEach((el) => {
      const htmlEl = el as HTMLElement;
      gsap.from(htmlEl, {
        scrollTrigger: scrollConfig(htmlEl),
        scale: 1.04, opacity: 0, duration: 1.6, ease: 'power2.out',
        delay: parseFloat(htmlEl.dataset.delay || '0'),
      });
    });

    // Stagger
    gsap.utils.toArray('[data-anim="stagger"]').forEach((parent) => {
      const htmlParent = parent as HTMLElement;
      const children = htmlParent.querySelectorAll('[data-anim-child]');
      if (children.length === 0) return;
      gsap.from(children, {
        scrollTrigger: scrollConfig(htmlParent),
        y: 20, opacity: 0, duration: dur, ease,
        stagger: 0.12,
        delay: parseFloat(htmlParent.dataset.delay || '0'),
      });
    });

    // Ring reveal — desktop scroll-linked, mobile jednorázový jemný příchod
    const ringEls = gsap.utils.toArray<HTMLElement>('[data-anim="ring-reveal"]');
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    ringEls.forEach((el) => {
      const section = el.closest('section') as HTMLElement | null;
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
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      }
    });

    // Old data-float support
    document.querySelectorAll('[data-float]').forEach((el, i) => {
      const speed = parseFloat((el as HTMLElement).getAttribute('data-float') || '0.5');
      const htmlEl = el as HTMLElement;
      gsap.fromTo(htmlEl,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.3 + (i * 0.1), ease: 'power2.out' }
      );
      gsap.to(htmlEl, {
        y: speed * -80, ease: 'none',
        scrollTrigger: {
          trigger: htmlEl.closest('section') as HTMLElement,
          start: 'top top', end: 'bottom top', scrub: 1,
        },
      });
    });
  });
}

// Spustit hned, pokud DOM už je ready (lazy-loaded skript) — jinak počkat na DOMContentLoaded.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
