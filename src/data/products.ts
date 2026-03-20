export interface Product {
  slug: string;
  title: string;
  material: string;
  price: string;
  category: string;
  description: string;
}

export const products: Product[] = [
  {
    slug: 'stribrny-prsten-s-mesicnim-kamenem',
    title: 'Stříbrný prsten s měsíčním kamenem',
    material: 'Stříbro 925, měsíční kámen',
    price: '3 200 Kč',
    category: 'prsteny',
    description: 'Jemný prsten s kabošonovým broušením měsíčního kamene zasazený do stříbra.',
  },
  {
    slug: 'stribrne-nausnice-s-granaty',
    title: 'Stříbrné náušnice s granáty',
    material: 'Stříbro 925, české granáty',
    price: '2 800 Kč',
    category: 'nausnice',
    description: 'Klasické náušnice s českými granáty v moderním zasazení.',
  },
  {
    slug: 'stribrny-privesek-kapka',
    title: 'Stříbrný přívěsek Kapka',
    material: 'Stříbro 925',
    price: '1 900 Kč',
    category: 'privesky',
    description: 'Minimalistický přívěsek ve tvaru kapky, ručně tepaný.',
  },
  {
    slug: 'stribrny-retizek-had',
    title: 'Stříbrný řetízek Had',
    material: 'Stříbro 925, délka 45 cm',
    price: '1 500 Kč',
    category: 'retizky',
    description: 'Jemný hadí řetízek ideální jako základ pro přívěsky.',
  },
  {
    slug: 'sada-luna-nausnice-a-prsten',
    title: 'Sada Luna — náušnice a prsten',
    material: 'Stříbro 925, měsíční kámen',
    price: '5 400 Kč',
    category: 'sady',
    description: 'Sada náušnic a prstenu s měsíčním kamenem v jednotném designu.',
  },
  {
    slug: 'stribrny-prsten-s-ametystem',
    title: 'Stříbrný prsten s ametystem',
    material: 'Stříbro 925, ametyst',
    price: '3 600 Kč',
    category: 'prsteny',
    description: 'Výrazný prsten s fasetovaným ametystem v ručně kovaném stříbře.',
  },
];
