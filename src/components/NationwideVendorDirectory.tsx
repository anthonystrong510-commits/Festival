import React, { useState, useMemo, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  Building2, 
  FileCheck2, 
  Sparkles, 
  ArrowRight, 
  Filter, 
  ExternalLink, 
  Store,
  ChevronDown,
  Globe2,
  ShieldCheck
} from 'lucide-react';
import { USA_STATES_CITIES_DATA, UsaStateMarket } from '../data/usaStatesCitiesData';
import { BoothId } from '../types';

interface NationwideVendorDirectoryProps {
  onOpenVendorModal: (boothId?: BoothId) => void;
}

export const NationwideVendorDirectory: React.FC<NationwideVendorDirectoryProps> = ({
  onOpenVendorModal
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [expandedStateCode, setExpandedStateCode] = useState<string | null>(null);

  // Check URL params for initial state filter (e.g. ?state=california or ?state=sc)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const stateParam = params.get('state') || params.get('st');
      const cityParam = params.get('city');

      if (stateParam) {
        const found = USA_STATES_CITIES_DATA.find(
          s => s.slug.toLowerCase() === stateParam.toLowerCase() || 
               s.code.toLowerCase() === stateParam.toLowerCase() ||
               s.name.toLowerCase() === stateParam.toLowerCase()
        );
        if (found) {
          setExpandedStateCode(found.code);
          setSearchQuery(found.name);
        }
      } else if (cityParam) {
        setSearchQuery(cityParam);
      }
    } catch (e) {
      // ignore in non-browser context
    }
  }, []);

  const regions = useMemo(() => {
    return ['All', 'Southeast', 'Northeast', 'Midwest', 'Southwest', 'West', 'Pacific', 'Mid-Atlantic'];
  }, []);

  const filteredStates = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return USA_STATES_CITIES_DATA.filter((state) => {
      const matchesRegion = selectedRegion === 'All' || state.region === selectedRegion;
      if (!matchesRegion) return false;

      if (!q) return true;

      const inName = state.name.toLowerCase().includes(q);
      const inCode = state.code.toLowerCase() === q;
      const inSlug = state.slug.toLowerCase().includes(q);
      const inCities = state.majorCities.some(c => c.toLowerCase().includes(q));
      const inSpecialties = state.artisanSpecialties.some(s => s.toLowerCase().includes(q));
      const inCategories = state.popularCategories.some(c => c.toLowerCase().includes(q));

      return inName || inCode || inSlug || inCities || inSpecialties || inCategories;
    });
  }, [searchQuery, selectedRegion]);

  const toggleExpand = (code: string) => {
    setExpandedStateCode(prev => prev === code ? null : code);
  };

  return (
    <section id="states-directory" className="py-20 bg-white text-[#3D3A30] border-b border-[#E8E2D6] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-[#5A5A40] bg-[#F0EBE0] border border-[#E8E2D6]">
            <Globe2 className="w-3.5 h-3.5 text-[#5A5A40]" />
            50 States & Metropolitan Markets Directory
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif italic font-bold text-[#3D3A30]">
            Nationwide Vendor Network & Regional Guide
          </h2>

          <p className="text-[#6B6658] text-base sm:text-lg">
            We welcome traveling artisans, independent makers, and food truck operators from across all 50 US States. Explore state sales tax requirements, regional craft specialties, and major vendor hubs.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-[#FAF8F5] rounded-3xl p-5 border border-[#E8E2D6] shadow-sm mb-10 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#7A7566]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any US state or city (e.g. South Carolina, Texas, Columbia, Atlanta, Austin, Los Angeles, Chicago...)"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-[#E8E2D6] bg-white text-sm text-[#3D3A30] placeholder-[#7A7566] focus:outline-none focus:ring-2 focus:ring-[#5A5A40] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs bg-[#E8E2D6] hover:bg-[#D4CDBE] px-2.5 py-1 rounded-lg text-[#3D3A30] font-semibold transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick State Shortcut Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs shrink-0">
              <span className="text-[#7A7566] font-semibold hidden lg:inline mr-1">Popular:</span>
              {['South Carolina', 'North Carolina', 'Georgia', 'Florida', 'Tennessee', 'Texas', 'California', 'New York'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSearchQuery(st)}
                  className="px-2.5 py-1.5 rounded-xl bg-white border border-[#E8E2D6] hover:border-[#5A5A40] text-[#5A5A40] whitespace-nowrap font-medium transition-colors cursor-pointer"
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Region Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#E8E2D6]">
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

            <span className="text-xs text-[#7A7566] font-medium">
              Showing <strong className="text-[#3D3A30]">{filteredStates.length}</strong> of 51 US States & Jurisdictions
            </span>
          </div>
        </div>

        {/* States Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStates.map((state) => {
            const isExpanded = expandedStateCode === state.code;
            return (
              <div
                key={state.code}
                className={`rounded-3xl border transition-all duration-200 flex flex-col justify-between ${
                  isExpanded 
                    ? 'bg-[#FDFBF7] border-[#5A5A40] shadow-md ring-1 ring-[#5A5A40]' 
                    : 'bg-white border-[#E8E2D6] hover:border-[#5A5A40]/40 hover:shadow-xs'
                }`}
              >
                <div className="p-6 space-y-4">
                  
                  {/* Top Bar: State Name & Region Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-xl bg-[#5A5A40] text-white text-xs font-black flex items-center justify-center font-mono">
                          {state.code}
                        </span>
                        <h3 className="text-xl font-bold font-serif text-[#3D3A30]">
                          {state.name}
                        </h3>
                      </div>
                      <span className="text-[11px] font-semibold text-[#7A7566] uppercase tracking-wider block mt-1">
                        {state.region} Region • {state.annualEventsCount}+ Vendor Markets
                      </span>
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

                  {/* Major Metropolitan Hubs */}
                  <div>
                    <span className="text-[11px] font-bold text-[#7A7566] uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-[#5A5A40]" />
                      Key Metropolitan Vendor Hubs:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {state.majorCities.slice(0, isExpanded ? state.majorCities.length : 4).map((city, ci) => (
                        <span
                          key={ci}
                          className="text-[11px] px-2 py-0.5 rounded-lg bg-[#FAF8F5] text-[#3D3A30] border border-[#E8E2D6]"
                        >
                          {city}
                        </span>
                      ))}
                      {!isExpanded && state.majorCities.length > 4 && (
                        <span 
                          onClick={() => toggleExpand(state.code)}
                          className="text-[11px] px-2 py-0.5 rounded-lg bg-[#F0EBE0] text-[#5A5A40] font-bold cursor-pointer hover:underline"
                        >
                          +{state.majorCities.length - 4} more
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
                    {isExpanded ? 'Show less' : 'View state rules'}
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
              We provide streamlined load-in coordination, complimentary overnight security, and direct transient vendor tax assistance for traveling small businesses participating from across the United States.
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
