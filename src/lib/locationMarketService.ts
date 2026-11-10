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
import { EventLocationMarket, CustomCityEntry, ScheduleEvent, VENDOR_KIND_OPTIONS } from '../types';
import { USA_STATES_CITIES_DATA } from '../data/usaStatesCitiesData';
import { MIAMI_FARMERS_MARKET_LOCATIONS } from '../data/miamiFarmersMarketEvents';
import { NATIONWIDE_100_STATE_EVENTS } from '../data/nationwide100Events';
import { SCHEDULE_EVENTS } from '../data/festivalData';

// Legacy upcoming IDs from earlier seeds that are superseded by the 100-event 50-state schedule
const LEGACY_SUPERSEDED_LOCATION_IDS = new Set([
  'loc-columbia-sc',
  'loc-houston-tx',
  'loc-denver-co',
  'loc-nashville-tn',
  'loc-chicago-il',
  'mfm-giralda-plaza-artisan-market',
  'mfm-waterford-business-district-marketplace',
  'mfm-nikki-beach-miami-beach',
  'mfm-doral-run-club-market',
  'mfm-winter-kiddos-land-bayside',
  'mfm-paws-on-patio-fort-lauderdale',
  'mfm-flagler-beach-art-craft-festival',
  'mfm-west-ashley-farmers-market-charleston',
  'mfm-annapolis-holiday-market',
  'mfm-ravenswood-autumn-vintage-artisan-market',
  'mfm-flea-harveys-dallas-market',
]);

// Past events from earlier in 2026 kept in default list so Admin Past Events Notification can Reschedule or Bulk Delete them
const INITIAL_PAST_EVENT_LOCATIONS: EventLocationMarket[] = MIAMI_FARMERS_MARKET_LOCATIONS.filter(
  (loc) => !LEGACY_SUPERSEDED_LOCATION_IDS.has(loc.id)
);

export const DEFAULT_EVENT_LOCATIONS: EventLocationMarket[] = [
  ...NATIONWIDE_100_STATE_EVENTS,
  ...INITIAL_PAST_EVENT_LOCATIONS,
];

const LOCATIONS_CACHE_KEY = 'columbia_event_locations_cache_v6_100events';
const DELETED_LOCATIONS_KEY = 'columbia_deleted_location_ids_v1';
const CITIES_CACHE_KEY = 'columbia_custom_cities_cache_v1';
const SCHEDULE_EVENTS_CACHE_KEY = 'columbia_admin_schedule_events_v2';
const DELETED_SCHEDULE_EVENTS_KEY = 'columbia_deleted_schedule_event_ids_v1';

const DEFAULT_LOCATIONS_BY_ID = new Map<string, EventLocationMarket>(
  DEFAULT_EVENT_LOCATIONS.map((loc) => [loc.id, loc])
);

const locationSubscribers = new Set<(locations: EventLocationMarket[]) => void>();
const scheduleEventSubscribers = new Set<(events: ScheduleEvent[]) => void>();

function getDeletedLocationIds(): Set<string> {
  try {
    const raw = localStorage.getItem(DELETED_LOCATIONS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return new Set(parsed);
    }
  } catch {}
  return new Set();
}

function addDeletedLocationIds(ids: string[]): void {
  try {
    const current = getDeletedLocationIds();
    ids.forEach((id) => current.add(id));
    localStorage.setItem(DELETED_LOCATIONS_KEY, JSON.stringify(Array.from(current)));
  } catch {}
}

function removeDeletedLocationIds(ids: string[]): void {
  try {
    const current = getDeletedLocationIds();
    ids.forEach((id) => current.delete(id));
    localStorage.setItem(DELETED_LOCATIONS_KEY, JSON.stringify(Array.from(current)));
  } catch {}
}

function notifyLocationSubscribers(list: EventLocationMarket[]): void {
  locationSubscribers.forEach((cb) => {
    try {
      cb(list);
    } catch {}
  });
}

/**
 * Returns today's local date in YYYY-MM-DD format
 */
