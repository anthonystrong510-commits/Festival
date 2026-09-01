import React, { useState, useMemo } from 'react';
import { 
  Store, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Eye, 
  Check, 
  X, 
  Mail, 
  Clock, 
  DollarSign, 
  MapPin, 
  FileText, 
  ExternalLink, 
  Trash2, 
  AlertCircle,
  CheckCircle2,
  Send,
  MoreVertical,
  ChevronDown,
  Coins,
  Sparkles,
  CheckSquare,
  Square,
  MinusSquare,
  Receipt
} from 'lucide-react';
import { 
  VendorApplicationRecord, 
  ApplicationStatus, 
  BoothId,
  PaymentConfig,
  SmtpConfigData,
  FestivalConfigData,
  Invoice
} from '../../../types';
import { BOOTH_TIERS } from '../../../data/festivalData';
import { saveInvoice } from '../../../lib/firebase';

interface VendorApplicationsTabProps {
  applications: VendorApplicationRecord[];
  invoices?: Invoice[];
  onUpdateStatus: (id: string, updates: Partial<VendorApplicationRecord>) => void;
  onDeleteApplication: (id: string) => void;
  onOpenEmailModal: (app: VendorApplicationRecord, defaultTemplateKey?: string) => void;
  selectedAppForModal: VendorApplicationRecord | null;
  onSelectAppForModal: (app: VendorApplicationRecord | null) => void;
  isCreateModalOpen: boolean;
  onSetCreateModalOpen: (open: boolean) => void;
  onCreateApplication: (data: Omit<VendorApplicationRecord, 'id' | 'createdAt' | 'status'>) => void;
  onOpenInvoiceModal?: (app: VendorApplicationRecord) => void;
  paymentConfig?: PaymentConfig;
  smtpConfig?: SmtpConfigData;
  festivalConfig?: FestivalConfigData;
}

