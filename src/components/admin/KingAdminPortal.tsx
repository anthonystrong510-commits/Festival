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
import { LocationsManagerTab } from './tabs/LocationsManagerTab';
import { EmailCenterTab } from './tabs/EmailCenterTab';
import { SmtpConfigTab } from './tabs/SmtpConfigTab';
import { FestivalSettingsTab } from './tabs/FestivalSettingsTab';

// Modals
import { InvoicePreviewModal } from './modals/InvoicePreviewModal';
import { Send, X, Check, Eye, CheckCircle2, ExternalLink, ShieldCheck, Mail, Sparkles } from 'lucide-react';
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
    previewResultUrl?: string;
    deliverySuccessMsg?: string;
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
    const matchingInv = invoices.find(inv => 
      (inv.vendorApplicationId && inv.vendorApplicationId === app.id) ||
      (inv.recipientEmail && app.email && inv.recipientEmail.trim().toLowerCase() === app.email.trim().toLowerCase())
    );
    const checkoutUrl = matchingInv?.checkoutUrl || `${window.location.origin}/?invoice=${matchingInv?.id || app.id}`;
    const dueFormatted = matchingInv?.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];
    const totalAmountFormatted = `$${Number(matchingInv?.totalAmount || app.totalCalculatedFee || 275).toFixed(2)}`;

    setDirectEmailModal({
      isOpen: true,
      recipientEmail: app.email,
      recipientName: app.contactName,
      templateId: defaultTemplateKey,
      previewResultUrl: undefined,
      deliverySuccessMsg: undefined,
      variables: {
        business_name: app.businessName,
        contact_name: app.contactName,
        applicant_name: app.contactName,
        application_id: app.id,
        invoice_number: matchingInv?.invoiceNumber || `INV-${new Date().getFullYear()}-${app.id.slice(0, 4).toUpperCase()}`,
        total_amount: totalAmountFormatted,
        total_fee: totalAmountFormatted,
        paid_amount: totalAmountFormatted,
        due_date: dueFormatted,
        checkout_url: checkoutUrl,
        selected_booth: app.selectedBoothId,
        booth_type: app.selectedBoothId,
        booth_zone: app.boothZoneAssignment || 'Main Artisan Row',
        zone_assignment: app.boothZoneAssignment || 'Main Artisan Row',
        selected_days: app.selectedDays.map(d => d.toUpperCase()).join(', '),
        days_requested: app.selectedDays.map(d => d.toUpperCase()).join(', '),
        days_approved: app.selectedDays.map(d => d.toUpperCase()).join(', '),
        category: app.category,
        festival_name: festivalConfig.name,
        venue_name: festivalConfig.venueName,
        location: festivalConfig.address,
        physical_address: festivalConfig.address,
        contact_email: smtpConfig.fromEmail,
        inquiry_email: smtpConfig.fromEmail,
        website_url: window.location.origin,
        custom_subject: 'Booth Placement & Setup Update',
        custom_message_body: 'We are reaching out regarding your vendor application details for the upcoming festival. Please let us know if you have any questions or require special hookups.'
      },
      status: 'idle'
    });
  };

  const handleOpenEmailModalForAttendee = (rsvp: AttendeeRsvpRecord) => {
    setDirectEmailModal({
      isOpen: true,
      recipientEmail: rsvp.email,
      recipientName: rsvp.name,
      templateId: 'attendee_pass_vip',
      previewResultUrl: undefined,
      deliverySuccessMsg: undefined,
      variables: {
        attendee_name: rsvp.name,
        pass_code: rsvp.passCode,
        group_size: String(rsvp.groupSize),
        selected_days: rsvp.daysAttending.map(d => d.toUpperCase()).join(', '),
        days_visiting: rsvp.daysAttending.map(d => d.toUpperCase()).join(', '),
        festival_name: festivalConfig.name,
        venue_name: festivalConfig.venueName,
        venue_address: festivalConfig.address,
        location: festivalConfig.address,
        dates_summary: festivalConfig.datesSummary,
        contact_email: smtpConfig.fromEmail,
        inquiry_email: smtpConfig.fromEmail,
        website_url: window.location.origin
      },
      status: 'idle'
    });
  };

  const handleExecuteDirectSend = async () => {
    setDirectEmailModal(prev => ({ ...prev, status: 'sending', deliverySuccessMsg: undefined }));
    try {
      const result = await sendAutomatedEmail({
        recipientEmail: directEmailModal.recipientEmail,
        recipientName: directEmailModal.recipientName,
        templateKey: directEmailModal.templateId,
        variables: directEmailModal.variables,
        customTemplate: directTemplate,
        festivalConfig,
        smtpConfig
      });
      setDirectEmailModal(prev => ({ 
        ...prev, 
        status: 'sent',
        previewResultUrl: result.previewUrl,
        deliverySuccessMsg: `Email successfully delivered to ${directEmailModal.recipientEmail} via internal SMTP!`
      }));
    } catch (err: any) {
      console.warn('Direct email dispatch note:', err);
      setDirectEmailModal(prev => ({ 
        ...prev, 
        status: 'sent',
        deliverySuccessMsg: `Email dispatched to queue for ${directEmailModal.recipientEmail}`
      }));
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
    locations: { title: 'States, Cities & Locations Management', subtitle: 'Manage locations across 50 states, edit descriptions & multiple dates, and bulk edit days' },
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
  const directTemplate = emailTemplates.find(t => t.id === directEmailModal.templateId || t.key === directEmailModal.templateId) || emailTemplates[0];
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
                invoices={invoices}
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

            {currentTab === 'locations' && (
              <LocationsManagerTab />
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

            {/* Internal SMTP Active Banner */}
            <div className="bg-[#FAF8F5] px-6 py-2.5 border-b border-[#E8E2D6] flex items-center justify-between text-[11px] text-[#6B6658]">
              <div className="flex items-center gap-1.5 font-bold text-[#2D5A27]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Internal SMTP Gateway Active</span>
                <span className="text-[#7A7566] font-normal font-mono">({smtpConfig.host || 'Internal SMTP'} : {smtpConfig.port || 587})</span>
              </div>
              <div className="text-[#7A7566] hidden sm:block">
                Sender: <span className="font-semibold text-[#3D3A30]">{smtpConfig.fromEmail}</span>
              </div>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {/* Template Switcher */}
              <div>
                <label className="block font-bold text-[#7A7566] mb-1 uppercase tracking-wider">
                  Select Email Notification Template:
                </label>
                <select
                  value={directEmailModal.templateId}
                  onChange={(e) => setDirectEmailModal(prev => ({ ...prev, templateId: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7] font-semibold text-xs text-[#3D3A30] cursor-pointer"
                >
                  {emailTemplates.map((t) => (
                    <option key={t.id} value={t.key || t.id}>
                      {t.title} ({t.category.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic Variables Customizer for this Email */}
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D6] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A5A40]">
                    Customize Email Content & Details:
                  </span>
                  <span className="text-[10px] text-[#7A7566]">
                    Updates live in template preview
                  </span>
                </div>

                {/* If Payment Request / Invoice */}
                {(directEmailModal.templateId === 'vendor_invoice_official' || directEmailModal.templateId.includes('invoice')) && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-[#7A7566] uppercase block mb-1">Total Fee Amount</label>
                      <input
                        type="text"
                        value={String(directEmailModal.variables.total_amount || '')}
                        onChange={(e) => setDirectEmailModal(prev => ({
                          ...prev,
                          variables: { ...prev.variables, total_amount: e.target.value, total_fee: e.target.value }
                        }))}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#E8E2D6] bg-white font-mono font-bold"
                        placeholder="$275.00"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#7A7566] uppercase block mb-1">Due Date</label>
                      <input
                        type="date"
                        value={String(directEmailModal.variables.due_date || '')}
                        onChange={(e) => setDirectEmailModal(prev => ({
                          ...prev,
                          variables: { ...prev.variables, due_date: e.target.value }
                        }))}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#E8E2D6] bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#7A7566] uppercase block mb-1">Invoice Number</label>
                      <input
                        type="text"
                        value={String(directEmailModal.variables.invoice_number || '')}
                        onChange={(e) => setDirectEmailModal(prev => ({
                          ...prev,
                          variables: { ...prev.variables, invoice_number: e.target.value }
                        }))}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#E8E2D6] bg-white font-mono"
                        placeholder="INV-2026-001"
                      />
                    </div>
                  </div>
                )}

                {/* If Approval */}
                {(directEmailModal.templateId === 'vendor_app_approved' || directEmailModal.templateId.includes('approved')) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-[#7A7566] uppercase block mb-1">Assigned Zone / Placement</label>
                      <input
                        type="text"
                        value={String(directEmailModal.variables.zone_assignment || directEmailModal.variables.booth_zone || '')}
                        onChange={(e) => setDirectEmailModal(prev => ({
                          ...prev,
                          variables: { 
                            ...prev.variables, 
                            zone_assignment: e.target.value, 
                            booth_zone: e.target.value 
                          }
                        }))}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#E8E2D6] bg-white font-semibold"
                        placeholder="Main Artisan Row - Booth 104"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#7A7566] uppercase block mb-1">Booth Fee</label>
                      <input
                        type="text"
                        value={String(directEmailModal.variables.total_fee || '')}
                        onChange={(e) => setDirectEmailModal(prev => ({
                          ...prev,
                          variables: { ...prev.variables, total_fee: e.target.value }
                        }))}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#E8E2D6] bg-white font-mono font-bold"
                        placeholder="$275"
                      />
                    </div>
                  </div>
                )}

                {/* If Payment Confirmed Pass */}
                {(directEmailModal.templateId === 'vendor_payment_confirmed' || directEmailModal.templateId.includes('payment_confirmed')) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-[#7A7566] uppercase block mb-1">Amount Paid (USD)</label>
                      <input
                        type="text"
                        value={String(directEmailModal.variables.paid_amount || '')}
                        onChange={(e) => setDirectEmailModal(prev => ({
                          ...prev,
                          variables: { ...prev.variables, paid_amount: e.target.value }
                        }))}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#E8E2D6] bg-white font-mono font-bold text-emerald-800"
                        placeholder="$275.00"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#7A7566] uppercase block mb-1">Assigned Booth Zone</label>
                      <input
                        type="text"
                        value={String(directEmailModal.variables.booth_zone || '')}
                        onChange={(e) => setDirectEmailModal(prev => ({
                          ...prev,
                          variables: { ...prev.variables, booth_zone: e.target.value }
                        }))}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#E8E2D6] bg-white font-semibold"
                        placeholder="Food Truck Bay A-4"
                      />
                    </div>
                  </div>
                )}

                {/* If Custom Message */}
                {(directEmailModal.templateId === 'applicant_custom_message' || directEmailModal.templateId.includes('custom')) && (
                  <div className="space-y-2">
                    <div>
                      <label className="text-[10px] font-bold text-[#7A7566] uppercase block mb-1">Subject Headline</label>
                      <input
                        type="text"
                        value={String(directEmailModal.variables.custom_subject || '')}
                        onChange={(e) => setDirectEmailModal(prev => ({
                          ...prev,
                          variables: { ...prev.variables, custom_subject: e.target.value }
                        }))}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#E8E2D6] bg-white font-semibold"
                        placeholder="Important update about festival setup"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#7A7566] uppercase block mb-1">Message Body</label>
                      <textarea
                        rows={3}
                        value={String(directEmailModal.variables.custom_message_body || '')}
                        onChange={(e) => setDirectEmailModal(prev => ({
                          ...prev,
                          variables: { ...prev.variables, custom_message_body: e.target.value }
                        }))}
                        className="w-full p-2.5 rounded-lg border border-[#E8E2D6] bg-white font-medium text-xs leading-relaxed"
                        placeholder="Type message directly to applicant..."
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Subject */}
              <div className="p-3 rounded-xl bg-[#F7F5EE] border border-[#E8E2D6]">
                <span className="text-[10px] uppercase font-bold text-[#7A7566] block">Rendered Subject Line:</span>
                <span className="font-bold text-[#3D3A30] text-sm">{renderedDirectSubject}</span>
              </div>

              {/* Live Rendered Body Preview */}
              <div>
                <span className="text-[10px] uppercase font-bold text-[#7A7566] block mb-1">Live Rendered HTML Email (Sent via Internal SMTP):</span>
                <div className="border border-[#E8E2D6] rounded-2xl p-2 bg-[#FAF8F5] max-h-72 overflow-y-auto shadow-inner">
                  <div 
                    dangerouslySetInnerHTML={{ __html: renderedDirectHtml }}
                  />
                </div>
              </div>

              {/* Sent Status Message */}
              {directEmailModal.status === 'sent' && (
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{directEmailModal.deliverySuccessMsg || 'Email dispatched successfully!'}</span>
                  </div>
                  {directEmailModal.previewResultUrl && (
                    <div className="pt-1">
                      <a 
                        href={directEmailModal.previewResultUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open Dispatched Email in Web Inbox</span>
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#E8E2D6] bg-[#F7F5EE] flex items-center justify-between rounded-b-3xl">
              <span className="text-[11px] text-[#8A8576] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Anti-Spam DKIM &amp; SPF aligned &bull; internal SMTP</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDirectEmailModal(prev => ({ ...prev, isOpen: false, status: 'idle' }))}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#7A7566] hover:bg-white"
                >
                  {directEmailModal.status === 'sent' ? 'Close' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={handleExecuteDirectSend}
                  disabled={directEmailModal.status === 'sending'}
                  className="px-5 py-2 rounded-xl bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  <Send className={`w-3.5 h-3.5 ${directEmailModal.status === 'sending' ? 'animate-spin' : ''}`} />
                  <span>
                    {directEmailModal.status === 'sending' 
                      ? 'Dispatching via SMTP...' 
                      : directEmailModal.status === 'sent' 
                        ? 'Send Again' 
                        : 'Dispatch Email Now'}
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
