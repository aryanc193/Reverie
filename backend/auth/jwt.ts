import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { UserRole } from "./auth.model";

export interface JwtPayload {
  userId: string;
  role: UserRole;
}

export function signAccessToken(payload: JwtPayload) {
  const options: SignOptions = {
    expiresIn: env.accessTokenTtl as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, env.jwtSecret, options);
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
}
