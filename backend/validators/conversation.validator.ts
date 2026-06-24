import { z } from "zod";

const objectIdSchema = z.string().min(1);

export const createConversationSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  metadata: z
    .object({
      relatedMemoryIds: z.array(objectIdSchema).max(20).optional(),
      insightIds: z.array(objectIdSchema).max(20).optional(),
    })
    .optional(),
});

export const listConversationsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const appendMessageSchema = z.object({
  content: z.string().trim().min(1, "Message content is required"),
});

export const conversationIdSchema = z.object({
  id: z.string().min(1, "Conversation id is required"),
});

export type CreateConversationInput = z.infer<typeof createConversationSchema>;
export type ListConversationsInput = z.infer<typeof listConversationsSchema>;
export type AppendMessageInput = z.infer<typeof appendMessageSchema>;
