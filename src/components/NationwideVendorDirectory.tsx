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
  Layers
} from 'lucide-react';
import { USA_STATES_CITIES_DATA, ALL_US_CITIES_OVER_200K, UsaStateMarket, CityPopulationInfo } from '../data/usaStatesCitiesData';
import { BoothId } from '../types';
import { TypesOfVendorBadge, VENDOR_TYPES, GreenCheckboxIcon } from './TypesOfVendorBadge';

interface NationwideVendorDirectoryProps {
  onOpenVendorModal: (boothId?: BoothId) => void;
}

export const NationwideVendorDirectory: React.FC<NationwideVendorDirectoryProps> = ({
  onOpenVendorModal
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStateCode, setSelectedStateCode] = useState<string>('ALL');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [expandedStateCode, setExpandedStateCode] = useState<string | null>(null);
  const [selectedCityFilter, setSelectedCityFilter] = useState<string | null>(null);
  const [onlyOver200kFilter, setOnlyOver200kFilter] = useState<boolean>(false);
  const [expandedCitiesStateCode, setExpandedCitiesStateCode] = useState<Record<string, boolean>>({});
  const [selectedVendorTypes, setSelectedVendorTypes] = useState<string[]>([...VENDOR_TYPES]);

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

  // Filter logic combining search query, selected state dropdown, selected region, 200k toggle, and city filter
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

      // 4. City specific pill filter
      if (selectedCityFilter) {
        const cityQ = selectedCityFilter.toLowerCase();
        const matchesTop3 = state.top3Cities.some(c => c.name.toLowerCase().includes(cityQ));
        const matches200k = state.citiesOver200k.some(c => c.name.toLowerCase().includes(cityQ));
        const matchesMajor = state.majorCities.some(c => c.toLowerCase().includes(cityQ));
        if (!matchesTop3 && !matches200k && !matchesMajor) return false;
      }

      // 5. Free text search
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
  }, [searchQuery, selectedStateCode, selectedRegion, selectedCityFilter, onlyOver200kFilter]);

  // Find active location or matching city for the search results card (like user screenshot)
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
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedStateCode('ALL');
    setSelectedRegion('All');
    setSelectedCityFilter(null);
    setOnlyOver200kFilter(false);
    setExpandedStateCode(null);
  };

  const isFiltered = searchQuery !== '' || selectedStateCode !== 'ALL' || selectedRegion !== 'All' || selectedCityFilter !== null || onlyOver200kFilter;

  return (
    <section id="states-directory" className="py-20 bg-white text-[#3D3A30] border-b border-[#E8E2D6] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-[#5A5A40] bg-[#F0EBE0] border border-[#E8E2D6]">
            <Globe2 className="w-3.5 h-3.5 text-[#5A5A40]" />
            50 States & All US Cities Over 200,000 Population Directory
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif italic font-bold text-[#3D3A30]">
            Nationwide Vendor Network & 50 States Guide
          </h2>

          <p className="text-[#6B6658] text-base sm:text-lg">
            Explore vendor regulations, regional artisan specialties, and market opportunities across all 50 US States. Browse top populated cities and <strong>every major city with over 200k population ({totalCitiesOver200kCount}+ cities)</strong> nationwide.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-[#FAF8F5] rounded-3xl p-5 sm:p-6 border border-[#E8E2D6] shadow-sm mb-10 space-y-4">
          
          {/* Top Row: Search Input + State Dropdown Filter */}
          <div className="flex flex-col lg:flex-row gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#7A7566]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (selectedCityFilter && e.target.value !== selectedCityFilter) {
                    setSelectedCityFilter(null);
                  }
                }}
                placeholder="Search state or city (e.g. Houston, Los Angeles, Chicago, New York, Phoenix, Plano, Frisco, Fresno...)"
                className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-[#E8E2D6] bg-white text-sm text-[#3D3A30] placeholder-[#7A7566] focus:outline-none focus:ring-2 focus:ring-[#5A5A40] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCityFilter(null);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-[#E8E2D6] hover:bg-[#D4CDBE] px-2.5 py-1 rounded-lg text-[#3D3A30] font-semibold transition-colors cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* State Select Dropdown */}
            <div className="relative lg:w-72">
              <select
                value={selectedStateCode}
                onChange={(e) => {
                  setSelectedStateCode(e.target.value);
                  if (e.target.value !== 'ALL') {
                    setExpandedStateCode(e.target.value);
                  }
                }}
                className="w-full px-4 py-3.5 rounded-2xl border border-[#E8E2D6] bg-white text-sm text-[#3D3A30] font-medium focus:outline-none focus:ring-2 focus:ring-[#5A5A40] transition-all appearance-none cursor-pointer"
              >
                <option value="ALL">All 50 US States & D.C. ({USA_STATES_CITIES_DATA.length})</option>
                {stateOptions.map((st) => (
                  <option key={st.code} value={st.code}>
                    {st.name} ({st.code}) — {st.region} {st.citiesOver200k.length > 0 ? `(${st.citiesOver200k.length} >200k)` : ''}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#7A7566] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* 200k+ Cities Toggle Button */}
            <button
              type="button"
              onClick={() => setOnlyOver200kFilter(prev => !prev)}
              className={`px-4 py-3.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 border ${
                onlyOver200kFilter 
                  ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-sm' 
                  : 'bg-white hover:bg-[#FAF8F5] text-[#5A5A40] border-[#E8E2D6]'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Cities &gt;200k Population ({totalCitiesOver200kCount})</span>
            </button>

            {/* Reset All Filters Button */}
            {isFiltered && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-3.5 rounded-2xl bg-white hover:bg-[#E8E2D6] border border-[#E8E2D6] text-[#5A5A40] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}

          </div>

          {/* Quick Filter City & Popular State Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-[#7A7566] font-bold shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-[#5A5A40]" />
              Quick Filter:
            </span>

            {/* If a city is actively selected */}
            {selectedCityFilter && (
              <span className="px-3 py-1 rounded-xl bg-[#5A5A40] text-white font-bold flex items-center gap-1.5 shrink-0">
                <span>City: {selectedCityFilter}</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCityFilter(null);
                    setSearchQuery('');
                  }}
                  className="hover:text-red-200 text-xs ml-1 cursor-pointer"
                >
                  ✕
                </button>
              </span>
            )}

            {/* Top US Metropolitan Markets with >200k population */}
            {[
              { label: 'Houston, TX (2.3M)', city: 'Houston', state: 'TX' },
              { label: 'Los Angeles, CA (3.8M)', city: 'Los Angeles', state: 'CA' },
              { label: 'Chicago, IL (2.6M)', city: 'Chicago', state: 'IL' },
              { label: 'New York City, NY (8.2M)', city: 'New York City', state: 'NY' },
              { label: 'Phoenix, AZ (1.6M)', city: 'Phoenix', state: 'AZ' },
              { label: 'San Antonio, TX (1.5M)', city: 'San Antonio', state: 'TX' },
              { label: 'San Diego, CA (1.3M)', city: 'San Diego', state: 'CA' },
              { label: 'Dallas, TX (1.3M)', city: 'Dallas', state: 'TX' },
              { label: 'Austin, TX (979k)', city: 'Austin', state: 'TX' },
              { label: 'Jacksonville, FL (985k)', city: 'Jacksonville', state: 'FL' },
              { label: 'Fort Worth, TX (958k)', city: 'Fort Worth', state: 'TX' },
              { label: 'Columbus, OH (907k)', city: 'Columbus', state: 'OH' },
              { label: 'Charlotte, NC (911k)', city: 'Charlotte', state: 'NC' },
              { label: 'Indianapolis, IN (879k)', city: 'Indianapolis', state: 'IN' },
              { label: 'San Francisco, CA (808k)', city: 'San Francisco', state: 'CA' },
              { label: 'Seattle, WA (755k)', city: 'Seattle', state: 'WA' },
              { label: 'Denver, CO (713k)', city: 'Denver', state: 'CO' },
              { label: 'Nashville, TN (678k)', city: 'Nashville', state: 'TN' },
              { label: 'Columbia, SC (Host City)', city: 'Columbia', state: 'SC' },
              { label: 'Florence, AL (Shoals)', city: 'Florence', state: 'AL' }
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

          {/* Region Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E8E2D6]">
            <div className="flex flex-wrap gap-1.5">
              {regions.map((region) => (
                <button
                  key={region}
                  type="button"
                  onClick={() => setSelectedRegion(region)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                    selectedRegion === region
                      ? 'bg-[#5A5A40] text-white shadow-xs'
                      : 'bg-white border border-[#E8E2D6] text-[#5A5A40] hover:bg-[#F0EBE0]'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 text-xs text-[#7A7566] font-medium">
              <span>
                Showing <strong className="text-[#3D3A30]">{filteredStates.length}</strong> States
              </span>
              <span>•</span>
              <span>
                <strong className="text-[#5A5A40]">{totalCitiesOver200kCount} Cities</strong> with &gt;200k Population across US
              </span>
            </div>
          </div>

          {/* Types of Vendor Toolbar Filter with Green Checkboxes */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E8E2D6]">
            <div className="flex flex-wrap items-center gap-2">
              <TypesOfVendorBadge
                label="Types of Vendor:"
                selectedTypes={selectedVendorTypes}
                onToggleType={handleToggleVendorType}
                interactive={true}
                size="md"
              />
            </div>
            <span className="text-[11px] text-[#7A7566] italic">
              All categories accepted across nationwide vendor locations
            </span>
          </div>

        </div>

        {/* Search Result Card (Exact Layout from Directory Photo) */}
        {matchedLocation && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-[#5A5A40]/30 shadow-md space-y-4 mb-8">
            <div className="flex flex-wrap items-center justify-between border-b border-[#E8E2D6] pb-3 gap-2">
              <div className="flex items-center gap-4 text-xs font-bold text-[#1f2937]">
                <span className="text-lg font-serif italic font-bold text-[#3D3A30]">Search Results</span>
                <div className="hidden sm:flex items-center gap-3 text-[#7A7566] text-xs font-medium">
                  <span className="hover:text-[#3D3A30] cursor-pointer">▼ Name</span>
                  <span className="text-amber-800 font-bold cursor-pointer">▲ Date</span>
                  <span className="hover:text-[#3D3A30] cursor-pointer">▼ Month</span>
                  <span className="hover:text-[#3D3A30] cursor-pointer">▼ Year</span>
                  <span className="hover:text-[#3D3A30] cursor-pointer">▼ State</span>
                  <span className="hover:text-[#3D3A30] cursor-pointer">▼ City</span>
                </div>
              </div>
              <button 
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-[#5A5A40] font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Start New Search »</span>
              </button>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#111827]">
                  2026 {matchedLocation.city} Fall First Fridays
                </h3>
                <span className="text-xs font-black uppercase tracking-wider text-[#5A5A40] font-mono mt-0.5 block">
                  OCTOBER 02, 2026
                </span>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-[#374151]">
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                  <span className="font-bold text-[#111827] sm:w-28 shrink-0">Location:</span>
                  <span className="text-[#1f2937] font-semibold">{matchedLocation.city}, {matchedLocation.state.code} , Downtown</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                  <span className="font-bold text-[#111827] sm:w-28 shrink-0">Description:</span>
                  <p className="text-[#4b5563] leading-relaxed">
                    {matchedLocation.city} Fall First Fridays will be held on October 2, 2026. It will feature maker vendors, non-profit booths, food truck vendors, fine art exhibitors, and handcrafted creators...{' '}
                    <button 
                      type="button"
                      onClick={() => onOpenVendorModal('tent-10x10')} 
                      className="text-[#5A5A40] font-bold underline cursor-pointer hover:text-[#3D3A30]"
                    >
                      View more detail »
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
                  className="px-4 py-2 rounded-xl bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Reserve Booth in {matchedLocation.city}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State Result */}
        {filteredStates.length === 0 && (
          <div className="text-center py-16 px-4 bg-[#FAF8F5] rounded-3xl border border-dashed border-[#E8E2D6] space-y-4">
            <MapPin className="w-12 h-12 text-[#7A7566] mx-auto opacity-50" />
            <h3 className="text-xl font-serif font-bold text-[#3D3A30]">
              No states or cities matched "{searchQuery}"
            </h3>
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

        {/* States Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStates.map((state) => {
            const isExpanded = expandedStateCode === state.code;
            const hasCitiesOver200k = state.citiesOver200k.length > 0;
            const isAll200kExpanded = expandedCitiesStateCode[state.code] || false;

            // Determine which cities to display in the main box:
            // If user explicitly expanded the 200k list or onlyOver200kFilter is on, show all 200k+ cities
            // Otherwise show top 3 cities
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
                <div className="p-6 space-y-4">
                  
                  {/* Top Bar: State Name, Abbreviation & Region Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-xl bg-[#5A5A40] text-white text-xs font-black flex items-center justify-center font-mono shadow-xs">
                          {state.code}
                        </span>
                        <h3 className="text-xl font-bold font-serif text-[#3D3A30]">
                          {state.name}
                        </h3>
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

                    <div className="grid grid-cols-1 gap-1.5 max-h-72 overflow-y-auto pr-0.5">
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

                    {/* Expand/Collapse All 200k+ Cities for Large States (e.g. CA with 22, TX with 17, FL with 9, AZ with 8, NC with 6) */}
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

                  {/* Additional Major Metropolitan Hubs */}
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

        {/* Bottom Callout Banner */}
        <div className="mt-14 p-8 rounded-[36px] bg-[#5A5A40] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
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
    </section>
  );
};
