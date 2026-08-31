import React, { useState } from 'react';
import { 
  Layers, 
  DollarSign, 
  Maximize2, 
  Check, 
  Edit2, 
  Save, 
  AlertCircle,
  Truck,
  Store,
  Sparkles
} from 'lucide-react';
import { BoothTier, VendorApplicationRecord } from '../../../types';
import { BOOTH_TIERS } from '../../../data/festivalData';

interface BoothsManagerTabProps {
  applications: VendorApplicationRecord[];
}

export function BoothsManagerTab({ applications }: BoothsManagerTabProps) {
  const [tiers, setTiers] = useState<BoothTier[]>(BOOTH_TIERS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<BoothTier>>({});

  // Tally counts
  const approvedApps = applications.filter(a => a.status === 'approved' || a.status === 'paid');
  const boothCounts: Record<string, number> = {};
  approvedApps.forEach(a => {
    boothCounts[a.selectedBoothId] = (boothCounts[a.selectedBoothId] || 0) + 1;
  });

  const handleStartEdit = (tier: BoothTier) => {
    setEditingId(tier.id);
    setEditForm({ ...tier });
  };

  const handleSave = (id: string) => {
    setTiers(prev => prev.map(t => t.id === id ? { ...t, ...editForm } as BoothTier : t));
    setEditingId(null);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Overview Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E2D6] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-[#3D3A30] text-lg">Booth Spaces & Pricing Tiers</h2>
          <p className="text-xs text-[#8A8576] mt-0.5">
            Configure rates per day, maximum exhibitor capacities, and included booth equipment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-[#F7F5EE] border border-[#E8E2D6] text-xs font-bold text-[#5A5A40]">
            {approvedApps.length} Total Spaces Allocated
          </div>
        </div>
      </div>

      {/* Booth Tier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {tiers.map((tier) => {
          const booked = boothCounts[tier.id] || 0;
          const capacity = tier.capacity || 20;
          const isEditing = editingId === tier.id;
          const percent = Math.min(100, Math.round((booked / capacity) * 100));

          return (
            <div 
              key={tier.id}
              className="bg-white rounded-2xl border border-[#E8E2D6] overflow-hidden shadow-xs flex flex-col justify-between"
            >
              <div className="p-5">
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#F7F5EE] text-[#5A5A40] flex items-center justify-center font-bold">
                      {tier.category === 'FOOD' ? <Truck className="w-4 h-4" /> : <Store className="w-4 h-4" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#3D3A30] text-sm">{tier.name}</h3>
                      <span className="text-[10px] text-[#8A8576] font-mono">{tier.dimensions}</span>
                    </div>
                  </div>

                  {tier.popular && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      Popular
                    </span>
                  )}
                </div>

                {/* Price and Occupancy */}
                {isEditing ? (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#7A7566]">Price Per Day ($)</label>
                      <input
                        type="number"
                        value={editForm.pricePerDay || 0}
                        onChange={(e) => setEditForm({ ...editForm, pricePerDay: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#E8E2D6] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#7A7566]">Max Capacity (Spaces)</label>
                      <input
                        type="number"
                        value={editForm.capacity || 20}
                        onChange={(e) => setEditForm({ ...editForm, capacity: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#E8E2D6] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#7A7566]">Dimensions</label>
                      <input
                        type="text"
                        value={editForm.dimensions || ''}
                        onChange={(e) => setEditForm({ ...editForm, dimensions: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#E8E2D6] text-xs"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="my-3 py-3 border-y border-[#E8E2D6] flex items-baseline justify-between">
                      <div>
                        <span className="text-2xl font-extrabold text-[#3D3A30]">${tier.pricePerDay}</span>
                        <span className="text-xs text-[#8A8576]"> / day</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#5A5A40]">{booked} / {capacity}</span>
                        <span className="text-[10px] text-[#8A8576] block">Booked</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="w-full h-2 bg-[#F0EBE0] rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            percent >= 90 ? 'bg-rose-500' : 'bg-[#5A5A40]'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    <p className="text-xs text-[#6B6658] leading-relaxed mb-3">
                      {tier.description}
                    </p>

                    <div className="space-y-1.5 text-[11px] text-[#7A7566]">
                      <div className="font-semibold text-[#3D3A30]">Included Equipment:</div>
                      {tier.included.map((inc, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-[#5A5A40]" />
                          <span>{inc}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-[#F7F5EE] border-t border-[#E8E2D6] flex items-center justify-end gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 rounded-lg text-xs text-[#7A7566] hover:bg-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave(tier.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#5A5A40] text-white text-xs font-bold flex items-center gap-1"
                    >
                      <Save className="w-3 h-3" />
                      <span>Save Changes</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleStartEdit(tier)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-[#E8E2D6] hover:border-[#5A5A40] text-xs font-bold text-[#5A5A40] flex items-center gap-1 transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit Tier</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
