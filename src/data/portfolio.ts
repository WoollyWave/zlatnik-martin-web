export interface PortfolioItem {
  slug: string;
  title: string;
  tags: string[];
  description: string;
  fullDescription: string;
  material: string;
  image: string;
  image2x: string;
  alt: string;
  heroImage?: string;
  heroImage2x?: string;
  processImages?: { src: string; src2x: string; alt: string }[];
}

export const portfolioItems: PortfolioItem[] = [
  {
    slug: 'zlaty-prsten-s-opalem',
    title: 'Opálový prsten',
    tags: ['Zlato 585', 'Opál', 'Zakázka'],
    description: 'Prsten s australským opálem zasazeným do ručně tepaného zlata. Navržen podle příběhu klientky.',
    fullDescription: 'Prsten s australským opálem zasazeným do ručně tepaného zlata. Navržen podle příběhu klientky, která chtěla šperk připomínající barvy západu slunce nad mořem. Opál mění barvy podle úhlu světla — od modré přes zelenou až po ohnivou oranžovou.',
    material: 'Zlato 585/1000, australský opál',
    image: '/images/portfolio--1--prsten-opal-trojuhelnik.webp',
    image2x: '/images/portfolio--1--prsten-opal-trojuhelnik@2x.webp',
    alt: 'Zlatý prsten s trojúhelníkovým opálem',
    processImages: [
      { src: '/images/detail-portfolio--opal--na-ruce-lifestyle.webp', src2x: '/images/detail-portfolio--opal--na-ruce-lifestyle@2x.webp', alt: 'Opálový prsten na ruce' },
      { src: '/images/detail-portfolio--vltavin--prsten-raw-moldavit.webp', src2x: '/images/detail-portfolio--vltavin--prsten-raw-moldavit@2x.webp', alt: 'Syrový materiál před zasazením' },
      { src: '/images/detail-portfolio--vltavin--na-krku-lifestyle.webp', src2x: '/images/detail-portfolio--vltavin--na-krku-lifestyle@2x.webp', alt: 'Detail šperku — lifestyle' },
    ],
  },
  {
    slug: 'stribrna-sada-s-granaty',
    title: 'Snubní prsteny',
    tags: ['Zlato 750', 'Rosegold', 'Zakázka'],
    description: 'Texturované snubní prsteny v rosegold. Každý je originál s ručně tepaným povrchem.',
    fullDescription: 'Snubní prsteny vyrobené ze zlata 750/1000 s ručně rytým vzorem, který připomíná letokruhy stromu. Každý prsten je trochu jiný — stejně jako každý vztah je jedinečný.',
    material: 'Zlato 750/1000, rosegold',
    image: '/images/portfolio--2--snubni-texturovane-rosegold.webp',
    image2x: '/images/portfolio--2--snubni-texturovane-rosegold@2x.webp',
    alt: 'Texturované snubní prsteny v rosegold',
    processImages: [
      { src: '/images/detail-portfolio--snubni--var2.webp', src2x: '/images/detail-portfolio--snubni--var2@2x.webp', alt: 'Snubní prsteny — detail textury' },
      { src: '/images/detail-portfolio--opal--na-ruce-lifestyle.webp', src2x: '/images/detail-portfolio--opal--na-ruce-lifestyle@2x.webp', alt: 'Prsteny na ruce' },
      { src: '/images/detail-portfolio--vltavin--na-krku-lifestyle.webp', src2x: '/images/detail-portfolio--vltavin--na-krku-lifestyle@2x.webp', alt: 'Detail řemeslné práce' },
    ],
  },
  {
    slug: 'snubni-prsteny-na-miru',
    title: 'Vltavínový přívěsek',
    tags: ['Stříbro 925', 'Vltavín', 'Autorský'],
    description: 'Surový vltavín zasazený do stříbrného přívěsku. Přírodní tvar kamene ponechán.',
    fullDescription: 'Surový vltavín zasazený do stříbrného přívěsku. Přírodní tvar kamene byl ponechán — každý kus je tak naprosto jedinečný. Vltavín jako český přírodní poklad v minimalistickém moderním zasazení.',
    material: 'Stříbro 925/1000, vltavín',
    image: '/images/portfolio--3--vltavinovy-privesek-raw.webp',
    image2x: '/images/portfolio--3--vltavinovy-privesek-raw@2x.webp',
    alt: 'Stříbrný přívěsek se surovým vltavínem',
    heroImage: '/images/detail-portfolio--vltavin--hero-wide.webp',
    heroImage2x: '/images/detail-portfolio--vltavin--hero-wide@2x.webp',
    processImages: [
      { src: '/images/detail-portfolio--vltavin--na-krku-lifestyle.webp', src2x: '/images/detail-portfolio--vltavin--na-krku-lifestyle@2x.webp', alt: 'Vltavínový přívěsek na krku' },
      { src: '/images/detail-portfolio--vltavin--prsten-raw-moldavit.webp', src2x: '/images/detail-portfolio--vltavin--prsten-raw-moldavit@2x.webp', alt: 'Surový moldavit před zasazením' },
      { src: '/images/detail-portfolio--opal--na-ruce-lifestyle.webp', src2x: '/images/detail-portfolio--opal--na-ruce-lifestyle@2x.webp', alt: 'Detail šperku na ruce' },
    ],
  },
  {
    slug: 'stribrny-nahrdelnik-vlna',
    title: 'Náhrdelník Kruhy',
    tags: ['Zlato 585', 'Diamanty', 'Zakázka'],
    description: 'Zlatý náhrdelník s propojnými kruhy a vsazenými diamanty. Elegantní a nadčasový.',
    fullDescription: 'Zlatý náhrdelník s propojnými kruhy a vsazenými diamanty. Elegantní a nadčasový design, který kombinuje geometrické tvary s jemností ručního zpracování.',
    material: 'Zlato 585/1000, diamanty',
    image: '/images/portfolio--4--nahrdelnik-kruhy-diamanty.webp',
    image2x: '/images/portfolio--4--nahrdelnik-kruhy-diamanty@2x.webp',
    alt: 'Zlatý náhrdelník s kruhy a diamanty',
    processImages: [
      { src: '/images/detail-portfolio--vltavin--na-krku-lifestyle.webp', src2x: '/images/detail-portfolio--vltavin--na-krku-lifestyle@2x.webp', alt: 'Náhrdelník na krku — lifestyle' },
      { src: '/images/detail-portfolio--opal--na-ruce-lifestyle.webp', src2x: '/images/detail-portfolio--opal--na-ruce-lifestyle@2x.webp', alt: 'Detail zlatnické práce' },
      { src: '/images/detail-portfolio--snubni--var2.webp', src2x: '/images/detail-portfolio--snubni--var2@2x.webp', alt: 'Proces výroby' },
    ],
  },
];
