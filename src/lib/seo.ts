/**
 * JSON-LD schema.org helpers. Konzumují SITE konstanty, takže update se propaguje napříč.
 *
 * Best practices 2026:
 * - JewelryStore (subtyp Store/LocalBusiness) místo generického LocalBusiness
 * - Person entita pro Martina → E-E-A-T signál
 * - @graph s @id referencemi (DRY, jeden uzel = jedna pravda)
 * - BreadcrumbList na všech vnořených stránkách
 */
import { SITE } from '../data/site';
import type { Product } from '../data/products';
import type { PortfolioCase } from '../data/portfolio';

// --- Sdílené entity (referencované přes @id) ----------------------------------

const postalAddress = {
  '@type': 'PostalAddress',
  streetAddress: SITE.address.street,
  addressLocality: SITE.address.city,
  postalCode: SITE.address.postal,
  addressCountry: SITE.address.country,
};

/** Person — Martin Ševr. E-E-A-T signál pro Googlův Quality Rater algorithm. */
export function personSchema() {
  return {
    '@type': 'Person',
    '@id': `${SITE.url}#person`,
    name: SITE.shortName,
    givenName: 'Martin',
    familyName: 'Ševr',
    jobTitle: 'Zlatník',
    description: 'Pražský zlatník s více než 20 lety praxe v ruční výrobě šperků ze zlata, stříbra a přírodních kamenů.',
    url: `${SITE.url}/o-dilne/`,
    image: `${SITE.url}/images/og-default.jpg`,
    worksFor: { '@id': `${SITE.url}#business` },
    knowsAbout: [
      'Ruční výroba šperků',
      'Zakázková zlatnická tvorba',
      'Zlato 585/1000 a 750/1000',
      'Stříbro 925/1000',
      'Přírodní kameny',
      'Snubní a zásnubní prsteny',
      'Opravy a úpravy šperků',
    ],
    sameAs: [SITE.social.instagram, SITE.social.facebook],
  };
}

/** JewelryStore — přesnější než LocalBusiness pro Googlový SERP. */
export function jewelryStoreSchema() {
  return {
    '@type': ['JewelryStore', 'LocalBusiness'],
    '@id': `${SITE.url}#business`,
    name: SITE.name,
    legalName: 'Martin Ševr',
    description: SITE.description,
    url: SITE.url,
    telephone: SITE.phone,
    email: SITE.email,
    address: postalAddress,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 50.058644,
      longitude: 14.403715,
    },
    priceRange: '$$-$$$',
    // Google preferuje ImageObject s rozměry — víc info = lepší Knowledge Panel render.
    image: {
      '@type': 'ImageObject',
      url: `${SITE.url}/images/og-default.jpg`,
      width: 1200,
      height: 630,
    },
    // Pro Google logo: doporučeno PNG transparent, ideálně 600×60+; favicon.svg je fallback.
    logo: {
      '@type': 'ImageObject',
      url: `${SITE.url}/favicon.svg`,
      width: 512,
      height: 512,
    },
    founder: { '@id': `${SITE.url}#person` },
    employee: { '@id': `${SITE.url}#person` },
    foundingDate: '2004',
    taxID: SITE.ico,
    vatID: 'CZ' + SITE.ico,
    areaServed: { '@type': 'Country', name: 'Česká republika' },
    // sameAs propojuje s autoritativními profily — Knowledge Graph entity confidence boost.
    sameAs: [
      SITE.social.instagram,
      SITE.social.facebook,
      'https://www.google.com/maps/search/?api=1&query=Martin+%C5%A0evr+Zlatnick%C3%A1+d%C3%ADlna+Praha',
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '17:00',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Zlatnické služby',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Zakázková tvorba',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Snubní prsteny na míru' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Zásnubní prsteny' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Autorská tvorba' } },
          ],
        },
        {
          '@type': 'OfferCatalog',
          name: 'Hotové šperky skladem',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Stříbrné prsteny s kameny' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Přívěsky a řetízky' } },
          ],
        },
        {
          '@type': 'OfferCatalog',
          name: 'Opravy a úpravy',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Zmenšení a zvětšení velikosti' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Rytí a personalizace' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Oprava ulomených částí' } },
          ],
        },
      ],
    },
  };
}

