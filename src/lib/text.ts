/** Rozdělí řetězec materiálu na max 2 tagy (dělí čárkou nebo středníkem ·). */
export function materialTags(material: string): string[] {
  return material
    .split(/[,·]/)
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 2);
}
