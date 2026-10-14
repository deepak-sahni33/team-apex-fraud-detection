// server/routes/dashboardRoutes.js
import { Router } from 'express';
import { handleGetDashboardStats } from '../controllers/dashboardController.js';

const router = Router();

router.get('/stats', handleGetDashboardStats);

export default router;
