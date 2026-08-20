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
/* Entita je jedna (sdílené `@id` napříč CZ i EN — viz AEO pravidlo „jedno @id
   pro jednu entitu"), ale její POPIS má být v jazyce stránky. Bez `locale`
   servírovala anglická mutace Googlu `jobTitle: 'Zlatník'` a český
   `description` i `knowsAbout`.
   Default 'cs' musí dávat bajtově identický výstup jako dřív, aby se nehnuly
   stránky, které už rankují nahoře. */
export function personSchema(locale: 'cs' | 'en' = 'cs') {
  const isEn = locale === 'en';
  return {
    '@type': 'Person',
    '@id': `${SITE.url}#person`,
    name: SITE.shortName,
    givenName: 'Martin',
    familyName: 'Ševr',
    jobTitle: isEn ? 'Goldsmith' : 'Zlatník',
    description: isEn
      ? 'Prague goldsmith with over 20 years of experience handcrafting jewellery from gold, silver and natural stones.'
      : 'Pražský zlatník s více než 20 lety praxe v ruční výrobě šperků ze zlata, stříbra a přírodních kamenů.',
    url: isEn ? `${SITE.url}/en/about/` : `${SITE.url}/o-dilne/`,
    image: `${SITE.url}/images/og-default.jpg`,
    worksFor: { '@id': `${SITE.url}#business` },
    knowsAbout: isEn
      ? [
          'Handmade jewellery',
          'Bespoke goldsmithing',
          'Gold 585/1000 and 750/1000',
          'Sterling silver 925/1000',
          'Natural gemstones',
          'Wedding and engagement rings',
          'Jewellery repairs and alterations',
        ]
      : [
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
export function jewelryStoreSchema(locale: 'cs' | 'en' = 'cs') {
  const isEn = locale === 'en';
  return {
    '@type': ['JewelryStore', 'LocalBusiness'],
    '@id': `${SITE.url}#business`,
    name: SITE.name,
    legalName: 'Martin Ševr',
    description: isEn
      ? 'Goldsmith workshop in Prague 5, Smíchov. Handmade bespoke jewellery in gold, silver and natural stones. Every piece an original.'
      : SITE.description,
    url: SITE.url,
    telephone: SITE.phone,
    email: SITE.email,
    address: postalAddress,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 50.058644,
      longitude: 14.403715,
    },
    // hasMap — oficiální share odkaz na Google Business Profile (Zlatnická dílna
    // Martin Ševr) → mapa místa dílny.
    hasMap: 'https://share.google/Nx1Cggph206p7w5Iq',
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
    // GEO: město + čtvrť explicitně — dílna sídlí na Smíchově (Praha 5),
    // lokální dotazy „zlatnictví praha 5 / smíchov" jsou primární akviziční kanál.
    areaServed: isEn
      ? [
          { '@type': 'City', name: 'Prague' },
          { '@type': 'Place', name: 'Smíchov, Prague 5' },
          { '@type': 'Country', name: 'Czech Republic' },
        ]
      : [
          { '@type': 'City', name: 'Praha' },
          { '@type': 'Place', name: 'Smíchov, Praha 5' },
          { '@type': 'Country', name: 'Česká republika' },
        ],
    keywords: isEn
      ? 'goldsmith Prague, jewellery workshop Prague 5, bespoke jewellery Prague, wedding rings Prague, jewellery repair Prague, moldavite ring'
      : 'zlatnictví Praha 5, zlatník Smíchov, šperky na zakázku Praha, snubní prsteny na míru, opravy šperků Praha, prsten s vltavínem',
    // sameAs propojuje s autoritativními profily — Knowledge Graph entity confidence boost.
    // Google Business Profile přes kgmid (stabilní Knowledge Graph entity ID
    // „Zlatnická dílna Martin Ševr") — sváže webovou entitu s GBP entitou.
    sameAs: [
      SITE.social.instagram,
      SITE.social.facebook,
      'https://www.google.com/search?kgmid=/g/11y_qvjx4l',
    ],
    /* `openingHoursSpecification` schválně chybí: dílna nemá pevnou otevírací
       dobu, otevírá se po telefonické dohodě (20. 8. 2026). Schema.org pro
       „jen po domluvě" nemá hodnotu a vymyšlené hodiny jsou horší než žádné —
       Google by je ukazoval ve výsledcích jako závazné. Zdrojem pravdy o
       dostupnosti je Google Business Profile, na který míří `sameAs`. */
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

/**
 * @id uzlu WebSite podle jazyka. EN mutace má vlastní uzel (/en/#website) —
 * jeden sdílený @id se dvěma inLanguage by v Knowledge Graphu tvrdil rozpor.
 */
export function websiteId(locale: 'cs' | 'en' = 'cs'): string {
  return locale === 'en' ? `${SITE.url}/en/#website` : `${SITE.url}#website`;
}

export function websiteSchema(locale: 'cs' | 'en' = 'cs') {
  const isEn = locale === 'en';
  return {
    '@type': 'WebSite',
    '@id': websiteId(locale),
    name: SITE.name,
    url: isEn ? `${SITE.url}/en/` : SITE.url,
    publisher: { '@id': `${SITE.url}#business` },
    inLanguage: isEn ? 'en-GB' : 'cs-CZ',
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
 *  Zákazník si vrácení zařizuje a hradí sám (vlastní podání Českou poštou / Zásilkovnou) →
 *  returnFees = ReturnFeesCustomerResponsibility. POZOR: NEpoužívat ReturnShippingFees —
 *  to Google chápe jako fixní poplatek účtovaný PRODEJCEM a vyžaduje returnShippingFeesAmount
 *  (= GSC warning "Missing field returnShippingFeesAmount"). U CustomerResponsibility se
 *  částka záměrně NEuvádí (149 Kč je odchozí poštovné, ne prodejcem účtovaný vratkový poplatek). */
function merchantReturnPolicy() {
  return {
    '@type': 'MerchantReturnPolicy',
    applicableCountry: 'CZ',
    returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
    merchantReturnDays: 14,
    returnMethod: 'https://schema.org/ReturnByMail',
    returnFees: 'https://schema.org/ReturnFeesCustomerResponsibility',
    returnLabelSource: 'https://schema.org/ReturnLabelCustomerResponsibility',
    refundType: 'https://schema.org/FullRefund',
    itemCondition: 'https://schema.org/NewCondition',
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

export function homeGraph(locale: 'cs' | 'en' = 'cs') {
  return {
    '@context': 'https://schema.org',
    '@graph': [jewelryStoreSchema(locale), personSchema(locale), websiteSchema(locale)],
  };
}

/**
 * Entity uzly (business + person + website) k přidání do @graph KAŽDÉ stránky,
 * jejíž Service/Product/ContactPage odkazuje přes @id na #business/#person/#website.
 * AI answer engines i Google čtou každou URL samostatně — cross-page @id merge
 * není zaručený, takže bez těchto uzlů visí reference „provider/mainEntity" naprázdno
 * a lokální/AEO signál (adresa, geo, otevírací doba) na dané stránce chybí.
 * Použití: `graph(serviceSchema(), ...siteEntities(locale), faqPageSchema(...), breadcrumbSchema(...))`.
 */
export function siteEntities(locale: 'cs' | 'en' = 'cs') {
  return [jewelryStoreSchema(locale), personSchema(locale), websiteSchema(locale)];
}

/**
 * Graph pro Product detail stránky — Product + Breadcrumb + business/person.
 * MerchantReturnPolicy a OfferShippingDetails jsou inline v každém offeru
 * (Googlův Merchant Listing parser nedereferencuje @id spolehlivě).
 */
export function productPageGraph(
  productNode: Record<string, unknown>,
  breadcrumb: Record<string, unknown>,
  locale: 'cs' | 'en' = 'cs',
) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      productNode,
      breadcrumb,
      jewelryStoreSchema(locale),
      personSchema(locale),
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
  // Materiál se láme na klíčová slova po čárkách/tečkách, ale dvě čárky dělicí
  // NEJSOU: desetinná („briliant 0,50 ct", „⌀ 12,8 mm") a čárka uvnitř závorky
  // („(čistota SI1, barva E)") — jinak vzniknou nesmyslné keywords typu
  // „briliant 0" + „50 ct (čistota SI1".
  const parts: string[] = [];
  let current = '';
  let depth = 0;

  for (let i = 0; i < material.length; i++) {
    const ch = material[i];
    if (ch === '(') depth++;
    else if (ch === ')') depth = Math.max(0, depth - 1);

    const isDecimal =
      ch === ',' && /\d/.test(material[i - 1] ?? '') && /\d/.test(material[i + 1] ?? '');

    if ((ch === ',' || ch === '·') && depth === 0 && !isDecimal) {
      parts.push(current);
      current = '';
      continue;
    }
    current += ch;
  }
  parts.push(current);

  return parts.map((s) => s.trim()).filter(Boolean);
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

  // Kus vyrobený jen ve zlatě: zlato NENÍ varianta „na zakázku do 3 týdnů",
  // ale ten konkrétní kus skladem → InStock místo PreOrder a bez leadTime.
  const goldOnly = !priceSilverDisplay && !!priceGoldDisplay;
  const defaultValidUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  // Akční cena s koncem platnosti (products.ts `priceValidUntil`) přebíjí default.
  const priceValidUntil = product.priceValidUntil || defaultValidUntil;

  const offers: Record<string, unknown>[] = [];

  if (priceSilverDisplay) {
    offers.push({
      '@type': 'Offer',
      price: parsePrice(priceSilverDisplay),
      priceCurrency: 'CZK',
      availability: silverAvailability,
      itemCondition: 'https://schema.org/NewCondition',
      url: `${SITE.url}${detailUrlPath}`,
      seller: { '@id': `${SITE.url}#business` },
      priceValidUntil,
      hasMerchantReturnPolicy: merchantReturnPolicy(),
      shippingDetails: shippingDetailsCZ(),
    });
  }

  if (priceGoldDisplay) {
    offers.push({
      '@type': 'Offer',
      price: parsePrice(priceGoldDisplay),
      priceCurrency: 'CZK',
      availability: goldOnly ? silverAvailability : 'https://schema.org/PreOrder',
      itemCondition: 'https://schema.org/NewCondition',
      url: `${SITE.url}${detailUrlPath}`,
      seller: { '@id': `${SITE.url}#business` },
      priceValidUntil,
      ...(goldOnly ? {} : { deliveryLeadTime: { '@type': 'QuantitativeValue', value: 3, unitText: 'weeks' } }),
      hasMerchantReturnPolicy: merchantReturnPolicy(),
      shippingDetails: shippingDetailsCZ(),
    });
  }

  const silverWeight = parseWeightGrams(product.weightSilver ?? product.weightGold);
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
    // Pole = hlavní fotka + detailní záběry. Víc obrázků = bohatší Product rich
    // result i lepší podklad pro AI (Google preferuje 1:1, 4:3, 16:9 varianty).
    image: [
      `${SITE.url}${product.image}`,
      ...(product.detailImages?.map((d) => `${SITE.url}${d.src}`) ?? []),
    ],
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

  // Recenze — POUZE reálná zákaznická hodnocení (viz ProductReview v products.ts).
  // Stejná data se renderují viditelně na stránce — Google vyžaduje parity
  // markup ↔ obsah. S vyplněnými recenzemi zmizí GSC doporučení
  // „Missing field review / aggregateRating".
  if (product.reviews && product.reviews.length > 0) {
    const ratings = product.reviews.map((r) => r.rating);
    schema.review = product.reviews.map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.author },
      datePublished: r.date,
      reviewBody: isEn ? r.textEn || r.text : r.text,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
    }));
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: Number((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)),
      reviewCount: ratings.length,
      bestRating: 5,
      worstRating: 1,
    };
  }

  if (additionalProperty.length > 0) {
    schema.additionalProperty = additionalProperty;
  }

  return schema;
}

// --- Stránky -----------------------------------------------------------------

export function contactPageSchema(locale: 'cs' | 'en' = 'cs') {
  const isEn = locale === 'en';
  const pageUrl = isEn ? `${SITE.url}/en/contact/` : `${SITE.url}/kontakt/`;
  return {
    '@type': 'ContactPage',
    '@id': `${pageUrl}#page`,
    name: (isEn ? 'Contact: ' : 'Kontakt: ') + SITE.shortName,
    url: pageUrl,
    inLanguage: isEn ? 'en-GB' : 'cs-CZ',
    isPartOf: { '@id': websiteId(locale) },
    mainEntity: { '@id': `${SITE.url}#business` },
  };
}

export function aboutPageSchema(locale: 'cs' | 'en' = 'cs') {
  const isEn = locale === 'en';
  const pageUrl = isEn ? `${SITE.url}/en/about/` : `${SITE.url}/o-dilne/`;
  return {
    '@type': 'AboutPage',
    '@id': `${pageUrl}#page`,
    name: (isEn ? 'About the workshop: ' : 'O dílně: ') + SITE.shortName,
    url: pageUrl,
    inLanguage: isEn ? 'en-GB' : 'cs-CZ',
    isPartOf: { '@id': websiteId(locale) },
    about: { '@id': `${SITE.url}#person` },
    mainEntity: { '@id': `${SITE.url}#person` },
  };
}

/** Service schema pro zakázkovou tvorbu (CS i EN varianta stránky). */
export function customJewelryServiceSchema(locale: 'cs' | 'en' = 'cs') {
  const isEn = locale === 'en';
  const pageUrl = isEn ? `${SITE.url}/en/custom-jewelry/` : `${SITE.url}/zakazkova-tvorba/`;
  return {
    '@type': 'Service',
    '@id': `${pageUrl}#service`,
    serviceType: isEn ? 'Custom jewellery making' : 'Zakázková výroba šperků',
    name: isEn ? 'Custom jewellery made to order' : 'Zakázková tvorba šperků na míru',
    description: isEn
      ? 'Handcrafted jewellery made to order from 585/1000 and 750/1000 gold and 925/1000 silver. Consultation, design, approval, making. Express making within 5 business days for simpler pieces.'
      : 'Ruční výroba šperků na míru ze zlata 585/1000 a 750/1000 a stříbra 925/1000. Konzultace, návrh, schválení, výroba. Expresní výroba do 5 pracovních dnů u jednodušších kusů.',
    provider: { '@id': `${SITE.url}#business` },
    areaServed: [
      { '@type': 'City', name: isEn ? 'Prague' : 'Praha' },
      { '@type': 'Place', name: isEn ? 'Smíchov, Prague 5' : 'Smíchov, Praha 5' },
      { '@type': 'Country', name: isEn ? 'Czechia' : 'Česká republika' },
    ],
    url: pageUrl,
    inLanguage: isEn ? 'en-GB' : 'cs-CZ',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'CZK',
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: 'CZK',
        minPrice: 2500,
        description: isEn
          ? 'Silver from CZK 2,500, gold from CZK 8,000. The price depends on the material, the stone and complexity. Consultation is free.'
          : 'Stříbro od 2 500 Kč, zlato od 8 000 Kč. Cena závisí na materiálu, kameni a složitosti. Konzultace zdarma.',
      },
    },
  };
}

