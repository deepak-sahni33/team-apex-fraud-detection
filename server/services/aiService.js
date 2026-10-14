// server/services/aiService.js
import { ENV } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { analyzeMessageContent } from '../analyzers/messageAnalyzer.js';
import { analyzeUrlStructure } from '../analyzers/urlAnalyzer.js';

const SYSTEM_PROMPT = `
You are ScamShield  AI, an advanced cybersecurity threat detection and linguistic analysis engine.
Analyze the provided input (message or URL) for phishing, scam indicators, impersonation, urgency manipulation, fraud, or credential theft.
You MUST respond with ONLY a valid, raw JSON object (no markdown wrapping, no backticks, no explanations outside JSON) matching this exact schema:
{
  "riskScore": <number from 0 to 100>,
  "riskLevel": "<LOW | MEDIUM | HIGH | CRITICAL>",
  "threatCategory": "<short string identifying the threat category>",
  "confidence": <number from 0 to 100>,
  "indicators": ["<array of specific, explainable evidence strings>"],
  "explanation": "<explainable summary using risk-oriented language>",
  "recommendedAction": "<actionable user guidance>"
}
Risk level score tiers:
0-24: LOW
25-49: MEDIUM
50-74: HIGH
75-100: CRITICAL
Important: Use objective cybersecurity risk assessment language (e.g. "Potential phishing indicators detected").
`;

/**
 * Analyzes content using configured AI provider or transparently falls back
 * to the deterministic cybersecurity heuristics engine.
 */
export async function analyzeWithAi({ type, content }) {
  const hasGeminiKey = Boolean(ENV.GEMINI_API_KEY && ENV.GEMINI_API_KEY.trim());
  const hasOpenAiKey = Boolean(ENV.OPENAI_API_KEY && ENV.OPENAI_API_KEY.trim());

  if (hasGeminiKey) {
    try {
      logger.info(`Invoking Gemini AI threat analysis (${ENV.GEMINI_MODEL})...`);
      const result = await callGemini(type, content);
      return {
        ...result,
        analysisType: type,
        engineMode: 'ai',
        aiProvider: 'gemini',
        modelVersion: ENV.GEMINI_MODEL,
      };
    } catch (err) {
      logger.warn(`Gemini AI analysis failed: ${err.message}. Activating deterministic fallback rules.`);
    }
  } else if (hasOpenAiKey) {
    try {
      logger.info(`Invoking OpenAI threat analysis (${ENV.OPENAI_MODEL})...`);
      const result = await callOpenAi(type, content);
      return {
        ...result,
        analysisType: type,
        engineMode: 'ai',
        aiProvider: 'openai',
        modelVersion: ENV.OPENAI_MODEL,
      };
    } catch (err) {
      logger.warn(`OpenAI analysis failed: ${err.message}. Activating deterministic fallback rules.`);
    }
  }

  // Clearly labelled DEVELOPMENT / FALLBACK analysis mode using deterministic rules
  logger.info(`Using deterministic rule-based threat engine for ${type} analysis.`);
  const fallbackResult = type === 'url' ? analyzeUrlStructure(content) : analyzeMessageContent(content);

  return {
    ...fallbackResult,
    analysisType: type,
    engineMode: 'rule-based-fallback',
    aiProvider: 'deterministic-rules-engine',
    modelVersion: 'rule-engine-v1.0',
  };
}

/**
 * Calls Google Gemini REST API
 */
async function callGemini(type, content) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${ENV.GEMINI_MODEL}:generateContent?key=${ENV.GEMINI_API_KEY}`;
  const prompt = `${SYSTEM_PROMPT}\n\nInput type: ${type.toUpperCase()}\nInput content to analyze:\n"""${content}"""`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          topP: 0.8,
          maxOutputTokens: 1024,
          responseMimeType: 'application/json',
        },
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API error (Status ${res.status}): ${errText}`);
    }

    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error('Empty response from Gemini API');

    return parseAiJsonResponse(rawText);
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Calls OpenAI REST API
 */
async function callOpenAi(type, content) {
  const endpoint = 'https://api.openai.com/v1/chat/completions';
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ENV.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: ENV.OPENAI_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Input type: ${type.toUpperCase()}\nInput content:\n"""${content}"""` },
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenAI API error (Status ${res.status}): ${errText}`);
    }

    const data = await res.json();
    const rawText = data.choices?.[0]?.message?.content;
    if (!rawText) throw new Error('Empty response from OpenAI API');

    return parseAiJsonResponse(rawText);
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Cleanly parses JSON string from LLMs, stripping markdown fences if present
 */
function parseAiJsonResponse(raw) {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
  else if (cleaned.startsWith('```')) cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();

  const parsed = JSON.parse(cleaned);

  const score = Math.max(0, Math.min(100, Math.round(Number(parsed.riskScore) || 0)));
  const validLevels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const riskLevel = validLevels.includes(parsed.riskLevel?.toUpperCase())
    ? parsed.riskLevel.toUpperCase()
    : score >= 75 ? 'CRITICAL' : score >= 50 ? 'HIGH' : score >= 25 ? 'MEDIUM' : 'LOW';

  return {
    riskScore: score,
    riskLevel,
    threatCategory: parsed.threatCategory || 'Uncategorized Threat Profile',
    confidence: Math.max(0, Math.min(100, Math.round(Number(parsed.confidence) || 85))),
    indicators: Array.isArray(parsed.indicators) ? parsed.indicators : [],
    explanation: parsed.explanation || 'AI analysis completed.',
    recommendedAction: parsed.recommendedAction || 'Exercise standard digital hygiene.',
  };
}
