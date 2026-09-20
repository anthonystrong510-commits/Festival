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
  Heart,
  ChevronDown,
  Users,
  Search,
  MessageCircleHeart
} from 'lucide-react';
import { BOOTH_TIERS, EVENT_CONFIG } from '../data/festivalData';
import { BoothId } from '../types';
import { TypesOfVendorBadge } from './TypesOfVendorBadge';

interface VendorBookingPortalProps {
  onOpenVendorModal: (boothId?: BoothId, days?: Array<'fri' | 'sat' | 'sun'>) => void;
}

const DATING_APPLY_FAQS = [
  {
    q: 'Can dating services, matchmaking businesses, and singles event organizers apply for a booth space?',
    a: 'Yes, absolutely! We welcome professional matchmakers, certified dating coaches, singles social clubs, relationship authors, and dating mobile apps. Dating vendors frequently host profile glow-up consultations, icebreaker speed-dating micro rounds, and singles mixer registration lounges directly from their 10×10 Canopy or 10×20 Pavilion spaces.',
    keywords: ['dating services vendor', 'matchmaking booth', 'singles events organizers', 'dating coach expo space']
  },
  {
    q: 'What kind of singles mixer events, icebreakers, and speed dating activities take place at the festival?',
    a: 'Every evening from 5:30 PM to 8:30 PM, the festival hosts our official Sunset Singles Social Hour at the Riverfront Pavilion. We provide color-coded icebreaker wristbands (Green: Single & Ready to Mingle; Yellow: It’s Complicated; Red: Taken/Coupled), scheduled 5-minute speed-dating rounds, and cooperative lawn games that bring hundreds of singles directly past vendor promenades.',
    keywords: ['singles mixer festival', 'speed dating meetup', 'singles icebreaker wristbands', 'outdoor singles event']
  },
  {
    q: 'Why is the festival considered a top outdoor date night destination for couples and first dates?',
    a: 'With scenic waterfront walking paths, candlelit food truck dining tables, artisanal dessert pop-ups, craft beverage tastings, and live acoustic music, thousands of couples and first dates attend each year. Vendors offering romantic handmade gifts, custom jewelry, couple portraits, and artisan treats see high conversion during evening hours.',
    keywords: ['date night festival', 'romantic date ideas', 'first date spot', 'couples artisan market', 'date night food trucks']
  },
  {
    q: 'Can dating vendors sponsor the Singles Lounge or host collaborative date night workshops?',
    a: 'Yes. Qualifying dating vendors can co-brand our Evening Singles Lounge, distribute branded icebreaker cards, or facilitate interactive 20-minute couple/singles workshops (e.g., "Charcuterie Date Night Styling", "Craft Cocktail Pairing for Two", or "Modern Dating Advice Q&A"). Mention your workshop concept in your application.',
    keywords: ['dating brand sponsorship', 'singles lounge host', 'couple workshops', 'relationship seminar']
  },
  {
    q: 'What are the rules for selling romantic couples gifts, anniversary jewelry, and dating merchandise?',
    a: 'Handmade, artisan, and boutique goods celebrating love, anniversaries, and romance are encouraged. All merchandise must be presented professionally, with clear pricing and high-quality booth displays. Electrical drops are available for illuminated jewelry showcases and photo stations.',
    keywords: ['couples gifts handmade', 'anniversary jewelry booth', 'romantic crafts', 'date night gifts']
  }
];

export const VendorBookingPortal: React.FC<VendorBookingPortalProps> = ({ onOpenVendorModal }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

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

                {/* Types of Vendor */}
                <div className="pt-2">
                  <TypesOfVendorBadge label="Types of Vendor:" className="p-2.5 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D6]" />
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

        {/* Dating & Singles Events Apply FAQ Section */}
        <div id="dating-faq" className="mt-12 bg-white rounded-[32px] border border-[#E8E2D6] p-6 sm:p-8 lg:p-10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E2D6] pb-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                Dating & Singles Opportunities
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif italic font-bold text-[#3D3A30]">
                Singles Mixers, Speed Dating & Date Night FAQs
              </h3>
              <p className="text-[#6B6658] text-xs sm:text-sm">
                Targeting search queries for matchmaking services, singles meetups, romantic date ideas, and couple workshops.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOpenVendorModal('tent-10x10')}
              className="self-start sm:self-center px-5 py-2.5 rounded-full bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm hover:shadow transition-all"
            >
              <MessageCircleHeart className="w-4 h-4" />
              <span>Apply as Dating Vendor</span>
            </button>
          </div>

          {/* Search Query Tags Cloud */}
          <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
            <span className="text-[11px] font-bold text-[#7A7566] uppercase tracking-wider flex items-center gap-1 mr-1">
              <Search className="w-3.5 h-3.5" />
              Trending Queries:
            </span>
            {[
              'singles mixer festival',
              'speed dating pop-up booth',
              'outdoor date night festival',
              'matchmaking vendor application',
              'romantic couples gifts',
              'dating coach workshop'
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
            {DATING_APPLY_FAQS.map((faq, idx) => {
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
                      <div className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
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

          {/* Footnote on Dating Booth Jury */}
          <div className="p-4 rounded-2xl bg-[#F0EBE0]/60 border border-[#E8E2D6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#6B6658]">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#5A5A40] shrink-0" />
              <span>
                Want to curate a special <strong>Speed Dating</strong> or <strong>Singles Mixer</strong> segment? Select "Handmade Crafts" or "Community Service" and note "Singles / Dating Focus" in your description.
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
