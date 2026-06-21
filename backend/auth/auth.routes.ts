import { Router } from "express";
import { register, login } from "./auth.controller";
import { validate } from "../middleware/validate";
import { authRateLimit } from "../middleware/rate-limit";
import { registerSchema, loginSchema } from "../validators/auth.validator";

const router = Router();

router.post(
  "/register",
  authRateLimit,
  validate(registerSchema),
  register,
);
router.post("/login", authRateLimit, validate(loginSchema), login);

export default router;
