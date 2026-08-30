import React from 'react';
import { 
  Store, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Heart, 
  CheckCircle2, 
  ArrowRight,
  Sun,
  Flame
} from 'lucide-react';
import { EVENT_CONFIG } from '../data/festivalData';
import bannerImage from '../assets/images/vendor_expo_banner_1787739027600.jpg';

interface VendorExpoBannerProps {
  onOpenVendorModal: () => void;
}

export const VendorExpoBanner: React.FC<VendorExpoBannerProps> = ({ onOpenVendorModal }) => {
  return (
    <section className="py-12 bg-[#FDFBF7] text-[#3D3A30]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Banner Container with High Contrast & Festive Theme */}
        <div className="relative rounded-[36px] overflow-hidden border border-[#E8E2D6] shadow-lg bg-[#0F383B] text-white">
          
          {/* Background Image with Cinematic Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={bannerImage}
              alt="Outdoor Festival & Vendor Marketplace"
              className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F383B] via-[#0F383B]/95 to-[#13494D]/85" />
          </div>

          <div className="relative z-10 p-8 sm:p-12 lg:p-14 flex flex-col lg:flex-row items-center justify-between gap-10">
            
            {/* Left Col: Badges, Headline, Description */}
            <div className="space-y-6 max-w-2xl">
              
              {/* Badge & Good Vibes Pill */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-[#E89E27] text-[#1E1D18] shadow-sm">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  Vendors Needed!
                </span>
                
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide bg-white/10 backdrop-blur-md border border-white/20 text-[#F0EBE0]">
                  <Heart className="w-3.5 h-3.5 text-[#E89E27] fill-current" />
                  <span><strong>Good Vibes</strong> &bull; Great Finds &bull; Memories</span>
                </span>
              </div>

              {/* Headline */}
              <div className="space-y-3">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif italic font-bold tracking-tight text-white leading-tight">
                  Be Part of an Exciting Community Event
                </h2>
                
                <p className="text-sm sm:text-base text-[#E2ECE9] leading-relaxed max-w-xl">
                  Connect with eager shoppers, food lovers, families, and the wider community for an engaging event of fun, culture, and discovery. Bring your unique products to high-foot-traffic festival promenades.
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={onOpenVendorModal}
                  className="px-8 py-4 rounded-full font-bold uppercase tracking-wider text-xs text-[#1E1D18] bg-[#E89E27] hover:bg-[#F2AA35] shadow-md hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2.5 cursor-pointer"
                >
                  <Store className="w-4 h-4 text-[#1E1D18]" />
                  <span>Reserve Your Vendor Booth</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                
                <span className="text-xs text-[#A8C8C3] font-medium">
                  Daily rates starting from $70/day
                </span>
              </div>
            </div>

            {/* Right Col: "Great Exposure" Highlight Card */}
            <div className="w-full lg:w-auto shrink-0 lg:max-w-md">
              <div className="bg-[#E89E27] text-[#1E1D18] p-7 sm:p-8 rounded-[28px] shadow-xl border border-[#F2AA35] relative">
                
                <div className="flex items-center justify-between gap-4 mb-4 border-b border-[#1E1D18]/15 pb-3">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-[#1E1D18]/80 block">
                      Vendor Opportunities
                    </span>
                    <h3 className="font-serif italic font-black text-2xl text-[#1E1D18]">
                      Great Exposure
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#1E1D18] text-[#E89E27] flex items-center justify-center font-bold shrink-0">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-3.5 text-sm font-semibold">
                  <div className="flex items-start gap-3 bg-white/30 backdrop-blur-sm p-3 rounded-2xl border border-white/40">
                    <CheckCircle2 className="w-5 h-5 text-[#1E1D18] shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-bold text-[#1E1D18]">High Foot Traffic</span>
                      <span className="text-xs text-[#1E1D18]/85 font-normal">Thousands of weekend attendees, families, and avid shoppers.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white/30 backdrop-blur-sm p-3 rounded-2xl border border-white/40">
                    <CheckCircle2 className="w-5 h-5 text-[#1E1D18] shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-bold text-[#1E1D18]">Connect with New Customers</span>
                      <span className="text-xs text-[#1E1D18]/85 font-normal">Direct face-to-face marketing, tastings, and on-site sales.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white/30 backdrop-blur-sm p-3 rounded-2xl border border-white/40">
                    <CheckCircle2 className="w-5 h-5 text-[#1E1D18] shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-bold text-[#1E1D18]">Grow Your Business</span>
                      <span className="text-xs text-[#1E1D18]/85 font-normal">Build brand loyalty, social followings, and repeat clientele.</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#1E1D18]/15 text-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#1E1D18]/80">
                    Handmade &bull; Food &bull; Retailing &bull; Services &bull; Nonprofits
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
