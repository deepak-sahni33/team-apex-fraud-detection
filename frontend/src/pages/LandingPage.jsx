// src/pages/LandingPage.jsx
import { Link } from 'react-router-dom';
import {
  Shield, Search, BarChart2, Clock, CheckCircle, AlertTriangle,
  MessageSquare, Link2, Zap, FileText, Lock, Globe, ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { ROUTES } from '../config/routes';

/* ── Data ───────────────────────────────────────────────────────── */
const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Submit Content',
    desc: 'Paste a suspicious message, email, SMS, or URL into the scanner.',
    icon: MessageSquare,
  },
  {
    step: '02',
    title: 'AI Analysis',
    desc: 'Our system analyzes linguistic patterns, sender signals, domain reputation, and known threat signatures.',
    icon: Zap,
  },
  {
    step: '03',
    title: 'Risk Classification',
    desc: 'Content is classified as Low, Medium, High, or Critical risk with a confidence score.',
    icon: Shield,
  },
  {
    step: '04',
    title: 'Actionable Report',
    desc: 'Receive a detailed report with detected indicators, explanation, and recommended action.',
    icon: FileText,
  },
];

const CAPABILITIES = [
  {
    icon: MessageSquare,
    title: 'Message Analysis',
    desc: 'Detect phishing, scam language, and social engineering patterns in emails, SMS, and chat messages.',
    color: 'text-brand-600 bg-brand-50',
  },
  {
    icon: Link2,
    title: 'URL Inspection',
    desc: 'Identify malicious URLs, typosquatting, deceptive domains, and known threat indicators.',
    color: 'text-indigo-600 bg-indigo-50',
  },
  {
    icon: AlertTriangle,
    title: 'Threat Classification',
    desc: 'Categorize threats into phishing, social engineering, financial scam, impersonation, and more.',
    color: 'text-amber-600 bg-amber-50',
  },
  {
    icon: FileText,
    title: 'Detailed Explanations',
    desc: 'Understand exactly why content was flagged with human-readable indicator breakdowns.',
    color: 'text-emerald-600 bg-emerald-50',
  },
  {
    icon: BarChart2,
    title: 'Security Dashboard',
    desc: 'Monitor threat trends, risk distributions, and your analysis history over time.',
    color: 'text-cyan-600 bg-cyan-50',
  },
  {
    icon: Lock,
    title: 'Privacy First',
    desc: 'Submitted content is analyzed and stored securely. No data is sold or shared with third parties.',
    color: 'text-rose-600 bg-rose-50',
  },
];

const RISK_EXAMPLES = [
  { level: 'Critical', color: 'bg-purple-100 border-purple-200 text-purple-800', dot: 'bg-purple-500', example: 'Confirmed advance-fee fraud with government impersonation' },
  { level: 'High',     color: 'bg-red-100 border-red-200 text-red-800',          dot: 'bg-red-500',    example: 'Brand phishing with credential-harvesting link' },
  { level: 'Medium',   color: 'bg-amber-100 border-amber-200 text-amber-800',    dot: 'bg-amber-500',  example: 'Marketplace scam with off-platform contact request' },
  { level: 'Low',      color: 'bg-green-100 border-green-200 text-green-800',    dot: 'bg-green-500',  example: 'Verified legitimate communication, no threats found' },
];

