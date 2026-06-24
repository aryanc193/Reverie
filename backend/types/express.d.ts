import { Request } from "express";
import { UserRole } from "../auth/auth.model";

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: UserRole;
  validatedBody?: unknown;
  validatedQuery?: unknown;
  validatedParams?: unknown;
}
