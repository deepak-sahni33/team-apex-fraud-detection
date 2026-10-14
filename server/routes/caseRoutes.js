// server/routes/caseRoutes.js
import { Router } from 'express';
import {
  handleGetCases,
  handleGetCaseById,
  handleDeleteCase,
} from '../controllers/caseController.js';
import { validateCaseIdParam } from '../middleware/validate.js';

const router = Router();

router.get('/', handleGetCases);
router.get('/:id', validateCaseIdParam, handleGetCaseById);
router.delete('/:id', validateCaseIdParam, handleDeleteCase);

export default router;
