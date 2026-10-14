// server/controllers/analyzeController.js
import { analyzeWithAi } from '../services/aiService.js';
import { createCase } from '../services/caseService.js';
import { logger } from '../utils/logger.js';

/**
 * POST /api/analyze/message
 */
export async function handleMessageAnalysis(req, res, next) {
  const startTime = Date.now();

  try {
    const rawMessage = req.sanitizedMessage;
    logger.info(`Analyzing message (${rawMessage.length} chars)...`);

    const analysis = await analyzeWithAi({
      type: 'message',
      content: rawMessage,
    });

    const processingTimeMs = Date.now() - startTime;

    // Persist case
    const savedCase = await createCase({
      ...analysis,
      originalInput: rawMessage,
      processingTimeMs,
    });

    res.status(200).json({
      success: true,
      data: savedCase,
      // Top-level mirrors for convenience
      caseId: savedCase.caseId,
      riskScore: savedCase.riskScore,
      riskLevel: savedCase.riskLevel,
      threatCategory: savedCase.threatCategory,
      confidence: savedCase.confidence,
      indicators: savedCase.indicators,
      explanation: savedCase.explanation,
      recommendedAction: savedCase.recommendedAction,
      analysisType: savedCase.analysisType,
      originalInput: savedCase.originalInput,
      engineMode: savedCase.engineMode,
      processingTimeMs,
      createdAt: savedCase.createdAt,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/analyze/url
 */
export async function handleUrlAnalysis(req, res, next) {
  const startTime = Date.now();

  try {
    const rawUrl = req.sanitizedUrl;
    logger.info(`Analyzing URL: ${rawUrl}`);

    const analysis = await analyzeWithAi({
      type: 'url',
      content: rawUrl,
    });

    const processingTimeMs = Date.now() - startTime;

    // Persist case
    const savedCase = await createCase({
      ...analysis,
      originalInput: rawUrl,
      processingTimeMs,
    });

    res.status(200).json({
      success: true,
      data: savedCase,
      caseId: savedCase.caseId,
      riskScore: savedCase.riskScore,
      riskLevel: savedCase.riskLevel,
      threatCategory: savedCase.threatCategory,
      confidence: savedCase.confidence,
      indicators: savedCase.indicators,
      explanation: savedCase.explanation,
      recommendedAction: savedCase.recommendedAction,
      analysisType: savedCase.analysisType,
      originalInput: savedCase.originalInput,
      engineMode: savedCase.engineMode,
      processingTimeMs,
      createdAt: savedCase.createdAt,
    });
  } catch (err) {
    next(err);
  }
}
