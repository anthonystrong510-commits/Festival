import React, { useState, useMemo, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  Building2, 
  FileCheck2, 
  Sparkles, 
  ArrowRight, 
  Filter, 
  Store,
  ChevronDown,
  Globe2,
  ShieldCheck,
  Trophy,
  Users,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  Layers,
  Calendar,
  CalendarDays,
  Clock,
  Music,
  UtensilsCrossed,
  Ticket,
  Download,
  Check,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { USA_STATES_CITIES_DATA, ALL_US_CITIES_OVER_200K, UsaStateMarket, CityPopulationInfo } from '../data/usaStatesCitiesData';
import { SCHEDULE_EVENTS, FESTIVAL_DAYS, EVENT_CONFIG, FESTIVAL_LOCATION } from '../data/festivalData';
import { BoothId, EventLocationMarket, ScheduleEvent, VENDOR_KIND_OPTIONS } from '../types';
import { TypesOfVendorBadge, VENDOR_TYPES, GreenCheckboxIcon } from './TypesOfVendorBadge';
import {
  subscribeEventLocations,
  subscribeScheduleEvents,
  formatEventDate,
  importEventsFromMiamiFarmersMarket,
  isEventLocationInPast,
  isScheduleEventInPast,
  getUpcomingEventDates
} from '../lib/locationMarketService';

interface NationwideVendorDirectoryProps {
  onOpenVendorModal: (boothId?: BoothId, days?: Array<'fri' | 'sat' | 'sun'>) => void;
  onOpenAttendeeModal?: () => void;
}

type EventViewMode = 'all' | 'states' | 'scheduled';
type CategoryFilter = 'all' | 'artisan' | 'food' | 'music' | 'family';

export const NationwideVendorDirectory: React.FC<NationwideVendorDirectoryProps> = ({
  onOpenVendorModal,
  onOpenAttendeeModal
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<EventViewMode>('all');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [selectedDay, setSelectedDay] = useState<'all' | 'fri' | 'sat' | 'sun'>('all');
  const [selectedStateCode, setSelectedStateCode] = useState<string>('ALL');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [expandedStateCode, setExpandedStateCode] = useState<string | null>(null);
  const [selectedCityFilter, setSelectedCityFilter] = useState<string | null>(null);
  const [onlyOver200kFilter, setOnlyOver200kFilter] = useState<boolean>(false);
  const [onlyActiveLocationsFilter, setOnlyActiveLocationsFilter] = useState<boolean>(false);
  const [expandedCitiesStateCode, setExpandedCitiesStateCode] = useState<Record<string, boolean>>({});
  const [selectedVendorTypes, setSelectedVendorTypes] = useState<string[]>([...VENDOR_TYPES]);
  const [eventLocations, setEventLocations] = useState<EventLocationMarket[]>([]);
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>(SCHEDULE_EVENTS);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
  const [showAllStatesDirectory, setShowAllStatesDirectory] = useState<boolean>(false);
  const [isImportingMiami, setIsImportingMiami] = useState<boolean>(false);
  const [miamiSyncNotice, setMiamiSyncNotice] = useState<string | null>(null);
  const [activeImageByLocId, setActiveImageByLocId] = useState<Record<string, string>>({});
  const [weekendFilter, setWeekendFilter] = useState<'ALL' | 'DEC' | 'JAN'>('ALL');
  const [showAll100Events, setShowAll100Events] = useState<boolean>(true);

  // Only show active, non-past event locations to public visitors
  const upcomingEventLocations = useMemo(() => {
    return eventLocations.filter((loc) => loc.active && !isEventLocationInPast(loc));
  }, [eventLocations]);

  const filteredUpcomingEventLocations = useMemo(() => {
    return upcomingEventLocations.filter((loc) => {
      if (selectedStateCode !== 'ALL' && loc.stateCode !== selectedStateCode) return false;
      if (selectedCityFilter && !loc.cityName.toLowerCase().includes(selectedCityFilter.toLowerCase())) return false;
      if (weekendFilter === 'DEC' && !(loc.dates || []).some((d) => d.startsWith('2026-12-'))) return false;
      if (weekendFilter === 'JAN' && !(loc.dates || []).some((d) => d.startsWith('2027-01-'))) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          loc.title.toLowerCase().includes(q) ||
          loc.cityName.toLowerCase().includes(q) ||
          loc.stateName.toLowerCase().includes(q) ||
          loc.stateCode.toLowerCase() === q ||
          loc.venueName.toLowerCase().includes(q) ||
          loc.description.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [upcomingEventLocations, selectedStateCode, selectedCityFilter, weekendFilter, searchQuery]);

  const hiddenPastLocationsCount = useMemo(() => {
    return eventLocations.filter((loc) => isEventLocationInPast(loc)).length;
  }, [eventLocations]);

  const handleSyncMiamiEvents = async () => {
    setIsImportingMiami(true);
    setMiamiSyncNotice(null);
    try {
      const res = await importEventsFromMiamiFarmersMarket();
      setEventLocations((prev) => {
        const byId = new Map<string, EventLocationMarket>();
        for (const loc of res.locations) byId.set(loc.id, loc);
        for (const p of prev) if (!byId.has(p.id)) byId.set(p.id, p);
        return Array.from(byId.values());
      });
      setMiamiSyncNotice(`Synced ${res.importedCount} active events from miamifarmersmarket.org!`);
      setTimeout(() => setMiamiSyncNotice(null), 5000);
    } finally {
      setIsImportingMiami(false);
    }
  };

  const hasLocationFilter = useMemo(() => {
    return Boolean(
      searchQuery.trim().length > 0 ||
      selectedStateCode !== 'ALL' ||
      selectedCityFilter !== null ||
      selectedRegion !== 'All' ||
      onlyOver200kFilter ||
      onlyActiveLocationsFilter
    );
  }, [searchQuery, selectedStateCode, selectedCityFilter, selectedRegion, onlyOver200kFilter, onlyActiveLocationsFilter]);

  useEffect(() => {
    const unsubLocs = subscribeEventLocations((locs) => {
      setEventLocations(locs);
    });
    const unsubSch = subscribeScheduleEvents((evts) => {
      setScheduleEvents(evts);
    });
    return () => {
      unsubLocs();
      unsubSch();
    };
  }, []);

  const handleToggleVendorType = (type: string) => {
    setSelectedVendorTypes((prev) =>
      prev.includes(type)
        ? prev.length > 1 ? prev.filter((t) => t !== type) : prev
        : [...prev, type]
    );
  };

  // Check URL params for initial state or city filter (e.g. ?state=texas or ?city=houston)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const stateParam = params.get('state') || params.get('st');
      const cityParam = params.get('city');
      const over200kParam = params.get('over200k');

      if (over200kParam === 'true' || over200kParam === '1') {
        setOnlyOver200kFilter(true);
      }

      if (stateParam) {
        const found = USA_STATES_CITIES_DATA.find(
          s => s.slug.toLowerCase() === stateParam.toLowerCase() || 
               s.code.toLowerCase() === stateParam.toLowerCase() ||
               s.name.toLowerCase() === stateParam.toLowerCase()
        );
        if (found) {
          setSelectedStateCode(found.code);
          setExpandedStateCode(found.code);
        }
      } else if (cityParam) {
        setSelectedCityFilter(cityParam);
        setSearchQuery(cityParam);
      }
    } catch (e) {
      // ignore in non-browser context
    }
  }, []);

  const regions = useMemo(() => {
    return ['All', 'Southeast', 'Northeast', 'Midwest', 'Southwest', 'West', 'Pacific', 'Mid-Atlantic'];
  }, []);

  // Sorted list of all states for the dropdown filter
  const stateOptions = useMemo(() => {
    return [...USA_STATES_CITIES_DATA].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // Total count of 200k+ cities across all states
  const totalCitiesOver200kCount = useMemo(() => {
    return ALL_US_CITIES_OVER_200K.length;
  }, []);

  // All Scheduled Events enriched with categories (excluding past events)
  const allEnrichedEvents = useMemo(() => {
    return scheduleEvents
      .filter((event) => !isScheduleEventInPast(event))
      .map(event => {
        const isFood = event.type === 'food' || 
                       event.title.toLowerCase().includes('food') || 
                       event.description.toLowerCase().includes('brunch') ||
                       event.description.toLowerCase().includes('treats');

        const isMusic = event.type === 'entertainment' && !event.title.toLowerCase().includes('awards');

        const isArtisan = event.type === 'market' || event.type === 'workshop';

        const isFamily = event.type === 'kids' || event.title.toLowerCase().includes('family') || event.title.toLowerCase().includes('community');

        return {
          ...event,
          isFood,
          isMusic,
          isArtisan,
          isFamily,
          dayInfo: FESTIVAL_DAYS.find(d => d.id === event.day)
        };
      });
  }, [scheduleEvents]);

  // Filtered Scheduled Events
  const filteredScheduledEvents = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return allEnrichedEvents.filter(ev => {
      // Day filter
      if (selectedDay !== 'all' && ev.day !== selectedDay) {
        return false;
      }

      // Category filter
      if (selectedCategory === 'food' && !ev.isFood) return false;
      if (selectedCategory === 'music' && !ev.isMusic) return false;
      if (selectedCategory === 'artisan' && !ev.isArtisan) return false;
      if (selectedCategory === 'family' && !ev.isFamily) return false;

      // Free text search
      if (!q) return true;

      const inTitle = ev.title.toLowerCase().includes(q);
      const inDesc = ev.description.toLowerCase().includes(q);
      const inLoc = ev.location.toLowerCase().includes(q);
      const inTime = ev.time.toLowerCase().includes(q);
      const inDay = ev.dayInfo?.dayName.toLowerCase().includes(q) || false;

      return inTitle || inDesc || inLoc || inTime || inDay;
    });
  }, [allEnrichedEvents, searchQuery, selectedCategory, selectedDay]);

  // Filter logic for 50 States & Cities directory
  const filteredStates = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return USA_STATES_CITIES_DATA.filter((state) => {
      // 1. Dropdown State filter
      if (selectedStateCode !== 'ALL' && state.code !== selectedStateCode) {
        return false;
      }

      // 2. Region filter
      const matchesRegion = selectedRegion === 'All' || state.region === selectedRegion;
      if (!matchesRegion) return false;

      // 3. Over 200k filter: only states that have at least one city over 200k
      if (onlyOver200kFilter && state.citiesOver200k.length === 0) {
        return false;
      }

      // 4. Active scheduled locations filter (only upcoming/current events)
      if (onlyActiveLocationsFilter) {
        const hasActiveLocation = upcomingEventLocations.some(l => l.stateCode === state.code);
        if (!hasActiveLocation) return false;
      }

      // 5. City specific pill filter
      if (selectedCityFilter) {
        const cityQ = selectedCityFilter.toLowerCase();
        const matchesTop3 = state.top3Cities.some(c => c.name.toLowerCase().includes(cityQ));
        const matches200k = state.citiesOver200k.some(c => c.name.toLowerCase().includes(cityQ));
        const matchesMajor = state.majorCities.some(c => c.toLowerCase().includes(cityQ));
        if (!matchesTop3 && !matches200k && !matchesMajor) return false;
      }

      // 6. Category filter match against artisan specialties
      if (selectedCategory !== 'all') {
        const catKeywords: Record<CategoryFilter, string[]> = {
          all: [],
          artisan: ['artisan', 'craft', 'pottery', 'jewelry', 'wood', 'leather', 'textile', 'ceramic', 'glass'],
          food: ['culinary', 'food', 'produce', 'maple', 'cheese', 'bbq', 'seafood', 'baking', 'spice'],
          music: ['music', 'instrument', 'acoustic', 'guitar', 'brass', 'stage'],
          family: ['family', 'folk', 'heritage', 'handcrafted', 'decor', 'candles']
        };
        const keywords = catKeywords[selectedCategory] || [];
        const hasCatMatch = state.artisanSpecialties.some(s => 
          keywords.some(k => s.toLowerCase().includes(k))
        ) || state.popularCategories.some(c =>
          keywords.some(k => c.toLowerCase().includes(k))
        );
        if (!hasCatMatch) return false;
      }

      // 7. Free text search
      if (!q) return true;

      const inName = state.name.toLowerCase().includes(q);
      const inCode = state.code.toLowerCase() === q;
      const inSlug = state.slug.toLowerCase().includes(q);
      const inTop3Cities = state.top3Cities.some(c => c.name.toLowerCase().includes(q) || c.population.toLowerCase().includes(q));
      const inCitiesOver200k = state.citiesOver200k.some(c => c.name.toLowerCase().includes(q) || c.population.toLowerCase().includes(q));
      const inMajorCities = state.majorCities.some(c => c.toLowerCase().includes(q));
      const inSpecialties = state.artisanSpecialties.some(s => s.toLowerCase().includes(q));
      const inCategories = state.popularCategories.some(c => c.toLowerCase().includes(q));

      return inName || inCode || inSlug || inTop3Cities || inCitiesOver200k || inMajorCities || inSpecialties || inCategories;
    });
  }, [searchQuery, selectedStateCode, selectedRegion, selectedCityFilter, onlyOver200kFilter, onlyActiveLocationsFilter, selectedCategory, eventLocations]);

  // Find active location or matching city for the search results card
  const matchedLocation = useMemo(() => {
    const rawTarget = selectedCityFilter || (searchQuery.trim().length >= 2 ? searchQuery.trim() : null);
    if (!rawTarget) return null;
    const targetLower = rawTarget.toLowerCase();

    for (const st of USA_STATES_CITIES_DATA) {
      const inTop3 = st.top3Cities.find((c) => c.name.toLowerCase() === targetLower || c.name.toLowerCase().includes(targetLower));
      if (inTop3) return { city: inTop3.name, state: st };

      const in200k = st.citiesOver200k.find((c) => c.name.toLowerCase() === targetLower || c.name.toLowerCase().includes(targetLower));
      if (in200k) return { city: in200k.name, state: st };

      const inMajor = st.majorCities.find((c) => c.toLowerCase() === targetLower || c.toLowerCase().includes(targetLower));
      if (inMajor) return { city: inMajor, state: st };
    }

    if (selectedStateCode !== 'ALL') {
      const st = USA_STATES_CITIES_DATA.find((s) => s.code === selectedStateCode);
      if (st) {
        return { city: st.top3Cities[0]?.name || st.name, state: st };
      }
    }

    return null;
  }, [selectedCityFilter, searchQuery, selectedStateCode]);

  const toggleExpand = (code: string) => {
    setExpandedStateCode(prev => prev === code ? null : code);
  };

  const toggleCitiesExpand = (stateCode: string) => {
    setExpandedCitiesStateCode(prev => ({
      ...prev,
      [stateCode]: !prev[stateCode]
    }));
  };

  const handleCityClick = (cityName: string, stateCode: string) => {
    setSelectedCityFilter(cityName);
    setSelectedStateCode(stateCode);
    setSearchQuery(cityName);
    setExpandedStateCode(stateCode);
    setViewMode('states');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setViewMode('all');
    setSelectedCategory('all');
    setSelectedDay('all');
    setSelectedStateCode('ALL');
    setSelectedRegion('All');
    setSelectedCityFilter(null);
    setOnlyOver200kFilter(false);
    setOnlyActiveLocationsFilter(false);
    setExpandedStateCode(null);
    setShowAllStatesDirectory(false);
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery !== '') count++;
    if (selectedCategory !== 'all') count++;
    if (selectedDay !== 'all') count++;
    if (selectedStateCode !== 'ALL') count++;
    if (selectedRegion !== 'All') count++;
    if (selectedCityFilter !== null) count++;
    if (onlyOver200kFilter) count++;
    if (onlyActiveLocationsFilter) count++;
    return count;
  }, [searchQuery, selectedCategory, selectedDay, selectedStateCode, selectedRegion, selectedCityFilter, onlyOver200kFilter, onlyActiveLocationsFilter]);

  const handleDownloadCalendar = (eventTitle: string, eventTime: string) => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Sky's Events//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:${eventTitle} - ${EVENT_CONFIG.shortName}
