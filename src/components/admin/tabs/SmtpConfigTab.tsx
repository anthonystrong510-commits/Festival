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
  HelpCircle
} from 'lucide-react';
import { SmtpConfigData } from '../../../types';
import { generateDnsSpfRecord, generateDmarcRecord } from '../../../lib/antiSpamUtils';

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
    }
  }, [config]);

  // Diagnostic Test State
  const [isTesting, setIsTesting] = useState(false);
  const [testLogs, setTestLogs] = useState<string[]>([]);
  const [testResult, setTestResult] = useState<'idle' | 'success' | 'failure'>('idle');
  const [testRecipientEmail, setTestRecipientEmail] = useState(config?.fromEmail || '');

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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      ...form,
      updatedAt: new Date().toISOString()
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleRunDiagnosticTest = async () => {
    setIsTesting(true);
    setTestResult('idle');
    setTestLogs([
      `[1/4] Dispatching live test payload to /api/test-smtp...`,
      `Target Gateway: ${form.host}:${form.port} | User: "${form.username}"`
    ]);

    try {
      const res = await fetch('/api/test-smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: form.host,
          port: form.port,
          secure: form.secure,
          username: form.username,
          password: form.password,
          fromEmail: form.fromEmail,
          fromName: form.fromName,
          recipientEmail: testRecipientEmail.trim() || undefined
        })
      });

      const data = await res.json();
      if (data.logs && Array.isArray(data.logs)) {
        setTestLogs(data.logs);
      }

      if (data.success) {
        setTestResult('success');
      } else {
        setTestResult('failure');
      }
    } catch (err: any) {
      setTestLogs(prev => [
        ...prev,
        `[Network Error] Could not reach SMTP backend service: ${err.message || err}`
      ]);
      setTestResult('failure');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
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

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
        >
          {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{saveSuccess ? 'Saved to Firestore!' : 'Save Configuration'}</span>
        </button>
      </div>

      {/* Provider Quick Presets */}
      <div className="bg-[#FDFBF7] p-4 rounded-2xl border border-[#E8E2D6] space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A7566] block">
          One-Click Provider Templates:
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
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
                  placeholder="e.g. smtp.sendgrid.net"
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
                    required
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
                  placeholder="e.g. Community Festival Operations"
                  value={form.fromName}
                  onChange={(e) => setForm({ ...form, fromName: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7] text-xs text-[#3D3A30]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#7A7566] mb-1">Sender "From" Email *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. events@festivalmarket.org"
                  value={form.fromEmail}
                  onChange={(e) => setForm({ ...form, fromEmail: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7] text-xs text-[#3D3A30]"
                />
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

              {/* Server Test Box */}
              <div className="pt-3 border-t border-[#E8E2D6] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#3D3A30]">Live Socket & Relay Diagnostic:</span>
                  <div className="flex items-center gap-2">
                    {testResult === 'success' && (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" /> Socket Operational
                      </span>
                    )}
                    {testResult === 'failure' && (
                      <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Connection Check Failed
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={handleRunDiagnosticTest}
                      disabled={isTesting}
                      className="px-3.5 py-1.5 rounded-xl bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                      <span>{isTesting ? 'Testing Socket...' : 'Test Connection & Send Email'}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#7A7566] mb-1">
                    Send Live Verification Test To (Optional):
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email (e.g. muokltd@gmail.com) to receive live test message"
                    value={testRecipientEmail}
                    onChange={(e) => setTestRecipientEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-white text-xs text-[#3D3A30]"
                  />
                </div>

                {testLogs.length > 0 && (
                  <div className="p-3.5 bg-[#1E1E1E] text-emerald-400 font-mono text-[11px] rounded-xl space-y-1.5 overflow-x-auto max-h-48">
                    {testLogs.map((log, i) => (
                      <div 
                        key={i} 
                        className={log.startsWith('[ERROR]') || log.includes('Failed') ? 'text-rose-400 font-bold' : log.includes('successfully delivered') || log.includes('verified successfully') ? 'text-emerald-300 font-bold' : 'text-emerald-400'}
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                )}
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
