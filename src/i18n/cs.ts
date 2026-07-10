/**
 * Czech UI strings.
 * Source of truth — when adding a new key, mirror it in en.ts.
 */
export const cs = {
  // --- Locale meta ---
  'locale.code': 'cs',
  'locale.full': 'cs-CZ',
  'locale.ogLocale': 'cs_CZ',
  'locale.label': 'Čeština',
  'locale.shortLabel': 'CS',

  // --- Nav ---
  'nav.aria': 'Hlavní navigace',
  'nav.home': 'Domů',
  'nav.customJewelry': 'Zakázková tvorba',
  'nav.inStock': 'Skladem',
  'nav.portfolio': 'Portfolio',
  'nav.about': 'O dílně',
  'nav.contact': 'Kontakt',
  'nav.brandLine': 'Zlatnická dílna',
  'nav.status': 'Přijímám zakázky',
  'nav.consultationCta': 'Konzultace',
  'nav.openMenu': 'Otevřít menu',
  'nav.brandHomeAria': 'Martin Ševr, Domů',
  'nav.langSwitchAria': 'Přepnout na English',
  'nav.callCta': 'Zavolat',

  // --- Footer ---
  'footer.ctaHeadingDefault': 'Pojďme vytvořit šperk, který krásně <em>zestárne.</em>',
  'footer.ctaSubtitleDefault': 'Zavolejte nebo napište na WhatsApp. Ozvu se do 24 hodin. Konzultace v dílně je zdarma a bez závazků.',
  'footer.ctaPrimaryDefault': 'Zavolat',
  'footer.ctaWhatsApp': 'Napsat na WhatsApp',
  'footer.ctaWhatsAppAria': 'Napsat na WhatsApp',
  'footer.brandLine': 'Zlatnická dílna v centru Prahy',
  'footer.sitemapHeading': 'Stránky',
  'footer.contactHeading': 'Kontakt',
  'footer.legalHeading': 'Informace',
  'footer.privacy': 'Ochrana osobních údajů',
  'footer.copyright': '© {year} Martin Ševr · Zlatnická dílna Praha',
  'footer.designedBy': 'Web: Vilim.One',
  'footer.businessId': 'IČO',
  'footer.hours': 'Po–Pá 9:00–17:00, víkendy po domluvě',
  'footer.followAria': 'Sledovat na Instagramu',
  'footer.facebookAria': 'Sledovat na Facebooku',

  // --- CTA (pre-footer) ---
  'cta.headingDefault': 'Pojďme vytvořit šperk,<br />který krásně <em>zestárne</em>.',
  'cta.subheadingDefault': 'Zavolejte mi nebo napište na WhatsApp. Ozvu se do 24 hodin.',
  'cta.call': 'Zavolat',
  'cta.whatsapp': 'Napsat na WhatsApp',

  // --- Buttons (common) ---
  'btn.viewDetail': 'Zobrazit detail',
  'btn.askForJewelry': 'Poptat šperk',
  'btn.bookConsultation': 'Domluvit konzultaci',
  'btn.contactMe': 'Napsat mi',
  'btn.viewMore': 'Více',
  'btn.backToList': '← Zpět na výpis',

  // --- Layout / common ---
  'common.skipToContent': 'Přeskočit na obsah',
  'common.altDefault': 'Šperk od Martina Ševra',
  'common.readMore': 'Číst dál',
  'common.loading': 'Načítání…',

  // --- Listing pages headers ---
  'inStock.title': 'Hotové šperky',
  'inStock.subtitle': 'Stříbrné šperky s přírodními kameny. K vyzvednutí v dílně nebo poštou. Většinu modelů vyrobím i ve zlatě do 3 týdnů.',
  'inStock.filterAll': 'Vše',
  'inStock.filterRings': 'Prsteny',
  'inStock.filterEarrings': 'Náušnice',
  'inStock.filterPendants': 'Přívěsky',
  'inStock.filterChains': 'Řetízky',
  'inStock.filterSets': 'Sady',
  'inStock.silverLabel': 'Stříbro',
  'inStock.goldLabel': 'Zlato',
  'inStock.uniquePiece': 'Jediný originální kus',
  'inStock.material': 'Materiál',
  'inStock.weight': 'Hmotnost',
  'inStock.size': 'Velikost',
  'inStock.price': 'Cena',

  // --- Portfolio ---
  'portfolio.title': 'Šperky z duše',
  'portfolio.subtitle': 'Čtyři příběhy z dílny. Každý kus má vlastní cestu, od první konzultace po předání.',
  'portfolio.processHeading': 'Jak vznikal',
  'portfolio.materialLabel': 'Materiál',
  'portfolio.priceLabel': 'Cena',

  // --- Contact ---
  'contact.title': 'Pojďme si promluvit',
  'contact.subtitle': 'Voláte přímo zlatníkovi. Žádný asistent, žádný formulář do prázdna.',
  'contact.phone': 'Telefon',
  'contact.whatsapp': 'WhatsApp',
  'contact.email': 'E-mail',
  'contact.address': 'Adresa',
  'contact.hours': 'Otvírací doba',
  'contact.whatsappValue': 'Napsat zprávu',
  'contact.replyTime': 'Odpovím do 24 hodin',
  'contact.weekdaysShort': 'Po–Pá 9–17',
  'contact.formHeading': 'Napište mi',
  'contact.formName': 'Jméno',
  'contact.formEmail': 'E-mail',
  'contact.formPhone': 'Telefon',
  'contact.formInterest': 'Zájem o',
  'contact.formMessage': 'Zpráva',
  'contact.formGdpr': 'Souhlasím se zpracováním osobních údajů',
  'contact.formSubmit': 'Odeslat zprávu',
  'contact.formInterestCustom': 'Zakázková tvorba',
  'contact.formInterestStock': 'Šperk skladem',
  'contact.formInterestRepair': 'Oprava / úprava',
  'contact.formInterestOther': 'Jiné',
} as const;

export type TranslationKey = keyof typeof cs;
