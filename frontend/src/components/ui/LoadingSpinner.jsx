// src/components/ui/LoadingSpinner.jsx
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

export function LoadingSpinner({ size = 'md', className, label = 'Loading…' }) {
  const sizeClass = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' }[size] || 'w-6 h-6';
  return (
    <div className={clsx('flex flex-col items-center justify-center gap-3', className)}>
      <Loader2 className={clsx(sizeClass, 'text-brand-500 animate-spin')} aria-hidden />
      {label && <p className="text-sm text-surface-400">{label}</p>}
    </div>
  );
}

export function PageLoader({ label = 'Loading…' }) {
  return (
    <div className="flex-1 flex items-center justify-center py-24">
      <LoadingSpinner size="lg" label={label} />
    </div>
  );
}
