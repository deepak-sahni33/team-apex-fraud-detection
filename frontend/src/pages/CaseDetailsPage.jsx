import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MessageSquare, Link2, Calendar, Clock, Cpu,
  ChevronRight, Copy, CheckCheck,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { PageLayout } from '../components/layout/PageLayout';
import { RiskBadge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { RiskScoreGauge } from '../components/ui/RiskScoreGauge';
import { EmptyState } from '../components/ui/EmptyState';
import { DEMO_CASES } from '../data/demoData';
import { ROUTES } from '../config/routes';
import { fetchCase } from '../services/analysisService';

const RISK_ACTION_STYLES = {
  low:      'bg-green-50  border-green-200  text-green-800',
  medium:   'bg-amber-50  border-amber-200  text-amber-800',
  high:     'bg-red-50    border-red-200    text-red-800',
  critical: 'bg-purple-50 border-purple-200 text-purple-800',
};

export default function CaseDetailsPage() {
  const { caseId }    = useParams();
  const navigate      = useNavigate();
  const [copied, setCopied] = useState(false);
  const [activeCase, setActiveCase] = useState(() => DEMO_CASES.find((d) => d.caseId === caseId) || null);

  useEffect(() => {
    let isCurrent = true;
    if (caseId) {
      fetchCase(caseId).then((found) => {
        if (isCurrent && found) {
          setActiveCase(found);
        }
      });
    }
    return () => {
      isCurrent = false;
    };
  }, [caseId]);

  const c = activeCase || DEMO_CASES.find((d) => d.caseId === caseId);

  function handleCopy() {
    if (!c) return;
    navigator.clipboard.writeText(c.input).then(() => {
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (!c) {
    return (
      <PageLayout>
        <div className="page-container py-16">
          <EmptyState
            title="Case not found"
            description={`No case exists with ID "${caseId}". It may have been deleted or the ID is incorrect.`}
            action={
              <Link to={ROUTES.HISTORY} className="btn-primary btn">
                Back to History
              </Link>
            }
          />
        </div>
      </PageLayout>
    );
  }

  const formattedDate = format(new Date(c.analyzedAt), 'MMMM d, yyyy — HH:mm:ss');

  return (
    <PageLayout>
      {/* Sub-header */}
      <div className="bg-white border-b border-surface-200">
        <div className="page-container py-5">
          <button
            onClick={() => navigate(-1)}
            className="btn-ghost btn btn-sm gap-1.5 mb-4 -ml-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <RiskBadge risk={c.riskLevel} />
                <span className="badge-gray">
                  {c.type === 'message'
                    ? <><MessageSquare className="w-3 h-3 inline mr-1" />Message</>
                    : <><Link2 className="w-3 h-3 inline mr-1" />URL</>}
                </span>
              </div>
              <h1 className="text-xl font-bold text-surface-900">{c.threatCategory}</h1>
              <code className="text-xs text-surface-400 font-mono mt-0.5 block">{c.caseId}</code>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link to={ROUTES.SCANNER} className="btn-primary btn text-sm">
                Scan Another
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container py-8 space-y-5">

        {/* ── Top row: score + meta ─────────────────────────────── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Risk score */}
          <Card>
            <RiskScoreGauge score={c.riskScore} riskLevel={c.riskLevel} />
          </Card>

          {/* Case meta */}
          <Card className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-surface-700 mb-3">Case Metadata</h3>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {[
                { label: 'Case ID',         value: <code className="font-mono text-xs">{c.caseId}</code> },
                { label: 'Analysis Type',   value: <span className="capitalize">{c.type}</span> },
                { label: 'Threat Category', value: c.threatCategory },
                { label: 'Risk Level',      value: <RiskBadge risk={c.riskLevel} /> },
                { label: 'Risk Score',      value: <span className="font-bold">{c.riskScore} / 100</span> },
                { label: 'Model Version',   value: <code className="font-mono text-xs">{c.modelVersion}</code> },
                {
                  label: 'Analyzed At',
                  value: (
                    <span className="flex items-center gap-1 text-xs text-surface-500">
                      <Calendar className="w-3.5 h-3.5" />
                      {formattedDate}
                    </span>
                  ),
                },
                {
                  label: 'Processing Time',
                  value: (
                    <span className="flex items-center gap-1 text-xs text-surface-500">
                      <Clock className="w-3.5 h-3.5" />
                      {c.processingTimeMs} ms
                    </span>
                  ),
                },
              ].map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-xs text-surface-400 font-medium mb-0.5">{label}</dt>
                  <dd className="text-surface-800">{value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>

        {/* ── Indicators + Explanation ─────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-5">
          <Card>
            <h3 className="text-sm font-semibold text-surface-700 mb-3">
              Detected Indicators <span className="text-surface-400 font-normal">({c.indicators.length})</span>
            </h3>
            <ul className="space-y-2">
              {c.indicators.map((ind, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-surface-700">
                  <ChevronRight className="w-4 h-4 mt-0.5 shrink-0 text-brand-500" aria-hidden />
                  {ind}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-surface-700 mb-3">Analysis Explanation</h3>
            <p className="text-sm text-surface-600 leading-relaxed">{c.explanation}</p>
          </Card>
        </div>

        {/* ── Recommended Action ────────────────────────────────── */}
        <div className={`rounded-xl border p-5 ${RISK_ACTION_STYLES[c.riskLevel]}`}>
          <p className="text-sm font-bold mb-1">⚡ Recommended Action</p>
          <p className="text-sm">{c.recommendedAction}</p>
        </div>

        {/* ── Original Input ────────────────────────────────────── */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-surface-700">
              {c.type === 'url' ? '🔗 Analyzed URL' : '📧 Analyzed Content'}
            </h3>
            <button
              onClick={handleCopy}
              className="btn-ghost btn btn-sm gap-1.5 text-xs"
              aria-label="Copy to clipboard"
            >
              {copied
                ? <><CheckCheck className="w-3.5 h-3.5 text-green-600" /> Copied</>
                : <><Copy className="w-3.5 h-3.5" /> Copy</>}
            </button>
          </div>
          <pre className="text-xs font-mono text-surface-600 bg-surface-50 rounded-lg p-4 whitespace-pre-wrap break-all leading-relaxed scrollbar-thin max-h-48 overflow-auto">
            {c.input}
          </pre>
        </Card>

      </div>
    </PageLayout>
  );
}
