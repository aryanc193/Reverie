import { createHash, randomBytes } from "crypto";

export function generateRefreshToken(): string {
  return randomBytes(32).toString("hex");
}

export function hashRefreshToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function getRefreshTokenExpiry(ttlDays: number): Date {
  return new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);
}