/* ── Component ──────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="flex flex-col">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative bg-white border-b border-surface-200 overflow-hidden">
        {/* Subtle grid background */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="page-container relative py-20 md:py-28 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-6">
            <Shield className="w-3.5 h-3.5" />
            AI-Powered Threat Detection
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-surface-900 leading-tight text-balance">
            Detect. Explain.<br />
            <span className="text-brand-600">Protect.</span>
          </h1>

          <p className="mt-5 text-lg md:text-xl text-surface-500 max-w-2xl mx-auto text-balance">
            ScamShield  AI analyzes suspicious messages, emails, SMS, and URLs for phishing, scams, and social engineering — giving you clear, actionable intelligence in seconds.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={ROUTES.SCANNER} className="btn-primary btn btn-lg gap-2">
              <Search className="w-5 h-5" />
              Analyze a Message or URL
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to={ROUTES.DASHBOARD} className="btn-secondary btn btn-lg gap-2">
              <BarChart2 className="w-5 h-5" />
              View Dashboard
            </Link>
          </div>

          {/* Trust signals */}
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-surface-400">
            {['Phishing Detection', 'URL Analysis', 'Scam Pattern Recognition', 'Risk Classification'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-brand-500" aria-hidden />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Problem Statement ─────────────────────────────────────── */}
      <section className="py-16 bg-surface-50">
        <div className="page-container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="section-label mb-3">The Problem</p>
            <h2 className="text-3xl font-bold text-surface-900 text-balance">
              Scams and phishing attacks are more sophisticated than ever
            </h2>
            <p className="mt-4 text-surface-500 leading-relaxed">
              Modern phishing campaigns, social engineering attacks, and scam messages are increasingly convincing. They impersonate trusted brands, exploit urgency, and use psychological manipulation — making it difficult for individuals to distinguish legitimate from malicious content.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { stat: '3.4B', label: 'Phishing emails sent per day globally' },
              { stat: '83%', label: 'Of organizations experienced phishing in 2023' },
              { stat: '$10.3B', label: 'Lost to cybercrime reported to the FBI in 2022' },
            ].map(({ stat, label }) => (
              <div key={stat} className="card p-6 text-center">
                <p className="text-3xl font-extrabold text-brand-600">{stat}</p>
                <p className="text-sm text-surface-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────── */}
      <section className="py-16 bg-white border-t border-b border-surface-200">
        <div className="page-container">
          <div className="text-center mb-12">
            <p className="section-label mb-3">How It Works</p>
            <h2 className="text-3xl font-bold text-surface-900">From submission to insight in seconds</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map(({ step, title, desc, icon: Icon }, i) => (
              <div key={step} className="relative">
                {i < HOW_IT_WORKS.length - 1 && (
                  <ChevronRight
                    className="hidden lg:block absolute -right-3 top-5 w-5 h-5 text-surface-300"
                    aria-hidden
                  />
                )}
                <div className="card p-5 h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4 text-white" aria-hidden />
                    </div>
                    <span className="text-xs font-bold text-brand-400 font-mono">STEP {step}</span>
                  </div>
                  <h3 className="font-semibold text-surface-800 mb-1">{title}</h3>
                  <p className="text-sm text-surface-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Risk Levels ──────────────────────────────────────────── */}
      <section className="py-16 bg-surface-50">
        <div className="page-container">
          <div className="text-center mb-10">
            <p className="section-label mb-3">Risk Classification</p>
            <h2 className="text-3xl font-bold text-surface-900">Four-level threat classification</h2>
            <p className="mt-3 text-surface-500">Every analysis produces a clear risk classification with a 0–100 confidence score.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {RISK_EXAMPLES.map(({ level, color, dot, example }) => (
              <div key={level} className={`rounded-xl border p-5 ${color}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${dot}`} aria-hidden />
                  <span className="font-bold text-sm">{level} Risk</span>
                </div>
                <p className="text-xs leading-relaxed opacity-80">{example}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Capabilities ─────────────────────────────────────────── */}
      <section className="py-16 bg-white border-t border-surface-200">
        <div className="page-container">
          <div className="text-center mb-12">
            <p className="section-label mb-3">Capabilities</p>
            <h2 className="text-3xl font-bold text-surface-900">Everything you need to stay protected</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CAPABILITIES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="card-hover p-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                  <Icon className="w-5 h-5" aria-hidden />
                </div>
                <h3 className="font-semibold text-surface-800 mb-1">{title}</h3>
                <p className="text-sm text-surface-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────── */}
      <section className="py-16 bg-brand-600">
        <div className="page-container text-center">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-white" aria-hidden />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Ready to analyze a suspicious message?</h2>
          <p className="text-brand-200 mb-8 max-w-lg mx-auto">
            Submit any message or URL and get an instant threat assessment with full explanation.
          </p>
          <Link to={ROUTES.SCANNER} className="btn btn-lg bg-white text-brand-700 hover:bg-brand-50 gap-2">
            <Search className="w-5 h-5" />
            Open the Scanner
          </Link>
        </div>
      </section>
    </div>
  );
}
