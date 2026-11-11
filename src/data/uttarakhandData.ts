export type UserRole = 'guest' | 'traveler' | 'homestay_owner' | 'eco_board';

export type InterestTag = 'trekking' | 'wildlife' | 'wellness' | 'heritage';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  region: string;
  organizationOrProperty?: string;
}

export interface CircuitItem {
  id: string;
  title: string;
  region: 'Garhwal' | 'Kumaon';
  district: string;
  altitude: string;
  duration: string;
  durationDays: number;
  difficulty: 'Easy-Moderate' | 'Moderate' | 'Challenging';
  bestSeason: string;
  permitRequired: string;
  carbonFootprintKg: number;
  carbonSavedPercent: number;
  basePriceInr: number;
  summary: string;
  culturalHighlights: string;
  highlights: string[];
  interests: InterestTag[];
  imageUrl: string;
  ecoCapacityRemaining: number;
  dayByDayPlan: { day: number; title: string; activity: string; stayVillage: string }[];
}

export interface HomestayProperty {
  id: string;
  name: string;
  village: string;
  district: string;
  region: 'Garhwal' | 'Kumaon';
  altitude: string;
  architectureStyle: string;
  hostName: string;
  pricePerNightInr: number;
  roomsAvailable: number;
  totalRooms: number;
  rating: number;
  communityImpactScore: string;
  communitySharePercent: number;
  ecoBadges: string[];
  amenities: string[];
  imageUrl: string;
  solarPowered: boolean;
  organicFarmToTable: boolean;
}

export interface BookingInquiry {
  id: string;
  homestayId: string;
  homestayName: string;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmountInr: number;
  status: 'Pending' | 'Confirmed' | 'Declined';
  notes: string;
  createdAt: string;
}

export interface EcoGuideline {
  id: string;
  code: string;
  title: string;
  regionScope: 'All Uttarakhand' | 'Garhwal High-Altitude' | 'Kumaon Biosphere' | 'Bugyal Meadows';
  category: 'Waste & Plastic' | 'Alpine Camping' | 'Permit & Carrying Capacity' | 'Wildlife & Flora';
  description: string;
  mandatory: boolean;
  active: boolean;
  lastUpdated: string;
}

export interface RegionalStat {
  circuitName: string;
  region: 'Garhwal' | 'Kumaon';
  monthlyVisitors: number;
  dailyCapLimit: number;
  wasteDivertedKg: number;
  homestayRevenueLakhs: number;
  complianceScore: number;
  status: 'Nominal' | 'Approaching Cap' | 'Restricted';
}

export const DEMO_USERS: Record<Exclude<UserRole, 'guest'>, UserProfile> = {
  traveler: {
    id: 'usr-trav-01',
    name: 'Aarav Rawat',
    email: 'aarav.yatri@uttarakhand.org',
    role: 'traveler',
    title: 'Registered Himalayan Yatri & Trekker',
    region: 'Dehradun / All-Circuit Pass',
  },
  homestay_owner: {
    id: 'usr-host-02',
    name: 'Kamla Devi Bisht',
    email: 'kamla.panchachuli@kumaonstays.in',
    role: 'homestay_owner',
    title: 'Koti Banal Heritage Host',
    region: 'Sarmoli, Munsiyari (Pithoragarh)',
    organizationOrProperty: 'Panchachuli Koti Heritage Homestay',
  },
  eco_board: {
    id: 'usr-org-03',
    name: 'Dr. Vikramaditya Negi',
    email: 'v.negi@uttarakhand-ecoboard.gov.in',
    role: 'eco_board',
    title: 'Director of Alpine Sustainability',
    region: 'Garhwal & Kumaon Biosphere Divisions',
    organizationOrProperty: 'Uttarakhand Eco-Tourism Development Board (UETDB)',
  },
};

