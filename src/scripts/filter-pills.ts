// Filter pill behavior — toggle aria-pressed + show/hide cards by [data-category].
// Styling pillů řízeno přes [aria-pressed] attribute selector v komponentě.
document.addEventListener('DOMContentLoaded', () => {
  const pills = document.querySelectorAll<HTMLButtonElement>('.filter-pill');
  const cards = document.querySelectorAll<HTMLElement>('[data-category]');

  const setActive = (target: HTMLButtonElement) => {
    pills.forEach((p) => {
      const isTarget = p === target;
      p.setAttribute('aria-pressed', isTarget ? 'true' : 'false');
      p.classList.toggle('bg-text-primary', isTarget);
      p.classList.toggle('active', isTarget);
      p.classList.toggle('bg-transparent', !isTarget);
      p.classList.toggle('border', !isTarget);
      p.classList.toggle('border-border', !isTarget);
      p.classList.toggle('text-text-secondary', !isTarget);
      p.classList.toggle('btn-text-light', isTarget);
    });
  };

  // Třída `.is-filter-hidden` řízena přes CSS (definováno v global.css) — single layout pass,
  // žádný inline-style thrash. INP-friendly.
  const applyFilter = (filter: string) => {
    cards.forEach((card) => {
      const category = card.getAttribute('data-category') || '';
      const visible = filter === 'all' || category === filter;
      card.classList.toggle('is-filter-hidden', !visible);
    });
  };

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      setActive(pill);
      applyFilter(pill.getAttribute('data-filter') || 'all');
    });
  });
});
