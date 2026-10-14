// server/analyzers/messageAnalyzer.js
import { calculateRiskScore, getRecommendedAction } from './riskScorer.js';

/**
 * Message Threat Patterns
 */
const THREAT_PATTERNS = [
  {
    category: 'Urgency Manipulation',
    severity: 'MEDIUM',
    weight: 15,
    regex: /\b(urgent|urgently|immediately|within\s+\d+\s+(hours?|minutes?|days?)|act\s+now|action\s+required|final\s+notice|time\s+sensitive|expires\s+(today|soon)|do\s+not\s+ignore)\b/i,
    indicator: 'Urgency manipulation tactics detected (pressuring victim for immediate response).',
  },
  {
    category: 'Account Suspension & Alert',
    severity: 'HIGH',
    weight: 22,
    regex: /\b(account\s+(has\s+been\s+)?(suspended|locked|frozen|blocked|terminated|flagged)|unauthorized\s+access|security\s+alert|unusual\s+activity\s+detected)\b/i,
    indicator: 'Account suspension or security alert claim detected (typical social engineering pretext).',
  },
  {
    category: 'Credential / Password Request',
    severity: 'CRITICAL',
    weight: 35,
    regex: /\b(verify\s+(your\s+)?(password|credentials?|identity)|login\s+to\s+confirm|enter\s+(your\s+)?(password|pin|secret\s+code)|password\s+reset\s+link)\b/i,
    indicator: 'Direct credential harvesting or login verification solicitation identified.',
  },
  {
    category: 'OTP / Verification Code Harvesting',
    severity: 'CRITICAL',
    weight: 35,
    regex: /\b(otp|one[-\s]?time\s+password|6[-\s]?digit\s+code|verification\s+code|share\s+(the\s+)?code|do\s+not\s+share\s+this\s+code\s+with\s+anyone\s+except)\b/i,
    indicator: 'One-Time Password (OTP) or 2FA verification code request detected.',
  },
  {
    category: 'Banking / Payment Demands',
    severity: 'HIGH',
    weight: 24,
    regex: /\b(wire\s+transfer|bitcoin|crypto(currency)?|wallet\s+address|gift\s+cards?|western\s+union|unpaid\s+invoice|overdue\s+payment|refund\s+claim)\b/i,
    indicator: 'Financial transaction, cryptocurrency, or untraceable payment demand detected.',
  },
  {
    category: 'Brand / Institution Impersonation',
    severity: 'HIGH',
    weight: 20,
    regex: /\b(paypal|netflix|amazon|apple\s+id|microsoft|google\s+security|chase|wells\s+fargo|bank\s+of\s+america|irs|dhl|fedex|usps|hmrc)\b/i,
    indicator: 'Reference to high-profile financial, delivery, or tech brand commonly targeted for impersonation.',
  },
  {
    category: 'Prize & Lottery Scams',
    severity: 'HIGH',
    weight: 22,
    regex: /\b(you\s+(have\s+)?won|lottery|winner|claim\s+your\s+(prize|reward|gift)|selected\s+as\s+a\s+winner|congratulations\s+claim|cash\s+bonus)\b/i,
    indicator: 'Unsolicited prize, lottery, or financial giveaway lure detected.',
  },
  {
    category: 'KYC & Regulatory Compliance Scam',
    severity: 'HIGH',
    weight: 24,
    regex: /\b(kyc\s+(update|verification|pending|blocked)|pan\s+card|aadhaar|update\s+kyc|freeze\s+account\s+unless\s+kyc)\b/i,
    indicator: 'KYC / identity compliance update threat observed (common bank scam vector).',
  },
  {
    category: 'Investment & High Return Fraud',
    severity: 'HIGH',
    weight: 22,
    regex: /\b(guaranteed\s+returns?|100%\s+profit|double\s+your\s+money|risk[-\s]?free\s+investment|forex\s+signals?|crypto\s+trading\s+bot)\b/i,
    indicator: 'High-yield investment fraud / unrealistic return promise detected.',
  },
  {
    category: 'Fear & Legal Coercion',
    severity: 'CRITICAL',
    weight: 30,
    regex: /\b(arrest\s+warrant|legal\s+action\s+will\s+be\s+taken|law\s+enforcement|court\s+summons|police\s+department|jail\s+time|penalty\s+charges)\b/i,
    indicator: 'Coercive legal threats and intimidation language identified.',
  },
  {
    category: 'Suspicious Hyperlinks in Text',
    severity: 'MEDIUM',
    weight: 15,
    regex: /(https?:\/\/[^\s]+|bit\.ly\/[^\s]+|tinyurl\.com\/[^\s]+|t\.co\/[^\s]+|\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b)/i,
    indicator: 'Embedded hyperlink or shortened redirect URL identified in message body.',
  },
];