/** Service schema pro opravy šperků — cílí na „opravy šperků praha", „oprava prstenu" / „jewelry repair prague". */
export function jewelryRepairServiceSchema(locale: 'cs' | 'en' = 'cs') {
  const isEn = locale === 'en';
  const pageUrl = isEn ? `${SITE.url}/en/jewelry-repair/` : `${SITE.url}/opravy-sperku-praha/`;
  return {
    '@type': 'Service',
    '@id': `${pageUrl}#service`,
    serviceType: isEn ? 'Jewellery repair and alteration' : 'Opravy a úpravy šperků',
    name: isEn
      ? 'Jewellery repair Prague, goldsmith workshop Pod Kesnerkou'
      : 'Opravy šperků Praha, zlatnická dílna Pod Kesnerkou',
    description: isEn
      ? 'Jewellery repairs and alterations in Prague 5. Ring resizing up or down, stone replacement, engraving, repair of broken parts, cleaning. 20+ years of practice.'
      : 'Opravy a úpravy šperků v Praze 5. Zmenšení a zvětšení prstenu, výměna kamenu, rytí, oprava ulomených částí, čištění. 20+ let praxe.',
    provider: { '@id': `${SITE.url}#business` },
    areaServed: [
      { '@type': 'City', name: isEn ? 'Prague' : 'Praha' },
      { '@type': 'Place', name: isEn ? 'Smíchov, Prague 5' : 'Smíchov, Praha 5' },
      { '@type': 'Country', name: isEn ? 'Czechia' : 'Česká republika' },
    ],
    url: pageUrl,
    inLanguage: isEn ? 'en-GB' : 'cs-CZ',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'CZK',
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: 'CZK',
        minPrice: 300,
        description: isEn
          ? 'Chain repair from CZK 300, ring resizing CZK 400–900, stone replacement from CZK 600. Exact price after inspection. Most repairs within 5 working days.'
          : 'Oprava řetízku od 300 Kč, zmenšení nebo zvětšení prstenu 400–900 Kč, výměna kamenu od 600 Kč. Přesná cena po prohlídce. Většina oprav do 5 pracovních dnů.',
      },
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Druhy oprav šperků',
      itemListElement: (isEn
        ? [
            'Ring resizing, up or down',
            'Stone replacement in a ring',
            'Repair of broken parts (chain, clasp)',
            'Engraving and personalisation',
            'Professional jewellery cleaning',
          ]
        : [
            'Zmenšení nebo zvětšení velikosti prstenu',
            'Výměna kamenu v prstenu',
            'Oprava ulomených částí (řetízek, zapínání)',
            'Rytí a personalizace',
            'Profesionální čištění šperků',
          ]
      ).map((name) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })),
    },
  };
}

