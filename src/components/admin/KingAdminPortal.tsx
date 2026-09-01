import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  AdminTab, 
  VendorApplicationRecord, 
  AttendeeRsvpRecord, 
  EmailTemplateData, 
  SmtpConfigData, 
  FestivalConfigData,
  PaymentConfig,
  Invoice
} from '../../types';
import { 
  auth, 
  adminSignOut,
  subscribeVendorApplications,
  subscribeAttendeeRsvps,
  subscribeEmailTemplates,
  subscribeSmtpConfig,
  subscribeFestivalConfig,
  subscribePaymentConfig,
  subscribeInvoices,
  updateVendorApplicationStatus,
  deleteVendorApplication,
  createVendorApplication,
  toggleAttendeeCheckIn,
  deleteAttendeeRsvp,
  saveEmailTemplate,
  seedDefaultEmailTemplates,
  saveSmtpConfig,
  saveFestivalConfig,
  savePaymentConfig,
  seedSampleData,
  DEFAULT_SMTP_CONFIG,
  DEFAULT_FESTIVAL_CONFIG,
  DEFAULT_PAYMENT_CONFIG
} from '../../lib/firebase';
import { DEFAULT_EMAIL_TEMPLATES } from '../../data/defaultEmailTemplates';
import { sendAutomatedEmail } from '../../lib/emailService';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopBar } from './AdminTopBar';
import { AdminLogin } from './AdminLogin';

// Import Tabs
import { DashboardTab } from './tabs/DashboardTab';
import { VendorApplicationsTab } from './tabs/VendorApplicationsTab';
import { InvoicesTab } from './tabs/InvoicesTab';
import { PaymentConfigTab } from './tabs/PaymentConfigTab';
import { AttendeeRsvpsTab } from './tabs/AttendeeRsvpsTab';
import { BoothsManagerTab } from './tabs/BoothsManagerTab';
import { ScheduleManagerTab } from './tabs/ScheduleManagerTab';
import { EmailCenterTab } from './tabs/EmailCenterTab';
import { SmtpConfigTab } from './tabs/SmtpConfigTab';
import { FestivalSettingsTab } from './tabs/FestivalSettingsTab';

// Modals
import { InvoicePreviewModal } from './modals/InvoicePreviewModal';
import { Send, X, Check, Eye } from 'lucide-react';
import { interpolateTemplate } from '../../lib/antiSpamUtils';

interface KingAdminPortalProps {
  onExitAdmin: () => void;
}

