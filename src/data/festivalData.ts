import { BoothTier, FestivalDay, MarketCategory, ScheduleEvent, VendorSpotlight } from '../types';
import vendorBotanicalImg from '../assets/images/vendor_botanical_booth_1787757236889.jpg';
import vendorFoodTruckImg from '../assets/images/vendor_food_truck_1787757253971.jpg';
import vendorJewelryImg from '../assets/images/vendor_jewelry_tent_1787757268227.jpg';
import vendorWoodcraftImg from '../assets/images/vendor_woodcraft_booth_1787757283784.jpg';

/**
 * ============================================================================
 * SINGLE SOURCE OF TRUTH EVENT CONFIGURATION
 * ============================================================================
 * Edit this central configuration object to update the festival name, venue,
 * location, dates, and contact details for any future event in one single place.
 */
export interface EventConfig {
  // General Event Identity
  name: string;
  shortName: string;
  heroHeadline: string;
  edition: string;
  tagline: string;
  description: string;

  // Venue & Location (General, reusable across events)
  venueName: string;
  venueArea: string;
  address: string;
  cityState: string;
  fullLocation: string;
  mapQuery: string;

  // Badges & Quick Info
  datesSummary: string;
  durationBadge: string;
  admissionBadge: string;
  locationBadge: string;

  // Contact & Registration
  contactEmail: string;
  freeAdmission: boolean;
}

export const EVENT_CONFIG: EventConfig = {
  name: 'Community Artisan Marketplace & Festival',
  shortName: 'Community Festival & Expo',
  heroHeadline: 'Community Artisan & Food Festival',
  edition: 'Annual Outdoor Gathering & Marketplace',
  tagline: 'Celebrating Local Makers, Culinary Artisans, Music & Community',
  description: 'A vibrant outdoor community celebration bringing together small businesses, artisans, farmers, gourmet food trucks, and live entertainment for the whole family.',
  
  venueName: 'Festival Grounds & Marketplace Park',
  venueArea: 'Marketplace Grounds',
  address: 'Festival Grounds & Event Promenade',
  cityState: 'Outdoor Event Plaza',
  fullLocation: 'Outdoor Festival Park & Marketplace Grounds',
  mapQuery: 'Festival Park',

  datesSummary: 'Outdoor Community Festival & Marketplace',
  durationBadge: 'Outdoor Festival & Market',
  admissionBadge: 'Free Public Admission',
  locationBadge: 'Marketplace Grounds',

  contactEmail: 'festvendorstate@gmail.com',
  freeAdmission: true,
};

// Backwards-compatible aliases pointing directly to EVENT_CONFIG
export const FESTIVAL_NAME = EVENT_CONFIG.name;
export const FESTIVAL_LOCATION = EVENT_CONFIG.fullLocation;
export const FESTIVAL_CONTACT_EMAIL = EVENT_CONFIG.contactEmail;

export const FESTIVAL_DAYS: FestivalDay[] = [
  {
    id: 'fri',
    dayName: 'Day 1',
    shortDay: 'Day 1',
    dateStr: 'Opening Twilight Showcase',
    hours: '1:00 PM – 5:30 PM',
    setupTime: 'Morning Load-In & Inspection (8:00 AM – 12:30 PM)',
    title: 'Grand Opening & Twilight Showcase',
    highlights: ['Designated Load-In Window', 'Opening Bell Ceremony', 'Acoustic Music Sessions', 'Gourmet Food Truck Gathering'],
    breakdownNotice: 'Booths remain active through festival hours. Load-out begins at 5:30 PM.',
  },
  {
    id: 'sat',
    dayName: 'Day 2',
    shortDay: 'Day 2',
    dateStr: 'Main Festival & Arts Expo',
    hours: '10:00 AM – 5:00 PM',
    setupTime: 'Morning Restock & Check-in (8:00 AM – 9:45 AM)',
    title: 'Community Festival & Arts Expo',
    highlights: ['Peak Foot Traffic', 'Live Mainstage Music', 'Family & Kids Creative Zone', 'Artisan Demonstrations'],
    breakdownNotice: 'Booths remain open until 5:00 PM closing. Breakdown begins after patron egress.',
  },
  {
    id: 'sun',
    dayName: 'Day 3',
    shortDay: 'Day 3',
    dateStr: 'Makers Market & Finale',
    hours: '10:00 AM – 6:00 PM',
    setupTime: 'Morning Restock & Check-in (8:00 AM – 9:45 AM)',
    title: 'Makers Market & Festival Finale',
    highlights: ['Farmers & Makers Showcase', 'Gourmet Food Carts', 'Community Honors', 'Grand Finale Performances'],
    breakdownNotice: 'Final festival breakdown begins at 6:00 PM closing celebration.',
  },
];