/** Zpětná kompatibilita — některé komponenty mohou stále importovat localBusinessSchema. */
export const localBusinessSchema = jewelryStoreSchema;

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE.url}#website`,
    name: SITE.name,
    url: SITE.url,
    publisher: { '@id': `${SITE.url}#business` },
    inLanguage: 'cs-CZ',
    // speakable = AEO signál pro Google Assistant / Siri / Alexa. Vybírá nadpisy + leady.
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'h2', '.subtitle', '.label-dot'],
    },
  };
}

// --- Merchant Listing requirements (Google od 2024) --------------------------
// Bez nich Product nedostane Merchant Listing rich result (zobrazení s cenou, dostupností,
// hodnocením přímo v SERP). Validace v Google Rich Results Test → Merchant Listing.
//
// DŮLEŽITÉ: tyto objekty jsou inline (bez @id) — Google's Merchant Listing parser
// nedereferencuje @id reference v offers spolehlivě (GSC warning "Missing field
// shippingDetails (in offers)"). Inline je 100% kompatibilní.

/** Vratky do 14 dní (česká legislativa § 1829 OZ — odstoupení od smlouvy do 14 dní).
 *  Zákazník hradí poštovné při vrácení. */
function merchantReturnPolicy() {
  return {
    '@type': 'MerchantReturnPolicy',
    applicableCountry: 'CZ',
    returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
    merchantReturnDays: 14,
    returnMethod: 'https://schema.org/ReturnByMail',
    returnFees: 'https://schema.org/ReturnShippingFees',
  };
}

/** Doručení po ČR — Česká pošta / Zásilkovna. */
function shippingDetailsCZ() {
  return {
    '@type': 'OfferShippingDetails',
    shippingDestination: {
      '@type': 'DefinedRegion',
      addressCountry: 'CZ',
    },
    shippingRate: {
      '@type': 'MonetaryAmount',
      value: 149,
      currency: 'CZK',
    },
    deliveryTime: {
      '@type': 'ShippingDeliveryTime',
      handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 2, unitCode: 'DAY' },
      transitTime:  { '@type': 'QuantitativeValue', minValue: 1, maxValue: 3, unitCode: 'DAY' },
    },
  };
}

export function homeGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [jewelryStoreSchema(), personSchema(), websiteSchema()],
  };
}

/**
 * Graph pro Product detail stránky — Product + Breadcrumb + business/person.
 * MerchantReturnPolicy a OfferShippingDetails jsou inline v každém offeru
 * (Googlův Merchant Listing parser nedereferencuje @id spolehlivě).
 */
export function productPageGraph(productNode: Record<string, unknown>, breadcrumb: Record<string, unknown>) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      productNode,
      breadcrumb,
      jewelryStoreSchema(),
      personSchema(),
    ],
  };
}

// --- Produkty ----------------------------------------------------------------

function parsePrice(price: string): number {
  return parseInt(price.replace(/[^\d]/g, ''), 10) || 0;
}

/** Parse "3,14 g" → 3.14 (číslo v gramech). */
function parseWeightGrams(weight: string | undefined): number | null {
  if (!weight) return null;
  const normalized = weight.replace(',', '.').replace(/[^\d.]/g, '');
  const value = parseFloat(normalized);
  return isNaN(value) ? null : value;
}

const categoryLabels: Record<Product['category'], string> = {
  prsteny: 'Prsten',
  nausnice: 'Náušnice',
  privesky: 'Přívěsek',
  retizky: 'Řetízek',
  sady: 'Sada šperků',
};

