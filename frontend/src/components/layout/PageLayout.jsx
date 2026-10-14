// src/components/layout/PageLayout.jsx
// Wraps every page with Navbar + Footer + optional page header.
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { clsx } from 'clsx';

export function PageLayout({ children, className }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className={clsx('flex-1 flex flex-col', className)}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

export function PageHeader({ title, description, action, className }) {
  return (
    <div className={clsx('border-b border-surface-200 bg-white', className)}>
      <div className="page-container py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-surface-900">{title}</h1>
            {description && <p className="text-sm text-surface-500 mt-0.5">{description}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      </div>
    </div>
  );
}
