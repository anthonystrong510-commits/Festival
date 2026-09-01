import React from 'react';
import { 
  Store, 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  Layers, 
  ArrowRight, 
  Sparkles,
  TrendingUp,
  AlertCircle,
  Calendar,
  Eye,
  Check,
  X,
  Coins,
  FileText
} from 'lucide-react';
import { 
  VendorApplicationRecord, 
  AttendeeRsvpRecord, 
  AdminTab,
  PaymentConfig,
  Invoice
} from '../../../types';
import { BOOTH_TIERS } from '../../../data/festivalData';
import { CryptoTreasuryWidget } from '../widgets/CryptoTreasuryWidget';

interface DashboardTabProps {
  applications: VendorApplicationRecord[];
  attendees: AttendeeRsvpRecord[];
  invoices?: Invoice[];
  paymentConfig?: PaymentConfig;
  onSelectTab: (tab: AdminTab) => void;
  onSelectApplication: (app: VendorApplicationRecord) => void;
  onQuickApproveApplication: (id: string) => void;
  onToggleCheckIn: (id: string, checked: boolean) => void;
  onSeedData: () => void;
  isSeeding: boolean;
}

export function DashboardTab({
  applications,
  attendees,
  invoices = [],
  paymentConfig,
  onSelectTab,
  onSelectApplication,
  onQuickApproveApplication,
  onToggleCheckIn,
  onSeedData,
  isSeeding
}: DashboardTabProps) {
  const pendingApps = applications.filter(a => a.status === 'pending');
  const approvedApps = applications.filter(a => a.status === 'approved' || a.status === 'paid');
  const totalRevenue = approvedApps.reduce((sum, a) => sum + (a.totalCalculatedFee || 0), 0);
  
  const totalGuests = attendees.reduce((sum, a) => sum + (a.groupSize || 1), 0);
  const checkedInCount = attendees.filter(a => a.checkedIn).length;
  const checkedInGuests = attendees.filter(a => a.checkedIn).reduce((sum, a) => sum + (a.groupSize || 1), 0);

  // Booth capacity calculations
  const boothCounts: Record<string, number> = {};
  approvedApps.forEach(a => {
    boothCounts[a.selectedBoothId] = (boothCounts[a.selectedBoothId] || 0) + 1;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-[#5A5A40] to-[#3D3A30] text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-[11px] font-bold uppercase tracking-wider text-[#F0EBE0] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Live Festival Operations
          </div>
          <h2 className="font-serif italic font-bold text-2xl sm:text-3xl text-white mb-2">
            Festival Organizer Command Center
          </h2>
          <p className="text-[#E8E2D6] text-xs sm:text-sm leading-relaxed">
            Monitor vendor applications, manage attendee gate check-ins, oversee crypto treasury reserves (USDT, ETH, BTC), and issue verified payment invoices in real-time.
          </p>
        </div>

        {/* Action button inside banner */}
        <div className="mt-6 flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => onSelectTab('applications')}
            className="px-4 py-2 rounded-xl bg-white text-[#3D3A30] hover:bg-[#F0EBE0] text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <Store className="w-4 h-4 text-[#5A5A40]" />
            <span>Review Applications ({pendingApps.length} Pending)</span>
          </button>

          <button
            onClick={() => onSelectTab('invoices')}
            className="px-4 py-2 rounded-xl bg-emerald-700/80 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <FileText className="w-4 h-4 text-emerald-300" />
            <span>Invoices & Crypto Checkout</span>
          </button>

          <button
            onClick={() => onSelectTab('emails')}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <span>Email Templates & Anti-Spam</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Crypto Treasury Dashboard Widget */}
      {paymentConfig && (
        <CryptoTreasuryWidget
          paymentConfig={paymentConfig}
          onManageWallets={() => onSelectTab('payments')}
        />
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Applications */}
        <div 
          onClick={() => onSelectTab('applications')}
          className="bg-white p-5 rounded-2xl border border-[#E8E2D6] hover:border-[#5A5A40] transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A7566]">Vendor Applications</span>
            <div className="w-9 h-9 rounded-xl bg-[#F7F5EE] group-hover:bg-[#5A5A40] group-hover:text-white text-[#5A5A40] flex items-center justify-center transition-colors">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#3D3A30] mb-1">
            {applications.length}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
              {pendingApps.length} Pending
            </span>
            <span className="text-[#8A8576]">
              {approvedApps.length} Approved
            </span>
          </div>
        </div>

        {/* Metric 2: Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D6] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A7566]">Projected Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#3D3A30] mb-1">
            ${totalRevenue.toLocaleString()}
          </div>
          <div className="text-xs text-[#8A8576] flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>From {approvedApps.length} confirmed spaces</span>
          </div>
        </div>

        {/* Metric 3: Attendee RSVPs */}
        <div 
          onClick={() => onSelectTab('attendees')}
          className="bg-white p-5 rounded-2xl border border-[#E8E2D6] hover:border-[#5A5A40] transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A7566]">Attendee Passes</span>
            <div className="w-9 h-9 rounded-xl bg-[#F7F5EE] group-hover:bg-[#5A5A40] group-hover:text-white text-[#5A5A40] flex items-center justify-center transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#3D3A30] mb-1">
            {totalGuests} <span className="text-sm font-normal text-[#8A8576]">guests</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#8A8576] font-medium">{attendees.length} RSVPs</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              {checkedInCount} Checked In
            </span>
          </div>
        </div>

        {/* Metric 4: Gate Check-in Rate */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D6] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A7566]">Gate Check-In Rate</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#3D3A30] mb-1">
            {attendees.length > 0 ? Math.round((checkedInCount / attendees.length) * 100) : 0}%
          </div>
          <div className="text-xs text-[#8A8576]">
            {checkedInGuests} total checked in guests
          </div>
        </div>
      </div>

      {/* Main 2-Column Section: Pending Queue & Booth Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 cols): Pending Application Queue */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E8E2D6] p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-[#3D3A30] text-base">
                  Applications Awaiting Review ({pendingApps.length})
                </h3>
              </div>
              <button
                onClick={() => onSelectTab('applications')}
                className="text-xs font-bold text-[#5A5A40] hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {pendingApps.length === 0 ? (
              <div className="py-12 text-center bg-[#FDFBF7] rounded-xl border border-dashed border-[#E8E2D6]">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-[#3D3A30]">All Caught Up!</h4>
                <p className="text-xs text-[#8A8576] mt-1">
                  No vendor applications currently pending review.
                </p>
                {applications.length === 0 && (
                  <button
                    onClick={onSeedData}
                    disabled={isSeeding}
                    className="mt-3 px-3 py-1.5 rounded-lg bg-[#5A5A40] text-white text-xs font-bold"
                  >
                    Seed Sample Applications
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-[#E8E2D6] space-y-2">
                {pendingApps.slice(0, 5).map((app) => (
                  <div 
                    key={app.id}
                    className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div 
                      onClick={() => onSelectApplication(app)}
                      className="cursor-pointer group flex-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#3D3A30] group-hover:text-[#5A5A40]">
                          {app.businessName}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F7F5EE] border border-[#E8E2D6] text-[#7A7566]">
                          {app.category}
                        </span>
                      </div>
                      <div className="text-xs text-[#8A8576] mt-0.5">
                        Contact: {app.contactName} &bull; {app.selectedDays.map(d => d.toUpperCase()).join(', ')} &bull; ${app.totalCalculatedFee}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onQuickApproveApplication(app.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                        title="Quick Approve application"
                      >
                        <Check className="w-3 h-3" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => onSelectApplication(app)}
                        className="px-2.5 py-1 rounded-lg bg-[#F7F5EE] hover:bg-[#EAE4D6] text-[#3D3A30] border border-[#E8E2D6] text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3 h-3 text-[#5A5A40]" />
                        <span>Inspect</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {pendingApps.length > 5 && (
            <div className="mt-4 pt-3 border-t border-[#E8E2D6] text-center">
              <button
                onClick={() => onSelectTab('applications')}
                className="text-xs font-bold text-[#5A5A40] hover:underline"
              >
                + {pendingApps.length - 5} more pending applications
              </button>
            </div>
          )}
        </div>

        {/* Right Column (5 cols): Booth Capacity & Tiers */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E8E2D6] p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#5A5A40]" />
              <h3 className="font-bold text-[#3D3A30] text-base">Booth Space Capacity</h3>
            </div>
            <button
              onClick={() => onSelectTab('booths')}
              className="text-xs font-bold text-[#5A5A40] hover:underline"
            >
              Manage Rates
            </button>
          </div>

          <div className="space-y-3.5">
            {BOOTH_TIERS.map((tier) => {
              const booked = boothCounts[tier.id] || 0;
              const maxCap = tier.capacity || 20;
              const percent = Math.min(100, Math.round((booked / maxCap) * 100));

              return (
                <div key={tier.id} className="p-3 rounded-xl bg-[#FDFBF7] border border-[#E8E2D6]">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-[#3D3A30]">{tier.name}</span>
                    <span className="font-semibold text-[#7A7566]">
                      {booked} / {maxCap} spots ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#E8E2D6] rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        percent >= 90 ? 'bg-rose-500' : percent >= 60 ? 'bg-amber-500' : 'bg-[#5A5A40]'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#8A8576] mt-1">
                    <span>${tier.pricePerDay}/day</span>
                    <span>Zone: {tier.zone.split(' - ')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Bottom Section: Recent RSVPs Stream */}
      <div className="bg-white rounded-2xl border border-[#E8E2D6] p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#5A5A40]" />
            <h3 className="font-bold text-[#3D3A30] text-base">Recent Attendee RSVPs</h3>
          </div>
          <button
            onClick={() => onSelectTab('attendees')}
            className="text-xs font-bold text-[#5A5A40] hover:underline flex items-center gap-1"
          >
            <span>Full Attendee List</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {attendees.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#8A8576]">
            No RSVPs recorded yet. When visitors register on the website, they will appear here live.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8E2D6] text-[#7A7566] uppercase text-[10px] tracking-wider font-bold">
                  <th className="pb-2">Attendee</th>
                  <th className="pb-2">Pass Code</th>
                  <th className="pb-2">Party Size</th>
                  <th className="pb-2">Days Planning</th>
                  <th className="pb-2">Gate Status</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D6]">
                {attendees.slice(0, 5).map((rsvp) => (
                  <tr key={rsvp.id} className="hover:bg-[#FDFBF7]">
                    <td className="py-2.5 font-bold text-[#3D3A30]">
                      <div>{rsvp.name}</div>
                      <div className="text-[10px] font-normal text-[#8A8576]">{rsvp.email}</div>
                    </td>
                    <td className="py-2.5 font-mono text-[#5A5A40] font-bold">
                      #{rsvp.passCode}
                    </td>
                    <td className="py-2.5 font-semibold text-[#3D3A30]">
                      {rsvp.groupSize} Guest(s)
                    </td>
                    <td className="py-2.5 text-[#7A7566]">
                      {rsvp.daysAttending.map(d => d.toUpperCase()).join(', ')}
                    </td>
                    <td className="py-2.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        rsvp.checkedIn ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {rsvp.checkedIn ? 'Checked In' : 'Not Arrived'}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => onToggleCheckIn(rsvp.id, !rsvp.checkedIn)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                          rsvp.checkedIn 
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100' 
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                        }`}
                      >
                        {rsvp.checkedIn ? 'Undo Check-In' : 'Check In'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
