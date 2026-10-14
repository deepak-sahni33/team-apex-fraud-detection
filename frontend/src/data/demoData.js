// src/data/demoData.js
// Demo data for Phase 1 UI development.
// Replace with API calls in Phase 2 — search for "// Phase 2:" comments.

import { subDays, subHours, subMinutes } from 'date-fns';

const now = new Date();

/* ── Risk trend data (last 7 days) ─────────────────────────────── */
export const RISK_TREND_DATA = [
  { date: 'Oct 2', total: 12, low: 5, medium: 4, high: 2, critical: 1 },
  { date: 'Oct 3', total: 18, low: 8, medium: 5, high: 3, critical: 2 },
  { date: 'Oct 4', total: 9,  low: 4, medium: 3, high: 2, critical: 0 },
  { date: 'Oct 5', total: 24, low: 9, medium: 8, high: 5, critical: 2 },
  { date: 'Oct 6', total: 31, low: 12, medium: 9, high: 7, critical: 3 },
  { date: 'Oct 7', total: 22, low: 10, medium: 6, high: 4, critical: 2 },
  { date: 'Oct 8', total: 15, low: 7, medium: 4, high: 3, critical: 1 },
];

/* ── Threat category distribution ──────────────────────────────── */
export const THREAT_CATEGORIES = [
  { name: 'Phishing Attempt',         count: 34, color: '#dc2626' },
  { name: 'Social Engineering',        count: 22, color: '#d97706' },
  { name: 'Malicious URL',             count: 18, color: '#7c3aed' },
  { name: 'Financial Scam',            count: 15, color: '#ea580c' },
  { name: 'Impersonation',             count: 12, color: '#0891b2' },
  { name: 'Likely Legitimate',         count: 30, color: '#16a34a' },
];

