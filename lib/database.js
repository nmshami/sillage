// ─────────────────────────────────────────────────────────────────
// SILLAGE — Global Fragrance Database & Platform Constants
// Curated from Fragrantica, Parfumo, Basenotes, and brand sources
// ─────────────────────────────────────────────────────────────────

export const HOUSES = [
  "Creed","Maison Francis Kurkdjian","Parfums de Marly","Xerjoff","Amouage",
  "Tom Ford","By Kilian","Initio Parfums Privés","Nishane","Mancera",
  "Montale","Serge Lutens","Diptyque","Byredo","Le Labo","Jo Malone London",
  "Hermès","Chanel","Dior","Guerlain","Maison Margiela","Penhaligon's",
  "Frederic Malle","Acqua di Parma","Memo Paris","Tiziana Terenzi",
  "Orto Parisi","Nasomatto","Juliette Has a Gun","Etat Libre d'Orange",
  "Arabian Oud","Abdul Samad Al Qurashi","Ajmal","Swiss Arabian","Rasasi",
  "Lattafa","Al Haramain","Ard Al Zaafaran","Nabeel","Zimaya",
  "Parfums de Nicolai","Caron","Molinard","Lubin","Artisan Parfumeur",
  "Histoires de Parfums","Jovoy","Annick Goutal","Buly 1803","Oriza L. Legrand",
];

