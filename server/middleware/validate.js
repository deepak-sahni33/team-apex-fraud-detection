// server/middleware/validate.js

/**
 * Validates request body for message analysis
 */
export function validateMessageInput(req, res, next) {
  const { message } = req.body;

  if (message === undefined || message === null) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'The "message" field is required in request body.',
    });
  }

  if (typeof message !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'The "message" field must be a valid text string.',
    });
  }

  const trimmed = message.trim();
  if (trimmed.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'The message cannot be empty or contain only whitespace.',
    });
  }

  if (trimmed.length > 5000) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Message length exceeds maximum allowed limit of 5,000 characters.',
    });
  }

  req.sanitizedMessage = trimmed;
  next();
}

/**
 * Validates request body for URL analysis
 */
export function validateUrlInput(req, res, next) {
  const { url } = req.body;

  if (url === undefined || url === null) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'The "url" field is required in request body.',
    });
  }

  if (typeof url !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'The "url" field must be a valid string.',
    });
  }

  const trimmed = url.trim();
  if (trimmed.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'The URL cannot be empty or contain only whitespace.',
    });
  }

  // Validate URL structure
  try {
    const formatted = /^https?:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`;
    const parsed = new URL(formatted);
    const host = parsed.hostname;

    const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(host) || host.startsWith('[') || host.endsWith(']');
    const isLocalhost = host === 'localhost';
    const hasValidDomainDot = host.includes('.') && host.split('.').pop().length >= 2;

    if (!host || (!isIp && !isLocalhost && !hasValidDomainDot)) {
      throw new Error('Invalid domain structure');
    }
  } catch {
    return res.status(400).json({
      success: false,
      error: 'Malformed URL',
      message: 'The provided string is not a valid URL structure. Example: https://example.com/login',
    });
  }

  req.sanitizedUrl = trimmed;
  next();
}

/**
 * Validates case ID param
 */
export function validateCaseIdParam(req, res, next) {
  const { id } = req.params;

  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Invalid Parameter',
      message: 'A valid Case ID is required.',
    });
  }

  req.params.id = id.trim();
  next();
}