export const BOOTH_TIERS: BoothTier[] = [
  {
    id: 'tent-10x10',
    name: 'Standard 10×10 Space',
    category: 'BOOTH',
    pricePerDay: 70,
    dimensions: '10ft × 10ft (100 sq ft)',
    tagline: 'Ideal for handmade artisans, jewelers & boutique craft makers',
    description: 'Our most popular vendor option located in the lively Artisan Village section with steady lakefront foot traffic.',
    popular: true,
    bestFor: 'Handmade crafts, jewelry, apparel, candles, art prints, specialty gifts',
    included: [
      '1 Sturdy 6ft Folding Table',
      '2 Comfortable Event Chairs',
      'Designated morning load-in window with drive-up access',
      'Free overnight security on multi-day reservations',
      'Listing in official festival directory & visitor guide',
      'Access to park recycling & waste management stations',
    ],
    capacityNote: 'Accommodates up to 3 staff comfortably with 10x10 canopy tent.',
    badge: 'Artisan Choice',
    zone: 'Artisan Village & Makers Promenade',
  },
  {
    id: 'tent-10x20',
    name: 'Double 10×20 Space',
    category: 'BOOTH',
    pricePerDay: 100,
    dimensions: '10ft × 20ft (200 sq ft)',
    tagline: 'Double the frontage and merchandising capacity for growing brands',
    description: 'Expanded dual-width booth ideal for extensive inventories, fashion racks, interactive demos, or larger displays.',
    bestFor: 'Boutiques, furniture, large artwork, multi-product brands, wellness hubs',
    included: [
      '1 Sturdy Table + 2 Chairs (Option to request 2nd table)',
      '20ft of high-visibility frontage',
      'Designated morning load-in window',
      'Free overnight security for multi-day reservations',
      'Social media spotlight consideration',
      'Dedicated waste & recycling access',
    ],
    capacityNote: 'Wide 20ft customer walk-up perimeter for high transaction volume.',
    zone: 'Central Marketplace Boulevard',
  },
  {
    id: 'corner-10x10',
    name: 'Corner / Main Street Booth',
    category: 'BOOTH',
    pricePerDay: 180,
    dimensions: '10ft × 10ft (Corner Placement)',
    tagline: 'Dual open sides at high-traffic intersections & Main Street',
    description: 'Premium corner positioning with 2 open walkway sides ensuring maximum exposure, visibility, and visitor foot-traffic.',
    featured: true,
    bestFor: 'High-volume retailers, marquee artisans, impulse merchandise, live demos',
    included: [
      'Dual walkway frontage (2 open sides)',
      '1 Table & 2 Chairs included with registration',
      'Prime Main Street / intersection placement',
      'Designated morning load-in window',
      'Free multi-day overnight security',
      'Guaranteed Festival Directory Feature',
    ],
    capacityNote: '360° visibility corner lot located at core pedestrian crossings.',
    badge: 'High Foot-Traffic',
    zone: 'Main Street & Central Plaza Corner',
  },
  {
    id: 'extra-large-20x20',
    name: 'Extra Large Pavilion Space',
    category: 'BOOTH',
    pricePerDay: 180,
    dimensions: '20ft × 20ft (400 sq ft)',
    tagline: 'Expansive flagship pavilion for immersive retail and experiential exhibits',
    description: 'Massive 400 square-foot designated footprint designed for major sponsors, interactive experiences, large setups, and brand showcases.',
    bestFor: 'Home services, experiential lounges, large merchandise setups, fitness activations',
    included: [
      'Huge 400 sq ft perimeter',
      'Table & 2 Chairs included (extras available upon request)',
      'Priority load-in and positioning assistance',
      'Overnight security provided on consecutive days',
      'Dedicated space for interactive demos & queuing',
      'Prominent festival signage & directory feature',
    ],
    capacityNote: 'Grand 20x20 footprint accommodating walk-in tent setups.',
    badge: 'Maximum Space',
    zone: 'Expo Pavilion & Event Lawn',
  },
  {
    id: 'food-truck',
    name: 'Gourmet Food Truck Space',
    category: 'FOOD',
    pricePerDay: 190,
    dimensions: 'Dedicated Food Truck / Trailer Bay',
    tagline: 'Prime spot in the bustling Food Truck Row along the festival promenade',
    description: 'Designated vehicular bay with waste management and excellent patron queuing space along the festival dining lawn.',
    featured: true,
    bestFor: 'Food trucks, mobile kitchens, BBQ smokers, wood-fired pizza trailers, dessert trucks',
    included: [
      'Dedicated Food Truck parking bay with patron queuing zone',
      'Designated staging, prep & positioning load-in slot',
      'Trash receptacle & grease/greywater guidance stations',
      'Free overnight security on multi-day reservations',
      'Heavy promotion in festival dining guides',
      'Health department inspection assistance',
    ],
    capacityNote: 'Must hold valid local food handlers permits and temperature compliance.',
    badge: 'Food & Dining',
    zone: 'Dining Promenade & Food Truck Row',
  },
];

