import { EventLocationMarket, VENDOR_KIND_OPTIONS } from '../types';

const ALL_VENDOR_TYPES = [
  ...VENDOR_KIND_OPTIONS,
  'Music',
  'Art',
  'Craft',
  'Food',
  'Commercial',
];

// Verified working high-resolution market & festival gallery photos to accompany each event's unique thumbnail
const VERIFIED_MARKET_GALLERY_PHOTOS = [
  'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&w=900&q=80',
  'https://base44.app/api/apps/68bcf273578a00ae2ac66bfd/files/mp/public/68bcf273578a00ae2ac66bfd/9eba79091_a52dd079c_26-TQ-01-BRICKELL-FARMERSMARKET-141.jpg',
  'https://base44.app/api/apps/68bcf273578a00ae2ac66bfd/files/mp/public/68bcf273578a00ae2ac66bfd/e8951e38a_4R0A9216.JPG',
  'https://base44.app/api/apps/68bcf273578a00ae2ac66bfd/files/mp/public/68bcf273578a00ae2ac66bfd/124761375_25966.jpg',
  'https://base44.app/api/apps/68bcf273578a00ae2ac66bfd/files/mp/public/68bcf273578a00ae2ac66bfd/332bd6111_TessaPic4.JPG',
];

interface StateDualEventSeed {
  stateCode: string;
  stateName: string;
  region: 'Southeast' | 'Northeast' | 'Midwest' | 'Southwest' | 'West' | 'Pacific' | 'Mid-Atlantic';
  specialty: string;
  decEvent: {
    city: string;
    venue: string;
    address: string;
    zip: string;
    boothPrice: number;
    booths: number;
  };
  janEvent: {
    city: string;
    venue: string;
    address: string;
    zip: string;
    boothPrice: number;
    booths: number;
  };
}

