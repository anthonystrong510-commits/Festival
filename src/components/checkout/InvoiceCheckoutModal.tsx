import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  Coins, 
  QrCode, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Printer, 
  X, 
  Send, 
  Building, 
  Smartphone, 
  ArrowRight,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { Invoice, PaymentConfig, InvoicePaymentSubmission, PaymentMethodsEnabled } from '../../types';
import { submitInvoicePaymentProof, getPaymentConfig, DEFAULT_PAYMENT_CONFIG } from '../../lib/firebase';
import QRCode from 'qrcode';

interface InvoiceCheckoutModalProps {
  invoice: Invoice;
  onClose: () => void;
  onPaymentSubmitted?: () => void;
}

export function InvoiceCheckoutModal({ invoice, onClose, onPaymentSubmitted }: InvoiceCheckoutModalProps) {
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>(DEFAULT_PAYMENT_CONFIG);
  const [activeMethod, setActiveMethod] = useState<'usdt' | 'eth' | 'btc' | 'cashapp' | 'kraken' | 'bank'>('usdt');
  const [usdtNetwork, setUsdtNetwork] = useState<'trc20' | 'erc20' | 'solana'>('trc20');
  
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  
  // Payment proof form
  const [txHash, setTxHash] = useState('');
  const [payerHandle, setPayerHandle] = useState('');
  const [proofNote, setProofNote] = useState('');
  const [isSubmittingProof, setIsSubmittingProof] = useState(false);
  const [proofSuccess, setProofSuccess] = useState(false);

  // Load active payment configuration
  useEffect(() => {
    let isMounted = true;
    getPaymentConfig().then(cfg => {
      if (isMounted && cfg) {
        setPaymentConfig(cfg);
      }
    }).catch(err => console.warn('Could not fetch latest payment config:', err));
    return () => { isMounted = false; };
  }, []);

  // Compute method visibility from invoice flags or global paymentConfig
  const methodsEnabled: PaymentMethodsEnabled = {
    usdt: invoice.paymentMethodsEnabled?.usdt !== undefined ? invoice.paymentMethodsEnabled.usdt : (paymentConfig.usdtEnabled !== false),
    ethereum: invoice.paymentMethodsEnabled?.ethereum !== undefined ? invoice.paymentMethodsEnabled.ethereum : (paymentConfig.ethereumEnabled !== false),
    bitcoin: invoice.paymentMethodsEnabled?.bitcoin !== undefined ? invoice.paymentMethodsEnabled.bitcoin : (paymentConfig.bitcoinEnabled !== false),
    cashApp: invoice.paymentMethodsEnabled?.cashApp !== undefined ? invoice.paymentMethodsEnabled.cashApp : (paymentConfig.cashAppEnabled !== false),
    krakenPay: invoice.paymentMethodsEnabled?.krakenPay !== undefined ? invoice.paymentMethodsEnabled.krakenPay : (paymentConfig.krakenPayEnabled !== false),
    bankTransfer: invoice.paymentMethodsEnabled?.bankTransfer !== undefined ? invoice.paymentMethodsEnabled.bankTransfer : (paymentConfig.bankTransferEnabled !== false)
  };

  // Ensure the active method is actually enabled
  useEffect(() => {
    const isCurrentActive = 
      (activeMethod === 'usdt' && methodsEnabled.usdt) ||
      (activeMethod === 'eth' && methodsEnabled.ethereum) ||
      (activeMethod === 'btc' && methodsEnabled.bitcoin) ||
      (activeMethod === 'cashapp' && methodsEnabled.cashApp) ||
      (activeMethod === 'kraken' && methodsEnabled.krakenPay) ||
      (activeMethod === 'bank' && methodsEnabled.bankTransfer);

    if (!isCurrentActive) {
      if (methodsEnabled.usdt) setActiveMethod('usdt');
      else if (methodsEnabled.bankTransfer) setActiveMethod('bank');
      else if (methodsEnabled.cashApp) setActiveMethod('cashapp');
      else if (methodsEnabled.krakenPay) setActiveMethod('kraken');
      else if (methodsEnabled.ethereum) setActiveMethod('eth');
      else if (methodsEnabled.bitcoin) setActiveMethod('btc');
    }
  }, [methodsEnabled, activeMethod]);

  // Addresses from invoice or config fallback
  const crypto = invoice.cryptoAddresses || {};
  const usdtAddress = usdtNetwork === 'trc20' 
    ? (crypto.usdtTrc20 || paymentConfig.usdtTrc20 || 'TQ9w5fGq8F3D1Xv9Rz5L2P8m7K4v9W2p1L')
    : usdtNetwork === 'erc20'
    ? (crypto.usdtErc20 || paymentConfig.usdtErc20 || '0x71C8366420A0926793fe1fcC713be5375B09B035')
    : (crypto.usdtSolana || paymentConfig.usdtSolana || '7XwK8f9Rz5L2P8m7K4v9W2p1L8F3D1Xv9Rz5L2P8m7K4');

  const ethAddress = crypto.ethereumAddress || paymentConfig.ethereumAddress || '0x71C8366420A0926793fe1fcC713be5375B09B035';
  const ethEns = crypto.ethereumEns || paymentConfig.ethereumEns || 'columbiafestival.eth';
  const btcAddress = crypto.bitcoinAddress || paymentConfig.bitcoinAddress || 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';
  const btcLn = crypto.bitcoinLightning || paymentConfig.bitcoinLightning || 'columbiafestival@strike.me';
  const cashAppTag = crypto.cashAppCashtag || paymentConfig.cashAppCashtag || '$ColumbiaFestival';
  const cashAppBtc = crypto.cashAppBtcAddress || paymentConfig.cashAppBtcAddress;
  const krakenId = crypto.krakenPayId || paymentConfig.krakenPayId || 'KRAKEN-COLUMBIA-FEST-882';
  const krakenDeposit = crypto.krakenDepositAddress || paymentConfig.krakenDepositAddress;

  const bankName = invoice.bankDetails?.bankName || paymentConfig.bankName || 'First Columbia Community Bank';
  const bankAccountName = invoice.bankDetails?.bankAccountName || paymentConfig.bankAccountName || 'Columbia Market Association LLC';
  const bankAccountNumber = invoice.bankDetails?.bankAccountNumber || paymentConfig.bankAccountNumber || '••••••••4892';
  const bankRoutingNumber = invoice.bankDetails?.bankRoutingNumber || paymentConfig.bankRoutingNumber || '121000358';
  const bankSwiftBic = invoice.bankDetails?.bankSwiftBic || paymentConfig.bankSwiftBic || 'FCBKUS33';
  const zelleHandle = invoice.bankDetails?.zelleHandle || paymentConfig.zelleHandle || 'treasury@columbiamarket.org';
  const paymentInstructions = invoice.bankDetails?.paymentInstructions || paymentConfig.paymentInstructions || 'Please include your Invoice # in the transaction memo or note.';

  // Get active address for QR code
  const currentAddressToDisplay = () => {
    switch (activeMethod) {
      case 'usdt': return usdtAddress;
      case 'eth': return ethAddress;
      case 'btc': return btcAddress;
      case 'cashapp': return cashAppBtc || btcAddress;
      case 'kraken': return krakenDeposit || ethAddress;
      default: return '';
    }
  };

  useEffect(() => {
    const address = currentAddressToDisplay();
    if (address && activeMethod !== 'bank') {
      QRCode.toDataURL(address, {
        width: 320,
        margin: 2,
        color: { dark: '#222222', light: '#ffffff' }
      })
        .then(url => setQrCodeUrl(url))
        .catch(err => console.error('QR generation failed:', err));
    }
  }, [activeMethod, usdtNetwork, invoice, paymentConfig]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txHash && !payerHandle) return;

    setIsSubmittingProof(true);
    try {
      const submission: InvoicePaymentSubmission = {
        method: activeMethod === 'usdt' ? `usdt_${usdtNetwork}` as any : activeMethod as any,
        txHash: txHash.trim(),
        payerWalletOrHandle: payerHandle.trim(),
        network: activeMethod === 'usdt' ? usdtNetwork.toUpperCase() : activeMethod.toUpperCase(),
        paidAmount: invoice.totalAmount,
        paidCurrency: 'USD',
        submittedAt: new Date().toISOString(),
        proofNote: proofNote.trim()
      };

      await submitInvoicePaymentProof(invoice.id, submission);
      setProofSuccess(true);
      if (onPaymentSubmitted) {
        onPaymentSubmitted();
      }
    } catch (err) {
      console.error('Error submitting payment proof:', err);
    } finally {
      setIsSubmittingProof(false);
    }
  };

  const isPaid = invoice.status === 'paid';
  const isUnderReview = invoice.status === 'under_review' || proofSuccess;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FAF8F5] rounded-3xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-[#E8E2D6] animate-in fade-in zoom-in-95 my-auto overflow-hidden">
        
        {/* Checkout Header */}
        <div className="bg-[#5A5A40] text-white p-5 sm:p-7 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-white/20 text-white">
                Official Festival Payment Gateway
              </span>
              {isPaid ? (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-400 text-emerald-950 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> PAID & CONFIRMED
                </span>
              ) : isUnderReview ? (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-300 text-amber-950 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> PAYMENT UNDER REVIEW
                </span>
              ) : (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/15 text-white/90">
                  DUE UPON RECEIPT
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Checkout for Invoice {invoice.invoiceNumber}
            </h1>
            <p className="text-xs text-white/80">
              Columbia Community Vendor Marketplace • {invoice.recipientBusinessName}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Checkout Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-7 space-y-6">

          {/* Under Review Notice Banner */}
          {isUnderReview && !isPaid && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-3 shadow-xs">
              <Clock className="w-5 h-5 text-amber-700 mt-0.5 shrink-0" />
              <div className="text-xs space-y-0.5">
                <div className="font-bold text-sm">Payment Confirmation Submitted!</div>
                <p>
                  Thank you! Your transaction hash / proof has been logged for admin verification. Your space reservation is locked and a confirmation receipt will be updated shortly.
                </p>
              </div>
            </div>
          )}

          {/* Top Summary: Billed To & Total Due */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-[#E8E2D6] md:col-span-2 space-y-1 text-xs">
              <span className="text-[10px] font-bold text-[#7A7566] uppercase tracking-wider">Invoice Details</span>
              <div className="font-bold text-base text-[#3D3A30]">{invoice.recipientBusinessName}</div>
              <div className="text-[#5A5A40] font-medium">Attn: {invoice.recipientContactName} ({invoice.recipientEmail})</div>
              <div className="text-[#7A7566] pt-1">
                Due Date: <span className="font-bold text-[#3D3A30]">{invoice.dueDate}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#5A5A40] to-[#3E3E28] text-white flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">Total Amount Due</span>
                <div className="text-2xl sm:text-3xl font-extrabold mt-0.5">
                  ${Number(invoice.totalAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <span className="text-[11px] text-white/80 font-medium mt-2">
                USD or Equivalent Crypto
              </span>
            </div>
          </div>

          {/* Line Items Summary */}
          <div className="bg-white rounded-2xl border border-[#E8E2D6] p-4 sm:p-5">
            <h3 className="font-bold text-xs text-[#3D3A30] uppercase tracking-wider mb-3">Itemized Space Charges</h3>
            <div className="divide-y divide-[#F0EBE0] text-xs">
              {invoice.items.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-[#3D3A30]">{item.description}</span>
                    <span className="text-[#7A7566] ml-2 font-mono">x{item.quantity}</span>
                  </div>
                  <div className="font-bold text-[#3D3A30]">
                    ${Number(item.total).toFixed(2)}
                  </div>
                </div>
              ))}
              <div className="pt-3 flex items-center justify-between font-bold text-sm text-[#3D3A30]">
                <span>Total Balance:</span>
                <span className="text-emerald-800 text-base">${Number(invoice.totalAmount).toFixed(2)} USD</span>
              </div>
            </div>
          </div>

          {/* Interactive Payment Gateway Selector */}
          {!isPaid && (
            <div className="bg-white rounded-2xl border border-[#E8E2D6] p-4 sm:p-6 space-y-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E8E2D6]">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-[#5A5A40]" />
                  <h3 className="font-bold text-sm text-[#3D3A30]">Select Payment Method</h3>
                </div>
                {methodsEnabled.krakenPay && (
                  <div className="flex items-center gap-1 text-[11px] font-bold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                    <Sparkles className="w-3.5 h-3.5" /> Sponsor Supported
                  </div>
                )}
              </div>

              {/* Payment Methods Tabs (Filtering out any method disabled by Admin) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {/* 1. Bank Wire */}
                {methodsEnabled.bankTransfer && (
                  <button
                    type="button"
                    onClick={() => setActiveMethod('bank')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                      activeMethod === 'bank'
                        ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-xs'
                        : 'bg-[#FAF8F5] text-[#3D3A30] border-[#E8E2D6] hover:bg-[#F0EBE0]'
                    }`}
                  >
                    <Building className="w-3.5 h-3.5 text-[#7A7566]" />
                    <span className="text-xs font-bold">Bank Wire</span>
                    <span className="text-[10px] opacity-80">Routing/Zelle</span>
                  </button>
                )}

                {/* 2. CashApp */}
                {methodsEnabled.cashApp && (
                  <button
                    type="button"
                    onClick={() => setActiveMethod('cashapp')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                      activeMethod === 'cashapp'
                        ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-xs'
                        : 'bg-[#FAF8F5] text-[#3D3A30] border-[#E8E2D6] hover:bg-[#F0EBE0]'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-xs font-bold">CashApp</span>
                    <span className="text-[10px] opacity-80">$Cashtag</span>
                  </button>
                )}

                {/* 3. Kraken */}
                {methodsEnabled.krakenPay && (
                  <button
                    type="button"
                    onClick={() => setActiveMethod('kraken')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                      activeMethod === 'kraken'
                        ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-xs'
                        : 'bg-[#FAF8F5] text-[#3D3A30] border-[#E8E2D6] hover:bg-[#F0EBE0]'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                    <span className="text-xs font-bold">Kraken</span>
                    <span className="text-[10px] opacity-80">Pay ID</span>
                  </button>
                )}

                {/* 4. USDT */}
                {methodsEnabled.usdt && (
                  <button
                    type="button"
                    onClick={() => setActiveMethod('usdt')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                      activeMethod === 'usdt'
                        ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-xs'
                        : 'bg-[#FAF8F5] text-[#3D3A30] border-[#E8E2D6] hover:bg-[#F0EBE0]'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-teal-400"></span>
                    <span className="text-xs font-bold">USDT Tether</span>
                    <span className="text-[10px] opacity-80">Multi-Chain</span>
                  </button>
                )}

                {/* 5. ETH */}
                {methodsEnabled.ethereum && (
                  <button
                    type="button"
                    onClick={() => setActiveMethod('eth')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                      activeMethod === 'eth'
                        ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-xs'
                        : 'bg-[#FAF8F5] text-[#3D3A30] border-[#E8E2D6] hover:bg-[#F0EBE0]'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-indigo-400"></span>
                    <span className="text-xs font-bold">Ethereum</span>
                    <span className="text-[10px] opacity-80">ETH & ENS</span>
                  </button>
                )}

                {/* 6. BTC */}
                {methodsEnabled.bitcoin && (
                  <button
                    type="button"
                    onClick={() => setActiveMethod('btc')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                      activeMethod === 'btc'
                        ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-xs'
                        : 'bg-[#FAF8F5] text-[#3D3A30] border-[#E8E2D6] hover:bg-[#F0EBE0]'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                    <span className="text-xs font-bold">Bitcoin</span>
                    <span className="text-[10px] opacity-80">SegWit/Taproot</span>
                  </button>
                )}
              </div>

              {/* Method Details Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D6]">
                {/* 1. USDT */}
                {activeMethod === 'usdt' && methodsEnabled.usdt && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#3D3A30]">Select USDT Network:</span>
                        <div className="flex p-0.5 bg-white rounded-lg border border-[#E8E2D6]">
                          <button
                            type="button"
                            onClick={() => setUsdtNetwork('trc20')}
                            className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors cursor-pointer ${usdtNetwork === 'trc20' ? 'bg-[#5A5A40] text-white' : 'text-[#7A7566]'}`}
                          >
                            TRC-20 (Tron)
                          </button>
                          <button
                            type="button"
                            onClick={() => setUsdtNetwork('erc20')}
                            className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors cursor-pointer ${usdtNetwork === 'erc20' ? 'bg-[#5A5A40] text-white' : 'text-[#7A7566]'}`}
                          >
                            ERC-20 (ETH)
                          </button>
                          <button
                            type="button"
                            onClick={() => setUsdtNetwork('solana')}
                            className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors cursor-pointer ${usdtNetwork === 'solana' ? 'bg-[#5A5A40] text-white' : 'text-[#7A7566]'}`}
                          >
                            Solana SPL
                          </button>
                        </div>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-[#E8E2D6] space-y-1">
                        <span className="text-[10px] font-bold text-[#7A7566] uppercase">Deposit USDT Address:</span>
                        <div className="font-mono text-xs text-[#3D3A30] font-semibold break-all select-all">
                          {usdtAddress}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(usdtAddress, 'usdt')}
                          className="mt-2 w-full py-2 bg-[#F7F5EE] hover:bg-[#EAE4D6] text-[#5A5A40] text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          {copiedKey === 'usdt' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedKey === 'usdt' ? 'Copied Address!' : 'Copy USDT Address'}</span>
                        </button>
                      </div>

                      <div className="text-[11px] text-teal-800 bg-teal-50 p-2.5 rounded-lg border border-teal-200">
                        ⚡ Send exactly <strong>${invoice.totalAmount} USDT</strong> on the <strong>{usdtNetwork.toUpperCase()}</strong> network.
                      </div>
                    </div>

                    <div className="text-center p-3 bg-white rounded-xl border border-[#E8E2D6] inline-block mx-auto">
                      {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" className="w-44 h-44 mx-auto" />}
                      <span className="text-[10px] text-[#7A7566] font-bold mt-1 block">Scan with Crypto Wallet</span>
                    </div>
                  </div>
                )}

                {/* 2. ETH */}
                {activeMethod === 'eth' && methodsEnabled.ethereum && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="space-y-3">
                      <div className="p-3 bg-white rounded-xl border border-[#E8E2D6] space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-[#7A7566] uppercase">Ethereum Address:</span>
                          <span className="text-[11px] font-bold text-indigo-700">{ethEns}</span>
                        </div>
                        <div className="font-mono text-xs text-[#3D3A30] font-semibold break-all select-all">
                          {ethAddress}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(ethAddress, 'eth')}
                          className="mt-2 w-full py-2 bg-[#F7F5EE] hover:bg-[#EAE4D6] text-[#5A5A40] text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          {copiedKey === 'eth' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedKey === 'eth' ? 'Copied Address!' : 'Copy ETH Address'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="text-center p-3 bg-white rounded-xl border border-[#E8E2D6] inline-block mx-auto">
                      {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" className="w-44 h-44 mx-auto" />}
                      <span className="text-[10px] text-[#7A7566] font-bold mt-1 block">Scan with MetaMask / Web3</span>
                    </div>
                  </div>
                )}

                {/* 3. BTC */}
                {activeMethod === 'btc' && methodsEnabled.bitcoin && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="space-y-3">
                      <div className="p-3 bg-white rounded-xl border border-[#E8E2D6] space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-[#7A7566] uppercase">Bitcoin Address:</span>
                          {btcLn && <span className="text-[11px] font-bold text-amber-700">{btcLn}</span>}
                        </div>
                        <div className="font-mono text-xs text-[#3D3A30] font-semibold break-all select-all">
                          {btcAddress}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(btcAddress, 'btc')}
                          className="mt-2 w-full py-2 bg-[#F7F5EE] hover:bg-[#EAE4D6] text-[#5A5A40] text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          {copiedKey === 'btc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedKey === 'btc' ? 'Copied Address!' : 'Copy Bitcoin Address'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="text-center p-3 bg-white rounded-xl border border-[#E8E2D6] inline-block mx-auto">
                      {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" className="w-44 h-44 mx-auto" />}
                      <span className="text-[10px] text-[#7A7566] font-bold mt-1 block">Scan with Bitcoin Wallet</span>
                    </div>
                  </div>
                )}

                {/* 4. CashApp */}
                {activeMethod === 'cashapp' && methodsEnabled.cashApp && (
                  <div className="space-y-4">
                    <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-emerald-800">Official Festival Cashtag:</span>
                        <div className="text-xl font-extrabold text-emerald-950">{cashAppTag}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(cashAppTag, 'cashtag')}
                        className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-emerald-700 cursor-pointer"
                      >
                        {copiedKey === 'cashtag' ? 'Copied Cashtag!' : 'Copy Cashtag'}
                      </button>
                    </div>
                    <p className="text-xs text-[#7A7566]">
                      Open the CashApp mobile app, enter <strong>${invoice.totalAmount}</strong>, and send to <strong>{cashAppTag}</strong> with note <strong>{invoice.invoiceNumber}</strong>.
                    </p>
                  </div>
                )}

                {/* 5. Kraken */}
                {activeMethod === 'kraken' && methodsEnabled.krakenPay && (
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-50 border border-purple-300 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-purple-800">Kraken Official Pay ID:</span>
                        <div className="text-lg font-mono font-extrabold text-purple-950">{krakenId}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(krakenId, 'kraken')}
                        className="px-4 py-2 bg-purple-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-purple-700 cursor-pointer"
                      >
                        {copiedKey === 'kraken' ? 'Copied!' : 'Copy Pay ID'}
                      </button>
                    </div>
                    <p className="text-xs text-[#7A7566]">
                      Transfer between Kraken accounts instantly with zero fees using Pay ID.
                    </p>
                  </div>
                )}

                {/* 6. Bank Wire */}
                {activeMethod === 'bank' && methodsEnabled.bankTransfer && (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 bg-white rounded-xl border border-[#E8E2D6]">
                        <span className="text-[10px] font-bold text-[#7A7566] uppercase">Bank Name:</span>
                        <div className="font-bold text-[#3D3A30]">{bankName}</div>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-[#E8E2D6]">
                        <span className="text-[10px] font-bold text-[#7A7566] uppercase">Beneficiary:</span>
                        <div className="font-bold text-[#3D3A30]">{bankAccountName}</div>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-[#E8E2D6]">
                        <span className="text-[10px] font-bold text-[#7A7566] uppercase">Routing (ABA):</span>
                        <div className="font-mono font-bold text-[#3D3A30]">{bankRoutingNumber}</div>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-[#E8E2D6]">
                        <span className="text-[10px] font-bold text-[#7A7566] uppercase">Account #:</span>
                        <div className="font-mono font-bold text-[#3D3A30]">{bankAccountNumber}</div>
                      </div>
                      {bankSwiftBic && (
                        <div className="p-3 bg-white rounded-xl border border-[#E8E2D6]">
                          <span className="text-[10px] font-bold text-[#7A7566] uppercase">SWIFT / BIC:</span>
                          <div className="font-mono font-bold text-[#3D3A30]">{bankSwiftBic}</div>
                        </div>
                      )}
                      {zelleHandle && (
                        <div className="p-3 bg-white rounded-xl border border-[#E8E2D6]">
                          <span className="text-[10px] font-bold text-[#7A7566] uppercase">Zelle Handle:</span>
                          <div className="font-bold text-[#5A5A40]">{zelleHandle}</div>
                        </div>
                      )}
                    </div>
                    {paymentInstructions && (
                      <div className="p-2.5 bg-[#F7F5EE] rounded-lg text-[#7A7566] text-[11px]">
                        <strong>Memo / Instructions:</strong> {paymentInstructions} (Include <strong>{invoice.invoiceNumber}</strong>)
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Payment Confirmation Proof Form */}
              <form onSubmit={handleSubmitProof} className="p-5 rounded-2xl bg-white border-2 border-dashed border-[#5A5A40]/40 space-y-3">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-[#5A5A40]" />
                  <h4 className="font-bold text-xs text-[#3D3A30] uppercase tracking-wider">
                    Submit Payment Confirmation & Transaction Hash
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-[#7A7566] mb-1">
                      Transaction Hash (TxID) / Payment ID *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 0xabc... or Tron TxID / CashApp Tag"
                      value={txHash}
                      onChange={(e) => setTxHash(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FAF8F5] font-mono text-xs text-[#3D3A30]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#7A7566] mb-1">
                      Sender Wallet / Account Handle
                    </label>
                    <input
                      type="text"
                      placeholder="Your wallet address or cashtag"
                      value={payerHandle}
                      onChange={(e) => setPayerHandle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FAF8F5] text-xs text-[#3D3A30]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#7A7566] mb-1 text-xs">
                    Additional Notes or Confirmation Details
                  </label>
                  <input
                    type="text"
                    placeholder="Optional message or memo..."
                    value={proofNote}
                    onChange={(e) => setProofNote(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FAF8F5] text-xs text-[#3D3A30]"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmittingProof || !txHash}
                    className="px-6 py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <Send className={`w-4 h-4 ${isSubmittingProof ? 'animate-spin' : ''}`} />
                    <span>{isSubmittingProof ? 'Verifying...' : 'Confirm & Submit Payment Proof'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#E8E2D6] flex items-center justify-between text-xs text-[#7A7566]">
          <span>Need assistance? Contact <strong>{zelleHandle || 'treasury@columbiamarket.org'}</strong></span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#F7F5EE] hover:bg-[#EAE4D6] text-[#3D3A30] font-bold transition-colors cursor-pointer"
          >
            Close Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
