import React, { useState, useEffect } from 'react';
import { 
  Server, 
  ShieldCheck, 
  Lock, 
  Key, 
  Mail, 
  Send, 
  Check, 
  Save, 
  Copy, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw,
  Terminal,
  Layers,
  HelpCircle,
  ExternalLink,
  Zap,
  Info,
  Clock,
  Sparkles
} from 'lucide-react';
import { SmtpConfigData } from '../../../types';
import { generateDnsSpfRecord, generateDmarcRecord } from '../../../lib/antiSpamUtils';
import { safeFetchJson } from '../../../lib/apiUtils';

interface SmtpConfigTabProps {
  config: SmtpConfigData;
  onSaveConfig: (config: SmtpConfigData) => void;
}

export function SmtpConfigTab({ config, onSaveConfig }: SmtpConfigTabProps) {
  const [form, setForm] = useState<SmtpConfigData>({ ...config });
  const [showPassword, setShowPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (config) {
      setForm({ ...config });
      if (!testRecipientEmail) {
        setTestRecipientEmail(config.fromEmail || 'events@festivalmarket.org');
      }
    }
  }, [config]);

  // Diagnostic Test State
  const [isTesting, setIsTesting] = useState(false);
  const [testLogs, setTestLogs] = useState<string[]>([]);
  const [testResult, setTestResult] = useState<'idle' | 'success' | 'failure'>('idle');
  const [testDetails, setTestDetails] = useState<{
    recipient?: string;
    messageId?: string;
    previewUrl?: string;
    latencyMs?: number;
    method?: string;
    error?: string;
  } | null>(null);
  const [testRecipientEmail, setTestRecipientEmail] = useState(config?.fromEmail || 'events@festivalmarket.org');

  // Preset Providers for quick configuration
  const PRESETS = [
    { name: 'Google Workspace / Gmail', host: 'smtp.gmail.com', port: 465, secure: true, username: 'organizer@gmail.com' },
    { name: 'SendGrid', host: 'smtp.sendgrid.net', port: 587, secure: false, username: 'apikey' },
    { name: 'Mailgun', host: 'smtp.mailgun.org', port: 587, secure: false, username: 'postmaster@yourdomain.com' },
    { name: 'Amazon SES', host: 'email-smtp.us-east-1.amazonaws.com', port: 587, secure: false, username: 'AKIA...' },
    { name: 'Postmark', host: 'smtp.postmarkapp.com', port: 587, secure: false, username: 'server-token' }
  ];

  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    setForm(prev => ({
      ...prev,
      host: preset.host,
      port: preset.port,
      secure: preset.secure,
      username: preset.username,
      spfRecord: generateDnsSpfRecord('festivalmarket.org', preset.host),
      dmarcPolicy: generateDmarcRecord('festivalmarket.org', 'dmarc@festivalmarket.org')
    }));
  };

  const handleCopy = (key: string, text: string) => {
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

  const handleRunDiagnosticTest = async (overrideRecipient?: string) => {
    setIsTesting(true);
    setTestResult('idle');
    setTestDetails(null);

    const targetEmail = (overrideRecipient || testRecipientEmail.trim() || form.fromEmail || 'events@festivalmarket.org').trim();

    setTestLogs([
      `[1/4] Initiating SMTP connection test to ${form.host}:${form.port}...`,
      `Configured Sender: "${form.fromName}" <${form.fromEmail}>`,
      `Target Test Recipient: <${targetEmail}>`,
      `TLS Encryption: ${form.secure || form.port === 465 ? 'SSL/TLS (Port ' + form.port + ')' : 'STARTTLS (Port ' + form.port + ')'}`
    ]);

    try {
      const data = await safeFetchJson('/api/test-smtp', {
        method: 'POST',
        body: JSON.stringify({
          host: form.host,
          port: form.port,
          secure: form.secure,
          username: form.username,
          password: form.password,
          fromEmail: form.fromEmail,
          fromName: form.fromName,
          recipientEmail: targetEmail
        })
      });

      if (data.logs && Array.isArray(data.logs)) {
        setTestLogs(data.logs);
      }

      if (data.success) {
        setTestResult('success');
        setTestDetails({
          recipient: data.recipient || targetEmail,
          messageId: data.messageId,
          previewUrl: data.previewUrl,
          latencyMs: data.latencyMs,
          method: data.method || 'smtp'
        });
      } else {
        setTestResult('failure');
        setTestDetails({
          recipient: data.recipient || targetEmail,
          error: data.error || 'SMTP Connection rejected or socket timed out.'
        });
      }
    } catch (err: any) {
      const errorMsg = `Could not reach SMTP diagnostic service: ${err.message || err}`;
      setTestLogs(prev => [
        ...prev,
        `[Network Error] ${errorMsg}`
      ]);
      setTestResult('failure');
      setTestDetails({
        recipient: targetEmail,
        error: errorMsg
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner with Primary Actions */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E2D6] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-bold text-[#3D3A30] text-lg sm:text-xl">
              SMTP Server & Deliverability Engine
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Active Outbound Gateway
            </span>
          </div>
          <p className="text-xs text-[#8A8576] max-w-2xl leading-relaxed">
            Configure SMTP credentials, rate limits, and DNS authentication (SPF, DKIM, DMARC) for maximum inbox delivery rates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            id="btn-header-test-smtp"
            onClick={() => handleRunDiagnosticTest(form.fromEmail)}
            disabled={isTesting}
            className="px-4 py-2.5 rounded-xl bg-[#F7F5EE] hover:bg-[#EAE4D6] text-[#5A5A40] border border-[#D5CEBF] text-xs font-bold flex items-center gap-2 transition-all shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-[#5A5A40]' : ''}`} />
            <span>{isTesting ? 'Testing Socket...' : 'Test SMTP Connection'}</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saveSuccess ? 'Saved to Firestore!' : 'Save Configuration'}</span>
          </button>
        </div>
      </div>

      {/* Immediate Diagnostic Result Banner (when test runs) */}
      {testResult !== 'idle' && (
        <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
          testResult === 'success' 
            ? 'bg-[#F4F9F4] border-emerald-300 text-emerald-950' 
            : 'bg-[#FDF3F3] border-rose-300 text-rose-950'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-black/10">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl mt-0.5 ${testResult === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                {testResult === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm sm:text-base">
                    {testResult === 'success' ? 'SMTP Connection Successful' : 'SMTP Connection Failed'}
                  </h3>
                  {testDetails?.latencyMs && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/80 border border-emerald-200 text-emerald-800 font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {testDetails.latencyMs}ms
                    </span>
                  )}
                  {testDetails?.method && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/80 border border-black/10 text-[#5A5A40]">
                      {testDetails.method === 'virtual' ? 'Virtual Sandbox' : 'Live TCP Relay'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-black/70 mt-0.5">
                  {testResult === 'success' 
                    ? `Test verification message successfully delivered to configured sender address: ${testDetails?.recipient || form.fromEmail}`
                    : testDetails?.error || 'Could not establish connection with configured SMTP host.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {testDetails?.previewUrl && (
                <a
                  href={testDetails.previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-900 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Dispatched Test Email</span>
                </a>
              )}
              <button
                type="button"
                onClick={() => setTestResult('idle')}
                className="px-3 py-1.5 rounded-xl bg-black/5 hover:bg-black/10 text-xs font-semibold text-black/70 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>

          {/* Collapsible log view */}
          {testLogs.length > 0 && (
            <div className="mt-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-black/60 mb-1.5 flex items-center gap-1">
                <Terminal className="w-3 h-3" />
                <span>Socket Handshake & Deliverability Output:</span>
              </div>
              <div className="p-3 bg-[#1E1E1E] text-emerald-400 font-mono text-[11px] rounded-xl space-y-1 overflow-x-auto max-h-40 border border-black/20">
                {testLogs.map((log, i) => (
                  <div 
                    key={i} 
                    className={
                      log.startsWith('[ERROR]') || log.includes('Failed') || log.includes('rejected') 
                        ? 'text-rose-400 font-bold' 
                        : log.includes('successfully delivered') || log.includes('verified successfully') 
                        ? 'text-emerald-300 font-bold' 
                        : 'text-emerald-400'
                    }
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Provider Quick Presets */}
      <div className="bg-[#FDFBF7] p-4 rounded-2xl border border-[#E8E2D6] space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A7566] block">
          One-Click Provider Templates:
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#E8E2D6] hover:border-[#5A5A40] text-xs font-semibold text-[#3D3A30] hover:bg-[#F7F5EE] transition-colors"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Main Grid: Server Credentials & Sender Identity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* SMTP Host & Port Configuration */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E2D6] shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E8E2D6]">
              <Server className="w-4 h-4 text-[#5A5A40]" />
              <h3 className="font-bold text-sm text-[#3D3A30]">Connection Parameters</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#7A7566] mb-1">SMTP Host Server *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. smtp.sendgrid.net or smtp.gmail.com"
                  value={form.host}
                  onChange={(e) => setForm({ ...form, host: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7] font-mono text-xs text-[#3D3A30]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#7A7566] mb-1">Port *</label>
                  <input
                    type="number"
                    required
                    value={form.port}
                    onChange={(e) => setForm({ ...form, port: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7] font-mono text-xs text-[#3D3A30]"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.secure}
                      onChange={(e) => setForm({ ...form, secure: e.target.checked })}
                      className="rounded text-[#5A5A40] focus:ring-[#5A5A40]"
                    />
                    <span className="font-bold text-[#3D3A30]">SSL / TLS Mode</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#7A7566] mb-1">SMTP Username / API Key *</label>
                <input
                  type="text"
                  required
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7] font-mono text-xs text-[#3D3A30]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#7A7566] mb-1">SMTP Password / Secret Key *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password or App Password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7] font-mono text-xs text-[#3D3A30]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8576] hover:text-[#3D3A30]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#7A7566] mb-1">Outbound Hourly Rate Limit</label>
                <input
                  type="number"
                  value={form.rateLimitPerHour || 250}
                  onChange={(e) => setForm({ ...form, rateLimitPerHour: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7] text-xs text-[#3D3A30]"
                />
                <span className="text-[10px] text-[#8A8576] mt-0.5 block">
                  Prevents mail server throttling and IP blacklisting.
                </span>
              </div>
            </div>
          </div>

          {/* Sender Identity & Contact Routing */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E2D6] shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E8E2D6]">
              <Mail className="w-4 h-4 text-[#5A5A40]" />
              <h3 className="font-bold text-sm text-[#3D3A30]">Sender Header Identity</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#7A7566] mb-1">Display "From" Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Columbia Community Festival Operations"
                  value={form.fromName}
                  onChange={(e) => setForm({ ...form, fromName: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7] text-xs text-[#3D3A30]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#7A7566] mb-1">Sender "From" Email Address *</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="e.g. events@festivalmarket.org"
                    value={form.fromEmail}
                    onChange={(e) => {
                      setForm({ ...form, fromEmail: e.target.value });
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7] text-xs text-[#3D3A30]"
                  />
                </div>
                <span className="text-[10px] text-[#8A8576] mt-0.5 block">
                  This address is used as the authentic sender and default destination for connection tests.
                </span>
              </div>

              <div>
                <label className="block font-bold text-[#7A7566] mb-1">Reply-To Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. inquiries@festivalmarket.org"
                  value={form.replyToEmail}
                  onChange={(e) => setForm({ ...form, replyToEmail: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7] text-xs text-[#3D3A30]"
                />
                <span className="text-[10px] text-[#8A8576] mt-0.5 block">
                  Where exhibitor and attendee replies will be directed.
                </span>
              </div>

              {/* Dedicated Test SMTP Connection Card */}
              <div className="pt-3 border-t border-[#E8E2D6] space-y-3 bg-[#FAF8F5] p-3.5 rounded-xl border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-[#3D3A30] flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-600" /> Test SMTP Connection
                    </span>
                    <p className="text-[11px] text-[#7A7566] mt-0.5">
                      Sends a live verification message to <strong>{testRecipientEmail || form.fromEmail || 'configured sender'}</strong>
                    </p>
                  </div>

                  <button
                    type="button"
                    id="btn-card-test-smtp"
                    onClick={() => handleRunDiagnosticTest()}
                    disabled={isTesting}
                    className="px-4 py-2 rounded-xl bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-xs shrink-0"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                    <span>{isTesting ? 'Testing Socket...' : 'Test SMTP Connection'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-[#7A7566] mb-1">
                      Test Email Recipient Address:
                    </label>
                    <input
                      type="email"
                      placeholder={form.fromEmail || 'events@festivalmarket.org'}
                      value={testRecipientEmail}
                      onChange={(e) => setTestRecipientEmail(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#E8E2D6] bg-white text-xs text-[#3D3A30]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setTestRecipientEmail(form.fromEmail || '')}
                    className="px-2.5 py-1.5 mt-4 rounded-lg bg-white border border-[#E8E2D6] hover:bg-[#F0EBE0] text-[11px] font-semibold text-[#5A5A40] transition-colors"
                  >
                    Use Sender Address
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* DNS Anti-Spam Records (SPF, DKIM, DMARC) */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E2D6] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D6]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-sm text-[#3D3A30]">
                Domain Anti-Spam DNS Records (SPF, DKIM, DMARC)
              </h3>
            </div>
            <span className="text-xs text-[#8A8576]">Recommended for 99.9% Inbox Placement</span>
          </div>

          <p className="text-xs text-[#8A8576] leading-relaxed">
            Publish these standard TXT records in your domain's DNS provider (Cloudflare, GoDaddy, Namecheap, Google Domains) to authorize this mail server and prevent spoofing.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* SPF Record */}
            <div className="p-4 rounded-xl bg-[#FDFBF7] border border-[#E8E2D6] space-y-2">
              <div className="flex items-center justify-between font-bold text-[#3D3A30]">
                <span>1. SPF TXT Record</span>
                <button
                  type="button"
                  onClick={() => handleCopy('spf', form.spfRecord || 'v=spf1 include:sendgrid.net ~all')}
                  className="text-[#5A5A40] hover:underline flex items-center gap-1 text-[11px]"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedKey === 'spf' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-2.5 rounded bg-white border border-[#E8E2D6] font-mono text-[11px] break-all text-[#5A5A40]">
                {form.spfRecord || 'v=spf1 include:sendgrid.net ~all'}
              </div>
              <span className="text-[10px] text-[#8A8576] block">Host: @ &bull; Type: TXT</span>
            </div>

            {/* DKIM Record */}
            <div className="p-4 rounded-xl bg-[#FDFBF7] border border-[#E8E2D6] space-y-2">
              <div className="flex items-center justify-between font-bold text-[#3D3A30]">
                <span>2. DKIM Selector</span>
                <button
                  type="button"
                  onClick={() => handleCopy('dkim', form.dkimSelector || 's1._domainkey')}
                  className="text-[#5A5A40] hover:underline flex items-center gap-1 text-[11px]"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedKey === 'dkim' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-2.5 rounded bg-white border border-[#E8E2D6] font-mono text-[11px] break-all text-[#5A5A40]">
                {form.dkimSelector || 's1._domainkey.festivalmarket.org'}
              </div>
              <span className="text-[10px] text-[#8A8576] block">Host: s1._domainkey &bull; Type: CNAME/TXT</span>
            </div>

            {/* DMARC Record */}
            <div className="p-4 rounded-xl bg-[#FDFBF7] border border-[#E8E2D6] space-y-2">
              <div className="flex items-center justify-between font-bold text-[#3D3A30]">
                <span>3. DMARC Policy</span>
                <button
                  type="button"
                  onClick={() => handleCopy('dmarc', form.dmarcPolicy || 'v=DMARC1; p=quarantine; pct=100')}
                  className="text-[#5A5A40] hover:underline flex items-center gap-1 text-[11px]"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedKey === 'dmarc' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-2.5 rounded bg-white border border-[#E8E2D6] font-mono text-[11px] break-all text-[#5A5A40]">
                {form.dmarcPolicy || 'v=DMARC1; p=quarantine; pct=100'}
              </div>
              <span className="text-[10px] text-[#8A8576] block">Host: _dmarc &bull; Type: TXT</span>
            </div>
          </div>
        </div>

      </form>

    </div>
  );
}
