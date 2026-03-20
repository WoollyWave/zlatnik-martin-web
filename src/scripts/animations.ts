import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- Scroll-triggered fade-in + slide-up on sections ---
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]');

  animatedElements.forEach((el) => {
    const delay = parseFloat(el.getAttribute('data-animate-delay') || '0');
    const direction = el.getAttribute('data-animate') || 'up';

    const fromVars: gsap.TweenVars = {
      opacity: 0,
      duration: 1.0,
      ease: 'power3.out',
      delay,
    };

    if (direction === 'up') {
      fromVars.y = 40;
    } else if (direction === 'left') {
      fromVars.x = -40;
    } else if (direction === 'right') {
      fromVars.x = 40;
    }
    // direction === 'fade' → only opacity

    gsap.from(el as HTMLElement, {
      ...fromVars,
      scrollTrigger: {
        trigger: el as HTMLElement,
        start: 'top 90%',
        once: true,
      },
    });
  });

  // --- Staggered children ---
  const staggerGroups = document.querySelectorAll('[data-animate-stagger]');

  staggerGroups.forEach((group) => {
    const children = group.children;
    if (!children.length) return;

    gsap.from(Array.from(children), {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.15,
      scrollTrigger: {
        trigger: group as HTMLElement,
        start: 'top 90%',
        once: true,
      },
    });
  });
}

// --- Hover scale on cards ---
function initHoverScale() {
  const hoverElements = document.querySelectorAll('[data-hover-scale]');

  hoverElements.forEach((el) => {
    const scale = parseFloat(el.getAttribute('data-hover-scale') || '1.02');

    el.addEventListener('mouseenter', () => {
      gsap.to(el as HTMLElement, {
        scale,
        duration: 0.3,
        ease: 'power2.out',
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el as HTMLElement, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    });
  });
}

// --- Initialize ---
document.addEventListener('DOMContentLoaded', () => {
  // Respect prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    initScrollAnimations();
    initHoverScale();
  }
});
