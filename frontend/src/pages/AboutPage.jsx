// src/pages/AboutPage.jsx
import {
  Shield, Zap, Brain, Database, Server, Globe, CheckCircle,
  MessageSquare, Link2, FileText, BarChart2, Lock, ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageLayout, PageHeader } from '../components/layout/PageLayout';
import { Card } from '../components/ui/Card';
import { ROUTES } from '../config/routes';

const ARCHITECTURE = [
  {
    layer: 'Frontend',
    icon: Globe,
    tech: ['React 18', 'Vite', 'Tailwind CSS', 'Recharts', 'React Router'],
    color: 'bg-brand-50 text-brand-600',
    desc: 'Responsive SPA providing the scanner, dashboard, history, and result views.',
  },
  {
    layer: 'Backend API',
    icon: Server,
    tech: ['Node.js', 'Express.js', 'REST API', 'Middleware'],
    color: 'bg-emerald-50 text-emerald-600',
    desc: 'RESTful API layer handling analysis requests, routing, validation, and responses.',
  },
  {
    layer: 'AI / NLP Engine',
    icon: Brain,
    tech: ['Pattern Recognition', 'Linguistic Analysis', 'Threat Signatures', 'Risk Scoring'],
    color: 'bg-purple-50 text-purple-600',
    desc: 'Analysis engine that evaluates content for scam indicators and classifies risk.',
  },
  {
    layer: 'Database',
    icon: Database,
    tech: ['MongoDB', 'Mongoose ODM', 'Indexed Queries', 'Case Storage'],
    color: 'bg-amber-50 text-amber-600',
    desc: 'Persistent storage for analysis cases, history, and aggregated statistics.',
  },
];

const ANALYSIS_STEPS = [
  { step: 'Input Validation',      desc: 'Content is validated for format, length, and encoding.' },
  { step: 'Feature Extraction',    desc: 'Linguistic patterns, URLs, sender signals, and structural features are extracted.' },
  { step: 'Pattern Matching',      desc: 'Extracted features are compared against known phishing, scam, and threat signatures.' },
  { step: 'Risk Scoring',          desc: 'A 0–100 risk score is computed based on indicator severity and confidence.' },
  { step: 'Classification',        desc: 'Content is assigned a risk level: Low, Medium, High, or Critical.' },
  { step: 'Explanation Generation',desc: 'A human-readable explanation is generated listing detected indicators and their significance.' },
  { step: 'Storage & Response',    desc: 'Results are persisted with a Case ID and returned to the user.' },
];

const WHAT_WE_DETECT = [
  { icon: MessageSquare, label: 'Phishing Emails & SMS',          desc: 'Credential-stealing messages impersonating banks, services, or government.' },
  { icon: Link2,         label: 'Malicious URLs',                  desc: 'Deceptive domains, typosquatting, known threat hosts, and URL shortener traps.' },
  { icon: Shield,        label: 'Social Engineering',              desc: 'Manipulation tactics using urgency, authority, and fear to exploit victims.' },
  { icon: Zap,           label: 'Advance-Fee Fraud',              desc: 'Prize notifications, grant scams, and requests for upfront payments.' },
  { icon: Lock,          label: 'Impersonation',                  desc: 'Messages falsely presenting as trusted brands, institutions, or individuals.' },
];

export default function AboutPage() {
  return (
    <PageLayout>
      <PageHeader
        title="About ScamShield  AI"
        description="How the system works, what it detects, and how it's built."
      />

      <div className="page-container py-10 space-y-12 max-w-5xl">

        {/* Mission */}
        <section>
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-white" aria-hidden />
            </div>
            <div>
              <h2 className="text-xl font-bold text-surface-900 mb-2">Our Mission</h2>
              <p className="text-surface-600 leading-relaxed">
                ScamShield  AI was built to address a critical gap in everyday digital security: the ability for non-technical users to quickly and accurately assess whether a message or URL is a threat. By combining AI-driven analysis with clear, actionable explanations, we empower individuals and organizations to make informed decisions before interacting with suspicious content.
              </p>
            </div>
          </div>
        </section>

        {/* Architecture */}
        <section>
          <h2 className="text-xl font-bold text-surface-900 mb-5">System Architecture</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {ARCHITECTURE.map(({ layer, icon: Icon, tech, color, desc }) => (
              <Card key={layer} className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
                    <Icon className="w-4.5 h-4.5" aria-hidden />
                  </div>
                  <h3 className="font-semibold text-surface-800">{layer}</h3>
                </div>
                <p className="text-sm text-surface-500">{desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {tech.map((t) => (
                    <span key={t} className="badge-gray">{t}</span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Analysis workflow */}
        <section>
          <h2 className="text-xl font-bold text-surface-900 mb-5">Analysis Workflow</h2>
          <Card padding={false}>
            <ol className="divide-y divide-surface-100">
              {ANALYSIS_STEPS.map(({ step, desc }, i) => (
                <li key={step} className="flex gap-4 px-5 py-4">
                  <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-surface-800">{step}</p>
                    <p className="text-sm text-surface-500 mt-0.5">{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </section>

        {/* What we detect */}
        <section>
          <h2 className="text-xl font-bold text-surface-900 mb-5">What ScamShield  AI Detects</h2>
          <div className="space-y-3">
            {WHAT_WE_DETECT.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex gap-3 items-start card p-4">
                <Icon className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" aria-hidden />
                <div>
                  <p className="text-sm font-semibold text-surface-800">{label}</p>
                  <p className="text-sm text-surface-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Limitations / Disclaimer */}
        <section>
          <Card className="bg-amber-50 border-amber-200">
            <div className="flex gap-3">
              <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden />
              <div>
                <h3 className="text-sm font-semibold text-amber-800 mb-1">Hackathon Prototype — Important Disclaimer</h3>
                <p className="text-sm text-amber-700 leading-relaxed">
                  ScamShield  AI is a hackathon prototype. The current Phase 1 frontend uses simulated analysis results for UI development purposes. It is <strong>not</strong> a production threat-intelligence system, does not connect to real threat feeds, and should not be relied upon for critical security decisions. Real AI analysis will be integrated in Phase 2.
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* CTA */}
        <section className="text-center py-4">
          <h2 className="text-xl font-bold text-surface-900 mb-3">Ready to try it?</h2>
          <Link to={ROUTES.SCANNER} className="btn-primary btn btn-lg gap-2">
            Open the Scanner
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

      </div>
    </PageLayout>
  );
}
