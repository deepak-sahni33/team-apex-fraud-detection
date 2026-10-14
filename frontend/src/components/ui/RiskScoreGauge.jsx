// src/components/ui/RiskScoreGauge.jsx
// Visual risk score display with colour-coded fill bar.
import { clsx } from 'clsx';

const RISK_CONFIG = {
  low:      { color: 'bg-green-500',  text: 'text-green-700',  label: 'Low Risk' },
  medium:   { color: 'bg-amber-500',  text: 'text-amber-700',  label: 'Medium Risk' },
  high:     { color: 'bg-red-500',    text: 'text-red-700',    label: 'High Risk' },
  critical: { color: 'bg-purple-600', text: 'text-purple-700', label: 'Critical Risk' },
};

export function RiskScoreGauge({ score = 0, riskLevel = 'low', className }) {
  const cfg     = RISK_CONFIG[riskLevel] || RISK_CONFIG.low;
  const pct     = Math.min(Math.max(score, 0), 100);

  return (
    <div className={clsx('space-y-2', className)}>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-surface-400 font-medium uppercase tracking-wider">Risk Score</p>
          <p className={clsx('text-3xl font-bold', cfg.text)}>{pct}<span className="text-base font-normal">/100</span></p>
        </div>
        <p className={clsx('text-sm font-semibold mb-1', cfg.text)}>{cfg.label}</p>
      </div>
      {/* Bar */}
      <div className="w-full h-2.5 bg-surface-100 rounded-full overflow-hidden">
        <div
          className={clsx('h-full rounded-full transition-all duration-700', cfg.color)}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Risk score: ${pct} out of 100`}
        />
      </div>
    </div>
  );
}
