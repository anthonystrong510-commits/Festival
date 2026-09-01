import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  Printer, 
  Copy, 
  Check, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Coins, 
  FileText, 
  Sparkles, 
  DollarSign, 
  Clock, 
  ShieldCheck,
  AlertCircle,
  Building,
  CheckCircle2
} from 'lucide-react';
import { Invoice, InvoiceLineItem, PaymentConfig, SmtpConfigData, FestivalConfigData, VendorFormData, VendorApplicationRecord } from '../../../types';
import { saveInvoice } from '../../../lib/firebase';
import { auditAntiSpamQuality } from '../../../lib/antiSpamUtils';

interface InvoicePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor?: VendorFormData | VendorApplicationRecord | null;
  existingInvoice?: Invoice | null;
  paymentConfig: PaymentConfig;
  smtpConfig?: SmtpConfigData;
  festivalConfig?: FestivalConfigData;
  onInvoiceSaved?: (invoice: Invoice) => void;
}

export function InvoicePreviewModal({
  isOpen,
  onClose,
  vendor,
  existingInvoice,
  paymentConfig,
  smtpConfig,
  festivalConfig,
  onInvoiceSaved
}: InvoicePreviewModalProps) {
  if (!isOpen) return null;

  // Initialize Invoice State
  const [invoiceNumber, setInvoiceNumber] = useState(
    existingInvoice?.invoiceNumber || `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [recipientBusinessName, setRecipientBusinessName] = useState(
    existingInvoice?.recipientBusinessName || vendor?.businessName || 'Valued Festival Vendor'
  );
  const [recipientContactName, setRecipientContactName] = useState(
    existingInvoice?.recipientContactName || vendor?.contactName || 'Vendor Representative'
  );
  const [recipientEmail, setRecipientEmail] = useState(
    existingInvoice?.recipientEmail || vendor?.email || ''
  );
  const [recipientPhone, setRecipientPhone] = useState(
    existingInvoice?.recipientPhone || vendor?.phone || ''
  );
  const [recipientAddress, setRecipientAddress] = useState(
    existingInvoice?.recipientAddress || ''
  );
  const [issueDate, setIssueDate] = useState(
    existingInvoice?.issueDate || new Date().toISOString().split('T')[0]
  );
  const [dueDate, setDueDate] = useState(
    existingInvoice?.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState(
    existingInvoice?.notes || 'Thank you for your application to Columbia Community Vendor Marketplace! Please finalize payment to secure your booth reservation.'
  );
  const [terms, setTerms] = useState(
    existingInvoice?.terms || 'Payment is required within 14 days. Crypto settlements on USDT, ETH, and BTC are confirmed instantly upon TxHash submission.'
  );

  // Line items
  const initialItems: InvoiceLineItem[] = existingInvoice?.items || [
    {
      id: 'item-1',
      description: vendor?.category ? `${vendor.category} - Prime Marketplace Booth Space` : 'Standard Festival 10x10 Space Reservation',
      quantity: 1,
      unitPrice: vendor?.isFoodVendor ? 350 : 275,
      total: vendor?.isFoodVendor ? 350 : 275,
      category: 'booth_fee'
    },
    ...(vendor?.isFoodVendor ? [{
      id: 'item-2',
      description: 'Dedicated Health & Food Safety Hookup Allocation',
      quantity: 1,
      unitPrice: 50,
      total: 50,
      category: 'electrical' as const
    }] : [])
  ];

  const [items, setItems] = useState<InvoiceLineItem[]>(initialItems);
  const [discountAmount, setDiscountAmount] = useState<number>(existingInvoice?.discountAmount || 0);
  const [taxRate, setTaxRate] = useState<number>(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ success: boolean; message?: string; previewUrl?: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('preview');

  // Calculate totals
  const subtotal = items.reduce((acc, curr) => acc + (curr.total || 0), 0);
  const taxAmount = (subtotal - discountAmount) * (taxRate / 100);
  const totalAmount = Math.max(0, subtotal - discountAmount + taxAmount);

  const handleAddItem = () => {
    const newItem: InvoiceLineItem = {
      id: `item-${Date.now()}`,
      description: 'Additional Vendor Space / Equipment Allocation',
      quantity: 1,
      unitPrice: 50,
      total: 50,
      category: 'equipment'
    };
    setItems([...items, newItem]);
  };

  const handleUpdateItem = (id: string, field: keyof InvoiceLineItem, val: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: val };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.total = Number(updated.quantity) * Number(updated.unitPrice);
        }
        return updated;
      }
      return item;
    }));
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const checkoutUrl = `${window.location.origin}/?invoice=${existingInvoice?.id || invoiceNumber.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  const handleSaveAndSend = async (sendEmailDirect: boolean = true) => {
    setIsSending(true);
    setSendResult(null);

    try {
      const vendorAppId = (vendor && 'id' in vendor && typeof (vendor as any).id === 'string') ? (vendor as any).id : (existingInvoice?.vendorApplicationId || '');
      const invoicePayload: Partial<Invoice> & { recipientEmail: string; totalAmount: number } = {
        id: existingInvoice?.id || `inv-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        invoiceNumber,
        vendorApplicationId: vendorAppId,
        recipientBusinessName,
        recipientContactName,
        recipientEmail,
        recipientPhone,
        recipientAddress,
        issueDate,
        dueDate,
        status: sendEmailDirect ? 'sent' : (existingInvoice?.status || 'draft'),
        items,
        subtotal,
        discountAmount,
        taxAmount,
        totalAmount,
        paidAmount: existingInvoice?.paidAmount || 0,
        currency: 'USD',
        notes,
        terms,
        cryptoAddresses: {
          usdtTrc20: paymentConfig.usdtTrc20,
          usdtErc20: paymentConfig.usdtErc20,
          usdtSolana: paymentConfig.usdtSolana,
          ethereumAddress: paymentConfig.ethereumAddress,
          ethereumEns: paymentConfig.ethereumEns,
          bitcoinAddress: paymentConfig.bitcoinAddress,
          bitcoinLightning: paymentConfig.bitcoinLightning,
          cashAppCashtag: paymentConfig.cashAppCashtag,
          krakenPayId: paymentConfig.krakenPayId,
          krakenDepositAddress: paymentConfig.krakenDepositAddress
        },
        sentAt: sendEmailDirect ? new Date().toISOString() : existingInvoice?.sentAt,
        checkoutUrl: `${window.location.origin}/?invoice=${existingInvoice?.id || invoiceNumber.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
      };

      const saved = await saveInvoice(invoicePayload);

      if (sendEmailDirect) {
        // Send email via server
        const emailSubject = `Payment Invoice ${saved.invoiceNumber} - Columbia Community Festival`;
        const emailHtml = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 620px; margin: 0 auto; padding: 28px; background-color: #f7f5ee; border-radius: 16px; border: 1px solid #e8e2d6;">
            <div style="background-color: #5A5A40; color: #ffffff; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
              <span style="text-transform: uppercase; font-size: 11px; letter-spacing: 1px; opacity: 0.85;">Official Payment Invoice</span>
              <h1 style="margin: 6px 0 0 0; font-size: 24px;">Invoice ${saved.invoiceNumber}</h1>
              <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;">Columbia Community Vendor Marketplace</p>
            </div>

            <div style="background: #ffffff; padding: 20px; border-radius: 12px; border: 1px solid #ded8c9; margin-bottom: 20px;">
              <p style="margin-top: 0; font-size: 14px; color: #3d3a30;">Dear <strong>${saved.recipientContactName}</strong> (${saved.recipientBusinessName}),</p>
              <p style="font-size: 13px; color: #5a5a5a; line-height: 1.5;">
                Thank you for your vendor participation. Your space reservation invoice is now ready for payment.
              </p>

              <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #3d3a30; margin: 16px 0;">
                <tr style="border-bottom: 1px solid #e8e2d6;">
                  <th style="text-align: left; padding: 6px 0; color: #7a7566;">Description</th>
                  <th style="text-align: right; padding: 6px 0; color: #7a7566;">Amount</th>
                </tr>
                ${saved.items.map(item => `
                  <tr style="border-bottom: 1px solid #f0ebe0;">
                    <td style="padding: 8px 0;">${item.description} (x${item.quantity})</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: 600;">$${Number(item.total).toFixed(2)}</td>
                  </tr>
                `).join('')}
                <tr style="border-top: 2px solid #5A5A40;">
                  <td style="padding: 12px 0; font-size: 15px; font-weight: bold;">Total Due:</td>
                  <td style="padding: 12px 0; font-size: 18px; font-weight: bold; color: #2d5a27; text-align: right;">
                    $${Number(saved.totalAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                  </td>
                </tr>
              </table>
            </div>

            <div style="background: #fdfbf7; padding: 20px; border-radius: 12px; border: 1px dashed #5A5A40; margin-bottom: 24px; text-align: center;">
              <h3 style="margin: 0 0 8px 0; font-size: 15px; color: #3d3a30;">Accepted Payment Methods</h3>
              <p style="font-size: 12px; color: #7a7566; margin: 0 0 16px 0;">
                Crypto (USDT, ETH, BTC), CashApp $Cashtag, Kraken Sponsor Portal, or Traditional Bank Wire
              </p>
              <a href="${saved.checkoutUrl}" style="display: inline-block; background-color: #5A5A40; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: bold; font-size: 14px;">
                Open Secure Payment Checkout →
              </a>
            </div>

            <div style="font-size: 11px; color: #8A8576; text-align: center; border-top: 1px solid #e8e2d6; padding-top: 16px;">
              Columbia Community Festival Association • <a href="${saved.checkoutUrl}" style="color: #5A5A40;">${saved.checkoutUrl}</a>
            </div>
          </div>
        `;

        const res = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipientEmail: saved.recipientEmail,
            recipientName: saved.recipientContactName,
            subject: emailSubject,
            htmlBody: emailHtml,
            plainText: `Invoice ${saved.invoiceNumber} for $${saved.totalAmount} USD. Pay online at: ${saved.checkoutUrl}`,
            templateKey: 'invoice_notification',
            smtpConfig,
            festivalConfig
          })
        });

        const data = await res.json();
        setSendResult({
          success: data.success,
          message: data.success ? `Invoice dispatched to ${saved.recipientEmail}!` : data.error,
          previewUrl: data.previewUrl
        });
      } else {
        setSendResult({
          success: true,
          message: 'Invoice saved to draft.'
        });
      }

      if (onInvoiceSaved) {
        onInvoiceSaved(saved);
      }
    } catch (err: any) {
      setSendResult({
        success: false,
        message: err.message || 'Error processing invoice'
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyCheckoutLink = () => {
    navigator.clipboard.writeText(checkoutUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FAF8F5] rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#E8E2D6] animate-in fade-in zoom-in-95 my-auto">
        
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#E8E2D6] rounded-t-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#5A5A40] text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#3D3A30]">Invoice & Payment Generator</h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#F7F5EE] border border-[#D5CEBF] text-[#5A5A40] font-bold">
                  {invoiceNumber}
                </span>
              </div>
              <p className="text-xs text-[#7A7566]">
                Preview and dispatch customized payment invoice with multi-chain crypto & sponsor checkout
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-2">
            <div className="flex p-1 bg-[#F7F5EE] rounded-xl border border-[#E8E2D6]">
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'editor' ? 'bg-white shadow-xs text-[#3D3A30]' : 'text-[#7A7566] hover:text-[#3D3A30]'}`}
              >
                Edit Details
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'preview' ? 'bg-white shadow-xs text-[#3D3A30]' : 'text-[#7A7566] hover:text-[#3D3A30]'}`}
              >
                Invoice Preview
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-black/5 text-[#7A7566] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Notification banner */}
          {sendResult && (
            <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${sendResult.success ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'}`}>
              <div className="flex items-center gap-2 text-xs font-bold">
                {sendResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-700" /> : <AlertCircle className="w-4 h-4 text-rose-700" />}
                <span>{sendResult.message}</span>
              </div>
              {sendResult.previewUrl && (
                <a
                  href={sendResult.previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 bg-white border border-emerald-300 text-emerald-800 text-xs font-bold rounded-lg flex items-center gap-1 shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Dispatched Email</span>
                </a>
              )}
            </div>
          )}

          {activeTab === 'editor' ? (
            /* ================= EDITING TAB ================= */
            <div className="space-y-5">
              {/* Recipient & Dates Grid */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#E8E2D6] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-[#7A7566] mb-1">Business Name *</label>
                  <input
                    type="text"
                    value={recipientBusinessName}
                    onChange={(e) => setRecipientBusinessName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7] text-[#3D3A30] font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#7A7566] mb-1">Contact Name *</label>
                  <input
                    type="text"
                    value={recipientContactName}
                    onChange={(e) => setRecipientContactName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7] text-[#3D3A30]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#7A7566] mb-1">Recipient Email *</label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7] text-[#3D3A30]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#7A7566] mb-1">Recipient Phone</label>
                  <input
                    type="text"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7] text-[#3D3A30]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#7A7566] mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7] text-[#3D3A30]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#7A7566] mb-1">Payment Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7] text-[#3D3A30]"
                  />
                </div>
              </div>

              {/* Line Items Editor */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#E8E2D6] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D6]">
                  <h4 className="font-bold text-xs text-[#3D3A30] uppercase tracking-wider">Itemized Line Items</h4>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="px-3 py-1 rounded-lg bg-[#5A5A40] text-white text-xs font-bold flex items-center gap-1 hover:bg-[#464632]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {items.map((item, idx) => (
                    <div key={item.id} className="p-3 rounded-xl bg-[#FDFBF7] border border-[#E8E2D6] flex flex-col sm:flex-row sm:items-center gap-3 text-xs">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                          placeholder="Item description..."
                          className="w-full px-3 py-1.5 rounded-lg border border-[#E8E2D6] bg-white font-medium text-[#3D3A30]"
                        />
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="w-20">
                          <label className="block text-[10px] text-[#7A7566] font-bold">Qty</label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleUpdateItem(item.id, 'quantity', Number(e.target.value))}
                            className="w-full px-2 py-1.5 rounded-lg border border-[#E8E2D6] bg-white text-center"
                          />
                        </div>
                        <div className="w-28">
                          <label className="block text-[10px] text-[#7A7566] font-bold">Unit Price ($)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => handleUpdateItem(item.id, 'unitPrice', Number(e.target.value))}
                            className="w-full px-2 py-1.5 rounded-lg border border-[#E8E2D6] bg-white text-right"
                          />
                        </div>
                        <div className="w-24 text-right pt-4 font-bold text-[#3D3A30]">
                          ${Number(item.total).toFixed(2)}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1.5 mt-3.5 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotal & Discounts */}
                <div className="pt-3 border-t border-[#E8E2D6] flex flex-col items-end space-y-1.5 text-xs">
                  <div className="flex justify-between w-64 text-[#7A7566]">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-[#3D3A30]">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between w-64 items-center">
                    <span className="text-[#7A7566]">Discount ($):</span>
                    <input
                      type="number"
                      step="0.01"
                      value={discountAmount}
                      onChange={(e) => setDiscountAmount(Number(e.target.value))}
                      className="w-24 px-2 py-1 rounded-lg border border-[#E8E2D6] text-right font-semibold text-emerald-700 bg-[#FDFBF7]"
                    />
                  </div>
                  <div className="flex justify-between w-64 pt-2 border-t border-[#E8E2D6] text-sm font-bold text-[#3D3A30]">
                    <span>Total Amount Due:</span>
                    <span className="text-emerald-800 text-base">${totalAmount.toFixed(2)} USD</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ================= LIVE INVOICE PREVIEW TAB ================= */
            <div className="bg-white rounded-2xl border border-[#E8E2D6] shadow-sm p-6 sm:p-8 space-y-6">
              {/* Invoice Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[#E8E2D6]">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#5A5A40] bg-[#F7F5EE] px-3 py-1 rounded-full border border-[#D5CEBF]">
                    Official Vendor Invoice
                  </span>
                  <h2 className="text-2xl font-extrabold text-[#3D3A30] mt-2">
                    Columbia Community Festival
                  </h2>
                  <p className="text-xs text-[#7A7566] mt-0.5">
                    {festivalConfig?.venueName || 'Columbia Historic Park Pavilion'} • {festivalConfig?.contactEmail || 'events@festivalmarket.org'}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-lg font-black text-[#5A5A40] font-mono">{invoiceNumber}</div>
                  <div className="text-xs text-[#7A7566] mt-1">Issue Date: {issueDate}</div>
                  <div className="text-xs font-bold text-rose-700 mt-0.5">Due Date: {dueDate}</div>
                </div>
              </div>

              {/* Bill To Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D6] text-xs">
                <div>
                  <span className="text-[10px] font-bold text-[#7A7566] uppercase tracking-wider block mb-1">Billed To:</span>
                  <div className="font-extrabold text-sm text-[#3D3A30]">{recipientBusinessName}</div>
                  <div className="text-[#5A5A40] font-semibold">{recipientContactName}</div>
                  <div className="text-[#7A7566]">{recipientEmail}</div>
                  {recipientPhone && <div className="text-[#7A7566]">{recipientPhone}</div>}
                </div>

                <div>
                  <span className="text-[10px] font-bold text-[#7A7566] uppercase tracking-wider block mb-1">Space Allocation:</span>
                  <div className="font-semibold text-[#3D3A30]">{vendor?.selectedBoothId ? `Booth Type: ${vendor.selectedBoothId}` : 'Designated 10x10 Marketplace Space'}</div>
                  <div className="text-[#7A7566]">Status: Pending Space Confirmation</div>
                  <div className="mt-2 text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Instant On-Chain Confirmation
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#E8E2D6] text-[#7A7566] uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 text-left">Description</th>
                    <th className="py-2.5 text-center w-16">Qty</th>
                    <th className="py-2.5 text-right w-28">Price</th>
                    <th className="py-2.5 text-right w-28">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EBE0]">
                  {items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-3 font-semibold text-[#3D3A30]">{item.description}</td>
                      <td className="py-3 text-center text-[#7A7566]">{item.quantity}</td>
                      <td className="py-3 text-right text-[#7A7566]">${Number(item.unitPrice).toFixed(2)}</td>
                      <td className="py-3 text-right font-bold text-[#3D3A30]">${Number(item.total).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals Section */}
              <div className="pt-4 border-t border-[#E8E2D6] flex flex-col items-end space-y-1 text-xs">
                <div className="flex justify-between w-64 text-[#7A7566]">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-[#3D3A30]">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between w-64 text-emerald-700 font-semibold">
                    <span>Discount:</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between w-64 pt-2 border-t-2 border-[#5A5A40] text-sm font-extrabold text-[#3D3A30]">
                  <span>Total Amount Due:</span>
                  <span className="text-emerald-800 text-lg font-black">${totalAmount.toFixed(2)} USD</span>
                </div>
              </div>

              {/* Crypto & Sponsor Payment Instruction Box */}
              <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#5A5A40]/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-[#5A5A40]" />
                    <h4 className="font-bold text-sm text-[#3D3A30]">Embedded Payment Options in Checkout</h4>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Kraken • CashApp • Crypto • Bank
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {/* USDT */}
                  <div className="p-3 rounded-xl bg-white border border-[#E8E2D6]">
                    <div className="font-bold text-teal-800 flex items-center gap-1.5 mb-1">
                      <span className="w-2 h-2 rounded-full bg-teal-500"></span> USDT Multi-Chain
                    </div>
                    <p className="text-[11px] text-[#7A7566] truncate font-mono">
                      {paymentConfig.usdtTrc20 || 'TQ9w5f...'}
                    </p>
                    <span className="text-[10px] text-teal-700 font-semibold">TRC20 / ERC20 / Solana</span>
                  </div>

                  {/* CashApp */}
                  <div className="p-3 rounded-xl bg-white border border-[#E8E2D6]">
                    <div className="font-bold text-emerald-700 flex items-center gap-1.5 mb-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span> CashApp Sponsor
                    </div>
                    <p className="text-[11px] text-[#3D3A30] font-mono font-bold">
                      {paymentConfig.cashAppCashtag || '$ColumbiaFestival'}
                    </p>
                    <span className="text-[10px] text-emerald-800 font-semibold">Instant Mobile Checkout</span>
                  </div>

                  {/* Kraken */}
                  <div className="p-3 rounded-xl bg-white border border-[#E8E2D6]">
                    <div className="font-bold text-purple-700 flex items-center gap-1.5 mb-1">
                      <span className="w-2 h-2 rounded-full bg-purple-600"></span> Kraken Sponsor
                    </div>
                    <p className="text-[11px] text-[#3D3A30] font-mono font-semibold truncate">
                      {paymentConfig.krakenPayId || 'KRAKEN-COLUMBIA-FEST'}
                    </p>
                    <span className="text-[10px] text-purple-800 font-semibold">Tier 1 Settlement</span>
                  </div>
                </div>

                <div className="text-[11px] text-[#7A7566] italic border-t border-[#E8E2D6] pt-2">
                  * Note: The vendor will receive an interactive checkout page with QR codes, transaction hash verification, and automatic receipt generation upon payment.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#E8E2D6] rounded-b-2xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyCheckoutLink}
              className="px-3.5 py-2 rounded-xl bg-[#F7F5EE] hover:bg-[#EAE4D6] text-[#5A5A40] border border-[#D5CEBF] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Checkout Link'}</span>
            </button>

            <a
              href={checkoutUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-[#F7F5EE] hover:bg-[#EAE4D6] text-[#5A5A40] border border-[#D5CEBF] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open Checkout Page</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSaveAndSend(false)}
              disabled={isSending}
              className="px-4 py-2.5 rounded-xl bg-white border border-[#D5CEBF] hover:bg-[#FAF8F5] text-[#3D3A30] text-xs font-bold transition-colors disabled:opacity-50"
            >
              Save as Draft
            </button>

            <button
              type="button"
              onClick={() => handleSaveAndSend(true)}
              disabled={isSending || !recipientEmail}
              className="px-5 py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors disabled:opacity-50"
            >
              <Send className={`w-4 h-4 ${isSending ? 'animate-spin' : ''}`} />
              <span>{isSending ? 'Sending Invoice...' : `Send Invoice to ${recipientEmail ? recipientEmail : 'Vendor'}`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
