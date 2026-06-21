import { Memory } from "../memory/memory.model";
import { AppError } from "../utils/api-error";
import {
  CreateMemoryInput,
  ListMemoriesInput,
  UpdateMemoryInput,
} from "../validators/memory.validator";

export async function createMemory(userId: string, input: CreateMemoryInput) {
  return Memory.create({
    userId,
    richTextContent: input.richTextContent,
    customDateTime: input.customDateTime,
    location: input.location,
    important: input.important,
  });
}

export async function listMemories(userId: string, input: ListMemoriesInput) {
  const skip = (input.page - 1) * input.limit;

  return Memory.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(input.limit);
}

export async function getMemoryById(userId: string, memoryId: string) {
  const memory = await Memory.findOne({
    _id: memoryId,
    userId,
  });

  if (!memory) {
    throw new AppError(404, "Memory not found");
  }

  return memory;
}

export async function updateMemory(
  userId: string,
  memoryId: string,
  input: UpdateMemoryInput,
) {
  const memory = await Memory.findOne({
    _id: memoryId,
    userId,
  });

  if (!memory) {
    throw new AppError(404, "Memory not found");
  }

  const contentChanged =
    input.richTextContent !== undefined &&
    input.richTextContent !== memory.richTextContent;

  if (input.richTextContent !== undefined) {
    memory.richTextContent = input.richTextContent;
  }
  if (input.customDateTime !== undefined) {
    memory.customDateTime = input.customDateTime ?? undefined;
  }
  if (input.location !== undefined) {
    memory.location = input.location ?? undefined;
  }
  if (input.important !== undefined) {
    memory.important = input.important;
  }

  if (contentChanged) {
    memory.reflection = undefined;
    memory.embeddingId = undefined;
  }

  await memory.save();
  return memory;
}

export async function deleteMemory(userId: string, memoryId: string) {
  const memory = await Memory.findOneAndDelete({
    _id: memoryId,
    userId,
  });

  if (!memory) {
    throw new AppError(404, "Memory not found");
  }

  return { success: true as const };
}

export async function findUnprocessedMemories(limit = 10) {
  return Memory.find({
    $or: [
      { reflection: { $exists: false } },
      { "reflection.processedAt": { $exists: false } },
    ],
  })
    .sort({ createdAt: 1 })
    .limit(limit);
}
