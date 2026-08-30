import React, { useState, useEffect } from 'react';
import { Store, Calendar, MapPin, Menu, X, Mail, Ticket, ArrowRight, Sun, ShoppingBag } from 'lucide-react';
import { EVENT_CONFIG, FESTIVAL_CONTACT_EMAIL } from '../data/festivalData';

interface NavbarProps {
  onOpenAttendeeModal: () => void;
  onScrollToVendorBooking: () => void;
  onOpenVendorModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAttendeeModal, onScrollToVendorBooking, onOpenVendorModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Experience', href: '#experience' },
    { label: 'Categories', href: '#categories' },
    { label: 'Schedule', href: '#schedule' },
    { label: 'Grounds Map', href: '#map' },
    { label: 'Spotlights', href: '#spotlights' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <>
      <header
        id="main-navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FDFBF7]/95 backdrop-blur-md shadow-sm border-b border-[#E8E2D6] text-[#3D3A30] py-3'
            : 'bg-[#FDFBF7]/85 backdrop-blur-sm border-b border-[#E8E2D6]/80 text-[#3D3A30] py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Festival Name */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-[#5A5A40] text-white flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform shrink-0">
              <Sun className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif italic font-bold text-lg sm:text-xl text-[#5A5A40] tracking-tight group-hover:opacity-90 transition-opacity leading-tight">
                {EVENT_CONFIG.shortName}
              </span>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-widest font-semibold text-[#3D3A30]/70">
                Official Marketplace & Expo Portal
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-xs font-semibold tracking-wider uppercase">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[#3D3A30]/80 hover:text-[#5A5A40] transition-colors py-1 hover:border-b-2 hover:border-[#5A5A40]"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#vendor-booking"
              className="text-[#5A5A40] hover:text-[#3D3A30] transition-colors py-1 border-b border-[#5A5A40]/40 font-bold"
            >
              Vendor Info
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              id="nav-attendee-rsvp-btn"
              onClick={onOpenAttendeeModal}
              className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#5A5A40] hover:bg-[#464632] shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5"
            >
              <Ticket className="w-3.5 h-3.5 text-[#F0EBE0]" />
              <span>Free Pass</span>
            </button>

            <button
              id="nav-book-vendor-spot-btn"
              onClick={onOpenVendorModal || onScrollToVendorBooking}
              className="px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#5A5A40] hover:text-[#3D3A30] bg-white hover:bg-[#F0EBE0] border border-[#E8E2D6] shadow-sm transition-all flex items-center gap-1.5"
            >
              <Store className="w-3.5 h-3.5 text-[#5A5A40]" />
              <span>Apply as Vendor</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenAttendeeModal}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#5A5A40]"
            >
              Free Pass
            </button>
            <button
              id="mobile-nav-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full bg-white border border-[#E8E2D6] text-[#3D3A30] hover:bg-[#F0EBE0]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FDFBF7] border-b border-[#E8E2D6] px-5 pt-3 pb-6 space-y-3 shadow-lg animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="grid grid-cols-2 gap-2 pt-1 pb-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-[#3D3A30] hover:bg-[#F0EBE0] hover:text-[#5A5A40]"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#vendor-booking"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-[#5A5A40] bg-[#F0EBE0] col-span-2 text-center"
              >
                Vendor Info & Booking
              </a>
            </div>

            <div className="pt-2 border-t border-[#E8E2D6] flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAttendeeModal();
                }}
                className="w-full py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#5A5A40] hover:bg-[#464632] flex items-center justify-center gap-2 shadow"
              >
                <Ticket className="w-4 h-4 text-[#F0EBE0]" />
                Claim Free Visitor Pass
              </button>

              <button
                id="mobile-nav-apply-vendor-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenVendorModal) {
                    onOpenVendorModal();
                  } else {
                    onScrollToVendorBooking();
                  }
                }}
                className="w-full py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#5A5A40] bg-white border border-[#E8E2D6] hover:bg-[#F0EBE0] flex items-center justify-center gap-2"
              >
                <Store className="w-4 h-4 text-[#5A5A40]" />
                Apply for Vendor Space (Pop-up)
              </button>
            </div>

            <div className="pt-2 text-center text-xs text-[#6B6658] flex items-center justify-center gap-1">
              <Mail className="w-3.5 h-3.5 text-[#5A5A40]" />
              <span>Contact: {FESTIVAL_CONTACT_EMAIL}</span>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
