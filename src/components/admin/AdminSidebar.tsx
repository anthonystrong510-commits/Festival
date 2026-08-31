import React from 'react';
import { 
  LayoutDashboard, 
  Store, 
  Users, 
  Layers, 
  Calendar, 
  Mail, 
  Server, 
  Settings, 
  ExternalLink, 
  LogOut, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { AdminTab } from '../../types';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  pendingAppsCount: number;
  totalAttendeesCount: number;
  onExitAdmin: () => void;
  onSignOut: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  userEmail?: string | null;
}

export function AdminSidebar({
  currentTab,
  onSelectTab,
  pendingAppsCount,
  totalAttendeesCount,
  onExitAdmin,
  onSignOut,
  isCollapsed,
  onToggleCollapse,
  userEmail
}: AdminSidebarProps) {
  const menuItems: { id: AdminTab; label: string; icon: React.ElementType; badge?: number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { 
      id: 'applications', 
      label: 'Vendor Applications', 
      icon: Store, 
      badge: pendingAppsCount > 0 ? pendingAppsCount : undefined,
      badgeColor: 'bg-amber-500 text-white'
    },
    { 
      id: 'attendees', 
      label: 'Attendee RSVPs', 
      icon: Users,
      badge: totalAttendeesCount > 0 ? totalAttendeesCount : undefined,
      badgeColor: 'bg-[#5A5A40] text-white'
    },
    { id: 'booths', label: 'Booth Spaces & Pricing', icon: Layers },
    { id: 'schedule', label: 'Schedule & Events', icon: Calendar },
    { id: 'emails', label: 'Email Center & Templates', icon: Mail },
    { id: 'smtp', label: 'SMTP & Mail Server', icon: Server },
    { id: 'settings', label: 'Festival Settings', icon: Settings },
  ];

  return (
    <aside 
      id="admin-sidebar"
      className={`bg-[#23231B] text-[#E8E2D6] flex flex-col justify-between transition-all duration-300 border-r border-[#3D3A30] z-30 shrink-0 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Sidebar Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#3D3A30]">
          {!isCollapsed ? (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-[#5A5A40] flex items-center justify-center text-white shrink-0 shadow-md">
                <ShieldCheck className="w-4 h-4 text-[#F0EBE0]" />
              </div>
              <div className="truncate">
                <div className="font-serif italic font-bold text-white text-base leading-tight tracking-tight">
                  KingAdmin
                </div>
                <div className="text-[10px] text-[#A09B8D] font-bold uppercase tracking-wider">
                  Festival Control Panel
                </div>
              </div>
            </div>
          ) : (
            <div className="mx-auto w-8 h-8 rounded-xl bg-[#5A5A40] flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-4 h-4 text-[#F0EBE0]" />
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="hidden md:flex p-1.5 rounded-lg hover:bg-white/10 text-[#A09B8D] hover:text-white transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar width"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Live sync pill badge */}
        {!isCollapsed && (
          <div className="px-4 py-2.5 mx-3 mt-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-semibold text-emerald-300">Firestore Live Sync</span>
            </div>
            <span className="text-[10px] text-[#A09B8D] font-mono">europe-west1</span>
          </div>
        )}

        {/* Navigation items */}
        <nav className="p-3 space-y-1 mt-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`admin-nav-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#5A5A40] text-white shadow-md font-semibold'
                    : 'text-[#C5BFB0] hover:text-white hover:bg-white/5'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#F0EBE0]' : 'text-[#A09B8D]'}`} />
                
                {!isCollapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}

                {!isCollapsed && item.badge !== undefined && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-white/20 text-white'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-[#3D3A30] space-y-1">
        {/* Switch to Public Site */}
        <button
          onClick={onExitAdmin}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-[#A09B8D] hover:text-white hover:bg-white/5 transition-colors"
          title="Return to Public Festival Site"
        >
          <ExternalLink className="w-4 h-4 shrink-0 text-[#A09B8D]" />
          {!isCollapsed && <span className="truncate">Public Festival Site</span>}
        </button>

        {/* User Info & Sign Out */}
        <div className="pt-2">
          {!isCollapsed && userEmail && (
            <div className="px-3 py-1.5 mb-1.5 rounded-lg bg-black/20 text-[11px] text-[#8E8878] truncate font-mono">
              {userEmail}
            </div>
          )}
          <button
            onClick={onSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-rose-200 hover:bg-rose-950/40 transition-colors"
            title="Sign Out of Admin"
          >
            <LogOut className="w-4 h-4 shrink-0 text-rose-400" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
