// src/services/analysisService.js
// Service layer for all threat analysis & case management API calls.
// Connects frontend to the ScamShield  AI backend REST endpoints with resilient fallback.

import { api } from './api';
import { ENV } from '../config/env';

/**
 * Normalizes raw API response into standard UI-ready case format
 */
export function normalizeCase(raw, fallbackType = 'message', fallbackInput = '') {
  if (!raw) return null;
  const item = raw.data || raw;
  const riskStr = (item.riskLevel || 'LOW').toLowerCase();

  return {
    caseId: item.caseId || `CASE-${Date.now()}`,
    type: item.analysisType || item.type || fallbackType,
    analysisType: item.analysisType || item.type || fallbackType,
    input: item.originalInput || item.input || fallbackInput,
    originalInput: item.originalInput || item.input || fallbackInput,
    riskLevel: riskStr,
    riskScore: typeof item.riskScore === 'number' ? item.riskScore : 0,
    threatCategory: item.threatCategory || 'Uncategorized',
    confidence: typeof item.confidence === 'number' ? item.confidence : 85,
    indicators: Array.isArray(item.indicators) ? item.indicators : [],
    explanation: item.explanation || '',
    recommendedAction: item.recommendedAction || '',
    analyzedAt: item.createdAt || item.analyzedAt || new Date().toISOString(),
    createdAt: item.createdAt || item.analyzedAt || new Date().toISOString(),
    engineMode: item.engineMode || 'rule-based-fallback',
    processingTimeMs: item.processingTimeMs || 0,
    modelVersion: item.modelVersion || (item.engineMode === 'ai' ? 'ai-model' : 'rule-engine-v1.0'),
  };
}

/**
 * Analyze a suspicious message via POST /api/analyze/message
 */
export async function analyzeMessage(message) {
  try {
    const res = await api.post('/analyze/message', { message });
    return normalizeCase(res, 'message', message);
  } catch (err) {
    if (ENV.DEMO_MODE) {
      console.warn('Backend error or unavailable, falling back to local simulation:', err.message);
      return simulateAnalysis('message', message);
    }
    throw err;
  }
}

/**
 * Analyze a suspicious URL via POST /api/analyze/url
 */
export async function analyzeUrl(url) {
  try {
    const res = await api.post('/analyze/url', { url });
    return normalizeCase(res, 'url', url);
  } catch (err) {
    if (ENV.DEMO_MODE) {
      console.warn('Backend error or unavailable, falling back to local simulation:', err.message);
      return simulateAnalysis('url', url);
    }
    throw err;
  }
}

/**
 * Fetch paginated case history via GET /api/cases
 */
export async function fetchHistory({ page = 1, limit = 20, search = '', riskLevel = '', analysisType = '' } = {}) {
  try {
    const query = new URLSearchParams();
    if (page) query.append('page', page);
    if (limit) query.append('limit', limit);
    if (search) query.append('search', search);
    if (riskLevel && riskLevel !== 'all') query.append('riskLevel', riskLevel);
    if (analysisType && analysisType !== 'all') query.append('analysisType', analysisType);

    const res = await api.get(`/cases?${query.toString()}`);
    const cases = (res.data || []).map((c) => normalizeCase(c));
    return {
      data: cases,
      total: res.total ?? cases.length,
      page: res.page || page,
      limit: res.limit || limit,
      totalPages: res.totalPages || 1,
    };
  } catch (err) {
    console.warn('Backend /cases unavailable:', err.message);
    return null;
  }
}

/**
 * Fetch a single case by ID via GET /api/cases/:id
 */
export async function fetchCase(caseId) {
  try {
    const res = await api.get(`/cases/${caseId}`);
    return normalizeCase(res);
  } catch (err) {
    console.warn(`Backend /cases/${caseId} unavailable:`, err.message);
    return null;
  }
}

/**
 * Fetch aggregated dashboard statistics via GET /api/dashboard/stats
 */
export async function fetchDashboardStats() {
  try {
    const res = await api.get('/dashboard/stats');
    return res.data;
  } catch (err) {
    console.warn('Backend /dashboard/stats unavailable:', err.message);
    return null;
  }
}

/* ── Fallback simulation logic (if backend is offline) ─────────── */
const RISK_LEVELS = ['low', 'medium', 'high', 'critical'];

function simulateAnalysis(type, input) {
  const riskIndex = Math.floor(Math.random() * 4);
  const risk = RISK_LEVELS[riskIndex];

  const categoriesMap = {
    low: 'Likely Legitimate',
    medium: 'Suspicious Activity',
    high: 'Phishing Attempt',
    critical: 'Confirmed Scam / Malware',
  };

  const indicatorsMap = {
    low: ['No urgency language detected', 'Sender domain appears legitimate', 'No suspicious links found'],
    medium: ['Mild urgency language detected', 'Unusual sender pattern', 'Request for personal information'],
    high: ['Strong urgency language ("Act now!", "Limited time")', 'Suspicious link domain', 'Impersonation of trusted brand', 'Grammar anomalies'],
    critical: ['Known phishing domain detected', 'Social engineering patterns present', 'Credential harvesting link identified', 'Urgent financial request'],
  };

  const scoreMap = {
    low: Math.floor(Math.random() * 20) + 4,
    medium: Math.floor(Math.random() * 20) + 26,
    high: Math.floor(Math.random() * 20) + 52,
    critical: Math.floor(Math.random() * 15) + 85,
  };

  return {
    caseId: `DEMO-${Date.now()}`,
    type,
    analysisType: type,
    input: input.substring(0, 500),
    originalInput: input.substring(0, 500),
    riskLevel: risk,
    riskScore: scoreMap[risk],
    threatCategory: categoriesMap[risk],
    indicators: indicatorsMap[risk],
    explanation: `This ${type} was analyzed using pattern recognition. The system detected ${indicatorsMap[risk].length} indicator(s) consistent with ${categoriesMap[risk].toLowerCase()} content.`,
    recommendedAction:
      risk === 'low'
        ? 'No immediate action required. Exercise standard caution.'
        : risk === 'medium'
        ? 'Proceed with caution. Do not share personal information.'
        : risk === 'high'
        ? 'Do not interact. Report to your IT / security team.'
        : 'Block immediately. Do not click any links. Report to authorities.',
    analyzedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    engineMode: 'rule-based-fallback',
    modelVersion: 'demo-fallback-v1',
    processingTimeMs: Math.floor(Math.random() * 200) + 800,
  };
}
