import React, { useState, useEffect } from 'react';
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
import { KingAdminPortal } from './components/admin/KingAdminPortal';
import { PublicInvoiceView } from './components/checkout/PublicInvoiceView';
import { Store, Ticket } from 'lucide-react';
import { BoothId } from './types';
import { updateDocumentHead } from './lib/headManager';

function getInvoiceFromUrl(): string | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const queryInv = params.get('invoice') || params.get('inv') || params.get('checkout');
    if (queryInv) return queryInv.trim();

    const path = window.location.pathname;
    const match = path.match(/^\/(?:invoice|invoices|checkout)\/([^/?#]+)/i);
    if (match && match[1]) return decodeURIComponent(match[1].trim());

    const hash = window.location.hash;
    if (hash) {
      if (hash.startsWith('#invoice=')) return decodeURIComponent(hash.replace('#invoice=', '').trim());
      const hashMatch = hash.match(/^#(?:invoice|invoices|checkout)\/([^/?#]+)/i);
      if (hashMatch && hashMatch[1]) return decodeURIComponent(hashMatch[1].trim());
    }
  } catch (e) {
    console.warn('Failed to parse URL for invoice:', e);
  }
  return null;
}

export default function App() {
  const [isAdminView, setIsAdminView] = useState(() => {
    return (
      window.location.pathname.startsWith('/kingadmin') ||
      window.location.hash === '#kingadmin'
    );
  });

  const [activeInvoiceId, setActiveInvoiceId] = useState<string | null>(() => getInvoiceFromUrl());

  const [attendeeModalOpen, setAttendeeModalOpen] = useState(false);
  const [vendorModalOpen, setVendorModalOpen] = useState(false);
  const [modalBoothId, setModalBoothId] = useState<BoothId>('tent-10x10');
  const [modalDays, setModalDays] = useState<Array<'fri' | 'sat' | 'sun'>>(['fri', 'sat', 'sun']);

  // Dynamic Document Head / SEO Updates for public and admin navigation
  useEffect(() => {
    if (isAdminView) {
      updateDocumentHead({
        title: 'KingAdmin Operations Suite | Community Vendor Marketplace & Festival Expo',
        description: 'Secure administrator control center for managing vendor applications, booth space maps, attendee passes, anti-spam email templates, and SMTP deliverability.',
        canonicalPath: '/kingadmin',
        noIndex: true
      });
    } else if (activeInvoiceId) {
      updateDocumentHead({
        title: `Invoice Checkout Portal | Columbia Community Vendor Marketplace`,
        description: 'Official payment portal for reserved vendor booth space, electrical hookups, and festival showcase badges.',
        canonicalPath: `/?invoice=${encodeURIComponent(activeInvoiceId)}`,
        noIndex: true
      });
    } else {
      updateDocumentHead({
        title: 'Community Vendor Marketplace & Festival Expo | Artisan, Food & Music Showcase',
        description: 'Join us for a 3-day premier community marketplace bringing together artisan makers, farmers, food trucks, craft beverage creators, and live entertainment. Free passes available.',
        canonicalPath: '/',
        noIndex: false,
        keywords: [
          'community marketplace',
          'artisan craft festival',
          'vendor application',
          'food truck rally',
          'columbia festival expo',
          'outdoor farmers market',
          'local business showcase',
          'live music festival'
        ]
      });
    }
  }, [isAdminView, activeInvoiceId]);

  // Sync URL changes and popstate (e.g. Back button or Direct URL input)
  useEffect(() => {
    const handleLocationChange = () => {
      const isNowAdmin = 
        window.location.pathname.startsWith('/kingadmin') ||
        window.location.hash === '#kingadmin';
      setIsAdminView(isNowAdmin);
      setActiveInvoiceId(getInvoiceFromUrl());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/kingadmin');
    setIsAdminView(true);
    setActiveInvoiceId(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const navigateToPublic = () => {
    window.history.pushState({}, '', '/');
    setIsAdminView(false);
    setActiveInvoiceId(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleExitInvoiceView = () => {
    window.history.pushState({}, '', '/');
    setActiveInvoiceId(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

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

  // If in Admin Mode, render the comprehensive KingAdmin portal
  if (isAdminView) {
    return <KingAdminPortal onExitAdmin={navigateToPublic} />;
  }

  // If in Public Invoice / Checkout Mode (from email invoice link ?invoice=... or /invoice/...)
  if (activeInvoiceId) {
    return (
      <PublicInvoiceView 
        invoiceId={activeInvoiceId} 
        onExit={handleExitInvoiceView} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#3D3A30] flex flex-col selection:bg-[#5A5A40] selection:text-white font-sans">
      
      {/* Sticky Navigation */}
      <Navbar
        onOpenAttendeeModal={handleOpenAttendeeModal}
        onScrollToVendorBooking={scrollToVendorBooking}
        onOpenVendorModal={() => handleOpenVendorModal('tent-10x10')}
        onNavigateToAdmin={navigateToAdmin}
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
        onNavigateToAdmin={navigateToAdmin}
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

