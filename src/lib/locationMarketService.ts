import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db, cleanFirestoreData } from './firebase';
import { EventLocationMarket, CustomCityEntry, VENDOR_KIND_OPTIONS } from '../types';
import { USA_STATES_CITIES_DATA } from '../data/usaStatesCitiesData';
import { MIAMI_FARMERS_MARKET_LOCATIONS } from '../data/miamiFarmersMarketEvents';

export const DEFAULT_EVENT_LOCATIONS: EventLocationMarket[] = [
  ...MIAMI_FARMERS_MARKET_LOCATIONS,
  {
    id: 'loc-columbia-sc',
    title: '2026 Columbia Fall First Fridays',
    stateCode: 'SC',
    stateName: 'South Carolina',
    cityName: 'Columbia',
    venueName: 'Downtown Historic Main St & Riverfront',
    address: '1200 Main Street, Columbia, SC 29201',
    description: 'Columbia Fall First Fridays and Weekend Expo will be held across multiple dates. Featuring over 150 maker vendors, non-profit community booths, food truck row, fine art exhibits, craft beverage gardens, and live music stages.',
    dates: ['2026-10-02', '2026-10-03', '2026-10-04'],
    days: ['fri', 'sat', 'sun'],
    hours: '10:00 AM - 7:00 PM',
    vendorTypesAccepted: [...VENDOR_KIND_OPTIONS, 'Music', 'Art', 'Craft', 'Food', 'Commercial'],
    boothPricePerDay: 75,
    totalBoothsCount: 180,
    active: true,
    imageUrl: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=900&q=80',
    images: ['https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=900&q=80'],
    createdAt: '2026-09-10T12:00:00Z',
    updatedAt: '2026-09-19T08:00:00Z'
  },
  {
    id: 'loc-florence-al',
    title: '2026 Florence Shoals First Fridays & Weekend Fair',
    stateCode: 'AL',
    stateName: 'Alabama',
    cityName: 'Florence',
    venueName: 'Court Street Historic District & Wilson Park',
    address: '200 N Court St, Florence, AL 35630',
    description: 'Florence Fall First Fridays will be held on October 2 and October 3, 2026. It will feature maker vendors, non-profit booths, food truck vendors, fine art exhibitors, Muscle Shoals acoustic music, and handcrafted creators.',
    dates: ['2026-10-02', '2026-10-03'],
    days: ['fri', 'sat'],
    hours: '11:00 AM - 8:00 PM',
    vendorTypesAccepted: [...VENDOR_KIND_OPTIONS, 'Music', 'Art', 'Craft', 'Food', 'Commercial'],
    boothPricePerDay: 65,
    totalBoothsCount: 95,
    active: true,
    imageUrl: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=900&q=80',
    images: ['https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=900&q=80'],
    createdAt: '2026-09-12T10:00:00Z',
    updatedAt: '2026-09-19T08:00:00Z'
  },
  {
    id: 'loc-houston-tx',
    title: '2026 Houston Bayou City Artisan Festival',
    stateCode: 'TX',
    stateName: 'Texas',
    cityName: 'Houston',
    venueName: 'Sam Houston Park & Downtown Promenade',
    address: '1000 Bagby St, Houston, TX 77002',
    description: 'The premier Houston Gulf Coast artisan marketplace bringing together over 300 fine artists, Texas country & blues bands, culinary innovators, international food trucks, and handcrafted makers across 3 full festival days.',
    dates: ['2026-10-09', '2026-10-10', '2026-10-11'],
    days: ['fri', 'sat', 'sun'],
    hours: '10:00 AM - 6:00 PM',
    vendorTypesAccepted: [...VENDOR_KIND_OPTIONS, 'Music', 'Art', 'Craft', 'Food', 'Commercial'],
    boothPricePerDay: 110,
    totalBoothsCount: 260,
    active: true,
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80',
    images: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80'],
    createdAt: '2026-09-12T11:00:00Z',
    updatedAt: '2026-09-19T08:00:00Z'
  },
  {
    id: 'loc-seattle-wa',
    title: '2026 Seattle Waterfront Makers & Sound Market',
    stateCode: 'WA',
    stateName: 'Washington',
    cityName: 'Seattle',
    venueName: 'Pier 62 Waterfront Park & Belltown',
    address: '1951 Alaskan Way, Seattle, WA 98101',
    description: 'Pacific Northwest artisan gathering along Puget Sound featuring glassblowing, woodcraft, specialty espresso bars, indie folk artists, fresh seafood stalls, and indigenous art collectives over a multi-date weekend.',
    dates: ['2026-09-25', '2026-09-26', '2026-09-27'],
    days: ['fri', 'sat', 'sun'],
    hours: '10:00 AM - 7:00 PM',
    vendorTypesAccepted: [...VENDOR_KIND_OPTIONS, 'Music', 'Art', 'Craft', 'Food', 'Commercial'],
    boothPricePerDay: 125,
    totalBoothsCount: 160,
    active: true,
    imageUrl: 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?auto=format&fit=crop&w=900&q=80',
    images: ['https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?auto=format&fit=crop&w=900&q=80'],
    createdAt: '2026-09-14T09:00:00Z',
    updatedAt: '2026-09-19T08:00:00Z'
  },
  {
    id: 'loc-denver-co',
    title: '2026 Denver Mile-High Autumn Artisan Expo',
    stateCode: 'CO',
    stateName: 'Colorado',
    cityName: 'Denver',
    venueName: 'Civic Center Park Promenade',
    address: '101 W 14th Ave, Denver, CO 80204',
    description: 'Outdoor Rocky Mountain showcase of fine pottery, mountain gear crafters, local micro-distillers, bluegrass bands, and gourmet food trucks under golden autumn foliage.',
    dates: ['2026-10-16', '2026-10-17', '2026-10-18'],
    days: ['fri', 'sat', 'sun'],
    hours: '10:00 AM - 6:00 PM',
    vendorTypesAccepted: [...VENDOR_KIND_OPTIONS, 'Music', 'Art', 'Craft', 'Food', 'Commercial'],
    boothPricePerDay: 95,
    totalBoothsCount: 175,
    active: true,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
    images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80'],
    createdAt: '2026-09-14T10:00:00Z',
    updatedAt: '2026-09-19T08:00:00Z'
  },
  {
    id: 'loc-nashville-tn',
    title: '2026 Nashville Music City Artisan & Sound Showcase',
    stateCode: 'TN',
    stateName: 'Tennessee',
    cityName: 'Nashville',
    venueName: 'Riverfront Park & Lower Broadway Commons',
    address: '100 1st Ave N, Nashville, TN 37201',
    description: 'Nashville celebration featuring live country and soul performances, handcrafted leather goods, custom instrument makers, Nashville hot chicken masters, and regional craft distilleries.',
    dates: ['2026-10-23', '2026-10-24', '2026-10-25'],
    days: ['fri', 'sat', 'sun'],
    hours: '11:00 AM - 9:00 PM',
    vendorTypesAccepted: [...VENDOR_KIND_OPTIONS, 'Music', 'Art', 'Craft', 'Food', 'Commercial'],
    boothPricePerDay: 105,
    totalBoothsCount: 210,
    active: true,
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=80',
    images: ['https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=80'],
    createdAt: '2026-09-14T12:00:00Z',
    updatedAt: '2026-09-19T08:00:00Z'
  },
  {
    id: 'loc-chicago-il',
    title: '2026 Chicago Lakefront Artisan Showcase',
    stateCode: 'IL',
    stateName: 'Illinois',
    cityName: 'Chicago',
    venueName: 'Grant Park South Grove',
    address: '337 E Randolph St, Chicago, IL 60601',
    description: 'Premier Midwestern arts and craft market with views of Lake Michigan and the skyline. Over 200 vendors, jazz and blues stages, craft brewers, and local bakers.',
    dates: ['2026-10-02', '2026-10-03', '2026-10-04'],
    days: ['fri', 'sat', 'sun'],
    hours: '10:00 AM - 6:30 PM',
    vendorTypesAccepted: [...VENDOR_KIND_OPTIONS, 'Music', 'Art', 'Craft', 'Food', 'Commercial'],
    boothPricePerDay: 120,
    totalBoothsCount: 220,
    active: true,
    imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80',
    images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80'],
    createdAt: '2026-09-15T08:00:00Z',
    updatedAt: '2026-09-19T08:00:00Z'
  }
];