export const MARKET_CATEGORIES: MarketCategory[] = [
  {
    id: 'crafts-art',
    name: 'Handmade Crafts & Fine Art',
    description: 'Original canvas paintings, wheel-thrown ceramic pottery, custom woodworking, stained glass, sculpture, and handmade heritage pieces.',
    items: ['Ceramics & Stoneware Pottery', 'Fine Art Canvas & Woodblock Prints', 'Live-Edge Woodcraft', 'Glassblowing & Fiber Sculptures'],
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    iconName: 'Palette',
    vendorCountEstimate: '35+ Artisans',
  },
  {
    id: 'jewelry-gemstones',
    name: 'Jewelry & Metalsmithing',
    description: 'Hand-forged sterling silver, wire-wrapped raw gemstones, artisan sea glass pendants, beadwork, and custom bridal accessories.',
    items: ['Sterling Silver & 14k Gold', 'Raw Crystals & Gemstone Rings', 'Sea Glass Pendants & Cuffs', 'Minimalist Everyday Jewelry'],
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
    iconName: 'Tag',
    vendorCountEstimate: '25+ Jewelers',
  },
  {
    id: 'food-trucks',
    name: 'Gourmet Food Trucks & Street Food',
    description: 'Regional favorites including artisan seafood cakes, hickory smoked BBQ, authentic street tacos, gourmet smash burgers, and wood-fired pizza.',
    items: ['Hickory Wood-Smoked BBQ', 'Artisan Wood-Fired Pizza', 'Baja Fish & Birria Tacos', 'Handcrafted Sliders & Fries'],
    image: 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?auto=format&fit=crop&w=800&q=80',
    iconName: 'UtensilsCrossed',
    vendorCountEstimate: '18+ Food Trucks',
  },
  {
    id: 'bakery-sweets',
    name: 'Artisan Bakery & Sweet Confections',
    description: 'Fresh sourdough loaves, French macarons, small-batch cookies, hand-dipped chocolates, gourmet churros, and fruit pies.',
    items: ['Sourdough & Artisan Breads', 'French Macarons & Eclairs', 'Small-Batch Gourmet Fudge', 'Hand-Crafted Ice Cream Carts'],
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    iconName: 'Coffee',
    vendorCountEstimate: '15+ Bakers',
  },
  {
    id: 'farm-produce',
    name: 'Fresh Farm Produce & Organics',
    description: 'Locally grown organic vegetables, crisp orchard fruits, wildflower honey, artisanal hot sauces, fruit jams, and cold-pressed olive oils.',
    items: ['Raw Wildflower Honey & Pollen', 'Local Orchard Apples & Berries', 'Small-Batch Hot Sauces & Pickles', 'Farm Fresh Herb Bundles'],
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=800&q=80',
    iconName: 'Leaf',
    vendorCountEstimate: '16+ Farms & Growers',
  },
  {
    id: 'plants-botanicals',
    name: 'Botanicals, Succulents & Plants',
    description: 'Vibrant indoor houseplants, rare tropicals, air plants, handcrafted macramé hangers, ceramic bonsai pots, and fresh cut florals.',
    items: ['Rare Monstera & Tropicals', 'Lakeside Succulent Terrariums', 'Hand-tied Fresh Flower Bouquets', 'Macramé Plant Hangers'],
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
    iconName: 'TreePine',
    vendorCountEstimate: '12+ Plant Shops',
  },
  {
    id: 'home-living',
    name: 'Home Décor & Soy Candles',
    description: 'Hand-poured clean burning soy candles, natural linen sprays, reclaimed wooden serving platters, kitchen pottery, and woven textiles.',
    items: ['Botanical Soy & Beeswax Candles', 'Reclaimed Wood Cutting Boards', 'Hand-Woven Throw Blankets', 'Aromatherapy Room Diffusers'],
    image: 'https://images.unsplash.com/photo-1608755728617-aefab37d45f6?auto=format&fit=crop&w=800&q=80',
    iconName: 'Home',
    vendorCountEstimate: '20+ Studios',
  },
  {
    id: 'wellness-beauty',
    name: 'Clean Beauty & Herbal Wellness',
    description: 'Small-batch organic goat milk soaps, whipped shea body butters, herbal tea infusions, natural bath soaks, and soothing beard oils.',
    items: ['Cold-Pressed Herbal Soaps', 'Organic Body Oils & Balms', 'Loose-Leaf Artisan Teas', 'Mineral Clay Face Masks'],
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    iconName: 'Heart',
    vendorCountEstimate: '14+ Apothecaries',
  },
  {
    id: 'vintage-fashion',
    name: 'Vintage & Boutique Apparel',
    description: 'Curated 70s–90s vintage clothing, upcycled denim jackets, handmade leather totes, silk scarves, and sustainable slow-fashion pieces.',
    items: ['Curated Vintage Denim & Coats', 'Handcrafted Full-Grain Leather Bags', 'Silk Screen Printed Tees', 'Boho Kimonos & Hats'],
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80',
    iconName: 'ShoppingBag',
    vendorCountEstimate: '18+ Boutiques',
  },
  {
    id: 'live-arts',
    name: 'Live Artists & Craft Demos',
    description: 'Live watercolor portrait painting, on-site pottery turning demonstrations, calligraphy engraving, and interactive caricature drawings.',
    items: ['Custom Live Pet & Family Portraits', 'Live Wheel-Throwing Demos', 'Custom Calligraphy Engraving', 'Speed Charcoal Sketching'],
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    iconName: 'Camera',
    vendorCountEstimate: '10+ Live Creators',
  },
  {
    id: 'pet-boutique',
    name: 'Pet Treats & Accessories',
    description: 'Human-grade baked dog treats, hand-sewn pet bandanas, waterproof rope leashes, catnip toys, and organic grooming paw balms.',
    items: ['Grain-Free Baked Dog Biscuits', 'Custom Name Embroidered Bandanas', 'Climbing Rope Leashes', 'Organic Paw & Snout Balms'],
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
    iconName: 'Smile',
    vendorCountEstimate: '10+ Pet Brands',
  },
  {
    id: 'community-services',
    name: 'Community & Cultural Nonprofits',
    description: 'Local environmental conservation groups, civic youth programs, regional cultural associations, and neighborhood organizations.',
    items: ['Waterfront Conservation Projects', 'Youth Arts & STEM Programs', 'Community Garden Cooperatives', 'Cultural Heritage Displays'],
    image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80',
    iconName: 'Users',
    vendorCountEstimate: '12+ Organizations',
  },
];

