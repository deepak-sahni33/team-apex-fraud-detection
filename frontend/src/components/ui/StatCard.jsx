// src/components/ui/StatCard.jsx
import { clsx } from 'clsx';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * Dashboard stat card.
 * @param {string}  title
 * @param {string|number} value
 * @param {React.ElementType} icon
 * @param {'up'|'down'|'neutral'} trend
 * @param {string} trendLabel
 * @param {string} colorClass  — Tailwind text/bg classes for the icon background
 */
export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  colorClass = 'bg-brand-50 text-brand-600',
  className,
}) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-red-500' : trend === 'down' ? 'text-green-500' : 'text-surface-400';

  return (
    <div className={clsx('stat-card', className)}>
      <div className="flex items-start justify-between">
        <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center', colorClass)}>
          {Icon && <Icon className="w-5 h-5" aria-hidden />}
        </div>
        {trendLabel && (
          <span className={clsx('flex items-center gap-1 text-xs font-medium', trendColor)}>
            <TrendIcon className="w-3 h-3" />
            {trendLabel}
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-surface-800">{value}</p>
        <p className="text-sm text-surface-500 mt-0.5">{title}</p>
      </div>
    </div>
  );
}