const LOCATIONS_CACHE_KEY = 'columbia_event_locations_cache_v3';
const CITIES_CACHE_KEY = 'columbia_custom_cities_cache_v1';

const DEFAULT_LOCATIONS_BY_ID = new Map<string, EventLocationMarket>(
  DEFAULT_EVENT_LOCATIONS.map((loc) => [loc.id, loc])
);

function enrichWithDefaultImages(loc: EventLocationMarket): EventLocationMarket {
  const def = DEFAULT_LOCATIONS_BY_ID.get(loc.id);
  if (!def) return loc;
  return {
    ...loc,
    imageUrl: loc.imageUrl || def.imageUrl,
    images: loc.images && loc.images.length > 0 ? loc.images : def.images,
    sourceUrl: loc.sourceUrl || def.sourceUrl,
    importedFrom: loc.importedFrom || def.importedFrom,
  };
}

// Format date nicely e.g. "2026-10-02" -> "Oct 02, 2026"
export function formatEventDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const monthIndex = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      if (months[monthIndex]) {
        return `${months[monthIndex]} ${day < 10 ? '0' + day : day}, ${year}`;
      }
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

/**
 * Generate an array of YYYY-MM-DD date strings between startDate and endDate (inclusive)
 * Supports continuous, non-stop events spanning multiple consecutive days.
 */
