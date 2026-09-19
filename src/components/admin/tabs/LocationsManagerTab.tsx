import React, { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar, 
  CheckSquare, 
  Square, 
  Clock, 
  Layers, 
  Building2, 
  Globe, 
  Search, 
  Filter, 
  X, 
  Check, 
  AlertCircle, 
  Sparkles, 
  CheckCircle2, 
  CalendarDays,
  Tag,
  ArrowUpDown,
  RefreshCw,
  ExternalLink,
  Navigation,
  Flame,
  ArrowRight
} from 'lucide-react';
import { USA_STATES_CITIES_DATA, UsaStateMarket } from '../../../data/usaStatesCitiesData';
import { EventLocationMarket, CustomCityEntry } from '../../../types';
import { 
  subscribeEventLocations, 
  saveEventLocation, 
  deleteEventLocation, 
  bulkUpdateLocationsDays,
  subscribeCustomCities,
  saveCustomCity,
  deleteCustomCity,
  formatEventDate,
  generateDateRangeList,
  formatEventDateRange,
  getCitiesForState
} from '../../../lib/locationMarketService';
import { TypesOfVendorBadge } from '../../TypesOfVendorBadge';

export function LocationsManagerTab() {
  const [locations, setLocations] = useState<EventLocationMarket[]>([]);
  const [customCities, setCustomCities] = useState<CustomCityEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStateCode, setSelectedStateCode] = useState<string>('ALL');
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('ALL');
  
  // Selection for bulk operations
  const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>([]);

  // Modals
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<EventLocationMarket | null>(null);
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);
  const [isAddCityModalOpen, setIsAddCityModalOpen] = useState(false);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // New/Editing Location Form State
  const [formTitle, setFormTitle] = useState('');
  const [formStateCode, setFormStateCode] = useState('SC');
  const [formCityName, setFormCityName] = useState('Columbia');
  const [isCustomCityInput, setIsCustomCityInput] = useState(false);
  const [customCityInputText, setCustomCityInputText] = useState('');
  const [formVenueName, setFormVenueName] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formZipCode, setFormZipCode] = useState('');
  const [formMapUrl, setFormMapUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');

  // Date Selection State (Date Range & Non-stop support)
  const [formDateMode, setFormDateMode] = useState<'range' | 'specific'>('range');
  const [formStartDate, setFormStartDate] = useState('2026-10-02');
  const [formEndDate, setFormEndDate] = useState('2026-10-11');
  const [formIsNonStop, setFormIsNonStop] = useState(true);
  const [formDates, setFormDates] = useState<string[]>(['2026-10-02', '2026-10-03', '2026-10-04']);
  const [formNewDateInput, setFormNewDateInput] = useState('');
  const [formDays, setFormDays] = useState<Array<'fri' | 'sat' | 'sun'>>(['fri', 'sat', 'sun']);
  const [formHours, setFormHours] = useState('10:00 AM - 6:00 PM');
  const [formVendorTypes, setFormVendorTypes] = useState<string[]>(['Music', 'Art', 'Craft', 'Food', 'Commercial']);
  const [formBoothPrice, setFormBoothPrice] = useState(75);
  const [formTotalBooths, setFormTotalBooths] = useState(120);
  const [formActive, setFormActive] = useState(true);

  // Bulk Edit Form State
  const [bulkDays, setBulkDays] = useState<Array<'fri' | 'sat' | 'sun'>>(['fri', 'sat', 'sun']);
  const [bulkDates, setBulkDates] = useState<string[]>(['2026-10-02', '2026-10-03', '2026-10-04']);
  const [bulkNewDateInput, setBulkNewDateInput] = useState('');
  const [bulkStartDate, setBulkStartDate] = useState('2026-10-02');
  const [bulkEndDate, setBulkEndDate] = useState('2026-10-11');
  const [bulkIsNonStop, setBulkIsNonStop] = useState(true);
  const [bulkActionType, setBulkActionType] = useState<'set_range' | 'replace_days' | 'replace_dates' | 'append_dates' | 'set_both'>('set_range');
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);

  // New Custom City Form State
  const [newCityStateCode, setNewCityStateCode] = useState('SC');
  const [newCityName, setNewCityName] = useState('');
  const [newCityPopulation, setNewCityPopulation] = useState('50,000');
  const [newCityIsOver200k, setNewCityIsOver200k] = useState(false);

  // Real-time Firestore Subscriptions
  useEffect(() => {
    const unsubLocs = subscribeEventLocations((list) => {
      setLocations(list);
    });
    const unsubCities = subscribeCustomCities((cities) => {
      setCustomCities(cities);
    });
    return () => {
      unsubLocs();
      unsubCities();
    };
  }, []);

  const showToast = (msg: string) => {
    setFeedbackNotice(msg);
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  // Filtered locations
  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      const matchState = selectedStateCode === 'ALL' || loc.stateCode === selectedStateCode;
      const matchDay = selectedDayFilter === 'ALL' || loc.days.includes(selectedDayFilter as any);
      const query = searchQuery.trim().toLowerCase();
      const matchQuery = 
        !query ||
        loc.title.toLowerCase().includes(query) ||
        loc.cityName.toLowerCase().includes(query) ||
        loc.stateCode.toLowerCase().includes(query) ||
        loc.stateName.toLowerCase().includes(query) ||
        loc.venueName.toLowerCase().includes(query) ||
        loc.description.toLowerCase().includes(query);
      return matchState && matchDay && matchQuery;
    });
  }, [locations, selectedStateCode, selectedDayFilter, searchQuery]);

  // Bulk Selection Toggles
  const handleToggleSelectAll = () => {
    if (selectedLocationIds.length === filteredLocations.length) {
      setSelectedLocationIds([]);
    } else {
      setSelectedLocationIds(filteredLocations.map(l => l.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedLocationIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Handle Form State Change (cascades cities)
  const handleFormStateChange = (newCode: string) => {
    setFormStateCode(newCode);
    setIsCustomCityInput(false);
    setCustomCityInputText('');
    const cities = getCitiesForState(newCode, customCities);
    const newCity = cities[0] || '';
    setFormCityName(newCity);
    if (!editingLocation) {
      setFormTitle(`2026 ${newCity} First Fridays & Marketplace`);
    }
  };

  // Handle Form City Change
  const handleFormCityChange = (cityNameVal: string) => {
    if (cityNameVal === '__CUSTOM__') {
      setIsCustomCityInput(true);
      setCustomCityInputText('');
      setFormCityName('');
    } else {
      setIsCustomCityInput(false);
      setCustomCityInputText('');
      setFormCityName(cityNameVal);
      if (!editingLocation) {
        setFormTitle(`2026 ${cityNameVal} First Fridays & Marketplace`);
      }
    }
  };

  // Handle Date Range Updates
  const handleDateRangeUpdate = (start: string, end: string, isNonStop: boolean) => {
    setFormStartDate(start);
    setFormEndDate(end);
    setFormIsNonStop(isNonStop);
    if (start && end) {
      const generated = generateDateRangeList(start, end);
      setFormDates(generated);
    }
  };

  // Open Edit Location Modal
  const handleOpenEdit = (loc: EventLocationMarket) => {
    setEditingLocation(loc);
    setFormTitle(loc.title);
    setFormStateCode(loc.stateCode);
    setFormCityName(loc.cityName);
    setIsCustomCityInput(false);
    setCustomCityInputText('');
    setFormVenueName(loc.venueName);
    setFormAddress(loc.address || '');
    setFormZipCode(loc.zipCode || '');
    setFormMapUrl(loc.mapUrl || '');
    setFormDescription(loc.description);
    
    // Date & Range setup
    const initialDates = loc.dates && loc.dates.length > 0 ? loc.dates : ['2026-10-02'];
    setFormDates(initialDates);
    const startD = loc.startDate || initialDates[0];
    const endD = loc.endDate || initialDates[initialDates.length - 1];
    setFormStartDate(startD);
    setFormEndDate(endD);
    setFormIsNonStop(loc.isNonStop !== undefined ? loc.isNonStop : true);
    setFormDateMode(loc.startDate || loc.dates?.length > 1 ? 'range' : 'specific');

    setFormDays(loc.days || ['fri', 'sat', 'sun']);
    setFormHours(loc.hours || '10:00 AM - 6:00 PM');
    setFormVendorTypes(loc.vendorTypesAccepted || ['Music', 'Art', 'Craft', 'Food', 'Commercial']);
    setFormBoothPrice(loc.boothPricePerDay || 75);
    setFormTotalBooths(loc.totalBoothsCount || 100);
    setFormActive(loc.active);
    setIsAddLocationModalOpen(true);
  };

  // Open Create New Location Modal
  const handleOpenCreate = () => {
    setEditingLocation(null);
    const defaultState = selectedStateCode !== 'ALL' ? selectedStateCode : 'SC';
    const stateCities = getCitiesForState(defaultState, customCities);
    const defaultCity = stateCities[0] || 'Columbia';

    setFormTitle(`2026 ${defaultCity} First Fridays & Marketplace`);
    setFormStateCode(defaultState);
    setFormCityName(defaultCity);
    setIsCustomCityInput(false);
    setCustomCityInputText('');
    setFormVenueName('Downtown Promenade & Market Commons');
    setFormAddress('1200 Main Street');
    setFormZipCode('29201');
    setFormMapUrl('');
    setFormDescription(`${defaultCity} Fall First Fridays & Weekend Marketplace. Featuring juried artisan maker booths, food trucks, craft creators, and regional acoustic music.`);
    
    setFormStartDate('2026-10-02');
    setFormEndDate('2026-10-11');
    setFormIsNonStop(true);
    setFormDateMode('range');
    setFormDates(generateDateRangeList('2026-10-02', '2026-10-11'));
    setFormDays(['fri', 'sat', 'sun']);
    setFormHours('10:00 AM - 6:00 PM');
    setFormVendorTypes(['Music', 'Art', 'Craft', 'Food', 'Commercial']);
    setFormBoothPrice(75);
    setFormTotalBooths(120);
    setFormActive(true);
    setIsAddLocationModalOpen(true);
  };

  // Save Location
  const handleSaveLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalCity = isCustomCityInput ? customCityInputText.trim() : formCityName.trim();
    if (!finalCity) {
      alert('City name is required.');
      return;
    }

    const stateObj = USA_STATES_CITIES_DATA.find(s => s.code === formStateCode);
    const stateName = stateObj?.name || formStateCode;

    const computedDates = formDateMode === 'range' && formStartDate && formEndDate
      ? generateDateRangeList(formStartDate, formEndDate)
      : (formDates.length > 0 ? formDates : ['2026-10-02']);

    const payload: Partial<EventLocationMarket> & { cityName: string; stateCode: string } = {
      id: editingLocation?.id,
      title: formTitle.trim() || `2026 ${finalCity} First Fridays`,
      stateCode: formStateCode,
      stateName,
      cityName: finalCity,
      venueName: formVenueName.trim() || `${finalCity} Festival Grounds`,
      address: formAddress.trim(),
      zipCode: formZipCode.trim(),
      mapUrl: formMapUrl.trim(),
      description: formDescription.trim(),
      startDate: formDateMode === 'range' ? formStartDate : computedDates[0],
      endDate: formDateMode === 'range' ? formEndDate : computedDates[computedDates.length - 1],
      isNonStop: formDateMode === 'range' ? formIsNonStop : false,
      dates: computedDates,
      days: formDays.length > 0 ? formDays : ['fri', 'sat', 'sun'],
      hours: formHours,
      vendorTypesAccepted: formVendorTypes,
      boothPricePerDay: Number(formBoothPrice) || 75,
      totalBoothsCount: Number(formTotalBooths) || 100,
      active: formActive
    };

    await saveEventLocation(payload);
    setIsAddLocationModalOpen(false);
    showToast(editingLocation ? 'Location updated successfully!' : 'New location created successfully!');
  };

  // Delete Location
  const handleDeleteLocation = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the location "${name}"?`)) {
      await deleteEventLocation(id);
      setSelectedLocationIds(prev => prev.filter(i => i !== id));
      showToast(`Location "${name}" deleted.`);
    }
  };

  // Execute Bulk Edit Days & Dates
  const handleExecuteBulkEdit = async () => {
    if (selectedLocationIds.length === 0) return;
    setIsProcessingBulk(true);

    try {
      const datesToApply = bulkActionType === 'set_range'
        ? generateDateRangeList(bulkStartDate, bulkEndDate)
        : bulkDates;

      await bulkUpdateLocationsDays(selectedLocationIds, {
        actionType: bulkActionType,
        days: bulkDays,
        dates: datesToApply,
        appendDates: bulkDates,
        startDate: bulkStartDate,
        endDate: bulkEndDate,
        isNonStop: bulkIsNonStop
      });

      setIsProcessingBulk(false);
      setIsBulkEditModalOpen(false);
      showToast(`Bulk updated days and dates across ${selectedLocationIds.length} locations!`);
      setSelectedLocationIds([]);
    } catch (err) {
      console.error(err);
      setIsProcessingBulk(false);
      alert('Failed to update in bulk. Please check console.');
    }
  };

  // Quick Date Helpers for Forms
  const handleAddDateToForm = (dateStr: string) => {
    if (!dateStr) return;
    if (!formDates.includes(dateStr)) {
      setFormDates(prev => [...prev, dateStr].sort());
    }
    setFormNewDateInput('');
  };

  const handleRemoveDateFromForm = (dateStr: string) => {
    setFormDates(prev => prev.filter(d => d !== dateStr));
  };

  const handleAddDateToBulk = (dateStr: string) => {
    if (!dateStr) return;
    if (!bulkDates.includes(dateStr)) {
      setBulkDates(prev => [...prev, dateStr].sort());
    }
    setBulkNewDateInput('');
  };

  const handleRemoveDateFromBulk = (dateStr: string) => {
    setBulkDates(prev => prev.filter(d => d !== dateStr));
  };

  // Add Custom City
  const handleSaveCustomCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCityName.trim()) return;

    const num = parseInt(newCityPopulation.replace(/[^0-9]/g, ''), 10) || 50000;
    const newEntry: CustomCityEntry = {
      id: `custom-city-${newCityStateCode.toLowerCase()}-${newCityName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      name: newCityName.trim(),
      stateCode: newCityStateCode,
      population: newCityPopulation,
      populationNumber: num,
      isOver200k: newCityIsOver200k || num >= 200000
    };

    await saveCustomCity(newEntry);
    setIsAddCityModalOpen(false);
    setNewCityName('');
    showToast(`Added custom city "${newEntry.name}, ${newEntry.stateCode}" to directory!`);
  };

  // Get cities list for selected state
  const currentStateObj = USA_STATES_CITIES_DATA.find(s => s.code === (selectedStateCode !== 'ALL' ? selectedStateCode : 'SC'));
  const currentCustomCities = customCities.filter(c => selectedStateCode === 'ALL' || c.stateCode === selectedStateCode);

  return (
    <div className="space-y-6 pb-20">

      {/* Top Banner & Instructions */}
      <div className="bg-white p-6 rounded-3xl border border-[#E8E2D6] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-[#5A5A40]/10 text-[#5A5A40]">
              <MapPin className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-[#3D3A30]">States, Cities & Event Locations</h1>
          </div>
          <p className="text-xs text-[#7A7566] mt-1 max-w-2xl">
            Manage festival locations across all 50 states and cities. Set venue descriptions, add multiple dates per event, and use the <strong>Bulk Edit Days</strong> tool to update schedules across multiple cities simultaneously.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsAddCityModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#F0EBE0] hover:bg-[#E5DFD2] text-[#5A5A40] text-xs font-bold flex items-center gap-1.5 transition-colors border border-[#E8E2D6]"
          >
            <Building2 className="w-4 h-4" />
            <span>Add Custom City</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-2xl bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Location Event</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast Notice */}
      {feedbackNotice && (
        <div className="p-3.5 rounded-2xl bg-[#5A5A40] text-white text-xs font-semibold flex items-center gap-2 shadow-md animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#A8D5BA]" />
          <span>{feedbackNotice}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-[#E8E2D6] shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8576]" />
            <input
              type="text"
              placeholder="Search by city (e.g. Columbia, Florence, Houston), state, or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D6] text-xs focus:outline-hidden focus:border-[#5A5A40]"
            />
          </div>

          {/* State Filter Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Globe className="w-4 h-4 text-[#5A5A40] shrink-0" />
            <select
              value={selectedStateCode}
              onChange={(e) => setSelectedStateCode(e.target.value)}
              className="w-full sm:w-48 py-2.5 px-3 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D6] text-xs font-semibold text-[#3D3A30] focus:outline-hidden focus:border-[#5A5A40]"
            >
              <option value="ALL">All 50 States + DC ({USA_STATES_CITIES_DATA.length})</option>
              {USA_STATES_CITIES_DATA.map((st) => (
                <option key={st.code} value={st.code}>
                  {st.name} ({st.code})
                </option>
              ))}
            </select>
          </div>

          {/* Day Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Calendar className="w-4 h-4 text-[#5A5A40] shrink-0" />
            <select
              value={selectedDayFilter}
              onChange={(e) => setSelectedDayFilter(e.target.value)}
              className="w-full sm:w-36 py-2.5 px-3 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D6] text-xs font-semibold text-[#3D3A30] focus:outline-hidden focus:border-[#5A5A40]"
            >
              <option value="ALL">All Days</option>
              <option value="fri">Friday Events</option>
              <option value="sat">Saturday Events</option>
              <option value="sun">Sunday Events</option>
            </select>
          </div>
        </div>

        {/* Active Filters Summary & Select All Row */}
        <div className="flex items-center justify-between pt-2 border-t border-[#E8E2D6]/80 text-xs text-[#7A7566]">
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleSelectAll}
              className="flex items-center gap-1.5 font-bold text-[#5A5A40] hover:text-[#3D3A30] transition-colors"
            >
              {selectedLocationIds.length === filteredLocations.length && filteredLocations.length > 0 ? (
                <CheckSquare className="w-4 h-4 text-[#5A5A40]" />
              ) : (
                <Square className="w-4 h-4 text-[#8A8576]" />
              )}
              <span>
                {selectedLocationIds.length === filteredLocations.length && filteredLocations.length > 0
                  ? 'Deselect All'
                  : 'Select All Locations'}
              </span>
            </button>
            <span>Showing {filteredLocations.length} locations across states</span>
          </div>

          {selectedLocationIds.length > 0 && (
            <div className="font-bold text-[#5A5A40]">
              {selectedLocationIds.length} selected for bulk action
            </div>
          )}
        </div>
      </div>

      {/* FLOATING BULK EDIT BAR (Visible when 1+ locations selected) */}
      {selectedLocationIds.length > 0 && (
        <div className="sticky top-20 z-30 bg-[#3D3A30] text-white p-4 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in border border-[#5A5A40]">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#5A5A40] flex items-center justify-center font-bold text-xs">
              {selectedLocationIds.length}
            </span>
            <div>
              <h4 className="font-bold text-sm">Bulk Editing {selectedLocationIds.length} Locations</h4>
              <p className="text-[11px] text-[#D8D2C2]">
                Apply days of week, multiple dates, or active status simultaneously.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBulkEditModalOpen(true)}
              className="px-4 py-2 rounded-2xl bg-[#5A5A40] hover:bg-[#6E6E50] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <CalendarDays className="w-4 h-4 text-[#A8D5BA]" />
              <span>Bulk Edit Days & Dates</span>
            </button>

            <button
              onClick={() => setSelectedLocationIds([])}
              className="px-3 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* LOCATIONS LISTING */}
      <div className="space-y-4">
        {filteredLocations.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-[#E8E2D6] text-center space-y-3">
            <MapPin className="w-10 h-10 text-[#8A8576] mx-auto opacity-50" />
            <h3 className="font-bold text-base text-[#3D3A30]">No Locations Match Current Filter</h3>
            <p className="text-xs text-[#7A7566] max-w-md mx-auto">
              Try changing the state filter, searching for another city, or click "Add Location Event" to create a new market event.
            </p>
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 rounded-2xl bg-[#5A5A40] text-white text-xs font-bold inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Location Now</span>
            </button>
          </div>
        ) : (
          filteredLocations.map((loc) => {
            const isSelected = selectedLocationIds.includes(loc.id);
            return (
              <div
                key={loc.id}
                className={`bg-white rounded-3xl border transition-all p-5 sm:p-6 space-y-4 shadow-xs ${
                  isSelected ? 'border-[#5A5A40] ring-2 ring-[#5A5A40]/20 bg-[#FDFBF7]' : 'border-[#E8E2D6] hover:border-[#D0C8B8]'
                }`}
              >
                {/* Header row: Checkbox, Title, State & City, Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8E2D6]">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleSelectOne(loc.id)}
                      className="mt-1 text-[#5A5A40] hover:text-[#3D3A30]"
                      aria-label="Select location"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-[#5A5A40]" />
                      ) : (
                        <Square className="w-5 h-5 text-[#A8A294]" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#5A5A40] text-white">
                          {loc.stateCode}
                        </span>
                        <h3 className="font-bold text-base text-[#3D3A30]">{loc.title}</h3>
                        {!loc.active && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-700">
                            Inactive
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[#7A7566] mt-1 flex-wrap">
                        <span className="font-semibold text-[#3D3A30]">{loc.cityName}, {loc.stateName}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#5A5A40]" />
                          {loc.venueName}
                        </span>
                        {loc.hours && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-[#5A5A40]" />
                              {loc.hours}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions: Edit & Delete */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => handleOpenEdit(loc)}
                      className="p-2 rounded-xl bg-[#F0EBE0] hover:bg-[#E5DFD2] text-[#5A5A40] text-xs font-bold flex items-center gap-1 transition-colors"
                      title="Edit Location, Description & Dates"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDeleteLocation(loc.id, loc.title)}
                      className="p-2 rounded-xl hover:bg-rose-50 text-rose-600 transition-colors"
                      title="Delete Location"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Location Description */}
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#8A8576] mb-1">
                    Location Description:
                  </div>
                  <p className="text-xs text-[#5D584D] leading-relaxed bg-[#FDFBF7] p-3 rounded-2xl border border-[#E8E2D6]/70">
                    {loc.description}
                  </p>
                </div>

                {/* MULTIPLE DATES & DAYS BADGES */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  
                  {/* Multiple Dates Display */}
                  <div className="p-3 rounded-2xl bg-[#F7F5EE] border border-[#E8E2D6] space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#5A5A40]">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Event Dates ({loc.dates?.length || 0} scheduled dates):</span>
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {loc.dates && loc.dates.length > 0 ? (
                        loc.dates.map((d) => (
                          <span
                            key={d}
                            className="px-2.5 py-1 rounded-xl bg-white border border-[#D8D2C2] text-xs font-semibold text-[#3D3A30] shadow-2xs font-mono"
                          >
                            {formatEventDate(d)}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-[#8A8576] italic">No dates set</span>
                      )}
                    </div>
                  </div>

                  {/* Days of Week Display */}
                  <div className="p-3 rounded-2xl bg-[#F7F5EE] border border-[#E8E2D6] space-y-1.5">
                    <div className="text-[11px] font-bold text-[#5A5A40] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Days of Festival Week:</span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      {['fri', 'sat', 'sun'].map((day) => {
                        const isIncluded = loc.days.includes(day as any);
                        return (
                          <span
                            key={day}
                            className={`px-3 py-1 rounded-xl text-xs font-bold uppercase transition-colors ${
                              isIncluded
                                ? 'bg-[#5A5A40] text-white'
                                : 'bg-white text-[#A8A294] border border-[#E8E2D6]'
                            }`}
                          >
                            {day === 'fri' ? 'Friday' : day === 'sat' ? 'Saturday' : 'Sunday'}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Types of Vendor Accepted */}
                <div className="pt-2 border-t border-[#E8E2D6]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <TypesOfVendorBadge label="Types of Vendor Accepted:" size="sm" />

                  <div className="text-[11px] text-[#8A8576] font-mono">
                    Booth Fee: <span className="font-bold text-[#3D3A30]">${loc.boothPricePerDay || 75}/day</span> • Spaces: <span className="font-bold text-[#3D3A30]">{loc.totalBoothsCount || 100}</span>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* STATE CITIES QUICK REFERENCE VIEWER */}
      {currentStateObj && (
        <div className="bg-[#FAF8F5] p-5 rounded-3xl border border-[#E8E2D6] space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-bold text-sm text-[#3D3A30] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#5A5A40]" />
              <span>Cities in {currentStateObj.name} ({currentStateObj.code})</span>
            </h3>
            <span className="text-xs text-[#7A7566]">
              Region: {currentStateObj.region} • Sales Tax: {currentStateObj.salesTaxInfo}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {currentStateObj.top3Cities.map((c) => (
              <span key={c.name} className="px-3 py-1.5 rounded-xl bg-white border border-[#E8E2D6] text-xs font-semibold text-[#3D3A30] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{c.name}</span>
                <span className="text-[10px] text-[#8A8576]">({c.population})</span>
              </span>
            ))}
            {currentStateObj.majorCities.filter(m => !currentStateObj.top3Cities.some(t => t.name === m)).map((m) => (
              <span key={m} className="px-2.5 py-1.5 rounded-xl bg-white/70 border border-[#E8E2D6] text-xs text-[#5D584D]">
                {m}
              </span>
            ))}
            {currentCustomCities.map((cc) => (
              <span key={cc.id} className="px-3 py-1.5 rounded-xl bg-[#5A5A40]/10 border border-[#5A5A40]/30 text-xs font-bold text-[#5A5A40] flex items-center gap-1.5">
                <span>{cc.name} (Custom)</span>
                <button
                  onClick={() => deleteCustomCity(cc.id)}
                  className="text-rose-500 hover:text-rose-700 ml-1"
                  title="Remove city"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. ADD / EDIT LOCATION MODAL */}
      {/* ========================================================= */}
      {isAddLocationModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#E8E2D6] w-full max-w-2xl shadow-2xl p-6 my-8">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D6] mb-5">
              <div>
                <h3 className="font-bold text-lg text-[#3D3A30]">
                  {editingLocation ? 'Edit Location & Dates' : 'Add New Location Event'}
                </h3>
                <p className="text-xs text-[#7A7566]">
                  Configure state, city, venue description, multiple dates, and festival days.
                </p>
              </div>
              <button
                onClick={() => setIsAddLocationModalOpen(false)}
                className="p-1 rounded-full text-[#8A8576] hover:text-[#3D3A30] hover:bg-[#F0EBE0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLocation} className="space-y-4 text-xs">
              
              {/* State and Cascading City Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#5D584D] mb-1 flex items-center justify-between">
                    <span>Select State *</span>
                    <span className="text-[10px] font-normal text-[#8A8576]">50 US States + DC</span>
                  </label>
                  <select
                    value={formStateCode}
                    onChange={(e) => handleFormStateChange(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7] font-semibold text-xs"
                  >
                    {USA_STATES_CITIES_DATA.map((st) => (
                      <option key={st.code} value={st.code}>
                        {st.name} ({st.code}) - {st.region}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#5D584D] mb-1 flex items-center justify-between">
                    <span>Select City in {formStateCode} *</span>
                    <span className="text-[10px] font-normal text-[#8A8576]">
                      {getCitiesForState(formStateCode, customCities).length} cities available
                    </span>
                  </label>
                  <select
                    value={isCustomCityInput ? '__CUSTOM__' : formCityName}
                    onChange={(e) => handleFormCityChange(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7] font-semibold text-xs"
                  >
                    {getCitiesForState(formStateCode, customCities).map((cName) => (
                      <option key={cName} value={cName}>
                        {cName}
                      </option>
                    ))}
                    <option value="__CUSTOM__">+ Other / Enter Custom City Name...</option>
                  </select>
                </div>
              </div>

              {/* Custom City text input if '__CUSTOM__' is selected */}
              {isCustomCityInput && (
                <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200">
                  <label className="block font-bold text-amber-900 mb-1">
                    Type Custom City Name for {formStateCode}:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Greenville, Fort Mill, Beaufort"
                    value={customCityInputText}
                    onChange={(e) => {
                      setCustomCityInputText(e.target.value);
                      if (!editingLocation) {
                        setFormTitle(`2026 ${e.target.value} First Fridays & Marketplace`);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-xs font-semibold"
                  />
                </div>
              )}

              {/* Event Title */}
              <div>
                <label className="block font-bold text-[#5D584D] mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2026 Columbia Fall First Fridays"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7]"
                />
              </div>

              {/* DEDICATED LOCATION & VENUE ADDRESS SECTION */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-[#E8E2D6] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D6]/80">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#5A5A40] text-white flex items-center justify-center">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#3D3A30] text-xs">Venue & Physical Location Address</h4>
                      <p className="text-[10px] text-[#7A7566]">Specify exact event grounds, street address, and navigation details</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EAE4D6] text-[#5A5A40] font-bold">
                    {isCustomCityInput ? customCityInputText || 'Custom City' : formCityName}, {formStateCode}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#5D584D] mb-1">Venue / Grounds Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Historic Riverfront Amphitheater & Plaza"
                      value={formVenueName}
                      onChange={(e) => setFormVenueName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#5D584D] mb-1">Street Address / Intersection *</label>
                    <input
                      type="text"
                      placeholder="e.g. 1200 Main Street, Suite 100"
                      value={formAddress}
                      onChange={(e) => setFormAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-bold text-[#5D584D] mb-1">City</label>
                    <input
                      type="text"
                      readOnly
                      value={isCustomCityInput ? customCityInputText : formCityName}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#E8E2D6] bg-gray-100 text-gray-700 cursor-not-allowed font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#5D584D] mb-1">State</label>
                    <input
                      type="text"
                      readOnly
                      value={formStateCode}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#E8E2D6] bg-gray-100 text-gray-700 cursor-not-allowed font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#5D584D] mb-1">ZIP Code</label>
                    <input
                      type="text"
                      placeholder="e.g. 29201"
                      value={formZipCode}
                      onChange={(e) => setFormZipCode(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#E8E2D6] bg-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#5D584D] mb-1">
                    Location Description (Parking, Gates & Setup) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Detail artisan booth zones, public entrance gates, vendor check-in trailer, attendee parking garages..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-white leading-relaxed"
                  />
                </div>
              </div>

              {/* DATE AND EVENT SELECTION (RANGE & NON-STOP SUPPORT) */}
              <div className="p-4 rounded-2xl bg-[#F7F5EE] border border-[#E8E2D6] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D6]">
                  <div>
                    <label className="font-bold text-[#3D3A30] flex items-center gap-1.5 text-xs">
                      <CalendarDays className="w-4 h-4 text-[#5A5A40]" />
                      <span>Date & Event Selection</span>
                    </label>
                    <p className="text-[10px] text-[#7A7566]">Events can run non-stop continuously or on specific discrete dates</p>
                  </div>

                  {/* Mode Switcher */}
                  <div className="flex bg-white/80 p-0.5 rounded-xl border border-[#D8D2C2]">
                    <button
                      type="button"
                      onClick={() => {
                        setFormDateMode('range');
                        handleDateRangeUpdate(formStartDate, formEndDate, formIsNonStop);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        formDateMode === 'range'
                          ? 'bg-[#5A5A40] text-white shadow-xs'
                          : 'text-[#6B6658] hover:text-[#3D3A30]'
                      }`}
                    >
                      Date Range (Non-Stop)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormDateMode('specific')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        formDateMode === 'specific'
                          ? 'bg-[#5A5A40] text-white shadow-xs'
                          : 'text-[#6B6658] hover:text-[#3D3A30]'
                      }`}
                    >
                      Specific Dates ({formDates.length})
                    </button>
                  </div>
                </div>

                {/* DATE RANGE MODE */}
                {formDateMode === 'range' ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-[#5D584D] mb-1">Event Start Date *</label>
                        <input
                          type="date"
                          required
                          value={formStartDate}
                          onChange={(e) => handleDateRangeUpdate(e.target.value, formEndDate, formIsNonStop)}
                          className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-white font-mono text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#5D584D] mb-1">Event End Date *</label>
                        <input
                          type="date"
                          required
                          value={formEndDate}
                          onChange={(e) => handleDateRangeUpdate(formStartDate, e.target.value, formIsNonStop)}
                          className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-white font-mono text-xs"
                        />
                      </div>
                    </div>

                    {/* Non-Stop Continuous Toggle */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E8E2D6]">
                      <label htmlFor="nonStopCheckbox" className="flex items-center gap-2 cursor-pointer">
                        <input
                          id="nonStopCheckbox"
                          type="checkbox"
                          checked={formIsNonStop}
                          onChange={(e) => handleDateRangeUpdate(formStartDate, formEndDate, e.target.checked)}
                          className="w-4 h-4 rounded text-[#5A5A40] focus:ring-[#5A5A40]"
                        />
                        <div>
                          <span className="font-bold text-[#3D3A30]">Event Runs Non-Stop Continuously</span>
                          <p className="text-[10px] text-[#7A7566]">Runs active every single consecutive day in the selected date range</p>
                        </div>
                      </label>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        formIsNonStop ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {formIsNonStop ? 'Continuous Event' : 'Periodic Range'}
                      </span>
                    </div>

                    {/* Range Summary & Presets */}
                    <div className="p-3 rounded-xl bg-[#EFECE4] border border-[#DDD7C8] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#4D493D]">
                          📅 {formatEventDateRange(formStartDate, formEndDate, formIsNonStop)}
                        </span>
                        <span className="text-[11px] font-semibold text-[#5A5A40]">
                          {generateDateRangeList(formStartDate, formEndDate).length} consecutive dates
                        </span>
                      </div>

                      {/* Quick presets */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px]">
                        <span className="text-[#7A7566]">Quick Presets:</span>
                        <button
                          type="button"
                          onClick={() => handleDateRangeUpdate('2026-10-02', '2026-10-04', true)}
                          className="px-2 py-1 rounded-lg bg-white border border-[#D8D2C2] hover:bg-stone-50 font-medium"
                        >
                          3-Day Weekend (Oct 2-4)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDateRangeUpdate('2026-10-02', '2026-10-06', true)}
                          className="px-2 py-1 rounded-lg bg-white border border-[#D8D2C2] hover:bg-stone-50 font-medium"
                        >
                          5-Day Fair (Oct 2-6)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDateRangeUpdate('2026-10-02', '2026-10-11', true)}
                          className="px-2 py-1 rounded-lg bg-white border border-[#D8D2C2] hover:bg-stone-50 font-medium"
                        >
                          10-Day Non-Stop (Oct 2-11)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDateRangeUpdate('2026-10-02', '2026-10-18', true)}
                          className="px-2 py-1 rounded-lg bg-white border border-[#D8D2C2] hover:bg-stone-50 font-medium"
                        >
                          17-Day Autumn Expo (Oct 2-18)
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* SPECIFIC DISCRETE DATES MODE */
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap gap-2">
                      {formDates.map((d) => (
                        <span
                          key={d}
                          className="px-2.5 py-1 rounded-xl bg-white border border-[#D8D2C2] text-xs font-mono font-bold text-[#3D3A30] flex items-center gap-1.5 shadow-2xs"
                        >
                          <span>{formatEventDate(d)} ({d})</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveDateFromForm(d)}
                            className="text-rose-500 hover:text-rose-700"
                            title="Remove date"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      <input
                        type="date"
                        value={formNewDateInput}
                        onChange={(e) => setFormNewDateInput(e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-[#E8E2D6] bg-white text-xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddDateToForm(formNewDateInput)}
                        className="px-3 py-1.5 rounded-xl bg-[#5A5A40] text-white font-bold text-xs hover:bg-[#464632]"
                      >
                        + Add Date
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Days of Week and Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#5D584D] mb-1">Days of Week *</label>
                  <div className="flex items-center gap-2 pt-1">
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
                          className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                            active 
                              ? 'bg-[#5A5A40] text-white shadow-xs' 
                              : 'bg-[#FDFBF7] text-[#7A7566] border border-[#E8E2D6]'
                          }`}
                        >
                          {day === 'fri' ? 'Friday' : day === 'sat' ? 'Saturday' : 'Sunday'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#5D584D] mb-1">Operating Hours</label>
                  <input
                    type="text"
                    value={formHours}
                    onChange={(e) => setFormHours(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7]"
                  />
                </div>
              </div>

              {/* Types of Vendor Accepted */}
              <div>
                <label className="block font-bold text-[#5D584D] mb-1.5">
                  Types of Vendor Accepted (With Green Checkbox)
                </label>
                <div className="flex flex-wrap gap-2 p-2.5 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D6]">
                  {['Music', 'Art', 'Craft', 'Food', 'Commercial'].map((type) => {
                    const checked = formVendorTypes.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setFormVendorTypes(prev =>
                            checked ? prev.filter(t => t !== type) : [...prev, type]
                          );
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                          checked
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                            : 'bg-white text-[#8A8576] border border-[#E8E2D6]'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-xs flex items-center justify-center ${checked ? 'bg-[#2E7D32] text-white' : 'border border-gray-300'}`}>
                          {checked && <Check className="w-3 h-3 stroke-[3]" />}
                        </span>
                        <span>{type}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Booth Pricing & Status */}
              <div className="grid grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block font-bold text-[#5D584D] mb-1">Booth Fee/Day ($)</label>
                  <input
                    type="number"
                    value={formBoothPrice}
                    onChange={(e) => setFormBoothPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#5D584D] mb-1">Total Booths</label>
                  <input
                    type="number"
                    value={formTotalBooths}
                    onChange={(e) => setFormTotalBooths(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#5D584D] mb-1">Status</label>
                  <select
                    value={formActive ? 'active' : 'inactive'}
                    onChange={(e) => setFormActive(e.target.value === 'active')}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7] font-semibold"
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex justify-end gap-2.5 border-t border-[#E8E2D6]">
                <button
                  type="button"
                  onClick={() => setIsAddLocationModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-[#7A7566] hover:bg-[#F0EBE0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#5A5A40] text-white font-bold hover:bg-[#464632] shadow-sm"
                >
                  {editingLocation ? 'Save Changes' : 'Create Location'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. BULK EDIT DAYS & DATES MODAL (CRITICAL REQUIREMENT) */}
      {/* ========================================================= */}
      {isBulkEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E8E2D6] w-full max-w-lg shadow-2xl p-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D6] mb-4">
              <div>
                <h3 className="font-bold text-lg text-[#3D3A30]">
                  Bulk Edit Days & Dates
                </h3>
                <p className="text-xs text-[#7A7566]">
                  Updating {selectedLocationIds.length} selected locations in bulk
                </p>
              </div>
              <button
                onClick={() => setIsBulkEditModalOpen(false)}
                className="p-1 text-[#8A8576] hover:text-[#3D3A30]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Action Mode Choice */}
              <div>
                <label className="block font-bold text-[#5D584D] mb-1.5">Select Bulk Action:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBulkActionType('set_range')}
                    className={`p-2.5 rounded-xl text-left border transition-all col-span-2 ${
                      bulkActionType === 'set_range'
                        ? 'border-[#5A5A40] bg-[#5A5A40]/10 font-bold text-[#5A5A40]'
                        : 'border-[#E8E2D6] bg-white text-[#6B6658]'
                    }`}
                  >
                    <div className="font-bold">✨ Set Continuous Date Range (Non-Stop)</div>
                    <div className="text-[10px] text-[#7A7566]">Set start date, end date, and continuous run across selected locations</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBulkActionType('set_both')}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      bulkActionType === 'set_both'
                        ? 'border-[#5A5A40] bg-[#5A5A40]/10 font-bold text-[#5A5A40]'
                        : 'border-[#E8E2D6] bg-white text-[#6B6658]'
                    }`}
                  >
                    <div className="font-bold">Set Both Days & Dates</div>
                    <div className="text-[10px] text-[#7A7566]">Replace days and dates</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBulkActionType('replace_days')}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      bulkActionType === 'replace_days'
                        ? 'border-[#5A5A40] bg-[#5A5A40]/10 font-bold text-[#5A5A40]'
                        : 'border-[#E8E2D6] bg-white text-[#6B6658]'
                    }`}
                  >
                    <div className="font-bold">Edit Days Only</div>
                    <div className="text-[10px] text-[#7A7566]">Assign Fri/Sat/Sun</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBulkActionType('replace_dates')}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      bulkActionType === 'replace_dates'
                        ? 'border-[#5A5A40] bg-[#5A5A40]/10 font-bold text-[#5A5A40]'
                        : 'border-[#E8E2D6] bg-white text-[#6B6658]'
                    }`}
                  >
                    <div className="font-bold">Replace Dates</div>
                    <div className="text-[10px] text-[#7A7566]">Overwrite all event dates</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBulkActionType('append_dates')}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      bulkActionType === 'append_dates'
                        ? 'border-[#5A5A40] bg-[#5A5A40]/10 font-bold text-[#5A5A40]'
                        : 'border-[#E8E2D6] bg-white text-[#6B6658]'
                    }`}
                  >
                    <div className="font-bold">Append New Dates</div>
                    <div className="text-[10px] text-[#7A7566]">Add to existing dates</div>
                  </button>
                </div>
              </div>

              {/* Bulk Date Range Input */}
              {bulkActionType === 'set_range' && (
                <div className="p-3.5 rounded-2xl bg-[#F7F5EE] border border-[#E8E2D6] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-[#5A5A40] block">
                      Continuous Date Range (Applies to {selectedLocationIds.length} locations):
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-[#5D584D] mb-1">Start Date</label>
                      <input
                        type="date"
                        value={bulkStartDate}
                        onChange={(e) => setBulkStartDate(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-xl border border-[#E8E2D6] bg-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#5D584D] mb-1">End Date</label>
                      <input
                        type="date"
                        value={bulkEndDate}
                        onChange={(e) => setBulkEndDate(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-xl border border-[#E8E2D6] bg-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-[#E8E2D6] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bulkIsNonStop}
                      onChange={(e) => setBulkIsNonStop(e.target.checked)}
                      className="w-4 h-4 rounded text-[#5A5A40] focus:ring-[#5A5A40]"
                    />
                    <div>
                      <span className="font-bold text-[#3D3A30]">Mark as Non-Stop Event</span>
                      <p className="text-[10px] text-[#7A7566]">Runs continuous consecutive days</p>
                    </div>
                  </label>

                  <div className="p-2 rounded-xl bg-[#EFECE4] text-[11px] text-[#4D493D] flex items-center justify-between">
                    <span>📅 {formatEventDateRange(bulkStartDate, bulkEndDate, bulkIsNonStop)}</span>
                    <span className="font-bold text-[#5A5A40]">{generateDateRangeList(bulkStartDate, bulkEndDate).length} Days</span>
                  </div>
                </div>
              )}

              {/* Bulk Days Toggle */}
              {(bulkActionType === 'replace_days' || bulkActionType === 'set_both') && (
                <div>
                  <label className="block font-bold text-[#5D584D] mb-1">
                    Assign Days of Week to All Selected:
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
                            active 
                              ? 'bg-[#5A5A40] text-white shadow-xs' 
                              : 'bg-[#FDFBF7] text-[#7A7566] border border-[#E8E2D6]'
                          }`}
                        >
                          {day === 'fri' ? 'Friday' : day === 'sat' ? 'Saturday' : 'Sunday'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Bulk Multiple Dates Input */}
              {(bulkActionType === 'replace_dates' || bulkActionType === 'append_dates' || bulkActionType === 'set_both') && (
                <div className="p-3 rounded-2xl bg-[#F7F5EE] border border-[#E8E2D6] space-y-2">
                  <label className="font-bold text-[#5A5A40] block">
                    Dates to Apply ({bulkDates.length} selected):
                  </label>

                  <div className="flex flex-wrap gap-1.5">
                    {bulkDates.map((d) => (
                      <span
                        key={d}
                        className="px-2.5 py-1 rounded-xl bg-white border border-[#D8D2C2] text-xs font-mono font-bold flex items-center gap-1"
                      >
                        <span>{formatEventDate(d)}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDateFromBulk(d)}
                          className="text-rose-500 hover:text-rose-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="date"
                      value={bulkNewDateInput}
                      onChange={(e) => setBulkNewDateInput(e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-[#E8E2D6] bg-white text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddDateToBulk(bulkNewDateInput)}
                      className="px-3 py-1.5 rounded-xl bg-[#5A5A40] text-white font-bold hover:bg-[#464632]"
                    >
                      + Add Date
                    </button>
                  </div>
                </div>
              )}

              {/* Notice */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] leading-relaxed">
                This bulk operation will instantly update all <strong>{selectedLocationIds.length}</strong> selected locations in Firestore.
              </div>

              {/* Action Buttons */}
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
                  disabled={isProcessingBulk}
                  onClick={handleExecuteBulkEdit}
                  className="px-6 py-2 rounded-xl bg-[#5A5A40] text-white font-bold hover:bg-[#464632] flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {isProcessingBulk ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Apply to {selectedLocationIds.length} Locations</span>
                  )}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. ADD CUSTOM CITY MODAL */}
      {/* ========================================================= */}
      {isAddCityModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E8E2D6] w-full max-w-md shadow-2xl p-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D6] mb-4">
              <h3 className="font-bold text-base text-[#3D3A30] flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#5A5A40]" />
                <span>Add Custom City to Market</span>
              </h3>
              <button
                onClick={() => setIsAddCityModalOpen(false)}
                className="text-[#8A8576] hover:text-[#3D3A30]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomCity} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#5D584D] mb-1">State</label>
                <select
                  value={newCityStateCode}
                  onChange={(e) => setNewCityStateCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7] font-semibold"
                >
                  {USA_STATES_CITIES_DATA.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#5D584D] mb-1">City Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Spartanburg, Florence, Asheville"
                  value={newCityName}
                  onChange={(e) => setNewCityName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#5D584D] mb-1">Estimated Population</label>
                <input
                  type="text"
                  placeholder="e.g. 75,000"
                  value={newCityPopulation}
                  onChange={(e) => setNewCityPopulation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="chk-over200k"
                  checked={newCityIsOver200k}
                  onChange={(e) => setNewCityIsOver200k(e.target.checked)}
                  className="rounded text-[#5A5A40]"
                />
                <label htmlFor="chk-over200k" className="font-semibold text-[#5D584D]">
                  Major City / Met Area (&gt;200,000 residents)
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#E8E2D6]">
                <button
                  type="button"
                  onClick={() => setIsAddCityModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-[#7A7566]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#5A5A40] text-white font-bold"
                >
                  Save City
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