export function VendorApplicationsTab({
  applications,
  invoices = [],
  onUpdateStatus,
  onDeleteApplication,
  onOpenEmailModal,
  selectedAppForModal,
  onSelectAppForModal,
  isCreateModalOpen,
  onSetCreateModalOpen,
  onCreateApplication,
  onOpenInvoiceModal,
  paymentConfig,
  smtpConfig,
  festivalConfig
}: VendorApplicationsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dayFilter, setDayFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const [copiedInvoiceId, setCopiedInvoiceId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedVendorIds, setSelectedVendorIds] = useState<Set<string>>(new Set());

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopyInvoiceLink = (invoice: Invoice, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const url = invoice.checkoutUrl || `${window.location.origin}/?invoice=${invoice.id}`;
    navigator.clipboard.writeText(url);
    setCopiedInvoiceId(invoice.id);
    showToast(`Copied payment checkout link for ${invoice.recipientBusinessName || 'vendor'}!`);
    setTimeout(() => setCopiedInvoiceId(null), 2500);
  };

  const getMatchingInvoice = (app: VendorApplicationRecord): Invoice | undefined => {
    return invoices.find(inv => 
      (inv.vendorApplicationId && inv.vendorApplicationId === app.id) ||
      (inv.recipientEmail && app.email && inv.recipientEmail.trim().toLowerCase() === app.email.trim().toLowerCase())
    );
  };
  const [isBatchInvoiceModalOpen, setIsBatchInvoiceModalOpen] = useState(false);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{ total: number; sent: number; errors: number; statusText: string } | null>(null);

  // New Vendor Manual Form State
  const [newForm, setNewForm] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    category: 'Artisan Crafts & Handmade Goods',
    selectedBoothId: 'tent-10x10' as BoothId,
    selectedDays: ['fri', 'sat', 'sun'] as Array<'fri' | 'sat' | 'sun'>,
    productDescription: '',
    photoLinks: '',
    isFoodVendor: false,
    hasFoodPermit: false,
    tempHygieneCompliant: false,
    needsHandicapParking: false,
    handicapNotes: '',
    additionalRequests: '',
    agreedToTerms: true,
    totalCalculatedFee: 300,
    boothZoneAssignment: 'Artisan Promenade Row',
    adminNotes: ''
  });

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesSearch = 
          app.businessName.toLowerCase().includes(q) ||
          app.contactName.toLowerCase().includes(q) ||
          app.email.toLowerCase().includes(q) ||
          app.category.toLowerCase().includes(q) ||
          app.id.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }

      // Status
      if (statusFilter !== 'all' && app.status !== statusFilter) {
        return false;
      }

      // Category
      if (categoryFilter !== 'all' && app.category !== categoryFilter) {
        return false;
      }

      // Day
      if (dayFilter !== 'all' && !app.selectedDays.includes(dayFilter as any)) {
        return false;
      }

      return true;
    });
  }, [applications, searchQuery, statusFilter, categoryFilter, dayFilter]);

  // Selection helper
  const allFilteredSelected = filteredApplications.length > 0 && filteredApplications.every(a => selectedVendorIds.has(a.id));
  const someFilteredSelected = filteredApplications.some(a => selectedVendorIds.has(a.id));

  const handleToggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedVendorIds(new Set());
    } else {
      const newSet = new Set(selectedVendorIds);
      filteredApplications.forEach(a => newSet.add(a.id));
      setSelectedVendorIds(newSet);
    }
  };

  const handleToggleSelectVendor = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSet = new Set(selectedVendorIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedVendorIds(newSet);
  };

  const selectedVendorsList = applications.filter(a => selectedVendorIds.has(a.id));

  // Batch Invoice Processing
  const handleExecuteBatchInvoices = async () => {
    if (selectedVendorsList.length === 0) return;
    setIsBatchProcessing(true);
    setBatchProgress({
      total: selectedVendorsList.length,
      sent: 0,
      errors: 0,
      statusText: 'Generating and dispatching invoices...'
    });

    const generatedInvoices: Invoice[] = [];

    for (let i = 0; i < selectedVendorsList.length; i++) {
      const vendor = selectedVendorsList[i];
      try {
        const invId = `inv-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
        const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const now = new Date().toISOString();

        const lineItems = [
          {
            id: 'item-1',
            description: `${vendor.category} - Space Reservation (${vendor.selectedBoothId})`,
            quantity: 1,
            unitPrice: vendor.totalCalculatedFee || 275,
            total: vendor.totalCalculatedFee || 275,
            category: 'booth_fee' as const
          }
        ];

        const fullInvoice: Invoice = {
          id: invId,
          invoiceNumber,
          vendorApplicationId: vendor.id,
          recipientBusinessName: vendor.businessName,
          recipientContactName: vendor.contactName,
          recipientEmail: vendor.email,
          recipientPhone: vendor.phone || '',
          recipientAddress: '',
          issueDate: now.split('T')[0],
          dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
          status: 'sent',
          items: lineItems,
          subtotal: vendor.totalCalculatedFee || 275,
          discountAmount: 0,
          taxAmount: 0,
          totalAmount: vendor.totalCalculatedFee || 275,
          paidAmount: 0,
          currency: 'USD',
          notes: 'Space allocation invoice for Columbia Community Festival.',
          terms: 'Payment is due within 14 days to lock reserved booth location.',
          cryptoAddresses: {
            usdtTrc20: paymentConfig?.usdtTrc20,
            usdtErc20: paymentConfig?.usdtErc20,
            usdtSolana: paymentConfig?.usdtSolana,
            ethereumAddress: paymentConfig?.ethereumAddress,
            bitcoinAddress: paymentConfig?.bitcoinAddress,
            cashAppCashtag: paymentConfig?.cashAppCashtag,
            krakenPayId: paymentConfig?.krakenPayId
          },
          sentAt: now,
          checkoutUrl: `${window.location.origin}/?invoice=${invId}`,
          createdAt: now,
          updatedAt: now
        };

        await saveInvoice(fullInvoice);
        generatedInvoices.push(fullInvoice);

        // Update application status to approved if currently pending
        if (vendor.status === 'pending') {
          onUpdateStatus(vendor.id, { status: 'approved' });
        }

        setBatchProgress(prev => prev ? {
          ...prev,
          sent: prev.sent + 1,
          statusText: `Processed ${i + 1} of ${selectedVendorsList.length}: ${vendor.businessName}`
        } : null);
      } catch (err) {
        console.error('Error generating batch invoice for vendor:', vendor.businessName, err);
        setBatchProgress(prev => prev ? {
          ...prev,
          errors: prev.errors + 1
        } : null);
      }
    }

    // Call server batch dispatch for delivery
    try {
      await fetch('/api/send-batch-invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoices: generatedInvoices,
          smtpConfig,
          festivalConfig
        })
      });
    } catch (e) {
      console.warn('Batch email server notification:', e);
    }

    setIsBatchProcessing(false);
    setBatchProgress(prev => prev ? {
      ...prev,
      statusText: `Complete! Sent ${generatedInvoices.length} invoices successfully.`
    } : null);
  };

  const handleBatchApprove = () => {
    selectedVendorsList.forEach(v => {
      if (v.status !== 'approved') {
        onUpdateStatus(v.id, { status: 'approved' });
      }
    });
    setSelectedVendorIds(new Set());
  };

  // Unique categories for filter dropdown
  const uniqueCategories = useMemo(() => {
    const set = new Set<string>();
    applications.forEach(a => set.add(a.category));
    return Array.from(set);
  }, [applications]);

  // Export CSV
  const handleExportCsv = () => {
    const headers = [
      'ID', 'Business Name', 'Contact Name', 'Email', 'Phone', 
      'Category', 'Booth Tier', 'Days', 'Calculated Fee', 'Status', 
      'Zone Assignment', 'Payment Status', 'Created At'
    ];

    const rows = filteredApplications.map(a => [
      a.id,
      `"${a.businessName.replace(/"/g, '""')}"`,
      `"${a.contactName.replace(/"/g, '""')}"`,
      a.email,
      a.phone,
      `"${a.category}"`,
      a.selectedBoothId,
      `"${a.selectedDays.join(', ')}"`,
      a.totalCalculatedFee || 0,
      a.status,
      `"${a.boothZoneAssignment || ''}"`,
      a.paymentStatus || 'unpaid',
      a.createdAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `festival-vendors-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'approved':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Approved</span>;
      case 'paid':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">Paid & Confirmed</span>;
      case 'pending':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">Pending Review</span>;
      case 'waitlist':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">Waitlist</span>;
      case 'rejected':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">Declined</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Filter and Action Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E2D6] shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A09B8D]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vendor name, email, contact..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7] text-xs sm:text-sm text-[#3D3A30] placeholder-[#A09B8D] focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/30"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#A09B8D] hover:text-[#3D3A30]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportCsv}
              className="px-3 py-2 rounded-xl bg-[#F7F5EE] hover:bg-[#EAE4D6] text-[#5A5A40] border border-[#E8E2D6] text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Export filtered list to CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => onSetCreateModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Application</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E8E2D6] text-xs">
          <span className="text-[#8A8576] font-bold flex items-center gap-1 text-[11px] uppercase tracking-wider">
            <Filter className="w-3 h-3" /> Status:
          </span>
          {['all', 'pending', 'approved', 'waitlist', 'paid', 'rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-[#5A5A40] text-white shadow-xs'
                  : 'bg-[#F7F5EE] text-[#6B6658] hover:bg-[#EAE4D6]'
              }`}
            >
              {st}
            </button>
          ))}

          <div className="h-4 w-px bg-[#E8E2D6] mx-1 hidden sm:block" />

          <span className="text-[#8A8576] font-bold text-[11px] uppercase tracking-wider">Session:</span>
          {['all', 'fri', 'sat', 'sun'].map((d) => (
            <button
              key={d}
              onClick={() => setDayFilter(d)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${
                dayFilter === d
                  ? 'bg-[#3D3A30] text-white'
                  : 'bg-[#F7F5EE] text-[#6B6658] hover:bg-[#EAE4D6]'
              }`}
            >
              {d === 'all' ? 'All Days' : d.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Counter & View Toggle */}
      <div className="flex items-center justify-between text-xs text-[#7A7566]">
        <div>
          Showing <strong>{filteredApplications.length}</strong> of <strong>{applications.length}</strong> applications
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#3D3A30] text-white px-4 py-3 rounded-2xl shadow-xl border border-white/20 flex items-center gap-3 animate-in fade-in slide-in-from-top-3 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="p-1 hover:bg-white/10 rounded-full">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Table View */}
      {filteredApplications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-[#E8E2D6] p-12 text-center">
          <Store className="w-10 h-10 text-[#A09B8D] mx-auto mb-2" />
          <h3 className="text-base font-bold text-[#3D3A30]">No Applications Match Criteria</h3>
          <p className="text-xs text-[#8A8576] mt-1 max-w-sm mx-auto">
            Try adjusting your search terms, changing filters, or submit a new vendor application.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E8E2D6] overflow-hidden shadow-xs relative">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F7F5EE] border-b border-[#E8E2D6] text-[#6B6658] font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-3 w-10 text-center">
                    <button
                      type="button"
                      onClick={handleToggleSelectAll}
                      className="p-1 rounded hover:bg-[#EAE4D6] transition-colors"
                      title={allFilteredSelected ? 'Deselect all' : 'Select all'}
                    >
                      {allFilteredSelected ? (
                        <CheckSquare className="w-4 h-4 text-[#5A5A40]" />
                      ) : someFilteredSelected ? (
                        <MinusSquare className="w-4 h-4 text-[#5A5A40]" />
                      ) : (
                        <Square className="w-4 h-4 text-[#A09B8D]" />
                      )}
                    </button>
                  </th>
                  <th className="py-3.5 px-4">Business & Contact</th>
                  <th className="py-3.5 px-4">Applied Space & Sessions</th>
                  <th className="py-3.5 px-4">Total Fee</th>
                  <th className="py-3.5 px-4">Review Status</th>
                  <th className="py-3.5 px-4">Invoice & Crypto Billing</th>
                  <th className="py-3.5 px-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D6]">
                {filteredApplications.map((app) => {
                  const booth = BOOTH_TIERS.find(b => b.id === app.selectedBoothId);
                  const isSelected = selectedVendorIds.has(app.id);
                  const matchingInv = getMatchingInvoice(app);

                  return (
                    <tr 
                      key={app.id} 
                      className={`hover:bg-[#FDFBF7] transition-colors ${isSelected ? 'bg-[#FAF8F5]' : ''}`}
                    >
                      {/* Checkbox Column */}
                      <td className="py-3.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={(e) => handleToggleSelectVendor(app.id, e)}
                          className="p-1 rounded hover:bg-[#EAE4D6] transition-colors"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#5A5A40]" />
                          ) : (
                            <Square className="w-4 h-4 text-[#A09B8D]" />
                          )}
                        </button>
                      </td>

                      {/* Business & Contact */}
                      <td className="py-3.5 px-4">
                        <div 
                          onClick={() => onSelectAppForModal(app)}
                          className="font-bold text-[#3D3A30] text-sm hover:text-[#5A5A40] cursor-pointer flex items-center gap-1.5"
                        >
                          <span>{app.businessName}</span>
                          {app.isFoodVendor && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                              Food
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#7A7566] mt-0.5">
                          {app.contactName} &bull; <a href={`mailto:${app.email}`} className="hover:underline">{app.email}</a>
                        </div>
                        <div className="text-[10px] text-[#A09B8D] mt-0.5 font-mono">
                          ID: #{app.id.slice(0, 14)}
                        </div>
                      </td>

                      {/* Applied Space & Sessions (What was applied for) */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-[#3D3A30]">
                              {booth?.name || app.selectedBoothId}
                            </span>
                          </div>
                          
                          {/* Days badges */}
                          <div className="flex flex-wrap items-center gap-1">
                            {app.selectedDays.map(d => (
                              <span key={d} className="px-1.5 py-0.5 rounded bg-[#FAF8F5] border border-[#E8E2D6] text-[9px] font-bold uppercase text-[#5A5A40]">
                                {d}
                              </span>
                            ))}
                            <span className="text-[10px] text-[#8A8576] font-medium">
                              ({app.selectedDays.length} day{app.selectedDays.length > 1 ? 's' : ''})
                            </span>
                          </div>

                          {/* Extra info tags */}
                          <div className="flex flex-wrap gap-1 mt-0.5">
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#F7F5EE] text-[#7A7566] border border-[#E8E2D6]">
                              {app.category}
                            </span>
                            {app.boothZoneAssignment && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200">
                                {app.boothZoneAssignment}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Fee Calculated */}
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-[#3D3A30] text-sm">
                          ${app.totalCalculatedFee || (booth ? booth.pricePerDay * app.selectedDays.length : 250)}
                        </div>
                        <div className="text-[10px] text-[#8A8576]">
                          ${booth?.pricePerDay || 100}/day
                        </div>
                      </td>

                      {/* Review Status */}
                      <td className="py-3.5 px-4">
                        {getStatusBadge(app.status)}
                      </td>

                      {/* Invoice & Crypto Billing Hub */}
                      <td className="py-3.5 px-4">
                        {matchingInv ? (
                          <div className="flex flex-col gap-1.5">
                            {/* Status Tag */}
                            <div className="flex items-center gap-1.5">
                              {matchingInv.status === 'paid' && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>Paid ${matchingInv.totalAmount}</span>
                                </span>
                              )}
                              {matchingInv.status === 'under_review' && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300 text-[10px] font-bold animate-pulse">
                                  <Sparkles className="w-3 h-3 text-purple-600" />
                                  <span>Proof Submitted (${matchingInv.totalAmount})</span>
                                </span>
                              )}
                              {matchingInv.status === 'sent' && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-300 text-[10px] font-bold">
                                  <Send className="w-3 h-3 text-sky-600" />
                                  <span>Invoiced ${matchingInv.totalAmount}</span>
                                </span>
                              )}
                              {matchingInv.status === 'draft' && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold">
                                  <Clock className="w-3 h-3 text-amber-600" />
                                  <span>Draft ${matchingInv.totalAmount}</span>
                                </span>
                              )}
                            </div>

                            {/* Action Buttons for Existing Invoice */}
                            <div className="flex items-center gap-1">
                              {onOpenInvoiceModal && (
                                <button
                                  type="button"
                                  onClick={() => onOpenInvoiceModal(app)}
                                  className="px-2 py-1 rounded bg-[#F7F5EE] hover:bg-[#EAE4D6] text-[#5A5A40] border border-[#E8E2D6] text-[10px] font-bold flex items-center gap-1 transition-colors"
                                  title="Edit / Resend Invoice"
                                >
                                  <Receipt className="w-3 h-3" />
                                  <span>Invoice</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={(e) => handleCopyInvoiceLink(matchingInv, e)}
                                className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-colors border ${
                                  copiedInvoiceId === matchingInv.id 
                                    ? 'bg-emerald-600 text-white border-emerald-600' 
                                    : 'bg-white hover:bg-[#FAF8F5] text-[#6B6658] border-[#E8E2D6]'
                                }`}
                                title="Copy direct checkout link to send via chat/SMS/email"
                              >
                                <span>{copiedInvoiceId === matchingInv.id ? '✓ Copied' : '🔗 Link'}</span>
                              </button>

                              <a
                                href={matchingInv.checkoutUrl || `${window.location.origin}/?invoice=${matchingInv.id}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1 rounded bg-white hover:bg-[#FAF8F5] text-[#8A8576] hover:text-[#3D3A30] border border-[#E8E2D6]"
                                title="Open Vendor Checkout View"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        ) : (
                          <div>
                            {onOpenInvoiceModal && (
                              <button
                                type="button"
                                onClick={() => onOpenInvoiceModal(app)}
                                className="group px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#5A5A40] to-[#464632] text-white hover:opacity-95 text-[11px] font-bold flex flex-col items-start gap-0.5 transition-all shadow-xs"
                                title="Generate custom payment invoice with crypto wallets"
                              >
                                <div className="flex items-center gap-1.5">
                                  <Receipt className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                                  <span>Issue Invoice (${app.totalCalculatedFee || (booth ? booth.pricePerDay * app.selectedDays.length : 250)})</span>
                                </div>
                                <span className="text-[9px] text-white/70 font-normal">
                                  {booth?.name?.split(' ')[0] || 'Space'} &bull; {app.selectedDays.length}d &bull; Crypto/Fiat
                                </span>
                              </button>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Quick Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Quick Approve / Change status */}
                          {app.status === 'pending' && (
                            <button
                              onClick={() => {
                                onUpdateStatus(app.id, { status: 'approved' });
                              }}
                              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                              title="Approve Application"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Direct Send Email Button */}
                          <button
                            onClick={() => onOpenEmailModal(app, app.status === 'approved' ? 'vendor_app_approved' : 'vendor_app_received')}
                            className="p-1.5 rounded-lg bg-[#F7F5EE] hover:bg-[#EAE4D6] text-[#5A5A40] border border-[#E8E2D6] transition-colors"
                            title="Send Email to Vendor"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </button>

                          {/* Inspect Modal */}
                          <button
                            onClick={() => onSelectAppForModal(app)}
                            className="px-2.5 py-1.5 rounded-lg bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold flex items-center gap-1 transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Details</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Floating Sticky Batch Action Bar */}
      {selectedVendorIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#3D3A30] text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">
              {selectedVendorIds.size}
            </span>
            <span className="text-xs font-semibold">Vendors Selected</span>
          </div>

          <div className="h-5 w-px bg-white/20" />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsBatchInvoiceModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Coins className="w-4 h-4" />
              <span>Generate & Email Invoices ({selectedVendorIds.size})</span>
            </button>

            <button
              type="button"
              onClick={handleBatchApprove}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Approve All</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedVendorIds(new Set())}
              className="px-2.5 py-2 rounded-xl text-white/70 hover:text-white text-xs font-bold transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Batch Invoice Dispatch Modal */}
      {isBatchInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-[#E8E2D6] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D6]">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-[#5A5A40]" />
                <h3 className="font-bold text-base text-[#3D3A30]">Batch Invoice Generation</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                {selectedVendorIds.size} Selected Vendors
              </span>
            </div>

            <p className="text-xs text-[#7A7566]">
              This will automatically generate itemized invoices, assign custom checkout links with configured crypto wallets (USDT, ETH, BTC, CashApp, Kraken), and dispatch official email notifications to all selected vendors.
            </p>

            <div className="max-h-48 overflow-y-auto border border-[#E8E2D6] rounded-xl p-2 bg-[#FAF8F5] space-y-1.5 text-xs">
              {selectedVendorsList.map((v) => (
                <div key={v.id} className="p-2 bg-white rounded-lg border border-[#E8E2D6] flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#3D3A30]">{v.businessName}</div>
                    <div className="text-[11px] text-[#7A7566]">{v.email}</div>
                  </div>
                  <div className="font-extrabold text-[#5A5A40]">
                    ${v.totalCalculatedFee || 275}
                  </div>
                </div>
              ))}
            </div>

            {batchProgress && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
                <div className="font-bold text-emerald-950 flex items-center justify-between">
                  <span>Batch Status</span>
                  <span>{batchProgress.sent} / {batchProgress.total}</span>
                </div>
                <div className="text-[11px] text-emerald-800">{batchProgress.statusText}</div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsBatchInvoiceModalOpen(false);
                  setBatchProgress(null);
                }}
                disabled={isBatchProcessing}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#7A7566] hover:bg-[#F7F5EE]"
              >
                {batchProgress ? 'Close' : 'Cancel'}
              </button>

              {!batchProgress?.sent ? (
                <button
                  type="button"
                  onClick={handleExecuteBatchInvoices}
                  disabled={isBatchProcessing}
                  className="px-5 py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors disabled:opacity-50"
                >
                  <Send className={`w-4 h-4 ${isBatchProcessing ? 'animate-spin' : ''}`} />
                  <span>{isBatchProcessing ? 'Processing Invoices...' : `Confirm & Send ${selectedVendorIds.size} Invoices`}</span>
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* APPLICATION DETAIL INSPECTOR MODAL */}
      {selectedAppForModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#E8E2D6] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col my-auto">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-[#E8E2D6] flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-[#3D3A30]">
                    {selectedAppForModal.businessName}
                  </h3>
                  {getStatusBadge(selectedAppForModal.status)}
                </div>
                <div className="text-xs text-[#8A8576] mt-0.5">
                  Reference: #{selectedAppForModal.id} &bull; Submitted on {new Date(selectedAppForModal.createdAt).toLocaleDateString()}
                </div>
              </div>

              <button
                onClick={() => onSelectAppForModal(null)}
                className="p-2 rounded-full hover:bg-[#F7F5EE] text-[#8A8576] hover:text-[#3D3A30]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 flex-1 text-xs sm:text-sm text-[#3D3A30]">
              
              {/* Quick Status Control Buttons */}
              <div className="p-4 rounded-2xl bg-[#F7F5EE] border border-[#E8E2D6]">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7A7566] mb-2">
                  Change Review Status:
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['pending', 'approved', 'waitlist', 'paid', 'rejected'] as ApplicationStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => onUpdateStatus(selectedAppForModal.id, { status: st })}
                      className={`px-3 py-1.5 rounded-xl font-bold capitalize text-xs transition-colors ${
                        selectedAppForModal.status === st
                          ? 'bg-[#5A5A40] text-white shadow-xs'
                          : 'bg-white text-[#6B6658] border border-[#E8E2D6] hover:bg-[#EAE4D6]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}

                  {onOpenInvoiceModal && (
                    <button
                      onClick={() => {
                        const app = selectedAppForModal;
                        onSelectAppForModal(null);
                        onOpenInvoiceModal(app);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Send Invoice (Crypto & Fiat)</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      onOpenEmailModal(selectedAppForModal, selectedAppForModal.status === 'approved' ? 'vendor_app_approved' : 'vendor_app_received');
                    }}
                    className="ml-auto px-3.5 py-1.5 rounded-xl bg-[#2D4A3E] hover:bg-[#20362D] text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Notification Email</span>
                  </button>
                </div>
              </div>

              {/* Two Column Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Contact Box */}
                <div className="p-4 rounded-xl bg-[#FDFBF7] border border-[#E8E2D6] space-y-2">
                  <div className="text-xs font-bold uppercase text-[#7A7566] tracking-wider">Contact Details</div>
                  <div><strong>Primary Contact:</strong> {selectedAppForModal.contactName}</div>
                  <div><strong>Email:</strong> <a href={`mailto:${selectedAppForModal.email}`} className="text-[#5A5A40] underline">{selectedAppForModal.email}</a></div>
                  <div><strong>Phone:</strong> {selectedAppForModal.phone || 'None provided'}</div>
                  {selectedAppForModal.website && (
                    <div className="truncate">
                      <strong>Website / Social:</strong>{' '}
                      <a href={selectedAppForModal.website} target="_blank" rel="noopener noreferrer" className="text-[#5A5A40] underline inline-flex items-center gap-1">
                        {selectedAppForModal.website} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Booth Details */}
                <div className="p-4 rounded-xl bg-[#FDFBF7] border border-[#E8E2D6] space-y-2">
                  <div className="text-xs font-bold uppercase text-[#7A7566] tracking-wider">Space & Pricing Applied</div>
                  <div><strong>Space Tier:</strong> {BOOTH_TIERS.find(b => b.id === selectedAppForModal.selectedBoothId)?.name || selectedAppForModal.selectedBoothId}</div>
                  <div><strong>Selected Sessions:</strong> {selectedAppForModal.selectedDays.map(d => d.toUpperCase()).join(', ')} ({selectedAppForModal.selectedDays.length} sessions)</div>
                  <div><strong>Calculated Fee:</strong> ${selectedAppForModal.totalCalculatedFee}</div>
                  <div><strong>Payment Status:</strong> <span className="font-semibold uppercase">{selectedAppForModal.paymentStatus || 'Unpaid'}</span></div>
                </div>
              </div>

              {/* Invoice & Crypto Settlement Card */}
              {(() => {
                const inv = getMatchingInvoice(selectedAppForModal);
                return (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FAF8F5] to-[#F2EFE9] border border-[#E8E2D6] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-[#5A5A40]" />
                        <span className="font-bold text-xs uppercase tracking-wider text-[#3D3A30]">Invoice & Crypto Payment Hub</span>
                      </div>
                      {inv ? (
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                          inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                          inv.status === 'under_review' ? 'bg-purple-100 text-purple-800' :
                          inv.status === 'sent' ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          Invoice {inv.invoiceNumber} &bull; {inv.status.replace('_', ' ')}
                        </span>
                      ) : (
                        <span className="text-xs text-[#8A8576] italic">No invoice generated yet</span>
                      )}
                    </div>

                    {inv ? (
                      <div className="space-y-2.5 pt-1">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          <div className="p-2 bg-white rounded-lg border border-[#E8E2D6]">
                            <div className="text-[10px] text-[#8A8576]">Amount Due</div>
                            <div className="font-bold text-[#3D3A30]">${inv.totalAmount} {inv.currency}</div>
                          </div>
                          <div className="p-2 bg-white rounded-lg border border-[#E8E2D6]">
                            <div className="text-[10px] text-[#8A8576]">Amount Paid</div>
                            <div className="font-bold text-emerald-700">${inv.paidAmount || 0}</div>
                          </div>
                          <div className="p-2 bg-white rounded-lg border border-[#E8E2D6]">
                            <div className="text-[10px] text-[#8A8576]">Due Date</div>
                            <div className="font-bold text-[#3D3A30]">{inv.dueDate}</div>
                          </div>
                          <div className="p-2 bg-white rounded-lg border border-[#E8E2D6]">
                            <div className="text-[10px] text-[#8A8576]">Dispatched</div>
                            <div className="font-bold text-[#3D3A30]">{inv.sentAt ? new Date(inv.sentAt).toLocaleDateString() : 'Draft'}</div>
                          </div>
                        </div>

                        {/* If payment proof was submitted */}
                        {inv.paymentDetailsSubmitted && (
                          <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs space-y-1">
                            <div className="font-bold text-purple-950 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                              <span>Crypto / CashApp Settlement Proof Submitted:</span>
                            </div>
                            <div className="text-[#3D3A30]">
                              <strong>Method:</strong> {inv.paymentDetailsSubmitted.method?.toUpperCase()} &bull; 
                              <strong> Amount:</strong> ${inv.paymentDetailsSubmitted.paidAmount || inv.totalAmount} {inv.paymentDetailsSubmitted.paidCurrency || inv.currency}
                            </div>
                            {inv.paymentDetailsSubmitted.txHash && (
                              <div className="font-mono text-[11px] text-purple-900 break-all">
                                <strong>Tx Hash:</strong> {inv.paymentDetailsSubmitted.txHash}
                              </div>
                            )}
                            {inv.paymentDetailsSubmitted.payerWalletOrHandle && (
                              <div className="font-mono text-[11px] text-purple-900 break-all">
                                <strong>Payer / Wallet:</strong> {inv.paymentDetailsSubmitted.payerWalletOrHandle}
                              </div>
                            )}
                            {inv.paymentDetailsSubmitted.proofNote && (
                              <div className="text-[11px] text-purple-800 italic">
                                "{inv.paymentDetailsSubmitted.proofNote}"
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {onOpenInvoiceModal && (
                            <button
                              type="button"
                              onClick={() => {
                                const app = selectedAppForModal;
                                onSelectAppForModal(null);
                                onOpenInvoiceModal(app);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold flex items-center gap-1.5"
                            >
                              <Receipt className="w-3.5 h-3.5" />
                              <span>Edit / Resend Invoice</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={(e) => handleCopyInvoiceLink(inv, e)}
                            className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#3D3A30] border border-[#E8E2D6] text-xs font-bold flex items-center gap-1.5"
                          >
                            <span>{copiedInvoiceId === inv.id ? '✓ Copied Link' : '🔗 Copy Checkout Link'}</span>
                          </button>

                          <a
                            href={inv.checkoutUrl || `${window.location.origin}/?invoice=${inv.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#5A5A40] border border-[#E8E2D6] text-xs font-bold flex items-center gap-1.5 inline-flex"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Preview Checkout Portal</span>
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between pt-1">
                        <div className="text-xs text-[#7A7566]">
                          Generate an official payment invoice configured with USDT, ETH, BTC, CashApp & Kraken.
                        </div>
                        {onOpenInvoiceModal && (
                          <button
                            type="button"
                            onClick={() => {
                              const app = selectedAppForModal;
                              onSelectAppForModal(null);
                              onOpenInvoiceModal(app);
                            }}
                            className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            <span>Generate Invoice (${selectedAppForModal.totalCalculatedFee || 250})</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Product description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7A7566] mb-1">
                  Product & Exhibit Description:
                </label>
                <div className="p-3.5 rounded-xl bg-[#FDFBF7] border border-[#E8E2D6] text-xs leading-relaxed text-[#5A5A40]">
                  {selectedAppForModal.productDescription || 'No description provided.'}
                </div>
              </div>

              {/* Zone Assignment & Internal Notes Editor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#7A7566] mb-1">
                    Assigned Booth Zone / Location:
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedAppForModal.boothZoneAssignment || ''}
                    onBlur={(e) => onUpdateStatus(selectedAppForModal.id, { boothZoneAssignment: e.target.value })}
                    placeholder="e.g. Promenade Row A-102"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] text-xs focus:ring-2 focus:ring-[#5A5A40]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#7A7566] mb-1">
                    Organizer Internal Notes:
                  </label>
                  <textarea
                    rows={2}
                    defaultValue={selectedAppForModal.adminNotes || ''}
                    onBlur={(e) => onUpdateStatus(selectedAppForModal.id, { adminNotes: e.target.value })}
                    placeholder="Notes on electricity, payment, or load-in..."
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] text-xs focus:ring-2 focus:ring-[#5A5A40]/30"
                  />
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#E8E2D6] bg-[#F7F5EE] flex items-center justify-between rounded-b-3xl">
              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to delete application #${selectedAppForModal.id}?`)) {
                    onDeleteApplication(selectedAppForModal.id);
                    onSelectAppForModal(null);
                  }
                }}
                className="px-3 py-2 rounded-xl text-rose-700 hover:bg-rose-100 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Application</span>
              </button>

              <button
                onClick={() => onSelectAppForModal(null)}
                className="px-5 py-2 rounded-xl bg-[#5A5A40] text-white text-xs font-bold hover:bg-[#464632]"
              >
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CREATE NEW VENDOR APPLICATION MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#E8E2D6] w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col my-auto">
            <div className="p-6 border-b border-[#E8E2D6] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#3D3A30]">Add New Vendor Application</h3>
                <p className="text-xs text-[#8A8576]">Manually enter an exhibitor registration into Firestore</p>
              </div>
              <button onClick={() => onSetCreateModalOpen(false)} className="p-2 text-[#8A8576] hover:text-[#3D3A30]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                onCreateApplication(newForm);
                onSetCreateModalOpen(false);
              }}
              className="p-6 space-y-4 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#7A7566] mb-1">Business Name *</label>
                  <input
                    type="text"
                    required
                    value={newForm.businessName}
                    onChange={(e) => setNewForm({ ...newForm, businessName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#7A7566] mb-1">Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={newForm.contactName}
                    onChange={(e) => setNewForm({ ...newForm, contactName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#7A7566] mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={newForm.email}
                    onChange={(e) => setNewForm({ ...newForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#7A7566] mb-1">Phone</label>
                  <input
                    type="text"
                    value={newForm.phone}
                    onChange={(e) => setNewForm({ ...newForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#7A7566] mb-1">Category</label>
                  <select
                    value={newForm.category}
                    onChange={(e) => setNewForm({ ...newForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6]"
                  >
                    <option value="Artisan Crafts & Handmade Goods">Artisan Crafts & Handmade</option>
                    <option value="Jewelry & Metalsmithing">Jewelry & Metalsmithing</option>
                    <option value="Culinary, Baked Goods & Spices">Culinary, Baked Goods & Spices</option>
                    <option value="Beauty & Wellness">Beauty & Wellness</option>
                    <option value="Home Goods, Ceramics & Woodcraft">Home Goods, Ceramics & Woodcraft</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#7A7566] mb-1">Booth Space</label>
                  <select
                    value={newForm.selectedBoothId}
                    onChange={(e) => {
                      const id = e.target.value as BoothId;
                      const tier = BOOTH_TIERS.find(b => b.id === id);
                      const fee = (tier?.pricePerDay || 100) * newForm.selectedDays.length;
                      setNewForm({ ...newForm, selectedBoothId: id, totalCalculatedFee: fee });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6]"
                  >
                    {BOOTH_TIERS.map(b => (
                      <option key={b.id} value={b.id}>{b.name} (${b.pricePerDay}/day)</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#7A7566] mb-1">Product Description</label>
                <textarea
                  rows={2}
                  value={newForm.productDescription}
                  onChange={(e) => setNewForm({ ...newForm, productDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6]"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-[#E8E2D6]">
                <button
                  type="button"
                  onClick={() => onSetCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-[#7A7566] hover:bg-[#F7F5EE] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#5A5A40] hover:bg-[#464632] text-white font-bold"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
