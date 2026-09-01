import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Coins, 
  Save, 
  Check, 
  Copy, 
  QrCode, 
  ShieldCheck, 
  ExternalLink, 
  Sparkles, 
  Building, 
  Smartphone, 
  RefreshCw, 
  HelpCircle,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { PaymentConfig } from '../../../types';
import QRCode from 'qrcode';

interface PaymentConfigTabProps {
  config: PaymentConfig;
  onSaveConfig: (config: PaymentConfig) => void;
}

export function PaymentConfigTab({ config, onSaveConfig }: PaymentConfigTabProps) {
  const [form, setForm] = useState<PaymentConfig>({ ...config });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [previewQrTitle, setPreviewQrTitle] = useState<string | null>(null);
  const [previewQrUrl, setPreviewQrUrl] = useState<string | null>(null);

  useEffect(() => {
    if (config) {
      setForm({ ...config });
    }
  }, [config]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSaveConfig({
      ...form,
      updatedAt: new Date().toISOString()
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleGenerateQr = async (title: string, value: string) => {
    if (!value) return;
    try {
      setPreviewQrTitle(title);
      const url = await QRCode.toDataURL(value, {
        width: 320,
        margin: 2,
        color: { dark: '#1e1e1e', light: '#ffffff' }
      });
      setPreviewQrUrl(url);
    } catch (e) {
      console.error('QR generation error:', e);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E2D6] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#5A5A40] text-white">
              <Coins className="w-4 h-4" />
            </span>
            <h2 className="font-bold text-lg text-[#3D3A30]">Payment Gateways & Crypto Addresses</h2>
          </div>
          <p className="text-xs text-[#7A7566]">
            Configure multi-chain cryptocurrency wallets (USDT, ETH, BTC), official sponsors (Kraken, CashApp), and traditional bank details embedded in vendor invoices.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
        >
          {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{saveSuccess ? 'Saved to Firestore!' : 'Save Payment Config'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Official Sponsor Gateways (Kraken & CashApp) */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E2D6] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D6]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <h3 className="font-bold text-sm text-[#3D3A30]">Official Festival Sponsors (Kraken & CashApp)</h3>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
              Verified Sponsor Rail
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* Kraken Section */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D6] space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-sm text-[#3D3A30] flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-purple-600"></span> Kraken Pay & Institutional Settlement
                </div>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.krakenSponsorBadgeEnabled}
                    onChange={(e) => setForm({ ...form, krakenSponsorBadgeEnabled: e.target.checked })}
                    className="rounded text-[#5A5A40] focus:ring-0"
                  />
                  <span className="text-[11px] font-semibold text-[#7A7566]">Display Badge</span>
                </label>
              </div>

              <div>
                <label className="block font-bold text-[#7A7566] mb-1">Kraken Pay ID / Business Account</label>
                <input
                  type="text"
                  placeholder="e.g. KRAKEN-COLUMBIA-FEST-882"
                  value={form.krakenPayId}
                  onChange={(e) => setForm({ ...form, krakenPayId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-white font-mono text-xs text-[#3D3A30]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#7A7566] mb-1">Kraken Direct Deposit Address (ETH/ERC20)</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="0x..."
                    value={form.krakenDepositAddress || ''}
                    onChange={(e) => setForm({ ...form, krakenDepositAddress: e.target.value })}
                    className="w-full px-3 py-2 pr-16 rounded-xl border border-[#E8E2D6] bg-white font-mono text-xs text-[#3D3A30]"
                  />
                  <button
                    type="button"
                    onClick={() => handleGenerateQr('Kraken Deposit Address', form.krakenDepositAddress || '')}
                    className="absolute right-1.5 top-1.5 px-2 py-1 bg-[#F7F5EE] hover:bg-[#EAE4D6] rounded-lg text-[10px] font-bold text-[#5A5A40]"
                  >
                    QR
                  </button>
                </div>
              </div>
            </div>

            {/* CashApp Section */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D6] space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-sm text-[#3D3A30] flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span> CashApp ($Cashtag & Mobile BTC)
                </div>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.cashAppEnabled}
                    onChange={(e) => setForm({ ...form, cashAppEnabled: e.target.checked })}
                    className="rounded text-[#5A5A40] focus:ring-0"
                  />
                  <span className="text-[11px] font-semibold text-[#7A7566]">Enable on Invoices</span>
                </label>
              </div>

              <div>
                <label className="block font-bold text-[#7A7566] mb-1">Official Festival $Cashtag</label>
                <input
                  type="text"
                  placeholder="e.g. $ColumbiaFestival"
                  value={form.cashAppCashtag}
                  onChange={(e) => setForm({ ...form, cashAppCashtag: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-white font-mono text-xs text-[#3D3A30] font-bold text-emerald-800"
                />
              </div>

              <div>
                <label className="block font-bold text-[#7A7566] mb-1">CashApp Bitcoin Receiving Address</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="bc1q..."
                    value={form.cashAppBtcAddress || ''}
                    onChange={(e) => setForm({ ...form, cashAppBtcAddress: e.target.value })}
                    className="w-full px-3 py-2 pr-16 rounded-xl border border-[#E8E2D6] bg-white font-mono text-xs text-[#3D3A30]"
                  />
                  <button
                    type="button"
                    onClick={() => handleGenerateQr('CashApp BTC Address', form.cashAppBtcAddress || '')}
                    className="absolute right-1.5 top-1.5 px-2 py-1 bg-[#F7F5EE] hover:bg-[#EAE4D6] rounded-lg text-[10px] font-bold text-[#5A5A40]"
                  >
                    QR
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* On-Chain Multi-Chain Wallets (USDT, ETH, BTC) */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E2D6] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D6]">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-[#5A5A40]" />
              <h3 className="font-bold text-sm text-[#3D3A30]">On-Chain Multi-Network Cryptocurrency Addresses</h3>
            </div>
            <span className="text-[10px] text-[#7A7566]">Supports TRC-20, ERC-20, Solana, Bitcoin SegWit & Lightning</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* USDT Section */}
            <div className="p-4 rounded-xl bg-[#FDFBF7] border border-[#E8E2D6] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-teal-800 uppercase tracking-wide flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span> USDT (Tether USD) Multi-Chain Receivers
                </span>
                <span className="text-[10px] text-[#7A7566]">Zero/Low Gas Alternatives</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#7A7566] mb-1">TRC-20 (Tron Network - Low Fee)</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="T..."
                      value={form.usdtTrc20}
                      onChange={(e) => setForm({ ...form, usdtTrc20: e.target.value })}
                      className="w-full px-3 py-2 pr-12 rounded-xl border border-[#E8E2D6] bg-white font-mono text-[11px] text-[#3D3A30]"
                    />
                    <button
                      type="button"
                      onClick={() => handleGenerateQr('USDT (TRC-20 Tron)', form.usdtTrc20)}
                      className="absolute right-1 top-1.5 px-2 py-0.5 bg-[#F7F5EE] hover:bg-[#EAE4D6] rounded text-[10px] font-bold text-[#5A5A40]"
                    >
                      QR
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#7A7566] mb-1">ERC-20 (Ethereum Mainnet)</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="0x..."
                      value={form.usdtErc20}
                      onChange={(e) => setForm({ ...form, usdtErc20: e.target.value })}
                      className="w-full px-3 py-2 pr-12 rounded-xl border border-[#E8E2D6] bg-white font-mono text-[11px] text-[#3D3A30]"
                    />
                    <button
                      type="button"
                      onClick={() => handleGenerateQr('USDT (ERC-20 Ethereum)', form.usdtErc20)}
                      className="absolute right-1 top-1.5 px-2 py-0.5 bg-[#F7F5EE] hover:bg-[#EAE4D6] rounded text-[10px] font-bold text-[#5A5A40]"
                    >
                      QR
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#7A7566] mb-1">Solana SPL (USDT Solana)</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Solana address..."
                      value={form.usdtSolana}
                      onChange={(e) => setForm({ ...form, usdtSolana: e.target.value })}
                      className="w-full px-3 py-2 pr-12 rounded-xl border border-[#E8E2D6] bg-white font-mono text-[11px] text-[#3D3A30]"
                    />
                    <button
                      type="button"
                      onClick={() => handleGenerateQr('USDT (Solana SPL)', form.usdtSolana)}
                      className="absolute right-1 top-1.5 px-2 py-0.5 bg-[#F7F5EE] hover:bg-[#EAE4D6] rounded text-[10px] font-bold text-[#5A5A40]"
                    >
                      QR
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ETH Section */}
            <div className="p-4 rounded-xl bg-[#FDFBF7] border border-[#E8E2D6] space-y-3">
              <span className="font-bold text-xs text-indigo-800 uppercase tracking-wide flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Ethereum Native & ENS Domain
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#7A7566] mb-1">Ethereum Deposit Address (0x...)</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="0x..."
                      value={form.ethereumAddress}
                      onChange={(e) => setForm({ ...form, ethereumAddress: e.target.value })}
                      className="w-full px-3 py-2 pr-16 rounded-xl border border-[#E8E2D6] bg-white font-mono text-[11px] text-[#3D3A30]"
                    />
                    <button
                      type="button"
                      onClick={() => handleGenerateQr('Ethereum Address', form.ethereumAddress)}
                      className="absolute right-1.5 top-1.5 px-2 py-1 bg-[#F7F5EE] hover:bg-[#EAE4D6] rounded-lg text-[10px] font-bold text-[#5A5A40]"
                    >
                      QR
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#7A7566] mb-1">Ethereum Name Service (ENS Domain)</label>
                  <input
                    type="text"
                    placeholder="e.g. columbiafestival.eth"
                    value={form.ethereumEns || ''}
                    onChange={(e) => setForm({ ...form, ethereumEns: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-white font-mono text-xs text-[#3D3A30]"
                  />
                </div>
              </div>
            </div>

            {/* Bitcoin Section */}
            <div className="p-4 rounded-xl bg-[#FDFBF7] border border-[#E8E2D6] space-y-3">
              <span className="font-bold text-xs text-amber-800 uppercase tracking-wide flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Bitcoin Native (SegWit & Lightning Network)
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#7A7566] mb-1">Bitcoin Native Address (SegWit bc1q... / Taproot)</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="bc1q..."
                      value={form.bitcoinAddress}
                      onChange={(e) => setForm({ ...form, bitcoinAddress: e.target.value })}
                      className="w-full px-3 py-2 pr-16 rounded-xl border border-[#E8E2D6] bg-white font-mono text-[11px] text-[#3D3A30]"
                    />
                    <button
                      type="button"
                      onClick={() => handleGenerateQr('Bitcoin Address', form.bitcoinAddress)}
                      className="absolute right-1.5 top-1.5 px-2 py-1 bg-[#F7F5EE] hover:bg-[#EAE4D6] rounded-lg text-[10px] font-bold text-[#5A5A40]"
                    >
                      QR
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#7A7566] mb-1">Bitcoin Lightning Address / LNURL</label>
                  <input
                    type="text"
                    placeholder="e.g. columbiafestival@strike.me or lnurl..."
                    value={form.bitcoinLightning || ''}
                    onChange={(e) => setForm({ ...form, bitcoinLightning: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-white font-mono text-xs text-[#3D3A30]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Traditional Rails & Wire Instructions */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E2D6] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E8E2D6]">
            <Building className="w-4 h-4 text-[#5A5A40]" />
            <h3 className="font-bold text-sm text-[#3D3A30]">Traditional Bank Wire, Routing & Zelle</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#7A7566] mb-1">Bank Name</label>
              <input
                type="text"
                placeholder="e.g. First Columbia Community Bank"
                value={form.bankName || ''}
                onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7] text-xs text-[#3D3A30]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#7A7566] mb-1">Account Holder Name</label>
              <input
                type="text"
                placeholder="e.g. Columbia Market Association LLC"
                value={form.bankAccountName || ''}
                onChange={(e) => setForm({ ...form, bankAccountName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7] text-xs text-[#3D3A30]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#7A7566] mb-1">Zelle Email / Phone Handle</label>
              <input
                type="text"
                placeholder="e.g. treasury@columbiamarket.org"
                value={form.zelleHandle || ''}
                onChange={(e) => setForm({ ...form, zelleHandle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7] text-xs text-[#3D3A30]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#7A7566] mb-1">Routing Number (ABA)</label>
              <input
                type="text"
                placeholder="9-digit routing"
                value={form.bankRoutingNumber || ''}
                onChange={(e) => setForm({ ...form, bankRoutingNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7] font-mono text-xs text-[#3D3A30]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#7A7566] mb-1">Account Number</label>
              <input
                type="text"
                placeholder="Account number"
                value={form.bankAccountNumber || ''}
                onChange={(e) => setForm({ ...form, bankAccountNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7] font-mono text-xs text-[#3D3A30]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#7A7566] mb-1">SWIFT / BIC (International)</label>
              <input
                type="text"
                placeholder="e.g. FCBKUS33"
                value={form.bankSwiftBic || ''}
                onChange={(e) => setForm({ ...form, bankSwiftBic: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7] font-mono text-xs text-[#3D3A30]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#7A7566] mb-1 text-xs">Payment Instructions & Terms (Appears on Invoices)</label>
            <textarea
              rows={3}
              value={form.paymentInstructions || ''}
              onChange={(e) => setForm({ ...form, paymentInstructions: e.target.value })}
              className="w-full p-3 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7] text-xs text-[#3D3A30]"
            />
          </div>
        </div>
      </form>

      {/* QR Code Popup Modal */}
      {previewQrUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-[#E8E2D6] text-center animate-in fade-in zoom-in-95">
            <div>
              <h4 className="font-bold text-base text-[#3D3A30]">{previewQrTitle}</h4>
              <p className="text-xs text-[#7A7566] mt-0.5">Scannable Address for Instant Checkout</p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#E8E2D6] inline-block shadow-inner">
              <img src={previewQrUrl} alt="Deposit QR Code" className="w-52 h-52 mx-auto" />
            </div>

            <button
              type="button"
              onClick={() => { setPreviewQrUrl(null); setPreviewQrTitle(null); }}
              className="w-full py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold transition-colors"
            >
              Close QR Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