export const FRAGRANCE_DB = [
  // ── CREED ──
  { id:"creed-aventus", house:"Creed", name:"Aventus", year:2010, concentration:"EDP",
    notes:{ top:["Blackcurrant","Apple","Bergamot","Pink Pepper"], heart:["Birch","Patchouli","Rose","Jasmine"], base:["Oakmoss","Musk","Ambergris","Vanilla"] },
    accords:["Fruity","Smoky","Woody","Fresh"], gender:"Masculine",
    description:"The best-selling niche fragrance of all time. A chypre-fruity icon inspired by Napoleon Bonaparte, blending pineapple freshness with smoky birch and oakmoss.",
    sizes:["50ml","100ml","250ml"], avgRating:4.3, totalRatings:48200,
    season:["Spring","Summer","Autumn"], occasion:["Office","Evening","Special"],
    longevity:3.5, sillage:3.8, image:"🌿" },

  { id:"creed-millesime-imperial", house:"Creed", name:"Millésime Impérial", year:1995, concentration:"EDP",
    notes:{ top:["Bergamot","Mandarin","Lemon"], heart:["Sea Notes","Iris","Violet"], base:["Musk","White Cedar","Ambergris"] },
    accords:["Aquatic","Citrus","Fresh","Powdery"], gender:"Unisex",
    description:"A liquid Mediterranean summer — crystalline sea spray and sun-warmed citrus on a whisper of ambergris. The quintessential warm-weather masterpiece.",
    sizes:["100ml","250ml"], avgRating:4.5, totalRatings:31000,
    season:["Spring","Summer"], occasion:["Casual","Beach","Daytime"],
    longevity:3.0, sillage:2.8, image:"🌊" },

  { id:"creed-green-irish-tweed", house:"Creed", name:"Green Irish Tweed", year:1985, concentration:"EDP",
    notes:{ top:["Lemon Verbena","Iris","Violet Leaves"], heart:["Sandalwood","Iris"], base:["Ambergris","Woody Notes"] },
    accords:["Fresh","Green","Fougère","Woody"], gender:"Masculine",
    description:"The grandfather of the modern fresh fougère. Dewy Irish meadows in a bottle — the original that launched a thousand clones.",
    sizes:["50ml","100ml","250ml"], avgRating:4.4, totalRatings:29500,
    season:["Spring","Summer"], occasion:["Casual","Daytime"],
    longevity:3.2, sillage:3.0, image:"🍃" },

  // ── MFK ──
  { id:"mfk-baccarat-rouge-540", house:"Maison Francis Kurkdjian", name:"Baccarat Rouge 540", year:2015, concentration:"EDP",
    notes:{ top:["Jasmine","Saffron"], heart:["Amberwood","Ambergris"], base:["Fir Resin","Cedar"] },
    accords:["Woody","Amber","Floral","Sweet"], gender:"Unisex",
    description:"The most referenced fragrance of the 2010s. A luminous amber-woody signature so distinct it became a cultural shorthand for luxury.",
    sizes:["35ml","70ml","200ml"], avgRating:4.2, totalRatings:67800,
    season:["Autumn","Winter"], occasion:["Evening","Special","Date"],
    longevity:4.5, sillage:4.2, image:"🔴" },

  { id:"mfk-oud-satin-mood", house:"Maison Francis Kurkdjian", name:"Oud Satin Mood", year:2014, concentration:"EDP",
    notes:{ top:["Bulgarian Rose","Raspberry"], heart:["Oud","Patchouli"], base:["Vanilla","Benzoin","Musk"] },
    accords:["Oud","Rose","Sweet","Woody"], gender:"Unisex",
    description:"Oud at its most approachable — wrapped in rose and vanilla with patchouli depth. The bridge between Eastern and Western perfumery.",
    sizes:["70ml","200ml"], avgRating:4.4, totalRatings:18900,
    season:["Autumn","Winter"], occasion:["Evening","Special"],
    longevity:4.8, sillage:4.0, image:"🌹" },

  // ── PARFUMS DE MARLY ──
  { id:"pdm-layton", house:"Parfums de Marly", name:"Layton", year:2016, concentration:"EDP",
    notes:{ top:["Apple","Bergamot","Lavender"], heart:["Geranium","Jasmine","Violet"], base:["Sandalwood","Vanilla","Guaiac Wood"] },
    accords:["Floral","Vanilla","Fresh","Woody"], gender:"Masculine",
    description:"A modern classic. Layton achieved something rare — universal appeal without sacrificing complexity. Apple-lavender freshness over a warm sandalwood-vanilla heart.",
    sizes:["75ml","125ml"], avgRating:4.6, totalRatings:41200,
    season:["All Season"], occasion:["Office","Casual","Evening"],
    longevity:4.2, sillage:4.0, image:"🍎" },

  { id:"pdm-pegasus", house:"Parfums de Marly", name:"Pegasus", year:2011, concentration:"EDP",
    notes:{ top:["Bergamot","Heliotrope","Cardamom"], heart:["Jasmine","Sandalwood","Lavender"], base:["Vanilla","Almond","Tonka Bean"] },
    accords:["Gourmand","Powdery","Vanilla","Floral"], gender:"Masculine",
    description:"A creamy, heliotrope-led oriental that turns heads without shouting. Powdery sweetness held in perfect tension with woody depth.",
    sizes:["75ml","125ml"], avgRating:4.4, totalRatings:28700,
    season:["Autumn","Winter"], occasion:["Evening","Date","Special"],
    longevity:4.0, sillage:3.8, image:"🤍" },

  { id:"pdm-herod", house:"Parfums de Marly", name:"Herod", year:2012, concentration:"EDP",
    notes:{ top:["Cinnamon","Pepper"], heart:["Tobacco","Osmanthus"], base:["Vanilla","Sandalwood","Cedarwood"] },
    accords:["Tobacco","Spicy","Woody","Vanilla"], gender:"Masculine",
    description:"Tobacco and cinnamon in perfect alliance. Herod is authoritative, refined, and deeply masculine — a fragrance for the connoisseur.",
    sizes:["75ml","125ml"], avgRating:4.5, totalRatings:22100,
    season:["Autumn","Winter"], occasion:["Evening","Special"],
    longevity:4.3, sillage:3.9, image:"🚬" },

  // ── XERJOFF ──
  { id:"xerjoff-erba-gold", house:"Xerjoff", name:"Erba Gold", year:2016, concentration:"EDP",
    notes:{ top:["Amalfi Lemon","Brazilian Orange","Bergamot","Ginger"], heart:["Pear","Melon","Cardamom","Cinnamon"], base:["White Musk","Amber","Vanilla"] },
    accords:["Fruity","Sweet","Citrus","Musky"], gender:"Unisex",
    description:"Erba Gold is Xerjoff's answer to the fruit-forward summer fragrance. Natural, juicy, and impossibly rich — a full fruit basket on a bed of vanilla.",
    sizes:["50ml","100ml"], avgRating:4.2, totalRatings:14300,
    season:["Spring","Summer"], occasion:["Casual","Daytime","Beach"],
    longevity:3.8, sillage:3.5, image:"🍊" },

  { id:"xerjoff-naxos", house:"Xerjoff", name:"1861 Naxos", year:2012, concentration:"EDP",
    notes:{ top:["Bergamot","Lemon","Lavender"], heart:["Tobacco","Honey","Cinnamon"], base:["Tonka Bean","Vanilla","Musk"] },
    accords:["Tobacco","Sweet","Honey","Aromatic"], gender:"Masculine",
    description:"Honey-sweetened tobacco and lavender — Naxos makes tobacco desirable. Rich, addictive, and completely unique in its honeyed warmth.",
    sizes:["50ml","100ml"], avgRating:4.6, totalRatings:19800,
    season:["Autumn","Winter"], occasion:["Evening","Date","Special"],
    longevity:4.5, sillage:4.0, image:"🍯" },

  // ── AMOUAGE ──
  { id:"amouage-interlude-man", house:"Amouage", name:"Interlude Man", year:2012, concentration:"EDP",
    notes:{ top:["Bergamot","Oregano","Rosemary"], heart:["Incense","Amber","Cistus"], base:["Oud","Sandalwood","Leather"] },
    accords:["Smoky","Incense","Woody","Spicy"], gender:"Masculine",
    description:"The most polarising fragrance in niche perfumery — and one of the greatest. Oregano-incense warfare on a leather-oud base. Not for beginners.",
    sizes:["50ml","100ml"], avgRating:4.3, totalRatings:26700,
    season:["Autumn","Winter"], occasion:["Evening","Special"],
    longevity:5.0, sillage:4.8, image:"⛪" },

  { id:"amouage-reflection-man", house:"Amouage", name:"Reflection Man", year:2007, concentration:"EDP",
    notes:{ top:["Neroli","Basil","Rosemary"], heart:["Jasmine","Ylang Ylang","Lily of the Valley"], base:["Sandalwood","Amber","Musk"] },
    accords:["Floral","Fresh","Woody","Citrus"], gender:"Masculine",
    description:"A grand floral for men before men's florals were fashionable. Neroli and jasmine ascending toward a sandalwood-amber base of extraordinary quality.",
    sizes:["50ml","100ml"], avgRating:4.4, totalRatings:18400,
    season:["Spring","Summer","Autumn"], occasion:["Office","Formal","Evening"],
    longevity:3.8, sillage:3.5, image:"🌼" },

  // ── TOM FORD ──
  { id:"tf-tobacco-vanille", house:"Tom Ford", name:"Tobacco Vanille", year:2007, concentration:"EDP",
    notes:{ top:["Tobacco Leaf","Spice"], heart:["Vanilla","Tonka Bean","Cacao"], base:["Dried Fruit","Wood"] },
    accords:["Tobacco","Vanilla","Sweet","Woody"], gender:"Unisex",
    description:"The ultimate cold-weather gourmand. Tobacco and vanilla intertwined into something impossibly warm and seductive — the definition of a crowd-pleaser.",
    sizes:["50ml","100ml","250ml"], avgRating:4.4, totalRatings:38600,
    season:["Autumn","Winter"], occasion:["Evening","Casual","Date"],
    longevity:4.0, sillage:3.8, image:"🍂" },

  { id:"tf-oud-wood", house:"Tom Ford", name:"Oud Wood", year:2007, concentration:"EDP",
    notes:{ top:["Oud","Rosewood","Cardamom"], heart:["Sandalwood","Vetiver","Amber"], base:["Tonka Bean","Musk"] },
    accords:["Oud","Woody","Spicy","Amber"], gender:"Unisex",
    description:"The fragrance that introduced oud to the Western mainstream. Smooth, polished, approachable — this is the gateway drug of oud perfumery.",
    sizes:["50ml","100ml","250ml"], avgRating:4.3, totalRatings:31200,
    season:["All Season"], occasion:["Office","Formal","Evening"],
    longevity:4.2, sillage:3.7, image:"🪵" },

  // ── BY KILIAN ──
  { id:"bk-black-phantom", house:"By Kilian", name:"Black Phantom", year:2015, concentration:"EDP",
    notes:{ top:["Coffee","Rum"], heart:["Caramel","Almond"], base:["Vanilla","Musks","Sandalwood"] },
    accords:["Gourmand","Coffee","Sweet","Vanilla"], gender:"Unisex",
    description:"Dark rum and coffee over a caramel-almond heart. Black Phantom is gothic dessert — sinister, addictive, and completely unique.",
    sizes:["50ml","100ml"], avgRating:4.3, totalRatings:22100,
    season:["Autumn","Winter"], occasion:["Evening","Date","Night"],
    longevity:4.2, sillage:4.0, image:"☕" },

  // ── INITIO ──
  { id:"initio-oud-for-greatness", house:"Initio Parfums Privés", name:"Oud for Greatness", year:2018, concentration:"EDP",
    notes:{ top:["Oud","Saffron"], heart:["Nutmeg","Patchouli"], base:["Musks","Woody Notes"] },
    accords:["Oud","Spicy","Animalic","Woody"], gender:"Unisex",
    description:"Oud as a weapon. Raw, animalic, bold — Oud for Greatness makes no compromises. Among the most potent productions of the decade.",
    sizes:["90ml"], avgRating:4.5, totalRatings:16700,
    season:["Autumn","Winter"], occasion:["Evening","Special"],
    longevity:5.0, sillage:4.8, image:"👑" },

  { id:"initio-atomic-rose", house:"Initio Parfums Privés", name:"Atomic Rose", year:2019, concentration:"EDP",
    notes:{ top:["Rose","Pink Pepper"], heart:["Musks","Ambroxan"], base:["Sandalwood","Vetiver"] },
    accords:["Rose","Musky","Fresh","Woody"], gender:"Unisex",
    description:"Rose weaponised with Ambroxan. A skin-close musky rose with nuclear-grade projection and impossible longevity. The modern rose reinvented.",
    sizes:["90ml"], avgRating:4.4, totalRatings:13200,
    season:["All Season"], occasion:["Casual","Date","Evening"],
    longevity:4.8, sillage:4.3, image:"🌸" },

  // ── NISHANE ──
  { id:"nishane-hacivat", house:"Nishane", name:"Hacivat", year:2017, concentration:"Extrait",
    notes:{ top:["Grapefruit","Bergamot","Pineapple"], heart:["Patchouli","Jasmine"], base:["Woody Notes","Musks","Amberwood"] },
    accords:["Fruity","Woody","Fresh","Sweet"], gender:"Unisex",
    description:"The Turkish challenger to Aventus. Hacivat shares DNA but adds a creamy patchouli heart and extraordinary extract-level longevity.",
    sizes:["50ml","100ml"], avgRating:4.4, totalRatings:19100,
    season:["Spring","Summer","Autumn"], occasion:["Casual","Office","Daytime"],
    longevity:4.8, sillage:4.0, image:"🌿" },

  // ── ARABIAN HOUSES ──
  { id:"arabian-oud-mukhallat", house:"Arabian Oud", name:"Mukhallat Malaki", year:2010, concentration:"EDP",
    notes:{ top:["Rose","Oud"], heart:["Amber","Musk"], base:["Sandalwood","Bakhoor"] },
    accords:["Oud","Rose","Amber","Smoky"], gender:"Unisex",
    description:"A royal mukhallat from the legendary Saudi house. Dense, opulent, and deeply rooted in Gulf olfactive tradition.",
    sizes:["100ml","200ml"], avgRating:4.3, totalRatings:8900,
    season:["Autumn","Winter"], occasion:["Special","Evening","Formal"],
    longevity:5.0, sillage:4.5, image:"🕌" },

  { id:"swiss-arabian-hayati", house:"Swiss Arabian", name:"Hayati", year:2015, concentration:"EDP",
    notes:{ top:["Bergamot","Lemon"], heart:["Geranium","Rose","Jasmine"], base:["Oud","Sandalwood","Amber"] },
    accords:["Floral","Oud","Fresh","Woody"], gender:"Masculine",
    description:"A bridge between Eastern heritage and Western refinement. Fresh citrus head giving way to a dignified oud-rose heart.",
    sizes:["100ml"], avgRating:4.1, totalRatings:6200,
    season:["All Season"], occasion:["Office","Casual"],
    longevity:3.8, sillage:3.5, image:"🌙" },

  { id:"lattafa-khamrah", house:"Lattafa", name:"Khamrah Qahwa", year:2022, concentration:"EDP",
    notes:{ top:["Coffee","Cardamom","Saffron"], heart:["Rose","Oud"], base:["Amber","Vanilla","Musk"] },
    accords:["Coffee","Sweet","Oud","Spicy"], gender:"Unisex",
    description:"Lattafa's masterpiece. Coffee and cardamom on an oud-rose heart at an extraordinary value price. The fragrance world's best-kept secret.",
    sizes:["100ml"], avgRating:4.5, totalRatings:28400,
    season:["Autumn","Winter"], occasion:["Casual","Evening"],
    longevity:4.5, sillage:4.0, image:"☕" },

  // ── MORE NICHE ──
  { id:"serge-lutens-chergui", house:"Serge Lutens", name:"Chergui", year:2001, concentration:"EDP",
    notes:{ top:["Hay","Tobacco"], heart:["Iris","Honey","Rose"], base:["Musk","Woody Notes","Amber"] },
    accords:["Tobacco","Honey","Sweet","Powdery"], gender:"Unisex",
    description:"Named after the hot Moroccan desert wind. A masterclass in tobacco: honey-sweet, iris-powdery, achingly beautiful.",
    sizes:["50ml","75ml"], avgRating:4.4, totalRatings:21300,
    season:["Autumn","Winter"], occasion:["Evening","Casual"],
    longevity:4.0, sillage:3.5, image:"🏜️" },

  { id:"diptyque-do-son", house:"Diptyque", name:"Do Son", year:2004, concentration:"EDT",
    notes:{ top:["Tuberose","Neroli","Water Notes"], heart:["Tuberose","Rose","Lily of the Valley"], base:["Musk","White Musks"] },
    accords:["Floral","Fresh","White Floral","Musky"], gender:"Feminine",
    description:"Sea-kissed tuberose. Do Son captures the intoxicating tuberose of a Vietnamese coastal village — never heady, always elegant.",
    sizes:["50ml","100ml"], avgRating:4.2, totalRatings:14800,
    season:["Spring","Summer"], occasion:["Casual","Daytime","Beach"],
    longevity:3.2, sillage:2.8, image:"🌊" },

  { id:"byredo-bal-dafrique", house:"Byredo", name:"Bal d'Afrique", year:2009, concentration:"EDP",
    notes:{ top:["Bergamot","Lemon","African Marigold"], heart:["Violet","Cyclamen","Neroli"], base:["Vetiver","Musk","Amber"] },
    accords:["Floral","Musky","Citrus","Woody"], gender:"Unisex",
    description:"Byredo's greatest achievement. A flower market in a sun-drenched African city — joyful, luminous, and utterly transportive.",
    sizes:["50ml","100ml"], avgRating:4.3, totalRatings:17600,
    season:["Spring","Summer"], occasion:["Casual","Daytime"],
    longevity:3.5, sillage:3.2, image:"🌻" },

  { id:"le-labo-santal-33", house:"Le Labo", name:"Santal 33", year:2011, concentration:"EDP",
    notes:{ top:["Cardamom","Iris","Violet"], heart:["Ambrette","Sandalwood"], base:["Cedarwood","Leather","Musk"] },
    accords:["Woody","Smoky","Leather","Musky"], gender:"Unisex",
    description:"The fragrance that defined an era. Sandalwood and leather smoked with a hint of iris — effortless cool in a bottle.",
    sizes:["50ml","100ml"], avgRating:4.0, totalRatings:34700,
    season:["All Season"], occasion:["Casual","Office","Date"],
    longevity:3.8, sillage:3.5, image:"🪵" },

  { id:"tiziana-terenzi-kirke", house:"Tiziana Terenzi", name:"Kirke", year:2016, concentration:"EDP",
    notes:{ top:["Passion Fruit","Grapefruit","Bergamot"], heart:["Tuberose","White Lily","Heliotrope"], base:["Sandalwood","Musk","Civet"] },
    accords:["Fruity","Tropical","Floral","Sweet"], gender:"Unisex",
    description:"Tropical paradise and white flowers in a symbiotic dance. Kirke is impossible to ignore — fruity tuberose at its most exuberant.",
    sizes:["100ml"], avgRating:4.5, totalRatings:15200,
    season:["Spring","Summer"], occasion:["Casual","Beach","Date"],
    longevity:4.5, sillage:4.2, image:"🌺" },

  { id:"nasomatto-black-afghano", house:"Nasomatto", name:"Black Afghano", year:2009, concentration:"Extrait",
    notes:{ top:["Cannabis","Coffee"], heart:["Woody Notes"], base:["Resin","Vanilla"] },
    accords:["Smoky","Woody","Earthy","Resinous"], gender:"Unisex",
    description:"Hashish resin, dark coffee, and raw wood. Black Afghano is unlike anything else in perfumery — transgressive, hypnotic, unforgettable.",
    sizes:["30ml"], avgRating:4.3, totalRatings:12400,
    season:["Autumn","Winter"], occasion:["Evening","Night"],
    longevity:4.8, sillage:3.5, image:"🖤" },

  { id:"frederic-malle-portrait-lady", house:"Frederic Malle", name:"Portrait of a Lady", year:2010, concentration:"EDP",
    notes:{ top:["Turkish Rose","Blackcurrant","Raspberry"], heart:["Patchouli","Clove","Sandalwood"], base:["Benzoin","Musk","Amber"] },
    accords:["Rose","Patchouli","Woody","Spicy"], gender:"Feminine",
    description:"Rose perfumery's pinnacle. Turkish rose on a dark patchouli-clove foundation — powerful, unapologetically feminine, and technically flawless.",
    sizes:["50ml","100ml"], avgRating:4.5, totalRatings:24800,
    season:["Autumn","Winter"], occasion:["Evening","Special","Formal"],
    longevity:4.5, sillage:4.2, image:"🌹" },

  { id:"memo-paris-african-leather", house:"Memo Paris", name:"African Leather", year:2013, concentration:"EDP",
    notes:{ top:["Cardamom","Saffron","Geranium"], heart:["Leather","Oud"], base:["Musk","Cypriol","Sandalwood"] },
    accords:["Leather","Spicy","Woody","Oud"], gender:"Unisex",
    description:"Raw savannah leather and saffron-spice. African Leather is a visceral olfactory journey — untamed, animalic, and breathtaking in its confidence.",
    sizes:["75ml"], avgRating:4.4, totalRatings:11800,
    season:["Autumn","Winter"], occasion:["Evening","Special"],
    longevity:4.5, sillage:4.0, image:"🦁" },
];

