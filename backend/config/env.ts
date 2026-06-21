function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT) || 3000,
  databaseUrl: requireEnv("DATABASE_CONNECTION_STRING"),
  jwtSecret: requireEnv("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  accessTokenTtl: process.env.ACCESS_TOKEN_TTL || "15m",
  refreshTokenTtlDays: Number(process.env.REFRESH_TOKEN_TTL_DAYS) || 7,
  reflectionPollIntervalMs:
    Number(process.env.REFLECTION_POLL_INTERVAL_MS) || 10_000,
  reflectionBatchSize: Number(process.env.REFLECTION_BATCH_SIZE) || 10,
  reflectionMaxAttempts: Number(process.env.REFLECTION_MAX_ATTEMPTS) || 3,
  reflectionStaleProcessingMs:
    Number(process.env.REFLECTION_STALE_PROCESSING_MS) || 5 * 60 * 1000,
  reflectionRetryBaseMs:
    Number(process.env.REFLECTION_RETRY_BASE_MS) || 5_000,
  aiProvider: process.env.AI_PROVIDER || "stub",
};