export function getTodayDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Determines whether an EventLocationMarket has completely passed (all scheduled dates < today).
 * Events with at least one date today or in the future return false.
 */
export function isEventLocationInPast(
  loc: EventLocationMarket,
  todayStr: string = getTodayDateString()
): boolean {
  const allDates: string[] = [];
  if (Array.isArray(loc.dates)) {
    for (const d of loc.dates) {
      if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d.trim())) {
        allDates.push(d.trim());
      }
    }
  }
  if (typeof loc.endDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(loc.endDate.trim())) {
    allDates.push(loc.endDate.trim());
  }
  if (typeof loc.startDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(loc.startDate.trim())) {
    allDates.push(loc.startDate.trim());
  }

  if (allDates.length === 0) return false;
  return allDates.every((d) => d < todayStr);
}

/**
 * Returns only the upcoming (>= today) dates for an event if available;
 * falls back to the original list if all dates are in the past.
 */
export function getUpcomingEventDates(
  dates: string[] = [],
  todayStr: string = getTodayDateString()
): string[] {
  if (!Array.isArray(dates) || dates.length === 0) return [];
  const upcoming = dates.filter((d) => d >= todayStr);
  return upcoming.length > 0 ? upcoming : dates;
}

/**
 * Determines whether a ScheduleEvent has explicit dates that are all in the past (< today).
 */
