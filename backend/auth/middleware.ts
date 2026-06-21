import { Response, NextFunction } from "express";
import { verifyToken } from "./jwt";
import { AppError } from "../utils/api-error";
import { AuthRequest } from "../types/express";

export type { AuthRequest };

export function requireAuth(
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization;

  if (!header) {
    return next(new AppError(401, "Unauthorized"));
  }

  try {
    const payload = verifyToken(header);
    req.userId = payload.userId;
    next();
  } catch {
    next(new AppError(401, "Invalid token"));
  }
}
