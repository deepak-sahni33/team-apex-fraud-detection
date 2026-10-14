// src/components/ui/Badge.jsx
import { clsx } from 'clsx';

const RISK_CLASSES = {
  low:       'badge-low',
  medium:    'badge-medium',
  high:      'badge-high',
  critical:  'badge-critical',
};

const RISK_DOTS = {
  low:      'bg-green-500',
  medium:   'bg-amber-500',
  high:     'bg-red-500',
  critical: 'bg-purple-500',
};

/**
 * Risk-level badge with optional dot indicator.
 * @param {'low'|'medium'|'high'|'critical'} risk
 */
export function RiskBadge({ risk, showDot = true, className }) {
  const level = (risk || 'low').toLowerCase();
  return (
    <span className={clsx(RISK_CLASSES[level] || 'badge-gray', className)}>
      {showDot && (
        <span className={clsx('inline-block w-1.5 h-1.5 rounded-full', RISK_DOTS[level])} />
      )}
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  );
}

/** Generic colour badge */
export function Badge({ children, variant = 'gray', className }) {
  return (
    <span className={clsx(`badge-${variant}`, className)}>
      {children}
    </span>
  );
}
