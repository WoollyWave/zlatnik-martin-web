/** Rozdělí řetězec materiálu na max 2 tagy (dělí čárkou nebo středníkem ·). */
export function materialTags(material: string): string[] {
  return material
    .split(/[,·]/)
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 2);
}

/**
 * Zkrátí text na max délku NA HRANICI SLOVA (meta descriptions, JSON-LD).
 * Tvrdý slice() nechával popisky useknuté uprostřed slova („...práce. Jakmi").
 */
export function truncateAtWord(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  const trimmed = (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[,;:.]+$/, '');
  return `${trimmed}…`;
}