export function generateDateRangeList(startDate: string, endDate: string): string[] {
  if (!startDate) return [];
  if (!endDate) return [startDate];

  try {
    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T00:00:00');
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
      return [startDate];
    }

    const dates: string[] = [];
    const current = new Date(start);
    let count = 0;
    // Cap at 60 days to prevent excessive loops
    while (current <= end && count < 60) {
      const y = current.getFullYear();
      const m = String(current.getMonth() + 1).padStart(2, '0');
      const d = String(current.getDate()).padStart(2, '0');
      dates.push(`${y}-${m}-${d}`);
      current.setDate(current.getDate() + 1);
      count++;
    }
    return dates;
  } catch {
    return [startDate];
  }
}

/**
 * Formats a date range e.g. "Oct 02, 2026 – Oct 11, 2026 (Non-Stop 10 Days)"
 */
export function formatEventDateRange(startDate?: string, endDate?: string, isNonStop?: boolean): string {
  if (!startDate) return '';
  if (!endDate || startDate === endDate) {
    return `${formatEventDate(startDate)}${isNonStop ? ' (Non-Stop)' : ''}`;
  }

  const daysCount = generateDateRangeList(startDate, endDate).length;
  const tag = isNonStop ? ` (${daysCount} Days Non-Stop)` : ` (${daysCount} Days)`;
  return `${formatEventDate(startDate)} – ${formatEventDate(endDate)}${tag}`;
}

/**
 * Returns all available cities for a given US State code (50 states + DC)
 * Combines top 3 cities, cities over 200k, major cities, and any custom added cities.
 */
export function getCitiesForState(stateCode: string, customCities: CustomCityEntry[] = []): string[] {
  if (!stateCode || stateCode === 'ALL') return [];
  const state = USA_STATES_CITIES_DATA.find(s => s.code.toUpperCase() === stateCode.toUpperCase());
  const set = new Set<string>();

  if (state) {
    if (state.top3Cities) {
      state.top3Cities.forEach(c => set.add(c.name));
    }
    if (state.citiesOver200k) {
      state.citiesOver200k.forEach(c => set.add(c.name));
    }
    if (state.majorCities) {
      state.majorCities.forEach(c => set.add(c));
    }
  }

  // Add custom cities saved for this state
  if (customCities && customCities.length > 0) {
    customCities
      .filter(c => c.stateCode?.toUpperCase() === stateCode.toUpperCase())
      .forEach(c => set.add(c.name));
  }

  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

// -------------------------------------------------------------
// EVENT LOCATIONS CRUD & BULK OPERATIONS
// -------------------------------------------------------------

export function subscribeEventLocations(
  callback: (locations: EventLocationMarket[]) => void
): () => void {
  // 1. Initial cached fallback merged with DEFAULT_EVENT_LOCATIONS
  try {
    const cachedStr = localStorage.getItem(LOCATIONS_CACHE_KEY);
    if (cachedStr) {
      const parsed = JSON.parse(cachedStr);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const existingIds = new Set(parsed.map((l: EventLocationMarket) => l.id));
        const merged = parsed.map(enrichWithDefaultImages);
        for (const def of DEFAULT_EVENT_LOCATIONS) {
          if (!existingIds.has(def.id)) {
            merged.push(def);
          }
        }
        callback(merged);
      } else {
        callback(DEFAULT_EVENT_LOCATIONS);
      }
    } else {
      callback(DEFAULT_EVENT_LOCATIONS);
    }
  } catch {
    callback(DEFAULT_EVENT_LOCATIONS);
  }

  // 2. Firestore real-time listener
  const colRef = collection(db, 'event_locations');
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        // First run or empty, seed defaults
        callback(DEFAULT_EVENT_LOCATIONS);
        return;
      }
      const list: EventLocationMarket[] = [];
      snapshot.forEach((docSnap) => {
        list.push(enrichWithDefaultImages({ id: docSnap.id, ...(docSnap.data() as Omit<EventLocationMarket, 'id'>) }));
      });

      // Merge defaults if specific locations not present
      const existingIds = new Set(list.map(l => l.id));
      const combined = [...list];
      for (const def of DEFAULT_EVENT_LOCATIONS) {
        if (!existingIds.has(def.id)) {
          combined.push(def);
        }
      }

      try {
        localStorage.setItem(LOCATIONS_CACHE_KEY, JSON.stringify(combined));
      } catch {}
      callback(combined);
    },
    (err) => {
      console.warn('Snapshot note for event_locations:', err);
    }
  );
}