export function isScheduleEventInPast(
  evt: ScheduleEvent,
  todayStr: string = getTodayDateString()
): boolean {
  if (!Array.isArray(evt.dates) || evt.dates.length === 0) return false;
  const validDates = evt.dates.filter((d) => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d.trim()));
  if (validDates.length === 0) return false;
  return validDates.every((d) => d < todayStr);
}

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
  locationSubscribers.add(callback);
  const deletedIds = getDeletedLocationIds();

  // 1. Initial cached fallback merged with DEFAULT_EVENT_LOCATIONS (excluding deleted & legacy superseded IDs)
  try {
    const cachedStr = localStorage.getItem(LOCATIONS_CACHE_KEY);
    if (cachedStr) {
      const parsed = JSON.parse(cachedStr);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const filteredParsed = parsed.filter(
          (l: EventLocationMarket) => !deletedIds.has(l.id) && !LEGACY_SUPERSEDED_LOCATION_IDS.has(l.id)
        );
        const existingIds = new Set(filteredParsed.map((l: EventLocationMarket) => l.id));
        const merged = filteredParsed.map(enrichWithDefaultImages);
        for (const def of DEFAULT_EVENT_LOCATIONS) {
          if (!existingIds.has(def.id) && !deletedIds.has(def.id)) {
            merged.push(def);
          }
        }
        callback(merged);
      } else {
        callback(DEFAULT_EVENT_LOCATIONS.filter((d) => !deletedIds.has(d.id)));
      }
    } else {
      callback(DEFAULT_EVENT_LOCATIONS.filter((d) => !deletedIds.has(d.id)));
    }
  } catch {
    callback(DEFAULT_EVENT_LOCATIONS.filter((d) => !deletedIds.has(d.id)));
  }

  // 2. Firestore real-time listener
  const colRef = collection(db, 'event_locations');
  const unsubFirestore = onSnapshot(
    colRef,
    (snapshot) => {
      const currentDeletedIds = getDeletedLocationIds();
      if (snapshot.empty) {
        const seeded = DEFAULT_EVENT_LOCATIONS.filter((d) => !currentDeletedIds.has(d.id));
        callback(seeded);
        return;
      }
      const list: EventLocationMarket[] = [];
      snapshot.forEach((docSnap) => {
        if (!currentDeletedIds.has(docSnap.id) && !LEGACY_SUPERSEDED_LOCATION_IDS.has(docSnap.id)) {
          list.push(enrichWithDefaultImages({ id: docSnap.id, ...(docSnap.data() as Omit<EventLocationMarket, 'id'>) }));
        }
      });

      // Merge defaults if specific locations not present and not deleted
      const existingIds = new Set(list.map(l => l.id));
      const combined = [...list];
      for (const def of DEFAULT_EVENT_LOCATIONS) {
        if (!existingIds.has(def.id) && !currentDeletedIds.has(def.id)) {
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

  return () => {
    locationSubscribers.delete(callback);
    unsubFirestore();
  };
}

/**
 * Generates and syncs all 100 Nationwide US State Events (50 states × 2 major cities:
 * Dec 18–20, 2026 Fri–Sun & Jan 29–31, 2027 Fri–Sun) to Firestore & local cache.
 */
export async function syncAll100NationwideEventsToFirestore(): Promise<{
  syncedCount: number;
  locations: EventLocationMarket[];
}> {
  const all100 = [...NATIONWIDE_100_STATE_EVENTS];
  removeDeletedLocationIds(all100.map((e) => e.id));

  try {
    const deletedIds = getDeletedLocationIds();
    const cachedStr = localStorage.getItem(LOCATIONS_CACHE_KEY);
    const current: EventLocationMarket[] = cachedStr ? JSON.parse(cachedStr) : [...DEFAULT_EVENT_LOCATIONS];
    const map = new Map<string, EventLocationMarket>();
    for (const item of all100) {
      map.set(item.id, item);
    }
    for (const existing of current) {
      if (!map.has(existing.id) && !deletedIds.has(existing.id) && !LEGACY_SUPERSEDED_LOCATION_IDS.has(existing.id)) {
        map.set(existing.id, enrichWithDefaultImages(existing));
      }
    }
    const updatedList = Array.from(map.values());
    localStorage.setItem(LOCATIONS_CACHE_KEY, JSON.stringify(updatedList));
    notifyLocationSubscribers(updatedList);
  } catch {}

  await Promise.all(
    all100.map(async (loc) => {
      try {
        const cleaned = cleanFirestoreData(loc);
        await setDoc(doc(db, 'event_locations', loc.id), cleaned, { merge: true });
      } catch {}
    })
  );

  return {
    syncedCount: all100.length,
    locations: all100,
  };
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

  // Remove imported IDs from deleted list when explicitly re-imported
  removeDeletedLocationIds(eventsToImport.map((e) => e.id));

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
    const deletedIds = getDeletedLocationIds();
    const cachedStr = localStorage.getItem(LOCATIONS_CACHE_KEY);
    const current: EventLocationMarket[] = cachedStr ? JSON.parse(cachedStr) : [...DEFAULT_EVENT_LOCATIONS];
    const map = new Map<string, EventLocationMarket>();
    for (const item of eventsToImport) {
      map.set(item.id, item);
    }
    for (const existing of current) {
      if (!map.has(existing.id) && !deletedIds.has(existing.id)) {
        map.set(existing.id, enrichWithDefaultImages(existing));
      }
    }
    const updatedList = Array.from(map.values());
    localStorage.setItem(LOCATIONS_CACHE_KEY, JSON.stringify(updatedList));
    notifyLocationSubscribers(updatedList);
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
  removeDeletedLocationIds([id]);
  
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
    dates: location.dates && location.dates.length > 0 ? location.dates : ['2026-12-18', '2026-12-19', '2026-12-20'],
    startDate: location.startDate,
    endDate: location.endDate,
    isNonStop: location.isNonStop,
    days: location.days && location.days.length > 0 ? location.days : ['fri', 'sat', 'sun'],
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
    const deletedIds = getDeletedLocationIds();
    const cachedStr = localStorage.getItem(LOCATIONS_CACHE_KEY);
    const list: EventLocationMarket[] = cachedStr
      ? JSON.parse(cachedStr).filter((l: EventLocationMarket) => !deletedIds.has(l.id))
      : DEFAULT_EVENT_LOCATIONS.filter((l) => !deletedIds.has(l.id));
    const index = list.findIndex(l => l.id === id);
    if (index >= 0) {
      list[index] = fullItem;
    } else {
      list.unshift(fullItem);
    }
    localStorage.setItem(LOCATIONS_CACHE_KEY, JSON.stringify(list));
    notifyLocationSubscribers(list);
  } catch {}

  return fullItem;
}

export async function deleteEventLocation(id: string): Promise<void> {
  await bulkDeleteEventLocations([id]);
}

/**
 * Bulk deletes multiple event locations from Firestore and local cache,
 * and records their IDs so seeded defaults are not re-added automatically.
 */
export async function bulkDeleteEventLocations(ids: string[]): Promise<number> {
  if (!ids || ids.length === 0) return 0;
  const idSet = new Set(ids);
  addDeletedLocationIds(ids);

  try {
    const deletedIds = getDeletedLocationIds();
    const cachedStr = localStorage.getItem(LOCATIONS_CACHE_KEY);
    const baseList: EventLocationMarket[] = cachedStr ? JSON.parse(cachedStr) : [...DEFAULT_EVENT_LOCATIONS];
    const filtered = baseList.filter((l) => !idSet.has(l.id) && !deletedIds.has(l.id));
    localStorage.setItem(LOCATIONS_CACHE_KEY, JSON.stringify(filtered));
    notifyLocationSubscribers(filtered);
  } catch {}

  await Promise.all(
    ids.map(async (id) => {
      try {
        await deleteDoc(doc(db, 'event_locations', id));
      } catch (err) {
        console.warn(`Could not delete ${id} from Firestore event_locations:`, err);
      }
    })
  );

  return ids.length;
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
    const deletedIds = getDeletedLocationIds();
    const cachedStr = localStorage.getItem(LOCATIONS_CACHE_KEY);
    const list: EventLocationMarket[] = (cachedStr ? JSON.parse(cachedStr) : [...DEFAULT_EVENT_LOCATIONS]).filter(
      (item: EventLocationMarket) => !deletedIds.has(item.id)
    );
    
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
    notifyLocationSubscribers(list);
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
// SCHEDULE EVENTS SUBSCRIPTION, BULK DELETE & BULK RESCHEDULE
// -------------------------------------------------------------

function getDeletedScheduleEventIds(): Set<string> {
  try {
    const raw = localStorage.getItem(DELETED_SCHEDULE_EVENTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return new Set(parsed);
    }
  } catch {}
  return new Set();
}

function addDeletedScheduleEventIds(ids: string[]): void {
  try {
    const current = getDeletedScheduleEventIds();
    ids.forEach((id) => current.add(id));
    localStorage.setItem(DELETED_SCHEDULE_EVENTS_KEY, JSON.stringify(Array.from(current)));
  } catch {}
}

export function getInitialScheduleEvents(): ScheduleEvent[] {
  const deletedIds = getDeletedScheduleEventIds();
  try {
    const saved = localStorage.getItem(SCHEDULE_EVENTS_CACHE_KEY);
    if (saved) {
      const parsed: ScheduleEvent[] = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter((e) => !deletedIds.has(e.id));
      }
    }
  } catch {}

  return SCHEDULE_EVENTS.filter((e) => !deletedIds.has(e.id)).map((evt) => ({
    ...evt,
    days: evt.days || [evt.day as 'fri' | 'sat' | 'sun'],
    dates:
      evt.dates && evt.dates.length > 0
        ? evt.dates
        : evt.day === 'fri'
        ? ['2026-12-18']
        : evt.day === 'sat'
        ? ['2026-12-19']
        : ['2026-12-20'],
    locationDescription: evt.locationDescription || 'Festival Pavilion Main Plaza & Stage',
  }));
}

export function subscribeScheduleEvents(
  callback: (events: ScheduleEvent[]) => void
): () => void {
  scheduleEventSubscribers.add(callback);
  callback(getInitialScheduleEvents());
  return () => {
    scheduleEventSubscribers.delete(callback);
  };
}

export function saveScheduleEventsList(events: ScheduleEvent[]): void {
  try {
    localStorage.setItem(SCHEDULE_EVENTS_CACHE_KEY, JSON.stringify(events));
  } catch {}
  scheduleEventSubscribers.forEach((cb) => {
    try {
      cb(events);
    } catch {}
  });
}

export async function bulkDeleteScheduleEvents(ids: string[]): Promise<number> {
  if (!ids || ids.length === 0) return 0;
  const idSet = new Set(ids);
  addDeletedScheduleEventIds(ids);
  const current = getInitialScheduleEvents();
  const filtered = current.filter((e) => !idSet.has(e.id));
  saveScheduleEventsList(filtered);
  return ids.length;
}

export type ReschedulePreset = 'dec_end_week' | 'jan_end_week' | 'both_dec_jan' | 'custom';

/**
 * Bulk reschedules past/selected market locations AND stage schedule events
 * to new upcoming Friday–Saturday–Sunday dates (e.g., Dec 18–20, 2026, Jan 29–31, 2027, both, or custom).
 */
export async function bulkReschedulePastEvents(options: {
  locationIds: string[];
  scheduleIds?: string[];
  preset: ReschedulePreset;
  customStartDate?: string;
  customEndDate?: string;
  days?: Array<'fri' | 'sat' | 'sun'>;
}): Promise<{
  rescheduledLocations: number;
  rescheduledSchedules: number;
  rescheduledLocationsCount: number;
  rescheduledScheduleCount: number;
  datesApplied: string[];
}> {
  const daysToApply: Array<'fri' | 'sat' | 'sun'> =
    options.days && options.days.length > 0 ? options.days : ['fri', 'sat', 'sun'];
  const scheduleIds = options.scheduleIds || [];

  let datesToApply: string[] = ['2026-12-18', '2026-12-19', '2026-12-20'];
  let startDate = '2026-12-18';
  let endDate = '2026-12-20';
  let isNonStop = true;

  if (options.preset === 'dec_end_week') {
    datesToApply = ['2026-12-18', '2026-12-19', '2026-12-20'];
    startDate = '2026-12-18';
    endDate = '2026-12-20';
    isNonStop = true;
  } else if (options.preset === 'jan_end_week') {
    datesToApply = ['2027-01-29', '2027-01-30', '2027-01-31'];
    startDate = '2027-01-29';
    endDate = '2027-01-31';
    isNonStop = true;
  } else if (options.preset === 'both_dec_jan') {
    datesToApply = [
      '2026-12-18',
      '2026-12-19',
      '2026-12-20',
      '2027-01-29',
      '2027-01-30',
      '2027-01-31',
    ];
    startDate = '2026-12-18';
    endDate = '2027-01-31';
    isNonStop = false;
  } else if (options.preset === 'custom') {
    startDate = options.customStartDate || '2026-12-18';
    endDate = options.customEndDate || '2026-12-20';
    datesToApply = generateDateRangeList(startDate, endDate);
    isNonStop = true;
  }

  if (options.locationIds.length > 0) {
    await bulkUpdateLocationsDays(options.locationIds, {
      actionType: 'set_both',
      days: daysToApply,
      dates: datesToApply,
      startDate,
      endDate,
      isNonStop,
    });
  }

  if (scheduleIds.length > 0) {
    const idSet = new Set(scheduleIds);
    const currentSchedule = getInitialScheduleEvents();
    const updatedSchedule = currentSchedule.map((evt) => {
      if (idSet.has(evt.id)) {
        return {
          ...evt,
          days: [...daysToApply],
          day: daysToApply[0] || 'fri',
          dates: [...datesToApply],
        };
      }
      return evt;
    });
    saveScheduleEventsList(updatedSchedule);
  }

  return {
    rescheduledLocations: options.locationIds.length,
    rescheduledSchedules: scheduleIds.length,
    rescheduledLocationsCount: options.locationIds.length,
    rescheduledScheduleCount: scheduleIds.length,
    datesApplied: datesToApply,
  };
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
