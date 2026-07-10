// Lightbox pro process galerii případovek (CaseStudyPage): open/close/next/prev + touch swipe + klávesy.
// Používá nativní <dialog> (showModal). Data-atributy [data-gallery-item] nesou src/src2x/alt/caption.
// Styly žijí v <style is:global> přímo v CaseStudyPage.astro (jen tam se mají inlinovat — viz komentář tam).
const lightbox = document.getElementById('gallery-lightbox') as HTMLDialogElement | null;
if (lightbox) {
  const imgEl = document.getElementById('lightbox-img') as HTMLImageElement;
  const captionEl = document.getElementById('lightbox-caption') as HTMLElement;
  const counterEl = document.getElementById('lightbox-counter') as HTMLElement;
  const prevBtn = document.getElementById('lightbox-prev')!;
  const nextBtn = document.getElementById('lightbox-next')!;
  const closeBtn = document.getElementById('lightbox-close')!;

  type Photo = { src: string; src2x?: string; alt: string; caption?: string };
  const items = Array.from(document.querySelectorAll<HTMLElement>('[data-gallery-item]'));
  const photos: Photo[] = items.map((el) => ({
    src: el.dataset.src!,
    src2x: el.dataset.src2x || undefined,
    alt: el.dataset.alt!,
    caption: el.dataset.caption || undefined,
  }));
  let idx = 0;

  function render() {
    const p = photos[idx];
    imgEl.src = p.src;
    if (p.src2x) imgEl.srcset = `${p.src} 1x, ${p.src2x} 2x`;
    else imgEl.removeAttribute('srcset');
    imgEl.alt = p.alt;
    captionEl.textContent = p.caption || '';
    counterEl.textContent = `${idx + 1} / ${photos.length}`;
  }

  function open(i: number) {
    idx = i;
    render();
    lightbox!.showModal();
    document.documentElement.style.overflow = 'hidden';
  }
  function close() {
    lightbox!.close();
    document.documentElement.style.overflow = '';
  }
  function next() { idx = (idx + 1) % photos.length; render(); }
  function prev() { idx = (idx - 1 + photos.length) % photos.length; render(); }

  items.forEach((el, i) => {
    el.addEventListener('click', (e) => { e.preventDefault(); open(i); });
  });
  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  lightbox.addEventListener('click', (e) => {
    // Click on the dialog itself (backdrop) — close. Don't close on inner clicks.
    if (e.target === lightbox) close();
  });
  lightbox.addEventListener('close', () => {
    document.documentElement.style.overflow = '';
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.open) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
  });

  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 60) { dx > 0 ? prev() : next(); }
  });
}
