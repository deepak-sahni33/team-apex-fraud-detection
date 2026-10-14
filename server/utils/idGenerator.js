// server/utils/idGenerator.js
import crypto from 'crypto';

/**
 * Generates a unique, standardized Case ID: CASE-YYYY-XXXXX
 * Example: CASE-2026-F4B2A
 */
export function generateCaseId() {
  const year = new Date().getFullYear();
  const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `CASE-${year}-${randomHex}`;
}