export const CIRCUITS_DATA: CircuitItem[] = [
  {
    id: 'cir-chopta',
    title: 'Chopta, Tungnath & Chandrashila Sanctuary',
    region: 'Garhwal',
    district: 'Rudraprayag',
    altitude: '2,680m – 4,000m',
    duration: '4 Days · 3 Nights',
    durationDays: 4,
    difficulty: 'Easy-Moderate',
    bestSeason: 'April – June · Oct – Dec',
    permitRequired: 'Kedarnath Wildlife Sanctuary Eco-Pass',
    carbonFootprintKg: 11.5,
    carbonSavedPercent: 64,
    basePriceInr: 9600,
    summary:
      'Walk beneath centuries-old deodar and rhododendron canopies to the highest Shiva shrine in the world, crowned by a 360-degree summit view of Nanda Devi and Chaukhamba.',
    culturalHighlights: 'Ancient Katyuri stone temple craft & Sari village Pandav Nritya folk heritage',
    highlights: [
      'Deoria Tal Emerald Reflection Trail',
      'Tungnath 1,000-Year Stone Temple',
      'Chandrashila Dawn Ridge Ascent',
    ],
    interests: ['trekking', 'heritage', 'wildlife'],
    imageUrl: '/src/assets/images/circuit_chopta_tungnath_1794422456806.jpg',
    ecoCapacityRemaining: 28,
    dayByDayPlan: [
      {
        day: 1,
        title: 'Arrival at Sari Village & Deoria Tal Ascent',
        activity: 'Guided forest walk through rhododendron groves to emerald Deoria Tal lake (2,438m).',
        stayVillage: 'Sari Village Koti Retreat',
      },
      {
        day: 2,
        title: 'Chopta Eco-Meadows & Monal Birding',
        activity: 'Acclimatization walk along Kedarnath Wildlife Sanctuary cedar ridges.',
        stayVillage: 'Duggalbitta Solar Eco-Camp',
      },
      {
        day: 3,
        title: 'Tungnath Shrine & Chandrashila 4,000m Dawn Summit',
        activity: 'Stone-paved ascent to Tungnath and sunrise panorama of Nanda Devi & Chaukhamba.',
        stayVillage: 'Sari Village Koti Retreat',
      },
      {
        day: 4,
        title: 'Ukhimath Omkareshwar Heritage & Departure',
        activity: 'Visit winter seat of Kedarnath and local organic millet farmers collective.',
        stayVillage: 'Transit via Rudraprayag',
      },
    ],
  },
  {
    id: 'cir-munsiyari',
    title: 'Munsiyari & Khaliya Top Alpine Circuit',
    region: 'Kumaon',
    district: 'Pithoragarh',
    altitude: '2,200m – 3,500m',
    duration: '5 Days · 4 Nights',
    durationDays: 5,
    difficulty: 'Moderate',
    bestSeason: 'March – June · Sept – Nov',
    permitRequired: 'Forest Entry Pass at Munsiyari Checkpost',
    carbonFootprintKg: 14.2,
    carbonSavedPercent: 72,
    basePriceInr: 12800,
    summary:
      'Traverse ancient Johar Valley trade routes framed by the five snow peaks of Panchachuli, staying in community-owned stone homestays in Sarmoli.',
    culturalHighlights: 'Shauka Bhotiya handwoven sheep-wool carpets & Sarmoli women’s forest collective',
    highlights: [
      'Zero-Point Khaliya Bugyal Panorama',
      'Sarmoli Women Collective Homestays',
      'Tribal Heritage Museum & Lichen Sanctuary',
    ],
    interests: ['trekking', 'heritage', 'wildlife'],
    imageUrl: '/src/assets/images/circuit_munsiyari_alpine_1794422452693.jpg',
    ecoCapacityRemaining: 42,
    dayByDayPlan: [
      {
        day: 1,
        title: 'Sarmoli Village Orientation & Mesar Kund Walk',
        activity: 'Welcome Pahadi herbal tea and walk to sacred Mesar Kund wetland with women guides.',
        stayVillage: 'Sarmoli Heritage Homestay',
      },
      {
        day: 2,
        title: 'Khaliya Bugyal Alpine Meadow Ascent',
        activity: 'Trek through birch and rhododendron forest to 3,200m alpine pasture facing Panchachuli.',
        stayVillage: 'Khaliya Forest Rest Lodge',
      },
      {
        day: 3,
        title: 'Zero-Point 3,500m Sunrise & Return to Sarmoli',
        activity: 'Dawn ridge hike for 180-degree views of Panchachuli I–V, Nanda Devi, andNanda Kot.',
        stayVillage: 'Sarmoli Heritage Homestay',
      },
      {
        day: 4,
        title: 'Shauka Weaving Workshop & Lichen Park',
        activity: 'Hands-on natural dye wool weaving and visit to India’s first Lichen Conservation Park.',
        stayVillage: 'Sarmoli Heritage Homestay',
      },
      {
        day: 5,
        title: 'Birthi Falls Trail & Return Journey',
        activity: 'Morning halt at Kalamuni Pass temple and cascading Birthi waterfall.',
        stayVillage: 'Transit via Almora',
      },
    ],
  },
  {
    id: 'cir-tehri',
    title: 'Tehri Lake, Kanatal & Koti Banal Heritage Circuit',
    region: 'Garhwal',
    district: 'Tehri Garhwal',
    altitude: '1,550m – 2,590m',
    duration: '4 Days · 3 Nights',
    durationDays: 4,
    difficulty: 'Easy-Moderate',
    bestSeason: 'Year-Round (Oct – June Ideal)',
    permitRequired: 'Kodia Jungle Eco-Safari Pass',
    carbonFootprintKg: 9.8,
    carbonSavedPercent: 68,
    basePriceInr: 10800,
    summary:
      'Experience serene solar-powered houseboats and floating eco-huts overlooking emerald Tehri waters, paired with Kodia pine trails and traditional Garhwali mud-stone homesteads.',
    culturalHighlights: 'Submerged Old Tehri oral folklore, Garhwali Thadya dance & organic walnut orchards',
    highlights: [
      'Zero-Emission Kayaking on Tehri Reservoir',
      'Kodia Forest Musk Deer & Barking Deer Trail',
      'Surkanda Devi Ropeway & 360° Garhwal Ridge',
    ],
    interests: ['wellness', 'wildlife', 'heritage'],
    imageUrl: '/src/assets/images/hero_uttarakhand_peaks_1794422448719.jpg',
    ecoCapacityRemaining: 54,
    dayByDayPlan: [
      {
        day: 1,
        title: 'Chamba Orchard Walk & Tehri Eco-Shore Arrival',
        activity: 'Check into solar-heated hillside cottage overlooking the emerald Bhagirathi reservoir.',
        stayVillage: 'Tiwari Gaon (New Tehri)',
      },
      {
        day: 2,
        title: 'Non-Motorized Paddle & Floating Village Craft',
        activity: 'Morning kayaking across quiet fjord inlets and lunch with local fisher collectives.',
        stayVillage: 'Tiwari Gaon (New Tehri)',
      },
      {
        day: 3,
        title: 'Kanatal Kodia Forest Walk & Surkanda Ridge',
        activity: 'Guided 6 km pine forest walk spotting Himalayan langurs and wild orchids.',
        stayVillage: 'Kanatal Deodar Homestay',
      },
      {
        day: 4,
        title: 'Dhanaulti Eco-Park & Return',
        activity: 'Forest therapy session under deodar canopies at Amber & Dhara Eco-Parks.',
        stayVillage: 'Transit via Mussoorie/Dehradun',
      },
    ],
  },
  {
    id: 'cir-kausani',
    title: 'Kausani, Baijnath & Anasakti Ashram Tea Circuit',
    region: 'Kumaon',
    district: 'Bageshwar',
    altitude: '1,890m – 2,150m',
    duration: '4 Days · 3 Nights',
    durationDays: 4,
    difficulty: 'Easy-Moderate',
    bestSeason: 'Sept – May',
    permitRequired: 'Standard Green Yatri Registration',
    carbonFootprintKg: 9.2,
    carbonSavedPercent: 75,
    basePriceInr: 9200,
    summary:
      'Meditate along a 300-kilometer uninterrupted Himalayan amphitheater of Trisul, Nanda Devi, and Panchachuli, walking through organic orthodox tea gardens and 12th-century Katyuri stone temples.',
    culturalHighlights: 'Mahatma Gandhi’s 1929 Anasakti Ashram, Aipan folk art & Katyuri stone sculpture at Baijnath',
    highlights: [
      'Organic Girias Tea Estate Plucking & Tasting',
      '12th-Century Baijnath Gomti River Shrine',
      ' Rudradhari Waterfall & Pine Cave Walk',
    ],
    interests: ['wellness', 'heritage'],
    imageUrl: '/src/assets/images/homestay_kumaon_koti_1794422457700.jpg',
    ecoCapacityRemaining: 48,
    dayByDayPlan: [
      {
        day: 1,
        title: 'Kausani Ridge Sunset & Anasakti Ashram',
        activity: 'Evening contemplation at Anasakti Ashram watching alpenglow over Trisul and Nanda Devi.',
        stayVillage: 'Kausani Estate Homestay',
      },
      {
        day: 2,
        title: 'Organic Tea Garden Walk &Rudradhari Caves',
        activity: 'Walk through terraced orthodox tea bushes and trek 4 km to Rudradhari terraced falls.',
        stayVillage: 'Kausani Estate Homestay',
      },
      {
        day: 3,
        title: 'Baijnath Katyuri Temple Heritage & Bageshwar Confluence',
        activity: 'Explore 12th-century stone shrines on the Gomti river and Aipan art workshop.',
        stayVillage: 'Garur Valley Farmstay',
      },
      {
        day: 4,
        title: 'Sumitranandan Pant Gallery & Departure',
        activity: 'Visit the birthplace museum of the celebrated Chhayavad poet before departure.',
        stayVillage: 'Transit via Kathgodam',
      },
    ],
  },
  {
    id: 'cir-haridwar',
    title: 'Haridwar, Chilla Wildlife & Sacred Ganga Eco-Circuit',
    region: 'Garhwal',
    district: 'Haridwar / Pauri',
    altitude: '314m – 1,420m',
    duration: '3 Days · 2 Nights',
    durationDays: 3,
    difficulty: 'Easy-Moderate',
    bestSeason: 'Oct – April',
    permitRequired: 'Rajaji National Park Chilla Safari Permit',
    carbonFootprintKg: 7.4,
    carbonSavedPercent: 78,
    basePriceInr: 8400,
    summary:
      'Experience the sacred foothills where the emerald Ganga emerges from the Shivalik range—combining plastic-free ghat walks, Ayurvedic forest wellness, and elephant corridor conservation in Chilla.',
    culturalHighlights: 'Vedic Ganga Aarti at Har Ki Pauri, Kankhal ashram heritage & Gujjar forest pastoral traditions',
    highlights: [
      'Chilla Range Asian Elephant & Hornbill Corridor',
      'Zero-Waste Dawn Ghat Walk & Ayurvedic Kitchen',
      'Neel Dhara Migratory Bird Sanctuary',
    ],
    interests: ['wildlife', 'wellness', 'heritage'],
    imageUrl: '/src/assets/images/circuit_valley_flowers_1794422456554.jpg',
    ecoCapacityRemaining: 60,
    dayByDayPlan: [
      {
        day: 1,
        title: 'Kankhal Heritage Walk & Sacred Ganga Aarti',
        activity: 'Guided walk through ancient Kankhal havelis and eco-friendly leaf-diya Ganga Aarti.',
        stayVillage: 'Shyampur Ganga Eco-Retreat',
      },
      {
        day: 2,
        title: 'Rajaji Tiger Reserve (Chilla Range) Wildlife Track',
        activity: 'Morning jeep & foot track along the Rawasan river spotting wild elephants and pied hornbills.',
        stayVillage: 'Chilla Forest Edge Homestay',
      },
      {
        day: 3,
        title: 'Neel Dhara Birding & Ayurvedic Wellness Session',
        activity: 'Dawn birdwatching along the Ganga barrage and herbal oil therapy before departure.',
        stayVillage: 'Departure from Haridwar Junction',
      },
    ],
  },
  {
    id: 'cir-abbott-mount',
    title: 'Abbott Mount, Lohaghat & Pancheshwar Confluence Trail',
    region: 'Kumaon',
    district: 'Champawat',
    altitude: '1,750m – 2,130m',
    duration: '5 Days · 4 Nights',
    durationDays: 5,
    difficulty: 'Moderate',
    bestSeason: 'Oct – June',
    permitRequired: 'Champawat Forest Division Trail Registration',
    carbonFootprintKg: 12.1,
    carbonSavedPercent: 74,
    basePriceInr: 13500,
    summary:
      'Step into quiet deodar-draped heritage cottages in eastern Kumaon, exploring Swami Vivekananda’s Mayawati Advaita Ashram, ancient Banasur Fort, and the Mahakali–Saryu river confluence.',
    culturalHighlights: '10th-century Chand Dynasty stone Baleshwar temples & Advaita Ashram Mayawati library',
    highlights: [
      'Mayawati Advaita Ashram Silent Cedar Trail',
      '10th-Century Baleshwar Carved Stone Complex',
      'Pancheshwar Saryu–Kali River Eco-Corridor',
    ],
    interests: ['heritage', 'wellness', 'wildlife'],
    imageUrl: '/src/assets/images/homestay_kumaon_koti_1794422457700.jpg',
    ecoCapacityRemaining: 51,
    dayByDayPlan: [
      {
        day: 1,
        title: 'Lohaghat Deodar Valley & Abbott Mount Ascent',
        activity: 'Settle into a restored 1914 stone-and-pine cottage surrounded by 500 acres of oak forest.',
        stayVillage: 'Abbott Mount Heritage Cottage',
      },
      {
        day: 2,
        title: 'Mayawati Advaita Ashram & Tea Garden Trail',
        activity: 'Silent forest hike to Mayawati Ashram where Swami Vivekananda stayed in 1901.',
        stayVillage: 'Abbott Mount Heritage Cottage',
      },
      {
        day: 3,
        title: 'Banasur Ka Kila & Kranteshwar Ridge',
        activity: 'Trek to historic Banasur Fort for sweeping views of the Nepal border peaks.',
        stayVillage: 'Lohaghat Kumaoni Homestay',
      },
      {
        day: 4,
        title: 'Champawat Baleshwar Temple & Ek Hathiya Naula',
        activity: 'Inspect intricate Chand-era stone water temples (Naulas) and traditional stepwells.',
        stayVillage: 'Champawat Village Stay',
      },
      {
        day: 5,
        title: 'Pancheshwar Confluence Birding & Return',
        activity: 'Morning walk along the emerald Kali river gorge before returning via Tanakpur.',
        stayVillage: 'Transit via Tanakpur',
      },
    ],
  },
  {
    id: 'cir-valley-flowers',
    title: 'Valley of Flowers & Hemkund Biosphere Trail',
    region: 'Garhwal',
    district: 'Chamoli',
    altitude: '3,048m – 4,329m',
    duration: '6 Days · 5 Nights',
    durationDays: 6,
    difficulty: 'Challenging',
    bestSeason: 'July – September',
    permitRequired: 'Nanda Devi Biosphere Mandatory Day-Entry Permit',
    carbonFootprintKg: 16.8,
    carbonSavedPercent: 69,
    basePriceInr: 15400,
    summary:
      'A UNESCO World Heritage glacial corridor carpeted with over 600 endemic alpine species including the rare Himalayan Blue Poppy and Brahma Kamal.',
    culturalHighlights: 'Bhotiya transhumance shepherd heritage of Bhyundar Valley & sacred Hemkund Lokpal',
    highlights: [
      'Ghangaria Base Eco-Corridor',
      'Pushpawati River Glacial Meadows',
      'Plastic-Free Biometric Bottle Tagging',
    ],
    interests: ['trekking', 'wildlife'],
    imageUrl: '/src/assets/images/circuit_valley_flowers_1794422456554.jpg',
    ecoCapacityRemaining: 19,
    dayByDayPlan: [
      {
        day: 1,
        title: 'Joshimath Bhotiya Heritage Orientation',
        activity: 'Biometric biosphere registration and briefing on zero-plastic glacial rules.',
        stayVillage: 'Joshimath Community Homestay',
      },
      {
        day: 2,
        title: 'Govindghat to Pulna & Ghangaria Ascent (13 km)',
        activity: 'Trek along the roaring Lakshman Ganga gorge to Ghangaria base village (3,048m).',
        stayVillage: 'Ghangaria Eco-Log Hut',
      },
      {
        day: 3,
        title: 'Valley of Flowers UNESCO Core Zone Exploration',
        activity: 'Botanical walk spotting Blue Poppies, Cobra Lilies, and Himalayan Marmots.',
        stayVillage: 'Ghangaria Eco-Log Hut',
      },
      {
        day: 4,
        title: 'Hemkund Sahib Glacial Lake (4,329m) Ascent',
        activity: 'Steep stone-stair climb to the crystal glacial lake surrounded by seven snow peaks.',
        stayVillage: 'Ghangaria Eco-Log Hut',
      },
      {
        day: 5,
        title: 'Descent to Govindghat & Mana Village Visit',
        activity: 'Return trek and afternoon visit to Mana—India’s first Himalayan border village.',
        stayVillage: 'Mana Stone Homestay',
      },
      {
        day: 6,
        title: 'Alaknanda Prayag Confluence & Departure',
        activity: 'Halt at Vishnuprayag and Nandaprayag confluences on return journey.',
        stayVillage: 'Transit via Rishikesh',
      },
    ],
  },
];

