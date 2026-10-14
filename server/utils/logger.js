// server/utils/logger.js
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

const currentLevel = process.env.NODE_ENV === 'test' ? LOG_LEVELS.WARN : LOG_LEVELS.INFO;

function formatMessage(level, message, meta = '') {
  const timestamp = new Date().toISOString();
  const metaStr = meta ? (typeof meta === 'object' ? ` ${JSON.stringify(meta)}` : ` ${meta}`) : '';
  return `[${timestamp}] [${level}] ${message}${metaStr}`;
}

export const logger = {
  debug: (msg, meta) => {
    if (currentLevel <= LOG_LEVELS.DEBUG) console.debug(formatMessage('DEBUG', msg, meta));
  },
  info: (msg, meta) => {
    if (currentLevel <= LOG_LEVELS.INFO) console.log(formatMessage('INFO', msg, meta));
  },
  warn: (msg, meta) => {
    if (currentLevel <= LOG_LEVELS.WARN) console.warn(formatMessage('WARN', msg, meta));
  },
  error: (msg, meta) => {
    if (currentLevel <= LOG_LEVELS.ERROR) console.error(formatMessage('ERROR', msg, meta));
  },
};
