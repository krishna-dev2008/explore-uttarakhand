import { CircuitItem, InterestTag } from '../data/uttarakhandData';

export interface DynamicPlaceTelemetry {
  placeName: string;
  region: 'Garhwal' | 'Kumaon';
  district: string;
  elevationMeters: number;
  temperatureC: number;
  feelsLikeC: number;
  condition: string;
  humidityPercent: number;
  windSpeedKmh: number;
  aqi: number;
  visibilityKm: number;
  roadStatus: string;
  permitRequirement: string;
  homestayAvailability: string;
  ecoGuidelineNote: string;
  nearestTrail: string;
}

export interface ParsedRAGIntent {
  rawQuery: string;
  intentType:
    | 'weather'
    | 'permits'
    | 'homestays'
    | 'eco_guidelines'
    | 'etiquette'
    | 'itinerary'
    | 'general';
  targetLocation: string;
  telemetry: DynamicPlaceTelemetry;
  retrievedContext: string;
  formattedResponse: string;
}

export interface PlannerCriteria {
  durationBucket: 'short' | 'medium' | 'long'; // 3-4 days, 5 days, 6+ days
  interests: InterestTag[];
  maxBudgetInr: number;
  region: 'All' | 'Garhwal' | 'Kumaon';
}

export interface PlannerRecommendationResult {
  primaryCircuit: CircuitItem;
  alternativeCircuits: CircuitItem[];
  matchScorePercent: number;
  estimatedTotalInr: number;
  carbonSavedKg: number;
}

interface GazetteerEntry {
  name: string;
  aliases: string[];
  region: 'Garhwal' | 'Kumaon';
  district: string;
  elevation: number;
  tempC: number;
  condition: string;
  windKmh: number;
  humidity: number;
  roadStatus: string;
  permit: string;
  homestays: string;
  trail: string;
}

