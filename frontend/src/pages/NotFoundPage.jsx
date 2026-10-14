// src/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom';
import { Shield, Home, Search } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { ROUTES } from '../config/routes';

export default function NotFoundPage() {
  return (
    <PageLayout>
      <div className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-surface-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-surface-400" aria-hidden />
          </div>
          <h1 className="text-6xl font-extrabold text-surface-200 mb-4">404</h1>
          <h2 className="text-xl font-bold text-surface-800 mb-2">Page not found</h2>
          <p className="text-surface-500 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={ROUTES.HOME} className="btn-primary btn gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </Link>
            <Link to={ROUTES.SCANNER} className="btn-secondary btn gap-2">
              <Search className="w-4 h-4" />
              Open Scanner
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
