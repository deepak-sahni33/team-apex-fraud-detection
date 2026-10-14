// server/analyzers/urlAnalyzer.js
import { calculateRiskScore, getRecommendedAction } from './riskScorer.js';

// Suspicious security / auth keywords in URLs
const SUSPICIOUS_KEYWORDS = [
  'login', 'signin', 'verify', 'verification', 'secure', 'security', 'account',
  'update', 'banking', 'wallet', 'confirm', 'recover', 'auth', 'authorize',
  'password', 'credential', 'support-desk', 'billing', 'invoice', 'claim-reward',
];

// High-risk or frequently abused generic TLDs
const HIGH_RISK_TLDS = [
  '.xyz', '.top', '.tk', '.ml', '.ga', '.cf', '.buzz', '.cam', '.live',
  '.work', '.click', '.loan', '.fit', '.country', '.download',
];

// Known targeted brands for domain typosquatting / spoofing
const TARGET_BRANDS = [
  'paypal', 'apple', 'amazon', 'microsoft', 'google', 'netflix', 'chase',
  'wellsfargo', 'bankofamerica', 'binance', 'coinbase', 'metamask', 'irs',
  'dhl', 'fedex', 'usps',
];

/**
 * Modular URL heuristic analyzer.
 *
 * @param {string} rawUrl
 * @returns {object} Structured analysis report
 */