export const ATTENDEE_EXPERIENCES = [
  {
    id: 'exp-1',
    title: 'Scenic Waterfront Stroll & Shopping',
    tagline: 'Waterfront Promenade & Artisan Village',
    description: 'Take a relaxed stroll along the paved waterfront promenade. Meet over 100 passionate makers, touch handmade crafts, and discover unique one-of-a-kind treasures under the open sky.',
    image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=800&q=80',
    perk: 'Over 100 artisan booths along the paved promenade',
  },
  {
    id: 'exp-2',
    title: 'Food Truck Alley & Waterfront Dining',
    tagline: 'Lakeside Picnics & Street Flavors',
    description: 'From sizzling street gourmet dishes and smoked hickory BBQ to artisanal ice cream and wood-fired pizza, savor delicious foods with ample lakeside picnic seating and open green lawns.',
    image: 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?auto=format&fit=crop&w=800&q=80',
    perk: '18+ Gourmet trucks & dessert carts with lakeside lawn seating',
  },
  {
    id: 'exp-3',
    title: 'Live Acoustic & Jazz Performances',
    tagline: 'Open-Air Amphitheater Stage',
    description: 'Settle in by the water and enjoy free acoustic sets, soulful jazz ensembles, and vibrant cultural dance performances throughout the entire three-day weekend.',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    perk: 'Continuous free live music in the outdoor amphitheater',
  },
  {
    id: 'exp-4',
    title: 'Hands-On Maker Demos & Live Art',
    tagline: 'Watch Master Craftsmen at Work',
    description: 'Witness potters shaping stoneware on the wheel, jewelers wire-wrapping gemstones, and painters capturing scenic waterfront landscapes in real time. Great for all ages!',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80',
    perk: 'Interactive pottery wheel and portrait painting stations',
  },
  {
    id: 'exp-5',
    title: 'Family & Kids Creative Fun Zone',
    tagline: 'Free Crafts, Face Painting & Lawn Games',
    description: 'Bring the whole family! Kids can enjoy complimentary face painting, balloon sculpting, outdoor giant Jenga and cornhole, plus interactive art crafting booths.',
    image: 'https://images.unsplash.com/photo-1472653431158-6364773b2a56?auto=format&fit=crop&w=800&q=80',
    perk: 'Free activities & creative workshops for children',
  },
  {
    id: 'exp-6',
    title: 'Dog-Friendly Outdoor Atmosphere',
    tagline: 'Bring Your Leashed Four-Legged Friends',
    description: 'The outdoor festival grounds are fully pet-friendly! Enjoy designated water stations, dog treat sample booths, and spacious grassy paths for you and your companion.',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
    perk: 'Free dog water stations & artisan pet treats',
  },
];

