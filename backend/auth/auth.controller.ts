import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { registerUser, loginUser } from "../services/auth.service";
import { RegisterInput, LoginInput } from "../validators/auth.validator";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await registerUser(req.body as RegisterInput);
  res.status(201).json(result);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await loginUser(req.body as LoginInput);
  res.json(result);
});
