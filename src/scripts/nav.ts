// Mobile navigation toggle — Esc zavírá, outside click zavírá, link click zavírá.
const toggle = document.getElementById('mobile-menu-toggle');
const menu = document.getElementById('mobile-menu');
const lines = toggle?.querySelectorAll('.menu-line');

function openMenu() {
  menu?.classList.remove('hidden');
  toggle?.setAttribute('aria-expanded', 'true');
  toggle?.setAttribute('aria-label', 'Zavřít menu');
  document.body.style.overflow = 'hidden';
  if (lines) {
    lines[0].classList.add('rotate-45', 'translate-y-[5px]');
    lines[1].classList.add('-rotate-45', '-translate-y-[5px]');
  }
}

function closeMenu() {
  menu?.classList.add('hidden');
  toggle?.setAttribute('aria-expanded', 'false');
  toggle?.setAttribute('aria-label', 'Otevřít menu');
  document.body.style.overflow = '';
  if (lines) {
    lines[0].classList.remove('rotate-45', 'translate-y-[5px]');
    lines[1].classList.remove('-rotate-45', '-translate-y-[5px]');
  }
}

toggle?.addEventListener('click', () => {
  const isClosed = menu?.classList.contains('hidden');
  if (isClosed) openMenu();
  else closeMenu();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !menu?.classList.contains('hidden')) {
    closeMenu();
    (toggle as HTMLElement | null)?.focus();
  }
});

document.addEventListener('click', (e) => {
  if (!menu?.classList.contains('hidden') &&
      !menu?.contains(e.target as Node) &&
      !toggle?.contains(e.target as Node)) {
    closeMenu();
  }
});

menu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});