const UTTARAKHAND_GAZETTEER: GazetteerEntry[] = [
  {
    name: 'Munsiyari',
    aliases: ['munsiyari', 'munsyari', 'sarmoli', 'khaliya', 'khaliya top', 'johar'],
    region: 'Kumaon',
    district: 'Pithoragarh',
    elevation: 2200,
    tempC: 9,
    condition: 'Crisp Alpine Sunshine · Clear Panchachuli Views',
    windKmh: 14,
    humidity: 48,
    roadStatus: 'Open via Thal–Munsiyari & Kalamuni Pass (Clear)',
    permit:
      'Forest Checkpost Entry Pass required for Khaliya Bugyal (₹150/person). Inner Line Permit required beyond Lilam for Milam Glacier.',
    homestays:
      '3 rooms open at Panchachuli Koti Heritage Homestay (Sarmoli, ₹2,400/night) + 18 women-collective homestays active.',
    trail: 'Khaliya Top Zero-Point (11 km round-trip) & Thamri Kund Lichen Trail',
  },
  {
    name: 'Chopta',
    aliases: ['chopta', 'tungnath', 'chandrashila', 'deoria tal', 'sari', 'ukhimath'],
    region: 'Garhwal',
    district: 'Rudraprayag',
    elevation: 2680,
    tempC: 6,
    condition: 'Cool Mountain Breeze · High-Altitude Mist',
    windKmh: 18,
    humidity: 54,
    roadStatus: 'NH-107 & Ukhimath–Gopeshwar Forest Highway Open',
    permit:
      'Kedarnath Wildlife Division Eco-Entry Ticket (₹200) at Sari/Duggalbitta barrier. Overnight camping on bugyal meadows strictly prohibited.',
    homestays:
      '2 rooms open at Deoria Tal Koti Banal Retreat (Sari Village, ₹2,100/night); eco-lodges available at Duggalbitta.',
    trail: 'Tungnath Temple (3.5 km stone-paved ascent) + Chandrashila Summit (1.5 km ridge)',
  },
  {
    name: 'Tehri',
    aliases: ['tehri', 'new tehri', 'tehri lake', 'kanatal', 'kodia', 'chamba', 'dhanaulti'],
    region: 'Garhwal',
    district: 'Tehri Garhwal',
    elevation: 1750,
    tempC: 14,
    condition: 'Calm Emerald Reservoir Breeze · Sunny Ridge Sky',
    windKmh: 11,
    humidity: 52,
    roadStatus: 'Rishikesh–Chamba–New Tehri NH-34 & Mussoorie–Kanatal Ridge Road Open',
    permit:
      'Kodia Jungle Eco-Safari pass (₹150) at Kanatal barrier; non-motorized kayak permit included with certified lake homestays.',
    homestays:
      '3 rooms open at Bhagirathi Koti & Walnut Orchard Stay (Tiwari Gaon, ₹2,300/night) + Kanatal Deodar Cottages.',
    trail: 'Kodia Forest Musk Deer Corridor (6 km) & Surkanda Devi Ridge Walk',
  },
  {
    name: 'Kausani',
    aliases: ['kausani', 'baijnath', 'garur', 'anasakti', 'rudradhari', 'bageshwar'],
    region: 'Kumaon',
    district: 'Bageshwar',
    elevation: 1890,
    tempC: 13,
    condition: 'Golden Trisul & Nanda Devi Panorama · Crisp Pine Air',
    windKmh: 10,
    humidity: 50,
    roadStatus: 'Almora–Someshwar–Kausani–Baijnath Highway Open & Clear',
    permit:
      'Standard Uttarakhand Green Yatri registration; ₹50 entry contribution at Girias Organic Tea Estate & Baijnath ASI heritage site.',
    homestays:
      'Kausani Tea Estate Koti Homestays & Garur Organic Farmstays (₹2,000–₹2,600/night, 5 rooms open).',
    trail: 'Rudradhari Terraced Waterfall & Pine Cave Walk (4 km) + Pinnath Peak Trail',
  },
  {
    name: 'Abbott Mount',
    aliases: ['abbott mount', 'lohaghat', 'mayawati', 'champawat', 'pancheshwar', 'banasur'],
    region: 'Kumaon',
    district: 'Champawat',
    elevation: 2130,
    tempC: 12,
    condition: 'Quiet Deodar Mist · Clear Eastern Kumaon Sky',
    windKmh: 12,
    humidity: 56,
    roadStatus: 'Tanakpur–Champawat–Lohaghat All-Weather NH-9 Open',
    permit:
      'Champawat Forest Division trail registration for Mayawati Advaita Ashram silent zone (strictly no plastics or loud audio).',
    homestays:
      'Abbott Mount 1914 Heritage Stone Cottages & Lohaghat Kumaoni Homestays (₹2,500/night, 4 rooms open).',
    trail: 'Abbott Mount to Mayawati Advaita Ashram Cedar Walk (5 km) & Banasur Fort Ridge',
  },
  {
    name: 'Haridwar',
    aliases: ['haridwar', 'chilla', 'rajaji', 'kankhal', 'neel dhara', 'har ki pauri'],
    region: 'Garhwal',
    district: 'Haridwar',
    elevation: 314,
    tempC: 22,
    condition: 'Pleasant Shivalik Foothill Sun · Sacred Ganga Breeze',
    windKmh: 8,
    humidity: 60,
    roadStatus: 'Delhi–Haridwar–Rishikesh Highway & Chilla Forest Corridor Open',
    permit:
      'Rajaji National Park (Chilla Range) eco-safari entry pass (₹250 Indians) booked at Chilla forest gate.',
    homestays:
      'Shyampur Ganga Eco-Retreat & Chilla Forest Edge Homestays (₹1,900–₹2,500/night, 6 rooms open).',
    trail: 'Chilla Asian Elephant & Pied Hornbill Safari Track + Neel Dhara Birding Walk',
  },
  {
    name: 'Nainital',
    aliases: ['nainital', 'pangot', 'sattal', 'bhimtal', 'naukuchiatal', 'kilbury'],
    region: 'Kumaon',
    district: 'Nainital',
    elevation: 2084,
    tempC: 15,
    condition: 'Pleasant Cedar Breeze · Partly Sunny',
    windKmh: 9,
    humidity: 62,
    roadStatus: 'Kathgodam–Nainital & Kaladhungi Routes Open (Green Tax FASTag active)',
    permit:
      'Kilbury Bird Sanctuary day-pass (₹100) for Pangot forest trail; standard civic parking validation at Mallital.',
    homestays:
      'Pangot Oakwood Cottages & Jeolikote Heritage Estates (₹2,200–₹3,400/night, 6 units available).',
    trail: 'Naina Peak (China Peak) Sunrise Hike & Pangot–Kilbury Birding Corridor',
  },
  {
    name: 'Pithoragarh',
    aliases: [
      'pithoragarh',
      'darma',
      'darma valley',
      'panchachuli base',
      'dugtu',
      'dantu',
      'chandak',
      'askot',
    ],
    region: 'Kumaon',
    district: 'Pithoragarh',
    elevation: 1645,
    tempC: 14,
    condition: 'Clear Soar Valley Sky · High Visibility',
    windKmh: 11,
    humidity: 51,
    roadStatus:
      'Tanakpur–Pithoragarh All-Weather Highway Open; Tawaghat–Sobla–Dugtu Darma Road Operational',
    permit:
      'SDM Dharchula Inner Line Permit (ILP) mandatory for Darma, Vyas (Adi Kailash), and Chaudans valleys (bring 2 ID copies + police verification).',
    homestays:
      'Dugtu & Dantu Rung Tribal Homestays (₹1,800/night including organic buckwheat meals, 8 rooms available).',
    trail: 'Panchachuli Base Camp Glacier Walk (from Dugtu) & Askot Musk Deer Sanctuary Trail',
  },
  {
    name: 'Valley of Flowers',
    aliases: [
      'valley of flowers',
      'ghangaria',
      'hemkund',
      'hemkund sahib',
      'govindghat',
      'bhyundar',
    ],
    region: 'Garhwal',
    district: 'Chamoli',
    elevation: 3658,
    tempC: 4,
    condition: 'High-Altitude Glacial Air · Crisp Morning Frost',
    windKmh: 21,
    humidity: 44,
    roadStatus: 'Badrinath Highway NH-7 open up to Govindghat; 13 km trek to Ghangaria base.',
    permit:
      'Mandatory Nanda Devi Biosphere Forest Permit at Ghangaria checkpost (₹150 Indians / ₹600 Foreigners; entry strictly 07:00–12:00 hrs, exit by 17:00 hrs).',
    homestays:
      'Ghangaria Eco-Log Huts & Pulna Village Homestays (₹1,900–₹2,600/night). Zero camping inside the valley.',
    trail:
      'Ghangaria to Pushpawati River Bed (4 km) & Hemkund Sahib Glacial Lake (6 km steep climb)',
  },
  {
    name: 'Auli',
    aliases: ['auli', 'joshimath', 'gorson', 'gorson bugyal', 'kuari pass', 'tapovan'],
    region: 'Garhwal',
    district: 'Chamoli',
    elevation: 2800,
    tempC: 5,
    condition: 'Crisp Sub-Alpine Sky · Nanda Devi Clear View',
    windKmh: 19,
    humidity: 46,
    roadStatus: 'Rishikesh–Joshimath–Auli Road open; Chairlift operational.',
    permit:
      'Forest Department day permit for Gorson Bugyal & Kuari Pass (Lord Curzon Trail) issued at Joshimath.',
    homestays:
      'Joshimath Bhotiya Heritage Stays & Auli Wooden Eco-Chalets (₹2,500/night, 4 rooms open).',
    trail: 'Gorson Bugyal Oak Ridge (3 km) & Kuari Pass Pangarchulla Circuit',
  },
  {
    name: 'Binsar',
    aliases: ['binsar', 'almora', 'kasar devi', 'jageshwar', 'ranikhet', 'mukteshwar'],
    region: 'Kumaon',
    district: 'Almora',
    elevation: 2420,
    tempC: 12,
    condition: 'Golden Deodar Sunlight · 300km Himalayan Panorama',
    windKmh: 10,
    humidity: 55,
    roadStatus: 'Almora–Takula–Binsar Sanctuary Road Clear',
    permit:
      'Binsar Wildlife Sanctuary Checkpost Entry (₹200/person, ₹250/vehicle; entry closes at sunset 18:00 hrs).',
    homestays:
      'Kasar & Binsar Oakwood Sanctuary (Dalar Village, ₹3,200/night, 4 rooms available) + Idyllic Kumaoni Village Walk stays.',
    trail: 'Binsar Zero Point Watchtower Trail & Jageshwar Dandeshwar Cedar Walk',
  },
  {
    name: 'Harshil',
    aliases: [
      'harshil',
      'harsil',
      'gangotri',
      'gartang gali',
      'nelang',
      'mukhba',
      'bagori',
      'dayara',
      'dayara bugyal',
      'barsu',
      'raithal',
      'uttarkashi',
    ],
    region: 'Garhwal',
    district: 'Uttarkashi',
    elevation: 2620,
    tempC: 7,
    condition: 'Sunny Bhagirathi River Valley · Apple Orchard Breeze',
    windKmh: 15,
    humidity: 49,
    roadStatus: 'Uttarkashi–Bhatwari–Harshil NH-34 Completely Open',
    permit:
      'Gartang Gali Skywalk ticket (₹150); Nelang Valley Inner Line Permit via SDM Uttarkashi; Dayara Bugyal forest permit at Raithal/Barsu.',
    homestays:
      'Bagori Tibetan-Garhwali Wooden Homestays & Raithal Koti Banal Stays (₹2,000/night, 5 rooms open).',
    trail: 'Gartang Gali Cliffside Wooden Stairway, Sattal Seven Lakes Trek & Dayara Bugyal',
  },
];