export const SCHEDULE_EVENTS: ScheduleEvent[] = [
  // Day 1
  {
    id: 'sch-1',
    day: 'fri',
    time: 'Morning Setup Window',
    title: 'Vendor Check-in & Morning Setup Window',
    location: 'Assigned Zones & Promenade',
    description: 'Registered vendors have dedicated morning access prior to opening to check in, receive table & chairs, load in, and stage displays without rush.',
    type: 'market',
  },
  {
    id: 'sch-2',
    day: 'fri',
    time: '1:00 PM',
    title: 'Festival Opening Bell & Public Gates Open',
    location: 'Main Stage & Promenade Gate',
    description: 'The outdoor marketplace opens to the public with welcoming music, fresh aromas, and early-bird shopping.',
    type: 'entertainment',
  },
  {
    id: 'sch-3',
    day: 'fri',
    time: '2:30 PM – 4:00 PM',
    title: 'Acoustic Guitar & Folk Duo',
    location: 'Amphitheater Stage',
    description: 'Enjoy calming acoustic melodies as you stroll the artisan promenade.',
    type: 'entertainment',
  },
  {
    id: 'sch-4',
    day: 'fri',
    time: '4:00 PM – 5:30 PM',
    title: 'Twilight Food Truck Social & Sunset Shopping',
    location: 'Food Truck Row & Lawn',
    description: 'Sample gourmet dinners and sweet treats as golden hour sets over the festival grounds.',
    type: 'food',
  },

  // Day 2
  {
    id: 'sch-5',
    day: 'sat',
    time: '8:00 AM – 10:00 AM',
    title: 'Morning Restock & Vendor Coffee Refresh',
    location: 'Vendor Marketplace Grounds',
    description: 'Morning preparation for vendors before crowds arrive. Overnight secure staging remains active.',
    type: 'market',
  },
  {
    id: 'sch-6',
    day: 'sat',
    time: '10:00 AM',
    title: 'Community Festival & Marketplace Grand Open',
    location: 'All Grounds & Pavilions',
    description: 'All booths, food trucks, and interactive family activities in full swing.',
    type: 'market',
  },
  {
    id: 'sch-7',
    day: 'sat',
    time: '11:30 AM – 1:30 PM',
    title: 'Live Potter Wheel & Glass Crafts Demos',
    location: 'Makers Pavilion',
    description: 'Watch master craftsmen demonstrate handmade ceramic turning and intricate wire jewelry.',
    type: 'workshop',
  },
  {
    id: 'sch-8',
    day: 'sat',
    time: '1:00 PM – 3:30 PM',
    title: 'Live R&B, Jazz & Community Ensemble Band',
    location: 'Main Stage',
    description: 'Dynamic upbeat live musical performances for the whole family.',
    type: 'entertainment',
  },
  {
    id: 'sch-9',
    day: 'sat',
    time: '2:00 PM – 4:00 PM',
    title: 'Kids Fun Zone: Face Painting & Lawn Games',
    location: 'Family Meadow',
    description: 'Free creative crafts, interactive games, and face painting for children.',
    type: 'kids',
  },

  // Day 3
  {
    id: 'sch-10',
    day: 'sun',
    time: '8:00 AM – 10:00 AM',
    title: 'Morning Vendor Arrival & Restock',
    location: 'Marketplace Zones',
    description: 'Restocking merchandise and setting up for the final festival session.',
    type: 'market',
  },
  {
    id: 'sch-11',
    day: 'sun',
    time: '10:00 AM',
    title: 'Makers Market & Gourmet Brunch Gathering',
    location: 'Food Truck Row & Promenade',
    description: 'Artisan pastries, breakfast street food, espresso carts, and fresh local goods.',
    type: 'food',
  },
  {
    id: 'sch-12',
    day: 'sun',
    time: '1:00 PM – 3:30 PM',
    title: 'Community Cultural Dance & Music Celebration',
    location: 'Amphitheater Stage',
    description: 'Showcasing diverse local cultural dance troupes, percussionists, and vocalists.',
    type: 'entertainment',
  },
  {
    id: 'sch-13',
    day: 'sun',
    time: '4:30 PM – 6:00 PM',
    title: 'Festival Awards, Community Raffles & Finale',
    location: 'Central Plaza Stage',
    description: 'Best in Show booth awards, customer raffle giveaways, and sunset closing celebration.',
    type: 'entertainment',
  },
];

