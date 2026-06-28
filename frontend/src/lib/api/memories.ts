import { apiFetch } from "./client";

export interface Memory {
  _id: string;
  userId: string;
  title?: string;
  richTextContent: string;
  mood?: string;
  tags?: string[];
  processingStatus?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMemoryInput {
  title?: string;
  richTextContent: string;
  mood?: string;
  tags?: string[];
}

export interface UpdateMemoryInput {
  title?: string;
  richTextContent?: string;
  mood?: string;
  tags?: string[];
}

export function createMemory(token: string, input: CreateMemoryInput) {
  return apiFetch<Memory>("/memories/create", {
    method: "POST",
    token,
    body: JSON.stringify(input),
  });
}

export function updateMemory(token: string, memoryId: string, input: UpdateMemoryInput) {
  return apiFetch<Memory>(`/memories/${memoryId}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(input),
  });
}
