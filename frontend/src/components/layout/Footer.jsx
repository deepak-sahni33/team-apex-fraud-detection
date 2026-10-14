// src/components/layout/Footer.jsx
import { Link } from 'react-router-dom';
import { Shield, Github } from 'lucide-react';
import { ROUTES } from '../../config/routes';
import { ENV } from '../../config/env';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-surface-200 mt-auto">
      <div className="page-container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brand-600 rounded flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" aria-hidden />
            </div>
            <span className="font-bold text-surface-800">ScamShield  AI</span>
            <span className="text-surface-300 text-sm">v{ENV.APP_VERSION}</span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6 text-sm text-surface-500" aria-label="Footer navigation">
            <Link to={ROUTES.SCANNER}   className="hover:text-surface-800 transition-colors">Scanner</Link>
            <Link to={ROUTES.DASHBOARD} className="hover:text-surface-800 transition-colors">Dashboard</Link>
            <Link to={ROUTES.HISTORY}   className="hover:text-surface-800 transition-colors">History</Link>
            <Link to={ROUTES.ABOUT}     className="hover:text-surface-800 transition-colors">About</Link>
          </nav>

          {/* Disclaimer */}
          <p className="text-xs text-surface-400 text-center md:text-right max-w-xs">
            &copy; {year} ScamShield. Team Apex — AI Based Phising Scam Message & Malicious URL Detection Platform.
          </p>
        </div>
      </div>
    </footer>
  );
}
