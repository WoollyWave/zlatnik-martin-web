import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
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
    const heroTl = gsap.timeline({ delay: 0.15, defaults: { ease, duration: dur } });
    heroTl
      .from('.hero-label', { opacity: 0, y: 15 }, 0)
      .from('.hero-headline span.block', { opacity: 0, y: 25, stagger: 0.12 }, 0.1)
      .from('.hero-copy', { opacity: 0, y: 20 }, 0.4)
      .from('.hero-btn-group > *', { opacity: 0, y: 15, stagger: 0.1 }, 0.6)
      .from('.hero-meta > div', { opacity: 0, y: 15, stagger: 0.1 }, 0.8)
      .from('.hero-img-wrap', { scale: 1.05, opacity: 0, duration: 1.8, ease: 'power2.out' }, 0.2)
      .from('.hero-plaque', { opacity: 0, y: 20 }, 1.1)
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

    // Old data-parallax support (for other pages)
    document.querySelectorAll('[data-parallax]').forEach((section) => {
      const img = section.querySelector('img');
      if (!img) return;
      gsap.to(img, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: section as HTMLElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    });

    // Old data-animate support (for other pages)
    document.querySelectorAll('[data-animate]').forEach((el) => {
      const htmlEl = el as HTMLElement;
      const direction = htmlEl.getAttribute('data-animate') || 'up';
      const fromVars: gsap.TweenVars = { opacity: 0, duration: dur, ease };
      if (direction === 'up') fromVars.y = 30;
      gsap.from(htmlEl, {
        ...fromVars,
        scrollTrigger: { trigger: htmlEl, start: 'top 90%', once: true },
      });
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
});
