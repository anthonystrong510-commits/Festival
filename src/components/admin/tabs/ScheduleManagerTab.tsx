import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Clock, 
  MapPin, 
  Trash2, 
  Edit2, 
  Save, 
  X,
  Sparkles
} from 'lucide-react';
import { ScheduleEvent } from '../../../types';
import { SCHEDULE_EVENTS } from '../../../data/festivalData';

export function ScheduleManagerTab() {
  const [events, setEvents] = useState<ScheduleEvent[]>(SCHEDULE_EVENTS);
  const [activeDay, setActiveDay] = useState<string>('Day 1');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [newEvent, setNewEvent] = useState<Omit<ScheduleEvent, 'id'>>({
    day: 'Day 1',
    time: '12:00 PM',
    title: '',
    category: 'Stage Performance',
    location: 'Main Pavilion Amphitheater',
    description: ''
  });

  const filteredEvents = events.filter(e => e.day === activeDay);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const created: ScheduleEvent = {
      ...newEvent,
      id: `evt-${Date.now().toString(36)}`,
      day: activeDay
    };
    setEvents([...events, created]);
    setIsAddModalOpen(false);
    setNewEvent({
      day: activeDay,
      time: '12:00 PM',
      title: '',
      category: 'Stage Performance',
      location: 'Main Pavilion Amphitheater',
      description: ''
    });
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm('Delete this event from the schedule?')) {
      setEvents(events.filter(e => e.id !== id));
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header and Day Selector */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E2D6] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-[#3D3A30] text-lg">Festival Schedule & Entertainment</h2>
          <p className="text-xs text-[#8A8576] mt-0.5">
            Manage stage lineups, culinary demonstrations, workshop hours, and live performances.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Program Item</span>
        </button>
      </div>

      {/* Day Tabs */}
      <div className="flex items-center gap-2">
        {['Day 1', 'Day 2', 'Day 3'].map((d) => (
          <button
            key={d}
            onClick={() => setActiveDay(d)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeDay === d
                ? 'bg-[#5A5A40] text-white shadow-xs'
                : 'bg-white text-[#6B6658] border border-[#E8E2D6] hover:bg-[#F7F5EE]'
            }`}
          >
            {d} Lineup ({events.filter(e => e.day === d).length})
          </button>
        ))}
      </div>

      {/* Schedule Items List */}
      <div className="bg-white rounded-2xl border border-[#E8E2D6] overflow-hidden shadow-xs divide-y divide-[#E8E2D6]">
        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#8A8576]">
            No schedule items listed for {activeDay}. Click "Add Program Item" to add performances or workshops.
          </div>
        ) : (
          filteredEvents.map((evt) => (
            <div key={evt.id} className="p-4 sm:p-5 hover:bg-[#FDFBF7] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="px-3 py-1.5 rounded-xl bg-[#F7F5EE] border border-[#E8E2D6] text-[#5A5A40] font-bold text-xs font-mono shrink-0 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{evt.time}</span>
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-sm text-[#3D3A30]">{evt.title}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAE4D6] text-[#5A5A40]">
                      {evt.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[#8A8576] mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#5A5A40]" />
                    <span>{evt.location}</span>
                  </div>

                  <p className="text-xs text-[#6B6658] mt-1 leading-relaxed">
                    {evt.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => handleDeleteEvent(evt.id)}
                  className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Event Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E8E2D6] w-full max-w-lg shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D6] mb-4">
              <h3 className="font-bold text-base text-[#3D3A30]">Add Event to {activeDay}</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[#8A8576] hover:text-[#3D3A30]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#7A7566] mb-1">Time (e.g. 2:00 PM)</label>
                  <input
                    type="text"
                    required
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#7A7566] mb-1">Category</label>
                  <select
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6]"
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
                <label className="block font-bold text-[#7A7566] mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acoustic Sunset Concert"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#7A7566] mb-1">Location / Stage</label>
                <input
                  type="text"
                  required
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#7A7566] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6]"
                />
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
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
