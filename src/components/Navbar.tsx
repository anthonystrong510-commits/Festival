import React, { useState, useEffect, useRef } from 'react';
import {
  Store,
  Calendar,
  MapPin,
  Menu,
  X,
  Mail,
  Ticket,
  Sun,
  ChevronDown,
  Compass,
  ShieldCheck,
  Sparkles,
  Globe,
  Map,
  HelpCircle,
  Clock
} from 'lucide-react';
import { EVENT_CONFIG, FESTIVAL_CONTACT_EMAIL } from '../data/festivalData';

interface NavbarProps {
  onOpenAttendeeModal: () => void;
  onScrollToVendorBooking: () => void;
  onOpenVendorModal?: () => void;
  onNavigateToAdmin?: () => void;
}

const QUICK_METRO_MARKETS = [
  { label: 'Miami, FL (Farmers Markets)', city: 'Miami', stateCode: 'FL' },
  { label: 'Houston, TX', city: 'Houston', stateCode: 'TX' },
  { label: 'Los Angeles, CA', city: 'Los Angeles', stateCode: 'CA' },
  { label: 'Chicago, IL', city: 'Chicago', stateCode: 'IL' },
  { label: 'New York City, NY', city: 'New York City', stateCode: 'NY' },
  { label: 'Dallas, TX', city: 'Dallas', stateCode: 'TX' },
  { label: 'Atlanta, GA', city: 'Atlanta', stateCode: 'GA' },
  { label: 'Seattle, WA', city: 'Seattle', stateCode: 'WA' },
  { label: 'Denver, CO', city: 'Denver', stateCode: 'CO' },
  { label: 'Columbia, SC (Host City)', city: 'Columbia', stateCode: 'SC' }
];

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAttendeeModal,
  onScrollToVendorBooking,
  onOpenVendorModal,
  onNavigateToAdmin
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuOpen &&
        menuContainerRef.current &&
        !menuContainerRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const navLinks = [
    { label: 'Events', href: '#events', icon: Calendar },
    { label: 'Experience', href: '#experience', icon: Sparkles },
    { label: 'Categories', href: '#categories', icon: Store },
    { label: 'Schedule', href: '#schedule', icon: Clock },
    { label: 'Grounds Map', href: '#map', icon: Map },
    { label: 'FAQ', href: '#faq', icon: HelpCircle }
  ];

  const triggerDirectoryFilter = (detail: {
    weekend?: 'all' | 'dec' | 'jan';
    city?: string;
    stateCode?: string;
    viewMode?: 'all' | 'events' | 'states';
    openStatesDirectory?: boolean;
    reset?: boolean;
  }) => {
    window.dispatchEvent(new CustomEvent('festival:filter-directory', { detail }));
    setMenuOpen(false);
    const el = document.getElementById('events');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-navbar"
      ref={menuContainerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FDFBF7]/95 backdrop-blur-md shadow-sm border-b border-[#E8E2D6] text-[#3D3A30] py-2.5 sm:py-3'
          : 'bg-[#FDFBF7]/90 backdrop-blur-sm border-b border-[#E8E2D6]/80 text-[#3D3A30] py-3 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2">
        {/* Logo & Festival Name */}
        <a
          href="#"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-2.5 sm:gap-3 group min-w-0 shrink"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#5A5A40] text-white flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform shrink-0">
            <Sun className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-serif italic font-bold text-base sm:text-lg md:text-xl text-[#5A5A40] tracking-tight group-hover:opacity-90 transition-opacity leading-tight truncate">
              {EVENT_CONFIG.shortName}
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-widest font-semibold text-[#3D3A30]/70 truncate">
              Official 50-State Marketplace & Expo
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-5 text-xs font-semibold tracking-wider uppercase">
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
            Booth Pricing
          </a>
        </nav>

        {/* Action CTAs + Universal Menu Button (Visible on both Big Screens and Mobile/Tablet) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Desktop / Tablet Free Pass CTA */}
          <button
            id="nav-attendee-rsvp-btn"
            onClick={onOpenAttendeeModal}
            className="px-3 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white bg-[#5A5A40] hover:bg-[#464632] shadow-sm transition-all flex items-center gap-1.5"
          >
            <Ticket className="w-3.5 h-3.5 text-[#F0EBE0] shrink-0" />
            <span>Free Pass</span>
          </button>

          {/* Desktop / Tablet Apply as Vendor CTA */}
          <button
            id="nav-book-vendor-spot-btn"
            onClick={onOpenVendorModal || onScrollToVendorBooking}
            className="hidden md:flex px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-[#5A5A40] hover:text-[#3D3A30] bg-white hover:bg-[#F0EBE0] border border-[#E8E2D6] shadow-sm transition-all items-center gap-1.5"
          >
            <Store className="w-3.5 h-3.5 text-[#5A5A40] shrink-0" />
            <span>Apply as Vendor</span>
          </button>

          {/* Interactive Menu & Quick Filters Toggle (Works on Mobile, Tablet, AND Big Desktop Screens) */}
          <button
            id="universal-nav-menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            className={`px-3 sm:px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all flex items-center gap-1.5 ${
              menuOpen
                ? 'bg-[#3D3A30] text-white border-[#3D3A30] shadow-md'
                : 'bg-white text-[#3D3A30] border-[#E8E2D6] hover:bg-[#F0EBE0]'
            }`}
            aria-label="Toggle Explore & Navigation Menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X className="w-4 h-4 shrink-0" />
            ) : (
              <Menu className="w-4 h-4 shrink-0" />
            )}
            <span className="hidden sm:inline">Explore & Menu</span>
            <ChevronDown
              className={`hidden sm:inline w-3.5 h-3.5 transition-transform duration-200 ${
                menuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Responsive Mega-Menu & Navigation Drawer (Mobile, Tablet & Desktop Big Screens) */}
      {menuOpen && (
        <div className="bg-[#FDFBF7] border-b border-[#E8E2D6] shadow-2xl max-h-[85vh] overflow-y-auto animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
              {/* Column 1: Festival Sections & Quick Actions (4 cols on desktop) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="flex items-center justify-between border-b border-[#E8E2D6] pb-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#5A5A40] flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" />
                    Festival Navigation
                  </span>
                  <span className="text-[10px] font-semibold text-[#6B6658]">Quick Jump</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <a
                        key={link.label}
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="px-3 py-2.5 rounded-xl text-xs font-bold text-[#3D3A30] bg-white hover:bg-[#F0EBE0] hover:text-[#5A5A40] border border-[#E8E2D6] flex items-center gap-2 transition-colors"
                      >
                        <Icon className="w-3.5 h-3.5 text-[#5A5A40] shrink-0" />
                        <span className="truncate">{link.label}</span>
                      </a>
                    );
                  })}
                  <a
                    href="#vendor-booking"
                    onClick={() => setMenuOpen(false)}
                    className="col-span-2 px-3 py-2.5 rounded-xl text-xs font-bold text-[#5A5A40] bg-[#F0EBE0]/70 hover:bg-[#F0EBE0] border border-[#5A5A40]/20 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Store className="w-3.5 h-3.5 text-[#5A5A40]" />
                    <span>Vendor Booth Space & Pricing</span>
                  </a>
                </div>

                {/* Primary Portal Actions */}
                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenAttendeeModal();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#5A5A40] hover:bg-[#464632] flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <Ticket className="w-4 h-4 text-[#F0EBE0]" />
                    Claim Free Visitor Pass
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      if (onOpenVendorModal) {
                        onOpenVendorModal();
                      } else {
                        onScrollToVendorBooking();
                      }
                    }}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-[#3D3A30] bg-white hover:bg-[#F0EBE0] border border-[#E8E2D6] flex items-center justify-center gap-2 transition-colors"
                  >
                    <Store className="w-4 h-4 text-[#5A5A40]" />
                    Apply as Vendor (Instant Booth Form)
                  </button>
                </div>
              </div>

              {/* Column 2: 2026–2027 Tour Weekends & Directory Views (4 cols on desktop) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="flex items-center justify-between border-b border-[#E8E2D6] pb-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#5A5A40] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    100 Nationwide State Events
                  </span>
                  <span className="text-[10px] font-semibold text-[#6B6658]">Fri, Sat & Sun</span>
                </div>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() =>
                      triggerDirectoryFilter({ weekend: 'all', reset: true })
                    }
                    className="w-full text-left p-3 rounded-xl bg-white hover:bg-[#F0EBE0]/70 border border-[#E8E2D6] transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-[#3D3A30] group-hover:text-[#5A5A40]">
                        All 100 State Events (50 US States)
                      </div>
                      <div className="text-[11px] text-[#6B6658]">
                        View all major-city markets & street festivals
                      </div>
                    </div>
                    <Globe className="w-4 h-4 text-[#5A5A40] shrink-0" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      triggerDirectoryFilter({ weekend: 'dec', viewMode: 'events' })
                    }
                    className="w-full text-left p-3 rounded-xl bg-white hover:bg-[#F0EBE0]/70 border border-[#E8E2D6] transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-[#3D3A30] group-hover:text-[#5A5A40]">
                        Dec 18–20, 2026 • Fri–Sun
                      </div>
                      <div className="text-[11px] text-[#6B6658]">
                        End Week of December • 50 State Markets
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-[#F0EBE0] text-[#5A5A40] text-[10px] font-bold">
                      50 Events
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      triggerDirectoryFilter({ weekend: 'jan', viewMode: 'events' })
                    }
                    className="w-full text-left p-3 rounded-xl bg-white hover:bg-[#F0EBE0]/70 border border-[#E8E2D6] transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-[#3D3A30] group-hover:text-[#5A5A40]">
                        Jan 29–31, 2027 • Fri–Sun
                      </div>
                      <div className="text-[11px] text-[#6B6658]">
                        End Week of January • 50 State Markets
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-[#F0EBE0] text-[#5A5A40] text-[10px] font-bold">
                      50 Events
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      triggerDirectoryFilter({
                        viewMode: 'states',
                        openStatesDirectory: true
                      })
                    }
                    className="w-full text-left p-3 rounded-xl bg-white hover:bg-[#F0EBE0]/70 border border-[#E8E2D6] transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-[#3D3A30] group-hover:text-[#5A5A40]">
                        50-State Vendor Hubs Directory
                      </div>
                      <div className="text-[11px] text-[#6B6658]">
                        Browse regional vendor coordinators by state
                      </div>
                    </div>
                    <MapPin className="w-4 h-4 text-[#5A5A40] shrink-0" />
                  </button>
                </div>
              </div>

              {/* Column 3: Popular Metropolitan Markets Quick Filter (4 cols on desktop) */}
              <div className="md:col-span-2 lg:col-span-4 space-y-4">
                <div className="flex items-center justify-between border-b border-[#E8E2D6] pb-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#5A5A40] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    Popular Metropolitan Markets
                  </span>
                  <span className="text-[10px] font-semibold text-[#6B6658]">
                    Click city to filter
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {QUICK_METRO_MARKETS.map((m) => (
                    <button
                      key={m.label}
                      type="button"
                      onClick={() =>
                        triggerDirectoryFilter({
                          city: m.city,
                          stateCode: m.stateCode,
                          viewMode: 'events'
                        })
                      }
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-[#5A5A40] text-[#3D3A30] hover:text-white border border-[#E8E2D6] transition-colors"
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {/* Support & Admin Footer inside Menu */}
                <div className="pt-3 border-t border-[#E8E2D6] flex flex-wrap items-center justify-between gap-2 text-xs text-[#6B6658]">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#5A5A40]" />
                    <span className="truncate">{FESTIVAL_CONTACT_EMAIL}</span>
                  </span>
                  {onNavigateToAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onNavigateToAdmin();
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#5A5A40] hover:text-[#3D3A30] underline underline-offset-2"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Admin Portal
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
