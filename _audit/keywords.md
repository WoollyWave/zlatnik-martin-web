# Keyword analýza — zlatnik-martin.cz (12. 6. 2026)

Metodika: intent klasifikace × konkurenční SERP průzkum (Firmy.cz/Seznam katalogy, lokální
konkurence Smíchov) × audit pokrytí termínů v built HTML (29 CS stránek). Objemy jsou
kvalitativní odhady (head/mid/long-tail) — bez placených nástrojů, ale intent a gap analýza
na nich nestojí.

## 1. Mapa klíčových slov

### Tier 1 — lokální head terms (nejvyšší objem, kategorie intent)

| Termín | Intent | Pokrytí PŘED | Stav |
|---|---|---|---|
| **zlatnictví praha** | hledám obchod/služby | 2/29 stránek | 🔴 KRITICKÝ GAP — web mluví „zlatník/zlatnická dílna", lidé hledají „zlatnictví" |
| **zlatnictví praha 5** | lokální | 0 (jen „Praha 5" samostatně) | 🔴 GAP |
| **zlatník praha (5)** | hledám řemeslníka | 19/29, homepage title ✓ | 🟢 dobré |
| **zlatnictví / zlatník smíchov** | hyper-local | 1/29 (!) | 🔴 GAP — dílna NA Smíchově sídlí; konkurent se jmenuje „Zlatnictví U Anděla" |
| zlatnická dílna praha | brand-blízký | 30/30 | 🟢 výborné |

GEO entity poznámka: Pod Kesnerkou 46 = **Smíchov**, spádově **Anděl** (top dopravní uzel
Prahy 5). Smíchov patří do meta/description/schema vrstvy; Anděl nechat na případný
obsahový text (do meta by působil nepřirozeně).

### Tier 2 — služby (komerční intent, mid volume)

| Termín | Pokrytí PŘED | Stav |
|---|---|---|
| **šperky na zakázku (praha)** | 1/29 | 🔴 GAP — web říká „zakázková tvorba/výroba" (odborně správně), ale laici hledají „šperky na zakázku" |
| zakázková výroba šperků | title zakázkové ✓ | 🟢 |
| šperk na míru | 2 + H1 ✓ | 🟢 |
| **snubní prsteny praha / na míru** | vlastní landing + title ✓ | 🟢 výborné |
| zásnubní prsten (s diamantem) praha | 24 stránek, FAQ ✓ | 🟢 |
| **opravy šperků praha** | vlastní landing ✓ | 🟢 výborné |
| oprava prstenu / zmenšení prstenu | FAQ + description ✓ | 🟢 |
| rytí šperků praha | sekce v opravách | 🟢 |
| zlaté šperky (praha) | 0 (jen „ze zlata") | 🟡 doplnit přirozeně do meta |
| stříbrné šperky s kameny | 2 + skladem title ✓ | 🟢 |

### Tier 3 — produktové niche (long-tail, vysoká konverze)

| Termín | Pokrytí | Stav |
|---|---|---|
| **prsten s vltavínem / vltavínové šperky** | 12 stránek (produkty, case study) | 🟢 silná niche — ALE chybí v titles listingů |
| **moldavite jewelry/ring prague** (EN) | produktové EN stránky | 🟡 doplnit do EN in-stock title |
| prsten s ametystem/opálem/turmalínem | produktové detaily ✓ | 🟢 |
| šperky z vlastního zlata / přetavení | FAQ opravy + snubní ✓ | 🟢 |

### EN trh (expati — wedding/engagement, moldavite turisté)

| Termín | Pokrytí PŘED | Stav |
|---|---|---|
| goldsmith prague | všechny EN titles (brand-last) | 🟡 titles brand-first → otočit na keyword-first |
| custom jewellery/jewelry prague | custom-jewelry page | 🟡 v title chybí „Prague" na prvním místě |
| **wedding rings prague** | NOVĚ /en/wedding-rings/ ✓ | 🟢 (dnes přidáno) |
| engagement ring prague | wedding-rings FAQ ✓ | 🟢 |
| moldavite jewelry prague | jen produktové detaily | 🟡 → EN in-stock title |

## 2. Hlavní zjištění

1. **Slovo „zlatnictví" web téměř nepoužívá** — terminologicky správně (Martin je zlatník,
   má dílnu), ale SERP kategorie i uživatelské dotazy běží na „zlatnictví". Řešení bez
   poškození brand voice: meta vrstvy (title/description/schema/llms.txt), ne body copy.
2. **Smíchov chybí úplně** — největší GEO gap. NAP zůstává „Pod Kesnerkou 46, Praha 5,
   150 00" (znak po znaku, neměnit!), Smíchov jde do descriptions, JSON-LD areaServed
   a llms.txt.
3. **llms.txt tvrdí „v centru Prahy"** — fakticky špatně (AIO riziko: LLM bude halucinovat
   polohu). Opravit na Smíchov.
4. **„šperky na zakázku"** — frázová mezera mezi odborným a laickým jazykem; do title
   zakázkové stránky vedle stávající formulace.
5. **Vltavín = nejsilnější diferenciátor** (český unikát, mezinárodní poptávka „moldavite")
   — patří do title skladem (CS) a in-stock (EN).
6. **EN titles brand-first** → otočit na keyword-first (brand za pipe), běžná praxe 2026.

## 3. Aplikované změny (meta vrstvy, body copy nedotčeno)

| Stránka | Změna |
|---|---|
| Homepage CS | T: „Zlatnictví Praha 5 — Smíchov \| Zlatník Martin Ševr, šperky na zakázku" · D: + Smíchov, šperky na zakázku |
| Homepage EN | T: „Goldsmith in Prague \| Handmade & Custom Jewellery — Martin Ševr" |
| Zakázková | T: „Šperky na zakázku Praha \| Zakázková výroba ze zlata a stříbra" · D: + šperky na zakázku |
| Custom jewellery EN | T: „Custom Jewellery Prague \| Handmade by Goldsmith Martin Ševr" |
| Skladem | T: + „prsten s vltavínem" · D: beze změny (vltavín už má) |
| In stock EN | T: + „Moldavite“ |
| O dílně | D: + Smíchov |
| About EN | T: keyword-first „Goldsmith Workshop in Prague 5…" |
| Kontakt | D: + (Smíchov) |
| Opravy | D: + Smíchov |
| JSON-LD (seo.ts) | JewelryStore: description + zlatnictví/Smíchov, areaServed + City Praha, keywords (zlatnictví Praha 5, Smíchov, šperky na zakázku…) |
| site.ts | SITE.description rozšířen (živí JewelryStore.description) |
| llms.txt | oprava „centrum"→Smíchov; doplněny stránky Opravy + Snubní + EN verze; vltavín/moldavite zmínka |

## 4. Neaplikováno — ke zvážení (vyžaduje obsah/rozhodnutí)

- 🟡 **„Anděl" zmínka** v textu kontaktu/O dílně („10 minut od Anděla") — přirozená GEO kotva,
  ale je to body copy → schválit formulaci.
- 🟡 **Blog/obsahová vrstva** pro informační dotazy („jak vybrat zásnubní prsten",
  „co je vltavín") — největší dlouhodobá AEO/SEO páka, ale nový obsah ≠ audit.
- 🟢 Google Business Profile: kategorii „Zlatnictví" + služby + fotky — mimo web, ale pro
  „zlatnictví praha 5" v Map Packu rozhodující. Doporučuji ověřit/claimnout.
