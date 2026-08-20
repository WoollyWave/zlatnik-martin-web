/**
 * Recenze o DÍLNĚ, přebrané z Firemního profilu Google (4,9 ★ z 27 hodnocení,
 * stav 20. 8. 2026).
 *
 * Nezaměňovat s `ProductReview` v products.ts — ta popisuje konkrétní šperk
 * a jde do Product JSON-LD. Tyhle mluví o firmě jako celku a do strukturovaných
 * dat NEJDOU (viz níž).
 *
 * PRAVIDLA, KTERÁ SE NESMÍ PORUŠIT
 *
 * 1. Text se přebírá DOSLOVA, včetně překlepů a interpunkce. Zkracovat lze jen
 *    výpustkou `[…]` bez změny významu. Úprava znění recenze je podle přílohy
 *    č. 1 písm. z) zákona č. 634/1992 Sb. vždy klamavá obchodní praktika.
 * 2. Jméno se uvádí zkráceně (`Tereza S.`), pokud recenzent nedal výslovný
 *    souhlas s uvedením celého jména — `consent: 'explicit'`. Google Brand
 *    Resource Center: „You must get consent from the reviewer if you want to
 *    use customer reviews on your website."
 * 3. Žádné `aggregateRating` ani `review` v JSON-LD. Google od 2019 ignoruje
 *    self-serving recenze o vlastní firmě v LocalBusiness/Organization markupu
 *    a od 7/2026 to má v pokynech explicitně. Přínos nula, riziko nenulové.
 * 4. Nikdy nepřidávat vymyšlenou recenzi. Z homepage už jednou letěla smyšlená
 *    reference („Helena Novotná") a bylo to správně.
 * 5. Když recenzent požádá o stažení, jde ven — smazat záznam, rebuild, FTP.
 *
 * Datum je jen měsíc a rok: administrace Googlu ukazuje relativní stáří
 * („před 9 týdny"), přesný den z ní nevyčteme a předstírat přesnost nebudeme.
 */
export interface BusinessReview {
  /** Jméno tak, jak se zobrazí. Celé jen při `consent: 'explicit'`. */
  author: string;
  /** Hodnocení 1–5. Všechny přebrané jsou 5, na profilu jsou i nižší. */
  rating: 1 | 2 | 3 | 4 | 5;
  /** Doslovné znění z Googlu. NIKDY needitovat. */
  text: string;
  /** Překlad pro anglickou mutaci. Komponenta ho označí jako překlad. */
  textEn: string;
  /** Měsíc publikace, `YYYY-MM`. */
  date: string;
  /** Služba, které se recenze týká — řídí, na které stránce se zobrazí. */
  service: 'snubni-prsteny' | 'zakazkova-tvorba' | 'oprava' | 'cisteni' | 'expres';
  /** `explicit` = recenzent výslovně svolil s celým jménem. */
  consent: 'explicit' | 'none';
  /** Výběr na homepage a kontakt. */
  featured?: boolean;
}