/** Klíčová slova z materiálu — "Stříbro 925/1000, ametyst" → ["Stříbro 925/1000", "ametyst"]. */
function materialKeywords(material: string): string[] {
  return material.split(/[,·]/).map((s) => s.trim()).filter(Boolean);
}

type ProductLocale = 'cs' | 'en';

const categoryLabelsEn: Record<Product['category'], string> = {
  prsteny: 'Ring',
  nausnice: 'Earrings',
  privesky: 'Pendant',
  retizky: 'Chain',
  sady: 'Jewellery set',
};

export function productSchema(product: Product, locale: ProductLocale = 'cs') {
  const isEn = locale === 'en';
  const slugForUrl = isEn && product.slugEn ? product.slugEn : product.slug;
  const detailUrlPath = isEn ? `/en/jewelry/${slugForUrl}/` : `/sperky/${product.slug}/`;

  const title = isEn && product.titleEn ? product.titleEn : product.title;
  const description = isEn && product.descriptionEn ? product.descriptionEn : product.description;
  const material = isEn && product.materialEn ? product.materialEn : product.material;
  const size = isEn && product.sizeEn ? product.sizeEn : product.size;
  const priceSilverDisplay = isEn && product.priceSilverEn ? product.priceSilverEn : product.priceSilver;
  const priceGoldDisplay = isEn && product.priceGoldEn ? product.priceGoldEn : product.priceGold;
  const sizeLabel = isEn ? 'Size' : 'Velikost';
  const countryName = isEn ? 'Czechia' : 'Česká republika';
  const handmadeKw = isEn ? 'handmade' : 'ruční výroba';
  const cityKw = isEn ? 'Prague' : 'Praha';
  const categoryLabelLocalized = isEn ? categoryLabelsEn[product.category] : categoryLabels[product.category];

  // Merchant Listing requirements (Google od 2024) — INLINE objekty, ne @id reference.
  // Google's parser někdy nedereferencuje @id, takže má GSC warning "Missing field shippingDetails".
  // Vyprodaný kus → SoldOut (nastavit `sold: true` v products.ts, stránku nemazat —
  // SoldOut Product schema si drží SERP historii a může konvertovat na poptávku zlaté verze).
  const silverAvailability = product.sold
    ? 'https://schema.org/SoldOut'
    : 'https://schema.org/InStock';

  const offers: Record<string, unknown>[] = [
    {
      '@type': 'Offer',
      price: parsePrice(priceSilverDisplay),
      priceCurrency: 'CZK',
      availability: silverAvailability,
      itemCondition: 'https://schema.org/NewCondition',
      url: `${SITE.url}${detailUrlPath}`,
      seller: { '@id': `${SITE.url}#business` },
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      hasMerchantReturnPolicy: merchantReturnPolicy(),
      shippingDetails: shippingDetailsCZ(),
    },
  ];

  if (priceGoldDisplay) {
    offers.push({
      '@type': 'Offer',
      price: parsePrice(priceGoldDisplay),
      priceCurrency: 'CZK',
      availability: 'https://schema.org/PreOrder',
      itemCondition: 'https://schema.org/NewCondition',
      url: `${SITE.url}${detailUrlPath}`,
      seller: { '@id': `${SITE.url}#business` },
      deliveryLeadTime: { '@type': 'QuantitativeValue', value: 3, unitText: 'weeks' },
      hasMerchantReturnPolicy: merchantReturnPolicy(),
      shippingDetails: shippingDetailsCZ(),
    });
  }

  const silverWeight = parseWeightGrams(product.weightSilver);
  const keywords = [
    categoryLabelLocalized,
    ...materialKeywords(material),
    handmadeKw,
    cityKw,
  ].join(', ');

  const additionalProperty: Record<string, unknown>[] = [];
  if (size) {
    additionalProperty.push({
      '@type': 'PropertyValue',
      name: sizeLabel,
      value: size,
    });
  }

  const schema: Record<string, unknown> = {
    '@type': 'Product',
    '@id': `${SITE.url}${detailUrlPath}#product`,
    name: title,
    sku: product.slug,
    mpn: product.slug,
    description,
    image: `${SITE.url}${product.image}`,
    offers,
    material,
    category: categoryLabelLocalized,
    keywords,
    brand: { '@type': 'Brand', name: SITE.shortName },
    manufacturer: { '@id': `${SITE.url}#person` },
    countryOfOrigin: { '@type': 'Country', name: countryName },
    audience: { '@type': 'PeopleAudience', suggestedMinAge: 16 },
    isFamilyFriendly: true,
    inLanguage: isEn ? 'en-GB' : 'cs-CZ',
  };

  if (silverWeight !== null) {
    schema.weight = {
      '@type': 'QuantitativeValue',
      value: silverWeight,
      unitCode: 'GRM',
    };
  }

  if (additionalProperty.length > 0) {
    schema.additionalProperty = additionalProperty;
  }

  return schema;
}

