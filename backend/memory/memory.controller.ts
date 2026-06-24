import { Response } from "express";
import { AuthRequest } from "../types/express";
import { asyncHandler } from "../utils/async-handler";
import {
  createMemory,
  listMemories,
  searchMemories,
  findRelevantMemories,
  getMemoryById,
  updateMemory,
  deleteMemory,
} from "../services/memory.service";
import {
  CreateMemoryInput,
  ListMemoriesInput,
  SearchMemoriesInput,
  RelevantMemoriesInput,
  UpdateMemoryInput,
} from "../validators/memory.validator";

export const createMemoryHandler = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const memory = await createMemory(
      req.userId!,
      req.validatedBody as CreateMemoryInput,
    );
    res.status(201).json(memory);
  },
);

export const getMemories = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const memories = await listMemories(
      req.userId!,
      req.validatedQuery as ListMemoriesInput,
    );
    res.json(memories);
  },
);

export const searchMemoriesHandler = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const memories = await searchMemories(
      req.userId!,
      req.validatedQuery as SearchMemoriesInput,
    );
    res.json(memories);
  },
);

export const relevantMemoriesHandler = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const result = await findRelevantMemories(
      req.userId!,
      req.validatedQuery as RelevantMemoriesInput,
    );
    res.json(result);
  },
);

export const getMemory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.validatedParams as { id: string };
  const memory = await getMemoryById(req.userId!, id);
  res.json(memory);
});

export const updateMemoryHandler = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.validatedParams as { id: string };
    const memory = await updateMemory(
      req.userId!,
      id,
      req.validatedBody as UpdateMemoryInput,
    );
    res.json(memory);
  },
);

export const deleteMemoryHandler = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.validatedParams as { id: string };
    const result = await deleteMemory(req.userId!, id);
    res.json(result);
  },
);
