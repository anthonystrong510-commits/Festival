import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  Plus, 
  Clock, 
  MapPin, 
  Trash2, 
  Edit2, 
  Save, 
  X,
  Sparkles,
  CheckSquare,
  Square,
  CalendarDays,
  CheckCircle2,
  Layers,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { ScheduleEvent } from '../../../types';
import { 
  formatEventDate, 
  subscribeScheduleEvents, 
  saveScheduleEventsList, 
  bulkDeleteScheduleEvents, 
  isScheduleEventInPast, 
  getTodayDateString 
} from '../../../lib/locationMarketService';

export function ScheduleManagerTab() {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [activeFilterDay, setActiveFilterDay] = useState<string>('all');
  const [timelineFilter, setTimelineFilter] = useState<'ALL' | 'UPCOMING' | 'PAST'>('ALL');
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form State
  const [formTime, setFormTime] = useState('12:00 PM');
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Stage Performance');
  const [formLocation, setFormLocation] = useState('Main Pavilion Amphitheater');
  const [formLocationDescription, setFormLocationDescription] = useState('Outdoor amphitheater stage with lawn seating and acoustic amplification.');
  const [formDescription, setFormDescription] = useState('');
  const [formDays, setFormDays] = useState<Array<'fri' | 'sat' | 'sun'>>(['fri']);
  const [formDates, setFormDates] = useState<string[]>(['2026-11-20']);
  const [formNewDate, setFormNewDate] = useState('');

  // Bulk Edit State
  const [bulkDays, setBulkDays] = useState<Array<'fri' | 'sat' | 'sun'>>(['fri', 'sat', 'sun']);
  const [bulkDates, setBulkDates] = useState<string[]>(['2026-11-20', '2026-11-21', '2026-11-22']);
  const [bulkNewDate, setBulkNewDate] = useState('');

  useEffect(() => {
    const unsub = subscribeScheduleEvents((list) => {
      setEvents(list);
    });
    return () => unsub();
  }, []);

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  const persistEvents = (updated: ScheduleEvent[]) => {
    setEvents(updated);
    saveScheduleEventsList(updated);
  };

  const todayStr = getTodayDateString();

  const pastScheduleEvents = useMemo(() => {
    return events.filter((evt) => isScheduleEventInPast(evt, todayStr));
  }, [events, todayStr]);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const isPast = isScheduleEventInPast(evt, todayStr);
      if (timelineFilter === 'UPCOMING' && isPast) return false;
      if (timelineFilter === 'PAST' && !isPast) return false;

      if (activeFilterDay === 'all') return true;
      if (evt.days && evt.days.includes(activeFilterDay as any)) return true;
      return evt.day === activeFilterDay;
    });
  }, [events, activeFilterDay, timelineFilter, todayStr]);

  // Select All / Deselect All
  const handleToggleSelectAll = () => {
    if (selectedEventIds.length === filteredEvents.length) {
      setSelectedEventIds([]);
    } else {
      setSelectedEventIds(filteredEvents.map(e => e.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedEventIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Bulk Delete Schedule Events
  const handleBulkDelete = async (idsToDelete: string[], message?: string) => {
    if (idsToDelete.length === 0) return;
    const deletedCount = await bulkDeleteScheduleEvents(idsToDelete);
    setSelectedEventIds((prev) => prev.filter((id) => !idsToDelete.includes(id)));
    showToast(message || `Bulk deleted ${deletedCount} stage schedule event${deletedCount === 1 ? '' : 's'}!`);
    if (timelineFilter === 'PAST' && deletedCount >= pastScheduleEvents.length) {
      setTimelineFilter('ALL');
    }
  };

  // Open Edit Event Modal
  const handleOpenEdit = (evt: ScheduleEvent) => {
    setEditingEvent(evt);
    setFormTime(evt.time);
    setFormTitle(evt.title);
    setFormCategory(evt.category || 'Stage Performance');
    setFormLocation(evt.location);
    setFormLocationDescription(evt.locationDescription || 'Festival Pavilion Main Plaza');
    setFormDescription(evt.description);
    setFormDays(evt.days || [evt.day as any]);
    setFormDates(evt.dates || ['2026-11-20']);
    setIsAddModalOpen(true);
  };

  // Open Create Event Modal
  const handleOpenCreate = () => {
    setEditingEvent(null);
    const day = activeFilterDay !== 'all' ? (activeFilterDay as 'fri' | 'sat' | 'sun') : 'fri';
    setFormTime('1:00 PM');
    setFormTitle('');
    setFormCategory('Stage Performance');
    setFormLocation('Main Pavilion Amphitheater');
    setFormLocationDescription('Outdoor amphitheater stage with lawn seating.');
    setFormDescription('');
    setFormDays([day]);
    setFormDates(day === 'fri' ? ['2026-11-20'] : day === 'sat' ? ['2026-11-21'] : ['2026-11-22']);
    setIsAddModalOpen(true);
  };

  // Save Event
  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingEvent) {
      const updated = events.map(evt => {
        if (evt.id === editingEvent.id) {
          return {
            ...evt,
            title: formTitle.trim(),
            time: formTime.trim(),
            category: formCategory,
            location: formLocation.trim(),
            locationDescription: formLocationDescription.trim(),
            description: formDescription.trim(),
            days: formDays.length > 0 ? formDays : ['fri'],
            day: formDays[0] || 'fri',
            dates: formDates.length > 0 ? formDates : ['2026-11-20']
          };
        }
        return evt;
      });
      persistEvents(updated);
      showToast(`Updated "${formTitle}" successfully!`);
    } else {
      const newEvt: ScheduleEvent = {
        id: `evt-${Date.now().toString(36)}`,
        title: formTitle.trim(),
        time: formTime.trim(),
        category: formCategory,
        location: formLocation.trim(),
        locationDescription: formLocationDescription.trim(),
        description: formDescription.trim(),
        days: formDays.length > 0 ? formDays : ['fri'],
        day: formDays[0] || 'fri',
        dates: formDates.length > 0 ? formDates : ['2026-11-20']
      };
      persistEvents([newEvt, ...events]);
      showToast(`Added "${formTitle}" with ${formDates.length} scheduled dates!`);
    }
    setIsAddModalOpen(false);
  };

  // Delete Event
  const handleDeleteEvent = async (id: string, title: string) => {
    await bulkDeleteScheduleEvents([id]);
    setSelectedEventIds(prev => prev.filter(i => i !== id));
    showToast(`Deleted "${title}" from program.`);
  };

  // Bulk Edit Days & Dates for Selected Events
  const handleExecuteBulkEdit = () => {
    if (selectedEventIds.length === 0) return;

    const updated = events.map(evt => {
      if (selectedEventIds.includes(evt.id)) {
        return {
          ...evt,
          days: [...bulkDays],
          day: bulkDays[0] || 'fri',
          dates: [...bulkDates]
        };
      }
      return evt;
    });

    persistEvents(updated);
    setIsBulkEditModalOpen(false);
    showToast(`Bulk updated ${selectedEventIds.length} events to days: [${bulkDays.join(', ')}] and dates: [${bulkDates.join(', ')}]!`);
    setSelectedEventIds([]);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header and Action */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E8E2D6] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-[#5A5A40]/10 text-[#5A5A40]">
              <Calendar className="w-5 h-5" />
            </span>
            <h2 className="font-bold text-[#3D3A30] text-lg">Festival Schedule, Multi-Dates & Events</h2>
          </div>
          <p className="text-xs text-[#7A7566] mt-1 max-w-xl">
            Configure entertainment lineups, artisan workshops, and stage showcases. Events in the past are <strong>automatically hidden from public views</strong> and flagged below for bulk deletion or date updates.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {selectedEventIds.length > 0 && (
            <>
              <button
                onClick={() => setIsBulkEditModalOpen(true)}
                className="px-3.5 py-2 rounded-2xl bg-[#3D3A30] hover:bg-[#2A2720] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <CalendarDays className="w-4 h-4 text-[#A8D5BA]" />
                <span>Bulk Edit ({selectedEventIds.length}) Days</span>
              </button>
              <button
                onClick={() => handleBulkDelete(selectedEventIds)}
                className="px-3.5 py-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Bulk Delete ({selectedEventIds.length})</span>
              </button>
            </>
          )}

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-2xl bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Program Item</span>
          </button>
        </div>
      </div>

      {/* PAST SCHEDULE EVENTS NOTIFICATION BANNER */}
      {pastScheduleEvents.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-300/90 rounded-3xl p-5 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-950 text-[10px] font-black uppercase tracking-wider">
                  Past Stage Events Alert • {pastScheduleEvents.length} Hidden From Public
                </span>
              </div>
              <h3 className="text-sm font-bold text-amber-950 mt-1">
                {pastScheduleEvents.length} scheduled stage event{pastScheduleEvents.length === 1 ? ' is' : 's are'} in the past and hidden from public schedule views.
              </h3>
              <p className="text-xs text-amber-900/80 mt-0.5">
                Bulk delete these past program items or select them all to assign new upcoming festival dates.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              type="button"
              onClick={() => {
                setSelectedEventIds(pastScheduleEvents.map((e) => e.id));
                setIsBulkEditModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-2xl bg-white hover:bg-amber-100 text-amber-950 border border-amber-300 text-xs font-bold transition-colors"
            >
              Reschedule Past Events ({pastScheduleEvents.length})
            </button>
            <button
              type="button"
              onClick={() =>
                handleBulkDelete(
                  pastScheduleEvents.map((e) => e.id),
                  `Bulk deleted all ${pastScheduleEvents.length} past schedule events!`
                )
              }
              className="px-4 py-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Bulk Delete All Past ({pastScheduleEvents.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Feedback Toast */}
      {feedback && (
        <div className="p-3.5 rounded-2xl bg-[#5A5A40] text-white text-xs font-semibold flex items-center gap-2 shadow-md">
          <CheckCircle2 className="w-4 h-4 text-[#A8D5BA]" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Filter Tabs & Bulk Select Bar */}
      <div className="flex flex-col gap-3 bg-white p-3.5 rounded-2xl border border-[#E8E2D6]">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#E8E2D6]/70">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setTimelineFilter('ALL')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                timelineFilter === 'ALL'
                  ? 'bg-[#5A5A40] text-white'
                  : 'bg-[#FDFBF7] text-[#6B6658] border border-[#E8E2D6]'
              }`}
            >
              All ({events.length})
            </button>
            <button
              type="button"
              onClick={() => setTimelineFilter('UPCOMING')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                timelineFilter === 'UPCOMING'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-[#FDFBF7] text-emerald-800 border border-emerald-200'
              }`}
            >
              Upcoming ({events.length - pastScheduleEvents.length})
            </button>
            <button
              type="button"
              onClick={() => setTimelineFilter('PAST')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                timelineFilter === 'PAST'
                  ? 'bg-amber-700 text-white'
                  : 'bg-[#FDFBF7] text-amber-900 border border-amber-200'
              }`}
            >
              Past / Hidden ({pastScheduleEvents.length})
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Program Events' },
              { id: 'fri', label: 'Friday' },
              { id: 'sat', label: 'Saturday' },
              { id: 'sun', label: 'Sunday' },
            ].map((tab) => {
              const count = tab.id === 'all' 
                ? events.length 
                : events.filter(e => (e.days?.includes(tab.id as any) || e.day === tab.id)).length;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilterDay(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeFilterDay === tab.id
                      ? 'bg-[#5A5A40] text-white shadow-xs'
                      : 'bg-transparent text-[#6B6658] hover:bg-[#F0EBE0]'
                  }`}
                >
                  {tab.label} ({count})
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 text-xs text-[#7A7566] px-2">
            <button
              onClick={handleToggleSelectAll}
              className="flex items-center gap-1.5 font-bold text-[#5A5A40] hover:text-[#3D3A30]"
            >
              {selectedEventIds.length === filteredEvents.length && filteredEvents.length > 0 ? (
                <CheckSquare className="w-4 h-4 text-[#5A5A40]" />
              ) : (
                <Square className="w-4 h-4 text-[#8A8576]" />
              )}
              <span>Select All Shown</span>
            </button>
            {selectedEventIds.length > 0 && (
              <span className="font-bold text-[#5A5A40]">{selectedEventIds.length} selected</span>
            )}
          </div>
        </div>
      </div>

      {/* Schedule Items List */}
      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-[#E8E2D6] text-center text-xs text-[#8A8576] space-y-2">
            <p>No events listed for this filter.</p>
            <button
              onClick={handleOpenCreate}
              className="px-4 py-1.5 rounded-xl bg-[#5A5A40] text-white font-bold"
            >
              Add An Event
            </button>
          </div>
        ) : (
          filteredEvents.map((evt) => {
            const isSelected = selectedEventIds.includes(evt.id);
            const isPast = isScheduleEventInPast(evt, todayStr);
            return (
              <div
                key={evt.id}
                className={`bg-white rounded-3xl border p-5 transition-all space-y-3 shadow-xs ${
                  isSelected
                    ? 'border-[#5A5A40] ring-2 ring-[#5A5A40]/20 bg-[#FDFBF7]'
                    : isPast
                    ? 'border-amber-300/90 bg-amber-50/20'
                    : 'border-[#E8E2D6] hover:border-[#D0C8B8]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleSelectOne(evt.id)}
                      className="mt-1 text-[#5A5A40]"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-[#5A5A40]" />
                      ) : (
                        <Square className="w-4 h-4 text-[#A8A294]" />
                      )}
                    </button>

                    <div className="px-3 py-1.5 rounded-xl bg-[#F7F5EE] border border-[#E8E2D6] text-[#5A5A40] font-bold text-xs font-mono shrink-0 flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{evt.time}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-base text-[#3D3A30]">{evt.title}</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAE4D6] text-[#5A5A40]">
                          {evt.category || 'Performance'}
                        </span>
                        {isPast ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                            Past Event • Hidden From Public
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Upcoming • Public
                          </span>
                        )}
                      </div>

                      {/* Location & Location Description */}
                      <div className="flex items-center gap-1.5 text-xs text-[#5A5A40] font-semibold mt-1">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span>{evt.location}</span>
                      </div>

                      {evt.locationDescription && (
                        <p className="text-[11px] text-[#7A7566] italic mt-0.5">
                          {evt.locationDescription}
                        </p>
                      )}

                      <p className="text-xs text-[#6B6658] mt-1.5 leading-relaxed">
                        {evt.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-start">
                    <button
                      onClick={() => handleOpenEdit(evt)}
                      className="p-2 rounded-xl bg-[#F0EBE0] hover:bg-[#E5DFD2] text-[#5A5A40] text-xs font-bold flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDeleteEvent(evt.id, evt.title)}
                      className="p-2 rounded-xl hover:bg-rose-50 text-rose-600 transition-colors"
                      title="Delete event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Multiple Dates & Days Badges */}
                <div className="pt-2 border-t border-[#E8E2D6] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-[#8A8576] flex items-center gap-1">
                      <CalendarDays className="w-3.5 h-3.5" />
                      <span>Event Dates:</span>
                    </span>
                    {evt.dates && evt.dates.length > 0 ? (
                      evt.dates.map((d) => {
                        const isExpired = d < todayStr;
                        return (
                          <span
                            key={d}
                            className={`px-2 py-0.5 rounded-lg border text-[11px] font-mono font-semibold ${
                              isExpired
                                ? 'bg-amber-50 border-amber-200 text-amber-800 line-through opacity-75'
                                : 'bg-[#F7F5EE] border-[#E8E2D6] text-[#3D3A30]'
                            }`}
                          >
                            {formatEventDate(d)}
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-[11px] text-[#8A8576]">Single Day</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-[#8A8576]">Days:</span>
                    {(['fri', 'sat', 'sun'] as const).map((d) => {
                      const isDay = evt.days ? evt.days.includes(d) : evt.day === d;
                      return (
                        <span
                          key={d}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                            isDay ? 'bg-[#5A5A40] text-white' : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {d}
                        </span>
                      );
                    })}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* ========================================================= */}
      {/* 1. ADD / EDIT EVENT MODAL */}
      {/* ========================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#E8E2D6] w-full max-w-lg shadow-2xl p-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D6] mb-4">
              <h3 className="font-bold text-base text-[#3D3A30]">
                {editingEvent ? 'Edit Schedule Event' : 'Add Program Event'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[#8A8576] hover:text-[#3D3A30]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#5D584D] mb-1">Time (e.g. 12:30 PM) *</label>
                  <input
                    type="text"
                    required
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#5D584D] mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7]"
                  >
                    <option value="Stage Performance">Stage Performance</option>
                    <option value="Culinary Demonstration">Culinary Demonstration</option>
                    <option value="Artisan Workshop">Artisan Workshop</option>
                    <option value="Family Activity">Family Activity</option>
                    <option value="Keynote & Award">Keynote & Award</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#5D584D] mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acoustic Guitar Masters & Southern Folk"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#5D584D] mb-1">Location / Stage *</label>
                <input
                  type="text"
                  required
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#5D584D] mb-1">Location Description</label>
                <input
                  type="text"
                  placeholder="e.g. Covered stage at North Park with grandstand seating."
                  value={formLocationDescription}
                  onChange={(e) => setFormLocationDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#5D584D] mb-1">Event Description</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7]"
                />
              </div>

              {/* MULTIPLE DATES INPUT */}
              <div className="p-3 rounded-2xl bg-[#F7F5EE] border border-[#E8E2D6] space-y-2">
                <label className="font-bold text-[#5A5A40] block">
                  Event Multiple Dates ({formDates.length} selected):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {formDates.map((d) => (
                    <span key={d} className="px-2 py-0.5 rounded-lg bg-white border border-[#D8D2C2] font-mono text-[11px] font-bold flex items-center gap-1">
                      <span>{formatEventDate(d)}</span>
                      <button
                        type="button"
                        onClick={() => setFormDates(formDates.filter(item => item !== d))}
                        className="text-rose-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="date"
                    value={formNewDate}
                    onChange={(e) => setFormNewDate(e.target.value)}
                    className="px-2.5 py-1.5 rounded-xl border border-[#E8E2D6] bg-white text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (formNewDate && !formDates.includes(formNewDate)) {
                        setFormDates([...formDates, formNewDate].sort());
                        setFormNewDate('');
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#5A5A40] text-white font-bold"
                  >
                    + Add Date
                  </button>
                </div>
              </div>

              {/* Days of week */}
              <div>
                <label className="block font-bold text-[#5D584D] mb-1">Festival Days</label>
                <div className="flex items-center gap-2">
                  {(['fri', 'sat', 'sun'] as const).map((day) => {
                    const active = formDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          setFormDays(prev => 
                            active ? prev.filter(d => d !== day) : [...prev, day]
                          );
                        }}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
                          active ? 'bg-[#5A5A40] text-white' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {day === 'fri' ? 'Friday' : day === 'sat' ? 'Saturday' : 'Sunday'}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#E8E2D6]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-[#7A7566]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#5A5A40] text-white font-bold"
                >
                  {editingEvent ? 'Save Changes' : 'Add Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. BULK EDIT DAYS MODAL FOR EVENTS */}
      {/* ========================================================= */}
      {isBulkEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E8E2D6] w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D6] mb-4">
              <h3 className="font-bold text-base text-[#3D3A30]">
                Bulk Edit Days for {selectedEventIds.length} Events
              </h3>
              <button onClick={() => setIsBulkEditModalOpen(false)} className="text-[#8A8576] hover:text-[#3D3A30]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#5D584D] mb-1.5">
                  Select Days of Week to apply to all selected:
                </label>
                <div className="flex items-center gap-2">
                  {(['fri', 'sat', 'sun'] as const).map((day) => {
                    const active = bulkDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          setBulkDays(prev => 
                            active ? prev.filter(d => d !== day) : [...prev, day]
                          );
                        }}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                          active ? 'bg-[#5A5A40] text-white shadow-xs' : 'bg-[#FDFBF7] text-[#7A7566] border border-[#E8E2D6]'
                        }`}
                      >
                        {day === 'fri' ? 'Friday' : day === 'sat' ? 'Saturday' : 'Sunday'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bulk Dates */}
              <div className="p-3 rounded-2xl bg-[#F7F5EE] border border-[#E8E2D6] space-y-2">
                <label className="font-bold text-[#5A5A40] block">
                  Multiple Dates to apply to all ({bulkDates.length}):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {bulkDates.map((d) => (
                    <span key={d} className="px-2 py-0.5 rounded-lg bg-white border border-[#D8D2C2] font-mono text-[11px] font-bold flex items-center gap-1">
                      <span>{formatEventDate(d)}</span>
                      <button
                        type="button"
                        onClick={() => setBulkDates(bulkDates.filter(item => item !== d))}
                        className="text-rose-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="date"
                    value={bulkNewDate}
                    onChange={(e) => setBulkNewDate(e.target.value)}
                    className="px-2.5 py-1.5 rounded-xl border border-[#E8E2D6] bg-white text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (bulkNewDate && !bulkDates.includes(bulkNewDate)) {
                        setBulkDates([...bulkDates, bulkNewDate].sort());
                        setBulkNewDate('');
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#5A5A40] text-white font-bold"
                  >
                    + Add Date
                  </button>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#E8E2D6]">
                <button
                  type="button"
                  onClick={() => setIsBulkEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-[#7A7566]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteBulkEdit}
                  className="px-5 py-2 rounded-xl bg-[#5A5A40] text-white font-bold"
                >
                  Apply to {selectedEventIds.length} Events
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
