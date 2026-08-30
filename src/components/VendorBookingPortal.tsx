import React from 'react';
import { 
  Store, 
  Check, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  ShieldAlert,
  Wind
} from 'lucide-react';
import { BOOTH_TIERS, EVENT_CONFIG } from '../data/festivalData';
import { BoothId } from '../types';

interface VendorBookingPortalProps {
  onOpenVendorModal: (boothId?: BoothId, days?: Array<'fri' | 'sat' | 'sun'>) => void;
}

export const VendorBookingPortal: React.FC<VendorBookingPortalProps> = ({ onOpenVendorModal }) => {
  return (
    <section id="vendor-booking" className="py-16 sm:py-20 bg-[#FDFBF7] text-[#3D3A30] border-b border-[#E8E2D6]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-[#5A5A40] bg-[#F0EBE0] border border-[#E8E2D6]">
            <Store className="w-3.5 h-3.5 text-[#5A5A40]" />
            Vendor Opportunities & Rates
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-serif italic font-bold text-[#3D3A30]">
            Exhibit at {EVENT_CONFIG.shortName}
          </h2>
          
          <p className="text-[#6B6658] text-sm sm:text-base">
            Showcase your handmade crafts, boutique merchandise, or culinary specialties along the vibrant festival promenade.
          </p>
        </div>

        {/* Single Unified Vendor Card */}
        <div className="bg-white rounded-[32px] border border-[#E8E2D6] p-6 sm:p-8 lg:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Pricing List & Amenities */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#5A5A40] block mb-1">
                  Booth Spaces & Daily Rates
                </span>
                <h3 className="text-xl sm:text-2xl font-serif italic font-bold text-[#3D3A30]">
                  Artisan & Food Vendor Spaces
                </h3>
              </div>

              {/* Compact Rates Table / List */}
              <div className="space-y-2.5">
                {BOOTH_TIERS.map((tier) => (
                  <div
                    key={tier.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D6] hover:border-[#5A5A40]/40 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-[#5A5A40]" />
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-[#3D3A30]">
                          {tier.name}
                        </div>
                        <div className="text-[11px] text-[#7A7566]">
                          {tier.dimensions}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-serif italic font-bold text-sm sm:text-base text-[#3D3A30]">
                        ${tier.pricePerDay}
                      </span>
                      <span className="text-[11px] text-[#7A7566]"> / day</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Included Amenities List */}
              <div className="pt-2 border-t border-[#E8E2D6] space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A5A40] block">
                  Included With Every Space:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#6B6658]">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#5A5A40] shrink-0" />
                    <span>1 Table & 2 Chairs included</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#5A5A40] shrink-0" />
                    <span>Morning load-in & vehicle drop-off window</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#5A5A40] shrink-0" />
                    <span>Free multi-day overnight security</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#5A5A40] shrink-0" />
                    <span>Festival directory listing & promotion</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Pricing Summary & Apply CTA */}
            <div className="lg:col-span-5 bg-[#5A5A40] text-white rounded-[28px] p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-md">
              
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/15 text-[#F0EBE0] mb-3">
                  <Sparkles className="w-3 h-3" />
                  Reserve Your Location
                </div>
                
                <div className="space-y-1">
                  <span className="text-xs text-[#E8E2D6] block">
                    Starting Daily Rate
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl sm:text-5xl font-serif italic font-bold text-white">
                      $70
                    </span>
                    <span className="text-xs text-[#E8E2D6]">/ day</span>
                  </div>
                  <p className="text-[11px] text-[#F0EBE0] leading-relaxed pt-1">
                    Book single or multiple days. All spaces allocated on first-confirmed basis.
                  </p>
                </div>
              </div>

              {/* Event Policies Highlights Card */}
              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 text-[11px] text-[#F0EBE0] space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <Wind className="w-3.5 h-3.5 text-[#F0EBE0] shrink-0" />
                  <span>Key Event Standards:</span>
                </div>
                <p className="leading-snug text-[#E8E2D6]">
                  Canopy weights required (20–30 lbs/leg), active booth staffing during festival operating hours, and leave-no-trace park cleanup.
                </p>
              </div>

              {/* Single Apply Button */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  id="main-apply-vendor-btn"
                  onClick={() => onOpenVendorModal('tent-10x10')}
                  className="w-full py-4 rounded-full font-bold uppercase tracking-wider text-xs sm:text-sm text-[#5A5A40] bg-white hover:bg-[#F0EBE0] shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Store className="w-4 h-4 text-[#5A5A40]" />
                  <span>Apply for Vendor Space</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[10px] text-center text-[#E8E2D6]">
                  Opens pop-up form with tier selection & instant rate calculator.
                </p>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
