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
import { EventLocationMarket, CustomCityEntry } from '../types';

export const DEFAULT_EVENT_LOCATIONS: EventLocationMarket[] = [
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
    vendorTypesAccepted: ['Music', 'Art', 'Craft', 'Food', 'Commercial'],
    boothPricePerDay: 75,
    totalBoothsCount: 180,
    active: true,
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
    vendorTypesAccepted: ['Music', 'Art', 'Craft', 'Food', 'Commercial'],
    boothPricePerDay: 65,
    totalBoothsCount: 95,
    active: true,
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
    vendorTypesAccepted: ['Music', 'Art', 'Craft', 'Food', 'Commercial'],
    boothPricePerDay: 110,
    totalBoothsCount: 260,
    active: true,
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
    vendorTypesAccepted: ['Music', 'Art', 'Craft', 'Food', 'Commercial'],
    boothPricePerDay: 125,
    totalBoothsCount: 160,
    active: true,
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
    vendorTypesAccepted: ['Music', 'Art', 'Craft', 'Food', 'Commercial'],
    boothPricePerDay: 95,
    totalBoothsCount: 175,
    active: true,
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
    vendorTypesAccepted: ['Music', 'Art', 'Craft', 'Food', 'Commercial'],
    boothPricePerDay: 105,
    totalBoothsCount: 210,
    active: true,
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
    vendorTypesAccepted: ['Music', 'Art', 'Craft', 'Food', 'Commercial'],
    boothPricePerDay: 120,
    totalBoothsCount: 220,
    active: true,
    createdAt: '2026-09-15T08:00:00Z',
    updatedAt: '2026-09-19T08:00:00Z'
  }
];

const LOCATIONS_CACHE_KEY = 'columbia_event_locations_cache_v1';
const CITIES_CACHE_KEY = 'columbia_custom_cities_cache_v1';

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

// -------------------------------------------------------------
// EVENT LOCATIONS CRUD & BULK OPERATIONS
// -------------------------------------------------------------

export function subscribeEventLocations(
  callback: (locations: EventLocationMarket[]) => void
): () => void {
  // 1. Initial cached fallback
  try {
    const cachedStr = localStorage.getItem(LOCATIONS_CACHE_KEY);
    if (cachedStr) {
      const parsed = JSON.parse(cachedStr);
      if (Array.isArray(parsed) && parsed.length > 0) {
        callback(parsed);
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
        list.push({ id: docSnap.id, ...(docSnap.data() as Omit<EventLocationMarket, 'id'>) });
      });

      // Merge defaults if specific states not present
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
    description: location.description || `${location.cityName} Artisan and Community Marketplace featuring maker vendors, fine art exhibitors, food trucks, and live entertainment.`,
    dates: location.dates && location.dates.length > 0 ? location.dates : ['2026-10-02'],
    days: location.days && location.days.length > 0 ? location.days : ['fri', 'sat'],
    hours: location.hours || '10:00 AM - 6:00 PM',
    vendorTypesAccepted: location.vendorTypesAccepted && location.vendorTypesAccepted.length > 0 
      ? location.vendorTypesAccepted 
      : ['Music', 'Art', 'Craft', 'Food', 'Commercial'],
    boothPricePerDay: location.boothPricePerDay || 75,
    totalBoothsCount: location.totalBoothsCount || 100,
    active: location.active !== undefined ? location.active : true,
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
    actionType: 'replace_days' | 'replace_dates' | 'append_dates' | 'set_both' | 'toggle_active';
    days?: Array<'fri' | 'sat' | 'sun'>;
    dates?: string[];
    appendDates?: string[];
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
        } else if (options.actionType === 'append_dates' && options.appendDates) {
          const merged = Array.from(new Set([...item.dates, ...options.appendDates])).sort();
          item.dates = merged;
        } else if (options.actionType === 'set_both') {
          if (options.days) item.days = [...options.days];
          if (options.dates) item.dates = [...options.dates].sort();
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
