// src/components/ui/Card.jsx
import { clsx } from 'clsx';

export function Card({ children, className, hover = false, padding = true, ...props }) {
  return (
    <div
      className={clsx(
        hover ? 'card-hover' : 'card',
        padding && 'p-6',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }) {
  return (
    <div className={clsx('flex items-center justify-between mb-4', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }) {
  return (
    <h3 className={clsx('text-base font-semibold text-surface-800', className)}>
      {children}
    </h3>
  );
}
