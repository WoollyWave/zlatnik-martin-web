/**
 * Zákaznická recenze produktu. POUZE skutečná hodnocení od reálných zákazníků —
 * smyšlené recenze porušují pravidla Google pro strukturovaná data (riziko ruční
 * penalizace celého webu). Recenze se zobrazuje viditelně na stránce produktu
 * A zároveň jde do Product JSON-LD (review + aggregateRating).
 */
export interface ProductReview {
  /** Jméno zákazníka (může být jen křestní + iniciála). */
  author: string;
  /** Hodnocení 1–5. */
  rating: 1 | 2 | 3 | 4 | 5;
  /** Text recenze česky. */
  text: string;
  /** Volitelný anglický překlad pro EN stránku (fallback na CS). */
  textEn?: string;
  /** Datum ve formátu YYYY-MM-DD. */
  date: string;
}

export interface Product {
  slug: string;
  title: string;
  material: string;
  category: 'prsteny' | 'nausnice' | 'privesky' | 'retizky' | 'sady';
  size?: string;
  /** Stříbrná varianta. Volitelná — kusy vyrobené jen ve zlatě ji nemají a
   *  hlavní cenou se pro ně stává `priceGold` (viz ProductCard/ProductDetailPage). */
  weightSilver?: string;
  priceSilver?: string;
  weightGold?: string;
  priceGold?: string;
  /** Konec platnosti ceny (YYYY-MM-DD) — pro akční cenu. Jde do Offer.priceValidUntil. */
  priceValidUntil?: string;
  goldNote?: string;
  description: string;
  image: string;
  imageCard?: string;
  alt: string;
  detailImages?: { src: string; alt: string; altEn?: string }[];
  stockBadge?: 'jediny-originalni-kus' | null;
  /** true = vyprodáno → Product schema availability SoldOut (stránka zůstává kvůli SEO). */
  sold?: boolean;
  /** Skutečné zákaznické recenze — viz ProductReview. Vyplněním zmizí GSC
   *  doporučení „Chybí pole review / aggregateRating" pro daný produkt. */
  reviews?: ProductReview[];
  notes?: string[];

  // --- English variants (used by /en/jewelry/[slug] pages) ---
  slugEn?: string;
  titleEn?: string;
  materialEn?: string;
  descriptionEn?: string;
  altEn?: string;
  priceSilverEn?: string;
  priceGoldEn?: string;
  goldNoteEn?: string;
  sizeEn?: string;
  notesEn?: string[];
}

/**
 * Katalog v pořadí, v jakém kusy vznikaly — NEJSTARŠÍ NAHOŘE.
 * Nový šperk přidávej vždy na KONEC tohohle pole; o obrácení do „nejnovější
 * první" se postará export `products` níž. Nepřidávej nahoru, rozbilo by to
 * řazení na /skladem/ i výběr na homepage.
 */
