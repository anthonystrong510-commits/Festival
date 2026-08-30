import React, { useState } from 'react';
import { 
  Palette, 
  UtensilsCrossed, 
  Home, 
  Heart, 
  Users, 
  Music, 
  Camera, 
  Check, 
  ArrowRight,
  Sun,
  Waves,
  ShoppingBag,
  Tag,
  Coffee,
  Leaf,
  TreePine,
  Smile,
  Ticket
} from 'lucide-react';
import { EVENT_CONFIG, MARKET_CATEGORIES } from '../data/festivalData';
import { MarketCategory } from '../types';

const iconMap: Record<string, React.ReactNode> = {
  Palette: <Palette className="w-4 h-4" />,
  Tag: <Tag className="w-4 h-4" />,
  UtensilsCrossed: <UtensilsCrossed className="w-4 h-4" />,
  Coffee: <Coffee className="w-4 h-4" />,
  Leaf: <Leaf className="w-4 h-4" />,
  TreePine: <TreePine className="w-4 h-4" />,
  Home: <Home className="w-4 h-4" />,
  Heart: <Heart className="w-4 h-4" />,
  ShoppingBag: <ShoppingBag className="w-4 h-4" />,
  Camera: <Camera className="w-4 h-4" />,
  Smile: <Smile className="w-4 h-4" />,
  Users: <Users className="w-4 h-4" />,
};

interface FestivalOverviewProps {
  onScrollToVendorBooking: () => void;
  onOpenAttendeeModal: () => void;
  onOpenVendorModal?: () => void;
}

