// server/controllers/dashboardController.js
import { getDashboardStats } from '../services/caseService.js';

/**
 * GET /api/dashboard/stats
 */
export async function handleGetDashboardStats(req, res, next) {
  try {
    const stats = await getDashboardStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (err) {
    next(err);
  }
}
