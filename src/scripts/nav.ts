// Mobile navigation toggle — Esc zavírá, outside click zavírá, link click zavírá.
// Focus trap (A11Y-3): při otevření Tab cykluje uvnitř menu, `inert` deaktivuje pozadí.
const toggle = document.getElementById('mobile-menu-toggle');
const menu = document.getElementById('mobile-menu');
const lines = toggle?.querySelectorAll('.menu-line');
const main = document.getElementById('main');
const footer = document.querySelector('footer');

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Lokalizované aria-labely přicházejí z data-atributů (i18n), ne natvrdo — jinak
// by čtečka na /en/ po interakci hlásila česky.
const LABEL_OPEN = toggle?.dataset.labelOpen || 'Otevřít menu';
const LABEL_CLOSE = toggle?.dataset.labelClose || 'Zavřít menu';

function getMenuFocusables(): HTMLElement[] {
  if (!menu) return [];
  return Array.from(menu.querySelectorAll<HTMLElement>(FOCUSABLE));
}

function openMenu() {
  menu?.classList.remove('hidden');
  toggle?.setAttribute('aria-expanded', 'true');
  toggle?.setAttribute('aria-label', LABEL_CLOSE);
  document.body.style.overflow = 'hidden';
  // Inert background — assistive tech + sighted Tab nemůže ven z menu.
  main?.setAttribute('inert', '');
  footer?.setAttribute('inert', '');
  if (lines) {
    lines[0].classList.add('rotate-45', 'translate-y-[5px]');
    lines[1].classList.add('-rotate-45', '-translate-y-[5px]');
  }
  // Přesun focus na první link v menu pro screen readery.
  const focusables = getMenuFocusables();
  focusables[0]?.focus();
}

function closeMenu() {
  menu?.classList.add('hidden');
  toggle?.setAttribute('aria-expanded', 'false');
  toggle?.setAttribute('aria-label', LABEL_OPEN);
  document.body.style.overflow = '';
  main?.removeAttribute('inert');
  footer?.removeAttribute('inert');
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
  if (menu?.classList.contains('hidden')) return;

  // Esc closes + return focus to toggle.
  if (e.key === 'Escape') {
    closeMenu();
    (toggle as HTMLElement | null)?.focus();
    return;
  }

  // Tab focus trap — cycle uvnitř menu.
  if (e.key === 'Tab') {
    const focusables = getMenuFocusables();
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement as HTMLElement | null;

    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
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