DESCRIPTION:Festival Event at ${EVENT_CONFIG.name}. ${FESTIVAL_LOCATION}
LOCATION:${FESTIVAL_LOCATION}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${eventTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section 
      id="events" 
      className="py-16 sm:py-24 bg-white text-[#3D3A30] border-b border-[#E8E2D6] relative scroll-mt-20"
    >
      {/* Anchor alias so #states-directory continues to scroll smoothly */}
      <div id="states-directory" className="absolute -top-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-[#5A5A40] bg-[#F0EBE0] border border-[#E8E2D6]">
            <CalendarDays className="w-3.5 h-3.5 text-[#5A5A40]" />
            Official Events & Nationwide Markets Directory
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif italic font-bold text-[#3D3A30]">
            Events & Nationwide Tour
          </h2>

          <p className="text-[#6B6658] text-base sm:text-lg">
            Discover scheduled festival concerts, artisan showcases, food truck rallies, and explore vendor opportunities across all 50 US States and <strong>{totalCitiesOver200kCount}+ cities over 200,000 population</strong> nationwide.
          </p>
        </div>

        {/* Mobile & Tablet Filter Bar (Visible on < lg) */}
        <div className="lg:hidden bg-[#FAF8F5] rounded-3xl p-4 sm:p-5 border border-[#E8E2D6] shadow-xs mb-6 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A7566]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (selectedCityFilter && e.target.value !== selectedCityFilter) {
                    setSelectedCityFilter(null);
                  }
                }}
                placeholder="Search events, cities, or states..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#E8E2D6] bg-white text-xs text-[#3D3A30] placeholder-[#7A7566] focus:outline-none focus:ring-2 focus:ring-[#5A5A40]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCityFilter(null);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] bg-[#E8E2D6] px-2 py-0.5 rounded-md font-bold text-[#3D3A30]"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className={`px-3 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                mobileFiltersOpen || activeFiltersCount > 0
                  ? 'bg-[#5A5A40] text-white border-[#5A5A40]'
                  : 'bg-white border-[#E8E2D6] text-[#5A5A40]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-white text-[#5A5A40] text-[10px] font-black flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Quick horizontal view mode buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'All Events & Search' },
              { id: 'scheduled', label: 'Festival Stages' },
              { id: 'states', label: 'Search Locations' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setViewMode(tab.id as EventViewMode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                  viewMode === tab.id
                    ? 'bg-[#5A5A40] text-white shadow-xs'
                    : 'bg-white border border-[#E8E2D6] text-[#6B6658]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Expandable Mobile Filter Drawer */}
          {mobileFiltersOpen && (
            <div className="pt-3 border-t border-[#E8E2D6] space-y-4">
              {/* Category Pills */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A7566] block">
                  Category:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', label: 'All Categories' },
                    { id: 'artisan', label: 'Artisan Crafts' },
                    { id: 'food', label: 'Food & Culinary' },
                    { id: 'music', label: 'Live Music' },
                    { id: 'family', label: 'Family & Community' }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id as CategoryFilter)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        selectedCategory === cat.id
                          ? 'bg-[#5A5A40] text-white'
                          : 'bg-white border border-[#E8E2D6] text-[#3D3A30]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* State Dropdown */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A7566] block">
                  US State:
                </label>
                <select
                  value={selectedStateCode}
                  onChange={(e) => {
                    setSelectedStateCode(e.target.value);
                    if (e.target.value !== 'ALL') setExpandedStateCode(e.target.value);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-white text-xs text-[#3D3A30] font-medium"
                >
                  <option value="ALL">All 50 US States & D.C. ({USA_STATES_CITIES_DATA.length})</option>
                  {stateOptions.map(st => (
                    <option key={st.code} value={st.code}>
                      {st.name} ({st.code}) — {st.region}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Toggles */}
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setOnlyOver200kFilter(!onlyOver200kFilter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    onlyOver200kFilter
                      ? 'bg-[#5A5A40] text-white border-[#5A5A40]'
                      : 'bg-white border-[#E8E2D6] text-[#5A5A40]'
                  }`}
                >
                  Cities &gt;200k ({totalCitiesOver200kCount})
                </button>
                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-3 py-1.5 rounded-xl bg-white border border-[#E8E2D6] text-[#5A5A40] text-xs font-bold flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset All</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Responsive Main Layout: Sidebar on Big Screens (`lg:flex`) */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* ============================================================ */}
          {/* DESKTOP SIDEBAR FOR FILTERS (Big screens sticky sidebar)     */}
          {/* ============================================================ */}
          <aside className="hidden lg:block w-80 shrink-0 sticky top-24 self-start bg-[#FAF8F5] rounded-3xl p-6 border border-[#E8E2D6] shadow-sm space-y-6 max-h-[calc(100vh-7rem)] overflow-y-auto">
            
            {/* Sidebar Title & Reset Action */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D6]">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#5A5A40]" />
                <h3 className="font-serif italic font-bold text-lg text-[#3D3A30]">
                  Filter Events
                </h3>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-[#5A5A40] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset ({activeFiltersCount})</span>
                </button>
              )}
            </div>

            {/* 1. Free Text Search Bar */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A7566] block">
                Search Directory:
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A7566]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (selectedCityFilter && e.target.value !== selectedCityFilter) {
                      setSelectedCityFilter(null);
                    }
                  }}
                  placeholder="City, state, music, artisan..."
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-[#E8E2D6] bg-white text-xs text-[#3D3A30] placeholder-[#7A7566] focus:outline-none focus:ring-2 focus:ring-[#5A5A40] transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCityFilter(null);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] bg-[#E8E2D6] hover:bg-[#D4CDBE] px-1.5 py-0.5 rounded text-[#3D3A30] font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* 2. View Mode Tabs */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A7566] block">
                Display View:
              </label>
              <div className="grid grid-cols-1 gap-1.5 bg-white p-1 rounded-2xl border border-[#E8E2D6]">
                {[
                  { id: 'all', label: 'All Events & Search', count: filteredScheduledEvents.length },
                  { id: 'scheduled', label: 'Festival Stage Program', count: filteredScheduledEvents.length },
                  { id: 'states', label: 'Tour Locations (Search)', count: hasLocationFilter ? filteredStates.length : 'Search' },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setViewMode(item.id as EventViewMode)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                      viewMode === item.id
                        ? 'bg-[#5A5A40] text-white shadow-xs'
                        : 'text-[#6B6658] hover:bg-[#FAF8F5] hover:text-[#3D3A30]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      viewMode === item.id ? 'bg-white/20 text-white' : 'bg-[#E8E2D6] text-[#5A5A40]'
                    }`}>
                      {item.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Category Filter */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A7566] block">
                Category:
              </label>
              <div className="space-y-1">
                {[
                  { id: 'all', label: 'All Categories', icon: Sparkles },
                  { id: 'artisan', label: 'Artisan Crafts & Makers', icon: Store },
                  { id: 'food', label: 'Food Trucks & Culinary', icon: UtensilsCrossed },
                  { id: 'music', label: 'Live Concerts & Stages', icon: Music },
                  { id: 'family', label: 'Family & Community', icon: Users },
                ].map(cat => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id as CategoryFilter)}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#5A5A40] text-white shadow-xs font-bold'
                          : 'bg-white border border-[#E8E2D6] text-[#3D3A30] hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. State Select Dropdown */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A7566] block">
                US State:
              </label>
              <div className="relative">
                <select
                  value={selectedStateCode}
                  onChange={(e) => {
                    setSelectedStateCode(e.target.value);
                    if (e.target.value !== 'ALL') {
                      setExpandedStateCode(e.target.value);
                    }
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E8E2D6] bg-white text-xs text-[#3D3A30] font-medium focus:outline-none focus:ring-2 focus:ring-[#5A5A40] transition-all appearance-none cursor-pointer"
                >
                  <option value="ALL">All 50 US States & D.C. ({USA_STATES_CITIES_DATA.length})</option>
                  {stateOptions.map((st) => (
                    <option key={st.code} value={st.code}>
                      {st.name} ({st.code}) — {st.region}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#7A7566] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 5. US Region Filter Chips */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A7566] block">
                US Region:
              </label>
              <div className="flex flex-wrap gap-1">
                {regions.map((region) => (
                  <button
                    key={region}
                    type="button"
                    onClick={() => setSelectedRegion(region)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                      selectedRegion === region
                        ? 'bg-[#5A5A40] text-white shadow-xs'
                        : 'bg-white border border-[#E8E2D6] text-[#5A5A40] hover:bg-[#F0EBE0]'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            {/* 6. Quick Filter Toggles */}
            <div className="space-y-2 pt-2 border-t border-[#E8E2D6]">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A7566] block">
                Market Criteria:
              </label>

              {/* 200k+ Cities Toggle */}
              <button
                type="button"
                onClick={() => setOnlyOver200kFilter(!onlyOver200kFilter)}
                className={`w-full p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                  onlyOver200kFilter
                    ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-xs'
                    : 'bg-white border-[#E8E2D6] text-[#5A5A40] hover:bg-[#FAF8F5]'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Cities &gt;200k Pop</span>
                </span>
                <span className="text-[10px] font-mono font-black">
                  {totalCitiesOver200kCount}
                </span>
              </button>

              {/* Active Scheduled Locations Toggle */}
              <button
                type="button"
                onClick={() => setOnlyActiveLocationsFilter(!onlyActiveLocationsFilter)}
                className={`w-full p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                  onlyActiveLocationsFilter
                    ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-xs'
                    : 'bg-white border-[#E8E2D6] text-[#5A5A40] hover:bg-[#FAF8F5]'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Scheduled Market Tour</span>
                </span>
                <span className="text-[10px] font-mono font-black">
                  {upcomingEventLocations.length}
                </span>
              </button>
            </div>

            {/* 7. Festival Days Selector (When viewing scheduled events) */}
            {(viewMode === 'all' || viewMode === 'scheduled') && (
              <div className="space-y-1.5 pt-2 border-t border-[#E8E2D6]">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A7566] block">
                  Festival Day:
                </label>
                <div className="grid grid-cols-2 gap-1 bg-white p-1 rounded-xl border border-[#E8E2D6]">
                  {[
                    { id: 'all', label: 'All 3 Days' },
                    { id: 'fri', label: 'Friday' },
                    { id: 'sat', label: 'Saturday' },
                    { id: 'sun', label: 'Sunday' },
                  ].map(d => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setSelectedDay(d.id as any)}
                      className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedDay === d.id
                          ? 'bg-[#5A5A40] text-white shadow-xs'
                          : 'text-[#6B6658] hover:text-[#3D3A30] hover:bg-[#FAF8F5]'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 8. Types of Vendor Checkbox Filters */}
            <div className="space-y-1.5 pt-2 border-t border-[#E8E2D6]">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A7566] block">
                Types of Vendor Accepted:
              </label>
              <div className="space-y-1 bg-white p-2 rounded-xl border border-[#E8E2D6]">
                {VENDOR_TYPES.map(type => {
                  const isChecked = selectedVendorTypes.includes(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleToggleVendorType(type)}
                      className="w-full flex items-center justify-between text-xs py-1 px-1.5 rounded hover:bg-[#FAF8F5] transition-colors text-left"
                    >
                      <span className="text-[#3D3A30] font-medium">{type}</span>
                      <GreenCheckboxIcon checked={isChecked} className="w-3.5 h-3.5" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reset Button at bottom of sidebar */}
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="w-full py-2.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E8E2D6] text-[#5A5A40] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            )}

          </aside>

          {/* ============================================================ */}
          {/* MAIN CONTENT AREA (Events List & States Grid)                */}
          {/* ============================================================ */}
          <div className="flex-1 min-w-0 space-y-8">
            
            {/* Active Filters Summary Strip */}
            <div className="bg-[#FAF8F5] rounded-2xl p-3.5 sm:p-4 border border-[#E8E2D6] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-[#3D3A30]">
                  Results:
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white border border-[#E8E2D6] text-[#5A5A40] font-semibold">
                  {filteredStates.length} States
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white border border-[#E8E2D6] text-[#5A5A40] font-semibold">
                  {filteredScheduledEvents.length} Scheduled Stages
                </span>
                {selectedCityFilter && (
                  <span className="px-2.5 py-1 rounded-lg bg-[#5A5A40] text-white font-bold flex items-center gap-1">
                    <span>City: {selectedCityFilter}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCityFilter(null);
                        setSearchQuery('');
                      }}
                      className="ml-1 hover:text-red-200"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedStateCode !== 'ALL' && (
                  <span className="px-2.5 py-1 rounded-lg bg-[#5A5A40] text-white font-bold flex items-center gap-1">
                    <span>State: {selectedStateCode}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedStateCode('ALL')}
                      className="ml-1 hover:text-red-200"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedRegion !== 'All' && (
                  <span className="px-2.5 py-1 rounded-lg bg-[#5A5A40] text-white font-bold flex items-center gap-1">
                    <span>Region: {selectedRegion}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedRegion('All')}
                      className="ml-1 hover:text-red-200"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedCategory !== 'all' && (
                  <span className="px-2.5 py-1 rounded-lg bg-[#5A5A40] text-white font-bold flex items-center gap-1">
                    <span className="capitalize">{selectedCategory}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('all')}
                      className="ml-1 hover:text-red-200"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>

              {/* View mode toggle for quick desktop switching */}
              <div className="hidden sm:flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E8E2D6]">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'scheduled', label: 'Stages' },
                  { id: 'states', label: 'Locations' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setViewMode(tab.id as EventViewMode)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      viewMode === tab.id
                        ? 'bg-[#5A5A40] text-white'
                        : 'text-[#6B6658] hover:text-[#3D3A30]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Popular Metropolitan City Filter Pills */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#7A7566] font-bold flex items-center gap-1">
                  <Globe2 className="w-3.5 h-3.5 text-[#5A5A40]" />
                  <span>Popular Metropolitan Markets:</span>
                </span>
                <span className="text-[11px] text-[#7A7566]">
                  Click city to filter state & dates
                </span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {[
                  { label: 'Miami, FL (Farmers Markets)', city: 'Miami', state: 'FL' },
                  { label: 'Miami Beach, FL', city: 'Miami Beach', state: 'FL' },
                  { label: 'Coral Gables, FL', city: 'Coral Gables', state: 'FL' },
                  { label: 'Houston, TX (2.3M)', city: 'Houston', state: 'TX' },
                  { label: 'Los Angeles, CA (3.8M)', city: 'Los Angeles', state: 'CA' },
                  { label: 'Chicago, IL (2.6M)', city: 'Chicago', state: 'IL' },
                  { label: 'New York City, NY (8.2M)', city: 'New York City', state: 'NY' },
                  { label: 'Dallas, TX (1.3M)', city: 'Dallas', state: 'TX' },
                  { label: 'Atlanta, GA (500k)', city: 'Atlanta', state: 'GA' },
                  { label: 'Charlotte, NC (911k)', city: 'Charlotte', state: 'NC' },
                  { label: 'Seattle, WA (755k)', city: 'Seattle', state: 'WA' },
                  { label: 'Denver, CO (713k)', city: 'Denver', state: 'CO' },
                  { label: 'Columbia, SC (Host City)', city: 'Columbia', state: 'SC' },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleCityClick(item.city, item.state)}
                    className={`px-3 py-1.5 rounded-xl border whitespace-nowrap font-medium transition-colors cursor-pointer shrink-0 ${
                      selectedCityFilter === item.city
                        ? 'bg-[#5A5A40] text-white border-[#5A5A40]'
                        : 'bg-white border-[#E8E2D6] hover:border-[#5A5A40] text-[#5A5A40]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ============================================================ */}
            {/* 100 NATIONWIDE USA STATE EVENTS (ALL 50 STATES • DEC & JAN)  */}
            {/* ============================================================ */}
            <div className="bg-[#FAF8F5] rounded-3xl p-5 sm:p-6 border border-[#E8E2D6] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E2D6] pb-3.5">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                      <span>All 50 US States • 100 Major City Events • Fri, Sat &amp; Sun</span>
                    </div>
                    {hiddenPastLocationsCount > 0 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#F0EBE0] text-[#5A5A40] border border-[#E8E2D6]">
                        <span>{hiddenPastLocationsCount} past {hiddenPastLocationsCount === 1 ? 'event' : 'events'} auto-hidden</span>
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif italic font-bold text-xl sm:text-2xl text-[#3D3A30]">
                    100 Nationwide State Markets &amp; Street Festivals ({filteredUpcomingEventLocations.length} Showing)
                  </h3>
                  <p className="text-xs text-[#6B6658]">
                    2 premier major-city events in every US state running <strong>Friday, Saturday &amp; Sunday</strong> on the end week of December (<strong>Dec 18–20, 2026</strong>) and the end week of January (<strong>Jan 29–31, 2027</strong>), each with a unique event thumbnail and top city venue.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <button
                    type="button"
                    onClick={handleSyncMiamiEvents}
                    disabled={isImportingMiami}
                    className="px-3.5 py-2 rounded-xl bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer disabled:opacity-60"
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${isImportingMiami ? 'animate-spin' : ''}`} />
                    <span>{isImportingMiami ? 'Importing...' : 'Sync miamifarmersmarket.org'}</span>
                  </button>
                </div>
              </div>

              {/* End-Week Filter Pills (All 100 / Dec 18-20 / Jan 29-31) */}
              <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-3 rounded-2xl border border-[#E8E2D6]">
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setWeekendFilter('ALL')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      weekendFilter === 'ALL'
                        ? 'bg-[#5A5A40] text-white shadow-xs'
                        : 'bg-[#FAF8F5] text-[#6B6658] hover:bg-[#F0EBE0] border border-[#E8E2D6]'
                    }`}
                  >
                    All 100 State Events ({upcomingEventLocations.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setWeekendFilter('DEC')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      weekendFilter === 'DEC'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-[#FAF8F5] text-emerald-900 hover:bg-emerald-50 border border-emerald-200'
                    }`}
                  >
                    Dec 18–20, 2026 • Fri–Sun (50 States)
                  </button>
                  <button
                    type="button"
                    onClick={() => setWeekendFilter('JAN')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      weekendFilter === 'JAN'
                        ? 'bg-indigo-700 text-white shadow-xs'
                        : 'bg-[#FAF8F5] text-indigo-900 hover:bg-indigo-50 border border-indigo-200'
                    }`}
                  >
                    Jan 29–31, 2027 • Fri–Sun (50 States)
                  </button>
                </div>

                {filteredUpcomingEventLocations.length > 16 && (
                  <button
                    type="button"
                    onClick={() => setShowAll100Events((prev) => !prev)}
                    className="text-xs font-bold text-[#5A5A40] hover:underline cursor-pointer"
                  >
                    {showAll100Events
                      ? 'Compact View (Show Top 16)'
                      : `Show All ${filteredUpcomingEventLocations.length} Events`}
                  </button>
                )}
              </div>

              {miamiSyncNotice && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{miamiSyncNotice}</span>
                </div>
              )}

              {/* What Kind Of Vendor Are You? * Summary Strip */}
              <div className="p-3 rounded-2xl bg-white border border-[#E8E2D6]">
                <div className="text-[11px] font-bold text-[#3D3A30] mb-1.5">
                  What Kind Of Vendor Are You? <span className="text-rose-600">*</span> (Accepted at All 100 Nationwide Markets):
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {VENDOR_KIND_OPTIONS.map((kind) => (
                    <span
                      key={kind}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#FAF8F5] border border-[#E8E2D6] text-[11px] font-semibold text-[#3D3A30]"
                    >
                      <GreenCheckboxIcon checked={true} className="w-3.5 h-3.5" />
                      <span>{kind}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Grid of 100 Nationwide Event Locations (Only Upcoming Events Shown) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(showAll100Events ? filteredUpcomingEventLocations : filteredUpcomingEventLocations.slice(0, 16))
                  .map((loc) => {
                    const upcomingDates = getUpcomingEventDates(loc.dates);
                    const gallery = loc.images && loc.images.length > 0
                      ? loc.images
                      : loc.imageUrl
                      ? [loc.imageUrl]
                      : [];
                    const currentHeroImage = activeImageByLocId[loc.id] || loc.imageUrl || gallery[0];

                    return (
                      <div
                        key={loc.id}
                        className="bg-white rounded-2xl border border-[#E8E2D6] overflow-hidden hover:border-[#5A5A40]/50 transition-all flex flex-col justify-between shadow-2xs group"
                      >
                        <div>
                          {currentHeroImage && (
                            <div className="relative h-48 sm:h-52 w-full bg-[#F0EBE0] overflow-hidden border-b border-[#E8E2D6]">
                              <img
                                src={currentHeroImage}
                                alt={loc.title}
                                loading="lazy"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
                              <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-white/95 text-[#3D3A30] shadow-xs backdrop-blur-xs">
                                    {loc.cityName}, {loc.stateCode}
                                  </span>
                                  {loc.importedFrom && (
                                    <span className="text-[10px] font-semibold text-emerald-900 bg-emerald-100/95 px-2 py-1 rounded-lg border border-emerald-300 shadow-xs backdrop-blur-xs">
                                      {loc.importedFrom}
                                    </span>
                                  )}
                                </div>
                                {loc.boothPricePerDay && (
                                  <span className="text-xs font-serif italic font-bold px-2.5 py-1 rounded-full bg-[#5A5A40] text-white shadow-sm shrink-0">
                                    ${loc.boothPricePerDay}/day
                                  </span>
                                )}
                              </div>

                              {gallery.length > 1 && (
                                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                                    {gallery.slice(0, 5).map((imgUrl, idx) => {
                                      const isCurrent = currentHeroImage === imgUrl;
                                      return (
                                        <button
                                          key={imgUrl + idx}
                                          type="button"
                                          onClick={() =>
                                            setActiveImageByLocId((prev) => ({
                                              ...prev,
                                              [loc.id]: imgUrl
                                            }))
                                          }
                                          title={`View photo ${idx + 1}`}
                                          className={`w-9 h-7 rounded-md overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                                            isCurrent
                                              ? 'border-white scale-105 shadow-sm'
                                              : 'border-white/50 opacity-80 hover:opacity-100'
                                          }`}
                                        >
                                          <img
                                            src={imgUrl}
                                            alt={`${loc.title} view ${idx + 1}`}
                                            loading="lazy"
                                            className="w-full h-full object-cover"
                                          />
                                        </button>
                                      );
                                    })}
                                  </div>
                                  <span className="px-2 py-0.5 rounded-md bg-black/65 text-white text-[10px] font-semibold shrink-0">
                                    {gallery.length} Photos
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="p-4 sm:p-5 space-y-2.5">
                            {!currentHeroImage && (
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#F0EBE0] text-[#5A5A40]">
                                    {loc.cityName}, {loc.stateCode}
                                  </span>
                                  {loc.importedFrom && (
                                    <span className="ml-1.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                      {loc.importedFrom}
                                    </span>
                                  )}
                                </div>
                                {loc.boothPricePerDay && (
                                  <span className="text-xs font-serif italic font-bold px-2.5 py-0.5 rounded-full bg-[#5A5A40] text-white shrink-0">
                                    ${loc.boothPricePerDay}/day
                                  </span>
                                )}
                              </div>
                            )}

                            <h4 className="font-serif italic font-bold text-base sm:text-lg text-[#3D3A30] leading-snug">
                              {loc.title}
                            </h4>

                            <div className="space-y-1 text-xs text-[#6B6658]">
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-[#5A5A40] shrink-0" />
                                <span className="truncate">{loc.address || `${loc.venueName}, ${loc.cityName}, ${loc.stateCode}`}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-[#5A5A40] shrink-0" />
                                <span>
                                  {upcomingDates.length > 0
                                    ? upcomingDates.slice(0, 3).map(formatEventDate).join(' • ') + (upcomingDates.length > 3 ? ` (+${upcomingDates.length - 3} more)` : '')
                                    : 'Upcoming 2026 Dates'}
                                </span>
                              </div>
                              {loc.hours && (
                                <div className="flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5 text-[#5A5A40] shrink-0" />
                                  <span>{loc.hours}</span>
                                </div>
                              )}
                            </div>

                            <p className="text-xs text-[#6B6658] line-clamp-2 leading-relaxed">
                              {loc.description}
                            </p>
                          </div>
                        </div>

                        <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-3 border-t border-[#E8E2D6] flex items-center justify-between gap-2">
                          <span className="text-[10px] text-[#7A7566] font-medium">
                            {loc.totalBoothsCount ? `Capacity: ${loc.totalBoothsCount} spaces` : 'Open Registration'}
                          </span>
                          <button
                            type="button"
                            onClick={() => onOpenVendorModal('tent-10x10', loc.days && loc.days.length > 0 ? loc.days : ['sat', 'sun'])}
                            className="px-3.5 py-2 rounded-xl bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Store className="w-3.5 h-3.5" />
                            <span>Apply for Booth</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Matched City Spotlight Result Card (Directory Photo Style) */}
            {matchedLocation && (
              <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-[#5A5A40]/30 shadow-md space-y-4">
                <div className="flex flex-wrap items-center justify-between border-b border-[#E8E2D6] pb-3 gap-2">
                  <div className="flex items-center gap-4 text-xs font-bold text-[#1f2937]">
                    <span className="text-lg font-serif italic font-bold text-[#3D3A30]">
                      Spotlight Market Result
                    </span>
                    <div className="hidden sm:flex items-center gap-3 text-[#7A7566] text-xs font-medium">
                      <span className="hover:text-[#3D3A30]">▼ Name</span>
                      <span className="text-amber-800 font-bold">▲ Date</span>
                      <span className="hover:text-[#3D3A30]">▼ State</span>
                      <span className="hover:text-[#3D3A30]">▼ City</span>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs text-[#5A5A40] font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>Clear Search »</span>
                  </button>
                </div>

                <div className="space-y-3 pt-1">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#111827]">
                      2026 {matchedLocation.city} Fall Marketplace & First Fridays
                    </h3>
                    <span className="text-xs font-black uppercase tracking-wider text-[#5A5A40] font-mono mt-0.5 block">
                      OCTOBER 02 – 04, 2026
                    </span>
                  </div>

                  <div className="space-y-2 text-xs sm:text-sm text-[#374151]">
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                      <span className="font-bold text-[#111827] sm:w-28 shrink-0">Location:</span>
                      <span className="text-[#1f2937] font-semibold">{matchedLocation.city}, {matchedLocation.state.code} , Downtown Promenade</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                      <span className="font-bold text-[#111827] sm:w-28 shrink-0">Description:</span>
                      <p className="text-[#4b5563] leading-relaxed">
                        {matchedLocation.city} Fall Festival & Marketplace brings together maker vendors, food truck culinary artisans, non-profit community booths, and original handcrafted creators...{' '}
                        <button 
                          type="button"
                          onClick={() => onOpenVendorModal('tent-10x10')} 
                          className="text-[#5A5A40] font-bold underline cursor-pointer hover:text-[#3D3A30]"
                        >
                          View space specs »
                        </button>
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 pt-1">
                      <span className="font-bold text-[#111827] sm:w-28 shrink-0">Types of Vendor:</span>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        {VENDOR_TYPES.map((type) => (
                          <span key={type} className="inline-flex items-center gap-1 font-semibold text-[#111827]">
                            <GreenCheckboxIcon checked={true} className="w-4 h-4" />
                            <span>{type}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => onOpenVendorModal('tent-10x10')}
                      className="px-5 py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                    >
                      <Store className="w-4 h-4" />
                      <span>Reserve Booth in {matchedLocation.city}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* SCHEDULED STAGE PROGRAMS SECTION                             */}
            {/* ============================================================ */}
            {(viewMode === 'all' || viewMode === 'scheduled') && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D6]">
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-[#5A5A40]" />
                    <h3 className="font-serif italic font-bold text-xl text-[#3D3A30]">
                      Festival Stage Events & Experiences ({filteredScheduledEvents.length})
                    </h3>
                  </div>
                  <span className="text-xs text-[#7A7566]">
                    Free Admission • Family Friendly
                  </span>
                </div>

                {filteredScheduledEvents.length === 0 ? (
                  <div className="bg-[#FAF8F5] rounded-3xl p-8 text-center border border-dashed border-[#E8E2D6] space-y-2">
                    <Clock className="w-8 h-8 text-[#7A7566] mx-auto opacity-50" />
                    <p className="text-xs text-[#6B6658]">
                      No scheduled stage events match "{searchQuery}" under the selected filters.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredScheduledEvents.map((event) => (
                      <div
                        key={event.id}
                        className="bg-white rounded-3xl border border-[#E8E2D6] overflow-hidden hover:border-[#5A5A40]/40 hover:shadow-sm transition-all flex flex-col justify-between group"
                      >
                        <div>
                          {event.imageUrl && (
                            <div className="relative h-44 w-full bg-[#F0EBE0] overflow-hidden border-b border-[#E8E2D6]">
                              <img
                                src={event.imageUrl}
                                alt={event.title}
                                loading="lazy"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />
                            </div>
                          )}
                          <div className="p-5 sm:p-6 space-y-3">
                            {/* Top Row: Day Pill + Category Tag */}
                            <div className="flex items-center justify-between gap-2">
                              <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#F0EBE0] text-[#5A5A40]">
                                {event.dayInfo?.dayName || 'Festival Day'}
                              </span>

                              {event.isMusic && (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 flex items-center gap-1">
                                  <Music className="w-3 h-3 text-purple-700" />
                                  <span>Live Stage</span>
                                </span>
                              )}

                              {event.isFood && !event.isMusic && (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 flex items-center gap-1">
                                  <UtensilsCrossed className="w-3 h-3 text-amber-700" />
                                  <span>Culinary Rally</span>
                                </span>
                              )}

                              {event.isArtisan && !event.isMusic && !event.isFood && (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 flex items-center gap-1">
                                  <Store className="w-3 h-3 text-emerald-700" />
                                  <span>Artisan Market</span>
                                </span>
                              )}
                            </div>

                            {/* Title */}
                            <h4 className="font-serif italic font-bold text-lg text-[#3D3A30] leading-snug">
                              {event.title}
                            </h4>

                            {/* Time & Location */}
                            <div className="space-y-1 text-xs text-[#7A7566]">
                              <div className="flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5 text-[#5A5A40] shrink-0" />
                                <span className="font-semibold text-[#3D3A30]">{event.time}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-[#5A5A40] shrink-0" />
                                <span>{event.location}</span>
                              </div>
                            </div>

                            {/* Description */}
                            <p className="text-xs text-[#6B6658] leading-relaxed pt-1">
                              {event.description}
                            </p>
                          </div>
                        </div>

                        {/* Event Card Actions */}
                        <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-4 border-t border-[#E8E2D6] space-y-2">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => onOpenVendorModal(
                                event.isFood ? 'food-truck' : 'tent-10x10',
                                [event.day]
                              )}
                              className="flex-1 py-2 px-3 rounded-xl bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Store className="w-3.5 h-3.5" />
                              <span>Apply as Vendor</span>
                            </button>

                            {onOpenAttendeeModal && (
                              <button
                                type="button"
                                onClick={onOpenAttendeeModal}
                                title="Free Attendee Admission Pass"
                                className="py-2 px-3 rounded-xl border border-[#E8E2D6] bg-white hover:bg-[#FAF8F5] text-[#5A5A40] text-xs font-bold flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
                              >
                                <Ticket className="w-3.5 h-3.5" />
                                <span>Free RSVP</span>
                              </button>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDownloadCalendar(event.title, event.time)}
                            className="w-full py-1 text-[11px] text-[#7A7566] hover:text-[#3D3A30] font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          >
                            <Download className="w-3 h-3" />
                            <span>Add to Calendar (.ics)</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ============================================================ */}
            {/* LOCATION DIRECTORY / MATCHED CITIES SECTION                  */}
            {/* ============================================================ */}
            {viewMode !== 'scheduled' && (
              (hasLocationFilter || showAllStatesDirectory) ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between pb-2 border-b border-[#E8E2D6] gap-2">
                  <div className="flex items-center gap-2">
                    <Globe2 className="w-4 h-4 text-[#5A5A40]" />
                    <h3 className="font-serif italic font-bold text-xl text-[#3D3A30]">
                      {hasLocationFilter 
                        ? `Search Results: ${filteredStates.length} State${filteredStates.length === 1 ? '' : 's'} Matched` 
                        : `50 US States & Metropolitan Hubs (${filteredStates.length})`}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {hasLocationFilter && (
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="px-3 py-1 rounded-lg bg-[#FAF8F5] hover:bg-[#E8E2D6] text-xs font-bold text-[#5A5A40] border border-[#E8E2D6] transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Clear Location Search ✕</span>
                      </button>
                    )}
                    {showAllStatesDirectory && !hasLocationFilter && (
                      <button
                        type="button"
                        onClick={() => setShowAllStatesDirectory(false)}
                        className="text-xs text-[#7A7566] hover:text-[#3D3A30] underline cursor-pointer"
                      >
                        Collapse 50 states directory
                      </button>
                    )}
                    <span className="text-xs text-[#7A7566]">
                      Every city &gt;200k population
                    </span>
                  </div>
                </div>

                {/* Empty State Result */}
                {filteredStates.length === 0 && (
                  <div className="text-center py-16 px-4 bg-[#FAF8F5] rounded-3xl border border-dashed border-[#E8E2D6] space-y-4">
                    <MapPin className="w-12 h-12 text-[#7A7566] mx-auto opacity-50" />
                    <h4 className="text-xl font-serif font-bold text-[#3D3A30]">
                      No states or cities matched "{searchQuery}"
                    </h4>
                    <p className="text-sm text-[#6B6658] max-w-md mx-auto">
                      Try searching by state abbreviation (e.g. SC, TX, CA, NY) or clear your search to browse all 50 states.
                    </p>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="px-5 py-2.5 rounded-full bg-[#5A5A40] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#464632] transition-colors cursor-pointer"
                    >
                      Reset All Filters
                    </button>
                  </div>
                )}

                {/* States Grid: 2 columns in the main content container */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filteredStates.map((state) => {
                    const isExpanded = expandedStateCode === state.code;
                    const hasCitiesOver200k = state.citiesOver200k.length > 0;
                    const isAll200kExpanded = expandedCitiesStateCode[state.code] || false;

                    const citiesToDisplay = (hasCitiesOver200k && (isAll200kExpanded || onlyOver200kFilter))
                      ? state.citiesOver200k
                      : state.top3Cities;

                    return (
                      <div
                        key={state.code}
                        id={`state-${state.slug}`}
                        className={`rounded-3xl border transition-all duration-200 flex flex-col justify-between ${
                          isExpanded 
                            ? 'bg-[#FDFBF7] border-[#5A5A40] shadow-md ring-1 ring-[#5A5A40]' 
                            : 'bg-white border-[#E8E2D6] hover:border-[#5A5A40]/40 hover:shadow-xs'
                        }`}
                      >
                        <div className="p-5 sm:p-6 space-y-4">
                          
                          {/* Top Bar: State Name, Abbreviation & Region Badge */}
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="w-8 h-8 rounded-xl bg-[#5A5A40] text-white text-xs font-black flex items-center justify-center font-mono shadow-xs">
                                  {state.code}
                                </span>
                                <h4 className="text-xl font-bold font-serif text-[#3D3A30]">
                                  {state.name}
                                </h4>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[11px] font-semibold text-[#7A7566] uppercase tracking-wider block">
                                  {state.region} Region • {state.annualEventsCount}+ Vendor Markets
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => toggleExpand(state.code)}
                              className="p-2 rounded-xl bg-[#FAF8F5] hover:bg-[#E8E2D6] text-[#5A5A40] transition-colors cursor-pointer shrink-0"
                              title={isExpanded ? 'Collapse details' : 'Expand full state details'}
                            >
                              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                          </div>

                          {/* Cities over 200k summary badge */}
                          {hasCitiesOver200k ? (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                              <TrendingUp className="w-3 h-3 text-emerald-600" />
                              <span>{state.citiesOver200k.length} {state.citiesOver200k.length === 1 ? 'City' : 'Cities'} with &gt;200,000 Population</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-50 border border-stone-200 text-stone-600 text-[11px] font-medium">
                              <Users className="w-3 h-3 text-stone-500" />
                              <span>Largest Regional Markets (All &lt;200k)</span>
                            </div>
                          )}

                          {/* Most Populated Cities Highlight Box */}
                          <div className="bg-[#FAF8F5] rounded-2xl p-3 border border-[#E8E2D6] space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-[#5A5A40] uppercase tracking-wider flex items-center gap-1.5">
                                <Trophy className="w-3.5 h-3.5 text-amber-600" />
                                {hasCitiesOver200k && (isAll200kExpanded || onlyOver200kFilter) 
                                  ? `All Cities Over 200k (${state.citiesOver200k.length}):` 
                                  : 'Top 3 Most Populated Cities:'}
                              </span>
                              <span className="text-[10px] text-[#7A7566] font-medium flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                Population
                              </span>
                            </div>

                            <div className="grid grid-cols-1 gap-1.5 max-h-64 overflow-y-auto pr-0.5">
                              {citiesToDisplay.map((city) => {
                                const rankBadges = [
                                  { bg: 'bg-amber-100 text-amber-800 border-amber-300', medal: '🥇 #1' },
                                  { bg: 'bg-slate-100 text-slate-700 border-slate-300', medal: '🥈 #2' },
                                  { bg: 'bg-orange-100 text-orange-800 border-orange-300', medal: '🥉 #3' }
                                ];
                                const badge = rankBadges[city.rank - 1] || { bg: 'bg-stone-100 text-stone-700 border-stone-300', medal: `#${city.rank}` };
                                const is200kPlus = (city.populationNumber || 0) >= 200000;

                                return (
                                  <div
                                    key={city.name}
                                    onClick={() => handleCityClick(city.name, state.code)}
                                    className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-white border border-[#E8E2D6] hover:border-[#5A5A40] hover:bg-[#F0EBE0]/40 transition-colors cursor-pointer group"
                                    title={`Filter events for ${city.name}, ${state.code}`}
                                  >
                                    <div className="flex items-center gap-2 truncate">
                                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md border shrink-0 ${badge.bg}`}>
                                        {badge.medal}
                                      </span>
                                      <span className="text-xs font-bold text-[#3D3A30] group-hover:text-[#5A5A40] transition-colors truncate">
                                        {city.name}
                                      </span>
                                      {is200kPlus && (
                                        <span className="text-[9.5px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-semibold shrink-0">
                                          &gt;200k
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[11px] font-mono text-[#7A7566] font-medium shrink-0 ml-2">
                                      {city.population}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Expand/Collapse All 200k+ Cities for Large States */}
                            {hasCitiesOver200k && state.citiesOver200k.length > 3 && !onlyOver200kFilter && (
                              <div className="pt-1 text-center">
                                <button
                                  type="button"
                                  onClick={() => toggleCitiesExpand(state.code)}
                                  className="text-[11px] font-bold text-[#5A5A40] hover:text-[#3D3A30] underline flex items-center justify-center gap-1 mx-auto cursor-pointer"
                                >
                                  <Layers className="w-3 h-3" />
                                  <span>
                                    {isAll200kExpanded 
                                      ? 'Show top 3 cities only' 
                                      : `View all ${state.citiesOver200k.length} cities >200k in ${state.name}`}
                                  </span>
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Major Metropolitan Hubs */}
                          <div>
                            <span className="text-[11px] font-bold text-[#7A7566] uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                              <Building2 className="w-3 h-3 text-[#5A5A40]" />
                              Metropolitan Hubs & Key Markets:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {state.majorCities.slice(0, isExpanded ? state.majorCities.length : 5).map((city, ci) => (
                                <button
                                  key={ci}
                                  type="button"
                                  onClick={() => handleCityClick(city, state.code)}
                                  className="text-[11px] px-2 py-0.5 rounded-lg bg-[#FAF8F5] hover:bg-[#E8E2D6] text-[#3D3A30] border border-[#E8E2D6] transition-colors cursor-pointer"
                                >
                                  {city}
                                </button>
                              ))}
                              {!isExpanded && state.majorCities.length > 5 && (
                                <span 
                                  onClick={() => toggleExpand(state.code)}
                                  className="text-[11px] px-2 py-0.5 rounded-lg bg-[#F0EBE0] text-[#5A5A40] font-bold cursor-pointer hover:underline"
                                >
                                  +{state.majorCities.length - 5} more
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Regional Artisan Specialties */}
                          <div>
                            <span className="text-[11px] font-bold text-[#7A7566] uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-[#5A5A40]" />
                              Regional Crafts & Specialties:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {state.artisanSpecialties.map((spec, si) => (
                                <span
                                  key={si}
                                  className="text-[10.5px] px-2 py-0.5 rounded-full bg-[#5A5A40]/10 text-[#5A5A40] font-medium"
                                >
                                  {spec}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Types of Vendor in every state card */}
                          <div className="pt-2.5 border-t border-[#E8E2D6]/80">
                            <div className="flex flex-wrap items-baseline gap-1.5 text-xs">
                              <span className="font-bold text-[#1f2937] shrink-0">Types of Vendor:</span>
                              <div className="inline-flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
                                {VENDOR_TYPES.map((type) => (
                                  <span key={type} className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#111827]">
                                    <GreenCheckboxIcon checked={true} className="w-3.5 h-3.5" />
                                    <span>{type}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Scheduled Multi-Date Event Locations in this State (Only Upcoming Shown) */}
                          {(() => {
                            const stateLocs = upcomingEventLocations.filter(l => l.stateCode === state.code);
                            if (stateLocs.length === 0) return null;
                            return (
                              <div className="pt-3 border-t border-[#E8E2D6] space-y-2">
                                <div className="flex items-center justify-between text-[11px] font-bold text-[#5A5A40] uppercase tracking-wider">
                                  <span className="flex items-center gap-1">
                                    <CalendarDays className="w-3.5 h-3.5" />
                                    <span>Upcoming Market Locations ({stateLocs.length}):</span>
                                  </span>
                                </div>

                                <div className="space-y-2">
                                  {stateLocs.map((loc) => {
                                    const upcomingDates = getUpcomingEventDates(loc.dates);
                                    return (
                                      <div key={loc.id} className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D6] space-y-1.5 text-xs">
                                        <div className="flex items-center justify-between gap-2">
                                          <span className="font-bold text-[#3D3A30] text-[12px]">{loc.title}</span>
                                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#5A5A40] text-white shrink-0">
                                            {loc.cityName}
                                          </span>
                                        </div>

                                        <div className="flex items-center gap-1.5 text-[11px] text-[#7A7566]">
                                          <MapPin className="w-3 h-3 text-[#5A5A40] shrink-0" />
                                          <span className="truncate">{loc.venueName}</span>
                                        </div>

                                        <p className="text-[11px] text-[#5D584D] leading-snug line-clamp-2">
                                          {loc.description}
                                        </p>

                                        {/* Multiple Dates Display */}
                                        <div className="flex items-center gap-1 flex-wrap pt-0.5">
                                          <span className="text-[10px] font-bold text-[#5A5A40] mr-1">Upcoming Dates:</span>
                                          {upcomingDates.length > 0 ? (
                                            upcomingDates.map((d) => (
                                              <span key={d} className="px-2 py-0.5 rounded-md bg-white border border-[#D8D2C2] text-[10.5px] font-mono font-semibold text-[#3D3A30]">
                                                {formatEventDate(d)}
                                              </span>
                                            ))
                                          ) : (
                                            <span className="text-[10.5px] text-[#8A8576]">TBD</span>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })()}

                          {/* Detailed Accordion Section */}
                          {isExpanded && (
                            <div className="pt-4 border-t border-[#E8E2D6] space-y-3 text-xs">
                              <div className="bg-amber-50/50 p-3 rounded-2xl border border-amber-200/60 space-y-1">
                                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                                  <FileCheck2 className="w-3.5 h-3.5" />
                                  <span>Sales Tax Compliance:</span>
                                </div>
                                <p className="text-amber-800 text-[11.5px] leading-relaxed">
                                  {state.salesTaxInfo}
                                </p>
                              </div>

                              <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#E8E2D6] space-y-1">
                                <div className="flex items-center gap-1.5 font-bold text-[#3D3A30]">
                                  <ShieldCheck className="w-3.5 h-3.5 text-[#5A5A40]" />
                                  <span>Permit & Registration Guidelines:</span>
                                </div>
                                <p className="text-[#6B6658] text-[11.5px] leading-relaxed">
                                  {state.vendorPermitRequirement}
                                </p>
                              </div>
                            </div>
                          )}

                        </div>

                        {/* Bottom Card Actions */}
                        <div className="p-4 bg-[#FAF8F5] border-t border-[#E8E2D6] rounded-b-3xl flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => toggleExpand(state.code)}
                            className="text-xs font-semibold text-[#5A5A40] hover:underline cursor-pointer"
                          >
                            {isExpanded ? 'Show less' : 'View state rules & tax info'}
                          </button>

                          <button
                            type="button"
                            onClick={() => onOpenVendorModal('tent-10x10')}
                            className="px-3.5 py-1.5 rounded-xl bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                          >
                            <Store className="w-3.5 h-3.5" />
                            <span>Reserve Booth</span>
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* CLEAN LOCATION SEARCH & DISCOVERY HUB (Shown by default instead of listing 50 state cards) */
              <div className="bg-gradient-to-br from-[#FAF8F5] to-[#F2EFE9] rounded-3xl p-6 sm:p-8 border border-[#E8E2D6] shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E8E2D6] pb-5">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-[#5A5A40] bg-white border border-[#E8E2D6]">
                      <MapPin className="w-3.5 h-3.5 text-[#5A5A40]" />
                      Location Finder & Tour Markets
                    </div>
                    <h3 className="text-xl sm:text-2xl font-serif italic font-bold text-[#3D3A30]">
                      Explore Events & Vendor Spaces by Location
                    </h3>
                    <p className="text-xs sm:text-sm text-[#6B6658]">
                      Search any city or select your state to view scheduled dates, venue coordinates, and open vendor booth allocations.
                    </p>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setShowAllStatesDirectory(true)}
                    className="text-xs text-[#5A5A40] font-bold hover:underline shrink-0 flex items-center gap-1 cursor-pointer bg-white px-3 py-2 rounded-xl border border-[#E8E2D6] shadow-2xs hover:bg-[#FAF8F5]"
                  >
                    <Globe2 className="w-3.5 h-3.5" />
                    <span>Browse all 50 states directory &raquo;</span>
                  </button>
                </div>

                {/* Search Inputs Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Free text search input */}
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A7566]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Type a city (e.g., Houston, Columbia, Austin, Chicago)..."
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E8E2D6] bg-white text-xs text-[#3D3A30] placeholder-[#7A7566] focus:outline-none focus:ring-2 focus:ring-[#5A5A40]"
                    />
                  </div>

                  {/* State Dropdown */}
                  <div className="relative">
                    <select
                      value={selectedStateCode}
                      onChange={(e) => {
                        setSelectedStateCode(e.target.value);
                        if (e.target.value !== 'ALL') setExpandedStateCode(e.target.value);
                      }}
                      className="w-full px-4 py-3 rounded-2xl border border-[#E8E2D6] bg-white text-xs text-[#3D3A30] font-semibold appearance-none focus:outline-none focus:ring-2 focus:ring-[#5A5A40] cursor-pointer"
                    >
                      <option value="ALL">Select a State to View Locations (50 States)...</option>
                      {stateOptions.map(st => (
                        <option key={st.code} value={st.code}>{st.name} ({st.code}) &bull; {st.region} Region</option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#7A7566] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Popular Metropolitan Markets */}
                <div className="space-y-2 pt-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#7A7566] flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#5A5A40]" />
                      <span>Popular Metropolitan Markets (Click to View):</span>
                    </span>
                    <span className="text-[10px] text-[#7A7566] normal-case">
                      Cities with &gt;200k pop &amp; active vendor communities
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { city: 'Columbia', state: 'SC', label: 'Columbia, SC (Host Market)' },
                      { city: 'Houston', state: 'TX', label: 'Houston, TX' },
                      { city: 'Los Angeles', state: 'CA', label: 'Los Angeles, CA' },
                      { city: 'Chicago', state: 'IL', label: 'Chicago, IL' },
                      { city: 'New York City', state: 'NY', label: 'New York, NY' },
                      { city: 'Phoenix', state: 'AZ', label: 'Phoenix, AZ' },
                      { city: 'Dallas', state: 'TX', label: 'Dallas, TX' },
                      { city: 'Atlanta', state: 'GA', label: 'Atlanta, GA' },
                      { city: 'Austin', state: 'TX', label: 'Austin, TX' },
                      { city: 'Seattle', state: 'WA', label: 'Seattle, WA' },
                      { city: 'Denver', state: 'CO', label: 'Denver, CO' },
                      { city: 'Charlotte', state: 'NC', label: 'Charlotte, NC' }
                    ].map(m => (
                      <button
                        key={m.label}
                        type="button"
                        onClick={() => handleCityClick(m.city, m.state)}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#5A5A40] text-[#5A5A40] hover:text-white border border-[#E8E2D6] text-xs font-semibold transition-all shadow-2xs cursor-pointer"
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Bottom Callout Banner */}
            <div className="mt-10 p-8 rounded-[36px] bg-[#5A5A40] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-2xl font-serif italic font-bold text-white">
                  Are You an Out-of-State Artisan, Crafter or Food Truck?
                </h3>
                <p className="text-xs sm:text-sm text-[#F0EBE0] max-w-2xl leading-relaxed">
                  We provide streamlined load-in coordination, complimentary overnight security, and direct transient vendor tax assistance for traveling small businesses participating from across all 50 US states and major metropolitan markets.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onOpenVendorModal('tent-10x10')}
                className="px-6 py-3.5 rounded-full bg-white hover:bg-[#F0EBE0] text-[#5A5A40] font-bold uppercase tracking-wider text-xs flex items-center gap-2 transition-colors shadow-sm shrink-0 cursor-pointer"
              >
                <span>Apply for Vendor Space</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
