import { Types } from "mongoose";
import { Conversation } from "../conversation/conversation.model";
import { Memory } from "../memory/memory.model";
import { AppError } from "../utils/api-error";
import { getAiService } from "./ai";
import {
  AppendMessageInput,
  CreateConversationInput,
  ListConversationsInput,
} from "../validators/conversation.validator";

function toObjectIds(ids?: string[]) {
  return ids?.map((id) => new Types.ObjectId(id));
}

async function getRecentMemoriesForUser(userId: string, limit = 5) {
  const memories = await Memory.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit);

  return memories.map((memory) => ({
    id: memory._id.toString(),
    title: memory.title,
    richTextContent: memory.richTextContent,
    mood: memory.mood,
    tags: memory.tags,
    createdAt: memory.createdAt,
  }));
}

export async function createConversation(
  userId: string,
  input: CreateConversationInput,
) {
  return Conversation.create({
    userId,
    title: input.title,
    metadata: input.metadata
      ? {
          relatedMemoryIds: toObjectIds(input.metadata.relatedMemoryIds),
          insightIds: toObjectIds(input.metadata.insightIds),
        }
      : undefined,
    messages: [],
  });
}

export async function listConversations(
  userId: string,
  input: ListConversationsInput,
) {
  const skip = (input.page - 1) * input.limit;

  return Conversation.find({ userId })
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(input.limit);
}

export async function getConversationById(
  userId: string,
  conversationId: string,
) {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    userId,
  });

  if (!conversation) {
    throw new AppError(404, "Conversation not found");
  }

  return conversation;
}

export async function deleteConversation(
  userId: string,
  conversationId: string,
) {
  const conversation = await Conversation.findOneAndDelete({
    _id: conversationId,
    userId,
  });

  if (!conversation) {
    throw new AppError(404, "Conversation not found");
  }

  return { success: true as const };
}

export async function appendMessage(
  userId: string,
  conversationId: string,
  input: AppendMessageInput,
) {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    userId,
  });

  if (!conversation) {
    throw new AppError(404, "Conversation not found");
  }

  const userMessage = {
    role: "user" as const,
    content: input.content,
    createdAt: new Date(),
  };

  conversation.messages.push(userMessage);

  const recentMemories = await getRecentMemoriesForUser(userId);
  const ai = getAiService();
  const reply = await ai.generateChatReply({
    userMessage: input.content,
    recentMemories,
    conversationTitle: conversation.title,
  });

  const assistantMessage = {
    role: "assistant" as const,
    content: reply.content,
    createdAt: new Date(),
  };

  conversation.messages.push(assistantMessage);

  if (!conversation.title && conversation.messages.length === 2) {
    conversation.title = input.content.slice(0, 80);
  }

  if (!conversation.metadata?.relatedMemoryIds?.length && recentMemories.length > 0) {
    conversation.metadata = {
      ...conversation.metadata,
      relatedMemoryIds: recentMemories.map(
        (memory) => new Types.ObjectId(memory.id),
      ),
    };
  }

  await conversation.save();
  return conversation;
}
