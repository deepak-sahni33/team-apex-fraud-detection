// server/routes/analyzeRoutes.js
import { Router } from 'express';
import { handleMessageAnalysis, handleUrlAnalysis } from '../controllers/analyzeController.js';
import { validateMessageInput, validateUrlInput } from '../middleware/validate.js';
import { apiRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Apply rate limiter to analysis endpoints
router.use(apiRateLimiter);

router.post('/message', validateMessageInput, handleMessageAnalysis);
router.post('/url', validateUrlInput, handleUrlAnalysis);

export default router;