/**
 * Analyzes a text message for scam, phishing, and social engineering indicators.
 *
 * @param {string} text
 * @returns {object} Structured analysis report
 */
export function analyzeMessageContent(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('Invalid message input: Expected non-empty string.');
  }

  const trimmed = text.trim();
  const matchedIndicators = [];
  const detectedCategories = new Set();

  for (const pattern of THREAT_PATTERNS) {
    if (pattern.regex.test(trimmed)) {
      matchedIndicators.push({
        name: pattern.indicator,
        severity: pattern.severity,
        weight: pattern.weight,
        category: pattern.category,
      });
      detectedCategories.add(pattern.category);
    }
  }

  // Base score from heuristics (e.g. excessive capitalization or excessive exclamation marks)
  let baseScore = 0;
  const uppercaseRatio = (trimmed.replace(/[^A-Z]/g, '').length / (trimmed.length || 1));
  if (uppercaseRatio > 0.35 && trimmed.length > 20) {
    baseScore += 8;
    matchedIndicators.push({
      name: 'Unusual capitalization patterns (aggressive visual emphasis).',
      severity: 'LOW',
      weight: 8,
    });
  }

  const exclamationCount = (trimmed.match(/!{2,}/g) || []).length;
  if (exclamationCount >= 2) {
    baseScore += 5;
    matchedIndicators.push({
      name: 'Repetitive exclamation markers detected (heightened artificial panic).',
      severity: 'LOW',
      weight: 5,
    });
  }

  const { score, riskLevel, confidence } = calculateRiskScore(matchedIndicators, baseScore);

  // Determine threat category
  let threatCategory = 'Likely Legitimate';
  if (riskLevel === 'CRITICAL') {
    threatCategory = detectedCategories.has('OTP / Verification Code Harvesting')
      ? 'Credential / OTP Phishing'
      : detectedCategories.has('Fear & Legal Coercion')
      ? 'Extortion & Legal Coercion Scam'
      : 'High-Confidence Scam / Phishing';
  } else if (riskLevel === 'HIGH') {
    if (detectedCategories.has('KYC & Regulatory Compliance Scam')) threatCategory = 'KYC Deception Scheme';
    else if (detectedCategories.has('Prize & Lottery Scams')) threatCategory = 'Prize / Lottery Scam';
    else if (detectedCategories.has('Banking / Payment Demands')) threatCategory = 'Financial / Payment Fraud';
    else threatCategory = 'Potential Phishing Attempt';
  } else if (riskLevel === 'MEDIUM') {
    threatCategory = 'Suspicious Linguistic Patterns';
  }

  // Generate explainable summary using risk-oriented language
  const indicatorList = matchedIndicators.map((i) => i.name);
  let explanation = '';
  if (indicatorList.length === 0) {
    explanation = 'The message was analyzed for urgency triggers, credential theft requests, brand impersonation, and coercion patterns. No recognized scam or phishing signatures were detected in this content.';
  } else {
    explanation = `Analysis identified ${indicatorList.length} potential risk indicator(s). Key factors include: ${Array.from(detectedCategories).join(', ') || 'anomalous linguistic framing'}. Potential phishing indicators detected. Exercise appropriate caution.`;
  }

  const recommendedAction = getRecommendedAction(riskLevel, 'message');

  return {
    riskScore: score,
    riskLevel,
    threatCategory,
    confidence,
    indicators: indicatorList,
    explanation,
    recommendedAction,
    analysisType: 'message',
    engineMode: 'rule-based-fallback',
  };
}
