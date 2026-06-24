import { existsSync } from "fs";
import path from "path";
import dotenv from "dotenv";

function loadEnvFile() {
  const candidates = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(__dirname, "../.env"),
    path.resolve(__dirname, "../../.env"),
  ];

  for (const envPath of candidates) {
    if (existsSync(envPath)) {
      dotenv.config({ path: envPath });
      return envPath;
    }
  }

  dotenv.config();
  return null;
}

loadEnvFile();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  get port() {
    return Number(process.env.PORT) || 3000;
  },
  get databaseUrl() {
    return requireEnv("DATABASE_CONNECTION_STRING");
  },
  get jwtSecret() {
    return requireEnv("JWT_SECRET");
  },
  get jwtExpiresIn() {
    return process.env.JWT_EXPIRES_IN || "7d";
  },
  get accessTokenTtl() {
    return process.env.ACCESS_TOKEN_TTL || "15m";
  },
  get refreshTokenTtlDays() {
    return Number(process.env.REFRESH_TOKEN_TTL_DAYS) || 7;
  },
  get reflectionPollIntervalMs() {
    return Number(process.env.REFLECTION_POLL_INTERVAL_MS) || 10_000;
  },
  get reflectionBatchSize() {
    return Number(process.env.REFLECTION_BATCH_SIZE) || 10;
  },
  get reflectionMaxAttempts() {
    return Number(process.env.REFLECTION_MAX_ATTEMPTS) || 3;
  },
  get reflectionStaleProcessingMs() {
    return Number(process.env.REFLECTION_STALE_PROCESSING_MS) || 5 * 60 * 1000;
  },
  get reflectionRetryBaseMs() {
    return Number(process.env.REFLECTION_RETRY_BASE_MS) || 5_000;
  },
  get aiProvider() {
    return process.env.AI_PROVIDER || "stub";
  },
};
