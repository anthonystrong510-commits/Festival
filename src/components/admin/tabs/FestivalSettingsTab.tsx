import React, { useState } from 'react';
import { 
  Settings, 
  MapPin, 
  Calendar, 
  Mail, 
  Save, 
  Check, 
  Database, 
  ShieldAlert, 
  Sparkles,
  Server,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Clock,
  Zap,
  ArrowRight,
  Globe,
  Search,
  FileCode,
  Copy
} from 'lucide-react';
import { FestivalConfigData, SmtpConfigData } from '../../../types';
import { safeFetchJson } from '../../../lib/apiUtils';

interface FestivalSettingsTabProps {
  config: FestivalConfigData;
  onSaveConfig: (config: FestivalConfigData) => void;
  onSeedData: () => void;
  isSeeding: boolean;
  smtpConfig?: SmtpConfigData;
  onNavigateToSmtp?: () => void;
}

export function FestivalSettingsTab({
  config,
  onSaveConfig,
  onSeedData,
  isSeeding,
  smtpConfig,
  onNavigateToSmtp
}: FestivalSettingsTabProps) {
  const [form, setForm] = useState<FestivalConfigData>({ ...config });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // SMTP Testing State inside settings
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);
  const [smtpTestResult, setSmtpTestResult] = useState<'idle' | 'success' | 'failure'>('idle');
  const [smtpTestDetails, setSmtpTestDetails] = useState<{
    recipient?: string;
    messageId?: string;
    previewUrl?: string;
    latencyMs?: number;
    error?: string;
  } | null>(null);

  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://www.skysevents.online';

  const handleAutoDetectDomain = () => {
    setForm(prev => ({
      ...prev,
      siteDomain: currentOrigin
    }));
  };

  const handleCopy = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedUrl(text);
      setTimeout(() => setCopiedUrl(null), 2500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      ...form,
      updatedAt: new Date().toISOString()
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleTestSmtpConnection = async () => {
    setIsTestingSmtp(true);
    setSmtpTestResult('idle');
    setSmtpTestDetails(null);

    const targetRecipient = (form.contactEmail || smtpConfig?.fromEmail || 'events@festivalmarket.org').trim();

    try {
      const data = await safeFetchJson('/api/test-smtp', {
        method: 'POST',
        body: JSON.stringify({
          host: smtpConfig?.host,
          port: smtpConfig?.port,
          secure: smtpConfig?.secure,
          username: smtpConfig?.username,
          password: smtpConfig?.password,
          fromEmail: smtpConfig?.fromEmail || form.contactEmail,
          fromName: smtpConfig?.fromName || form.name,
          recipientEmail: targetRecipient
        })
      });

      if (data.success) {
        setSmtpTestResult('success');
        setSmtpTestDetails({
          recipient: data.recipient || targetRecipient,
          messageId: data.messageId,
          previewUrl: data.previewUrl,
          latencyMs: data.latencyMs
        });
      } else {
        setSmtpTestResult('failure');
        setSmtpTestDetails({
          recipient: data.recipient || targetRecipient,
          error: data.error || 'Connection to mail server failed.'
        });
      }
    } catch (err: any) {
      setSmtpTestResult('failure');
      setSmtpTestDetails({
        recipient: targetRecipient,
        error: `Could not reach SMTP service: ${err.message || err}`
      });
    } finally {
      setIsTestingSmtp(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E2D6] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-[#3D3A30] text-lg sm:text-xl">
            Festival Core Settings & Identity
          </h2>
          <p className="text-xs text-[#8A8576] mt-0.5">
            Update the public festival branding, location grounds, admission policies, and contact information.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleTestSmtpConnection}
            disabled={isTestingSmtp}
            className="px-4 py-2.5 rounded-xl bg-[#F7F5EE] hover:bg-[#EAE4D6] text-[#5A5A40] border border-[#D5CEBF] text-xs font-bold flex items-center gap-2 transition-all shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTestingSmtp ? 'animate-spin text-[#5A5A40]' : ''}`} />
            <span>{isTestingSmtp ? 'Testing Socket...' : 'Test SMTP Connection'}</span>
          </button>

          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
          >
            {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saveSuccess ? 'Saved to Firestore!' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Immediate SMTP Connection Feedback if tested from settings */}
      {smtpTestResult !== 'idle' && (
        <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
          smtpTestResult === 'success' 
            ? 'bg-[#F4F9F4] border-emerald-300 text-emerald-950' 
            : 'bg-[#FDF3F3] border-rose-300 text-rose-950'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl mt-0.5 ${smtpTestResult === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                {smtpTestResult === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm">
                    {smtpTestResult === 'success' ? 'SMTP Connection Operational' : 'SMTP Connection Error'}
                  </h3>
                  {smtpTestDetails?.latencyMs && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/80 border border-emerald-200 text-emerald-800 font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {smtpTestDetails.latencyMs}ms
                    </span>
                  )}
                </div>
                <p className="text-xs text-black/70 mt-0.5">
                  {smtpTestResult === 'success' 
                    ? `Live test verification email successfully delivered to sender address (${smtpTestDetails?.recipient})`
                    : smtpTestDetails?.error}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {smtpTestDetails?.previewUrl && (
                <a
                  href={smtpTestDetails.previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-900 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Test Email</span>
                </a>
              )}
              {onNavigateToSmtp && (
                <button
                  type="button"
                  onClick={onNavigateToSmtp}
                  className="px-3.5 py-1.5 rounded-xl bg-[#5A5A40] text-white text-xs font-bold flex items-center gap-1 hover:bg-[#464632] transition-colors"
                >
                  <span>SMTP Settings</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setSmtpTestResult('idle')}
                className="px-3 py-1.5 rounded-xl bg-black/5 hover:bg-black/10 text-xs font-semibold text-black/70 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Basic Brand Identity */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E2D6] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E8E2D6]">
            <Sparkles className="w-4 h-4 text-[#5A5A40]" />
            <h3 className="font-bold text-sm text-[#3D3A30]">Brand & Display Headers</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#7A7566] mb-1">Full Event Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#7A7566] mb-1">Short Brand Name</label>
              <input
                type="text"
                value={form.shortName}
                onChange={(e) => setForm({ ...form, shortName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#7A7566] mb-1">Hero Headline Banner</label>
              <input
                type="text"
                value={form.heroHeadline}
                onChange={(e) => setForm({ ...form, heroHeadline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#7A7566] mb-1">Edition Subtitle</label>
              <input
                type="text"
                value={form.edition}
                onChange={(e) => setForm({ ...form, edition: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-[#7A7566] mb-1">Tagline</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-[#7A7566] mb-1">Festival Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7]"
              />
            </div>
          </div>
        </div>

        {/* Location & Grounds & Sender Contact */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E2D6] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E8E2D6]">
            <MapPin className="w-4 h-4 text-[#5A5A40]" />
            <h3 className="font-bold text-sm text-[#3D3A30]">Venue Grounds & Contact Routing</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#7A7566] mb-1">Venue Grounds Name</label>
              <input
                type="text"
                value={form.venueName}
                onChange={(e) => setForm({ ...form, venueName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#7A7566] mb-1">Street Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#7A7566] mb-1">City, State & Region</label>
              <input
                type="text"
                value={form.cityState}
                onChange={(e) => setForm({ ...form, cityState: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#7A7566] mb-1">Organizer Contact & Sender Email</label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7]"
              />
            </div>
          </div>

          {/* Quick SMTP Connection Card */}
          <div className="mt-4 p-4 rounded-xl bg-[#FDFBF7] border border-[#E8E2D6] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white border border-[#E8E2D6] text-[#5A5A40]">
                <Server className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-[#3D3A30] flex items-center gap-1.5">
                  <span>Outbound SMTP Mail Relay:</span>
                  <span className="font-mono text-[#5A5A40] text-[11px] font-normal">
                    {smtpConfig?.host || 'smtp.sendgrid.net'}:{smtpConfig?.port || 587}
                  </span>
                </div>
                <p className="text-[11px] text-[#7A7566]">
                  Sender: {smtpConfig?.fromEmail || form.contactEmail || 'events@festivalmarket.org'}
                </p>
              </div>
            </div>

            <button
              type="button"
              id="btn-settings-test-smtp"
              onClick={handleTestSmtpConnection}
              disabled={isTestingSmtp}
              className="px-4 py-2 rounded-xl bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-xs shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTestingSmtp ? 'animate-spin' : ''}`} />
              <span>{isTestingSmtp ? 'Testing Socket...' : 'Test SMTP Connection'}</span>
            </button>
          </div>
        </div>

        {/* Advanced SEO, Domain & Sitemap Management */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E2D6] shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8E2D6]">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#3D3A30]">SEO, Canonical Domain & Sitemap Routing</h3>
                <p className="text-xs text-[#7A7566]">
                  Configure production domain for Google Search Console, OpenGraph cards, and XML sitemaps.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAutoDetectDomain}
                className="px-3 py-1.5 rounded-lg bg-[#F0EBE0] hover:bg-[#EAE4D6] text-[#5A5A40] text-xs font-bold flex items-center gap-1.5 transition-colors border border-[#E8E2D6]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Auto-Detect Current URL</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Canonical Site Domain */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#3D3A30] mb-1">
                Canonical Site Domain (for Google Search Console & Sitemaps)
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7A7566]">
                    <Globe className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    value={form.siteDomain || ''}
                    onChange={(e) => setForm({ ...form, siteDomain: e.target.value })}
                    placeholder="https://www.skysevents.online"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7] text-xs font-mono text-[#3D3A30] focus:border-[#5A5A40] outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(form.siteDomain || currentOrigin)}
                  className="px-3 py-2 rounded-xl border border-[#E8E2D6] bg-white hover:bg-[#FDFBF7] text-xs text-[#5A5A40] font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedUrl === (form.siteDomain || currentOrigin) ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-[11px] text-[#7A7566] mt-1">
                Enter your live domain (e.g. <code className="bg-stone-100 px-1 py-0.5 rounded text-[#5A5A40]">https://www.skysevents.online</code>). All sitemaps, canonical tags, and JSON-LD schemas automatically reflect this origin.
              </p>
            </div>

            {/* SEO Page Title */}
            <div>
              <label className="block text-xs font-bold text-[#3D3A30] mb-1">
                Public SEO Title (&lt;title&gt; & og:title)
              </label>
              <input
                type="text"
                value={form.seoTitle || ''}
                onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                placeholder="Community Vendor Marketplace & Festival Expo"
                className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7] text-xs text-[#3D3A30] focus:border-[#5A5A40] outline-none"
              />
              <p className="text-[10px] text-[#7A7566] mt-1">Ideal length: 40–60 characters.</p>
            </div>

            {/* SEO Description */}
            <div>
              <label className="block text-xs font-bold text-[#3D3A30] mb-1">
                Meta Description (Search Engine Snippet)
              </label>
              <input
                type="text"
                value={form.seoDescription || ''}
                onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
                placeholder="Premier 3-day community vendor marketplace, artisan fair, live music concerts, and nationwide 50 states directory."
                className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7] text-xs text-[#3D3A30] focus:border-[#5A5A40] outline-none"
              />
              <p className="text-[10px] text-[#7A7566] mt-1">Ideal length: 120–160 characters.</p>
            </div>

            {/* General SEO Keywords */}
            <div>
              <label className="block text-xs font-bold text-[#3D3A30] mb-1">
                General Marketplace Keywords (comma separated)
              </label>
              <textarea
                rows={2}
                value={form.seoKeywords || ''}
                onChange={(e) => setForm({ ...form, seoKeywords: e.target.value })}
                placeholder="community marketplace, artisan craft festival, food truck rally, farmers market, vendor application, live concert festival, 50 states directory"
                className="w-full px-3 py-2 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7] text-xs text-[#3D3A30] focus:border-[#5A5A40] outline-none font-mono"
              />
            </div>
          </div>

          {/* Quick Sitemap Links & Live Verification */}
          <div className="pt-2 border-t border-[#E8E2D6]">
            <h4 className="text-xs font-bold text-[#3D3A30] mb-2 flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-[#5A5A40]" />
              <span>Sitemap Files (Guaranteed application/xml Headers & No HTML Rewriting):</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { name: 'Sitemap Index', path: '/sitemap_index.xml', desc: 'Combined index of all sub-sitemaps' },
                { name: 'Main Sitemap', path: '/sitemap.xml', desc: '50 States & Directory URLs' },
                { name: 'Robots.txt', path: '/robots.txt', desc: 'Search engine crawler rules' }
              ].map((sm) => {
                const targetUrl = `${form.siteDomain || currentOrigin}${sm.path}`;
                return (
                  <div key={sm.path} className="p-3 rounded-xl border border-[#E8E2D6] bg-[#FDFBF7] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-bold text-xs text-[#3D3A30]">{sm.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                          XML
                        </span>
                      </div>
                      <p className="text-[11px] text-[#7A7566] mb-2">{sm.desc}</p>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      <a
                        href={sm.path}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 px-2.5 py-1.5 rounded-lg bg-white border border-[#E8E2D6] hover:bg-[#F0EBE0] text-[#5A5A40] text-[11px] font-medium flex items-center justify-center gap-1 transition-colors"
                      >
                        <span>Open {sm.path}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopy(targetUrl)}
                        title="Copy full URL for Search Console"
                        className="p-1.5 rounded-lg bg-white border border-[#E8E2D6] hover:bg-[#F0EBE0] text-[#7A7566] transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Search Console Instructions Card */}
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-950 space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-amber-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>How Google Search Console "Sitemap is HTML" Was Solved:</span>
            </div>
            <ol className="list-decimal pl-5 space-y-1 text-amber-900/90 text-[11px] leading-relaxed">
              <li>
                <strong>Vercel Routing Bypass</strong>: Configured <code className="bg-amber-100 px-1 py-0.5 rounded">vercel.json</code> to route all sitemaps directly with <code className="bg-amber-100 px-1 py-0.5 rounded">application/xml; charset=utf-8</code> headers and excluded them from the SPA <code className="bg-amber-100 px-1 py-0.5 rounded">index.html</code> rewrite.
              </li>
              <li>
                <strong>Dynamic Host Resolution</strong>: Added server-side endpoints in <code className="bg-amber-100 px-1 py-0.5 rounded">/api/sitemap</code> and <code className="bg-amber-100 px-1 py-0.5 rounded">server.ts</code> so requests to <code className="bg-amber-100 px-1 py-0.5 rounded">https://www.skysevents.online/sitemap.xml</code> output matching XML tags.
              </li>
              <li>
                <strong>Search Console Action</strong>: In Google Search Console, under <em>Sitemaps</em>, enter <code className="bg-white font-mono px-1.5 py-0.5 rounded border border-amber-300 font-bold">sitemap_index.xml</code> or <code className="bg-white font-mono px-1.5 py-0.5 rounded border border-amber-300 font-bold">sitemap.xml</code> and click <strong>Submit</strong>.
              </li>
            </ol>
          </div>
        </div>

        {/* Database & Demo Tools */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E2D6] shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E8E2D6]">
            <Database className="w-4 h-4 text-[#5A5A40]" />
            <h3 className="font-bold text-sm text-[#3D3A30]">Database Maintenance & Seeding</h3>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 text-xs">
            <div>
              <h4 className="font-bold text-[#3D3A30]">Seed Sample Operational Data</h4>
              <p className="text-[#8A8576] text-[11px] mt-0.5">
                Populates sample vendor applications, registered RSVPs, and default email templates in Firestore.
              </p>
            </div>

            <button
              type="button"
              onClick={onSeedData}
              disabled={isSeeding}
              className="px-4 py-2 rounded-xl bg-[#F7F5EE] hover:bg-[#EAE4D6] text-[#5A5A40] border border-[#E8E2D6] font-bold flex items-center gap-2 transition-colors disabled:opacity-50 shrink-0"
            >
              <Database className="w-4 h-4" />
              <span>{isSeeding ? 'Writing to Firestore...' : 'Seed Sample Data'}</span>
            </button>
          </div>
        </div>

      </form>

    </div>
  );
}
