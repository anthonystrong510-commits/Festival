import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AttendeeExperience } from './components/AttendeeExperience';
import { FestivalOverview } from './components/FestivalOverview';
import { ScheduleSection } from './components/ScheduleSection';
import { InteractiveMap } from './components/InteractiveMap';
import { SpotlightSection } from './components/SpotlightSection';
import { VendorExpoBanner } from './components/VendorExpoBanner';
import { VendorBookingPortal } from './components/VendorBookingPortal';
import { FaqAndGuidelines } from './components/FaqAndGuidelines';
import { AttendeeRsvpModal } from './components/AttendeeRsvpModal';
import { VendorApplicationModal } from './components/VendorApplicationModal';
import { Footer } from './components/Footer';
import { Store, Ticket, Compass } from 'lucide-react';
import { BoothId } from './types';

export default function App() {
  const [attendeeModalOpen, setAttendeeModalOpen] = useState(false);
  const [vendorModalOpen, setVendorModalOpen] = useState(false);
  const [modalBoothId, setModalBoothId] = useState<BoothId>('tent-10x10');
  const [modalDays, setModalDays] = useState<Array<'fri' | 'sat' | 'sun'>>(['fri', 'sat', 'sun']);

  const scrollToVendorBooking = () => {
    const el = document.getElementById('vendor-booking');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenAttendeeModal = () => {
    setAttendeeModalOpen(true);
  };

  const handleOpenVendorModal = (
    boothId: BoothId = 'tent-10x10', 
    days: Array<'fri' | 'sat' | 'sun'> = ['fri', 'sat', 'sun']
  ) => {
    setModalBoothId(boothId);
    if (days && days.length >= 2) {
      setModalDays(days);
    }
    setVendorModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#3D3A30] flex flex-col selection:bg-[#5A5A40] selection:text-white font-sans">
      
      {/* Sticky Navigation */}
      <Navbar
        onOpenAttendeeModal={handleOpenAttendeeModal}
        onScrollToVendorBooking={scrollToVendorBooking}
        onOpenVendorModal={() => handleOpenVendorModal('tent-10x10')}
      />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero
          onOpenAttendeeModal={handleOpenAttendeeModal}
          onScrollToVendorBooking={scrollToVendorBooking}
          onOpenVendorModal={() => handleOpenVendorModal('tent-10x10')}
        />

        {/* Outdoor Attendee Experience & Waterfront Discovery */}
        <AttendeeExperience
          onOpenAttendeeModal={handleOpenAttendeeModal}
        />

        {/* Festival Overview & 12 Market Categories */}
        <FestivalOverview
          onScrollToVendorBooking={scrollToVendorBooking}
          onOpenAttendeeModal={handleOpenAttendeeModal}
          onOpenVendorModal={() => handleOpenVendorModal('tent-10x10')}
        />

        {/* Official Schedule & Timetable */}
        <ScheduleSection />

        {/* Interactive Grounds & Booth Map */}
        <InteractiveMap />

        {/* Featured Vendor Spotlights & Photo Submissions */}
        <SpotlightSection
          onScrollToVendorBooking={scrollToVendorBooking}
          onOpenVendorModal={() => handleOpenVendorModal('tent-10x10')}
        />

        {/* Vendors Needed & Exposure Banner */}
        <VendorExpoBanner
          onOpenVendorModal={() => handleOpenVendorModal('tent-10x10')}
        />

        {/* Dedicated Vendor Booking Portal & Space Rates */}
        <VendorBookingPortal 
          onOpenVendorModal={handleOpenVendorModal}
        />

        {/* FAQ & Guidelines Accordion */}
        <FaqAndGuidelines />
      </main>

      {/* Footer */}
      <Footer
        onScrollToVendorBooking={scrollToVendorBooking}
        onOpenAttendeeModal={handleOpenAttendeeModal}
        onOpenVendorModal={() => handleOpenVendorModal('tent-10x10')}
      />

      {/* Attendee RSVP / Free Ticket Pass Modal */}
      <AttendeeRsvpModal
        isOpen={attendeeModalOpen}
        onClose={() => setAttendeeModalOpen(false)}
      />

      {/* Vendor Application Pop-Up Dialog Form Modal */}
      <VendorApplicationModal
        isOpen={vendorModalOpen}
        onClose={() => setVendorModalOpen(false)}
        initialBoothId={modalBoothId}
        initialDays={modalDays}
      />

      {/* Floating Mobile Quick Action Bar */}
      <div className="fixed bottom-4 left-4 right-4 sm:hidden z-40 flex items-center gap-2 bg-[#3D3A30]/95 backdrop-blur-md p-2 rounded-full border border-[#E8E2D6]/40 shadow-2xl">
        <button
          onClick={handleOpenAttendeeModal}
          className="flex-1 py-2.5 rounded-full bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md"
        >
          <Ticket className="w-4 h-4 text-[#F0EBE0]" />
          <span>Free Pass</span>
        </button>
        <button
          onClick={() => handleOpenVendorModal('tent-10x10')}
          className="flex-1 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
        >
          <Store className="w-4 h-4 text-[#F0EBE0]" />
          <span>Vendor App</span>
        </button>
      </div>

    </div>
  );
}
