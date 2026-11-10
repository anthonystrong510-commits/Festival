import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Calendar, 
  Clock, 
  MapPin, 
  Sparkles, 
  Heart, 
  Store, 
  UtensilsCrossed, 
  Music, 
  Users, 
  Ticket, 
  ArrowRight, 
  Check, 
  Filter, 
  ShieldCheck, 
  Download, 
  ChevronRight,
  Zap,
  Globe2
} from 'lucide-react';
import { 
  BOOTH_TIERS, 
  EVENT_CONFIG, 
  FESTIVAL_DAYS, 
  FESTIVAL_LOCATION, 
  SCHEDULE_EVENTS
} from '../data/festivalData';
import { USA_STATES_CITIES_DATA } from '../data/usaStatesCitiesData';
import { BoothId } from '../types';

interface EventSearchAndApplicationProps {
  onOpenVendorModal: (boothId?: BoothId, days?: Array<'fri' | 'sat' | 'sun'>) => void;
  onOpenAttendeeModal: () => void;
  onScrollToDirectory?: (cityName?: string) => void;
}

type EventCategoryFilter = 'all' | 'artisan' | 'food' | 'music' | 'nationwide';

export const EventSearchAndApplication: React.FC<EventSearchAndApplicationProps> = ({
  onOpenVendorModal,
  onOpenAttendeeModal,
  onScrollToDirectory
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategoryFilter>('all');
  const [selectedDay, setSelectedDay] = useState<'all' | 'fri' | 'sat' | 'sun'>('all');

  // Interactive Space Recommender State
  const [selectedVendorType, setSelectedVendorType] = useState<'artisan' | 'food' | 'crafts' | 'commercial'>('artisan');
  const [selectedDaysCount, setSelectedDaysCount] = useState<Array<'fri' | 'sat' | 'sun'>>(['fri', 'sat', 'sun']);

  // All events enriched with search tags & categories
  const allEnrichedEvents = useMemo(() => {
    return SCHEDULE_EVENTS.map(event => {
      const isFood = event.type === 'food' || 
                     event.title.toLowerCase().includes('food') || 
                     event.description.toLowerCase().includes('brunch') ||
                     event.description.toLowerCase().includes('treats');

      const isMusic = event.type === 'entertainment';

      const isArtisan = event.type === 'market' || event.type === 'workshop';

      return {
        ...event,
        isFood,
        isMusic,
        isArtisan,
        dayInfo: FESTIVAL_DAYS.find(d => d.id === event.day)
      };
    });
  }, []);

  // Filtered Events based on search and category
  const filteredEvents = useMemo(() => {
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

  // Matching US Cities from the 50 States data when user types city name
  const matchingCities = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (q.length < 2) return [];

    const matches: Array<{ cityName: string; stateName: string; stateCode: string; population: string }> = [];

    for (const st of USA_STATES_CITIES_DATA) {
      for (const c of st.citiesOver200k) {
        if (c.name.toLowerCase().includes(q)) {
          matches.push({ cityName: c.name, stateName: st.name, stateCode: st.code, population: c.population });
          if (matches.length >= 6) return matches;
        }
      }
      for (const c of st.top3Cities) {
        if (c.name.toLowerCase().includes(q) && !matches.some(m => m.cityName === c.name)) {
          matches.push({ cityName: c.name, stateName: st.name, stateCode: st.code, population: c.population });
          if (matches.length >= 6) return matches;
        }
      }
    }

    return matches;
  }, [searchQuery]);

  // Recommended booth based on vendor type
  const recommendedTier = useMemo(() => {
    if (selectedVendorType === 'food') {
      return BOOTH_TIERS.find(t => t.id === 'food-truck') || BOOTH_TIERS[3];
    }
    if (selectedVendorType === 'crafts') {
      return BOOTH_TIERS.find(t => t.id === 'corner-10x10') || BOOTH_TIERS[2];
    }
    if (selectedVendorType === 'commercial') {
      return BOOTH_TIERS.find(t => t.id === 'corner-10x10') || BOOTH_TIERS[2];
    }
    return BOOTH_TIERS.find(t => t.id === 'tent-10x10') || BOOTH_TIERS[0];
  }, [selectedVendorType]);

  const calculatedCost = recommendedTier.pricePerDay * selectedDaysCount.length;

  const toggleDaySelection = (day: 'fri' | 'sat' | 'sun') => {
    setSelectedDaysCount(prev => {
      if (prev.includes(day)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter(d => d !== day);
      }
      return [...prev, day];
    });
  };

  const handleDownloadCalendar = (eventTitle: string, eventTime: string) => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Sky's Events//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:${eventTitle} - ${EVENT_CONFIG.shortName}
DESCRIPTION:Event at ${EVENT_CONFIG.name}. ${FESTIVAL_LOCATION}
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
    <section id="events" className="py-16 sm:py-24 bg-[#FDFBF7] text-[#3D3A30] border-b border-[#E8E2D6] relative scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-[#5A5A40] bg-[#F0EBE0] border border-[#E8E2D6]">
            <Search className="w-3.5 h-3.5 text-[#5A5A40]" />
            Live Event Search & Instant Application Portal
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif italic font-bold text-[#3D3A30]">
            Explore Events & Apply to Exhibit
          </h2>

          <p className="text-[#6B6658] text-base sm:text-lg">
            Discover upcoming artisan craft markets, live concert stages, gourmet food truck rallies, and nationwide city locations with instant RSVP or vendor application.
          </p>
        </div>

        {/* Modern Search & Filtering Bar */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E8E2D6] shadow-sm mb-10 space-y-5">
          
          {/* Top Search Input Row */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#7A7566]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events, artisan crafts, food trucks, or cities (e.g. Dallas, live music, pottery, Chicago)..."
                className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-[#E8E2D6] bg-[#FDFBF7] text-sm text-[#3D3A30] placeholder-[#7A7566] focus:outline-none focus:ring-2 focus:ring-[#5A5A40] focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-[#E8E2D6] hover:bg-[#D4CDBE] px-2.5 py-1 rounded-lg text-[#3D3A30] font-semibold transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Day Selector */}
            <div className="flex items-center gap-1.5 p-1 bg-[#FDFBF7] rounded-2xl border border-[#E8E2D6] shrink-0 overflow-x-auto">
              {[
                { id: 'all', label: 'All 3 Days' },
                { id: 'fri', label: 'Friday' },
                { id: 'sat', label: 'Saturday' },
                { id: 'sun', label: 'Sunday' }
              ].map(d => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setSelectedDay(d.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedDay === d.id
                      ? 'bg-[#5A5A40] text-white shadow-xs'
                      : 'text-[#6B6658] hover:text-[#3D3A30] hover:bg-[#EAE4D6]'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#E8E2D6]">
            <span className="text-xs font-bold text-[#7A7566] mr-1 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5 text-[#5A5A40]" />
              Filter By:
            </span>

            {[
              { id: 'all', label: 'All Highlights', icon: Sparkles, count: allEnrichedEvents.length },
              { id: 'artisan', label: 'Artisan Crafts & Makers', icon: Store, count: allEnrichedEvents.filter(e => e.isArtisan).length },
              { id: 'food', label: 'Food Trucks & Sweets', icon: UtensilsCrossed, count: allEnrichedEvents.filter(e => e.isFood).length },
              { id: 'music', label: 'Live Amphitheater Music', icon: Music, count: allEnrichedEvents.filter(e => e.isMusic).length },
            ].map(cat => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-[#5A5A40] text-white shadow-xs'
                      : 'bg-[#FDFBF7] text-[#6B6658] border border-[#E8E2D6] hover:bg-[#EAE4D6] hover:text-[#3D3A30]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-[#E8E2D6] text-[#5A5A40]'}`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Nationwide Cities Quick Match Strip (if user searched a city) */}
          {matchingCities.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="font-bold text-amber-950">Matching Nationwide Markets for "{searchQuery}":</span>
                <div className="flex flex-wrap gap-1.5">
                  {matchingCities.map(c => (
                    <button
                      key={`${c.stateCode}-${c.cityName}`}
                      type="button"
                      onClick={() => onScrollToDirectory ? onScrollToDirectory(c.cityName) : null}
                      className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-900 font-semibold hover:bg-amber-100 transition-colors flex items-center gap-1"
                    >
                      <span>{c.cityName}, {c.stateCode}</span>
                      <span className="text-[10px] text-amber-700 font-mono">({c.population})</span>
                    </button>
                  ))}
                </div>
              </div>
              <a 
                href="#states-directory" 
                className="font-bold text-amber-800 hover:text-amber-950 hover:underline flex items-center gap-1 shrink-0"
              >
                <span>View 50 States Guide</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

        </div>

        {/* Search Results Grid */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-[#3D3A30] flex items-center gap-2">
              <span>Scheduled Experiences & Programs</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F0EBE0] text-[#5A5A40]">
                {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
              </span>
            </h3>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-[#E8E2D6] space-y-3">
              <Search className="w-8 h-8 text-[#7A7566] mx-auto opacity-50" />
              <h4 className="font-bold text-[#3D3A30] text-base">No scheduled events match "{searchQuery}"</h4>
              <p className="text-xs text-[#7A7566] max-w-md mx-auto">
                Try searching for general terms like "artisan", "food", "music", or reset your filters to view all scheduled programs.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedDay('all');
                }}
                className="px-4 py-2 rounded-xl bg-[#5A5A40] text-white text-xs font-bold hover:bg-[#464632] transition-colors"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredEvents.map(event => (
                <div 
                  key={event.id}
                  className="rounded-3xl border p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between bg-white border-[#E8E2D6] hover:border-[#5A5A40]/40 hover:shadow-md"
                >
                  <div className="space-y-3">
                    {/* Top Row: Day Pill + Category Tag */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#F0EBE0] text-[#5A5A40]">
                        {event.dayInfo?.dayName || 'Festival Day'}
                      </span>

                      {event.isFood && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 flex items-center gap-1">
                          <UtensilsCrossed className="w-3 h-3 text-amber-700" />
                          <span>Culinary</span>
                        </span>
                      )}

                      {event.isMusic && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 flex items-center gap-1">
                          <Music className="w-3 h-3 text-purple-700" />
                          <span>Live Music</span>
                        </span>
                      )}

                      {event.isArtisan && !event.isFood && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <Store className="w-3 h-3 text-emerald-700" />
                          <span>Artisan</span>
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

                  {/* Actions Footer */}
                  <div className="pt-5 mt-4 border-t border-[#E8E2D6] space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenVendorModal(
                          event.isFood ? 'food-truck' : 'tent-10x10',
                          [event.day]
                        )}
                        className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs bg-[#5A5A40] hover:bg-[#464632] text-white"
                      >
                        <Store className="w-3.5 h-3.5" />
                        <span>Apply as Vendor</span>
                      </button>

                      <button
                        type="button"
                        onClick={onOpenAttendeeModal}
                        title="Get Free Visitor Pass & Gate Admission"
                        className="py-2.5 px-3 rounded-xl border border-[#E8E2D6] bg-white hover:bg-[#FDFBF7] text-[#5A5A40] text-xs font-bold flex items-center gap-1 transition-colors shrink-0"
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        <span>Free RSVP</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDownloadCalendar(event.title, event.time)}
                      className="w-full py-1.5 text-[11px] text-[#7A7566] hover:text-[#3D3A30] font-medium flex items-center justify-center gap-1 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      <span>Add to My Calendar (.ics)</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Interactive Guided Vendor Application Wizard Card */}
        <div className="bg-gradient-to-br from-[#FAF8F4] to-[#F5EFE6] rounded-[36px] border border-[#E8E2D6] p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Wizard Questions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white border border-[#E8E2D6] text-[#5A5A40]">
                  <Zap className="w-3.5 h-3.5 text-[#5A5A40]" />
                  Instant Space Matcher
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif italic font-bold text-[#3D3A30]">
                  Find Your Ideal Space & Start Your Application
                </h3>
                <p className="text-xs sm:text-sm text-[#6B6658]">
                  Select your merchandise or offering, choose your days, and view our instant daily rate estimate.
                </p>
              </div>

              {/* Step 1: Vendor Type Chips */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7A7566]">
                  1. What will you showcase or sell?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'artisan', label: 'Handmade / Artisan', sub: 'Jewelry, crafts, art' },
                    { id: 'food', label: 'Food Truck / Eats', sub: 'Culinary, baking' },
                    { id: 'crafts', label: 'Home & Decor', sub: 'Woodwork, candles' },
                    { id: 'commercial', label: 'Brand / Sponsor', sub: 'Retail, high-volume' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedVendorType(item.id as any)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        selectedVendorType === item.id
                          ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-sm'
                          : 'bg-white text-[#3D3A30] border-[#E8E2D6] hover:bg-[#FDFBF7]'
                      }`}
                    >
                      <div className="font-bold text-xs">{item.label}</div>
                      <div className={`text-[10px] mt-0.5 ${selectedVendorType === item.id ? 'text-[#F0EBE0]' : 'text-[#7A7566]'}`}>
                        {item.sub}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Day Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7A7566]">
                  2. Select days you want to exhibit:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {FESTIVAL_DAYS.map(day => (
                    <button
                      key={day.id}
                      type="button"
                      onClick={() => toggleDaySelection(day.id)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        selectedDaysCount.includes(day.id)
                          ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-xs'
                          : 'bg-white text-[#6B6658] border-[#E8E2D6] hover:bg-[#FDFBF7]'
                      }`}
                    >
                      <div className="font-bold text-xs flex items-center justify-center gap-1">
                        {selectedDaysCount.includes(day.id) && <Check className="w-3.5 h-3.5 text-white" />}
                        <span>{day.dayName}</span>
                      </div>
                      <div className={`text-[10px] mt-0.5 ${selectedDaysCount.includes(day.id) ? 'text-[#F0EBE0]' : 'text-[#7A7566]'}`}>
                        {day.hours}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Instant Match & Apply CTA */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-[#E8E2D6] shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D6]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A7566] block">
                    Recommended Space
                  </span>
                  <h4 className="font-bold text-base text-[#3D3A30]">
                    {recommendedTier.name}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold font-serif text-[#5A5A40]">${calculatedCost}</span>
                  <span className="text-[10px] text-[#7A7566] block">for {selectedDaysCount.length} {selectedDaysCount.length === 1 ? 'day' : 'days'}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#6B6658]">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Footprint:</strong> {recommendedTier.dimensions}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Equipment:</strong> 1 table & 2 chairs included with setup</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Amenities:</strong> Overnight park security & morning load-in access</span>
                </div>
              </div>

              <button
                type="button"
                id="btn-quick-apply-match"
                onClick={() => onOpenVendorModal(recommendedTier.id, selectedDaysCount)}
                className="w-full py-4 rounded-2xl bg-[#5A5A40] hover:bg-[#464632] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
              >
                <Store className="w-4 h-4" />
                <span>Apply for {recommendedTier.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-center text-[#7A7566]">
                Instant submission. No immediate charge until your booth space is reviewed and confirmed.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
