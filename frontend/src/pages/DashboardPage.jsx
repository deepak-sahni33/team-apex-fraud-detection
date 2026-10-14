import { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import {
  Shield, AlertTriangle, AlertOctagon, CheckCircle, Activity,
  TrendingUp, Clock,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageLayout, PageHeader } from '../components/layout/PageLayout';
import { StatCard } from '../components/ui/StatCard';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { RiskBadge } from '../components/ui/Badge';
import { DASHBOARD_STATS, RISK_TREND_DATA, THREAT_CATEGORIES, DEMO_CASES } from '../data/demoData';
import { caseDetailsPath } from '../config/routes';
import { fetchDashboardStats } from '../services/analysisService';
import { format } from 'date-fns';

/* ── Custom Tooltip ──────────────────────────────────────────────── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card p-3 text-xs space-y-1 min-w-[130px]">
      <p className="font-semibold text-surface-700 mb-1.5">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="capitalize text-surface-600">{p.dataKey}</span>
          </span>
          <span className="font-medium text-surface-800">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [trendType, setTrendType] = useState('total');
  const [stats, setStats] = useState(DASHBOARD_STATS);
  const [trendData, setTrendData] = useState(RISK_TREND_DATA);
  const [categories, setCategories] = useState(THREAT_CATEGORIES);
  const [recentCases, setRecentCases] = useState(DEMO_CASES.slice(0, 5));

  useEffect(() => {
    let mounted = true;
    fetchDashboardStats().then((data) => {
      if (!mounted || !data) return;
      setStats({
        totalAnalyses: data.totalAnalyses ?? DASHBOARD_STATS.totalAnalyses,
        criticalCases: data.criticalCases ?? DASHBOARD_STATS.criticalCases,
        highRiskCases: data.highRiskCases ?? DASHBOARD_STATS.highRiskCases,
        mediumRiskCases: data.mediumRiskCases ?? DASHBOARD_STATS.mediumRiskCases,
        lowRiskCases: data.lowRiskCases ?? DASHBOARD_STATS.lowRiskCases,
        avgRiskScore: data.avgRiskScore ?? DASHBOARD_STATS.avgRiskScore,
        detectionRate: data.detectionRate ?? DASHBOARD_STATS.detectionRate,
        avgProcessingMs: data.avgProcessingMs ?? DASHBOARD_STATS.avgProcessingMs,
      });

      if (data.riskTrend && data.riskTrend.length > 0) {
        setTrendData(data.riskTrend);
      }

      if (data.threatCategoryCounts && data.threatCategoryCounts.length > 0) {
        const colors = ['#dc2626', '#d97706', '#6366f1', '#16a34a', '#7c3aed', '#0891b2'];
        setCategories(
          data.threatCategoryCounts.map((item, idx) => ({
            name: item.name,
            count: item.count,
            color: colors[idx % colors.length],
          }))
        );
      }

      if (data.recentCases && data.recentCases.length > 0) {
        setRecentCases(
          data.recentCases.map((c) => ({
            caseId: c.caseId,
            type: c.analysisType || c.type,
            threatCategory: c.threatCategory,
            riskLevel: (c.riskLevel || 'LOW').toLowerCase(),
            riskScore: c.riskScore,
            analyzedAt: c.createdAt || c.analyzedAt,
          }))
        );
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <PageLayout>
      <PageHeader
        title="Security Dashboard"
        description="Overview of all threat detections and risk trends."
        action={
          <Link to="/scanner" className="btn-primary btn text-sm">
            New Analysis
          </Link>
        }
      />

      <div className="page-container py-8 space-y-8">

        {/* ── Stat Cards ────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Analyses"
            value={stats.totalAnalyses.toLocaleString()}
            icon={Activity}
            colorClass="bg-brand-50 text-brand-600"
            trend="up"
            trendLabel="+12 today"
          />
          <StatCard
            title="Critical + High Risk"
            value={(stats.criticalCases + stats.highRiskCases).toLocaleString()}
            icon={AlertOctagon}
            colorClass="bg-red-50 text-red-600"
            trend="up"
            trendLabel="+3 today"
          />
          <StatCard
            title="Medium Risk"
            value={stats.mediumRiskCases.toLocaleString()}
            icon={AlertTriangle}
            colorClass="bg-amber-50 text-amber-600"
          />
          <StatCard
            title="Low / Safe"
            value={stats.lowRiskCases.toLocaleString()}
            icon={CheckCircle}
            colorClass="bg-green-50 text-green-600"
            trend="down"
            trendLabel="-5 today"
          />
        </div>

        {/* Secondary stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Avg. Risk Score',    value: `${stats.avgRiskScore}/100`,    icon: Shield },
            { label: 'Detection Rate',     value: `${stats.detectionRate}%`,       icon: TrendingUp },
            { label: 'Avg. Analysis Time', value: `${stats.avgProcessingMs} ms`,   icon: Clock },
            { label: 'Critical Cases',     value: stats.criticalCases,             icon: AlertOctagon },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="card p-4 flex items-center gap-3">
              <Icon className="w-5 h-5 text-surface-400 shrink-0" aria-hidden />
              <div>
                <p className="text-lg font-bold text-surface-800">{value}</p>
                <p className="text-xs text-surface-400">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Charts Row ────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-3 gap-5">

          {/* Risk Trend */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Risk Trend — Last 7 Days</CardTitle>
              <div className="flex gap-1 bg-surface-100 rounded-lg p-0.5">
                {['total', 'high', 'critical'].map((t) => (
                  <button
                    key={t}
                    id={`trend-${t}`}
                    onClick={() => setTrendType(t)}
                    className={`px-2.5 py-1 rounded text-xs font-medium capitalize transition-colors ${
                      trendType === t ? 'bg-white text-brand-700 shadow-sm' : 'text-surface-500 hover:text-surface-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </CardHeader>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trendData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey={trendType}
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#6366f1' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Threat categories pie */}
          <Card>
            <CardHeader>
              <CardTitle>Threat Categories</CardTitle>
            </CardHeader>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={categories}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  outerRadius={72}
                  innerRadius={40}
                  paddingAngle={2}
                >
                  {categories.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 space-y-1.5">
              {categories.slice(0, 4).map(({ name, count, color }) => (
                <div key={name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: color }} />
                    <span className="text-surface-600 truncate">{name}</span>
                  </span>
                  <span className="font-semibold text-surface-700 ml-2">{count}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Bar chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Risk Distribution</CardTitle>
          </CardHeader>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={trendData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="low"      stackId="a" fill="#16a34a" radius={[0,0,0,0]} />
              <Bar dataKey="medium"   stackId="a" fill="#d97706" />
              <Bar dataKey="high"     stackId="a" fill="#dc2626" />
              <Bar dataKey="critical" stackId="a" fill="#7c3aed" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* ── Recent Analyses ───────────────────────────────────── */}
        <Card padding={false}>
          <div className="px-5 py-4 border-b border-surface-100 flex items-center justify-between">
            <h3 className="text-base font-semibold text-surface-800">Recent Analyses</h3>
            <Link to="/history" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto scrollbar-thin">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Type</th>
                  <th>Threat</th>
                  <th>Risk</th>
                  <th>Score</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recentCases.map((c) => (
                  <tr key={c.caseId}>
                    <td><code className="font-mono text-xs text-surface-500">{c.caseId}</code></td>
                    <td>
                      <span className="badge-gray capitalize">{c.type}</span>
                    </td>
                    <td className="max-w-[200px] truncate">{c.threatCategory}</td>
                    <td><RiskBadge risk={c.riskLevel} /></td>
                    <td>
                      <span className="font-mono text-xs font-semibold text-surface-700">{c.riskScore}</span>
                    </td>
                    <td className="whitespace-nowrap text-xs text-surface-400">
                      {format(new Date(c.analyzedAt), 'MMM d, HH:mm')}
                    </td>
                    <td>
                      <Link
                        to={caseDetailsPath(c.caseId)}
                        className="text-xs text-brand-600 hover:underline font-medium"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

      </div>
    </PageLayout>
  );
}