export const HOMESTAYS_DATA: HomestayProperty[] = [
  {
    id: 'hs-sarmoli-01',
    name: 'Panchachuli Koti Heritage Homestay',
    village: 'Sarmoli (Munsiyari)',
    district: 'Pithoragarh',
    region: 'Kumaon',
    altitude: '2,250m',
    architectureStyle: 'Traditional Kumaoni Dressed-Stone & Deodar Slate',
    hostName: 'Kamla Devi Bisht',
    pricePerNightInr: 2400,
    roomsAvailable: 3,
    totalRooms: 4,
    rating: 4.9,
    communityImpactScore: '9.8 / 10 Impact',
    communitySharePercent: 88,
    ecoBadges: ['Solar-Powered', 'Organic Farm-to-Table', 'Women Collective'],
    amenities: [
      'Solar Passive Heating',
      'Organic Mandua & Bhatt Kitchen',
      'Guided Birdwatching',
      'High-Speed Fiber Wi-Fi',
    ],
    imageUrl: '/src/assets/images/homestay_kumaon_koti_1794422457700.jpg',
    solarPowered: true,
    organicFarmToTable: true,
  },
  {
    id: 'hs-sari-02',
    name: 'Deoria Tal Koti Banal Retreat',
    village: 'Sari Village (Chopta)',
    district: 'Rudraprayag',
    region: 'Garhwal',
    altitude: '2,010m',
    architectureStyle: 'Earthquake-Resilient Koti Banal Timber-Stone',
    hostName: 'Mahabir Singh Negi',
    pricePerNightInr: 2100,
    roomsAvailable: 2,
    totalRooms: 3,
    rating: 4.8,
    communityImpactScore: '9.6 / 10 Impact',
    communitySharePercent: 85,
    ecoBadges: ['Solar-Powered', 'Rainwater Harvested', 'Zero-Plastic Kitchen'],
    amenities: [
      'Rainwater Harvesting',
      'Garhwali Copper-Vessel Dining',
      'Bonfire Courtyard',
      'Trekking Gear Library',
    ],
    imageUrl: '/src/assets/images/circuit_chopta_tungnath_1794422456806.jpg',
    solarPowered: true,
    organicFarmToTable: true,
  },
  {
    id: 'hs-binsar-03',
    name: 'Kasar & Binsar Oakwood Sanctuary',
    village: 'Dalar (Binsar Sanctuary)',
    district: 'Almora',
    region: 'Kumaon',
    altitude: '2,420m',
    architectureStyle: 'Colonial-Kumaoni Lime Mortar & Likhai Woodwork',
    hostName: 'Deepak Joshi',
    pricePerNightInr: 3200,
    roomsAvailable: 4,
    totalRooms: 5,
    rating: 4.9,
    communityImpactScore: '9.5 / 10 Impact',
    communitySharePercent: 82,
    ecoBadges: ['Solar Microgrid', 'Organic Farm-to-Table', 'Dark-Sky Certified'],
    amenities: [
      'Zero-Waste Composting',
      'Rhododendron Squash Apiary',
      'Star-Gazing Deck',
      'Solar Microgrid',
    ],
    imageUrl: '/src/assets/images/hero_uttarakhand_peaks_1794422448719.jpg',
    solarPowered: true,
    organicFarmToTable: true,
  },
  {
    id: 'hs-tehri-04',
    name: 'Bhagirathi Koti & Walnut Orchard Stay',
    village: 'Tiwari Gaon (Tehri Lake)',
    district: 'Tehri Garhwal',
    region: 'Garhwal',
    altitude: '1,780m',
    architectureStyle: 'Vernacular Garhwali Pathal-Slate & Mud-Plaster',
    hostName: 'Surendra Singh Panwar',
    pricePerNightInr: 2300,
    roomsAvailable: 3,
    totalRooms: 4,
    rating: 4.8,
    communityImpactScore: '9.4 / 10 Impact',
    communitySharePercent: 86,
    ecoBadges: ['Organic Farm-to-Table', 'Spring Water Refill', 'Local Artisan Guild'],
    amenities: [
      'Heirloom Red Rice & Jhangora Meals',
      'Tehri Lake Kayak Access',
      'Walnut & Apricot Orchard Walk',
      'Solar Water Heating',
    ],
    imageUrl: '/src/assets/images/circuit_munsiyari_alpine_1794422452693.jpg',
    solarPowered: true,
    organicFarmToTable: true,
  },
];

