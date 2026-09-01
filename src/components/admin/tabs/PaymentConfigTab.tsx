import React, { useState, useEffect } from 'react';
import { 
  Coins, 
  Save, 
  Check, 
  QrCode, 
  Sparkles, 
  Building, 
  Smartphone, 
  Eye,
  EyeOff,
  Sliders,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { PaymentConfig } from '../../../types';
import QRCode from 'qrcode';

interface PaymentConfigTabProps {
  config: PaymentConfig;
  onSaveConfig: (config: PaymentConfig) => void;
}

export function PaymentConfigTab({ config, onSaveConfig }: PaymentConfigTabProps) {
  const [form, setForm] = useState<PaymentConfig>({
    ...config,
    usdtEnabled: config.usdtEnabled !== false,
    ethereumEnabled: config.ethereumEnabled !== false,
    bitcoinEnabled: config.bitcoinEnabled !== false,
    cashAppEnabled: config.cashAppEnabled !== false,
    krakenPayEnabled: config.krakenPayEnabled !== false,
    bankTransferEnabled: config.bankTransferEnabled !== false
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [previewQrTitle, setPreviewQrTitle] = useState<string | null>(null);
  const [previewQrUrl, setPreviewQrUrl] = useState<string | null>(null);

  useEffect(() => {
    if (config) {
      setForm({
        ...config,
        usdtEnabled: config.usdtEnabled !== false,
        ethereumEnabled: config.ethereumEnabled !== false,
        bitcoinEnabled: config.bitcoinEnabled !== false,
        cashAppEnabled: config.cashAppEnabled !== false,
        krakenPayEnabled: config.krakenPayEnabled !== false,
        bankTransferEnabled: config.bankTransferEnabled !== false
      });
    }
  }, [config]);

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

  const activeMethodsCount = [
    form.usdtEnabled !== false,
    form.ethereumEnabled !== false,
    form.bitcoinEnabled !== false,
    form.cashAppEnabled !== false,
    form.krakenPayEnabled !== false,
    form.bankTransferEnabled !== false
  ].filter(Boolean).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E2D6] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#5A5A40] text-white">
              <Coins className="w-4 h-4" />
            </span>
            <h2 className="font-bold text-lg text-[#3D3A30]">Payment Gateways & Method Visibility</h2>
          </div>
          <p className="text-xs text-[#7A7566]">
            Configure multi-chain cryptocurrency wallets (USDT, ETH, BTC), official sponsors (Kraken, CashApp), and traditional bank details. Toggle any method ON or OFF to show or hide it from vendor invoices and checkout.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{saveSuccess ? 'Saved to Firestore!' : 'Save Payment Config'}</span>
        </button>
      </div>

      {/* Quick Visibility Switchboard */}
      <div className="bg-[#FAF8F5] p-4 sm:p-5 rounded-2xl border border-[#E8E2D6] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#5A5A40]" />
            <h3 className="font-bold text-xs sm:text-sm text-[#3D3A30]">
              Active Invoice Payment Methods ({activeMethodsCount}/6 Enabled)
            </h3>
          </div>
          <span className="text-[11px] text-[#7A7566]">
            Disabled payment methods are instantly hidden from checkout and invoice emails.
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 pt-1">
          {/* Bank Transfer Toggle */}
          <button
            type="button"
            onClick={() => setForm({ ...form, bankTransferEnabled: !form.bankTransferEnabled })}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              form.bankTransferEnabled !== false
                ? 'bg-white border-emerald-300 shadow-xs'
                : 'bg-[#F2EFE9] border-gray-300 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Building className="w-3.5 h-3.5 text-[#5A5A40]" />
              {form.bankTransferEnabled !== false ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-gray-400"></span>
              )}
            </div>
            <div>
              <div className="font-bold text-[11px] text-[#3D3A30]">Bank Wire / Zelle</div>
              <div className="text-[10px] font-semibold mt-0.5 text-[#7A7566]">
                {form.bankTransferEnabled !== false ? '✓ Enabled' : '✕ Disabled'}
              </div>
            </div>
          </button>

          {/* CashApp Toggle */}
          <button
            type="button"
            onClick={() => setForm({ ...form, cashAppEnabled: !form.cashAppEnabled })}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              form.cashAppEnabled !== false
                ? 'bg-white border-emerald-300 shadow-xs'
                : 'bg-[#F2EFE9] border-gray-300 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              {form.cashAppEnabled !== false ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-gray-400"></span>
              )}
            </div>
            <div>
              <div className="font-bold text-[11px] text-[#3D3A30]">CashApp $Cashtag</div>
              <div className="text-[10px] font-semibold mt-0.5 text-[#7A7566]">
                {form.cashAppEnabled !== false ? '✓ Enabled' : '✕ Disabled'}
              </div>
            </div>
          </button>

          {/* Kraken Toggle */}
          <button
            type="button"
            onClick={() => setForm({ ...form, krakenPayEnabled: !form.krakenPayEnabled })}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              form.krakenPayEnabled !== false
                ? 'bg-white border-purple-300 shadow-xs'
                : 'bg-[#F2EFE9] border-gray-300 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              {form.krakenPayEnabled !== false ? (
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-gray-400"></span>
              )}
            </div>
            <div>
              <div className="font-bold text-[11px] text-[#3D3A30]">Kraken Pay</div>
              <div className="text-[10px] font-semibold mt-0.5 text-[#7A7566]">
                {form.krakenPayEnabled !== false ? '✓ Enabled' : '✕ Disabled'}
              </div>
            </div>
          </button>

          {/* USDT Toggle */}
          <button
            type="button"
            onClick={() => setForm({ ...form, usdtEnabled: !form.usdtEnabled })}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              form.usdtEnabled !== false
                ? 'bg-white border-teal-300 shadow-xs'
                : 'bg-[#F2EFE9] border-gray-300 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Coins className="w-3.5 h-3.5 text-teal-600" />
              {form.usdtEnabled !== false ? (
                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-gray-400"></span>
              )}
            </div>
            <div>
              <div className="font-bold text-[11px] text-[#3D3A30]">USDT Tether</div>
              <div className="text-[10px] font-semibold mt-0.5 text-[#7A7566]">
                {form.usdtEnabled !== false ? '✓ Enabled' : '✕ Disabled'}
              </div>
            </div>
          </button>

          {/* Ethereum Toggle */}
          <button
            type="button"
            onClick={() => setForm({ ...form, ethereumEnabled: !form.ethereumEnabled })}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              form.ethereumEnabled !== false
                ? 'bg-white border-indigo-300 shadow-xs'
                : 'bg-[#F2EFE9] border-gray-300 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Coins className="w-3.5 h-3.5 text-indigo-600" />
              {form.ethereumEnabled !== false ? (
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-gray-400"></span>
              )}
            </div>
            <div>
              <div className="font-bold text-[11px] text-[#3D3A30]">Ethereum / ENS</div>
              <div className="text-[10px] font-semibold mt-0.5 text-[#7A7566]">
                {form.ethereumEnabled !== false ? '✓ Enabled' : '✕ Disabled'}
              </div>
            </div>
          </button>

          {/* Bitcoin Toggle */}
          <button
            type="button"
            onClick={() => setForm({ ...form, bitcoinEnabled: !form.bitcoinEnabled })}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              form.bitcoinEnabled !== false
                ? 'bg-white border-amber-300 shadow-xs'
                : 'bg-[#F2EFE9] border-gray-300 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Coins className="w-3.5 h-3.5 text-amber-600" />
              {form.bitcoinEnabled !== false ? (
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-gray-400"></span>
              )}
            </div>
            <div>
              <div className="font-bold text-[11px] text-[#3D3A30]">Bitcoin / LN</div>
              <div className="text-[10px] font-semibold mt-0.5 text-[#7A7566]">
                {form.bitcoinEnabled !== false ? '✓ Enabled' : '✕ Disabled'}
              </div>
            </div>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Traditional Rails & Bank Wire Section */}
        <div className={`bg-white p-5 sm:p-6 rounded-2xl border transition-all shadow-xs space-y-4 ${
          form.bankTransferEnabled !== false ? 'border-[#E8E2D6]' : 'border-gray-200 opacity-80'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D6]">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-[#5A5A40]" />
              <h3 className="font-bold text-sm text-[#3D3A30]">Traditional Bank Wire, Routing & Zelle</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, bankTransferEnabled: !form.bankTransferEnabled })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  form.bankTransferEnabled !== false
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}
              >
                {form.bankTransferEnabled !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{form.bankTransferEnabled !== false ? 'Visible on Invoices' : 'Hidden from Invoices'}</span>
              </button>
            </div>
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
            <label className="block font-bold text-[#7A7566] mb-1 text-xs">Payment Instructions & Memo Guidelines (Appears on Invoices)</label>
            <textarea
              rows={2}
              value={form.paymentInstructions || ''}
              onChange={(e) => setForm({ ...form, paymentInstructions: e.target.value })}
              className="w-full p-3 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7] text-xs text-[#3D3A30]"
            />
          </div>
        </div>

        {/* Official Sponsor Gateways (Kraken & CashApp) */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E2D6] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D6]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <h3 className="font-bold text-sm text-[#3D3A30]">Sponsor Rails (Kraken & CashApp)</h3>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
              Direct Vendor Channels
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* Kraken Section */}
            <div className={`p-4 rounded-xl border space-y-3 transition-all ${
              form.krakenPayEnabled !== false ? 'bg-[#FAF8F5] border-[#E8E2D6]' : 'bg-[#F2EFE9] border-gray-200 opacity-70'
            }`}>
              <div className="flex items-center justify-between">
                <div className="font-bold text-sm text-[#3D3A30] flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-purple-600"></span> Kraken Pay & Settlement
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, krakenPayEnabled: !form.krakenPayEnabled })}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer ${
                      form.krakenPayEnabled !== false
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {form.krakenPayEnabled !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{form.krakenPayEnabled !== false ? 'Enabled' : 'Disabled'}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#7A7566] mb-1">Kraken Pay ID / Business Account</label>
                <input
                  type="text"
                  placeholder="e.g. KRAKEN-COLUMBIA-FEST-882"
                  value={form.krakenPayId || ''}
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
                    className="absolute right-1.5 top-1.5 px-2 py-1 bg-[#F7F5EE] hover:bg-[#EAE4D6] rounded-lg text-[10px] font-bold text-[#5A5A40] cursor-pointer"
                  >
                    QR
                  </button>
                </div>
              </div>
            </div>

            {/* CashApp Section */}
            <div className={`p-4 rounded-xl border space-y-3 transition-all ${
              form.cashAppEnabled !== false ? 'bg-[#FAF8F5] border-[#E8E2D6]' : 'bg-[#F2EFE9] border-gray-200 opacity-70'
            }`}>
              <div className="flex items-center justify-between">
                <div className="font-bold text-sm text-[#3D3A30] flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span> CashApp ($Cashtag & BTC)
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, cashAppEnabled: !form.cashAppEnabled })}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer ${
                      form.cashAppEnabled !== false
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {form.cashAppEnabled !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{form.cashAppEnabled !== false ? 'Enabled' : 'Disabled'}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#7A7566] mb-1">Official Festival $Cashtag</label>
                <input
                  type="text"
                  placeholder="e.g. $ColumbiaFestival"
                  value={form.cashAppCashtag || ''}
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
                    className="absolute right-1.5 top-1.5 px-2 py-1 bg-[#F7F5EE] hover:bg-[#EAE4D6] rounded-lg text-[10px] font-bold text-[#5A5A40] cursor-pointer"
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
            <span className="text-[10px] text-[#7A7566]">TRC-20, ERC-20, Solana, Ethereum Mainnet & Bitcoin</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* USDT Section */}
            <div className={`p-4 rounded-xl border space-y-3 transition-all ${
              form.usdtEnabled !== false ? 'bg-[#FDFBF7] border-[#E8E2D6]' : 'bg-[#F2EFE9] border-gray-200 opacity-70'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-teal-800 uppercase tracking-wide flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span> USDT (Tether USD) Multi-Chain Receivers
                </span>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, usdtEnabled: !form.usdtEnabled })}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer ${
                    form.usdtEnabled !== false
                      ? 'bg-teal-100 text-teal-800'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {form.usdtEnabled !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  <span>{form.usdtEnabled !== false ? 'USDT Enabled' : 'USDT Disabled'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#7A7566] mb-1">TRC-20 (Tron Network - Low Fee)</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="T..."
                      value={form.usdtTrc20 || ''}
                      onChange={(e) => setForm({ ...form, usdtTrc20: e.target.value })}
                      className="w-full px-3 py-2 pr-12 rounded-xl border border-[#E8E2D6] bg-white font-mono text-[11px] text-[#3D3A30]"
                    />
                    <button
                      type="button"
                      onClick={() => handleGenerateQr('USDT (TRC-20 Tron)', form.usdtTrc20)}
                      className="absolute right-1 top-1.5 px-2 py-0.5 bg-[#F7F5EE] hover:bg-[#EAE4D6] rounded text-[10px] font-bold text-[#5A5A40] cursor-pointer"
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
                      value={form.usdtErc20 || ''}
                      onChange={(e) => setForm({ ...form, usdtErc20: e.target.value })}
                      className="w-full px-3 py-2 pr-12 rounded-xl border border-[#E8E2D6] bg-white font-mono text-[11px] text-[#3D3A30]"
                    />
                    <button
                      type="button"
                      onClick={() => handleGenerateQr('USDT (ERC-20 Ethereum)', form.usdtErc20)}
                      className="absolute right-1 top-1.5 px-2 py-0.5 bg-[#F7F5EE] hover:bg-[#EAE4D6] rounded text-[10px] font-bold text-[#5A5A40] cursor-pointer"
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
                      value={form.usdtSolana || ''}
                      onChange={(e) => setForm({ ...form, usdtSolana: e.target.value })}
                      className="w-full px-3 py-2 pr-12 rounded-xl border border-[#E8E2D6] bg-white font-mono text-[11px] text-[#3D3A30]"
                    />
                    <button
                      type="button"
                      onClick={() => handleGenerateQr('USDT (Solana SPL)', form.usdtSolana)}
                      className="absolute right-1 top-1.5 px-2 py-0.5 bg-[#F7F5EE] hover:bg-[#EAE4D6] rounded text-[10px] font-bold text-[#5A5A40] cursor-pointer"
                    >
                      QR
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ETH Section */}
            <div className={`p-4 rounded-xl border space-y-3 transition-all ${
              form.ethereumEnabled !== false ? 'bg-[#FDFBF7] border-[#E8E2D6]' : 'bg-[#F2EFE9] border-gray-200 opacity-70'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-indigo-800 uppercase tracking-wide flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Ethereum Native & ENS Domain
                </span>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, ethereumEnabled: !form.ethereumEnabled })}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer ${
                    form.ethereumEnabled !== false
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {form.ethereumEnabled !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  <span>{form.ethereumEnabled !== false ? 'ETH Enabled' : 'ETH Disabled'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#7A7566] mb-1">Ethereum Deposit Address (0x...)</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="0x..."
                      value={form.ethereumAddress || ''}
                      onChange={(e) => setForm({ ...form, ethereumAddress: e.target.value })}
                      className="w-full px-3 py-2 pr-16 rounded-xl border border-[#E8E2D6] bg-white font-mono text-[11px] text-[#3D3A30]"
                    />
                    <button
                      type="button"
                      onClick={() => handleGenerateQr('Ethereum Address', form.ethereumAddress)}
                      className="absolute right-1.5 top-1.5 px-2 py-1 bg-[#F7F5EE] hover:bg-[#EAE4D6] rounded-lg text-[10px] font-bold text-[#5A5A40] cursor-pointer"
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
            <div className={`p-4 rounded-xl border space-y-3 transition-all ${
              form.bitcoinEnabled !== false ? 'bg-[#FDFBF7] border-[#E8E2D6]' : 'bg-[#F2EFE9] border-gray-200 opacity-70'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-amber-800 uppercase tracking-wide flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> Bitcoin Native (SegWit & Lightning)
                </span>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, bitcoinEnabled: !form.bitcoinEnabled })}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer ${
                    form.bitcoinEnabled !== false
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {form.bitcoinEnabled !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  <span>{form.bitcoinEnabled !== false ? 'BTC Enabled' : 'BTC Disabled'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#7A7566] mb-1">Bitcoin Native Address (SegWit bc1q...)</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="bc1q..."
                      value={form.bitcoinAddress || ''}
                      onChange={(e) => setForm({ ...form, bitcoinAddress: e.target.value })}
                      className="w-full px-3 py-2 pr-16 rounded-xl border border-[#E8E2D6] bg-white font-mono text-[11px] text-[#3D3A30]"
                    />
                    <button
                      type="button"
                      onClick={() => handleGenerateQr('Bitcoin Address', form.bitcoinAddress)}
                      className="absolute right-1.5 top-1.5 px-2 py-1 bg-[#F7F5EE] hover:bg-[#EAE4D6] rounded-lg text-[10px] font-bold text-[#5A5A40] cursor-pointer"
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
              className="w-full py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Close QR Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
