import { Router } from "express";
import { requireAuth } from "../auth/middleware";
import {
  createMemory,
  getMemories,
  getMemory,
  updateMemory,
  deleteMemory,
} from "./memory.controller";

const router = Router();

router.post("/create", requireAuth, createMemory);
router.get("/", requireAuth, getMemories);
router.get("/:id", requireAuth, getMemory);
router.patch("/:id", requireAuth, updateMemory);
router.delete("/:id", requireAuth, deleteMemory);

export default router;
