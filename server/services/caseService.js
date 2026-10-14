// server/services/caseService.js
import { Case } from '../models/Case.js';
import { isDbConnected } from '../config/db.js';
import { generateCaseId } from '../utils/idGenerator.js';
import { logger } from '../utils/logger.js';

// Seed in-memory storage with initial records for development without MongoDB
const inMemoryCases = [
  {
    caseId: 'CASE-2026-A1F92',
    analysisType: 'message',
    originalInput: 'URGENT: Your Chase banking account has been suspended due to suspicious activity. Verify credentials immediately at http://chase-verify-login.xyz',
    riskScore: 88,
    riskLevel: 'CRITICAL',
    threatCategory: 'Credential / OTP Phishing',
    confidence: 94,
    indicators: [
      'Direct credential harvesting or login verification solicitation identified.',
      'Account suspension or security alert claim detected (typical social engineering pretext).',
      'Target brand name ("chase") located in unofficial host pattern.',
      'Urgency manipulation tactics detected (pressuring victim for immediate response).',
    ],
    explanation: 'Analysis identified 4 potential risk indicator(s). Key factors include: Account Suspension, Urgency Manipulation, Brand Impersonation.',
    recommendedAction: 'Do not respond, click links, or provide any credentials. Block the sender immediately and report the message to IT/security.',
    engineMode: 'rule-based-fallback',
    processingTimeMs: 14,
    createdAt: new Date(Date.now() - 3600000 * 2),
  },
  {
    caseId: 'CASE-2026-B8C44',
    analysisType: 'url',
    originalInput: 'http://192.168.1.100:8080/secure/login?redirect=update',
    riskScore: 78,
    riskLevel: 'CRITICAL',
    threatCategory: 'Direct IP Threat Vector',
    confidence: 90,
    indicators: [
      'IP address used as hostname instead of a standard domain name.',
      'Insecure transmission: URL uses unencrypted HTTP rather than HTTPS.',
      'URL communicates over non-standard web port (:8080).',
    ],
    explanation: 'Evaluation identified 3 potential risk indicator(s) across domain syntax, protocol security, and parameter structure.',
    recommendedAction: 'Do not open or interact with this link. Block the domain at your network or DNS level.',
    engineMode: 'rule-based-fallback',
    processingTimeMs: 8,
    createdAt: new Date(Date.now() - 3600000 * 6),
  },
  {
    caseId: 'CASE-2026-C3E11',
    analysisType: 'message',
    originalInput: 'Congratulations! You have won $500,000 in the international lottery. Wire $200 processing fee to claim prize.',
    riskScore: 68,
    riskLevel: 'HIGH',
    threatCategory: 'Prize / Lottery Scam',
    confidence: 88,
    indicators: [
      'Unsolicited prize, lottery, or financial giveaway lure detected.',
      'Financial transaction, cryptocurrency, or untraceable payment demand detected.',
    ],
    explanation: 'Analysis identified 2 potential risk indicator(s). Key factors include: Prize & Lottery Scams, Banking / Payment Demands.',
    recommendedAction: 'Exercise extreme caution. Do not click embedded links or disclose passwords/OTPs.',
    engineMode: 'rule-based-fallback',
    processingTimeMs: 11,
    createdAt: new Date(Date.now() - 3600000 * 18),
  },
  {
    caseId: 'CASE-2026-D4A77',
    analysisType: 'url',
    originalInput: 'https://github.com/google/ScamShield ',
    riskScore: 5,
    riskLevel: 'LOW',
    threatCategory: 'Likely Legitimate URL',
    confidence: 95,
    indicators: [],
    explanation: 'Structural and heuristic inspection did not detect any known suspicious hostname anomalies, IP redirection, brand spoofing, or abnormal parameter patterns.',
    recommendedAction: 'No immediate threat indicators detected. Maintain standard digital hygiene.',
    engineMode: 'rule-based-fallback',
    processingTimeMs: 6,
    createdAt: new Date(Date.now() - 3600000 * 24),
  },
];

/**
 * Persists an analysis report as a new Case
 */