// --- Stránky -----------------------------------------------------------------

export function contactPageSchema() {
  return {
    '@type': 'ContactPage',
    '@id': `${SITE.url}/kontakt/#page`,
    name: 'Kontakt — ' + SITE.shortName,
    url: `${SITE.url}/kontakt/`,
    inLanguage: 'cs-CZ',
    isPartOf: { '@id': `${SITE.url}#website` },
    mainEntity: { '@id': `${SITE.url}#business` },
  };
}

export function aboutPageSchema() {
  return {
    '@type': 'AboutPage',
    '@id': `${SITE.url}/o-dilne/#page`,
    name: 'O dílně — ' + SITE.shortName,
    url: `${SITE.url}/o-dilne/`,
    inLanguage: 'cs-CZ',
    isPartOf: { '@id': `${SITE.url}#website` },
    about: { '@id': `${SITE.url}#person` },
    mainEntity: { '@id': `${SITE.url}#person` },
  };
}

/** Service schema pro zakázkovou tvorbu. */
export function customJewelryServiceSchema() {
  return {
    '@type': 'Service',
    '@id': `${SITE.url}/zakazkova-tvorba/#service`,
    serviceType: 'Zakázková výroba šperků',
    name: 'Zakázková tvorba šperků na míru',
    description: 'Ruční výroba šperků na míru ze zlata 585/1000 a 750/1000 a stříbra 925/1000. Konzultace, návrh, schválení, výroba. Expresní výroba do 5 pracovních dnů u jednodušších kusů.',
    provider: { '@id': `${SITE.url}#business` },
    areaServed: { '@type': 'Country', name: 'Česká republika' },
    url: `${SITE.url}/zakazkova-tvorba/`,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'CZK',
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: 'CZK',
        description: 'Cena závisí na materiálu, kameni a složitosti. Konzultace zdarma.',
      },
    },
  };
}

/** Service schema pro opravy šperků — cílí na „opravy šperků praha", „oprava prstenu". */
export function jewelryRepairServiceSchema() {
  return {
    '@type': 'Service',
    '@id': `${SITE.url}/opravy-sperku-praha/#service`,
    serviceType: 'Opravy a úpravy šperků',
    name: 'Opravy šperků Praha — zlatnická dílna Pod Kesnerkou',
    description: 'Opravy a úpravy šperků v Praze 5. Zmenšení a zvětšení prstenu, výměna kamenu, rytí, oprava ulomených částí, čištění. 20+ let praxe.',
    provider: { '@id': `${SITE.url}#business` },
    areaServed: [
      { '@type': 'City', name: 'Praha' },
      { '@type': 'Country', name: 'Česká republika' },
    ],
    url: `${SITE.url}/opravy-sperku-praha/`,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Druhy oprav šperků',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Zmenšení nebo zvětšení velikosti prstenu' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Výměna kamenu v prstenu' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Oprava ulomených částí (řetízek, zapínání)' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Rytí a personalizace' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Profesionální čištění šperků' } },
      ],
    },
  };
}

