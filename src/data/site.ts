/**
 * Brand a kontaktní konstanty.
 * Jediný zdroj pravdy — když se cokoli změní, mění se tady a propaguje se napříč webem.
 */
export const SITE = {
  name: 'Martin Ševr — Zlatnická dílna',
  shortName: 'Martin Ševr',
  description: 'Zlatnictví a zlatnická dílna v Praze 5 na Smíchově. Ruční výroba šperků ze zlata, stříbra a přírodních kamenů na zakázku. Každý kus originál.',
  url: 'https://www.zlatnik-martin.cz',

  phone: '+420774598181',
  phoneDisplay: '+420 774 598 181',
  phoneHref: 'tel:+420774598181',
  whatsapp: 'https://wa.me/420774598181',
  email: 'zlatnikmartin@email.cz',
  emailHref: 'mailto:zlatnikmartin@email.cz',
  ico: '87639114',

  address: {
    street: 'Pod Kesnerkou 46',
    city: 'Praha 5',
    postal: '150 00',
    country: 'CZ',
    full: 'Pod Kesnerkou 46, Praha 5, 150 00',
  },

  social: {
    instagram: 'https://www.instagram.com/zlatnicka_dilna_martin_sevr/',
    facebook: 'https://www.facebook.com/MartinSevr',
  },

  hours: {
    weekdays: '9:00–17:00',
    weekends: 'po domluvě',
  },
} as const;