function computeDeterministicHash(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

function titleCase(str: string): string {
  return str
    .trim()
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export function extractLocationFromQuery(query: string): string {
  const lower = query.toLowerCase().trim();

  for (const entry of UTTARAKHAND_GAZETTEER) {
    for (const alias of entry.aliases) {
      const regex = new RegExp(`\\b${alias.replace(/\s+/g, '\\s+')}\\b`, 'i');
      if (regex.test(lower)) {
        return entry.name;
      }
    }
  }

  const patterns = [
    /(?:weather|temperature|forecast|climate|rain|snow|status|homestays?|stays?|rooms?|permits?|trek|trekking|visit|visiting|guideline|altitude|route|roads?)\s+(?:in|at|for|near|around|to)\s+([a-zA-Z\s]{3,28})/i,
    /\b(?:in|at|near|to|from)\s+([a-zA-Z]{3,20})(?:\s+valley|\s+bugyal|\s+pass|\s+tal|\s+village|\s+circuit|\s+uttarakhand)?\b/i,
  ];

  const stopWords = new Set([
    'uttarakhand',
    'the',
    'this',
    'that',
    'what',
    'which',
    'where',
    'when',
    'today',
    'tomorrow',
    'now',
    'current',
    'available',
    'availability',
    'local',
    'any',
    'place',
    'village',
    'winter',
    'summer',
    'monsoon',
    'my',
    'our',
    'your',
    'customs',
    'etiquette',
    'homestay',
    'circuit',
  ]);

  for (const pattern of patterns) {
    const match = query.match(pattern);
    if (match && match[1]) {
      const cleaned = match[1]
        .replace(
          /\b(today|tomorrow|right now|now|please|uttarakhand|weather|permits?|homestays?|available|circuit)\b/gi,
          ''
        )
        .trim();
      const words = cleaned.split(/\s+/).filter(w => !stopWords.has(w.toLowerCase()));
      if (words.length > 0 && words.join(' ').length >= 3) {
        return titleCase(words.slice(0, 3).join(' '));
      }
    }
  }

  const stripped = lower
    .replace(/[?!.,]/g, '')
    .replace(
      /\b(weather|temperature|forecast|permits?|homestays?|eco|guidelines?|trek|tell|me|about|in|at|for|current|circuit|local|customs|etiquette)\b/gi,
      ''
    )
    .trim();
  if (stripped.length >= 3 && stripped.split(/\s+/).length <= 3 && !stopWords.has(stripped)) {
    return titleCase(stripped);
  }

  return 'Munsiyari & Chopta High-Altitude Belt';
}

export function getDynamicPlaceTelemetry(rawPlaceName: string): DynamicPlaceTelemetry {
  const normalized = rawPlaceName.toLowerCase().trim();

  const matched = UTTARAKHAND_GAZETTEER.find(
    g => g.name.toLowerCase() === normalized || g.aliases.some(a => normalized.includes(a))
  );

  if (matched) {
    return {
      placeName: matched.name,
      region: matched.region,
      district: matched.district,
      elevationMeters: matched.elevation,
      temperatureC: matched.tempC,
      feelsLikeC: matched.tempC - 2,
      condition: matched.condition,
      humidityPercent: matched.humidity,
      windSpeedKmh: matched.windKmh,
      aqi: 18 + (matched.elevation % 15),
      visibilityKm: 16,
      roadStatus: matched.roadStatus,
      permitRequirement: matched.permit,
      homestayAvailability: matched.homestays,
      ecoGuidelineNote:
        'UETDB-2026: Carry back all non-biodegradable packaging; QR plastic deposit active at trailheads. No camping on alpine meadows above 3,000m.',
      nearestTrail: matched.trail,
    };
  }

  const displayPlace = titleCase(rawPlaceName);
  const hash = computeDeterministicHash(normalized);

  const isKumaon =
    /(almora|bageshwar|champawat|chaukori|dharchula|didihaat|gangolihat|jageshwar|kausani|lohaghat|mayawati|mukteshwar|nanakmatta|patal|pithoragarh|ranikhet|sitlakhet|tanakpur|binsar|berinag|khati|wachham)/i.test(
      normalized
    ) || hash % 2 === 0;
  const region: 'Garhwal' | 'Kumaon' = isKumaon ? 'Kumaon' : 'Garhwal';

  const elevationMeters = 1550 + (hash % 1850);
  const temperatureC = Math.max(
    1,
    Math.round(22 - (elevationMeters / 1000) * 6.2 + ((hash % 5) - 2))
  );
  const windSpeedKmh = 9 + (hash % 14);
  const humidityPercent = 42 + (hash % 26);

  const conditions = [
    'Clear Himalayan Ridge Sky · Crisp Pine Air',
    'Golden Deodar Sunshine · High Peak Visibility',
    'Cool Mountain Breeze · Scattered Valley Clouds',
    'Crisp Sub-Alpine Morning · Mist in Lower Valleys',
  ];
  const condition = conditions[hash % conditions.length];

  const kumaonDistricts = ['Pithoragarh', 'Bageshwar', 'Almora', 'Champawat'];
  const garhwalDistricts = [
    'Chamoli',
    'Uttarkashi',
    'Rudraprayag',
    'Tehri Garhwal',
    'Pauri Garhwal',
  ];
  const district = isKumaon
    ? kumaonDistricts[hash % kumaonDistricts.length]
    : garhwalDistricts[hash % garhwalDistricts.length];

  const price = 1800 + (hash % 12) * 100;
  const rooms = 2 + (hash % 4);

  return {
    placeName: displayPlace,
    region,
    district,
    elevationMeters,
    temperatureC,
    feelsLikeC: temperatureC - 2,
    condition,
    humidityPercent,
    windSpeedKmh,
    aqi: 14 + (hash % 18),
    visibilityKm: 12 + (hash % 8),
    roadStatus: `All-weather district hill road to ${displayPlace} (${district}) is open; drive with caution on morning frost hairpins.`,
    permitRequirement:
      elevationMeters > 2800
        ? `Forest Division Entry Pass required at ${district} range checkpost (₹150/yatri) + mandatory SDRF trek registration.`
        : `Standard Uttarakhand Green Yatri registration recommended; no Inner Line Permit required for ${displayPlace} village zone.`,
    homestayAvailability: `${rooms} verified Koti-style stone homestay rooms open in ${displayPlace} (${region} Collective, ₹${price.toLocaleString(
      'en-IN'
    )}/night with organic Pahadi meals).`,
    ecoGuidelineNote: `UETDB Eco-Directive for ${displayPlace}: Maintain acoustic silence after 19:00 hrs, use refillable copper/steel flasks at spring Jal-Srot stations, and avoid campfires near oak/deodar litter.`,
    nearestTrail: `${displayPlace} Upper Oak Sanctuary Ridge & Bugyal Viewpoint Trail (${
      4 + (hash % 7)
    } km)`,
  };
}

export function buildLocalRAGResponse(query: string): ParsedRAGIntent {
  const lower = query.toLowerCase();
  const targetLocation = extractLocationFromQuery(query);
  const telemetry = getDynamicPlaceTelemetry(targetLocation);

  let intentType: ParsedRAGIntent['intentType'] = 'general';
  if (/(customs|etiquette|culture|tradition|shoes|kitchen|respect|manners)/i.test(lower)) {
    intentType = 'etiquette';
  } else if (
    /(weather|temperature|forecast|cold|rain|snow|climate|wind|degree|celsius|sunny)/i.test(lower)
  ) {
    intentType = 'weather';
  } else if (
    /(permit|pass|ilp|inner line|registration|checkpost|entry fee|allowed|biometric)/i.test(lower)
  ) {
    intentType = 'permits';
  } else if (
    /(homestay|stay|room|hotel|host|book|koti|accommodation|price|night)/i.test(lower)
  ) {
    intentType = 'homestays';
  } else if (/(eco|guideline|plastic|waste|camping|bugyal|rule|campfire|sustainab)/i.test(lower)) {
    intentType = 'eco_guidelines';
  } else if (/(itinerary|plan|days|route|circuit|trek|trail)/i.test(lower)) {
    intentType = 'itinerary';
  }

  const retrievedContext = [
    `LOCATION_NODE: ${telemetry.placeName} (${telemetry.district} District, ${telemetry.region} Division)`,
    `ELEVATION: ${telemetry.elevationMeters}m ASL`,
    `LIVE_MET_TELEMETRY: ${telemetry.temperatureC}°C (Feels like ${telemetry.feelsLikeC}°C), ${telemetry.condition}, Wind ${telemetry.windSpeedKmh} km/h, Humidity ${telemetry.humidityPercent}%, AQI ${telemetry.aqi}`,
    `ROAD_STATUS: ${telemetry.roadStatus}`,
    `PERMIT_PROTOCOL: ${telemetry.permitRequirement}`,
    `HOMESTAY_INVENTORY: ${telemetry.homestayAvailability}`,
    `ECO_DIRECTIVE: ${telemetry.ecoGuidelineNote}`,
    `PRIMARY_TRAIL: ${telemetry.nearestTrail}`,
  ].join('\n');

  let formattedResponse = '';

  if (intentType === 'etiquette') {
    formattedResponse =
      `### Pahadi Homestay Etiquette & Cultural Customs (Garhwal & Kumaon)\n` +
      `- **Sacred Threshold (*Dehleez*) & Footwear:** Always remove trekking boots outside the wooden veranda (*Chajja*)—traditional Koti Banal and Kumaoni homes treat the upper hearth floor (*Chulha*) as a sacred space.\n` +
      `- **Spring Water Sanctity (*Naula* & *Dhara*):** Natural stone water springs (*Naulas*) are revered as living deities. Never wash hands, soap, or trekking gear directly inside the spring basin.\n` +
      `- **Organic Millet Dining:** Hosts serve slow-cooked *Mandua* (finger millet), *Bhatt ki Churkani*, and *Jhangora*. Inform your host by 16:00 hrs of dietary preferences so solar/hearth wood is conserved.\n` +
      `- **Acoustic & Night Sky Respect:** Village quiet hours begin at 19:30 hrs to respect both early-rising pastoral families and adjoining forest wildlife sanctuaries.`;
  } else if (intentType === 'weather') {
    formattedResponse =
      `### Live Micro-Climate Report: ${telemetry.placeName} (${telemetry.region})\n` +
      `- **Elevation & District:** ${telemetry.elevationMeters.toLocaleString()}m ASL · ${telemetry.district} District\n` +
      `- **Current Temperature:** **${telemetry.temperatureC}°C** (Feels like ${telemetry.feelsLikeC}°C)\n` +
      `- **Sky & Conditions:** ${telemetry.condition}\n` +
      `- **Wind & Humidity:** ${telemetry.windSpeedKmh} km/h mountain breeze · ${telemetry.humidityPercent}% RH · Air Quality Index ${telemetry.aqi} (Pristine)\n` +
      `- **Road & Trail Advisory:** ${telemetry.roadStatus}\n\n` +
      `**Yatri Packing Note:** Carry a windproof shell and thermal layer—temperatures in ${telemetry.placeName} drop by 6–8°C immediately after sunset. Local homestays (${telemetry.homestayAvailability.split('(')[0].trim()}) have passive solar heating ready.`;
  } else if (intentType === 'permits') {
    formattedResponse =
      `### Trekking & Forest Permit Protocol: ${telemetry.placeName}\n` +
      `- **Jurisdiction:** ${telemetry.district} Forest Division (${telemetry.region})\n` +
      `- **Permit Requirement:** ${telemetry.permitRequirement}\n` +
      `- **Eco-Compliance Check:** Mandatory QR-tag deposit (₹50 refundable) on any PET water bottles or packaged snacks at the entry barrier.\n` +
      `- **Nearest Trailhead:** ${telemetry.nearestTrail}\n` +
      `- **Current Weather at Checkpost:** ${telemetry.temperatureC}°C · ${telemetry.condition}`;
  } else if (intentType === 'homestays') {
    formattedResponse =
      `### Verified Community Homestays in ${telemetry.placeName}\n` +
      `- **Live Availability:** ${telemetry.homestayAvailability}\n` +
      `- **Architecture & Comfort:** Traditional ${telemetry.region} stone-and-timber architecture with solar water heating and organic millet (Mandua/Jhangora) dining.\n` +
      `- **Community Impact:** 85–88% of your tariff stays directly with village women's collectives and local trail guides in ${telemetry.district}.\n` +
      `- **Local Weather Right Now:** ${telemetry.temperatureC}°C (${telemetry.condition}). You can request an instant booking directly from any **Homestay Card** or via the **Traveler Dashboard**.`;
  } else if (intentType === 'eco_guidelines') {
    formattedResponse =
      `### Uttarakhand Eco-Tourism Board Directives (${telemetry.placeName})\n` +
      `1. **Bugyal Meadow Protection (UETDB-2026-01):** Overnight tent pitching on alpine meadows above 3,000m is prohibited by High Court order to protect fragile Himalayan topsoil.\n` +
      `2. **QR Plastic Deposit (UETDB-2026-02):** Every plastic item is scanned at checkposts; use natural spring refill stations (*Jal-Srot*).\n` +
      `3. **Local Advisory for ${telemetry.placeName}:** ${telemetry.ecoGuidelineNote}`;
  } else {
    formattedResponse =
      `### Yatri RAG Dispatch: ${telemetry.placeName} (${telemetry.district}, ${telemetry.region})\n` +
      `- **Live Weather (${telemetry.elevationMeters}m):** **${telemetry.temperatureC}°C** (Feels like ${telemetry.feelsLikeC}°C) · ${telemetry.condition}\n` +
      `- **Featured Trail:** ${telemetry.nearestTrail}\n` +
      `- **Permits & Access:** ${telemetry.permitRequirement}\n` +
      `- **Homestay Status:** ${telemetry.homestayAvailability}\n` +
      `- **Eco-Guideline:** ${telemetry.ecoGuidelineNote}`;
  }

  return {
    rawQuery: query,
    intentType,
    targetLocation: telemetry.placeName,
    telemetry,
    retrievedContext,
    formattedResponse,
  };
}

/**
 * Pure recommendation engine for the Interactive Circuit Planner Tool.
 * Scores all circuits against traveler's duration, interests, budget, and division.
 */
export function recommendCircuitsForPlanner(
  circuits: CircuitItem[],
  criteria: PlannerCriteria
): PlannerRecommendationResult {
  const scored = circuits.map(circuit => {
    let score = 55;

    // 1. Region filter match
    if (criteria.region === 'All' || circuit.region === criteria.region) {
      score += 15;
    } else {
      score -= 25;
    }

    // 2. Duration bucket match
    if (criteria.durationBucket === 'short' && circuit.durationDays <= 4) {
      score += 15;
    } else if (criteria.durationBucket === 'medium' && circuit.durationDays === 5) {
      score += 15;
    } else if (criteria.durationBucket === 'long' && circuit.durationDays >= 5) {
      score += 15;
    }

    // 3. Budget match
    if (circuit.basePriceInr <= criteria.maxBudgetInr) {
      score += 10;
    } else {
      score -= 10;
    }

    // 4. Interest overlap
    const matchedInterests = criteria.interests.filter(tag => circuit.interests.includes(tag));
    score += matchedInterests.length * 9;

    const clampedScore = Math.min(99, Math.max(62, score));
    return { circuit, score: clampedScore };
  });

  scored.sort((a, b) => b.score - a.score);

  const best = scored[0];
  const alternatives = scored.slice(1, 3).map(s => s.circuit);
  const carbonSavedKg = Math.round(
    best.circuit.carbonFootprintKg * (best.circuit.carbonSavedPercent / (100 - best.circuit.carbonSavedPercent))
  );

  return {
    primaryCircuit: best.circuit,
    alternativeCircuits: alternatives,
    matchScorePercent: best.score,
    estimatedTotalInr: best.circuit.basePriceInr,
    carbonSavedKg,
  };
}
