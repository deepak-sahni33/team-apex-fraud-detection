// src/components/layout/Navbar.jsx
import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Shield, Menu, X, BarChart2, Clock, Search, Info } from 'lucide-react';
import { clsx } from 'clsx';
import { ROUTES } from '../../config/routes';

const NAV_ITEMS = [
  { label: 'Scanner',   to: ROUTES.SCANNER,   icon: Search },
  { label: 'Dashboard', to: ROUTES.DASHBOARD,  icon: BarChart2 },
  { label: 'History',   to: ROUTES.HISTORY,    icon: Clock },
  { label: 'About',     to: ROUTES.ABOUT,      icon: Info },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-surface-200">
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center group-hover:bg-brand-700 transition-colors">
              <Shield className="w-4.5 h-4.5 text-white" aria-hidden />
            </div>
            <span className="font-bold text-surface-900 text-lg tracking-tight">
              ScamShield  <span className="text-brand-600">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {NAV_ITEMS.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  clsx(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150',
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* CTA (desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <Link to={ROUTES.SCANNER} className="btn-primary btn text-sm">
              Analyze Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            id="mobile-menu-toggle"
            className="md:hidden btn-ghost btn p-2"
            onClick={() => setOpen((p) => !p)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {open && (
          <nav
            className="md:hidden pb-4 pt-2 animate-fade-in"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-1">
              {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
                    )
                  }
                >
                  <Icon className="w-4 h-4" aria-hidden />
                  {label}
                </NavLink>
              ))}
              <Link
                to={ROUTES.SCANNER}
                onClick={() => setOpen(false)}
                className="btn-primary btn mt-2 text-sm"
              >
                Analyze Now
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