const FIFTY_STATES_DUAL_EVENTS: StateDualEventSeed[] = [
  {
    stateCode: 'AL',
    stateName: 'Alabama',
    region: 'Southeast',
    specialty: 'Southern Folk Pottery, Woodcraft & Artisanal BBQ Rubs',
    decEvent: {
      city: 'Huntsville',
      venue: 'Big Spring International Park & Von Braun Promenade',
      address: '200 Church St SW, Huntsville, AL 35801',
      zip: '35801',
      boothPrice: 75,
      booths: 160,
    },
    janEvent: {
      city: 'Birmingham',
      venue: 'Railroad Park 1st Ave South Festival Lawn',
      address: '1600 1st Ave S, Birmingham, AL 35233',
      zip: '35233',
      boothPrice: 80,
      booths: 185,
    },
  },
  {
    stateCode: 'AK',
    stateName: 'Alaska',
    region: 'Pacific',
    specialty: 'Alaskan Birch Syrups, Carvings, Hand-Knit Wool & Smoked Salmon',
    decEvent: {
      city: 'Anchorage',
      venue: 'Dena’ina Civic & Convention Artisan Hall',
      address: '600 W 7th Ave, Anchorage, AK 99501',
      zip: '99501',
      boothPrice: 85,
      booths: 140,
    },
    janEvent: {
      city: 'Fairbanks',
      venue: 'Carlson Center Chena Riverfront Pavilion',
      address: '2010 2nd Ave, Fairbanks, AK 99701',
      zip: '99701',
      boothPrice: 70,
      booths: 110,
    },
  },
  {
    stateCode: 'AZ',
    stateName: 'Arizona',
    region: 'Southwest',
    specialty: 'Turquoise & Silver Metalsmithing, Desert Botanicals & Ceramics',
    decEvent: {
      city: 'Phoenix',
      venue: 'Margaret T. Hance Park & Roosevelt Row Arts Plaza',
      address: '67 W Culver St, Phoenix, AZ 85003',
      zip: '85003',
      boothPrice: 110,
      booths: 240,
    },
    janEvent: {
      city: 'Tucson',
      venue: 'Mercado San Agustin & Congress Street Courtyard',
      address: '100 S Avenida del Convento, Tucson, AZ 85745',
      zip: '85745',
      boothPrice: 95,
      booths: 190,
    },
  },
  {
    stateCode: 'AR',
    stateName: 'Arkansas',
    region: 'Southeast',
    specialty: 'Ozark Hardwood Carvings, Hand-Blown Glass & Quartz Jewelry',
    decEvent: {
      city: 'Little Rock',
      venue: 'River Market Pavilions & Clinton Presidential Park',
      address: '400 President Clinton Ave, Little Rock, AR 72201',
      zip: '72201',
      boothPrice: 75,
      booths: 165,
    },
    janEvent: {
      city: 'Fayetteville',
      venue: 'Historic Downtown Fayetteville Square & Gardens',
      address: '101 W Mountain St, Fayetteville, AR 72701',
      zip: '72701',
      boothPrice: 75,
      booths: 150,
    },
  },
  {
    stateCode: 'CA',
    stateName: 'California',
    region: 'West',
    specialty: 'Organic Botanical Skincare, Ceramic Homewares & Gourmet Street Food',
    decEvent: {
      city: 'Los Angeles',
      venue: 'Grand Park Downtown Civic Esplanade',
      address: '200 N Grand Ave, Los Angeles, CA 90012',
      zip: '90012',
      boothPrice: 145,
      booths: 320,
    },
    janEvent: {
      city: 'San Diego',
      venue: 'Balboa Park El Prado & Embarcadero Marina Lawn',
      address: '1549 El Prado, San Diego, CA 92101',
      zip: '92101',
      boothPrice: 135,
      booths: 280,
    },
  },
  {
    stateCode: 'CO',
    stateName: 'Colorado',
    region: 'West',
    specialty: 'Alpine Herbal Apothecaries, Leather Craft & Mountain Photography',
    decEvent: {
      city: 'Denver',
      venue: 'Civic Center Park & Greek Theater Promenade',
      address: '101 W 14th Ave, Denver, CO 80204',
      zip: '80204',
      boothPrice: 110,
      booths: 220,
    },
    janEvent: {
      city: 'Colorado Springs',
      venue: 'Acacia Park & Downtown Tejon Street Plaza',
      address: '115 E Platte Ave, Colorado Springs, CO 80903',
      zip: '80903',
      boothPrice: 90,
      booths: 170,
    },
  },
  {
    stateCode: 'CT',
    stateName: 'Connecticut',
    region: 'Northeast',
    specialty: 'New England Pewter, Nautical Woodcraft & Maple Confections',
    decEvent: {
      city: 'New Haven',
      venue: 'New Haven Green Historic Commons',
      address: '250 Temple St, New Haven, CT 06511',
      zip: '06511',
      boothPrice: 95,
      booths: 160,
    },
    janEvent: {
      city: 'Stamford',
      venue: 'Mill River Park & Harbor Point Boardwalk',
      address: '1010 Washington Blvd, Stamford, CT 06901',
      zip: '06901',
      boothPrice: 95,
      booths: 155,
    },
  },
  {
    stateCode: 'DE',
    stateName: 'Delaware',
    region: 'Mid-Atlantic',
    specialty: 'Coastal Sea Glass Jewelry, Beeswax Candles & Handwoven Textiles',
    decEvent: {
      city: 'Wilmington',
      venue: 'Tubman-Garrett Riverfront Park & Christina Walk',
      address: '800 S Madison St, Wilmington, DE 19801',
      zip: '19801',
      boothPrice: 80,
      booths: 145,
    },
    janEvent: {
      city: 'Rehoboth Beach',
      venue: 'Rehoboth Avenue Bandstand & Atlantic Boardwalk Plaza',
      address: '1 Rehoboth Ave, Rehoboth Beach, DE 19971',
      zip: '19971',
      boothPrice: 85,
      booths: 140,
    },
  },
  {
    stateCode: 'FL',
    stateName: 'Florida',
    region: 'Southeast',
    specialty: 'Tropical Botanicals, Certified Subtropical Farms & Coastal Resin Art',
    decEvent: {
      city: 'Miami',
      venue: 'Bayfront Park & Brickell Promenade Marketplace',
      address: '301 Biscayne Blvd, Miami, FL 33132',
      zip: '33132',
      boothPrice: 120,
      booths: 300,
    },
    janEvent: {
      city: 'Orlando',
      venue: 'Lake Eola Park East Lawn & Amphitheater Walk',
      address: '512 E Washington St, Orlando, FL 32801',
      zip: '32801',
      boothPrice: 110,
      booths: 250,
    },
  },
  {
    stateCode: 'GA',
    stateName: 'Georgia',
    region: 'Southeast',
    specialty: 'Southern Pecan Confections, Folk Pottery & Hand-Stitched Leather',
    decEvent: {
      city: 'Atlanta',
      venue: 'Piedmont Park Charles Allen Gate Meadow',
      address: '1320 Monroe Dr NE, Atlanta, GA 30306',
      zip: '30306',
      boothPrice: 115,
      booths: 260,
    },
    janEvent: {
      city: 'Savannah',
      venue: 'Forsyth Park Fountain Walk & Riverfront Esplanade',
      address: '2 W Gaston St, Savannah, GA 31401',
      zip: '31401',
      boothPrice: 105,
      booths: 210,
    },
  },
  {
    stateCode: 'HI',
    stateName: 'Hawaii',
    region: 'Pacific',
    specialty: 'Koa Wood Bowls, Tahitian Pearl Jewelry & Kona Coffee Roasters',
    decEvent: {
      city: 'Honolulu',
      venue: 'Kakaʻako Waterfront Park & Ward Village Courtyard',
      address: '102 Ohe St, Honolulu, HI 96813',
      zip: '96813',
      boothPrice: 125,
      booths: 190,
    },
    janEvent: {
      city: 'Hilo',
      venue: 'Hilo Bayfront Kamehameha Avenue Market Pavilion',
      address: '308 Kamehameha Ave, Hilo, HI 96720',
      zip: '96720',
      boothPrice: 95,
      booths: 145,
    },
  },
  {
    stateCode: 'ID',
    stateName: 'Idaho',
    region: 'West',
    specialty: 'Huckleberry Preserves, Custom Saddlery Leather & Gemstones',
    decEvent: {
      city: 'Boise',
      venue: 'Julia Davis Park & Capital City Grove Plaza',
      address: '700 S Capitol Blvd, Boise, ID 83702',
      zip: '83702',
      boothPrice: 80,
      booths: 165,
    },
    janEvent: {
      city: 'Coeur d’Alene',
      venue: 'Coeur d’Alene City Park & Lakefront Boardwalk',
      address: '415 W Mullan Ave, Coeur d’Alene, ID 83814',
      zip: '83814',
      boothPrice: 80,
      booths: 140,
    },
  },
  {
    stateCode: 'IL',
    stateName: 'Illinois',
    region: 'Midwest',
    specialty: 'Midwest Modern Ceramics, Architectural Prints & Craft Bakers',
    decEvent: {
      city: 'Chicago',
      venue: 'Grant Park Butler Field & Daley Bicentennial Plaza',
      address: '337 E Randolph St, Chicago, IL 60601',
      zip: '60601',
      boothPrice: 130,
      booths: 290,
    },
    janEvent: {
      city: 'Naperville',
      venue: 'Naperville Riverwalk Grand Pavilion & Rotary Hill',
      address: '440 W Aurora Ave, Naperville, IL 60540',
      zip: '60540',
      boothPrice: 95,
      booths: 175,
    },
  },
  {
    stateCode: 'IN',
    stateName: 'Indiana',
    region: 'Midwest',
    specialty: 'Hardwood Turnings, Woven Baskets & Small-Batch Maple Syrups',
    decEvent: {
      city: 'Indianapolis',
      venue: 'White River State Park & Monument Circle Promenade',
      address: '801 W Washington St, Indianapolis, IN 46204',
      zip: '46204',
      boothPrice: 90,
      booths: 200,
    },
    janEvent: {
      city: 'Fort Wayne',
      venue: 'Promenade Park Riverfront Pavilion & Headwaters Commons',
      address: '202 W Superior St, Fort Wayne, IN 46802',
      zip: '46802',
      boothPrice: 75,
      booths: 155,
    },
  },
  {
    stateCode: 'IA',
    stateName: 'Iowa',
    region: 'Midwest',
    specialty: 'Prairie Wildflower Honey, Blacksmith Ironwork & Barnwood Decor',
    decEvent: {
      city: 'Des Moines',
      venue: 'Historic Court District & Western Gateway Pappajohn Park',
      address: '1330 Grand Ave, Des Moines, IA 50309',
      zip: '50309',
      boothPrice: 80,
      booths: 175,
    },
    janEvent: {
      city: 'Cedar Rapids',
      venue: 'NewBo City Market Yard & Czech Village Riverfront',
      address: '1100 3rd St SE, Cedar Rapids, IA 52401',
      zip: '52401',
      boothPrice: 75,
      booths: 150,
    },
  },
  {
    stateCode: 'KS',
    stateName: 'Kansas',
    region: 'Midwest',
    specialty: 'Sun-Baked Stoneware, Smoked Pepper Sauces & Hand-Tooled Leather',
    decEvent: {
      city: 'Wichita',
      venue: 'Old Town Farm & Art Market Plaza',
      address: '835 E 1st St N, Wichita, KS 67202',
      zip: '67202',
      boothPrice: 75,
      booths: 165,
    },
    janEvent: {
      city: 'Overland Park',
      venue: 'Matt Ross Community Pavilion & Clock Tower Plaza',
      address: '7950 Marty St, Overland Park, KS 66204',
      zip: '66204',
      boothPrice: 85,
      booths: 160,
    },
  },
  {
    stateCode: 'KY',
    stateName: 'Kentucky',
    region: 'Southeast',
    specialty: 'Bourbon Barrel Woodcraft, Luthier Stringed Instruments & Equine Leather',
    decEvent: {
      city: 'Louisville',
      venue: 'Waterfront Park Great Lawn & NuLu Market District',
      address: '129 E River Rd, Louisville, KY 40202',
      zip: '40202',
      boothPrice: 90,
      booths: 195,
    },
    janEvent: {
      city: 'Lexington',
      venue: 'Tandy Centennial Park & Greyline Station Market Hall',
      address: '251 W Main St, Lexington, KY 40507',
      zip: '40507',
      boothPrice: 85,
      booths: 170,
    },
  },
  {
    stateCode: 'LA',
    stateName: 'Louisiana',
    region: 'Southeast',
    specialty: 'Creole Spice Blends, Cypress Wood Carvings & Festival Mask Art',
    decEvent: {
      city: 'New Orleans',
      venue: 'Lafayette Square & French Market Riverfront Esplanade',
      address: '540 St Charles Ave, New Orleans, LA 70130',
      zip: '70130',
      boothPrice: 110,
      booths: 230,
    },
    janEvent: {
      city: 'Baton Rouge',
      venue: 'North Boulevard Town Square & Shaw Center Plaza',
      address: '200 North Blvd, Baton Rouge, LA 70801',
      zip: '70801',
      boothPrice: 85,
      booths: 165,
    },
  },
  {
    stateCode: 'ME',
    stateName: 'Maine',
    region: 'Northeast',
    specialty: 'Maine Tourmaline Jewelry, Wild Blueberry Preserves & Sea Wool Knitwear',
    decEvent: {
      city: 'Portland',
      venue: 'Deering Oaks Park & Old Port Cobblestone Promenade',
      address: '200 State St, Portland, ME 04101',
      zip: '04101',
      boothPrice: 90,
      booths: 160,
    },
    janEvent: {
      city: 'Bangor',
      venue: 'Bangor Waterfront Park & Cross Center Artisan Hall',
      address: '1 Railroad St, Bangor, ME 04401',
      zip: '04401',
      boothPrice: 75,
      booths: 135,
    },
  },
  {
    stateCode: 'MD',
    stateName: 'Maryland',
    region: 'Mid-Atlantic',
    specialty: 'Chesapeake Maritime Woodwork, Hand-Blown Glass & Spiced Provisions',
    decEvent: {
      city: 'Baltimore',
      venue: 'Inner Harbor West Shore Park & Rash Field Pavilion',
      address: '401 Light St, Baltimore, MD 21202',
      zip: '21202',
      boothPrice: 105,
      booths: 220,
    },
    janEvent: {
      city: 'Annapolis',
      venue: 'Annapolis City Dock & Navy-Marine Corps Festival Grounds',
      address: '1 Dock St, Annapolis, MD 21401',
      zip: '21401',
      boothPrice: 100,
      booths: 190,
    },
  },
  {
    stateCode: 'MA',
    stateName: 'Massachusetts',
    region: 'Northeast',
    specialty: 'Cranberry Bog Confections, Fine Bookbinding & Studio Ceramics',
    decEvent: {
      city: 'Boston',
      venue: 'Rose Kennedy Greenway & Copley Square Artisan Plaza',
      address: '185 Kneeland St, Boston, MA 02111',
      zip: '02111',
      boothPrice: 130,
      booths: 250,
    },
    janEvent: {
      city: 'Worcester',
      venue: 'Worcester Common Oval & Canal District Market Hall',
      address: '455 Main St, Worcester, MA 01608',
      zip: '01608',
      boothPrice: 90,
      booths: 165,
    },
  },
  {
    stateCode: 'MI',
    stateName: 'Michigan',
    region: 'Midwest',
    specialty: 'Petoskey Stone Jewelry, Cherry Orchard Preserves & Heritage Furniture',
    decEvent: {
      city: 'Detroit',
      venue: 'Eastern Market Sheds & Campus Martius Park Plaza',
      address: '2934 Russell St, Detroit, MI 48207',
      zip: '48207',
      boothPrice: 100,
      booths: 240,
    },
    janEvent: {
      city: 'Grand Rapids',
      venue: 'Fulton Street Market & Calder Plaza Downtown',
      address: '1145 Fulton St E, Grand Rapids, MI 49503',
      zip: '49503',
      boothPrice: 85,
      booths: 180,
    },
  },
  {
    stateCode: 'MN',
    stateName: 'Minnesota',
    region: 'Midwest',
    specialty: 'Nordic Woodcarving, Wild Rice Gourmet Blends & Hand-Loomed Woolens',
    decEvent: {
      city: 'Minneapolis',
      venue: 'Nicollet Mall & Mill City Riverfront Commons',
      address: '704 S 2nd St, Minneapolis, MN 55401',
      zip: '55401',
      boothPrice: 100,
      booths: 210,
    },
    janEvent: {
      city: 'St. Paul',
      venue: 'Lowertown CHS Field Plaza & Rice Park Promenade',
      address: '290 E 5th St, St. Paul, MN 55101',
      zip: '55101',
      boothPrice: 90,
      booths: 185,
    },
  },
  {
    stateCode: 'MS',
    stateName: 'Mississippi',
    region: 'Southeast',
    specialty: 'Delta Blues Folk Art, Stoneground Grits & Hand-Thrown Stoneware',
    decEvent: {
      city: 'Jackson',
      venue: 'Mississippi Trademart & Fondren Arts District Commons',
      address: '1200 Mississippi St, Jackson, MS 39202',
      zip: '39202',
      boothPrice: 70,
      booths: 155,
    },
    janEvent: {
      city: 'Gulfport',
      venue: 'Jones Park Gulf Coast Harbor Esplanade',
      address: '2200 E Beach Blvd, Gulfport, MS 39501',
      zip: '39501',
      boothPrice: 75,
      booths: 160,
    },
  },
  {
    stateCode: 'MO',
    stateName: 'Missouri',
    region: 'Midwest',
    specialty: 'Hickory Smoked BBQ Craft, Copper Distilling Art & Hand-Quilted Textiles',
    decEvent: {
      city: 'Kansas City',
      venue: 'The City Market River Quay & Crown Center Square',
      address: '20 E 5th St, Kansas City, MO 64106',
      zip: '64106',
      boothPrice: 95,
      booths: 215,
    },
    janEvent: {
      city: 'St. Louis',
      venue: 'Soulard Historic Market Park & Forest Park World’s Fair Pavilion',
      address: '1730 S 8th St, St. Louis, MO 63104',
      zip: '63104',
      boothPrice: 95,
      booths: 210,
    },
  },
  {
    stateCode: 'MT',
    stateName: 'Montana',
    region: 'West',
    specialty: 'Yogo Sapphire Goldsmithing, Antler Carvings & Big Sky Botanicals',
    decEvent: {
      city: 'Billings',
      venue: 'Yellowstone Valley Broadway Commons & Skypoint Plaza',
      address: '2800 2nd Ave N, Billings, MT 59101',
      zip: '59101',
      boothPrice: 75,
      booths: 145,
    },
    janEvent: {
      city: 'Missoula',
      venue: 'Caras Park Clark Fork Riverfront Pavilion',
      address: '123 Carousel Dr, Missoula, MT 59802',
      zip: '59802',
      boothPrice: 80,
      booths: 150,
    },
  },
  {
    stateCode: 'NE',
    stateName: 'Nebraska',
    region: 'Midwest',
    specialty: 'Sandhills Leathercraft, Heirloom Grain Baked Goods & Metal Sculpture',
    decEvent: {
      city: 'Omaha',
      venue: 'Old Market Jackson Street Arcade & Gene Leahy Mall',
      address: '1101 Jackson St, Omaha, NE 68102',
      zip: '68102',
      boothPrice: 85,
      booths: 180,
    },
    janEvent: {
      city: 'Lincoln',
      venue: 'Historic Haymarket Railyard & Canopy Street Plaza',
      address: '350 Canopy St, Lincoln, NE 68508',
      zip: '68508',
      boothPrice: 80,
      booths: 165,
    },
  },
  {
    stateCode: 'NV',
    stateName: 'Nevada',
    region: 'West',
    specialty: 'Mojave Silver & Lapidary, Neon Glass Art & Desert Honey Balms',
    decEvent: {
      city: 'Las Vegas',
      venue: 'Symphony Park & Downtown Summerlin Pavilion Lawn',
      address: '1980 Festival Plaza Dr, Las Vegas, NV 89135',
      zip: '89135',
      boothPrice: 120,
      booths: 250,
    },
    janEvent: {
      city: 'Reno',
      venue: 'Wingfield Park Truckee Riverwalk & Idlewild Pavilion',
      address: '2 S Arlington Ave, Reno, NV 89501',
      zip: '89501',
      boothPrice: 90,
      booths: 175,
    },
  },
  {
    stateCode: 'NH',
    stateName: 'New Hampshire',
    region: 'Northeast',
    specialty: 'Granite State Woodturning, Pure Maple Confections & Linen Weaving',
    decEvent: {
      city: 'Manchester',
      venue: 'Veterans Memorial Park & Millyard Riverwalk Plaza',
      address: '889 Elm St, Manchester, NH 03101',
      zip: '03101',
      boothPrice: 80,
      booths: 150,
    },
    janEvent: {
      city: 'Portsmouth',
      venue: 'Market Square & Strawbery Banke Harbor Commons',
      address: '140 Marcy St, Portsmouth, NH 03801',
      zip: '03801',
      boothPrice: 85,
      booths: 145,
    },
  },
  {
    stateCode: 'NJ',
    stateName: 'New Jersey',
    region: 'Northeast',
    specialty: 'Garden State Heirloom Preserves, Blown Glass & Coastal Ceramics',
    decEvent: {
      city: 'Jersey City',
      venue: 'Liberty State Park & Grove Street PATH Pedestrian Plaza',
      address: '325 Newark Ave, Jersey City, NJ 07302',
      zip: '07302',
      boothPrice: 110,
      booths: 210,
    },
    janEvent: {
      city: 'Asbury Park',
      venue: 'Asbury Park Convention Hall & Oceanfront Boardwalk Arcade',
      address: '1300 Ocean Ave, Asbury Park, NJ 07712',
      zip: '07712',
      boothPrice: 100,
      booths: 185,
    },
  },
  {
    stateCode: 'NM',
    stateName: 'New Mexico',
    region: 'Southwest',
    specialty: 'Pueblo Pottery, Hatch Chile Culinary Goods & Chimayó Woven Textiles',
    decEvent: {
      city: 'Albuquerque',
      venue: 'Rail Yards Market Hall & Historic Old Town Plaza',
      address: '777 1st St SW, Albuquerque, NM 87102',
      zip: '87102',
      boothPrice: 90,
      booths: 200,
    },
    janEvent: {
      city: 'Santa Fe',
      venue: 'Santa Fe Railyard Park & Guadalupe Street Artisan Pavilion',
      address: '1607 Paseo de Peralta, Santa Fe, NM 87501',
      zip: '87501',
      boothPrice: 115,
      booths: 190,
    },
  },
  {
    stateCode: 'NY',
    stateName: 'New York',
    region: 'Northeast',
    specialty: 'Hudson Valley Farmstead Cheeses, Independent Fashion & Fine Art Prints',
    decEvent: {
      city: 'New York City',
      venue: 'Union Square North Esplanade & Bryant Park Pavilion',
      address: '201 E 17th St, New York, NY 10003',
      zip: '10003',
      boothPrice: 155,
      booths: 340,
    },
    janEvent: {
      city: 'Buffalo',
      venue: 'Canalside Waterfront Boardwalk & Larkin Square Pavilion',
      address: '44 Prime St, Buffalo, NY 14202',
      zip: '14202',
      boothPrice: 90,
      booths: 185,
    },
  },
  {
    stateCode: 'NC',
    stateName: 'North Carolina',
    region: 'Southeast',
    specialty: 'Seagrove Salt-Glaze Pottery, Blue Ridge Woodcraft & Craft Cider',
    decEvent: {
      city: 'Charlotte',
      venue: 'Romare Bearden Park & Camp North End Boileryard',
      address: '300 S Church St, Charlotte, NC 28202',
      zip: '28202',
      boothPrice: 105,
      booths: 230,
    },
    janEvent: {
      city: 'Raleigh',
      venue: 'Moore Square Historic Park & State Farmers Market Pavilion',
      address: '200 S Blount St, Raleigh, NC 27601',
      zip: '27601',
      boothPrice: 95,
      booths: 205,
    },
  },
  {
    stateCode: 'ND',
    stateName: 'North Dakota',
    region: 'Midwest',
    specialty: 'Chokecherry Syrups,Sunflower Botanical Soaps & Prairie Quilts',
    decEvent: {
      city: 'Fargo',
      venue: 'Broadway Square Civic Plaza & Red River Market Hall',
      address: '201 Broadway N, Fargo, ND 58102',
      zip: '58102',
      boothPrice: 70,
      booths: 145,
    },
    janEvent: {
      city: 'Bismarck',
      venue: 'Dykshoorn Park & Bismarck Event Center Artisan Concourse',
      address: '315 S 5th St, Bismarck, ND 58504',
      zip: '58504',
      boothPrice: 70,
      booths: 130,
    },
  },
  {
    stateCode: 'OH',
    stateName: 'Ohio',
    region: 'Midwest',
    specialty: 'Appalachian Flameware Pottery, Amish Woodwork & Buckeye Confections',
    decEvent: {
      city: 'Columbus',
      venue: 'Scioto Mile Bicentennial Park & North Market Plaza',
      address: '233 W Civic Center Dr, Columbus, OH 43215',
      zip: '43215',
      boothPrice: 100,
      booths: 225,
    },
    janEvent: {
      city: 'Cincinnati',
      venue: 'Findlay Market Esplanade & Washington Park Over-the-Rhine',
      address: '1801 Race St, Cincinnati, OH 45202',
      zip: '45202',
      boothPrice: 95,
      booths: 210,
    },
  },
  {
    stateCode: 'OK',
    stateName: 'Oklahoma',
    region: 'Southwest',
    specialty: 'Native Beadwork & Silver, Red Dirt Ceramics & Pecan Pralines',
    decEvent: {
      city: 'Oklahoma City',
      venue: 'Scissortail Park Upper Promenade & Myriad Botanical Lawn',
      address: '300 SW 7th St, Oklahoma City, OK 73109',
      zip: '73109',
      boothPrice: 85,
      booths: 195,
    },
    janEvent: {
      city: 'Tulsa',
      venue: 'Gathering Place Williams Lodge Lawn & Guthrie Green',
      address: '111 E Reconciliation Way, Tulsa, OK 74103',
      zip: '74103',
      boothPrice: 85,
      booths: 185,
    },
  },
  {
    stateCode: 'OR',
    stateName: 'Oregon',
    region: 'Pacific',
    specialty: 'Willamette Valley Hazelnut Treats, Myrtlewood Turning & Eco-Textiles',
    decEvent: {
      city: 'Portland',
      venue: 'Tom McCall Waterfront Park & Pioneer Courthouse Square',
      address: '98 SW Naito Pkwy, Portland, OR 97204',
      zip: '97204',
      boothPrice: 115,
      booths: 250,
    },
    janEvent: {
      city: 'Eugene',
      venue: '8th & Oak Park Blocks & Lane County Farmers Market Pavilion',
      address: '85 E 8th Ave, Eugene, OR 97401',
      zip: '97401',
      boothPrice: 90,
      booths: 175,
    },
  },
  {
    stateCode: 'PA',
    stateName: 'Pennsylvania',
    region: 'Mid-Atlantic',
    specialty: 'Pennsylvania Dutch Hex Art, Hand-Forged Ironwork & Artisan Pretzels',
    decEvent: {
      city: 'Philadelphia',
      venue: 'Dilworth Park City Hall Courtyard & Rittenhouse Square Walk',
      address: '1 S 15th St, Philadelphia, PA 19102',
      zip: '19102',
      boothPrice: 125,
      booths: 270,
    },
    janEvent: {
      city: 'Pittsburgh',
      venue: 'Market Square Downtown & Strip District Terminal Sheds',
      address: '2100 Smallman St, Pittsburgh, PA 15222',
      zip: '15222',
      boothPrice: 105,
      booths: 220,
    },
  },
  {
    stateCode: 'RI',
    stateName: 'Rhode Island',
    region: 'Northeast',
    specialty: 'Ocean State Blown Glass, Sterling Silversmithing & Coastal Watercolors',
    decEvent: {
      city: 'Providence',
      venue: 'Waterplace Park Basin & Hope Street Artisan Promenade',
      address: '1 Financial Plaza, Providence, RI 02903',
      zip: '02903',
      boothPrice: 95,
      booths: 170,
    },
    janEvent: {
      city: 'Newport',
      venue: 'Bowen’s Wharf Harborfront & Touro Park Commons',
      address: '13 Bowens Wharf, Newport, RI 02840',
      zip: '02840',
      boothPrice: 100,
      booths: 155,
    },
  },
  {
    stateCode: 'SC',
    stateName: 'South Carolina',
    region: 'Southeast',
    specialty: 'Lowcountry Sweetgrass Baskets, Catawba Pottery & Benne Wafer Bakers',
    decEvent: {
      city: 'Columbia',
      venue: 'Historic Main Street District & Finlay Park Promenade',
      address: '1200 Main Street, Columbia, SC 29201',
      zip: '29201',
      boothPrice: 85,
      booths: 220,
    },
    janEvent: {
      city: 'Charleston',
      venue: 'Marion Square Historic Green & King Street Arts Walk',
      address: '329 Meeting St, Charleston, SC 29403',
      zip: '29403',
      boothPrice: 110,
      booths: 230,
    },
  },
  {
    stateCode: 'SD',
    stateName: 'South Dakota',
    region: 'Midwest',
    specialty: 'Black Hills Gold Jewelry, Bison Leathercraft & Dakota Wild Berry Jams',
    decEvent: {
      city: 'Sioux Falls',
      venue: 'Falls Park Overlook & Cherapa Place Riverwalk Plaza',
      address: '131 E Falls Park Dr, Sioux Falls, SD 57104',
      zip: '57104',
      boothPrice: 75,
      booths: 150,
    },
    janEvent: {
      city: 'Rapid City',
      venue: 'Main Street Square & Memorial Park Promenade',
      address: '512 Main St, Rapid City, SD 57701',
      zip: '57701',
      boothPrice: 75,
      booths: 140,
    },
  },
  {
    stateCode: 'TN',
    stateName: 'Tennessee',
    region: 'Southeast',
    specialty: 'Custom Acoustic Luthiers, Smoky Mountain Pottery & Hot Chicken Spices',
    decEvent: {
      city: 'Nashville',
      venue: 'Riverfront Park Ascend Lawn & Bicentennial Capitol Mall',
      address: '100 1st Ave N, Nashville, TN 37201',
      zip: '37201',
      boothPrice: 115,
      booths: 245,
    },
    janEvent: {
      city: 'Memphis',
      venue: 'Tom Lee Park Mississippi Riverfront & Overton Square',
      address: '45 Riverside Dr, Memphis, TN 38103',
      zip: '38103',
      boothPrice: 95,
      booths: 200,
    },
  },
  {
    stateCode: 'TX',
    stateName: 'Texas',
    region: 'Southwest',
    specialty: 'Hand-Tooled Western Boots, Hill Country Lavender & Craft Pitmaster Rubs',
    decEvent: {
      city: 'Houston',
      venue: 'Discovery Green Promenade & Sam Houston Park',
      address: '1500 McKinney St, Houston, TX 77010',
      zip: '77010',
      boothPrice: 120,
      booths: 280,
    },
    janEvent: {
      city: 'Dallas',
      venue: 'Klyde Warren Park Deck & Dallas Farmers Market Shed',
      address: '2012 Woodall Rodgers Fwy, Dallas, TX 75201',
      zip: '75201',
      boothPrice: 115,
      booths: 260,
    },
  },
  {
    stateCode: 'UT',
    stateName: 'Utah',
    region: 'West',
    specialty: 'Wasatch Botanical Balms, Red Rock Stoneware & Artisan Bean-to-Bar Chocolate',
    decEvent: {
      city: 'Salt Lake City',
      venue: 'Pioneer Park Historic Square & Gallivan Center Plaza',
      address: '350 S 300 W, Salt Lake City, UT 84101',
      zip: '84101',
      boothPrice: 95,
      booths: 200,
    },
    janEvent: {
      city: 'Park City',
      venue: 'Historic Main Street Town Lift Plaza & City Park Pavilion',
      address: '825 Main St, Park City, UT 84060',
      zip: '84060',
      boothPrice: 115,
      booths: 170,
    },
  },
  {
    stateCode: 'VT',
    stateName: 'Vermont',
    region: 'Northeast',
    specialty: 'Wood-Fired Maple Syrup, Simon Pearce Style Glass & Merino Knitwear',
    decEvent: {
      city: 'Burlington',
      venue: 'Church Street Marketplace & Waterfront Park Boardwalk',
      address: '2 Church St, Burlington, VT 05401',
      zip: '05401',
      boothPrice: 85,
      booths: 155,
    },
    janEvent: {
      city: 'Montpelier',
      venue: 'State House Lawn & Caledonia Spirits Artisan Courtyard',
      address: '115 State St, Montpelier, VT 05633',
      zip: '05633',
      boothPrice: 75,
      booths: 130,
    },
  },
  {
    stateCode: 'VA',
    stateName: 'Virginia',
    region: 'Mid-Atlantic',
    specialty: 'Shenandoah Heritage Woodcraft, Virginia Peanut Brittle & Pewter Art',
    decEvent: {
      city: 'Virginia Beach',
      venue: '24th Street Oceanfront Park & ViBe Creative District',
      address: '2400 Atlantic Ave, Virginia Beach, VA 23451',
      zip: '23451',
      boothPrice: 95,
      booths: 205,
    },
    janEvent: {
      city: 'Richmond',
      venue: '17th Street Market Plaza & Brown’s Island Riverfront',
      address: '100 N 17th St, Richmond, VA 23219',
      zip: '23219',
      boothPrice: 90,
      booths: 195,
    },
  },
  {
    stateCode: 'WA',
    stateName: 'Washington',
    region: 'Pacific',
    specialty: 'Puget Sound Blown Glass, Cedar Carving, Espresso Roasters & Berry Preserves',
    decEvent: {
      city: 'Seattle',
      venue: 'Pier 62 Waterfront Park & Seattle Center Fisher Pavilion',
      address: '1951 Alaskan Way, Seattle, WA 98101',
      zip: '98101',
      boothPrice: 125,
      booths: 250,
    },
    janEvent: {
      city: 'Spokane',
      venue: 'Riverfront Park Clocktower Meadow & Kendall Yards Plaza',
      address: '507 N Howard St, Spokane, WA 99201',
      zip: '99201',
      boothPrice: 85,
      booths: 170,
    },
  },
  {
    stateCode: 'WV',
    stateName: 'West Virginia',
    region: 'Mid-Atlantic',
    specialty: 'Blenko Style Hand-Blown Glass, Appalachian Quilts & Mountain Honey',
    decEvent: {
      city: 'Charleston',
      venue: 'Haddad Riverfront Park & Capitol Market Courtyard',
      address: '600 Kanawha Blvd E, Charleston, WV 25301',
      zip: '25301',
      boothPrice: 75,
      booths: 150,
    },
    janEvent: {
      city: 'Morgantown',
      venue: 'Hazel Ruby McQuain Riverfront Amphitheater & Marketplace',
      address: '185 Garrett St, Morgantown, WV 26505',
      zip: '26505',
      boothPrice: 75,
      booths: 145,
    },
  },
  {
    stateCode: 'WI',
    stateName: 'Wisconsin',
    region: 'Midwest',
    specialty: 'Artisan Cave-Aged Cheeses, Door County Cherry Jams & Copperware',
    decEvent: {
      city: 'Milwaukee',
      venue: 'Deer District Plaza & Historic Third Ward Public Market',
      address: '400 N Water St, Milwaukee, WI 53202',
      zip: '53202',
      boothPrice: 95,
      booths: 205,
    },
    janEvent: {
      city: 'Madison',
      venue: 'Capitol Square Promenade & Monona Terrace Lakefront',
      address: '2 E Main St, Madison, WI 53703',
      zip: '53703',
      boothPrice: 95,
      booths: 195,
    },
  },
  {
    stateCode: 'WY',
    stateName: 'Wyoming',
    region: 'West',
    specialty: 'Teton Silver & Jade Jewelry, Custom Western Leather & Sage Honey',
    decEvent: {
      city: 'Cheyenne',
      venue: 'Cheyenne Depot Plaza & Frontier Botanic Gardens',
      address: '121 W 15th St, Cheyenne, WY 82001',
      zip: '82001',
      boothPrice: 75,
      booths: 140,
    },
    janEvent: {
      city: 'Jackson',
      venue: 'Jackson Town Square Antler Arches & Center for the Arts Lawn',
      address: '10 E Broadway Ave, Jackson, WY 83001',
      zip: '83001',
      boothPrice: 110,
      booths: 155,
    },
  },
];

