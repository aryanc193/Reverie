import { Router } from "express";
import { register, login, refresh, logout, me } from "./auth.controller";
import { requireAuth } from "./middleware";
import { validate } from "../middleware/validate";
import { authRateLimit } from "../middleware/rate-limit";
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  logoutSchema,
} from "../validators/auth.validator";

const router = Router();

router.post(
  "/register",
  authRateLimit,
  validate(registerSchema),
  register,
);
router.post("/login", authRateLimit, validate(loginSchema), login);
router.post(
  "/refresh",
  authRateLimit,
  validate(refreshSchema),
  refresh,
);
router.post(
  "/logout",
  authRateLimit,
  validate(logoutSchema),
  logout,
);
router.get("/me", requireAuth, me);

export default router;
