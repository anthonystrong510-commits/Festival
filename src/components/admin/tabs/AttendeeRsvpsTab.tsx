import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Mail, 
  Trash2, 
  Ticket, 
  Filter,
  Check,
  UserCheck
} from 'lucide-react';
import { AttendeeRsvpRecord } from '../../../types';

interface AttendeeRsvpsTabProps {
  attendees: AttendeeRsvpRecord[];
  onToggleCheckIn: (id: string, checked: boolean) => void;
  onDeleteRsvp: (id: string) => void;
  onSendPassEmail: (rsvp: AttendeeRsvpRecord) => void;
}

export function AttendeeRsvpsTab({
  attendees,
  onToggleCheckIn,
  onDeleteRsvp,
  onSendPassEmail
}: AttendeeRsvpsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dayFilter, setDayFilter] = useState<string>('all');
  const [checkInFilter, setCheckInFilter] = useState<string>('all');

  const filteredAttendees = useMemo(() => {
    return attendees.filter((rsvp) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = 
          rsvp.name.toLowerCase().includes(q) ||
          rsvp.email.toLowerCase().includes(q) ||
          rsvp.passCode.toLowerCase().includes(q) ||
          rsvp.id.toLowerCase().includes(q);
        if (!match) return false;
      }

      if (dayFilter !== 'all' && !rsvp.daysAttending.includes(dayFilter)) {
        return false;
      }

      if (checkInFilter === 'checkedIn' && !rsvp.checkedIn) return false;
      if (checkInFilter === 'notCheckedIn' && rsvp.checkedIn) return false;

      return true;
    });
  }, [attendees, searchQuery, dayFilter, checkInFilter]);

  const totalRegisteredGuests = useMemo(() => {
    return attendees.reduce((sum, a) => sum + (a.groupSize || 1), 0);
  }, [attendees]);

  const totalCheckedInGuests = useMemo(() => {
    return attendees.filter(a => a.checkedIn).reduce((sum, a) => sum + (a.groupSize || 1), 0);
  }, [attendees]);

  // Export CSV
  const handleExportCsv = () => {
    const headers = ['Pass Code', 'Name', 'Email', 'Group Size', 'Days Attending', 'Checked In', 'Checked In At', 'Registered At'];
    const rows = filteredAttendees.map(a => [
      a.passCode,
      `"${a.name.replace(/"/g, '""')}"`,
      a.email,
      a.groupSize,
      `"${a.daysAttending.join(', ')}"`,
      a.checkedIn ? 'Yes' : 'No',
      a.checkedInAt || '',
      a.createdAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `festival-attendees-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D6] shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-[#7A7566] mb-1">
            Total Registrations
          </div>
          <div className="text-2xl font-extrabold text-[#3D3A30]">
            {attendees.length} <span className="text-xs font-semibold text-[#8A8576]">Passes</span>
          </div>
          <div className="text-xs text-[#8A8576] mt-1">
            {totalRegisteredGuests} total expected attendees
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D6] shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-[#7A7566] mb-1">
            Checked In at Gate
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">
            {attendees.filter(a => a.checkedIn).length} <span className="text-xs font-semibold text-[#8A8576]">Passes</span>
          </div>
          <div className="text-xs text-[#8A8576] mt-1">
            {totalCheckedInGuests} guests through turnstiles
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D6] shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-[#7A7566] mb-1">
            Check-In Rate
          </div>
          <div className="text-2xl font-extrabold text-[#5A5A40]">
            {attendees.length > 0 ? Math.round((attendees.filter(a => a.checkedIn).length / attendees.length) * 100) : 0}%
          </div>
          <div className="text-xs text-[#8A8576] mt-1">
            Live turnstile check-in tally
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E2D6] shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A09B8D]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, email, pass code (#PASS-...)"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7] text-xs sm:text-sm text-[#3D3A30] placeholder-[#A09B8D] focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/30"
            />
          </div>

          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl bg-[#F7F5EE] hover:bg-[#EAE4D6] text-[#5A5A40] border border-[#E8E2D6] text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Attendee List</span>
          </button>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E8E2D6] text-xs">
          <span className="text-[#8A8576] font-bold text-[11px] uppercase tracking-wider">Gate Status:</span>
          {[
            { id: 'all', label: 'All' },
            { id: 'checkedIn', label: 'Checked In' },
            { id: 'notCheckedIn', label: 'Not Arrived' }
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setCheckInFilter(st.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                checkInFilter === st.id
                  ? 'bg-[#5A5A40] text-white'
                  : 'bg-[#F7F5EE] text-[#6B6658] hover:bg-[#EAE4D6]'
              }`}
            >
              {st.label}
            </button>
          ))}

          <div className="h-4 w-px bg-[#E8E2D6] mx-1 hidden sm:block" />

          <span className="text-[#8A8576] font-bold text-[11px] uppercase tracking-wider">Day:</span>
          {['all', 'fri', 'sat', 'sun'].map((d) => (
            <button
              key={d}
              onClick={() => setDayFilter(d)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase transition-colors ${
                dayFilter === d
                  ? 'bg-[#3D3A30] text-white'
                  : 'bg-[#F7F5EE] text-[#6B6658] hover:bg-[#EAE4D6]'
              }`}
            >
              {d === 'all' ? 'All' : d}
            </button>
          ))}
        </div>
      </div>

      {/* Attendees Table */}
      {filteredAttendees.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-[#E8E2D6] p-12 text-center">
          <Ticket className="w-10 h-10 text-[#A09B8D] mx-auto mb-2" />
          <h3 className="text-base font-bold text-[#3D3A30]">No Attendee RSVPs Found</h3>
          <p className="text-xs text-[#8A8576] mt-1">
            When visitors register for free admission on the public site, their passes will sync here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E8E2D6] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F7F5EE] border-b border-[#E8E2D6] text-[#6B6658] font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4">Attendee & Email</th>
                  <th className="py-3.5 px-4">Pass Code</th>
                  <th className="py-3.5 px-4">Party Size</th>
                  <th className="py-3.5 px-4">Sessions</th>
                  <th className="py-3.5 px-4">Interests</th>
                  <th className="py-3.5 px-4">Gate Check-In</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D6]">
                {filteredAttendees.map((rsvp) => (
                  <tr key={rsvp.id} className="hover:bg-[#FDFBF7] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#3D3A30] text-sm">
                        {rsvp.name}
                      </div>
                      <div className="text-[11px] text-[#7A7566]">
                        {rsvp.email}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-[#5A5A40] bg-[#F7F5EE] px-2 py-0.5 rounded border border-[#E8E2D6]">
                        #{rsvp.passCode}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-[#3D3A30]">
                      {rsvp.groupSize} Guest(s)
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {rsvp.daysAttending.map(d => (
                          <span key={d} className="px-1.5 py-0.5 rounded bg-[#F7F5EE] border border-[#E8E2D6] text-[10px] font-bold uppercase text-[#5A5A40]">
                            {d}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="truncate text-[11px] text-[#8A8576]">
                        {rsvp.interests && rsvp.interests.length > 0 ? rsvp.interests.join(', ') : 'All categories'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => onToggleCheckIn(rsvp.id, !rsvp.checkedIn)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs ${
                          rsvp.checkedIn
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-[#F7F5EE] text-[#6B6658] border border-[#E8E2D6] hover:bg-[#EAE4D6]'
                        }`}
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>{rsvp.checkedIn ? 'Checked In ✓' : 'Mark In'}</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => onSendPassEmail(rsvp)}
                          className="p-1.5 rounded-lg bg-[#F7F5EE] hover:bg-[#EAE4D6] text-[#5A5A40] border border-[#E8E2D6] transition-colors"
                          title="Resend Digital Pass Email"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete RSVP for ${rsvp.name}?`)) {
                              onDeleteRsvp(rsvp.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete RSVP"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
