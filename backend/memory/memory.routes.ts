import { Router } from "express";
import { requireAuth } from "../auth/middleware";
import { validate } from "../middleware/validate";
import {
  createMemoryHandler,
  getMemories,
  searchMemoriesHandler,
  getMemory,
  updateMemoryHandler,
  deleteMemoryHandler,
} from "./memory.controller";
import {
  createMemorySchema,
  updateMemorySchema,
  listMemoriesSchema,
  searchMemoriesSchema,
  memoryIdSchema,
} from "../validators/memory.validator";

const router = Router();

router.post(
  "/create",
  requireAuth,
  validate(createMemorySchema),
  createMemoryHandler,
);
router.get(
  "/search",
  requireAuth,
  validate(searchMemoriesSchema, "query"),
  searchMemoriesHandler,
);
router.get(
  "/",
  requireAuth,
  validate(listMemoriesSchema, "query"),
  getMemories,
);
router.get(
  "/:id",
  requireAuth,
  validate(memoryIdSchema, "params"),
  getMemory,
);
router.patch(
  "/:id",
  requireAuth,
  validate(memoryIdSchema, "params"),
  validate(updateMemorySchema),
  updateMemoryHandler,
);
router.delete(
  "/:id",
  requireAuth,
  validate(memoryIdSchema, "params"),
  deleteMemoryHandler,
);

export default router;