export const INITIAL_INQUIRIES: BookingInquiry[] = [
  {
    id: 'INQ-8921',
    homestayId: 'hs-sarmoli-01',
    homestayName: 'Panchachuli Koti Heritage Homestay',
    guestName: 'Meera Krishnan',
    guestEmail: 'meera.k@bengaluru.in',
    checkIn: '2026-11-18',
    checkOut: '2026-11-22',
    guests: 2,
    totalAmountInr: 9600,
    status: 'Pending',
    notes: 'Interested in the Khaliya Top sunrise trek and learning traditional Kumaoni wool weaving.',
    createdAt: '2 hours ago',
  },
  {
    id: 'INQ-8914',
    homestayId: 'hs-sarmoli-01',
    homestayName: 'Panchachuli Koti Heritage Homestay',
    guestName: 'Rohan & Kabir Verma',
    guestEmail: 'rohan.verma@delhi.org',
    checkIn: '2026-11-25',
    checkOut: '2026-11-28',
    guests: 3,
    totalAmountInr: 7200,
    status: 'Confirmed',
    notes: 'Arriving via Kathgodam & Almora. Requesting gluten-free Mandua rotis for dinner.',
    createdAt: '1 day ago',
  },
  {
    id: 'INQ-8902',
    homestayId: 'hs-sari-02',
    homestayName: 'Deoria Tal Koti Banal Retreat',
    guestName: 'Ananya Sen',
    guestEmail: 'ananya.sen@kolkata.net',
    checkIn: '2026-12-02',
    checkOut: '2026-12-05',
    guests: 2,
    totalAmountInr: 6300,
    status: 'Confirmed',
    notes: 'Early morning Tungnath & Chandrashila ascent guide needed.',
    createdAt: '3 days ago',
  },
];

