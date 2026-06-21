import { z } from "zod";

const moodSchema = z.enum(["great", "good", "neutral", "low", "bad"]);

const locationSchema = z
  .object({
    lat: z.number().optional(),
    lng: z.number().optional(),
    label: z.string().optional(),
  })
  .optional();

const tagsSchema = z
  .array(z.string().trim().min(1))
  .max(20)
  .optional();

function parseCommaSeparatedTags(value: unknown) {
  if (typeof value !== "string" || value.trim() === "") {
    return undefined;
  }

  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export const createMemorySchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  richTextContent: z.string().min(1, "Content is required"),
  mood: moodSchema.optional(),
  tags: tagsSchema,
  customDateTime: z.coerce.date().optional(),
  location: locationSchema,
  important: z.boolean().optional(),
});

export const updateMemorySchema = z
  .object({
    title: z.string().trim().min(1).max(200).nullable().optional(),
    richTextContent: z.string().min(1).optional(),
    mood: moodSchema.nullable().optional(),
    tags: tagsSchema,
    customDateTime: z.coerce.date().nullable().optional(),
    location: locationSchema.nullable(),
    important: z.boolean().optional(),
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.richTextContent !== undefined ||
      data.mood !== undefined ||
      data.tags !== undefined ||
      data.customDateTime !== undefined ||
      data.location !== undefined ||
      data.important !== undefined,
    { message: "At least one field must be provided" },
  );

export const listMemoriesSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  mood: moodSchema.optional(),
  tags: z.preprocess(parseCommaSeparatedTags, tagsSchema),
  important: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => (value === undefined ? undefined : value === "true")),
});

export const searchMemoriesSchema = z.object({
  query: z.string().trim().min(1, "Search query is required"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const memoryIdSchema = z.object({
  id: z.string().min(1, "Memory id is required"),
});

export type CreateMemoryInput = z.infer<typeof createMemorySchema>;
export type UpdateMemoryInput = z.infer<typeof updateMemorySchema>;
export type ListMemoriesInput = z.infer<typeof listMemoriesSchema>;
export type SearchMemoriesInput = z.infer<typeof searchMemoriesSchema>;
