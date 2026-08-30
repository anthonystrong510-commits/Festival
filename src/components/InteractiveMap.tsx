import React, { useState } from 'react';
import { 
  MapPin, 
  Store, 
  Utensils, 
  Music, 
  ShieldCheck, 
  Accessibility, 
  Info,
  Waves,
  Car,
  Compass
} from 'lucide-react';
import { BOOTH_TIERS, EVENT_CONFIG } from '../data/festivalData';

interface ZoneInfo {
  id: string;
  name: string;
  type: string;
  boothIdRef?: string;
  description: string;
  rate?: string;
  color: string;
  coordinates: { x: number; y: number };
}

export const InteractiveMap: React.FC = () => {
  const [activeZone, setActiveZone] = useState<string>('artisan-village');

  const zones: ZoneInfo[] = [
    {
      id: 'artisan-village',
      name: 'Artisan Village Promenade',
      type: 'Tents & Crafts (10x10)',
      boothIdRef: 'tent-10x10',
      description: 'Lively shaded walkway featuring handmade crafts, ceramics, jewelry, fine art, and home accents.',
      rate: '$70 / day',
      color: '#f59e0b',
      coordinates: { x: 38, y: 48 },
    },
    {
      id: 'main-street-corners',
      name: 'Central Marketplace Corners',
      type: 'Prime Corner Placements (10x10)',
      boothIdRef: 'corner-10x10',
      description: 'High-traffic intersection corners with 360-degree customer foot traffic and dual open fronts.',
      rate: '$180 / day',
      color: '#d97706',
      coordinates: { x: 52, y: 42 },
    },
    {
      id: 'food-truck-alley',
      name: 'Dining & Food Truck Row',
      type: 'Gourmet Food Trucks & Trailers',
      boothIdRef: 'food-truck',
      description: 'Designated festival row for food trucks and trailers with picnic dining lawn and waste disposal access.',
      rate: '$190 / day',
      color: '#10b981',
      coordinates: { x: 25, y: 70 },
    },
    {
      id: 'expo-boulevard',
      name: 'Central Marketplace Boulevard (10x20)',
      type: 'Double Width Booths (10x20)',
      boothIdRef: 'tent-10x20',
      description: 'Expanded dual-space booths with 20ft display frontage for boutiques and larger merchandise.',
      rate: '$100 / day',
      color: '#8b5cf6',
      coordinates: { x: 62, y: 55 },
    },
    {
      id: 'flagship-lawn',
      name: 'Event Lawn Flagship Pavilion (20x20)',
      type: 'Extra Large Pavilion',
      boothIdRef: 'extra-large-20x20',
      description: 'Spacious 400 sq ft footprint for major exhibitions, experiential lounges, and large brand displays.',
      rate: '$180 / day',
      color: '#ec4899',
      coordinates: { x: 78, y: 65 },
    },
    {
      id: 'live-amphitheater',
      name: 'Festival Amphitheater Stage',
      type: 'Live Music & Performances',
      description: 'Central stage hosting live jazz, R&B, cultural dance, acoustic sets, and community award ceremonies.',
      rate: 'Public Stage Area',
      color: '#3b82f6',
      coordinates: { x: 45, y: 22 },
    },
    {
      id: 'handicap-parking',
      name: 'Accessible Parking & Loading Gate',
      type: 'Designated Accessibility Zone',
      description: 'Dedicated parking and ramp access close to booth spaces for vendors and visitors with accessibility needs.',
      rate: 'Special Provision (Reserve in advance)',
      color: '#2563eb',
      coordinates: { x: 82, y: 25 },
    },
  ];

  const currentZone = zones.find((z) => z.id === activeZone) || zones[0];

  return (
    <section id="map" className="py-20 bg-[#FDFBF7] text-[#3D3A30] border-b border-[#E8E2D6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-[#5A5A40] bg-[#F0EBE0] border border-[#E8E2D6]">
            <Compass className="w-3.5 h-3.5 text-[#5A5A40]" />
            Festival Grounds & Zone Map
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif italic font-bold text-[#3D3A30]">
            Interactive Grounds & Zone Map
          </h2>
          
          <p className="text-[#6B6658] text-base sm:text-lg">
            Explore our curated layout and marketplace zones. Click any zone to view booth dimensions, rates, and surrounding attractions.
          </p>
        </div>

        {/* Map Interactive Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Visual Interactive SVG Map Canvas */}
          <div className="lg:col-span-8 bg-white rounded-[36px] p-6 sm:p-8 border border-[#E8E2D6] shadow-sm relative overflow-hidden">
            
            {/* Grounds layout backdrop */}
            <div className="relative w-full aspect-[16/10] bg-[#F0EBE0]/60 rounded-[24px] border border-[#E8E2D6] p-4 flex flex-col justify-between overflow-hidden">
              
              {/* Event Area Graphic */}
              <div className="absolute top-0 left-0 right-0 h-28 bg-[#5A5A40]/10 rounded-b-[60px] border-b border-[#5A5A40]/20 flex items-center justify-center pointer-events-none">
                <span className="text-[#5A5A40] text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Waves className="w-4 h-4 text-[#5A5A40]" />
                  {EVENT_CONFIG.venueArea}
                </span>
              </div>

              {/* Decorative pathways */}
              <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-28 left-10 right-10 h-12 border-y-2 border-dashed border-[#5A5A40]" />
                <div className="absolute top-28 left-1/2 w-12 bottom-10 -translate-x-1/2 border-x-2 border-dashed border-[#5A5A40]" />
              </div>

              {/* Map Title Tag */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#E8E2D6] text-xs font-bold text-[#3D3A30] flex items-center gap-1.5 shadow-sm">
                  <MapPin className="w-3.5 h-3.5 text-[#5A5A40]" />
                  <span>Marketplace & Festival Grounds</span>
                </div>
                <div className="text-[11px] font-medium text-[#7A7566] bg-white/80 px-2.5 py-1 rounded-full border border-[#E8E2D6]">
                  Click Pins to Inspect
                </div>
              </div>

              {/* Interactive Zone Markers */}
              <div className="relative w-full h-full my-auto">
                {zones.map((zone) => {
                  const isActive = zone.id === activeZone;
                  return (
                    <button
                      key={zone.id}
                      onClick={() => setActiveZone(zone.id)}
                      style={{
                        left: `${zone.coordinates.x}%`,
                        top: `${zone.coordinates.y}%`,
                      }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all z-20 focus:outline-none`}
                    >
                      {/* Pulse effect if active */}
                      {isActive && (
                        <span
                          className="absolute -inset-2 rounded-full border-2 border-[#5A5A40] animate-ping opacity-60"
                        />
                      )}
                      
                      <div
                        className={`px-3 py-1.5 rounded-full border shadow-sm flex items-center gap-1.5 transition-transform group-hover:scale-105 ${
                          isActive 
                            ? 'bg-[#5A5A40] text-white border-[#5A5A40] scale-105' 
                            : 'bg-white text-[#3D3A30] border-[#E8E2D6] hover:border-[#5A5A40]'
                        }`}
                      >
                        <Store className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
                          {zone.name.split(' ')[0]}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Map Legend */}
              <div className="relative z-10 flex flex-wrap items-center justify-between text-[11px] text-[#6B6658] bg-white/90 backdrop-blur-md p-2.5 rounded-2xl border border-[#E8E2D6] gap-2">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5A5A40]" />
                  10×10 Standard ($70/day)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#464632]" />
                  Food Trucks ($190/day)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7A7566]" />
                  Corner Spots ($180/day)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8E8B7B]" />
                  10×20 Double ($100/day)
                </span>
              </div>

            </div>

          </div>

          {/* Right Selected Zone Inspection Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[36px] p-6 sm:p-8 border border-[#E8E2D6] shadow-sm space-y-5">
              
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#5A5A40]">
                  Zone Inspector
                </span>
                <h3 className="text-xl sm:text-2xl font-serif italic font-bold text-[#3D3A30] mt-1">
                  {currentZone.name}
                </h3>
                <span className="text-xs font-medium text-[#7A7566] block mt-0.5">
                  {currentZone.type}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D6] space-y-2">
                <div className="flex items-center justify-between text-xs text-[#7A7566]">
                  <span>Vendor Daily Rate:</span>
                  <span className="text-base font-serif italic font-bold text-[#5A5A40]">
                    {currentZone.rate}
                  </span>
                </div>
                <p className="text-xs text-[#6B6658] leading-relaxed pt-1">
                  {currentZone.description}
                </p>
              </div>

              {/* Quick Perks for this zone */}
              <div className="space-y-2 text-xs text-[#6B6658]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#5A5A40] shrink-0" />
                  <span>24-Hour security patrol on 2–3 consecutive day bookings</span>
                </div>
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-[#5A5A40] shrink-0" />
                  <span>1 Table & 2 Chairs provided with registration</span>
                </div>
                <div className="flex items-center gap-2">
                  <Accessibility className="w-4 h-4 text-[#5A5A40] shrink-0" />
                  <span>Paved pathways for accessible loading and patron strollers</span>
                </div>
              </div>

              <a
                href="#vendor-booking"
                className="w-full py-3 rounded-full font-bold uppercase tracking-wider text-xs text-white bg-[#5A5A40] hover:bg-[#464632] flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Book a Space in This Zone</span>
              </a>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