/* ── Recent case history (demo) ────────────────────────────────── */
export const DEMO_CASES = [
  {
    caseId:          'SSA-2024-001',
    type:            'message',
    riskLevel:       'critical',
    riskScore:       94,
    threatCategory:  'Phishing Attempt',
    input:           'URGENT: Your bank account has been suspended. Click here immediately to verify your identity: http://secure-bank-verify.xyz/login',
    indicators:      ['Known phishing domain detected', 'Urgent financial language', 'Impersonation of financial institution', 'Suspicious redirect URL'],
    explanation:     'This message contains multiple high-confidence phishing indicators including a deceptive domain name, urgent language, and an impersonation pattern consistent with banking phishing campaigns.',
    recommendedAction: 'Block immediately. Do not click any links. Report to your bank and authorities.',
    analyzedAt:      subMinutes(now, 12).toISOString(),
    processingTimeMs: 1147,
    modelVersion:    'demo-v0',
  },
  {
    caseId:          'SSA-2024-002',
    type:            'url',
    riskLevel:       'high',
    riskScore:       78,
    threatCategory:  'Malicious URL',
    input:           'http://amaz0n-prize-winner.com/claim?id=USER123',
    indicators:      ['Typosquatted brand name (amaz0n)', 'Prize/lottery scam pattern', 'Unknown domain registration', 'Suspicious query parameters'],
    explanation:     'The URL uses a common typosquatting technique to impersonate a major e-commerce brand. The path and query structure are consistent with credential harvesting pages.',
    recommendedAction: 'Do not visit this URL. Report to the impersonated company.',
    analyzedAt:      subMinutes(now, 45).toISOString(),
    processingTimeMs: 987,
    modelVersion:    'demo-v0',
  },
  {
    caseId:          'SSA-2024-003',
    type:            'message',
    riskLevel:       'medium',
    riskScore:       48,
    threatCategory:  'Suspicious Activity',
    input:           'Hi, I saw your listing. I\'m interested in buying. Can you share your WhatsApp number so we can discuss the price? I can pay extra.',
    indicators:      ['Request to move off-platform', 'Offer to overpay (advance-fee pattern)', 'Urgency to share contact details'],
    explanation:     'This message shows medium-confidence social engineering indicators typical of marketplace scams. The request to move to another platform and offer to overpay are common precursors to advance-fee fraud.',
    recommendedAction: 'Proceed with caution. Avoid sharing personal contact details. Transact only through the platform.',
    analyzedAt:      subHours(now, 2).toISOString(),
    processingTimeMs: 1203,
    modelVersion:    'demo-v0',
  },
  {
    caseId:          'SSA-2024-004',
    type:            'url',
    riskLevel:       'low',
    riskScore:       8,
    threatCategory:  'Likely Legitimate',
    input:           'https://www.google.com/search?q=weather+today',
    indicators:      ['Verified domain (google.com)', 'HTTPS protocol', 'Standard search query pattern'],
    explanation:     'This URL belongs to a well-known legitimate domain. No suspicious patterns, deceptive elements, or malicious indicators were detected.',
    recommendedAction: 'No action required. This URL appears safe.',
    analyzedAt:      subHours(now, 5).toISOString(),
    processingTimeMs: 612,
    modelVersion:    'demo-v0',
  },
  {
    caseId:          'SSA-2024-005',
    type:            'message',
    riskLevel:       'critical',
    riskScore:       91,
    threatCategory:  'Confirmed Scam / Malware',
    input:           'Congratulations! You have been selected for a $5,000 government relief grant. To claim, send $150 processing fee via gift card to: grants@govrelief-2024.net',
    indicators:      ['Gift card payment request (strong scam signal)', 'Fake government impersonation', 'Advance-fee fraud pattern', 'Suspicious free email domain', 'Prize/grant hook'],
    explanation:     'This message is a textbook advance-fee fraud (419 scam). The request for gift card payment combined with government impersonation and an unrealistic monetary prize are definitive scam indicators.',
    recommendedAction: 'Block and report immediately. This is a known scam pattern. Never send money or gift cards to unknown parties.',
    analyzedAt:      subDays(now, 1).toISOString(),
    processingTimeMs: 1389,
    modelVersion:    'demo-v0',
  },
  {
    caseId:          'SSA-2024-006',
    type:            'message',
    riskLevel:       'high',
    riskScore:       72,
    threatCategory:  'Phishing Attempt',
    input:           'Dear customer, your Netflix subscription will be cancelled in 24 hours due to payment failure. Update your payment details here: netflix-update-now.com',
    indicators:      ['Brand impersonation (Netflix)', 'Artificial urgency (24 hours)', 'Suspicious non-official domain', 'Payment credential harvesting attempt'],
    explanation:     'This message impersonates Netflix using a non-official domain. The 24-hour deadline creates artificial urgency to prevent the victim from verifying the authenticity.',
    recommendedAction: 'Do not click the link. Visit Netflix directly at netflix.com to check your account status.',
    analyzedAt:      subDays(now, 1).toISOString(),
    processingTimeMs: 1056,
    modelVersion:    'demo-v0',
  },
  {
    caseId:          'SSA-2024-007',
    type:            'url',
    riskLevel:       'medium',
    riskScore:       42,
    threatCategory:  'Suspicious Activity',
    input:           'http://bit.ly/3xYzAbc',
    indicators:      ['URL shortener (obscures destination)', 'HTTP (no encryption)', 'Destination cannot be pre-verified'],
    explanation:     'Shortened URLs prevent pre-verification of the destination. While URL shorteners have legitimate uses, this combined with HTTP (not HTTPS) warrants caution before clicking.',
    recommendedAction: 'Preview the full URL before visiting. Use a URL expander tool to check the destination.',
    analyzedAt:      subDays(now, 2).toISOString(),
    processingTimeMs: 834,
    modelVersion:    'demo-v0',
  },
  {
    caseId:          'SSA-2024-008',
    type:            'message',
    riskLevel:       'low',
    riskScore:       11,
    threatCategory:  'Likely Legitimate',
    input:           'Hi Sarah, just wanted to confirm our meeting is still on for Thursday at 3pm. Let me know if you need to reschedule.',
    indicators:      ['Casual conversational tone', 'No suspicious links', 'No urgency or financial request'],
    explanation:     'This message shows no indicators of phishing or social engineering. The casual tone and lack of suspicious elements suggest this is a normal personal communication.',
    recommendedAction: 'No action required. This message appears safe.',
    analyzedAt:      subDays(now, 2).toISOString(),
    processingTimeMs: 541,
    modelVersion:    'demo-v0',
  },
];

/* ── Dashboard summary stats ────────────────────────────────────── */
export const DASHBOARD_STATS = {
  totalAnalyses:    131,
  highRiskCases:    49,
  mediumRiskCases:  37,
  lowRiskCases:     45,
  criticalCases:    11,
  avgRiskScore:     52,
  detectionRate:    96.2,
  avgProcessingMs:  987,
};