// 20 distinct color palettes so each of the 100 events gets a unique combination of colors, landscape geometry, star/lantern patterns, and badge styling
const THUMBNAIL_PALETTES = [
  { bg1: '#1E3A2F', bg2: '#3B6E52', accent: '#E8B86D', tent: '#FDFBF7', hill1: '#152A22', hill2: '#274B3A' },
  { bg1: '#2C223E', bg2: '#6B4984', accent: '#F4A261', tent: '#FFF8F0', hill1: '#1B1426', hill2: '#432C52' },
  { bg1: '#1B3B4B', bg2: '#3D7A8A', accent: '#F2CC8F', tent: '#FAF8F5', hill1: '#102530', hill2: '#255261' },
  { bg1: '#4A2511', bg2: '#994D26', accent: '#F6BD60', tent: '#FFFDF9', hill1: '#2E160A', hill2: '#6B3418' },
  { bg1: '#1F2937', bg2: '#4B5563', accent: '#A8D5BA', tent: '#F9FAFB', hill1: '#111827', hill2: '#374151' },
  { bg1: '#3D2B1F', bg2: '#7A593E', accent: '#E9C46A', tent: '#FDFBF7', hill1: '#261A12', hill2: '#543D2B' },
  { bg1: '#143642', bg2: '#0F8B8D', accent: '#EC9A29', tent: '#F8F9FA', hill1: '#0B1F26', hill2: '#185359' },
  { bg1: '#3B1F2B', bg2: '#893168', accent: '#F7B801', tent: '#FFF9FB', hill1: '#24121A', hill2: '#592043' },
  { bg1: '#283618', bg2: '#606C38', accent: '#DDA15E', tent: '#FEFAE0', hill1: '#1A240F', hill2: '#414A25' },
  { bg1: '#1D3557', bg2: '#457B9D', accent: '#F1FAEE', tent: '#FFFFFF', hill1: '#101F33', hill2: '#2B4E69' },
  { bg1: '#372549', bg2: '#774C60', accent: '#EACDC2', tent: '#FFFDFD', hill1: '#22162E', hill2: '#523442' },
  { bg1: '#2B3A42', bg2: '#3F5765', accent: '#FF8C42', tent: '#F7F5EE', hill1: '#1A2429', hill2: '#2F424D' },
  { bg1: '#432818', bg2: '#99582A', accent: '#FFE6A7', tent: '#FFFDF7', hill1: '#2B190F', hill2: '#6F1D1B' },
  { bg1: '#0B3954', bg2: '#087E8B', accent: '#BFD7EA', tent: '#FFFFFF', hill1: '#062030', hill2: '#0A5563' },
  { bg1: '#2D3142', bg2: '#4F5D75', accent: '#EF8354', tent: '#FFFFFF', hill1: '#1B1E29', hill2: '#3B4457' },
  { bg1: '#3A405A', bg2: '#685044', accent: '#F9DEC9', tent: '#FFFDF9', hill1: '#232738', hill2: '#4A3A31' },
  { bg1: '#1A3C40', bg2: '#417D7A', accent: '#EDE6DB', tent: '#FFFFFF', hill1: '#0F2426', hill2: '#2B5553' },
  { bg1: '#4E148C', bg2: '#858AE3', accent: '#F9C74F', tent: '#FFFFFF', hill1: '#2C0B4E', hill2: '#564592' },
  { bg1: '#2F3E46', bg2: '#52796F', accent: '#CAD2C5', tent: '#FAF8F5', hill1: '#1B2429', hill2: '#354F52' },
  { bg1: '#5F0F40', bg2: '#9A031E', accent: '#FB8B24', tent: '#FFF8F0', hill1: '#380926', hill2: '#6E0925' },
];

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generates a 100% unique SVG event thumbnail data URI for each of the 100 nationwide events.
 */
