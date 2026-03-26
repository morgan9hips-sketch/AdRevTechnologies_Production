import promClient from 'prom-client';

// Enable default metrics (CPU, memory, event loop, etc.)
promClient.collectDefaultMetrics();

// Create a Registry
export const register = promClient.register;

// Business Metrics

// Payout metrics
export const payoutCounter = new promClient.Counter({
  name: 'payouts_total',
  help: 'Total number of payouts processed',
  labelNames: ['status', 'currency'],
});

export const payoutAmount = new promClient.Counter({
  name: 'payout_amount_cents_total',
  help: 'Total amount of payouts in cents',
  labelNames: ['status', 'currency'],
});

// User signup metrics
export const signupCounter = new promClient.Counter({
  name: 'user_signups_total',
  help: 'Total number of user signups',
  labelNames: ['verified'],
});

// Ad watch metrics
export const adWatchCounter = new promClient.Counter({
  name: 'ad_watches_total',
  help: 'Total number of ad watches',
  labelNames: ['status', 'ad_id'],
});

export const adWatchDuration = new promClient.Histogram({
  name: 'ad_watch_duration_seconds',
  help: 'Duration of ad watches in seconds',
  labelNames: ['ad_id'],
  buckets: [5, 10, 15, 30, 60, 120],
});

// Revenue metrics
export const revenueCounter = new promClient.Counter({
  name: 'platform_revenue_cents_total',
  help: 'Total platform revenue (fees) in cents',
  labelNames: ['source'],
});

// API metrics
export const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
});

export const httpRequestTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

// Database metrics
export const dbQueryDuration = new promClient.Histogram({
  name: 'db_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation', 'model'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 3],
});

export const dbConnectionPool = new promClient.Gauge({
  name: 'db_connection_pool_size',
  help: 'Current database connection pool size',
  labelNames: ['state'],
});

// Authentication metrics
export const authAttempts = new promClient.Counter({
  name: 'auth_attempts_total',
  help: 'Total authentication attempts',
  labelNames: ['method', 'success'],
});

// KYC metrics
export const kycSubmissions = new promClient.Counter({
  name: 'kyc_submissions_total',
  help: 'Total KYC submissions',
  labelNames: ['status'],
});

// Helper functions for recording metrics
export const recordPayout = (status: string, amountCents: number, currency = 'CAD') => {
  payoutCounter.inc({ status, currency });
  payoutAmount.inc({ status, currency }, amountCents);
};

export const recordSignup = (verified: boolean) => {
  signupCounter.inc({ verified: verified.toString() });
};

export const recordAdWatch = (adId: number, status: string, durationSeconds: number) => {
  adWatchCounter.inc({ status, ad_id: adId.toString() });
  adWatchDuration.observe({ ad_id: adId.toString() }, durationSeconds);
};

export const recordRevenue = (source: string, amountCents: number) => {
  revenueCounter.inc({ source }, amountCents);
};

export const recordHttpRequest = (
  method: string,
  route: string,
  statusCode: number,
  duration: number
) => {
  httpRequestTotal.inc({ method, route, status_code: statusCode.toString() });
  httpRequestDuration.observe({ method, route, status_code: statusCode.toString() }, duration);
};

export const recordDbQuery = (operation: string, model: string, duration: number) => {
  dbQueryDuration.observe({ operation, model }, duration);
};

export const recordAuthAttempt = (method: string, success: boolean) => {
  authAttempts.inc({ method, success: success.toString() });
};

export const recordKycSubmission = (status: string) => {
  kycSubmissions.inc({ status });
};