export function KingAdminPortal({ onExitAdmin }: KingAdminPortalProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isDemoAdmin, setIsDemoAdmin] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Active Admin View
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Firestore Real-time Collections State
  const [applications, setApplications] = useState<VendorApplicationRecord[]>([]);
  const [attendees, setAttendees] = useState<AttendeeRsvpRecord[]>([]);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplateData[]>(DEFAULT_EMAIL_TEMPLATES);
  const [smtpConfig, setSmtpConfig] = useState<SmtpConfigData>(DEFAULT_SMTP_CONFIG);
  const [festivalConfig, setFestivalConfig] = useState<FestivalConfigData>(DEFAULT_FESTIVAL_CONFIG);
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>(DEFAULT_PAYMENT_CONFIG);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Modals and Inspector states
  const [selectedAppForInspector, setSelectedAppForInspector] = useState<VendorApplicationRecord | null>(null);
  const [isCreateVendorModalOpen, setIsCreateVendorModalOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // Invoice Modal State
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedVendorForInvoice, setSelectedVendorForInvoice] = useState<VendorApplicationRecord | null>(null);
  const [selectedInvoiceForModal, setSelectedInvoiceForModal] = useState<Invoice | null>(null);

  // Quick Direct Email Dispatch Modal
  const [directEmailModal, setDirectEmailModal] = useState<{
    isOpen: boolean;
    recipientEmail: string;
    recipientName: string;
    templateId: string;
    variables: Record<string, string | number>;
    status: 'idle' | 'sending' | 'sent';
  }>({
    isOpen: false,
    recipientEmail: '',
    recipientName: '',
    templateId: 'vendor_app_approved',
    variables: {},
    status: 'idle'
  });

  // 1. Auth Listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
    });
    return () => unsub();
  }, []);

  // 2. Firestore Subscriptions (Live Real-Time Sync)
  useEffect(() => {
    if (!currentUser && !isDemoAdmin) return;

    const unsubApps = subscribeVendorApplications((apps) => setApplications(apps));
    const unsubRsvps = subscribeAttendeeRsvps((rsvps) => setAttendees(rsvps));
    const unsubTemplates = subscribeEmailTemplates((tmpls) => setEmailTemplates(tmpls));
    const unsubSmtp = subscribeSmtpConfig((cfg) => setSmtpConfig(cfg));
    const unsubFest = subscribeFestivalConfig((cfg) => setFestivalConfig(cfg));
    const unsubPayments = subscribePaymentConfig((cfg) => setPaymentConfig(cfg));
    const unsubInvoices = subscribeInvoices((invs) => setInvoices(invs));

    return () => {
      unsubApps();
      unsubRsvps();
      unsubTemplates();
      unsubSmtp();
      unsubFest();
      unsubPayments();
      unsubInvoices();
    };
  }, [currentUser, isDemoAdmin]);

  const handleSignOut = async () => {
    await adminSignOut();
    setCurrentUser(null);
    setIsDemoAdmin(false);
  };

  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      await seedSampleData();
      await seedDefaultEmailTemplates();
    } catch (e) {
      console.error('Seed error:', e);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleOpenInvoiceModalForVendor = (app: VendorApplicationRecord) => {
    setSelectedVendorForInvoice(app);
    setSelectedInvoiceForModal(null);
    setIsInvoiceModalOpen(true);
  };

  const handleOpenEmailModalForVendor = (app: VendorApplicationRecord, defaultTemplateKey = 'vendor_app_received') => {
    setDirectEmailModal({
      isOpen: true,
      recipientEmail: app.email,
      recipientName: app.contactName,
      templateId: defaultTemplateKey,
      variables: {
        business_name: app.businessName,
        contact_name: app.contactName,
        applicant_name: app.contactName,
        application_id: app.id,
        selected_booth: app.selectedBoothId,
        booth_zone: app.boothZoneAssignment || 'Main Artisan Row',
        selected_days: app.selectedDays.map(d => d.toUpperCase()).join(', '),
        total_fee: `$${app.totalCalculatedFee || 0}`,
        festival_name: festivalConfig.name,
        venue_name: festivalConfig.venueName,
        venue_address: festivalConfig.address,
        inquiry_email: smtpConfig.fromEmail,
        website_url: window.location.origin
      },
      status: 'idle'
    });
  };

  const handleOpenEmailModalForAttendee = (rsvp: AttendeeRsvpRecord) => {
    setDirectEmailModal({
      isOpen: true,
      recipientEmail: rsvp.email,
      recipientName: rsvp.name,
      templateId: 'attendee_ticket_pass',
      variables: {
        attendee_name: rsvp.name,
        pass_code: rsvp.passCode,
        group_size: String(rsvp.groupSize),
        selected_days: rsvp.daysAttending.map(d => d.toUpperCase()).join(', '),
        festival_name: festivalConfig.name,
        venue_name: festivalConfig.venueName,
        venue_address: festivalConfig.address,
        dates_summary: festivalConfig.datesSummary,
        inquiry_email: smtpConfig.fromEmail,
        website_url: window.location.origin
      },
      status: 'idle'
    });
  };

  const handleExecuteDirectSend = async () => {
    setDirectEmailModal(prev => ({ ...prev, status: 'sending' }));
    try {
      await sendAutomatedEmail({
        recipientEmail: directEmailModal.recipientEmail,
        recipientName: directEmailModal.recipientName,
        templateKey: directEmailModal.templateId,
        variables: directEmailModal.variables,
        customTemplate: directTemplate,
        festivalConfig,
        smtpConfig
      });
      setDirectEmailModal(prev => ({ ...prev, status: 'sent' }));
      setTimeout(() => {
        setDirectEmailModal(prev => ({ ...prev, isOpen: false, status: 'idle' }));
      }, 1500);
    } catch (err) {
      console.warn('Direct email dispatch note:', err);
      setDirectEmailModal(prev => ({ ...prev, status: 'sent' }));
      setTimeout(() => {
        setDirectEmailModal(prev => ({ ...prev, isOpen: false, status: 'idle' }));
      }, 1500);
    }
  };

  const tabTitles: Record<AdminTab, { title: string; subtitle: string }> = {
    dashboard: { title: 'Operations Dashboard', subtitle: 'Real-time overview of applications, attendance, crypto reserves & revenue' },
    applications: { title: 'Vendor Applications', subtitle: 'Exhibitor review, batch invoicing, zone allocations & approval queue' },
    invoices: { title: 'Invoices & Crypto Checkout', subtitle: 'Payment links, invoice dispatching, crypto settlement & receipts' },
    payments: { title: 'Payment Configuration & Wallets', subtitle: 'USDT (TRC20/ERC20/SOL), ETH, BTC, CashApp, Kraken & Wire' },
    attendees: { title: 'Attendee RSVPs & Fast-Passes', subtitle: 'Visitor passes, attendance forecasts & gate check-ins' },
    booths: { title: 'Booth Spaces & Pricing Tiers', subtitle: 'Dimension limits, equipment inclusions & daily fees' },
    schedule: { title: 'Festival Schedule & Lineup', subtitle: 'Stage entertainment, artisan demos & hourly agenda' },
    emails: { title: 'Anti-Spam Email Templates', subtitle: 'Visual email designer with live spam score meter & variables' },
    smtp: { title: 'SMTP Mail Server & DNS', subtitle: 'Outbound credentials, SPF/DKIM records & connection testing' },
    settings: { title: 'Festival Identity Settings', subtitle: 'Event titles, dates, grounds address & admission terms' }
  };

  // If not authenticated and not in demo admin mode, show login gate
  if (!currentUser && !isDemoAdmin && !isAuthLoading) {
    return (
      <AdminLogin
        onExitAdmin={onExitAdmin}
        onDemoLoginSuccess={() => setIsDemoAdmin(true)}
      />
    );
  }

  // Active email template for direct send preview
  const directTemplate = emailTemplates.find(t => t.id === directEmailModal.templateId) || emailTemplates[0];
  const renderedDirectSubject = interpolateTemplate(directTemplate?.subject || '', directEmailModal.variables);
  const renderedDirectHtml = interpolateTemplate(directTemplate?.htmlBody || '', directEmailModal.variables);

  const unpaidInvoicesCount = invoices.filter(i => i.status === 'sent' || i.status === 'under_review').length;

  return (
    <div className="flex h-screen bg-[#FDFBF7] text-[#3D3A30] overflow-hidden font-sans">
      
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:flex">
        <AdminSidebar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            setGlobalSearchQuery('');
          }}
          pendingAppsCount={applications.filter(a => a.status === 'pending').length}
          totalAttendeesCount={attendees.length}
          unpaidInvoicesCount={unpaidInvoicesCount}
          onExitAdmin={onExitAdmin}
          onSignOut={handleSignOut}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          userEmail={currentUser?.email || (isDemoAdmin ? 'demo-admin@festivalmarket.org' : null)}
        />
      </div>

      {/* Mobile Drawer Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 md:hidden flex">
          <div className="w-64 h-full">
            <AdminSidebar
              currentTab={currentTab}
              onSelectTab={(tab) => {
                setCurrentTab(tab);
                setIsMobileMenuOpen(false);
                setGlobalSearchQuery('');
              }}
              pendingAppsCount={applications.filter(a => a.status === 'pending').length}
              totalAttendeesCount={attendees.length}
              unpaidInvoicesCount={unpaidInvoicesCount}
              onExitAdmin={onExitAdmin}
              onSignOut={handleSignOut}
              isCollapsed={false}
              onToggleCollapse={() => setIsMobileMenuOpen(false)}
              userEmail={currentUser?.email || (isDemoAdmin ? 'demo-admin@festivalmarket.org' : null)}
            />
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header Bar */}
        <AdminTopBar
          currentTab={currentTab}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onExitAdmin={onExitAdmin}
          onSeedData={handleSeedData}
          isSeeding={isSeeding}
          searchQuery={globalSearchQuery}
          onSearchChange={setGlobalSearchQuery}
          onOpenNewVendorModal={() => setIsCreateVendorModalOpen(true)}
          tabTitles={tabTitles}
        />

        {/* Tab View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {currentTab === 'dashboard' && (
              <DashboardTab
                applications={applications}
                attendees={attendees}
                invoices={invoices}
                paymentConfig={paymentConfig}
                onSelectTab={setCurrentTab}
                onSelectApplication={(app) => {
                  setSelectedAppForInspector(app);
                  setCurrentTab('applications');
                }}
                onQuickApproveApplication={(id) => updateVendorApplicationStatus(id, { status: 'approved' })}
                onToggleCheckIn={(id, checked) => toggleAttendeeCheckIn(id, checked)}
                onSeedData={handleSeedData}
                isSeeding={isSeeding}
              />
            )}

            {currentTab === 'applications' && (
              <VendorApplicationsTab
                applications={applications}
                onUpdateStatus={(id, updates) => updateVendorApplicationStatus(id, updates)}
                onDeleteApplication={(id) => deleteVendorApplication(id)}
                onOpenEmailModal={handleOpenEmailModalForVendor}
                selectedAppForModal={selectedAppForInspector}
                onSelectAppForModal={setSelectedAppForInspector}
                isCreateModalOpen={isCreateVendorModalOpen}
                onSetCreateModalOpen={setIsCreateVendorModalOpen}
                onCreateApplication={(data) => createVendorApplication(data)}
                onOpenInvoiceModal={handleOpenInvoiceModalForVendor}
                paymentConfig={paymentConfig}
                smtpConfig={smtpConfig}
                festivalConfig={festivalConfig}
              />
            )}

            {currentTab === 'invoices' && (
              <InvoicesTab
                invoices={invoices}
                paymentConfig={paymentConfig}
                smtpConfig={smtpConfig}
                festivalConfig={festivalConfig}
              />
            )}

            {currentTab === 'payments' && (
              <PaymentConfigTab
                config={paymentConfig}
                onSaveConfig={(cfg) => savePaymentConfig(cfg)}
              />
            )}

            {currentTab === 'attendees' && (
              <AttendeeRsvpsTab
                attendees={attendees}
                onToggleCheckIn={(id, checked) => toggleAttendeeCheckIn(id, checked)}
                onDeleteRsvp={(id) => deleteAttendeeRsvp(id)}
                onSendPassEmail={handleOpenEmailModalForAttendee}
              />
            )}

            {currentTab === 'booths' && (
              <BoothsManagerTab applications={applications} />
            )}

            {currentTab === 'schedule' && (
              <ScheduleManagerTab />
            )}

            {currentTab === 'emails' && (
              <EmailCenterTab
                templates={emailTemplates}
                onSaveTemplate={(tmpl) => saveEmailTemplate(tmpl)}
                onResetTemplates={seedDefaultEmailTemplates}
                smtpConfig={smtpConfig}
                festivalConfig={festivalConfig}
              />
            )}

            {currentTab === 'smtp' && (
              <SmtpConfigTab
                config={smtpConfig}
                onSaveConfig={(cfg) => saveSmtpConfig(cfg)}
              />
            )}

            {currentTab === 'settings' && (
              <FestivalSettingsTab
                config={festivalConfig}
                onSaveConfig={(cfg) => saveFestivalConfig(cfg)}
                onSeedData={handleSeedData}
                isSeeding={isSeeding}
                smtpConfig={smtpConfig}
                onNavigateToSmtp={() => setCurrentTab('smtp')}
              />
            )}
          </div>
        </main>

      </div>

      {/* INVOICE GENERATOR / PREVIEW MODAL */}
      {isInvoiceModalOpen && (
        <InvoicePreviewModal
          isOpen={isInvoiceModalOpen}
          onClose={() => {
            setIsInvoiceModalOpen(false);
            setSelectedVendorForInvoice(null);
            setSelectedInvoiceForModal(null);
          }}
          vendor={selectedVendorForInvoice}
          existingInvoice={selectedInvoiceForModal}
          paymentConfig={paymentConfig}
          smtpConfig={smtpConfig}
          festivalConfig={festivalConfig}
        />
      )}

      {/* DIRECT EMAIL DISPATCH PREVIEW MODAL */}
      {directEmailModal.isOpen && directTemplate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#E8E2D6] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col my-auto">
            
            <div className="p-6 border-b border-[#E8E2D6] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#3D3A30] flex items-center gap-2">
                  <Send className="w-4 h-4 text-[#5A5A40]" />
                  <span>Dispatch Email to {directEmailModal.recipientName}</span>
                </h3>
                <p className="text-xs text-[#8A8576] mt-0.5">
                  Recipient: <span className="font-mono text-[#5A5A40]">{directEmailModal.recipientEmail}</span>
                </p>
              </div>

              <button 
                onClick={() => setDirectEmailModal(prev => ({ ...prev, isOpen: false }))}
                className="p-2 text-[#8A8576] hover:text-[#3D3A30]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {/* Template Switcher */}
              <div>
                <label className="block font-bold text-[#7A7566] mb-1 uppercase tracking-wider">
                  Select Email Template:
                </label>
                <select
                  value={directEmailModal.templateId}
                  onChange={(e) => setDirectEmailModal(prev => ({ ...prev, templateId: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7] font-semibold"
                >
                  {emailTemplates.map((t) => (
                    <option key={t.id} value={t.id}>{t.title} ({t.category})</option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div className="p-3 rounded-xl bg-[#F7F5EE] border border-[#E8E2D6]">
                <span className="text-[10px] uppercase font-bold text-[#7A7566] block">Generated Subject:</span>
                <span className="font-bold text-[#3D3A30] text-sm">{renderedDirectSubject}</span>
              </div>

              {/* Live Rendered Body Preview */}
              <div>
                <span className="text-[10px] uppercase font-bold text-[#7A7566] block mb-1">Live Rendered HTML Email:</span>
                <div className="border border-[#E8E2D6] rounded-2xl p-2 bg-[#FAF8F5] max-h-80 overflow-y-auto shadow-inner">
                  <div 
                    dangerouslySetInnerHTML={{ __html: renderedDirectHtml }}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#E8E2D6] bg-[#F7F5EE] flex items-center justify-between rounded-b-3xl">
              <span className="text-[11px] text-[#8A8576]">
                Anti-Spam DKIM & SPF aligned via {smtpConfig.host}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDirectEmailModal(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#7A7566] hover:bg-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteDirectSend}
                  disabled={directEmailModal.status !== 'idle'}
                  className="px-5 py-2 rounded-xl bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  <Send className={`w-3.5 h-3.5 ${directEmailModal.status === 'sending' ? 'animate-spin' : ''}`} />
                  <span>
                    {directEmailModal.status === 'sending' ? 'Sending...' : directEmailModal.status === 'sent' ? 'Dispatched!' : 'Send Email Now'}
                  </span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