export function generateUniqueEventThumbnail(params: {
  eventNumber: number; // 1..100
  stateCode: string;
  stateName: string;
  cityName: string;
  venueName: string;
  seasonLabel: string; // 'DEC 18–20, 2026 • FRI–SUN' or 'JAN 29–31, 2027 • FRI–SUN'
  editionTag: string;
  boothPrice: number;
}): string {
  const idx = params.eventNumber - 1;
  const pal = THUMBNAIL_PALETTES[idx % THUMBNAIL_PALETTES.length];
  const sunX = 110 + ((idx * 53) % 580);
  const sunY = 95 + ((idx * 19) % 55);
  const peakOffset = (idx * 37) % 140;

  const safeCity = escapeXml(params.cityName.toUpperCase());
  const safeState = escapeXml(params.stateName.toUpperCase());
  const safeVenue = escapeXml(
    params.venueName.length > 44 ? params.venueName.slice(0, 42) + '...' : params.venueName
  );
  const safeSeason = escapeXml(params.seasonLabel);
  const safeEdition = escapeXml(params.editionTag);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
    <defs>
      <linearGradient id="sky-${params.eventNumber}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${pal.bg1}" />
        <stop offset="100%" stop-color="${pal.bg2}" />
      </linearGradient>
      <radialGradient id="glow-${params.eventNumber}" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${pal.accent}" stop-opacity="0.55" />
        <stop offset="100%" stop-color="${pal.accent}" stop-opacity="0" />
      </radialGradient>
    </defs>

    <!-- Sky Background -->
    <rect width="800" height="500" fill="url(#sky-${params.eventNumber})" />

    <!-- Unique Sun / Moon Festival Glow -->
    <circle cx="${sunX}" cy="${sunY}" r="135" fill="url(#glow-${params.eventNumber})" />
    <circle cx="${sunX}" cy="${sunY}" r="42" fill="${pal.accent}" opacity="0.3" />

    <!-- Festive String Lights Arc -->
    <path d="M 0 65 Q 200 130 400 75 T 800 95" fill="none" stroke="${pal.accent}" stroke-width="1.5" stroke-opacity="0.45" />
    <circle cx="95" cy="88" r="4.5" fill="${pal.accent}" opacity="0.85" />
    <circle cx="210" cy="102" r="5" fill="#FFF" opacity="0.85" />
    <circle cx="330" cy="89" r="4.5" fill="${pal.accent}" opacity="0.85" />
    <circle cx="465" cy="78" r="5" fill="#FFF" opacity="0.85" />
    <circle cx="595" cy="92" r="4.5" fill="${pal.accent}" opacity="0.85" />
    <circle cx="715" cy="96" r="5" fill="#FFF" opacity="0.85" />

    <!-- Regional Horizon & Mountain / Skyline Silhouette -->
    <path d="M 0 360 L ${120 + peakOffset} 245 L ${290 + peakOffset / 2} 315 L ${460 - peakOffset / 2} 225 L ${630} 305 L 800 250 L 800 500 L 0 500 Z" fill="${pal.hill2}" opacity="0.65" />
    <path d="M 0 385 Q 220 330 430 375 T 800 355 L 800 500 L 0 500 Z" fill="${pal.hill1}" />

    <!-- Artisan Market Tent Canopies Silhouette -->
    <g transform="translate(495, 315)">
      <polygon points="0,50 42,8 84,50" fill="${pal.tent}" opacity="0.92" />
      <rect x="8" y="50" width="68" height="36" fill="${pal.tent}" opacity="0.22" />
      <line x1="10" y1="50" x2="10" y2="86" stroke="${pal.tent}" stroke-width="3" />
      <line x1="74" y1="50" x2="74" y2="86" stroke="${pal.tent}" stroke-width="3" />
      <circle cx="42" cy="58" r="4" fill="${pal.accent}" />
    </g>
    <g transform="translate(595, 322)">
      <polygon points="0,45 38,10 76,45" fill="${pal.accent}" opacity="0.9" />
      <rect x="7" y="45" width="62" height="34" fill="${pal.tent}" opacity="0.18" />
      <line x1="9" y1="45" x2="9" y2="79" stroke="${pal.tent}" stroke-width="2.5" />
      <line x1="67" y1="45" x2="67" y2="79" stroke="${pal.tent}" stroke-width="2.5" />
    </g>
    <g transform="translate(685, 328)">
      <polygon points="0,40 34,10 68,40" fill="${pal.tent}" opacity="0.88" />
      <line x1="8" y1="40" x2="8" y2="72" stroke="${pal.tent}" stroke-width="2.5" />
      <line x1="60" y1="40" x2="60" y2="72" stroke="${pal.tent}" stroke-width="2.5" />
    </g>

    <!-- Top Badge Row -->
    <rect x="42" y="36" width="84" height="38" rx="12" fill="${pal.accent}" />
    <text x="84" y="61" text-anchor="middle" font-family="monospace, sans-serif" font-size="20" font-weight="900" fill="${pal.hill1}">${escapeXml(params.stateCode)}</text>

    <rect x="138" y="36" width="295" height="38" rx="12" fill="#000000" fill-opacity="0.38" stroke="${pal.accent}" stroke-opacity="0.5" stroke-width="1" />
    <text x="285" y="60" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="700" letter-spacing="1.2" fill="#FFFFFF">${safeEdition} • EVENT #${params.eventNumber}/100</text>

    <!-- Main City & State Typography -->
    <text x="44" y="155" font-family="Georgia, serif" font-size="16" font-weight="700" letter-spacing="3" fill="${pal.accent}">${safeState} ARTISAN &amp; FARMERS MARKET</text>
    <text x="44" y="218" font-family="Georgia, serif" font-size="52" font-weight="900" fill="#FFFFFF">${safeCity}</text>

    <!-- Premier Venue Pill -->
    <rect x="44" y="242" width="435" height="38" rx="10" fill="#FFFFFF" fill-opacity="0.14" />
    <text x="60" y="266" font-family="sans-serif" font-size="15" font-weight="700" fill="#F8FAFC">📍 ${safeVenue}</text>

    <!-- Bottom Weekend Date Banner -->
    <rect x="42" y="405" width="716" height="58" rx="16" fill="#000000" fill-opacity="0.55" stroke="${pal.accent}" stroke-width="1.5" stroke-opacity="0.65" />
    <text x="66" y="440" font-family="monospace, sans-serif" font-size="19" font-weight="800" fill="${pal.accent}">🗓 ${safeSeason}</text>
    <text x="734" y="440" text-anchor="end" font-family="sans-serif" font-size="16" font-weight="800" fill="#FFFFFF">FRI • SAT • SUN | $${params.boothPrice}/DAY</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Generates all 100 Nationwide US State Events (50 States × 2 Events per State):
 * - Event #1 per state: Friday Dec 18 – Sunday Dec 20, 2026 in Major City #1
 * - Event #2 per state: Friday Jan 29 – Sunday Jan 31, 2027 in Major City #2
 */
export const NATIONWIDE_100_STATE_EVENTS: EventLocationMarket[] = FIFTY_STATES_DUAL_EVENTS.flatMap(
  (st, stateIndex) => {
    const decEventNum = stateIndex * 2 + 1;
    const janEventNum = stateIndex * 2 + 2;

    const decPhoto1 = VERIFIED_MARKET_GALLERY_PHOTOS[decEventNum % VERIFIED_MARKET_GALLERY_PHOTOS.length];
    const decPhoto2 = VERIFIED_MARKET_GALLERY_PHOTOS[(decEventNum + 3) % VERIFIED_MARKET_GALLERY_PHOTOS.length];
    const janPhoto1 = VERIFIED_MARKET_GALLERY_PHOTOS[janEventNum % VERIFIED_MARKET_GALLERY_PHOTOS.length];
    const janPhoto2 = VERIFIED_MARKET_GALLERY_PHOTOS[(janEventNum + 5) % VERIFIED_MARKET_GALLERY_PHOTOS.length];

    const decThumb = generateUniqueEventThumbnail({
      eventNumber: decEventNum,
      stateCode: st.stateCode,
      stateName: st.stateName,
      cityName: st.decEvent.city,
      venueName: st.decEvent.venue,
      seasonLabel: 'DEC 18 – DEC 20, 2026',
      editionTag: 'DECEMBER END-WEEK TOUR',
      boothPrice: st.decEvent.boothPrice,
    });

    const janThumb = generateUniqueEventThumbnail({
      eventNumber: janEventNum,
      stateCode: st.stateCode,
      stateName: st.stateName,
      cityName: st.janEvent.city,
      venueName: st.janEvent.venue,
      seasonLabel: 'JAN 29 – JAN 31, 2027',
      editionTag: 'JANUARY END-WEEK TOUR',
      boothPrice: st.janEvent.boothPrice,
    });

    const decItem: EventLocationMarket = {
      id: `us100-${st.stateCode.toLowerCase()}-dec-${st.decEvent.city.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      title: `${st.decEvent.city}, ${st.stateCode} Holiday Artisan & Farmers Market (Dec 18–20)`,
      stateCode: st.stateCode,
      stateName: st.stateName,
      cityName: st.decEvent.city,
      venueName: st.decEvent.venue,
      address: st.decEvent.address,
      zipCode: st.decEvent.zip,
      mapUrl: `https://maps.google.com/?q=${encodeURIComponent(st.decEvent.address)}`,
      description: `Premier 3-day Friday–Sunday December end-week market at ${st.decEvent.venue} in ${st.decEvent.city}, ${st.stateName}. Highlighting ${st.specialty}, Certified Farmers, Prepared Food, Prepackaged Food, Retail & Crafts, Bath & Body, Non-Profit, Entertainment, and Info Booths.`,
      startDate: '2026-12-18',
      endDate: '2026-12-20',
      isNonStop: true,
      dates: ['2026-12-18', '2026-12-19', '2026-12-20'],
      days: ['fri', 'sat', 'sun'],
      hours: '10:00 AM – 7:00 PM (Fri • Sat • Sun)',
      vendorTypesAccepted: ALL_VENDOR_TYPES,
      boothPricePerDay: st.decEvent.boothPrice,
      totalBoothsCount: st.decEvent.booths,
      active: true,
      imageUrl: decThumb,
      images: [decThumb, decPhoto1, decPhoto2],
      importedFrom: `Nationwide 50-State Tour (#${decEventNum}/100)`,
      createdAt: '2026-11-10T00:00:00Z',
      updatedAt: '2026-11-10T00:00:00Z',
    };

    const janItem: EventLocationMarket = {
      id: `us100-${st.stateCode.toLowerCase()}-jan-${st.janEvent.city.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      title: `${st.janEvent.city}, ${st.stateCode} Winter Makers & Farmers Showcase (Jan 29–31)`,
      stateCode: st.stateCode,
      stateName: st.stateName,
      cityName: st.janEvent.city,
      venueName: st.janEvent.venue,
      address: st.janEvent.address,
      zipCode: st.janEvent.zip,
      mapUrl: `https://maps.google.com/?q=${encodeURIComponent(st.janEvent.address)}`,
      description: `Flagship 3-day Friday–Sunday January end-week showcase at ${st.janEvent.venue} in ${st.janEvent.city}, ${st.stateName}. Featuring ${st.specialty}, Certified Farmers, Prepared Food, Prepackaged Food, Retail & Crafts, Bath & Body, Non-Profit, Entertainment, and Info Booths.`,
      startDate: '2027-01-29',
      endDate: '2027-01-31',
      isNonStop: true,
      dates: ['2027-01-29', '2027-01-30', '2027-01-31'],
      days: ['fri', 'sat', 'sun'],
      hours: '10:00 AM – 6:30 PM (Fri • Sat • Sun)',
      vendorTypesAccepted: ALL_VENDOR_TYPES,
      boothPricePerDay: st.janEvent.boothPrice,
      totalBoothsCount: st.janEvent.booths,
      active: true,
      imageUrl: janThumb,
      images: [janThumb, janPhoto1, janPhoto2],
      importedFrom: `Nationwide 50-State Tour (#${janEventNum}/100)`,
      createdAt: '2026-11-10T00:00:00Z',
      updatedAt: '2026-11-10T00:00:00Z',
    };

    return [decItem, janItem];
  }
);