export const reviews: BusinessReview[] = [
  {
    // Souhlas s uvedením celého jména získán 20. 8. 2026.
    author: 'David Soukup',
    rating: 5,
    text:
      'Nechávali jsme si zde vyrábět snubní prsteny i pečetní prsteny na zakázku s vlastním rodovým znakem a s výsledkem jsme maximálně spokojeni. Od první komunikace, přes návrhy a konzultace až po samotnou výrobu proběhlo vše naprosto profesionálně. Oceňujeme ochotu, precizní zpracování detailů a individuální přístup během celého procesu.',
    textEn:
      'We had our wedding rings and signet rings made here to order, with our own family crest, and we could not be happier with the result. From the first contact through the designs and consultations to the making itself, everything was completely professional. We appreciate the willingness, the precise attention to detail and the individual approach throughout.',
    date: '2026-06',
    service: 'snubni-prsteny',
    consent: 'explicit',
    featured: true,
  },
  {
    author: 'Tereza S.',
    rating: 5,
    text:
      'Velmi šikovný zlatník, vyrobil nám s manželem snubní prsteny, mně i zásnubní prsten, určitě doporučuji... Všechny šperky od nějakou nádherné!',
    textEn:
      'A very skilled goldsmith — he made wedding rings for my husband and me, and an engagement ring for me. I can definitely recommend him. All the pieces from him are beautiful.',
    date: '2026-05',
    service: 'snubni-prsteny',
    consent: 'none',
  },
  {
    author: 'Yana G.',
    rating: 5,
    text:
      'Mohu jen vřele doporučit! Jsem maximálně spokojená a jsem přesvědčená, že lepšího zlatníka v Praze jen tak nenajdete. Oceňuji především precizní zpracování, rychlost, skvělou komunikaci a velmi příznivé ceny. Dokáže využít i vaše staré zlato a proměnit ho v úplně nový, nádherný šperk přesně podle vašich představ.',
    textEn:
      'I can only warmly recommend him. I am completely satisfied and convinced you will not easily find a better goldsmith in Prague. Above all I value the precise workmanship, the speed, the excellent communication and very fair prices. He can also take your old gold and turn it into an entirely new, beautiful piece exactly as you imagine it.',
    date: '2026-07',
    service: 'zakazkova-tvorba',
    consent: 'none',
    featured: true,
  },
  {
    author: 'Bety J.',
    rating: 5,
    text:
      'Sikovny pan zlatnik vyhotovil ztraceny kus z paru, kdyz jsem ztratila svou nejoblibenejsi nausnici! Nadherna prace, hladka domluva, rychle hotovo. Doporucuji!',
    textEn:
      'The goldsmith made the missing half of a pair after I lost my favourite earring. Beautiful work, easy to arrange, done quickly. Recommended.',
    date: '2026-05',
    service: 'oprava',
    consent: 'none',
  },
  {
    author: 'Barbora H.',
    rating: 5,
    text:
      'Skvělá komunikace, rychlá a krásná práce. Nechala jsem si upravit a vyčistit náušnice po babičce. Hotovo do druhého dne.',
    textEn:
      'Great communication, quick and beautiful work. I had my grandmother’s earrings altered and cleaned. Done by the next day.',
    date: '2026-07',
    service: 'cisteni',
    consent: 'none',
  },
  {
    author: 'Pepa K.',
    rating: 5,
    text:
      'Potřeboval jsem ve velmi krátkém termínu vyrobit šperk, a pan Martin se tohoto úkolu zhostil skvěle - od počátečního návrhu až po předání hotového kusu šlo všechno hladce. Až budu potřebovat další, vím, kam se obrátit.',
    textEn:
      'I needed a piece made at very short notice and Martin handled it superbly — from the first sketch to handing over the finished piece, everything went smoothly. When I need another, I know where to go.',
    date: '2026-06',
    service: 'expres',
    consent: 'none',
    featured: true,
  },
];

/** Recenze k dané službě, v pořadí od nejnovější. */
export function reviewsFor(service: BusinessReview['service']): BusinessReview[] {
  return reviews.filter((r) => r.service === service).sort((a, b) => b.date.localeCompare(a.date));
}

/** Výběr na homepage a kontakt. */
export const featuredReviews = reviews.filter((r) => r.featured);

/**
 * Souhrn z Firemního profilu Google, ověřeno 20. 8. 2026. Ručně udržované —
 * automatické čtení přes Places API zakazuje §3.2.3 jeho smluvních podmínek
 * (text recenzí se nesmí ukládat, trvale lze jen `place_id`).
 * Při aktualizaci změnit i `summaryAsOf`.
 */
export const reviewSummary = {
  ratingValue: 4.9,
  reviewCount: 27,
  /** Měsíc a rok, ke kterému souhrn platí — uvádí se u čísel na webu. */
  summaryAsOf: '2026-08',
  profileUrl: 'https://share.google/Nx1Cggph206p7w5Iq',
} as const;
