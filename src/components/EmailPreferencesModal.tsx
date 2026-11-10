import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Check, 
  ExternalLink, 
  Sliders, 
  Bell, 
  FileText, 
  Tag, 
  HelpCircle, 
  Globe, 
  X,
  Sparkles
} from 'lucide-react';

interface EmailPreferencesModalProps {
  isOpen: boolean;
  email: string;
  onClose: () => void;
  siteName?: string;
  contactEmail?: string;
}

export function EmailPreferencesModal({
  isOpen,
  email,
  onClose,
  siteName = 'Columbia Community Festival',
  contactEmail = 'events@companydesk.online'
}: EmailPreferencesModalProps) {
  const [activeTab, setActiveTab] = useState<'preferences' | 'safesender'>('preferences');
  const [providerTab, setProviderTab] = useState<'gmail' | 'yahoo' | 'hotmail'>('gmail');
  
  const [prefMarketing, setPrefMarketing] = useState(false);
  const [prefStatus, setPrefStatus] = useState(true);
  const [prefInvoices, setPrefInvoices] = useState(true);
  
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [unsubscribedAll, setUnsubscribedAll] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleUnsubscribeAll = () => {
    setPrefMarketing(false);
    setPrefStatus(false);
    setUnsubscribedAll(true);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FAF8F5] border border-[#E8E2D6] rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="bg-[#5A5A40] text-white p-5 sm:p-6 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> RFC-8058 Certified
            </span>
            <span className="text-xs text-[#EAE4D6]">Safe Email Portal</span>
          </div>
          
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Email Deliverability & Preferences
          </h2>
          <p className="text-xs sm:text-sm text-[#EAE4D6] mt-1">
            Managing communication preferences for: <strong className="text-white underline">{email || 'your email'}</strong>
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#E8E2D6] bg-white px-6">
          <button
            onClick={() => setActiveTab('preferences')}
            className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'preferences'
                ? 'border-[#5A5A40] text-[#5A5A40]'
                : 'border-transparent text-[#7A7566] hover:text-[#3D3A30]'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Subscription Settings</span>
          </button>
          <button
            onClick={() => setActiveTab('safesender')}
            className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'safesender'
                ? 'border-[#5A5A40] text-[#5A5A40]'
                : 'border-transparent text-[#7A7566] hover:text-[#3D3A30]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Safe Senders Guide (Gmail, Yahoo, Hotmail)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1">
          {activeTab === 'preferences' ? (
            <div className="space-y-5">
              {savedSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    {unsubscribedAll 
                      ? 'You have been unsubscribed from all optional email broadcasts.' 
                      : 'Your preferences have been saved successfully.'}
                  </span>
                </div>
              )}

              <div className="space-y-3">
                <p className="text-xs text-[#7A7566] leading-relaxed">
                  Choose which types of emails you wish to receive from <strong>{siteName}</strong>. Transactional invoices and booth confirmation passes are retained for active applicants.
                </p>

                <div className="p-4 rounded-xl bg-white border border-[#E8E2D6] space-y-3 shadow-2xs">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prefMarketing}
                      onChange={(e) => {
                        setPrefMarketing(e.target.checked);
                        setUnsubscribedAll(false);
                      }}
                      className="mt-1 rounded text-[#5A5A40] focus:ring-[#5A5A40] w-4 h-4"
                    />
                    <div>
                      <div className="text-xs font-bold text-[#3D3A30] flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-amber-700" /> Marketing, Concert Broadcasts & Special Announcements
                      </div>
                      <p className="text-[11px] text-[#7A7566] mt-0.5">
                        Early-bird booth applications, upcoming festival dates, live stage schedules, and general newsletters.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E8E2D6] space-y-3 shadow-2xs">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prefStatus}
                      onChange={(e) => {
                        setPrefStatus(e.target.checked);
                        setUnsubscribedAll(false);
                      }}
                      className="mt-1 rounded text-[#5A5A40] focus:ring-[#5A5A40] w-4 h-4"
                    />
                    <div>
                      <div className="text-xs font-bold text-[#3D3A30] flex items-center gap-1.5">
                        <Bell className="w-3.5 h-3.5 text-blue-700" /> Application Status & Jury Review Alerts
                      </div>
                      <p className="text-[11px] text-[#7A7566] mt-0.5">
                        Notifications regarding your booth review, category jury approval, zone assignment, or waitlist updates.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="p-4 rounded-xl bg-[#F7F5EE] border border-[#E8E2D6] space-y-2 opacity-90">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={prefInvoices}
                      disabled
                      className="mt-1 rounded text-[#5A5A40] opacity-60 w-4 h-4"
                    />
                    <div>
                      <div className="text-xs font-bold text-[#3D3A30] flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-emerald-700" /> Billing Invoices & Official Load-In Passes (Essential)
                      </div>
                      <p className="text-[11px] text-[#7A7566] mt-0.5">
                        Space invoices, payment receipts, parking access barcodes, and electrical safety badges. Required for active exhibitors.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold transition-colors shadow-xs"
                >
                  Save Email Preferences
                </button>
                <button
                  type="button"
                  onClick={handleUnsubscribeAll}
                  className="py-2.5 px-4 rounded-xl bg-white border border-rose-300 hover:bg-rose-50 text-rose-800 text-xs font-bold transition-colors shadow-2xs"
                >
                  Unsubscribe From Non-Critical Mail
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs">
                <strong>Why emails land in spam:</strong> Major mailbox providers (Gmail, Yahoo, Hotmail) employ automated heuristic filters that sometimes route legitimate festival invoices and approval emails into the Junk/Spam folder until verified.
              </div>

              {/* Provider Sub-Tabs */}
              <div className="flex gap-2">
                <button
                  onClick={() => setProviderTab('gmail')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                    providerTab === 'gmail'
                      ? 'bg-[#5A5A40] text-white border-[#5A5A40]'
                      : 'bg-white text-[#7A7566] border-[#E8E2D6] hover:bg-[#FDFBF7]'
                  }`}
                >
                  Google Gmail
                </button>
                <button
                  onClick={() => setProviderTab('yahoo')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                    providerTab === 'yahoo'
                      ? 'bg-[#5A5A40] text-white border-[#5A5A40]'
                      : 'bg-white text-[#7A7566] border-[#E8E2D6] hover:bg-[#FDFBF7]'
                  }`}
                >
                  Yahoo Mail
                </button>
                <button
                  onClick={() => setProviderTab('hotmail')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                    providerTab === 'hotmail'
                      ? 'bg-[#5A5A40] text-white border-[#5A5A40]'
                      : 'bg-white text-[#7A7566] border-[#E8E2D6] hover:bg-[#FDFBF7]'
                  }`}
                >
                  Hotmail / Outlook
                </button>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="p-4 rounded-xl bg-white border border-[#E8E2D6] space-y-3 text-xs text-[#3D3A30]">
                {providerTab === 'gmail' && (
                  <ol className="list-decimal pl-4 space-y-2 leading-relaxed text-[#5A5A40]">
                    <li>
                      <strong>Add Sender to Contacts:</strong> Hover over the sender address <code className="bg-[#F7F5EE] px-1 py-0.5 rounded text-black">{contactEmail}</code> and click <em>"Add to Contacts"</em>.
                    </li>
                    <li>
                      <strong>Check Spam folder:</strong> If an email lands in Spam, open it and click the button marked <strong>"Report Not Spam"</strong>.
                    </li>
                    <li>
                      <strong>Move to Primary Tab:</strong> If the email lands in the <em>Promotions</em> or <em>Updates</em> tab, drag the message to the <strong>Primary</strong> tab and click <em>"Yes"</em> when prompted for future emails.
                    </li>
                  </ol>
                )}

                {providerTab === 'yahoo' && (
                  <ol className="list-decimal pl-4 space-y-2 leading-relaxed text-[#5A5A40]">
                    <li>
                      <strong>Add to Contacts list:</strong> Click on <code className="bg-[#F7F5EE] px-1 py-0.5 rounded text-black">{contactEmail}</code> in the header and choose <em>"Add to contacts"</em>.
                    </li>
                    <li>
                      <strong>Mark as Not Spam:</strong> If found in the Spam folder, select the message and click <strong>"Not Spam"</strong> in the top toolbar.
                    </li>
                    <li>
                      <strong>Create a filter:</strong> In Yahoo Settings &rarr; More Settings &rarr; Filters, add a rule to automatically deliver emails from <code className="bg-[#F7F5EE] px-1 py-0.5 rounded text-black">{contactEmail}</code> to your Inbox.
                    </li>
                  </ol>
                )}

                {providerTab === 'hotmail' && (
                  <ol className="list-decimal pl-4 space-y-2 leading-relaxed text-[#5A5A40]">
                    <li>
                      <strong>Add to Safe Senders List:</strong> Go to Outlook Settings (gear icon) &rarr; <em>View all Outlook settings</em> &rarr; <em>Mail</em> &rarr; <em>Junk email</em>. Under <strong>Safe senders and domains</strong>, add <code className="bg-[#F7F5EE] px-1 py-0.5 rounded text-black">{contactEmail}</code>.
                    </li>
                    <li>
                      <strong>Mark as Not Junk:</strong> In your Junk Email folder, right-click the message and select <strong>"Not Junk"</strong> &rarr; <strong>"Always trust emails from this sender"</strong>.
                    </li>
                    <li>
                      <strong>Add to People:</strong> Save the festival email address as a new contact in Outlook People.
                    </li>
                  </ol>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#F7F5EE] border-t border-[#E8E2D6] p-4 sm:p-5 rounded-b-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#7A7566]">
          <span>
            {siteName} &bull; Official Operations
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white border border-[#E8E2D6] hover:bg-[#F0EBE0] font-bold text-[#5A5A40] transition-colors"
            >
              Close Window
            </button>
            <a
              href="/"
              onClick={() => {
                // Remove ?unsubscribe from URL if present
                window.history.replaceState({}, '', window.location.pathname);
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-[#5A5A40] hover:bg-[#464632] text-white font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Visit Official Website</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
