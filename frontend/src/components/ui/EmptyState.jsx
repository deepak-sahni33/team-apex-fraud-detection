// src/components/ui/EmptyState.jsx
import { clsx } from 'clsx';

/**
 * Standard empty/placeholder state component.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}) {
  return (
    <div className={clsx('flex flex-col items-center justify-center py-16 text-center gap-4', className)}>
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-surface-100 flex items-center justify-center">
          <Icon className="w-7 h-7 text-surface-400" aria-hidden />
        </div>
      )}
      <div className="space-y-1">
        <p className="text-sm font-semibold text-surface-700">{title}</p>
        {description && <p className="text-sm text-surface-400 max-w-xs">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