export const VENDOR_SPOTLIGHTS: VendorSpotlight[] = [
  {
    id: 'v-1',
    businessName: 'Botanicals & Herbal Apothecary',
    owner: 'Elena Vance',
    category: 'Beauty & Wellness',
    bio: 'Crafting small-batch cold-pressed botanical soaps, soothing lavender balms, and clean soy candles using organic flora.',
    products: 'Lavender Honey Soaps, Cedarwood Soy Candles, Herbal Bath Soaks',
    image: vendorBotanicalImg,
    boothType: 'Standard 10×10 Space',
    quote: 'The festival crowd has the best community warmth and appreciation for handmade goods!',
  },
  {
    id: 'v-2',
    businessName: 'Smoke & Spice Artisanal BBQ',
    owner: 'Marcus & Tara Reed',
    category: 'Gourmet Food Truck',
    bio: 'Slow-smoked hickory brisket, applewood pulled pork, and signature burnt-end sliders served with homemade tangy slaw.',
    products: 'Smoked Brisket Platters, Peach BBQ Wings, Gourmet Mac & Cheese',
    image: vendorFoodTruckImg,
    boothType: 'Gourmet Food Truck Space',
    quote: 'Food Truck Row along the promenade is buzzing with energy all day long!',
  },
  {
    id: 'v-3',
    businessName: 'Artisan Silver & Gem Studio',
    owner: 'Nadia Solis',
    category: 'Jewelry & Metalsmithing',
    bio: 'Hand-forged recycled sterling silver jewelry set with responsibly sourced raw turquoise, crystals, and moonstones.',
    products: 'Stacker Gem Rings, Artisan Stone Pendants, Hammered Silver Cuffs',
    image: vendorJewelryImg,
    boothType: 'Corner / Main Street Booth',
    quote: 'Being on the corner gives double the visibility — visitors can browse from two walkways.',
  },
  {
    id: 'v-4',
    businessName: 'Heritage Wood & Resin Creations',
    owner: 'David Miller',
    category: 'Art & Home Decor',
    bio: 'Reclaimed walnut, oak, and epoxy charcuterie boards, live-edge serving platters, and custom handmade kitchen heirloom pieces.',
    products: 'Charcuterie Boards, Hand-carved Spoons, Coaster Sets',
    image: vendorWoodcraftImg,
    boothType: 'Double 10×20 Space',
    quote: 'The spacious setup gives visitors ample room to touch and admire the natural wood craftsmanship.',
  },
];

