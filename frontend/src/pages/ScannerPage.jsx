// src/pages/ScannerPage.jsx
import { useState, useRef } from 'react';
import { MessageSquare, Link2, X, Lightbulb, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';
import { PageLayout, PageHeader } from '../components/layout/PageLayout';
import { Button } from '../components/ui/Button';
import { Textarea, Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { AnalysisResult } from '../components/analysis/AnalysisResult';
import { analyzeMessage, analyzeUrl } from '../services/analysisService';

/* ── Example content ────────────────────────────────────────────── */
const EXAMPLE_MESSAGE =
  'URGENT: Your bank account has been suspended due to suspicious activity. ' +
  'Verify your identity immediately to avoid permanent closure: ' +
  'http://secure-bankverify.xyz/confirm?token=abc123. Do NOT ignore this message.';

const EXAMPLE_URL = 'http://amaz0n-prize-winner.com/claim?id=WINNER2024&promo=FREE';

const MAX_MESSAGE_LENGTH = 2000;

/* ── Tab types ──────────────────────────────────────────────────── */
const TABS = [
  { id: 'message', label: 'Message Scanner', icon: MessageSquare },
  { id: 'url',     label: 'URL Scanner',     icon: Link2 },
];

export default function ScannerPage() {
  const [activeTab, setActiveTab] = useState('message');
  const [message,   setMessage]   = useState('');
  const [url,       setUrl]       = useState('');
  const [loading,   setLoading]   = useState(false);
  const [result,    setResult]    = useState(null);
  const [error,     setError]     = useState('');
  const resultRef                 = useRef(null);

  /* ── Handlers ───────────────────────────────────────────────── */
  function handleTabChange(tab) {
    setActiveTab(tab);
    setResult(null);
    setError('');
  }

  function handleClear() {
    if (activeTab === 'message') setMessage('');
    else setUrl('');
    setResult(null);
    setError('');
  }

  function handleExample() {
    if (activeTab === 'message') setMessage(EXAMPLE_MESSAGE);
    else setUrl(EXAMPLE_URL);
    setResult(null);
    setError('');
  }

  async function handleAnalyze() {
    const input = activeTab === 'message' ? message.trim() : url.trim();

    if (!input) {
      setError(activeTab === 'message' ? 'Please enter a message to analyze.' : 'Please enter a URL to analyze.');
      return;
    }

    if (activeTab === 'url') {
      try { new URL(input); } catch {
        setError('Please enter a valid URL (e.g. https://example.com).');
        return;
      }
    }

    setError('');
    setLoading(true);
    setResult(null);

    try {
      const data = activeTab === 'message'
        ? await analyzeMessage(input)
        : await analyzeUrl(input);

      setResult(data);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      toast.success('Analysis complete');
    } catch (err) {
      const msg = err?.message || 'Analysis failed. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  const isMessage   = activeTab === 'message';
  const inputEmpty  = isMessage ? !message.trim() : !url.trim();

  return (
    <PageLayout>
      <PageHeader
        title="Threat Scanner"
        description="Analyze suspicious messages, emails, SMS, and URLs for scams and phishing."
      />

      <div className="page-container py-8 space-y-6">

        {/* Tab switcher */}
        <div className="flex gap-1 bg-surface-100 p-1 rounded-xl w-fit" role="tablist" aria-label="Scanner mode">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              role="tab"
              id={`tab-${id}`}
              aria-selected={activeTab === id}
              aria-controls={`panel-${id}`}
              onClick={() => handleTabChange(id)}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                activeTab === id
                  ? 'bg-white text-brand-700 shadow-card'
                  : 'text-surface-500 hover:text-surface-700',
              )}
            >
              <Icon className="w-4 h-4" aria-hidden />
              {label}
            </button>
          ))}
        </div>

        {/* Scanner form */}
        <div
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
        >
          <Card className="space-y-4">
            {isMessage ? (
              /* Message input */
              <div className="space-y-1.5">
                <label htmlFor="message-input" className="text-sm font-medium text-surface-700">
                  Message Content
                </label>
                <textarea
                  id="message-input"
                  value={message}
                  onChange={(e) => { setMessage(e.target.value); setError(''); }}
                  placeholder="Paste a suspicious email, SMS, or chat message here…"
                  rows={8}
                  maxLength={MAX_MESSAGE_LENGTH}
                  className={clsx('input resize-y min-h-[180px]', error && 'input-error')}
                  aria-describedby={error ? 'message-error' : 'message-hint'}
                />
                <div className="flex items-center justify-between">
                  <span id="message-hint" className="text-xs text-surface-400">
                    {message.length.toLocaleString()} / {MAX_MESSAGE_LENGTH.toLocaleString()} characters
                  </span>
                </div>
              </div>
            ) : (
              /* URL input */
              <Input
                id="url-input"
                label="URL to Analyze"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setError(''); }}
                placeholder="https://example-suspicious-site.com/page?param=value"
                type="url"
                error={error}
                hint="Enter the full URL including https:// or http://"
                aria-describedby={error ? 'url-error' : 'url-hint'}
              />
            )}

            {/* Error display */}
            {error && (
              <div
                id={isMessage ? 'message-error' : 'url-error'}
                role="alert"
                className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0" aria-hidden />
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button
                id="analyze-btn"
                variant="primary"
                size="lg"
                loading={loading}
                disabled={inputEmpty}
                onClick={handleAnalyze}
              >
                {loading ? 'Analyzing…' : 'Analyze'}
              </Button>

              <Button
                id="clear-btn"
                variant="secondary"
                size="lg"
                disabled={inputEmpty || loading}
                onClick={handleClear}
              >
                <X className="w-4 h-4" />
                Clear
              </Button>

              <button
                id="example-btn"
                type="button"
                onClick={handleExample}
                disabled={loading}
                className="btn-ghost btn gap-1.5 text-sm"
              >
                <Lightbulb className="w-4 h-4 text-amber-500" />
                Load Example
              </button>
            </div>
          </Card>
        </div>

        {/* Loading state */}
        {loading && (
          <Card className="text-center py-10 animate-fade-in">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
              </div>
              <div>
                <p className="font-semibold text-surface-700">Analyzing {isMessage ? 'message' : 'URL'}…</p>
                <p className="text-sm text-surface-400 mt-0.5">
                  Checking for suspicious patterns, indicators, and threat signatures
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Result */}
        {result && !loading && (
          <div ref={resultRef} className="scroll-mt-20">
            <h2 className="text-base font-semibold text-surface-700 mb-4">Analysis Report</h2>
            <AnalysisResult result={result} onNewScan={handleClear} />
          </div>
        )}

        {/* Tips */}
        {!result && !loading && (
          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="bg-surface-50 border-dashed">
              <div className="flex gap-3">
                <MessageSquare className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" aria-hidden />
                <div>
                  <p className="text-sm font-semibold text-surface-700 mb-1">What to scan</p>
                  <ul className="text-sm text-surface-500 space-y-1">
                    <li>• Suspicious emails or SMS</li>
                    <li>• Social media DMs</li>
                    <li>• Prize notification messages</li>
                    <li>• Urgent account alert messages</li>
                  </ul>
                </div>
              </div>
            </Card>
            <Card className="bg-surface-50 border-dashed">
              <div className="flex gap-3">
                <Link2 className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" aria-hidden />
                <div>
                  <p className="text-sm font-semibold text-surface-700 mb-1">URL tips</p>
                  <ul className="text-sm text-surface-500 space-y-1">
                    <li>• Include the full URL with protocol</li>
                    <li>• Don't click — just copy and paste</li>
                    <li>• Shortened URLs can also be analyzed</li>
                    <li>• Check links before sharing</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
