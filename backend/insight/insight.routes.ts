import { Router } from "express";
import { requireAuth } from "../auth/middleware";
import { validate } from "../middleware/validate";
import {
  getInsights,
  getInsight,
  deleteInsightHandler,
  generateInsightsHandler,
} from "./insight.controller";
import {
  listInsightsSchema,
  generateInsightsSchema,
  insightIdSchema,
} from "../validators/insight.validator";

const router = Router();

router.get(
  "/",
  requireAuth,
  validate(listInsightsSchema, "query"),
  getInsights,
);
router.post(
  "/generate",
  requireAuth,
  validate(generateInsightsSchema),
  generateInsightsHandler,
);
router.get(
  "/:id",
  requireAuth,
  validate(insightIdSchema, "params"),
  getInsight,
);
router.delete(
  "/:id",
  requireAuth,
  validate(insightIdSchema, "params"),
  deleteInsightHandler,
);

export default router;
