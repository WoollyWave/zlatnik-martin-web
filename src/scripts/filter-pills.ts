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

  // Prodané kusy ([data-sold]) se zobrazí jen pod filtrem „Prodáno" a zmizí z „Vše" i z kategorií.
  const SOLD_FILTERS = ['prodano', 'sold'];

  // Třída `.is-filter-hidden` řízena přes CSS (definováno v global.css) — single layout pass,
  // žádný inline-style thrash. INP-friendly.
  const applyFilter = (filter: string) => {
    const soldView = SOLD_FILTERS.includes(filter);
    cards.forEach((card) => {
      const category = card.getAttribute('data-category') || '';
      const isSold = card.getAttribute('data-sold') === 'true';
      const visible = soldView
        ? isSold
        : !isSold && (filter === 'all' || category === filter);
      card.classList.toggle('is-filter-hidden', !visible);
    });
  };

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      setActive(pill);
      applyFilter(pill.getAttribute('data-filter') || 'all');
    });
  });

  // Výchozí stav: prodané kusy skryj už při načtení (default filtr „Vše").
  if (pills.length) {
    const active = document.querySelector<HTMLButtonElement>('.filter-pill[aria-pressed="true"]') || pills[0];
    applyFilter(active.getAttribute('data-filter') || 'all');
  }
});
