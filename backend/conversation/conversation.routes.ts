import { Router } from "express";
import { requireAuth } from "../auth/middleware";
import { validate } from "../middleware/validate";
import {
  createConversationHandler,
  getConversations,
  getConversation,
  deleteConversationHandler,
  appendMessageHandler,
} from "./conversation.controller";
import {
  createConversationSchema,
  listConversationsSchema,
  appendMessageSchema,
  conversationIdSchema,
} from "../validators/conversation.validator";

const router = Router();

router.get(
  "/",
  requireAuth,
  validate(listConversationsSchema, "query"),
  getConversations,
);
router.post(
  "/",
  requireAuth,
  validate(createConversationSchema),
  createConversationHandler,
);
router.get(
  "/:id",
  requireAuth,
  validate(conversationIdSchema, "params"),
  getConversation,
);
router.post(
  "/:id/messages",
  requireAuth,
  validate(conversationIdSchema, "params"),
  validate(appendMessageSchema),
  appendMessageHandler,
);
router.delete(
  "/:id",
  requireAuth,
  validate(conversationIdSchema, "params"),
  deleteConversationHandler,
);

export default router;
