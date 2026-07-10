export interface PortfolioCase {
  slug: string;
  title: string;
  category: 'autorska-tvorba' | 'snubni-prsteny' | 'zasnubni-prsteny' | 'personalizovane';
  material: string;
  priceLabel: string;

  cardImage: string;
  cardImage2x: string;
  cardAlt: string;
  cardLead: string;

  perex: string;
  intro: string;
  heroImage: string;
  heroImage2x: string;
  heroAlt: string;

  processSteps: {
    number: string;
    title: string;
    description: string;
  }[];

  gallery: {
    src: string;
    src2x?: string;
    alt: string;
    caption?: string;
    altEn?: string;
    captionEn?: string;
  }[];

  ctaText: string;
  ctaHref: string;

  // --- English variants ---
  slugEn?: string;
  titleEn?: string;
  materialEn?: string;
  priceLabelEn?: string;
  cardAltEn?: string;
  cardLeadEn?: string;
  perexEn?: string;
  introEn?: string;
  heroAltEn?: string;
  processStepsEn?: {
    number: string;
    title: string;
    description: string;
  }[];
  ctaTextEn?: string;
}

export const portfolioCases: PortfolioCase[] = [
  {
    slug: 'vltavin-jediny-original',
    title: 'Vltavín, jediný originál',
    category: 'autorska-tvorba',
    material: 'Stříbro 925/1000, surový vltavín',
    priceLabel: '13 000 Kč',

    cardImage: '/images/portfolio--vltavin--card.webp',
    cardImage2x: '/images/portfolio--vltavin--card@2x.webp',
    cardAlt: 'Autorský stříbrný prsten s surovým vltavínem',
    cardLead: 'Surový vltavín z Čech, zasazený do ručně tepaného stříbra. Voskový model: autorský kus, jediný svého druhu.',

    perex: 'Autorská tvorba · Stříbro 925/1000 · 13 000 Kč',
    intro: 'Tenhle prsten jsem vyřezával z vosku přímo na tvar tohohle vltavínu. Kámen si určuje formu, ne já. Povrch je po obvodu ručně tepaný, kov nese stopy práce. Jakmile prsten prodám, druhý takový nebude. Pro variantu ve zlatě bych potřeboval nový vltavín, a ty se v životě dva stejné nepotkáte.',
    heroImage: '/skladem/14.webp',
    heroImage2x: '/skladem/14.webp',
    heroAlt: 'Autorský prsten s vltavínem, hlavní pohled',

    processSteps: [
      { number: '01', title: 'Výběr kamene',         description: 'Vltavín přichází jako surový kus tektitu, vesmírného skla, které dopadlo na zem před 15 miliony lety. Každý má jiný tvar, žilkování, barvu.' },
      { number: '02', title: 'Voskový model',        description: 'Voskový model vyřezávám volně, přímo podle tvaru kamene. Žádná předpřipravená forma. Vosk se přizpůsobuje vltavínu, ne naopak.' },
      { number: '03', title: 'Odlití a opracování', description: 'Voskový model odliju metodou ztraceného vosku, odstředivou silou do stříbra. Pak začíná to nejpracnější: odříznout nalitkový kanál, opilovat přebytek materiálu, projet kov smirkem od hrubého po nejjemnější, doladit lůžko pro kámen (vltavín se s kovem odlévat nedá, je příliš křehký) a vyleštit. Je to nejšpinavější část zlatnické práce, ale taky ta, která rozhoduje, jestli šperk vypadá odlitý, nebo opravdu vyrobený.' },
      { number: '04', title: 'Zasazení',             description: 'Kámen se v každém šperku zasazuje jinak: do hladka, do krapen, do drážek nebo do lůžka. U tohoto prstenu jsem stříbro zatlačil přímo do pórů a přirozených prasklin vltavínu. Kámen drží sám sebe, bez krapen, bez pájení. Funguje to jen u kamenů s nepravidelným povrchem, jako je tento.' },
    ],

    gallery: [
      { src: '/skladem/14.webp',   alt: 'Vltavín originál, hlavní pohled', altEn: 'Moldavite original, main view' },
      { src: '/skladem/14.1.webp', alt: 'Vltavín originál, bok',           altEn: 'Moldavite original, side view' },
      { src: '/skladem/14.2.webp', alt: 'Vltavín originál, detail kamene', altEn: 'Moldavite original, close-up of the stone' },
      { src: '/skladem/14.3.webp', alt: 'Vltavín originál, alternativní úhel', altEn: 'Moldavite original, alternative angle' },
      { src: '/skladem/14.4.webp', alt: 'Vltavín originál, další úhel',    altEn: 'Moldavite original, another angle' },
    ],

    ctaText: 'Chcete podobný kus na vašem kameni? Domluvíme se.',
    ctaHref: '/kontakt/',

    slugEn: 'one-of-a-kind-moldavite-ring',
    titleEn: 'Moldavite, one of a kind',
    materialEn: 'Sterling silver 925/1000, raw moldavite',
    priceLabelEn: 'CZK 13,000',
    cardAltEn: 'A signature sterling silver ring with raw moldavite',
    cardLeadEn: 'Raw moldavite from Bohemia, set in hand-forged silver. Modelled in wax: a signature piece, the only one of its kind.',
    perexEn: 'Signature work · Sterling silver 925/1000 · CZK 13,000',
    introEn: "I carved this ring directly from wax around the shape of this particular moldavite. The stone dictates the form, not me. The surface is hand-hammered around the circumference; the metal carries the marks of the work. Once this ring sells, there won't be another like it. For a version in gold, I'd need a new moldavite, and no two are ever the same.",
    heroAltEn: 'A signature moldavite ring, main view',
    processStepsEn: [
      { number: '01', title: 'Choosing the stone',          description: 'Moldavite arrives as a raw piece of tektite, natural glass born from a meteorite impact 15 million years ago. Each one has a different shape, veining, and colour.' },
      { number: '02', title: 'Wax model',                   description: 'I carve the wax model freely, directly around the shape of the stone. No prefabricated form. The wax adapts to the moldavite, not the other way around.' },
      { number: '03', title: 'Casting and finishing',       description: 'I cast the wax model using the lost-wax technique, with centrifugal force, into silver. Then comes the most laborious part: cutting off the sprue, filing down excess material, working through the metal from coarse to finest abrasive, fitting the bezel for the stone (moldavite cannot be cast in metal, it is too brittle) and polishing. This is the dirtiest part of goldsmithing, but also the one that decides whether the piece looks merely cast, or truly made.' },
      { number: '04', title: 'Setting',                     description: 'A stone is set differently in every piece: flush, in prongs, in grooves, or in a bezel. For this ring I pressed the silver directly into the pores and natural cracks of the moldavite. The stone holds itself in place: no prongs, no soldering. This only works with stones that have an irregular surface, like this one.' },
    ],
    ctaTextEn: 'Want a similar piece around a stone of your own? Let me know.',
  },

  {
    slug: 'snubni-prsteny-bile-zlato-matne',
    title: 'Snubní pár v bílém zlatě',
    category: 'snubni-prsteny',
    material: 'Zlato 585/1000 (bílé), matný satén, 3× diamant',
    priceLabel: 'od 40 000 Kč za pár',

    cardImage: '/images/portfolio--snubaky--card.webp',
    cardImage2x: '/images/portfolio--snubaky--card@2x.webp',
    cardAlt: 'Pár snubních prstenů v bílém zlatě s matným povrchem',
    cardLead: 'Pár snubních prstenů v bílém zlatě, matný satén, tři drobné diamanty. Od skici a stříbrného vzorku k hotovému páru za 2 týdny.',

    perex: 'Snubní prsteny · Bílé zlato 585/1000 · od 40 000 Kč za pár',
    intro: 'Klienti přišli s jasnou představou: jednoduché, matné, ne klasický půlkruh ale plochý profil. Nakreslili jsme tři varianty, vybrali nejjednodušší, zkusili ve stříbře (vzorek měli na ruce týden) a pak teprve odlili ve zlatě. Diamanty jsem zasazoval ručně, jeden po druhém. Matný povrch se dělá kovovým kartáčkem, ne přístrojem. Tak má jiný charakter.',
    heroImage: '/images/portfolio--snubaky--hero.webp',
    heroImage2x: '/images/portfolio--snubaky--hero@2x.webp',
    heroAlt: 'Pár snubních prstenů v bílém zlatě',

    processSteps: [
      { number: '01', title: 'Konzultace',         description: 'Klienti přinesli pár fotek z Instagramu jako inspiraci. Probírali jsme šířku, profil, povrch, kámen či bez.' },
      { number: '02', title: 'Skica',              description: 'Nakreslil jsem tři varianty se stejným profilem v různých šířkách.' },
      { number: '03', title: 'Vzorek ve stříbře',  description: 'Vyrobil jsem stejný pár ve stříbře. Klienti si ho odnesli domů na týden, aby se ujistili, že jim sedí denním nošením.' },
      { number: '04', title: 'Výroba ve zlatě',    description: 'Po schválení vzorku přišla finální výroba. Bílé zlato 585/1000, matný satén kovovým kartáčkem, diamanty pavé.' },
    ],

    gallery: [
      { src: '/images/portfolio--snubaky--hero.webp', src2x: '/images/portfolio--snubaky--hero@2x.webp', alt: 'Pár snubních prstenů v bílém zlatě', altEn: 'A pair of wedding bands in white gold' },
    ],

    ctaText: 'Plánujete snubní prsteny? Mám vzorky v dílně k vyzkoušení.',
    ctaHref: '/kontakt/',

    slugEn: 'matte-white-gold-wedding-bands',
    titleEn: 'White gold wedding bands',
    materialEn: 'Gold 585/1000 (white), matte satin finish, 3× diamond',
    priceLabelEn: 'from CZK 40,000 per pair',
    cardAltEn: 'A pair of matte-finish white gold wedding bands',
    cardLeadEn: 'A pair of wedding bands in white gold, matte satin finish, three small diamonds. From sketch and silver sample to the finished pair in two weeks.',
    perexEn: 'Wedding bands · White gold 585/1000 · from CZK 40,000 per pair',
    introEn: "The clients came with a clear idea: simple, matte, not the classic half-round but a flat profile. We drew three variations, picked the simplest, tried it in silver (they wore the sample for a week), and only then cast it in gold. I set the diamonds by hand, one at a time. The matte finish is done with a metal brush, not a machine. That gives it a different character.",
    heroAltEn: 'A pair of wedding bands in white gold',
    processStepsEn: [
      { number: '01', title: 'Consultation',          description: "The clients brought a few photos from Instagram as inspiration. We discussed width, profile, finish, and whether to include a stone." },
      { number: '02', title: 'Sketch',                description: 'I drew three variations with the same profile in different widths.' },
      { number: '03', title: 'Sample in silver',      description: "I made the same pair in silver. The clients took it home for a week to make sure it suited daily wear." },
      { number: '04', title: 'Final piece in gold',   description: 'After the sample was approved came the final piece. White gold 585/1000, matte satin finish with a metal brush, pavé-set diamonds.' },
    ],
    ctaTextEn: 'Planning your wedding bands? I keep samples in the workshop for you to try on.',
  },

  {
    slug: 'zasnubni-prsten-rubin-halo',
    title: 'Růžový safír v halo zasazení',
    category: 'zasnubni-prsteny',
    material: 'Bílé zlato 585/1000, růžový safír ~1 ct, 20× briliant',
    priceLabel: 'cena dle kamene',

    cardImage: '/images/portfolio--rubin-halo--card.webp',
    cardImage2x: '/images/portfolio--rubin-halo--card@2x.webp',
    cardAlt: 'Zásnubní prsten s růžovým safírem v halo zasazení v bílém zlatě',
    cardLead: 'Růžový safír obklopený 20 brilianty v klasickém halo zasazení. Tradice v moderním řemesle, klasická volba pro zásnuby, nebo pro sebe.',

    perex: 'Zásnubní prsteny · Bílé zlato 585/1000 · cena dle kamene',
    intro: 'Halo je klasické zasazení: centrální kámen obklopený řadou drobných briliantů. Funguje jako lupa: vizuálně zvětšuje hlavní kámen a hraje světlem. Důležitá je preciznost: všech 20 briliantů musí sedět stejně hluboko, jinak řada nepůsobí rovnoměrně. Centrální safír jsem vybíral u dodavatele osobně. Klientka chtěla netradiční barvu: místo bílého diamantu nebo červeného rubínu zvolili jsme jasnější růžový odstín, který je vzácnější. Mezi bílými brilianty působí teplejší, mladší.',
    heroImage: '/images/portfolio--rubin-halo--hero.webp',
    heroImage2x: '/images/portfolio--rubin-halo--hero@2x.webp',
    heroAlt: 'Zásnubní prsten s růžovým safírem v halo zasazení',

    processSteps: [
      { number: '01', title: 'Výběr kamene', description: 'Konzultace s dodavateli, výběr ze tří kandidátů. Klientka safír rozhodla vybrat osobně. Na barvu se nedá spoléhat na fotku.' },
      { number: '02', title: '3D návrh',     description: 'V CAD jsem připravil halo zasazení přesně podle tvaru safíru: 20 pozic pro brilianty kolem centrálního kamene.' },
      { number: '03', title: 'Odlití',       description: 'Bílé zlato 585/1000. Odlitek prošel ručním cizelováním pro správný povrch a ostré hrany lůžek.' },
      { number: '04', title: 'Zasazení',     description: 'Všech 20 briliantů jsem ručně zasadil do předem připravených otvorů. Postupuje se od kraje ke středu. Centrální růžový safír zasazený jako poslední.' },
    ],

    gallery: [
      { src: '/images/portfolio--rubin-halo--hero.webp',     src2x: '/images/portfolio--rubin-halo--hero@2x.webp',     alt: 'Zásnubní prsten s růžovým safírem v halo zasazení', altEn: 'Engagement ring with a pink sapphire in a halo setting' },
      { src: '/images/portfolio--rubin-halo--solitery.webp', src2x: '/images/portfolio--rubin-halo--solitery@2x.webp', alt: 'Klasický solitérní zásnubní prsten od stejné klientky', caption: 'Klasická alternativa: solitér s diamantem od stejné klientky', altEn: 'A classic solitaire engagement ring from the same client', captionEn: 'A classic alternative: a solitaire diamond ring for the same client' },
    ],

    ctaText: 'Plánujete zásnuby? Domluvíme si konzultaci, ukážu kameny.',
    ctaHref: '/kontakt/',

    slugEn: 'pink-sapphire-halo-engagement-ring',
    titleEn: 'Pink sapphire in a halo setting',
    materialEn: 'White gold 585/1000, pink sapphire ~1 ct, 20× brilliant-cut diamond',
    priceLabelEn: 'price depends on the stone',
    cardAltEn: 'Engagement ring with a pink sapphire in a halo setting in white gold',
    cardLeadEn: 'A pink sapphire surrounded by twenty brilliants in a classic halo setting. Tradition in a modern hand: a classic choice for an engagement, or for yourself.',
    perexEn: 'Engagement rings · White gold 585/1000 · price depends on the stone',
    introEn: 'Halo is a classic setting: a central stone surrounded by a row of small brilliants. It works like a magnifier: it visually enlarges the main stone and plays with light. Precision is everything: all twenty brilliants must sit at exactly the same depth, otherwise the row looks uneven. I picked the central sapphire from the supplier in person. The client wanted an unusual colour: instead of a white diamond or a red ruby we chose a brighter pink shade, which is rarer. Among the white brilliants it reads warmer and younger.',
    heroAltEn: 'Engagement ring with a pink sapphire in a halo setting',
    processStepsEn: [
      { number: '01', title: 'Choosing the stone', description: 'Consultations with suppliers, picking from three candidates. The client decided to choose the sapphire in person. You cannot trust a photo for colour.' },
      { number: '02', title: '3D design',          description: 'In CAD I prepared the halo setting precisely around the shape of the sapphire: 20 positions for brilliants around the central stone.' },
      { number: '03', title: 'Casting',            description: 'White gold 585/1000. The casting went through hand chasing for the correct surface and sharp bezel edges.' },
      { number: '04', title: 'Setting',            description: 'I set all twenty brilliants by hand into pre-prepared holes, working from the outer edge towards the centre. The central pink sapphire was set last.' },
    ],
    ctaTextEn: "Planning your engagement? Let's meet for a consultation, I'll show you the stones.",
  },

  {
    slug: 'locket-vera-gravirovany',
    title: 'Medailon pro Věru (s fotkou)',
    category: 'personalizovane',
    material: 'Zlato 585/1000 (žluté), ruční gravírování',
    priceLabel: 'cena dle provedení',

    cardImage: '/images/portfolio--locket--card.webp',
    cardImage2x: '/images/portfolio--locket--card@2x.webp',
    cardAlt: 'Zlatý medailon s ručním gravírováním jména Věra',
    cardLead: 'Medailony patří k nejstarším šperkům s emocí: uvnitř fotka nebo pramen vlasů. Tenhle nese jméno Věra.',

    perex: 'Personalizovaná tvorba · Zlato 585/1000 · cena dle provedení',
    intro: 'Medailony jsem dělal jako malý. Má je babička i moje teta a vždycky uvnitř měly maličké foto. Tenhle jsem dělal jako dárek k velkému výročí. Klient přinesl referenci ve formě kresby a chtěl gravírovaný motiv ratolesti kolem jména. Knih, kde se učily takové motivy, je málo. Většinu jsem zkoušel přímo na cvičném kovovém plíšku, než jsem se odvážil rýt do hotového kusu. Uvnitř je místo na jednu malou fotku nebo zprávu.',
    heroImage: '/images/portfolio--locket--hero.webp',
    heroImage2x: '/images/portfolio--locket--hero@2x.webp',
    heroAlt: 'Zlatý medailon s gravírováním',

    processSteps: [
      { number: '01', title: 'Konzultace a reference',  description: 'Klient přinesl ručně nakreslený motiv (kytička, jméno, ratolest).' },
      { number: '02', title: 'Šablona pro gravírování', description: 'Z reference jsem vytvořil rytinovou šablonu: přesné rozměry, hloubky.' },
      { number: '03', title: 'Forma a odlitek',         description: 'Medailon je dvoudílný, jednotlivé poloviny vyřezané z plátku zlata, spojené pantem.' },
      { number: '04', title: 'Ruční gravírování',       description: 'Rycími jehlami. Trvalo to 4 hodiny, na 4 cm² ploše.' },
      { number: '05', title: 'Leštění a kontrola',      description: 'Finální leštění, kontrola pantu a uzávěru.' },
    ],

    gallery: [
      { src: '/images/portfolio--locket--hero.webp', src2x: '/images/portfolio--locket--hero@2x.webp', alt: 'Zlatý medailon s gravírováním Věra', altEn: 'Gold locket with the engraved name Vera' },
    ],

    ctaText: 'Chcete vlastní gravírovaný kus? Napište mi, co má znamenat.',
    ctaHref: '/kontakt/',

    slugEn: 'engraved-locket-vera',
    titleEn: 'Locket for Vera',
    materialEn: 'Gold 585/1000 (yellow), hand engraving',
    priceLabelEn: 'price depends on the work',
    cardAltEn: 'A gold locket with the hand-engraved name Vera',
    cardLeadEn: 'Lockets are among the oldest sentimental jewels: a photo or a lock of hair inside. This one carries the name Vera.',
    perexEn: 'Personalised work · Gold 585/1000 · price depends on the work',
    introEn: "I've known lockets since I was a child: my grandmother and my aunt both wore them, always with a tiny photo inside. I made this one as a gift for a milestone anniversary. The client brought a drawing as a reference and wanted an engraved branch motif around the name. There are few books that still teach these motifs. I practised most of them on a scrap metal sheet before I dared cut into the finished piece. Inside there's room for one small photo or message.",
    heroAltEn: 'A gold locket with engraving',
    processStepsEn: [
      { number: '01', title: 'Consultation and reference', description: 'The client brought a hand-drawn motif (a small flower, the name, a branch).' },
      { number: '02', title: 'Engraving template',         description: 'From the reference I made an engraving template: exact dimensions and depths.' },
      { number: '03', title: 'Form and casting',           description: 'The locket is two-piece; each half cut from a sheet of gold and joined by a hinge.' },
      { number: '04', title: 'Hand engraving',             description: 'With gravers. It took four hours, on a surface of 4 cm².' },
      { number: '05', title: 'Polishing and inspection',   description: 'Final polish, check of the hinge and clasp.' },
    ],
    ctaTextEn: 'Want your own engraved piece? Tell me what it should mean.',
  },
];