/**
 * Imports live and curated events from https://miamifarmersmarket.org/
 * Syncs with both Firestore and local cache.
 */
export async function importEventsFromMiamiFarmersMarket(): Promise<{
  importedCount: number;
  source: string;
  locations: EventLocationMarket[];
}> {
  let eventsToImport: EventLocationMarket[] = [...MIAMI_FARMERS_MARKET_LOCATIONS];

  try {
    const res = await fetch('/api/import-miami-events');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.events) && data.events.length > 0) {
        // Merge live API events with curated Miami Farmers Market dataset
        const byId = new Map<string, EventLocationMarket>();
        for (const item of MIAMI_FARMERS_MARKET_LOCATIONS) {
          byId.set(item.id, item);
        }
        for (const liveItem of data.events) {
          if (liveItem && liveItem.id) {
            const existing = byId.get(liveItem.id);
            if (!existing) {
              byId.set(liveItem.id, liveItem);
            } else {
              byId.set(liveItem.id, {
                ...existing,
                imageUrl: existing.imageUrl || liveItem.imageUrl,
                images: existing.images && existing.images.length > 0 ? existing.images : liveItem.images,
              });
            }
          }
        }
        eventsToImport = Array.from(byId.values());
      }
    }
  } catch (err) {
    console.warn('Live fetch fallback to curated miamifarmersmarket.org dataset:', err);
  }

  // Persist to Firestore & LocalStorage
  await Promise.all(
    eventsToImport.map(async (loc) => {
      try {
        const cleaned = cleanFirestoreData(loc);
        await setDoc(doc(db, 'event_locations', loc.id), cleaned, { merge: true });
      } catch {}
    })
  );

  try {
    const cachedStr = localStorage.getItem(LOCATIONS_CACHE_KEY);
    const current: EventLocationMarket[] = cachedStr ? JSON.parse(cachedStr) : [...DEFAULT_EVENT_LOCATIONS];
    const map = new Map<string, EventLocationMarket>();
    for (const item of eventsToImport) {
      map.set(item.id, item);
    }
    for (const existing of current) {
      if (!map.has(existing.id)) {
        map.set(existing.id, enrichWithDefaultImages(existing));
      }
    }
    const updatedList = Array.from(map.values());
    localStorage.setItem(LOCATIONS_CACHE_KEY, JSON.stringify(updatedList));
  } catch {}

  return {
    importedCount: eventsToImport.length,
    source: 'https://miamifarmersmarket.org/',
    locations: eventsToImport,
  };
}

