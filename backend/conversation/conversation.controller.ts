import { Response } from "express";
import { AuthRequest } from "../types/express";
import { asyncHandler } from "../utils/async-handler";
import {
  createConversation,
  listConversations,
  getConversationById,
  deleteConversation,
  appendMessage,
} from "../services/conversation.service";
import {
  CreateConversationInput,
  ListConversationsInput,
  AppendMessageInput,
} from "../validators/conversation.validator";

export const createConversationHandler = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const conversation = await createConversation(
      req.userId!,
      req.body as CreateConversationInput,
    );
    res.status(201).json(conversation);
  },
);

export const getConversations = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const conversations = await listConversations(
      req.userId!,
      req.query as unknown as ListConversationsInput,
    );
    res.json(conversations);
  },
);

export const getConversation = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const conversation = await getConversationById(req.userId!, id);
    res.json(conversation);
  },
);

export const deleteConversationHandler = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await deleteConversation(req.userId!, id);
    res.json(result);
  },
);

export const appendMessageHandler = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const conversation = await appendMessage(
      req.userId!,
      id,
      req.body as AppendMessageInput,
    );
    res.json(conversation);
  },
);
