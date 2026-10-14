// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './store/authContext';
import { ROUTES } from './config/routes';

// Pages
import LandingPage     from './pages/LandingPage';
import ScannerPage     from './pages/ScannerPage';
import DashboardPage   from './pages/DashboardPage';
import HistoryPage     from './pages/HistoryPage';
import CaseDetailsPage from './pages/CaseDetailsPage';
import AboutPage       from './pages/AboutPage';
import NotFoundPage    from './pages/NotFoundPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Global toast notifications */}
        <Toaster
          position="top-right"
          gutter={8}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#1e293b',
              border: '1px solid #e2e8f0',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.07)',
              padding: '10px 14px',
            },
            success: { iconTheme: { primary: '#16a34a', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#dc2626', secondary: '#fff' } },
          }}
        />

        <Routes>
          <Route path={ROUTES.HOME}         element={<LandingPage />} />
          <Route path={ROUTES.SCANNER}      element={<ScannerPage />} />
          <Route path={ROUTES.DASHBOARD}    element={<DashboardPage />} />
          <Route path={ROUTES.HISTORY}      element={<HistoryPage />} />
          <Route path={ROUTES.CASE_DETAILS} element={<CaseDetailsPage />} />
          <Route path={ROUTES.ABOUT}        element={<AboutPage />} />
          <Route path="*"                   element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