export function analyzeUrlStructure(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    throw new Error('Invalid URL input: URL string is required.');
  }

  let parsed;
  try {
    // Add protocol if missing for parse test
    const formatted = /^https?:\/\//i.test(rawUrl.trim()) ? rawUrl.trim() : `http://${rawUrl.trim()}`;
    parsed = new URL(formatted);
  } catch {
    const error = new Error('Malformed URL: The provided string is not a valid URL structure.');
    error.statusCode = 400;
    throw error;
  }

  const indicators = [];
  const detectedCategories = new Set();
  const hostname = parsed.hostname.toLowerCase();
  const fullPath = (parsed.pathname + parsed.search).toLowerCase();

  // 1. IP-Address Hostname Check
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const isIpHost = ipv4Regex.test(hostname) || hostname.startsWith('[') || hostname.endsWith(']');
  if (isIpHost) {
    indicators.push({
      name: 'IP address used as hostname instead of a standard domain name.',
      severity: 'CRITICAL',
      weight: 35,
    });
    detectedCategories.add('IP-Based Hostname');
  }

  // 2. Punycode / IDN Homograph Attack Check
  if (hostname.includes('xn--')) {
    indicators.push({
      name: 'Punycode encoding detected (potential IDN homograph character spoofing).',
      severity: 'HIGH',
      weight: 25,
    });
    detectedCategories.add('Homograph Deception');
  }

  // 3. Userinfo / @ Symbol Obfuscation Check
  if (parsed.username || parsed.password || rawUrl.includes('@')) {
    indicators.push({
      name: 'URL contains "@" credential delimiter (frequently used to disguise true host).',
      severity: 'CRITICAL',
      weight: 35,
    });
    detectedCategories.add('Credential Obfuscation');
  }

  // 4. Insecure HTTP Check
  if (parsed.protocol === 'http:') {
    indicators.push({
      name: 'Insecure transmission: URL uses unencrypted HTTP rather than HTTPS.',
      severity: 'LOW',
      weight: 8,
    });
  }

  // 5. Excessive Subdomains Check
  const domainParts = hostname.split('.');
  if (!isIpHost && domainParts.length > 3) {
    indicators.push({
      name: `Excessive subdomain nesting (${domainParts.length - 2} subdomain levels detected).`,
      severity: 'MEDIUM',
      weight: 15,
    });
    detectedCategories.add('Deep Subdomain Nesting');
  }

  // 6. Suspicious Keyword Presence
  const matchedKeywords = SUSPICIOUS_KEYWORDS.filter(
    (kw) => hostname.includes(kw) || fullPath.includes(kw)
  );
  if (matchedKeywords.length >= 2) {
    indicators.push({
      name: `Multiple security/credential keywords in URL (${matchedKeywords.slice(0, 4).join(', ')}).`,
      severity: 'HIGH',
      weight: 20,
    });
    detectedCategories.add('Sensitive Keyword Stacking');
  } else if (matchedKeywords.length === 1 && (hostname.includes(matchedKeywords[0]) || fullPath.includes(matchedKeywords[0]))) {
    indicators.push({
      name: `Sensitive security/auth keyword identified in URL path or hostname ("${matchedKeywords[0]}").`,
      severity: 'LOW',
      weight: 8,
    });
  }

  // 7. Brand Spoofing / Hyphenated Hostname
  const brandMatches = TARGET_BRANDS.filter((brand) => hostname.includes(brand));
  const hyphenCount = (hostname.match(/-/g) || []).length;
  if (brandMatches.length > 0 && !hostname.endsWith(`${brandMatches[0]}.com`)) {
    indicators.push({
      name: `Target brand name ("${brandMatches[0]}") located in unofficial host pattern.`,
      severity: 'CRITICAL',
      weight: 30,
    });
    detectedCategories.add('Brand Impersonation');
  } else if (hyphenCount >= 3) {
    indicators.push({
      name: 'Unusually high hyphen count in domain name (common in typo-squatting domains).',
      severity: 'MEDIUM',
      weight: 14,
    });
    detectedCategories.add('Anomalous Domain Syntax');
  }

  // 8. High-Risk TLD Check
  const hasHighRiskTld = HIGH_RISK_TLDS.some((tld) => hostname.endsWith(tld));
  if (hasHighRiskTld) {
    indicators.push({
      name: `Hostname uses a top-level domain frequently associated with deceptive campaigns (${hostname.slice(hostname.lastIndexOf('.'))}).`,
      severity: 'MEDIUM',
      weight: 14,
    });
    detectedCategories.add('High-Risk TLD');
  }

  // 9. Non-Standard Port Check
  const nonStandardPorts = ['8080', '8888', '8443', '2082', '2083', '2086', '1337', '3000', '5000'];
  if (parsed.port && nonStandardPorts.includes(parsed.port)) {
    indicators.push({
      name: `URL communicates over non-standard web port (:${parsed.port}).`,
      severity: 'MEDIUM',
      weight: 12,
    });
    detectedCategories.add('Non-Standard Port');
  }

  // 10. Excessive Length & URL Obfuscation
  if (rawUrl.length > 120) {
    indicators.push({
      name: `Abnormally long URL length (${rawUrl.length} characters).`,
      severity: 'LOW',
      weight: 6,
    });
  }

  // 11. Suspicious Query Redirect Parameters
  const openRedirectParams = ['redirect', 'url', 'target', 'goto', 'return_url', 'link'];
  const hasRedirectParam = openRedirectParams.some((param) => parsed.searchParams.has(param));
  if (hasRedirectParam) {
    indicators.push({
      name: 'URL contains open redirection parameter pattern (often leveraged in phishing chains).',
      severity: 'MEDIUM',
      weight: 12,
    });
    detectedCategories.add('Open Redirect Vector');
  }

  const { score, riskLevel, confidence } = calculateRiskScore(indicators, 0);

  // Determine threat category
  let threatCategory = 'Likely Legitimate URL';
  if (riskLevel === 'CRITICAL') {
    threatCategory = detectedCategories.has('Brand Impersonation')
      ? 'Suspected Brand Typosquatting / Phishing'
      : detectedCategories.has('IP-Based Hostname')
      ? 'Direct IP Threat Vector'
      : 'Malicious / Deceptive URL Pattern';
  } else if (riskLevel === 'HIGH') {
    threatCategory = detectedCategories.has('Homograph Deception')
      ? 'Punycode Homograph Deception'
      : 'Suspicious Domain Infrastructure';
  } else if (riskLevel === 'MEDIUM') {
    threatCategory = 'Unverified URL Structure';
  }

  const indicatorList = indicators.map((i) => i.name);
  let explanation = '';
  if (indicatorList.length === 0) {
    explanation = 'Structural and heuristic inspection did not detect any known suspicious hostname anomalies, IP redirection, brand spoofing, or abnormal parameter patterns.';
  } else {
    explanation = `Evaluation identified ${indicatorList.length} potential risk indicator(s) across domain syntax, protocol security, and parameter structure. Note: Heuristic indicators indicate elevated risk profile, but do not definitively prove criminal ownership.`;
  }

  const recommendedAction = getRecommendedAction(riskLevel, 'url');

  return {
    riskScore: score,
    riskLevel,
    threatCategory,
    confidence,
    indicators: indicatorList,
    explanation,
    recommendedAction,
    analysisType: 'url',
    engineMode: 'rule-based-fallback',
  };
}