export const VENDOR_POLICIES_FAQ = [
  {
    q: 'What are the canopy and weather safety requirements (Tent Weights)?',
    a: 'All 10×10 and canopy structures MUST be securely weighted with a minimum of 20–30 lbs per tent leg using sandbags, water weights, or heavy canopy weight plates. Staking into hard surfaces or paved walkways is prohibited to preserve grounds.',
  },
  {
    q: 'What are the event operating hours and booth staffing rules?',
    a: 'For visitor safety and community experience, all vendor booths must be completely set up and ready 15 minutes before the daily opening bell. Booths must remain open, active, and staffed throughout all official festival operating hours.',
  },
  {
    q: 'What is the load-in, setup, and restock schedule?',
    a: 'Designated morning load-in windows with vehicle drop-off access are provided daily prior to festival opening. Vehicles must be moved to designated vendor parking lots immediately after unloading before setting up displays.',
  },
  {
    q: 'What is the park cleanliness and waste policy (Leave No Trace)?',
    a: 'Vendors are required to maintain a clean, attractive space throughout the event. All breakdown packaging, flattened cardboard boxes, and retail trash must be brought to designated park recycling and dumpster stations. Booth footprints must be left completely clean upon departure.',
  },
  {
    q: 'What are the food safety and health department requirements?',
    a: 'All culinary and beverage vendors must possess and visibly display a valid Food Service Permit. Food vendors must adhere strictly to safe holding temperatures, maintain calibrated digital thermometers, and provide proper handwashing stations.',
  },
  {
    q: 'What equipment and power provisions are included?',
    a: 'Each registration includes 1 sturdy 6ft table and 2 chairs. Standard artisan booths are non-powered outdoor spaces. If your setup requires electricity, low-noise quiet inverter generators (<60 dB) or portable battery power banks are permitted with prior notification.',
  },
  {
    q: 'How does overnight security work for multi-day reservations?',
    a: 'We provide dedicated on-site overnight security patrolling the festival grounds from closing until morning reopening. Vendors with multi-day reservations may leave their secured tent frames, tables, and heavy display units on site. We recommend packing away high-value items, electronics, and cash boxes overnight.',
  },
  {
    q: 'What are the aisle clearance and sound guidelines?',
    a: 'To guarantee ADA compliance and clear emergency egress, all racks, merchandise, and signage must stay strictly within your assigned booth footprint. Any background acoustic music or sound demonstrations at individual booths must remain at ambient conversational volume (<70 dB).',
  },
  {
    q: 'How do I request accessible parking or special assistance?',
    a: 'Accessible parking passes and close-proximity load-in assistance can be requested directly in the vendor application form. Our operations team will assign an optimal loading bay and ensure accessible routes to your booth location.',
  },
];
