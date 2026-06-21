import { Request, Response } from "express";
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

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await registerUser(req.body as RegisterInput);
  res.status(201).json(result);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await loginUser(req.body as LoginInput);
  res.json(result);
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body as RefreshInput;
  const result = await refreshTokens(refreshToken);
  res.json(result);
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body as LogoutInput;
  await logoutUser(refreshToken);
  res.json({ success: true });
});

export const me = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await getCurrentUser(req.userId!);
  res.json(user);
});