export async function createCase(analysisData) {
  const caseId = generateCaseId();
  const caseDoc = {
    caseId,
    analysisType: analysisData.analysisType || 'message',
    originalInput: (analysisData.originalInput || '').substring(0, 3000),
    riskScore: analysisData.riskScore,
    riskLevel: analysisData.riskLevel,
    threatCategory: analysisData.threatCategory,
    confidence: analysisData.confidence || 85,
    indicators: analysisData.indicators || [],
    explanation: analysisData.explanation,
    recommendedAction: analysisData.recommendedAction,
    engineMode: analysisData.engineMode || 'rule-based-fallback',
    processingTimeMs: analysisData.processingTimeMs || 0,
    createdAt: new Date(),
  };

  if (isDbConnected()) {
    try {
      const created = await Case.create(caseDoc);
      return created.toObject();
    } catch (err) {
      logger.error('Failed to save case in MongoDB, falling back to in-memory store:', err.message);
    }
  }

  // In-memory fallback
  inMemoryCases.unshift(caseDoc);
  return caseDoc;
}

/**
 * Retrieves paginated list of cases with optional filters
 */
export async function getCases({ search = '', riskLevel = '', analysisType = '', page = 1, limit = 20 } = {}) {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  if (isDbConnected()) {
    try {
      const query = {};
      if (riskLevel && riskLevel !== 'all') query.riskLevel = riskLevel.toUpperCase();
      if (analysisType && analysisType !== 'all') query.analysisType = analysisType.toLowerCase();
      if (search) {
        query.$or = [
          { caseId: { $regex: search, $options: 'i' } },
          { threatCategory: { $regex: search, $options: 'i' } },
          { originalInput: { $regex: search, $options: 'i' } },
        ];
      }

      const [cases, total] = await Promise.all([
        Case.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
        Case.countDocuments(query),
      ]);

      return {
        cases,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum) || 1,
        limit: limitNum,
      };
    } catch (err) {
      logger.warn('Failed querying cases from MongoDB, falling back to in-memory store:', err.message);
    }
  }

  // In-memory filtering
  let filtered = [...inMemoryCases];

  if (riskLevel && riskLevel !== 'all') {
    filtered = filtered.filter((c) => c.riskLevel.toUpperCase() === riskLevel.toUpperCase());
  }

  if (analysisType && analysisType !== 'all') {
    filtered = filtered.filter((c) => c.analysisType.toLowerCase() === analysisType.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.caseId.toLowerCase().includes(q) ||
        c.threatCategory.toLowerCase().includes(q) ||
        c.originalInput.toLowerCase().includes(q)
    );
  }

  const total = filtered.length;
  const paginated = filtered.slice(skip, skip + limitNum);

  return {
    cases: paginated,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum) || 1,
    limit: limitNum,
  };
}

/**
 * Retrieves a single case by caseId (or MongoDB _id)
 */
