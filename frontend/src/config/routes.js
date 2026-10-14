// src/config/routes.js
// Centralised route path constants — use these instead of raw strings.

export const ROUTES = {
  HOME:          '/',
  SCANNER:       '/scanner',
  DASHBOARD:     '/dashboard',
  HISTORY:       '/history',
  CASE_DETAILS:  '/history/:caseId',
  ABOUT:         '/about',
};

/** Build a case-details URL with a specific ID */
export const caseDetailsPath = (caseId) => `/history/${caseId}`;