export const INITIAL_ECO_GUIDELINES: EcoGuideline[] = [
  {
    id: 'eco-01',
    code: 'UETDB-2026-01',
    title: 'High-Altitude Bugyal Camping Prohibition above 3,000m',
    regionScope: 'Bugyal Meadows',
    category: 'Alpine Camping',
    description:
      'Following Hon’ble High Court orders, overnight pitching of tents on fragile alpine sub-meadows (Dayara, Ali-Bedni, Khaliya, Chopta) is strictly prohibited. Camp only at designated below-treeline forest clearings.',
    mandatory: true,
    active: true,
    lastUpdated: 'Nov 2026',
  },
  {
    id: 'eco-02',
    code: 'UETDB-2026-02',
    title: 'QR-Tagged Plastic Deposit & Return Protocol',
    regionScope: 'All Uttarakhand',
    category: 'Waste & Plastic',
    description:
      'All PET bottles and packaged wrappers entering Kedarnath, Valley of Flowers, and Munsiyari corridors must carry a refundable ₹50 Digital Green QR stamp.',
    mandatory: true,
    active: true,
    lastUpdated: 'Oct 2026',
  },
  {
    id: 'eco-03',
    code: 'UETDB-2026-03',
    title: 'Daily Carrying Capacity & Biometric Yatri Registration',
    regionScope: 'Garhwal High-Altitude',
    category: 'Permit & Carrying Capacity',
    description:
      'Maximum 600 trekkers/day across UNESCO biosphere trails. Mandatory SDRF weather-linked GPS beacon check at Joshimath and Sonprayag.',
    mandatory: true,
    active: true,
    lastUpdated: 'Nov 2026',
  },
  {
    id: 'eco-04',
    code: 'UETDB-2026-04',
    title: 'Silent Zone Acoustic & Night-Sky Protection',
    regionScope: 'Kumaon Biosphere',
    category: 'Wildlife & Flora',
    description:
      'No loudspeaker playback or high-lumen floodlights after 19:00 hrs in Binsar, Mukteshwar, Abbott Mount, and Askot Musk Deer Sanctuary.',
    mandatory: false,
    active: true,
    lastUpdated: 'Sep 2026',
  },
];

