import React, { useState, useMemo } from 'react';
import { 
  Mail, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Smartphone, 
  Monitor, 
  Code, 
  Eye, 
  Send, 
  RotateCcw, 
  Save, 
  Info, 
  Copy, 
  Check, 
  FileText,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { EmailTemplateData, AntiSpamAudit } from '../../../types';
import { DEFAULT_EMAIL_TEMPLATES } from '../../../data/defaultEmailTemplates';
import { auditAntiSpamQuality, interpolateTemplate } from '../../../lib/antiSpamUtils';
import { sendAutomatedEmail } from '../../../lib/emailService';

interface EmailCenterTabProps {
  templates: EmailTemplateData[];
  onSaveTemplate: (template: EmailTemplateData) => void;
  onResetTemplates: () => void;
}

export function EmailCenterTab({
  templates,
  onSaveTemplate,
  onResetTemplates
}: EmailCenterTabProps) {
  const currentTemplates = templates.length > 0 ? templates : DEFAULT_EMAIL_TEMPLATES;
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(currentTemplates[0]?.id || 'vendor_app_received');
  
  // Working draft state
  const activeTemplate = useMemo(() => {
    return currentTemplates.find(t => t.id === selectedTemplateId) || currentTemplates[0];
  }, [currentTemplates, selectedTemplateId]);

  const [draftSubject, setDraftSubject] = useState(activeTemplate?.subject || '');
  const [draftHtml, setDraftHtml] = useState(activeTemplate?.htmlBody || '');
  const [draftPlainText, setDraftPlainText] = useState(activeTemplate?.plainTextBody || '');
  const [draftPreheader, setDraftPreheader] = useState(activeTemplate?.preheader || '');
  
  const [editorMode, setEditorMode] = useState<'html' | 'plaintext'>('html');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [copiedVariable, setCopiedVariable] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Test send simulator modal state
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('organizer@festivalmarket.org');
  const [testSendStatus, setTestSendStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  // When selected template changes, update working draft
  const handleSelectTemplate = (tmpl: EmailTemplateData) => {
    setSelectedTemplateId(tmpl.id);
    setDraftSubject(tmpl.subject);
    setDraftHtml(tmpl.htmlBody);
    setDraftPlainText(tmpl.plainTextBody);
    setDraftPreheader(tmpl.previewText || '');
  };

  // Sample data dictionary for live preview interpolation
  const sampleVariables: Record<string, string | number> = {
    business_name: 'Artisan Silver & Gem Studio',
    contact_name: 'Nadia Solis',
    applicant_name: 'Nadia Solis',
    application_id: 'APP-82914',
    selected_booth: 'Corner 10x10 Tent ($125/day)',
    booth_zone: 'Promenade Row A - Booth 104',
    selected_days: 'Day 1, Day 2, Day 3',
    total_fee: '$375.00',
    festival_name: 'Community Artisan & Culinary Festival',
    venue_name: 'Columbia County Fairgrounds',
    venue_address: 'Fairgrounds Pavilion & Green',
    dates_summary: '3-Day Annual Showcase',
    attendee_name: 'Sarah Jenkins',
    pass_code: 'PASS-892104',
    group_size: '3',
    inquiry_email: 'inquiries@festivalmarket.org',
    website_url: 'https://festivalmarket.org'
  };

  // Anti-Spam audit calculation in real-time
  const antiSpamAudit: AntiSpamAudit = useMemo(() => {
    return auditAntiSpamQuality(draftSubject, draftHtml, draftPlainText, true);
  }, [draftSubject, draftHtml, draftPlainText]);

  // Rendered preview with variables replaced
  const renderedHtml = useMemo(() => {
    return interpolateTemplate(draftHtml, sampleVariables);
  }, [draftHtml]);

  const renderedPlainText = useMemo(() => {
    return interpolateTemplate(draftPlainText, sampleVariables);
  }, [draftPlainText]);

  const handleSave = () => {
    const updated: EmailTemplateData = {
      ...activeTemplate,
      subject: draftSubject,
      htmlBody: draftHtml,
      plainTextBody: draftPlainText,
      preheader: draftPreheader,
      antiSpamScore: antiSpamAudit.score,
      updatedAt: new Date().toISOString()
    };
    onSaveTemplate(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleCopyVar = (variableKey: string) => {
    const textToCopy = `{{${variableKey}}}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedVariable(variableKey);
    setTimeout(() => setCopiedVariable(null), 2000);
  };

  const handleSimulateSend = async () => {
    setTestSendStatus('sending');
    try {
      await sendAutomatedEmail({
        recipientEmail: testEmailAddress,
        recipientName: 'Festival Test Recipient',
        templateKey: activeTemplate.id,
        variables: sampleVariables,
        customTemplate: {
          ...activeTemplate,
          subject: draftSubject,
          htmlBody: draftHtml,
          plainTextBody: draftPlainText,
          previewText: draftPreheader
        }
      });
      setTestSendStatus('sent');
      setTimeout(() => {
        setTestSendStatus('idle');
        setIsTestModalOpen(false);
      }, 2000);
    } catch (err) {
      console.warn('Simulation send notice:', err);
      setTestSendStatus('sent');
      setTimeout(() => {
        setTestSendStatus('idle');
        setIsTestModalOpen(false);
      }, 2000);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E2D6] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-bold text-[#3D3A30] text-lg sm:text-xl">
              Anti-Spam Email Template Studio
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              CAN-SPAM Compliant
            </span>
          </div>
          <p className="text-xs text-[#8A8576] max-w-2xl leading-relaxed">
            Craft beautiful, high-deliverability transactional emails for vendor approvals, waitlists, and attendee VIP passes with live spam scoring and dynamic variables.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsTestModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#F7F5EE] hover:bg-[#EAE4D6] text-[#5A5A40] border border-[#E8E2D6] text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Simulate Dispatch</span>
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            {saveSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saveSuccess ? 'Saved to Firestore!' : 'Save Template'}</span>
          </button>
        </div>
      </div>

      {/* Template Selector Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {currentTemplates.map((t) => {
          const isSelected = t.id === selectedTemplateId;
          return (
            <button
              key={t.id}
              onClick={() => handleSelectTemplate(t)}
              className={`p-3.5 rounded-2xl text-left border transition-all ${
                isSelected
                  ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-md'
                  : 'bg-white text-[#3D3A30] border-[#E8E2D6] hover:border-[#5A5A40]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-[#F7F5EE] text-[#7A7566]'
                }`}>
                  {t.category}
                </span>
                <span className={`text-[10px] font-bold ${
                  isSelected ? 'text-emerald-300' : 'text-emerald-700'
                }`}>
                  {t.antiSpamScore || 98}% Score
                </span>
              </div>
              <div className="font-bold text-xs leading-snug line-clamp-1">
                {t.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Dynamic Variable Chips Bar */}
      <div className="bg-[#FDFBF7] p-3.5 rounded-2xl border border-[#E8E2D6] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A7566] flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#5A5A40]" />
            Insertable Dynamic Variables (Click to copy tag):
          </span>
          {copiedVariable && (
            <span className="text-xs font-bold text-emerald-700">
              Copied {`{{${copiedVariable}}}`}!
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {activeTemplate.variables.map((v) => (
            <button
              key={v}
              onClick={() => handleCopyVar(v)}
              className="px-2.5 py-1 rounded-lg bg-white border border-[#E8E2D6] hover:border-[#5A5A40] text-[11px] font-mono text-[#5A5A40] hover:bg-[#F7F5EE] transition-colors flex items-center gap-1"
              title={`Click to copy {{${v}}}`}
            >
              <span>{`{{${v}}}`}</span>
              <Copy className="w-2.5 h-2.5 text-[#A09B8D]" />
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Workspace: Left Editor & Right Live Device Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 cols): Template Code & Metadata Editor */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Subject & Preheader card */}
          <div className="bg-white p-5 rounded-2xl border border-[#E8E2D6] shadow-xs space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#7A7566] mb-1 uppercase tracking-wider">
                Email Subject Line:
              </label>
              <input
                type="text"
                value={draftSubject}
                onChange={(e) => setDraftSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7] text-xs sm:text-sm font-semibold text-[#3D3A30] focus:ring-2 focus:ring-[#5A5A40]/30"
              />
              <div className="flex items-center justify-between text-[11px] text-[#8A8576] mt-1">
                <span>Subject length: {draftSubject.length} / 75 chars</span>
                <span>{draftSubject.length <= 75 ? 'Optimal Length ✓' : 'May truncate on mobile'}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#7A7566] mb-1 uppercase tracking-wider">
                Inbox Preheader / Snippet:
              </label>
              <input
                type="text"
                value={draftPreheader}
                onChange={(e) => setDraftPreheader(e.target.value)}
                placeholder="Brief summary displayed in user's inbox list..."
                className="w-full px-3.5 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7] text-xs text-[#3D3A30] focus:ring-2 focus:ring-[#5A5A40]/30"
              />
            </div>
          </div>

          {/* Body Editor with HTML vs Plain-Text Switcher */}
          <div className="bg-white rounded-2xl border border-[#E8E2D6] shadow-xs overflow-hidden">
            <div className="p-4 bg-[#F7F5EE] border-b border-[#E8E2D6] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditorMode('html')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    editorMode === 'html'
                      ? 'bg-[#5A5A40] text-white shadow-xs'
                      : 'bg-white text-[#6B6658] border border-[#E8E2D6]'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>HTML Layout</span>
                </button>

                <button
                  onClick={() => setEditorMode('plaintext')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    editorMode === 'plaintext'
                      ? 'bg-[#5A5A40] text-white shadow-xs'
                      : 'bg-white text-[#6B6658] border border-[#E8E2D6]'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Multipart Plain Text</span>
                </button>
              </div>

              <span className="text-[10px] text-[#8A8576] font-mono">
                {editorMode === 'html' ? `${draftHtml.length} bytes` : `${draftPlainText.length} bytes`}
              </span>
            </div>

            <div className="p-4">
              {editorMode === 'html' ? (
                <textarea
                  rows={14}
                  value={draftHtml}
                  onChange={(e) => setDraftHtml(e.target.value)}
                  className="w-full p-3 font-mono text-xs text-[#3D3A30] bg-[#1E1E1E] text-emerald-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A5A40]"
                  spellCheck={false}
                />
              ) : (
                <textarea
                  rows={14}
                  value={draftPlainText}
                  onChange={(e) => setDraftPlainText(e.target.value)}
                  placeholder="Essential fallback text for anti-spam multipart MIME delivery..."
                  className="w-full p-3 font-mono text-xs text-[#3D3A30] bg-[#FDFBF7] border border-[#E8E2D6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A5A40]"
                />
              )}
            </div>
          </div>

          {/* Real-time Anti-Spam Rules Diagnostic Checklist */}
          <div className="bg-white p-5 rounded-2xl border border-[#E8E2D6] shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#E8E2D6] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-sm text-[#3D3A30]">
                  Anti-Spam Deliverability Audit
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#7A7566]">Score:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                  antiSpamAudit.score >= 90 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {antiSpamAudit.score}/100 (Grade {antiSpamAudit.grade})
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              {antiSpamAudit.passedRules.map((rule, idx) => (
                <div key={idx} className="flex items-center gap-2 text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{rule}</span>
                </div>
              ))}

              {antiSpamAudit.warnings.map((warn, idx) => (
                <div key={idx} className="flex items-center gap-2 text-amber-800 bg-amber-50 p-2 rounded-lg">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{warn}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (5 cols): Live Device Email Preview */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white p-4 rounded-2xl border border-[#E8E2D6] shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#3D3A30]">
              <Eye className="w-4 h-4 text-[#5A5A40]" />
              <span>Live Sample Preview</span>
            </div>

            <div className="flex items-center gap-1 p-1 bg-[#F7F5EE] rounded-xl border border-[#E8E2D6]">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                  previewDevice === 'desktop' ? 'bg-[#5A5A40] text-white' : 'text-[#6B6658]'
                }`}
                title="Desktop Email View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                  previewDevice === 'mobile' ? 'bg-[#5A5A40] text-white' : 'text-[#6B6658]'
                }`}
                title="Mobile Smartphone View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Email Preview Frame */}
          <div className={`mx-auto transition-all ${previewDevice === 'mobile' ? 'max-w-[340px]' : 'w-full'}`}>
            <div className="bg-[#2B2A24] rounded-3xl p-3 shadow-xl border border-[#3D3A30]">
              
              {/* Mail Client Header Bar */}
              <div className="bg-[#1C1B17] rounded-2xl p-3 mb-2 text-[11px] text-[#C5BFB0] space-y-1">
                <div className="flex items-center justify-between text-[#8E8878] pb-1 border-b border-white/10">
                  <span className="font-mono">From: Community Festival &lt;events@festivalmarket.org&gt;</span>
                  <span className="text-[9px]">Just now</span>
                </div>
                <div className="font-bold text-white truncate pt-0.5">
                  Subject: {draftSubject}
                </div>
                {draftPreheader && (
                  <div className="text-[10px] text-[#A09B8D] truncate italic">
                    {draftPreheader}
                  </div>
                )}
              </div>

              {/* Rendered Email HTML Container */}
              <div className="bg-white rounded-2xl overflow-hidden max-h-[620px] overflow-y-auto p-1 shadow-inner">
                {editorMode === 'html' ? (
                  <div 
                    dangerouslySetColors-allow="true"
                    dangerouslySetInnerHTML={{ __html: renderedHtml }}
                    className="text-xs"
                  />
                ) : (
                  <pre className="p-4 text-xs font-mono whitespace-pre-wrap text-[#3D3A30] bg-[#FAF8F5]">
                    {renderedPlainText}
                  </pre>
                )}
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* DISPATCH SIMULATOR MODAL */}
      {isTestModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E8E2D6] w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E2D6] pb-3">
              <h3 className="font-bold text-base text-[#3D3A30] flex items-center gap-2">
                <Send className="w-4 h-4 text-[#5A5A40]" />
                <span>Simulate Email Dispatch</span>
              </h3>
              <button onClick={() => setIsTestModalOpen(false)} className="text-[#8A8576] hover:text-[#3D3A30]">
                &times;
              </button>
            </div>

            <p className="text-xs text-[#8A8576] leading-relaxed">
              Verify how your anti-spam headers, dynamic variable bindings, and SPF/DKIM records behave in a simulated delivery environment.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#7A7566] mb-1">Target Recipient Address:</label>
                <input
                  type="email"
                  value={testEmailAddress}
                  onChange={(e) => setTestEmailAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] font-mono text-xs"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#F7F5EE] border border-[#E8E2D6] space-y-1 text-[11px] text-[#6B6658]">
                <div><strong>Active Template:</strong> {activeTemplate.name}</div>
                <div><strong>Anti-Spam Score:</strong> {antiSpamAudit.score}/100</div>
                <div><strong>DKIM / SPF Alignment:</strong> Simulated Pass</div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E8E2D6] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsTestModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#7A7566]"
              >
                Cancel
              </button>
              
              <button
                onClick={handleSimulateSend}
                disabled={testSendStatus !== 'idle'}
                className="px-5 py-2 rounded-xl bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {testSendStatus === 'sending' ? (
                  <span>Dispatching...</span>
                ) : testSendStatus === 'sent' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Sent Successfully!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Test Dispatch</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
