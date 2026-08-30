import React from 'react';
import { Camera, Mail, ArrowRight, Quote, Heart, Store, Users, Palette, Sun } from 'lucide-react';
import { EVENT_CONFIG, FESTIVAL_CONTACT_EMAIL, VENDOR_SPOTLIGHTS } from '../data/festivalData';

interface SpotlightSectionProps {
  onScrollToVendorBooking: () => void;
  onOpenVendorModal?: () => void;
}

export const SpotlightSection: React.FC<SpotlightSectionProps> = ({ onScrollToVendorBooking, onOpenVendorModal }) => {
  return (
    <section id="spotlights" className="py-20 bg-[#FDFBF7] text-[#3D3A30] border-b border-[#E8E2D6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-[#5A5A40] bg-[#F0EBE0] border border-[#E8E2D6]">
            <Users className="w-3.5 h-3.5 text-[#5A5A40]" />
            Curated Artisans & Creators
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif italic font-bold text-[#3D3A30]">
            Meet Our Featured Makers & Crafters
          </h2>
          
          <p className="text-[#6B6658] text-base sm:text-lg">
            Discover the passionate small business owners, jewelers, master woodworkers, and culinary innovators joining us at the festival.
          </p>
        </div>

        {/* Spotlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {VENDOR_SPOTLIGHTS.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-white rounded-[32px] overflow-hidden border border-[#E8E2D6] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-[#F0EBE0]">
                  <img
                    src={vendor.image}
                    alt={vendor.businessName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-[#5A5A40]/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-white/20">
                    {vendor.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <div>
                    <h3 className="font-serif italic font-bold text-lg text-[#3D3A30] leading-snug">
                      {vendor.businessName}
                    </h3>
                    <span className="text-xs text-[#5A5A40] font-semibold block mt-0.5">
                      Owner: {vendor.owner}
                    </span>
                  </div>

                  <p className="text-xs text-[#6B6658] leading-relaxed">
                    {vendor.bio}
                  </p>

                  <div className="pt-2 border-t border-[#E8E2D6]">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#7A7566] block mb-1">
                      Featured Offerings:
                    </span>
                    <span className="text-xs font-medium text-[#3D3A30]">
                      {vendor.products}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quote Footer */}
              <div className="p-4 bg-[#F0EBE0] border-t border-[#E8E2D6] text-xs text-[#5A5A40] italic flex items-start gap-2">
                <Quote className="w-3.5 h-3.5 text-[#5A5A40] shrink-0 mt-0.5" />
                <span>"{vendor.quote}"</span>
              </div>
            </div>
          ))}
        </div>

        {/* Vendor Spotlight Callout Box */}
        <div className="bg-[#5A5A40] rounded-[36px] p-8 sm:p-10 text-white shadow-sm relative overflow-hidden border border-[#5A5A40]">
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-white/15 text-[#F0EBE0] border border-white/20">
                <Camera className="w-3.5 h-3.5 text-[#F0EBE0]" />
                Get Your Business Featured
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif italic font-bold text-white">
                "I will be doing vendor spotlights — send me pictures of your work!"
              </h3>

              <p className="text-sm sm:text-base text-white/85 leading-relaxed">
                We actively promote our confirmed vendors across our social media, press releases, and festival newsletters. Once you reserve your spot, share high-quality photos of your craft, food, or workspace to be featured!
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-[#F0EBE0] pt-1">
                <span className="flex items-center gap-1.5 bg-black/20 px-3.5 py-1.5 rounded-full border border-white/10">
                  <Mail className="w-3.5 h-3.5 text-[#F0EBE0]" />
                  Email photos to: <strong className="text-white font-mono">{FESTIVAL_CONTACT_EMAIL}</strong>
                </span>
                <span className="flex items-center gap-1.5 bg-black/20 px-3.5 py-1.5 rounded-full border border-white/10">
                  <Store className="w-3.5 h-3.5 text-[#F0EBE0]" />
                  Includes website & social links
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <button
                id="spotlight-apply-vendor-btn"
                onClick={onOpenVendorModal || onScrollToVendorBooking}
                className="w-full py-3.5 px-6 rounded-full font-bold uppercase tracking-wider text-xs text-[#5A5A40] bg-white hover:bg-[#F0EBE0] shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                <span>Apply for Vendor Space (Pop-up)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`mailto:${FESTIVAL_CONTACT_EMAIL}?subject=Vendor%20Spotlight%20Photos%20Submission`}
                className="w-full py-3 px-6 rounded-full font-bold uppercase tracking-wider text-center text-white bg-white/10 hover:bg-white/20 border border-white/20 text-xs transition-colors"
              >
                Submit Photos via Email
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
