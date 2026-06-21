import { Response, NextFunction } from "express";
import { verifyAccessToken } from "./jwt";
import { AppError } from "../utils/api-error";
import { AuthRequest } from "../types/express";
import { UserRole } from "./auth.model";

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
    const payload = verifyAccessToken(header);
    req.userId = payload.userId;
    req.userRole = payload.role;
    next();
  } catch {
    next(new AppError(401, "Invalid token"));
  }
}

export function authorize(...roles: UserRole[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.userRole) {
      return next(new AppError(401, "Unauthorized"));
    }

    if (!roles.includes(req.userRole)) {
      return next(new AppError(403, "Forbidden"));
    }

    next();
  };
}
