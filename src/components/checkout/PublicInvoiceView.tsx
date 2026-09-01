import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  FileText, 
  AlertCircle, 
  Loader2, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { Invoice } from '../../types';
import { getInvoiceById, createFallbackDemoInvoice } from '../../lib/firebase';
import { InvoiceCheckoutModal } from './InvoiceCheckoutModal';

interface PublicInvoiceViewProps {
  invoiceId: string;
  onExit: () => void;
}

export function PublicInvoiceView({ invoiceId, onExit }: PublicInvoiceViewProps) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchLoading, setSearchLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    getInvoiceById(invoiceId)
      .then((inv) => {
        if (!isMounted) return;
        if (inv) {
          setInvoice(inv);
          document.title = `Invoice ${inv.invoiceNumber} | Columbia Community Festival`;
        } else {
          setError(`We could not locate invoice "${invoiceId}". Please verify the invoice number or search below.`);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Invoice fetch error:', err);
        setError('An error occurred while loading this invoice. Please check your connection.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [invoiceId]);

  const handleManualSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    setError(null);
    try {
      const inv = await getInvoiceById(searchQuery.trim());
      if (inv) {
        setInvoice(inv);
        // Update URL to match searched invoice
        window.history.pushState({}, '', `/?invoice=${encodeURIComponent(inv.invoiceNumber || inv.id)}`);
        document.title = `Invoice ${inv.invoiceNumber} | Columbia Community Festival`;
      } else {
        setError(`No invoice found matching "${searchQuery}".`);
      }
    } catch (err: any) {
      setError('Search lookup failed. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleLoadDemo = () => {
    const demo = createFallbackDemoInvoice('INV-2026-001');
    setInvoice(demo);
    setError(null);
    window.history.pushState({}, '', `/?invoice=INV-2026-001`);
    document.title = `Invoice INV-2026-001 | Columbia Community Festival`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5EE] flex flex-col items-center justify-center p-6 text-[#3D3A30]">
        <div className="bg-white p-8 rounded-3xl border border-[#E8E2D6] shadow-xl max-w-md w-full text-center space-y-4">
          <div className="w-14 h-14 bg-[#5A5A40]/10 text-[#5A5A40] rounded-2xl flex items-center justify-center mx-auto">
            <Loader2 className="w-7 h-7 animate-spin" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Retrieving Vendor Invoice</h2>
            <p className="text-xs text-[#7A7566] mt-1">
              Loading space reservation details for <span className="font-mono font-semibold">{invoiceId}</span>...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-[#F7F5EE] flex flex-col items-center justify-center p-4 sm:p-6 text-[#3D3A30]">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E2D6] shadow-xl max-w-lg w-full space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#3D3A30]">Invoice Not Found</h2>
              <p className="text-xs text-[#7A7566]">{error || 'Unable to locate the requested invoice.'}</p>
            </div>
          </div>

          <form onSubmit={handleManualSearch} className="space-y-2">
            <label className="block text-xs font-bold text-[#7A7566] uppercase tracking-wider">
              Search by Invoice # or ID
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. INV-2026-001 or Email..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#E8E2D6] bg-[#FAF8F5] text-sm text-[#3D3A30] focus:outline-none focus:ring-2 focus:ring-[#5A5A40]"
              />
              <button
                type="submit"
                disabled={searchLoading || !searchQuery.trim()}
                className="px-4 py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {searchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Lookup</span>
              </button>
            </div>
          </form>

          <div className="pt-2 border-t border-[#E8E2D6] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <button
              type="button"
              onClick={handleLoadDemo}
              className="text-[#5A5A40] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Preview Demo Invoice (INV-2026-001)</span>
            </button>

            <button
              type="button"
              onClick={onExit}
              className="px-4 py-2 rounded-xl bg-[#F7F5EE] hover:bg-[#EAE4D6] text-[#3D3A30] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Festival</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5EE] text-[#3D3A30] flex flex-col selection:bg-[#5A5A40] selection:text-white">
      {/* Top Banner Navigation */}
      <header className="bg-white border-b border-[#E8E2D6] sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <button
          onClick={onExit}
          className="flex items-center gap-2 text-xs font-bold text-[#5A5A40] hover:text-[#3D3A30] transition-colors cursor-pointer group"
        >
          <div className="p-1.5 rounded-lg bg-[#FAF8F5] group-hover:bg-[#E8E2D6] transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span>Return to Festival Homepage</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-xs text-[#7A7566]">
            Official Vendor Space Portal
          </span>
          <div className="px-3 py-1 rounded-full bg-[#5A5A40]/10 text-[#5A5A40] text-xs font-bold font-mono">
            {invoice.invoiceNumber}
          </div>
        </div>
      </header>

      {/* Main Full-View Invoice Checkout Component */}
      <main className="flex-grow flex items-center justify-center p-3 sm:p-6 lg:p-10">
        <div className="w-full max-w-4xl">
          <InvoiceCheckoutModal
            invoice={invoice}
            onClose={onExit}
            onPaymentSubmitted={() => {
              // Refresh invoice status if proof submitted
              getInvoiceById(invoice.id).then(updated => {
                if (updated) setInvoice(updated);
              });
            }}
          />
        </div>
      </main>
    </div>
  );
}
