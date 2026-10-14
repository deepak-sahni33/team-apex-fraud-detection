// server/analyzers/riskScorer.js

export const RISK_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
};

/**
 * Maps a numeric risk score (0-100) to standard Risk Level tiers.
 * 0-24   LOW
 * 25-49  MEDIUM
 * 50-74  HIGH
 * 75-100 CRITICAL
 */
export function getRiskLevel(score) {
  if (score >= 75) return RISK_LEVELS.CRITICAL;
  if (score >= 50) return RISK_LEVELS.HIGH;
  if (score >= 25) return RISK_LEVELS.MEDIUM;
  return RISK_LEVELS.LOW;
}

/**
 * Calculates a normalized, explainable risk score (0-100) based on detected indicators and baseline factors.
 *
 * @param {Array<{ name: string, severity: 'LOW'|'MEDIUM'|'HIGH'|'CRITICAL', weight?: number }>} indicators
 * @param {number} baseScore
 * @returns {{ score: number, riskLevel: string, confidence: number }}
 */
export function calculateRiskScore(indicators = [], baseScore = 0) {
  const SEVERITY_WEIGHTS = {
    LOW: 5,
    MEDIUM: 12,
    HIGH: 22,
    CRITICAL: 35,
  };

  let totalWeight = baseScore;

  for (const item of indicators) {
    const weight = item.weight || SEVERITY_WEIGHTS[item.severity] || 10;
    totalWeight += weight;
  }

  // Cap score between 0 and 100
  const score = Math.max(0, Math.min(100, Math.round(totalWeight)));
  const riskLevel = getRiskLevel(score);

  // Confidence estimation based on indicator clarity
  const indicatorCount = indicators.length;
  let confidence = 85;
  if (indicatorCount === 0) confidence = 95; // Confidently safe/neutral
  else if (indicatorCount >= 3) confidence = 92;
  else confidence = 85;

  return {
    score,
    riskLevel,
    confidence,
  };
}

/**
 * Produces structured actionable advice based on risk level and threat type.
 */
export function getRecommendedAction(riskLevel, type = 'message') {
  switch (riskLevel) {
    case RISK_LEVELS.CRITICAL:
      return type === 'url'
        ? 'Do not open or interact with this link. Block the domain at your network or DNS level and report to security authorities.'
        : 'Do not respond, click links, or provide any credentials. Block the sender immediately and report the message to IT/security.';
    case RISK_LEVELS.HIGH:
      return type === 'url'
        ? 'High probability of phishing or deceptive content. Avoid visiting or submitting any login or financial information.'
        : 'Exercise extreme caution. Do not click embedded links or disclose passwords/OTPs. Verify sender through official secondary channels.';
    case RISK_LEVELS.MEDIUM:
      return type === 'url'
        ? 'Suspicious attributes detected. Verify the website certificate and domain spelling before entering sensitive data.'
        : 'Suspicious linguistic patterns found. Contact the organization directly using their official website or phone number.';
    case RISK_LEVELS.LOW:
    default:
      return 'No immediate threat indicators detected. Maintain standard digital hygiene and verify unsolicited communications.';
  }
}