// ── STORES BY REGION ──
export const STORES = {
  "Saudi Arabia": [
    { id:"gold-apple-sa", name:"Gold Apple SA", url:"https://goldapple.sa", type:"Online+Physical", reliability:"High", ships:["SA"] },
    { id:"golden-scent", name:"Golden Scent", url:"https://goldenscent.com", type:"Online", reliability:"High", ships:["SA","UAE","KW","BH","OM","QA"] },
    { id:"amazon-sa", name:"Amazon.sa", url:"https://amazon.sa", type:"Online", reliability:"Medium", ships:["SA"], note:"Buy Amazon-fulfilled only" },
    { id:"nahdi", name:"Nahdi Online", url:"https://nahdionline.com", type:"Online+Physical", reliability:"High", ships:["SA"] },
    { id:"arabian-oud-sa", name:"Arabian Oud", url:"https://sa.arabianoud.com", type:"Online+Physical", reliability:"High", ships:["SA","GCC"] },
    { id:"noon-sa", name:"Noon.com", url:"https://noon.com", type:"Online", reliability:"Medium", ships:["SA","UAE"] },
  ],
  "United Arab Emirates": [
    { id:"gold-apple-ae", name:"Gold Apple UAE", url:"https://goldapple.ae", type:"Online+Physical", reliability:"High", ships:["UAE"] },
    { id:"golden-scent-ae", name:"Golden Scent", url:"https://goldenscent.com", type:"Online", reliability:"High", ships:["UAE","SA","GCC"] },
    { id:"amazon-ae", name:"Amazon.ae", url:"https://amazon.ae", type:"Online", reliability:"High", ships:["UAE"] },
    { id:"faces", name:"Faces", url:"https://faces.com", type:"Online+Physical", reliability:"High", ships:["UAE","SA"] },
    { id:"noon-ae", name:"Noon.com UAE", url:"https://noon.com", type:"Online", reliability:"Medium", ships:["UAE","SA"] },
    { id:"scentbird-ae", name:"Bloomingdales UAE", url:"https://bloomingdales.ae", type:"Online+Physical", reliability:"High", ships:["UAE"] },
  ],
  "United Kingdom": [
    { id:"harrods", name:"Harrods", url:"https://harrods.com", type:"Online+Physical", reliability:"High", ships:["UK","International"] },
    { id:"selfridges", name:"Selfridges", url:"https://selfridges.com", type:"Online+Physical", reliability:"High", ships:["UK","EU"] },
    { id:"john-lewis", name:"John Lewis", url:"https://johnlewis.com", type:"Online+Physical", reliability:"High", ships:["UK"] },
    { id:"libertys", name:"Liberty London", url:"https://libertylondon.com", type:"Online+Physical", reliability:"High", ships:["UK","International"] },
    { id:"fragrance-direct", name:"Fragrance Direct", url:"https://fragrancedirect.co.uk", type:"Online", reliability:"Medium", ships:["UK","EU"] },
  ],
  "United States": [
    { id:"scentbeauty", name:"Scentbeauty", url:"https://scentbeauty.com", type:"Online", reliability:"High", ships:["US","International"] },
    { id:"bergdorf", name:"Bergdorf Goodman", url:"https://bergdorfgoodman.com", type:"Online+Physical", reliability:"High", ships:["US"] },
    { id:"neiman-marcus", name:"Neiman Marcus", url:"https://neimanmarcus.com", type:"Online+Physical", reliability:"High", ships:["US"] },
    { id:"fragrancenet", name:"FragranceNet", url:"https://fragrancenet.com", type:"Online", reliability:"Medium", ships:["US","International"], note:"Verify authenticity" },
    { id:"bloomingdales-us", name:"Bloomingdale's", url:"https://bloomingdales.com", type:"Online+Physical", reliability:"High", ships:["US"] },
  ],
  "France": [
    { id:"sephora-fr", name:"Sephora France", url:"https://sephora.fr", type:"Online+Physical", reliability:"High", ships:["FR","EU"] },
    { id:"marionnaud", name:"Marionnaud", url:"https://marionnaud.fr", type:"Online+Physical", reliability:"High", ships:["FR"] },
    { id:"galeries-lafayette", name:"Galeries Lafayette", url:"https://galerieslafayette.com", type:"Online+Physical", reliability:"High", ships:["FR","EU"] },
  ],
  "Germany": [
    { id:"douglas-de", name:"Douglas Germany", url:"https://douglas.de", type:"Online+Physical", reliability:"High", ships:["DE","EU"] },
    { id:"amazon-de", name:"Amazon.de", url:"https://amazon.de", type:"Online", reliability:"High", ships:["DE","EU"] },
  ],
};

