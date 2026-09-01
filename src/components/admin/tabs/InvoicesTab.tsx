import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  ExternalLink, 
  Copy, 
  Check, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Send, 
  Eye, 
  DollarSign, 
  ShieldCheck, 
  Coins, 
  Sparkles,
  QrCode,
  ArrowUpRight
} from 'lucide-react';
import { Invoice, PaymentConfig, SmtpConfigData, FestivalConfigData, InvoiceStatus } from '../../../types';
import { updateInvoiceStatus, deleteInvoice } from '../../../lib/firebase';
import { InvoicePreviewModal } from '../modals/InvoicePreviewModal';
import { InvoiceCheckoutModal } from '../../checkout/InvoiceCheckoutModal';

interface InvoicesTabProps {
  invoices: Invoice[];
  paymentConfig: PaymentConfig;
  smtpConfig?: SmtpConfigData;
  festivalConfig?: FestivalConfigData;
  onRefresh?: () => void;
}

export function InvoicesTab({
  invoices,
  paymentConfig,
  smtpConfig,
  festivalConfig,
  onRefresh
}: InvoicesTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInvoiceForModal, setSelectedInvoiceForModal] = useState<Invoice | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [activeCheckoutInvoice, setActiveCheckoutInvoice] = useState<Invoice | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [reviewingInvoice, setReviewingInvoice] = useState<Invoice | null>(null);

  // Filtered invoices
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      (inv.invoiceNumber && inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (inv.recipientBusinessName && inv.recipientBusinessName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (inv.recipientEmail && inv.recipientEmail.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate Metrics
  const totalInvoiced = invoices.reduce((acc, i) => acc + (i.totalAmount || 0), 0);
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + (i.totalAmount || 0), 0);
  const countUnderReview = invoices.filter(i => i.status === 'under_review').length;
  const countOutstanding = invoices.filter(i => i.status === 'sent' || i.status === 'under_review').length;

  const handleCopyLink = (invoice: Invoice) => {
    const url = invoice.checkoutUrl || `${window.location.origin}/?invoice=${invoice.id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(invoice.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleApprovePayment = async (inv: Invoice) => {
    try {
      await updateInvoiceStatus(inv.id, 'paid', inv.totalAmount);
      setReviewingInvoice(null);
      if (onRefresh) onRefresh();
    } catch (e) {
      console.error('Error approving payment:', e);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await deleteInvoice(id);
        if (onRefresh) onRefresh();
      } catch (e) {
        console.error('Error deleting invoice:', e);
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E2D6] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#5A5A40] text-white">
              <FileText className="w-4 h-4" />
            </span>
            <h2 className="font-bold text-lg text-[#3D3A30]">Vendor Invoices & Crypto Checkout Hub</h2>
          </div>
          <p className="text-xs text-[#7A7566]">
            Itemized invoices, direct checkout links, automated crypto payment routing, and receipt reviews.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedInvoiceForModal(null);
            setIsInvoiceModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Custom Invoice</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#E8E2D6] shadow-xs">
          <span className="text-[11px] font-bold text-[#7A7566] uppercase tracking-wider">Total Invoiced</span>
          <div className="text-xl sm:text-2xl font-extrabold text-[#3D3A30] mt-1">
            ${totalInvoiced.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-[#7A7566] mt-0.5 block">{invoices.length} total issued</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E8E2D6] shadow-xs">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Paid & Collected</span>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-800 mt-1">
            ${totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-emerald-700 mt-0.5 block">
            {invoices.filter(i => i.status === 'paid').length} payments settled
          </span>
        </div>

        <div className={`p-4 rounded-xl border shadow-xs ${countUnderReview > 0 ? 'bg-amber-50/80 border-amber-300' : 'bg-white border-[#E8E2D6]'}`}>
          <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Under Review
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-amber-950 mt-1">
            {countUnderReview}
          </div>
          <span className="text-[11px] text-amber-800 mt-0.5 block">
            TxHash submitted by vendor
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E8E2D6] shadow-xs">
          <span className="text-[11px] font-bold text-[#7A7566] uppercase tracking-wider">Awaiting Payment</span>
          <div className="text-xl sm:text-2xl font-extrabold text-[#5A5A40] mt-1">
            {countOutstanding}
          </div>
          <span className="text-[11px] text-[#7A7566] mt-0.5 block">Active unpaid invoices</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8E2D6] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#7A7566]" />
          <input
            type="text"
            placeholder="Search by invoice number, business name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E8E2D6] bg-[#FAF8F5] text-xs text-[#3D3A30] placeholder:text-[#9A9586]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#7A7566]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FAF8F5] text-xs font-bold text-[#3D3A30]"
          >
            <option value="all">All Statuses ({invoices.length})</option>
            <option value="sent">Sent ({invoices.filter(i => i.status === 'sent').length})</option>
            <option value="under_review">Under Review ({invoices.filter(i => i.status === 'under_review').length})</option>
            <option value="paid">Paid ({invoices.filter(i => i.status === 'paid').length})</option>
            <option value="draft">Draft ({invoices.filter(i => i.status === 'draft').length})</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-[#E8E2D6] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#E8E2D6] text-[#7A7566] font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Invoice #</th>
                <th className="px-4 py-3">Recipient / Vendor</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D6]">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#7A7566]">
                    No invoices found. Generate invoices from the Vendor Applications tab or click "Create Custom Invoice".
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const isPaid = inv.status === 'paid';
                  const isReview = inv.status === 'under_review';

                  return (
                    <tr key={inv.id} className="hover:bg-[#FDFBF7] transition-colors">
                      {/* Invoice # */}
                      <td className="px-4 py-3.5">
                        <div className="font-mono font-bold text-xs text-[#5A5A40]">
                          {inv.invoiceNumber}
                        </div>
                        <span className="text-[10px] text-[#7A7566]">{inv.issueDate}</span>
                      </td>

                      {/* Recipient */}
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-[#3D3A30]">{inv.recipientBusinessName}</div>
                        <div className="text-[11px] text-[#7A7566]">{inv.recipientEmail}</div>
                      </td>

                      {/* Due Date */}
                      <td className="px-4 py-3.5 text-[#5A5A40] font-medium">
                        {inv.dueDate}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        {isPaid ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3" /> Paid
                          </span>
                        ) : isReview ? (
                          <button
                            type="button"
                            onClick={() => setReviewingInvoice(inv)}
                            className="px-2.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit hover:bg-amber-200 transition-colors animate-pulse"
                          >
                            <Clock className="w-3 h-3" /> Review Tx
                          </button>
                        ) : inv.status === 'sent' ? (
                          <span className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit">
                            <Send className="w-3 h-3" /> Sent
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-gray-100 border border-gray-300 text-gray-700 text-[10px] font-bold uppercase tracking-wider w-fit">
                            Draft
                          </span>
                        )}
                      </td>

                      {/* Total Amount */}
                      <td className="px-4 py-3.5 text-right font-extrabold text-sm text-[#3D3A30]">
                        ${Number(inv.totalAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Open Interactive Checkout */}
                          <button
                            type="button"
                            onClick={() => setActiveCheckoutInvoice(inv)}
                            className="px-2.5 py-1.5 rounded-lg bg-[#5A5A40] text-white hover:bg-[#464632] text-xs font-bold flex items-center gap-1 transition-colors shadow-xs"
                            title="Open Vendor Checkout"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Checkout</span>
                          </button>

                          {/* Copy Direct Checkout Link */}
                          <button
                            type="button"
                            onClick={() => handleCopyLink(inv)}
                            className="p-1.5 rounded-lg bg-[#FAF8F5] border border-[#E8E2D6] hover:bg-[#EAE4D6] text-[#5A5A40] transition-colors"
                            title="Copy Payment Link"
                          >
                            {copiedId === inv.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Edit / Preview Modal */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedInvoiceForModal(inv);
                              setIsInvoiceModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-[#FAF8F5] border border-[#E8E2D6] hover:bg-[#EAE4D6] text-[#5A5A40] transition-colors"
                            title="Edit & Preview Invoice"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDelete(inv.id)}
                            className="p-1.5 rounded-lg bg-[#FAF8F5] border border-[#E8E2D6] hover:bg-rose-50 text-rose-600 transition-colors"
                            title="Delete Invoice"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Payment Submission Modal */}
      {reviewingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-[#E8E2D6] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D6]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-sm text-[#3D3A30]">Verify Vendor Payment</h3>
              </div>
              <span className="font-mono text-xs font-bold text-[#5A5A40]">{reviewingInvoice.invoiceNumber}</span>
            </div>

            <div className="space-y-3 text-xs bg-[#FAF8F5] p-4 rounded-xl border border-[#E8E2D6]">
              <div>
                <span className="text-[#7A7566] block font-bold">Vendor:</span>
                <span className="text-[#3D3A30] font-bold text-sm">{reviewingInvoice.recipientBusinessName}</span>
              </div>

              <div>
                <span className="text-[#7A7566] block font-bold">Total Amount Due:</span>
                <span className="text-emerald-800 font-extrabold text-sm">${reviewingInvoice.totalAmount} USD</span>
              </div>

              <div>
                <span className="text-[#7A7566] block font-bold">Payment Method Used:</span>
                <span className="text-[#3D3A30] uppercase font-mono font-bold">
                  {reviewingInvoice.paymentDetailsSubmitted?.method || 'Crypto On-Chain'}
                </span>
              </div>

              <div>
                <span className="text-[#7A7566] block font-bold">Transaction Hash (TxID):</span>
                <span className="font-mono text-[11px] text-[#5A5A40] break-all select-all font-semibold block bg-white p-2 rounded-lg border border-[#E8E2D6] mt-1">
                  {reviewingInvoice.paymentDetailsSubmitted?.txHash || 'N/A'}
                </span>
              </div>

              {reviewingInvoice.paymentDetailsSubmitted?.payerWalletOrHandle && (
                <div>
                  <span className="text-[#7A7566] block font-bold">Sender Handle / Wallet:</span>
                  <span className="text-[#3D3A30] font-mono">{reviewingInvoice.paymentDetailsSubmitted.payerWalletOrHandle}</span>
                </div>
              )}

              {reviewingInvoice.paymentDetailsSubmitted?.proofNote && (
                <div>
                  <span className="text-[#7A7566] block font-bold">Proof Memo:</span>
                  <span className="text-[#3D3A30] italic">{reviewingInvoice.paymentDetailsSubmitted.proofNote}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleApprovePayment(reviewingInvoice)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Mark as Paid</span>
              </button>
              <button
                type="button"
                onClick={() => setReviewingInvoice(null)}
                className="py-2.5 px-4 rounded-xl bg-black/5 hover:bg-black/10 text-xs font-bold text-[#3D3A30]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Generator / Preview Modal */}
      {isInvoiceModalOpen && (
        <InvoicePreviewModal
          isOpen={isInvoiceModalOpen}
          onClose={() => setIsInvoiceModalOpen(false)}
          existingInvoice={selectedInvoiceForModal}
          paymentConfig={paymentConfig}
          smtpConfig={smtpConfig}
          festivalConfig={festivalConfig}
          onInvoiceSaved={(inv) => {
            if (onRefresh) onRefresh();
          }}
        />
      )}

      {/* Interactive Public Checkout Modal */}
      {activeCheckoutInvoice && (
        <InvoiceCheckoutModal
          invoice={activeCheckoutInvoice}
          onClose={() => setActiveCheckoutInvoice(null)}
          onPaymentSubmitted={() => {
            if (onRefresh) onRefresh();
          }}
        />
      )}
    </div>
  );
}
