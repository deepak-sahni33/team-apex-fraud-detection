// server/routes/index.js
import { Router } from 'express';
import analyzeRoutes from './analyzeRoutes.js';
import caseRoutes from './caseRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import { isDbConnected } from '../config/db.js';
import { ENV } from '../config/env.js';

const router = Router();

/**
 * GET /api/health
 */
router.get('/health', (req, res) => {
  const dbConnected = isDbConnected();
  const hasAiKey = Boolean(ENV.GEMINI_API_KEY || ENV.OPENAI_API_KEY);

  res.status(200).json({
    status: 'healthy',
    system: 'ScamShield  AI Threat Detection Platform',
    version: '2.0.0',
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    database: {
      connected: dbConnected,
      storageEngine: dbConnected ? 'MongoDB (Mongoose)' : 'Resilient In-Memory Store',
    },
    aiEngine: {
      provider: ENV.AI_PROVIDER,
      mode: hasAiKey ? 'AI Enhanced Pipeline' : 'Deterministic Rule-Based Fallback',
      model: hasAiKey ? (ENV.GEMINI_API_KEY ? ENV.GEMINI_MODEL : ENV.OPENAI_MODEL) : 'rule-engine-v1.0',
    },
  });
});

// Mount modules
router.use('/analyze', analyzeRoutes);
router.use('/cases', caseRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
