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

const NBSP = '\u00A0';
/**
 * Česká sazba pro prosté texty (ČSN 01 6910): jednopísmenné předložky a spojky
 * drží s následujícím slovem, číslo s jednotkou a měnou, tisíce pohromadě.
 * Jen na plain text — nikdy na HTML s atributy, URL ani kód.
 */
export function czTypo(s: string): string {
  return s
    .replace(/(?<=^|[\s(„])([KkSsVvZzOoUuAaIi])\s+(?=\S)/g, `$1${NBSP}`)
    .replace(/(\d)\s(?=\d{3}(?!\d))/g, `$1${NBSP}`)
    .replace(/(\d)[ \t]+(?=(?:Kč|°C|km|mm|cm|kg|min|ks|%|‰|m|h)(?![\p{L}\d]))/gu, `$1${NBSP}`)
    .replace(/(\d{1,2}\.)\s+(\d{1,2}\.)\s+(\d{4})/g, `$1${NBSP}$2${NBSP}$3`);
}