/** Service schema pro snubní a zásnubní prsteny na míru. */
export function weddingRingsServiceSchema() {
  return {
    '@type': 'Service',
    '@id': `${SITE.url}/snubni-prsteny-na-miru/#service`,
    serviceType: 'Zakázková výroba snubních a zásnubních prstenů',
    name: 'Snubní prsteny na míru Praha — ruční výroba',
    description: 'Snubní a zásnubní prsteny na míru z žlutého, bílého nebo růžového zlata 585/1000 a 750/1000. Ruční výroba ve vlastní dílně Pod Kesnerkou v Praze 5.',
    provider: { '@id': `${SITE.url}#business` },
    areaServed: { '@type': 'Country', name: 'Česká republika' },
    url: `${SITE.url}/snubni-prsteny-na-miru/`,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Snubní a zásnubní prsteny',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Snubní prsteny ze žlutého zlata 585/1000' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Snubní prsteny z bílého zlata 750/1000' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Zásnubní prsten s diamantem nebo barevným kamenem' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Tricolor prsten (bílé + žluté + růžové zlato)' } },
      ],
    },
  };
}

// --- Listing pages (CollectionPage + ItemList) -------------------------------

/**
 * CollectionPage + ItemList pro listing stránky (/skladem, /portfolio).
 * Google používá ItemList pro carousel-style rich results v SERP.
 */
export function collectionPageWithItems(opts: {
  pageUrl: string;
  pageName: string;
  pageDescription: string;
  items: { url: string; name: string; image?: string }[];
}) {
  return {
    '@type': 'CollectionPage',
    '@id': `${SITE.url}${opts.pageUrl}#page`,
    name: opts.pageName,
    description: opts.pageDescription,
    url: `${SITE.url}${opts.pageUrl}`,
    inLanguage: 'cs-CZ',
    isPartOf: { '@id': `${SITE.url}#website` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: opts.items.length,
      itemListElement: opts.items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE.url}${item.url}`,
        name: item.name,
        ...(item.image ? { image: `${SITE.url}${item.image}` } : {}),
      })),
    },
  };
}

/** Convenience: ItemList z products[]. */
export function productItemList(products: Product[]) {
  return collectionPageWithItems({
    pageUrl: '/skladem/',
    pageName: 'Hotové šperky skladem',
    pageDescription: 'Stříbrné šperky s přírodními kameny — k vyzvednutí v dílně nebo poštou.',
    items: products.map((p) => ({
      url: `/sperky/${p.slug}/`,
      name: p.title,
      image: p.image,
    })),
  });
}

/** Convenience: ItemList z portfolioCases[]. */
export function portfolioItemList(cases: PortfolioCase[]) {
  return collectionPageWithItems({
    pageUrl: '/portfolio/',
    pageName: 'Portfolio — realizace z dílny',
    pageDescription: 'Příběhy z dílny Martina Ševra — autorská tvorba, snubní a zásnubní prsteny, personalizované kusy.',
    items: cases.map((c) => ({
      url: `/tvorba/${c.slug}/`,
      name: c.title,
      image: c.cardImage,
    })),
  });
}

// --- Pomocníci ---------------------------------------------------------------

/**
 * BreadcrumbList — pomůže Googlu zobrazit breadcrumbs v SERP.
 * items: pole {name, url} v pořadí od root k aktuální stránce.
 */
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE.url}${item.url}`,
    })),
  };
}

/**
 * FAQPage — Google může ukázat otázky v "People also ask" sekci SERP.
 */
export function faqPageSchema(items: { question: string; answer: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

/**
 * Pomocník na slepení více schémat do jednoho @graph.
 */
export function graph(...schemas: Record<string, unknown>[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': schemas,
  };
}