export async function saveEventLocation(
  location: Partial<EventLocationMarket> & { cityName: string; stateCode: string }
): Promise<EventLocationMarket> {
  const id = location.id || `loc-${location.cityName.toLowerCase().replace(/[^a-z0-9]/g, '')}-${location.stateCode.toLowerCase()}-${Date.now().toString(36)}`;
  
  const fullItem: EventLocationMarket = {
    id,
    title: location.title || `2026 ${location.cityName} First Fridays & Artisan Market`,
    stateCode: location.stateCode.toUpperCase(),
    stateName: location.stateName || location.stateCode,
    cityName: location.cityName,
    venueName: location.venueName || 'Downtown Arts District',
    address: location.address || '',
    zipCode: location.zipCode || '',
    mapUrl: location.mapUrl || '',
    description: location.description || `${location.cityName} Artisan and Community Marketplace featuring maker vendors, fine art exhibitors, food trucks, and live entertainment.`,
    dates: location.dates && location.dates.length > 0 ? location.dates : ['2026-10-02'],
    startDate: location.startDate,
    endDate: location.endDate,
    isNonStop: location.isNonStop,
    days: location.days && location.days.length > 0 ? location.days : ['fri', 'sat'],
    hours: location.hours || '10:00 AM - 6:00 PM',
    vendorTypesAccepted: location.vendorTypesAccepted && location.vendorTypesAccepted.length > 0 
      ? location.vendorTypesAccepted 
      : [...VENDOR_KIND_OPTIONS, 'Music', 'Art', 'Craft', 'Food', 'Commercial'],
    boothPricePerDay: location.boothPricePerDay || 75,
    totalBoothsCount: location.totalBoothsCount || 100,
    active: location.active !== undefined ? location.active : true,
    imageUrl: location.imageUrl || '',
    images: location.images || (location.imageUrl ? [location.imageUrl] : []),
    sourceUrl: location.sourceUrl,
    importedFrom: location.importedFrom,
    createdAt: location.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const cleaned = cleanFirestoreData(fullItem);

  try {
    await setDoc(doc(db, 'event_locations', id), cleaned, { merge: true });
  } catch (err) {
    console.warn('Could not write to Firestore event_locations, caching locally:', err);
  }

  // Update local cache
  try {
    const cachedStr = localStorage.getItem(LOCATIONS_CACHE_KEY);
    const list: EventLocationMarket[] = cachedStr ? JSON.parse(cachedStr) : [...DEFAULT_EVENT_LOCATIONS];
    const index = list.findIndex(l => l.id === id);
    if (index >= 0) {
      list[index] = fullItem;
    } else {
      list.unshift(fullItem);
    }
    localStorage.setItem(LOCATIONS_CACHE_KEY, JSON.stringify(list));
  } catch {}

  return fullItem;
}

export async function deleteEventLocation(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'event_locations', id));
  } catch (err) {
    console.warn('Could not delete from Firestore event_locations:', err);
  }

  try {
    const cachedStr = localStorage.getItem(LOCATIONS_CACHE_KEY);
    if (cachedStr) {
      const list: EventLocationMarket[] = JSON.parse(cachedStr);
      const filtered = list.filter(l => l.id !== id);
      localStorage.setItem(LOCATIONS_CACHE_KEY, JSON.stringify(filtered));
    }
  } catch {}
}

/**
 * BULK EDIT DAYS & DATES
 * Allows admin to edit days / dates across multiple locations simultaneously in bulk
 */