export const FestivalOverview: React.FC<FestivalOverviewProps> = ({
  onScrollToVendorBooking,
  onOpenAttendeeModal,
  onOpenVendorModal,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>(MARKET_CATEGORIES[0].id);
  const selectedCat = MARKET_CATEGORIES.find((c) => c.id === activeCategory) || MARKET_CATEGORIES[0];

  return (
    <section id="about" className="py-20 bg-[#FDFBF7] border-b border-[#E8E2D6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-[#5A5A40] bg-[#F0EBE0] border border-[#E8E2D6]">
            <Waves className="w-3.5 h-3.5 text-[#5A5A40]" />
            Community Marketplace & Festival
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif italic font-bold text-[#3D3A30]">
            A Celebration of Artisans, Crafts & Culinary Flavors
          </h2>
          
          <p className="text-[#6B6658] text-base sm:text-lg leading-relaxed">
            Our festival brings together vibrant regional talent, small business innovators, farmers, gourmet food trucks, and live performers for an enriching open-air gathering.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          
          <div className="bg-white rounded-[32px] p-7 border border-[#E8E2D6] shadow-sm hover:border-[#5A5A40]/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#F0EBE0] text-[#5A5A40] flex items-center justify-center mb-4 font-bold">
                <ShoppingBag className="w-6 h-6 text-[#5A5A40]" />
              </div>
              <h3 className="text-xl font-serif italic font-bold text-[#3D3A30] mb-2">
                Curated Marketplace & Expo
              </h3>
              <p className="text-[#6B6658] text-sm leading-relaxed">
                Shop handmade products, boutique fashion, artisan jewelry, original artwork, custom home décor, fresh produce, baked goods, and unique gifts from over 100 passionate entrepreneurs.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#E8E2D6] text-xs font-bold uppercase tracking-wider text-[#5A5A40]">
              100+ Local Creators
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-7 border border-[#E8E2D6] shadow-sm hover:border-[#5A5A40]/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#E6E4D9] text-[#5A5A40] flex items-center justify-center mb-4 font-bold">
                <UtensilsCrossed className="w-6 h-6 text-[#5A5A40]" />
              </div>
              <h3 className="text-xl font-serif italic font-bold text-[#3D3A30] mb-2">
                Gourmet Food Trucks & Flavors
              </h3>
              <p className="text-[#6B6658] text-sm leading-relaxed">
                Taste street cuisine from the region's best food trucks, artisanal bakeries, small-batch hot sauces, gourmet popcorn, craft roasted coffees, and refreshing artisanal beverages.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#E8E2D6] text-xs font-bold uppercase tracking-wider text-[#5A5A40]">
              Dedicated Food Truck Row
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-7 border border-[#E8E2D6] shadow-sm hover:border-[#5A5A40]/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#F0EBE0] text-[#5A5A40] flex items-center justify-center mb-4 font-bold">
                <Music className="w-6 h-6 text-[#5A5A40]" />
              </div>
              <h3 className="text-xl font-serif italic font-bold text-[#3D3A30] mb-2">
                Live Stage & Family Activities
              </h3>
              <p className="text-[#6B6658] text-sm leading-relaxed">
                Experience dynamic live musical performances, craft & pottery turning demonstrations, interactive kids creative zones, face painting, and inspiring community civic exhibits.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#E8E2D6] text-xs font-bold uppercase tracking-wider text-[#5A5A40]">
              Amphitheater Performances
            </div>
          </div>

        </div>

        {/* Categories Explorer Section */}
        <div id="categories" className="bg-white rounded-[36px] p-6 sm:p-10 border border-[#E8E2D6] shadow-sm">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-[#E8E2D6] pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] block">
                Diverse Marketplace Showcase
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif italic font-bold text-[#3D3A30] mt-1">
                Explore What You'll Find at the Festival
              </h3>
              <p className="text-xs sm:text-sm text-[#6B6658] mt-1">
                From wheel-thrown pottery to gourmet food trucks and handmade soaps, browse our 12 curated vendor categories.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenAttendeeModal}
                className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#5A5A40] hover:bg-[#464632] transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Ticket className="w-3.5 h-3.5 text-[#F0EBE0]" />
                <span>Get Free Pass</span>
              </button>
            </div>
          </div>

          {/* Category Tabs (12 categories) */}
          <div className="flex flex-wrap gap-2 mb-8">
            {MARKET_CATEGORIES.map((cat) => {
              const isActive = cat.id === activeCategory;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#5A5A40] text-white shadow-sm scale-102'
                      : 'bg-[#F0EBE0] hover:bg-[#E6E4D9] text-[#3D3A30] border border-[#E8E2D6]'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-[#5A5A40]'}>
                    {iconMap[cat.iconName] || <ShoppingBag className="w-4 h-4" />}
                  </span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Category Feature Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FDFBF7] rounded-[32px] p-6 sm:p-8 border border-[#E8E2D6]">
            
            {/* Category Image */}
            <div className="lg:col-span-6 relative rounded-[28px] overflow-hidden shadow-sm border border-[#E8E2D6]">
              <img
                src={selectedCat.image}
                alt={selectedCat.name}
                className="w-full h-64 sm:h-80 object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#5A5A40] text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border border-[#E8E2D6]">
                {selectedCat.vendorCountEstimate}
              </div>
            </div>

            {/* Category Details */}
            <div className="lg:col-span-6 space-y-5">
              <div>
                <h4 className="text-2xl sm:text-3xl font-serif italic font-bold text-[#3D3A30]">
                  {selectedCat.name}
                </h4>
                <p className="text-[#6B6658] text-sm sm:text-base mt-2 leading-relaxed">
                  {selectedCat.description}
                </p>
              </div>

              {/* Sample Items in this Category */}
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] block mb-2.5">
                  Featured Products & Offerings:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedCat.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs sm:text-sm text-[#3D3A30] bg-white px-3.5 py-2.5 rounded-xl border border-[#E8E2D6]"
                    >
                      <Check className="w-4 h-4 text-[#5A5A40] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={onOpenAttendeeModal}
                  className="px-6 py-3 rounded-full font-bold uppercase tracking-wider text-xs text-white bg-[#5A5A40] hover:bg-[#464632] transition-colors shadow-sm flex items-center gap-2"
                >
                  <Ticket className="w-3.5 h-3.5 text-[#F0EBE0]" />
                  <span>RSVP for Free Pass</span>
                </button>

                <button
                  id="overview-apply-category-btn"
                  onClick={onOpenVendorModal || onScrollToVendorBooking}
                  className="px-5 py-3 rounded-full font-bold uppercase tracking-wider text-xs text-[#5A5A40] bg-white hover:bg-[#F0EBE0] border border-[#E8E2D6] transition-colors flex items-center gap-1.5"
                >
                  <span>Apply to Sell in this Category (Pop-up)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
