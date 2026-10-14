// src/components/analysis/AnalysisResult.jsx
// Reusable analysis result display — receives real backend data in Phase 2.
import { CheckCircle, AlertTriangle, XCircle, AlertOctagon, ChevronRight, Clock, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import { RiskBadge } from '../ui/Badge';
import { RiskScoreGauge } from '../ui/RiskScoreGauge';
import { Card } from '../ui/Card';
import { format } from 'date-fns';

const RISK_ICONS = {
  low:      { Icon: CheckCircle,  bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-600' },
  medium:   { Icon: AlertTriangle, bg: 'bg-amber-50', border: 'border-amber-200',  text: 'text-amber-600' },
  high:     { Icon: XCircle,      bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-600' },
  critical: { Icon: AlertOctagon, bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600' },
};

const ACTION_STYLES = {
  low:      'bg-green-50  border-green-200  text-green-800',
  medium:   'bg-amber-50  border-amber-200  text-amber-800',
  high:     'bg-red-50    border-red-200    text-red-800',
  critical: 'bg-purple-50 border-purple-200 text-purple-800',
};

/**
 * @param {object} result  — shape produced by analysisService.js
 * @param {function} onNewScan — callback to clear result and start fresh
 */
export function AnalysisResult({ result, onNewScan }) {
  if (!result) return null;

  const {
    riskLevel = 'low',
    riskScore = 0,
    threatCategory = '—',
    indicators = [],
    explanation = '',
    recommendedAction = '',
    caseId = '—',
    type = 'message',
    input = '',
    analyzedAt,
    processingTimeMs,
  } = result;

  const cfg        = RISK_ICONS[riskLevel] || RISK_ICONS.low;
  const { Icon }   = cfg;
  const formattedDate = analyzedAt ? format(new Date(analyzedAt), 'MMM d, yyyy — HH:mm:ss') : '—';

  return (
    <div className="animate-slide-up space-y-4">
      {/* Header card */}
      <Card className={clsx('border', cfg.border, cfg.bg)}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', cfg.bg)}>
              <Icon className={clsx('w-5 h-5', cfg.text)} aria-hidden />
            </div>
            <div>
              <RiskBadge risk={riskLevel} className="mb-1" />
              <h2 className="text-lg font-bold text-surface-900">{threatCategory}</h2>
            </div>
          </div>
          <RiskScoreGauge score={riskScore} riskLevel={riskLevel} className="sm:w-64" />
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Indicators */}
        <Card>
          <h3 className="text-sm font-semibold text-surface-700 mb-3">Detected Indicators</h3>
          {indicators.length === 0 ? (
            <p className="text-sm text-surface-400">No indicators found.</p>
          ) : (
            <ul className="space-y-2">
              {indicators.map((ind, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-surface-700">
                  <ChevronRight className={clsx('w-4 h-4 mt-0.5 shrink-0', cfg.text)} aria-hidden />
                  {ind}
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Explanation */}
        <Card>
          <h3 className="text-sm font-semibold text-surface-700 mb-3">Analysis Explanation</h3>
          <p className="text-sm text-surface-600 leading-relaxed">{explanation || '—'}</p>

          <div className="mt-4 pt-4 border-t border-surface-100 flex flex-wrap gap-4 text-xs text-surface-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {formattedDate}
            </span>
            {processingTimeMs && (
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> {processingTimeMs} ms
              </span>
            )}
            <span>Case ID: <code className="font-mono">{caseId}</code></span>
          </div>
        </Card>
      </div>

      {/* Recommended action */}
      <div className={clsx('rounded-xl border p-4 flex gap-3', ACTION_STYLES[riskLevel])}>
        <Icon className="w-5 h-5 shrink-0 mt-0.5" aria-hidden />
        <div>
          <p className="text-sm font-semibold mb-0.5">Recommended Action</p>
          <p className="text-sm">{recommendedAction || '—'}</p>
        </div>
      </div>

      {/* Input preview */}
      <Card padding={false}>
        <details>
          <summary className="px-5 py-3 cursor-pointer text-sm font-medium text-surface-600 hover:text-surface-800 select-none">
            {type === 'url' ? '🔗 Analyzed URL' : '📧 Analyzed Message'} (click to expand)
          </summary>
          <div className="px-5 pb-4 pt-1">
            <pre className="text-xs font-mono text-surface-600 bg-surface-50 rounded-lg p-3 whitespace-pre-wrap break-all">
              {input}
            </pre>
          </div>
        </details>
      </Card>

      {/* New scan button */}
      {onNewScan && (
        <div className="text-center pt-2">
          <button onClick={onNewScan} className="btn-secondary btn">
            Run Another Analysis
          </button>
        </div>
      )}
    </div>
  );
}