export const REGIONAL_SUSTAINABILITY_STATS: RegionalStat[] = [
  {
    circuitName: 'Chopta – Tungnath – Deoria Tal',
    region: 'Garhwal',
    monthlyVisitors: 4120,
    dailyCapLimit: 250,
    wasteDivertedKg: 1840,
    homestayRevenueLakhs: 38.4,
    complianceScore: 96,
    status: 'Nominal',
  },
  {
    circuitName: 'Munsiyari – Sarmoli – Johar Valley',
    region: 'Kumaon',
    monthlyVisitors: 2680,
    dailyCapLimit: 180,
    wasteDivertedKg: 1420,
    homestayRevenueLakhs: 44.2,
    complianceScore: 98,
    status: 'Nominal',
  },
  {
    circuitName: 'Tehri Lake – Kanatal – Kodia Forest',
    region: 'Garhwal',
    monthlyVisitors: 3890,
    dailyCapLimit: 300,
    wasteDivertedKg: 1590,
    homestayRevenueLakhs: 35.6,
    complianceScore: 95,
    status: 'Nominal',
  },
  {
    circuitName: 'Kausani – Baijnath – Garur Tea Belt',
    region: 'Kumaon',
    monthlyVisitors: 3150,
    dailyCapLimit: 240,
    wasteDivertedKg: 1280,
    homestayRevenueLakhs: 31.4,
    complianceScore: 97,
    status: 'Nominal',
  },
  {
    circuitName: 'Nainital – Pangot – Sattal Lake Belt',
    region: 'Kumaon',
    monthlyVisitors: 8940,
    dailyCapLimit: 500,
    wasteDivertedKg: 3290,
    homestayRevenueLakhs: 62.1,
    complianceScore: 89,
    status: 'Approaching Cap',
  },
  {
    circuitName: 'Valley of Flowers – Ghangaria Biosphere',
    region: 'Garhwal',
    monthlyVisitors: 1950,
    dailyCapLimit: 150,
    wasteDivertedKg: 2110,
    homestayRevenueLakhs: 29.8,
    complianceScore: 99,
    status: 'Nominal',
  },
  {
    circuitName: 'Abbott Mount – Lohaghat – Champawat',
    region: 'Kumaon',
    monthlyVisitors: 1620,
    dailyCapLimit: 140,
    wasteDivertedKg: 940,
    homestayRevenueLakhs: 24.7,
    complianceScore: 98,
    status: 'Nominal',
  },
];