/**
 * Service schema pro čištění a leštění šperků (CS i EN varianta stránky).
 * Samostatný uzel, ne součást #service u oprav — čištění je vlastní vyhledávací
 * intent („čištění šperků" 227 zobrazení/měsíc) a potřebuje vlastní @id.
 */
export function jewelryCleaningServiceSchema(locale: 'cs' | 'en' = 'cs') {
  const isEn = locale === 'en';
  const pageUrl = isEn ? `${SITE.url}/en/jewelry-cleaning/` : `${SITE.url}/cisteni-sperku/`;
  return {
    '@type': 'Service',
    '@id': `${pageUrl}#service`,
    serviceType: isEn ? 'Jewellery cleaning and polishing' : 'Čištění a leštění šperků',
    name: isEn
      ? 'Professional jewellery cleaning Prague, goldsmith workshop Pod Kesnerkou'
      : 'Profesionální čištění šperků Praha, zlatnická dílna Pod Kesnerkou',
    description: isEn
      ? 'Ultrasonic cleaning and polishing of gold and silver jewellery in Prague 5, Smíchov. Deposits under stones, tarnished silver, dull surfaces. Usually while you wait.'
      : 'Ultrazvukové čištění a leštění zlatých i stříbrných šperků v Praze 5 na Smíchově. Usazeniny pod kameny, zčernalé stříbro, matný povrch. Většinou na počkání.',
    provider: { '@id': `${SITE.url}#business` },
    areaServed: [
      { '@type': 'City', name: isEn ? 'Prague' : 'Praha' },
      { '@type': 'Place', name: isEn ? 'Smíchov, Prague 5' : 'Smíchov, Praha 5' },
      { '@type': 'Country', name: isEn ? 'Czechia' : 'Česká republika' },
    ],
    url: pageUrl,
    inLanguage: isEn ? 'en-GB' : 'cs-CZ',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: isEn ? 'Jewellery cleaning and care' : 'Čištění a údržba šperků',
      itemListElement: (isEn
        ? [
            'Ultrasonic jewellery cleaning',
            'Gold and silver polishing',
            'Removing tarnish from silver',
            'Checking stone settings',
          ]
        : [
            'Ultrazvukové čištění šperků',
            'Leštění zlata a stříbra',
            'Odstranění zčernalého stříbra',
            'Kontrola uchycení kamenů',
          ]
      ).map((name) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })),
    },
  };
}

