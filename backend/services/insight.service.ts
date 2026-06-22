import { Memory } from "../memory/memory.model";
import { Insight } from "../insight/insight.model";
import { AppError } from "../utils/api-error";
import { getAiService } from "./ai";
import {
  GenerateInsightsInput,
  ListInsightsInput,
} from "../validators/insight.validator";

export async function listInsights(
  userId: string,
  input: ListInsightsInput,
) {
  const skip = (input.page - 1) * input.limit;

  return Insight.find({ userId })
    .sort({ generatedAt: -1 })
    .skip(skip)
    .limit(input.limit);
}

export async function getInsightById(userId: string, insightId: string) {
  const insight = await Insight.findOne({
    _id: insightId,
    userId,
  });

  if (!insight) {
    throw new AppError(404, "Insight not found");
  }

  return insight;
}

export async function deleteInsight(userId: string, insightId: string) {
  const insight = await Insight.findOneAndDelete({
    _id: insightId,
    userId,
  });

  if (!insight) {
    throw new AppError(404, "Insight not found");
  }

  return { success: true as const };
}

export async function generateInsights(
  userId: string,
  input: GenerateInsightsInput,
) {
  const since = new Date();
  since.setDate(since.getDate() - input.lookbackDays);

  const memories = await Memory.find({
    userId,
    createdAt: { $gte: since },
  }).sort({ createdAt: -1 });

  if (memories.length < input.minMemories) {
    throw new AppError(
      400,
      `Need at least ${input.minMemories} memories in the last ${input.lookbackDays} days to generate an insight`,
    );
  }

  const ai = getAiService();
  const generated = await ai.generateInsight({
    lookbackDays: input.lookbackDays,
    memories: memories.map((memory) => ({
      id: memory._id.toString(),
      title: memory.title,
      richTextContent: memory.richTextContent,
      mood: memory.mood,
      tags: memory.tags,
      reflectionSummary: memory.reflection?.summary,
      themes: memory.reflection?.themes,
      emotions: memory.reflection?.emotions,
      createdAt: memory.createdAt,
    })),
  });

  const insight = await Insight.create({
    userId,
    title: generated.title,
    content: generated.content,
    sourceMemoryIds: memories.map((memory) => memory._id),
    generatedAt: new Date(),
  });

  return insight;
}
