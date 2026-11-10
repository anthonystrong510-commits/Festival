import React, { useState } from 'react';
import { 
  Store, 
  Check, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  ShieldAlert,
  Wind,
  ChevronDown,
  Users,
  Search,
  HelpCircle
} from 'lucide-react';
import { BOOTH_TIERS, EVENT_CONFIG } from '../data/festivalData';
import { BoothId } from '../types';
import { TypesOfVendorBadge } from './TypesOfVendorBadge';

interface VendorBookingPortalProps {
  onOpenVendorModal: (boothId?: BoothId, days?: Array<'fri' | 'sat' | 'sun'>) => void;
}

const VENDOR_RESERVATION_FAQS = [
  {
    q: 'What types of artisans, makers, food trucks, and commercial brands can apply?',
    a: 'We welcome juried handmade makers, ceramicists, fine artists, metalsmith jewelers, gourmet food trucks, specialty beverage carts, regional farm produce, and approved corporate sponsors. Every application is reviewed to preserve category diversity and high standards.',
    keywords: ['artisan vendor application', 'food truck booking', 'handmade makers festival', 'craft fair booth']
  },
  {
    q: 'What equipment and support are included with each vendor footprint?',
    a: 'All canopy spaces include marked footprint boundaries, 1 complimentary festival vehicle staging pass, access to clean trash and recycling facilities, and 24-hour overnight park security. 10x10 and 10x20 spaces also include 1 table and 2 chairs with early load-in support.',
    keywords: ['booth amenities', 'canopy space inclusions', 'overnight park security', 'vendor table chairs']
  },
  {
    q: 'Can traveling and out-of-state vendors apply for multiple tour cities?',
    a: 'Yes! Traveling artisans and mobile culinary trucks frequently tour with our festival across multiple state stops. You can indicate multiple preferred dates or locations in your application, and our coordinator will bundle your permits and space holds.',
    keywords: ['nationwide tour vendors', 'traveling craft fair', '50 states artisan tour', 'multi-city vendor booking']
  },
  {
    q: 'When is vendor load-in and what are the breakdown procedures?',
    a: 'Standard Friday load-in begins at 8:00 AM through 12:30 PM with drive-up unloading. Saturday and Sunday restock windows open from 8:00 AM to 9:45 AM before public gates open. Booth breakdown begins only after public egress on Sunday at 6:00 PM for attendee safety.',
    keywords: ['load-in schedule', 'drive up unloading', 'booth setup hours', 'restock window', 'breakdown logistics']
  },
  {
    q: 'Are electrical power drops, generator permits, and Wi-Fi available?',
    a: 'Yes. Standard 110V/20A power drops can be requested for payment POS processing and subtle LED lighting. Food trucks requiring dedicated 30A/50A hookups or approved whisper-quiet inverter generators should specify their wattage requirements in their application.',
    keywords: ['electrical hookup', 'generator permit', 'pos wifi internet', 'vendor power drops']
  }
];

export const VendorBookingPortal: React.FC<VendorBookingPortalProps> = ({ onOpenVendorModal }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [showVendorTypes, setShowVendorTypes] = useState<boolean>(false);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(prev => prev === idx ? null : idx);
  };
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

                {/* Collapsible What Kind Of Vendor Are You? * */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowVendorTypes((prev) => !prev)}
                    className="w-full p-3 rounded-2xl bg-[#FDFBF7] hover:bg-[#F0EBE0]/60 border border-[#E8E2D6] flex items-center justify-between text-xs font-bold text-[#3D3A30] transition-colors cursor-pointer"
                  >
                    <span>What Kind Of Vendor Are You? * (10 Accepted Categories)</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#5A5A40] transition-transform duration-200 ${
                        showVendorTypes ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {showVendorTypes && (
                    <div className="mt-2 p-3.5 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D6]">
                      <TypesOfVendorBadge
                        label=""
                        useVendorKinds={true}
                      />
                    </div>
                  )}
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

        {/* Exhibitor Guidelines & FAQ Section */}
        <div id="booking-faq" className="mt-12 bg-white rounded-[32px] border border-[#E8E2D6] p-6 sm:p-8 lg:p-10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E2D6] pb-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#5A5A40] bg-[#F0EBE0] border border-[#E8E2D6]">
                <HelpCircle className="w-3.5 h-3.5 text-[#5A5A40]" />
                Exhibitor & Booth FAQ
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif italic font-bold text-[#3D3A30]">
                Space Reservations & Logistics Guidelines
              </h3>
              <p className="text-[#6B6658] text-xs sm:text-sm">
                Essential details regarding booth permits, multi-city touring, electrical utility connections, and load-in schedules.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOpenVendorModal('tent-10x10')}
              className="self-start sm:self-center px-5 py-2.5 rounded-full bg-[#5A5A40] hover:bg-[#464632] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm hover:shadow transition-all"
            >
              <Store className="w-4 h-4" />
              <span>Apply for Space</span>
            </button>
          </div>

          {/* Search Query Tags Cloud */}
          <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
            <span className="text-[11px] font-bold text-[#7A7566] uppercase tracking-wider flex items-center gap-1 mr-1">
              <Search className="w-3.5 h-3.5" />
              Popular Topics:
            </span>
            {[
              'artisan booth guidelines',
              'food truck power hookup',
              '50 states tour dates',
              'early load-in logistics',
              'overnight park security',
              'juried acceptance'
            ].map((tag) => (
              <span 
                key={tag} 
                className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#FDFBF7] border border-[#E8E2D6] text-[#5A5A40]"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Accordion List */}
          <div className="space-y-3">
            {VENDOR_RESERVATION_FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#E8E2D6] bg-[#FDFBF7] overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-[#3D3A30] hover:text-[#5A5A40] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-[#5A5A40] shrink-0" />
                      <span className="text-sm sm:text-base font-serif italic">{faq.q}</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-[#7A7566] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#5A5A40]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 sm:pb-5 pt-1 text-xs sm:text-sm text-[#6B6658] leading-relaxed border-t border-[#E8E2D6]/60 space-y-3">
                      <p>{faq.a}</p>
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] uppercase font-bold text-[#7A7566]">Indexed Keywords:</span>
                        {faq.keywords.map(kw => (
                          <span key={kw} className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-[#E8E2D6] text-[#7A7566]">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footnote */}
          <div className="p-4 rounded-2xl bg-[#F0EBE0]/60 border border-[#E8E2D6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#6B6658]">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#5A5A40] shrink-0" />
              <span>
                Need customized footprint sizing or pavilion corner placement? Select your preferred space above and note your requirements in your application.
              </span>
            </div>
            <button
              type="button"
              onClick={() => onOpenVendorModal('tent-10x10')}
              className="shrink-0 text-xs font-bold text-[#5A5A40] hover:underline inline-flex items-center gap-1"
            >
              <span>Submit Application</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
