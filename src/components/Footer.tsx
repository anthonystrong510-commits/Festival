import React from 'react';
import { Store, Mail, MapPin, Calendar, Clock, Heart, ShieldCheck, ArrowUp, ArrowRight, Ticket, Sun } from 'lucide-react';
import { EVENT_CONFIG, FESTIVAL_CONTACT_EMAIL, FESTIVAL_LOCATION } from '../data/festivalData';

interface FooterProps {
  onScrollToVendorBooking: () => void;
  onOpenAttendeeModal: () => void;
  onOpenVendorModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToVendorBooking, onOpenAttendeeModal, onOpenVendorModal }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#F0EBE0] text-[#3D3A30] border-t border-[#E8E2D6] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#E8E2D6]">
          
          {/* Col 1: Brand & Description */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#5A5A40] text-white flex items-center justify-center font-bold shadow-sm">
                <Sun className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-serif italic font-bold text-lg text-[#3D3A30] block leading-tight">
                  {EVENT_CONFIG.name}
                </span>
                <span className="text-xs text-[#5A5A40] uppercase tracking-widest font-bold">
                  Community Marketplace & Expo
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#6B6658] leading-relaxed max-w-md">
              A community celebration bringing together small businesses, retailers, entrepreneurs, farmers, artisans, craft vendors, food vendors, service providers, nonprofits, and community organizations.
            </p>

            <div className="pt-2 flex flex-col gap-2 text-xs">
              <div className="flex items-center gap-2 text-[#5A5A40]">
                <Mail className="w-4 h-4 text-[#5A5A40] shrink-0" />
                <span>Vendor Bookings: <a href={`mailto:${FESTIVAL_CONTACT_EMAIL}`} className="underline font-bold text-[#3D3A30] hover:text-[#5A5A40] font-mono">{FESTIVAL_CONTACT_EMAIL}</a></span>
              </div>
              <div className="flex items-center gap-2 text-[#6B6658]">
                <MapPin className="w-4 h-4 text-[#5A5A40] shrink-0" />
                <span>{FESTIVAL_LOCATION}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Event Hours */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] block">
              Festival Operating Hours
            </span>
            <ul className="space-y-2 text-xs">
              <li className="flex justify-between pb-1.5 border-b border-[#E8E2D6]">
                <span className="font-bold text-[#3D3A30]">Day 1 (Opening)</span>
                <span className="text-[#5A5A40] font-semibold">1:00 PM – 5:30 PM</span>
              </li>
              <li className="flex justify-between pb-1.5 border-b border-[#E8E2D6]">
                <span className="font-bold text-[#3D3A30]">Day 2 (Main Expo)</span>
                <span className="text-[#5A5A40] font-semibold">10:00 AM – 5:00 PM</span>
              </li>
              <li className="flex justify-between pb-1.5 border-b border-[#E8E2D6]">
                <span className="font-bold text-[#3D3A30]">Day 3 (Finale)</span>
                <span className="text-[#5A5A40] font-semibold">10:00 AM – 6:00 PM</span>
              </li>
            </ul>
            <div className="text-[11px] text-[#7A7566] pt-1">
              *Morning load-in windows provided prior to opening. Booths remain open during festival hours.
            </div>
          </div>

          {/* Col 3: Quick Navigation & CTAs */}
          <div className="lg:col-span-4 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] block">
              Vendor & Visitor Quick Links
            </span>
            
            <div className="flex flex-col gap-2.5">
              <button
                onClick={onOpenAttendeeModal}
                className="w-full py-3 px-5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#5A5A40] hover:bg-[#464632] transition-colors text-left flex items-center justify-between shadow-sm"
              >
                <span className="flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-[#F0EBE0]" />
                  <span>Claim Free Visitor Pass</span>
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenVendorModal || onScrollToVendorBooking}
                className="w-full py-3 px-5 rounded-full text-xs font-bold uppercase tracking-wider text-[#5A5A40] bg-white hover:bg-[#FDFBF7] border border-[#E8E2D6] transition-colors text-left flex items-center justify-between shadow-sm"
              >
                <span className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-[#5A5A40]" />
                  <span>Apply for Vendor Space (Pop-up)</span>
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-2 text-[11px] text-[#7A7566] space-y-1">
              <div>• Minimum 20–30 lbs canopy weights required per leg</div>
              <div>• 1 Table & 2 Chairs included with registration</div>
              <div>• Free overnight security on multi-day reservations</div>
              <div>• Leave-no-trace park waste & recycling compliance</div>
            </div>
          </div>

        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A7566]">
          <div>
            &copy; {new Date().getFullYear()} {EVENT_CONFIG.name}. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <a href="#about" className="hover:text-[#5A5A40] transition-colors">About</a>
            <a href="#experience" className="hover:text-[#5A5A40] transition-colors">Experience</a>
            <a href="#schedule" className="hover:text-[#5A5A40] transition-colors">Schedule</a>
            <a href="#faq" className="hover:text-[#5A5A40] transition-colors">Policies</a>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-white text-[#5A5A40] hover:text-white hover:bg-[#5A5A40] border border-[#E8E2D6] transition-colors ml-2"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
