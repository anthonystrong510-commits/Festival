import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle, 
  Sun, 
  Utensils, 
  Music, 
  Download,
  Info
} from 'lucide-react';
import { EVENT_CONFIG, FESTIVAL_DAYS, FESTIVAL_LOCATION, SCHEDULE_EVENTS } from '../data/festivalData';

export const ScheduleSection: React.FC = () => {
  const [selectedDayId, setSelectedDayId] = useState<'fri' | 'sat' | 'sun'>('fri');

  const activeDay = FESTIVAL_DAYS.find((d) => d.id === selectedDayId) || FESTIVAL_DAYS[0];
  const dayEvents = SCHEDULE_EVENTS.filter((e) => e.day === selectedDayId);

  const handleDownloadCalendar = () => {
    // Generate .ics calendar format with general festival schedule
    const now = new Date();
    const startYear = now.getFullYear();
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//${EVENT_CONFIG.shortName}//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:${EVENT_CONFIG.name}
DESCRIPTION:${EVENT_CONFIG.description}
LOCATION:${FESTIVAL_LOCATION}
DTSTART:${startYear}1001T100000
DTEND:${startYear}1003T180000
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'festival-schedule.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="schedule" className="py-20 bg-[#F0EBE0]/60 text-[#3D3A30] border-b border-[#E8E2D6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-[#5A5A40] bg-white border border-[#E8E2D6]">
            <Clock className="w-3.5 h-3.5 text-[#5A5A40]" />
            Official Hours & Setup Timetable
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif italic font-bold text-[#3D3A30]">
            Festival Schedule & Program
          </h2>
          
          <p className="text-[#6B6658] text-base sm:text-lg">
            Detailed operating hours, morning load-in timetables, and live entertainment schedule for vendors and visitors.
          </p>
        </div>

        {/* Day Selector Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1.5 rounded-full border border-[#E8E2D6] shadow-sm flex gap-1 max-w-xl w-full">
            {FESTIVAL_DAYS.map((day) => {
              const isSelected = day.id === selectedDayId;
              return (
                <button
                  key={day.id}
                  onClick={() => setSelectedDayId(day.id)}
                  className={`flex-1 py-2.5 px-4 rounded-full text-xs font-bold uppercase tracking-wider transition-all text-center flex flex-col items-center justify-center ${
                    isSelected
                      ? 'bg-[#5A5A40] text-white shadow-sm scale-102'
                      : 'text-[#6B6658] hover:text-[#3D3A30] hover:bg-[#F0EBE0]'
                  }`}
                >
                  <span className="text-sm font-bold tracking-wider">{day.dayName}</span>
                  <span className={`text-[10px] font-normal lowercase tracking-normal mt-0.5 ${isSelected ? 'text-[#F0EBE0]' : 'text-[#7A7566]'}`}>
                    {day.hours}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Day Detail Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Day Overview & Set-up Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#E8E2D6] shadow-sm space-y-6">
              
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-[#5A5A40]">
                  {activeDay.dateStr}
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif italic font-bold text-[#3D3A30] mt-1">
                  {activeDay.title}
                </h3>
              </div>

              {/* Timing Grid */}
              <div className="space-y-3 pt-2">
                
                <div className="flex items-start gap-3.5 bg-[#FDFBF7] p-4 rounded-2xl border border-[#E8E2D6]">
                  <div className="w-9 h-9 rounded-full bg-[#F0EBE0] text-[#5A5A40] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-[#7A7566] font-medium uppercase tracking-wider">Public Event Hours</div>
                    <div className="text-base font-bold font-serif italic text-[#3D3A30]">{activeDay.hours}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 bg-[#FDFBF7] p-4 rounded-2xl border border-[#E8E2D6]">
                  <div className="w-9 h-9 rounded-full bg-[#E6E4D9] text-[#5A5A40] flex items-center justify-center shrink-0 mt-0.5">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-[#7A7566] font-medium uppercase tracking-wider">Vendor Morning Load-In Window</div>
                    <div className="text-base font-bold font-serif italic text-[#5A5A40]">{activeDay.setupTime}</div>
                    <p className="text-[11px] text-[#6B6658] mt-1">
                      Booths must be completely set up and ready 15 minutes before the opening bell.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 bg-[#FDFBF7] p-4 rounded-2xl border border-[#E8E2D6]">
                  <div className="w-9 h-9 rounded-full bg-[#F0EBE0] text-[#5A5A40] flex items-center justify-center shrink-0 mt-0.5">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-[#7A7566] font-medium uppercase tracking-wider">Operating & Pack-Out Schedule</div>
                    <div className="text-xs font-semibold text-[#3D3A30]">
                      {activeDay.breakdownNotice}
                    </div>
                  </div>
                </div>

              </div>

              {/* Day Highlights List */}
              <div className="pt-2 border-t border-[#E8E2D6]">
                <span className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] block mb-3">
                  Key Day Features:
                </span>
                <ul className="space-y-2">
                  {activeDay.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs sm:text-sm text-[#3D3A30]">
                      <CheckCircle className="w-4 h-4 text-[#5A5A40] shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Download iCal */}
              <button
                onClick={handleDownloadCalendar}
                className="w-full py-3 rounded-full bg-white hover:bg-[#F0EBE0] border border-[#E8E2D6] text-[#5A5A40] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Download className="w-4 h-4 text-[#5A5A40]" />
                Add Festival to Calendar (.ics)
              </button>

            </div>
          </div>

          {/* Detailed Timetable Schedule Events */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#E8E2D6] shadow-sm">
              
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E8E2D6]">
                <h4 className="text-xl font-serif italic font-bold text-[#3D3A30]">
                  {activeDay.dayName} Timetable & Program
                </h4>
                <span className="text-xs font-bold uppercase tracking-wider text-[#7A7566]">
                  {dayEvents.length} Events
                </span>
              </div>

              <div className="space-y-3.5">
                {dayEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D6] hover:border-[#5A5A40]/40 transition-all space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F0EBE0] text-[#5A5A40] border border-[#E8E2D6]">
                        {evt.time}
                      </span>
                      <span className="text-xs text-[#7A7566] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#5A5A40]" />
                        {evt.location}
                      </span>
                    </div>

                    <h5 className="text-base font-serif italic font-bold text-[#3D3A30]">
                      {evt.title}
                    </h5>

                    <p className="text-xs sm:text-sm text-[#6B6658] leading-relaxed">
                      {evt.description}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>

        {/* Important Policy Callout Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#E8E2D6] text-xs sm:text-sm">
          <div className="bg-white p-5 rounded-[24px] border border-[#E8E2D6] flex items-start gap-3 shadow-sm">
            <ShieldCheck className="w-5 h-5 text-[#5A5A40] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#3D3A30] block">Multi-Day Security Included</span>
              <p className="text-[#6B6658] text-xs mt-0.5">
                Vendors doing 2 or 3 consecutive days are free to leave setups behind overnight with security provided.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-[24px] border border-[#E8E2D6] flex items-start gap-3 shadow-sm">
            <Utensils className="w-5 h-5 text-[#5A5A40] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#3D3A30] block">Food Safety & Temperature</span>
              <p className="text-[#6B6658] text-xs mt-0.5">
                Food must be maintained at proper temperatures with proper hygiene and valid permits at all times.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-[24px] border border-[#E8E2D6] flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 text-[#5A5A40] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#3D3A30] block">Handicap Parking Access</span>
              <p className="text-[#6B6658] text-xs mt-0.5">
                State accessibility needs on the vendor application prior to event so dedicated provisions can be made.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
