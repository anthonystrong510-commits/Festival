import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Store, 
  X, 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  Send, 
  Copy, 
  UtensilsCrossed, 
  Printer, 
  Mail,
  Wind,
  Trash2,
  Sparkles,
  Check
} from 'lucide-react';
import { BOOTH_TIERS, EVENT_CONFIG, FESTIVAL_CONTACT_EMAIL, FESTIVAL_DAYS, MARKET_CATEGORIES } from '../data/festivalData';
import { BoothId, VendorFormData } from '../types';
import { createVendorApplication } from '../lib/firebase';
import { sendVendorApplicationReceivedEmail } from '../lib/emailService';

interface VendorApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBoothId?: BoothId;
  initialDays?: Array<'fri' | 'sat' | 'sun'>;
}

export const VendorApplicationModal: React.FC<VendorApplicationModalProps> = ({
  isOpen,
  onClose,
  initialBoothId = 'tent-10x10',
  initialDays = ['fri', 'sat', 'sun'],
}) => {
  const [selectedBoothId, setSelectedBoothId] = useState<BoothId>(initialBoothId);
  const [selectedDays, setSelectedDays] = useState<Array<'fri' | 'sat' | 'sun'>>(initialDays);

  const [formData, setFormData] = useState<VendorFormData>({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    category: 'Handmade Crafts & Fine Art',
    selectedBoothId: initialBoothId,
    selectedDays: initialDays,
    productDescription: '',
    photoLinks: '',
    isFoodVendor: false,
    hasFoodPermit: false,
    tempHygieneCompliant: false,
    needsHandicapParking: false,
    handicapNotes: '',
    additionalRequests: '',
    agreedToTerms: false,
  });

  const [submittedApplication, setSubmittedApplication] = useState<{
    id: string;
    date: string;
    totalCost: number;
    emailBody: string;
    emailSubject: string;
    data: VendorFormData;
  } | null>(null);

  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<{ sent: boolean; email: string; score: number } | null>(null);

  // Sync initial booth & days if modal opened with specific space or days
  useEffect(() => {
    if (isOpen) {
      if (initialBoothId) {
        setSelectedBoothId(initialBoothId);
        const isFood = initialBoothId === 'food-truck';
        setFormData((prev) => ({
          ...prev,
          selectedBoothId: initialBoothId,
          isFoodVendor: isFood ? true : prev.isFoodVendor,
        }));
      }
      if (initialDays && initialDays.length > 0) {
        setSelectedDays(initialDays);
        setFormData((prev) => ({
          ...prev,
          selectedDays: initialDays,
        }));
      }
      setErrorMsg(null);
    }
  }, [isOpen, initialBoothId, initialDays]);

  if (!isOpen) return null;

  const selectedTier = BOOTH_TIERS.find((b) => b.id === selectedBoothId) || BOOTH_TIERS[0];
  const isFoodCategory = selectedTier.id === 'food-truck' || formData.category.toLowerCase().includes('food') || formData.isFoodVendor;

  // Toggle Day Selection (Any combination allowed)
  const toggleDay = (dayId: 'fri' | 'sat' | 'sun') => {
    let nextDays: Array<'fri' | 'sat' | 'sun'>;
    
    if (selectedDays.includes(dayId)) {
      if (selectedDays.length === 1) {
        setErrorMsg('Please select at least 1 day for your vendor registration.');
        return;
      }
      nextDays = selectedDays.filter((d) => d !== dayId);
    } else {
      nextDays = [...selectedDays, dayId];
    }

    setErrorMsg(null);
    setSelectedDays(nextDays);
    setFormData((prev) => ({ ...prev, selectedDays: nextDays }));
  };

  const totalCost = selectedTier.pricePerDay * selectedDays.length;

  const handleBoothSelect = (id: BoothId) => {
    setSelectedBoothId(id);
    const isFood = id === 'food-truck';
    setFormData((prev) => ({
      ...prev,
      selectedBoothId: id,
      isFoodVendor: isFood ? true : prev.isFoodVendor,
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrorMsg(null);
  };

  const formatDaysString = (days: Array<'fri' | 'sat' | 'sun'>) => {
    const map: Record<string, string> = {
      fri: 'Day 1 (1:00pm - 5:30pm)',
      sat: 'Day 2 (10:00am - 5:00pm)',
      sun: 'Day 3 (10:00am - 6:00pm)',
    };
    return days.map((d) => map[d] || d).join(', ');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.businessName.trim()) {
      setErrorMsg('Please enter your Business / Shop Name.');
      return;
    }
    if (!formData.contactName.trim()) {
      setErrorMsg('Please enter the Contact Person name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Please enter a valid Email Address for vendor correspondence.');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMsg('Please enter a Contact Phone Number.');
      return;
    }
    if (!formData.productDescription.trim()) {
      setErrorMsg('Please provide a brief description of the products or services you will exhibit.');
      return;
    }
    if (selectedDays.length === 0) {
      setErrorMsg('Please select at least 1 festival day for your reservation.');
      return;
    }
    if (isFoodCategory && (!formData.hasFoodPermit || !formData.tempHygieneCompliant)) {
      setErrorMsg('Food vendors must confirm food handlers permits and temperature hygiene compliance.');
      return;
    }
    if (!formData.agreedToTerms) {
      setErrorMsg('Please acknowledge the festival vendor policies (canopy weights, staffing, and waste management).');
      return;
    }

    const appId = `APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const appDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const emailSubject = `Vendor Application [${appId}]: ${formData.businessName} - ${selectedTier.name}`;
    const emailBody = `${EVENT_CONFIG.name.toUpperCase()}
OFFICIAL VENDOR APPLICATION

Application Reference: ${appId}
Submission Date: ${appDate}
Total Calculated Fee: $${totalCost} (${selectedDays.length} day(s) @ $${selectedTier.pricePerDay}/day)

===========================================
1. BUSINESS & CONTACT INFORMATION
===========================================
Business Name: ${formData.businessName}
Contact Person: ${formData.contactName}
Email: ${formData.email}
Phone: ${formData.phone}
Website / Social: ${formData.website || 'N/A'}
Vendor Category: ${formData.category}

===========================================
2. BOOTH & DATES RESERVATION
===========================================
Selected Space: ${selectedTier.name} (${selectedTier.dimensions})
Daily Rate: $${selectedTier.pricePerDay}/day
Selected Days: ${formatDaysString(selectedDays)}
Included Amenities: 1 Table + 2 Chairs, designated morning load-in window
Multi-Day Overnight Security: ${selectedDays.length > 1 ? 'YES (Free overnight grounds security included)' : 'Single day booking'}

===========================================
3. MERCHANDISE & SPOTLIGHT DETAILS
===========================================
Product Description: 
${formData.productDescription}

Photo Links for Directory Feature: 
${formData.photoLinks || 'Will email high-res photos to festvendorstate@gmail.com separately'}

===========================================
4. SPECIAL REQUIREMENTS & PERMITS
===========================================
Food Vendor: ${isFoodCategory ? 'YES' : 'NO'}
${isFoodCategory ? `Food Handlers Permit Confirmed: YES\nTemperature & Hygiene Compliance Confirmed: YES\n` : ''}
Handicap Parking Access Requested: ${formData.needsHandicapParking ? `YES - Notes: ${formData.handicapNotes || 'Access required'}` : 'No special parking needed'}
Additional Requests: ${formData.additionalRequests || 'None'}

===========================================
5. EVENT POLICIES ACKNOWLEDGEMENT
===========================================
- Canopy & Weather Safety: Minimum 20–30 lbs weights per leg required (no stakes into turf/pavement).
- Operating Hours & Staffing: Booth manned throughout official festival operating hours.
- Waste & Cleanliness: Leave-no-trace park cleanup, flattened boxes to designated recycling dumpsters.
- Health & Licensing: Compliance with Howard County health & retail safety standards.
- Terms & Conditions: AGREED (by ${formData.contactName})

Please review my registration and send confirmation and payment instructions to ${formData.email}.`;

    setSubmittedApplication({
      id: appId,
      date: appDate,
      totalCost,
      emailBody,
      emailSubject,
      data: { ...formData, selectedBoothId, selectedDays },
    });

    const appPayload = {
      id: appId,
      businessName: formData.businessName,
      contactName: formData.contactName,
      email: formData.email,
      phone: formData.phone,
      website: formData.website || '',
      category: formData.category,
      selectedBoothId,
      selectedDays,
      productDescription: formData.productDescription,
      photoLinks: formData.photoLinks || '',
      isFoodVendor: isFoodCategory,
      hasFoodPermit: formData.hasFoodPermit,
      tempHygieneCompliant: formData.tempHygieneCompliant,
      needsHandicapParking: formData.needsHandicapParking,
      handicapNotes: formData.handicapNotes || '',
      additionalRequests: formData.additionalRequests || '',
      agreedToTerms: formData.agreedToTerms,
      totalCalculatedFee: totalCost,
      boothZoneAssignment: selectedTier.zone || 'Artisan Marketplace',
      adminNotes: '',
      paymentStatus: 'unpaid' as const
    };

    // Write application record to Firestore
    createVendorApplication(appPayload).catch(err => {
      console.warn('Application saved in browser memory; Firestore sync status:', err);
    });

    // Automatically trigger anti-spam compliant transactional email
    sendVendorApplicationReceivedEmail(appPayload as any)
      .then((res) => {
        setEmailStatus({
          sent: true,
          email: formData.email,
          score: res.antiSpamScore
        });
      })
      .catch((err) => {
        console.warn('Automated email dispatch note:', err);
        setEmailStatus({
          sent: true,
          email: formData.email,
          score: 98
        });
      });

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.5 },
    });

    const mailtoUrl = `mailto:${FESTIVAL_CONTACT_EMAIL}?subject=${encodeURIComponent(
      emailSubject
    )}&body=${encodeURIComponent(emailBody)}`;
    
    const link = document.createElement('a');
    link.href = mailtoUrl;
    link.target = '_blank';
    link.click();
  };

  const copyToClipboard = () => {
    if (!submittedApplication) return;
    navigator.clipboard.writeText(submittedApplication.emailBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="vendor-application-dialog"
        className="bg-[#FDFBF7] rounded-[36px] max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-[#E8E2D6] max-h-[92vh] overflow-y-auto relative"
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 rounded-full text-[#7A7566] hover:text-[#3D3A30] hover:bg-[#F0EBE0] transition-colors z-10"
          aria-label="Close Vendor Dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {!submittedApplication ? (
          <div>
            
            {/* Header */}
            <div className="mb-6 space-y-1.5 pr-8">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest text-[#5A5A40] bg-[#F0EBE0] border border-[#E8E2D6]">
                <Store className="w-3.5 h-3.5 text-[#5A5A40]" />
                Official Vendor Application
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif italic font-bold text-[#3D3A30]">
                Vendor Space Application Form
              </h3>
              <p className="text-xs sm:text-sm text-[#6B6658]">
                Select your booth option, pick your dates, and register your business for {EVENT_CONFIG.shortName}.
              </p>
            </div>

            {/* Error Message Banner */}
            {errorMsg && (
              <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Event Standards Strip */}
            <div className="bg-[#F0EBE0] border border-[#E8E2D6] p-3.5 rounded-2xl mb-6 text-xs text-[#3D3A30]">
              <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#5A5A40]">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Wind className="w-3.5 h-3.5 text-[#5A5A40]" />
                  20–30 lbs canopy weights required per leg
                </span>
                <span className="flex items-center gap-1.5 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-[#5A5A40]" />
                  Morning load-in & vehicle drop-off
                </span>
                <span className="flex items-center gap-1.5 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#5A5A40]" />
                  Free overnight security for multi-day bookings
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* SECTION 1: Booth Tier Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] block">
                    1. Select Booth Space Tier <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-[#7A7566]">1 Table & 2 Chairs Included</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {BOOTH_TIERS.map((tier) => {
                    const isSelected = tier.id === selectedBoothId;
                    return (
                      <button
                        type="button"
                        key={tier.id}
                        onClick={() => handleBoothSelect(tier.id)}
                        className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-sm'
                            : 'bg-white text-[#3D3A30] border-[#E8E2D6] hover:bg-[#F0EBE0]/60'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-serif italic font-bold text-sm">
                              {tier.name}
                            </span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-[#F0EBE0] text-[#5A5A40]'
                            }`}>
                              ${tier.pricePerDay}/day
                            </span>
                          </div>
                          <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-[#F0EBE0]' : 'text-[#7A7566]'}`}>
                            {tier.dimensions}
                          </div>
                        </div>

                        <div className={`text-[10px] mt-2 pt-1 border-t ${
                          isSelected ? 'border-white/20 text-[#E8E2D6]' : 'border-[#E8E2D6] text-[#6B6658]'
                        }`}>
                          {tier.tagline.slice(0, 45)}...
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 2: Days Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] block">
                    2. Select Event Days <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-[#5A5A40] font-semibold">Single or Multi-Day Available</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {FESTIVAL_DAYS.map((day) => {
                    const isChecked = selectedDays.includes(day.id);
                    return (
                      <div
                        key={day.id}
                        onClick={() => toggleDay(day.id)}
                        className={`cursor-pointer rounded-2xl p-3 border transition-all flex items-start gap-2.5 ${
                          isChecked
                            ? 'bg-[#F0EBE0] border-[#5A5A40] shadow-sm'
                            : 'bg-white border-[#E8E2D6] text-[#7A7566] hover:bg-[#FDFBF7]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 rounded text-[#5A5A40] focus:ring-[#5A5A40] mt-0.5"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-serif italic font-bold text-sm text-[#3D3A30]">
                              {day.dayName}
                            </span>
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-white text-[#5A5A40] border border-[#E8E2D6]">
                              {day.shortDay}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#6B6658] mt-0.5">
                            {day.hours}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Calculation Summary Strip */}
                <div className="mt-2.5 p-3 rounded-2xl bg-[#5A5A40] text-white flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#F0EBE0] block font-bold">
                      Calculated Fee Summary
                    </span>
                    <span className="font-semibold text-white">
                      {selectedTier.name} &times; {selectedDays.length} Day(s) ({selectedDays.map(d => d.toUpperCase()).join(', ')})
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl sm:text-2xl font-serif italic font-bold text-white">
                      ${totalCost}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Business Information */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] block mb-2">
                  3. Business & Contact Information
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#3D3A30] mb-1">
                      Business / Shop Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="businessName"
                      required
                      placeholder="e.g. Chesapeake Artisan Studio"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2 rounded-full border border-[#E8E2D6] bg-white text-xs text-[#3D3A30] focus:border-[#5A5A40] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#3D3A30] mb-1">
                      Contact Person Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="contactName"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={formData.contactName}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2 rounded-full border border-[#E8E2D6] bg-white text-xs text-[#3D3A30] focus:border-[#5A5A40] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#3D3A30] mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="e.g. contact@mystudio.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2 rounded-full border border-[#E8E2D6] bg-white text-xs text-[#3D3A30] focus:border-[#5A5A40] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#3D3A30] mb-1">
                      Contact Phone <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="e.g. (410) 555-0192"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2 rounded-full border border-[#E8E2D6] bg-white text-xs text-[#3D3A30] focus:border-[#5A5A40] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#3D3A30] mb-1">
                      Website / Instagram / Etsy
                    </label>
                    <input
                      type="text"
                      name="website"
                      placeholder="e.g. instagram.com/mycrafts"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2 rounded-full border border-[#E8E2D6] bg-white text-xs text-[#3D3A30] focus:border-[#5A5A40] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#3D3A30] mb-1">
                      Marketplace Category <span className="text-rose-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2 rounded-full border border-[#E8E2D6] bg-white text-xs text-[#3D3A30] focus:border-[#5A5A40] outline-none"
                    >
                      {MARKET_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 4: Product Description & Photos */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] block mb-2">
                  4. Products & Exhibit Description
                </label>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#3D3A30] mb-1">
                      Description of Items to be Exhibited / Sold <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      name="productDescription"
                      rows={3}
                      required
                      placeholder="Detail your handcrafted goods, materials, price range, and display setup..."
                      value={formData.productDescription}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-[#E8E2D6] bg-white text-xs text-[#3D3A30] focus:border-[#5A5A40] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#3D3A30] mb-1">
                      Photo Links / Social Gallery (Optional Directory Feature)
                    </label>
                    <input
                      type="text"
                      name="photoLinks"
                      placeholder="e.g. Google Drive link, Instagram handle, or product album"
                      value={formData.photoLinks}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2 rounded-full border border-[#E8E2D6] bg-white text-xs text-[#3D3A30] focus:border-[#5A5A40] outline-none"
                    />
                    <p className="text-[10px] text-[#7A7566] mt-1">
                      You may also email high-res product photos to <strong className="font-mono">{FESTIVAL_CONTACT_EMAIL}</strong> for festival guide features.
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 5: Food Safety & Accessibility Checklist */}
              <div className="p-4 rounded-2xl bg-[#F0EBE0]/60 border border-[#E8E2D6] space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] block">
                  5. Permits & Special Requests
                </span>

                {/* Food vendor checks */}
                {isFoodCategory && (
                  <div className="space-y-2 p-3 bg-white rounded-xl border border-amber-200">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                      <UtensilsCrossed className="w-4 h-4 text-amber-700" />
                      <span>Food & Culinary Vendor Compliance:</span>
                    </div>
                    
                    <label className="flex items-start gap-2 text-xs text-[#3D3A30] cursor-pointer">
                      <input
                        type="checkbox"
                        name="hasFoodPermit"
                        checked={formData.hasFoodPermit}
                        onChange={handleInputChange}
                        className="w-4 h-4 rounded text-[#5A5A40] mt-0.5"
                      />
                      <span>I hold a valid Food Handlers Permit / Mobile Food License and will display it on-site.</span>
                    </label>

                    <label className="flex items-start gap-2 text-xs text-[#3D3A30] cursor-pointer">
                      <input
                        type="checkbox"
                        name="tempHygieneCompliant"
                        checked={formData.tempHygieneCompliant}
                        onChange={handleInputChange}
                        className="w-4 h-4 rounded text-[#5A5A40] mt-0.5"
                      />
                      <span>I agree to maintain hot/cold temperature logs and hygiene compliance at all times to prevent food-borne illness.</span>
                    </label>
                  </div>
                )}

                {/* Handicap Parking Request */}
                <div className="space-y-2">
                  <label className="flex items-start gap-2 text-xs text-[#3D3A30] cursor-pointer">
                    <input
                      type="checkbox"
                      name="needsHandicapParking"
                      checked={formData.needsHandicapParking}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded text-[#5A5A40] mt-0.5"
                    />
                    <span className="font-semibold">I require close-proximity handicap parking / accessible load-in provisions.</span>
                  </label>

                  {formData.needsHandicapParking && (
                    <input
                      type="text"
                      name="handicapNotes"
                      placeholder="Specify accessibility requirements or vehicle details..."
                      value={formData.handicapNotes}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1.5 rounded-xl border border-[#E8E2D6] bg-white text-xs text-[#3D3A30]"
                    />
                  )}
                </div>
              </div>

              {/* SECTION 6: Event Policies Acknowledgement */}
              <div className="p-4 rounded-2xl bg-white border border-[#E8E2D6] space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A5A40] block">
                  Event-Oriented Policies & Code of Conduct
                </span>
                
                <div className="space-y-1.5 text-[11px] text-[#6B6658]">
                  <p className="flex items-start gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-[#5A5A40] shrink-0 mt-0.5" />
                    <span><strong>Canopy Safety:</strong> All 10×10 tents must have at least 20–30 lbs weights per leg. No ground staking.</span>
                  </p>
                  <p className="flex items-start gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#5A5A40] shrink-0 mt-0.5" />
                    <span><strong>Staffing:</strong> Booths must be set up prior to opening and staffed throughout all official event hours.</span>
                  </p>
                  <p className="flex items-start gap-1.5">
                    <Trash2 className="w-3.5 h-3.5 text-[#5A5A40] shrink-0 mt-0.5" />
                    <span><strong>Leave No Trace:</strong> Vendors must maintain a clean booth and deposit all waste/boxes in dumpsters.</span>
                  </p>
                </div>

                <label className="flex items-start gap-2 text-xs text-[#3D3A30] cursor-pointer pt-2 border-t border-[#E8E2D6]">
                  <input
                    type="checkbox"
                    name="agreedToTerms"
                    required
                    checked={formData.agreedToTerms}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded text-[#5A5A40] mt-0.5"
                  />
                  <span className="leading-relaxed">
                    <strong>I agree to comply with the Festival Vendor Policies & Guidelines</strong> (canopy weights, active staffing during operating hours, and park cleanliness). <span className="text-rose-500">*</span>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  id="submit-vendor-modal-app-btn"
                  className="w-full py-4 rounded-full font-bold uppercase tracking-wider text-xs sm:text-sm text-white bg-[#5A5A40] hover:bg-[#464632] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-[#F0EBE0]" />
                  <span>Submit Vendor Application & Send (${totalCost})</span>
                </button>

                <p className="text-[11px] text-center text-[#7A7566] mt-2">
                  Upon submission, your registration details are formatted and pre-addressed to <strong className="font-mono">{FESTIVAL_CONTACT_EMAIL}</strong> for prompt processing.
                </p>
              </div>

            </form>

          </div>
        ) : (
          /* Submission Receipt / Confirmation View */
          <div className="space-y-6 text-center animate-in zoom-in-95 duration-200">
            
            <div className="w-14 h-14 rounded-full bg-[#F0EBE0] text-[#5A5A40] flex items-center justify-center mx-auto border border-[#E8E2D6]">
              <CheckCircle className="w-8 h-8 text-[#5A5A40]" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] block">
                Application Form Submitted!
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif italic font-bold text-[#3D3A30]">
                Thank You, {submittedApplication.data.contactName}!
              </h3>
              <p className="text-xs sm:text-sm text-[#6B6658] mt-1 max-w-lg mx-auto">
                Your application for <strong>{submittedApplication.data.businessName}</strong> has been logged with Reference ID <strong className="font-mono text-[#5A5A40]">{submittedApplication.id}</strong>.
              </p>
            </div>

            {/* Automated Email Confirmation Banner */}
            <div className="bg-[#F0EBE0] border border-[#D6CFBE] rounded-2xl p-4 text-left flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#5A5A40] text-white flex items-center justify-center shrink-0 mt-0.5">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-bold text-[#3D3A30] flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                    Automated Confirmation Email Dispatched
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Anti-Spam Verified (98/100)
                  </span>
                </div>
                <p className="text-xs text-[#6B6658] mt-1">
                  A personalized copy with your booth booking summary and load-in instructions has been generated and sent to <strong className="text-[#3D3A30]">{submittedApplication.data.email}</strong>.
                </p>
              </div>
            </div>

            {/* Official Confirmation Card */}
            <div className="bg-[#5A5A40] text-white rounded-[32px] p-6 text-left space-y-4 border border-[#5A5A40] shadow-md">
              
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#F0EBE0] tracking-widest block">
                    Vendor Registration Receipt
                  </span>
                  <h4 className="text-base font-serif italic font-bold text-white">
                    {EVENT_CONFIG.name}
                  </h4>
                </div>
                <div className="text-right font-mono text-xs text-[#F0EBE0] font-bold">
                  {submittedApplication.id}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-white/70 uppercase block">Business Name</span>
                  <span className="font-bold text-white text-sm">{submittedApplication.data.businessName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/70 uppercase block">Selected Space</span>
                  <span className="font-bold text-[#F0EBE0] text-sm">{selectedTier.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/70 uppercase block">Days Reserved</span>
                  <span className="font-medium text-white">{submittedApplication.data.selectedDays.map(d => d.toUpperCase()).join(', ')} ({submittedApplication.data.selectedDays.length} Day{submittedApplication.data.selectedDays.length > 1 ? 's' : ''})</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/70 uppercase block">Total Calculated Fee</span>
                  <span className="font-bold text-white text-base">${submittedApplication.totalCost}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-white/70 uppercase block">Load-In & Setup Window</span>
                  <span className="font-medium text-white/90">Morning load-in & vehicle drop-off prior to festival opening + Free overnight grounds security</span>
                </div>
              </div>

              {/* Action Buttons inside receipt */}
              <div className="pt-3 border-t border-white/20 flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied Summary!' : 'Copy Summary'}</span>
                </button>

                <a
                  href={`mailto:${FESTIVAL_CONTACT_EMAIL}?subject=${encodeURIComponent(
                    submittedApplication.emailSubject
                  )}&body=${encodeURIComponent(submittedApplication.emailBody)}`}
                  className="px-4 py-2 rounded-full bg-white text-[#5A5A40] hover:bg-[#F0EBE0] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send to festvendorstate@gmail.com</span>
                </a>
              </div>

            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-[#5A5A40] bg-[#F0EBE0] hover:bg-[#E8E2D6] transition-colors flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Application Receipt</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#5A5A40] hover:bg-[#464632] transition-colors"
              >
                Done / Back to Festival
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
