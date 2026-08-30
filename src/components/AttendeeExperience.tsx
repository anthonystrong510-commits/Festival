import React from 'react';
import { 
  Sun, 
  MapPin, 
  Users, 
  Music, 
  UtensilsCrossed, 
  Heart, 
  Camera, 
  ShoppingBag, 
  Ticket, 
  Compass, 
  Smile, 
  TreePine, 
  Waves, 
  CheckCircle2, 
  Clock, 
  CalendarDays,
  ArrowRight
} from 'lucide-react';
import { ATTENDEE_EXPERIENCES, EVENT_CONFIG, FESTIVAL_LOCATION } from '../data/festivalData';

interface AttendeeExperienceProps {
  onOpenAttendeeModal: () => void;
}

export const AttendeeExperience: React.FC<AttendeeExperienceProps> = ({ onOpenAttendeeModal }) => {
  return (
    <section id="experience" className="py-20 bg-white border-b border-[#E8E2D6] text-[#3D3A30]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-[#5A5A40] bg-[#F0EBE0] border border-[#E8E2D6]">
            <Waves className="w-3.5 h-3.5 text-[#5A5A40]" />
            What You'll Experience
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif italic font-bold text-[#3D3A30]">
            The Open-Air Festival Experience
          </h2>
          
          <p className="text-[#6B6658] text-base sm:text-lg leading-relaxed">
            Step outdoors into a lively open-air festival along scenic promenades. Explore handmade goods, open-air dining, live acoustic sets, and family fun across three unforgettable days.
          </p>
        </div>

        {/* 6 Outdoor Experience Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {ATTENDEE_EXPERIENCES.map((exp) => (
            <div
              key={exp.id}
              className="bg-[#FDFBF7] rounded-[32px] overflow-hidden border border-[#E8E2D6] shadow-sm hover:border-[#5A5A40]/50 hover:shadow-md transition-all flex flex-col group"
            >
              {/* Photo */}
              <div className="relative h-56 sm:h-64 overflow-hidden">
                <img
                  src={exp.image}
                  alt={exp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3D3A30]/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/30 inline-block mb-1">
                    {exp.tagline}
                  </span>
                  <h3 className="font-serif italic font-bold text-xl text-white leading-snug">
                    {exp.title}
                  </h3>
                </div>
              </div>

              {/* Description & Perk */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-sm text-[#6B6658] leading-relaxed">
                  {exp.description}
                </p>

                <div className="pt-3 border-t border-[#E8E2D6] flex items-center gap-2 text-xs font-semibold text-[#5A5A40]">
                  <CheckCircle2 className="w-4 h-4 text-[#5A5A40] shrink-0" />
                  <span>{exp.perk}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Outdoor Festival Feature Banner */}
        <div className="bg-[#F0EBE0] rounded-[36px] p-8 sm:p-12 border border-[#E8E2D6] mb-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#5A5A40] bg-white border border-[#E8E2D6]">
                <Sun className="w-3.5 h-3.5 text-[#5A5A40]" />
                Free Community Admission
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif italic font-bold text-[#3D3A30]">
                A Gathering for Neighbors, Families, Foodies & Art Lovers
              </h3>
              <p className="text-[#6B6658] text-sm sm:text-base leading-relaxed">
                Whether you're shopping for handcrafted jewelry, sharing a picnic basket by the water with friends, sampling slow-smoked BBQ, or watching your kids paint ceramics, {EVENT_CONFIG.name} welcomes everyone with open arms.
              </p>
              <div className="pt-3">
                <button
                  onClick={onOpenAttendeeModal}
                  className="px-7 py-3.5 rounded-full font-bold uppercase tracking-wider text-xs text-white bg-[#5A5A40] hover:bg-[#464632] shadow-sm hover:shadow-md transition-all flex items-center gap-2.5"
                >
                  <Ticket className="w-4 h-4 text-[#F0EBE0]" />
                  <span>Claim Your Free Visitor Pass</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Structured Feature Badges on Right (Image-Free) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto shrink-0 lg:max-w-md">
              <div className="bg-white/80 backdrop-blur-sm p-5 rounded-[24px] border border-[#E8E2D6] shadow-sm flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#F0EBE0] text-[#5A5A40] flex items-center justify-center shrink-0">
                  <Smile className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif italic font-bold text-sm text-[#3D3A30]">Family & Pet Friendly</h4>
                  <p className="text-xs text-[#6B6658] mt-0.5">Welcoming open lawns with space for strollers, blankets, and leashed pets.</p>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-5 rounded-[24px] border border-[#E8E2D6] shadow-sm flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#F0EBE0] text-[#5A5A40] flex items-center justify-center shrink-0">
                  <Music className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif italic font-bold text-sm text-[#3D3A30]">Live Amphitheater Music</h4>
                  <p className="text-xs text-[#6B6658] mt-0.5">Continuous acoustic sets, jazz ensembles, and regional performers.</p>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-5 rounded-[24px] border border-[#E8E2D6] shadow-sm flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#F0EBE0] text-[#5A5A40] flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif italic font-bold text-sm text-[#3D3A30]">100+ Artisans & Makers</h4>
                  <p className="text-xs text-[#6B6658] mt-0.5">Directly meet and support regional craftspeople and small businesses.</p>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-5 rounded-[24px] border border-[#E8E2D6] shadow-sm flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#F0EBE0] text-[#5A5A40] flex items-center justify-center shrink-0">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif italic font-bold text-sm text-[#3D3A30]">Gourmet Food Trucks</h4>
                  <p className="text-xs text-[#6B6658] mt-0.5">Diverse regional street food, fresh baked goods, and artisanal drinks.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visitor Essentials Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#FDFBF7] p-6 rounded-[28px] border border-[#E8E2D6]">
            <div className="w-10 h-10 rounded-full bg-[#F0EBE0] text-[#5A5A40] flex items-center justify-center font-bold mb-3">
              <Ticket className="w-5 h-5" />
            </div>
            <h4 className="font-serif italic font-bold text-lg text-[#3D3A30] mb-1">100% Free Entry</h4>
            <p className="text-xs text-[#6B6658] leading-relaxed">
              No tickets or gate fees required. Simply arrive with friends and family to enjoy the open festival grounds.
            </p>
          </div>

          <div className="bg-[#FDFBF7] p-6 rounded-[28px] border border-[#E8E2D6]">
            <div className="w-10 h-10 rounded-full bg-[#F0EBE0] text-[#5A5A40] flex items-center justify-center font-bold mb-3">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="font-serif italic font-bold text-lg text-[#3D3A30] mb-1">Ample Free Parking</h4>
            <p className="text-xs text-[#6B6658] leading-relaxed">
              Multiple free parking areas and open visitor surface lots located conveniently adjacent to festival entrance gates.
            </p>
          </div>

          <div className="bg-[#FDFBF7] p-6 rounded-[28px] border border-[#E8E2D6]">
            <div className="w-10 h-10 rounded-full bg-[#F0EBE0] text-[#5A5A40] flex items-center justify-center font-bold mb-3">
              <Smile className="w-5 h-5" />
            </div>
            <h4 className="font-serif italic font-bold text-lg text-[#3D3A30] mb-1">Dog & Stroller Friendly</h4>
            <p className="text-xs text-[#6B6658] leading-relaxed">
              Well-behaved leashed dogs are warmly welcomed! Wide paved walkways are easily accessible for strollers and wheelchairs.
            </p>
          </div>

          <div className="bg-[#FDFBF7] p-6 rounded-[28px] border border-[#E8E2D6]">
            <div className="w-10 h-10 rounded-full bg-[#F0EBE0] text-[#5A5A40] flex items-center justify-center font-bold mb-3">
              <Sun className="w-5 h-5" />
            </div>
            <h4 className="font-serif italic font-bold text-lg text-[#3D3A30] mb-1">Scenic Festival Lawn</h4>
            <p className="text-xs text-[#6B6658] leading-relaxed">
              Bring a lawn blanket or camp chairs to relax on the grass, listen to live bands, and enjoy the sunny festival atmosphere.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