export async function getCaseById(id) {
  if (isDbConnected()) {
    try {
      const found = await Case.findOne({ $or: [{ caseId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] }).lean();
      if (found) return found;
    } catch (err) {
      logger.warn('MongoDB lookup failed, checking in-memory store:', err.message);
    }
  }

  return inMemoryCases.find((c) => c.caseId === id || c.caseId.toLowerCase() === id.toLowerCase()) || null;
}

/**
 * Deletes a single case by caseId (or MongoDB _id)
 */
export async function deleteCaseById(id) {
  let deleted = false;

  if (isDbConnected()) {
    try {
      const res = await Case.deleteOne({ $or: [{ caseId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] });
      deleted = res.deletedCount > 0;
    } catch (err) {
      logger.warn('MongoDB delete failed, falling back to in-memory store:', err.message);
    }
  }

  const idx = inMemoryCases.findIndex((c) => c.caseId === id || c.caseId.toLowerCase() === id.toLowerCase());
  if (idx !== -1) {
    inMemoryCases.splice(idx, 1);
    deleted = true;
  }

  return deleted;
}

/**
 * Calculates aggregated dashboard metrics
 */
export async function getDashboardStats() {
  if (isDbConnected()) {
    try {
      const totalAnalyses = await Case.countDocuments();
      const criticalCases = await Case.countDocuments({ riskLevel: 'CRITICAL' });
      const highRiskCases = await Case.countDocuments({ riskLevel: 'HIGH' });
      const mediumRiskCases = await Case.countDocuments({ riskLevel: 'MEDIUM' });
      const lowRiskCases = await Case.countDocuments({ riskLevel: 'LOW' });

      const avgStats = await Case.aggregate([
        {
          $group: {
            _id: null,
            avgRiskScore: { $avg: '$riskScore' },
            avgProcessingMs: { $avg: '$processingTimeMs' },
          },
        },
      ]);

      const categoryAgg = await Case.aggregate([
        { $group: { _id: '$threatCategory', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 6 },
      ]);

      const recentCases = await Case.find().sort({ createdAt: -1 }).limit(5).lean();

      const threatCategoryCounts = categoryAgg.map((item) => ({
        name: item._id || 'Uncategorized',
        count: item.count,
      }));

      const avgRiskScore = Math.round(avgStats[0]?.avgRiskScore || 0);
      const avgProcessingMs = Math.round(avgStats[0]?.avgProcessingMs || 12);
      const detectionRate = totalAnalyses > 0 ? Math.round(((criticalCases + highRiskCases + mediumRiskCases) / totalAnalyses) * 100) : 0;

      return {
        totalAnalyses,
        criticalCases,
        highRiskCases,
        mediumRiskCases,
        lowRiskCases,
        avgRiskScore,
        detectionRate,
        avgProcessingMs,
        threatCategoryCounts,
        recentCases,
        riskTrend: generateTrendData(inMemoryCases),
      };
    } catch (err) {
      logger.warn('MongoDB aggregation failed, computing in-memory stats:', err.message);
    }
  }

  // Compute from in-memory records
  const totalAnalyses = inMemoryCases.length;
  const criticalCases = inMemoryCases.filter((c) => c.riskLevel === 'CRITICAL').length;
  const highRiskCases = inMemoryCases.filter((c) => c.riskLevel === 'HIGH').length;
  const mediumRiskCases = inMemoryCases.filter((c) => c.riskLevel === 'MEDIUM').length;
  const lowRiskCases = inMemoryCases.filter((c) => c.riskLevel === 'LOW').length;

  const totalScore = inMemoryCases.reduce((acc, c) => acc + (c.riskScore || 0), 0);
  const avgRiskScore = totalAnalyses ? Math.round(totalScore / totalAnalyses) : 0;
  const totalProc = inMemoryCases.reduce((acc, c) => acc + (c.processingTimeMs || 0), 0);
  const avgProcessingMs = totalAnalyses ? Math.round(totalProc / totalAnalyses) : 12;

  const detectionRate = totalAnalyses
    ? Math.round(((criticalCases + highRiskCases + mediumRiskCases) / totalAnalyses) * 100)
    : 0;

  // Category counts
  const catMap = {};
  for (const c of inMemoryCases) {
    catMap[c.threatCategory] = (catMap[c.threatCategory] || 0) + 1;
  }
  const threatCategoryCounts = Object.entries(catMap).map(([name, count]) => ({ name, count }));

  const recentCases = inMemoryCases.slice(0, 5);
  const riskTrend = generateTrendData(inMemoryCases);

  return {
    totalAnalyses,
    criticalCases,
    highRiskCases,
    mediumRiskCases,
    lowRiskCases,
    avgRiskScore,
    detectionRate,
    avgProcessingMs,
    threatCategoryCounts,
    recentCases,
    riskTrend,
  };
}

function generateTrendData(cases) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day, idx) => ({
    date: day,
    total: 30 + idx * 8 + (idx % 2 === 0 ? 5 : 2),
    critical: 2 + (idx % 3),
    high: 6 + (idx % 4),
    medium: 12 + (idx % 2),
    low: 15 + idx * 2,
  }));
}
