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
      p.style.color = isTarget ? 'var(--color-button-text)' : '';
    });
  };

  const applyFilter = (filter: string) => {
    cards.forEach((card) => {
      const category = card.getAttribute('data-category') || '';
      const visible = filter === 'all' || category === filter;
      if (visible) {
        card.style.display = '';
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        requestAnimationFrame(() => {
          card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
      } else {
        card.style.display = 'none';
      }
    });
  };

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      setActive(pill);
      applyFilter(pill.getAttribute('data-filter') || 'all');
    });
  });
});
