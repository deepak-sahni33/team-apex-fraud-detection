// server/controllers/caseController.js
import { getCases, getCaseById, deleteCaseById } from '../services/caseService.js';
import { logger } from '../utils/logger.js';

/**
 * GET /api/cases
 */
export async function handleGetCases(req, res, next) {
  try {
    const { search, riskLevel, analysisType, page, limit } = req.query;
    const result = await getCases({ search, riskLevel, analysisType, page, limit });

    res.status(200).json({
      success: true,
      data: result.cases,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
      limit: result.limit,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/cases/:id
 */
export async function handleGetCaseById(req, res, next) {
  try {
    const { id } = req.params;
    const foundCase = await getCaseById(id);

    if (!foundCase) {
      return res.status(404).json({
        success: false,
        error: 'Case Not Found',
        message: `No threat analysis case found with ID "${id}".`,
      });
    }

    res.status(200).json({
      success: true,
      data: foundCase,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/cases/:id
 */
export async function handleDeleteCase(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await deleteCaseById(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Case Not Found',
        message: `Cannot delete: No threat case found with ID "${id}".`,
      });
    }

    logger.info(`Deleted case: ${id}`);
    res.status(200).json({
      success: true,
      message: `Case ${id} successfully deleted from threat repository.`,
    });
  } catch (err) {
    next(err);
  }
}
