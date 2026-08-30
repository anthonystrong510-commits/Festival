import React from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Store, 
  Ticket, 
  ShieldCheck, 
  UtensilsCrossed, 
  CheckCircle2, 
  ArrowRight,
  Sun,
  Waves,
  Music,
  Users,
  Compass,
  ShoppingBag
} from 'lucide-react';
import { EVENT_CONFIG, FESTIVAL_CONTACT_EMAIL, FESTIVAL_LOCATION } from '../data/festivalData';

interface HeroProps {
  onOpenAttendeeModal: () => void;
  onScrollToVendorBooking: () => void;
  onOpenVendorModal?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenAttendeeModal, onScrollToVendorBooking, onOpenVendorModal }) => {
  const scrollToExperience = () => {
    const el = document.getElementById('experience');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-24 sm:pt-28 pb-16 sm:pb-24 overflow-hidden bg-[#FDFBF7] text-[#3D3A30]">
      {/* Background Graphic & Subtle Texture */}
      <div className="absolute inset-0 opacity-40 bg-grid-natural pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#E8E2D6]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#5A5A40]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2.5 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#F0EBE0] border border-[#E8E2D6] text-[#5A5A40]">
            <Waves className="w-3.5 h-3.5 text-[#5A5A40]" />
            {EVENT_CONFIG.locationBadge}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-white border border-[#E8E2D6] text-[#5A5A40]">
            <Sun className="w-3.5 h-3.5 text-[#5A5A40]" />
            {EVENT_CONFIG.durationBadge}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#5A5A40] text-white shadow-sm">
            <Ticket className="w-3.5 h-3.5 text-[#F0EBE0]" />
            {EVENT_CONFIG.admissionBadge}
          </span>
        </div>

        {/* Grid Layout: Hero Copy & Visual Experience Collage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Main Headline & Description */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif italic font-bold tracking-tight text-[#3D3A30] leading-[1.12]">
                Experience the Vibrant <br className="hidden sm:inline" />
                <span className="text-[#5A5A40]">
                  {EVENT_CONFIG.heroHeadline}.
                </span>
              </h1>
              
              <p className="text-base sm:text-lg text-[#6B6658] font-normal leading-relaxed max-w-2xl">
                {EVENT_CONFIG.description} Stroll open-air promenades filled with 100+ local artisans and makers, feast on gourmet food truck cuisine, enjoy live acoustic amphitheater music, and take part in family activities along the scenic waterfront.
              </p>
            </div>

            {/* Festival Experience Highlight Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 pb-1">
              <div className="bg-white border border-[#E8E2D6] rounded-2xl p-4 shadow-sm hover:border-[#5A5A40]/40 transition-colors">
                <div className="flex items-center justify-between text-xs text-[#5A5A40] font-bold mb-1 uppercase tracking-wider">
                  <span>Artisan Market</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F0EBE0] text-[#5A5A40]">Makers</span>
                </div>
                <div className="text-sm font-bold text-[#3D3A30]">100+ Local Creators</div>
                <div className="text-[11px] text-[#6B6658] mt-1 font-medium">Handmade Crafts, Art & Jewelry</div>
              </div>

              <div className="bg-white border border-[#E8E2D6] rounded-2xl p-4 shadow-sm hover:border-[#5A5A40]/40 transition-colors">
                <div className="flex items-center justify-between text-xs text-[#5A5A40] font-bold mb-1 uppercase tracking-wider">
                  <span>Food & Dining</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F0EBE0] text-[#5A5A40]">Street Food</span>
                </div>
                <div className="text-sm font-bold text-[#3D3A30]">Gourmet Food Trucks</div>
                <div className="text-[11px] text-[#6B6658] mt-1 font-medium">Craft Eats, BBQ & Artisan Desserts</div>
              </div>

              <div className="bg-white border border-[#E8E2D6] rounded-2xl p-4 shadow-sm hover:border-[#5A5A40]/40 transition-colors">
                <div className="flex items-center justify-between text-xs text-[#5A5A40] font-bold mb-1 uppercase tracking-wider">
                  <span>Live Stage</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F0EBE0] text-[#5A5A40]">Music & Art</span>
                </div>
                <div className="text-sm font-bold text-[#3D3A30]">Live Performances</div>
                <div className="text-[11px] text-[#6B6658] mt-1 font-medium">Acoustic, Jazz & Family Shows</div>
              </div>
            </div>

            {/* Attendee Highlights Strip */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-3 text-xs sm:text-sm text-[#5A5A40] font-medium pt-1">
              <span className="flex items-center gap-1.5 bg-[#F0EBE0] px-3.5 py-1.5 rounded-full border border-[#E8E2D6]">
                <ShoppingBag className="w-4 h-4 text-[#5A5A40] shrink-0" />
                Artisan Marketplace
              </span>
              <span className="flex items-center gap-1.5 bg-[#F0EBE0] px-3.5 py-1.5 rounded-full border border-[#E8E2D6]">
                <UtensilsCrossed className="w-4 h-4 text-[#5A5A40] shrink-0" />
                Food Truck Row
              </span>
              <span className="flex items-center gap-1.5 bg-[#F0EBE0] px-3.5 py-1.5 rounded-full border border-[#E8E2D6]">
                <Music className="w-4 h-4 text-[#5A5A40] shrink-0" />
                Live Music Stage
              </span>
            </div>

            {/* Attendee First CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                id="hero-attendee-pass-cta"
                onClick={onOpenAttendeeModal}
                className="px-7 py-3.5 rounded-full font-bold uppercase tracking-wider text-white bg-[#5A5A40] hover:bg-[#464632] shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                <Ticket className="w-4 h-4 text-[#F0EBE0]" />
                <span>Get Free Visitor Pass & Map</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                id="hero-explore-experience-cta"
                onClick={scrollToExperience}
                className="px-6 py-3.5 rounded-full font-bold uppercase tracking-wider text-[#5A5A40] bg-white hover:bg-[#F0EBE0] border border-[#E8E2D6] shadow-sm hover:border-[#5A5A40]/50 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                <Compass className="w-4 h-4 text-[#5A5A40]" />
                <span>Explore Festival Guide</span>
              </button>
            </div>

            {/* Subtle Vendor Bridge */}
            <div className="pt-2 flex items-center gap-2 text-xs text-[#7A7566]">
              <span>Are you an artisan, food truck or business?</span>
              <button
                id="hero-apply-vendor-btn"
                onClick={onOpenVendorModal || onScrollToVendorBooking}
                className="font-bold text-[#5A5A40] hover:underline underline-offset-4 flex items-center gap-1"
              >
                <span>Apply for Vendor Space (Pop-up Form)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Location & Inquiries Notice */}
            <div className="pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-[#7A7566] gap-2 border-t border-[#E8E2D6]">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#5A5A40] shrink-0" />
                <span>{FESTIVAL_LOCATION}</span>
              </div>
              <div>
                Inquiries: <span className="font-bold text-[#5A5A40] font-mono">{FESTIVAL_CONTACT_EMAIL}</span>
              </div>
            </div>
          </div>

          {/* Right Visual Image Showcase: Outdoor Festival & Promenade */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none space-y-4">
              
              {/* Main Visual Image Card with Rounded [36px] */}
              <div className="relative rounded-[36px] overflow-hidden border-2 border-[#5A5A40] shadow-[8px_8px_0px_#5A5A40] bg-white group">
                <img
                  src="https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&q=80&w=1000"
                  alt="Outdoor Artisan Market Showcase"
                  className="w-full h-72 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#3D3A30]/90 via-[#3D3A30]/20 to-transparent" />

                {/* Floating Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <div className="bg-white/90 backdrop-blur-md border border-[#E8E2D6] rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-[#5A5A40] flex items-center gap-1.5 shadow-sm">
                    <Sun className="w-3.5 h-3.5 text-[#5A5A40]" />
                    <span>Outdoor Marketplace</span>
                  </div>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-0 inset-x-0 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif italic font-bold text-white text-lg sm:text-xl">
                        Curated Artisan Marketplace
                      </h4>
                      <p className="text-xs text-[#E8E2D6] mt-0.5">
                        Handmade Crafts, Live Music & Gourmet Food Trucks
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase tracking-widest text-[#E8E2D6] block">Public Entry</span>
                      <span className="text-xl font-bold font-serif italic text-white">Free</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-cards Row with Outdoor Imagery */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative rounded-[24px] overflow-hidden border border-[#E8E2D6] bg-white shadow-sm group">
                  <img
                    src="https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?auto=format&fit=crop&w=600&q=80"
                    alt="Gourmet Food Trucks"
                    className="w-full h-24 sm:h-28 object-cover brightness-90 group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3D3A30]/85 via-transparent to-transparent flex items-end p-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-white">Food Truck Row</span>
                  </div>
                </div>

                <div className="relative rounded-[24px] overflow-hidden border border-[#E8E2D6] bg-white shadow-sm group">
                  <img
                    src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80"
                    alt="Live Music Stage"
                    className="w-full h-24 sm:h-28 object-cover brightness-90 group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3D3A30]/85 via-transparent to-transparent flex items-end p-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-white">Live Stage Music</span>
                  </div>
                </div>
              </div>

              {/* Community Warmth Banner */}
              <div className="bg-[#E6E4D9] border border-[#E8E2D6] rounded-[24px] p-4 flex items-center justify-between text-xs text-[#3D3A30]">
                <span className="font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#5A5A40]" />
                  <span>Free family admission & pet-friendly grounds</span>
                </span>
                <span className="font-bold text-[#5A5A40] uppercase tracking-wider">Welcome →</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
