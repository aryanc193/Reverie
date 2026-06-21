import { IMemory, Memory } from "../memory/memory.model";
import { env } from "../config/env";
import { AppError } from "../utils/api-error";
import {
  CreateMemoryInput,
  ListMemoriesInput,
  SearchMemoriesInput,
  UpdateMemoryInput,
} from "../validators/memory.validator";

function buildListFilter(
  userId: string,
  input: Pick<ListMemoriesInput, "mood" | "tags" | "important">,
) {
  const filter: Record<string, unknown> = { userId };

  if (input.mood) {
    filter.mood = input.mood;
  }

  if (input.tags && input.tags.length > 0) {
    filter.tags = { $all: input.tags };
  }

  if (input.important !== undefined) {
    filter.important = input.important;
  }

  return filter;
}

function markMemoryForReprocessing(memory: IMemory) {
  memory.reflection = undefined;
  memory.embeddingId = undefined;
  memory.processingStatus = "pending";
  memory.processingAttempts = 0;
  memory.lastProcessingError = undefined;
}

export function buildMemoryAnalysisText(memory: IMemory): string {
  const parts = [memory.title, memory.richTextContent].filter(Boolean);
  return parts.join("\n\n");
}

export function buildPendingMemoryQuery() {
  const staleBefore = new Date(Date.now() - env.reflectionStaleProcessingMs);

  return {
    $or: [
      {
        processingStatus: "pending",
      },
      {
        processingStatus: "failed",
        processingAttempts: { $lt: env.reflectionMaxAttempts },
      },
      {
        processingStatus: { $exists: false },
        "reflection.processedAt": { $exists: false },
      },
      {
        processingStatus: "processing",
        updatedAt: { $lt: staleBefore },
      },
    ],
  };
}

export async function createMemory(userId: string, input: CreateMemoryInput) {
  return Memory.create({
    userId,
    title: input.title,
    richTextContent: input.richTextContent,
    mood: input.mood,
    tags: input.tags ?? [],
    customDateTime: input.customDateTime,
    location: input.location,
    important: input.important,
    processingStatus: "pending",
    processingAttempts: 0,
  });
}

export async function listMemories(userId: string, input: ListMemoriesInput) {
  const skip = (input.page - 1) * input.limit;
  const filter = buildListFilter(userId, input);

  return Memory.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(input.limit);
}

export async function searchMemories(
  userId: string,
  input: SearchMemoriesInput,
) {
  const skip = (input.page - 1) * input.limit;

  return Memory.find({
    userId,
    $text: { $search: input.query },
  })
    .sort({ score: { $meta: "textScore" }, createdAt: -1 })
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

  if (input.title !== undefined) {
    memory.title = input.title ?? undefined;
  }
  if (input.richTextContent !== undefined) {
    memory.richTextContent = input.richTextContent;
  }
  if (input.mood !== undefined) {
    memory.mood = input.mood ?? undefined;
  }
  if (input.tags !== undefined) {
    memory.tags = input.tags;
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
    markMemoryForReprocessing(memory);
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

export async function claimPendingMemory() {
  return Memory.findOneAndUpdate(
    buildPendingMemoryQuery(),
    {
      $set: {
        processingStatus: "processing",
        lastProcessingError: undefined,
      },
    },
    {
      sort: { createdAt: 1 },
      new: true,
    },
  );
}

export async function countPendingMemories() {
  return Memory.countDocuments(buildPendingMemoryQuery());
}
