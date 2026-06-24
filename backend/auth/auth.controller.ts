import { Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import {
  registerUser,
  loginUser,
  refreshTokens,
  logoutUser,
  getCurrentUser,
} from "../services/auth.service";
import { AuthRequest } from "../types/express";
import {
  RegisterInput,
  LoginInput,
  RefreshInput,
  LogoutInput,
} from "../validators/auth.validator";

export const register = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await registerUser(req.validatedBody as RegisterInput);
  res.status(201).json(result);
});

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await loginUser(req.validatedBody as LoginInput);
  res.json(result);
});

export const refresh = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { refreshToken } = req.validatedBody as RefreshInput;
  const result = await refreshTokens(refreshToken);
  res.json(result);
});

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { refreshToken } = req.validatedBody as LogoutInput;
  await logoutUser(refreshToken);
  res.json({ success: true });
});

export const me = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await getCurrentUser(req.userId!);
  res.json(user);
});
