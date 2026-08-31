import React, { useState } from 'react';
import { 
  Settings, 
  MapPin, 
  Calendar, 
  Mail, 
  Save, 
  Check, 
  Database, 
  ShieldAlert, 
  Sparkles 
} from 'lucide-react';
import { FestivalConfigData } from '../../../types';

interface FestivalSettingsTabProps {
  config: FestivalConfigData;
  onSaveConfig: (config: FestivalConfigData) => void;
  onSeedData: () => void;
  isSeeding: boolean;
}

export function FestivalSettingsTab({
  config,
  onSaveConfig,
  onSeedData,
  isSeeding
}: FestivalSettingsTabProps) {
  const [form, setForm] = useState<FestivalConfigData>({ ...config });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      ...form,
      updatedAt: new Date().toISOString()
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E2D6] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-[#3D3A30] text-lg sm:text-xl">
            Festival Core Settings & Identity
          </h2>
          <p className="text-xs text-[#8A8576] mt-0.5">
            Update the public festival branding, location grounds, admission policies, and contact information.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="px-5 py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
        >
          {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{saveSuccess ? 'Saved to Firestore!' : 'Save Changes'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Basic Brand Identity */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E2D6] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E8E2D6]">
            <Sparkles className="w-4 h-4 text-[#5A5A40]" />
            <h3 className="font-bold text-sm text-[#3D3A30]">Brand & Display Headers</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#7A7566] mb-1">Full Event Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#7A7566] mb-1">Short Brand Name</label>
              <input
                type="text"
                value={form.shortName}
                onChange={(e) => setForm({ ...form, shortName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#7A7566] mb-1">Hero Headline Banner</label>
              <input
                type="text"
                value={form.heroHeadline}
                onChange={(e) => setForm({ ...form, heroHeadline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#7A7566] mb-1">Edition Subtitle</label>
              <input
                type="text"
                value={form.edition}
                onChange={(e) => setForm({ ...form, edition: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-[#7A7566] mb-1">Tagline</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-[#7A7566] mb-1">Festival Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7]"
              />
            </div>
          </div>
        </div>

        {/* Location & Grounds */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E2D6] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E8E2D6]">
            <MapPin className="w-4 h-4 text-[#5A5A40]" />
            <h3 className="font-bold text-sm text-[#3D3A30]">Venue & Grounds Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#7A7566] mb-1">Venue Grounds Name</label>
              <input
                type="text"
                value={form.venueName}
                onChange={(e) => setForm({ ...form, venueName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#7A7566] mb-1">Street Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#7A7566] mb-1">City, State & Region</label>
              <input
                type="text"
                value={form.cityState}
                onChange={(e) => setForm({ ...form, cityState: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#7A7566] mb-1">Organizer Contact Email</label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7]"
              />
            </div>
          </div>
        </div>

        {/* Database & Demo Tools */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E2D6] shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E8E2D6]">
            <Database className="w-4 h-4 text-[#5A5A40]" />
            <h3 className="font-bold text-sm text-[#3D3A30]">Database Maintenance & Seeding</h3>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 text-xs">
            <div>
              <h4 className="font-bold text-[#3D3A30]">Seed Sample Operational Data</h4>
              <p className="text-[#8A8576] text-[11px] mt-0.5">
                Populates sample vendor applications, registered RSVPs, and default email templates in Firestore.
              </p>
            </div>

            <button
              type="button"
              onClick={onSeedData}
              disabled={isSeeding}
              className="px-4 py-2 rounded-xl bg-[#F7F5EE] hover:bg-[#EAE4D6] text-[#5A5A40] border border-[#E8E2D6] font-bold flex items-center gap-2 transition-colors disabled:opacity-50 shrink-0"
            >
              <Database className="w-4 h-4" />
              <span>{isSeeding ? 'Writing to Firestore...' : 'Seed Sample Data'}</span>
            </button>
          </div>
        </div>

      </form>

    </div>
  );
}
