import { Product, Category } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'switches-modular',
    name: 'Modular Switches & Plates',
    slug: 'switches-modular',
    description: 'Luxury glass, metal & antibacterial modular plates and smart tactile switches.',
    iconName: 'ToggleRight',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    badge: 'Trending'
  },
  {
    id: 'wires-cables',
    name: 'Wires & Flexible Cables',
    slug: 'wires-cables',
    description: '100% pure electrolytic copper, flame-retardant and zero halogen insulated wires.',
    iconName: 'Cable',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    badge: 'ISI Certified'
  },
  {
    id: 'luxury-lighting',
    name: 'Architectural & Luxury Lighting',
    slug: 'luxury-lighting',
    description: 'Magnetic track lights, recessed COB downlights, chandeliers & designer LED strips.',
    iconName: 'Lightbulb',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    badge: 'Popular'
  },
  {
    id: 'fans-ventilation',
    name: 'BLDC Smart Fans & Ventilation',
    slug: 'fans-ventilation',
    description: 'Super energy-efficient BLDC motors, whisper quiet acoustics, aerodynamic wooden blades.',
    iconName: 'Fan',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    badge: 'Save 65% Power'
  },
  {
    id: 'smart-automation',
    name: 'Smart Home & IoT Automation',
    slug: 'smart-automation',
    description: 'WiFi & Zigbee retro-fit relays, voice-controlled scene dimmers, and energy meters.',
    iconName: 'Cpu',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80',
    badge: 'Alexa & Google'
  },
  {
    id: 'switchgear-safety',
    name: 'Switchgear & Power Protection',
    slug: 'switchgear-safety',
    description: 'Double pole MCBs, sensitive RCCBs, surge protection devices & industrial enclosures.',
    iconName: 'ShieldAlert',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    badge: 'Industrial Grade'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-legrand-arteor-8m',
    name: 'Legrand Arteor 8-Module Mirror Glass Plate with Chrome Bezel',
    brand: 'Legrand',
    category: 'Modular Switches & Plates',
    subcategory: 'Plates',
    price: 3450,
    originalPrice: 4200,
    discountPercent: 18,
    rating: 4.9,
    reviewCount: 142,
    inStock: true,
    stockCount: 45,
    isFeatured: true,
    isBestSeller: true,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Exquisite French architectural craftsmanship. The Legrand Arteor tempered mirror black glass finish elevates luxury interior walls with an ultra-thin bevel and anti-static surface.',
    features: [
      'Tempered toughened safety glass with beveled edge',
      'Anti-fingerprint oleophobic coating',
      'Self-extinguishing polycarbonate grid plate for surge safety',
      'Compatible with Arteor smart micro-modules'
    ],
    specs: {
      voltage: '220V - 250V AC',
      material: 'Black Obsidian Glass & Brushed Chrome',
      warranty: '10 Years Manufacturer Warranty',
      dimensions: '224mm x 88mm x 9mm',
      certification: 'IS 3854, CE Approved',
      origin: 'Designed in France'
    }
  },
  {
    id: 'prod-havells-crabtree-athena-gold',
    name: 'Crabtree Athena 16A Smart Gold Touch Switch with Indicator',
    brand: 'Havells Crabtree',
    category: 'Modular Switches & Plates',
    subcategory: 'Switches',
    price: 1890,
    originalPrice: 2450,
    discountPercent: 23,
    rating: 4.8,
    reviewCount: 98,
    inStock: true,
    stockCount: 68,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80',
    description: 'Precision engineered by Havells Crabtree. Crafted with brushed champagne gold finish and a subtle warm sapphire LED locator for seamless nighttime navigation.',
    features: [
      'Silver cadmium oxide contacts for ultra-low arc resistance',
      'Soft-glide tactile click tested for 100,000 operations',
      'Dual-color LED state backlight (Amber/Ice Blue)',
      'Fire-retardant virgin grade polycarbonate'
    ],
    specs: {
      voltage: '240V AC, 50Hz',
      wattage: 'Rated up to 3500W (Heavy Load)',
      material: 'Champagne Gold Anodized Aluminum & Polycarbonate',
      warranty: '10 Years Replacement Guarantee',
      certification: 'ISI Mark Certified'
    }
  },
  {
    id: 'prod-polycab-fr-25mm',
    name: 'Polycab Green Shield 2.5 sq mm FR-LSH Pure Copper Wire (90m Box)',
    brand: 'Polycab',
    category: 'Wires & Flexible Cables',
    subcategory: 'House Wires',
    price: 3250,
    originalPrice: 3890,
    discountPercent: 16,
    rating: 4.95,
    reviewCount: 312,
    inStock: true,
    stockCount: 120,
    isFeatured: true,
    isBestSeller: true,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    description: 'India’s most trusted electrical wiring cable. 99.97% pure oxygen-free high-conductivity electrolytic copper with multi-layer FR-LSH (Flame Retardant Low Smoke Zero Halogen) insulation.',
    features: [
      '99.97% Bare electrolytic grade bright annealed copper conductor',
      'Special flame-retardant outer sheath stops fire propagation',
      'Zero toxic halogen gas release during extreme thermal events',
      'Higher current carrying capacity with lower energy loss'
    ],
    specs: {
      voltage: 'Up to 1100V AC',
      material: 'Class 5 Multi-strand Annealed Copper',
      warranty: 'Lifetime Assurance under standard rating',
      certification: 'IS: 694 / CM/L-2839468',
      dimensions: '90 Meters Coil Box'
    }
  },
  {
    id: 'prod-havells-lifeline-15mm',
    name: 'Havells LifeLine Plus 1.5 sq mm S3 HRFR Wire (90m, Fire Resisting)',
    brand: 'Havells',
    category: 'Wires & Flexible Cables',
    subcategory: 'House Wires',
    price: 2180,
    originalPrice: 2600,
    discountPercent: 16,
    rating: 4.85,
    reviewCount: 220,
    inStock: true,
    stockCount: 85,
    image: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=800&q=80',
    description: 'Engineered with Heat Resistant & Flame Retardant 105°C thermal threshold insulation. Prevents voltage drop and keeps living spaces 100% electrically secure.',
    features: [
      'Rated 105°C operating thermal endurance',
      'Anti-termite & anti-rodent repellent outer compound',
      'Laser-marked sequential meter printing',
      '30% extra power saving due to pure annealed copper'
    ],
    specs: {
      voltage: '1100V Grade',
      material: '100% Electrolytic Copper',
      warranty: '5 Years Manufacturer Guarantee',
      certification: 'IS 694, RoHS Compliant'
    }
  },
  {
    id: 'prod-philips-magnetic-track-light',
    name: 'Philips MasterTrack 24W Deep Recessed Magnetic Track Light System',
    brand: 'Philips',
    category: 'Architectural & Luxury Lighting',
    subcategory: 'Track Lights',
    price: 5499,
    originalPrice: 7200,
    discountPercent: 24,
    rating: 4.9,
    reviewCount: 76,
    inStock: true,
    stockCount: 30,
    isFeatured: true,
    isNewArrival: true,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Ultra-modern 48V low voltage magnetic snap-in LED architectural linear light. Offers anti-glare UGR < 13 optics with smooth warm-to-cool CCT tuning.',
    features: [
      'Tool-free magnetic click installation & repositioning',
      'High CRI > 95 for true natural color reproduction',
      'Deep honeycomb baffle eliminates eye strain and glare',
      'Compatible with 48V architectural recessed magnetic tracks'
    ],
    specs: {
      voltage: '48V DC Safe Low Voltage',
      wattage: '24W (2400 Lumens)',
      material: 'Aviation Aluminum Heat Sink',
      warranty: '3 Years Comprehensive Warranty',
      color: 'Matte Jet Black / 3000K Warm White'
    }
  },
  {
    id: 'prod-havells-adore-chandelier',
    name: 'Havells Adore Aurora K9 Crystal LED Chandelier with Remote Dimming',
    brand: 'Havells',
    category: 'Architectural & Luxury Lighting',
    subcategory: 'Chandeliers',
    price: 18999,
    originalPrice: 26500,
    discountPercent: 28,
    rating: 5.0,
    reviewCount: 45,
    inStock: true,
    stockCount: 12,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80',
    description: 'Hand-cut genuine K9 sparkling crystal prisms suspended on a brushed brass gold ring. 3-step color temperature switching via RF remote control.',
    features: [
      'Hand-polished optical K9 crystals with high refractive index',
      '3-Tone lighting: 3000K Warm, 4000K Natural, 6500K Cool Daylight',
      'Height adjustable aircraft steel suspension wire up to 1.5m',
      'Flicker-free constant current driver with surge protection'
    ],
    specs: {
      voltage: '220-240V AC',
      wattage: '72W High Output LED array',
      material: 'Electroplated Brushed Gold Brass & K9 Crystals',
      warranty: '2 Years On-Site Warranty',
      dimensions: 'Diameter 600mm x Height 1200mm (Adjustable)'
    }
  },
  {
    id: 'prod-atomberg-renesa-bldc-fan',
    name: 'Atomberg Renesa Smart Plus 1200mm BLDC Ceiling Fan with IoT App Control',
    brand: 'Atomberg',
    category: 'BLDC Smart Fans & Ventilation',
    subcategory: 'Ceiling Fans',
    price: 4390,
    originalPrice: 5690,
    discountPercent: 23,
    rating: 4.88,
    reviewCount: 418,
    inStock: true,
    stockCount: 55,
    isFeatured: true,
    isBestSeller: true,
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    description: 'Consumes only 28W at top speed, slashing fan electricity bills by up to 65%. Equipped with smart WiFi, sleep timer modes, boost mode, and remote control.',
    features: [
      'Super efficient BLDC Motor consumes 28W (saves ₹1500/year)',
      'Runs 3x longer on inverter batteries during power cuts',
      'Voice control via Alexa, Google Assistant & Atomberg Home app',
      'LED speed indicator with ambient night glow'
    ],
    specs: {
      voltage: '140V - 285V AC Wide Voltage Range',
      wattage: '28 Watts at Speed 5',
      material: 'Anti-dust Powder Coated Aluminum Blades',
      warranty: '2+1 Year Extended Warranty',
      dimensions: '1200mm (48 Inches) Sweep'
    }
  },
  {
    id: 'prod-crompton-silentpro-bldc',
    name: 'Crompton SilentPro Enso 1220mm Whisper Quiet Smart BLDC Fan',
    brand: 'Crompton',
    category: 'BLDC Smart Fans & Ventilation',
    subcategory: 'Ceiling Fans',
    price: 6890,
    originalPrice: 8900,
    discountPercent: 22,
    rating: 4.75,
    reviewCount: 89,
    inStock: true,
    stockCount: 28,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    description: 'Designed for library-quiet operation at only 52dB. Fluidic aerodynamic fluid-sculpted blades deliver 240 CMM air delivery with fluid elegance.',
    features: [
      'SilentPro aerodynamic fluid dynamic blade design',
      'Operates at ultra-low 52 decibels',
      'ActivBLDC motor with intelligent thermal protection',
      'Smooth RF wireless remote with point-anywhere tech'
    ],
    specs: {
      voltage: '220-240V AC',
      wattage: '32 Watts',
      material: 'Molded ABS Aerodynamic Blades with Wood Texture',
      warranty: '5 Years Manufacturer Motor Warranty',
      dimensions: '1220mm Sweep'
    }
  },
  {
    id: 'prod-schneider-wiser-relay',
    name: 'Schneider Electric Wiser 4-Channel Micro Smart Switch Relay (WiFi & Zigbee)',
    brand: 'Schneider Electric',
    category: 'Smart Home & IoT Automation',
    subcategory: 'Smart Relays',
    price: 4999,
    originalPrice: 6500,
    discountPercent: 23,
    rating: 4.85,
    reviewCount: 64,
    inStock: true,
    stockCount: 42,
    isFeatured: true,
    isNewArrival: true,
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80',
    description: 'Retrofit smart module that fits neatly behind your existing switchboard without changing wall plates. Control 4 lights/fans with phone, timer, and voice.',
    features: [
      'Fits standard 2M to 8M wall conceal boxes behind existing plates',
      'Supports dual control: physical wall switch and mobile app sync',
      'Real-time power consumption and energy logging per channel',
      'Scheduled scenes (Sunrise mode, Movie mode, Away mode)'
    ],
    specs: {
      voltage: '110V - 250V AC, 50/60Hz',
      wattage: '4 x 500W Resistive / 150W LED load',
      material: 'V0 Grade Flame Retardant PC',
      warranty: '2 Years Manufacturer Warranty',
      certification: 'WPC, BIS & CE Certified'
    }
  },
  {
    id: 'prod-schneider-acti9-mcb',
    name: 'Schneider Electric Acti9 iC60N 32A Double Pole 10kA C-Curve MCB',
    brand: 'Schneider Electric',
    category: 'Switchgear & Power Protection',
    subcategory: 'MCB & Isolators',
    price: 940,
    originalPrice: 1250,
    discountPercent: 25,
    rating: 4.95,
    reviewCount: 184,
    inStock: true,
    stockCount: 150,
    isFeatured: true,
    isBestSeller: true,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    description: 'Gold standard in commercial and residential electrical circuit protection. 10kA breaking capacity with VisiTrip indicator that instantly flags fault trips.',
    features: [
      'VisiTrip indicator: red flag immediately isolates the faulty line',
      'VisiSafe green bar guarantees physical contact opening for maintenance',
      '10,000 Amperes short-circuit breaking capacity',
      'Bimetallic thermal overload and magnetic instantaneous short protection'
    ],
    specs: {
      voltage: '415V AC, 50Hz',
      material: 'Industrial Grade BMC Insulated Casing',
      warranty: '5 Years Manufacturer Replacement Warranty',
      certification: 'IEC/EN 60898-1, IS/IEC 60898-1',
      dimensions: '2 Modules DIN Rail Mount'
    }
  },
  {
    id: 'prod-havells-euro2-rccb',
    name: 'Havells Euro-II 40A 30mA 2-Pole Residual Current Circuit Breaker (RCCB)',
    brand: 'Havells',
    category: 'Switchgear & Power Protection',
    subcategory: 'Earth Leakage & Shock Protection',
    price: 2450,
    originalPrice: 3100,
    discountPercent: 21,
    rating: 4.9,
    reviewCount: 92,
    inStock: true,
    stockCount: 60,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    description: 'Life-saving human shock protection. Detects micro-leakage currents greater than 30mA and trips within milliseconds to prevent fatal electric shocks and electrical fires.',
    features: [
      'High-sensitivity 30mA trip threshold for human life safety',
      'Test push button with bi-annual self-check mechanism',
      'Bi-connect terminals for dual busbar and cable connection',
      'IP20 finger-proof shrouded terminal protection'
    ],
    specs: {
      voltage: '240V AC 2-Pole',
      material: 'Flame Retardant High Impact Resin',
      warranty: '2 Years Manufacturer Warranty',
      certification: 'IS 12640-1 / IEC 61008-1'
    }
  },
  {
    id: 'prod-philips-wiz-smart-downlight',
    name: 'Philips WiZ Squire 15W Tunable White & 16 Million Colors Smart COB Downlight',
    brand: 'Philips',
    category: 'Architectural & Luxury Lighting',
    subcategory: 'Smart Lights',
    price: 1699,
    originalPrice: 2299,
    discountPercent: 26,
    rating: 4.78,
    reviewCount: 165,
    inStock: true,
    stockCount: 74,
    image: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=800&q=80',
    description: 'Connect directly to your home 2.4GHz WiFi without any extra bridge. Control circadian rhythm lighting that shifts from invigorating morning cool white to relaxing warm amber at sunset.',
    features: [
      '16 Million RGB colors + 2200K to 6500K tunable whites',
      'SpaceSense tech: light detects motion using existing WiFi signals',
      'Siri Shortcuts, Alexa & Google Assistant voice support',
      'Anti-glare deep recessed diffuser prevents harsh hotspots'
    ],
    specs: {
      voltage: '220V - 240V AC',
      wattage: '15W (1300 Lumens)',
      material: 'Die-cast Aluminum Housing with Matte White Trim',
      warranty: '2 Years Philips Guarantee',
      dimensions: 'Outer Dia: 140mm, Cutout: 125mm'
    }
  }
];

export const ELECTRICAL_BRANDS = [
  'All Brands',
  'Havells',
  'Polycab',
  'Philips',
  'Legrand',
  'Schneider Electric',
  'Atomberg',
  'Crompton',
  'Havells Crabtree'
];