export const COUNTRIES = Object.keys(STORES);

export const CURRENCIES = {
  "Saudi Arabia": { code:"SAR", symbol:"﷼", rate:1 },
  "United Arab Emirates": { code:"AED", symbol:"AED", rate:1.02 },
  "United Kingdom": { code:"GBP", symbol:"£", rate:0.076 },
  "United States": { code:"USD", symbol:"$", rate:0.266 },
  "France": { code:"EUR", symbol:"€", rate:0.247 },
  "Germany": { code:"EUR", symbol:"€", rate:0.247 },
};

export const ACCORDS = [
  "Woody","Floral","Fresh","Citrus","Aromatic","Spicy","Sweet","Gourmand",
  "Oriental","Amber","Musk","Oud","Rose","Aquatic","Green","Tobacco",
  "Leather","Smoky","Honey","Powdery","Vanilla","Fruity","Resinous",
];

export const SEASONS = ["Spring","Summer","Autumn","Winter","All Season"];
export const OCCASIONS = ["Office","Casual","Evening","Date","Special","Beach","Sport","Formal","Night","Daytime"];
export const CONCENTRATIONS = ["EDT","EDP","Extrait","Parfum","EDC","Attar","Oil"];
export const GENDERS = ["Masculine","Feminine","Unisex"];

export const COLLECTION_LISTS = [
  { key:"owned", label:"I Own", icon:"✦", color:"#c9a96e" },
  { key:"wishlist", label:"Wishlist", icon:"◈", color:"#7eb8d4" },
  { key:"toTest", label:"Want to Test", icon:"◉", color:"#a8d4a0" },
];