/** Service schema pro snubní a zásnubní prsteny na míru (CS i EN varianta stránky). */
export function weddingRingsServiceSchema(locale: 'cs' | 'en' = 'cs') {
  const isEn = locale === 'en';
  const pageUrl = isEn ? `${SITE.url}/en/wedding-rings/` : `${SITE.url}/snubni-prsteny-na-miru/`;
  return {
    '@type': 'Service',
    '@id': `${pageUrl}#service`,
    serviceType: isEn
      ? 'Custom-made wedding and engagement rings'
      : 'Zakázková výroba snubních a zásnubních prstenů',
    name: isEn
      ? 'Custom wedding rings Prague, handcrafted'
      : 'Snubní prsteny na míru Praha, ruční výroba',
    description: isEn
      ? 'Custom wedding and engagement rings in yellow, white or rose gold, 585/1000 and 750/1000. Handcrafted in my own workshop at Pod Kesnerkou, Prague 5.'
      : 'Snubní a zásnubní prsteny na míru z žlutého, bílého nebo růžového zlata 585/1000 a 750/1000. Ruční výroba ve vlastní dílně Pod Kesnerkou v Praze 5.',
    provider: { '@id': `${SITE.url}#business` },
    areaServed: [
      { '@type': 'City', name: isEn ? 'Prague' : 'Praha' },
      { '@type': 'Place', name: isEn ? 'Smíchov, Prague 5' : 'Smíchov, Praha 5' },
      { '@type': 'Country', name: isEn ? 'Czechia' : 'Česká republika' },
    ],
    url: pageUrl,
    inLanguage: isEn ? 'en-GB' : 'cs-CZ',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'CZK',
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: 'CZK',
        minPrice: 18000,
        description: isEn
          ? 'Wedding bands from CZK 18,000 per pair (585/1000 gold). Delivery 4–8 weeks.'
          : 'Snubní prsteny od 18 000 Kč za pár (zlato 585/1000). Termín výroby 4–8 týdnů.',
      },
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: isEn ? 'Wedding and engagement rings' : 'Snubní a zásnubní prsteny',
      itemListElement: (isEn
        ? [
            'Yellow gold wedding rings, 585/1000',
            'White gold wedding rings, 750/1000',
            'Engagement ring with a diamond or coloured stone',
            'Tricolour ring (white + yellow + rose gold)',
          ]
        : [
            'Snubní prsteny ze žlutého zlata 585/1000',
            'Snubní prsteny z bílého zlata 750/1000',
            'Zásnubní prsten s diamantem nebo barevným kamenem',
            'Tricolor prsten (bílé + žluté + růžové zlato)',
          ]
      ).map((name) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })),
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
  locale?: 'cs' | 'en';
}) {
  const locale = opts.locale ?? 'cs';
  return {
    '@type': 'CollectionPage',
    '@id': `${SITE.url}${opts.pageUrl}#page`,
    name: opts.pageName,
    description: opts.pageDescription,
    url: `${SITE.url}${opts.pageUrl}`,
    inLanguage: locale === 'en' ? 'en-GB' : 'cs-CZ',
    isPartOf: { '@id': websiteId(locale) },
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

/** Convenience: ItemList z products[] (CS /skladem/ i EN /en/in-stock/). */
export function productItemList(products: Product[], locale: 'cs' | 'en' = 'cs') {
  const isEn = locale === 'en';
  return collectionPageWithItems({
    locale,
    pageUrl: isEn ? '/en/in-stock/' : '/skladem/',
    pageName: isEn ? 'Jewellery in stock' : 'Hotové šperky skladem',
    pageDescription: isEn
      ? 'Handmade silver and gold jewellery with natural stones, ready to collect at the workshop or shipped.'
      : 'Hotové stříbrné i zlaté šperky s přírodními kameny, k vyzvednutí v dílně nebo poštou.',
    items: products.map((p) => ({
      url: isEn ? `/en/jewelry/${p.slugEn || p.slug}/` : `/sperky/${p.slug}/`,
      name: isEn ? p.titleEn || p.title : p.title,
      image: p.image,
    })),
  });
}

/** Convenience: ItemList z portfolioCases[] (CS /portfolio/ i EN /en/portfolio/). */
export function portfolioItemList(cases: PortfolioCase[], locale: 'cs' | 'en' = 'cs') {
  const isEn = locale === 'en';
  return collectionPageWithItems({
    locale,
    pageUrl: isEn ? '/en/portfolio/' : '/portfolio/',
    pageName: isEn ? 'Portfolio: commissions from the workshop' : 'Portfolio: realizace z dílny',
    pageDescription: isEn
      ? "Stories from Martin Ševr's workshop: signature pieces, wedding and engagement rings, personalised commissions."
      : 'Příběhy z dílny Martina Ševra: autorská tvorba, snubní a zásnubní prsteny, personalizované kusy.',
    items: cases.map((c) => ({
      url: isEn ? `/en/work/${c.slugEn || c.slug}/` : `/tvorba/${c.slug}/`,
      name: isEn ? c.titleEn || c.title : c.title,
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
