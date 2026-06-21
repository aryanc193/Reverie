import bcrypt from "bcryptjs";
import { IUser, User, UserRole } from "../auth/auth.model";
import { signAccessToken } from "../auth/jwt";
import { env } from "../config/env";
import { AppError } from "../utils/api-error";
import {
  generateRefreshToken,
  getRefreshTokenExpiry,
  hashRefreshToken,
} from "../utils/refresh-token";
import { LoginInput, RegisterInput } from "../validators/auth.validator";

const SALT_ROUNDS = 12;
const MAX_REFRESH_TOKENS = 5;

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface PublicUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: Date;
}

function toPublicUser(user: IUser): PublicUser {
  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
  };
}

function pruneRefreshTokens(user: IUser) {
  const now = new Date();
  user.refreshTokens = user.refreshTokens.filter(
    (entry) => entry.expiresAt > now,
  );

  if (user.refreshTokens.length > MAX_REFRESH_TOKENS) {
    user.refreshTokens = user.refreshTokens
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, MAX_REFRESH_TOKENS);
  }
}

async function issueTokens(user: IUser): Promise<AuthTokens> {
  const accessToken = signAccessToken({
    userId: user._id.toString(),
    role: user.role,
  });

  const refreshToken = generateRefreshToken();
  const tokenHash = hashRefreshToken(refreshToken);

  pruneRefreshTokens(user);
  user.refreshTokens.push({
    tokenHash,
    expiresAt: getRefreshTokenExpiry(env.refreshTokenTtlDays),
    createdAt: new Date(),
  });

  await user.save();

  return { accessToken, refreshToken };
}

async function findUserByRefreshToken(refreshToken: string) {
  const tokenHash = hashRefreshToken(refreshToken);
  const now = new Date();

  const user = await User.findOne({
    refreshTokens: {
      $elemMatch: {
        tokenHash,
        expiresAt: { $gt: now },
      },
    },
  });

  if (!user) {
    return null;
  }

  return user;
}

async function revokeRefreshToken(user: IUser, refreshToken: string) {
  const tokenHash = hashRefreshToken(refreshToken);
  user.refreshTokens = user.refreshTokens.filter(
    (entry) => entry.tokenHash !== tokenHash,
  );
  await user.save();
}

export async function registerUser(input: RegisterInput): Promise<AuthTokens> {
  const existing = await User.findOne({ email: input.email });
  if (existing) {
    throw new AppError(409, "Email already in use");
  }

  const existingUsername = await User.findOne({ username: input.username });
  if (existingUsername) {
    throw new AppError(409, "Username already in use");
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const user = await User.create({
    username: input.username,
    email: input.email,
    passwordHash,
  });

  return issueTokens(user);
}

export async function loginUser(input: LoginInput): Promise<AuthTokens> {
  const user = await User.findOne({ username: input.username });
  if (!user) {
    throw new AppError(401, "Invalid credentials");
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) {
    throw new AppError(401, "Invalid credentials");
  }

  return issueTokens(user);
}

export async function refreshTokens(
  refreshToken: string,
): Promise<AuthTokens> {
  const user = await findUserByRefreshToken(refreshToken);
  if (!user) {
    throw new AppError(401, "Invalid refresh token");
  }

  await revokeRefreshToken(user, refreshToken);
  return issueTokens(user);
}

export async function logoutUser(refreshToken: string): Promise<void> {
  const user = await findUserByRefreshToken(refreshToken);
  if (!user) {
    throw new AppError(401, "Invalid refresh token");
  }

  await revokeRefreshToken(user, refreshToken);
}

export async function getCurrentUser(userId: string): Promise<PublicUser> {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, "User not found");
  }

  return toPublicUser(user);
}
