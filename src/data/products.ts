export interface Product {
  slug: string;
  title: string;
  material: string;
  price: string;
  category: string;
  description: string;
  image: string;
  image2x: string;
  alt: string;
  detailImages?: { src: string; src2x: string; alt: string }[];
}

export const products: Product[] = [
  {
    slug: 'stribrny-prsten-s-mesicnim-kamenem',
    title: 'Prsten s ametystem',
    material: 'Stříbro 925, ametyst',
    price: '3 800 Kč',
    category: 'prsteny',
    description: 'Jemný prsten s kabošonovým broušením ametystu zasazený do stříbra.',
    image: '/images/skladem--produkt-1--prsten-ametyst-kulaty.webp',
    image2x: '/images/skladem--produkt-1--prsten-ametyst-kulaty@2x.webp',
    alt: 'Stříbrný prsten s kulatým ametystem',
    detailImages: [
      { src: '/images/detail--prsten-ametyst--var2.webp', src2x: '/images/detail--prsten-ametyst--var2@2x.webp', alt: 'Prsten s ametystem — detail zasazení' },
      { src: '/images/detail--prsten-ametyst--var3.webp', src2x: '/images/detail--prsten-ametyst--var3@2x.webp', alt: 'Prsten s ametystem — boční pohled' },
      { src: '/images/detail--prsten-ametyst--var4-lifestyle.webp', src2x: '/images/detail--prsten-ametyst--var4-lifestyle@2x.webp', alt: 'Prsten s ametystem na ruce' },
    ],
  },
  {
    slug: 'stribrne-nausnice-s-granaty',
    title: 'Náušnice růžový quartz',
    material: 'Stříbro 925, růžový křemen',
    price: '2 900 Kč',
    category: 'nausnice',
    description: 'Klasické náušnice s růžovým quartzem v moderním zasazení.',
    image: '/images/skladem--produkt-2--nausnice-ruzovy-quartz.webp',
    image2x: '/images/skladem--produkt-2--nausnice-ruzovy-quartz@2x.webp',
    alt: 'Stříbrné náušnice s růžovým quartzem',
  },
  {
    slug: 'stribrny-privesek-kapka',
    title: 'Přívěsek Kapka s perlou',
    material: 'Stříbro 925, sladkovodní perla',
    price: '2 200 Kč',
    category: 'privesky',
    description: 'Minimalistický přívěsek ve tvaru kapky s perlou, ručně tepaný.',
    image: '/images/skladem--produkt-3--privesek-kapka-perla.webp',
    image2x: '/images/skladem--produkt-3--privesek-kapka-perla@2x.webp',
    alt: 'Stříbrný přívěsek ve tvaru kapky s perlou',
    detailImages: [
      { src: '/images/detail--privesek-kapka--var2-na-krku.webp', src2x: '/images/detail--privesek-kapka--var2-na-krku@2x.webp', alt: 'Přívěsek Kapka na krku' },
    ],
  },
  {
    slug: 'stribrny-retizek-had',
    title: 'Prsten Řetěz',
    material: 'Stříbro 925',
    price: '1 600 Kč',
    category: 'prsteny',
    description: 'Stříbrný prsten s řetězovým vzorem.',
    image: '/images/skladem--produkt-4--prsten-retez-stribrny.webp',
    image2x: '/images/skladem--produkt-4--prsten-retez-stribrny@2x.webp',
    alt: 'Stříbrný prsten s řetězovým vzorem',
    detailImages: [
      { src: '/images/detail--prsten-retez--var2.webp', src2x: '/images/detail--prsten-retez--var2@2x.webp', alt: 'Prsten Řetěz — detail vzoru' },
    ],
  },
  {
    slug: 'sada-luna-nausnice-a-prsten',
    title: 'Prsten Infinity',
    material: 'Stříbro 925',
    price: '3 200 Kč',
    category: 'prsteny',
    description: 'Stříbrný prsten s motivem nekonečna.',
    image: '/images/skladem--produkt-5--prsten-infinity.webp',
    image2x: '/images/skladem--produkt-5--prsten-infinity@2x.webp',
    alt: 'Stříbrný prsten Infinity',
    detailImages: [
      { src: '/images/detail--prsten-infinity--var2-uzel.webp', src2x: '/images/detail--prsten-infinity--var2-uzel@2x.webp', alt: 'Prsten Infinity — detail uzlu' },
    ],
  },
  {
    slug: 'stribrny-prsten-s-ametystem',
    title: 'Prsten ametyst obdélník',
    material: 'Stříbro 925, ametyst',
    price: '5 400 Kč',
    category: 'prsteny',
    description: 'Výrazný prsten s obdélníkovým ametystem v ručně kovaném stříbře.',
    image: '/images/skladem--produkt-6--prsten-ametyst-obdelnik.webp',
    image2x: '/images/skladem--produkt-6--prsten-ametyst-obdelnik@2x.webp',
    alt: 'Stříbrný prsten s obdélníkovým ametystem',
    detailImages: [
      { src: '/images/detail--prsten-ametyst-obd--var2.webp', src2x: '/images/detail--prsten-ametyst-obd--var2@2x.webp', alt: 'Prsten s obdélníkovým ametystem — boční pohled' },
    ],
  },
];
