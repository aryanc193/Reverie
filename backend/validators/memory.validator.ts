import { z } from "zod";

const locationSchema = z
  .object({
    lat: z.number().optional(),
    lng: z.number().optional(),
    label: z.string().optional(),
  })
  .optional();

export const createMemorySchema = z.object({
  richTextContent: z.string().min(1, "Content is required"),
  customDateTime: z.coerce.date().optional(),
  location: locationSchema,
  important: z.boolean().optional(),
});

export const updateMemorySchema = z
  .object({
    richTextContent: z.string().min(1).optional(),
    customDateTime: z.coerce.date().nullable().optional(),
    location: locationSchema.nullable(),
    important: z.boolean().optional(),
  })
  .refine(
    (data) =>
      data.richTextContent !== undefined ||
      data.customDateTime !== undefined ||
      data.location !== undefined ||
      data.important !== undefined,
    { message: "At least one field must be provided" },
  );

export const listMemoriesSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const memoryIdSchema = z.object({
  id: z.string().min(1, "Memory id is required"),
});

export type CreateMemoryInput = z.infer<typeof createMemorySchema>;
export type UpdateMemoryInput = z.infer<typeof updateMemorySchema>;
export type ListMemoriesInput = z.infer<typeof listMemoriesSchema>;
