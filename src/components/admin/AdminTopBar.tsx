import React from 'react';
import { 
  Menu, 
  Search, 
  ExternalLink, 
  Plus, 
  Database, 
  CheckCircle2, 
  RefreshCw,
  Bell
} from 'lucide-react';
import { AdminTab } from '../../types';

interface AdminTopBarProps {
  currentTab: AdminTab;
  onOpenMobileMenu: () => void;
  onExitAdmin: () => void;
  onSeedData: () => void;
  isSeeding: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenNewVendorModal?: () => void;
  tabTitles: Record<AdminTab, { title: string; subtitle: string }>;
}

export function AdminTopBar({
  currentTab,
  onOpenMobileMenu,
  onExitAdmin,
  onSeedData,
  isSeeding,
  searchQuery,
  onSearchChange,
  onOpenNewVendorModal,
  tabTitles
}: AdminTopBarProps) {
  const currentInfo = tabTitles[currentTab] || { title: 'Admin Panel', subtitle: 'Festival Management' };

  return (
    <header className="h-16 bg-white border-b border-[#E8E2D6] px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-20 shadow-xs">
      {/* Left Title & Mobile Hamburger */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-lg text-[#5A5A40] hover:bg-[#F7F5EE] border border-[#E8E2D6]"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-[#3D3A30] truncate flex items-center gap-2">
            <span>{currentInfo.title}</span>
            <span className="hidden sm:inline-block text-xs font-normal text-[#8A8576] font-mono px-2 py-0.5 rounded-md bg-[#F7F5EE] border border-[#E8E2D6]">
              /kingadmin
            </span>
          </h1>
          <p className="text-xs text-[#8A8576] truncate hidden md:block">
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Center Search Input (for search-relevant tabs) */}
      {(currentTab === 'applications' || currentTab === 'attendees' || currentTab === 'dashboard') && (
        <div className="hidden lg:flex items-center flex-1 max-w-xs relative">
          <Search className="w-4 h-4 absolute left-3 text-[#A09B8D] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              currentTab === 'applications'
                ? 'Search business, contact, email...'
                : currentTab === 'attendees'
                ? 'Search name, email, pass code...'
                : 'Quick search records...'
            }
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7] text-xs text-[#3D3A30] placeholder-[#A09B8D] focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/30 focus:border-[#5A5A40]"
          />
        </div>
      )}

      {/* Right Quick Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Seed Database button */}
        <button
          onClick={onSeedData}
          disabled={isSeeding}
          className="px-3 py-1.5 rounded-xl bg-[#F7F5EE] hover:bg-[#EAE4D6] border border-[#E8E2D6] text-xs font-semibold text-[#5A5A40] flex items-center gap-1.5 transition-colors disabled:opacity-50"
          title="Seed initial demo applications & RSVPs to test the admin features"
        >
          <Database className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{isSeeding ? 'Seeding...' : 'Seed Demo Data'}</span>
        </button>

        {/* Create Application manually if on applications tab */}
        {currentTab === 'applications' && onOpenNewVendorModal && (
          <button
            onClick={onOpenNewVendorModal}
            className="px-3 py-1.5 rounded-xl bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Vendor</span>
          </button>
        )}

        {/* Return to Public Site */}
        <button
          onClick={onExitAdmin}
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold text-[#6B6658] hover:text-[#3D3A30] hover:bg-[#F7F5EE] border border-transparent hover:border-[#E8E2D6] flex items-center gap-1.5 transition-colors"
          title="Switch to public festival view"
        >
          <ExternalLink className="w-4 h-4 text-[#5A5A40]" />
          <span className="hidden md:inline">View Site</span>
        </button>
      </div>
    </header>
  );
}
