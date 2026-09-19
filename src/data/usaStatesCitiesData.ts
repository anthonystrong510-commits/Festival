export interface CityPopulationInfo {
  name: string;
  population: string;
  populationNumber: number;
  rank: number;
}

export interface UsaStateMarket {
  code: string;
  name: string;
  slug: string;
  region: 'Southeast' | 'Northeast' | 'Midwest' | 'Southwest' | 'West' | 'Pacific' | 'Mid-Atlantic';
  top3Cities: CityPopulationInfo[];
  citiesOver200k: CityPopulationInfo[];
  majorCities: string[];
  annualEventsCount: number;
  salesTaxInfo: string;
  artisanSpecialties: string[];
  popularCategories: string[];
  vendorPermitRequirement: string;
}

export const USA_STATES_CITIES_DATA: UsaStateMarket[] = [
  {
    "code": "AL",
    "name": "Alabama",
    "slug": "alabama",
    "region": "Southeast",
    "top3Cities": [
      {
        "name": "Huntsville",
        "population": "221,570",
        "populationNumber": 221570,
        "rank": 1
      },
      {
        "name": "Birmingham",
        "population": "196,910",
        "populationNumber": 196910,
        "rank": 2
      },
      {
        "name": "Montgomery",
        "population": "196,050",
        "populationNumber": 196050,
        "rank": 3
      }
    ],
    "citiesOver200k": [
      {
        "name": "Huntsville",
        "population": "221,570",
        "populationNumber": 221570,
        "rank": 1
      }
    ],
    "majorCities": [
      "Huntsville",
      "Birmingham",
      "Montgomery",
      "Mobile",
      "Tuscaloosa",
      "Auburn",
      "Florence",
      "Dothan",
      "Decatur",
      "Madison"
    ],
    "annualEventsCount": 42,
    "salesTaxInfo": "Alabama Department of Revenue Transient Vendor Tax Certificate (4% State + Local)",
    "artisanSpecialties": [
      "Southern Folk Pottery",
      "Woodcraft & Cedar Carvings",
      "Handmade Quilts",
      "BBQ Sauces & Rubs"
    ],
    "popularCategories": [
      "Artisan Crafts",
      "Gourmet Food Trucks",
      "Woodworking",
      "Handmade Jewelry"
    ],
    "vendorPermitRequirement": "City business license & Alabama Special Event Tax return required within 30 days."
  },
  {
    "code": "AK",
    "name": "Alaska",
    "slug": "alaska",
    "region": "Pacific",
    "top3Cities": [
      {
        "name": "Anchorage",
        "population": "287,145",
        "populationNumber": 287145,
        "rank": 1
      },
      {
        "name": "Fairbanks",
        "population": "32,515",
        "populationNumber": 32515,
        "rank": 2
      },
      {
        "name": "Juneau",
        "population": "31,555",
        "populationNumber": 31555,
        "rank": 3
      }
    ],
    "citiesOver200k": [
      {
        "name": "Anchorage",
        "population": "287,145",
        "populationNumber": 287145,
        "rank": 1
      }
    ],
    "majorCities": [
      "Anchorage",
      "Fairbanks",
      "Juneau",
      "Wasilla",
      "Sitka",
      "Ketchikan",
      "Kenai",
      "Palmer",
      "Kodiak"
    ],
    "annualEventsCount": 18,
    "salesTaxInfo": "No State Sales Tax; Municipal sales tax applies in select boroughs (0%–7.5%)",
    "artisanSpecialties": [
      "Native Alaskan Ivory & Bone Carvings",
      "Birch Syrup & Berry Jams",
      "Hand-Knitted Qiviut & Wool",
      "Smoked Salmon Preserves"
    ],
    "popularCategories": [
      "Indigenous Arts",
      "Winter Apparel & Furs",
      "Specialty Seafood",
      "Handcrafted Knives"
    ],
    "vendorPermitRequirement": "Borough-specific event vendor registration & DEC Food Safety Permit for prepared goods."
  },
  {
    "code": "AZ",
    "name": "Arizona",
    "slug": "arizona",
    "region": "Southwest",
    "top3Cities": [
      {
        "name": "Phoenix",
        "population": "1,651,340",
        "populationNumber": 1651340,
        "rank": 1
      },
      {
        "name": "Tucson",
        "population": "546,570",
        "populationNumber": 546570,
        "rank": 2
      },
      {
        "name": "Mesa",
        "population": "512,490",
        "populationNumber": 512490,
        "rank": 3
      }
    ],
    "citiesOver200k": [
      {
        "name": "Phoenix",
        "population": "1,651,340",
        "populationNumber": 1651340,
        "rank": 1
      },
      {
        "name": "Tucson",
        "population": "546,570",
        "populationNumber": 546570,
        "rank": 2
      },
      {
        "name": "Mesa",
        "population": "512,490",
        "populationNumber": 512490,
        "rank": 3
      },
      {
        "name": "Chandler",
        "population": "280,165",
        "populationNumber": 280165,
        "rank": 4
      },
      {
        "name": "Gilbert",
        "population": "275,345",
        "populationNumber": 275345,
        "rank": 5
      },
      {
        "name": "Glendale",
        "population": "252,135",
        "populationNumber": 252135,
        "rank": 6
      },
      {
        "name": "Scottsdale",
        "population": "243,050",
        "populationNumber": 243050,
        "rank": 7
      },
      {
        "name": "Peoria",
        "population": "200,935",
        "populationNumber": 200935,
        "rank": 8
      }
    ],
    "majorCities": [
      "Phoenix",
      "Tucson",
      "Mesa",
      "Chandler",
      "Gilbert",
      "Glendale",
      "Scottsdale",
      "Peoria",
      "Tempe",
      "Surprise",
      "Flagstaff",
      "Sedona"
    ],
    "annualEventsCount": 68,
    "salesTaxInfo": "Arizona Transaction Privilege Tax (TPT) Special Event License (5.6% State + City Rates)",
    "artisanSpecialties": [
      "Turquoise & Silver Jewelry",
      "Desert Botanical & Agave Skincare",
      "Southwestern Pottery & Clay",
      "Cactus Leather Accessories"
    ],
    "popularCategories": [
      "Jewelry & Metalsmithing",
      "Fine Art & Painting",
      "Artisan Food",
      "Ceramics"
    ],
    "vendorPermitRequirement": "Arizona Department of Revenue Special Event TPT License required prior to first sale."
  },
  {
    "code": "AR",
    "name": "Arkansas",
    "slug": "arkansas",
    "region": "Southeast",
    "top3Cities": [
      {
        "name": "Little Rock",
        "population": "202,590",
        "populationNumber": 202590,
        "rank": 1
      },
      {
        "name": "Fayetteville",
        "population": "101,680",
        "populationNumber": 101680,
        "rank": 2
      },
      {
        "name": "Fort Smith",
        "population": "89,140",
        "populationNumber": 89140,
        "rank": 3
      }
    ],
    "citiesOver200k": [
      {
        "name": "Little Rock",
        "population": "202,590",
        "populationNumber": 202590,
        "rank": 1
      }
    ],
    "majorCities": [
      "Little Rock",
      "Fayetteville",
      "Fort Smith",
      "Springdale",
      "Jonesboro",
      "Rogers",
      "Conway",
      "North Little Rock",
      "Bentonville",
      "Hot Springs"
    ],
    "annualEventsCount": 35,
    "salesTaxInfo": "Arkansas Department of Finance & Administration Special Event Sales Tax (6.5% State + Local)",
    "artisanSpecialties": [
      "Ozark Mountain Woodcraft",
      "Hand-Blown Glass",
      "Natural Stone Jewelry",
      "Local Honey & Fruit Jellies"
    ],
    "popularCategories": [
      "Woodworking",
      "Cottage Bakery",
      "Folk Art",
      "Live Plants & Succulents"
    ],
    "vendorPermitRequirement": "Arkansas Temporary Vendor Sales Tax Permit provided by event promoter."
  },
  {
    "code": "CA",
    "name": "California",
    "slug": "california",
    "region": "West",
    "top3Cities": [
      {
        "name": "Los Angeles",
        "population": "3,820,910",
        "populationNumber": 3820910,
        "rank": 1
      },
      {
        "name": "San Diego",
        "population": "1,381,160",
        "populationNumber": 1381160,
        "rank": 2
      },
      {
        "name": "San Jose",
        "population": "971,230",
        "populationNumber": 971230,
        "rank": 3
      }
    ],
    "citiesOver200k": [
      {
        "name": "Los Angeles",
        "population": "3,820,910",
        "populationNumber": 3820910,
        "rank": 1
      },
      {
        "name": "San Diego",
        "population": "1,381,160",
        "populationNumber": 1381160,
        "rank": 2
      },
      {
        "name": "San Jose",
        "population": "971,230",
        "populationNumber": 971230,
        "rank": 3
      },
      {
        "name": "San Francisco",
        "population": "808,435",
        "populationNumber": 808435,
        "rank": 4
      },
      {
        "name": "Fresno",
        "population": "545,565",
        "populationNumber": 545565,
        "rank": 5
      },
      {
        "name": "Sacramento",
        "population": "526,450",
        "populationNumber": 526450,
        "rank": 6
      },
      {
        "name": "Long Beach",
        "population": "451,305",
        "populationNumber": 451305,
        "rank": 7
      },
      {
        "name": "Oakland",
        "population": "430,550",
        "populationNumber": 430550,
        "rank": 8
      },
      {
        "name": "Bakersfield",
        "population": "410,640",
        "populationNumber": 410640,
        "rank": 9
      },
      {
        "name": "Anaheim",
        "population": "344,460",
        "populationNumber": 344460,
        "rank": 10
      },
      {
        "name": "Stockton",
        "population": "319,540",
        "populationNumber": 319540,
        "rank": 11
      },
      {
        "name": "Riverside",
        "population": "317,845",
        "populationNumber": 317845,
        "rank": 12
      },
      {
        "name": "Irvine",
        "population": "309,630",
        "populationNumber": 309630,
        "rank": 13
      },
      {
        "name": "Santa Ana",
        "population": "308,330",
        "populationNumber": 308330,
        "rank": 14
      },
      {
        "name": "Chula Vista",
        "population": "275,485",
        "populationNumber": 275485,
        "rank": 15
      },
      {
        "name": "Fremont",
        "population": "226,205",
        "populationNumber": 226205,
        "rank": 16
      },
      {
        "name": "Santa Clarita",
        "population": "230,060",
        "populationNumber": 230060,
        "rank": 17
      },
      {
        "name": "San Bernardino",
        "population": "222,200",
        "populationNumber": 222200,
        "rank": 18
      },
      {
        "name": "Modesto",
        "population": "218,065",
        "populationNumber": 218065,
        "rank": 19
      },
      {
        "name": "Moreno Valley",
        "population": "211,960",
        "populationNumber": 211960,
        "rank": 20
      },
      {
        "name": "Fontana",
        "population": "212,700",
        "populationNumber": 212700,
        "rank": 21
      },
      {
        "name": "Oxnard",
        "population": "201,875",
        "populationNumber": 201875,
        "rank": 22
      }
    ],
    "majorCities": [
      "Los Angeles",
      "San Diego",
      "San Jose",
      "San Francisco",
      "Fresno",
      "Sacramento",
      "Long Beach",
      "Oakland",
      "Bakersfield",
      "Anaheim",
      "Stockton",
      "Riverside",
      "Irvine",
      "Santa Ana",
      "Chula Vista",
      "Fremont",
      "Santa Clarita",
      "San Bernardino",
      "Modesto",
      "Moreno Valley",
      "Fontana",
      "Oxnard",
      "Pasadena"
    ],
    "annualEventsCount": 145,
    "salesTaxInfo": "California CDTFA Temporary Seller’s Permit (7.25% Base + District Taxes up to 10.75%)",
    "artisanSpecialties": [
      "Organic & Vegan Botanical Beauty",
      "Sustainable Recycled Apparel",
      "Ceramic Homewares",
      "Specialty Cold Brew & Artisan Matcha"
    ],
    "popularCategories": [
      "Clean Beauty & Skincare",
      "Apparel & Vintage",
      "Gourmet Food Trucks",
      "Contemporary Art"
    ],
    "vendorPermitRequirement": "CDTFA Temporary Seller’s Permit is free and must be issued in advance; County Health Permit for food."
  },
  {
    "code": "CO",
    "name": "Colorado",
    "slug": "colorado",
    "region": "West",
    "top3Cities": [
      {
        "name": "Denver",
        "population": "713,250",
        "populationNumber": 713250,
        "rank": 1
      },
      {
        "name": "Colorado Springs",
        "population": "488,660",
        "populationNumber": 488660,
        "rank": 2
      },
      {
        "name": "Aurora",
        "population": "393,550",
        "populationNumber": 393550,
        "rank": 3
      }
    ],
    "citiesOver200k": [
      {
        "name": "Denver",
        "population": "713,250",
        "populationNumber": 713250,
        "rank": 1
      },
      {
        "name": "Colorado Springs",
        "population": "488,660",
        "populationNumber": 488660,
        "rank": 2
      },
      {
        "name": "Aurora",
        "population": "393,550",
        "populationNumber": 393550,
        "rank": 3
      }
    ],
    "majorCities": [
      "Denver",
      "Colorado Springs",
      "Aurora",
      "Fort Collins",
      "Lakewood",
      "Thornton",
      "Arvada",
      "Westminster",
      "Pueblo",
      "Boulder",
      "Greeley",
      "Grand Junction",
      "Aspen"
    ],
    "annualEventsCount": 75,
    "salesTaxInfo": "Colorado Department of Revenue Special Event Sales Tax (2.9% State + Home Rule City Taxes)",
    "artisanSpecialties": [
      "Outdoor Adventure Gear & Leather",
      "Alpine Herbal Balms",
      "Mountain Landscape Photography",
      "Hand-Poured Soy Candles"
    ],
    "popularCategories": [
      "Outdoor Goods",
      "Home Decor & Candles",
      "Handmade Apparel",
      "Micro-Roast Coffee"
    ],
    "vendorPermitRequirement": "Colorado Special Event Sales Tax License (Form DR 0589) due by the 20th of the following month."
  },
  {
    "code": "CT",
    "name": "Connecticut",
    "slug": "connecticut",
    "region": "Northeast",
    "top3Cities": [
      {
        "name": "Bridgeport",
        "population": "148,370",
        "populationNumber": 148370,
        "rank": 1
      },
      {
        "name": "Stamford",
        "population": "136,180",
        "populationNumber": 136180,
        "rank": 2
      },
      {
        "name": "New Haven",
        "population": "135,080",
        "populationNumber": 135080,
        "rank": 3
      }
    ],
    "citiesOver200k": [],
    "majorCities": [
      "Bridgeport",
      "Stamford",
      "New Haven",
      "Hartford",
      "Waterbury",
      "Norwalk",
      "Danbury",
      "New Britain",
      "West Hartford",
      "Greenwich",
      "Hamden"
    ],
    "annualEventsCount": 38,
    "salesTaxInfo": "Connecticut DRS Sales and Use Tax Permit (6.35% State Flat Rate)",
    "artisanSpecialties": [
      "Maritime Woodcraft & Nautical Art",
      "Handmade Pewter & Silver",
      "Artisan Chocolate & Maple Confections",
      "Small-Batch Ceramics"
    ],
    "popularCategories": [
      "Handmade Crafts",
      "Jewelry",
      "Artisan Confections",
      "Home Fragrance"
    ],
    "vendorPermitRequirement": "Permanent or Temporary Connecticut Sales Tax Permit ($100 registration fee covers 2 years)."
  },
  {
    "code": "DE",
    "name": "Delaware",
    "slug": "delaware",
    "region": "Mid-Atlantic",
    "top3Cities": [
      {
        "name": "Wilmington",
        "population": "71,560",
        "populationNumber": 71560,
        "rank": 1
      },
      {
        "name": "Dover",
        "population": "38,590",
        "populationNumber": 38590,
        "rank": 2
      },
      {
        "name": "Newark",
        "population": "30,450",
        "populationNumber": 30450,
        "rank": 3
      }
    ],
    "citiesOver200k": [],
    "majorCities": [
      "Wilmington",
      "Dover",
      "Newark",
      "Middletown",
      "Smyrna",
      "Milford",
      "Seaford",
      "Georgetown",
      "Rehoboth Beach",
      "Lewes"
    ],
    "annualEventsCount": 24,
    "salesTaxInfo": "0% State Sales Tax (Gross Receipts Tax applies to commercial businesses)",
    "artisanSpecialties": [
      "Coastal Sea Glass Jewelry",
      "Beeswax Candle Sets",
      "Handwoven Textiles",
      "Coastal Watercolor Prints"
    ],
    "popularCategories": [
      "Jewelry",
      "Fine Art",
      "Candles & Wax Melts",
      "Textiles"
    ],
    "vendorPermitRequirement": "Delaware Division of Revenue Temporary Business License for itinerant merchants."
  },
  {
    "code": "DC",
    "name": "District of Columbia",
    "slug": "district-of-columbia",
    "region": "Mid-Atlantic",
    "top3Cities": [
      {
        "name": "Washington D.C. (Downtown/Federal)",
        "population": "678,970",
        "populationNumber": 678970,
        "rank": 1
      },
      {
        "name": "Georgetown & Northwest",
        "population": "42,500",
        "populationNumber": 42500,
        "rank": 2
      },
      {
        "name": "Capitol Hill & Northeast",
        "population": "38,000",
        "populationNumber": 38000,
        "rank": 3
      }
    ],
    "citiesOver200k": [
      {
        "name": "Washington D.C.",
        "population": "678,970",
        "populationNumber": 678970,
        "rank": 1
      }
    ],
    "majorCities": [
      "Washington D.C.",
      "Georgetown",
      "Capitol Hill",
      "Dupont Circle",
      "Adams Morgan",
      "Navy Yard",
      "Shaw",
      "U Street Corridor",
      "Columbia Heights"
    ],
    "annualEventsCount": 52,
    "salesTaxInfo": "DC Office of Tax and Revenue Special Event Certificate (6.0% DC Sales Tax)",
    "artisanSpecialties": [
      "Civic & Historical Prints",
      "Multicultural Textiles & Fashion",
      "Hand-Crafted Paper Stationery",
      "Artisan Specialty Pastries"
    ],
    "popularCategories": [
      "Stationery & Prints",
      "Fashion & Leather",
      "Specialty Foods",
      "Handmade Ceramics"
    ],
    "vendorPermitRequirement": "DC Special Event Vendor Permit (Form FR-800SE) submitted through MyTax.DC.gov."
  },
  {
    "code": "FL",
    "name": "Florida",
    "slug": "florida",
    "region": "Southeast",
    "top3Cities": [
      {
        "name": "Jacksonville",
        "population": "985,840",
        "populationNumber": 985840,
        "rank": 1
      },
      {
        "name": "Miami",
        "population": "455,920",
        "populationNumber": 455920,
        "rank": 2
      },
      {
        "name": "Tampa",
        "population": "403,360",
        "populationNumber": 403360,
        "rank": 3
      }
    ],
    "citiesOver200k": [
      {
        "name": "Jacksonville",
        "population": "985,840",
        "populationNumber": 985840,
        "rank": 1
      },
      {
        "name": "Miami",
        "population": "455,920",
        "populationNumber": 455920,
        "rank": 2
      },
      {
        "name": "Tampa",
        "population": "403,360",
        "populationNumber": 403360,
        "rank": 3
      },
      {
        "name": "Orlando",
        "population": "320,740",
        "populationNumber": 320740,
        "rank": 4
      },
      {
        "name": "St. Petersburg",
        "population": "263,550",
        "populationNumber": 263550,
        "rank": 5
      },
      {
        "name": "Port St. Lucie",
        "population": "245,020",
        "populationNumber": 245020,
        "rank": 6
      },
      {
        "name": "Cape Coral",
        "population": "224,455",
        "populationNumber": 224455,
        "rank": 7
      },
      {
        "name": "Hialeah",
        "population": "221,300",
        "populationNumber": 221300,
        "rank": 8
      },
      {
        "name": "Tallahassee",
        "population": "202,220",
        "populationNumber": 202220,
        "rank": 9
      }
    ],
    "majorCities": [
      "Jacksonville",
      "Miami",
      "Tampa",
      "Orlando",
      "St. Petersburg",
      "Port St. Lucie",
      "Cape Coral",
      "Hialeah",
      "Tallahassee",
      "Fort Lauderdale",
      "Sarasota",
      "Gainesville",
      "Pembroke Pines",
      "Hollywood"
    ],
    "annualEventsCount": 130,
    "salesTaxInfo": "Florida Department of Revenue Special Event Sales Tax (6.0% State + County Surtax 0.5%–2%)",
    "artisanSpecialties": [
      "Tropical Botanical Skincare",
      "Handmade Resin & Shell Art",
      "Citrus & Coconut Confections",
      "Linen & Resort Wear"
    ],
    "popularCategories": [
      "Summer Apparel",
      "Artisan Soaps",
      "Food Trucks & Beverages",
      "Resin & Glass Art"
    ],
    "vendorPermitRequirement": "Florida Annual Resale Certificate or Special Event Return (Form DR-15EZ) filed post-event."
  },
  {
    "code": "GA",
    "name": "Georgia",
    "slug": "georgia",
    "region": "Southeast",
    "top3Cities": [
      {
        "name": "Atlanta",
        "population": "510,820",
        "populationNumber": 510820,
        "rank": 1
      },
      {
        "name": "Columbus",
        "population": "202,620",
        "populationNumber": 202620,
        "rank": 2
      },
      {
        "name": "Augusta",
        "population": "201,190",
        "populationNumber": 201190,
        "rank": 3
      }
    ],
    "citiesOver200k": [
      {
        "name": "Atlanta",
        "population": "510,820",
        "populationNumber": 510820,
        "rank": 1
      },
      {
        "name": "Columbus",
        "population": "202,620",
        "populationNumber": 202620,
        "rank": 2
      },
      {
        "name": "Augusta",
        "population": "201,190",
        "populationNumber": 201190,
        "rank": 3
      }
    ],
    "majorCities": [
      "Atlanta",
      "Columbus",
      "Augusta",
      "Macon",
      "Savannah",
      "Athens",
      "Sandy Springs",
      "South Fulton",
      "Roswell",
      "Johns Creek",
      "Alpharetta",
      "Marietta"
    ],
    "annualEventsCount": 88,
    "salesTaxInfo": "Georgia Department of Revenue Form FS-32 Miscellaneous Events (4.0% State + County Local Option Tax)",
    "artisanSpecialties": [
      "Southern Pecan Treats & Preserves",
      "Hand-Stitched Leather Bags",
      "Folk Pottery & Ceramic Jugs",
      "Peach Wood Smoked Provisions"
    ],
    "popularCategories": [
      "Artisan Provisions",
      "Handmade Leather Goods",
      "Ceramics",
      "Fine Art"
    ],
    "vendorPermitRequirement": "Georgia Sales and Use Tax Number or Special Event Vendor Return filed within 20 days."
  },
  {
    "code": "HI",
    "name": "Hawaii",
    "slug": "hawaii",
    "region": "Pacific",
    "top3Cities": [
      {
        "name": "Honolulu",
        "population": "343,420",
        "populationNumber": 343420,
        "rank": 1
      },
      {
        "name": "East Honolulu",
        "population": "49,180",
        "populationNumber": 49180,
        "rank": 2
      },
      {
        "name": "Pearl City",
        "population": "45,600",
        "populationNumber": 45600,
        "rank": 3
      }
    ],
    "citiesOver200k": [
      {
        "name": "Honolulu",
        "population": "343,420",
        "populationNumber": 343420,
        "rank": 1
      }
    ],
    "majorCities": [
      "Honolulu",
      "East Honolulu",
      "Pearl City",
      "Hilo",
      "Kailua",
      "Waipahu",
      "Kaneohe",
      "Mililani",
      "Kahului",
      "Kailua-Kona",
      "Lihue"
    ],
    "annualEventsCount": 32,
    "salesTaxInfo": "Hawaii General Excise Tax (GET) 4.0% Oahu / 4.5% Neighbor Islands",
    "artisanSpecialties": [
      "Koa Wood Utensils & Bowls",
      "Hawaiian Shell & Pearl Jewelry",
      "Kona Coffee & Macadamia Treats",
      "Handmade Aloha Fabrics & Quilts"
    ],
    "popularCategories": [
      "Koa Woodcraft",
      "Fine Jewelry",
      "Local Botanicals",
      "Specialty Coffee"
    ],
    "vendorPermitRequirement": "Hawaii General Excise Tax (GET) License required for any retail transactions."
  },
  {
    "code": "ID",
    "name": "Idaho",
    "slug": "idaho",
    "region": "West",
    "top3Cities": [
      {
        "name": "Boise",
        "population": "237,450",
        "populationNumber": 237450,
        "rank": 1
      },
      {
        "name": "Meridian",
        "population": "134,160",
        "populationNumber": 134160,
        "rank": 2
      },
      {
        "name": "Nampa",
        "population": "110,950",
        "populationNumber": 110950,
        "rank": 3
      }
    ],
    "citiesOver200k": [
      {
        "name": "Boise",
        "population": "237,450",
        "populationNumber": 237450,
        "rank": 1
      }
    ],
    "majorCities": [
      "Boise",
      "Meridian",
      "Nampa",
      "Idaho Falls",
      "Caldwell",
      "Pocatello",
      "Coeur d’Alene",
      "Twin Falls",
      "Post Falls",
      "Lewiston"
    ],
    "annualEventsCount": 30,
    "salesTaxInfo": "Idaho State Tax Commission Temporary Sales Tax Permit (6.0% State Rate)",
    "artisanSpecialties": [
      "Handmade Leather Saddlery & Wallets",
      "Huckleberry Preserves & Sweets",
      "Rustic Mountain Furniture",
      "Goldsmithing & Gemstones"
    ],
    "popularCategories": [
      "Rustic Crafts",
      "Food Specialties",
      "Leather Accessories",
      "Metalwork"
    ],
    "vendorPermitRequirement": "Idaho Form ST-124 Temporary Seller’s Permit provided by festival organizer."
  },
  {
    "code": "IL",
    "name": "Illinois",
    "slug": "illinois",
    "region": "Midwest",
    "top3Cities": [
      {
        "name": "Chicago",
        "population": "2,665,040",
        "populationNumber": 2665040,
        "rank": 1
      },
      {
        "name": "Aurora",
        "population": "177,560",
        "populationNumber": 177560,
        "rank": 2
      },
      {
        "name": "Joliet",
        "population": "150,360",
        "populationNumber": 150360,
        "rank": 3
      }
    ],
    "citiesOver200k": [
      {
        "name": "Chicago",
        "population": "2,665,040",
        "populationNumber": 2665040,
        "rank": 1
      }
    ],
    "majorCities": [
      "Chicago",
      "Aurora",
      "Joliet",
      "Naperville",
      "Rockford",
      "Elgin",
      "Springfield",
      "Peoria",
      "Waukegan",
      "Champaign",
      "Evanston",
      "Bloomington"
    ],
    "annualEventsCount": 95,
    "salesTaxInfo": "Illinois Special Event Tax Return (IDOR Form IDOR-6-SETR, 6.25% Base + Local Rates up to 10.25%)",
    "artisanSpecialties": [
      "Midwest Modern Ceramics",
      "Artisan Pierogis & Sausages",
      "Urban Architectural Prints",
      "Hand-Embroidered Apparel"
    ],
    "popularCategories": [
      "Urban Arts & Prints",
      "Craft Foods",
      "Ceramics & Homewares",
      "Designer Jewelry"
    ],
    "vendorPermitRequirement": "Illinois Special Event Tax Coupon provided on-site by event coordinator."
  },
  {
    "code": "IN",
    "name": "Indiana",
    "slug": "indiana",
    "region": "Midwest",
    "top3Cities": [
      {
        "name": "Indianapolis",
        "population": "879,290",
        "populationNumber": 879290,
        "rank": 1
      },
      {
        "name": "Fort Wayne",
        "population": "269,630",
        "populationNumber": 269630,
        "rank": 2
      },
      {
        "name": "Evansville",
        "population": "115,740",
        "populationNumber": 115740,
        "rank": 3
      }
    ],
    "citiesOver200k": [
      {
        "name": "Indianapolis",
        "population": "879,290",
        "populationNumber": 879290,
        "rank": 1
      },
      {
        "name": "Fort Wayne",
        "population": "269,630",
        "populationNumber": 269630,
        "rank": 2
      }
    ],
    "majorCities": [
      "Indianapolis",
      "Fort Wayne",
      "Evansville",
      "South Bend",
      "Carmel",
      "Fishers",
      "Bloomington",
      "Hammond",
      "Gary",
      "Lafayette",
      "Muncie",
      "Terre Haute"
    ],
    "annualEventsCount": 50,
    "salesTaxInfo": "Indiana Department of Revenue Registered Retail Merchant Certificate (7.0% Flat Rate)",
    "artisanSpecialties": [
      "Amish Handcrafted Baskets",
      "Artisan Maple Syrup",
      "Hardwood Carvings & Turnings",
      "Hand-Knit Wool Blankets"
    ],
    "popularCategories": [
      "Woodcraft",
      "Handmade Textiles",
      "Artisan Food",
      "Candles & Soaps"
    ],
    "vendorPermitRequirement": "Indiana RRMC (Registered Retail Merchant Certificate) issued through INTIME."
  },
  {
    "code": "IA",
    "name": "Iowa",
    "slug": "iowa",
    "region": "Midwest",
    "top3Cities": [
      {
        "name": "Des Moines",
        "population": "212,030",
        "populationNumber": 212030,
        "rank": 1
      },
      {
        "name": "Cedar Rapids",
        "population": "136,470",
        "populationNumber": 136470,
        "rank": 2
      },
      {
        "name": "Davenport",
        "population": "100,350",
        "populationNumber": 100350,
        "rank": 3
      }
    ],
    "citiesOver200k": [
      {
        "name": "Des Moines",
        "population": "212,030",
        "populationNumber": 212030,
        "rank": 1
      }
    ],
    "majorCities": [
      "Des Moines",
      "Cedar Rapids",
      "Davenport",
      "Sioux City",
      "Iowa City",
      "Ankeny",
      "West Des Moines",
      "Waterloo",
      "Ames",
      "Council Bluffs",
      "Dubuque"
    ],
    "annualEventsCount": 36,
    "salesTaxInfo": "Iowa Department of Revenue Temporary Event Permit (6.0% State + 1% Local Option)",
    "artisanSpecialties": [
      "Prairie Wildflower Honey & Balms",
      "Blacksmith Ironwork",
      "Barnwood Repurposed Decor",
      "Artisan Dutch Pastries"
    ],
    "popularCategories": [
      "Farming & Natural Botanicals",
      "Metal & Ironwork",
      "Home Decor",
      "Handmade Goods"
    ],
    "vendorPermitRequirement": "Iowa Temporary Retailer Permit obtained free online via GovConnectIowa."
  },
  {
    "code": "KS",
    "name": "Kansas",
    "slug": "kansas",
    "region": "Midwest",
    "top3Cities": [
      {
        "name": "Wichita",
        "population": "396,190",
        "populationNumber": 396190,
        "rank": 1
      },
      {
        "name": "Overland Park",
        "population": "197,110",
        "populationNumber": 197110,
        "rank": 2
      },
      {
        "name": "Kansas City (KS)",
        "population": "154,550",
        "populationNumber": 154550,
        "rank": 3
      }
    ],
    "citiesOver200k": [
      {
        "name": "Wichita",
        "population": "396,190",
        "populationNumber": 396190,
        "rank": 1
      }
    ],
    "majorCities": [
      "Wichita",
      "Overland Park",
      "Kansas City",
      "Olathe",
      "Topeka",
      "Lawrence",
      "Shawnee",
      "Lenexa",
      "Manhattan",
      "Salina",
      "Hutchinson"
    ],
    "annualEventsCount": 34,
    "salesTaxInfo": "Kansas Department of Revenue Special Event Certificate (6.5% State + Local Tax)",
    "artisanSpecialties": [
      "Wheat Straw Weaving & Art",
      "Smoked Pepper Hot Sauces",
      "Handmade Leather Belts",
      "Ceramic Tableware"
    ],
    "popularCategories": [
      "Handmade Leather",
      "Specialty Sauces",
      "Pottery",
      "Apparel"
    ],
    "vendorPermitRequirement": "Kansas Special Event Tax Form (ST-16) collected at event conclusion."
  },
  {
    "code": "KY",
    "name": "Kentucky",
    "slug": "kentucky",
    "region": "Southeast",
    "top3Cities": [
      {
        "name": "Louisville",
        "population": "624,440",
        "populationNumber": 624440,
        "rank": 1
      },
      {
        "name": "Lexington",
        "population": "320,350",
        "populationNumber": 320350,
        "rank": 2
      },
      {
        "name": "Bowling Green",
        "population": "76,260",
        "populationNumber": 76260,
        "rank": 3
      }
    ],
    "citiesOver200k": [
      {
        "name": "Louisville",
        "population": "624,440",
        "populationNumber": 624440,
        "rank": 1
      },
      {
        "name": "Lexington",
        "population": "320,350",
        "populationNumber": 320350,
        "rank": 2
      }
    ],
    "majorCities": [
      "Louisville",
      "Lexington",
      "Bowling Green",
      "Owensboro",
      "Covington",
      "Richmond",
      "Georgetown",
      "Florence",
      "Hopkinsville",
      "Nicholasville",
      "Frankfort"
    ],
    "annualEventsCount": 44,
    "salesTaxInfo": "Kentucky Department of Revenue Sales and Use Tax (6.0% State Flat Rate)",
    "artisanSpecialties": [
      "Bourbon Barrel Repurposed Decor",
      "Bluegrass Instrument Luthier Crafts",
      "Equine Art & Leatherwork",
      "Handmade Bourbon Chocolates"
    ],
    "popularCategories": [
      "Barrel Woodcraft",
      "Handcrafted Leather",
      "Gourmet Treats",
      "Fine Paintings"
    ],
    "vendorPermitRequirement": "Kentucky Temporary Sales Tax Application submitted to Department of Revenue."
  },
  {
    "code": "LA",
    "name": "Louisiana",
    "slug": "louisiana",
    "region": "Southeast",
    "top3Cities": [
      {
        "name": "New Orleans",
        "population": "364,140",
        "populationNumber": 364140,
        "rank": 1
      },
      {
        "name": "Baton Rouge",
        "population": "221,450",
        "populationNumber": 221450,
        "rank": 2
      },
      {
        "name": "Shreveport",
        "population": "177,960",
        "populationNumber": 177960,
        "rank": 3
      }
    ],
    "citiesOver200k": [
      {
        "name": "New Orleans",
        "population": "364,140",
        "populationNumber": 364140,
        "rank": 1
      },
      {
        "name": "Baton Rouge",
        "population": "221,450",
        "populationNumber": 221450,
        "rank": 2
      }
    ],
    "majorCities": [
      "New Orleans",
      "Baton Rouge",
      "Shreveport",
      "Lafayette",
      "Lake Charles",
      "Kenner",
      "Bossier City",
      "Monroe",
      "Alexandria",
      "Houma"
    ],
    "annualEventsCount": 65,
    "salesTaxInfo": "Louisiana Department of Revenue Special Event Sales Tax (4.45% State + Parish Taxes)",
    "artisanSpecialties": [
      "Cajun & Creole Seasoning Blends",
      "Handcrafted Mardi Gras Masks & Beads",
      "Cypress Wood Carvings",
      "Voodoo Folk Art & Talismans"
    ],
    "popularCategories": [
      "Cajun/Creole Foods",
      "Folk Art & Masks",
      "Woodworking",
      "Jewelry"
    ],
    "vendorPermitRequirement": "Parish-level sales tax certificate & Louisiana Special Event tax return."
  },
  {
    "code": "ME",
    "name": "Maine",
    "slug": "maine",
    "region": "Northeast",
    "top3Cities": [
      {
        "name": "Portland",
        "population": "68,310",
        "populationNumber": 68310,
        "rank": 1
      },
      {
        "name": "Lewiston",
        "population": "37,120",
        "populationNumber": 37120,
        "rank": 2
      },
      {
        "name": "Bangor",
        "population": "31,580",
        "populationNumber": 31580,
        "rank": 3
      }
    ],
    "citiesOver200k": [],
    "majorCities": [
      "Portland",
      "Lewiston",
      "Bangor",
      "South Portland",
      "Auburn",
      "Biddeford",
      "Sanford",
      "Saco",
      "Westbrook",
      "Augusta",
      "Bar Harbor"
    ],
    "annualEventsCount": 28,
    "salesTaxInfo": "Maine Revenue Services Transient Seller License (5.5% State Sales Tax)",
    "artisanSpecialties": [
      "Lobster Trap Woodcraft",
      "Maine Tourmaline Jewelry",
      "Wild Blueberry Jams & Syrups",
      "Hand-Knitted Sea Wool Sweaters"
    ],
    "popularCategories": [
      "Coastal Art",
      "Gemstone Jewelry",
      "Artisan Jams & Ciders",
      "Knitwear"
    ],
    "vendorPermitRequirement": "Maine Transient Seller License issued through Maine Department of Professional Regulation."
  },
  {
    "code": "MD",
    "name": "Maryland",
    "slug": "maryland",
    "region": "Mid-Atlantic",
    "top3Cities": [
      {
        "name": "Baltimore",
        "population": "565,240",
        "populationNumber": 565240,
        "rank": 1
      },
      {
        "name": "Frederick",
        "population": "82,170",
        "populationNumber": 82170,
        "rank": 2
      },
      {
        "name": "Rockville",
        "population": "67,310",
        "populationNumber": 67310,
        "rank": 3
      }
    ],
    "citiesOver200k": [
      {
        "name": "Baltimore",
        "population": "565,240",
        "populationNumber": 565240,
        "rank": 1
      }
    ],
    "majorCities": [
      "Baltimore",
      "Frederick",
      "Rockville",
      "Gaithersburg",
      "Bowie",
      "Hagerstown",
      "Annapolis",
      "College Park",
      "Salisbury",
      "Laurel",
      "Bethesda"
    ],
    "annualEventsCount": 56,
    "salesTaxInfo": "Comptroller of Maryland Temporary Sales and Use Tax License (6.0% State Sales Tax)",
    "artisanSpecialties": [
      "Chesapeake Bay Crab Mallet Art",
      "Nautical Knotwork & Canvas Bags",
      "Old Bay Spiced Gourmet Goods",
      "Hand-Blown Glass Floats"
    ],
    "popularCategories": [
      "Nautical Decor",
      "Gourmet Food Trucks",
      "Glassware",
      "Jewelry"
    ],
    "vendorPermitRequirement": "Maryland 30-Day Temporary Sales and Use Tax License is issued free online."
  },
  {
    "code": "MA",
    "name": "Massachusetts",
    "slug": "massachusetts",
    "region": "Northeast",
    "top3Cities": [
      {
        "name": "Boston",
        "population": "650,710",
        "populationNumber": 650710,
        "rank": 1
      },
      {
        "name": "Worcester",
        "population": "205,320",
        "populationNumber": 205320,
        "rank": 2
      },
      {
        "name": "Springfield",
        "population": "153,680",
        "populationNumber": 153680,
        "rank": 3
      }
    ],
    "citiesOver200k": [
      {
        "name": "Boston",
        "population": "650,710",
        "populationNumber": 650710,
        "rank": 1
      },
      {
        "name": "Worcester",
        "population": "205,320",
        "populationNumber": 205320,
        "rank": 2
      }
    ],
    "majorCities": [
      "Boston",
      "Worcester",
      "Springfield",
      "Cambridge",
      "Lowell",
      "Brockton",
      "Quincy",
      "Lynn",
      "New Bedford",
      "Fall River",
      "Newton",
      "Somerville",
      "Salem"
    ],
    "annualEventsCount": 82,
    "salesTaxInfo": "Massachusetts Department of Revenue Sales Tax Registration (6.25% State Rate)",
    "artisanSpecialties": [
      "Colonial Blacksmithing & Ironwork",
      "Cranberry Bog Syrups & Chutneys",
      "Hand-Pressed Botanical Herbariums",
      "Historic Fine Leather Books"
    ],
    "popularCategories": [
      "Fine Crafts",
      "Artisan Bakery",
      "Antiques & Repurposed",
      "Botanical Decor"
    ],
    "vendorPermitRequirement": "MassTaxConnect registration for Out-of-State Vendor or Massachusetts Vendor license."
  },
  {
    "code": "MI",
    "name": "Michigan",
    "slug": "michigan",
    "region": "Midwest",
    "top3Cities": [
      {
        "name": "Detroit",
        "population": "620,380",
        "populationNumber": 620380,
        "rank": 1
      },
      {
        "name": "Grand Rapids",
        "population": "197,410",
        "populationNumber": 197410,
        "rank": 2
      },
      {
        "name": "Warren",
        "population": "137,110",
        "populationNumber": 137110,
        "rank": 3
      }
    ],
    "citiesOver200k": [
      {
        "name": "Detroit",
        "population": "620,380",
        "populationNumber": 620380,
        "rank": 1
      }
    ],
    "majorCities": [
      "Detroit",
      "Grand Rapids",
      "Warren",
      "Sterling Heights",
      "Ann Arbor",
      "Lansing",
      "Dearborn",
      "Livonia",
      "Troy",
      "Westland",
      "Flint",
      "Traverse City"
    ],
    "annualEventsCount": 72,
    "salesTaxInfo": "Michigan Department of Treasury Concessionaire’s Sales Tax Return (6.0% State Flat Rate)",
    "artisanSpecialties": [
      "Petoskey Stone Jewelry",
      "Tart Cherry Preserves & Glazes",
      "Copper Country Metal Art",
      "Hand-Carved Cedar Duck Decoys"
    ],
    "popularCategories": [
      "Mineral & Stone Jewelry",
      "Specialty Cherries & Sweets",
      "Metalwork",
      "Outdoor Art"
    ],
    "vendorPermitRequirement": "Form 5088 (Concessionaire Sales Tax Return and Payment) filed after festival."
  },
  {
    "code": "MN",
    "name": "Minnesota",
    "slug": "minnesota",
    "region": "Midwest",
    "top3Cities": [
      {
        "name": "Minneapolis",
        "population": "425,090",
        "populationNumber": 425090,
        "rank": 1
      },
      {
        "name": "St. Paul",
        "population": "303,180",
        "populationNumber": 303180,
        "rank": 2
      },
      {
        "name": "Rochester",
        "population": "122,410",
        "populationNumber": 122410,
        "rank": 3
      }
    ],
    "citiesOver200k": [
      {
        "name": "Minneapolis",
        "population": "425,090",
        "populationNumber": 425090,
        "rank": 1
      },
      {
        "name": "St. Paul",
        "population": "303,180",
        "populationNumber": 303180,
        "rank": 2
      }
    ],
    "majorCities": [
      "Minneapolis",
      "St. Paul",
      "Rochester",
      "Bloomington",
      "Duluth",
      "Brooklyn Park",
      "Plymouth",
      "Woodbury",
      "Lakeville",
      "St. Cloud",
      "Eagan"
    ],
    "annualEventsCount": 60,
    "salesTaxInfo": "Minnesota Department of Revenue Operator and Vendor Information (Form ST19, 6.875% State + Local)",
    "artisanSpecialties": [
      "Wild Rice Provisions",
      "Scandinavia-Inspired Birch Crafts",
      "Hand-Forged Axe & Knife Blades",
      "Cold-Weather Woolens"
    ],
    "popularCategories": [
      "Blade & Metalcraft",
      "Wool & Knitwear",
      "Wild Rice & Pantry",
      "Woodcraft"
    ],
    "vendorPermitRequirement": "Form ST19 (Operator and Vendor Information) submitted directly to event coordinator."
  },
  {
    "code": "MS",
    "name": "Mississippi",
    "slug": "mississippi",
    "region": "Southeast",
    "top3Cities": [
      {
        "name": "Jackson",
        "population": "145,980",
        "populationNumber": 145980,
        "rank": 1
      },
      {
        "name": "Gulfport",
        "population": "72,110",
        "populationNumber": 72110,
        "rank": 2
      },
      {
        "name": "Southaven",
        "population": "57,470",
        "populationNumber": 57470,
        "rank": 3
      }
    ],
    "citiesOver200k": [],
    "majorCities": [
      "Jackson",
      "Gulfport",
      "Southaven",
      "Biloxi",
      "Hattiesburg",
      "Olive Branch",
      "Tupelo",
      "Meridian",
      "Clinton",
      "Madison",
      "Oxford"
    ],
    "annualEventsCount": 30,
    "salesTaxInfo": "Mississippi Department of Revenue Special Event Sales Tax (7.0% State Flat Rate)",
    "artisanSpecialties": [
      "Delta Blues Handcrafted Guitars & Art",
      "Magnolia Scented Candle Lines",
      "Handwoven Pine Needle Baskets",
      "Southern Biscuit & Pepper Jellies"
    ],
    "popularCategories": [
      "Musical Heritage Art",
      "Candles",
      "Baskets & Woven Goods",
      "Pantry Specialties"
    ],
    "vendorPermitRequirement": "Mississippi Special Event Sales Tax Permit issued through TAP (Taxpayer Access Point)."
  },
  {
    "code": "MO",
    "name": "Missouri",
    "slug": "missouri",
    "region": "Midwest",
    "top3Cities": [
      {
        "name": "Kansas City (MO)",
        "population": "509,290",
        "populationNumber": 509290,
        "rank": 1
      },
      {
        "name": "St. Louis",
        "population": "286,580",
        "populationNumber": 286580,
        "rank": 2
      },
      {
        "name": "Springfield",
        "population": "170,070",
        "populationNumber": 170070,
        "rank": 3
      }
    ],
    "citiesOver200k": [
      {
        "name": "Kansas City (MO)",
        "population": "509,290",
        "populationNumber": 509290,
        "rank": 1
      },
      {
        "name": "St. Louis",
        "population": "286,580",
        "populationNumber": 286580,
        "rank": 2
      }
    ],
    "majorCities": [
      "Kansas City",
      "St. Louis",
      "Springfield",
      "Columbia",
      "Independence",
      "Lee’s Summit",
      "O'Fallon",
      "St. Joseph",
      "St. Charles",
      "St. Peters",
      "Blue Springs"
    ],
    "annualEventsCount": 58,
    "salesTaxInfo": "Missouri Department of Revenue Special Event Sales Tax (4.225% State + Local District Rates)",
    "artisanSpecialties": [
      "Ozark Walnut Carvings",
      "Kansas City Style BBQ Rubs",
      "Handmade Leather Moccasins & Wallets",
      "Ceramic Beer Steins & Mugs"
    ],
    "popularCategories": [
      "Woodworking",
      "Gourmet Rubs & Sauces",
      "Leathercraft",
      "Pottery"
    ],
    "vendorPermitRequirement": "Missouri Special Event Sales Tax Permit (Form 2643) or Statement of No Tax Due."
  },
  {
    "code": "MT",
    "name": "Montana",
    "slug": "montana",
    "region": "West",
    "top3Cities": [
      {
        "name": "Billings",
        "population": "118,280",
        "populationNumber": 118280,
        "rank": 1
      },
      {
        "name": "Missoula",
        "population": "76,960",
        "populationNumber": 76960,
        "rank": 2
      },
      {
        "name": "Great Falls",
        "population": "60,400",
        "populationNumber": 60400,
        "rank": 3
      }
    ],
    "citiesOver200k": [],
    "majorCities": [
      "Billings",
      "Missoula",
      "Great Falls",
      "Bozeman",
      "Butte",
      "Helena",
      "Kalispell",
      "Belgrade",
      "Havre",
      "Miles City"
    ],
    "annualEventsCount": 26,
    "salesTaxInfo": "0% State Sales Tax; Resort taxes apply in select communities (Big Sky, Whitefish 3%–4%)",
    "artisanSpecialties": [
      "Antler Art & Hand-Carved Horns",
      "Huckleberry Syrups & Chocolates",
      "Fly Fishing Tied Flies & Boxes",
      "Western Saddle Leatherwork"
    ],
    "popularCategories": [
      "Wildlife Art",
      "Fishing & Outdoors",
      "Specialty Confections",
      "Leatherwork"
    ],
    "vendorPermitRequirement": "No state sales tax permit required; Municipal resort tax registration if applicable."
  },
  {
    "code": "NE",
    "name": "Nebraska",
    "slug": "nebraska",
    "region": "Midwest",
    "top3Cities": [
      {
        "name": "Omaha",
        "population": "485,150",
        "populationNumber": 485150,
        "rank": 1
      },
      {
        "name": "Lincoln",
        "population": "292,660",
        "populationNumber": 292660,
        "rank": 2
      },
      {
        "name": "Bellevue",
        "population": "64,180",
        "populationNumber": 64180,
        "rank": 3
      }
    ],
    "citiesOver200k": [
      {
        "name": "Omaha",
        "population": "485,150",
        "populationNumber": 485150,
        "rank": 1
      },
      {
        "name": "Lincoln",
        "population": "292,660",
        "populationNumber": 292660,
        "rank": 2
      }
    ],
    "majorCities": [
      "Omaha",
      "Lincoln",
      "Bellevue",
      "Grand Island",
      "Kearney",
      "Fremont",
      "Hastings",
      "Norfolk",
      "Columbus",
      "Papillion"
    ],
    "annualEventsCount": 28,
    "salesTaxInfo": "Nebraska Department of Revenue Special Events (5.5% State + City Sales Tax up to 2%)",
    "artisanSpecialties": [
      "Nebraska Beef Jerky & Seasonings",
      "Cornhusk Folk Art & Dolls",
      "Reclaimed Barn Metal Sculptures",
      "Handmade Quilts & Table Runners"
    ],
    "popularCategories": [
      "Gourmet Jerky & Snacks",
      "Folk Crafts",
      "Metal Sculptures",
      "Quilts & Linens"
    ],
    "vendorPermitRequirement": "Nebraska Temporary Sales Tax Permit (Form 20) completed with festival organizer."
  },
  {
    "code": "NV",
    "name": "Nevada",
    "slug": "nevada",
    "region": "West",
    "top3Cities": [
      {
        "name": "Las Vegas",
        "population": "656,270",
        "populationNumber": 656270,
        "rank": 1
      },
      {
        "name": "Henderson",
        "population": "331,410",
        "populationNumber": 331410,
        "rank": 2
      },
      {
        "name": "North Las Vegas",
        "population": "280,540",
        "populationNumber": 280540,
        "rank": 3
      }
    ],
    "citiesOver200k": [
      {
        "name": "Las Vegas",
        "population": "656,270",
        "populationNumber": 656270,
        "rank": 1
      },
      {
        "name": "Henderson",
        "population": "331,410",
        "populationNumber": 331410,
        "rank": 2
      },
      {
        "name": "North Las Vegas",
        "population": "280,540",
        "populationNumber": 280540,
        "rank": 3
      },
      {
        "name": "Reno",
        "population": "274,920",
        "populationNumber": 274920,
        "rank": 4
      }
    ],
    "majorCities": [
      "Las Vegas",
      "Henderson",
      "North Las Vegas",
      "Reno",
      "Sparks",
      "Carson City",
      "Fernley",
      "Elko",
      "Mesquite",
      "Boulder City"
    ],
    "annualEventsCount": 70,
    "salesTaxInfo": "Nevada Department of Taxation One-Time Event Permit (6.85% State + County Options up to 8.375%)",
    "artisanSpecialties": [
      "Desert Resin & Geode Art",
      "Hand-Tooled Western Belts & Hats",
      "Artisan Hot Sauces & Salsas",
      "Neon & Contemporary Metalcraft"
    ],
    "popularCategories": [
      "Contemporary Art",
      "Western Wear",
      "Gourmet Hot Sauces",
      "Handmade Jewelry"
    ],
    "vendorPermitRequirement": "Nevada One-Time Event Sales Tax Return (Form TXR-01) provided by promoter."
  },
  {
    "code": "NH",
    "name": "New Hampshire",
    "slug": "new-hampshire",
    "region": "Northeast",
    "top3Cities": [
      {
        "name": "Manchester",
        "population": "115,460",
        "populationNumber": 115460,
        "rank": 1
      },
      {
        "name": "Nashua",
        "population": "91,160",
        "populationNumber": 91160,
        "rank": 2
      },
      {
        "name": "Concord",
        "population": "44,500",
        "populationNumber": 44500,
        "rank": 3
      }
    ],
    "citiesOver200k": [],
    "majorCities": [
      "Manchester",
      "Nashua",
      "Concord",
      "Dover",
      "Rochester",
      "Keene",
      "Portsmouth",
      "Laconia",
      "Claremont",
      "Lebanon"
    ],
    "annualEventsCount": 30,
    "salesTaxInfo": "0% General State Sales Tax (8.5% Meals and Rooms Tax applies to prepared food trucks)",
    "artisanSpecialties": [
      "Granite State Stone Cutting & Bookends",
      "Pure Grade A Maple Syrup",
      "Handmade Wool Mittens & Hats",
      "White Mountain Landscape Art"
    ],
    "popularCategories": [
      "Stone Craft",
      "Maple Syrups",
      "Winter Apparel",
      "Fine Landscape Art"
    ],
    "vendorPermitRequirement": "NH Meals & Rooms Tax License for prepared food and food truck operators."
  },
  {
    "code": "NJ",
    "name": "New Jersey",
    "slug": "new-jersey",
    "region": "Mid-Atlantic",
    "top3Cities": [
      {
        "name": "Newark",
        "population": "305,340",
        "populationNumber": 305340,
        "rank": 1
      },
      {
        "name": "Jersey City",
        "population": "286,670",
        "populationNumber": 286670,
        "rank": 2
      },
      {
        "name": "Paterson",
        "population": "156,660",
        "populationNumber": 156660,
        "rank": 3
      }
    ],
    "citiesOver200k": [
      {
        "name": "Newark",
        "population": "305,340",
        "populationNumber": 305340,
        "rank": 1
      },
      {
        "name": "Jersey City",
        "population": "286,670",
        "populationNumber": 286670,
        "rank": 2
      }
    ],
    "majorCities": [
      "Newark",
      "Jersey City",
      "Paterson",
      "Elizabeth",
      "Edison",
      "Woodbridge",
      "Lakewood",
      "Toms River",
      "Hamilton",
      "Trenton",
      "Atlantic City",
      "Hoboken"
    ],
    "annualEventsCount": 85,
    "salesTaxInfo": "New Jersey Division of Taxation Form REG-1E (6.625% State Flat Rate)",
    "artisanSpecialties": [
      "Jersey Shore Sea Glass & Driftwood Crafts",
      "Artisan Italian Bakery & Biscotti",
      "Pine Barrens Cedar Birdhouses",
      "Boardwalk Salt Water Taffy Sets"
    ],
    "popularCategories": [
      "Coastal Decor",
      "Artisan Bakery",
      "Woodcraft",
      "Handmade Sweets"
    ],
    "vendorPermitRequirement": "New Jersey Business Registration Certificate (Form NJ-REG) required before retail operations."
  },
  {
    "code": "NM",
    "name": "New Mexico",
    "slug": "new-mexico",
    "region": "Southwest",
    "top3Cities": [
      {
        "name": "Albuquerque",
        "population": "561,010",
        "populationNumber": 561010,
        "rank": 1
      },
      {
        "name": "Las Cruces",
        "population": "113,880",
        "populationNumber": 113880,
        "rank": 2
      },
      {
        "name": "Rio Rancho",
        "population": "109,180",
        "populationNumber": 109180,
        "rank": 3
      }
    ],
    "citiesOver200k": [
      {
        "name": "Albuquerque",
        "population": "561,010",
        "populationNumber": 561010,
        "rank": 1
      }
    ],
    "majorCities": [
      "Albuquerque",
      "Las Cruces",
      "Rio Rancho",
      "Santa Fe",
      "Roswell",
      "Farmington",
      "Clovis",
      "Hobbs",
      "Alamogordo",
      "Carlsbad",
      "Taos"
    ],
    "annualEventsCount": 54,
    "salesTaxInfo": "New Mexico Gross Receipts Tax (GRT) 5.0% State + Municipal Rates (approx. 7.5%–8.8%)",
    "artisanSpecialties": [
      "Hatch Green Chile Powders & Salsas",
      "Authentic Navajo & Zuni Silver Jewelry",
      "Handwoven Chimayo Wool Blankets",
      "Pueblo Hand-Coiled Clay Pottery"
    ],
    "popularCategories": [
      "Southwestern Jewelry",
      "Specialty Chile Sauces",
      "Handwoven Blankets",
      "Pueblo Ceramics"
    ],
    "vendorPermitRequirement": "New Mexico Taxation and Revenue Department CRS (Combined Reporting System) Number."
  },
  {
    "code": "NY",
    "name": "New York",
    "slug": "new-york",
    "region": "Northeast",
    "top3Cities": [
      {
        "name": "New York City",
        "population": "8,258,030",
        "populationNumber": 8258030,
        "rank": 1
      },
      {
        "name": "Buffalo",
        "population": "274,650",
        "populationNumber": 274650,
        "rank": 2
      },
      {
        "name": "Rochester",
        "population": "209,350",
        "populationNumber": 209350,
        "rank": 3
      }
    ],
    "citiesOver200k": [
      {
        "name": "New York City",
        "population": "8,258,030",
        "populationNumber": 8258030,
        "rank": 1
      },
      {
        "name": "Buffalo",
        "population": "274,650",
        "populationNumber": 274650,
        "rank": 2
      },
      {
        "name": "Rochester",
        "population": "209,350",
        "populationNumber": 209350,
        "rank": 3
      },
      {
        "name": "Yonkers",
        "population": "208,320",
        "populationNumber": 208320,
        "rank": 4
      }
    ],
    "majorCities": [
      "New York City",
      "Buffalo",
      "Rochester",
      "Yonkers",
      "Syracuse",
      "Albany",
      "New Rochelle",
      "Mount Vernon",
      "Schenectady",
      "Utica",
      "White Plains",
      "Ithaca"
    ],
    "annualEventsCount": 160,
    "salesTaxInfo": "New York State Department of Taxation Certificate of Authority (4.0% State + Local Sales Tax up to 8.875%)",
    "artisanSpecialties": [
      "Adirondack Birch Bark Craft",
      "Hudson Valley Artisan Cider Preserves",
      "Handmade Scented Botanical Candles",
      "SoHo Fine Contemporary Prints"
    ],
    "popularCategories": [
      "Contemporary Art",
      "Specialty Ciders & Jam",
      "Candles",
      "Designer Fashion"
    ],
    "vendorPermitRequirement": "Certificate of Authority issued at least 20 days prior to event; Form DTF-17.5 for show vendors."
  },
  {
    "code": "NC",
    "name": "North Carolina",
    "slug": "north-carolina",
    "region": "Southeast",
    "top3Cities": [
      {
        "name": "Charlotte",
        "population": "911,310",
        "populationNumber": 911310,
        "rank": 1
      },
      {
        "name": "Raleigh",
        "population": "482,290",
        "populationNumber": 482290,
        "rank": 2
      },
      {
        "name": "Greensboro",
        "population": "301,110",
        "populationNumber": 301110,
        "rank": 3
      }
    ],
    "citiesOver200k": [
      {
        "name": "Charlotte",
        "population": "911,310",
        "populationNumber": 911310,
        "rank": 1
      },
      {
        "name": "Raleigh",
        "population": "482,290",
        "populationNumber": 482290,
        "rank": 2
      },
      {
        "name": "Greensboro",
        "population": "301,110",
        "populationNumber": 301110,
        "rank": 3
      },
      {
        "name": "Durham",
        "population": "291,920",
        "populationNumber": 291920,
        "rank": 4
      },
      {
        "name": "Winston-Salem",
        "population": "251,470",
        "populationNumber": 251470,
        "rank": 5
      },
      {
        "name": "Fayetteville",
        "population": "208,870",
        "populationNumber": 208870,
        "rank": 6
      }
    ],
    "majorCities": [
      "Charlotte",
      "Raleigh",
      "Greensboro",
      "Durham",
      "Winston-Salem",
      "Fayetteville",
      "Cary",
      "Wilmington",
      "High Point",
      "Asheville",
      "Concord",
      "Gastonia"
    ],
    "annualEventsCount": 110,
    "salesTaxInfo": "North Carolina Department of Revenue Certificate of Registration (4.75% State + County Tax 2.0%–2.75%)",
    "artisanSpecialties": [
      "Seagrove Traditional Salt-Glaze Pottery",
      "Blue Ridge Mountain Banjo & Dulcimer Crafts",
      "Carolina Vinegar BBQ Sauces & Marinades",
      "Outer Banks Seagrass Hats & Mats"
    ],
    "popularCategories": [
      "Pottery & Ceramics",
      "Gourmet BBQ Provisions",
      "Folk Crafts",
      "Coastal Decor"
    ],
    "vendorPermitRequirement": "North Carolina Form NC-BR (Business Registration Application for Sales and Use Tax)."
  },
  {
    "code": "ND",
    "name": "North Dakota",
    "slug": "north-dakota",
    "region": "Midwest",
    "top3Cities": [
      {
        "name": "Fargo",
        "population": "132,440",
        "populationNumber": 132440,
        "rank": 1
      },
      {
        "name": "Bismarck",
        "population": "75,090",
        "populationNumber": 75090,
        "rank": 2
      },
      {
        "name": "Grand Forks",
        "population": "58,880",
        "populationNumber": 58880,
        "rank": 3
      }
    ],
    "citiesOver200k": [],
    "majorCities": [
      "Fargo",
      "Bismarck",
      "Grand Forks",
      "Minot",
      "West Fargo",
      "Williston",
      "Dickinson",
      "Mandan",
      "Jamestown",
      "Wahpeton"
    ],
    "annualEventsCount": 20,
    "salesTaxInfo": "North Dakota Office of State Tax Commissioner Special Event Return (5.0% State + City Sales Tax)",
    "artisanSpecialties": [
      "Chokecherry Jellies & Syrups",
      "Hardwood Cutting Boards & Carvings",
      "Handmade Wool Socks & Shawls",
      "Hand-Crafted Bison Leather Belts"
    ],
    "popularCategories": [
      "Prairie Jellies & Sweets",
      "Woodcraft",
      "Wool Apparel",
      "Bison Leather"
    ],
    "vendorPermitRequirement": "North Dakota Temporary Sales Tax Permit issued online via ND TAP."
  },
  {
    "code": "OH",
    "name": "Ohio",
    "slug": "ohio",
    "region": "Midwest",
    "top3Cities": [
      {
        "name": "Columbus",
        "population": "907,970",
        "populationNumber": 907970,
        "rank": 1
      },
      {
        "name": "Cleveland",
        "population": "362,650",
        "populationNumber": 362650,
        "rank": 2
      },
      {
        "name": "Cincinnati",
        "population": "309,510",
        "populationNumber": 309510,
        "rank": 3
      }
    ],
    "citiesOver200k": [
      {
        "name": "Columbus",
        "population": "907,970",
        "populationNumber": 907970,
        "rank": 1
      },
      {
        "name": "Cleveland",
        "population": "362,650",
        "populationNumber": 362650,
        "rank": 2
      },
      {
        "name": "Cincinnati",
        "population": "309,510",
        "populationNumber": 309510,
        "rank": 3
      },
      {
        "name": "Toledo",
        "population": "266,300",
        "populationNumber": 266300,
        "rank": 4
      }
    ],
    "majorCities": [
      "Columbus",
      "Cleveland",
      "Cincinnati",
      "Toledo",
      "Akron",
      "Dayton",
      "Parma",
      "Canton",
      "Lorain",
      "Hamilton",
      "Youngstown",
      "Springfield"
    ],
    "annualEventsCount": 90,
    "salesTaxInfo": "Ohio Department of Taxation Transient Vendor’s License (5.75% State + County Rates up to 8.0%)",
    "artisanSpecialties": [
      "Buckeye Woodcraft & Confections",
      "Hand-Blown Ohio Art Glass",
      "Amish Oak Furniture & Spoons",
      "Small-Batch Pierogis & Apple Butter"
    ],
    "popularCategories": [
      "Art Glass",
      "Handmade Wood Furniture",
      "Confections & Sweets",
      "Amish Goods"
    ],
    "vendorPermitRequirement": "Ohio Transient Vendor’s License ($25 one-time fee) valid statewide."
  },
  {
    "code": "OK",
    "name": "Oklahoma",
    "slug": "oklahoma",
    "region": "Southwest",
    "top3Cities": [
      {
        "name": "Oklahoma City",
        "population": "702,760",
        "populationNumber": 702760,
        "rank": 1
      },
      {
        "name": "Tulsa",
        "population": "411,890",
        "populationNumber": 411890,
        "rank": 2
      },
      {
        "name": "Norman",
        "population": "129,770",
        "populationNumber": 129770,
        "rank": 3
      }
    ],
    "citiesOver200k": [
      {
        "name": "Oklahoma City",
        "population": "702,760",
        "populationNumber": 702760,
        "rank": 1
      },
      {
        "name": "Tulsa",
        "population": "411,890",
        "populationNumber": 411890,
        "rank": 2
      }
    ],
    "majorCities": [
      "Oklahoma City",
      "Tulsa",
      "Norman",
      "Broken Arrow",
      "Edmond",
      "Lawton",
      "Moore",
      "Midwest City",
      "Enid",
      "Stillwater",
      "Muskogee"
    ],
    "annualEventsCount": 46,
    "salesTaxInfo": "Oklahoma Tax Commission Special Event Promoter Return (4.5% State + City/County Taxes)",
    "artisanSpecialties": [
      "Native American Beadwork & Dreamcatchers",
      "Custom Western Cowboy Hats",
      "Red Dirt Country Cedar Signs",
      "Pecan & Jalapeno Salsas"
    ],
    "popularCategories": [
      "Indigenous Crafts",
      "Western Accessories",
      "Wood Signs",
      "Artisan Salsas"
    ],
    "vendorPermitRequirement": "Oklahoma Special Event Sales Tax report provided by event organizer."
  },
  {
    "code": "OR",
    "name": "Oregon",
    "slug": "oregon",
    "region": "Pacific",
    "top3Cities": [
      {
        "name": "Portland",
        "population": "630,490",
        "populationNumber": 630490,
        "rank": 1
      },
      {
        "name": "Eugene",
        "population": "178,320",
        "populationNumber": 178320,
        "rank": 2
      },
      {
        "name": "Salem",
        "population": "177,720",
        "populationNumber": 177720,
        "rank": 3
      }
    ],
    "citiesOver200k": [
      {
        "name": "Portland",
        "population": "630,490",
        "populationNumber": 630490,
        "rank": 1
      }
    ],
    "majorCities": [
      "Portland",
      "Eugene",
      "Salem",
      "Gresham",
      "Hillsboro",
      "Beaverton",
      "Bend",
      "Medford",
      "Springfield",
      "Corvallis",
      "Albany",
      "Tigard"
    ],
    "annualEventsCount": 86,
    "salesTaxInfo": "0% State Sales Tax (Local lodging and prepared food taxes may apply in select resort zones)",
    "artisanSpecialties": [
      "Oregon Myrtlewood Bowls & Platters",
      "Handcrafted Hemp Bags & Textiles",
      "Marionberry Syrups & Jellies",
      "Hand-Thrown Ceramic Coffee Drippers"
    ],
    "popularCategories": [
      "Myrtlewood & Timber Crafts",
      "Sustainable Textiles",
      "Berry Preserves",
      "Handmade Ceramics"
    ],
    "vendorPermitRequirement": "No state sales tax permit required; Local county health permit required for food handlers."
  },
  {
    "code": "PA",
    "name": "Pennsylvania",
    "slug": "pennsylvania",
    "region": "Mid-Atlantic",
    "top3Cities": [
      {
        "name": "Philadelphia",
        "population": "1,550,540",
        "populationNumber": 1550540,
        "rank": 1
      },
      {
        "name": "Pittsburgh",
        "population": "302,970",
        "populationNumber": 302970,
        "rank": 2
      },
      {
        "name": "Allentown",
        "population": "125,840",
        "populationNumber": 125840,
        "rank": 3
      }
    ],
    "citiesOver200k": [
      {
        "name": "Philadelphia",
        "population": "1,550,540",
        "populationNumber": 1550540,
        "rank": 1
      },
      {
        "name": "Pittsburgh",
        "population": "302,970",
        "populationNumber": 302970,
        "rank": 2
      }
    ],
    "majorCities": [
      "Philadelphia",
      "Pittsburgh",
      "Allentown",
      "Reading",
      "Erie",
      "Upper Darby",
      "Scranton",
      "Bethlehem",
      "Lancaster",
      "Harrisburg",
      "York",
      "State College"
    ],
    "annualEventsCount": 105,
    "salesTaxInfo": "Pennsylvania Department of Revenue Sales, Use and Hotel Occupancy Tax License (6.0% State / 8% Philadelphia / 7% Allegheny County)",
    "artisanSpecialties": [
      "Lancaster Pennsylvania Dutch Hex Signs",
      "Handcrafted Pretzels & Whoopie Pies",
      "Hand-Forged Wrought Iron Hardware",
      "Hand-Turned Cherry Spoons"
    ],
    "popularCategories": [
      "Dutch Folk Crafts",
      "Artisan Bakery",
      "Ironwork",
      "Handmade Wooden Utensils"
    ],
    "vendorPermitRequirement": "Pennsylvania Sales Tax License (Rev-72) obtained free through myPATH."
  },
  {
    "code": "RI",
    "name": "Rhode Island",
    "slug": "rhode-island",
    "region": "Northeast",
    "top3Cities": [
      {
        "name": "Providence",
        "population": "189,560",
        "populationNumber": 189560,
        "rank": 1
      },
      {
        "name": "Warwick",
        "population": "82,780",
        "populationNumber": 82780,
        "rank": 2
      },
      {
        "name": "Cranston",
        "population": "82,490",
        "populationNumber": 82490,
        "rank": 3
      }
    ],
    "citiesOver200k": [],
    "majorCities": [
      "Providence",
      "Warwick",
      "Cranston",
      "Pawtucket",
      "East Providence",
      "Woonsocket",
      "Newport",
      "Central Falls",
      "Westerly",
      "Bristol"
    ],
    "annualEventsCount": 32,
    "salesTaxInfo": "Rhode Island Division of Taxation Retail Sales Permit (7.0% State Flat Rate)",
    "artisanSpecialties": [
      "Newport Sterling Silver Marine Jewelry",
      "Hand-Carved Whale & Nautical Sculptures",
      "Johnnycake Cornmeal Pantry Sets",
      "WaterFire Scented Candle Collections"
    ],
    "popularCategories": [
      "Maritime Jewelry",
      "Nautical Woodcraft",
      "Specialty Cornmeal & Syrups",
      "Candles"
    ],
    "vendorPermitRequirement": "Rhode Island Temporary Retail Sales Permit ($10 fee) issued by Division of Taxation."
  },
  {
    "code": "SC",
    "name": "South Carolina",
    "slug": "south-carolina",
    "region": "Southeast",
    "top3Cities": [
      {
        "name": "Charleston",
        "population": "153,680",
        "populationNumber": 153680,
        "rank": 1
      },
      {
        "name": "Columbia (Host City)",
        "population": "142,390",
        "populationNumber": 142390,
        "rank": 2
      },
      {
        "name": "North Charleston",
        "population": "118,480",
        "populationNumber": 118480,
        "rank": 3
      }
    ],
    "citiesOver200k": [],
    "majorCities": [
      "Charleston",
      "Columbia",
      "North Charleston",
      "Mount Pleasant",
      "Rock Hill",
      "Greenville",
      "Summerville",
      "Goose Creek",
      "Spartanburg",
      "Myrtle Beach",
      "Florence",
      "Hilton Head Island"
    ],
    "annualEventsCount": 88,
    "salesTaxInfo": "South Carolina Department of Revenue Retail License (6.0% State + County Local Option Taxes)",
    "artisanSpecialties": [
      "Sweetgrass Handwoven Baskets (Charleston/Lowcountry)",
      "Carolina Gold Rice & Stone-Ground Grits",
      "Lowcountry Boiled Peanut Seasonings",
      "Palmetto Tree Ironwork & Sterling Jewelry"
    ],
    "popularCategories": [
      "Sweetgrass Baskets",
      "Heritage Foods & Grits",
      "Palmetto Jewelry",
      "Artisan Crafts",
      "Food Trucks"
    ],
    "vendorPermitRequirement": "South Carolina Retail License or Single-Event Transient Merchant return through MyDORWAY."
  },
  {
    "code": "SD",
    "name": "South Dakota",
    "slug": "south-dakota",
    "region": "Midwest",
    "top3Cities": [
      {
        "name": "Sioux Falls",
        "population": "202,600",
        "populationNumber": 202600,
        "rank": 1
      },
      {
        "name": "Rapid City",
        "population": "78,740",
        "populationNumber": 78740,
        "rank": 2
      },
      {
        "name": "Aberdeen",
        "population": "28,320",
        "populationNumber": 28320,
        "rank": 3
      }
    ],
    "citiesOver200k": [
      {
        "name": "Sioux Falls",
        "population": "202,600",
        "populationNumber": 202600,
        "rank": 1
      }
    ],
    "majorCities": [
      "Sioux Falls",
      "Rapid City",
      "Aberdeen",
      "Brookings",
      "Watertown",
      "Mitchell",
      "Yankton",
      "Pierre",
      "Huron",
      "Spearfish"
    ],
    "annualEventsCount": 22,
    "salesTaxInfo": "South Dakota Department of Revenue Special Event Return (4.2% State + Municipal Tax up to 2%)",
    "artisanSpecialties": [
      "Black Hills Gold Style Jewelry",
      "Buffalo Leather Jackets & Chaps",
      "Prairie Honey & Mead Blends",
      "Rosebud Hand-Carved Pipestone"
    ],
    "popularCategories": [
      "Gold & Silver Jewelry",
      "Bison Leather",
      "Prairie Jams & Honey",
      "Stone Carvings"
    ],
    "vendorPermitRequirement": "South Dakota Temporary Sales Tax License issued directly for special events."
  },
  {
    "code": "TN",
    "name": "Tennessee",
    "slug": "tennessee",
    "region": "Southeast",
    "top3Cities": [
      {
        "name": "Nashville",
        "population": "678,850",
        "populationNumber": 678850,
        "rank": 1
      },
      {
        "name": "Memphis",
        "population": "618,640",
        "populationNumber": 618640,
        "rank": 2
      },
      {
        "name": "Knoxville",
        "population": "195,890",
        "populationNumber": 195890,
        "rank": 3
      }
    ],
    "citiesOver200k": [
      {
        "name": "Nashville",
        "population": "678,850",
        "populationNumber": 678850,
        "rank": 1
      },
      {
        "name": "Memphis",
        "population": "618,640",
        "populationNumber": 618640,
        "rank": 2
      }
    ],
    "majorCities": [
      "Nashville",
      "Memphis",
      "Knoxville",
      "Chattanooga",
      "Clarksville",
      "Murfreesboro",
      "Franklin",
      "Johnson City",
      "Jackson",
      "Hendersonville",
      "Bartlett",
      "Kingsport"
    ],
    "annualEventsCount": 92,
    "salesTaxInfo": "Tennessee Department of Revenue Standard Event Sales Tax (7.0% State + Local Rate up to 2.75%)",
    "artisanSpecialties": [
      "Smoky Mountain Cedar Crafts",
      "Nashville Hot Chicken Dry Rubs",
      "Handmade Acoustic Guitar Straps",
      "Jack Daniel’s Barrel Plank Clocks"
    ],
    "popularCategories": [
      "Music & Instrument Accessories",
      "Spices & Hot Sauces",
      "Cedar Woodcraft",
      "Handmade Apparel"
    ],
    "vendorPermitRequirement": "Tennessee Standard Sales Tax Account or Temporary Vendor Form filed via TNTAP."
  },
  {
    "code": "TX",
    "name": "Texas",
    "slug": "texas",
    "region": "Southwest",
    "top3Cities": [
      {
        "name": "Houston",
        "population": "2,302,880",
        "populationNumber": 2302880,
        "rank": 1
      },
      {
        "name": "San Antonio",
        "population": "1,495,290",
        "populationNumber": 1495290,
        "rank": 2
      },
      {
        "name": "Dallas",
        "population": "1,299,540",
        "populationNumber": 1299540,
        "rank": 3
      }
    ],
    "citiesOver200k": [
      {
        "name": "Houston",
        "population": "2,302,880",
        "populationNumber": 2302880,
        "rank": 1
      },
      {
        "name": "San Antonio",
        "population": "1,495,290",
        "populationNumber": 1495290,
        "rank": 2
      },
      {
        "name": "Dallas",
        "population": "1,299,540",
        "populationNumber": 1299540,
        "rank": 3
      },
      {
        "name": "Austin",
        "population": "979,880",
        "populationNumber": 979880,
        "rank": 4
      },
      {
        "name": "Fort Worth",
        "population": "958,690",
        "populationNumber": 958690,
        "rank": 5
      },
      {
        "name": "El Paso",
        "population": "677,450",
        "populationNumber": 677450,
        "rank": 6
      },
      {
        "name": "Arlington",
        "population": "394,600",
        "populationNumber": 394600,
        "rank": 7
      },
      {
        "name": "Corpus Christi",
        "population": "316,590",
        "populationNumber": 316590,
        "rank": 8
      },
      {
        "name": "Plano",
        "population": "288,250",
        "populationNumber": 288250,
        "rank": 9
      },
      {
        "name": "Lubbock",
        "population": "264,040",
        "populationNumber": 264040,
        "rank": 10
      },
      {
        "name": "Laredo",
        "population": "256,180",
        "populationNumber": 256180,
        "rank": 11
      },
      {
        "name": "Irving",
        "population": "254,770",
        "populationNumber": 254770,
        "rank": 12
      },
      {
        "name": "Garland",
        "population": "242,030",
        "populationNumber": 242030,
        "rank": 13
      },
      {
        "name": "Frisco",
        "population": "219,580",
        "populationNumber": 219580,
        "rank": 14
      },
      {
        "name": "McKinney",
        "population": "207,550",
        "populationNumber": 207550,
        "rank": 15
      },
      {
        "name": "Grand Prairie",
        "population": "201,840",
        "populationNumber": 201840,
        "rank": 16
      },
      {
        "name": "Amarillo",
        "population": "201,230",
        "populationNumber": 201230,
        "rank": 17
      }
    ],
    "majorCities": [
      "Houston",
      "San Antonio",
      "Dallas",
      "Austin",
      "Fort Worth",
      "El Paso",
      "Arlington",
      "Corpus Christi",
      "Plano",
      "Lubbock",
      "Laredo",
      "Irving",
      "Garland",
      "Frisco",
      "McKinney",
      "Grand Prairie",
      "Amarillo",
      "Brownsville"
    ],
    "annualEventsCount": 175,
    "salesTaxInfo": "Texas Comptroller of Public Accounts Sales and Use Tax (6.25% State + Local Transit/City up to 8.25%)",
    "artisanSpecialties": [
      "Handcrafted Leather Western Saddlery & Boots",
      "Texas Mesquite Wood Cutting Boards",
      "Hill Country Lavender Lotions & Oils",
      "Artisan Smoked Brisket Glazes & Rubs"
    ],
    "popularCategories": [
      "Western Wear & Boots",
      "Mesquite Woodwork",
      "Lavender Botanicals",
      "BBQ Provisions & Sauces",
      "Food Trucks"
    ],
    "vendorPermitRequirement": "Texas Sales and Use Tax Permit is 100% free and issued electronically via WebFile."
  },
  {
    "code": "UT",
    "name": "Utah",
    "slug": "utah",
    "region": "West",
    "top3Cities": [
      {
        "name": "Salt Lake City",
        "population": "204,660",
        "populationNumber": 204660,
        "rank": 1
      },
      {
        "name": "West Valley City",
        "population": "138,200",
        "populationNumber": 138200,
        "rank": 2
      },
      {
        "name": "West Jordan",
        "population": "116,660",
        "populationNumber": 116660,
        "rank": 3
      }
    ],
    "citiesOver200k": [
      {
        "name": "Salt Lake City",
        "population": "204,660",
        "populationNumber": 204660,
        "rank": 1
      }
    ],
    "majorCities": [
      "Salt Lake City",
      "West Valley City",
      "West Jordan",
      "Provo",
      "Orem",
      "Sandy",
      "St. George",
      "Ogden",
      "Layton",
      "South Jordan",
      "Lehi",
      "Millcreek",
      "Park City"
    ],
    "annualEventsCount": 46,
    "salesTaxInfo": "Utah State Tax Commission Special Event Tax Return (Form TC-730, 4.85% State + Local Rates 6.85%–9.05%)",
    "artisanSpecialties": [
      "Red Rock Sandstone Coasters & Decor",
      "Beeswax Honey Comb Soaps",
      "Alpine Ski & Mountain Wood Signage",
      "Artisan Artisan Sourdough Pastries"
    ],
    "popularCategories": [
      "Mountain Decor",
      "Natural Honey & Soaps",
      "Outdoor Crafts",
      "Bakery"
    ],
    "vendorPermitRequirement": "Utah Special Event Temporary Sales Tax Number provided directly by festival organizer."
  },
  {
    "code": "VT",
    "name": "Vermont",
    "slug": "vermont",
    "region": "Northeast",
    "top3Cities": [
      {
        "name": "Burlington",
        "population": "44,780",
        "populationNumber": 44780,
        "rank": 1
      },
      {
        "name": "South Burlington",
        "population": "20,890",
        "populationNumber": 20890,
        "rank": 2
      },
      {
        "name": "Rutland",
        "population": "15,620",
        "populationNumber": 15620,
        "rank": 3
      }
    ],
    "citiesOver200k": [],
    "majorCities": [
      "Burlington",
      "South Burlington",
      "Rutland",
      "Barre",
      "Montpelier",
      "Winooski",
      "St. Albans",
      "Stowe",
      "Brattleboro",
      "Hartford"
    ],
    "annualEventsCount": 30,
    "salesTaxInfo": "Vermont Department of Taxes Sales and Use Tax (6.0% State + 1% Local Option)",
    "artisanSpecialties": [
      "100% Pure Vermont Amber Maple Syrup & Candy",
      "Handmade Wooden Toys & Puzzles",
      "Artisan Cheddar Cheese Preserves",
      "Hand-Blown Glass Vases"
    ],
    "popularCategories": [
      "Maple Provisions",
      "Handmade Wooden Toys",
      "Dairy & Pantry",
      "Glassblowing"
    ],
    "vendorPermitRequirement": "Vermont Temporary Sales Tax License issued through myVTax."
  },
  {
    "code": "VA",
    "name": "Virginia",
    "slug": "virginia",
    "region": "Mid-Atlantic",
    "top3Cities": [
      {
        "name": "Virginia Beach",
        "population": "455,620",
        "populationNumber": 455620,
        "rank": 1
      },
      {
        "name": "Chesapeake",
        "population": "253,890",
        "populationNumber": 253890,
        "rank": 2
      },
      {
        "name": "Norfolk",
        "population": "232,990",
        "populationNumber": 232990,
        "rank": 3
      }
    ],
    "citiesOver200k": [
      {
        "name": "Virginia Beach",
        "population": "455,620",
        "populationNumber": 455620,
        "rank": 1
      },
      {
        "name": "Chesapeake",
        "population": "253,890",
        "populationNumber": 253890,
        "rank": 2
      },
      {
        "name": "Arlington (Urban Hub)",
        "population": "238,640",
        "populationNumber": 238640,
        "rank": 3
      },
      {
        "name": "Norfolk",
        "population": "232,990",
        "populationNumber": 232990,
        "rank": 4
      },
      {
        "name": "Richmond",
        "population": "226,610",
        "populationNumber": 226610,
        "rank": 5
      }
    ],
    "majorCities": [
      "Virginia Beach",
      "Chesapeake",
      "Arlington",
      "Norfolk",
      "Richmond",
      "Newport News",
      "Alexandria",
      "Hampton",
      "Roanoke",
      "Portsmouth",
      "Suffolk",
      "Lynchburg",
      "Charlottesville"
    ],
    "annualEventsCount": 80,
    "salesTaxInfo": "Virginia Department of Taxation Form ST-50 Special Events (5.3% General State / 6.0% Northern VA & Hampton Roads)",
    "artisanSpecialties": [
      "Virginia Peanut Brittle & Gourmet Nuts",
      "Shenandoah Apple Butter Preserves",
      "Colonial Williamsburg Copper Work",
      "Hand-Tooled Leather Saddles & Belts"
    ],
    "popularCategories": [
      "Gourmet Peanuts & Butters",
      "Appalachian Crafts",
      "Metal & Copper Work",
      "Leathercraft"
    ],
    "vendorPermitRequirement": "Virginia Form ST-50 (Special Event Sales Tax Return) remitted within 15 days of festival."
  },
  {
    "code": "WA",
    "name": "Washington",
    "slug": "washington",
    "region": "Pacific",
    "top3Cities": [
      {
        "name": "Seattle",
        "population": "755,080",
        "populationNumber": 755080,
        "rank": 1
      },
      {
        "name": "Spokane",
        "population": "229,450",
        "populationNumber": 229450,
        "rank": 2
      },
      {
        "name": "Tacoma",
        "population": "221,780",
        "populationNumber": 221780,
        "rank": 3
      }
    ],
    "citiesOver200k": [
      {
        "name": "Seattle",
        "population": "755,080",
        "populationNumber": 755080,
        "rank": 1
      },
      {
        "name": "Spokane",
        "population": "229,450",
        "populationNumber": 229450,
        "rank": 2
      },
      {
        "name": "Tacoma",
        "population": "221,780",
        "populationNumber": 221780,
        "rank": 3
      }
    ],
    "majorCities": [
      "Seattle",
      "Spokane",
      "Tacoma",
      "Vancouver",
      "Bellevue",
      "Kent",
      "Everett",
      "Renton",
      "Spokane Valley",
      "Federal Way",
      "Yakima",
      "Bellingham",
      "Olympia"
    ],
    "annualEventsCount": 94,
    "salesTaxInfo": "Washington Department of Revenue Temporary Business License (6.5% State + Local Tax up to 10.5%)",
    "artisanSpecialties": [
      "Pacific Northwest Smoked Salmon Strips",
      "Rainier Cherry Chutneys & Jams",
      "Hand-Blown Murano & Float Glass",
      "Cedarwood & Moss Beard Balms & Oils"
    ],
    "popularCategories": [
      "Studio Glass",
      "Specialty Seafood & Jams",
      "Botanical Grooming",
      "Handmade Ceramics"
    ],
    "vendorPermitRequirement": "Washington Temporary Business License or Master Business License through SecureAccess Washington."
  },
  {
    "code": "WV",
    "name": "West Virginia",
    "slug": "west-virginia",
    "region": "Mid-Atlantic",
    "top3Cities": [
      {
        "name": "Charleston",
        "population": "46,540",
        "populationNumber": 46540,
        "rank": 1
      },
      {
        "name": "Huntington",
        "population": "45,690",
        "populationNumber": 45690,
        "rank": 2
      },
      {
        "name": "Morgantown",
        "population": "30,350",
        "populationNumber": 30350,
        "rank": 3
      }
    ],
    "citiesOver200k": [],
    "majorCities": [
      "Charleston",
      "Huntington",
      "Morgantown",
      "Parkersburg",
      "Wheeling",
      "Weirton",
      "Fairmont",
      "Martinsburg",
      "Beckley",
      "Clarksburg"
    ],
    "annualEventsCount": 26,
    "salesTaxInfo": "West Virginia State Tax Department Special Event Return (6.0% State + Municipal Sales Tax up to 1%)",
    "artisanSpecialties": [
      "Appalachian Mountain Dulcimers & Woodwork",
      "Black Walnut & Sorghum Syrups",
      "Fenton-Style Art Glass",
      "Hand-Stitched Mountain Quilts"
    ],
    "popularCategories": [
      "Musical Instruments",
      "Mountain Jams & Sorghum",
      "Art Glass",
      "Quilting"
    ],
    "vendorPermitRequirement": "West Virginia Special Event Vendor Certificate obtained online through MyTaxes.wv.gov."
  },
  {
    "code": "WI",
    "name": "Wisconsin",
    "slug": "wisconsin",
    "region": "Midwest",
    "top3Cities": [
      {
        "name": "Milwaukee",
        "population": "563,300",
        "populationNumber": 563300,
        "rank": 1
      },
      {
        "name": "Madison",
        "population": "272,600",
        "populationNumber": 272600,
        "rank": 2
      },
      {
        "name": "Green Bay",
        "population": "106,100",
        "populationNumber": 106100,
        "rank": 3
      }
    ],
    "citiesOver200k": [
      {
        "name": "Milwaukee",
        "population": "563,300",
        "populationNumber": 563300,
        "rank": 1
      },
      {
        "name": "Madison",
        "population": "272,600",
        "populationNumber": 272600,
        "rank": 2
      }
    ],
    "majorCities": [
      "Milwaukee",
      "Madison",
      "Green Bay",
      "Kenosha",
      "Racine",
      "Appleton",
      "Waukesha",
      "Eau Claire",
      "Oshkosh",
      "Janesville",
      "West Allis",
      "La Crosse"
    ],
    "annualEventsCount": 68,
    "salesTaxInfo": "Wisconsin Department of Revenue Temporary Events Program (5.0% State + 0.5% County Sales Tax)",
    "artisanSpecialties": [
      "Wisconsin Artisan Cheese Curds & Spreads",
      "Door County Cherry Pies & Salsas",
      "Handmade Wooden Beer Flight Boards",
      "Cast Iron Cookware & Seasoning Balms"
    ],
    "popularCategories": [
      "Cheese & Specialty Foods",
      "Cherry Goods",
      "Woodworking & Beer Crafts",
      "Cast Iron"
    ],
    "vendorPermitRequirement": "Wisconsin Form S-240 (Temporary Event Operator and Seller Information) submitted."
  },
  {
    "code": "WY",
    "name": "Wyoming",
    "slug": "wyoming",
    "region": "West",
    "top3Cities": [
      {
        "name": "Cheyenne",
        "population": "65,160",
        "populationNumber": 65160,
        "rank": 1
      },
      {
        "name": "Casper",
        "population": "58,690",
        "populationNumber": 58690,
        "rank": 2
      },
      {
        "name": "Laramie",
        "population": "32,160",
        "populationNumber": 32160,
        "rank": 3
      }
    ],
    "citiesOver200k": [],
    "majorCities": [
      "Cheyenne",
      "Casper",
      "Laramie",
      "Gillette",
      "Rock Springs",
      "Sheridan",
      "Green River",
      "Evanston",
      "Riverton",
      "Jackson"
    ],
    "annualEventsCount": 20,
    "salesTaxInfo": "Wyoming Department of Revenue Special Event Sales Tax (4.0% State + Local Option up to 2%)",
    "artisanSpecialties": [
      "Jackson Hole Elk Antler Chandeliers & Knives",
      "Raw Western Turquoise & Silver Rings",
      "Bison Tallow Moisturizers & Balms",
      "Cowboy Leather Chaps & Holsters"
    ],
    "popularCategories": [
      "Antler Art & Knives",
      "Turquoise Jewelry",
      "Bison Tallow Skincare",
      "Western Leather"
    ],
    "vendorPermitRequirement": "Wyoming Temporary Sales Tax License issued for transient vendors."
  }
];

export const TOTAL_US_STATES_COUNT = USA_STATES_CITIES_DATA.length;

// Precalculated helper for all US cities over 200k population
export const ALL_US_CITIES_OVER_200K = USA_STATES_CITIES_DATA.flatMap(state => 
  state.citiesOver200k.map(city => ({
    ...city,
    stateCode: state.code,
    stateName: state.name,
    stateSlug: state.slug,
    region: state.region
  }))
).sort((a, b) => b.populationNumber - a.populationNumber);
