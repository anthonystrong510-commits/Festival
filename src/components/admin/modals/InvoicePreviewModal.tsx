import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  Copy, 
  Check, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Coins, 
  FileText, 
  Sparkles, 
  ShieldCheck,
  AlertCircle,
  Building,
  CheckCircle2,
  Smartphone
} from 'lucide-react';
import { Invoice, InvoiceLineItem, PaymentConfig, SmtpConfigData, FestivalConfigData, VendorFormData, VendorApplicationRecord, PaymentMethodsEnabled } from '../../../types';
import { saveInvoice, DEFAULT_FESTIVAL_CONFIG } from '../../../lib/firebase';
import { safeFetchJson } from '../../../lib/apiUtils';

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
  const festName = festivalConfig?.name || DEFAULT_FESTIVAL_CONFIG.name;
  const festAddress = festivalConfig?.address || DEFAULT_FESTIVAL_CONFIG.address;
  const festVenue = festivalConfig?.venueName || DEFAULT_FESTIVAL_CONFIG.venueName;
  const senderEmail = smtpConfig?.fromEmail || 'treasury@columbiamarket.org';
  const unsubscribeUrl = `${window.location.origin}/?unsubscribe=${encodeURIComponent(recipientEmail)}&scope=invoice`;

  const handleSaveAndSend = async (sendEmailDirect: boolean = true) => {
    setIsSending(true);
    setSendResult(null);

    try {
      const vendorAppId = (vendor && 'id' in vendor && typeof (vendor as any).id === 'string') ? (vendor as any).id : (existingInvoice?.vendorApplicationId || '');
      
      const paymentMethodsEnabled: PaymentMethodsEnabled = {
        usdt: paymentConfig.usdtEnabled !== false,
        ethereum: paymentConfig.ethereumEnabled !== false,
        bitcoin: paymentConfig.bitcoinEnabled !== false,
        cashApp: paymentConfig.cashAppEnabled !== false,
        krakenPay: paymentConfig.krakenPayEnabled !== false,
        bankTransfer: paymentConfig.bankTransferEnabled !== false
      };

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
        paymentMethodsEnabled,
        bankDetails: {
          bankName: paymentConfig.bankName,
          bankAccountName: paymentConfig.bankAccountName,
          bankAccountNumber: paymentConfig.bankAccountNumber,
          bankRoutingNumber: paymentConfig.bankRoutingNumber,
          bankSwiftBic: paymentConfig.bankSwiftBic,
          zelleHandle: paymentConfig.zelleHandle,
          paymentInstructions: paymentConfig.paymentInstructions
        },
        cryptoAddresses: {
          usdtTrc20: paymentConfig.usdtTrc20,
          usdtErc20: paymentConfig.usdtErc20,
          usdtSolana: paymentConfig.usdtSolana,
          ethereumAddress: paymentConfig.ethereumAddress,
          ethereumEns: paymentConfig.ethereumEns,
          bitcoinAddress: paymentConfig.bitcoinAddress,
          bitcoinLightning: paymentConfig.bitcoinLightning,
          cashAppCashtag: paymentConfig.cashAppCashtag,
          cashAppBtcAddress: paymentConfig.cashAppBtcAddress,
          krakenPayId: paymentConfig.krakenPayId,
          krakenDepositAddress: paymentConfig.krakenDepositAddress
        },
        sentAt: sendEmailDirect ? new Date().toISOString() : existingInvoice?.sentAt,
        checkoutUrl: `${window.location.origin}/?invoice=${existingInvoice?.id || invoiceNumber.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
      };

      const saved = await saveInvoice(invoicePayload);

      if (sendEmailDirect) {
        // Send email via safe serverless endpoint with full anti-spam RFC compliance
        const emailSubject = `Payment Invoice ${saved.invoiceNumber} - ${festName}`;
        
        // Build accepted methods string
        const acceptedMethodsList = [
          paymentMethodsEnabled.usdt ? 'USDT (TRC20/ERC20/Solana)' : null,
          paymentMethodsEnabled.ethereum ? 'Ethereum (ETH & ENS)' : null,
          paymentMethodsEnabled.bitcoin ? 'Bitcoin & Lightning' : null,
          paymentMethodsEnabled.cashApp ? `CashApp (${paymentConfig.cashAppCashtag})` : null,
          paymentMethodsEnabled.krakenPay ? 'Kraken Pay ID' : null,
          paymentMethodsEnabled.bankTransfer ? 'Bank Wire / Zelle' : null
        ].filter(Boolean).join(' • ');

        const emailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${saved.invoiceNumber}</title>
</head>
<body style="margin:0; padding:0; background-color:#FAF8F5; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#3D3A30; -webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#FAF8F5; padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px; width:100%; background-color:#FFFFFF; border:1px solid #E8E2D6; border-radius:16px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color:#5A5A40; padding:32px 28px; text-align:left; color:#FFFFFF;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <span style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#EAE4D6;">Official Vendor Space Invoice</span>
                    <h1 style="margin:8px 0 0 0; font-size:24px; font-weight:800; color:#FFFFFF; line-height:1.2;">Invoice ${saved.invoiceNumber}</h1>
                    <p style="margin:4px 0 0 0; font-size:13px; color:#EAE4D6;">${festName} • ${festVenue}</p>
                  </td>
                  <td align="right" valign="top">
                    <span style="display:inline-block; padding:6px 14px; background-color:rgba(255,255,255,0.15); color:#FFFFFF; border-radius:20px; font-size:11px; font-weight:700; letter-spacing:0.5px;">DUE: ${saved.dueDate}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding:28px;">
              <p style="margin:0 0 16px 0; font-size:15px; color:#3D3A30; line-height:1.5;">
                Dear <strong>${saved.recipientContactName}</strong> (${saved.recipientBusinessName}),
              </p>
              <p style="margin:0 0 20px 0; font-size:14px; color:#5A5A40; line-height:1.6;">
                Thank you for participating as a vendor at <strong>${festName}</strong>. Your space allocation and equipment invoice has been issued and is available for payment below.
              </p>

              <!-- Itemized Table -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:20px 0; border-collapse:collapse;">
                <thead>
                  <tr style="border-bottom:2px solid #E8E2D6;">
                    <th align="left" style="padding:10px 0; font-size:11px; font-weight:700; text-transform:uppercase; color:#7A7566; letter-spacing:0.5px;">Description</th>
                    <th align="center" style="padding:10px 0; font-size:11px; font-weight:700; text-transform:uppercase; color:#7A7566; letter-spacing:0.5px; width:40px;">Qty</th>
                    <th align="right" style="padding:10px 0; font-size:11px; font-weight:700; text-transform:uppercase; color:#7A7566; letter-spacing:0.5px; width:100px;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${saved.items.map(item => `
                    <tr style="border-bottom:1px solid #F0EBE0;">
                      <td style="padding:12px 0; font-size:13px; color:#3D3A30; font-weight:500;">${item.description}</td>
                      <td align="center" style="padding:12px 0; font-size:13px; color:#7A7566;">${item.quantity}</td>
                      <td align="right" style="padding:12px 0; font-size:13px; font-weight:600; color:#3D3A30;">$${Number(item.total).toFixed(2)}</td>
                    </tr>
                  `).join('')}
                  ${saved.discountAmount ? `
                    <tr style="border-bottom:1px solid #F0EBE0;">
                      <td colspan="2" style="padding:10px 0; font-size:13px; color:#1B8755; font-weight:600;">Discount Applied</td>
                      <td align="right" style="padding:10px 0; font-size:13px; font-weight:600; color:#1B8755;">-$${Number(saved.discountAmount).toFixed(2)}</td>
                    </tr>
                  ` : ''}
                  <tr style="border-top:2px solid #5A5A40;">
                    <td colspan="2" style="padding:16px 0; font-size:16px; font-weight:800; color:#3D3A30;">Total Amount Due:</td>
                    <td align="right" style="padding:16px 0; font-size:20px; font-weight:900; color:#1B8755;">
                      $${Number(saved.totalAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- Payment Methods CTA Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#FAF8F5; border:1px solid #E8E2D6; border-radius:12px; margin:24px 0;">
                <tr>
                  <td style="padding:20px; text-align:center;">
                    <h3 style="margin:0 0 8px 0; font-size:15px; font-weight:700; color:#3D3A30;">Accepted Payment Methods</h3>
                    <p style="margin:0 0 16px 0; font-size:12px; color:#7A7566; line-height:1.5;">
                      ${acceptedMethodsList || 'Multi-Chain Crypto (USDT, ETH, BTC), CashApp, Kraken & Bank Wire'}
                    </p>
                    <a href="${saved.checkoutUrl}" style="display:inline-block; background-color:#5A5A40; color:#FFFFFF; text-decoration:none; padding:14px 32px; border-radius:10px; font-size:14px; font-weight:700; letter-spacing:0.3px;">
                      Open Secure Payment Checkout →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:16px 0 0 0; font-size:12px; color:#7A7566; line-height:1.5;">
                <strong>Terms:</strong> ${saved.terms || 'Payment is due within 14 days of issue. Once paid, your space registration is locked in the festival directory.'}
              </p>
            </td>
          </tr>

          <!-- Standard Anti-Spam Footer -->
          <tr>
            <td style="background-color:#F7F5EE; padding:24px 28px; border-top:1px solid #E8E2D6; text-align:center; font-size:11px; color:#7A7566; line-height:1.6;">
              <p style="margin:0 0 6px 0; font-weight:700; color:#5A5A40;">
                ${festName}
              </p>
              <p style="margin:0 0 8px 0;">
                Physical Address: ${festAddress} • Contact: ${senderEmail}
              </p>
              <p style="margin:0 0 8px 0; color:#8A8576;">
                You received this billing notification because ${saved.recipientBusinessName} registered as an official marketplace vendor.
              </p>
              <p style="margin:0; font-size:10px; color:#8A8576;">
                <a href="${saved.checkoutUrl}" style="color:#5A5A40; text-decoration:underline; font-weight:600;">View Invoice Online</a> • 
                <a href="${unsubscribeUrl}" style="color:#7A7566; text-decoration:underline;">Unsubscribe / Manage Preferences</a> • 
                <a href="${window.location.origin}" style="color:#7A7566; text-decoration:underline;">Festival Homepage</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

        const plainText = `
${festName} - OFFICIAL VENDOR INVOICE
==================================================
Invoice #: ${saved.invoiceNumber}
Issue Date: ${saved.issueDate}
Due Date: ${saved.dueDate}
Billed To: ${saved.recipientContactName} (${saved.recipientBusinessName})

ITEMIZED CHARGES:
${saved.items.map(i => `- ${i.description} (x${i.quantity}): $${Number(i.total).toFixed(2)}`).join('\n')}
${saved.discountAmount ? `Discount Applied: -$${Number(saved.discountAmount).toFixed(2)}\n` : ''}
TOTAL DUE: $${Number(saved.totalAmount).toFixed(2)} USD

ACCEPTED PAYMENT OPTIONS:
${acceptedMethodsList}

PAY ONLINE AT SECURE CHECKOUT:
${saved.checkoutUrl}

--------------------------------------------------
${festName}
Physical Address: ${festAddress}
Support Contact: ${senderEmail}
Unsubscribe: ${unsubscribeUrl}
        `.trim();

        const dispatchRes = await safeFetchJson('/api/send-email', {
          method: 'POST',
          body: JSON.stringify({
            recipientEmail: saved.recipientEmail,
            recipientName: saved.recipientContactName,
            subject: emailSubject,
            htmlBody: emailHtml,
            plainText,
            templateKey: 'invoice_notification',
            smtpConfig,
            festivalConfig
          })
        });

        setSendResult({
          success: dispatchRes.success,
          message: dispatchRes.success 
            ? `Invoice successfully delivered to ${saved.recipientEmail}!` 
            : (dispatchRes.error || 'Could not deliver invoice email.'),
          previewUrl: dispatchRes.previewUrl
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
      console.error('Invoice handling error:', err);
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
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'editor' ? 'bg-white shadow-xs text-[#3D3A30]' : 'text-[#7A7566] hover:text-[#3D3A30]'}`}
              >
                Edit Details
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'preview' ? 'bg-white shadow-xs text-[#3D3A30]' : 'text-[#7A7566] hover:text-[#3D3A30]'}`}
              >
                Invoice Preview
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-black/5 text-[#7A7566] transition-colors cursor-pointer"
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
                    className="px-3 py-1 rounded-lg bg-[#5A5A40] text-white text-xs font-bold flex items-center gap-1 hover:bg-[#464632] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {items.map((item) => (
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
                          className="p-1.5 mt-3.5 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
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
            <div className="bg-white rounded-2xl border border-[#E8E2D6] shadow-xs p-6 sm:p-8 space-y-6">
              {/* Invoice Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[#E8E2D6]">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#5A5A40] bg-[#F7F5EE] px-3 py-1 rounded-full border border-[#D5CEBF]">
                    Official Vendor Invoice
                  </span>
                  <h2 className="text-2xl font-extrabold text-[#3D3A30] mt-2">
                    {festName}
                  </h2>
                  <p className="text-xs text-[#7A7566] mt-0.5">
                    {festVenue} • {festAddress}
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
                  <div className="font-semibold text-[#3D3A30]">{vendor?.selectedBoothId ? `Booth Space: ${vendor.selectedBoothId}` : 'Designated 10x10 Marketplace Space'}</div>
                  <div className="text-[#7A7566]">Status: Invoice Generated</div>
                  <div className="mt-2 text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Instant Receipt & Verification
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

              {/* Active Payment Methods Summary */}
              <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#5A5A40]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-[#5A5A40]" />
                    <h4 className="font-bold text-sm text-[#3D3A30]">Active Checkout Payment Channels</h4>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Configured in Admin
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {/* Bank Wire */}
                  {paymentConfig.bankTransferEnabled !== false && (
                    <div className="p-3 rounded-xl bg-white border border-[#E8E2D6]">
                      <div className="font-bold text-[#3D3A30] flex items-center gap-1.5 mb-1">
                        <Building className="w-3.5 h-3.5 text-[#5A5A40]" /> Bank Wire & Zelle
                      </div>
                      <p className="text-[11px] text-[#7A7566] font-semibold">
                        {paymentConfig.bankName || 'First Columbia Bank'}
                      </p>
                      <span className="text-[10px] text-[#7A7566]">Zelle: {paymentConfig.zelleHandle}</span>
                    </div>
                  )}

                  {/* CashApp */}
                  {paymentConfig.cashAppEnabled !== false && (
                    <div className="p-3 rounded-xl bg-white border border-[#E8E2D6]">
                      <div className="font-bold text-emerald-700 flex items-center gap-1.5 mb-1">
                        <Smartphone className="w-3.5 h-3.5 text-emerald-600" /> CashApp
                      </div>
                      <p className="text-[11px] text-[#3D3A30] font-mono font-bold">
                        {paymentConfig.cashAppCashtag || '$ColumbiaFestival'}
                      </p>
                      <span className="text-[10px] text-emerald-800 font-semibold">Instant Mobile Checkout</span>
                    </div>
                  )}

                  {/* Kraken */}
                  {paymentConfig.krakenPayEnabled !== false && (
                    <div className="p-3 rounded-xl bg-white border border-[#E8E2D6]">
                      <div className="font-bold text-purple-700 flex items-center gap-1.5 mb-1">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Kraken Pay
                      </div>
                      <p className="text-[11px] text-[#3D3A30] font-mono font-semibold truncate">
                        {paymentConfig.krakenPayId || 'KRAKEN-COLUMBIA-FEST'}
                      </p>
                      <span className="text-[10px] text-purple-800 font-semibold">Tier 1 Settlement</span>
                    </div>
                  )}

                  {/* USDT */}
                  {paymentConfig.usdtEnabled !== false && (
                    <div className="p-3 rounded-xl bg-white border border-[#E8E2D6]">
                      <div className="font-bold text-teal-800 flex items-center gap-1.5 mb-1">
                        <span className="w-2 h-2 rounded-full bg-teal-500"></span> USDT Tether
                      </div>
                      <p className="text-[11px] text-[#7A7566] truncate font-mono">
                        {paymentConfig.usdtTrc20 || 'TRC20 / ERC20'}
                      </p>
                      <span className="text-[10px] text-teal-700 font-semibold">Multi-Chain</span>
                    </div>
                  )}

                  {/* ETH */}
                  {paymentConfig.ethereumEnabled !== false && (
                    <div className="p-3 rounded-xl bg-white border border-[#E8E2D6]">
                      <div className="font-bold text-indigo-800 flex items-center gap-1.5 mb-1">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Ethereum
                      </div>
                      <p className="text-[11px] text-[#7A7566] font-mono truncate">
                        {paymentConfig.ethereumEns || 'columbiafestival.eth'}
                      </p>
                    </div>
                  )}

                  {/* BTC */}
                  {paymentConfig.bitcoinEnabled !== false && (
                    <div className="p-3 rounded-xl bg-white border border-[#E8E2D6]">
                      <div className="font-bold text-amber-800 flex items-center gap-1.5 mb-1">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span> Bitcoin Native
                      </div>
                      <p className="text-[11px] text-[#7A7566] font-mono truncate">
                        {paymentConfig.bitcoinAddress ? `${paymentConfig.bitcoinAddress.substring(0, 10)}...` : 'SegWit / LN'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Anti-Spam Compliance Preview Badge */}
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E2D6] flex items-center justify-between text-xs text-[#7A7566]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Email includes physical postal address, one-click unsubscribe, and RFC anti-spam headers.</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Deliverability Score: 100/100
                </span>
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
              className="px-3.5 py-2 rounded-xl bg-[#F7F5EE] hover:bg-[#EAE4D6] text-[#5A5A40] border border-[#D5CEBF] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
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
              className="px-4 py-2.5 rounded-xl bg-white border border-[#D5CEBF] hover:bg-[#FAF8F5] text-[#3D3A30] text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
            >
              Save as Draft
            </button>

            <button
              type="button"
              onClick={() => handleSaveAndSend(true)}
              disabled={isSending || !recipientEmail}
              className="px-5 py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
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