export async function bulkUpdateLocationsDays(
  ids: string[],
  options: {
    actionType: 'replace_days' | 'replace_dates' | 'append_dates' | 'set_both' | 'set_range' | 'toggle_active';
    days?: Array<'fri' | 'sat' | 'sun'>;
    dates?: string[];
    appendDates?: string[];
    startDate?: string;
    endDate?: string;
    isNonStop?: boolean;
    active?: boolean;
  }
): Promise<void> {
  if (!ids || ids.length === 0) return;

  const now = new Date().toISOString();

  // 1. Update in local cache
  try {
    const cachedStr = localStorage.getItem(LOCATIONS_CACHE_KEY);
    const list: EventLocationMarket[] = cachedStr ? JSON.parse(cachedStr) : [...DEFAULT_EVENT_LOCATIONS];
    
    for (const item of list) {
      if (ids.includes(item.id)) {
        if (options.actionType === 'replace_days' && options.days) {
          item.days = [...options.days];
        } else if (options.actionType === 'replace_dates' && options.dates) {
          item.dates = [...options.dates].sort();
        } else if (options.actionType === 'set_range' && options.startDate && options.endDate) {
          item.startDate = options.startDate;
          item.endDate = options.endDate;
          item.isNonStop = options.isNonStop ?? true;
          item.dates = generateDateRangeList(options.startDate, options.endDate);
        } else if (options.actionType === 'append_dates' && options.appendDates) {
          const merged = Array.from(new Set([...item.dates, ...options.appendDates])).sort();
          item.dates = merged;
        } else if (options.actionType === 'set_both') {
          if (options.days) item.days = [...options.days];
          if (options.dates) item.dates = [...options.dates].sort();
          if (options.startDate) item.startDate = options.startDate;
          if (options.endDate) item.endDate = options.endDate;
          if (options.isNonStop !== undefined) item.isNonStop = options.isNonStop;
        } else if (options.actionType === 'toggle_active' && options.active !== undefined) {
          item.active = options.active;
        }
        item.updatedAt = now;
      }
    }
    localStorage.setItem(LOCATIONS_CACHE_KEY, JSON.stringify(list));
  } catch {}

  // 2. Update Firestore documents
  await Promise.all(
    ids.map(async (id) => {
      try {
        const updatePayload: Record<string, any> = { updatedAt: now };
        if ((options.actionType === 'replace_days' || options.actionType === 'set_both') && options.days) {
          updatePayload.days = options.days;
        }
        if ((options.actionType === 'replace_dates' || options.actionType === 'set_both') && options.dates) {
          updatePayload.dates = options.dates;
        }
        if (options.actionType === 'set_range' && options.startDate && options.endDate) {
          updatePayload.startDate = options.startDate;
          updatePayload.endDate = options.endDate;
          updatePayload.isNonStop = options.isNonStop ?? true;
          updatePayload.dates = generateDateRangeList(options.startDate, options.endDate);
        }
        if (options.startDate) updatePayload.startDate = options.startDate;
        if (options.endDate) updatePayload.endDate = options.endDate;
        if (options.isNonStop !== undefined) updatePayload.isNonStop = options.isNonStop;
        if (options.actionType === 'toggle_active' && options.active !== undefined) {
          updatePayload.active = options.active;
        }

        const cleaned = cleanFirestoreData(updatePayload);
        await updateDoc(doc(db, 'event_locations', id), cleaned);
      } catch (err) {
        console.warn(`Firestore bulk update note for ${id}:`, err);
      }
    })
  );
}

// -------------------------------------------------------------
// CUSTOM CITIES MANAGEMENT
// -------------------------------------------------------------

export function subscribeCustomCities(
  callback: (cities: CustomCityEntry[]) => void
): () => void {
  try {
    const cached = localStorage.getItem(CITIES_CACHE_KEY);
    if (cached) {
      callback(JSON.parse(cached));
    } else {
      callback([]);
    }
  } catch {
    callback([]);
  }

  const colRef = collection(db, 'custom_cities');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: CustomCityEntry[] = [];
      snapshot.forEach(d => {
        list.push({ id: d.id, ...(d.data() as Omit<CustomCityEntry, 'id'>) });
      });
      try {
        localStorage.setItem(CITIES_CACHE_KEY, JSON.stringify(list));
      } catch {}
      callback(list);
    },
    (err) => {
      console.warn('Snapshot custom_cities note:', err);
    }
  );
}

export async function saveCustomCity(city: CustomCityEntry): Promise<void> {
  const cleaned = cleanFirestoreData(city);
  try {
    await setDoc(doc(db, 'custom_cities', city.id), cleaned, { merge: true });
  } catch (err) {
    console.warn('Could not save custom_cities to Firestore:', err);
  }

  try {
    const cached = localStorage.getItem(CITIES_CACHE_KEY);
    const list: CustomCityEntry[] = cached ? JSON.parse(cached) : [];
    const idx = list.findIndex(c => c.id === city.id);
    if (idx >= 0) {
      list[idx] = city;
    } else {
      list.push(city);
    }
    localStorage.setItem(CITIES_CACHE_KEY, JSON.stringify(list));
  } catch {}
}

export async function deleteCustomCity(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'custom_cities', id));
  } catch (err) {
    console.warn('Could not delete custom_cities from Firestore:', err);
  }

  try {
    const cached = localStorage.getItem(CITIES_CACHE_KEY);
    if (cached) {
      const list: CustomCityEntry[] = JSON.parse(cached);
      const filtered = list.filter(c => c.id !== id);
      localStorage.setItem(CITIES_CACHE_KEY, JSON.stringify(filtered));
    }
  } catch {}
}
