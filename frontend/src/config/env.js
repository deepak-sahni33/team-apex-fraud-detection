// src/config/env.js
// Central place to read all Vite environment variables.
// Never import process.env directly in components — always use this module.

export const ENV = {
  API_BASE_URL:   import.meta.env.VITE_API_BASE_URL  || 'http://localhost:5000/api',
  APP_NAME:       import.meta.env.VITE_APP_NAME      || 'ScamShield  AI',
  APP_VERSION:    import.meta.env.VITE_APP_VERSION   || '1.0.0',
  DEMO_MODE:      import.meta.env.VITE_ENABLE_DEMO_MODE === 'true',
  IS_DEV:         import.meta.env.DEV,
  IS_PROD:        import.meta.env.PROD,
};
