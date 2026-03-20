export interface PortfolioItem {
  slug: string;
  title: string;
  tags: string[];
  description: string;
  fullDescription: string;
  material: string;
}

export const portfolioItems: PortfolioItem[] = [
  {
    slug: 'zlaty-prsten-s-opalem',
    title: 'Zlatý prsten s opálem',
    tags: ['Zlato 585', 'Opál', 'Zakázka'],
    description: 'Prsten s australským opálem zasazeným do ručně tepaného zlata.',
    fullDescription: 'Prsten s australským opálem zasazeným do ručně tepaného zlata. Navržen podle příběhu klientky, která chtěla šperk připomínající barvy západu slunce nad mořem. Opál mění barvy podle úhlu světla — od modré přes zelenou až po ohnivou oranžovou.',
    material: 'Zlato 585/1000, australský opál',
  },
  {
    slug: 'stribrna-sada-s-granaty',
    title: 'Stříbrná sada s granáty',
    tags: ['Stříbro 925', 'České granáty'],
    description: 'Náušnice a prsten s českými granáty v minimalistickém moderním designu.',
    fullDescription: 'Sada náušnic a prstenu s českými granáty. Každý kámen je ručně vybraný a zasazený do stříbrného lůžka s matným povrchem. Design spojuje tradici českých granátů s moderním minimalistickým přístupem.',
    material: 'Stříbro 925/1000, české granáty',
  },
  {
    slug: 'snubni-prsteny-na-miru',
    title: 'Snubní prsteny na míru',
    tags: ['Zlato 750', 'Zakázka'],
    description: 'Pár snubních prstenů s ručně rytým vzorem. Každý je originál.',
    fullDescription: 'Snubní prsteny vyrobené ze zlata 750/1000 s ručně rytým vzorem, který připomíná letokruhy stromu. Každý prsten je trochu jiný — stejně jako každý vztah je jedinečný. Klienti si přáli, aby prsteny vypadaly jako něco, co roste a mění se s časem.',
    material: 'Zlato 750/1000',
  },
  {
    slug: 'stribrny-nahrdelnik-vlna',
    title: 'Stříbrný náhrdelník Vlna',
    tags: ['Stříbro 925', 'Zakázka'],
    description: 'Organicky tvarovaný náhrdelník inspirovaný pohybem vody.',
    fullDescription: 'Náhrdelník inspirovaný pohybem mořských vln. Ručně tvarovaný ze stříbrného drátu a plošek. Povrch střídavě leštěný a matný, což vytváří hru světla připomínající odlesky na vodní hladině.',
    material: 'Stříbro 925/1000',
  },
];
