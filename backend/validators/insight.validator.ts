import { z } from "zod";

export const listInsightsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const generateInsightsSchema = z.object({
  lookbackDays: z.coerce.number().int().min(1).max(90).default(7),
  minMemories: z.coerce.number().int().min(1).max(50).default(2),
});

export const insightIdSchema = z.object({
  id: z.string().min(1, "Insight id is required"),
});

export type ListInsightsInput = z.infer<typeof listInsightsSchema>;
export type GenerateInsightsInput = z.infer<typeof generateInsightsSchema>;
