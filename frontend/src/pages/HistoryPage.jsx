import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Clock, MessageSquare, Link2, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { PageLayout, PageHeader } from '../components/layout/PageLayout';
import { Card } from '../components/ui/Card';
import { RiskBadge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { DEMO_CASES } from '../data/demoData';
import { caseDetailsPath } from '../config/routes';
import { fetchHistory } from '../services/analysisService';

const RISK_LEVELS = ['all', 'critical', 'high', 'medium', 'low'];
const TYPES       = ['all', 'message', 'url'];

export default function HistoryPage() {
  const [search,    setSearch]    = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [cases, setCases] = useState(DEMO_CASES);

  useEffect(() => {
    let active = true;
    fetchHistory({ search, riskLevel: riskFilter, analysisType: typeFilter }).then((res) => {
      if (active && res && Array.isArray(res.data) && res.data.length > 0) {
        setCases(res.data);
      }
    });
    return () => {
      active = false;
    };
  }, [search, riskFilter, typeFilter]);

  const filtered = useMemo(() => {
    return cases.filter((c) => {
      const matchRisk = riskFilter === 'all' || (c.riskLevel || '').toLowerCase() === riskFilter.toLowerCase();
      const matchType = typeFilter === 'all' || (c.type || c.analysisType || '').toLowerCase() === typeFilter.toLowerCase();
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        [c.caseId, c.threatCategory, c.input, c.originalInput].some((f) => f?.toLowerCase().includes(q));
      return matchRisk && matchType && matchSearch;
    });
  }, [cases, search, riskFilter, typeFilter]);

  const hasFilters = search || riskFilter !== 'all' || typeFilter !== 'all';

  return (
    <PageLayout>
      <PageHeader
        title="Case History"
        description={`${cases.length} analyses recorded`}
        action={
          <Link to="/scanner" className="btn-primary btn text-sm">
            New Analysis
          </Link>
        }
      />

      <div className="page-container py-8 space-y-5">

        {/* ── Filters ───────────────────────────────────────────── */}
        <Card className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" aria-hidden />
            <input
              id="history-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Case ID, threat, or content…"
              className="input pl-9"
              aria-label="Search case history"
            />
          </div>

          {/* Risk filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-surface-400 shrink-0" aria-hidden />
            <select
              id="risk-filter"
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="input w-auto"
              aria-label="Filter by risk level"
            >
              {RISK_LEVELS.map((r) => (
                <option key={r} value={r}>{r === 'all' ? 'All Risk Levels' : r.charAt(0).toUpperCase() + r.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Type filter */}
          <select
            id="type-filter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="input w-auto"
            aria-label="Filter by analysis type"
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>{t === 'all' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
        </Card>

        {/* ── Result count ──────────────────────────────────────── */}
        {hasFilters && (
          <p className="text-sm text-surface-500">
            Showing <span className="font-semibold text-surface-700">{filtered.length}</span> of {DEMO_CASES.length} results
            {hasFilters && (
              <button
                onClick={() => { setSearch(''); setRiskFilter('all'); setTypeFilter('all'); }}
                className="ml-2 text-brand-600 hover:underline text-xs"
              >
                Clear filters
              </button>
            )}
          </p>
        )}

        {/* ── Table ─────────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="No cases found"
            description={hasFilters ? 'Try adjusting your search or filter criteria.' : 'Run your first analysis to see cases here.'}
            action={
              <Link to="/scanner" className="btn-primary btn btn-sm">
                Start Scanning
              </Link>
            }
          />
        ) : (
          <>
            {/* Desktop table */}
            <Card padding={false} className="hidden md:block overflow-x-auto scrollbar-thin">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Case ID</th>
                    <th>Type</th>
                    <th>Threat Category</th>
                    <th>Risk</th>
                    <th>Score</th>
                    <th>Date / Time</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.caseId}>
                      <td>
                        <code className="font-mono text-xs text-surface-500">{c.caseId}</code>
                      </td>
                      <td>
                        <span className="badge-gray flex items-center gap-1 w-fit capitalize">
                          {c.type === 'message'
                            ? <MessageSquare className="w-3 h-3" aria-hidden />
                            : <Link2 className="w-3 h-3" aria-hidden />}
                          {c.type}
                        </span>
                      </td>
                      <td className="max-w-[220px]">
                        <span className="block truncate">{c.threatCategory}</span>
                      </td>
                      <td><RiskBadge risk={c.riskLevel} /></td>
                      <td>
                        <span className="font-mono text-xs font-semibold text-surface-700">{c.riskScore}</span>
                      </td>
                      <td className="whitespace-nowrap text-xs text-surface-400">
                        {format(new Date(c.analyzedAt), 'MMM d, yyyy — HH:mm')}
                      </td>
                      <td className="text-right">
                        <Link
                          to={caseDetailsPath(c.caseId)}
                          className="btn-ghost btn btn-sm gap-1"
                        >
                          View <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {filtered.map((c) => (
                <Link
                  key={c.caseId}
                  to={caseDetailsPath(c.caseId)}
                  className="card-hover block p-4"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <RiskBadge risk={c.riskLevel} />
                      <p className="text-sm font-semibold text-surface-800 mt-1.5">{c.threatCategory}</p>
                    </div>
                    <span className="font-mono text-lg font-bold text-surface-700">{c.riskScore}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="badge-gray capitalize flex items-center gap-1 text-xs">
                      {c.type === 'message' ? <MessageSquare className="w-3 h-3" /> : <Link2 className="w-3 h-3" />}
                      {c.type}
                    </span>
                    <span className="text-xs text-surface-400">
                      {format(new Date(c.analyzedAt), 'MMM d, HH:mm')}
                    </span>
                  </div>
                  <code className="text-xs text-surface-400 mt-1 block">{c.caseId}</code>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
}