const productsChronological: Product[] = [
  {
    slug: 'prsten-s-ametystem-kulaty',
    title: 'Prsten s ametystem',
    material: 'Stříbro 925/1000, ametyst',
    category: 'prsteny',
    size: '56½',
    weightSilver: '3,14 g',
    priceSilver: '7 700 Kč',
    weightGold: '4,6 g',
    priceGold: '19 200 Kč',
    goldNote: 'k 12. 5. 2026',
    description: 'Ručně vyrobený stříbrný prsten s kulatě broušeným ametystem.',
    image: '/skladem/1.webp',
    imageCard: '/skladem/karta/1.webp',
    alt: 'Stříbrný prsten s kulatým ametystem',

    slugEn: 'round-amethyst-ring',
    titleEn: 'Round amethyst ring',
    materialEn: 'Sterling silver 925/1000, amethyst',
    descriptionEn: 'Handmade sterling silver ring with a round-cut amethyst.',
    altEn: 'Sterling silver ring with a round amethyst',
    priceSilverEn: 'CZK 7,700',
    priceGoldEn: 'CZK 19,200',
    goldNoteEn: 'as of 12 May 2026',
  },
  {
    slug: 'prsten-s-grossularem',
    title: 'Prsten s grossulárem',
    material: 'Stříbro 925/1000, grossulár (druh granátu)',
    category: 'prsteny',
    size: '55',
    weightSilver: '2,45 g',
    priceSilver: '4 900 Kč',
    weightGold: '3,30 g',
    priceGold: '13 200 Kč',
    goldNote: 'k 12. 5. 2026',
    description: 'Stříbrný prsten s grossulárem, zelenožlutou odrůdou granátu.',
    image: '/skladem/2.webp',
    imageCard: '/skladem/karta/2.webp',
    alt: 'Stříbrný prsten s grossulárem',

    slugEn: 'grossular-garnet-ring',
    titleEn: 'Grossular garnet ring',
    materialEn: 'Sterling silver 925/1000, grossular (a variety of garnet)',
    descriptionEn: 'Sterling silver ring with grossular, a yellow-green variety of garnet.',
    altEn: 'Sterling silver ring with a grossular garnet',
    priceSilverEn: 'CZK 4,900',
    priceGoldEn: 'CZK 13,200',
    goldNoteEn: 'as of 12 May 2026',
  },
  {
    slug: 'prsten-s-turmalinem',
    title: 'Prsten s turmalínem',
    material: 'Stříbro 925/1000, turmalín',
    category: 'prsteny',
    size: '56',
    weightSilver: '4,65 g',
    priceSilver: '7 300 Kč',
    weightGold: '6,25 g',
    priceGold: '22 900 Kč',
    goldNote: 'k 12. 5. 2026',
    description: 'Stříbrný prsten s turmalínem v ručně tepaném zasazení.',
    image: '/skladem/3.webp',
    imageCard: '/skladem/karta/3.webp',
    alt: 'Stříbrný prsten s turmalínem',

    slugEn: 'tourmaline-ring',
    titleEn: 'Tourmaline ring',
    materialEn: 'Sterling silver 925/1000, tourmaline',
    descriptionEn: 'Sterling silver ring with tourmaline in a hand-forged setting.',
    altEn: 'Sterling silver ring with a tourmaline',
    priceSilverEn: 'CZK 7,300',
    priceGoldEn: 'CZK 22,900',
    goldNoteEn: 'as of 12 May 2026',
  },
  {
    slug: 'prsten-s-apatitem',
    title: 'Prsten s apatitem',
    material: 'Stříbro 925/1000, apatit',
    category: 'prsteny',
    size: '50½',
    weightSilver: '2,48 g',
    priceSilver: '6 800 Kč',
    weightGold: '3,35 g',
    priceGold: '15 200 Kč',
    goldNote: 'k 12. 5. 2026',
    description: 'Jemný stříbrný prsten s apatitem.',
    image: '/skladem/4.webp',
    imageCard: '/skladem/karta/4.webp',
    alt: 'Stříbrný prsten s apatitem',

    slugEn: 'apatite-ring',
    titleEn: 'Apatite ring',
    materialEn: 'Sterling silver 925/1000, apatite',
    descriptionEn: 'A delicate sterling silver ring with apatite.',
    altEn: 'Sterling silver ring with an apatite',
    priceSilverEn: 'CZK 6,800',
    priceGoldEn: 'CZK 15,200',
    goldNoteEn: 'as of 12 May 2026',
  },
  {
    slug: 'prsten-spirala',
    title: 'Prsten spirála',
    material: 'Stříbro 925/1000',
    category: 'prsteny',
    size: '64½',
    weightSilver: '7,36 g',
    priceSilver: '8 100 Kč',
    weightGold: '9,90 g',
    priceGold: '32 900 Kč',
    goldNote: 'k 12. 5. 2026',
    description: 'Architektonický stříbrný prsten s motivem spirály. Výrazný a masivnější kus.',
    image: '/skladem/5.webp',
    imageCard: '/skladem/karta/5.webp',
    alt: 'Stříbrný prsten spirála',

    slugEn: 'spiral-ring',
    titleEn: 'Spiral ring',
    materialEn: 'Sterling silver 925/1000',
    descriptionEn: 'An architectural sterling silver ring with a spiral motif. Bold and substantial.',
    altEn: 'Sterling silver spiral ring',
    priceSilverEn: 'CZK 8,100',
    priceGoldEn: 'CZK 32,900',
    goldNoteEn: 'as of 12 May 2026',
  },
  {
    slug: 'prsten-s-ametystem-obdelnik',
    title: 'Prsten s ametystem (obdélníkový)',
    material: 'Stříbro 925/1000, ametyst obdélníkového brusu',
    category: 'prsteny',
    size: '61',
    weightSilver: '7,42 g',
    priceSilver: '6 400 Kč',
    weightGold: '9,90 g',
    priceGold: '31 150 Kč',
    goldNote: 'k 12. 5. 2026',
    description: 'Výrazný stříbrný prsten s obdélníkovým ametystem v ručně kovaném zasazení.',
    image: '/skladem/6.webp',
    imageCard: '/skladem/karta/6.webp',
    alt: 'Stříbrný prsten s obdélníkovým ametystem',

    slugEn: 'emerald-cut-amethyst-ring',
    titleEn: 'Emerald-cut amethyst ring',
    materialEn: 'Sterling silver 925/1000, emerald-cut amethyst',
    descriptionEn: 'A bold sterling silver ring with an emerald-cut amethyst in a hand-forged setting.',
    altEn: 'Sterling silver ring with a rectangular amethyst',
    priceSilverEn: 'CZK 6,400',
    priceGoldEn: 'CZK 31,150',
    goldNoteEn: 'as of 12 May 2026',
  },
  {
    slug: 'prsten-s-filipinskou-perlou',
    title: 'Prsten s filipínskou perlou',
    material: 'Stříbro 925/1000, přírodní perla z Filipín (⌀ 12,5 mm)',
    category: 'prsteny',
    size: '64',
    weightSilver: '5,08 g',
    priceSilver: '20 000 Kč',
    weightGold: '6,70 g',
    priceGold: '36 750 Kč',
    goldNote: 'k 12. 5. 2026',
    description: 'Stříbrný prsten s velkou přírodní perlou z Filipín, ⌀ 12,5 mm.',
    image: '/skladem/7.webp',
    imageCard: '/skladem/karta/7.webp',
    detailImages: [
      { src: '/skladem/7.1.webp', alt: 'Prsten s filipínskou perlou, alternativní úhel', altEn: 'Philippine pearl ring, alternative angle' },
    ],
    alt: 'Stříbrný prsten s filipínskou perlou',

    slugEn: 'philippine-pearl-ring',
    titleEn: 'Philippine pearl ring',
    materialEn: 'Sterling silver 925/1000, natural pearl from the Philippines (⌀ 12.5 mm)',
    descriptionEn: 'Sterling silver ring with a large natural pearl from the Philippines, ⌀ 12.5 mm.',
    altEn: 'Sterling silver ring with a Philippine pearl',
    priceSilverEn: 'CZK 20,000',
    priceGoldEn: 'CZK 36,750',
    goldNoteEn: 'as of 12 May 2026',
  },
  {
    slug: 'prsten-retez',
    title: 'Prsten řetěz',
    material: 'Stříbro 925/1000',
    category: 'prsteny',
    size: '55',
    weightSilver: '4,39 g',
    priceSilver: '4 900 Kč',
    weightGold: '6 g',
    priceGold: '19 900 Kč',
    goldNote: 'k 12. 5. 2026',
    description: 'Stříbrný prsten s motivem řetězu. Moderní design, ruční výroba.',
    image: '/skladem/8.webp',
    imageCard: '/skladem/karta/8.webp',
    detailImages: [
      { src: '/skladem/8.1.webp', alt: 'Prsten řetěz na ruce', altEn: 'Chain-link ring on a hand' },
      { src: '/skladem/8.2.webp', alt: 'Prsten řetěz na ruce, druhý záběr', altEn: 'Chain-link ring on a hand, second view' },
    ],
    alt: 'Stříbrný prsten s řetězovým vzorem',

    slugEn: 'chain-link-ring',
    titleEn: 'Chain-link ring',
    materialEn: 'Sterling silver 925/1000',
    descriptionEn: 'Sterling silver ring with a chain-link motif. Modern design, handmade.',
    altEn: 'Sterling silver ring with a chain-link pattern',
    priceSilverEn: 'CZK 4,900',
    priceGoldEn: 'CZK 19,900',
    goldNoteEn: 'as of 12 May 2026',
  },
  {
    slug: 'prsten-nekonecno',
    title: 'Prsten nekonečno',
    material: 'Stříbro 925/1000',
    category: 'prsteny',
    size: '57½',
    weightSilver: '3,35 g',
    priceSilver: '4 900 Kč',
    weightGold: 'cca 4,5 g',
    priceGold: '16 000 Kč',
    goldNote: 'k 12. 5. 2026',
    description: 'Jemný stříbrný prsten s motivem nekonečna.',
    image: '/skladem/9.webp',
    imageCard: '/skladem/karta/9.webp',
    detailImages: [
      { src: '/skladem/9.1.webp', alt: 'Prsten nekonečno na ruce', altEn: 'Infinity ring on a hand' },
    ],
    alt: 'Stříbrný prsten nekonečno',

    slugEn: 'infinity-ring',
    titleEn: 'Infinity ring',
    materialEn: 'Sterling silver 925/1000',
    descriptionEn: 'A delicate sterling silver ring with an infinity motif.',
    altEn: 'Sterling silver infinity ring',
    priceSilverEn: 'CZK 4,900',
    priceGoldEn: 'CZK 16,000',
    goldNoteEn: 'as of 12 May 2026',
  },
  {
    slug: 'prsten-s-olivinem',
    title: 'Prsten s olivínem',
    material: 'Stříbro 925/1000, olivín',
    category: 'prsteny',
    size: '56',
    weightSilver: '3,60 g',
    priceSilver: '6 500 Kč',
    weightGold: '4,80 g',
    priceGold: '18 600 Kč',
    goldNote: 'k 12. 5. 2026',
    description: 'Stříbrný prsten s teplým zeleným olivínem.',
    image: '/skladem/10.webp',
    imageCard: '/skladem/karta/10.webp',
    detailImages: [
      { src: '/skladem/10.1.webp', alt: 'Prsten s olivínem, alternativní úhel', altEn: 'Peridot ring, alternative angle' },
      { src: '/skladem/10.2.webp', alt: 'Prsten s olivínem na ruce', altEn: 'Peridot ring on a hand' },
    ],
    alt: 'Stříbrný prsten s olivínem',

    slugEn: 'peridot-ring',
    titleEn: 'Peridot ring',
    materialEn: 'Sterling silver 925/1000, peridot',
    descriptionEn: 'Sterling silver ring with a warm green peridot.',
    altEn: 'Sterling silver ring with a peridot',
    priceSilverEn: 'CZK 6,500',
    priceGoldEn: 'CZK 18,600',
    goldNoteEn: 'as of 12 May 2026',
  },
  {
    slug: 'prsten-s-vltavinem',
    title: 'Prsten s vltavínem',
    material: 'Stříbro 925/1000, vltavín',
    category: 'prsteny',
    size: '55',
    weightSilver: '4,10 g',
    priceSilver: '5 600 Kč',
    weightGold: '5,50 g',
    priceGold: 'cca 19 400 Kč',
    goldNote: 'k 12. 5. 2026',
    description: 'Stříbrný prsten s vltavínem. Vzácný český kámen vesmírného původu.',
    image: '/skladem/11.webp',
    imageCard: '/skladem/karta/11.webp',
    alt: 'Stříbrný prsten s vltavínem',

    slugEn: 'moldavite-ring',
    titleEn: 'Moldavite ring',
    materialEn: 'Sterling silver 925/1000, moldavite',
    descriptionEn: 'Sterling silver ring with moldavite, a rare Czech tektite born from a meteorite impact.',
    altEn: 'Sterling silver ring with a moldavite',
    priceSilverEn: 'CZK 5,600',
    priceGoldEn: 'approx. CZK 19,400',
    goldNoteEn: 'as of 12 May 2026',
  },
  {
    slug: 'prsten-cihlicka',
    title: 'Prsten cihlička',
    material: 'Stříbro 925/1000',
    category: 'prsteny',
    size: '58½',
    weightSilver: '4,55 g',
    priceSilver: '4 700 Kč',
    weightGold: '6,10 g',
    priceGold: '19 800 Kč',
    goldNote: 'k 12. 5. 2026',
    description: 'Architektonický stříbrný prsten v minimalistickém tvaru cihličky.',
    image: '/skladem/12.webp',
    imageCard: '/skladem/karta/12.webp',
    detailImages: [
      { src: '/skladem/12.1.webp', alt: 'Prsten cihlička na ruce na dřevě', altEn: 'Brick ring on a hand resting on wood' },
    ],
    alt: 'Stříbrný prsten cihlička',

    slugEn: 'brick-ring',
    titleEn: 'Brick ring',
    materialEn: 'Sterling silver 925/1000',
    descriptionEn: 'An architectural sterling silver ring in a minimalist brick shape.',
    altEn: 'Sterling silver brick ring',
    priceSilverEn: 'CZK 4,700',
    priceGoldEn: 'CZK 19,800',
    goldNoteEn: 'as of 12 May 2026',
  },
  {
    slug: 'prsten-s-opalem',
    title: 'Prsten s opálem',
    material: 'Stříbro 925/1000, opál',
    category: 'prsteny',
    size: '51–53 (lze roztáhnout)',
    weightSilver: '2,50 g',
    priceSilver: '6 800 Kč',
    weightGold: 'cca 3,35 g',
    priceGold: 'cca 15 200 Kč',
    goldNote: 'k 12. 5. 2026',
    description: 'Stříbrný prsten s ohnivým opálem. Duhové záblesky v každém pohledu.',
    image: '/skladem/13.webp',
    imageCard: '/skladem/karta/13.webp',
    detailImages: [
      { src: '/skladem/13.1.webp', alt: 'Prsten s opálem na ruce', altEn: 'Opal ring on a hand' },
    ],
    alt: 'Stříbrný prsten s opálem',
    notes: ['Jeden prsten. Velikost lze roztáhnout v rozsahu 51–53.'],

    slugEn: 'opal-ring',
    titleEn: 'Opal ring',
    materialEn: 'Sterling silver 925/1000, opal',
    descriptionEn: 'Sterling silver ring with a fire opal. Rainbow flashes from every angle.',
    altEn: 'Sterling silver ring with an opal',
    priceSilverEn: 'CZK 6,800',
    priceGoldEn: 'approx. CZK 15,200',
    goldNoteEn: 'as of 12 May 2026',
    sizeEn: '51–53 (resizable)',
    notesEn: ['Single ring. Size can be adjusted within the 51–53 range.'],
  },
  {
    slug: 'prsten-s-vltavinem-original',
    title: 'Prsten s vltavínem, jediný originál',
    material: 'Stříbro 925/1000, surový vltavín',
    category: 'prsteny',
    size: '60',
    weightSilver: '12,30 g',
    priceSilver: '13 000 Kč',
    // BEZ priceSilverEn se na EN stránkách propíše česky formátovaná cena.
    priceSilverEn: 'CZK 13,000',
    description: 'Autorský prsten se surovým vltavínem v ručně tepaném stříbře. Voskový model a následně odlitý. Jediný originální kus.',
    image: '/skladem/14.webp',
    imageCard: '/skladem/karta/14.webp',
    detailImages: [
      { src: '/skladem/14.1.webp', alt: 'Vltavín originál, bok', altEn: 'Moldavite original, side view' },
      { src: '/skladem/14.2.webp', alt: 'Vltavín originál, detail', altEn: 'Moldavite original, close-up' },
      { src: '/skladem/14.3.webp', alt: 'Vltavín originál, alternativní úhel', altEn: 'Moldavite original, alternative angle' },
      { src: '/skladem/14.4.webp', alt: 'Vltavín originál, další úhel', altEn: 'Moldavite original, another angle' },
    ],
    alt: 'Autorský stříbrný prsten se surovým vltavínem',
    stockBadge: 'jediny-originalni-kus',
    notes: [
      'Nejde upravit: ani velikost, ani kámen.',
      'Stejný vltavín už nelze sehnat. Pro variantu ve zlatě bude potřeba nový kámen, váha zlata se stanoví podle něj.',
      'Cena 72 000 Kč ve zlatě zahrnuje práci + materiál + nový kámen.',
    ],

    slugEn: 'raw-moldavite-ring-original',
    titleEn: 'Raw moldavite ring, one of a kind',
    materialEn: 'Sterling silver 925/1000, raw moldavite',
    descriptionEn: 'A signature ring with raw moldavite set in hand-forged silver. Modelled in wax and lost-wax cast. A single, original piece.',
    altEn: 'A signature sterling silver ring with raw moldavite',
    notesEn: [
      'Cannot be adjusted: neither size nor stone.',
      'The same moldavite is no longer available. For a gold version, a new stone would be needed; the gold weight would depend on it.',
      'The CZK 72,000 price in gold includes the work, materials, and the new stone.',
    ],
  },
  {
    slug: 'privesek-briliant-grossular',
    title: 'Přívěsek s modrým briliantem a grossulárem',
    material: 'Stříbro 925/1000, modrý briliant + grossulár (2× ⌀ 2 mm)',
    category: 'privesky',
    weightSilver: '5,90 g',
    priceSilver: '7 200 Kč',
    weightGold: '8 g',
    priceGold: '27 200 Kč',
    goldNote: 'k 12. 5. 2026',
    description: 'Oboustranný stříbrný přívěsek se sazenými kameny: modrý briliant a grossulár. Průměr 3 cm.',
    image: '/skladem/15.webp',
    imageCard: '/skladem/karta/15.webp',
    detailImages: [
      { src: '/skladem/15.1.webp', alt: 'Přívěsek s briliantem a grossulárem, alternativní úhel', altEn: 'Diamond and grossular pendant, alternative angle' },
    ],
    alt: 'Stříbrný přívěsek s modrým briliantem a grossulárem',
    sold: true,
    notes: ['Tento kus je prodaný. Na objednávku vyrobím nový, s kameny, které si sami vyberete.'],

    slugEn: 'blue-diamond-grossular-pendant',
    titleEn: 'Pendant with blue diamond and grossular',
    materialEn: 'Sterling silver 925/1000, blue diamond + grossular (2× ⌀ 2 mm)',
    descriptionEn: 'Double-sided sterling silver pendant with set stones: a blue diamond and grossular. 3 cm diameter.',
    altEn: 'Sterling silver pendant with a blue diamond and grossular',
    priceSilverEn: 'CZK 7,200',
    priceGoldEn: 'CZK 27,200',
    goldNoteEn: 'as of 12 May 2026',
    notesEn: ['This piece is sold. I can make a new one to order, with stones of your choice.'],
  },
  {
    slug: 'privesek-s-ruzeninem',
    title: 'Přívěsek s růženínem',
    material: 'Stříbro 925/1000, růženín',
    category: 'privesky',
    weightSilver: '6 g',
    priceSilver: '7 600 Kč',
    weightGold: '8 g',
    priceGold: '27 600 Kč',
    goldNote: 'k 12. 5. 2026',
    description: 'Stříbrný přívěsek s broušeným růženínem.',
    image: '/skladem/16.webp',
    imageCard: '/skladem/karta/16.webp',
    detailImages: [
      { src: '/skladem/16.1.webp', alt: 'Přívěsek s růženínem, detail kapky', altEn: 'Rose quartz pendant, close-up of the drop' },
    ],
    alt: 'Stříbrný přívěsek s růženínem',

    slugEn: 'rose-quartz-pendant',
    titleEn: 'Rose quartz pendant',
    materialEn: 'Sterling silver 925/1000, rose quartz',
    descriptionEn: 'Sterling silver pendant with a faceted rose quartz.',
    altEn: 'Sterling silver pendant with a rose quartz',
    priceSilverEn: 'CZK 7,600',
    priceGoldEn: 'CZK 27,600',
    goldNoteEn: 'as of 12 May 2026',
  },
  {
    slug: 'privesek-s-oranzovym-granatem',
    title: 'Přívěsek s oranžovým granátem',
    material: 'Stříbro 925/1000, oranžový granát',
    category: 'privesky',
    weightSilver: '1,88 g',
    priceSilver: '2 800 Kč',
    weightGold: '2,5 g',
    priceGold: '9 200 Kč',
    goldNote: 'k 12. 5. 2026',
    description: 'Ručně vyrobený stříbrný přívěsek s oranžovým granátem ve dvojitém kruhu.',
    image: '/skladem/17.webp',
    imageCard: '/skladem/karta/17.webp',
    alt: 'Stříbrný přívěsek s oranžovým granátem ve dvojitém kruhu',

    slugEn: 'orange-garnet-pendant',
    titleEn: 'Orange garnet pendant',
    materialEn: 'Sterling silver 925/1000, orange garnet',
    descriptionEn: 'Handmade sterling silver pendant with an orange garnet in a double ring.',
    altEn: 'Sterling silver pendant with an orange garnet in a double ring',
    priceSilverEn: 'CZK 2,800',
    priceGoldEn: 'CZK 9,200',
    goldNoteEn: 'as of 12 May 2026',
  },
  {
    slug: 'prsten-s-olivinem-trilliant',
    title: 'Prsten s olivínem (trilliant)',
    material: 'Stříbro 925/1000, olivín (peridot)',
    category: 'prsteny',
    weightSilver: '4,60 g',
    priceSilver: '5 400 Kč',
    weightGold: '6,20 g',
    priceGold: '20 900 Kč',
    goldNote: 'k 12. 5. 2026',
    description: 'Stříbrný prsten s velkým trilliantovým olivínem. Ručně zpracovaný vosk, odlití odstředivou silou a fasování kamene.',
    image: '/skladem/18.webp',
    imageCard: '/skladem/karta/18.webp',
    detailImages: [
      { src: '/skladem/18.1.webp', alt: 'Prsten s olivínem, pohled z boku', altEn: 'Peridot ring, side view' },
    ],
    alt: 'Stříbrný prsten s trilliantovým olivínem',

    slugEn: 'peridot-ring-trillion',
    titleEn: 'Peridot ring (trillion cut)',
    materialEn: 'Sterling silver 925/1000, peridot',
    descriptionEn: 'Sterling silver ring with a large trillion-cut peridot. Hand-carved wax, centrifugal casting and hand-set stone.',
    altEn: 'Sterling silver ring with a trillion-cut peridot',
    priceSilverEn: 'CZK 5,400',
    priceGoldEn: 'CZK 20,900',
    goldNoteEn: 'as of 12 May 2026',
  },
  {
    slug: 'privesek-s-filipinskou-perlou',
    title: 'Přívěsek s filipínskou perlou',
    material: 'Stříbro 925/1000, přírodní perla z Filipín (⌀ 12,8 mm)',
    category: 'privesky',
    weightSilver: '10,20 g',
    priceSilver: '21 000 Kč',
    weightGold: '13,8 g',
    priceGold: '55 500 Kč',
    goldNote: 'k 12. 5. 2026',
    description: 'Ručně vyrobený stříbrný přívěsek s velkou přírodní perlou z Filipín (⌀ 12,8 mm) ve slzovém rámu.',
    image: '/skladem/19.webp',
    imageCard: '/skladem/karta/19.webp',
    alt: 'Stříbrný přívěsek s filipínskou perlou ve slzovém rámu',

    slugEn: 'philippine-pearl-pendant',
    titleEn: 'Philippine pearl pendant',
    materialEn: 'Sterling silver 925/1000, natural pearl from the Philippines (⌀ 12.8 mm)',
    descriptionEn: 'Handmade sterling silver pendant with a large natural pearl from the Philippines (⌀ 12.8 mm) in a teardrop frame.',
    altEn: 'Sterling silver pendant with a Philippine pearl in a teardrop frame',
    priceSilverEn: 'CZK 21,000',
    priceGoldEn: 'CZK 55,500',
    goldNoteEn: 'as of 12 May 2026',
  },
  {
    // Kus jen ve zlatě — bez stříbrné varianty, hlavní cenou je proto priceGold.
    slug: 'zlaty-zasnubni-prsten-s-briliantem',
    title: 'Zlatý zásnubní prsten s briliantem',
    material: 'Zlato 585/1000, briliant 0,50 ct (čistota SI1, barva E)',
    category: 'prsteny',
    size: '55 ½',
    weightGold: '3 g',
    priceGold: '60 000 Kč',
    description: 'Ručně vyrobený zásnubní prsten ze zlata 585/1000 s briliantem 0,50 ct (čistota SI1, barva E). Čistá váha 3 g, velikost 55 ½.',
    image: '/skladem/20.webp',
    imageCard: '/skladem/karta/20.webp',
    alt: 'Zlatý zásnubní prsten s briliantem, zlato 585/1000',
    detailImages: [
      { src: '/skladem/20.1.webp', alt: 'Zlatý zásnubní prsten s briliantem z boku', altEn: 'Gold diamond engagement ring from the side' },
    ],
    notes: [
      'Briliant 0,50 ct, čistota SI1, barva E.',
      'Úprava velikosti zdarma.',
      'Čistá váha zlata 3 g, ryzost 585/1000.',
    ],

    slugEn: 'gold-diamond-engagement-ring',
    titleEn: 'Gold diamond engagement ring',
    materialEn: 'Gold 585/1000 (14 kt), 0.50 ct brilliant-cut diamond (SI1 clarity, E colour)',
    descriptionEn: 'Handmade engagement ring in 585/1000 gold with a 0.50 ct brilliant-cut diamond (SI1 clarity, E colour). Net weight 3 g, size 55 ½.',
    altEn: 'Gold engagement ring with a brilliant-cut diamond, 585/1000 gold',
    priceGoldEn: 'CZK 60,000',
    sizeEn: '55 ½ (EU)',
    notesEn: [
      'Diamond 0.50 ct, SI1 clarity, E colour.',
      'Resizing free of charge.',
      'Net gold weight 3 g, 585/1000 fineness.',
    ],
  },
];

/**
 * Zobrazovací pořadí — nejnovější první. Čte ho /skladem/, ItemList schema,
 * ukázka na homepage i navigace mezi detaily, takže stačí otočit tady na
 * jednom místě.
 */
export const products: Product[] = [...productsChronological].reverse();

/**
 * Nejnižší cena kusu, který je právě k mání (bez prodaných), volitelně v jedné
 * kategorii. Bere stříbrnou variantu — ta je u každého kusu ta levnější.
 * Dopočítává se, ne píše ručně: katalog se mění s každým prodaným a přidaným
 * kusem a ručně zapsané minimum by se s ním rozešlo (homepage, JSON-LD).
 */
export function minInStockPrice(category?: Product['category']): number | undefined {
  const ceny = products
    .filter((p) => !p.sold && p.priceSilver && (!category || p.category === category))
    .map((p) => Number(p.priceSilver!.replace(/[^\d]/g, '')))
    .filter((n) => Number.isFinite(n) && n > 0);
  return ceny.length ? Math.min(...ceny) : undefined;
}

