// Filter pill behavior — toggle active pill + filter cards with [data-category].
document.addEventListener('DOMContentLoaded', () => {
  const pills = document.querySelectorAll<HTMLButtonElement>('.filter-pill');
  const cards = document.querySelectorAll<HTMLElement>('[data-category]');

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const filter = pill.getAttribute('data-filter') || 'all';

      pills.forEach((p) => {
        p.classList.remove('bg-text-primary', 'active');
        p.classList.add('bg-transparent', 'border', 'border-border', 'text-text-secondary');
        p.style.color = '';
        p.setAttribute('aria-pressed', 'false');
      });
      pill.classList.add('bg-text-primary', 'active');
      pill.classList.remove('bg-transparent', 'border', 'border-border', 'text-text-secondary');
      pill.style.color = 'var(--color-button-text)';
      pill.setAttribute('aria-pressed', 'true');

      cards.forEach((card) => {
        const category = card.getAttribute('data-category') || '';
        if (filter === 'all' || category === filter) {
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
    });
  });
});
